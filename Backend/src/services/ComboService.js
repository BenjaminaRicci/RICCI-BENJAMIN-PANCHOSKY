import ComboRepository from '../repositories/ComboRepository.js';
import { BadRequestError, ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { horaActualArgentina } from '../utils/clock.js';
import { esHoraValida, esNumeroPositivo, esTextoNoVacio } from '../utils/validators.js';

class ComboService {
    // RN-07: el combo solo puede agregarse antes de su hora límite.
    estaVigente(combo) {
        return horaActualArgentina() < combo.horaLimite;
    }

    obtenerTodos() {
        return ComboRepository.findAll().map((combo) => this.#conVigencia(combo));
    }

    obtenerPorId(id) {
        const combo = ComboRepository.findById(id);
        if (!combo) {
            throw new NotFoundError(Messages.COMBO_NOT_FOUND);
        }
        return combo;
    }

    crear(datos) {
        this.#validarDatos(datos);
        this.#validarNombreUnico(datos.nombre);
        return this.#conVigencia(ComboRepository.create(this.#normalizar(datos)));
    }

    actualizar(id, datos) {
        this.obtenerPorId(id);
        this.#validarDatos(datos);
        this.#validarNombreUnico(datos.nombre, id);
        return this.#conVigencia(ComboRepository.update(id, this.#normalizar(datos)));
    }

    eliminar(id) {
        this.obtenerPorId(id);
        ComboRepository.delete(id);
    }

    #conVigencia(combo) {
        return { ...combo, vigente: this.estaVigente(combo) };
    }

    #normalizar({ nombre, precioPromocional, precioOriginal, horaLimite }) {
        return { nombre: nombre.trim(), precioPromocional, precioOriginal, horaLimite };
    }

    #validarNombreUnico(nombre, idActual) {
        const existente = ComboRepository.findByNombre(nombre.trim());
        if (existente && existente.id !== idActual) {
            throw new ConflictError(Messages.COMBO_DUPLICATED);
        }
    }

    #validarDatos({ nombre, precioPromocional, precioOriginal, horaLimite }) {
        if (!esTextoNoVacio(nombre)) {
            throw new BadRequestError(Messages.COMBO_NAME_REQUIRED);
        }
        if (!esNumeroPositivo(precioPromocional) || !esNumeroPositivo(precioOriginal)) {
            throw new BadRequestError(Messages.COMBO_PRICE_INVALID);
        }
        if (precioPromocional >= precioOriginal) {
            throw new BadRequestError(Messages.COMBO_PROMO_PRICE_TOO_HIGH);
        }
        if (!esHoraValida(horaLimite)) {
            throw new BadRequestError(Messages.COMBO_TIME_INVALID);
        }
    }
}

export default new ComboService();
