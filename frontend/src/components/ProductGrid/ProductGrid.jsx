import ProductCard from '../ProductCard/ProductCard.jsx';
import './ProductGrid.css';

export default function ProductGrid({ productos, onAdd, label }) {
    return (
        <ul className="product-grid" aria-label={label}>
            {productos.map((producto) => (
                <li key={producto.id}>
                    <ProductCard producto={producto} onAdd={onAdd} />
                </li>
            ))}
        </ul>
    );
}
