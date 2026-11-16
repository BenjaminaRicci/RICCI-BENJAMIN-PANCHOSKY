import Pedido from '../models/Pedido.js';
import DetallePedido from '../models/DetallePedido.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const pedidos = [];
const detalles = [];
const nextPedidoId = createIdGenerator(1);
const nextDetalleId = createIdGenerator(1);

class PedidoRepository {
    create({ estado, modalidad, direccion, medioPago, total, costoEnvio, usuarioId, sucursalId, items }) {
        const pedido = new Pedido(
            nextPedidoId(),
            new Date(),
            estado,
            modalidad,
            direccion,
            medioPago,
            total,
            costoEnvio,
            usuarioId,
            sucursalId
        );
        pedidos.push(pedido);

        items.forEach(({ cantidad, precioUnitario, productoId, comboId, nombre, seleccion }) => {
            detalles.push(
                new DetallePedido(
                    nextDetalleId(),
                    cantidad,
                    precioUnitario,
                    cantidad * precioUnitario,
                    pedido.id,
                    productoId,
                    comboId,
                    nombre,
                    seleccion
                )
            );
        });

        return this.#conDetalles(pedido);
    }

    findAll() {
        return pedidos.map((pedido) => this.#conDetalles(pedido));
    }

    findById(id) {
        const pedido = pedidos.find((p) => p.id === id);
        return pedido ? this.#conDetalles(pedido) : null;
    }

    updateEstado(id, estado) {
        const pedido = pedidos.find((p) => p.id === id);
        if (!pedido) {
            return null;
        }
        pedido.estado = estado;
        return this.#conDetalles(pedido);
    }

    #conDetalles(pedido) {
        return { ...pedido, detalles: detalles.filter((detalle) => detalle.pedidoId === pedido.id) };
    }
}

export default new PedidoRepository();
