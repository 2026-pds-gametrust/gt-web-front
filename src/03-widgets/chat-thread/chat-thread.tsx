import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { getActorId } from '@shared/lib/http';
import { ApiError } from '@shared/lib/http';
import { cn } from '@shared/lib/cn';
import type { IConversationSummary } from '@entities/conversation/model';
import type { IMessage } from '@entities/message/model';
import { listingChatApi } from '@features/listing-chat/api/listing-chat-api';
import {
  joinConversationRoom,
  leaveConversationRoom,
  subscribeMessageCreated,
} from '@features/listing-chat/lib/chat-socket-client';
import {
  avatarToneIndex,
  conversationRole,
  formatClock,
  groupMessagesByDay,
  participantInitials,
  roleLabel,
} from '@features/listing-chat/lib/chat-presentation';

const AVATAR_TONES = [
  'bg-[#181818] text-[#f5f5f5]',
  'bg-[#3a140c] text-[#ffd8cc]',
  'bg-[#2a2a2a] text-[#fff1ec]',
  'bg-[#5a2414] text-white',
] as const;

type ChatThreadProps = {
  conversation: IConversationSummary;
  listingTitle?: string;
};

const NEAR_BOTTOM_PX = 96;
const COMPOSER_MAX_PX = 160;

function isNearBottom(el: HTMLDivElement): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
}

function resizeComposer(el: HTMLTextAreaElement): void {
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_PX)}px`;
}

export function ChatThread({ conversation, listingTitle }: ChatThreadProps) {
  const actorId = getActorId();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(conversation.status === 'BLOCKED');
  const [pinnedToBottom, setPinnedToBottom] = useState(true);
  const [showJump, setShowJump] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pinnedRef = useRef(true);

  const otherName = conversation.otherParticipant.displayName ?? 'Participante';
  const role = roleLabel(conversationRole(conversation, actorId));
  const tone = avatarToneIndex(conversation.otherParticipant.userId || otherName);
  const groups = groupMessagesByDay(messages);

  useEffect(() => {
    setBlocked(conversation.status === 'BLOCKED');
  }, [conversation.status]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setShowJump(false);
    pinnedRef.current = true;
    setPinnedToBottom(true);
    void (async () => {
      try {
        const page = await listingChatApi.listMessages(conversation.id, { limit: 50 });
        if (!cancelled) {
          setMessages(page.items);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível carregar o histórico.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversation.id]);

  useEffect(() => {
    void joinConversationRoom(conversation.id).catch(() => {
      // Realtime is best-effort; HTTP history remains source of truth.
    });

    const unsubscribe = subscribeMessageCreated((payload) => {
      if (payload.conversationId !== conversation.id) return;
      setMessages((prev) => {
        if (prev.some((message) => message.id === payload.message.id)) return prev;
        const fromSelf = payload.message.senderId === actorId;
        const withoutPending = fromSelf
          ? prev.filter(
              (message) =>
                !message.id.startsWith('pending-') || message.body !== payload.message.body,
            )
          : prev;
        return [...withoutPending, payload.message];
      });
      if (!pinnedRef.current && payload.message.senderId !== actorId) {
        setShowJump(true);
      }
    });

    return () => {
      unsubscribe();
      leaveConversationRoom(conversation.id);
    };
  }, [conversation.id, actorId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !pinnedRef.current) return;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  function onMessagesScroll() {
    const el = listRef.current;
    if (!el) return;
    const near = isNearBottom(el);
    pinnedRef.current = near;
    setPinnedToBottom(near);
    if (near) setShowJump(false);
  }

  function jumpToLatest() {
    const el = listRef.current;
    pinnedRef.current = true;
    setPinnedToBottom(true);
    setShowJump(false);
    if (el && typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  async function onSend(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending || !actorId) return;

    const pendingId = `pending-${Date.now()}`;
    const pending: IMessage = {
      id: pendingId,
      conversationId: conversation.id,
      senderId: actorId,
      body,
      status: 'VISIBLE',
      createdAt: new Date().toISOString(),
    };

    setSending(true);
    setError(null);
    setDraft('');
    setMessages((prev) => [...prev, pending]);
    pinnedRef.current = true;
    setPinnedToBottom(true);
    setShowJump(false);
    window.requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.focus();
      }
    });

    try {
      const message = await listingChatApi.sendMessage(conversation.id, body);
      setMessages((prev) => {
        const withoutPending = prev.filter((item) => item.id !== pendingId);
        if (withoutPending.some((item) => item.id === message.id)) return withoutPending;
        return [...withoutPending, message];
      });
    } catch (err) {
      setMessages((prev) => prev.filter((item) => item.id !== pendingId));
      setDraft(body);
      if (err instanceof ApiError && err.code === 'CHAT_CONTENT_REJECTED') {
        setError('Sua mensagem foi bloqueada: evite compartilhar telefone, e-mail ou links externos.');
      } else if (err instanceof ApiError && err.code === 'CHAT_CONVERSATION_BLOCKED') {
        setError('Esta conversa está bloqueada. Novas mensagens não podem ser enviadas.');
        setBlocked(true);
      } else {
        setError('Não foi possível enviar a mensagem.');
      }
    } finally {
      setSending(false);
    }
  }

  async function onBlock() {
    if (
      !window.confirm(
        'Bloquear este usuário? Novas mensagens serão impedidas em todas as conversas entre vocês.',
      )
    ) {
      return;
    }
    setError(null);
    try {
      await listingChatApi.blockParticipant(conversation.id);
      setBlocked(true);
    } catch {
      setError('Não foi possível bloquear o participante.');
    }
  }

  async function onReport() {
    const reason = window.prompt('Descreva o motivo da denúncia (3–500 caracteres):');
    if (!reason || reason.trim().length < 3) return;
    setError(null);
    try {
      await listingChatApi.reportConversation(conversation.id, reason.trim());
    } catch {
      setError('Não foi possível registrar a denúncia.');
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col" aria-labelledby="chat-thread-heading">
      <header
        className={cn(
          'grid items-center gap-3 border-b border-border bg-white px-4 py-3',
          'grid-cols-[auto_minmax(0,1fr)_auto] [grid-template-areas:"back_back_back"_"avatar_heading_actions"]',
          'max-split:grid-cols-[auto_minmax(0,1fr)] max-split:[grid-template-areas:"back_back"_"avatar_heading"_"actions_actions"]',
          'split:[grid-template-areas:"avatar_heading_actions"]',
        )}
      >
        <Link
          className="inline-flex min-h-11 items-center font-bold text-accent-hover [grid-area:back] before:content-['←_'] focus-ring split:hidden"
          to="/mensagens"
        >
          Conversas
        </Link>
        <span
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded font-display text-[0.85rem] font-extrabold tracking-wide [grid-area:avatar]',
            AVATAR_TONES[tone],
          )}
          aria-hidden="true"
        >
          {participantInitials(conversation.otherParticipant.displayName)}
        </span>
        <div className="min-w-0 [grid-area:heading]">
          <h2
            id="chat-thread-heading"
            className="m-0 truncate font-display text-[1.15rem]"
          >
            {listingTitle ?? conversation.listing.title}
          </h2>
          <p className="mt-[0.15rem] mb-0 text-[0.875rem] text-muted">
            <span>{otherName}</span>
            {role ? <span> · {role}</span> : null}
            {blocked ? <span> · Bloqueada</span> : null}
            {' · '}
            <Link
              to={`/anuncio/${conversation.listingId}`}
              className="font-bold text-accent-hover underline underline-offset-2"
            >
              Ver anúncio
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2 [grid-area:actions] max-split:justify-start">
          <Button type="button" variant="ghost" onClick={() => void onReport()}>
            Denunciar
          </Button>
          <Button type="button" variant="ghost" disabled={blocked} onClick={() => void onBlock()}>
            Bloquear
          </Button>
        </div>
      </header>

      {error ? <FeedbackBanner variant="error" title="Chat" message={error} /> : null}
      {blocked ? (
        <FeedbackBanner
          variant="warning"
          title="Conversa bloqueada"
          message="Novas mensagens estão desativadas nesta conversa."
        />
      ) : null}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={listRef}
          className="flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-accent)_5%,transparent),transparent_22%),var(--color-canvas)] p-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-busy={loading}
          onScroll={onMessagesScroll}
        >
          {loading ? <p className="m-auto max-w-[22rem] text-center text-muted">Carregando mensagens…</p> : null}
          {!loading && messages.length === 0 ? (
            <p className="m-auto max-w-[22rem] text-center text-muted">
              Ainda não há mensagens. Pergunte sobre o item com respeito — evite pedir contato
              externo.
            </p>
          ) : null}
          {groups.map((group) => (
            <div key={group.dayLabel} className="flex flex-col gap-3">
              <h3 className="mt-2 mb-0 flex items-center justify-center text-[0.75rem] font-bold tracking-wide text-muted uppercase">
                <span className="rounded-full border border-border bg-white px-[0.65rem] py-[0.2rem]">
                  {group.dayLabel}
                </span>
              </h3>
              {group.messages.map((message) => {
                const mine = message.senderId === actorId;
                const pending = message.id.startsWith('pending-');
                return (
                  <article
                    key={message.id}
                    className={cn(
                      'max-w-[min(85%,36rem)] animate-bubble-in px-[0.9rem] py-[0.7rem]',
                      mine
                        ? 'self-end rounded-[0.75rem_0.75rem_0.125rem_0.75rem] border border-[color-mix(in_srgb,var(--color-accent)_22%,var(--color-border))] bg-accent-soft'
                        : 'self-start rounded-[0.75rem_0.75rem_0.75rem_0.125rem] border border-border bg-white',
                      pending && 'opacity-70',
                    )}
                    aria-label={mine ? 'Sua mensagem' : 'Mensagem do outro participante'}
                  >
                    <p className="m-0 break-words whitespace-pre-wrap">{message.body}</p>
                    <time
                      className="mt-[0.35rem] block text-[0.72rem] font-semibold text-muted"
                      dateTime={message.createdAt}
                    >
                      {pending ? 'Enviando…' : formatClock(message.createdAt)}
                    </time>
                  </article>
                );
              })}
            </div>
          ))}
        </div>

        {showJump && !pinnedToBottom ? (
          <button
            type="button"
            className="absolute right-0 bottom-3 left-0 mx-auto w-max min-h-11 animate-fade-up cursor-pointer rounded-full border-0 bg-header px-[0.9rem] font-bold text-white shadow-lift focus-ring"
            onClick={jumpToLatest}
          >
            Novas mensagens
          </button>
        ) : null}
      </div>

      <form
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 border-t border-border bg-white px-4 pt-3 pb-4"
        onSubmit={(e) => void onSend(e)}
      >
        <label className="sr-only" htmlFor="chat-message-input">
          Mensagem
        </label>
        <textarea
          id="chat-message-input"
          ref={inputRef}
          className="col-start-1 row-start-1 max-h-40 min-h-11 w-full resize-none rounded border border-border bg-canvas px-[0.85rem] py-[0.7rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          rows={1}
          maxLength={2000}
          value={draft}
          disabled={blocked || sending}
          placeholder={
            blocked
              ? 'Conversa bloqueada — novas mensagens desativadas.'
              : 'Escreva sua mensagem…'
          }
          onChange={(event) => {
            setDraft(event.target.value);
            resizeComposer(event.target);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <Button
          type="submit"
          className="col-start-2 row-start-1 self-end"
          disabled={blocked || sending || draft.trim().length === 0}
        >
          {sending ? 'Enviando…' : 'Enviar'}
        </Button>
        <p className="col-span-2 m-0 text-[0.75rem] text-muted">
          Negocie só aqui — sem telefone, e-mail ou links externos.
          {draft.length > 1800 ? ` ${draft.length}/2000` : null}
        </p>
      </form>
    </section>
  );
}
