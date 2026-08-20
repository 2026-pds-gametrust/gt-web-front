import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL, getSessionAccessToken } from '@shared/lib/http';
import type { IMessage } from '@entities/message/model';

const CHAT_SOCKET_PATH = '/listing-chat/socket.io';

export type MessageCreatedPayload = {
  conversationId: string;
  message: IMessage;
};

type MessageCreatedHandler = (payload: MessageCreatedPayload) => void;

let socket: Socket | null = null;
const roomRefCount = new Map<string, number>();
const messageHandlers = new Set<MessageCreatedHandler>();

function resolveSocketOrigin(): string {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return API_BASE_URL.replace(/\/+$/, '');
  }
}

function rejoinTrackedRooms(active: Socket): void {
  for (const conversationId of roomRefCount.keys()) {
    active.emit('conversation:join', { conversationId });
  }
}

function ensureSocket(): Socket | null {
  const token = getSessionAccessToken();
  if (!token) return null;

  if (socket?.connected) return socket;

  socket?.disconnect();
  socket = io(resolveSocketOrigin(), {
    path: CHAT_SOCKET_PATH,
    transports: ['websocket', 'polling'],
    auth: { token },
    autoConnect: true,
  });

  socket.on('message.created', (payload: MessageCreatedPayload) => {
    messageHandlers.forEach((handler) => handler(payload));
  });

  socket.on('connect', () => {
    if (socket) rejoinTrackedRooms(socket);
  });

  return socket;
}

export function subscribeMessageCreated(handler: MessageCreatedHandler): () => void {
  messageHandlers.add(handler);
  return () => {
    messageHandlers.delete(handler);
  };
}

export async function joinConversationRoom(conversationId: string): Promise<void> {
  const next = (roomRefCount.get(conversationId) ?? 0) + 1;
  roomRefCount.set(conversationId, next);

  const active = ensureSocket();
  if (!active) return;

  const emitJoin = () => {
    if (roomRefCount.get(conversationId)) {
      active.emit('conversation:join', { conversationId });
    }
  };

  if (next > 1 && active.connected) return;

  await new Promise<void>((resolve, reject) => {
    const onConnect = () => {
      active.off('connect_error', onError);
      emitJoin();
      resolve();
    };
    const onError = () => {
      active.off('connect', onConnect);
      reject(new Error('CHAT_SOCKET_CONNECT_FAILED'));
    };

    if (active.connected) {
      emitJoin();
      resolve();
      return;
    }

    active.once('connect', onConnect);
    active.once('connect_error', onError);
  });
}

export function leaveConversationRoom(conversationId: string): void {
  const current = roomRefCount.get(conversationId) ?? 0;
  if (current <= 1) {
    roomRefCount.delete(conversationId);
    socket?.emit('conversation:leave', { conversationId });
    return;
  }
  roomRefCount.set(conversationId, current - 1);
}

export function disconnectChatSocket(): void {
  for (const conversationId of roomRefCount.keys()) {
    socket?.emit('conversation:leave', { conversationId });
  }
  roomRefCount.clear();
  socket?.disconnect();
  socket = null;
}
