import './Loader.css';

export default function Loader({ text = 'Cargando...' }) {
    return (
        <div className="loader" role="status">
            <span className="loader__spinner" aria-hidden="true" />
            <span className="loader__text">{text}</span>
        </div>
    );
}
