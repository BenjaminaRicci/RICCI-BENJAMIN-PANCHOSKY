import Button from '../Button/Button.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { isComboVigente } from '../../utils/comboUtils.js';
import './ComboBanner.css';

export default function ComboBanner({ combo, onAdd }) {
    const { id, nombre, descripcion, precioOriginal, precioPromocional, horaLimite } = combo;
    const vigente = isComboVigente(horaLimite);
    const titleId = `combo-${id}-titulo`;

    return (
        <article className={`combo-banner ${vigente ? '' : 'combo-banner--expired'}`} aria-labelledby={titleId}>
            <div className="combo-banner__info">
                <p className="combo-banner__eyebrow">Oferta del día</p>
                <h3 id={titleId} className="combo-banner__title">
                    {nombre}
                </h3>
                <p className="combo-banner__description">
                    {descripcion}{' '}
                    {vigente ? `Hasta hoy a las ${horaLimite} hs.` : `La oferta finalizó a las ${horaLimite} hs.`}
                </p>
            </div>
            <div className="combo-banner__pricing">
                <p className="combo-banner__prices">
                    <span className="visually-hidden">Precio anterior:</span>
                    <s className="combo-banner__old-price">{formatPrice(precioOriginal)}</s>
                    <span className="visually-hidden">Precio promocional:</span>
                    <span className="combo-banner__price">{formatPrice(precioPromocional)}</span>
                </p>
                <Button
                    variant="light"
                    size="lg"
                    onClick={() => onAdd(combo)}
                    disabled={!vigente}
                    aria-label={vigente ? `Agregar ${nombre} al pedido` : `${nombre}: oferta finalizada`}
                >
                    {vigente ? '+Agregar' : 'Oferta finalizada'}
                </Button>
            </div>
        </article>
    );
}
