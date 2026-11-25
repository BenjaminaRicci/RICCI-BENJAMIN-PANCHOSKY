import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = process.env.TOKEN_SECRET || 'panchosky-secreto-de-desarrollo';
const DURACION_MS = 8 * 60 * 60 * 1000;

const firmar = (payload) => createHmac('sha256', SECRET).update(payload).digest('base64url');

// Token firmado (payload.firma) con expiración, sin dependencias externas.
export const generarToken = (usuarioId) => {
    const payload = Buffer.from(
        JSON.stringify({ sub: usuarioId, exp: Date.now() + DURACION_MS })
    ).toString('base64url');
    return `${payload}.${firmar(payload)}`;
};

// Devuelve el id del usuario o null si el token es inválido o expiró.
export const verificarToken = (token) => {
    if (typeof token !== 'string') {
        return null;
    }
    const [payload, firma] = token.split('.');
    if (!payload || !firma) {
        return null;
    }

    const esperada = Buffer.from(firmar(payload));
    const recibida = Buffer.from(firma);
    if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) {
        return null;
    }

    try {
        const { sub, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
        return Date.now() < exp ? sub : null;
    } catch {
        return null;
    }
};
