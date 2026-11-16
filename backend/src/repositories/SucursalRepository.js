import Sucursal from '../models/Sucursal.js';
import { createIdGenerator } from '../utils/idGenerator.js';
import { sucursalesIniciales } from '../data/seedData.js';

const nextId = createIdGenerator(1);
const sucursales = sucursalesIniciales.map(
    ({ nombre, direccion }) => new Sucursal(nextId(), nombre, direccion)
);

class SucursalRepository {
    findAll() {
        return sucursales;
    }

    findById(id) {
        return sucursales.find((sucursal) => sucursal.id === id);
    }
}

export default new SucursalRepository();
