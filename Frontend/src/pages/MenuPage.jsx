import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { productoService } from '../services/productoService.js';
import { categoriaService, configuracionService, sucursalService } from '../services/catalogoService.js';
import { comboService } from '../services/comboService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useCarga } from '../utils/useCarga.js';
import { formatearPrecio } from '../utils/format.js';
import heroImage from '../assets/hero-pancho.jpg';
import ProductImage from '../components/ProductImage.jsx';
import BranchesSection from '../components/BranchesSection.jsx';

function ComboModal({ combo, panchos, bebidas, onCerrar, onConfirmar }) {
  const [panchoId, setPanchoId] = useState('');
  const [bebidaId, setBebidaId] = useState('');

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <form
        className="modal"
        onClick={(evento) => evento.stopPropagation()}
        onSubmit={(evento) => {
          evento.preventDefault();
          onConfirmar(Number(panchoId), Number(bebidaId));
        }}
      >
        <div className="modal__header">
          <h2 className="modal__title">Armá tu combo</h2>
          <button type="button" className="modal__close" aria-label="Cerrar" onClick={onCerrar}>×</button>
        </div>
        <div className="modal__body">
          <p className="muted">
            {combo.nombre}: un pancho y una bebida a elección por {formatearPrecio(combo.precioPromocional)}.
          </p>

          <label>
            Pancho
            <select value={panchoId} onChange={(e) => setPanchoId(e.target.value)} required>
              <option value="">Elegí un pancho…</option>
              {panchos.map((pancho) => (
                <option key={pancho.id} value={pancho.id}>{pancho.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            Bebida
            <select value={bebidaId} onChange={(e) => setBebidaId(e.target.value)} required>
              <option value="">Elegí una bebida…</option>
              {bebidas.map((bebida) => (
                <option key={bebida.id} value={bebida.id}>{bebida.nombre}</option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Agregar al pedido</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function MenuPage() {
  const { usuario } = useAuth();
  const { agregar } = useCart();
  const toast = useToast();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [comboElegido, setComboElegido] = useState(null);

  const { datos, error, cargando } = useCarga(() =>
    Promise.all([
      productoService.obtenerTodos(),
      categoriaService.obtenerTodas(),
      comboService.obtenerTodos(),
      sucursalService.obtenerTodas(),
      configuracionService.obtener()
    ])
  );

  const [productos, categorias, combos, sucursales, config] = datos ?? [[], [], [], [], null];
  const puedeComprar = !usuario || usuario.rol === 'cliente';

  // Los enlaces del footer (/#sucursales, /#nosotros, /#combos) hacen scroll a su sección.
  useEffect(() => {
    if (!location.hash || !datos) {
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, datos]);

  const categoriaPorId = useMemo(
    () => Object.fromEntries(categorias.map((categoria) => [categoria.id, categoria.nombre])),
    [categorias]
  );

  const categoriaParam = Number(searchParams.get('categoria'));
  const categoriaActiva = categorias.find((c) => c.id === categoriaParam)?.id ?? categorias[0]?.id;
  const visibles = productos.filter((producto) => producto.categoriaId === categoriaActiva);
  const panchos = productos.filter((p) => p.disponible && categoriaPorId[p.categoriaId] === 'Panchos');
  const bebidas = productos.filter((p) => p.disponible && categoriaPorId[p.categoriaId] === 'Bebidas');

  const agregarProducto = (producto) => {
    agregar({ productoId: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
    toast.exito(`"${producto.nombre}" se agregó a tu pedido.`);
  };

  const agregarCombo = (panchoId, bebidaId) => {
    const pancho = productos.find((p) => p.id === panchoId);
    const bebida = productos.find((p) => p.id === bebidaId);
    agregar({
      comboId: comboElegido.id,
      panchoId,
      bebidaId,
      nombre: `${comboElegido.nombre} (${pancho.nombre} + ${bebida.nombre})`,
      imagen: pancho.imagen,
      precio: comboElegido.precioPromocional
    });
    toast.exito('El combo se agregó a tu pedido.');
    setComboElegido(null);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-titulo">
        <div className="hero__visual">
          <img src={heroImage} alt="Panchos con mostaza y ketchup sobre una mesa oscura" className="hero__image" />
        </div>
        <div className="container hero__content">
          <p className="hero__eyebrow">El sabor de la calle, en tu puerta</p>
          <h1 id="hero-titulo" className="hero__title">
            Siempre <span>Panchosky</span>
          </h1>
          <p className="hero__text">
            Panchos, hamburguesas, sandwiches, empanadas y medialunas. Pedí ahora y recibí en tu casa o retirá en el
            local más cercano.
          </p>
          <div className="hero__actions">
            <Link to="/#menu" className="btn btn-primary btn-lg">Ver menú completo</Link>
            {puedeComprar && <Link to="/carrito" className="btn btn-accent btn-lg">Mi pedido</Link>}
          </div>
        </div>
      </section>

      {cargando && <p className="loading">Cargando menú…</p>}
      {error && <div className="container section"><p className="alert alert-error">{error}</p></div>}

      {combos.length > 0 && (
        <section id="combos" className="container home__combos" aria-label="Combos y ofertas">
          {combos.map((combo) => (
            <article key={combo.id} className={`combo-banner ${combo.vigente ? '' : 'combo-banner--expired'}`}>
              <div>
                <p className="combo-banner__eyebrow">Oferta del día</p>
                <h3 className="combo-banner__title">{combo.nombre}</h3>
                <p className="combo-banner__description">
                  Cualquier pancho del menú más bebida a elección.{' '}
                  {combo.vigente ? `Hasta hoy a las ${combo.horaLimite} hs.` : `La oferta finalizó a las ${combo.horaLimite} hs.`}
                </p>
              </div>
              <div className="combo-banner__pricing">
                <p className="combo-banner__prices">
                  <s className="combo-banner__old-price">{formatearPrecio(combo.precioOriginal)}</s>
                  <span className="combo-banner__price">{formatearPrecio(combo.precioPromocional)}</span>
                </p>
                {puedeComprar && (
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    disabled={!combo.vigente}
                    onClick={() => setComboElegido(combo)}
                  >
                    {combo.vigente ? '+Agregar' : 'Oferta finalizada'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      <section id="menu" className="container section" aria-labelledby="menu-titulo">
        <h2 id="menu-titulo" className="section-title">Nuestro menú</h2>

        <div className="category-tabs" role="tablist">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              role="tab"
              aria-selected={categoria.id === categoriaActiva}
              className={`category-tabs__tab ${categoria.id === categoriaActiva ? 'category-tabs__tab--active' : ''}`}
              onClick={() => setSearchParams({ categoria: String(categoria.id) }, { replace: true, preventScrollReset: true })}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        <ul className="product-grid">
          {visibles.map((producto) => (
            <li key={producto.id}>
              <article className={`product-card ${producto.disponible ? '' : 'product-card--unavailable'}`}>
                <div className="product-card__media">
                  <ProductImage className="product-card__image" src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{producto.nombre}</h3>
                  <p className="product-card__description">{producto.descripcion}</p>
                  <div className="product-card__footer">
                    <p className="product-card__price">{formatearPrecio(producto.precio)}</p>
                    {puedeComprar && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={!producto.disponible}
                        onClick={() => agregarProducto(producto)}
                      >
                        {producto.disponible ? '+Agregar' : 'No disponible'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {!cargando && visibles.length === 0 && <p className="muted">No hay productos en esta categoría.</p>}
      </section>

      <BranchesSection sucursales={sucursales} />

      <section id="nosotros" className="benefits" aria-label="Por qué elegir Panchosky">
        <ul className="container benefits__list">
          <li>
            <h3 className="benefits__title">Envío a domicilio</h3>
            <p className="benefits__text">
              {config
                ? `Zona ${config.zonasCobertura.join(' y ')}. Mínimo ${formatearPrecio(config.minimoEnvio)}. Gratis en pedidos de más de ${formatearPrecio(config.envioGratisDesde)}.`
                : 'Envíos a domicilio en nuestra zona de cobertura.'}
            </p>
          </li>
          <li>
            <h3 className="benefits__title">Retiro en local</h3>
            <p className="benefits__text">
              Evitá el costo de envío retirando en cualquiera de nuestras {sucursales.length || 5} sucursales.
            </p>
          </li>
          <li>
            <h3 className="benefits__title">Todos los medios de pago</h3>
            <p className="benefits__text">Efectivo, débito, crédito, Mercado Pago y transferencia.</p>
          </li>
        </ul>
      </section>

      {comboElegido && (
        <ComboModal
          combo={comboElegido}
          panchos={panchos}
          bebidas={bebidas}
          onCerrar={() => setComboElegido(null)}
          onConfirmar={agregarCombo}
        />
      )}
    </>
  );
}
