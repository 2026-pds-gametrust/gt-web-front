import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../login-page';
import { RegisterPage } from '../register-page';
import { RegisterSuccessPage } from '../register-success-page';
import { RequireAuth } from '@app/providers/require-auth';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { clearSession, getSession } from '@shared/lib/http';
import { installHttpStub, type IHttpStub } from '@shared/lib/testing/http-stub';
import { aSession, aUser } from '@shared/lib/testing/fixtures';
import { EUserGroup } from '@entities/user/model';

let stub: IHttpStub;

const VALID_CPF = '11144477735';

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<h1>Início</h1>} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/criar-conta" element={<RegisterPage />} />
        <Route path="/criar-conta/sucesso" element={<RegisterSuccessPage />} />
        <Route path="/perfil" element={<h1>Perfil</h1>} />
        <Route
          path="/favoritos"
          element={
            <RequireAuth>
              <h1>Favoritos</h1>
            </RequireAuth>
          }
        />
        <Route
          path="/moderacao"
          element={
            <RequireAuth requireOperator>
              <h1>Moderação</h1>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

function signInAs(...groups: EUserGroup[]) {
  useAuthStore.setState({
    user: aUser({ groups }),
    status: 'authenticated',
    error: null,
  });
}

describe('auth pages', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSession();
    useAuthStore.setState({ user: null, status: 'idle', error: null });
    stub = installHttpStub();
  });

  afterEach(() => {
    stub.restore();
  });

  it('signs in and persists the session', async () => {
    stub.setRoutes({ 'POST /auth/login': [200, aSession()] });
    const user = userEvent.setup();
    renderApp('/entrar');

    await user.type(screen.getByLabelText(/^E-mail/), 'carlos@example.com');
    await user.type(screen.getByLabelText(/^Senha/), 'uma-senha-forte');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('heading', { name: 'Início' })).toBeInTheDocument();
    expect(getSession()?.userId).toBe('user-carlos-1');
  });

  it('shows the generic copy on a bad password and keeps the user on the form', async () => {
    stub.setRoutes({
      'POST /auth/login': [
        401,
        { error: 'Invalid credentials', code: 'AUTH_INVALID_CREDENTIALS' },
      ],
    });
    const user = userEvent.setup();
    renderApp('/entrar');

    await user.type(screen.getByLabelText(/^E-mail/), 'carlos@example.com');
    await user.type(screen.getByLabelText(/^Senha/), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('E-mail ou senha inválidos.');
    expect(alert).not.toHaveTextContent(/senha incorreta|não cadastrado/i);
    expect(getSession()).toBeNull();
  });

  it('registers a new member and lands on the success screen', async () => {
    stub.setRoutes({ 'POST /auth/register': [201, aSession()] });
    const user = userEvent.setup();
    renderApp('/criar-conta');

    await user.type(screen.getByLabelText(/^Nome completo/), 'Carlos Silva');
    await user.type(screen.getByLabelText(/^E-mail/), 'carlos@example.com');
    await user.type(screen.getByLabelText(/^Telefone/), '11999999999');
    await user.type(screen.getByLabelText(/^CPF/), VALID_CPF);
    await user.type(screen.getByLabelText(/^Data de nascimento/), '1990-05-12');
    await user.type(screen.getByLabelText(/^Senha/), 'uma-senha-forte');

    expect(screen.getByLabelText(/^Telefone/)).toHaveValue('(11) 99999-9999');
    expect(screen.getByLabelText(/^CPF/)).toHaveValue('111.444.777-35');

    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText(/Conta criada, Carlos!/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Completar perfil' })).toHaveAttribute(
      'href',
      '/perfil',
    );

    const body = stub.callsFor('POST /auth/register')[0]?.body as Record<string, unknown>;
    expect(body.phone).toBe('11999999999');
    expect(body.cpf).toBe(VALID_CPF);
    expect(body).not.toHaveProperty('status');
    expect(body).not.toHaveProperty('groups');
  });

  it('shows field validation before submit', async () => {
    const user = userEvent.setup();
    renderApp('/criar-conta');

    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText(/Informe seu nome completo/i)).toBeInTheDocument();
    expect(stub.callsFor('POST /auth/register')).toHaveLength(0);
  });

  it('sends an anonymous visitor to the login screen', async () => {
    useAuthStore.setState({ status: 'anonymous' });
    renderApp('/favoritos');

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('answers a non-operator with a permission screen, not a logout', async () => {
    signInAs(EUserGroup.APP_USER);
    renderApp('/moderacao');

    expect(await screen.findByRole('heading', { name: 'Sem permissão' })).toBeInTheDocument();
    expect(useAuthStore.getState().status).toBe('authenticated');
  });

  it('lets a backoffice actor through the operator gate', async () => {
    signInAs(EUserGroup.BACKOFFICE);
    renderApp('/moderacao');

    expect(await screen.findByRole('heading', { name: 'Moderação' })).toBeInTheDocument();
  });
});
