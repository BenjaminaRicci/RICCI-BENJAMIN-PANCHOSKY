import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import OrderCard from '../../components/OrderCard/OrderCard.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { cambiarEstadoPedido, obtenerPedidos } from '../../services/pedidoService.js';
import { obtenerSucursales } from '../../services/sucursalService.js';
import { ESTADOS_PEDIDO } from '../../utils/pedidoEstados.js';
import { ROLES } from '../../utils/roles.js';

const CANCELADO = 'Cancelado';

export default function AdminOrdersPage() {
    useDocumentTitle('Pedidos');
    const { usuario } = useAuth();
    const notify = useNotification();
    const esAdmin = usuario.rol === ROLES.ADMINISTRADOR;
    const [searchParams, setSearchParams] = useSearchParams();
    const estado = searchParams.get('estado') ?? '';
    const sucursalId = searchParams.get('sucursal') ?? '';

    const fetchPedidos = useCallback(() => obtenerPedidos({ estado, sucursalId }), [estado, sucursalId]);
    const pedidos = useFetch(fetchPedidos);
    const { data: sucursales } = useFetch(obtenerSucursales);
    const [actualizandoId, setActualizandoId] = useState(null);
    const [pedidoACancelar, setPedidoACancelar] = useState(null);

    const actualizarFiltro = (clave, valor) => {
        setSearchParams(
            (actuales) => {
                const siguientes = new URLSearchParams(actuales);
                if (valor) {
                    siguientes.set(clave, valor);
                } else {
                    siguientes.delete(clave);
                }
                return siguientes;
            },
            { replace: true }
        );
    };

    const cambiarEstado = async (pedido, nuevoEstado) => {
        setActualizandoId(pedido.id);
        try {
            const actualizado = await cambiarEstadoPedido(pedido.id, nuevoEstado);
            pedidos.setData((lista) =>
                lista
                    .map((item) => (item.id === actualizado.id ? actualizado : item))
                    .filter((item) => !estado || item.estado === estado)
            );
            notify.success(`Pedido #${actualizado.id}: ${actualizado.estado}.`);
            setPedidoACancelar(null);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setActualizandoId(null);
        }
    };

    return (
        <section aria-labelledby="pedidos-titulo">
            <div className="page__header">
                <h2 id="pedidos-titulo" className="page__subtitle">
                    Pedidos {!esAdmin && sucursales && `· ${sucursales.find(({ id }) => id === usuario.sucursalId)?.nombre ?? ''}`}
                </h2>
                <Button size="sm" variant="outline" onClick={pedidos.reload}>
                    Actualizar
                </Button>
            </div>

            <div className="filters">
                <FormField
                    id="filtro-estado"
                    as="select"
                    label="Estado"
                    value={estado}
                    onChange={(event) => actualizarFiltro('estado', event.target.value)}
                >
                    <option value="">Todos</option>
                    {ESTADOS_PEDIDO.map((opcion) => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </FormField>
                {esAdmin && (
                    <FormField
                        id="filtro-sucursal"
                        as="select"
                        label="Sucursal"
                        value={sucursalId}
                        onChange={(event) => actualizarFiltro('sucursal', event.target.value)}
                    >
                        <option value="">Todas</option>
                        {sucursales?.map(({ id, nombre }) => (
                            <option key={id} value={id}>
                                {nombre}
                            </option>
                        ))}
                    </FormField>
                )}
            </div>

            <AsyncState
                loading={pedidos.loading}
                error={pedidos.error}
                onRetry={pedidos.reload}
                loadingText="Cargando pedidos..."
                isEmpty={!pedidos.data?.length}
                emptyTitle="No hay pedidos"
                emptyMessage="Cuando los clientes hagan pedidos van a aparecer acá."
            >
                <div className="page__stack">
                    {pedidos.data?.map((pedido) => (
                        <OrderCard key={pedido.id} pedido={pedido}>
                            {pedido.estadosSiguientes.map((siguiente) => (
                                <Button
                                    key={siguiente}
                                    size="sm"
                                    variant={siguiente === CANCELADO ? 'danger' : 'primary'}
                                    loading={actualizandoId === pedido.id && siguiente !== CANCELADO}
                                    disabled={actualizandoId === pedido.id}
                                    onClick={() =>
                                        siguiente === CANCELADO ? setPedidoACancelar(pedido) : cambiarEstado(pedido, siguiente)
                                    }
                                >
                                    {siguiente === CANCELADO ? 'Cancelar' : `Pasar a «${siguiente}»`}
                                </Button>
                            ))}
                        </OrderCard>
                    ))}
                </div>
            </AsyncState>

            <ConfirmDialog
                isOpen={Boolean(pedidoACancelar)}
                title="Cancelar pedido"
                message={`¿Seguro que querés cancelar el pedido #${pedidoACancelar?.id}? El cliente verá el pedido como cancelado.`}
                confirmLabel="Sí, cancelar"
                loading={actualizandoId === pedidoACancelar?.id}
                onConfirm={() => cambiarEstado(pedidoACancelar, CANCELADO)}
                onCancel={() => setPedidoACancelar(null)}
            />
        </section>
    );
}
