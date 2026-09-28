import AppError from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { sendError } from '../responses/ApiResponse.js';

// Middleware de manejo centralizado de errores, debe registrarse al final de la cadena de middlewares.
export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return sendError(res, err.message, err.statusCode);
    }

    console.error(err);
    return sendError(res, Messages.INTERNAL_SERVER_ERROR, 500);
};
