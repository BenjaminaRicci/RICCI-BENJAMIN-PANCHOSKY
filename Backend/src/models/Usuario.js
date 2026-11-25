class Usuario {
    constructor(id, nombre, apellido, email, password, telefono, rol, sucursalId = null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.rol = rol;
        this.sucursalId = sucursalId;
    }
}

export default Usuario;
