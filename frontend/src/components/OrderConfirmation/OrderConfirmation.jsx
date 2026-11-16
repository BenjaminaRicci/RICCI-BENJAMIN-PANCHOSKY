import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import {
    MODALIDADES,
    OPCIONES_MEDIO_PAGO,
    OPCIONES_MODALIDAD,
    obtenerEtiqueta
} from '../../utils/pedidoRules.js';
import './OrderConfirmation.css';

export default function OrderConfirmation({ pedido, sucursal }) {
    const titleRef = useRef(null);

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    const entrega =
        pedido.modalidad === MODALIDADES.ENVIO
            ? pedido.direccion
            : sucursal
              ? `${sucursal.nombre} (${sucursal.direccion})`
              : 'Sucursal seleccionada';

    return (
        <section className="order-confirmation" aria-labelledby="confirmacion-titulo">
            <span className="order-confirmation__icon" aria-hidden="true">
                ✓
            </span>
            <h1 id="confirmacion-titulo" ref={titleRef} tabIndex={-1} className="order-confirmation__title">
                ¡Pedido confirmado!
            </h1>
            <p className="order-confirmation__subtitle">
                Tu pedido <strong>#{pedido.id}</strong> quedó en estado <strong>{pedido.estado}</strong>.
            </p>

            <dl className="order-confirmation__details">
                <div>
                    <dt>Modalidad</dt>
                    <dd>{obtenerEtiqueta(OPCIONES_MODALIDAD, pedido.modalidad)}</dd>
                </div>
                <div>
                    <dt>{pedido.modalidad === MODALIDADES.ENVIO ? 'Dirección' : 'Sucursal'}</dt>
                    <dd>{entrega}</dd>
                </div>
                <div>
                    <dt>Medio de pago</dt>
                    <dd>{obtenerEtiqueta(OPCIONES_MEDIO_PAGO, pedido.medioPago)}</dd>
                </div>
                <div>
                    <dt>Costo de envío</dt>
                    <dd>{pedido.costoEnvio === 0 ? 'Sin costo' : formatPrice(pedido.costoEnvio)}</dd>
                </div>
                <div className="order-confirmation__total">
                    <dt>Total</dt>
                    <dd>{formatPrice(pedido.total)}</dd>
                </div>
            </dl>

            <Button as={Link} to="/" size="lg">
                Volver al menú
            </Button>
        </section>
    );
}
