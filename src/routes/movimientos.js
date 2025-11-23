import express from 'express';
import {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  getEstadisticas
} from '../controllers/movimientosController.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de solo lectura: permitidas para proveedor
router.get('/', authorizeRoles('admin', 'gerente', 'empleado', 'proveedor'), getMovimientos);
router.get('/stats', authorizeRoles('admin', 'gerente', 'empleado', 'proveedor'), getEstadisticas);
router.get('/:id', authorizeRoles('admin', 'gerente', 'empleado', 'proveedor'), getMovimientoById);

// Ruta de escritura: SOLO admin, gerente y empleado (proveedor NO puede crear)
router.post('/', authorizeRoles('admin', 'gerente', 'empleado'), createMovimiento);

export default router;