import DetallePedido from '../models/DetallePedido.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const detalles = [];
const nextId = createIdGenerator(1);

class DetallePedidoRepository {
    findByPedidoId(pedidoId) {
        return detalles.filter((detalle) => detalle.pedidoId === pedidoId);
    }

    existsByProductoId(productoId) {
        return detalles.some(
            (detalle) =>
                detalle.productoId === productoId ||
                detalle.panchoId === productoId ||
                detalle.bebidaId === productoId
        );
    }

    create({ cantidad, precioUnitario, pedidoId, productoId, comboId, nombre, panchoId, bebidaId }) {
        const detalle = new DetallePedido(
            nextId(),
            cantidad,
            precioUnitario,
            cantidad * precioUnitario,
            pedidoId,
            productoId ?? null,
            comboId ?? null,
            nombre,
            panchoId ?? null,
            bebidaId ?? null
        );
        detalles.push(detalle);
        return detalle;
    }
}

export default new DetallePedidoRepository();
