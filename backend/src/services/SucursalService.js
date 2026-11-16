import SucursalRepository from '../repositories/SucursalRepository.js';

class SucursalService {
    obtenerTodas() {
        return SucursalRepository.findAll();
    }
}

export default new SucursalService();
