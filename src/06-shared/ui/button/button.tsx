import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'ghostOnDark';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: '',
  ghost: 'gt-button--ghost',
  ghostOnDark: 'gt-button--ghost-on-dark',
};

export function Button({
  children,
  type = 'button',
  className = '',
  variant = 'primary',
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = ['gt-button', VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading ? (
        <>
          <span className="gt-button__spinner" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
