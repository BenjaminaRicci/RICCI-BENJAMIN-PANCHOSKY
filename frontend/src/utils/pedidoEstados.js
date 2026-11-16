// Estados del pedido (sección 5 del documento). Las transiciones válidas las informa la API.
export const ESTADOS_PEDIDO = [
    'Pendiente',
    'Confirmado',
    'En preparación',
    'Listo',
    'En camino',
    'Listo para retirar',
    'Finalizado',
    'Cancelado'
];

const TONO_POR_ESTADO = {
    Pendiente: 'warning',
    Confirmado: 'info',
    'En preparación': 'info',
    Listo: 'info',
    'En camino': 'info',
    'Listo para retirar': 'info',
    Finalizado: 'success',
    Cancelado: 'error'
};

export function tonoEstado(estado) {
    return TONO_POR_ESTADO[estado] ?? 'info';
}

const fechaFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

export function formatFecha(fechaIso) {
    return fechaFormatter.format(new Date(fechaIso));
}
