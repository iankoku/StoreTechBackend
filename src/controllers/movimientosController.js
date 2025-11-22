import db from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Obtener todos los movimientos con filtros opcionales
 */
export const getMovimientos = asyncHandler(async (req, res) => {
  const { tipo, fecha_inicio, fecha_fin, usuario_id, producto_id } = req.query;

  let query = `
    SELECT m.*, 
           p.nombre as producto_nombre, 
           u.nombre as usuario_nombre
    FROM movimientos m
    INNER JOIN productos p ON m.producto_id = p.id
    INNER JOIN usuarios u ON m.usuario_id = u.id
    WHERE 1=1
  `;

  const params = [];

  if (tipo) {
    query += ' AND m.tipo = ?';
    params.push(tipo);
  }

  if (fecha_inicio) {
    query += ' AND DATE(m.fecha) >= ?';
    params.push(fecha_inicio);
  }

  if (fecha_fin) {
    query += ' AND DATE(m.fecha) <= ?';
    params.push(fecha_fin);
  }

  if (usuario_id) {
    query += ' AND m.usuario_id = ?';
    params.push(usuario_id);
  }

  if (producto_id) {
    query += ' AND m.producto_id = ?';
    params.push(producto_id);
  }

  query += ' ORDER BY m.fecha DESC';

  const [movimientos] = await db.query(query, params);

  res.json({
    success: true,
    count: movimientos.length,
    data: movimientos
  });
});

/**
 * Obtener movimiento por ID
 */
export const getMovimientoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [movimientos] = await db.query(
    `SELECT m.*, 
            p.nombre as producto_nombre, 
            u.nombre as usuario_nombre
     FROM movimientos m
     INNER JOIN productos p ON m.producto_id = p.id
     INNER JOIN usuarios u ON m.usuario_id = u.id
     WHERE m.id = ?`,
    [id]
  );

  if (movimientos.length === 0) {
    throw new AppError('Movimiento no encontrado', 404);
  }

  res.json({
    success: true,
    data: movimientos[0]
  });
});

/**
 * Crear movimiento manual (entrada o salida)
 */
export const createMovimiento = asyncHandler(async (req, res) => {
  const { producto_id, tipo, cantidad } = req.body;

  if (!producto_id || !tipo || !cantidad) {
    throw new AppError('Producto, tipo y cantidad son requeridos', 400);
  }

  if (!['entrada', 'salida'].includes(tipo)) {
    throw new AppError('Tipo debe ser "entrada" o "salida"', 400);
  }

  // Verificar stock si es salida
  if (tipo === 'salida') {
    const [productos] = await db.query('SELECT stock_actual FROM productos WHERE id = ?', [producto_id]);

    if (productos.length === 0) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (productos[0].stock_actual < cantidad) {
      throw new AppError('Stock insuficiente', 400);
    }
  }

  // Actualizar stock
  const operador = tipo === 'entrada' ? '+' : '-';
  await db.query(
    `UPDATE productos SET stock_actual = stock_actual ${operador} ? WHERE id = ?`,
    [cantidad, producto_id]
  );

  // Registrar movimiento
  const [result] = await db.query(
    'INSERT INTO movimientos (producto_id, tipo, cantidad, usuario_id) VALUES (?, ?, ?, ?)',
    [producto_id, tipo, cantidad, req.user.id]
  );

  res.status(201).json({
    success: true,
    message: 'Movimiento registrado exitosamente',
    data: {
      id: result.insertId,
      producto_id,
      tipo,
      cantidad
    }
  });
});

/**
 * Estadísticas de movimientos
 */
export const getEstadisticas = asyncHandler(async (req, res) => {
  const [stats] = await db.query(`
    SELECT 
      COUNT(*) as total_movimientos,
      SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END) as total_entradas,
      SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END) as total_salidas
    FROM movimientos
  `);

  res.json({
    success: true,
    data: stats[0]
  });
});
