import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UsersAdminPage } from './users-admin-page';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { aUser } from '@shared/lib/testing/fixtures';
import { EUserGroup } from '@entities/user/model';
import { clearSession } from '@shared/lib/http';
import { identityApi } from '@features/identity/api/identity-api';

jest.mock('@features/identity/api/identity-api', () => ({
  identityApi: {
    listUsers: jest.fn(),
    verifyUser: jest.fn(),
    updateUserGroups: jest.fn(),
  },
}));

const listUsers = identityApi.listUsers as jest.MockedFunction<typeof identityApi.listUsers>;

function renderPage() {
  return render(
    <MemoryRouter>
      <UsersAdminPage />
    </MemoryRouter>,
  );
}

describe('UsersAdminPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSession();
    listUsers.mockReset();
    listUsers.mockResolvedValue([
      aUser({ fullName: 'Carlos Silva', verified: false }),
      aUser({
        id: 'user-camila-1',
        fullName: 'Camila Rocha',
        email: 'camila@example.com',
        verified: true,
        groups: [EUserGroup.BACKOFFICE],
      }),
    ]);
  });

  it('lists accounts for a backoffice operator without offering group edits', async () => {
    useAuthStore.setState({
      user: aUser({
        id: 'user-camila-1',
        fullName: 'Camila Rocha',
        groups: [EUserGroup.BACKOFFICE],
      }),
      status: 'authenticated',
      error: null,
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
    expect(await screen.findByRole('list', { name: 'Usuários' })).toBeInTheDocument();
    expect(screen.getByText('Carlos Silva')).toBeInTheDocument();
    expect(screen.getByText(/Sua conta não está no grupo admin/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Alterar grupos' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verificar identidade' })).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar conta')).toBeInTheDocument();
  });
});
