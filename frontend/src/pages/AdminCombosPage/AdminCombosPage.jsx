import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import ComboForm from '../../components/ComboForm/ComboForm.jsx';
import AsyncState from '../../components/AsyncState/AsyncState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { actualizarCombo, crearCombo, eliminarCombo, obtenerCombos } from '../../services/comboService.js';
import { obtenerCategorias } from '../../services/categoriaService.js';
import { formatPrice } from '../../utils/formatPrice.js';

export default function AdminCombosPage() {
    useDocumentTitle('Administrar combos');
    const combos = useFetch(obtenerCombos);
    const categorias = useFetch(obtenerCategorias);
    const notify = useNotification();
    const [formulario, setFormulario] = useState({ abierto: false, combo: null });
    const [guardando, setGuardando] = useState(false);
    const [comboAEliminar, setComboAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const nombreCategoria = (id) => categorias.data?.find((categoria) => categoria.id === id)?.nombre ?? '—';

    const cerrarFormulario = () => !guardando && setFormulario({ abierto: false, combo: null });

    const handleGuardar = async (datos) => {
        setGuardando(true);
        try {
            if (formulario.combo) {
                const actualizado = await actualizarCombo(formulario.combo.id, datos);
                combos.setData((lista) => lista.map((c) => (c.id === actualizado.id ? actualizado : c)));
                notify.success(`"${actualizado.nombre}" se actualizó correctamente.`);
            } else {
                const creado = await crearCombo(datos);
                combos.setData((lista) => [...lista, creado]);
                notify.success(`"${creado.nombre}" se creó correctamente.`);
            }
            setFormulario({ abierto: false, combo: null });
        } catch (error) {
            notify.error(error.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await eliminarCombo(comboAEliminar.id);
            combos.setData((lista) => lista.filter((c) => c.id !== comboAEliminar.id));
            notify.success(`"${comboAEliminar.nombre}" se eliminó correctamente.`);
            setComboAEliminar(null);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setEliminando(false);
        }
    };

    return (
        <section aria-labelledby="combos-admin-titulo">
            <div className="admin__header">
                <h2 id="combos-admin-titulo" className="page__subtitle">
                    Combos
                </h2>
                <Button onClick={() => setFormulario({ abierto: true, combo: null })} disabled={!categorias.data}>
                    + Nuevo combo
                </Button>
            </div>

            <AsyncState
                loading={combos.loading || categorias.loading}
                error={combos.error ?? categorias.error}
                onRetry={() => {
                    combos.reload();
                    categorias.reload();
                }}
                loadingText="Cargando combos..."
                isEmpty={!combos.data?.length}
                emptyTitle="No hay combos"
                emptyMessage="Creá el primero con el botón «Nuevo combo»."
            >
                <div className="product-table__wrapper" role="region" aria-labelledby="tabla-combos" tabIndex={0}>
                    <table className="product-table">
                        <caption id="tabla-combos" className="visually-hidden">
                            Listado de combos
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Componentes</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Hasta</th>
                                <th scope="col">
                                    <span className="visually-hidden">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {combos.data?.map((combo) => (
                                <tr key={combo.id}>
                                    <th scope="row" className="product-table__name">
                                        {combo.nombre}
                                    </th>
                                    <td>{combo.componentes.map(nombreCategoria).join(' + ')}</td>
                                    <td>
                                        <s>{formatPrice(combo.precioOriginal)}</s> {formatPrice(combo.precioPromocional)}
                                    </td>
                                    <td>{combo.horaLimite} hs</td>
                                    <td>
                                        <div className="product-table__actions">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setFormulario({ abierto: true, combo })}
                                                aria-label={`Editar ${combo.nombre}`}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => setComboAEliminar(combo)}
                                                aria-label={`Eliminar ${combo.nombre}`}
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

            <Modal isOpen={formulario.abierto} title={formulario.combo ? 'Editar combo' : 'Nuevo combo'} onClose={cerrarFormulario}>
                <ComboForm
                    combo={formulario.combo}
                    categorias={categorias.data ?? []}
                    saving={guardando}
                    onSubmit={handleGuardar}
                    onCancel={cerrarFormulario}
                />
            </Modal>

            <ConfirmDialog
                isOpen={Boolean(comboAEliminar)}
                title="Eliminar combo"
                message={`¿Seguro que querés eliminar "${comboAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                loading={eliminando}
                onConfirm={handleEliminar}
                onCancel={() => setComboAEliminar(null)}
            />
        </section>
    );
}
