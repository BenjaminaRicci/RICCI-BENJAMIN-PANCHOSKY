import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import { useForm } from '../../hooks/useForm.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { validateLoginForm } from '../../utils/validators.js';
import { ROLES_PERSONAL } from '../../utils/roles.js';
import './AuthPages.css';

export default function LoginPage() {
    useDocumentTitle('Ingresar');
    const { login } = useAuth();
    const notify = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const [enviando, setEnviando] = useState(false);
    const { values, errors, handleChange, handleSubmit } = useForm({ email: '', password: '' }, validateLoginForm);

    const onValid = async (datos) => {
        setEnviando(true);
        try {
            const usuario = await login({ email: datos.email.trim(), password: datos.password });
            notify.success(`¡Hola, ${usuario.nombre}!`);
            const destinoPorRol = ROLES_PERSONAL.includes(usuario.rol) ? '/admin' : '/';
            navigate(location.state?.from ?? destinoPorRol, { replace: true });
        } catch (error) {
            notify.error(error.message);
            setEnviando(false);
        }
    };

    return (
        <div className="container section auth">
            <h1 className="auth__title">Ingresar</h1>
            <form className="auth__form" onSubmit={handleSubmit(onValid)} noValidate>
                <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />
                <FormField
                    id="password"
                    name="password"
                    type="password"
                    label="Contraseña"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                <Button type="submit" block loading={enviando} loadingText="Ingresando...">
                    Ingresar
                </Button>
            </form>
            <p className="auth__alt">
                ¿No tenés cuenta?{' '}
                <Link to="/registro" state={location.state}>
                    Creá una
                </Link>
            </p>
        </div>
    );
}
