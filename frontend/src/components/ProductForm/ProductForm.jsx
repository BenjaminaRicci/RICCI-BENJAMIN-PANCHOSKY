import { useRef, useState } from 'react';
import Button from '../Button/Button.jsx';
import FormField from '../FormField/FormField.jsx';
import CheckboxField from '../FormField/CheckboxField.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { LIMITES_PRODUCTO, validateProductForm } from '../../utils/validators.js';
import './ProductForm.css';

const VALORES_INICIALES = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    imagen: '',
    disponible: true,
    destacado: false
};

function toFormValues(producto) {
    if (!producto) {
        return VALORES_INICIALES;
    }
    return {
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? '',
        precio: String(producto.precio),
        categoriaId: String(producto.categoriaId),
        imagen: producto.imagen ?? '',
        disponible: producto.disponible,
        destacado: Boolean(producto.destacado)
    };
}

export default function ProductForm({ producto, categorias, saving, onSubmit, onCancel }) {
    const [values, setValues] = useState(() => toFormValues(producto));
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);
    const notify = useNotification();

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setValues((actuales) => ({ ...actuales, [name]: type === 'checkbox' ? checked : value }));
        setErrors((actuales) => {
            const { [name]: _campoCorregido, ...resto } = actuales;
            return resto;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateProductForm(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            notify.error('Revisá los campos marcados en el formulario.');
            requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
            return;
        }

        onSubmit({
            nombre: values.nombre.trim(),
            descripcion: values.descripcion.trim(),
            precio: Number(values.precio),
            categoriaId: Number(values.categoriaId),
            imagen: values.imagen.trim(),
            disponible: values.disponible,
            destacado: values.destacado
        });
    };

    return (
        <form ref={formRef} className="product-form" onSubmit={handleSubmit} noValidate>
            <p className="product-form__required-note">
                Los campos marcados con <span aria-hidden="true">*</span> son obligatorios.
            </p>

            <FormField
                id="producto-nombre"
                name="nombre"
                label="Nombre"
                required
                value={values.nombre}
                onChange={handleChange}
                error={errors.nombre}
                hint={`Máximo ${LIMITES_PRODUCTO.NOMBRE_MAX} caracteres.`}
                autoComplete="off"
            />

            <FormField
                id="producto-descripcion"
                name="descripcion"
                label="Descripción"
                as="textarea"
                value={values.descripcion}
                onChange={handleChange}
                error={errors.descripcion}
                hint={`Opcional. Máximo ${LIMITES_PRODUCTO.DESCRIPCION_MAX} caracteres.`}
            />

            <div className="product-form__row">
                <FormField
                    id="producto-precio"
                    name="precio"
                    label="Precio ($)"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    required
                    value={values.precio}
                    onChange={handleChange}
                    error={errors.precio}
                />

                <FormField
                    id="producto-categoria"
                    name="categoriaId"
                    label="Categoría"
                    as="select"
                    required
                    value={values.categoriaId}
                    onChange={handleChange}
                    error={errors.categoriaId}
                >
                    <option value="">Seleccioná una categoría</option>
                    {categorias.map(({ id, nombre }) => (
                        <option key={id} value={id}>
                            {nombre}
                        </option>
                    ))}
                </FormField>
            </div>

            <FormField
                id="producto-imagen"
                name="imagen"
                label="URL de la imagen"
                type="url"
                placeholder="https://..."
                value={values.imagen}
                onChange={handleChange}
                error={errors.imagen}
                hint="Opcional. Si no cargás una imagen se muestra una ilustración genérica."
            />

            <div className="product-form__row">
                <CheckboxField
                    id="producto-disponible"
                    name="disponible"
                    label="Disponible para la venta"
                    checked={values.disponible}
                    onChange={handleChange}
                />
                <CheckboxField
                    id="producto-destacado"
                    name="destacado"
                    label="Mostrar en «Lo más pedidos»"
                    checked={values.destacado}
                    onChange={handleChange}
                />
            </div>

            <div className="product-form__actions">
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                    Cancelar
                </Button>
                <Button type="submit" loading={saving} loadingText="Guardando...">
                    {producto ? 'Guardar cambios' : 'Crear producto'}
                </Button>
            </div>
        </form>
    );
}
