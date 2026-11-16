import PedidoRepository from '../repositories/PedidoRepository.js';
import ProductoRepository from '../repositories/ProductoRepository.js';
import SucursalRepository from '../repositories/SucursalRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import ComboService from './ComboService.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { ReglasPedido, Modalidades, MediosPago } from '../enums/ReglasPedido.js';
import { EstadosPedido, EstadosCancelables, obtenerEstadosSiguientes } from '../enums/EstadosPedido.js';
import { Roles } from '../enums/Roles.js';

class PedidoService {
    crear(datos, usuario) {
        if (usuario.rol !== Roles.CLIENTE) {
            throw new ForbiddenError(Messages.ORDER_ONLY_CLIENTS);
        }

        const { modalidad, direccion, sucursalId, medioPago, items } = datos;

        if (!Object.values(Modalidades).includes(modalidad)) {
            throw new BadRequestError(Messages.ORDER_INVALID_MODALITY);
        }

        if (!MediosPago.includes(medioPago)) {
            throw new BadRequestError(Messages.ORDER_INVALID_PAYMENT);
        }

        const itemsConPrecio = this.#resolverItems(items);
        const subtotal = itemsConPrecio.reduce(
            (acumulado, item) => acumulado + item.precioUnitario * item.cantidad,
            0
        );

        let costoEnvio = 0;
        let direccionEntrega = null;
        let sucursal = null;

        if (modalidad === Modalidades.ENVIO) {
            if (typeof direccion !== 'string' || direccion.trim().length === 0) {
                throw new BadRequestError(Messages.ORDER_ADDRESS_REQUIRED);
            }
            if (subtotal < ReglasPedido.MONTO_MINIMO_ENVIO) {
                throw new BadRequestError(Messages.ORDER_MINIMUM_NOT_REACHED);
            }
            direccionEntrega = direccion.trim();
            costoEnvio = subtotal > ReglasPedido.UMBRAL_ENVIO_GRATIS ? 0 : ReglasPedido.COSTO_ENVIO;
            sucursal = SucursalRepository.findById(ReglasPedido.SUCURSAL_DESPACHO_ENVIOS_ID);
        } else {
            if (typeof sucursalId !== 'number') {
                throw new BadRequestError(Messages.ORDER_BRANCH_REQUIRED);
            }
            sucursal = SucursalRepository.findById(sucursalId);
            if (!sucursal) {
                throw new NotFoundError(Messages.BRANCH_NOT_FOUND);
            }
        }

        const pedido = PedidoRepository.create({
            estado: EstadosPedido.PENDIENTE,
            modalidad,
            direccion: direccionEntrega,
            medioPago,
            total: subtotal + costoEnvio,
            costoEnvio,
            usuarioId: usuario.id,
            sucursalId: sucursal?.id ?? null,
            items: itemsConPrecio
        });

        return this.#enriquecer(pedido);
    }

    // RN-13: cada cliente ve solo sus pedidos.
    obtenerMios(usuario) {
        return PedidoRepository.findAll()
            .filter((pedido) => pedido.usuarioId === usuario.id)
            .sort((a, b) => b.id - a.id)
            .map((pedido) => this.#enriquecer(pedido));
    }

    // RN-13: el Empleado ve solo los pedidos de su sucursal; el Administrador ve todos.
    obtenerTodos(usuario, { estado, sucursalId } = {}) {
        return PedidoRepository.findAll()
            .filter((pedido) => this.#puedeGestionar(usuario, pedido))
            .filter((pedido) => !estado || pedido.estado === estado)
            .filter((pedido) => !sucursalId || pedido.sucursalId === Number(sucursalId))
            .sort((a, b) => b.id - a.id)
            .map((pedido) => this.#enriquecer(pedido, { conCliente: true }));
    }

    obtenerPorId(id, usuario) {
        const pedido = this.#buscar(id);
        const esDuenio = pedido.usuarioId === usuario.id;
        if (!esDuenio && !this.#puedeGestionar(usuario, pedido)) {
            // No revela la existencia de pedidos ajenos.
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        return this.#enriquecer(pedido, { conCliente: !esDuenio });
    }

    // RN-11: el cliente solo cancela en Pendiente o Confirmado.
    cancelar(id, usuario) {
        const pedido = this.#buscar(id);
        if (pedido.usuarioId !== usuario.id) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        if (!EstadosCancelables.includes(pedido.estado)) {
            throw new BadRequestError(Messages.ORDER_CANNOT_CANCEL);
        }
        return this.#enriquecer(PedidoRepository.updateEstado(id, EstadosPedido.CANCELADO));
    }

    cambiarEstado(id, estado, usuario) {
        const pedido = this.#buscar(id);
        if (!this.#puedeGestionar(usuario, pedido)) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        if (!obtenerEstadosSiguientes(pedido).includes(estado)) {
            throw new BadRequestError(Messages.ORDER_INVALID_STATUS);
        }
        return this.#enriquecer(PedidoRepository.updateEstado(id, estado), { conCliente: true });
    }

    #buscar(id) {
        const pedido = PedidoRepository.findById(id);
        if (!pedido) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }
        return pedido;
    }

    #puedeGestionar(usuario, pedido) {
        if (usuario.rol === Roles.ADMINISTRADOR) {
            return true;
        }
        return usuario.rol === Roles.EMPLEADO && pedido.sucursalId === usuario.sucursalId;
    }

    #enriquecer(pedido, { conCliente = false } = {}) {
        const sucursal = pedido.sucursalId ? SucursalRepository.findById(pedido.sucursalId) : null;
        const resultado = {
            ...pedido,
            sucursal: sucursal ? { id: sucursal.id, nombre: sucursal.nombre, direccion: sucursal.direccion } : null,
            estadosSiguientes: obtenerEstadosSiguientes(pedido),
            cancelable: EstadosCancelables.includes(pedido.estado)
        };

        if (conCliente) {
            const cliente = UsuarioRepository.findById(pedido.usuarioId);
            resultado.cliente = cliente
                ? { nombre: cliente.nombre, apellido: cliente.apellido, telefono: cliente.telefono, email: cliente.email }
                : null;
        }

        return resultado;
    }

    // Toma los precios del catálogo y no los enviados por el cliente (RN-12: precio congelado).
    #resolverItems(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new BadRequestError(Messages.ORDER_EMPTY);
        }

        return items.map(({ productoId, comboId, cantidad, seleccion }) => {
            if (
                !Number.isInteger(cantidad) ||
                cantidad < 1 ||
                cantidad > ReglasPedido.CANTIDAD_MAXIMA_POR_ITEM
            ) {
                throw new BadRequestError(Messages.ORDER_INVALID_QUANTITY);
            }

            if (typeof productoId === 'number') {
                const producto = ProductoRepository.findById(productoId);
                if (!producto) {
                    throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
                }
                if (!producto.disponible) {
                    throw new BadRequestError(Messages.ORDER_PRODUCT_UNAVAILABLE);
                }
                return {
                    productoId,
                    comboId: null,
                    cantidad,
                    precioUnitario: producto.precio,
                    nombre: producto.nombre,
                    seleccion: null
                };
            }

            if (typeof comboId === 'number') {
                const combo = ComboService.obtenerPorId(comboId);
                if (!ComboService.estaVigente(combo)) {
                    throw new BadRequestError(Messages.ORDER_COMBO_EXPIRED);
                }
                const productosElegidos = ComboService.resolverSeleccion(combo, seleccion);
                return {
                    productoId: null,
                    comboId,
                    cantidad,
                    precioUnitario: combo.precioPromocional,
                    nombre: combo.nombre,
                    seleccion: productosElegidos.map(({ id, nombre }) => ({ productoId: id, nombre }))
                };
            }

            throw new BadRequestError(Messages.INVALID_DATA);
        });
    }
}

export default new PedidoService();
