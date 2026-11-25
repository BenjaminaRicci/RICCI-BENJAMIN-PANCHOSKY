const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'panchosky_token';

export const AUTH_EXPIRED_EVENT = 'panchosky:auth-expired';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// sessionStorage: cada pestaña mantiene su propia sesión (útil para probar cliente y empleado a la vez).
export const tokenStorage = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY)
};

// Único punto de acceso HTTP: agrega el token, interpreta { success, data, message } y normaliza los errores.
export async function request(path, { method = 'GET', body } = {}) {
  const token = tokenStorage.get();

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.', 0);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    if (response.status === 401 && token) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(payload?.message ?? 'Ocurrió un error inesperado.', response.status);
  }

  return payload.data;
}
