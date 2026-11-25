import app from './app.js';
import { cargarDatosIniciales } from './data/seed.js';

const PORT = process.env.PORT || 3000;

cargarDatosIniciales();

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
