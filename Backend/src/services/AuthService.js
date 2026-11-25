import UsuarioRepository from '../repositories/UsuarioRepository.js';
import UsuarioService from './UsuarioService.js';
import { BadRequestError, UnauthorizedError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { Roles } from '../enums/Roles.js';
import { verifyPassword } from '../utils/passwordHasher.js';
import { generarToken } from '../utils/tokenService.js';
import { toUsuarioPublico } from '../utils/usuarioMapper.js';

class AuthService {
    registrar(datos) {
        if (datos.password !== datos.repetirPassword) {
            throw new BadRequestError(Messages.PASSWORD_MISMATCH);
        }
        const usuario = UsuarioService.crear(datos, Roles.CLIENTE);
        return { token: generarToken(usuario.id), usuario };
    }

    login({ email, password }) {
        if (typeof email !== 'string' || typeof password !== 'string') {
            throw new BadRequestError(Messages.INVALID_DATA);
        }

        const usuario = UsuarioRepository.findByEmail(email);
        // Mismo mensaje para email inexistente o contraseña incorrecta, para no revelar qué cuentas existen.
        if (!usuario || !verifyPassword(password, usuario.password)) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        return { token: generarToken(usuario.id), usuario: toUsuarioPublico(usuario) };
    }
}

export default new AuthService();
