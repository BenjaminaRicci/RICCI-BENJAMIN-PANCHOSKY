import PedidoRepository from '../repositories/PedidoRepository.js';
import DetallePedidoRepository from '../repositories/DetallePedidoRepository.js';
import ProductoRepository from '../repositories/ProductoRepository.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import SucursalRepository from '../repositories/SucursalRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import ConfiguracionRepository from '../repositories/ConfiguracionRepository.js';
import ComboService from './ComboService.js';
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError
} from '../exceptions/AppError.js';
import {
    Messages,
    minimumDeliveryMessage,
    productNotFoundMessage,
    productUnavailableMessage,
    transitionNotAllowedMessage
} from '../enums/Messages.js';
import { Roles } from '../enums/Roles.js';
import {
    EstadoPedido,
    MAX_CANTIDAD_POR_ITEM,
    MedioPago,
    Modalidad,
    siguientesEstados
} from '../enums/Pedido.js';
import { esEnteroEnRango, esTextoNoVacio } from '../utils/validators.js';

const ESTADOS_CANCELABLES = [EstadoPedido.PENDIENTE, EstadoPedido.CONFIRMADO];
const MAX_DIRECCION = 120;

class PedidoService {
    // Calcula el resumen del pedido (RN-01, RN-02, RN-07, RN-08, RN-03 y RN-04) sin crearlo.
    cotizar({ items, modalidad }) {
        if (modalidad !== undefined) {
            this.#validarModalidad(modalidad);
        }

        const detalles = this.#armarDetalles(items);
        return { detalles, ...this.#calcularTotales(detalles, modalidad) };
    }

    crear(datos, usuario) {
        this.#validarModalidad(datos.modalidad);
        const detalles = this.#armarDetalles(datos.items);

        if (!esTextoNoVacio(datos.medioPago)) {
            throw new BadRequestError(Messages.ORDER_PAYMENT_REQUIRED);
        }
        if (!Object.values(MedioPago).includes(datos.medioPago)) {
            throw new BadRequestError(Messages.ORDER_PAYMENT_INVALID);
        }

        if (typeof datos.sucursalId !== 'number') {
            throw new BadRequestError(Messages.ORDER_BRANCH_REQUIRED);
        }
        if (!SucursalRepository.findById(datos.sucursalId)) {
            throw new NotFoundError(Messages.BRANCH_NOT_FOUND);
        }

        const config = ConfiguracionRepository.get();
        const totales = this.#calcularTotales(detalles, datos.modalidad);
        let direccion = null;
        let zona = null;

        if (datos.modalidad === Modalidad.ENVIO) {
            if (!esTextoNoVacio(datos.zona)) {
                throw new BadRequestError(Messages.ORDER_ZONE_REQUIRED);
            }
            if (!config.zonasCobertura.includes(datos.zona)) {
                throw new BadRequestError(Messages.ORDER_ZONE_NOT_COVERED);
            }
            if (!esTextoNoVacio(datos.direccion)) {
                throw new BadRequestError(Messages.ORDER_ADDRESS_REQUIRED);
            }
            if (datos.direccion.trim().length > MAX_DIRECCION) {
                throw new BadRequestError(Messages.INVALID_DATA);
            }
            if (totales.subtotal < config.minimoEnvio) {
                throw new BadRequestError(minimumDeliveryMessage(config.minimoEnvio));
            }
            direccion = datos.direccion.trim();
            zona = datos.zona;
        }

        const pedido = PedidoRepository.create({
            estado: EstadoPedido.PENDIENTE,
            modalidad: datos.modalidad,
            direccion,
            medioPago: datos.medioPago,
            total: totales.total,
            costoEnvio: totales.costoEnvio,
            usuarioId: usuario.id,
            sucursalId: datos.sucursalId,
            zona,
            historial: [this.#registroDeEstado(EstadoPedido.PENDIENTE, usuario)]
        });

        // RN-12: se guarda el precio vigente de cada ítem al momento de la compra.
        detalles.forEach((detalle) =>
            DetallePedidoRepository.create({ ...detalle, pedidoId: pedido.id })
        );

        return this.#detallar(pedido);
    }

    // RN-13: cada rol ve únicamente los pedidos que le corresponden.
    obtenerTodos(usuario, { estado, sucursalId } = {}) {
        if (estado !== undefined && !Object.values(EstadoPedido).includes(estado)) {
            throw new BadRequestError(Messages.ORDER_STATE_INVALID);
        }

        let pedidos;
        if (usuario.rol === Roles.CLIENTE) {
            pedidos = PedidoRepository.findByUsuarioId(usuario.id);
        } else if (usuario.rol === Roles.EMPLEADO) {
            pedidos = PedidoRepository.findBySucursalId(usuario.sucursalId);
        } else {
            pedidos = [...PedidoRepository.findAll()];
        }

        return pedidos
            .filter((pedido) => estado === undefined || pedido.estado === estado)
            .filter((pedido) => sucursalId === undefined || pedido.sucursalId === sucursalId)
            .sort((a, b) => b.id - a.id)
            .map((pedido) => this.#detallar(pedido));
    }

    obtenerPorId(id, usuario) {
        return this.#detallar(this.#obtenerVisible(id, usuario));
    }

    cambiarEstado(id, nuevoEstado, usuario) {
        const pedido = this.#obtenerVisible(id, usuario);

        if (!Object.values(EstadoPedido).includes(nuevoEstado)) {
            throw new BadRequestError(Messages.ORDER_STATE_INVALID);
        }

        const permitidos = siguientesEstados(pedido.estado, pedido.modalidad);
        if (!permitidos.includes(nuevoEstado)) {
            throw new ConflictError(transitionNotAllowedMessage(pedido.estado, nuevoEstado));
        }

        return this.#detallar(this.#aplicarEstado(pedido, nuevoEstado, usuario));
    }

    // RN-11: solo se puede cancelar mientras el pedido esté Pendiente o Confirmado.
    cancelar(id, usuario) {
        const pedido = this.#obtenerVisible(id, usuario);

        if (!ESTADOS_CANCELABLES.includes(pedido.estado)) {
            throw new ConflictError(Messages.ORDER_CANCEL_NOT_ALLOWED);
        }

        return this.#detallar(this.#aplicarEstado(pedido, EstadoPedido.CANCELADO, usuario));
    }

    #obtenerVisible(id, usuario) {
        const pedido = PedidoRepository.findById(id);
        if (!pedido) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }

        if (usuario.rol === Roles.CLIENTE && pedido.usuarioId !== usuario.id) {
            // Se responde como "inexistente" para no revelar pedidos de otros clientes.
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        if (usuario.rol === Roles.EMPLEADO && pedido.sucursalId !== usuario.sucursalId) {
            throw new ForbiddenError(Messages.FORBIDDEN_BRANCH);
        }
        return pedido;
    }

    #aplicarEstado(pedido, estado, usuario) {
        return PedidoRepository.cambiarEstado(
            pedido.id,
            estado,
            this.#registroDeEstado(estado, usuario)
        );
    }

    #registroDeEstado(estado, usuario) {
        return {
            estado,
            fecha: new Date().toISOString(),
            usuarioId: usuario.id,
            usuarioNombre: `${usuario.nombre} ${usuario.apellido}`
        };
    }

    #validarModalidad(modalidad) {
        if (!Object.values(Modalidad).includes(modalidad)) {
            throw new BadRequestError(Messages.ORDER_MODALITY_INVALID);
        }
    }

    #calcularTotales(detalles, modalidad) {
        const config = ConfiguracionRepository.get();
        const subtotal = detalles.reduce(
            (suma, detalle) => suma + detalle.cantidad * detalle.precioUnitario,
            0
        );

        // RN-04: envío gratis solo en pedidos superiores al umbral; retiro nunca paga envío (RN-06).
        const costoEnvio =
            modalidad === Modalidad.ENVIO && subtotal <= config.envioGratisDesde
                ? config.costoEnvio
                : 0;

        return {
            subtotal,
            costoEnvio,
            total: subtotal + costoEnvio,
            minimoEnvio: config.minimoEnvio,
            envioGratisDesde: config.envioGratisDesde,
            cumpleMinimoEnvio: subtotal >= config.minimoEnvio
        };
    }

    // Valida cada ítem y devuelve los detalles listos para guardar, con el precio actual congelado.
    #armarDetalles(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new BadRequestError(Messages.ORDER_EMPTY);
        }

        const acumulados = new Map();

        for (const item of items) {
            if (typeof item !== 'object' || item === null) {
                throw new BadRequestError(Messages.ORDER_ITEM_INVALID);
            }

            const tieneProducto = item.productoId !== undefined && item.productoId !== null;
            const tieneCombo = item.comboId !== undefined && item.comboId !== null;
            if (tieneProducto === tieneCombo) {
                throw new BadRequestError(Messages.ORDER_ITEM_INVALID);
            }
            if (!esEnteroEnRango(item.cantidad, 1, MAX_CANTIDAD_POR_ITEM)) {
                throw new BadRequestError(Messages.ORDER_QUANTITY_INVALID);
            }

            const detalle = tieneProducto ? this.#detalleDeProducto(item) : this.#detalleDeCombo(item);
            const clave = `${detalle.productoId}-${detalle.comboId}-${detalle.panchoId}-${detalle.bebidaId}`;

            // Si el mismo ítem se repite se acumulan las cantidades, respetando el máximo por ítem.
            const existente = acumulados.get(clave);
            if (existente) {
                existente.cantidad += detalle.cantidad;
                if (existente.cantidad > MAX_CANTIDAD_POR_ITEM) {
                    throw new BadRequestError(Messages.ORDER_QUANTITY_INVALID);
                }
            } else {
                acumulados.set(clave, detalle);
            }
        }

        return [...acumulados.values()];
    }

    #detalleDeProducto({ productoId, cantidad }) {
        const producto = this.#obtenerProductoDisponible(productoId);
        return {
            cantidad,
            precioUnitario: producto.precio,
            productoId: producto.id,
            comboId: null,
            nombre: producto.nombre,
            panchoId: null,
            bebidaId: null
        };
    }

    #detalleDeCombo({ comboId, cantidad, panchoId, bebidaId }) {
        const combo = ComboService.obtenerPorId(comboId);

        if (!ComboService.estaVigente(combo)) {
            throw new ConflictError(Messages.COMBO_EXPIRED);
        }
        // RN-08: el combo exige un pancho y una bebida.
        if (panchoId === undefined || panchoId === null) {
            throw new BadRequestError(Messages.COMBO_PANCHO_REQUIRED);
        }
        if (bebidaId === undefined || bebidaId === null) {
            throw new BadRequestError(Messages.COMBO_DRINK_REQUIRED);
        }

        const pancho = this.#obtenerProductoDisponible(panchoId);
        const bebida = this.#obtenerProductoDisponible(bebidaId);

        if (this.#nombreCategoria(pancho) !== 'Panchos') {
            throw new BadRequestError(Messages.COMBO_PANCHO_INVALID);
        }
        if (this.#nombreCategoria(bebida) !== 'Bebidas') {
            throw new BadRequestError(Messages.COMBO_DRINK_INVALID);
        }

        return {
            cantidad,
            precioUnitario: combo.precioPromocional,
            productoId: null,
            comboId: combo.id,
            nombre: `${combo.nombre} (${pancho.nombre} + ${bebida.nombre})`,
            panchoId: pancho.id,
            bebidaId: bebida.id
        };
    }

    #obtenerProductoDisponible(id) {
        const producto = typeof id === 'number' ? ProductoRepository.findById(id) : undefined;
        if (!producto) {
            throw new NotFoundError(productNotFoundMessage(id));
        }
        // RN-02: no se pueden pedir productos no disponibles (se revisa también al confirmar).
        if (!producto.disponible) {
            throw new ConflictError(productUnavailableMessage(producto.nombre));
        }
        return producto;
    }

    #nombreCategoria(producto) {
        return CategoriaRepository.findById(producto.categoriaId)?.nombre;
    }

    #detallar(pedido) {
        const detalles = DetallePedidoRepository.findByPedidoId(pedido.id);
        const cliente = UsuarioRepository.findById(pedido.usuarioId);
        const sucursal = SucursalRepository.findById(pedido.sucursalId);

        return {
            ...pedido,
            subtotal: pedido.total - pedido.costoEnvio,
            detalles,
            sucursal: sucursal ? { id: sucursal.id, nombre: sucursal.nombre } : null,
            cliente: cliente
                ? {
                      id: cliente.id,
                      nombre: cliente.nombre,
                      apellido: cliente.apellido,
                      telefono: cliente.telefono
                  }
                : null,
            siguientesEstados: siguientesEstados(pedido.estado, pedido.modalidad),
            cancelable: ESTADOS_CANCELABLES.includes(pedido.estado)
        };
    }
}

export default new PedidoService();
