import AuthService from '../services/AuthService.js';
import { UnauthorizedError, ForbiddenError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

// Lee el token "Bearer" y deja el usuario en req.usuario.
export const autenticar = (req, res, next) => {
    const [tipo, token] = (req.headers.authorization ?? '').split(' ');
    if (tipo !== 'Bearer' || !token) {
        return next(new UnauthorizedError(Messages.AUTH_REQUIRED));
    }

    try {
        req.usuario = AuthService.verificarToken(token);
        next();
    } catch (error) {
        next(error);
    }
};

export const autorizar = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
        return next(new ForbiddenError(Messages.AUTH_FORBIDDEN));
    }
    next();
};
