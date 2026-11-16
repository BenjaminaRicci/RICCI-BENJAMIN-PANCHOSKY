import { useRef, useState } from 'react';
import Button from '../Button/Button.jsx';
import FormField from '../FormField/FormField.jsx';
import RadioGroup from '../FormField/RadioGroup.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { validateCheckoutForm } from '../../utils/validators.js';
import { MODALIDADES, OPCIONES_MEDIO_PAGO, OPCIONES_MODALIDAD } from '../../utils/pedidoRules.js';

const VALORES_INICIALES = {
    modalidad: '',
    direccion: '',
    sucursalId: '',
    medioPago: ''
};

export default function CheckoutForm({ sucursales, subtotal, submitting, onSubmit, onModalidadChange }) {
    const [values, setValues] = useState(VALORES_INICIALES);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);
    const notify = useNotification();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((actuales) => ({ ...actuales, [name]: value }));
        setErrors((actuales) => {
            const { [name]: _campoCorregido, ...resto } = actuales;
            return resto;
        });
        if (name === 'modalidad') {
            onModalidadChange(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateCheckoutForm(values, subtotal);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            notify.error('Revisá los datos de tu pedido antes de confirmar.');
            requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
            return;
        }

        onSubmit(values);
    };

    const sucursalesDisponibles = sucursales.data ?? [];

    return (
        <form ref={formRef} className="checkout-form" onSubmit={handleSubmit} noValidate>
            <RadioGroup
                name="modalidad"
                legend="¿Cómo querés recibir tu pedido?"
                options={OPCIONES_MODALIDAD}
                value={values.modalidad}
                onChange={handleChange}
                error={errors.modalidad}
                required
            />

            {values.modalidad === MODALIDADES.ENVIO && (
                <FormField
                    id="checkout-direccion"
                    name="direccion"
                    label="Dirección de entrega"
                    required
                    autoComplete="street-address"
                    placeholder="Calle, número, piso y depto."
                    value={values.direccion}
                    onChange={handleChange}
                    error={errors.direccion}
                    hint="Solo realizamos envíos en zona centro y GBA norte."
                />
            )}

            {values.modalidad === MODALIDADES.RETIRO && (
                <FormField
                    id="checkout-sucursal"
                    name="sucursalId"
                    label="Sucursal de retiro"
                    as="select"
                    required
                    value={values.sucursalId}
                    onChange={handleChange}
                    disabled={sucursales.loading || Boolean(sucursales.error)}
                    error={errors.sucursalId ?? sucursales.error}
                    hint={sucursales.loading ? 'Cargando sucursales...' : undefined}
                >
                    <option value="">Seleccioná una sucursal</option>
                    {sucursalesDisponibles.map(({ id, nombre, direccion }) => (
                        <option key={id} value={id}>
                            {nombre} — {direccion}
                        </option>
                    ))}
                </FormField>
            )}

            <FormField
                id="checkout-medio-pago"
                name="medioPago"
                label="Medio de pago"
                as="select"
                required
                value={values.medioPago}
                onChange={handleChange}
                error={errors.medioPago}
                hint="El pago en efectivo se abona al recibir o retirar el pedido."
            >
                <option value="">Seleccioná un medio de pago</option>
                {OPCIONES_MEDIO_PAGO.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </FormField>

            <Button type="submit" size="lg" block loading={submitting} loadingText="Enviando pedido...">
                Confirmar pedido
            </Button>
        </form>
    );
}
