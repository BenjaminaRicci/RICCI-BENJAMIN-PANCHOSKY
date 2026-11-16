import './FormField.css';

export default function CheckboxField({ id, label, hint, ...props }) {
    const hintId = hint ? `${id}-hint` : undefined;

    return (
        <div className="form-field form-field--checkbox">
            <input id={id} type="checkbox" className="form-field__checkbox" aria-describedby={hintId} {...props} />
            <label htmlFor={id} className="form-field__label">
                {label}
            </label>
            {hint && (
                <p id={hintId} className="form-field__hint">
                    {hint}
                </p>
            )}
        </div>
    );
}
