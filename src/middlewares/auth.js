import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';

/**
 * Middleware para verificar JWT
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Token no proporcionado', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, rol }
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    next(error);
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return next(
        new AppError(
          `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}`,
          403
        )
      );
    }

    next();
  };
};
