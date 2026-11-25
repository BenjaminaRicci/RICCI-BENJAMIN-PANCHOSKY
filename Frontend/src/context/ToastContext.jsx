import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrar = useCallback((tipo, mensaje) => {
    const id = crypto.randomUUID();
    setToasts((actuales) => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => setToasts((actuales) => actuales.filter((toast) => toast.id !== id)), 5000);
  }, []);

  const api = useMemo(
    () => ({
      exito: (mensaje) => mostrar('exito', mensaje),
      error: (mensaje) => mostrar('error', mensaje),
      info: (mensaje) => mostrar('info', mensaje)
    }),
    [mostrar]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tipo}`}>
            {toast.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
