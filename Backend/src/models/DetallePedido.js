class DetallePedido {
    constructor(id, cantidad, precioUnitario, subtotal, pedidoId, productoId, comboId, nombre, panchoId = null, bebidaId = null) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.comboId = comboId;
        this.nombre = nombre;
        this.panchoId = panchoId;
        this.bebidaId = bebidaId;
    }
}

export default DetallePedido;
