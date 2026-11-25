import { request } from './api.js';

export const pedidoService = {
  cotizar: (datos) => request('/pedidos/cotizar', { method: 'POST', body: datos }),
  crear: (datos) => request('/pedidos', { method: 'POST', body: datos }),
  obtenerTodos: (filtros = {}) => {
    const query = new URLSearchParams(
      Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== undefined)
    ).toString();
    return request(`/pedidos${query ? `?${query}` : ''}`);
  },
  obtenerPorId: (id) => request(`/pedidos/${id}`),
  cancelar: (id) => request(`/pedidos/${id}/cancelar`, { method: 'PATCH' }),
  cambiarEstado: (id, estado) => request(`/pedidos/${id}/estado`, { method: 'PATCH', body: { estado } })
};
