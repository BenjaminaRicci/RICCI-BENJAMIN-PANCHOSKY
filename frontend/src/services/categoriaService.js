import { request } from './apiClient.js';

const ENDPOINT = '/categorias';

export function obtenerCategorias() {
    return request(ENDPOINT);
}

export function crearCategoria(categoria) {
    return request(ENDPOINT, { method: 'POST', body: categoria });
}

export function actualizarCategoria(id, categoria) {
    return request(`${ENDPOINT}/${id}`, { method: 'PUT', body: categoria });
}

export function eliminarCategoria(id) {
    return request(`${ENDPOINT}/${id}`, { method: 'DELETE' });
}
