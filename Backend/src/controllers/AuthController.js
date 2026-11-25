import AuthService from '../services/AuthService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toUsuarioPublico } from '../utils/usuarioMapper.js';

class AuthController {
    registrar = asyncHandler((req, res) => {
        sendSuccess(res, AuthService.registrar(req.body), 201);
    });

    login = asyncHandler((req, res) => {
        sendSuccess(res, AuthService.login(req.body));
    });

    perfil = asyncHandler((req, res) => {
        sendSuccess(res, toUsuarioPublico(req.usuario));
    });
}

export default new AuthController();
