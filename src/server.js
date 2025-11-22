import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './utils/errorHandler.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/usuarios.js';
import categoriasRoutes from './routes/categorias.js';
import productosRoutes from './routes/productos.js';
import pedidosRoutes from './routes/pedidos.js';
import movimientosRoutes from './routes/movimientos.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rutas principales
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StoreTech API - Sistema de Gestión de Inventario',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      pedidos: '/api/pedidos',
      movimientos: '/api/movimientos'
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/movimientos', movimientosRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Manejador de errores (debe ser el último middleware)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🚀 StoreTech API Server Running     ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  console.log('');
  console.log('📚 API Documentation:');
  console.log(`   - Auth:        http://localhost:${PORT}/api/auth`);
  console.log(`   - Usuarios:    http://localhost:${PORT}/api/usuarios`);
  console.log(`   - Categorías:  http://localhost:${PORT}/api/categorias`);
  console.log(`   - Productos:   http://localhost:${PORT}/api/productos`);
  console.log(`   - Pedidos:     http://localhost:${PORT}/api/pedidos`);
  console.log(`   - Movimientos: http://localhost:${PORT}/api/movimientos`);
  console.log('');
  console.log('Press CTRL+C to stop');
  console.log('');
});

export default app;
