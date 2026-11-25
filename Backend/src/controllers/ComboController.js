import ComboService from '../services/ComboService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

class ComboController {
    obtenerTodos = asyncHandler((req, res) => {
        sendSuccess(res, ComboService.obtenerTodos());
    });

    crear = asyncHandler((req, res) => {
        sendSuccess(res, ComboService.crear(req.body), 201);
    });

    actualizar = asyncHandler((req, res) => {
        sendSuccess(res, ComboService.actualizar(parseId(req.params.id), req.body));
    });

    eliminar = asyncHandler((req, res) => {
        ComboService.eliminar(parseId(req.params.id));
        sendSuccess(res, null);
    });
}

export default new ComboController();
