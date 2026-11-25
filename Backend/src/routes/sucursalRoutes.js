import { Router } from 'express';
import SucursalController from '../controllers/SucursalController.js';

const router = Router();

router.get('/', SucursalController.obtenerTodas);

export default router;
