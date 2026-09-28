class DetallePedido {
    constructor(id, cantidad, precioUnitario, subtotal, pedidoId, productoId, comboId) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.comboId = comboId;
    }
}

export default DetallePedido;
