import { formatPrice } from '../../utils/formatPrice.js';
import { MONTO_MINIMO_ENVIO, UMBRAL_ENVIO_GRATIS } from '../../utils/pedidoRules.js';
import './Benefits.css';

export default function Benefits({ cantidadSucursales }) {
    const sucursalesTexto = cantidadSucursales
        ? `cualquiera de nuestras ${cantidadSucursales} sucursales`
        : 'cualquiera de nuestras sucursales';

    const beneficios = [
        {
            titulo: 'Envío a domicilio',
            texto: `Zona centro y GBA norte. Mínimo ${formatPrice(MONTO_MINIMO_ENVIO)}. Gratis en pedidos de más de ${formatPrice(UMBRAL_ENVIO_GRATIS)}.`
        },
        {
            titulo: 'Retiro en local',
            texto: `Evitá el costo de envío retirando en ${sucursalesTexto}.`
        },
        {
            titulo: 'Todos los medios de pago',
            texto: 'Efectivo, débito, crédito, Mercado Pago y transferencia.'
        }
    ];

    return (
        <section id="nosotros" className="benefits" aria-labelledby="beneficios-titulo">
            <h2 id="beneficios-titulo" className="visually-hidden">
                Nosotros: por qué elegir Panchosky
            </h2>
            <ul className="container benefits__list">
                {beneficios.map(({ titulo, texto }) => (
                    <li key={titulo} className="benefits__item">
                        <h3 className="benefits__title">{titulo}</h3>
                        <p className="benefits__text">{texto}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
