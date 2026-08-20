import type { FeedbackVariant } from '@shared/ui/feedback-banner/feedback-banner';
import type { AuthAction } from './auth-error-copy';

export type AuthFeedbackPresentation = {
  variant: FeedbackVariant;
  title: string;
  message: string;
};

export function presentAuthError(message: string, action: AuthAction): AuthFeedbackPresentation {
  if (message.includes('Sem conexão')) {
    return {
      variant: 'error',
      title: 'Sem conexão',
      message,
    };
  }

  if (message.includes('Muitas tentativas')) {
    return {
      variant: 'warning',
      title: 'Aguarde um momento',
      message,
    };
  }

  if (message.includes('idade mínima')) {
    return {
      variant: 'error',
      title: 'Idade mínima',
      message,
    };
  }

  if (action === 'login' && message.includes('E-mail ou senha inválidos')) {
    return {
      variant: 'error',
      title: 'Não foi possível entrar',
      message,
    };
  }

  if (action === 'register' && message.includes('Não foi possível criar a conta')) {
    return {
      variant: 'error',
      title: 'Não foi possível criar a conta',
      message: `${message} Revise nome, e-mail, telefone, CPF, data de nascimento e senha.`,
    };
  }

  if (message.includes('Dados inválidos')) {
    return {
      variant: 'error',
      title: 'Revise os dados',
      message,
    };
  }

  return {
    variant: 'error',
    title: 'Algo deu errado',
    message,
  };
}
