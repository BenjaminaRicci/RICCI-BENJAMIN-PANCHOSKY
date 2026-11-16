import Loader from '../Loader/Loader.jsx';
import StatusMessage from '../StatusMessage/StatusMessage.jsx';

// Resuelve los estados comunes de una petición: carga, error con reintento y vacío.
export default function AsyncState({
    loading,
    error,
    onRetry,
    isEmpty = false,
    loadingText,
    emptyTitle = 'No hay resultados',
    emptyMessage,
    children
}) {
    if (loading) {
        return <Loader text={loadingText} />;
    }

    if (error) {
        return (
            <StatusMessage
                type="error"
                title="No pudimos cargar la información"
                message={error}
                actionLabel={onRetry ? 'Reintentar' : undefined}
                onAction={onRetry}
            />
        );
    }

    if (isEmpty) {
        return <StatusMessage title={emptyTitle} message={emptyMessage} />;
    }

    return children;
}
