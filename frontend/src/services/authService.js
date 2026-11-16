import { request } from './apiClient.js';

export function iniciarSesion(credenciales) {
    return request('/auth/login', { method: 'POST', body: credenciales });
}

export function registrarUsuario(datos) {
    return request('/auth/registro', { method: 'POST', body: datos });
}

export function obtenerPerfil() {
    return request('/auth/perfil');
}

export function actualizarPerfil(datos) {
    return request('/auth/perfil', { method: 'PUT', body: datos });
}
