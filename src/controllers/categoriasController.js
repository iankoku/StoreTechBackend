import db from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Obtener todas las categorías
 */
export const getCategorias = asyncHandler(async (req, res) => {
  const [categorias] = await db.query('SELECT * FROM categorias ORDER BY nombre');

  res.json({
    success: true,
    count: categorias.length,
    data: categorias
  });
});

/**
 * Obtener categoría por ID
 */
export const getCategoriaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [categorias] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);

  if (categorias.length === 0) {
    throw new AppError('Categoría no encontrada', 404);
  }

  res.json({
    success: true,
    data: categorias[0]
  });
});

/**
 * Crear nueva categoría
 */
export const createCategoria = asyncHandler(async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    throw new AppError('El nombre de la categoría es requerido', 400);
  }

  // Verificar si ya existe
  const [existing] = await db.query('SELECT id FROM categorias WHERE nombre = ?', [nombre]);
  if (existing.length > 0) {
    throw new AppError('Ya existe una categoría con ese nombre', 400);
  }

  const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);

  res.status(201).json({
    success: true,
    message: 'Categoría creada exitosamente',
    data: {
      id: result.insertId,
      nombre
    }
  });
});

/**
 * Actualizar categoría
 */
export const updateCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    throw new AppError('El nombre de la categoría es requerido', 400);
  }

  const [result] = await db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);

  if (result.affectedRows === 0) {
    throw new AppError('Categoría no encontrada', 404);
  }

  res.json({
    success: true,
    message: 'Categoría actualizada exitosamente'
  });
});

/**
 * Eliminar categoría
 */
export const deleteCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Verificar si hay productos asociados
  const [productos] = await db.query('SELECT COUNT(*) as count FROM productos WHERE categoria_id = ?', [id]);

  if (productos[0].count > 0) {
    throw new AppError('No se puede eliminar la categoría porque tiene productos asociados', 400);
  }

  const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError('Categoría no encontrada', 404);
  }

  res.json({
    success: true,
    message: 'Categoría eliminada exitosamente'
  });
});
