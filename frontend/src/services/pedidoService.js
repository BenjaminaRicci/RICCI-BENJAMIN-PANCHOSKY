import { request } from './apiClient.js';

const ENDPOINT = '/pedidos';

export function crearPedido(pedido) {
    return request(ENDPOINT, { method: 'POST', body: pedido });
}

export function obtenerMisPedidos() {
    return request(`${ENDPOINT}/mios`);
}

export function obtenerPedidos(filtros = {}) {
    const params = new URLSearchParams(Object.entries(filtros).filter(([, valor]) => valor));
    const query = params.toString();
    return request(query ? `${ENDPOINT}?${query}` : ENDPOINT);
}

export function cancelarPedido(id) {
    return request(`${ENDPOINT}/${id}/cancelar`, { method: 'PATCH' });
}

export function cambiarEstadoPedido(id, estado) {
    return request(`${ENDPOINT}/${id}/estado`, { method: 'PATCH', body: { estado } });
}
