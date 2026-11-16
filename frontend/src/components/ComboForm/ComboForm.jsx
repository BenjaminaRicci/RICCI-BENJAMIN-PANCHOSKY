import { useState } from 'react';
import Button from '../Button/Button.jsx';
import FormField from '../FormField/FormField.jsx';
import { useForm } from '../../hooks/useForm.js';
import { validateComboForm } from '../../utils/validators.js';

function toFormValues(combo) {
    return {
        nombre: combo?.nombre ?? '',
        descripcion: combo?.descripcion ?? '',
        precioOriginal: combo ? String(combo.precioOriginal) : '',
        precioPromocional: combo ? String(combo.precioPromocional) : '',
        horaLimite: combo?.horaLimite ?? '23:00',
        imagen: combo?.imagen ?? '',
        componentes: combo?.componentes ?? []
    };
}

export default function ComboForm({ combo, categorias, saving, onSubmit, onCancel }) {
    const { values, setValues, errors, setErrors, handleChange, handleSubmit } = useForm(
        toFormValues(combo),
        validateComboForm
    );
    const [categoriaAAgregar, setCategoriaAAgregar] = useState('');

    const nombreCategoria = (id) => categorias.find((categoria) => categoria.id === id)?.nombre ?? '—';

    const agregarComponente = () => {
        if (!categoriaAAgregar) {
            return;
        }
        setValues((actuales) => ({ ...actuales, componentes: [...actuales.componentes, Number(categoriaAAgregar)] }));
        setErrors((actuales) => ({ ...actuales, componentes: undefined }));
        setCategoriaAAgregar('');
    };

    const quitarComponente = (indice) => {
        setValues((actuales) => ({
            ...actuales,
            componentes: actuales.componentes.filter((_, posicion) => posicion !== indice)
        }));
    };

    const onValid = (datos) =>
        onSubmit({
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion.trim(),
            precioOriginal: Number(datos.precioOriginal),
            precioPromocional: Number(datos.precioPromocional),
            horaLimite: datos.horaLimite,
            imagen: datos.imagen.trim(),
            componentes: datos.componentes
        });

    return (
        <form className="form-stack" onSubmit={handleSubmit(onValid)} noValidate>
            <FormField id="combo-nombre" name="nombre" label="Nombre" value={values.nombre} onChange={handleChange} error={errors.nombre} required />
            <FormField
                id="combo-descripcion"
                name="descripcion"
                as="textarea"
                rows={2}
                label="Descripción"
                value={values.descripcion}
                onChange={handleChange}
            />
            <div className="form-row">
                <FormField
                    id="combo-precio-original"
                    name="precioOriginal"
                    type="number"
                    min="1"
                    label="Precio original"
                    value={values.precioOriginal}
                    onChange={handleChange}
                    error={errors.precioOriginal}
                    required
                />
                <FormField
                    id="combo-precio-promocional"
                    name="precioPromocional"
                    type="number"
                    min="1"
                    label="Precio promocional"
                    value={values.precioPromocional}
                    onChange={handleChange}
                    error={errors.precioPromocional}
                    required
                />
                <FormField
                    id="combo-hora"
                    name="horaLimite"
                    type="time"
                    label="Válido hasta"
                    value={values.horaLimite}
                    onChange={handleChange}
                    error={errors.horaLimite}
                    required
                />
            </div>
            <FormField
                id="combo-imagen"
                name="imagen"
                type="url"
                label="URL de la imagen"
                value={values.imagen}
                onChange={handleChange}
                error={errors.imagen}
            />

            <fieldset className="form-stack" aria-describedby={errors.componentes ? 'combo-componentes-error' : undefined}>
                <legend className="form-field__label">
                    Componentes <span aria-hidden="true">*</span>
                </legend>
                <p className="form-field__hint">El cliente elegirá un producto de cada categoría, en este orden.</p>
                {values.componentes.length > 0 && (
                    <ol className="combo-form__list">
                        {values.componentes.map((categoriaId, indice) => (
                            <li key={`${categoriaId}-${indice}`}>
                                {nombreCategoria(categoriaId)}{' '}
                                <Button size="sm" variant="outline" onClick={() => quitarComponente(indice)} aria-label={`Quitar ${nombreCategoria(categoriaId)}`}>
                                    Quitar
                                </Button>
                            </li>
                        ))}
                    </ol>
                )}
                <div className="filters">
                    <FormField
                        id="combo-componente"
                        name="componentes"
                        as="select"
                        label="Agregar categoría"
                        value={categoriaAAgregar}
                        onChange={(event) => setCategoriaAAgregar(event.target.value)}
                    >
                        <option value="">Elegí una categoría</option>
                        {categorias.map(({ id, nombre }) => (
                            <option key={id} value={id}>
                                {nombre}
                            </option>
                        ))}
                    </FormField>
                    <Button variant="outline" onClick={agregarComponente} disabled={!categoriaAAgregar}>
                        Agregar
                    </Button>
                </div>
                {errors.componentes && (
                    <p id="combo-componentes-error" className="form-field__error">
                        {errors.componentes}
                    </p>
                )}
            </fieldset>

            <div className="form-actions">
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                    Cancelar
                </Button>
                <Button type="submit" loading={saving} loadingText="Guardando...">
                    Guardar
                </Button>
            </div>
        </form>
    );
}
