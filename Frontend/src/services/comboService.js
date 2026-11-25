import { request } from './api.js';

export const comboService = {
  obtenerTodos: () => request('/combos'),
  crear: (datos) => request('/combos', { method: 'POST', body: datos }),
  actualizar: (id, datos) => request(`/combos/${id}`, { method: 'PUT', body: datos }),
  eliminar: (id) => request(`/combos/${id}`, { method: 'DELETE' })
};
