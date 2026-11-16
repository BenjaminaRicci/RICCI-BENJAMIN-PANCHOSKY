export const ReglasPedido = Object.freeze({
    MONTO_MINIMO_ENVIO: 3000,
    UMBRAL_ENVIO_GRATIS: 8000,
    COSTO_ENVIO: 1500,
    CANTIDAD_MAXIMA_POR_ITEM: 20,
    // Los envíos a domicilio se despachan desde la sucursal Microcentro.
    SUCURSAL_DESPACHO_ENVIOS_ID: 1
});

export const Modalidades = Object.freeze({
    ENVIO: 'ENVIO',
    RETIRO: 'RETIRO'
});

export const MediosPago = Object.freeze([
    'EFECTIVO',
    'DEBITO',
    'CREDITO',
    'MERCADO_PAGO',
    'TRANSFERENCIA'
]);
