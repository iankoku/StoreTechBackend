import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';

/**
 * Verifica que el token JWT sea válido
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token no proporcionado o formato inválido', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, rol }
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado. Inicia sesión nuevamente', 401));
    }
    next(error);
  }
};

/**
 * Autoriza solo a ciertos roles
 * Uso: authorizeRoles('admin', 'gerente')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return next(new AppError('Usuario no autenticado o rol no definido', 401));
    }

    // Normaliza por si acaso (trim y lowercase)
    const userRole = req.user.rol.trim().toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.trim().toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return next(
        new AppError(
          `Acceso denegado. Rol requerido: ${allowedRoles.join(', ')} (tienes: ${req.user.rol})`,
          403
        )
      );
    }

    next();
  };
};