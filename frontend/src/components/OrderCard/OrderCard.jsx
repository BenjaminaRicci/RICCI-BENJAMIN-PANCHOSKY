import { formatPrice } from '../../utils/formatPrice.js';
import { formatFecha, tonoEstado } from '../../utils/pedidoEstados.js';
import { MODALIDADES, OPCIONES_MEDIO_PAGO, obtenerEtiqueta } from '../../utils/pedidoRules.js';
import './OrderCard.css';

export default function OrderCard({ pedido, children }) {
    const { id, fecha, estado, modalidad, direccion, sucursal, medioPago, total, costoEnvio, detalles, cliente } = pedido;
    const titleId = `pedido-${id}-titulo`;

    return (
        <article className="order-card" aria-labelledby={titleId}>
            <header className="order-card__header">
                <div>
                    <h3 id={titleId} className="order-card__title">
                        Pedido #{id}
                    </h3>
                    <p className="order-card__meta">{formatFecha(fecha)}</p>
                </div>
                <span className={`badge badge--${tonoEstado(estado)}`}>{estado}</span>
            </header>

            {cliente && (
                <p className="order-card__line">
                    <strong>Cliente:</strong> {cliente.nombre} {cliente.apellido} · {cliente.telefono}
                </p>
            )}
            <p className="order-card__line">
                <strong>{modalidad === MODALIDADES.ENVIO ? 'Envío a:' : 'Retiro en:'}</strong>{' '}
                {modalidad === MODALIDADES.ENVIO ? direccion : `${sucursal?.nombre} (${sucursal?.direccion})`}
            </p>
            <p className="order-card__line">
                <strong>Pago:</strong> {obtenerEtiqueta(OPCIONES_MEDIO_PAGO, medioPago)}
            </p>

            <ul className="order-card__items">
                {detalles.map((detalle) => (
                    <li key={detalle.id} className="order-card__item">
                        <span>
                            {detalle.cantidad} × {detalle.nombre}
                            {detalle.seleccion?.length > 0 && (
                                <span className="order-card__selection">
                                    {' '}
                                    ({detalle.seleccion.map(({ nombre }) => nombre).join(' + ')})
                                </span>
                            )}
                        </span>
                        <span>{formatPrice(detalle.subtotal)}</span>
                    </li>
                ))}
            </ul>

            <div className="order-card__footer">
                <p className="order-card__total">
                    Total: <strong>{formatPrice(total)}</strong>
                    {costoEnvio > 0 && <span className="order-card__meta"> (incluye envío {formatPrice(costoEnvio)})</span>}
                </p>
                {children && <div className="order-card__actions">{children}</div>}
            </div>
        </article>
    );
}
