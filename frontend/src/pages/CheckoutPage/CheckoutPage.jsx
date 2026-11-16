import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm.jsx';
import OrderSummary from '../../components/OrderSummary/OrderSummary.jsx';
import OrderConfirmation from '../../components/OrderConfirmation/OrderConfirmation.jsx';
import StatusMessage from '../../components/StatusMessage/StatusMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { obtenerSucursales } from '../../services/sucursalService.js';
import { crearPedido } from '../../services/pedidoService.js';
import { MODALIDADES, calcularCostoEnvio } from '../../utils/pedidoRules.js';
import { ROLES } from '../../utils/roles.js';
import './CheckoutPage.css';

function toItemPedido({ tipo, id, cantidad, seleccion }) {
    return tipo === 'combo' ? { comboId: id, cantidad, seleccion } : { productoId: id, cantidad };
}

export default function CheckoutPage() {
    useDocumentTitle('Confirmar pedido');
    const { items, subtotal, clearCart } = useCart();
    const { usuario } = useAuth();
    const notify = useNotification();
    const sucursales = useFetch(obtenerSucursales);

    const [modalidad, setModalidad] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

    const costoEnvio = calcularCostoEnvio(subtotal, modalidad);

    const handleSubmit = async (values) => {
        setEnviando(true);
        try {
            const pedido = await crearPedido({
                modalidad: values.modalidad,
                direccion: values.modalidad === MODALIDADES.ENVIO ? values.direccion.trim() : undefined,
                sucursalId: values.modalidad === MODALIDADES.RETIRO ? Number(values.sucursalId) : undefined,
                medioPago: values.medioPago,
                items: items.map(toItemPedido)
            });
            setPedidoConfirmado(pedido);
            clearCart();
            notify.success(`¡Tu pedido #${pedido.id} fue confirmado!`);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    if (pedidoConfirmado) {
        const sucursal = sucursales.data?.find(({ id }) => id === pedidoConfirmado.sucursalId);
        return (
            <div className="container section">
                <OrderConfirmation pedido={pedidoConfirmado} sucursal={sucursal} />
            </div>
        );
    }

    return (
        <div className="container section checkout">
            <Link to="/" className="checkout__back">
                ← Seguir comprando
            </Link>
            <h1 className="checkout__title">Confirmar pedido</h1>

            {items.length === 0 ? (
                <StatusMessage title="Tu pedido está vacío" message="Agregá productos desde el menú para poder confirmar.">
                    <Button as={Link} to="/#menu" size="sm">
                        Ver menú
                    </Button>
                </StatusMessage>
            ) : !usuario ? (
                <StatusMessage
                    title="Ingresá para confirmar tu pedido"
                    message="Necesitás una cuenta para hacer pedidos. Tu carrito se mantiene guardado."
                >
                    <Button as={Link} to="/login" state={{ from: '/checkout' }} size="sm">
                        Ingresar
                    </Button>{' '}
                    <Button as={Link} to="/registro" state={{ from: '/checkout' }} size="sm" variant="outline">
                        Crear cuenta
                    </Button>
                </StatusMessage>
            ) : usuario.rol !== ROLES.CLIENTE ? (
                <StatusMessage
                    type="error"
                    title="Solo los clientes pueden hacer pedidos"
                    message="Ingresaste con una cuenta del personal. Usá una cuenta de cliente para comprar."
                />
            ) : (
                <div className="checkout__layout">
                    <section className="checkout__form" aria-labelledby="datos-entrega-titulo">
                        <h2 id="datos-entrega-titulo" className="checkout__subtitle">
                            Datos de entrega y pago
                        </h2>
                        <CheckoutForm
                            sucursales={sucursales}
                            subtotal={subtotal}
                            submitting={enviando}
                            onSubmit={handleSubmit}
                            onModalidadChange={setModalidad}
                        />
                    </section>
                    <OrderSummary items={items} subtotal={subtotal} costoEnvio={costoEnvio} modalidad={modalidad} />
                </div>
            )}
        </div>
    );
}
