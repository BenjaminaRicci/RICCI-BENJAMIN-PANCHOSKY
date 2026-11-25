import { Router } from 'express';
import ConfiguracionController from '../controllers/ConfiguracionController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';
import { Roles } from '../enums/Roles.js';

const router = Router();

router.get('/', ConfiguracionController.obtener);
router.put('/', autenticar, autorizar(Roles.ADMINISTRADOR), ConfiguracionController.actualizar);

export default router;
