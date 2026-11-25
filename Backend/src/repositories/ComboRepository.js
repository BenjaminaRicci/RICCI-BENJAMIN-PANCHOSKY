import Combo from '../models/Combo.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const combos = [];
const nextId = createIdGenerator(1);

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

    create({ nombre, precioPromocional, precioOriginal, horaLimite }) {
        const combo = new Combo(nextId(), nombre, precioPromocional, precioOriginal, horaLimite);
        combos.push(combo);
        return combo;
    }

    update(id, { nombre, precioPromocional, precioOriginal, horaLimite }) {
        const combo = this.findById(id);
        if (!combo) {
            return null;
        }
        Object.assign(combo, { nombre, precioPromocional, precioOriginal, horaLimite });
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

export default new ComboRepository();
