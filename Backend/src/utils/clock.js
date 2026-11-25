// Hora actual (HH:MM) en Argentina, usada para controlar la vigencia de los combos (RN-07).
export const horaActualArgentina = () =>
    new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).format(new Date());
