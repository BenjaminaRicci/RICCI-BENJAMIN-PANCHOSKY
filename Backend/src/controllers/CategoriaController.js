import CategoriaService from '../services/CategoriaService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class CategoriaController {
    obtenerTodas = asyncHandler((req, res) => {
        sendSuccess(res, CategoriaService.obtenerTodas());
    });
}

export default new CategoriaController();
