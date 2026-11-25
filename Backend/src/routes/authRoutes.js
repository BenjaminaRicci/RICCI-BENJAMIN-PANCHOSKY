import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/registro', AuthController.registrar);
router.post('/login', AuthController.login);
router.get('/perfil', autenticar, AuthController.perfil);

export default router;
