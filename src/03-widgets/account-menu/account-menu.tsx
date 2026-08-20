import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/model/use-auth-store';

type AccountLink = {
  to: string;
  label: string;
};

const ACCOUNT_LINKS: AccountLink[] = [
  { to: '/perfil', label: 'Perfil' },
  { to: '/meus-anuncios', label: 'Meus anúncios' },
  { to: '/em-breve/compras', label: 'Compras e vendas' },
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

function Chevron() {
  return (
    <svg className="account-menu__chevron" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
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
      <div className="account-menu account-menu--guest">
        <p className="account-menu__greeting">Olá</p>
        <p className="account-menu__guest-actions">
          <Link to="/entrar">Entre</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/criar-conta">Criar conta</Link>
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
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className="account-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="account-menu__greeting">Olá,</span>
        <span className="account-menu__who">
          <span className="account-menu__name">{firstName}</span>
          <Chevron />
        </span>
      </button>

      {open ? (
        <div className="account-menu__panel" id={menuId} role="menu" aria-label="Conta">
          <div className="account-menu__group" role="group" aria-label="Sua conta">
            {ACCOUNT_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                className="account-menu__item"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {canOperate ? (
            <>
              <div className="account-menu__divider" role="separator" />
              <p className="account-menu__section" id={`${menuId}-ops`}>
                Operação
              </p>
              <div className="account-menu__group" role="group" aria-labelledby={`${menuId}-ops`}>
                {OPERATOR_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    className="account-menu__item"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <div className="account-menu__divider" role="separator" />
          <button
            type="button"
            className="account-menu__item account-menu__item--danger"
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
