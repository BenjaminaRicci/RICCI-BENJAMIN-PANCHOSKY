import ConfiguracionRepository from '../repositories/ConfiguracionRepository.js';
import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { esNumeroNoNegativo } from '../utils/validators.js';

class ConfiguracionService {
    obtener() {
        return ConfiguracionRepository.get();
    }

    actualizar({ minimoEnvio, costoEnvio, envioGratisDesde }) {
        const montosValidos = [minimoEnvio, costoEnvio, envioGratisDesde].every(esNumeroNoNegativo);
        if (!montosValidos || envioGratisDesde < minimoEnvio) {
            throw new BadRequestError(Messages.CONFIG_INVALID);
        }
        return ConfiguracionRepository.update({ minimoEnvio, costoEnvio, envioGratisDesde });
    }
}

export default new ConfiguracionService();
