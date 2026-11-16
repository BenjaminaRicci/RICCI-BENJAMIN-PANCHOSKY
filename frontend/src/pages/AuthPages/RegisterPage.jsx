import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import { useForm } from '../../hooks/useForm.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { PASSWORD_MIN, validateRegisterForm } from '../../utils/validators.js';
import './AuthPages.css';

const VALORES_INICIALES = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    repetirPassword: ''
};

const CAMPOS = [
    { name: 'nombre', label: 'Nombre', autoComplete: 'given-name' },
    { name: 'apellido', label: 'Apellido', autoComplete: 'family-name' },
    { name: 'telefono', label: 'Teléfono', type: 'tel', autoComplete: 'tel', hint: 'Solo números, ej.: 1123456789' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    {
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        autoComplete: 'new-password',
        hint: `Mínimo ${PASSWORD_MIN} caracteres.`
    },
    { name: 'repetirPassword', label: 'Repetir contraseña', type: 'password', autoComplete: 'new-password' }
];

export default function RegisterPage() {
    useDocumentTitle('Crear cuenta');
    const { registrar } = useAuth();
    const notify = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const [enviando, setEnviando] = useState(false);
    const { values, errors, handleChange, handleSubmit } = useForm(VALORES_INICIALES, validateRegisterForm);

    const onValid = async ({ repetirPassword: _repetir, ...datos }) => {
        setEnviando(true);
        try {
            const usuario = await registrar({
                ...datos,
                nombre: datos.nombre.trim(),
                apellido: datos.apellido.trim(),
                telefono: datos.telefono.trim(),
                email: datos.email.trim()
            });
            notify.success(`¡Bienvenido/a, ${usuario.nombre}! Tu cuenta fue creada.`);
            navigate(location.state?.from ?? '/', { replace: true });
        } catch (error) {
            notify.error(error.message);
            setEnviando(false);
        }
    };

    return (
        <div className="container section auth">
            <h1 className="auth__title">Crear cuenta</h1>
            <form className="auth__form" onSubmit={handleSubmit(onValid)} noValidate>
                {CAMPOS.map(({ name, ...campo }) => (
                    <FormField
                        key={name}
                        id={name}
                        name={name}
                        value={values[name]}
                        onChange={handleChange}
                        error={errors[name]}
                        required
                        {...campo}
                    />
                ))}
                <Button type="submit" block loading={enviando} loadingText="Creando cuenta...">
                    Crear cuenta
                </Button>
            </form>
            <p className="auth__alt">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" state={location.state}>
                    Ingresá
                </Link>
            </p>
        </div>
    );
}
