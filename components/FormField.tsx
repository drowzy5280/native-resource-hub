'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, useId } from 'react'

interface BaseFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

type InputProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>

type TextareaProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>

type SelectProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & {
    children: ReactNode
  }

/**
 * Accessible form input field with error handling
 */
export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', id: propId, ...props }, ref) => {
    const generatedId = useId()
    const id = propId || generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const describedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className={`space-y-1.5 ${className}`}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text"
        >
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        {hint && (
          <p id={hintId} className="text-sm text-text-muted">
            {hint}
          </p>
        )}

        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          aria-required={required}
          className={`
            w-full px-4 py-2.5 text-text bg-white
            border rounded-earth transition-colors
            min-h-touch
            placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${error
              ? 'border-error focus:ring-error/40 focus:border-error'
              : 'border-desert/60 focus:ring-pine/40 focus:border-pine'
            }
            disabled:bg-desert/30 disabled:cursor-not-allowed
          `}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className="text-sm text-error flex items-center gap-1.5"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

/**
 * Accessible form textarea field with error handling
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = '', id: propId, ...props }, ref) => {
    const generatedId = useId()
    const id = propId || generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const describedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className={`space-y-1.5 ${className}`}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text"
        >
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        {hint && (
          <p id={hintId} className="text-sm text-text-muted">
            {hint}
          </p>
        )}

        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          aria-required={required}
          className={`
            w-full px-4 py-2.5 text-text bg-white
            border rounded-earth transition-colors
            min-h-[120px] resize-y
            placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${error
              ? 'border-error focus:ring-error/40 focus:border-error'
              : 'border-desert/60 focus:ring-pine/40 focus:border-pine'
            }
            disabled:bg-desert/30 disabled:cursor-not-allowed
          `}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className="text-sm text-error flex items-center gap-1.5"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

/**
 * Accessible form select field with error handling
 */
export const FormSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, className = '', id: propId, children, ...props }, ref) => {
    const generatedId = useId()
    const id = propId || generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const describedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className={`space-y-1.5 ${className}`}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text"
        >
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        {hint && (
          <p id={hintId} className="text-sm text-text-muted">
            {hint}
          </p>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-required={required}
            className={`
              w-full px-4 py-2.5 text-text bg-white
              border rounded-earth transition-colors
              min-h-touch appearance-none cursor-pointer
              pr-10
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${error
                ? 'border-error focus:ring-error/40 focus:border-error'
                : 'border-desert/60 focus:ring-pine/40 focus:border-pine'
              }
              disabled:bg-desert/30 disabled:cursor-not-allowed
            `}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-error flex items-center gap-1.5"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

/**
 * Accessible checkbox with label
 */
export const FormCheckbox = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', id: propId, ...props }, ref) => {
    const generatedId = useId()
    const id = propId || generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const describedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-required={required}
            className={`
              mt-1 w-5 h-5 rounded border-2 cursor-pointer
              text-pine focus:ring-pine focus:ring-offset-1
              ${error ? 'border-error' : 'border-desert/60'}
              disabled:cursor-not-allowed disabled:opacity-50
            `}
            {...props}
          />
          <label
            htmlFor={id}
            className="text-sm text-text cursor-pointer"
          >
            {label}
            {required && (
              <span className="text-error ml-1" aria-hidden="true">*</span>
            )}
          </label>
        </div>

        {hint && (
          <p id={hintId} className="text-sm text-text-muted ml-8">
            {hint}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm text-error flex items-center gap-1.5 ml-8"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormCheckbox.displayName = 'FormCheckbox'

export default FormInput
