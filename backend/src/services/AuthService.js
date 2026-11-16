import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { authConfig } from '../config/auth.js';
import { Roles } from '../enums/Roles.js';
import { Messages } from '../enums/Messages.js';
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError
} from '../exceptions/AppError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d{8,13}$/;
const PASSWORD_MINIMA = 8;

const esTextoValido = (valor) => typeof valor === 'string' && valor.trim().length > 0;

// Nunca se devuelve el hash de la contraseña.
export const sinPassword = ({ password, ...usuario }) => usuario;

class AuthService {
    async registrar(datos) {
        const { nombre, apellido, email, password, telefono } = datos;

        if (![nombre, apellido, email, password, telefono].every(esTextoValido)) {
            throw new BadRequestError(Messages.USER_REQUIRED_FIELDS);
        }
        if (!EMAIL_REGEX.test(email.trim())) {
            throw new BadRequestError(Messages.USER_INVALID_EMAIL);
        }
        if (password.length < PASSWORD_MINIMA) {
            throw new BadRequestError(Messages.USER_INVALID_PASSWORD);
        }
        if (!TELEFONO_REGEX.test(telefono.trim())) {
            throw new BadRequestError(Messages.USER_INVALID_PHONE);
        }
        // RN-10: el email es único.
        if (UsuarioRepository.findByEmail(email.trim())) {
            throw new ConflictError(Messages.USER_EMAIL_DUPLICATED);
        }

        const usuario = UsuarioRepository.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim(),
            password: await bcrypt.hash(password, authConfig.BCRYPT_ROUNDS),
            telefono: telefono.trim(),
            rol: Roles.CLIENTE
        });

        return this.#crearSesion(usuario);
    }

    async login({ email, password }) {
        if (!esTextoValido(email) || !esTextoValido(password)) {
            throw new UnauthorizedError(Messages.AUTH_INVALID_CREDENTIALS);
        }

        const usuario = UsuarioRepository.findByEmail(email.trim());
        const coincide = usuario ? await bcrypt.compare(password, usuario.password) : false;
        if (!coincide) {
            throw new UnauthorizedError(Messages.AUTH_INVALID_CREDENTIALS);
        }

        return this.#crearSesion(usuario);
    }

    verificarToken(token) {
        try {
            const { sub } = jwt.verify(token, authConfig.JWT_SECRET);
            const usuario = UsuarioRepository.findById(Number(sub));
            if (!usuario) {
                throw new Error('Usuario inexistente');
            }
            return usuario;
        } catch {
            throw new UnauthorizedError(Messages.AUTH_INVALID_TOKEN);
        }
    }

    obtenerPerfil(id) {
        const usuario = UsuarioRepository.findById(id);
        if (!usuario) {
            throw new NotFoundError(Messages.AUTH_INVALID_TOKEN);
        }
        return sinPassword(usuario);
    }

    async actualizarPerfil(id, datos) {
        const usuario = UsuarioRepository.findById(id);
        if (!usuario) {
            throw new NotFoundError(Messages.AUTH_INVALID_TOKEN);
        }

        const { nombre, apellido, telefono, passwordActual, passwordNueva } = datos;
        if (![nombre, apellido, telefono].every(esTextoValido)) {
            throw new BadRequestError(Messages.USER_REQUIRED_FIELDS);
        }
        if (!TELEFONO_REGEX.test(telefono.trim())) {
            throw new BadRequestError(Messages.USER_INVALID_PHONE);
        }

        const cambios = {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            telefono: telefono.trim()
        };

        if (passwordNueva !== undefined && passwordNueva !== '') {
            if (typeof passwordNueva !== 'string' || passwordNueva.length < PASSWORD_MINIMA) {
                throw new BadRequestError(Messages.USER_INVALID_PASSWORD);
            }
            const coincide =
                typeof passwordActual === 'string' &&
                (await bcrypt.compare(passwordActual, usuario.password));
            if (!coincide) {
                throw new BadRequestError(Messages.USER_WRONG_PASSWORD);
            }
            cambios.password = await bcrypt.hash(passwordNueva, authConfig.BCRYPT_ROUNDS);
        }

        return sinPassword(UsuarioRepository.update(id, cambios));
    }

    #crearSesion(usuario) {
        const token = jwt.sign({ sub: String(usuario.id), rol: usuario.rol }, authConfig.JWT_SECRET, {
            expiresIn: authConfig.JWT_EXPIRES_IN
        });
        return { token, usuario: sinPassword(usuario) };
    }
}

export default new AuthService();
