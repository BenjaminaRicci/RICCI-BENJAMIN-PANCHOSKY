import { request } from './apiClient.js';

export function obtenerSucursales() {
    return request('/sucursales');
}
