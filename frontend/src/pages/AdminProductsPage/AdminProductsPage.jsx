import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import ProductForm from '../../components/ProductForm/ProductForm.jsx';
import ProductTable from '../../components/ProductTable/ProductTable.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    actualizarProducto,
    cambiarDisponibilidad,
    crearProducto,
    eliminarProducto,
    obtenerProductos
} from '../../services/productoService.js';
import { obtenerCategorias } from '../../services/categoriaService.js';
import { ROLES } from '../../utils/roles.js';
import './AdminProductsPage.css';

export default function AdminProductsPage() {
    useDocumentTitle('Administrar productos');
    const productos = useFetch(obtenerProductos);
    const categorias = useFetch(obtenerCategorias);
    const notify = useNotification();
    const { hasRole } = useAuth();
    const esAdmin = hasRole(ROLES.ADMINISTRADOR);

    const [formulario, setFormulario] = useState({ abierto: false, producto: null });
    const [guardando, setGuardando] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const abrirFormulario = (producto = null) => setFormulario({ abierto: true, producto });

    const cerrarFormulario = () => {
        if (!guardando) {
            setFormulario({ abierto: false, producto: null });
        }
    };

    const handleGuardar = async (datos) => {
        setGuardando(true);
        try {
            if (formulario.producto) {
                const actualizado = await actualizarProducto(formulario.producto.id, datos);
                productos.setData((lista) => lista.map((p) => (p.id === actualizado.id ? actualizado : p)));
                notify.success(`"${actualizado.nombre}" se actualizó correctamente.`);
            } else {
                const creado = await crearProducto(datos);
                productos.setData((lista) => [...lista, creado]);
                notify.success(`"${creado.nombre}" se creó correctamente.`);
            }
            setFormulario({ abierto: false, producto: null });
        } catch (error) {
            notify.error(error.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await eliminarProducto(productoAEliminar.id);
            productos.setData((lista) => lista.filter((p) => p.id !== productoAEliminar.id));
            notify.success(`"${productoAEliminar.nombre}" se eliminó correctamente.`);
            setProductoAEliminar(null);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setEliminando(false);
        }
    };

    const handleToggleDisponible = async (producto) => {
        try {
            const actualizado = await cambiarDisponibilidad(producto.id, !producto.disponible);
            productos.setData((lista) => lista.map((p) => (p.id === actualizado.id ? actualizado : p)));
            notify.success(`"${actualizado.nombre}" ahora está ${actualizado.disponible ? 'disponible' : 'pausado'}.`);
        } catch (error) {
            notify.error(error.message);
        }
    };

    const recargar = () => {
        productos.reload();
        categorias.reload();
    };

    return (
        <section aria-labelledby="productos-titulo">
            <div className="admin__header">
                <h2 id="productos-titulo" className="page__subtitle">
                    Productos
                </h2>
                {esAdmin && (
                    <Button onClick={() => abrirFormulario()} disabled={!categorias.data}>
                        + Nuevo producto
                    </Button>
                )}
            </div>

            <AsyncState
                loading={productos.loading || categorias.loading}
                error={productos.error ?? categorias.error}
                onRetry={recargar}
                loadingText="Cargando productos..."
                isEmpty={!productos.data?.length}
                emptyTitle="Todavía no hay productos"
                emptyMessage="Creá el primero con el botón «Nuevo producto»."
            >
                <ProductTable
                    productos={productos.data ?? []}
                    categorias={categorias.data ?? []}
                    canEdit={esAdmin}
                    onEdit={abrirFormulario}
                    onDelete={setProductoAEliminar}
                    onToggleDisponible={handleToggleDisponible}
                />
            </AsyncState>

            <Modal
                isOpen={formulario.abierto}
                title={formulario.producto ? 'Editar producto' : 'Nuevo producto'}
                onClose={cerrarFormulario}
            >
                <ProductForm
                    producto={formulario.producto}
                    categorias={categorias.data ?? []}
                    saving={guardando}
                    onSubmit={handleGuardar}
                    onCancel={cerrarFormulario}
                />
            </Modal>

            <ConfirmDialog
                isOpen={Boolean(productoAEliminar)}
                title="Eliminar producto"
                message={`¿Seguro que querés eliminar "${productoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                loading={eliminando}
                onConfirm={handleEliminar}
                onCancel={() => setProductoAEliminar(null)}
            />
        </section>
    );
}
