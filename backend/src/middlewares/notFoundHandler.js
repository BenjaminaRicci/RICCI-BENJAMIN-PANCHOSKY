import { Messages } from '../enums/Messages.js';
import { NotFoundError } from '../exceptions/AppError.js';

// Se ejecuta cuando ninguna ruta registrada coincide con la solicitud.
export const notFoundHandler = (req, res, next) => {
    next(new NotFoundError(Messages.ROUTE_NOT_FOUND));
};
