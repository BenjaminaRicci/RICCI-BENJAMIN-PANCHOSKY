import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productoRoutes from './productoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import sucursalRoutes from './sucursalRoutes.js';
import comboRoutes from './comboRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import configuracionRoutes from './configuracionRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/sucursales', sucursalRoutes);
router.use('/combos', comboRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/configuracion', configuracionRoutes);

export default router;
