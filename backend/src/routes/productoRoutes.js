import { Router } from 'express';
import ProductoController from '../controllers/ProductoController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { Roles } from '../enums/Roles.js';

const router = Router();
const soloAdmin = [autenticar, autorizar(Roles.ADMINISTRADOR)];

router.get('/', ProductoController.obtenerTodos);
router.get('/:id', ProductoController.obtenerPorId);
router.post('/', soloAdmin, ProductoController.crear);
router.put('/:id', soloAdmin, ProductoController.actualizar);
router.delete('/:id', soloAdmin, ProductoController.eliminar);
router.patch(
    '/:id/disponibilidad',
    autenticar,
    autorizar(Roles.EMPLEADO, Roles.ADMINISTRADOR),
    ProductoController.cambiarDisponibilidad
);

export default router;
