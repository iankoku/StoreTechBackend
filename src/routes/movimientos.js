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
router.use(authorizeRoles('admin', 'gerente', 'empleado'));

// GET /api/movimientos - Obtener todos los movimientos (con filtros)
router.get('/', getMovimientos);

// GET /api/movimientos/stats - Estadísticas de movimientos
router.get('/stats', getEstadisticas);

// GET /api/movimientos/:id - Obtener movimiento por ID
router.get('/:id', getMovimientoById);

// POST /api/movimientos - Crear movimiento manual
router.post('/', createMovimiento);

export default router;
