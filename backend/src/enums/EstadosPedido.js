import { Modalidades } from './ReglasPedido.js';

export const EstadosPedido = Object.freeze({
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparación',
    LISTO: 'Listo',
    EN_CAMINO: 'En camino',
    LISTO_PARA_RETIRAR: 'Listo para retirar',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado'
});

// RN-11: el cliente solo puede cancelar en estos estados.
export const EstadosCancelables = Object.freeze([EstadosPedido.PENDIENTE, EstadosPedido.CONFIRMADO]);

// Transiciones permitidas (sección 5 del documento): no se pueden saltar etapas.
export const obtenerEstadosSiguientes = (pedido) => {
    switch (pedido.estado) {
        case EstadosPedido.PENDIENTE:
            return [EstadosPedido.CONFIRMADO, EstadosPedido.CANCELADO];
        case EstadosPedido.CONFIRMADO:
            return [EstadosPedido.EN_PREPARACION, EstadosPedido.CANCELADO];
        case EstadosPedido.EN_PREPARACION:
            return [EstadosPedido.LISTO];
        case EstadosPedido.LISTO:
            return pedido.modalidad === Modalidades.ENVIO
                ? [EstadosPedido.EN_CAMINO]
                : [EstadosPedido.LISTO_PARA_RETIRAR];
        case EstadosPedido.EN_CAMINO:
        case EstadosPedido.LISTO_PARA_RETIRAR:
            return [EstadosPedido.FINALIZADO];
        default:
            return [];
    }
};
