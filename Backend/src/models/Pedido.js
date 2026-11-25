class Pedido {
    constructor(id, fecha, estado, modalidad, direccion, medioPago, total, costoEnvio, usuarioId, sucursalId, zona = null, historial = []) {
        this.id = id;
        this.fecha = fecha;
        this.estado = estado;
        this.modalidad = modalidad;
        this.direccion = direccion;
        this.medioPago = medioPago;
        this.total = total;
        this.costoEnvio = costoEnvio;
        this.usuarioId = usuarioId;
        this.sucursalId = sucursalId;
        this.zona = zona;
        this.historial = historial;
    }
}

export default Pedido;
