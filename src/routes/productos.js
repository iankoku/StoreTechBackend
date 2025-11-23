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

// 1. Todas las rutas requieren autenticación
router.use(verifyToken);

// 2. LECTURA: permitida para admin, gerente, empleado y proveedor
router.get('/', authorizeRoles('admin', 'gerente', 'empleado', 'proveedor'), getProductos);
router.get('/:id', authorizeRoles('admin', 'gerente', 'empleado', 'proveedor'), getProductoById);

// 3. ESCRITURA: solo admin, gerente y empleado
router.post('/', authorizeRoles('admin', 'gerente', 'empleado'), createProducto);
router.put('/:id', authorizeRoles('admin', 'gerente', 'empleado'), updateProducto);
router.put('/:id/stock', authorizeRoles('admin', 'gerente', 'empleado'), updateStock);
router.delete('/:id', authorizeRoles('admin', 'gerente', 'empleado'), deleteProducto);

export default router;