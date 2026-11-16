import { useState } from 'react';
import Modal from '../Modal/Modal.jsx';
import Button from '../Button/Button.jsx';
import RadioGroup from '../FormField/RadioGroup.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import './ComboBuilderModal.css';

// RN-08: el cliente elige un producto disponible de cada categoría que compone el combo.
export default function ComboBuilderModal({ combo, productos, categorias, onConfirm, onClose }) {
    const [seleccion, setSeleccion] = useState({});
    const [errores, setErrores] = useState({});

    if (!combo) {
        return null;
    }

    const grupos = combo.componentes.map((categoriaId, indice) => ({
        indice,
        nombre: `componente-${indice}`,
        categoria: categorias.find(({ id }) => id === categoriaId)?.nombre ?? 'Producto',
        opciones: productos
            .filter((producto) => producto.categoriaId === categoriaId && producto.disponible)
            .map(({ id, nombre }) => ({ value: String(id), label: nombre }))
    }));

    const handleChange = (indice) => (event) => {
        setSeleccion((actual) => ({ ...actual, [indice]: event.target.value }));
        setErrores((actual) => ({ ...actual, [indice]: undefined }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nuevosErrores = {};
        grupos.forEach(({ indice, categoria }) => {
            if (!seleccion[indice]) {
                nuevosErrores[indice] = `Elegí una opción de ${categoria.toLowerCase()}.`;
            }
        });
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        const ids = grupos.map(({ indice }) => Number(seleccion[indice]));
        const detalle = ids.map((id) => productos.find((producto) => producto.id === id)?.nombre).join(' + ');
        onConfirm({
            tipo: 'combo',
            id: combo.id,
            nombre: combo.nombre,
            precio: combo.precioPromocional,
            imagen: combo.imagen,
            seleccion: ids,
            detalle
        });
    };

    return (
        <Modal isOpen title={`Armá tu ${combo.nombre}`} onClose={onClose}>
            <form className="combo-builder" onSubmit={handleSubmit} noValidate>
                <p className="combo-builder__price">
                    Precio promocional: <strong>{formatPrice(combo.precioPromocional)}</strong>
                </p>
                {grupos.map(({ indice, nombre, categoria, opciones }) =>
                    opciones.length > 0 ? (
                        <RadioGroup
                            key={nombre}
                            name={nombre}
                            legend={`Elegí tu ${categoria.toLowerCase()}`}
                            options={opciones}
                            value={seleccion[indice] ?? ''}
                            onChange={handleChange(indice)}
                            error={errores[indice]}
                            required
                        />
                    ) : (
                        <p key={nombre} className="form-field__error">
                            No hay opciones disponibles de {categoria.toLowerCase()} en este momento.
                        </p>
                    )
                )}
                <div className="combo-builder__actions">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={grupos.some(({ opciones }) => opciones.length === 0)}>
                        Agregar al pedido
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
