import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';
import { Roles } from '../enums/Roles.js';

const router = Router();

router.use(autenticar, autorizar(Roles.ADMINISTRADOR));

router.get('/', UsuarioController.obtenerTodos);
router.post('/empleados', UsuarioController.crearEmpleado);
router.delete('/:id', UsuarioController.eliminarEmpleado);

export default router;
