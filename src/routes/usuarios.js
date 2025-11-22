import express from 'express';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getRoles
} from '../controllers/usuariosController.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación y ser admin o gerente
router.use(verifyToken);
router.use(authorizeRoles('admin', 'gerente'));

// GET /api/usuarios/roles - Obtener todos los roles
router.get('/roles', getRoles);

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', getUsuarios);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', getUsuarioById);

// POST /api/usuarios - Crear nuevo usuario
router.post('/', createUsuario);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', updateUsuario);

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', deleteUsuario);

export default router;
