import { Router } from 'express';
import CategoriaController from '../controllers/CategoriaController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { Roles } from '../enums/Roles.js';

const router = Router();
const soloAdmin = [autenticar, autorizar(Roles.ADMINISTRADOR)];

router.get('/', CategoriaController.obtenerTodas);
router.post('/', soloAdmin, CategoriaController.crear);
router.put('/:id', soloAdmin, CategoriaController.actualizar);
router.delete('/:id', soloAdmin, CategoriaController.eliminar);

export default router;
