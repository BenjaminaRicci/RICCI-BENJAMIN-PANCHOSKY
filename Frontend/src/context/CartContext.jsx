import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MAX_CANTIDAD } from '../utils/format.js';

const CartContext = createContext(null);
const CART_KEY = 'panchosky_carrito';

const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
};

// Clave única por ítem: un mismo combo con distinto pancho o bebida es un ítem distinto.
export const claveDeItem = ({ productoId, comboId, panchoId, bebidaId }) =>
  productoId ? `p-${productoId}` : `c-${comboId}-${panchoId}-${bebidaId}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const agregar = useCallback((nuevo, cantidad = 1) => {
    const clave = claveDeItem(nuevo);
    setItems((actuales) => {
      const existente = actuales.find((item) => item.clave === clave);
      if (!existente) {
        return [...actuales, { ...nuevo, clave, cantidad: Math.min(cantidad, MAX_CANTIDAD) }];
      }
      return actuales.map((item) =>
        item.clave === clave
          ? { ...item, cantidad: Math.min(item.cantidad + cantidad, MAX_CANTIDAD) }
          : item
      );
    });
  }, []);

  const cambiarCantidad = useCallback((clave, cantidad) => {
    const valida = Math.max(1, Math.min(cantidad, MAX_CANTIDAD));
    setItems((actuales) =>
      actuales.map((item) => (item.clave === clave ? { ...item, cantidad: valida } : item))
    );
  }, []);

  const quitar = useCallback(
    (clave) => setItems((actuales) => actuales.filter((item) => item.clave !== clave)),
    []
  );

  const vaciar = useCallback(() => setItems([]), []);

  const valor = useMemo(
    () => ({
      items,
      cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
      agregar,
      cambiarCantidad,
      quitar,
      vaciar
    }),
    [items, agregar, cambiarCantidad, quitar, vaciar]
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

// Formato esperado por POST /pedidos y /pedidos/cotizar.
export const itemsParaApi = (items) =>
  items.map(({ productoId, comboId, panchoId, bebidaId, cantidad }) =>
    productoId ? { productoId, cantidad } : { comboId, panchoId, bebidaId, cantidad }
  );
