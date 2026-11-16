import Button from '../Button/Button.jsx';
import './StatusMessage.css';

export default function StatusMessage({ type = 'info', title, message, actionLabel, onAction, children }) {
    return (
        <div className={`status-message status-message--${type}`} role={type === 'error' ? 'alert' : undefined}>
            {title && <p className="status-message__title">{title}</p>}
            {message && <p className="status-message__text">{message}</p>}
            {actionLabel && onAction && (
                <Button variant="dark" size="sm" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
            {children}
        </div>
    );
}
