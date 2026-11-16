// RN-07: el combo solo se puede pedir antes de su hora límite ("HH:MM") del día.
export function isComboVigente(horaLimite, ahora = new Date()) {
    const [horas, minutos] = horaLimite.split(':').map(Number);
    const limite = new Date(ahora);
    limite.setHours(horas, minutos, 0, 0);
    return ahora < limite;
}
