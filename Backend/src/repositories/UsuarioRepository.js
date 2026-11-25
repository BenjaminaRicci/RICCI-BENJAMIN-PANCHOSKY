import Usuario from '../models/Usuario.js';
import { createIdGenerator } from '../utils/idGenerator.js';

const usuarios = [];
const nextId = createIdGenerator(1);

class UsuarioRepository {
    findAll() {
        return usuarios;
    }

    findById(id) {
        return usuarios.find((usuario) => usuario.id === id);
    }

    findByEmail(email) {
        return usuarios.find((usuario) => usuario.email === email.trim().toLowerCase());
    }

    create({ nombre, apellido, email, password, telefono, rol, sucursalId }) {
        const usuario = new Usuario(
            nextId(),
            nombre,
            apellido,
            email.trim().toLowerCase(),
            password,
            telefono,
            rol,
            sucursalId ?? null
        );
        usuarios.push(usuario);
        return usuario;
    }

    delete(id) {
        const index = usuarios.findIndex((usuario) => usuario.id === id);
        if (index === -1) {
            return false;
        }
        usuarios.splice(index, 1);
        return true;
    }
}

export default new UsuarioRepository();
