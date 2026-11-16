import CartItem from '../CartItem/CartItem.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { MODALIDADES, UMBRAL_ENVIO_GRATIS } from '../../utils/pedidoRules.js';
import './OrderSummary.css';

function textoEnvio(modalidad, costoEnvio) {
    if (!modalidad) {
        return 'A definir';
    }
    if (modalidad === MODALIDADES.RETIRO) {
        return 'Sin costo';
    }
    return costoEnvio === 0 ? 'Gratis' : formatPrice(costoEnvio);
}

export default function OrderSummary({ items, subtotal, costoEnvio, modalidad }) {
    return (
        <section className="order-summary" aria-labelledby="resumen-titulo">
            <h2 id="resumen-titulo" className="order-summary__title">
                Tu pedido
            </h2>

            <ul className="order-summary__list" aria-label="Productos del pedido">
                {items.map((item) => (
                    <CartItem key={item.key} item={item} />
                ))}
            </ul>

            <dl className="order-summary__totals">
                <div className="order-summary__row">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="order-summary__row">
                    <dt>Envío</dt>
                    <dd>{textoEnvio(modalidad, costoEnvio)}</dd>
                </div>
                <div className="order-summary__row order-summary__row--total">
                    <dt>Total</dt>
                    <dd>{formatPrice(subtotal + costoEnvio)}</dd>
                </div>
            </dl>

            {modalidad === MODALIDADES.ENVIO && costoEnvio > 0 && (
                <p className="order-summary__note">
                    El envío es gratis en pedidos de más de {formatPrice(UMBRAL_ENVIO_GRATIS)}.
                </p>
            )}
        </section>
    );
}
