import { type ComponentProps } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { aUser } from '@shared/lib/testing/fixtures';
import { EUserGroup, EUserStatus } from '@entities/user/model';
import { UsersAdminPanel } from './users-admin-panel';

const carlos = aUser({
  id: 'user-carlos',
  fullName: 'Carlos Silva',
  email: 'carlos@example.com',
  verified: false,
  status: EUserStatus.ACTIVE,
  groups: [EUserGroup.APP_USER],
});

const camila = aUser({
  id: 'user-camila',
  fullName: 'Camila Rocha',
  email: 'camila@example.com',
  verified: true,
  status: EUserStatus.ACTIVE,
  groups: [EUserGroup.BACKOFFICE, EUserGroup.ADMIN],
});

const rafael = aUser({
  id: 'user-rafael',
  fullName: 'Rafael Gomes',
  email: 'rafael@example.com',
  verified: true,
  status: EUserStatus.BLOCKED,
  groups: [EUserGroup.APP_USER],
});

const users = [carlos, camila, rafael];

function renderPanel(
  overrides: Partial<ComponentProps<typeof UsersAdminPanel>> = {},
) {
  const onVerify = jest.fn();
  const onSaveGroups = jest.fn().mockResolvedValue(true);
  render(
    <UsersAdminPanel
      users={users}
      canAssignGroups
      sessionUserId="user-camila"
      busyId={null}
      onVerify={onVerify}
      onSaveGroups={onSaveGroups}
      {...overrides}
    />,
  );
  return { onVerify, onSaveGroups };
}

describe('UsersAdminPanel', () => {
  it('filters by name and shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    renderPanel();

    expect(screen.getByRole('list', { name: 'Usuários' })).toBeInTheDocument();
    expect(screen.getByText('Carlos Silva')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Buscar conta'), 'zzzz');

    expect(screen.queryByRole('list', { name: 'Usuários' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nenhuma conta corresponde aos filtros' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getByText('Carlos Silva')).toBeInTheDocument();
  });

  it('narrows the list from status, identity and group chips', async () => {
    const user = userEvent.setup();
    renderPanel();

    const statusFilters = screen.getByRole('group', { name: 'Filtrar por status' });
    await user.click(within(statusFilters).getByRole('button', { name: 'Bloqueadas' }));
    expect(screen.getByText('Rafael Gomes')).toBeInTheDocument();
    expect(screen.queryByText('Carlos Silva')).not.toBeInTheDocument();

    await user.click(within(statusFilters).getByRole('button', { name: 'Todos os status' }));
    const identityFilters = screen.getByRole('group', { name: 'Filtrar por identidade' });
    await user.click(within(identityFilters).getByRole('button', { name: 'Identidade pendente' }));
    expect(screen.getByText('Carlos Silva')).toBeInTheDocument();
    expect(screen.queryByText('Camila Rocha')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toda identidade' }));
    await user.click(
      within(screen.getByRole('group', { name: 'Filtrar por grupo' })).getByRole('button', {
        name: 'Admin',
      }),
    );
    expect(screen.getByText('Camila Rocha')).toBeInTheDocument();
    expect(screen.queryByText('Carlos Silva')).not.toBeInTheDocument();
  });

  it('lets a shortcut stat isolate blocked accounts', async () => {
    const user = userEvent.setup();
    renderPanel();

    const summary = screen.getByRole('group', { name: 'Resumo das contas' });
    await user.click(within(summary).getByRole('button', { name: /Bloqueadas/ }));

    expect(screen.getByText('Rafael Gomes')).toBeInTheDocument();
    expect(screen.queryByText('Carlos Silva')).not.toBeInTheDocument();
    expect(screen.getByText(/1 de 3 conta/)).toBeInTheDocument();
  });

  it('hides group edits from a backoffice operator and from the signed-in admin', () => {
    renderPanel({ canAssignGroups: false, sessionUserId: 'user-camila' });
    expect(screen.queryByRole('button', { name: 'Alterar grupos' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verificar identidade' })).toBeInTheDocument();
  });

  it('does not let the signed-in admin change their own groups', async () => {
    const user = userEvent.setup();
    const { onSaveGroups, onVerify } = renderPanel();

    const camilaCard = screen.getByRole('heading', { name: 'Camila Rocha' }).closest('li');
    expect(camilaCard).toBeTruthy();
    expect(within(camilaCard as HTMLElement).queryByRole('button', { name: 'Alterar grupos' })).toBeNull();
    expect(within(camilaCard as HTMLElement).getByText(/própria conta/)).toBeInTheDocument();

    const carlosCard = screen.getByRole('heading', { name: 'Carlos Silva' }).closest('li');
    await user.click(within(carlosCard as HTMLElement).getByRole('button', { name: 'Alterar grupos' }));
    await user.click(within(carlosCard as HTMLElement).getByRole('checkbox', { name: /Admin/ }));
    await user.click(within(carlosCard as HTMLElement).getByRole('button', { name: 'Salvar grupos' }));

    expect(onSaveGroups).toHaveBeenCalledWith('user-carlos', [
      EUserGroup.APP_USER,
      EUserGroup.ADMIN,
    ]);

    await user.click(within(carlosCard as HTMLElement).getByRole('button', { name: 'Verificar identidade' }));
    expect(onVerify).toHaveBeenCalledWith('user-carlos');
  });

  it('does not invent a reactivation action for a blocked account', () => {
    renderPanel();
    expect(screen.queryByRole('button', { name: /reativ/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Conta bloqueada/)).toBeInTheDocument();
  });
});
