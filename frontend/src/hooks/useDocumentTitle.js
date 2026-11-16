import { useEffect } from 'react';

export function useDocumentTitle(titulo) {
    useEffect(() => {
        document.title = titulo ? `${titulo} | Panchosky` : 'Panchosky | El sabor de la calle, en tu puerta';
    }, [titulo]);
}
