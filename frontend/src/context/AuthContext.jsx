import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNotification } from './NotificationContext.jsx';
import { getSesion, saveSesion } from '../utils/authStorage.js';
import { setUnauthorizedHandler } from '../services/apiClient.js';
import { iniciarSesion, obtenerPerfil, registrarUsuario } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const notify = useNotification();
    const [sesion, setSesion] = useState(getSesion);

    useEffect(() => {
        saveSesion(sesion);
    }, [sesion]);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            setSesion(null);
            notify.error('Tu sesión expiró. Volvé a iniciar sesión.');
        });
    }, [notify]);

    // Valida el token guardado y refresca los datos del usuario al abrir la app.
    useEffect(() => {
        if (!getSesion()?.token) {
            return;
        }
        obtenerPerfil()
            .then((usuario) => setSesion((actual) => (actual ? { ...actual, usuario } : actual)))
            .catch(() => {});
    }, []);

    const login = useCallback(async (credenciales) => {
        const nuevaSesion = await iniciarSesion(credenciales);
        setSesion(nuevaSesion);
        return nuevaSesion.usuario;
    }, []);

    const registrar = useCallback(async (datos) => {
        const nuevaSesion = await registrarUsuario(datos);
        setSesion(nuevaSesion);
        return nuevaSesion.usuario;
    }, []);

    const logout = useCallback(() => setSesion(null), []);

    const actualizarUsuario = useCallback(
        (usuario) => setSesion((actual) => (actual ? { ...actual, usuario } : actual)),
        []
    );

    const value = useMemo(() => {
        const usuario = sesion?.usuario ?? null;
        return {
            usuario,
            isAuthenticated: Boolean(usuario),
            hasRole: (...roles) => Boolean(usuario) && roles.includes(usuario.rol),
            login,
            registrar,
            logout,
            actualizarUsuario
        };
    }, [sesion, login, registrar, logout, actualizarUsuario]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider.');
    }
    return context;
}
