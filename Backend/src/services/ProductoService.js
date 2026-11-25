import ProductoRepository from '../repositories/ProductoRepository.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import DetallePedidoRepository from '../repositories/DetallePedidoRepository.js';
import { BadRequestError, NotFoundError, ConflictError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { esNumeroPositivo, esTextoNoVacio } from '../utils/validators.js';

const MAX_NOMBRE = 60;
const MAX_DESCRIPCION = 200;

class ProductoService {
    obtenerTodos({ categoriaId, soloDisponibles = false } = {}) {
        return ProductoRepository.findAll().filter(
            (producto) =>
                (categoriaId === undefined || producto.categoriaId === categoriaId) &&
                (!soloDisponibles || producto.disponible)
        );
    }

    obtenerPorId(id) {
        const producto = ProductoRepository.findById(id);
        if (!producto) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }
        return producto;
    }

    crear(datos) {
        this.#validarDatos(datos);

        const existente = ProductoRepository.findByNombre(datos.nombre);
        if (existente) {
            throw new ConflictError(Messages.DUPLICATED_RESOURCE);
        }

        return ProductoRepository.create({
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() ?? '',
            precio: datos.precio,
            imagen: datos.imagen?.trim() ?? '',
            disponible: datos.disponible ?? true,
            categoriaId: datos.categoriaId
        });
    }

    actualizar(id, datos) {
        const producto = this.obtenerPorId(id);
        this.#validarDatos(datos, { esActualizacion: true });

        if (datos.nombre !== undefined) {
            const existente = ProductoRepository.findByNombre(datos.nombre);
            if (existente && existente.id !== producto.id) {
                throw new ConflictError(Messages.DUPLICATED_RESOURCE);
            }
        }

        // Solo se aplican los campos editables (evita que el cliente pise el id u otros atributos).
        const camposEditables = {};
        for (const campo of ['nombre', 'descripcion', 'precio', 'imagen', 'disponible', 'categoriaId']) {
            if (datos[campo] !== undefined) {
                camposEditables[campo] =
                    typeof datos[campo] === 'string' ? datos[campo].trim() : datos[campo];
            }
        }
        return ProductoRepository.update(id, camposEditables);
    }

    cambiarDisponibilidad(id, disponible) {
        this.obtenerPorId(id);
        if (typeof disponible !== 'boolean') {
            throw new BadRequestError(Messages.PRODUCT_AVAILABLE_INVALID);
        }
        return ProductoRepository.update(id, { disponible });
    }

    // Un producto ya vendido no se elimina: se marca como no disponible para conservar el historial.
    eliminar(id) {
        const producto = this.obtenerPorId(id);

        if (DetallePedidoRepository.existsByProductoId(id)) {
            const actualizado = ProductoRepository.update(id, { disponible: false });
            return { eliminado: false, producto: actualizado, mensaje: Messages.PRODUCT_DISABLED_WITH_ORDERS };
        }

        ProductoRepository.delete(id);
        return { eliminado: true, producto, mensaje: Messages.PRODUCT_DELETED };
    }

    #validarDatos(datos, { esActualizacion = false } = {}) {
        const { nombre, descripcion, precio, categoriaId, disponible } = datos;

        if (!esActualizacion || nombre !== undefined) {
            if (!esTextoNoVacio(nombre)) {
                throw new BadRequestError(Messages.PRODUCT_NAME_REQUIRED);
            }
            if (nombre.trim().length > MAX_NOMBRE) {
                throw new BadRequestError(Messages.PRODUCT_NAME_TOO_LONG);
            }
        }

        if (descripcion !== undefined) {
            if (typeof descripcion !== 'string') {
                throw new BadRequestError(Messages.INVALID_DATA);
            }
            if (descripcion.trim().length > MAX_DESCRIPCION) {
                throw new BadRequestError(Messages.PRODUCT_DESCRIPTION_TOO_LONG);
            }
        }

        if (datos.imagen !== undefined && typeof datos.imagen !== 'string') {
            throw new BadRequestError(Messages.INVALID_DATA);
        }

        if (!esActualizacion || precio !== undefined) {
            if (!esNumeroPositivo(precio)) {
                throw new BadRequestError(Messages.PRODUCT_PRICE_INVALID);
            }
        }

        if (!esActualizacion || categoriaId !== undefined) {
            if (typeof categoriaId !== 'number' || !CategoriaRepository.findById(categoriaId)) {
                throw new BadRequestError(Messages.PRODUCT_CATEGORY_INVALID);
            }
        }

        if (disponible !== undefined && typeof disponible !== 'boolean') {
            throw new BadRequestError(Messages.PRODUCT_AVAILABLE_INVALID);
        }
    }
}

export default new ProductoService();
