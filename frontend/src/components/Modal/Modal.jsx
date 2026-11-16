import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '../../hooks/useDialog.js';
import './Modal.css';

export default function Modal({ isOpen, title, onClose, size = 'md', children }) {
    const dialogRef = useRef(null);
    const titleId = useId();

    useDialog(isOpen, onClose, dialogRef);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div
                ref={dialogRef}
                className={`modal modal--${size}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="modal__header">
                    <h2 id={titleId} className="modal__title">
                        {title}
                    </h2>
                    <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar ventana">
                        ×
                    </button>
                </div>
                <div className="modal__body">{children}</div>
            </div>
        </div>,
        document.body
    );
}
