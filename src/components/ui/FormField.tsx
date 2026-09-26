import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

const inputClasses =
  'w-full rounded-xl border border-[var(--color-ink)]/12 bg-white px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-text-gray)]/60 transition-colors focus-ring focus:border-[var(--color-orange)]'

interface FieldWrapperProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  htmlFor: string
}

function FieldWrapper({ label, required, error, children, htmlFor }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[var(--color-ink)]">
        {label} {required && <span className="text-[var(--color-orange)]">*</span>}
      </label>
      {children}
      {error && (
        <span role="alert" className="text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  )
}

type TextFieldProps = Omit<FieldWrapperProps, 'children'> & InputHTMLAttributes<HTMLInputElement>
export function TextField({ label, required, error, htmlFor, ...rest }: TextFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={htmlFor}>
      <input
        id={htmlFor}
        className={inputClasses}
        aria-invalid={!!error}
        aria-required={required}
        {...rest}
      />
    </FieldWrapper>
  )
}

type TextAreaFieldProps = Omit<FieldWrapperProps, 'children'> & TextareaHTMLAttributes<HTMLTextAreaElement>
export function TextAreaField({ label, required, error, htmlFor, ...rest }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={htmlFor}>
      <textarea
        id={htmlFor}
        rows={5}
        className={`${inputClasses} resize-none`}
        aria-invalid={!!error}
        aria-required={required}
        {...rest}
      />
    </FieldWrapper>
  )
}

type SelectFieldProps = Omit<FieldWrapperProps, 'children'> &
  SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }
export function SelectField({ label, required, error, htmlFor, options, ...rest }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={htmlFor}>
      <select id={htmlFor} className={inputClasses} aria-invalid={!!error} aria-required={required} {...rest}>
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}
