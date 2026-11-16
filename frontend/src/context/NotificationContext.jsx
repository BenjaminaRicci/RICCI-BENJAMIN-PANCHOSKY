import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastContainer from '../components/Toast/ToastContainer.jsx';

const NotificationContext = createContext(null);

const DURACION_MS = {
    success: 4000,
    error: 6000
};

let nextId = 0;

export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((actuales) => actuales.filter((toast) => toast.id !== id));
    }, []);

    const notify = useCallback(
        (type, message) => {
            nextId += 1;
            const id = nextId;
            setToasts((actuales) => [...actuales, { id, type, message }]);
            setTimeout(() => dismiss(id), DURACION_MS[type]);
        },
        [dismiss]
    );

    const value = useMemo(
        () => ({
            success: (message) => notify('success', message),
            error: (message) => notify('error', message)
        }),
        [notify]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe usarse dentro de NotificationProvider.');
    }
    return context;
}
