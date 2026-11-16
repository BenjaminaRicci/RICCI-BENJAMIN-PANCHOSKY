import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import Button from '../Button/Button.jsx';
import StatusMessage from '../StatusMessage/StatusMessage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ roles, children }) {
    const { usuario } = useAuth();
    const location = useLocation();

    if (!usuario) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (roles && !roles.includes(usuario.rol)) {
        return (
            <div className="container section">
                <StatusMessage
                    type="error"
                    title="Acceso restringido"
                    message="Tu cuenta no tiene permisos para ver esta página."
                >
                    <Button as={Link} to="/" size="sm">
                        Volver al inicio
                    </Button>
                </StatusMessage>
            </div>
        );
    }

    return children ?? <Outlet />;
}
