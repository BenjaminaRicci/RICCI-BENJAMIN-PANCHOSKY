import PedidoService from '../services/PedidoService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId, parseIdOpcional } from '../utils/parseId.js';

class PedidoController {
    cotizar = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.cotizar(req.body));
    });

    crear = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.crear(req.body, req.usuario), 201);
    });

    obtenerTodos = asyncHandler((req, res) => {
        const pedidos = PedidoService.obtenerTodos(req.usuario, {
            estado: req.query.estado,
            sucursalId: parseIdOpcional(req.query.sucursalId)
        });
        sendSuccess(res, pedidos);
    });

    obtenerPorId = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.obtenerPorId(parseId(req.params.id), req.usuario));
    });

    cambiarEstado = asyncHandler((req, res) => {
        const pedido = PedidoService.cambiarEstado(
            parseId(req.params.id),
            req.body.estado,
            req.usuario
        );
        sendSuccess(res, pedido);
    });

    cancelar = asyncHandler((req, res) => {
        sendSuccess(res, PedidoService.cancelar(parseId(req.params.id), req.usuario));
    });
}

export default new PedidoController();
