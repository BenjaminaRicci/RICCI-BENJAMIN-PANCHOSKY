export const EstadoPedido = Object.freeze({
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparación',
    LISTO: 'Listo',
    EN_CAMINO: 'En camino',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado'
});

export const Modalidad = Object.freeze({
    ENVIO: 'envio',
    RETIRO: 'retiro'
});

export const MedioPago = Object.freeze({
    EFECTIVO: 'efectivo',
    DEBITO: 'debito',
    CREDITO: 'credito',
    MERCADO_PAGO: 'mercadopago',
    TRANSFERENCIA: 'transferencia'
});

export const MAX_CANTIDAD_POR_ITEM = 20;

// Estados a los que puede pasar un pedido (RN-11 y sección 5 de la documentación).
export const siguientesEstados = (estado, modalidad) => {
    switch (estado) {
        case EstadoPedido.PENDIENTE:
            return [EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO];
        case EstadoPedido.CONFIRMADO:
            return [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO];
        case EstadoPedido.EN_PREPARACION:
            return [EstadoPedido.LISTO];
        case EstadoPedido.LISTO:
            return modalidad === Modalidad.ENVIO
                ? [EstadoPedido.EN_CAMINO]
                : [EstadoPedido.FINALIZADO];
        case EstadoPedido.EN_CAMINO:
            return [EstadoPedido.FINALIZADO];
        default:
            return [];
    }
};
