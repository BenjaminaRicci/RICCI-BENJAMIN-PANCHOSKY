const SECRETO_DESARROLLO = 'panchosky-secreto-solo-para-desarrollo';

if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET no está definido: se usa un secreto de desarrollo. No usar así en producción.');
}

export const authConfig = Object.freeze({
    JWT_SECRET: process.env.JWT_SECRET || SECRETO_DESARROLLO,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    BCRYPT_ROUNDS: 10
});
