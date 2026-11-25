import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function enlacesDeNavegacion(usuario) {
  const enlaces = [{ etiqueta: 'Menú', to: '/' }];
  if (usuario?.rol === 'cliente') {
    enlaces.push({ etiqueta: 'Mis pedidos', to: '/pedidos' });
  }
  if (usuario?.rol === 'empleado' || usuario?.rol === 'administrador') {
    enlaces.push({ etiqueta: 'Pedidos recibidos', to: '/gestion/pedidos' });
    enlaces.push({ etiqueta: 'Productos', to: '/gestion/productos' });
  }
  if (usuario?.rol === 'administrador') {
    enlaces.push({ etiqueta: 'Combos', to: '/gestion/combos' });
    enlaces.push({ etiqueta: 'Administración', to: '/gestion/administracion' });
  }
  return enlaces;
}

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { cantidadTotal } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlaces = enlacesDeNavegacion(usuario);
  const puedeComprar = !usuario || usuario.rol === 'cliente';

  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  const cerrarSesion = () => {
    navigate('/');
    logout();
    toast.info('Cerraste sesión.');
  };

  return (
    <header className="header">
      <div className="header__bar">
        <div className="container header__inner">
          <Link to="/" className="header__brand">
            <img src="/logo-panchosky.svg" alt="Panchosky Fast Food" className="header__logo" />
          </Link>

          <nav className="header__nav" aria-label="Principal">
            <ul className="header__links">
              {enlaces.map(({ etiqueta, to }) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'} className="header__link">
                    {etiqueta}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            {usuario ? (
              <>
                <span className="header__link header__user">Hola, {usuario.nombre}</span>
                <button type="button" className="header__link header__desktop-only" onClick={cerrarSesion}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header__link">Ingresar</Link>
                <Link to="/registro" className="header__link header__desktop-only">Crear cuenta</Link>
              </>
            )}

            {puedeComprar && (
              <Link to="/carrito" className="header__cart">
                Mi pedido
                {cantidadTotal > 0 && <span className="header__badge">{cantidadTotal}</span>}
              </Link>
            )}

            <button
              type="button"
              className={`header__burger ${menuAbierto ? 'header__burger--open' : ''}`}
              aria-expanded={menuAbierto}
              aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <nav className="header__dropdown" aria-label="Menú desplegable" hidden={!menuAbierto}>
        <ul>
          {enlaces.map(({ etiqueta, to }) => (
            <li key={to}>
              <Link to={to} className="header__dropdown-link">
                <span className="container">{etiqueta}</span>
              </Link>
            </li>
          ))}
          {!usuario && (
            <li>
              <Link to="/registro" className="header__dropdown-link">
                <span className="container">Crear cuenta</span>
              </Link>
            </li>
          )}
          {usuario && (
            <li>
              <button type="button" className="header__dropdown-link" onClick={cerrarSesion}>
                <span className="container">Cerrar sesión</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
