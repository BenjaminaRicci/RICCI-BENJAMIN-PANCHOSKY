# Panchosky - Diagrama de clases (dominio)

Diagrama simple del modelo de dominio, basado en `Panchosky_Documentacion_Sistema.docx` (sección 6 - Entidades y relaciones). Sirve como guía; puede rehacerse con cualquier herramienta (draw.io, Lucidchart, etc.).

```mermaid
classDiagram
    class Usuario {
        -id: number
        -nombre: string
        -apellido: string
        -email: string
        -password: string
        -telefono: string
        -rol: string
        +registrarse()
        +iniciarSesion()
    }

    class Sucursal {
        -id: number
        -nombre: string
        -direccion: string
    }

    class Categoria {
        -id: number
        -nombre: string
    }

    class Producto {
        -id: number
        -nombre: string
        -descripcion: string
        -precio: number
        -imagen: string
        -disponible: boolean
        +marcarNoDisponible()
    }

    class Combo {
        -id: number
        -nombre: string
        -precioPromocional: number
        -precioOriginal: number
        -horaLimite: string
        +estaVigente()
    }

    class Pedido {
        -id: number
        -fecha: Date
        -estado: string
        -modalidad: string
        -direccion: string
        -medioPago: string
        -total: number
        -costoEnvio: number
        +confirmar()
        +cancelar()
        +cambiarEstado(nuevoEstado)
    }

    class DetallePedido {
        -id: number
        -cantidad: number
        -precioUnitario: number
        -subtotal: number
        +calcularSubtotal()
    }

    Usuario "1" --> "0..*" Pedido : realiza
    Sucursal "1" --> "0..*" Pedido : recibe
    Sucursal "1" --> "0..*" Usuario : emplea (Empleado)
    Pedido "1" --> "1..*" DetallePedido : contiene
    Producto "1" --> "0..*" DetallePedido : se incluye en
    Combo "1" --> "0..*" DetallePedido : se incluye en
    Categoria "1" --> "0..*" Producto : clasifica
```

## Relación principal
Usuario (Cliente) → Pedido → DetallePedido → Producto / Combo

## Notas
- `Usuario.rol` distingue Cliente, Empleado y Administrador (RN-13, sección 4 del documento).
- `DetallePedido` une un `Pedido` con un `Producto` **o** un `Combo` (solo uno de `productoId`/`comboId` estará presente).
- El estado de `Pedido` sigue el flujo: Pendiente → Confirmado → En preparación → Listo → En camino / Listo para retirar → Finalizado (o Cancelado desde Pendiente/Confirmado).
