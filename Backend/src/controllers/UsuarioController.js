import UsuarioService from '../services/UsuarioService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';
import { Roles } from '../enums/Roles.js';

class UsuarioController {
    obtenerTodos = asyncHandler((req, res) => {
        sendSuccess(res, UsuarioService.obtenerTodos());
    });

    crearEmpleado = asyncHandler((req, res) => {
        sendSuccess(res, UsuarioService.crear(req.body, Roles.EMPLEADO), 201);
    });

    eliminarEmpleado = asyncHandler((req, res) => {
        UsuarioService.eliminarEmpleado(parseId(req.params.id));
        sendSuccess(res, null);
    });
}

export default new UsuarioController();
