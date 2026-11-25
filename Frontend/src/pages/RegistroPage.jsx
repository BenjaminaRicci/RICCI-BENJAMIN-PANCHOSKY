import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const VACIO = { nombre: '', apellido: '', email: '', telefono: '', password: '', repetirPassword: '' };

export default function RegistroPage() {
  const { registrar } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (evento) => setForm({ ...form, [campo]: evento.target.value });

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const usuario = await registrar(form);
      toast.exito(`¡Bienvenido a Panchosky, ${usuario.nombre}! Tu cuenta fue creada.`);
      navigate(location.state?.desde ?? '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page page-narrow">
      <form className="panel form" onSubmit={enviar}>
        <h1>Crear cuenta</h1>
        {error && <p className="alert alert-error">{error}</p>}

        <div className="form-row">
          <label>
            Nombre
            <input value={form.nombre} onChange={cambiar('nombre')} required />
          </label>
          <label>
            Apellido
            <input value={form.apellido} onChange={cambiar('apellido')} required />
          </label>
        </div>
        <label>
          Email
          <input type="email" value={form.email} onChange={cambiar('email')} autoComplete="email" required />
        </label>
        <label>
          Teléfono (solo dígitos)
          <input inputMode="numeric" value={form.telefono} onChange={cambiar('telefono')} placeholder="1144445555" required />
        </label>
        <div className="form-row">
          <label>
            Contraseña (mín. 8 caracteres)
            <input type="password" value={form.password} onChange={cambiar('password')} autoComplete="new-password" required />
          </label>
          <label>
            Repetir contraseña
            <input type="password" value={form.repetirPassword} onChange={cambiar('repetirPassword')} autoComplete="new-password" required />
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Registrarme'}
        </button>
        <p className="muted">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}
