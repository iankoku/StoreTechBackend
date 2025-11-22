import express from 'express';
import { login, verifyUser } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/auth/login - Login de usuario
router.post('/login', login);

// GET /api/auth/verify - Verificar token actual
router.get('/verify', verifyToken, verifyUser);

export default router;
