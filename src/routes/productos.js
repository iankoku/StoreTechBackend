import express from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  updateStock
} from '../controllers/productosController.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// 1. Todas las rutas requieren login
router.use(verifyToken);

// 2. LECTURA: todos pueden ver productos (incluido proveedor)
router.get('/', authorizeRoles(['admin', 'gerente', 'empleado', 'proveedor']), getProductos);
router.get('/:id', authorizeRoles(['admin', 'gerente', 'empleado', 'proveedor']), getProductoById);

// 3. ESCRITURA: solo admin, gerente y empleado
router.use(authorizeRoles(['admin', 'gerente', 'empleado']));

router.post('/', createProducto);
router.put('/:id', updateProducto);
router.put('/:id/stock', updateStock);
router.delete('/:id', deleteProducto);

export default router;