const CLASES = {
  Pendiente: 'estado-pendiente',
  Confirmado: 'estado-confirmado',
  'En preparación': 'estado-preparacion',
  Listo: 'estado-listo',
  'En camino': 'estado-camino',
  Finalizado: 'estado-finalizado',
  Cancelado: 'estado-cancelado'
};

export default function EstadoBadge({ estado }) {
  return <span className={`estado ${CLASES[estado] ?? ''}`}>{estado}</span>;
}
