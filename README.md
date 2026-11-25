# Panchosky – Sistema de pedidos online

Plataforma de pedidos para Panchosky (panchos, hamburguesas, sándwiches, empanadas y medialunas): el cliente arma su pedido y lo recibe en su domicilio o lo retira en una de las 5 sucursales; el local gestiona los pedidos, el menú, los combos y los empleados.

- **Backend:** Node.js + Express 5 (ES Modules), persistencia en memoria.
- **Frontend:** React 19 + Vite + React Router.

## Cómo ejecutarlo

Opción rápida (Windows): doble clic en [iniciar.bat](./iniciar.bat). Abre backend y frontend y el navegador.

Manual, en dos terminales:

```bash
cd Backend  && npm install && npm start     # http://localhost:3000
cd Frontend && npm install && npm run dev   # http://localhost:5173
```

Tests del backend (reglas de negocio y permisos): `cd Backend && npm test`.

> Los datos están en memoria: al reiniciar el backend se vuelve al estado inicial de demostración.

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Cliente | cliente@panchosky.com | Cliente1234 |
| Empleado (sucursal Microcentro) | empleado@panchosky.com | Empleado1234 |
| Administrador | admin@panchosky.com | Admin1234 |

## Arquitectura

```
Backend/src
├── routes/        Rutas HTTP y protección por rol
├── controllers/   Reciben la petición y devuelven la respuesta (sin lógica de negocio)
├── services/      Lógica de negocio y validaciones (PedidoService, AuthService, ...)
├── repositories/  Acceso a los datos (arrays en memoria)
├── models/        Entidades del dominio
├── middlewares/   Autenticación/autorización, errores centralizados, 404
├── exceptions/    AppError y derivados (400, 401, 403, 404, 409, 500)
├── responses/     Formato único { success, data } / { success, message }
├── enums/         Mensajes, roles, estados del pedido
├── utils/         Hash de contraseñas, tokens, validadores, reloj
└── data/seed.js   Datos iniciales de demostración

Frontend/src
├── services/      ÚNICO lugar con peticiones HTTP (api.js + un servicio por recurso)
├── context/       Sesión, carrito y mensajes (toasts)
├── pages/         Pantallas
├── components/    Navbar, rutas protegidas, seguimiento del pedido
└── utils/         Formatos, hooks y utilidades
```

## Funcionalidades

| Funcionalidad | Quién | Endpoint principal |
|---|---|---|
| Registro / inicio de sesión | Todos | `POST /auth/registro`, `POST /auth/login`, `GET /auth/perfil` |
| Menú por categorías | Público | `GET /productos`, `GET /categorias` |
| Combos con vigencia horaria | Público / Admin | `GET /combos`, `POST/PUT/DELETE /combos` |
| Cotizar el pedido (subtotal, envío, total) | Público | `POST /pedidos/cotizar` |
| **Realizar y confirmar pedido** | Cliente | `POST /pedidos` |
| Historial y detalle de pedidos | Cliente | `GET /pedidos`, `GET /pedidos/:id` |
| Cancelar pedido | Cliente / local | `PATCH /pedidos/:id/cancelar` |
| Gestión de pedidos y cambio de estado | Empleado / Admin | `GET /pedidos`, `PATCH /pedidos/:id/estado` |
| CRUD de productos | Admin | `POST/PUT/DELETE /productos` |
| Disponibilidad de productos | Empleado / Admin | `PATCH /productos/:id/disponibilidad` |
| Empleados, sucursales y parámetros de envío | Admin | `/usuarios`, `/sucursales`, `/configuracion` |

## Reglas de negocio implementadas en el backend

| Regla | Dónde |
|---|---|
| RN-01 pedido con al menos un ítem | `PedidoService.#armarDetalles` |
| RN-02 solo productos disponibles (se revisa al confirmar) | `PedidoService.#obtenerProductoDisponible` |
| RN-03 mínimo de $3000 para envío | `PedidoService.crear` |
| RN-04 envío gratis desde $8000 (configurable) | `PedidoService.#calcularTotales` |
| RN-05 zona de cobertura | `PedidoService.crear` |
| RN-06 retiro sin costo, con sucursal | `PedidoService.crear` / `#calcularTotales` |
| RN-07 vigencia del combo | `ComboService.estaVigente` |
| RN-08 combo = pancho + bebida | `PedidoService.#detalleDeCombo` |
| RN-09 pedido solo con sesión iniciada | `authMiddleware.autenticar` |
| RN-10 email único | `UsuarioService.crear` |
| RN-11 cancelación solo en Pendiente/Confirmado | `PedidoService.cancelar` |
| RN-12 precio congelado en el pedido | `DetallePedidoRepository.create` |
| RN-13 privacidad por cliente / sucursal | `PedidoService.#obtenerVisible` |
| RN-14 medios de pago habilitados | `PedidoService.crear` |
| Transiciones de estado válidas + historial | `siguientesEstados` (enums/Pedido.js), `PedidoService.cambiarEstado` |
| Producto vendido no se elimina, se desactiva | `ProductoService.eliminar` |

## Formato de respuestas

```json
{ "success": true,  "data": { } }
{ "success": false, "message": "Descripción clara del error" }
```

Códigos: 200/201 éxito · 400 datos inválidos · 401 sin sesión · 403 sin permisos · 404 inexistente · 409 conflicto con una regla de negocio.
