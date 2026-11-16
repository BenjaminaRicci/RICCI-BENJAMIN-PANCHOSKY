import Button from '../Button/Button.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import './ProductTable.css';

export default function ProductTable({ productos, categorias, canEdit = true, onEdit, onDelete, onToggleDisponible }) {
    const nombreCategoria = (categoriaId) =>
        categorias.find((categoria) => categoria.id === categoriaId)?.nombre ?? 'Sin categoría';

    return (
        <div className="product-table__wrapper" role="region" aria-labelledby="tabla-productos-titulo" tabIndex={0}>
            <table className="product-table">
                <caption id="tabla-productos-titulo" className="visually-hidden">
                    Listado de productos del menú
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Imagen</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Destacado</th>
                        <th scope="col">
                            <span className="visually-hidden">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td>
                                <ProductImage src={producto.imagen} alt="" className="product-table__image" />
                            </td>
                            <th scope="row" className="product-table__name">
                                {producto.nombre}
                            </th>
                            <td>{nombreCategoria(producto.categoriaId)}</td>
                            <td>{formatPrice(producto.precio)}</td>
                            <td>
                                <span
                                    className={`product-table__badge ${
                                        producto.disponible ? 'product-table__badge--ok' : 'product-table__badge--off'
                                    }`}
                                >
                                    {producto.disponible ? 'Disponible' : 'No disponible'}
                                </span>
                            </td>
                            <td>{producto.destacado ? 'Sí' : 'No'}</td>
                            <td>
                                <div className="product-table__actions">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onToggleDisponible(producto)}
                                        aria-label={`Marcar ${producto.nombre} como ${producto.disponible ? 'no disponible' : 'disponible'}`}
                                    >
                                        {producto.disponible ? 'Pausar' : 'Activar'}
                                    </Button>
                                    {canEdit && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEdit(producto)}
                                                aria-label={`Editar ${producto.nombre}`}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => onDelete(producto)}
                                                aria-label={`Eliminar ${producto.nombre}`}
                                            >
                                                Eliminar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
