import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackBanner } from './feedback-banner';

describe('FeedbackBanner', () => {
  it('renders success as status', () => {
    render(
      <FeedbackBanner variant="success" title="Salvo" message="Perfil atualizado." />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Salvo');
    expect(screen.getByText('Perfil atualizado.')).toBeInTheDocument();
  });

  it('renders error as alert', () => {
    render(<FeedbackBanner variant="error" title="Erro" message="Algo falhou." />);

    expect(screen.getByRole('alert')).toHaveTextContent('Erro');
  });

  it('calls onDismiss when close is clicked', async () => {
    const onDismiss = jest.fn();
    const user = userEvent.setup();

    render(
      <FeedbackBanner
        variant="warning"
        title="Aguarde"
        message="Muitas tentativas."
        onDismiss={onDismiss}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
