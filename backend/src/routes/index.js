import { Router } from 'express';
import productoRoutes from './productoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import comboRoutes from './comboRoutes.js';
import sucursalRoutes from './sucursalRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/combos', comboRoutes);
router.use('/sucursales', sucursalRoutes);
router.use('/pedidos', pedidoRoutes);

export default router;
