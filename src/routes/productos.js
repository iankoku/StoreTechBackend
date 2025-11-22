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

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/productos - Obtener todos los productos
router.get('/', getProductos);

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', getProductoById);

// Rutas que requieren ser admin o gerente
router.use(authorizeRoles('admin', 'gerente', 'empleado'));

// POST /api/productos - Crear nuevo producto
router.post('/', createProducto);

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', updateProducto);

// PUT /api/productos/:id/stock - Actualizar stock
router.put('/:id/stock', updateStock);

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', deleteProducto);

export default router;
