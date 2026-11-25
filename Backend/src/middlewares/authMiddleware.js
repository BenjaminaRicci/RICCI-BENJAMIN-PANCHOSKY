import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { ForbiddenError, UnauthorizedError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { verificarToken } from '../utils/tokenService.js';

// Exige sesión iniciada: valida el token "Bearer" y deja el usuario en req.usuario.
export const autenticar = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return next(new UnauthorizedError(Messages.AUTH_REQUIRED));
    }

    const usuarioId = verificarToken(header.slice(7));
    const usuario = usuarioId ? UsuarioRepository.findById(usuarioId) : undefined;
    if (!usuario) {
        return next(new UnauthorizedError(Messages.AUTH_TOKEN_INVALID));
    }

    req.usuario = usuario;
    next();
};

// Restringe una ruta a los roles indicados (debe ejecutarse después de "autenticar").
export const autorizar =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return next(new ForbiddenError(Messages.FORBIDDEN));
        }
        next();
    };
