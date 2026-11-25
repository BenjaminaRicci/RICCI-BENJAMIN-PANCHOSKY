import ConfiguracionService from '../services/ConfiguracionService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class ConfiguracionController {
    obtener = asyncHandler((req, res) => {
        sendSuccess(res, ConfiguracionService.obtener());
    });

    actualizar = asyncHandler((req, res) => {
        sendSuccess(res, ConfiguracionService.actualizar(req.body));
    });
}

export default new ConfiguracionController();
