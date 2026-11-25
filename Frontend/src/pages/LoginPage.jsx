import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const usuario = await login(email, password);
      toast.exito(`¡Hola, ${usuario.nombre}! Iniciaste sesión correctamente.`);
      const inicio = usuario.rol === 'cliente' ? '/' : '/gestion/pedidos';
      navigate(location.state?.desde ?? inicio, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page page-narrow">
      <form className="panel form" onSubmit={enviar}>
        <h1>Iniciar sesión</h1>
        {error && <p className="alert alert-error">{error}</p>}

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="muted">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
