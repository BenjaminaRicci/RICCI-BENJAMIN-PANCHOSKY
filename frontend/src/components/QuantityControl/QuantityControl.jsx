import './QuantityControl.css';

export default function QuantityControl({ value, onChange, min = 1, max, itemLabel }) {
    return (
        <div className="quantity" role="group" aria-label={`Cantidad de ${itemLabel}`}>
            <button
                type="button"
                className="quantity__button"
                onClick={() => onChange(value - 1)}
                disabled={value <= min}
                aria-label={`Restar una unidad de ${itemLabel}`}
            >
                −
            </button>
            <span className="quantity__value" aria-live="polite">
                {value}
            </span>
            <button
                type="button"
                className="quantity__button"
                onClick={() => onChange(value + 1)}
                disabled={max !== undefined && value >= max}
                aria-label={`Sumar una unidad de ${itemLabel}`}
            >
                +
            </button>
        </div>
    );
}
