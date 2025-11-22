import db from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Obtener todos los productos
 */
export const getProductos = asyncHandler(async (req, res) => {
  const [productos] = await db.query(
    `SELECT p.*, c.nombre as categoria_nombre 
     FROM productos p 
     INNER JOIN categorias c ON p.categoria_id = c.id 
     ORDER BY p.nombre`
  );

  res.json({
    success: true,
    count: productos.length,
    data: productos
  });
});

/**
 * Obtener producto por ID
 */
export const getProductoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [productos] = await db.query(
    `SELECT p.*, c.nombre as categoria_nombre 
     FROM productos p 
     INNER JOIN categorias c ON p.categoria_id = c.id 
     WHERE p.id = ?`,
    [id]
  );

  if (productos.length === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({
    success: true,
    data: productos[0]
  });
});

/**
 * Crear nuevo producto
 */
export const createProducto = asyncHandler(async (req, res) => {
  const { nombre, descripcion, categoria_id, precio, stock_actual } = req.body;

  if (!nombre || !categoria_id || !precio) {
    throw new AppError('Nombre, categoría y precio son requeridos', 400);
  }

  const [result] = await db.query(
    'INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock_actual) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion || null, categoria_id, precio, stock_actual || 0]
  );

  res.status(201).json({
    success: true,
    message: 'Producto creado exitosamente',
    data: {
      id: result.insertId,
      nombre,
      descripcion,
      categoria_id,
      precio,
      stock_actual: stock_actual || 0
    }
  });
});

/**
 * Actualizar producto
 */
export const updateProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria_id, precio, stock_actual } = req.body;

  let query = 'UPDATE productos SET ';
  const params = [];
  const updates = [];

  if (nombre) {
    updates.push('nombre = ?');
    params.push(nombre);
  }
  if (descripcion !== undefined) {
    updates.push('descripcion = ?');
    params.push(descripcion);
  }
  if (categoria_id) {
    updates.push('categoria_id = ?');
    params.push(categoria_id);
  }
  if (precio) {
    updates.push('precio = ?');
    params.push(precio);
  }
  if (stock_actual !== undefined) {
    updates.push('stock_actual = ?');
    params.push(stock_actual);
  }

  if (updates.length === 0) {
    throw new AppError('No hay campos para actualizar', 400);
  }

  query += updates.join(', ') + ' WHERE id = ?';
  params.push(id);

  const [result] = await db.query(query, params);

  if (result.affectedRows === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({
    success: true,
    message: 'Producto actualizado exitosamente'
  });
});

/**
 * Eliminar producto
 */
export const deleteProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({
    success: true,
    message: 'Producto eliminado exitosamente'
  });
});

/**
 * Actualizar stock de un producto
 */
export const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cantidad, tipo } = req.body; // tipo: 'entrada' o 'salida'

  if (!cantidad || !tipo) {
    throw new AppError('Cantidad y tipo son requeridos', 400);
  }

  if (!['entrada', 'salida'].includes(tipo)) {
    throw new AppError('Tipo debe ser "entrada" o "salida"', 400);
  }

  // Obtener stock actual
  const [productos] = await db.query('SELECT stock_actual FROM productos WHERE id = ?', [id]);

  if (productos.length === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  const stockActual = productos[0].stock_actual;
  const nuevaCantidad = tipo === 'entrada' ? cantidad : -cantidad;
  const nuevoStock = stockActual + nuevaCantidad;

  if (nuevoStock < 0) {
    throw new AppError('Stock insuficiente', 400);
  }

  // Actualizar stock
  await db.query('UPDATE productos SET stock_actual = ? WHERE id = ?', [nuevoStock, id]);

  // Registrar movimiento
  await db.query(
    'INSERT INTO movimientos (producto_id, tipo, cantidad, usuario_id) VALUES (?, ?, ?, ?)',
    [id, tipo, Math.abs(cantidad), req.user.id]
  );

  res.json({
    success: true,
    message: `Stock actualizado: ${tipo}`,
    data: {
      stock_anterior: stockActual,
      stock_nuevo: nuevoStock,
      cantidad: Math.abs(cantidad)
    }
  });
});
