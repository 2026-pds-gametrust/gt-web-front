import { render, screen } from '@testing-library/react';
import { FormField } from './form-field';

describe('FormField', () => {
  it('associates label, hint and error with the control', () => {
    render(
      <FormField
        id="email"
        label="E-mail"
        hint="Use seu e-mail principal."
        error="Informe um e-mail válido."
        required
      >
        <input type="email" defaultValue="" />
      </FormField>,
    );

    const input = screen.getByLabelText(/E-mail/);
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-hint email-error');
    expect(screen.getByText('Use seu e-mail principal.')).toHaveAttribute('id', 'email-hint');
    expect(screen.getByRole('alert')).toHaveTextContent('Informe um e-mail válido.');
  });
});

describe('FormField interaction', () => {
  it('renders without error state when valid', () => {
    render(
      <FormField id="name" label="Nome">
        <input defaultValue="Carlos" />
      </FormField>,
    );

    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid');
  });
});
