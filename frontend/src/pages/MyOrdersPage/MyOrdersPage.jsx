import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import OrderCard from '../../components/OrderCard/OrderCard.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { cancelarPedido, obtenerMisPedidos } from '../../services/pedidoService.js';
import { obtenerProductos } from '../../services/productoService.js';
import { obtenerCombos } from '../../services/comboService.js';
import { isComboVigente } from '../../utils/comboUtils.js';

export default function MyOrdersPage() {
    useDocumentTitle('Mis pedidos');
    const pedidos = useFetch(obtenerMisPedidos);
    const { data: productos } = useFetch(obtenerProductos);
    const { data: combos } = useFetch(obtenerCombos);
    const { addItem, openCart } = useCart();
    const notify = useNotification();
    const [pedidoACancelar, setPedidoACancelar] = useState(null);
    const [cancelando, setCancelando] = useState(false);

    const handleCancelar = async () => {
        setCancelando(true);
        try {
            const actualizado = await cancelarPedido(pedidoACancelar.id);
            pedidos.setData((lista) => lista.map((pedido) => (pedido.id === actualizado.id ? actualizado : pedido)));
            notify.success(`El pedido #${actualizado.id} fue cancelado.`);
            setPedidoACancelar(null);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setCancelando(false);
        }
    };

    // Usa los precios actuales del catálogo y omite lo que ya no está disponible.
    const handleRepetir = (pedido) => {
        let omitidos = 0;
        pedido.detalles.forEach((detalle) => {
            if (detalle.productoId) {
                const producto = productos?.find(({ id }) => id === detalle.productoId);
                if (!producto?.disponible) {
                    omitidos += 1;
                    return;
                }
                const { id, nombre, precio, imagen } = producto;
                addItem({ tipo: 'producto', id, nombre, precio, imagen }, detalle.cantidad, { silent: true });
                return;
            }

            const combo = combos?.find(({ id }) => id === detalle.comboId);
            const seleccion = detalle.seleccion?.map(({ productoId }) => productoId) ?? [];
            const elegidos = seleccion.map((id) => productos?.find((producto) => producto.id === id));
            if (!combo || !isComboVigente(combo.horaLimite) || elegidos.some((producto) => !producto?.disponible)) {
                omitidos += 1;
                return;
            }
            addItem(
                {
                    tipo: 'combo',
                    id: combo.id,
                    nombre: combo.nombre,
                    precio: combo.precioPromocional,
                    imagen: combo.imagen,
                    seleccion,
                    detalle: elegidos.map(({ nombre }) => nombre).join(' + ')
                },
                detalle.cantidad,
                { silent: true }
            );
        });

        if (omitidos === pedido.detalles.length) {
            notify.error('Ningún producto de este pedido está disponible ahora.');
            return;
        }
        notify.success(
            omitidos > 0
                ? `Agregamos el pedido a tu carrito, salvo ${omitidos} producto(s) que no están disponibles.`
                : 'Agregamos el pedido a tu carrito con los precios actuales.'
        );
        openCart();
    };

    return (
        <div className="container section">
            <div className="page__header">
                <h1 className="page__title">Mis pedidos</h1>
            </div>

            <AsyncState
                loading={pedidos.loading}
                error={pedidos.error}
                onRetry={pedidos.reload}
                loadingText="Cargando tus pedidos..."
                isEmpty={!pedidos.data?.length}
                emptyTitle="Todavía no hiciste pedidos"
                emptyMessage="Cuando confirmes un pedido lo vas a ver acá con su estado."
            >
                <div className="page__stack">
                    {pedidos.data?.map((pedido) => (
                        <OrderCard key={pedido.id} pedido={pedido}>
                            {pedido.cancelable && (
                                <Button size="sm" variant="danger" onClick={() => setPedidoACancelar(pedido)}>
                                    Cancelar pedido
                                </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleRepetir(pedido)} disabled={!productos}>
                                Repetir pedido
                            </Button>
                        </OrderCard>
                    ))}
                </div>
            </AsyncState>

            {pedidos.data?.length === 0 && (
                <Button as={Link} to="/productos">
                    Ver el menú
                </Button>
            )}

            <ConfirmDialog
                isOpen={Boolean(pedidoACancelar)}
                title="Cancelar pedido"
                message={`¿Seguro que querés cancelar el pedido #${pedidoACancelar?.id}? Esta acción no se puede deshacer.`}
                confirmLabel="Sí, cancelar"
                loading={cancelando}
                onConfirm={handleCancelar}
                onCancel={() => setPedidoACancelar(null)}
            />
        </div>
    );
}
