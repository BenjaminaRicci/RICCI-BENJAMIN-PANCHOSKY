import './FormField.css';

// Campo de formulario con label asociado, ayuda opcional y mensaje de error accesible.
export default function FormField({
    id,
    label,
    as: Control = 'input',
    error,
    hint,
    required = false,
    children,
    ...props
}) {
    const hintId = hint ? `${id}-hint` : null;
    const errorId = error ? `${id}-error` : null;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`form-field ${error ? 'form-field--invalid' : ''}`}>
            <label htmlFor={id} className="form-field__label">
                {label}
                {required && <span className="form-field__required" aria-hidden="true"> *</span>}
            </label>
            <Control
                id={id}
                className="form-field__control"
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={describedBy}
                aria-required={required || undefined}
                {...props}
            >
                {children}
            </Control>
            {hint && (
                <p id={hintId} className="form-field__hint">
                    {hint}
                </p>
            )}
            {error && (
                <p id={errorId} className="form-field__error">
                    {error}
                </p>
            )}
        </div>
    );
}
