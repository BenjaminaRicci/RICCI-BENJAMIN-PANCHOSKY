import { request } from './api.js';

export const categoriaService = {
  obtenerTodas: () => request('/categorias')
};

export const sucursalService = {
  obtenerTodas: () => request('/sucursales')
};

export const configuracionService = {
  obtener: () => request('/configuracion'),
  actualizar: (datos) => request('/configuracion', { method: 'PUT', body: datos })
};
