import { loadFromStorage, saveToStorage } from './storage.js';

const STORAGE_KEY = 'panchosky-sesion';

export function getSesion() {
    return loadFromStorage(STORAGE_KEY, null);
}

export function saveSesion(sesion) {
    saveToStorage(STORAGE_KEY, sesion);
}

export function getToken() {
    return getSesion()?.token ?? null;
}
