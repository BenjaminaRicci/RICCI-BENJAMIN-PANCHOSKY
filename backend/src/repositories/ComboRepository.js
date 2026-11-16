import Combo from '../models/Combo.js';
import { createIdGenerator } from '../utils/idGenerator.js';
import { combosIniciales } from '../data/seedData.js';

const nextId = createIdGenerator(1);
const combos = [];

class ComboRepository {
    findAll() {
        return combos;
    }

    findById(id) {
        return combos.find((combo) => combo.id === id);
    }

    findByNombre(nombre) {
        return combos.find((combo) => combo.nombre.toLowerCase() === nombre.toLowerCase());
    }

    create({ nombre, descripcion = '', precioPromocional, precioOriginal, horaLimite, componentes, imagen = '' }) {
        const combo = new Combo(
            nextId(),
            nombre,
            descripcion,
            precioPromocional,
            precioOriginal,
            horaLimite,
            componentes,
            imagen
        );
        combos.push(combo);
        return combo;
    }

    update(id, datosActualizados) {
        const combo = this.findById(id);
        if (!combo) {
            return null;
        }
        Object.assign(combo, datosActualizados);
        return combo;
    }

    delete(id) {
        const index = combos.findIndex((combo) => combo.id === id);
        if (index === -1) {
            return false;
        }
        combos.splice(index, 1);
        return true;
    }
}

const comboRepository = new ComboRepository();
combosIniciales.forEach((combo) => comboRepository.create(combo));

export default comboRepository;
