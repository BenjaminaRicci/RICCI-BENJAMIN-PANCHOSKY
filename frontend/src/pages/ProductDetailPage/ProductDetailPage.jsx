import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import ProductImage from '../../components/ProductImage/ProductImage.jsx';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import QuantityControl from '../../components/QuantityControl/QuantityControl.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useCart } from '../../context/CartContext.jsx';
import { obtenerProducto, obtenerProductos } from '../../services/productoService.js';
import { obtenerCategorias } from '../../services/categoriaService.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { CANTIDAD_MAXIMA_POR_ITEM } from '../../utils/pedidoRules.js';
import './ProductDetailPage.css';

const CANTIDAD_RELACIONADOS = 4;

export default function ProductDetailPage() {
    const { id } = useParams();
    const fetchProducto = useCallback(() => obtenerProducto(id), [id]);
    const producto = useFetch(fetchProducto);
    const productos = useFetch(obtenerProductos);
    const { data: categorias } = useFetch(obtenerCategorias);
    const { addItem } = useCart();
    const [cantidad, setCantidad] = useState(1);
    useDocumentTitle(producto.data?.nombre ?? 'Producto');

    const relacionados = (productos.data ?? [])
        .filter((item) => item.categoriaId === producto.data?.categoriaId && item.id !== producto.data?.id)
        .slice(0, CANTIDAD_RELACIONADOS);
    const categoria = categorias?.find((item) => item.id === producto.data?.categoriaId);

    const handleAgregar = () => {
        const { id: productoId, nombre, precio, imagen } = producto.data;
        addItem({ tipo: 'producto', id: productoId, nombre, precio, imagen }, cantidad);
        setCantidad(1);
    };

    return (
        <div className="container section">
            <Link to="/productos" className="page__back">
                ← Volver al menú
            </Link>
            <AsyncState
                loading={producto.loading}
                error={producto.error}
                onRetry={producto.reload}
                loadingText="Cargando producto..."
            >
                {producto.data && (
                    <article className="product-detail">
                        <ProductImage src={producto.data.imagen} alt={producto.data.nombre} className="product-detail__image" />
                        <div className="product-detail__info">
                            {categoria && (
                                <Link to={`/productos?categoria=${categoria.id}`} className="product-detail__category">
                                    {categoria.nombre}
                                </Link>
                            )}
                            <h1 className="page__title">{producto.data.nombre}</h1>
                            <p className="product-detail__description">{producto.data.descripcion}</p>
                            <p className="product-detail__price">{formatPrice(producto.data.precio)}</p>
                            {producto.data.disponible ? (
                                <div className="product-detail__actions">
                                    <QuantityControl
                                        value={cantidad}
                                        onChange={setCantidad}
                                        min={1}
                                        max={CANTIDAD_MAXIMA_POR_ITEM}
                                        itemLabel={producto.data.nombre}
                                    />
                                    <Button size="lg" onClick={handleAgregar}>
                                        Agregar {formatPrice(producto.data.precio * cantidad)}
                                    </Button>
                                </div>
                            ) : (
                                <span className="badge badge--error">No disponible por el momento</span>
                            )}
                        </div>
                    </article>
                )}
            </AsyncState>

            {relacionados.length > 0 && (
                <section className="section" aria-labelledby="relacionados-titulo">
                    <h2 id="relacionados-titulo" className="page__subtitle">
                        También te puede gustar
                    </h2>
                    <ProductGrid
                        productos={relacionados}
                        onAdd={({ id: productoId, nombre, precio, imagen }) =>
                            addItem({ tipo: 'producto', id: productoId, nombre, precio, imagen })
                        }
                        label="Productos relacionados"
                    />
                </section>
            )}
        </div>
    );
}
