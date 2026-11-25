import UsuarioRepository from '../repositories/UsuarioRepository.js';
import SucursalRepository from '../repositories/SucursalRepository.js';
import { BadRequestError, ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { Roles } from '../enums/Roles.js';
import { hashPassword } from '../utils/passwordHasher.js';
import { toUsuarioPublico } from '../utils/usuarioMapper.js';
import { esEmailValido, esTelefonoValido, esTextoNoVacio } from '../utils/validators.js';

class UsuarioService {
    obtenerTodos() {
        return UsuarioRepository.findAll().map(toUsuarioPublico);
    }

    // Alta de un usuario con validación completa. Se reutiliza para clientes (registro) y empleados.
    crear(datos, rol) {
        this.#validarDatos(datos);

        if (UsuarioRepository.findByEmail(datos.email)) {
            throw new ConflictError(Messages.EMAIL_DUPLICATED);
        }

        let sucursalId = null;
        if (rol === Roles.EMPLEADO) {
            if (datos.sucursalId === undefined || datos.sucursalId === null) {
                throw new BadRequestError(Messages.EMPLOYEE_BRANCH_REQUIRED);
            }
            if (!SucursalRepository.findById(datos.sucursalId)) {
                throw new NotFoundError(Messages.BRANCH_NOT_FOUND);
            }
            sucursalId = datos.sucursalId;
        }

        const usuario = UsuarioRepository.create({
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            email: datos.email,
            password: hashPassword(datos.password),
            telefono: datos.telefono.trim(),
            rol,
            sucursalId
        });
        return toUsuarioPublico(usuario);
    }

    eliminarEmpleado(id) {
        const usuario = UsuarioRepository.findById(id);
        if (!usuario) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }
        if (usuario.rol !== Roles.EMPLEADO) {
            throw new BadRequestError(Messages.USER_NOT_DELETABLE);
        }
        UsuarioRepository.delete(id);
    }

    #validarDatos({ nombre, apellido, email, password, telefono }) {
        if (!esTextoNoVacio(nombre)) {
            throw new BadRequestError(Messages.FIRST_NAME_REQUIRED);
        }
        if (!esTextoNoVacio(apellido)) {
            throw new BadRequestError(Messages.LAST_NAME_REQUIRED);
        }
        if (!esTextoNoVacio(email)) {
            throw new BadRequestError(Messages.EMAIL_REQUIRED);
        }
        if (!esEmailValido(email)) {
            throw new BadRequestError(Messages.EMAIL_INVALID);
        }
        if (typeof password !== 'string' || password.length === 0) {
            throw new BadRequestError(Messages.PASSWORD_REQUIRED);
        }
        if (password.length < 8) {
            throw new BadRequestError(Messages.PASSWORD_TOO_SHORT);
        }
        if (!esTextoNoVacio(telefono)) {
            throw new BadRequestError(Messages.PHONE_REQUIRED);
        }
        if (!esTelefonoValido(telefono)) {
            throw new BadRequestError(Messages.PHONE_INVALID);
        }
    }
}

export default new UsuarioService();
