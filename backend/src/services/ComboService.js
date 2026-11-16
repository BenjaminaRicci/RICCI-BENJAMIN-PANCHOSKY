import ComboRepository from '../repositories/ComboRepository.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import ProductoRepository from '../repositories/ProductoRepository.js';
import { BadRequestError, ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

class ComboService {
    obtenerTodos() {
        return ComboRepository.findAll();
    }

    obtenerPorId(id) {
        const combo = ComboRepository.findById(id);
        if (!combo) {
            throw new NotFoundError(Messages.COMBO_NOT_FOUND);
        }
        return combo;
    }

    crear(datos) {
        return ComboRepository.create(this.#validarDatos(datos));
    }

    actualizar(id, datos) {
        this.obtenerPorId(id);
        return ComboRepository.update(id, this.#validarDatos(datos, id));
    }

    eliminar(id) {
        this.obtenerPorId(id);
        ComboRepository.delete(id);
    }

    // RN-08: un producto disponible por cada componente, en el mismo orden.
    resolverSeleccion(combo, seleccion) {
        if (!Array.isArray(seleccion) || seleccion.length !== combo.componentes.length) {
            throw new BadRequestError(Messages.ORDER_COMBO_SELECTION_INVALID);
        }

        return combo.componentes.map((categoriaId, indice) => {
            const producto = ProductoRepository.findById(seleccion[indice]);
            if (!producto || producto.categoriaId !== categoriaId || !producto.disponible) {
                throw new BadRequestError(Messages.ORDER_COMBO_SELECTION_INVALID);
            }
            return producto;
        });
    }

    #validarDatos(datos, idActual = null) {
        const { nombre, descripcion = '', precioPromocional, precioOriginal, horaLimite, componentes, imagen = '' } = datos;

        if (typeof nombre !== 'string' || nombre.trim().length === 0) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const existente = ComboRepository.findByNombre(nombre.trim());
        if (existente && existente.id !== idActual) {
            throw new ConflictError(Messages.COMBO_DUPLICATED);
        }
        if (typeof descripcion !== 'string' || typeof imagen !== 'string') {
            throw new BadRequestError(Messages.INVALID_DATA);
        }

        const preciosValidos =
            typeof precioPromocional === 'number' &&
            typeof precioOriginal === 'number' &&
            precioPromocional > 0 &&
            precioPromocional < precioOriginal;
        if (!preciosValidos) {
            throw new BadRequestError(Messages.COMBO_INVALID_PRICES);
        }

        if (typeof horaLimite !== 'string' || !HORA_REGEX.test(horaLimite)) {
            throw new BadRequestError(Messages.COMBO_INVALID_TIME);
        }

        const componentesValidos =
            Array.isArray(componentes) &&
            componentes.length > 0 &&
            componentes.every((categoriaId) => CategoriaRepository.findById(categoriaId));
        if (!componentesValidos) {
            throw new BadRequestError(Messages.COMBO_INVALID_COMPONENTS);
        }

        return {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precioPromocional,
            precioOriginal,
            horaLimite,
            componentes,
            imagen: imagen.trim()
        };
    }

    // RN-07: el combo solo puede pedirse antes de su hora límite del día.
    estaVigente(combo, ahora = new Date()) {
        const [horas, minutos] = combo.horaLimite.split(':').map(Number);
        const limite = new Date(ahora);
        limite.setHours(horas, minutos, 0, 0);
        return ahora < limite;
    }
}

export default new ComboService();
