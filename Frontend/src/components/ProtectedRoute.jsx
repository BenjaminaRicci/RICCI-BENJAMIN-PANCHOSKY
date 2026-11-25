import { useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protege rutas: exige sesión y, opcionalmente, uno de los roles indicados.
export default function ProtectedRoute({ roles }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();
  const teniaSesion = useRef(false);

  if (usuario) {
    teniaSesion.current = true;
  }

  if (cargando) {
    return <p className="loading">Cargando…</p>;
  }
  if (!usuario) {
    // Si la sesión se cerró estando en la pantalla, se vuelve al menú en lugar de pedir login.
    return teniaSesion.current ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/login" replace state={{ desde: location.pathname }} />
    );
  }
  if (roles && !roles.includes(usuario.rol)) {
    return (
      <div className="page">
        <p className="alert alert-error">No tenés permisos para acceder a esta sección.</p>
      </div>
    );
  }
  return <Outlet />;
}
