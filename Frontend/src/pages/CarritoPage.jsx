import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { itemsParaApi, useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { pedidoService } from '../services/pedidoService.js';
import { sucursalService } from '../services/catalogoService.js';
import { useCarga } from '../utils/useCarga.js';
import ProductImage from '../components/ProductImage.jsx';
import { MAX_CANTIDAD, MEDIOS_DE_PAGO, ZONAS, formatearPrecio } from '../utils/format.js';

export default function CarritoPage() {
  const { usuario } = useAuth();
  const { items, cambiarCantidad, quitar, vaciar } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const { datos: sucursales } = useCarga(() => sucursalService.obtenerTodas());

  const [form, setForm] = useState({
    modalidad: 'envio',
    zona: 'Centro',
    direccion: '',
    sucursalId: '',
    medioPago: ''
  });
  const [cotizacion, setCotizacion] = useState(null);
  const [errorCotizacion, setErrorCotizacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (evento) => setForm({ ...form, [campo]: evento.target.value });

  // Los totales (subtotal, envío y total) los calcula el backend cada vez que cambia el pedido.
  useEffect(() => {
    if (items.length === 0) {
      setCotizacion(null);
      setErrorCotizacion('');
      return;
    }
    let activo = true;
    pedidoService
      .cotizar({ items: itemsParaApi(items), modalidad: form.modalidad })
      .then((resultado) => {
        if (activo) {
          setCotizacion(resultado);
          setErrorCotizacion('');
        }
      })
      .catch((err) => {
        if (activo) {
          setCotizacion(null);
          setErrorCotizacion(err.message);
        }
      });
    return () => {
      activo = false;
    };
  }, [items, form.modalidad]);

  const confirmar = async (evento) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const pedido = await pedidoService.crear({
        items: itemsParaApi(items),
        modalidad: form.modalidad,
        zona: form.modalidad === 'envio' ? form.zona : undefined,
        direccion: form.modalidad === 'envio' ? form.direccion : undefined,
        sucursalId: form.sucursalId ? Number(form.sucursalId) : undefined,
        medioPago: form.medioPago || undefined
      });
      vaciar();
      toast.exito(`¡Pedido #${pedido.id} confirmado! Ya podés seguir su estado.`);
      navigate(`/pedidos/${pedido.id}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page page-narrow">
        <div className="panel center">
          <h1>Tu pedido está vacío</h1>
          <p className="muted">Sumá productos o combos desde el menú para armar tu pedido.</p>
          <Link to="/" className="btn btn-primary">Ver el menú</Link>
        </div>
      </div>
    );
  }

  const esEnvio = form.modalidad === 'envio';

  return (
    <div className="page">
      <h1>Mi pedido</h1>
      <div className="layout-2">
        <section className="panel">
          <h2>Productos</h2>
          <ul className="lista-items">
            {items.map((item) => (
              <li key={item.clave}>
                <div className="item-info">
                  <ProductImage className="miniatura" src={item.imagen} alt={item.nombre} />
                  <div>
                    <strong>{item.nombre}</strong>
                    <div className="muted">{formatearPrecio(item.precio)} c/u</div>
                  </div>
                </div>
                <div className="cantidad">
                  <button type="button" className="btn btn-ghost" aria-label="Quitar uno" disabled={item.cantidad <= 1} onClick={() => cambiarCantidad(item.clave, item.cantidad - 1)}>−</button>
                  <span>{item.cantidad}</span>
                  <button type="button" className="btn btn-ghost" aria-label="Agregar uno" disabled={item.cantidad >= MAX_CANTIDAD} onClick={() => cambiarCantidad(item.clave, item.cantidad + 1)}>+</button>
                </div>
                <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
                <button type="button" className="btn btn-danger-ghost" onClick={() => quitar(item.clave)}>Quitar</button>
              </li>
            ))}
          </ul>

          {errorCotizacion && <p className="alert alert-error">{errorCotizacion}</p>}

          {cotizacion && (
            <dl className="totales">
              <div><dt>Subtotal</dt><dd>{formatearPrecio(cotizacion.subtotal)}</dd></div>
              <div>
                <dt>Envío</dt>
                <dd>{esEnvio ? (cotizacion.costoEnvio === 0 ? 'Gratis' : formatearPrecio(cotizacion.costoEnvio)) : 'Sin costo (retiro)'}</dd>
              </div>
              <div className="total"><dt>Total</dt><dd>{formatearPrecio(cotizacion.total)}</dd></div>
            </dl>
          )}

          {cotizacion && esEnvio && !cotizacion.cumpleMinimoEnvio && (
            <p className="alert alert-warning">
              El envío a domicilio requiere un pedido mínimo de {formatearPrecio(cotizacion.minimoEnvio)}.
            </p>
          )}
          {cotizacion && esEnvio && cotizacion.costoEnvio > 0 && (
            <p className="muted">Envío gratis en pedidos superiores a {formatearPrecio(cotizacion.envioGratisDesde)}.</p>
          )}
        </section>

        <section className="panel">
          <h2>Confirmar pedido</h2>

          {!usuario && (
            <div>
              <p className="alert alert-warning">Para confirmar tu pedido tenés que iniciar sesión.</p>
              <div className="form-actions">
                <Link to="/login" state={{ desde: '/carrito' }} className="btn btn-primary">Iniciar sesión</Link>
                <Link to="/registro" state={{ desde: '/carrito' }} className="btn btn-secondary">Crear cuenta</Link>
              </div>
            </div>
          )}

          {usuario && usuario.rol !== 'cliente' && (
            <p className="alert alert-warning">Solo los clientes pueden realizar pedidos.</p>
          )}

          {usuario?.rol === 'cliente' && (
            <form className="form" onSubmit={confirmar}>
              {error && <p className="alert alert-error">{error}</p>}

              <fieldset className="opciones">
                <legend>Modalidad</legend>
                <label className={`opcion ${esEnvio ? 'activa' : ''}`}>
                  <input type="radio" name="modalidad" value="envio" checked={esEnvio} onChange={cambiar('modalidad')} />
                  🛵 Envío a domicilio
                </label>
                <label className={`opcion ${!esEnvio ? 'activa' : ''}`}>
                  <input type="radio" name="modalidad" value="retiro" checked={!esEnvio} onChange={cambiar('modalidad')} />
                  🏪 Retiro en sucursal
                </label>
              </fieldset>

              {esEnvio && (
                <>
                  <label>
                    Zona de entrega
                    <select value={form.zona} onChange={cambiar('zona')}>
                      {ZONAS.map((zona) => (
                        <option key={zona} value={zona}>{zona}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Dirección
                    <input value={form.direccion} onChange={cambiar('direccion')} placeholder="Calle, número, piso/depto" />
                  </label>
                </>
              )}

              <label>
                {esEnvio ? 'Sucursal que prepara tu pedido' : 'Sucursal donde retirás'}
                <select value={form.sucursalId} onChange={cambiar('sucursalId')}>
                  <option value="">Elegí una sucursal…</option>
                  {(sucursales ?? []).map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre} — {sucursal.direccion}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Medio de pago
                <select value={form.medioPago} onChange={cambiar('medioPago')}>
                  <option value="">Elegí un medio de pago…</option>
                  {MEDIOS_DE_PAGO.map((medio) => (
                    <option key={medio.valor} value={medio.valor}>{medio.etiqueta}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="btn btn-primary btn-grande" disabled={enviando}>
                {enviando ? 'Confirmando…' : `Confirmar pedido${cotizacion ? ` · ${formatearPrecio(cotizacion.total)}` : ''}`}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
