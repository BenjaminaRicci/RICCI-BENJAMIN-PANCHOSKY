import { request } from './apiClient.js';

const ENDPOINT = '/combos';

export function obtenerCombos() {
    return request(ENDPOINT);
}

export function crearCombo(combo) {
    return request(ENDPOINT, { method: 'POST', body: combo });
}

export function actualizarCombo(id, combo) {
    return request(`${ENDPOINT}/${id}`, { method: 'PUT', body: combo });
}

export function eliminarCombo(id) {
    return request(`${ENDPOINT}/${id}`, { method: 'DELETE' });
}
