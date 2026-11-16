import SucursalService from '../services/SucursalService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class SucursalController {
    obtenerTodas = asyncHandler((req, res) => {
        sendSuccess(res, SucursalService.obtenerTodas());
    });
}

export default new SucursalController();
