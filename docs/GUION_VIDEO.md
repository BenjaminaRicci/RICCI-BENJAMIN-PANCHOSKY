# Guion del video – Defensa del proyecto Panchosky

**Duración objetivo: 8 a 9 minutos** (la consigna pide entre 5 y 10).
**Flujo elegido:** *Realizar y confirmar un pedido* (núcleo del negocio) → seguimiento → gestión por el local.

Este documento tiene todo lo que necesitás para grabar: preparación, qué mostrar en pantalla y qué decir en cada momento. Los textos entre comillas son para **leer o decir con tus palabras**.

---

## 1. Antes de grabar (5 minutos)

1. Cerrá todo lo que esté corriendo y ejecutá **`iniciar.bat`** (carpeta raíz del proyecto). Esto deja el backend en `:3000` y el frontend en `:5173` **con datos limpios** (no hay pedidos previos).
2. Abrí el navegador en **dos pestañas**, ambas en `http://localhost:5173`:
   - **Pestaña A – Cliente** (la principal).
   - **Pestaña B – Empleado** (cada pestaña tiene su propia sesión, no se pisan).
3. En VS Code abrí, **en este orden**, las pestañas que vas a mostrar:
   1. `Backend/src/routes/pedidoRoutes.js`
   2. `Backend/src/middlewares/authMiddleware.js`
   3. `Backend/src/controllers/PedidoController.js`
   4. `Backend/src/services/PedidoService.js`
   5. `Backend/src/repositories/PedidoRepository.js`
   6. `Backend/src/exceptions/AppError.js` y `Backend/src/middlewares/errorHandler.js`
   7. `Frontend/src/services/api.js` y `Frontend/src/services/pedidoService.js`
   8. `Frontend/src/context/CartContext.jsx`
   9. `Frontend/src/pages/CarritoPage.jsx`
4. Subí el zoom de VS Code (Ctrl + `+`) hasta que se lea bien en pantalla completa.
5. **Si grabás después de las 22:00 hs** el combo aparece "finalizado" (RN-07). Solución: entrá como admin → *Combos* → *Editar* → hora límite `23:59` → guardar. (O usalo a tu favor como demo extra de la regla.)
6. Credenciales (también están en el README):

| Rol | Email | Contraseña |
|---|---|---|
| Cliente | `cliente@panchosky.com` | `Cliente1234` |
| Empleado | `empleado@panchosky.com` | `Empleado1234` |
| Administrador | `admin@panchosky.com` | `Admin1234` |

7. Grabación: OBS o Xbox Game Bar (`Win + G`) → exportar en **mp4**. Probá el micrófono 10 segundos antes.

---

## 2. Mapa del video

| Tiempo | Bloque | Pantalla |
|---|---|---|
| 0:00 – 0:40 | Introducción | Menú de la app |
| 0:40 – 1:30 | Arquitectura | Árbol de carpetas en VS Code |
| 1:30 – 4:00 | **Back-End** del flujo | Código backend |
| 4:00 – 5:15 | **Front-End** del flujo | Código frontend |
| 5:15 – 8:15 | **Recorrido en la interfaz** | Navegador (2 pestañas) |
| 8:15 – 9:00 | Cierre | Navegador / README |

---

## 3. Guion

### 0:00 – 0:40 · Introducción
**Pantalla:** menú de Panchosky (`http://localhost:5173`), sin sesión.

> "Hola, soy [tu nombre]. Les presento Panchosky, un sistema de pedidos online para un negocio de comida al paso: panchos, hamburguesas, sándwiches, empanadas y medialunas. El cliente puede pedir con envío a domicilio o retirar en una de las cinco sucursales, y el local gestiona los pedidos, el menú y los combos.
> Para esta defensa voy a explicar el flujo más importante del negocio: **realizar y confirmar un pedido**, y cómo el local lo hace avanzar hasta la entrega. Primero voy a mostrar cómo está hecho en el back-end, después en el front-end, y por último lo vamos a recorrer completo desde la interfaz."

*(Mové el mouse sobre las categorías y el combo para que se vea el menú.)*

### 0:40 – 1:30 · Arquitectura
**Pantalla:** VS Code, explorador con `Backend/src` desplegado.

> "El proyecto está dividido en Backend y Frontend. El backend es Node con Express y respeta la arquitectura de capas de la entrega anterior: **routes**, que definen las URLs y quién puede acceder; **controllers**, que solo reciben la petición y devuelven la respuesta; **services**, donde vive toda la lógica de negocio; **repositories**, que son el acceso a los datos; **models**, **middlewares**, **exceptions** y **responses**, para el manejo de errores y el formato de respuestas.
> El frontend es React con Vite, y todas las peticiones HTTP están centralizadas en la carpeta `services`."

*(Señalá cada carpeta mientras la nombrás.)*

### 1:30 – 4:00 · Back-End del flujo

**1) Ruta — `pedidoRoutes.js`** *(~20 s)*
> "El flujo empieza en la ruta `POST /pedidos`. Fijense que pasa por dos middlewares: `autenticar`, que exige sesión iniciada —es la regla 9, no se puede confirmar un pedido sin cuenta— y `autorizar` con rol cliente. Acá también está `/cotizar`, que calcula los totales sin crear nada y la usa el carrito."

**2) Middleware — `authMiddleware.js`** *(~15 s)*
> "`autenticar` lee el token del encabezado Authorization, lo verifica y carga el usuario en la petición. Si falta o es inválido, devuelve 401. `autorizar` devuelve 403 si el rol no corresponde."

**3) Controller — `PedidoController.js`** *(~15 s)*
> "El controller es muy simple: toma el cuerpo de la petición y el usuario, llama al servicio y responde con `sendSuccess`. No tiene ninguna regla de negocio. Usa `asyncHandler` para que cualquier error vaya directo al manejador central."

**4) Service — `PedidoService.js`, método `crear`** *(~75 s, es el centro del video)*
> "Acá está la lógica. Primero valida la modalidad y arma los detalles con `armarDetalles`: verifica que haya al menos un ítem —regla 1—, que cada cantidad sea un entero entre 1 y 20, y que cada producto exista y **esté disponible**, regla 2. Si el ítem es un combo, `detalleDeCombo` controla que **la oferta esté vigente** —regla 7— y que se haya elegido un pancho y una bebida de las categorías correctas —regla 8.
> Después valida el medio de pago y la sucursal. Si la modalidad es envío, exige zona con cobertura —regla 5—, dirección y que el subtotal alcance el **mínimo de tres mil pesos** —regla 3. Los totales los calcula `calcularTotales`: el envío es gratis si el subtotal supera los ocho mil —regla 4— y el retiro nunca paga envío.
> Por último crea el pedido en estado **Pendiente**, con un historial que registra quién y cuándo cambió el estado, y guarda cada detalle con el **precio del momento de la compra** —regla 12—, así que si el administrador cambia un precio después, los pedidos viejos no se alteran."

*(Scrolleá lentamente por `crear`, `armarDetalles`, `detalleDeCombo` y `calcularTotales` sin leer línea por línea.)*

**5) Estados — `enums/Pedido.js` y `cambiarEstado`/`cancelar`** *(~25 s)*
> "El pedido sigue un flujo de estados: Pendiente, Confirmado, En preparación, Listo, En camino y Finalizado. La función `siguientesEstados` define qué transiciones son válidas, y el servicio rechaza cualquier salto, por ejemplo pasar de Pendiente a Finalizado. El cliente solo puede cancelar si está Pendiente o Confirmado —regla 11. Además cada cliente solo ve sus pedidos y cada empleado los de su sucursal —regla 13."

**6) Repository — `PedidoRepository.js`** *(~10 s)*
> "El repository solo guarda y busca, en memoria. No sabe nada de reglas."

**7) Errores — `AppError.js`, `errorHandler.js`, `ApiResponse.js`** *(~20 s)*
> "Cuando una regla se rompe, el servicio lanza una excepción propia —BadRequest, Forbidden, Conflict, NotFound— con un mensaje claro. El `errorHandler` central las convierte en una respuesta con el código HTTP correcto y el formato `success: false` más el mensaje. Así todos los errores del sistema se manejan igual."

### 4:00 – 5:15 · Front-End del flujo

**1) `services/api.js` y `pedidoService.js`** *(~25 s)*
> "En el frontend, todas las peticiones salen de la carpeta `services`. `api.js` es el único lugar que usa `fetch`: agrega el token, interpreta el formato de respuesta y, si hay un error, lanza una excepción con el mensaje que mandó el backend. `pedidoService.js` expone las operaciones: cotizar, crear, listar, cancelar y cambiar estado."

**2) `context/CartContext.jsx`** *(~15 s)*
> "El carrito, 'Mi pedido', se maneja con un contexto de React y se guarda en el navegador. Permite agregar, cambiar cantidades y quitar productos."

**3) `pages/CarritoPage.jsx`** *(~35 s)*
> "En esta pantalla, cada vez que cambia el carrito o la modalidad, se llama a `cotizar` y **los totales los calcula el backend**, el frontend no duplica reglas. Al confirmar se llama a `crear`. Fijense que el formulario **no valida por su cuenta** los campos: manda los datos tal cual y muestra el mensaje de error que devuelve el backend, para que las validaciones estén realmente del lado del servidor. Si sale bien, se vacía el carrito, se muestra un mensaje de éxito y se navega al detalle del pedido."

### 5:15 – 8:15 · Recorrido por la interfaz
**Pantalla:** navegador. Pestaña A (cliente) y pestaña B (empleado).

**Paso 1 – Sin sesión** *(~20 s)*
- En el menú agregá **Pancho clásico** → "Agregar al pedido" (aparece el aviso verde) → *Mi pedido*.
> "Sin sesión puedo ver el menú y armar el pedido, pero para confirmar me pide iniciar sesión."

**Paso 2 – Login** *(~15 s)*
- *Iniciar sesión* → `cliente@panchosky.com` / `Cliente1234`.
> "Inicio sesión como cliente y el sistema me lleva de vuelta."

**Paso 3 – Validaciones del backend** *(~70 s)* — en *Mi pedido* con solo el Pancho clásico (modalidad **Envío**). Hacé clic en **Confirmar pedido** en cada paso:

| # | Qué hacés | Mensaje que devuelve el backend |
|---|---|---|
| 1 | Confirmar sin completar nada | *El medio de pago es obligatorio.* |
| 2 | Elegir **Mercado Pago** y confirmar | *Debés indicar la sucursal.* |
| 3 | Elegir la sucursal **Microcentro** (la del empleado de la demo), zona **GBA Sur**, confirmar | *Esa zona no tiene cobertura de envío…* |
| 4 | Volver a zona **Centro**, confirmar | *La dirección es obligatoria para envíos a domicilio.* |
| 5 | Escribir `Av. Siempre Viva 742`, confirmar | *Los pedidos con envío a domicilio deben alcanzar un monto mínimo de $3000.* |

> "Antes de siquiera confirmar, el sistema ya me avisa que el envío requiere un mínimo de tres mil pesos. Voy a probar los errores: sin datos, el backend me dice que falta el medio de pago; después la sucursal; si elijo una zona sin cobertura, lo rechaza; sin dirección, también; y con la dirección pero un subtotal de mil ochocientos, no llega al mínimo. Todos estos mensajes vienen del backend."

**Paso 4 – Armar el combo** *(~30 s)*
- Volvé al **Menú** → en el combo tocá **Armar combo** → elegí **Pancho completo** y **Agua mineral** → *Agregar al pedido* → *Mi pedido*.
> "Agrego el combo del día: es un pancho y una bebida a elección, y solo está disponible hasta las 22 horas. Ahora el subtotal es de $4.500, el envío cuesta $800 porque no supera los $8.000, y el total es $5.300. Esos números los calculó el backend."

**Paso 5 – Confirmar** *(~25 s)*
- **Confirmar pedido · $ 5.300**.
> "Confirmo el pedido. Recibo el mensaje de éxito y me lleva al detalle: está en estado **Pendiente**, con la línea de seguimiento, el detalle con los precios congelados y el historial de estados."

**Paso 6 – El local lo gestiona (Pestaña B)** *(~45 s)*
- Cambiá a la **pestaña B** → login `empleado@panchosky.com` / `Empleado1234` → *Pedidos recibidos*.
- Clic en **Confirmar**, y luego **Pasar a preparación**.
> "En otra sesión entro como empleado de la sucursal Microcentro. Veo el pedido nuevo con los datos del cliente. Los únicos botones que aparecen son los estados que son válidos desde el estado actual. Lo confirmo y lo paso a preparación."

**Paso 7 – Regla de cancelación (Pestaña A)** *(~30 s)*
- Volvé a la **pestaña A** (todavía muestra "Pendiente" porque no se actualizó) → **Cancelar pedido** → aceptar el cartel.
> "El cliente todavía ve el pedido como pendiente y trata de cancelarlo. El backend lo rechaza, porque ya está en preparación: solo se puede cancelar en Pendiente o Confirmado. Aparece el error y la pantalla se actualiza: el botón de cancelar desaparece."

**Paso 8 – Entrega (Pestaña B → A)** *(~25 s)*
- En la pestaña B: **Marcar listo** → **Salió a entregar** → **Finalizar (entregado/retirado)**.
- En la pestaña A: **↻ Actualizar estado**.
> "El empleado lo marca listo, en camino y finalizado. Si actualizo desde el cliente, la línea de seguimiento está completa y el historial registra cada cambio con la fecha y quién lo hizo."

*(Opcional si te sobra tiempo: en la pestaña A, menú **Mis pedidos** → **Repetir pedido** vuelve a cargar los productos al carrito.)*

### 8:15 – 9:00 · Cierre
**Pantalla:** `README.md` en VS Code (tabla de reglas de negocio) o la app.

> "En resumen: el flujo completo funciona de punta a punta entre frontend y backend. La lógica y las validaciones están en la capa de servicios del backend, los errores se manejan de forma centralizada con un formato único, y el frontend solo consume la API desde su carpeta de servicios. Además de este flujo, el sistema tiene registro y login con roles, menú y combos, gestión de productos y de empleados, y configuración de envíos. Tengo un test automático del backend que verifica las reglas de negocio. Muchas gracias."

---

## 4. Si algo sale mal mientras grabás

| Problema | Solución |
|---|---|
| El combo figura "finalizado" | Pasaron las 22 hs. Admin → *Combos* → *Editar* → hora `23:59`. |
| Aparece "No se pudo conectar con el servidor" | El backend no está corriendo: ejecutá `iniciar.bat` de nuevo (se reinician los datos). |
| Quedó un pedido viejo de pruebas | Cerrá la ventana "Backend" de `iniciar.bat` y volvé a ejecutarlo: los datos son en memoria. |
| El carrito tiene productos de antes | En *Mi pedido* usá "Quitar" en cada ítem. |
| Se cerró la sesión de una pestaña | Cada pestaña tiene su propia sesión: volvé a ingresar. |

## 5. Posibles preguntas de la defensa

- **¿Dónde está la lógica de negocio?** En `Backend/src/services`, no en los controllers.
- **¿Por qué el total lo calcula el backend?** Para no depender del frontend: nadie puede alterar precios o envío desde el navegador. También se recalcula al confirmar.
- **¿Qué pasa si el admin cambia un precio?** Los pedidos ya hechos no cambian (precio congelado en `DetallePedido`).
- **¿Cómo se protege la contraseña?** Se guarda con hash scrypt y salt (`utils/passwordHasher.js`); nunca se devuelve en las respuestas.
- **¿Cómo se maneja la sesión?** Token firmado con expiración (`utils/tokenService.js`), enviado en el encabezado `Authorization: Bearer`.
- **¿Por qué en memoria?** La consigna mantiene la persistencia de la Entrega 2 (repositorios con arrays). La capa de repositorios permite cambiarla por una base de datos sin tocar services ni controllers.
- **¿Cómo se verifican las reglas?** `cd Backend && npm test` (19 pruebas sobre registro, permisos, reglas del pedido y transiciones de estado).
