import Producto from '../models/Producto.js';
import { createIdGenerator } from '../utils/idGenerator.js';
import { productosIniciales } from '../data/seedData.js';

// Persistencia en memoria mediante un array, sin acceso a base de datos.
const productos = [];
const nextId = createIdGenerator(1);

class ProductoRepository {
    findAll() {
        return productos;
    }

    findById(id) {
        return productos.find((producto) => producto.id === id);
    }

    findByNombre(nombre) {
        return productos.find(
            (producto) => producto.nombre.toLowerCase() === nombre.toLowerCase()
        );
    }

    create({ nombre, descripcion = '', precio, imagen = '', disponible = true, categoriaId, destacado = false }) {
        const producto = new Producto(
            nextId(),
            nombre,
            descripcion,
            precio,
            imagen,
            disponible,
            categoriaId,
            destacado
        );
        productos.push(producto);
        return producto;
    }

    update(id, datosActualizados) {
        const producto = this.findById(id);
        if (!producto) {
            return null;
        }
        Object.assign(producto, datosActualizados);
        return producto;
    }

    delete(id) {
        const index = productos.findIndex((producto) => producto.id === id);
        if (index === -1) {
            return false;
        }
        productos.splice(index, 1);
        return true;
    }
}

const productoRepository = new ProductoRepository();
productosIniciales.forEach((producto) => productoRepository.create(producto));

export default productoRepository;
