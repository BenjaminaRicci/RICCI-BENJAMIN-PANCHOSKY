import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EstadoBadge from '../components/EstadoBadge.jsx';
import SeguimientoPedido from '../components/SeguimientoPedido.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { pedidoService } from '../services/pedidoService.js';
import { useCarga } from '../utils/useCarga.js';
import { useRepetirPedido } from '../utils/useRepetirPedido.js';
import {
  ETIQUETA_MODALIDAD,
  etiquetaMedioDePago,
  formatearFecha,
  formatearPrecio
} from '../utils/format.js';

export default function PedidoDetallePage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const toast = useToast();
  const repetir = useRepetirPedido();
  const [cancelando, setCancelando] = useState(false);

  const { datos: pedido, error, cargando, setDatos, recargar } = useCarga(() => pedidoService.obtenerPorId(id), [id]);

  const cancelar = async () => {
    if (!window.confirm('¿Seguro que querés cancelar este pedido?')) {
      return;
    }
    setCancelando(true);
    try {
      setDatos(await pedidoService.cancelar(pedido.id));
      toast.exito(`El pedido #${pedido.id} fue cancelado.`);
    } catch (err) {
      toast.error(err.message);
      recargar();
    } finally {
      setCancelando(false);
    }
  };

  if (cargando && !pedido) {
    return <p className="loading">Cargando pedido…</p>;
  }
  if (error && !pedido) {
    return (
      <div className="page">
        <p className="alert alert-error">{error}</p>
        <Link to="/pedidos" className="btn btn-secondary">Volver a mis pedidos</Link>
      </div>
    );
  }

  return (
    <div className="page page-medium">
      <Link to={usuario.rol === 'cliente' ? '/pedidos' : '/gestion/pedidos'} className="volver">← Volver</Link>
      <h1>
        Pedido #{pedido.id} <EstadoBadge estado={pedido.estado} />
      </h1>
      <p className="muted">Realizado el {formatearFecha(pedido.fecha)}</p>

      <section className="panel">
        <h2>Seguimiento</h2>
        <SeguimientoPedido pedido={pedido} />
      </section>

      <section className="panel">
        <h2>Detalle</h2>
        <table className="tabla">
          <thead>
            <tr><th>Producto</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {pedido.detalles.map((detalle) => (
              <tr key={detalle.id}>
                <td>{detalle.nombre}</td>
                <td>{detalle.cantidad}</td>
                <td>{formatearPrecio(detalle.precioUnitario)}</td>
                <td>{formatearPrecio(detalle.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="totales">
          <div><dt>Subtotal</dt><dd>{formatearPrecio(pedido.subtotal)}</dd></div>
          <div><dt>Envío</dt><dd>{pedido.costoEnvio === 0 ? 'Sin costo' : formatearPrecio(pedido.costoEnvio)}</dd></div>
          <div className="total"><dt>Total</dt><dd>{formatearPrecio(pedido.total)}</dd></div>
        </dl>
      </section>

      <section className="panel datos-pedido">
        <p><strong>Modalidad:</strong> {ETIQUETA_MODALIDAD[pedido.modalidad]}</p>
        {pedido.direccion && <p><strong>Dirección:</strong> {pedido.direccion} ({pedido.zona})</p>}
        <p><strong>Sucursal:</strong> {pedido.sucursal?.nombre}</p>
        <p><strong>Medio de pago:</strong> {etiquetaMedioDePago(pedido.medioPago)}</p>
      </section>

      <section className="panel">
        <h2>Historial de estados</h2>
        <ul className="historial">
          {pedido.historial.map((registro, indice) => (
            <li key={indice}>
              <EstadoBadge estado={registro.estado} /> {formatearFecha(registro.fecha)} · {registro.usuarioNombre}
            </li>
          ))}
        </ul>
      </section>

      <div className="form-actions">
        {pedido.cancelable && (
          <button type="button" className="btn btn-danger" onClick={cancelar} disabled={cancelando}>
            {cancelando ? 'Cancelando…' : 'Cancelar pedido'}
          </button>
        )}
        {usuario.rol === 'cliente' && (
          <button type="button" className="btn btn-secondary" onClick={() => repetir(pedido)}>
            Repetir pedido
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={recargar}>↻ Actualizar estado</button>
      </div>
    </div>
  );
}
