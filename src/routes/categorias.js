import express from 'express';
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoriasController.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/categorias - Obtener todas las categorías
router.get('/', getCategorias);

// GET /api/categorias/:id - Obtener categoría por ID
router.get('/:id', getCategoriaById);

// Rutas que requieren ser admin o gerente
router.use(authorizeRoles('admin', 'gerente'));

// POST /api/categorias - Crear nueva categoría
router.post('/', createCategoria);

// PUT /api/categorias/:id - Actualizar categoría
router.put('/:id', updateCategoria);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', deleteCategoria);

export default router;
