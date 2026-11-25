// Evita exponer la contraseña (hash) en cualquier respuesta de la API.
export const toUsuarioPublico = ({ password, ...usuario }) => usuario;
