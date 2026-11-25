import CategoriaRepository from '../repositories/CategoriaRepository.js';

class CategoriaService {
    obtenerTodas() {
        return CategoriaRepository.findAll();
    }
}

export default new CategoriaService();
