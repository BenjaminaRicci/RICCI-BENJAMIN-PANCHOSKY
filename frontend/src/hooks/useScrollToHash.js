import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Desplaza hasta la sección del hash (#menu, #combos...) o al inicio al cambiar de página.
export function useScrollToHash() {
    const { pathname, hash, key } = useLocation();
    const previousPath = useRef(pathname);

    useEffect(() => {
        const changedPage = previousPath.current !== pathname;
        previousPath.current = pathname;

        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView();
            return;
        }
        if (changedPage) {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash, key]);
}
