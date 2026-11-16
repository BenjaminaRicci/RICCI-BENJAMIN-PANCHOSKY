import { useCallback, useEffect, useRef, useState } from 'react';

// Ejecuta una función de services y expone sus estados de carga, error y datos.
export function useFetch(fetcher) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            if (isMounted.current) {
                setData(result);
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [fetcher]);

    useEffect(() => {
        isMounted.current = true;
        load();
        return () => {
            isMounted.current = false;
        };
    }, [load]);

    return { data, setData, loading, error, reload: load };
}
