import AuthService from '../services/AuthService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class AuthController {
    registrar = asyncHandler(async (req, res) => {
        const sesion = await AuthService.registrar(req.body ?? {});
        sendSuccess(res, sesion, 201);
    });

    login = asyncHandler(async (req, res) => {
        const sesion = await AuthService.login(req.body ?? {});
        sendSuccess(res, sesion);
    });

    obtenerPerfil = asyncHandler((req, res) => {
        sendSuccess(res, AuthService.obtenerPerfil(req.usuario.id));
    });

    actualizarPerfil = asyncHandler(async (req, res) => {
        const usuario = await AuthService.actualizarPerfil(req.usuario.id, req.body ?? {});
        sendSuccess(res, usuario);
    });
}

export default new AuthController();
