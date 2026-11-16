import { MODALIDADES, MONTO_MINIMO_ENVIO } from './pedidoRules.js';
import { formatPrice } from './formatPrice.js';

export const LIMITES_PRODUCTO = {
    NOMBRE_MAX: 60,
    DESCRIPCION_MAX: 200
};

const DIRECCION_MIN = 5;
const DIRECCION_MAX = 150;

function esUrlValida(valor) {
    try {
        const url = new URL(valor);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function validateProductForm(values) {
    const errors = {};
    const nombre = values.nombre.trim();
    const precio = Number(values.precio);

    if (!nombre) {
        errors.nombre = 'El nombre es obligatorio.';
    } else if (nombre.length > LIMITES_PRODUCTO.NOMBRE_MAX) {
        errors.nombre = `El nombre no puede superar los ${LIMITES_PRODUCTO.NOMBRE_MAX} caracteres.`;
    }

    if (values.descripcion.trim().length > LIMITES_PRODUCTO.DESCRIPCION_MAX) {
        errors.descripcion = `La descripción no puede superar los ${LIMITES_PRODUCTO.DESCRIPCION_MAX} caracteres.`;
    }

    if (values.precio === '') {
        errors.precio = 'El precio es obligatorio.';
    } else if (Number.isNaN(precio) || precio <= 0) {
        errors.precio = 'El precio debe ser un número mayor a cero.';
    }

    if (!values.categoriaId) {
        errors.categoriaId = 'Seleccioná una categoría.';
    }

    if (values.imagen.trim() && !esUrlValida(values.imagen.trim())) {
        errors.imagen = 'Ingresá una URL válida (http o https).';
    }

    return errors;
}

export function validateCheckoutForm(values, subtotal) {
    const errors = {};

    if (!values.modalidad) {
        errors.modalidad = 'Elegí cómo querés recibir tu pedido.';
    }

    if (values.modalidad === MODALIDADES.ENVIO) {
        const direccion = values.direccion.trim();
        if (!direccion) {
            errors.direccion = 'La dirección es obligatoria para el envío a domicilio.';
        } else if (direccion.length < DIRECCION_MIN || direccion.length > DIRECCION_MAX) {
            errors.direccion = `La dirección debe tener entre ${DIRECCION_MIN} y ${DIRECCION_MAX} caracteres.`;
        } else if (subtotal < MONTO_MINIMO_ENVIO) {
            errors.direccion = `El envío a domicilio requiere un pedido mínimo de ${formatPrice(MONTO_MINIMO_ENVIO)}.`;
        }
    }

    if (values.modalidad === MODALIDADES.RETIRO && !values.sucursalId) {
        errors.sucursalId = 'Seleccioná la sucursal donde vas a retirar.';
    }

    if (!values.medioPago) {
        errors.medioPago = 'Seleccioná un medio de pago.';
    }

    return errors;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d{8,13}$/;
export const PASSWORD_MIN = 8;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validateLoginForm(values) {
    const errors = {};
    if (!values.email.trim()) {
        errors.email = 'Ingresá tu email.';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
        errors.email = 'Ingresá un email válido (ej.: nombre@mail.com).';
    }
    if (!values.password) {
        errors.password = 'Ingresá tu contraseña.';
    }
    return errors;
}

function validarDatosPersonales(values, errors) {
    if (!values.nombre.trim()) {
        errors.nombre = 'El nombre es obligatorio.';
    }
    if (!values.apellido.trim()) {
        errors.apellido = 'El apellido es obligatorio.';
    }
    if (!values.telefono.trim()) {
        errors.telefono = 'El teléfono es obligatorio.';
    } else if (!TELEFONO_REGEX.test(values.telefono.trim())) {
        errors.telefono = 'Usá solo números, sin espacios ni guiones (entre 8 y 13 dígitos).';
    }
}

function validarNuevaPassword(password, repetir, errors, campo = 'password') {
    if (password.length < PASSWORD_MIN) {
        errors[campo] = `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
    }
    if (repetir !== password) {
        errors.repetirPassword = 'Las contraseñas no coinciden.';
    }
}

export function validateRegisterForm(values) {
    const errors = {};
    validarDatosPersonales(values, errors);
    if (!values.email.trim()) {
        errors.email = 'El email es obligatorio.';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
        errors.email = 'Ingresá un email válido (ej.: nombre@mail.com).';
    }
    validarNuevaPassword(values.password, values.repetirPassword, errors);
    return errors;
}

export function validateProfileForm(values) {
    const errors = {};
    validarDatosPersonales(values, errors);
    if (values.passwordNueva || values.passwordActual) {
        if (!values.passwordActual) {
            errors.passwordActual = 'Ingresá tu contraseña actual para cambiarla.';
        }
        validarNuevaPassword(values.passwordNueva, values.repetirPassword, errors, 'passwordNueva');
    }
    return errors;
}

export function validateCategoriaForm(values) {
    const nombre = values.nombre.trim();
    if (!nombre) {
        return { nombre: 'El nombre es obligatorio.' };
    }
    if (nombre.length > 40) {
        return { nombre: 'El nombre no puede superar los 40 caracteres.' };
    }
    return {};
}

export function validateComboForm(values) {
    const errors = {};
    const promocional = Number(values.precioPromocional);
    const original = Number(values.precioOriginal);

    if (!values.nombre.trim()) {
        errors.nombre = 'El nombre es obligatorio.';
    }
    if (values.precioOriginal === '' || Number.isNaN(original) || original <= 0) {
        errors.precioOriginal = 'Ingresá un precio original mayor a cero.';
    }
    if (values.precioPromocional === '' || Number.isNaN(promocional) || promocional <= 0) {
        errors.precioPromocional = 'Ingresá un precio promocional mayor a cero.';
    } else if (!errors.precioOriginal && promocional >= original) {
        errors.precioPromocional = 'El precio promocional debe ser menor al original.';
    }
    if (!HORA_REGEX.test(values.horaLimite)) {
        errors.horaLimite = 'Ingresá una hora válida (HH:MM).';
    }
    if (values.componentes.length === 0) {
        errors.componentes = 'Elegí al menos una categoría para armar el combo.';
    }
    if (values.imagen.trim() && !esUrlValida(values.imagen.trim())) {
        errors.imagen = 'Ingresá una URL válida (http o https).';
    }
    return errors;
}
