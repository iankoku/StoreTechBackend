import bcrypt from 'bcryptjs';
import db from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Obtener todos los usuarios
 */
export const getUsuarios = asyncHandler(async (req, res) => {
  const [usuarios] = await db.query(
    `SELECT u.id, u.nombre, u.email, r.nombre as rol, u.fecha_creacion
     FROM usuarios u
     INNER JOIN roles r ON u.rol_id = r.id
     ORDER BY u.fecha_creacion DESC`
  );

  res.json({
    success: true,
    count: usuarios.length,
    data: usuarios
  });
});

/**
 * Obtener usuario por ID
 */
export const getUsuarioById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [usuarios] = await db.query(
    `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol, u.fecha_creacion
     FROM usuarios u
     INNER JOIN roles r ON u.rol_id = r.id
     WHERE u.id = ?`,
    [id]
  );

  if (usuarios.length === 0) {
    throw new AppError('Usuario no encontrado', 404);
  }

  res.json({
    success: true,
    data: usuarios[0]
  });
});

/**
 * Crear nuevo usuario
 */
export const createUsuario = asyncHandler(async (req, res) => {
  const { nombre, email, password, rol_id } = req.body;

  // Validaciones
  if (!nombre || !email || !password || !rol_id) {
    throw new AppError('Todos los campos son requeridos', 400);
  }

  // Verificar si el email ya existe
  const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('El email ya está registrado', 400);
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar usuario
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, ?)',
    [nombre, email, hashedPassword, rol_id]
  );

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: {
      id: result.insertId,
      nombre,
      email,
      rol_id
    }
  });
});

/**
 * Actualizar usuario
 */
export const updateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol_id } = req.body;

  // Verificar que el usuario existe
  const [existing] = await db.query('SELECT id FROM usuarios WHERE id = ?', [id]);
  if (existing.length === 0) {
    throw new AppError('Usuario no encontrado', 404);
  }

  let query = 'UPDATE usuarios SET ';
  const params = [];
  const updates = [];

  if (nombre) {
    updates.push('nombre = ?');
    params.push(nombre);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push('password_hash = ?');
    params.push(hashedPassword);
  }
  if (rol_id) {
    updates.push('rol_id = ?');
    params.push(rol_id);
  }

  if (updates.length === 0) {
    throw new AppError('No hay campos para actualizar', 400);
  }

  query += updates.join(', ') + ' WHERE id = ?';
  params.push(id);

  await db.query(query, params);

  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente'
  });
});

/**
 * Eliminar usuario
 */
export const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError('Usuario no encontrado', 404);
  }

  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  });
});

/**
 * Obtener todos los roles disponibles
 */
export const getRoles = asyncHandler(async (req, res) => {
  const [roles] = await db.query('SELECT * FROM roles ORDER BY nombre');

  res.json({
    success: true,
    data: roles
  });
});
