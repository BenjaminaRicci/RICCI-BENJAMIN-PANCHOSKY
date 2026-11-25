import { request, tokenStorage } from './api.js';

export const authService = {
  async login(email, password) {
    const data = await request('/auth/login', { method: 'POST', body: { email, password } });
    tokenStorage.set(data.token);
    return data.usuario;
  },

  async registrar(datos) {
    const data = await request('/auth/registro', { method: 'POST', body: datos });
    tokenStorage.set(data.token);
    return data.usuario;
  },

  obtenerPerfil: () => request('/auth/perfil'),

  logout: () => tokenStorage.clear()
};
