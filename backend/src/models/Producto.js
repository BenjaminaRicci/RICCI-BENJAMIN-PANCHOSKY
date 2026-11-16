class Producto {
    constructor(id, nombre, descripcion, precio, imagen, disponible, categoriaId, destacado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.disponible = disponible;
        this.categoriaId = categoriaId;
        this.destacado = destacado;
    }
}

export default Producto;
