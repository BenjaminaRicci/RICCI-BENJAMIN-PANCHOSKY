import Categoria from '../models/Categoria.js';
import { createIdGenerator } from '../utils/idGenerator.js';
import { categoriasIniciales } from '../data/seedData.js';

const nextId = createIdGenerator(1);
const categorias = categoriasIniciales.map(({ nombre }) => new Categoria(nextId(), nombre));

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

    update(id, { nombre }) {
        const categoria = this.findById(id);
        if (!categoria) {
            return null;
        }
        categoria.nombre = nombre;
        return categoria;
    }

    delete(id) {
        const index = categorias.findIndex((categoria) => categoria.id === id);
        if (index === -1) {
            return false;
        }
        categorias.splice(index, 1);
        return true;
    }
}

export default new CategoriaRepository();
