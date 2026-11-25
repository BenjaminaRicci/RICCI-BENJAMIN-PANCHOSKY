import { Router } from 'express';
import ComboController from '../controllers/ComboController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';
import { Roles } from '../enums/Roles.js';

const router = Router();

const soloAdmin = [autenticar, autorizar(Roles.ADMINISTRADOR)];

router.get('/', ComboController.obtenerTodos);
router.post('/', soloAdmin, ComboController.crear);
router.put('/:id', soloAdmin, ComboController.actualizar);
router.delete('/:id', soloAdmin, ComboController.eliminar);

export default router;
