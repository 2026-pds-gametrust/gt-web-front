import { render, screen } from '@testing-library/react';
import { StatusScene } from './status-scene';

describe('StatusScene', () => {
  it('renders a 404 scene with actions', () => {
    render(
      <StatusScene
        variant="lost"
        code="404"
        meme="NO SIGNAL"
        title="Essa página saiu do inventário"
        message="O endereço não existe."
        actions={<a href="/">Voltar ao início</a>}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Essa página saiu do inventário');
    expect(screen.getAllByText('NO SIGNAL').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toBeInTheDocument();
  });
});
