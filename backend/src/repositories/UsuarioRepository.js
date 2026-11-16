import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import { createIdGenerator } from '../utils/idGenerator.js';
import { usuariosIniciales } from '../data/seedData.js';
import { authConfig } from '../config/auth.js';

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
        return usuarios.find((usuario) => usuario.email === email.toLowerCase());
    }

    // Recibe la contraseña ya hasheada.
    create({ nombre, apellido, email, password, telefono, rol, sucursalId = null }) {
        const usuario = new Usuario(
            nextId(),
            nombre,
            apellido,
            email.toLowerCase(),
            password,
            telefono,
            rol,
            sucursalId
        );
        usuarios.push(usuario);
        return usuario;
    }

    update(id, datosActualizados) {
        const usuario = this.findById(id);
        if (!usuario) {
            return null;
        }
        Object.assign(usuario, datosActualizados);
        return usuario;
    }
}

const usuarioRepository = new UsuarioRepository();
usuariosIniciales.forEach((usuario) =>
    usuarioRepository.create({
        ...usuario,
        password: bcrypt.hashSync(usuario.password, authConfig.BCRYPT_ROUNDS)
    })
);

export default usuarioRepository;
