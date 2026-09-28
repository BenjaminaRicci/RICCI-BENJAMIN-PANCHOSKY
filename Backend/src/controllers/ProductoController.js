import ProductoService from '../services/ProductoService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

const parseId = (rawId) => {
    const id = Number(rawId);
    if (Number.isNaN(id)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    return id;
};

class ProductoController {
    obtenerTodos = asyncHandler((req, res) => {
        const productos = ProductoService.obtenerTodos();
        sendSuccess(res, productos);
    });

    obtenerPorId = asyncHandler((req, res) => {
        const id = parseId(req.params.id);
        const producto = ProductoService.obtenerPorId(id);
        sendSuccess(res, producto);
    });

    crear = asyncHandler((req, res) => {
        const producto = ProductoService.crear(req.body);
        sendSuccess(res, producto, 201);
    });

    actualizar = asyncHandler((req, res) => {
        const id = parseId(req.params.id);
        const producto = ProductoService.actualizar(id, req.body);
        sendSuccess(res, producto);
    });

    eliminar = asyncHandler((req, res) => {
        const id = parseId(req.params.id);
        ProductoService.eliminar(id);
        sendSuccess(res, null);
    });
}

export default new ProductoController();
