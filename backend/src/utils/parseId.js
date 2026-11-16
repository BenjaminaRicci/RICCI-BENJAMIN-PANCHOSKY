import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

export const parseId = (rawId) => {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    return id;
};
