const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export const formatearPrecio = (valor) => formatoPrecio.format(valor);

export const formatearFecha = (iso) =>
  new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });

const EMOJIS = {
  Panchos: '🌭',
  Hamburguesas: '🍔',
  Sandwiches: '🥪',
  Empanadas: '🥟',
  Medialunas: '🥐',
  Bebidas: '🥤'
};

export const emojiDeCategoria = (nombre) => EMOJIS[nombre] ?? '🍽️';

export const ETIQUETA_MODALIDAD = { envio: 'Envío a domicilio', retiro: 'Retiro en sucursal' };

export const MEDIOS_DE_PAGO = [
  { valor: 'efectivo', etiqueta: 'Efectivo (se abona al recibir o retirar)' },
  { valor: 'debito', etiqueta: 'Tarjeta de débito' },
  { valor: 'credito', etiqueta: 'Tarjeta de crédito' },
  { valor: 'mercadopago', etiqueta: 'Mercado Pago' },
  { valor: 'transferencia', etiqueta: 'Transferencia' }
];

export const etiquetaMedioDePago = (valor) =>
  MEDIOS_DE_PAGO.find((medio) => medio.valor === valor)?.etiqueta.split(' (')[0] ?? valor;

// La cobertura real la decide el backend (RN-05); acá solo se listan las zonas ofrecidas.
export const ZONAS = ['Centro', 'GBA Norte', 'GBA Sur', 'GBA Oeste'];

export const ESTADOS = [
  'Pendiente',
  'Confirmado',
  'En preparación',
  'Listo',
  'En camino',
  'Finalizado',
  'Cancelado'
];

export const MAX_CANTIDAD = 20;
