import Pedido from '../models/Pedido.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const pedidos = [];
const nextId = createIdGenerator(1);

class PedidoRepository {
    findAll() {
        return pedidos;
    }

    findById(id) {
        return pedidos.find((pedido) => pedido.id === id);
    }

    findByUsuarioId(usuarioId) {
        return pedidos.filter((pedido) => pedido.usuarioId === usuarioId);
    }

    findBySucursalId(sucursalId) {
        return pedidos.filter((pedido) => pedido.sucursalId === sucursalId);
    }

    create({ estado, modalidad, direccion, medioPago, total, costoEnvio, usuarioId, sucursalId, zona, historial }) {
        const pedido = new Pedido(
            nextId(),
            new Date().toISOString(),
            estado,
            modalidad,
            direccion,
            medioPago,
            total,
            costoEnvio,
            usuarioId,
            sucursalId,
            zona,
            historial
        );
        pedidos.push(pedido);
        return pedido;
    }

    cambiarEstado(id, estado, registro) {
        const pedido = this.findById(id);
        if (!pedido) {
            return null;
        }
        pedido.estado = estado;
        pedido.historial.push(registro);
        return pedido;
    }
}

export default new PedidoRepository();
