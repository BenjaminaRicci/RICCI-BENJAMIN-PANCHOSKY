import { Router } from 'express';
import CategoriaController from '../controllers/CategoriaController.js';

const router = Router();

router.get('/', CategoriaController.obtenerTodas);

export default router;
