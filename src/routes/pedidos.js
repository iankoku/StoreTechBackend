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

router.use(verifyToken);

// LECTURA: todos pueden ver pedidos, pero proveedor solo ve los suyos
router.get('/', async (req, res, next) => {
  if (req.user.rol === 'proveedor') {
    req.query.proveedor_id = req.user.id; // fuerza filtro por su ID
  }
  next();
}, getPedidos);

router.get('/:id', getPedidoById); // getPedidoById ya tiene lógica de seguridad (ver más abajo)

// CREACIÓN: solo admin, gerente, empleado
router.post('/', authorizeRoles(['admin', 'gerente', 'empleado']), createPedido);

// MODIFICACIÓN: solo admin y gerente
router.put('/:id', authorizeRoles(['admin', 'gerente']), updateEstadoPedido);
router.delete('/:id', authorizeRoles(['admin', 'gerente']), deletePedido);

export default router;