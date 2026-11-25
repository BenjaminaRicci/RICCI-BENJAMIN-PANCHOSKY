import Categoria from '../models/Categoria.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const categorias = [];
const nextId = createIdGenerator(1);

class CategoriaRepository {
    findAll() {
        return categorias;
    }

    findById(id) {
        return categorias.find((categoria) => categoria.id === id);
    }

    findByNombre(nombre) {
        return categorias.find(
            (categoria) => categoria.nombre.toLowerCase() === nombre.toLowerCase()
        );
    }

    create({ nombre }) {
        const categoria = new Categoria(nextId(), nombre);
        categorias.push(categoria);
        return categoria;
    }
}

export default new CategoriaRepository();
