import { useState } from 'react';

// Maneja valores, errores y envío de un formulario controlado con validación al enviar.
export function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setValues((actuales) => ({ ...actuales, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors((actuales) => ({ ...actuales, [name]: undefined }));
        }
    };

    const handleSubmit = (onValid) => (event) => {
        event.preventDefault();
        const nuevosErrores = validate(values);
        setErrors(nuevosErrores);

        const primerError = Object.keys(nuevosErrores).find((campo) => nuevosErrores[campo]);
        if (primerError) {
            event.currentTarget.querySelector(`[name="${primerError}"]`)?.focus();
            return;
        }
        onValid(values);
    };

    return { values, setValues, errors, setErrors, handleChange, handleSubmit };
}
