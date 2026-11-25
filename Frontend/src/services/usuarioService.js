import { request } from './api.js';

export const usuarioService = {
  obtenerTodos: () => request('/usuarios'),
  crearEmpleado: (datos) => request('/usuarios/empleados', { method: 'POST', body: datos }),
  eliminar: (id) => request(`/usuarios/${id}`, { method: 'DELETE' })
};
