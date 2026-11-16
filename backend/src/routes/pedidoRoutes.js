import { Router } from 'express';
import PedidoController from '../controllers/PedidoController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { Roles } from '../enums/Roles.js';

const router = Router();
const personal = autorizar(Roles.EMPLEADO, Roles.ADMINISTRADOR);

// RN-09: confirmar un pedido requiere sesión iniciada.
router.use(autenticar);

router.post('/', autorizar(Roles.CLIENTE), PedidoController.crear);
router.get('/mios', autorizar(Roles.CLIENTE), PedidoController.obtenerMios);
router.get('/', personal, PedidoController.obtenerTodos);
router.get('/:id', PedidoController.obtenerPorId);
router.patch('/:id/cancelar', autorizar(Roles.CLIENTE), PedidoController.cancelar);
router.patch('/:id/estado', personal, PedidoController.cambiarEstado);

export default router;
