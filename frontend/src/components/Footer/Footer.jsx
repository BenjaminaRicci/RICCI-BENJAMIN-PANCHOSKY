import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch.js';
import { useCart } from '../../context/CartContext.jsx';
import { obtenerCategorias } from '../../services/categoriaService.js';
import logo from '../../assets/logo-icon.svg';
import './Footer.css';

const REDES = [
    { nombre: 'Instagram', url: 'https://www.instagram.com/' },
    { nombre: 'Facebook', url: 'https://www.facebook.com/' },
    { nombre: 'TikTok', url: 'https://www.tiktok.com/' }
];

export default function Footer() {
    const { data: categorias } = useFetch(obtenerCategorias);
    const { openCart } = useCart();
    const anioActual = new Date().getFullYear();

    return (
        <footer id="contacto" className="footer">
            <div className="container footer__grid">
                <div className="footer__brand">
                    <Link to="/" className="footer__logo">
                        <img src={logo} alt="" width="32" height="32" />
                        <span>Panchosky</span>
                    </Link>
                    <p className="footer__tagline">El sabor de la calle porteña desde 2012.</p>
                    <ul className="footer__social" aria-label="Redes sociales">
                        {REDES.map(({ nombre, url }) => (
                            <li key={nombre}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${nombre} (se abre en una pestaña nueva)`}
                                >
                                    {nombre}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <nav className="footer__column" aria-labelledby="footer-menu">
                    <h2 id="footer-menu" className="footer__heading">
                        Menú
                    </h2>
                    <ul>
                        {categorias?.map(({ id, nombre }) => (
                            <li key={id}>
                                <Link to={`/productos?categoria=${id}`}>{nombre}</Link>
                            </li>
                        ))}
                        <li>
                            <Link to="/combos">Combos</Link>
                        </li>
                    </ul>
                </nav>

                <nav className="footer__column" aria-labelledby="footer-empresa">
                    <h2 id="footer-empresa" className="footer__heading">
                        Empresa
                    </h2>
                    <ul>
                        <li>
                            <Link to="/#nosotros">Quiénes somos</Link>
                        </li>
                        <li>
                            <Link to="/admin">Panel del personal</Link>
                        </li>
                    </ul>
                </nav>

                <nav className="footer__column" aria-labelledby="footer-ayuda">
                    <h2 id="footer-ayuda" className="footer__heading">
                        Ayuda
                    </h2>
                    <ul>
                        <li>
                            <button type="button" className="footer__link-button" onClick={openCart}>
                                Mi pedido
                            </button>
                        </li>
                        <li>
                            <Link to="/#nosotros">Envíos y retiros</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="container footer__bottom">
                <p>© {anioActual} Panchosky — Todos los derechos reservados.</p>
                <p>
                    Hecho con{' '}
                    <span role="img" aria-label="amor" className="footer__heart">
                        ♥
                    </span>{' '}
                    en Buenos Aires, Argentina
                </p>
            </div>
        </footer>
    );
}
