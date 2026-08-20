import { presentAuthError } from './auth-feedback-presenter';

describe('presentAuthError', () => {
  it('adds review guidance for generic register failures', () => {
    const result = presentAuthError(
      'Não foi possível criar a conta com esses dados. Revise os campos e tente de novo.',
      'register',
    );

    expect(result.title).toBe('Não foi possível criar a conta');
    expect(result.message).toContain('Revise nome, e-mail');
  });

  it('keeps login copy intact', () => {
    const result = presentAuthError('E-mail ou senha inválidos.', 'login');

    expect(result.message).toBe('E-mail ou senha inválidos.');
    expect(result.title).toBe('Não foi possível entrar');
  });
});
