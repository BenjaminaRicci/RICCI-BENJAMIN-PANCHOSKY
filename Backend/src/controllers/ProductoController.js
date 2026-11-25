import ProductoService from '../services/ProductoService.js';
import { sendSuccess } from '../responses/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId, parseIdOpcional } from '../utils/parseId.js';

class ProductoController {
    obtenerTodos = asyncHandler((req, res) => {
        const productos = ProductoService.obtenerTodos({
            categoriaId: parseIdOpcional(req.query.categoriaId),
            soloDisponibles: req.query.disponible === 'true'
        });
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

    cambiarDisponibilidad = asyncHandler((req, res) => {
        const id = parseId(req.params.id);
        const producto = ProductoService.cambiarDisponibilidad(id, req.body.disponible);
        sendSuccess(res, producto);
    });

    eliminar = asyncHandler((req, res) => {
        const id = parseId(req.params.id);
        const resultado = ProductoService.eliminar(id);
        sendSuccess(res, resultado);
    });
}

export default new ProductoController();
