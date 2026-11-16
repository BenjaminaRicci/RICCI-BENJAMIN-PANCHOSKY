import './FormField.css';

export default function RadioGroup({ name, legend, options, value, onChange, error, required = false }) {
    const errorId = error ? `${name}-error` : undefined;

    return (
        <fieldset
            className={`form-field radio-group ${error ? 'form-field--invalid' : ''}`}
            aria-describedby={errorId}
        >
            <legend className="form-field__label">
                {legend}
                {required && <span className="form-field__required" aria-hidden="true"> *</span>}
            </legend>
            <div className="radio-group__options">
                {options.map((option) => {
                    const optionId = `${name}-${option.value}`;
                    return (
                        <label key={option.value} htmlFor={optionId} className="radio-group__option">
                            <input
                                id={optionId}
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={onChange}
                                aria-invalid={error ? 'true' : undefined}
                            />
                            <span>{option.label}</span>
                        </label>
                    );
                })}
            </div>
            {error && (
                <p id={errorId} className="form-field__error">
                    {error}
                </p>
            )}
        </fieldset>
    );
}
