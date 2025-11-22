import express from 'express';
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updateEstadoPedido,
  deletePedido
} from '../controllers/pedidosController.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);
router.use(authorizeRoles('admin', 'gerente', 'empleado'));

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', getPedidos);

// GET /api/pedidos/:id - Obtener pedido por ID
router.get('/:id', getPedidoById);

// POST /api/pedidos - Crear nuevo pedido
router.post('/', createPedido);

// PUT /api/pedidos/:id - Actualizar estado de pedido
router.put('/:id', updateEstadoPedido);

// DELETE /api/pedidos/:id - Eliminar pedido
router.delete('/:id', deletePedido);

export default router;
