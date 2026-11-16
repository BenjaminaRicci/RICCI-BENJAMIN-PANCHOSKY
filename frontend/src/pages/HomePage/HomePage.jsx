import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import ComboBuilderModal from '../../components/ComboBuilderModal/ComboBuilderModal.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import ComboBanner from '../../components/ComboBanner/ComboBanner.jsx';
import CategoryTabs from '../../components/CategoryTabs/CategoryTabs.jsx';
import Benefits from '../../components/Benefits/Benefits.jsx';
import BranchesSection from '../../components/BranchesSection/BranchesSection.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import StatusMessage from '../../components/StatusMessage/StatusMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useCart } from '../../context/CartContext.jsx';
import { obtenerProductos } from '../../services/productoService.js';
import { obtenerCategorias } from '../../services/categoriaService.js';
import { obtenerCombos } from '../../services/comboService.js';
import { obtenerSucursales } from '../../services/sucursalService.js';
import './HomePage.css';

export default function HomePage() {
    useDocumentTitle();
    const productos = useFetch(obtenerProductos);
    const categorias = useFetch(obtenerCategorias);
    const combos = useFetch(obtenerCombos);
    const sucursalesQuery = useFetch(obtenerSucursales);
    const { data: sucursales } = sucursalesQuery;
    const { addItem } = useCart();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [comboAArmar, setComboAArmar] = useState(null);

    useEffect(() => {
        if (location.hash !== '#sucursales') {
            return undefined;
        }
        const frame = window.requestAnimationFrame(() => {
            document.getElementById('sucursales')?.scrollIntoView();
        });
        return () => window.cancelAnimationFrame(frame);
    }, [location.hash]);

    const categoriaParam = Number(searchParams.get('categoria'));
    const categoriaActiva =
        categorias.data?.find((categoria) => categoria.id === categoriaParam)?.id ?? categorias.data?.[0]?.id;
    const nombreCategoriaActiva = categorias.data?.find((categoria) => categoria.id === categoriaActiva)?.nombre;

    const destacados = productos.data?.filter((producto) => producto.destacado && producto.disponible) ?? [];
    const productosCategoria = productos.data?.filter((producto) => producto.categoriaId === categoriaActiva) ?? [];

    const handleAgregarProducto = ({ id, nombre, precio, imagen }) => {
        addItem({ tipo: 'producto', id, nombre, precio, imagen });
    };

    const handleConfirmarCombo = (item) => {
        addItem(item);
        setComboAArmar(null);
    };

    const handleSelectCategoria = (id) => {
        setSearchParams({ categoria: String(id) }, { replace: true, preventScrollReset: true });
    };

    const recargarMenu = () => {
        productos.reload();
        categorias.reload();
    };

    return (
        <>
            <Hero />

            <section className="container section" aria-labelledby="destacados-titulo">
                <div className="home__section-header">
                    <SectionTitle id="destacados-titulo">Lo más pedidos</SectionTitle>
                    <Link to="/productos" className="home__see-all">
                        Ver todo el menú →
                    </Link>
                </div>
                <AsyncState
                    loading={productos.loading}
                    error={productos.error}
                    onRetry={productos.reload}
                    loadingText="Cargando productos..."
                    isEmpty={destacados.length === 0}
                    emptyTitle="Todavía no hay destacados"
                    emptyMessage="Pronto vas a ver acá los productos más pedidos."
                >
                    <ProductGrid productos={destacados} onAdd={handleAgregarProducto} label="Lo más pedidos" />
                </AsyncState>
            </section>

            <section id="combos" className="container home__combos" aria-labelledby="combos-titulo">
                <h2 id="combos-titulo" className="visually-hidden">
                    Combos y ofertas
                </h2>
                <AsyncState
                    loading={combos.loading}
                    error={combos.error}
                    onRetry={combos.reload}
                    loadingText="Cargando ofertas..."
                    isEmpty={!combos.data?.length}
                    emptyTitle="No hay ofertas hoy"
                    emptyMessage="Volvé mañana para descubrir la oferta del día."
                >
                    {combos.data?.map((combo) => (
                        <ComboBanner key={combo.id} combo={combo} onAdd={setComboAArmar} />
                    ))}
                </AsyncState>
                <Link to="/combos" className="home__see-all">
                    Ver todos los combos →
                </Link>
            </section>

            <section id="menu" className="container section" aria-labelledby="menu-titulo">
                <SectionTitle id="menu-titulo">Nuestro menú</SectionTitle>
                <AsyncState
                    loading={productos.loading || categorias.loading}
                    error={categorias.error ?? productos.error}
                    onRetry={recargarMenu}
                    loadingText="Cargando menú..."
                    isEmpty={!categorias.data?.length}
                    emptyTitle="El menú no está disponible"
                >
                    <CategoryTabs
                        categorias={categorias.data ?? []}
                        selectedId={categoriaActiva}
                        onSelect={handleSelectCategoria}
                    />
                    {productosCategoria.length > 0 ? (
                        <ProductGrid
                            productos={productosCategoria}
                            onAdd={handleAgregarProducto}
                            label={`Productos de ${nombreCategoriaActiva}`}
                        />
                    ) : (
                        <StatusMessage
                            title="Sin productos en esta categoría"
                            message="Probá con otra categoría del menú."
                        />
                    )}
                </AsyncState>
            </section>

            <BranchesSection
                sucursales={sucursales ?? []}
                loading={sucursalesQuery.loading}
                error={sucursalesQuery.error}
                onRetry={sucursalesQuery.reload}
            />

            <Benefits cantidadSucursales={sucursales?.length} />

            <ComboBuilderModal
                combo={comboAArmar}
                productos={productos.data ?? []}
                categorias={categorias.data ?? []}
                onConfirm={handleConfirmarCombo}
                onClose={() => setComboAArmar(null)}
            />
        </>
    );
}
