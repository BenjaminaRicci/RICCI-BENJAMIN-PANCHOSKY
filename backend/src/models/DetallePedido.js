class DetallePedido {
    constructor(id, cantidad, precioUnitario, subtotal, pedidoId, productoId, comboId, nombre, seleccion) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.comboId = comboId;
        // Copia del nombre al momento de la compra, igual que el precio (RN-12).
        this.nombre = nombre;
        this.seleccion = seleccion;
    }
}

export default DetallePedido;
