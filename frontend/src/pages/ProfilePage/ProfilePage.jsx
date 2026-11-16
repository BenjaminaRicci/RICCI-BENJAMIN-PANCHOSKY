import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import { useForm } from '../../hooks/useForm.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { actualizarPerfil } from '../../services/authService.js';
import { ETIQUETAS_ROL } from '../../utils/roles.js';
import { PASSWORD_MIN, validateProfileForm } from '../../utils/validators.js';

export default function ProfilePage() {
    useDocumentTitle('Mi perfil');
    const { usuario, actualizarUsuario } = useAuth();
    const notify = useNotification();
    const [guardando, setGuardando] = useState(false);
    const { values, setValues, errors, handleChange, handleSubmit } = useForm(
        {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono: usuario.telefono ?? '',
            passwordActual: '',
            passwordNueva: '',
            repetirPassword: ''
        },
        validateProfileForm
    );

    const onValid = async ({ nombre, apellido, telefono, passwordActual, passwordNueva }) => {
        setGuardando(true);
        try {
            const datos = { nombre: nombre.trim(), apellido: apellido.trim(), telefono: telefono.trim() };
            if (passwordNueva) {
                Object.assign(datos, { passwordActual, passwordNueva });
            }
            const actualizado = await actualizarPerfil(datos);
            actualizarUsuario(actualizado);
            setValues((actuales) => ({ ...actuales, passwordActual: '', passwordNueva: '', repetirPassword: '' }));
            notify.success('Tus datos se guardaron correctamente.');
        } catch (error) {
            notify.error(error.message);
        } finally {
            setGuardando(false);
        }
    };

    const campo = (name, label, props = {}) => (
        <FormField
            id={name}
            name={name}
            label={label}
            value={values[name]}
            onChange={handleChange}
            error={errors[name]}
            {...props}
        />
    );

    return (
        <div className="container section page--narrow">
            <div className="page__header">
                <h1 className="page__title">Mi perfil</h1>
                <span className="badge badge--info">{ETIQUETAS_ROL[usuario.rol]}</span>
            </div>

            <form className="form-stack" onSubmit={handleSubmit(onValid)} noValidate>
                <p>
                    <strong>Email:</strong> {usuario.email}
                </p>
                <div className="form-row">
                    {campo('nombre', 'Nombre', { required: true, autoComplete: 'given-name' })}
                    {campo('apellido', 'Apellido', { required: true, autoComplete: 'family-name' })}
                </div>
                {campo('telefono', 'Teléfono', { required: true, type: 'tel', autoComplete: 'tel' })}

                <fieldset className="form-stack">
                    <legend className="page__subtitle">Cambiar contraseña (opcional)</legend>
                    {campo('passwordActual', 'Contraseña actual', { type: 'password', autoComplete: 'current-password' })}
                    <div className="form-row">
                        {campo('passwordNueva', 'Nueva contraseña', {
                            type: 'password',
                            autoComplete: 'new-password',
                            hint: `Mínimo ${PASSWORD_MIN} caracteres.`
                        })}
                        {campo('repetirPassword', 'Repetir nueva contraseña', { type: 'password', autoComplete: 'new-password' })}
                    </div>
                </fieldset>

                <div className="form-actions">
                    <Button type="submit" loading={guardando} loadingText="Guardando...">
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}
