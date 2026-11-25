import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Las contraseñas nunca se guardan en texto plano: se almacena "salt:hash" generado con scrypt.
export const hashPassword = (password) => {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

export const verifyPassword = (password, stored) => {
    const [salt, hash] = stored.split(':');
    const candidate = scryptSync(password, salt, 64);
    return timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
};
