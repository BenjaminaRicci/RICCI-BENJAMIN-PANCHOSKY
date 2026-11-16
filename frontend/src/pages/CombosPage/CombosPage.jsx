import { useState } from 'react';
import ComboBanner from '../../components/ComboBanner/ComboBanner.jsx';
import ComboBuilderModal from '../../components/ComboBuilderModal/ComboBuilderModal.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useCart } from '../../context/CartContext.jsx';
import { obtenerCombos } from '../../services/comboService.js';
import { obtenerProductos } from '../../services/productoService.js';
import { obtenerCategorias } from '../../services/categoriaService.js';

export default function CombosPage() {
    useDocumentTitle('Combos');
    const combos = useFetch(obtenerCombos);
    const productos = useFetch(obtenerProductos);
    const categorias = useFetch(obtenerCategorias);
    const { addItem } = useCart();
    const [comboAArmar, setComboAArmar] = useState(null);

    return (
        <div className="container section">
            <div className="page__header">
                <h1 className="page__title">Combos y ofertas</h1>
            </div>
            <p className="page__subtitle-text">
                Cada combo se arma eligiendo un producto de cada categoría. Las ofertas valen hasta la hora indicada.
            </p>

            <AsyncState
                loading={combos.loading}
                error={combos.error}
                onRetry={combos.reload}
                loadingText="Cargando combos..."
                isEmpty={!combos.data?.length}
                emptyTitle="No hay combos disponibles"
                emptyMessage="Volvé más tarde para ver nuevas ofertas."
            >
                <div className="page__stack">
                    {combos.data?.map((combo) => (
                        <ComboBanner key={combo.id} combo={combo} onAdd={setComboAArmar} />
                    ))}
                </div>
            </AsyncState>

            <ComboBuilderModal
                combo={comboAArmar}
                productos={productos.data ?? []}
                categorias={categorias.data ?? []}
                onConfirm={(item) => {
                    addItem(item);
                    setComboAArmar(null);
                }}
                onClose={() => setComboAArmar(null)}
            />
        </div>
    );
}
