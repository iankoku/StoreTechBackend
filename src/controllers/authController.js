import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Login - Autenticación de usuario
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    throw new AppError('Email y contraseña son requeridos', 400);
  }

  // Buscar usuario con su rol
  const [users] = await db.query(
    `SELECT u.id, u.nombre, u.email, u.password_hash, r.nombre as rol 
     FROM usuarios u 
     INNER JOIN roles r ON u.rol_id = r.id 
     WHERE u.email = ?`,
    [email]
  );

  if (users.length === 0) {
    throw new AppError('Credenciales incorrectas', 401);
  }

  const user = users[0];

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Credenciales incorrectas', 401);
  }

  // Generar JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    success: true,
    message: 'Login exitoso',
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  });
});

/**
 * Verificar token actual
 */
export const verifyUser = asyncHandler(async (req, res) => {
  // El middleware verifyToken ya validó el token
  const [users] = await db.query(
    `SELECT u.id, u.nombre, u.email, r.nombre as rol 
     FROM usuarios u 
     INNER JOIN roles r ON u.rol_id = r.id 
     WHERE u.id = ?`,
    [req.user.id]
  );

  if (users.length === 0) {
    throw new AppError('Usuario no encontrado', 404);
  }

  res.json({
    success: true,
    user: users[0]
  });
});
