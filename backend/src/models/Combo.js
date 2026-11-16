class Combo {
    constructor(id, nombre, descripcion, precioPromocional, precioOriginal, horaLimite, componentes, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioPromocional = precioPromocional;
        this.precioOriginal = precioOriginal;
        this.horaLimite = horaLimite;
        // Ids de categoría: el cliente elige un producto de cada una (RN-08).
        this.componentes = componentes;
        this.imagen = imagen;
    }
}

export default Combo;
