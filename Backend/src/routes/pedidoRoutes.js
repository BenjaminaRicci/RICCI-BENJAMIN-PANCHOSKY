import { Router } from 'express';
import PedidoController from '../controllers/PedidoController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';
import { Roles } from '../enums/Roles.js';

const router = Router();

// La cotización es informativa (no crea nada), por eso puede usarla también un visitante.
router.post('/cotizar', PedidoController.cotizar);

router.use(autenticar);

router.post('/', autorizar(Roles.CLIENTE), PedidoController.crear);

// Cada rol recibe solo los pedidos que le corresponden (se filtra en el servicio).
router.get('/', PedidoController.obtenerTodos);
router.get('/:id', PedidoController.obtenerPorId);
router.patch('/:id/cancelar', PedidoController.cancelar);
router.patch(
    '/:id/estado',
    autorizar(Roles.EMPLEADO, Roles.ADMINISTRADOR),
    PedidoController.cambiarEstado
);

export default router;
