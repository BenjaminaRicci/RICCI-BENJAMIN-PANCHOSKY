import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import CategoryTabs from '../../components/CategoryTabs/CategoryTabs.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import CheckboxField from '../../components/FormField/CheckboxField.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import StatusMessage from '../../components/StatusMessage/StatusMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useCart } from '../../context/CartContext.jsx';
import { obtenerProductos } from '../../services/productoService.js';
import { obtenerCategorias } from '../../services/categoriaService.js';

const normalizar = (texto) =>
    texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

export default function ProductsPage() {
    useDocumentTitle('Menú');
    const productos = useFetch(obtenerProductos);
    const categorias = useFetch(obtenerCategorias);
    const { addItem } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();

    const busqueda = searchParams.get('q') ?? '';
    const categoriaId = Number(searchParams.get('categoria')) || 0;
    const soloDisponibles = searchParams.get('disponibles') === '1';

    const actualizarFiltro = (clave, valor) => {
        setSearchParams(
            (actuales) => {
                const siguientes = new URLSearchParams(actuales);
                if (valor) {
                    siguientes.set(clave, valor);
                } else {
                    siguientes.delete(clave);
                }
                return siguientes;
            },
            { replace: true, preventScrollReset: true }
        );
    };

    const termino = normalizar(busqueda.trim());
    const filtrados = (productos.data ?? []).filter(
        (producto) =>
            (!categoriaId || producto.categoriaId === categoriaId) &&
            (!soloDisponibles || producto.disponible) &&
            (!termino || normalizar(`${producto.nombre} ${producto.descripcion}`).includes(termino))
    );

    const opcionesCategoria = [{ id: 0, nombre: 'Todas' }, ...(categorias.data ?? [])];

    return (
        <div className="container section">
            <div className="page__header">
                <h1 className="page__title">Nuestro menú</h1>
            </div>

            <div className="filters" role="search">
                <FormField
                    id="buscar-producto"
                    label="Buscar"
                    type="search"
                    placeholder="Ej.: cheddar, milanesa..."
                    value={busqueda}
                    onChange={(event) => actualizarFiltro('q', event.target.value)}
                />
                <CheckboxField
                    id="solo-disponibles"
                    label="Solo disponibles"
                    checked={soloDisponibles}
                    onChange={(event) => actualizarFiltro('disponibles', event.target.checked ? '1' : '')}
                />
            </div>

            <AsyncState
                loading={productos.loading || categorias.loading}
                error={productos.error ?? categorias.error}
                onRetry={() => {
                    productos.reload();
                    categorias.reload();
                }}
                loadingText="Cargando menú..."
            >
                <CategoryTabs
                    categorias={opcionesCategoria}
                    selectedId={categoriaId}
                    onSelect={(id) => actualizarFiltro('categoria', id ? String(id) : '')}
                />
                <p className="visually-hidden" aria-live="polite">
                    {filtrados.length} productos encontrados
                </p>
                {filtrados.length > 0 ? (
                    <ProductGrid productos={filtrados} onAdd={(producto) => addItem({ tipo: 'producto', ...producto })} label="Productos" />
                ) : (
                    <StatusMessage title="No encontramos productos" message="Probá con otra búsqueda o categoría." />
                )}
            </AsyncState>
        </div>
    );
}
