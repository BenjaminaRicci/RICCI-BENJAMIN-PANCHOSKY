// Genera identificadores autoincrementales para los repositorios en memoria.
export const createIdGenerator = (start = 1) => {
    let currentId = start;
    return () => currentId++;
};
