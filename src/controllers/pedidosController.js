import db from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Obtener todos los pedidos
 * - Admin, gerente y empleado: ven todos
 * - Proveedor: solo ve los pedidos donde él es el proveedor
 */
export const getPedidos = asyncHandler(async (req, res) => {
  let query = `
    SELECT p.*, u.nombre as proveedor_nombre, u.email as proveedor_email
    FROM pedidos p
    INNER JOIN usuarios u ON p.proveedor_id = u.id
  `;
  const params = [];

  // Si el usuario es proveedor, filtramos solo sus pedidos
  if (req.user.rol === 'proveedor') {
    query += ` WHERE p.proveedor_id = ?`;
    params.push(req.user.id);
  }

  query += ` ORDER BY p.fecha DESC`;

  const [pedidos] = await db.query(query, params);

  res.json({
    success: true,
    count: pedidos.length,
    data: pedidos
  });
});

/**
 * Obtener pedido por ID con sus detalles
 * - Admin, gerente y empleado: pueden ver cualquier pedido
 * - Proveedor: solo puede ver el pedido si él es el proveedor
 */
export const getPedidoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [pedidos] = await db.query(
    `SELECT p.*, u.nombre as proveedor_nombre, u.email as proveedor_email
     FROM pedidos p
     INNER JOIN usuarios u ON p.proveedor_id = u.id
     WHERE p.id = ?`,
    [id]
  );

  if (pedidos.length === 0) {
    throw new AppError('Pedido no encontrado', 404);
  }

  const pedido = pedidos[0];

  // Seguridad adicional: el proveedor solo puede ver sus propios pedidos
  if (req.user.rol === 'proveedor' && pedido.proveedor_id !== req.user.id) {
    throw new AppError('Acceso denegado: este pedido no pertenece a tu cuenta', 403);
  }

  res.json({
    success: true,
    data: pedido
  });
});

/**
 * Crear nuevo pedido
 */
export const createPedido = asyncHandler(async (req, res) => {
  const { proveedor_id, total } = req.body;

  if (!proveedor_id || !total) {
    throw new AppError('Proveedor y total son requeridos', 400);
  }

  const [result] = await db.query(
    'INSERT INTO pedidos (proveedor_id, total, estado) VALUES (?, ?, ?)',
    [proveedor_id, total, 'pendiente']
  );

  res.status(201).json({
    success: true,
    message: 'Pedido creado exitosamente',
    data: {
      id: result.insertId,
      proveedor_id,
      total,
      estado: 'pendiente'
    }
  });
});

/**
 * Actualizar estado de pedido
 */
export const updateEstadoPedido = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado, productos } = req.body; // productos: [{ producto_id, cantidad }]

  if (!estado) {
    throw new AppError('Estado es requerido', 400);
  }

  if (!['pendiente', 'completado', 'cancelado'].includes(estado)) {
    throw new AppError('Estado inválido', 400);
  }

  // Verificar que el pedido existe
  const [pedidos] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);

  if (pedidos.length === 0) {
    throw new AppError('Pedido no encontrado', 404);
  }

  const pedidoActual = pedidos[0];

  // Si se marca como completado y tiene productos, actualizar stock
  if (estado === 'completado' && pedidoActual.estado !== 'completado') {
    if (productos && Array.isArray(productos) && productos.length > 0) {
      for (const item of productos) {
        const { producto_id, cantidad } = item;

        // Actualizar stock del producto
        await db.query(
          'UPDATE productos SET stock_actual = stock_actual + ? WHERE id = ?',
          [cantidad, producto_id]
        );

        // Registrar movimiento de entrada
        await db.query(
          'INSERT INTO movimientos (producto_id, tipo, cantidad, usuario_id) VALUES (?, ?, ?, ?)',
          [producto_id, 'entrada', cantidad, req.user.id]
        );
      }
    }
  }

  // Actualizar estado del pedido
  await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);

  res.json({
    success: true,
    message: `Pedido marcado como ${estado}`,
    stockActualizado: estado === 'completado' && productos?.length > 0
  });
});

/**
 * Eliminar pedido
 */
export const deletePedido = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.query('DELETE FROM pedidos WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError('Pedido no encontrado', 404);
  }

  res.json({
    success: true,
    message: 'Pedido eliminado exitosamente'
  });
});