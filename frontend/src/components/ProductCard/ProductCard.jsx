import { Link } from 'react-router-dom';
import Button from '../Button/Button.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import './ProductCard.css';

export default function ProductCard({ producto, onAdd }) {
    const { id, nombre, descripcion, precio, imagen, disponible } = producto;

    return (
        <article className={`product-card ${disponible ? '' : 'product-card--unavailable'}`}>
            <div className="product-card__media">
                <ProductImage src={imagen} alt={nombre} className="product-card__image" />
            </div>
            <div className="product-card__body">
                <h3 className="product-card__title">
                    <Link to={`/productos/${id}`} className="product-card__link">
                        {nombre}
                    </Link>
                </h3>
                <p className="product-card__description">{descripcion}</p>
                <div className="product-card__footer">
                    <p className="product-card__price">{formatPrice(precio)}</p>
                    <Button
                        size="sm"
                        onClick={() => onAdd(producto)}
                        disabled={!disponible}
                        aria-label={disponible ? `Agregar ${nombre} al pedido` : `${nombre} no disponible`}
                    >
                        {disponible ? '+Agregar' : 'No disponible'}
                    </Button>
                </div>
            </div>
        </article>
    );
}
