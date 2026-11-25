import { Link } from 'react-router-dom';
import EstadoBadge from '../components/EstadoBadge.jsx';
import { pedidoService } from '../services/pedidoService.js';
import { useCarga } from '../utils/useCarga.js';
import { useRepetirPedido } from '../utils/useRepetirPedido.js';
import { ETIQUETA_MODALIDAD, formatearFecha, formatearPrecio } from '../utils/format.js';

export default function PedidosPage() {
  const { datos: pedidos, error, cargando } = useCarga(() => pedidoService.obtenerTodos());
  const repetir = useRepetirPedido();

  return (
    <div className="page">
      <h1>Mis pedidos</h1>

      {cargando && <p className="loading">Cargando pedidos…</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {pedidos?.length === 0 && (
        <div className="panel center">
          <p className="muted">Todavía no realizaste ningún pedido.</p>
          <Link to="/" className="btn btn-primary">Ir al menú</Link>
        </div>
      )}

      <div className="stack">
        {pedidos?.map((pedido) => (
          <article key={pedido.id} className="panel pedido-resumen">
            <div>
              <h3>
                Pedido #{pedido.id} <EstadoBadge estado={pedido.estado} />
              </h3>
              <p className="muted">
                {formatearFecha(pedido.fecha)} · {ETIQUETA_MODALIDAD[pedido.modalidad]} · {pedido.sucursal?.nombre}
              </p>
              <p>{pedido.detalles.map((d) => `${d.cantidad}× ${d.nombre}`).join(', ')}</p>
            </div>
            <div className="pedido-acciones">
              <strong className="precio">{formatearPrecio(pedido.total)}</strong>
              <Link to={`/pedidos/${pedido.id}`} className="btn btn-secondary">Ver detalle</Link>
              <button type="button" className="btn btn-ghost" onClick={() => repetir(pedido)}>Repetir pedido</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
