import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AccountMenu } from './account-menu';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { EUserGroup } from '@entities/user/model';
import { aUser } from '@shared/lib/testing/fixtures';
import { clearSession } from '@shared/lib/http';
import { installHttpStub, type IHttpStub } from '@shared/lib/testing/http-stub';

let stub: IHttpStub;

function renderMenu() {
  return render(
    <MemoryRouter>
      <AccountMenu />
    </MemoryRouter>,
  );
}

describe('AccountMenu', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSession();
    useAuthStore.setState({ user: null, status: 'anonymous', error: null });
    stub = installHttpStub();
  });

  afterEach(() => {
    stub.restore();
  });

  it('offers login and sign-up as text links for a visitor', () => {
    renderMenu();

    expect(screen.getByText('Olá')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entre' })).toHaveAttribute('href', '/entrar');
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute(
      'href',
      '/criar-conta',
    );
    expect(screen.queryByRole('button', { name: /Olá/ })).not.toBeInTheDocument();
  });

  it('opens an account panel with profile and seller destinations', async () => {
    useAuthStore.setState({
      user: aUser({ fullName: 'Filipe Paixão' }),
      status: 'authenticated',
      error: null,
    });
    const user = userEvent.setup();
    renderMenu();

    expect(screen.queryByText('Filipe Paixão')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Olá,\s*Filipe/i }));

    expect(screen.getByRole('menu', { name: 'Conta' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Perfil' })).toHaveAttribute('href', '/perfil');
    expect(screen.getByRole('menuitem', { name: 'Meus anúncios' })).toHaveAttribute(
      'href',
      '/meus-anuncios',
    );
    expect(screen.getByRole('menuitem', { name: 'Compras e vendas' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Notificações' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sair' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Favoritos' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Moderação' })).not.toBeInTheDocument();
  });

  it('shows backoffice destinations only for operators', async () => {
    useAuthStore.setState({
      user: aUser({
        fullName: 'Camila Souza',
        groups: [EUserGroup.APP_USER, EUserGroup.BACKOFFICE],
      }),
      status: 'authenticated',
      error: null,
    });
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: /Olá,\s*Camila/i }));

    expect(screen.getByText('Operação')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Moderação' })).toHaveAttribute(
      'href',
      '/moderacao',
    );
    expect(screen.getByRole('menuitem', { name: 'Catálogo' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Usuários' })).toBeInTheDocument();
  });

  it('logs out from the panel and leaves the session', async () => {
    stub.setRoutes({ 'POST /auth/logout': [204] });
    useAuthStore.setState({
      user: aUser(),
      status: 'authenticated',
      error: null,
    });
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: /Olá,\s*Carlos/i }));
    await user.click(screen.getByRole('menuitem', { name: 'Sair' }));

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().status).toBe('anonymous');
  });

  it('closes the panel with Escape', async () => {
    useAuthStore.setState({
      user: aUser(),
      status: 'authenticated',
      error: null,
    });
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: /Olá,\s*Carlos/i }));
    expect(screen.getByRole('menu', { name: 'Conta' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu', { name: 'Conta' })).not.toBeInTheDocument();
  });
});
