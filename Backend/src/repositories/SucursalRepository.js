import Sucursal from '../models/Sucursal.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const sucursales = [];
const nextId = createIdGenerator(1);

class SucursalRepository {
    findAll() {
        return sucursales;
    }

    findById(id) {
        return sucursales.find((sucursal) => sucursal.id === id);
    }

    create({ nombre, direccion }) {
        const sucursal = new Sucursal(nextId(), nombre, direccion);
        sucursales.push(sucursal);
        return sucursal;
    }
}

export default new SucursalRepository();
