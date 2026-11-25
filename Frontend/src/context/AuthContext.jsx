import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { AUTH_EXPIRED_EVENT, tokenStorage } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(Boolean(tokenStorage.get()));

  // Si hay un token guardado, se recupera la sesión consultando el perfil al backend.
  useEffect(() => {
    if (!tokenStorage.get()) {
      return;
    }
    authService
      .obtenerPerfil()
      .then(setUsuario)
      .catch(() => tokenStorage.clear())
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, alExpirar);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, alExpirar);
  }, []);

  const login = useCallback(async (email, password) => {
    const datos = await authService.login(email, password);
    setUsuario(datos);
    return datos;
  }, []);

  const registrar = useCallback(async (datosRegistro) => {
    const datos = await authService.registrar(datosRegistro);
    setUsuario(datos);
    return datos;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, login, registrar, logout }),
    [usuario, cargando, login, registrar, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
