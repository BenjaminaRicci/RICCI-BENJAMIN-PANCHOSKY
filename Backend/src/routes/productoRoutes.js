import { Router } from 'express';
import ProductoController from '../controllers/ProductoController.js';

const router = Router();

router.get('/', ProductoController.obtenerTodos);
router.get('/:id', ProductoController.obtenerPorId);
router.post('/', ProductoController.crear);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

export default router;
