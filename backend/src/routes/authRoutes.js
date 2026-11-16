import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

router.post('/registro', AuthController.registrar);
router.post('/login', AuthController.login);
router.get('/perfil', autenticar, AuthController.obtenerPerfil);
router.put('/perfil', autenticar, AuthController.actualizarPerfil);

export default router;
