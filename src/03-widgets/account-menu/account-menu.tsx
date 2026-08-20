import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { cn } from '@shared/lib/cn';

type AccountLink = {
  to: string;
  label: string;
};

const ACCOUNT_LINKS: AccountLink[] = [
  { to: '/perfil', label: 'Perfil' },
  { to: '/meus-anuncios', label: 'Meus anúncios' },
  { to: '/mensagens', label: 'Mensagens' },
  { to: '/compras', label: 'Compras e vendas' },
  { to: '/em-breve/notificacoes', label: 'Notificações' },
];

const OPERATOR_LINKS: AccountLink[] = [
  { to: '/moderacao', label: 'Moderação' },
  { to: '/admin/catalogo', label: 'Catálogo' },
  { to: '/admin/usuarios', label: 'Usuários' },
];

function firstNameOf(fullName: string): string {
  const [first] = fullName.trim().split(/\s+/);
  return first || fullName;
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-[0.45rem] w-[0.7rem] shrink-0 transition-transform duration-150', className)}
      viewBox="0 0 12 8"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.5 1.5 6 6l4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const menuItemClass = cn(
  'flex min-h-11 w-full cursor-pointer items-center border-0 bg-transparent px-4 text-left font-semibold text-ink no-underline focus-ring',
  'hover:bg-surface-muted focus-visible:bg-surface-muted',
);

export function AccountMenu() {
  const navigate = useNavigate();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const canOperate = useAuthStore((s) => s.canOperate());

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <div className="flex min-h-11 flex-col justify-center px-3 py-[0.15rem]">
        <p className="m-0 text-xs leading-[1.2] font-medium text-header-text/72">Olá</p>
        <p className="m-0 text-[0.9rem] leading-[1.3] font-bold whitespace-nowrap text-white">
          <Link className="text-inherit focus-ring hover:text-accent" to="/entrar">
            Entre
          </Link>
          <span aria-hidden="true"> · </span>
          <Link className="text-inherit focus-ring hover:text-accent" to="/criar-conta">
            Criar conta
          </Link>
        </p>
      </div>
    );
  }

  const firstName = firstNameOf(user.fullName);

  async function onLogout() {
    setOpen(false);
    await logout();
    navigate('/', { replace: true });
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={cn(
          'flex min-h-11 min-w-11 cursor-pointer flex-col items-start justify-center rounded border-0 bg-transparent px-3 py-[0.15rem] text-left text-header focus-ring',
          'hover:bg-white/8',
          open && 'bg-white/8',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="m-0 text-xs leading-[1.2] font-medium text-header-text/72">Olá,</span>
        <span className="inline-flex max-w-[14ch] items-center gap-[0.35rem] text-[0.95rem] leading-[1.2] font-bold text-white">
          <span className="truncate">{firstName}</span>
          <Chevron className={open ? 'rotate-180' : undefined} />
        </span>
      </button>

      {open ? (
        <div
          className="absolute top-[calc(100%+6px)] right-0 z-30 flex min-w-[14.5rem] animate-feedback-enter flex-col rounded border border-border bg-surface py-2 shadow-lift"
          id={menuId}
          role="menu"
          aria-label="Conta"
        >
          <div className="flex flex-col" role="group" aria-label="Sua conta">
            {ACCOUNT_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                className={menuItemClass}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {canOperate ? (
            <>
              <div className="my-2 h-px bg-border" role="separator" />
              <p
                className="mt-1 mb-0 px-4 pt-2 pb-1 text-[0.72rem] font-bold tracking-[0.06em] text-muted uppercase"
                id={`${menuId}-ops`}
              >
                Operação
              </p>
              <div className="flex flex-col" role="group" aria-labelledby={`${menuId}-ops`}>
                {OPERATOR_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    className={menuItemClass}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <div className="my-2 h-px bg-border" role="separator" />
          <button
            type="button"
            className={cn(menuItemClass, 'text-danger')}
            role="menuitem"
            onClick={() => void onLogout()}
          >
            Sair
          </button>
        </div>
      ) : null}
    </div>
  );
}
