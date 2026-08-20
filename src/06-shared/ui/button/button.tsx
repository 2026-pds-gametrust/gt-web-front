import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';

const buttonVariants = cva(
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded border-0 px-[1.1rem] py-[0.6rem] font-sans text-[length:inherit] font-bold tracking-[0.02em] uppercase focus-ring disabled:cursor-not-allowed disabled:opacity-55',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent-hover',
        ghost:
          'border border-border-strong bg-transparent text-ink normal-case tracking-normal hover:bg-surface-muted',
        ghostOnDark:
          'border border-header-text/35 bg-transparent text-header normal-case tracking-normal hover:bg-header-text/12',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
    loading?: boolean;
  };

export function Button({
  children,
  type = 'button',
  className,
  variant = 'primary',
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span
            className="mr-2 inline-block h-4 w-4 animate-spin-gt rounded-full border-2 border-current border-r-transparent align-[-0.15em]"
            aria-hidden="true"
          />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Shared class strings for `<Link>` / non-button CTAs that match Button variants. */
export const buttonClassName = buttonVariants;
