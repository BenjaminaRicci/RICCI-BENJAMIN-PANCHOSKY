import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../Button/Button.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES, ROLES_PERSONAL } from '../../utils/roles.js';
import logo from '../../assets/logo-icon.svg';
import './Header.css';

const NAV_LINKS = [
    { label: 'Menú', to: '/productos' },
    { label: 'Combos', to: '/combos' },
    { label: 'Nosotros', to: '/#nosotros' },
    { label: 'Contacto', to: '/#contacto' }
];

function linksDeUsuario(usuario) {
    if (!usuario) {
        return [
            { label: 'Ingresar', to: '/login' },
            { label: 'Crear cuenta', to: '/registro' }
        ];
    }
    const links = [{ label: 'Mi perfil', to: '/perfil' }];
    if (usuario.rol === ROLES.CLIENTE) {
        links.push({ label: 'Mis pedidos', to: '/mis-pedidos' });
    }
    if (ROLES_PERSONAL.includes(usuario.rol)) {
        links.push({ label: 'Panel', to: '/admin' });
    }
    return links;
}

export default function Header() {
    const { totalItems, openCart } = useCart();
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const userLinks = linksDeUsuario(usuario);
    const accesoRol = userLinks.find(({ to }) => to === '/mis-pedidos' || to === '/admin');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    useEffect(() => {
        if (!menuOpen) {
            return undefined;
        }
        const handleKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false);
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

    const cartLabel =
        totalItems === 0 ? 'Mi pedido, vacío' : `Mi pedido, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`;

    return (
        <header className="header">
            <div className="header__bar">
                <div className="container header__inner">
                    <Link to="/" className="header__brand">
                        <img src={logo} alt="" className="header__logo" />
                        <span>Panchosky</span>
                    </Link>

                    <nav className="header__nav" aria-label="Principal">
                        <ul className="header__links">
                            {NAV_LINKS.map(({ label, to }) => (
                                <li key={to}>
                                    <Link to={to} className="header__link">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header__actions">
                        {usuario ? (
                            <>
                                <Link to="/perfil" className="header__link header__user">
                                    Hola, {usuario.nombre}
                                </Link>
                                {accesoRol && (
                                    <Link to={accesoRol.to} className="header__link header__desktop-only">
                                        {accesoRol.label}
                                    </Link>
                                )}
                                <button type="button" className="header__link header__logout header__desktop-only" onClick={handleLogout}>
                                    Salir
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="header__link">
                                Ingresar
                            </Link>
                        )}
                        <Button variant="light" onClick={openCart} aria-label={cartLabel} className="header__cart">
                            Mi pedido
                            {totalItems > 0 && (
                                <span className="header__badge" aria-hidden="true">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                        <button
                            type="button"
                            className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
                            aria-expanded={menuOpen}
                            aria-controls="menu-desplegable"
                            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                            onClick={() => setMenuOpen((abierto) => !abierto)}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </div>

            <nav id="menu-desplegable" className="header__dropdown" aria-label="Menú desplegable" hidden={!menuOpen}>
                <ul>
                    {[...NAV_LINKS, ...userLinks].map(({ label, to }) => (
                        <li key={to}>
                            <Link to={to} className="header__dropdown-link">
                                <span className="container">{label}</span>
                            </Link>
                        </li>
                    ))}
                    {usuario && (
                        <li>
                            <button type="button" className="header__dropdown-link header__logout" onClick={handleLogout}>
                                <span className="container">Cerrar sesión</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
