import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import StatusMessage from '../../components/StatusMessage/StatusMessage.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function NotFoundPage() {
    useDocumentTitle('Página no encontrada');

    return (
        <div className="container section">
            <h1 className="visually-hidden">Página no encontrada</h1>
            <StatusMessage title="Página no encontrada" message="La página que buscás no existe o fue movida.">
                <Button as={Link} to="/" size="sm">
                    Volver al inicio
                </Button>
            </StatusMessage>
        </div>
    );
}
