import { useCallback, useEffect, useState } from 'react';

// Pequeño hook para cargar datos de la API con estado de carga y error.
export function useCarga(funcion, dependencias = []) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    funcion()
      .then((resultado) => {
        if (activo) {
          setDatos(resultado);
          setError('');
        }
      })
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return { datos, error, cargando, recargar, setDatos };
}
