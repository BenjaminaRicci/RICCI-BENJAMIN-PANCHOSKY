import CategoriaRepository from '../repositories/CategoriaRepository.js';
import ProductoRepository from '../repositories/ProductoRepository.js';
import ComboRepository from '../repositories/ComboRepository.js';
import { BadRequestError, ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

class CategoriaService {
    obtenerTodas() {
        return CategoriaRepository.findAll();
    }

    obtenerPorId(id) {
        const categoria = CategoriaRepository.findById(id);
        if (!categoria) {
            throw new NotFoundError(Messages.CATEGORY_NOT_FOUND);
        }
        return categoria;
    }

    crear({ nombre }) {
        const nombreValido = this.#validarNombre(nombre);
        return CategoriaRepository.create({ nombre: nombreValido });
    }

    actualizar(id, { nombre }) {
        this.obtenerPorId(id);
        const nombreValido = this.#validarNombre(nombre, id);
        return CategoriaRepository.update(id, { nombre: nombreValido });
    }

    eliminar(id) {
        this.obtenerPorId(id);
        const enUso =
            ProductoRepository.findAll().some((producto) => producto.categoriaId === id) ||
            ComboRepository.findAll().some((combo) => combo.componentes.includes(id));
        if (enUso) {
            throw new ConflictError(Messages.CATEGORY_IN_USE);
        }
        CategoriaRepository.delete(id);
    }

    #validarNombre(nombre, idActual = null) {
        if (typeof nombre !== 'string' || nombre.trim().length === 0 || nombre.trim().length > 40) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const existente = CategoriaRepository.findByNombre(nombre.trim());
        if (existente && existente.id !== idActual) {
            throw new ConflictError(Messages.CATEGORY_DUPLICATED);
        }
        return nombre.trim();
    }
}

export default new CategoriaService();
