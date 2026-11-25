import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { productoService } from '../services/productoService.js';
import { comboService } from '../services/comboService.js';
import { armarItemsParaRepetir } from '../utils/repetirPedido.js';

// Hook que devuelve una función para volver a cargar en el carrito los ítems de un pedido anterior.
export function useRepetirPedido() {
  const { agregar } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  return async (pedido) => {
    try {
      const [productos, combos] = await Promise.all([
        productoService.obtenerTodos(),
        comboService.obtenerTodos()
      ]);
      const { items, omitidos } = armarItemsParaRepetir(pedido.detalles, productos, combos);

      items.forEach(({ item, cantidad }) => agregar(item, cantidad));

      if (items.length === 0) {
        toast.error('Ninguno de los productos de ese pedido está disponible actualmente.');
        return;
      }
      if (omitidos.length > 0) {
        toast.info(`No se agregaron por no estar disponibles: ${omitidos.join(', ')}.`);
      }
      toast.exito('Los productos del pedido anterior se agregaron a tu pedido actual.');
      navigate('/carrito');
    } catch (err) {
      toast.error(err.message);
    }
  };
}
