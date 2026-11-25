import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

export const parseId = (rawId) => {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    return id;
};

// Para filtros opcionales de query string: devuelve undefined si no vino el parámetro.
export const parseIdOpcional = (rawId) => (rawId === undefined ? undefined : parseId(rawId));
