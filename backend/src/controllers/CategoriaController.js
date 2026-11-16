import CategoriaService from '../services/CategoriaService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

class CategoriaController {
    obtenerTodas = asyncHandler((req, res) => {
        sendSuccess(res, CategoriaService.obtenerTodas());
    });

    crear = asyncHandler((req, res) => {
        sendSuccess(res, CategoriaService.crear(req.body ?? {}), 201);
    });

    actualizar = asyncHandler((req, res) => {
        sendSuccess(res, CategoriaService.actualizar(parseId(req.params.id), req.body ?? {}));
    });

    eliminar = asyncHandler((req, res) => {
        CategoriaService.eliminar(parseId(req.params.id));
        sendSuccess(res, null);
    });
}

export default new CategoriaController();
