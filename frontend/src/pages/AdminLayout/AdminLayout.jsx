import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../utils/roles.js';
import './AdminLayout.css';

const SECCIONES = [
    { to: '/admin/pedidos', label: 'Pedidos' },
    { to: '/admin/productos', label: 'Productos' },
    { to: '/admin/combos', label: 'Combos', soloAdmin: true },
    { to: '/admin/categorias', label: 'Categorías', soloAdmin: true }
];

export default function AdminLayout() {
    const { usuario } = useAuth();
    const esAdmin = usuario.rol === ROLES.ADMINISTRADOR;

    return (
        <div className="container section admin">
            <div className="page__header">
                <h1 className="page__title">Panel {esAdmin ? 'de administración' : 'del local'}</h1>
            </div>
            <nav className="admin-tabs" aria-label="Secciones del panel">
                {SECCIONES.filter(({ soloAdmin }) => esAdmin || !soloAdmin).map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `admin-tabs__tab ${isActive ? 'admin-tabs__tab--active' : ''}`}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
            <Outlet />
        </div>
    );
}
