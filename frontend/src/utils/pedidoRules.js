// Reglas de negocio de pedidos (RN-03, RN-04, RN-14). El backend vuelve a validarlas.
export const MONTO_MINIMO_ENVIO = 3000;
export const UMBRAL_ENVIO_GRATIS = 8000;
export const COSTO_ENVIO = 1500;
export const CANTIDAD_MAXIMA_POR_ITEM = 20;

export const MODALIDADES = {
    ENVIO: 'ENVIO',
    RETIRO: 'RETIRO'
};

export const OPCIONES_MODALIDAD = [
    { value: MODALIDADES.ENVIO, label: 'Envío a domicilio' },
    { value: MODALIDADES.RETIRO, label: 'Retiro en local' }
];

export const OPCIONES_MEDIO_PAGO = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'DEBITO', label: 'Tarjeta de débito' },
    { value: 'CREDITO', label: 'Tarjeta de crédito' },
    { value: 'MERCADO_PAGO', label: 'Mercado Pago' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' }
];

export function calcularCostoEnvio(subtotal, modalidad) {
    if (modalidad !== MODALIDADES.ENVIO) {
        return 0;
    }
    return subtotal > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
}

export function obtenerEtiqueta(opciones, valor) {
    return opciones.find((opcion) => opcion.value === valor)?.label ?? valor;
}
