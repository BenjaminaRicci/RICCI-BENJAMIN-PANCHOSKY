import Configuracion from '../models/Configuracion.js';

// Parámetros editables por el Administrador (RN-03, RN-04 y RN-05).
const configuracion = new Configuracion(3000, 800, 8000, ['Centro', 'GBA Norte']);

class ConfiguracionRepository {
    get() {
        return configuracion;
    }

    update({ minimoEnvio, costoEnvio, envioGratisDesde }) {
        Object.assign(configuracion, { minimoEnvio, costoEnvio, envioGratisDesde });
        return configuracion;
    }
}

export default new ConfiguracionRepository();
