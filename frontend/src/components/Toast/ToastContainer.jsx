import './Toast.css';

const TITULOS = {
    success: 'Listo',
    error: 'Error'
};

export default function ToastContainer({ toasts, onDismiss }) {
    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map(({ id, type, message }) => (
                <div
                    key={id}
                    className={`toast toast--${type}`}
                    role={type === 'error' ? 'alert' : 'status'}
                >
                    <span className="toast__icon" aria-hidden="true">
                        {type === 'error' ? '!' : '✓'}
                    </span>
                    <div className="toast__content">
                        <p className="toast__title">{TITULOS[type]}</p>
                        <p className="toast__message">{message}</p>
                    </div>
                    <button
                        type="button"
                        className="toast__close"
                        onClick={() => onDismiss(id)}
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
