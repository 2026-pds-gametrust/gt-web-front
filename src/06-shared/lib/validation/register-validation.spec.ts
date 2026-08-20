import { isValidCpf, validateRegisterField } from './register-validation';

describe('register-validation', () => {
  it('rejects invalid CPF checksum', () => {
    expect(isValidCpf('12345678901')).toBe(false);
    expect(validateRegisterField('cpf', '12345678901')).toMatch(/CPF inválido/);
  });

  it('accepts a known valid CPF', () => {
    expect(isValidCpf('11144477735')).toBe(true);
    expect(validateRegisterField('cpf', '11144477735')).toBeNull();
  });

  it('requires at least 8 characters for password', () => {
    expect(validateRegisterField('password', 'curta')).toMatch(/8 caracteres/);
    expect(validateRegisterField('password', '12345678')).toBeNull();
  });
});
