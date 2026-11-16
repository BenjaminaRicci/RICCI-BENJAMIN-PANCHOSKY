import ProductoRepository from '../repositories/ProductoRepository.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import { BadRequestError, NotFoundError, ConflictError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

class ProductoService {
    obtenerTodos() {
        return ProductoRepository.findAll();
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
            categoriaId: datos.categoriaId,
            destacado: datos.destacado ?? false
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

        return ProductoRepository.update(id, this.#camposEditables(datos));
    }

    // El Empleado solo puede marcar disponibilidad (no precios ni bajas).
    cambiarDisponibilidad(id, disponible) {
        this.obtenerPorId(id);
        if (typeof disponible !== 'boolean') {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        return ProductoRepository.update(id, { disponible });
    }

    #camposEditables(datos) {
        const campos = ['nombre', 'descripcion', 'precio', 'imagen', 'disponible', 'categoriaId', 'destacado'];
        return Object.fromEntries(
            campos
                .filter((campo) => datos[campo] !== undefined)
                .map((campo) => [campo, typeof datos[campo] === 'string' ? datos[campo].trim() : datos[campo]])
        );
    }

    eliminar(id) {
        this.obtenerPorId(id);
        ProductoRepository.delete(id);
    }

    #validarDatos(datos, { esActualizacion = false } = {}) {
        const { nombre, precio, categoriaId, disponible, destacado } = datos;

        if (!esActualizacion || nombre !== undefined) {
            if (typeof nombre !== 'string' || nombre.trim().length === 0) {
                throw new BadRequestError(Messages.INVALID_DATA);
            }
        }

        if (!esActualizacion || precio !== undefined) {
            if (typeof precio !== 'number' || Number.isNaN(precio) || precio <= 0) {
                throw new BadRequestError(Messages.INVALID_DATA);
            }
        }

        if (!esActualizacion || categoriaId !== undefined) {
            if (typeof categoriaId !== 'number' || Number.isNaN(categoriaId)) {
                throw new BadRequestError(Messages.INVALID_DATA);
            }
            if (!CategoriaRepository.findById(categoriaId)) {
                throw new BadRequestError(Messages.CATEGORY_NOT_FOUND);
            }
        }

        if (disponible !== undefined && typeof disponible !== 'boolean') {
            throw new BadRequestError(Messages.INVALID_DATA);
        }

        if (destacado !== undefined && typeof destacado !== 'boolean') {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
    }
}

export default new ProductoService();
