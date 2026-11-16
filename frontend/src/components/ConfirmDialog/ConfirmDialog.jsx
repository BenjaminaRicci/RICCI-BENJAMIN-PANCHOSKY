import Modal from '../Modal/Modal.jsx';
import Button from '../Button/Button.jsx';
import './ConfirmDialog.css';

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirmar',
    loading = false,
    onConfirm,
    onCancel
}) {
    const handleClose = () => {
        if (!loading) {
            onCancel();
        }
    };

    return (
        <Modal isOpen={isOpen} title={title} onClose={handleClose} size="sm">
            <p className="confirm-dialog__message">{message}</p>
            <div className="confirm-dialog__actions">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm} loading={loading} loadingText="Eliminando...">
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
