import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { buttonClassName } from '@shared/ui/button/button';
import { getActorId } from '@shared/lib/http';
import { cn } from '@shared/lib/cn';
import type { IConversationSummary } from '@entities/conversation/model';
import { listingChatApi } from '@features/listing-chat/api/listing-chat-api';
import { useChatUnreadStore } from '@features/listing-chat/model/use-chat-unread-store';
import {
  applyIncomingPreview,
  avatarToneIndex,
  conversationRole,
  formatRelativeTime,
  matchesConversationQuery,
  participantInitials,
  roleLabel,
  unreadForActor,
} from '@features/listing-chat/lib/chat-presentation';
import {
  joinConversationRoom,
  leaveConversationRoom,
  subscribeMessageCreated,
} from '@features/listing-chat/lib/chat-socket-client';
import { ChatThread } from '@widgets/chat-thread/chat-thread';
import { listingsApi } from '@features/listings/api/listings-api';
import { NotFoundPage } from '@pages/error/not-found-page';

const CHIP =
  'min-h-11 rounded border border-border-strong bg-surface px-3 text-sm font-semibold focus-ring transition-[border-color,background,color] duration-150';
const CHIP_ACTIVE = 'border-accent bg-accent-soft font-bold text-accent-hover';

const AVATAR_TONES = [
  'bg-[#181818] text-[#f5f5f5]',
  'bg-[#3a140c] text-[#ffd8cc]',
  'bg-[#2a2a2a] text-[#fff1ec]',
  'bg-[#5a2414] text-white',
] as const;

const SEARCH_INPUT =
  'min-h-11 w-full rounded border border-border bg-white px-[0.85rem] py-[0.6rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

type ChatInboxProps = {
  /** When set, desktop shows list + thread; mobile shows thread only. */
  conversationId?: string;
};

type InboxFilter = 'all' | 'unread';

function InboxSkeleton() {
  return (
    <ul className="m-0 grid flex-1 list-none gap-[2px] overflow-y-auto p-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando conversas…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 p-3" aria-hidden="true">
          <span className="skeleton-shimmer h-10 w-10 rounded" />
          <span className="grid min-w-0 gap-[0.4rem]">
            <span className="skeleton-shimmer block h-[0.7rem] w-[88%]" />
            <span className="skeleton-shimmer block h-[0.7rem] w-[54%]" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function ConversationPlaceholder() {
  return (
    <section
      className="hidden min-h-0 items-center justify-center bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent_70%),var(--color-canvas)] p-8 split:flex"
      aria-label="Nenhuma conversa selecionada"
    >
      <div className="max-w-[26rem] text-center">
        <div className="mx-auto mb-6 grid max-w-[18rem] gap-2" aria-hidden="true">
          <span className="max-w-[90%] animate-fade-up justify-self-start rounded-[0.75rem_0.75rem_0.75rem_0.125rem] border border-border bg-white px-[0.9rem] py-[0.7rem] text-[0.9rem] font-semibold">
            O item ainda está disponível?
          </span>
          <span className="max-w-[90%] animate-fade-up justify-self-end rounded-[0.75rem_0.75rem_0.125rem_0.75rem] border border-[color-mix(in_srgb,var(--color-accent)_28%,var(--color-border))] bg-accent-soft px-[0.9rem] py-[0.7rem] text-[0.9rem] font-semibold [animation-delay:120ms]">
            Sim — combinamos a retirada aqui.
          </span>
        </div>
        <h2 className="mb-2 font-display text-[1.35rem]">Selecione uma conversa</h2>
        <p className="m-0 text-muted">
          O histórico fica ligado ao anúncio. Negocie na plataforma — sem telefone, e-mail ou
          links externos.
        </p>
      </div>
    </section>
  );
}

export function ChatInbox({ conversationId }: ChatInboxProps) {
  const actorId = getActorId();
  const refreshUnread = useChatUnreadStore((s) => s.refresh);
  const [items, setItems] = useState<IConversationSummary[]>([]);
  const [active, setActive] = useState<IConversationSummary | null>(null);
  const [listingTitle, setListingTitle] = useState<string | undefined>();
  const [listLoading, setListLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(Boolean(conversationId));
  const [listError, setListError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    void (async () => {
      try {
        const page = await listingChatApi.listConversations({ limit: 50 });
        if (cancelled) return;
        setItems(page.items);
        setListError(null);
        void refreshUnread();
      } catch {
        if (!cancelled) {
          setListError('Não foi possível carregar suas conversas.');
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUnread]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      void listingChatApi.listConversations({ limit: 50 }).then((page) => {
        setItems(page.items);
        void refreshUnread();
      });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshUnread]);

  const conversationIdsKey = [...items.map((item) => item.id)].sort().join(',');

  useEffect(() => {
    const ids = conversationIdsKey ? conversationIdsKey.split(',') : [];
    ids.forEach((id) => {
      void joinConversationRoom(id).catch(() => {
        // Realtime is best-effort; HTTP list remains source of truth.
      });
    });
    return () => {
      ids.forEach((id) => leaveConversationRoom(id));
    };
  }, [conversationIdsKey]);

  useEffect(() => {
    const unsubscribe = subscribeMessageCreated((payload) => {
      setItems((prev) => applyIncomingPreview(prev, payload, actorId, conversationId));
      if (payload.conversationId !== conversationId) {
        void refreshUnread();
      }
    });
    return unsubscribe;
  }, [actorId, conversationId, refreshUnread]);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    void listingChatApi.markRead(conversationId).then(() => {
      if (cancelled) return;
      setItems((prev) =>
        prev.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                buyerUnreadCount: actorId === item.buyerId ? 0 : item.buyerUnreadCount,
                sellerUnreadCount: actorId === item.sellerId ? 0 : item.sellerUnreadCount,
              }
            : item,
        ),
      );
      void refreshUnread();
    });
    return () => {
      cancelled = true;
    };
  }, [conversationId, actorId, refreshUnread]);

  useEffect(() => {
    if (!conversationId) {
      setActive(null);
      setListingTitle(undefined);
      setThreadLoading(false);
      setMissing(false);
      return;
    }

    const fromList = items.find((item) => item.id === conversationId);
    if (fromList) {
      setActive(fromList);
      setListingTitle(fromList.listing.title);
      setMissing(false);
      setThreadLoading(false);
      return;
    }

    if (listLoading) {
      setThreadLoading(true);
      return;
    }

    let cancelled = false;
    setThreadLoading(true);
    void (async () => {
      try {
        const detail = await listingChatApi.getConversation(conversationId);
        if (cancelled) return;
        if (!detail) {
          setMissing(true);
          setThreadLoading(false);
          return;
        }

        const listing = await listingsApi.getListing(detail.listingId).catch(() => null);
        const title = listing?.title ?? 'Anúncio';
        const summary: IConversationSummary = {
          ...detail,
          listing: { id: detail.listingId, title },
          otherParticipant: {
            userId: actorId === detail.buyerId ? detail.sellerId : detail.buyerId,
          },
        };
        setActive(summary);
        setListingTitle(title);
        setMissing(false);
      } catch {
        if (!cancelled) setMissing(true);
      } finally {
        if (!cancelled) setThreadLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, items, actorId, listLoading]);

  const unreadTotal = useMemo(
    () => items.reduce((sum, item) => sum + unreadForActor(item, actorId), 0),
    [items, actorId],
  );

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'unread' && unreadForActor(item, actorId) === 0) return false;
      return matchesConversationQuery(item, query);
    });
  }, [items, filter, query, actorId]);

  if (conversationId && missing && !threadLoading && !listLoading) {
    return <NotFoundPage />;
  }

  const showThreadPane = Boolean(conversationId);

  return (
    <div className="grid min-h-0 w-full flex-1 grid-cols-1 border-t border-border bg-surface split:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
      <aside
        className={cn(
          'flex min-h-0 min-w-0 flex-col bg-surface split:border-r split:border-border',
          showThreadPane && 'max-split:hidden',
        )}
        aria-labelledby="conversations-heading"
      >
        <header className="shrink-0 border-b border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-accent)_8%,#fff)_0%,#fff_64%)] px-4 pt-6 pb-3">
          <div className="flex items-baseline justify-between gap-3">
            <h1
              id="conversations-heading"
              className="m-0 font-display text-[1.65rem] font-extrabold tracking-[-0.03em]"
            >
              Mensagens
            </h1>
            {unreadTotal > 0 ? (
              <span className="text-[0.8rem] font-bold text-accent-hover">{unreadTotal} não lidas</span>
            ) : null}
          </div>
          <p className="mt-1 mb-3 text-[0.95rem] text-muted">
            Histórico por anúncio — negocie na plataforma.
          </p>

          <label className="mb-3 block">
            <span className="sr-only">Filtrar conversas</span>
            <input
              type="search"
              className={SEARCH_INPUT}
              placeholder="Buscar por anúncio, pessoa ou trecho"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar mensagens">
            <button
              type="button"
              className={cn(CHIP, filter === 'all' && CHIP_ACTIVE)}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              type="button"
              className={cn(CHIP, filter === 'unread' && CHIP_ACTIVE)}
              aria-pressed={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              Não lidas{unreadTotal > 0 ? ` (${unreadTotal})` : ''}
            </button>
          </div>
        </header>

        {listLoading ? <InboxSkeleton /> : null}
        {listError ? (
          <FeedbackBanner variant="error" title="Mensagens" message={listError} />
        ) : null}

        {!listLoading && !listError && items.length === 0 ? (
          <EmptyState
            title="Nenhuma conversa ainda"
            action={
              <Link className={buttonClassName()} to="/buscar">
                Buscar anúncios
              </Link>
            }
          >
            Abra um chat a partir de um anúncio publicado para tirar dúvidas com o vendedor.
          </EmptyState>
        ) : null}

        {!listLoading && !listError && items.length > 0 && visibleItems.length === 0 ? (
          <EmptyState title={filter === 'unread' ? 'Nada não lido' : 'Nenhuma conversa encontrada'}>
            {filter === 'unread'
              ? 'Você está em dia. Abra Todas para ver o histórico completo.'
              : 'Tente outro termo — buscamos no anúncio, no nome e na última mensagem.'}
          </EmptyState>
        ) : null}

        <ul className="m-0 grid flex-1 list-none gap-[2px] overflow-y-auto p-2">
          {visibleItems.map((item, index) => {
            const unread = unreadForActor(item, actorId);
            const otherName = item.otherParticipant.displayName ?? 'Participante';
            const isActive = item.id === conversationId;
            const role = roleLabel(conversationRole(item, actorId));
            const tone = avatarToneIndex(item.otherParticipant.userId || otherName);
            const preview = item.lastMessagePreview?.trim() || 'Sem mensagens';
            const relative = formatRelativeTime(item.lastMessageAt ?? item.createdAt, now);
            return (
              <li
                key={item.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <Link
                  to={`/mensagens/${item.id}`}
                  className={cn(
                    'grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded border border-transparent bg-transparent p-3 transition-[border-color,background,transform] duration-[180ms]',
                    'hover:border-[color-mix(in_srgb,var(--color-accent)_28%,var(--color-border))] hover:bg-accent-soft focus-ring',
                    isActive && 'border-accent bg-accent-soft',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded font-display text-[0.85rem] font-extrabold tracking-wide',
                      AVATAR_TONES[tone],
                    )}
                    aria-hidden="true"
                  >
                    {participantInitials(item.otherParticipant.displayName)}
                  </span>
                  <span className="grid min-w-0 gap-[0.15rem]">
                    <span className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          'truncate font-bold',
                          unread > 0 && 'font-extrabold text-ink',
                        )}
                      >
                        {item.listing.title}
                      </span>
                      {relative ? (
                        <time
                          className="shrink-0 text-[0.75rem] font-semibold text-muted"
                          dateTime={item.lastMessageAt}
                        >
                          {relative}
                        </time>
                      ) : null}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-[0.35rem] text-[0.8rem] text-muted">
                      <span className="font-bold text-ink">{otherName}</span>
                      {role ? (
                        <span className="rounded bg-surface-muted px-[0.4rem] py-[0.05rem] text-[0.7rem] font-bold tracking-wide uppercase">
                          {role}
                        </span>
                      ) : null}
                      {item.status === 'BLOCKED' ? (
                        <span className="rounded bg-[color-mix(in_srgb,var(--color-danger)_12%,#fff)] px-[0.4rem] py-[0.05rem] text-[0.7rem] font-bold tracking-wide text-danger uppercase">
                          Bloqueada
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        'truncate text-[0.875rem] text-muted',
                        unread > 0 && 'font-extrabold text-ink',
                      )}
                    >
                      {preview}
                    </span>
                  </span>
                  {unread > 0 ? (
                    <span
                      className="min-w-7 self-center animate-badge-pulse rounded-full bg-accent px-[0.45rem] py-[0.15rem] text-center text-[0.75rem] font-extrabold text-white"
                      aria-label={`${unread} não lidas`}
                    >
                      {unread > 99 ? '99+' : unread}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {showThreadPane ? (
        <section className="flex min-h-0 min-w-0 flex-col bg-canvas" aria-label="Conversa">
          {threadLoading ? (
            <div className="flex h-full min-h-0 flex-col" aria-busy="true">
              <span className="sr-only">Carregando conversa…</span>
              <div className="flex items-center gap-3 border-b border-border bg-white px-4 py-3">
                <span className="skeleton-shimmer h-10 w-10 rounded" aria-hidden="true" />
                <span className="grid min-w-0 flex-1 gap-[0.4rem]" aria-hidden="true">
                  <span className="skeleton-shimmer block h-[0.7rem] w-[88%]" />
                  <span className="skeleton-shimmer block h-[0.7rem] w-[54%]" />
                </span>
              </div>
              <div
                className="flex min-h-48 flex-1 flex-col gap-3 bg-canvas p-4"
                aria-hidden="true"
              >
                <span className="skeleton-shimmer block h-[3.2rem] w-[min(70%,18rem)] self-start rounded-[0.75rem]" />
                <span className="skeleton-shimmer block h-[3.2rem] w-[min(55%,14rem)] self-end rounded-[0.75rem]" />
                <span className="skeleton-shimmer block h-[3.2rem] w-[min(70%,18rem)] self-start rounded-[0.75rem]" />
              </div>
            </div>
          ) : null}
          {!threadLoading && active ? (
            <ChatThread conversation={active} listingTitle={listingTitle} />
          ) : null}
        </section>
      ) : (
        <ConversationPlaceholder />
      )}
    </div>
  );
}
