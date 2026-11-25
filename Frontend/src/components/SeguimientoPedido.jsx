const PASOS_ENVIO = ['Pendiente', 'Confirmado', 'En preparación', 'Listo', 'En camino', 'Finalizado'];
const PASOS_RETIRO = ['Pendiente', 'Confirmado', 'En preparación', 'Listo', 'Finalizado'];

// Línea de tiempo del seguimiento del pedido (funcionalidad 6).
export default function SeguimientoPedido({ pedido }) {
  if (pedido.estado === 'Cancelado') {
    return <p className="alert alert-error">Este pedido fue cancelado.</p>;
  }

  const pasos = pedido.modalidad === 'envio' ? PASOS_ENVIO : PASOS_RETIRO;
  const actual = pasos.indexOf(pedido.estado);

  return (
    <ol className="tracker">
      {pasos.map((paso, indice) => (
        <li
          key={paso}
          className={indice < actual ? 'hecho' : indice === actual ? 'actual' : ''}
        >
          <span className="punto">{indice < actual ? '✓' : indice + 1}</span>
          <span className="paso">{paso}</span>
        </li>
      ))}
    </ol>
  );
}
