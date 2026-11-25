import { Router } from 'express';
import ProductoController from '../controllers/ProductoController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';
import { Roles } from '../enums/Roles.js';

const router = Router();

const soloAdmin = [autenticar, autorizar(Roles.ADMINISTRADOR)];
const personalDelLocal = [autenticar, autorizar(Roles.EMPLEADO, Roles.ADMINISTRADOR)];

// El menú es público: puede consultarse sin iniciar sesión.
router.get('/', ProductoController.obtenerTodos);
router.get('/:id', ProductoController.obtenerPorId);

router.post('/', soloAdmin, ProductoController.crear);
router.put('/:id', soloAdmin, ProductoController.actualizar);
router.delete('/:id', soloAdmin, ProductoController.eliminar);

// El empleado puede marcar productos como no disponibles, pero no modificar precios.
router.patch('/:id/disponibilidad', personalDelLocal, ProductoController.cambiarDisponibilidad);

export default router;
