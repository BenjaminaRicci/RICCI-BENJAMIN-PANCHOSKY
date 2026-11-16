import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import FormField from '../../components/FormField/FormField.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useForm } from '../../hooks/useForm.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
    actualizarCategoria,
    crearCategoria,
    eliminarCategoria,
    obtenerCategorias
} from '../../services/categoriaService.js';
import { validateCategoriaForm } from '../../utils/validators.js';

export default function AdminCategoriesPage() {
    useDocumentTitle('Administrar categorías');
    const categorias = useFetch(obtenerCategorias);
    const notify = useNotification();
    const { values, setValues, errors, setErrors, handleChange, handleSubmit } = useForm({ nombre: '' }, validateCategoriaForm);
    const [editando, setEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const empezarEdicion = (categoria) => {
        setEditando(categoria);
        setValues({ nombre: categoria.nombre });
        setErrors({});
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setValues({ nombre: '' });
        setErrors({});
    };

    const onValid = async ({ nombre }) => {
        setGuardando(true);
        try {
            if (editando) {
                const actualizada = await actualizarCategoria(editando.id, { nombre: nombre.trim() });
                categorias.setData((lista) => lista.map((c) => (c.id === actualizada.id ? actualizada : c)));
                notify.success(`La categoría se renombró a "${actualizada.nombre}".`);
            } else {
                const creada = await crearCategoria({ nombre: nombre.trim() });
                categorias.setData((lista) => [...lista, creada]);
                notify.success(`La categoría "${creada.nombre}" se creó correctamente.`);
            }
            cancelarEdicion();
        } catch (error) {
            notify.error(error.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await eliminarCategoria(categoriaAEliminar.id);
            categorias.setData((lista) => lista.filter((c) => c.id !== categoriaAEliminar.id));
            notify.success(`La categoría "${categoriaAEliminar.nombre}" se eliminó.`);
            if (editando?.id === categoriaAEliminar.id) {
                cancelarEdicion();
            }
            setCategoriaAEliminar(null);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setEliminando(false);
        }
    };

    return (
        <section aria-labelledby="categorias-titulo">
            <h2 id="categorias-titulo" className="page__subtitle">
                Categorías
            </h2>

            <form className="filters" onSubmit={handleSubmit(onValid)} noValidate>
                <FormField
                    id="categoria-nombre"
                    name="nombre"
                    label={editando ? `Renombrar "${editando.nombre}"` : 'Nueva categoría'}
                    value={values.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                    maxLength={40}
                    required
                />
                <Button type="submit" loading={guardando} loadingText="Guardando...">
                    {editando ? 'Guardar' : '+ Agregar'}
                </Button>
                {editando && (
                    <Button variant="outline" onClick={cancelarEdicion} disabled={guardando}>
                        Cancelar
                    </Button>
                )}
            </form>

            <AsyncState
                loading={categorias.loading}
                error={categorias.error}
                onRetry={categorias.reload}
                loadingText="Cargando categorías..."
                isEmpty={!categorias.data?.length}
                emptyTitle="No hay categorías"
            >
                <div className="product-table__wrapper" role="region" aria-labelledby="tabla-categorias" tabIndex={0}>
                    <table className="product-table product-table--compact">
                        <caption id="tabla-categorias" className="visually-hidden">
                            Listado de categorías
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">
                                    <span className="visually-hidden">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.data?.map((categoria) => (
                                <tr key={categoria.id}>
                                    <th scope="row" className="product-table__name">
                                        {categoria.nombre}
                                    </th>
                                    <td>
                                        <div className="product-table__actions">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => empezarEdicion(categoria)}
                                                aria-label={`Renombrar ${categoria.nombre}`}
                                            >
                                                Renombrar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => setCategoriaAEliminar(categoria)}
                                                aria-label={`Eliminar ${categoria.nombre}`}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AsyncState>

            <ConfirmDialog
                isOpen={Boolean(categoriaAEliminar)}
                title="Eliminar categoría"
                message={`¿Seguro que querés eliminar "${categoriaAEliminar?.nombre}"? Solo se puede eliminar si no tiene productos ni combos asociados.`}
                confirmLabel="Eliminar"
                loading={eliminando}
                onConfirm={handleEliminar}
                onCancel={() => setCategoriaAEliminar(null)}
            />
        </section>
    );
}
