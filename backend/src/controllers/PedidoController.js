import PedidoService from '../services/PedidoService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

class PedidoController {
    crear = asyncHandler((req, res) => {
        const pedido = PedidoService.crear(req.body ?? {}, req.usuario);
        sendSuccess(res, pedido, 201);
    });

    obtenerMios = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.obtenerMios(req.usuario));
    });

    obtenerTodos = asyncHandler((req, res) => {
        const { estado, sucursalId } = req.query;
        sendSuccess(res, PedidoService.obtenerTodos(req.usuario, { estado, sucursalId }));
    });

    obtenerPorId = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.obtenerPorId(parseId(req.params.id), req.usuario));
    });

    cancelar = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.cancelar(parseId(req.params.id), req.usuario));
    });

    cambiarEstado = asyncHandler((req, res) => {
        const pedido = PedidoService.cambiarEstado(parseId(req.params.id), req.body?.estado, req.usuario);
        sendSuccess(res, pedido);
    });
}

export default new PedidoController();
