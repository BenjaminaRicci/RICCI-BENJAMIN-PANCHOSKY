import { request } from './api.js';

export const productoService = {
  obtenerTodos: () => request('/productos'),
  crear: (datos) => request('/productos', { method: 'POST', body: datos }),
  actualizar: (id, datos) => request(`/productos/${id}`, { method: 'PUT', body: datos }),
  cambiarDisponibilidad: (id, disponible) =>
    request(`/productos/${id}/disponibilidad`, { method: 'PATCH', body: { disponible } }),
  eliminar: (id) => request(`/productos/${id}`, { method: 'DELETE' })
};
