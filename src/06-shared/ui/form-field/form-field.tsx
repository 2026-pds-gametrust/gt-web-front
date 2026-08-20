import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: ReactElement;
};

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
    control = cloneElement(children as ReactElement<Record<string, unknown>>, {
      id,
      'aria-describedby': describedBy,
      'aria-invalid': invalid || undefined,
      className: [
        (children.props as { className?: string }).className,
        invalid ? 'form-field__control--invalid' : '',
      ]
        .filter(Boolean)
        .join(' '),
    });
  }

  return (
    <div className={`form-field${invalid ? ' form-field--invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="form-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
