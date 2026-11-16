import { request } from './apiClient.js';

const ENDPOINT = '/productos';

export function obtenerProductos() {
    return request(ENDPOINT);
}

export function obtenerProducto(id) {
    return request(`${ENDPOINT}/${id}`);
}

export function cambiarDisponibilidad(id, disponible) {
    return request(`${ENDPOINT}/${id}/disponibilidad`, { method: 'PATCH', body: { disponible } });
}

export function crearProducto(producto) {
    return request(ENDPOINT, { method: 'POST', body: producto });
}

export function actualizarProducto(id, producto) {
    return request(`${ENDPOINT}/${id}`, { method: 'PUT', body: producto });
}

export function eliminarProducto(id) {
    return request(`${ENDPOINT}/${id}`, { method: 'DELETE' });
}
