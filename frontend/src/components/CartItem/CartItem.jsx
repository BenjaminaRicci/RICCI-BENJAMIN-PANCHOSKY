import Button from '../Button/Button.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import QuantityControl from '../QuantityControl/QuantityControl.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { CANTIDAD_MAXIMA_POR_ITEM } from '../../utils/pedidoRules.js';
import './CartItem.css';

export default function CartItem({ item }) {
    const { updateQuantity, removeItem } = useCart();
    const { key, nombre, detalle, precio, imagen, cantidad } = item;

    return (
        <li className="cart-item">
            <ProductImage src={imagen} alt="" className="cart-item__image" />
            <div className="cart-item__info">
                <p className="cart-item__name">{nombre}</p>
                {detalle && <p className="cart-item__detail">{detalle}</p>}
                <p className="cart-item__price">
                    {formatPrice(precio * cantidad)}
                    {cantidad > 1 && <span className="cart-item__unit"> ({formatPrice(precio)} c/u)</span>}
                </p>
                <div className="cart-item__controls">
                    <QuantityControl
                        value={cantidad}
                        max={CANTIDAD_MAXIMA_POR_ITEM}
                        itemLabel={nombre}
                        onChange={(nuevaCantidad) => updateQuantity(key, nuevaCantidad)}
                    />
                    <Button variant="link" onClick={() => removeItem(key)} aria-label={`Quitar ${nombre} del pedido`}>
                        Quitar
                    </Button>
                </div>
            </div>
        </li>
    );
}
