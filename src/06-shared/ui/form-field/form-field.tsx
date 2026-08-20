import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: ReactElement;
};

const controlClass =
  'min-h-11 rounded border border-border-strong bg-surface px-3 py-2 transition-[border-color,box-shadow] duration-150 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const invalid = Boolean(error);

  let control: ReactNode = children;
  if (isValidElement(children)) {
    const childProps = children.props as { className?: string };
    control = cloneElement(children as ReactElement<Record<string, unknown>>, {
      id,
      'aria-describedby': describedBy,
      'aria-invalid': invalid || undefined,
      className: cn(controlClass, invalid && 'border-danger', childProps.className),
    });
  }

  return (
    <div className={cn('mb-4 flex flex-col gap-2', invalid && 'animate-shake')}>
      <label htmlFor={id} className="text-[0.925rem] font-semibold">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className="m-0 text-[0.85rem] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="m-0 text-[0.875rem] font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
