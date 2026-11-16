import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button.jsx';
import CartItem from '../CartItem/CartItem.jsx';
import StatusMessage from '../StatusMessage/StatusMessage.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useDialog } from '../../hooks/useDialog.js';
import { formatPrice } from '../../utils/formatPrice.js';
import './CartDrawer.css';

export default function CartDrawer() {
    const { items, subtotal, isOpen, closeCart } = useCart();
    const navigate = useNavigate();
    const panelRef = useRef(null);

    useDialog(isOpen, closeCart, panelRef);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        closeCart();
        navigate('/checkout');
    };

    return createPortal(
        <div className="cart-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeCart()}>
            <aside
                ref={panelRef}
                className="cart-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-titulo"
                tabIndex={-1}
            >
                <div className="cart-drawer__header">
                    <h2 id="cart-titulo" className="cart-drawer__title">
                        Tu pedido
                    </h2>
                    <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar tu pedido">
                        ×
                    </button>
                </div>

                <div className="cart-drawer__content">
                    {items.length === 0 ? (
                        <StatusMessage title="Tu pedido está vacío" message="Agregá productos desde el menú para empezar." />
                    ) : (
                        <ul className="cart-drawer__list" aria-label="Productos en tu pedido">
                            {items.map((item) => (
                                <CartItem key={item.key} item={item} />
                            ))}
                        </ul>
                    )}
                </div>

                <div className="cart-drawer__footer">
                    <div className="cart-drawer__total">
                        <span>Total</span>
                        <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <p className="cart-drawer__note">El costo de envío se calcula al confirmar.</p>
                    <Button block onClick={handleConfirm} disabled={items.length === 0}>
                        Confirmar pago
                    </Button>
                </div>
            </aside>
        </div>,
        document.body
    );
}
