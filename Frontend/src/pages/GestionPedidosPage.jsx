import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoBadge from '../components/EstadoBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { pedidoService } from '../services/pedidoService.js';
import { sucursalService } from '../services/catalogoService.js';
import { useCarga } from '../utils/useCarga.js';
import {
  ESTADOS,
  ETIQUETA_MODALIDAD,
  etiquetaMedioDePago,
  formatearFecha,
  formatearPrecio
} from '../utils/format.js';

const ACCION_POR_ESTADO = {
  Confirmado: 'Confirmar',
  'En preparación': 'Pasar a preparación',
  Listo: 'Marcar listo',
  'En camino': 'Salió a entregar',
  Finalizado: 'Finalizar (entregado/retirado)',
  Cancelado: 'Cancelar'
};

// Panel de empleados y administradores (funcionalidad 9).
export default function GestionPedidosPage() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [estado, setEstado] = useState('');
  const [sucursalId, setSucursalId] = useState('');
  const [procesando, setProcesando] = useState(null);

  const { datos: sucursales } = useCarga(() => sucursalService.obtenerTodas());
  const {
    datos: pedidos,
    error,
    cargando,
    recargar,
    setDatos
  } = useCarga(() => pedidoService.obtenerTodos({ estado, sucursalId }), [estado, sucursalId]);

  // Actualización periódica para ver los pedidos nuevos sin recargar la página.
  useEffect(() => {
    const intervalo = setInterval(recargar, 20000);
    return () => clearInterval(intervalo);
  }, [recargar]);

  const cambiarEstado = async (pedido, nuevoEstado) => {
    setProcesando(pedido.id);
    try {
      const actualizado = await pedidoService.cambiarEstado(pedido.id, nuevoEstado);
      setDatos((actuales) => actuales.map((p) => (p.id === actualizado.id ? actualizado : p)));
      toast.exito(`Pedido #${pedido.id}: ahora está "${nuevoEstado}".`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="page">
      <div className="encabezado">
        <h1>Pedidos recibidos</h1>
        <button type="button" className="btn btn-secondary" onClick={recargar}>↻ Actualizar</button>
      </div>
      {usuario.rol === 'empleado' && (
        <p className="muted">Ves únicamente los pedidos de tu sucursal.</p>
      )}

      <div className="filtros">
        <label>
          Estado
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </label>
        {usuario.rol === 'administrador' && (
          <label>
            Sucursal
            <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
              <option value="">Todas</option>
              {(sucursales ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {cargando && !pedidos && <p className="loading">Cargando pedidos…</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {pedidos?.length === 0 && <p className="muted">No hay pedidos para los filtros elegidos.</p>}

      <div className="stack">
        {pedidos?.map((pedido) => (
          <article key={pedido.id} className="panel">
            <div className="pedido-resumen">
              <div>
                <h3>
                  Pedido #{pedido.id} <EstadoBadge estado={pedido.estado} />
                </h3>
                <p className="muted">
                  {formatearFecha(pedido.fecha)} · {pedido.cliente?.nombre} {pedido.cliente?.apellido} · Tel. {pedido.cliente?.telefono}
                </p>
                <p>
                  {ETIQUETA_MODALIDAD[pedido.modalidad]} · {pedido.sucursal?.nombre}
                  {pedido.direccion && ` · ${pedido.direccion} (${pedido.zona})`} · Pago: {etiquetaMedioDePago(pedido.medioPago)}
                </p>
                <ul className="items-simples">
                  {pedido.detalles.map((d) => (
                    <li key={d.id}>{d.cantidad}× {d.nombre}</li>
                  ))}
                </ul>
              </div>
              <div className="pedido-acciones">
                <strong className="precio">{formatearPrecio(pedido.total)}</strong>
                <Link to={`/pedidos/${pedido.id}`} className="btn btn-ghost">Ver detalle</Link>
              </div>
            </div>

            {pedido.siguientesEstados.length > 0 && (
              <div className="form-actions">
                {pedido.siguientesEstados.map((siguiente) => (
                  <button
                    key={siguiente}
                    type="button"
                    className={`btn ${siguiente === 'Cancelado' ? 'btn-danger' : 'btn-primary'}`}
                    disabled={procesando === pedido.id}
                    onClick={() => cambiarEstado(pedido, siguiente)}
                  >
                    {ACCION_POR_ESTADO[siguiente]}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
