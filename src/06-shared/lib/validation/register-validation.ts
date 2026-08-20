import { digitsOnly } from '@shared/lib/format';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AGE = 18;

export type RegisterField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'birthDate'
  | 'password';

export function isValidCpf(value: string): boolean {
  const cpf = digitsOnly(value, 11);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(cpf[i]) * (10 - i);
  }
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number(cpf[i]) * (11 - i);
  }
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

function ageFromBirthDate(birthDate: string): number | null {
  if (!birthDate) return null;
  const born = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(born.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age -= 1;
  }
  return age;
}

export function validateRegisterField(
  field: RegisterField,
  value: string,
): string | null {
  const trimmed = value.trim();

  switch (field) {
    case 'fullName':
      if (!trimmed) return 'Informe seu nome completo.';
      if (trimmed.length < 3) return 'Informe seu nome completo.';
      return null;
    case 'email':
      if (!trimmed) return 'Informe seu e-mail.';
      if (!EMAIL_PATTERN.test(trimmed)) {
        return 'Use um e-mail válido, ex.: voce@email.com.';
      }
      return null;
    case 'phone': {
      const digits = digitsOnly(value);
      if (digits.length === 0) return 'Informe seu telefone com DDD.';
      if (digits.length !== 10 && digits.length !== 11) {
        return 'Telefone incompleto — inclua DDD e número.';
      }
      return null;
    }
    case 'cpf':
      if (digitsOnly(value).length === 0) return 'Informe seu CPF.';
      if (!isValidCpf(value)) return 'CPF inválido. Confira os 11 dígitos.';
      return null;
    case 'birthDate':
      if (!trimmed) return 'Informe sua data de nascimento.';
      {
        const age = ageFromBirthDate(trimmed);
        if (age === null) return 'Data de nascimento inválida.';
        if (age < MIN_AGE) {
          return 'É preciso ter a idade mínima para criar conta.';
        }
      }
      return null;
    case 'password':
      if (!value) return 'Informe uma senha.';
      if (value.length < 8) return 'Senha com pelo menos 8 caracteres.';
      return null;
    default:
      return null;
  }
}

export function validateRegisterForm(values: Record<RegisterField, string>): Partial<
  Record<RegisterField, string>
> {
  const errors: Partial<Record<RegisterField, string>> = {};
  (Object.keys(values) as RegisterField[]).forEach((field) => {
    const message = validateRegisterField(field, values[field]);
    if (message) errors[field] = message;
  });
  return errors;
}
