import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNotification } from './NotificationContext.jsx';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';
import { CANTIDAD_MAXIMA_POR_ITEM } from '../utils/pedidoRules.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'panchosky-carrito';

// Descarta combos guardados sin la elección de productos que exige RN-08.
const cargarCarrito = () =>
    loadFromStorage(STORAGE_KEY, []).filter((item) => item.tipo !== 'combo' || Array.isArray(item.seleccion));

export function CartProvider({ children }) {
    const notify = useNotification();
    const [items, setItems] = useState(cargarCarrito);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        saveToStorage(STORAGE_KEY, items);
    }, [items]);

    const addItem = useCallback(
        ({ tipo, id, nombre, precio, imagen = '', seleccion = null, detalle = '' }, cantidad = 1, { silent = false } = {}) => {
            const key = seleccion ? `${tipo}-${id}-${seleccion.join('-')}` : `${tipo}-${id}`;
            const existente = items.find((item) => item.key === key);

            if ((existente?.cantidad ?? 0) + cantidad > CANTIDAD_MAXIMA_POR_ITEM) {
                notify.error(`Podés agregar hasta ${CANTIDAD_MAXIMA_POR_ITEM} unidades de ${nombre}.`);
                return;
            }

            setItems((actuales) =>
                actuales.some((item) => item.key === key)
                    ? actuales.map((item) =>
                          item.key === key ? { ...item, cantidad: item.cantidad + cantidad } : item
                      )
                    : [...actuales, { key, tipo, id, nombre, precio, imagen, seleccion, detalle, cantidad }]
            );
            if (!silent) {
                notify.success(`${nombre} se agregó a tu pedido.`);
            }
        },
        [items, notify]
    );

    const updateQuantity = useCallback((key, cantidad) => {
        const cantidadValida = Math.min(Math.max(cantidad, 1), CANTIDAD_MAXIMA_POR_ITEM);
        setItems((actuales) =>
            actuales.map((item) => (item.key === key ? { ...item, cantidad: cantidadValida } : item))
        );
    }, []);

    const removeItem = useCallback(
        (key) => {
            const item = items.find((actual) => actual.key === key);
            setItems((actuales) => actuales.filter((actual) => actual.key !== key));
            if (item) {
                notify.success(`${item.nombre} se quitó de tu pedido.`);
            }
        },
        [items, notify]
    );

    const clearCart = useCallback(() => setItems([]), []);
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const value = useMemo(() => {
        const subtotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0);
        const totalItems = items.reduce((total, item) => total + item.cantidad, 0);

        return {
            items,
            subtotal,
            totalItems,
            isOpen,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            openCart,
            closeCart
        };
    }, [items, isOpen, addItem, updateQuantity, removeItem, clearCart, openCart, closeCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider.');
    }
    return context;
}
