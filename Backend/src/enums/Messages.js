export const Messages = Object.freeze({
    // Generales
    INVALID_DATA: "Los datos enviados son inválidos.",
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INTERNAL_SERVER_ERROR: "Ocurrió un error interno en el servidor.",

    // Productos
    PRODUCT_NOT_FOUND: "El producto no existe.",
    DUPLICATED_RESOURCE: "El producto ya existe.",
    PRODUCT_NAME_REQUIRED: "El nombre del producto es obligatorio.",
    PRODUCT_NAME_TOO_LONG: "El nombre del producto no puede superar los 60 caracteres.",
    PRODUCT_DESCRIPTION_TOO_LONG: "La descripción no puede superar los 200 caracteres.",
    PRODUCT_PRICE_INVALID: "El precio debe ser un número mayor que cero.",
    PRODUCT_CATEGORY_INVALID: "La categoría indicada no existe.",
    PRODUCT_AVAILABLE_INVALID: "El campo disponible debe ser verdadero o falso.",
    PRODUCT_DISABLED_WITH_ORDERS:
        "El producto ya fue vendido, por lo que se marcó como no disponible para conservar el historial.",
    PRODUCT_DELETED: "Producto eliminado correctamente.",

    // Categorías y sucursales
    BRANCH_NOT_FOUND: "La sucursal indicada no existe.",

    // Autenticación y permisos
    AUTH_REQUIRED: "Debés iniciar sesión para realizar esta acción.",
    AUTH_TOKEN_INVALID: "La sesión es inválida o expiró. Iniciá sesión nuevamente.",
    INVALID_CREDENTIALS: "El email o la contraseña son incorrectos.",
    FORBIDDEN: "No tenés permisos para realizar esta acción.",
    FORBIDDEN_BRANCH: "El pedido pertenece a otra sucursal.",

    // Usuarios
    FIRST_NAME_REQUIRED: "El nombre es obligatorio.",
    LAST_NAME_REQUIRED: "El apellido es obligatorio.",
    EMAIL_REQUIRED: "El email es obligatorio.",
    EMAIL_INVALID: "El email no tiene un formato válido (usuario@dominio.com).",
    EMAIL_DUPLICATED: "Ya existe un usuario registrado con ese email.",
    PASSWORD_REQUIRED: "La contraseña es obligatoria.",
    PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",
    PASSWORD_MISMATCH: "Las contraseñas no coinciden.",
    PHONE_REQUIRED: "El teléfono es obligatorio.",
    PHONE_INVALID: "El teléfono debe contener solo dígitos (entre 8 y 13).",
    USER_NOT_FOUND: "El usuario no existe.",
    USER_NOT_DELETABLE: "Solo se pueden eliminar usuarios con rol empleado.",
    EMPLOYEE_BRANCH_REQUIRED: "Debés asignar una sucursal al empleado.",

    // Combos
    COMBO_NOT_FOUND: "El combo no existe.",
    COMBO_DUPLICATED: "Ya existe un combo con ese nombre.",
    COMBO_NAME_REQUIRED: "El nombre del combo es obligatorio.",
    COMBO_PRICE_INVALID: "Los precios del combo deben ser números mayores que cero.",
    COMBO_PROMO_PRICE_TOO_HIGH: "El precio promocional debe ser menor al precio original.",
    COMBO_TIME_INVALID: "La hora límite debe tener el formato HH:MM (por ejemplo 22:00).",
    COMBO_EXPIRED: "La oferta del combo ya finalizó (hora límite superada).",
    COMBO_PANCHO_REQUIRED: "El combo requiere elegir un pancho del menú.",
    COMBO_DRINK_REQUIRED: "El combo requiere elegir una bebida.",
    COMBO_PANCHO_INVALID: "El producto elegido como pancho no pertenece a la categoría Panchos.",
    COMBO_DRINK_INVALID: "El producto elegido como bebida no pertenece a la categoría Bebidas.",

    // Pedidos
    ORDER_NOT_FOUND: "El pedido no existe.",
    ORDER_EMPTY: "El pedido debe tener al menos un producto o combo.",
    ORDER_ITEM_INVALID: "Cada ítem debe indicar exactamente un producto o un combo.",
    ORDER_QUANTITY_INVALID: "La cantidad de cada ítem debe ser un número entero entre 1 y 20.",
    ORDER_MODALITY_INVALID: "La modalidad debe ser envío a domicilio o retiro en sucursal.",
    ORDER_ADDRESS_REQUIRED: "La dirección es obligatoria para envíos a domicilio.",
    ORDER_ZONE_REQUIRED: "La zona de entrega es obligatoria para envíos a domicilio.",
    ORDER_ZONE_NOT_COVERED:
        "Esa zona no tiene cobertura de envío. Solo podés elegir retiro en sucursal.",
    ORDER_BRANCH_REQUIRED: "Debés indicar la sucursal.",
    ORDER_PAYMENT_REQUIRED: "El medio de pago es obligatorio.",
    ORDER_PAYMENT_INVALID: "El medio de pago indicado no está habilitado.",
    ORDER_STATE_INVALID: "El estado indicado no existe.",
    ORDER_TRANSITION_INVALID: "No se puede cambiar el pedido a ese estado desde el estado actual.",
    ORDER_CANCEL_NOT_ALLOWED:
        "El pedido ya no puede cancelarse: solo es posible mientras esté Pendiente o Confirmado.",

    // Configuración
    CONFIG_INVALID:
        "La configuración es inválida: los montos deben ser números no negativos y el envío gratis no puede ser menor al mínimo de envío."
});

export const productUnavailableMessage = (nombre) =>
    `El producto "${nombre}" no está disponible en este momento.`;

export const productNotFoundMessage = (id) => `El producto con id ${id} no existe.`;

export const minimumDeliveryMessage = (minimo) =>
    `Los pedidos con envío a domicilio deben alcanzar un monto mínimo de $${minimo}.`;

export const transitionNotAllowedMessage = (desde, hacia) =>
    `No se puede pasar el pedido de "${desde}" a "${hacia}".`;
