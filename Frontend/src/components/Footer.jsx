import { Link } from 'react-router-dom';
import { categoriaService } from '../services/catalogoService.js';
import { useCarga } from '../utils/useCarga.js';

const REDES = [
  { nombre: 'Instagram', url: 'https://www.instagram.com/' },
  { nombre: 'Facebook', url: 'https://www.facebook.com/' },
  { nombre: 'TikTok', url: 'https://www.tiktok.com/' }
];

export default function Footer() {
  const { datos: categorias } = useCarga(() => categoriaService.obtenerTodas());

  return (
    <footer id="contacto" className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src="/logo-panchosky.svg" alt="Panchosky" width="168" height="67" />
          </Link>
          <p className="footer__tagline">El sabor de la calle porteña desde 2012.</p>
          <ul className="footer__social" aria-label="Redes sociales">
            {REDES.map(({ nombre, url }) => (
              <li key={nombre}>
                <a href={url} target="_blank" rel="noopener noreferrer">{nombre}</a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__column" aria-labelledby="footer-menu">
          <h2 id="footer-menu" className="footer__heading">Menú</h2>
          <ul>
            {categorias?.map(({ id, nombre }) => (
              <li key={id}>
                <Link to={`/?categoria=${id}`}>{nombre}</Link>
              </li>
            ))}
            <li><Link to="/#combos">Combos</Link></li>
          </ul>
        </nav>

        <nav className="footer__column" aria-labelledby="footer-empresa">
          <h2 id="footer-empresa" className="footer__heading">Empresa</h2>
          <ul>
            <li><Link to="/#nosotros">Quiénes somos</Link></li>
            <li><Link to="/#sucursales">Sucursales</Link></li>
          </ul>
        </nav>

        <nav className="footer__column" aria-labelledby="footer-ayuda">
          <h2 id="footer-ayuda" className="footer__heading">Ayuda</h2>
          <ul>
            <li><Link to="/carrito">Mi pedido</Link></li>
            <li><Link to="/#nosotros">Envíos y retiros</Link></li>
          </ul>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} Panchosky — Todos los derechos reservados.</p>
        <p>
          Hecho con <span role="img" aria-label="amor" className="footer__heart">♥</span> en Buenos Aires, Argentina
        </p>
      </div>
    </footer>
  );
}
