import { getToken } from '../utils/authStorage.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

let handleUnauthorized = () => {};

export function setUnauthorizedHandler(handler) {
    handleUnauthorized = handler;
}

// Único punto donde se usa fetch: arma la URL, agrega el token, procesa la respuesta y lanza errores.
export async function request(endpoint, { method = 'GET', body } = {}) {
    const token = getToken();
    const headers = {};
    if (body) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch {
        throw new Error('No se pudo conectar con el servidor. Verificá que la API esté en funcionamiento.');
    }

    const payload = await response.json().catch(() => null);

    if (response.status === 401 && token) {
        handleUnauthorized();
    }

    if (!response.ok) {
        throw new Error(payload?.message ?? `Error ${response.status} al comunicarse con el servidor.`);
    }

    return payload?.data;
}
