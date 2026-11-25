const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{8,13}$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const esTextoNoVacio = (valor) => typeof valor === 'string' && valor.trim().length > 0;

export const esEmailValido = (valor) => typeof valor === 'string' && EMAIL_REGEX.test(valor.trim());

export const esTelefonoValido = (valor) =>
    typeof valor === 'string' && PHONE_REGEX.test(valor.trim());

export const esHoraValida = (valor) => typeof valor === 'string' && HORA_REGEX.test(valor);

export const esNumeroPositivo = (valor) =>
    typeof valor === 'number' && Number.isFinite(valor) && valor > 0;

export const esNumeroNoNegativo = (valor) =>
    typeof valor === 'number' && Number.isFinite(valor) && valor >= 0;

export const esEnteroEnRango = (valor, minimo, maximo) =>
    Number.isInteger(valor) && valor >= minimo && valor <= maximo;
