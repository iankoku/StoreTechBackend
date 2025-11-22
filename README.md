# 🏪 StoreTech Backend API# Introduction 

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

Sistema de gestión de inventario con Express.js, JWT y MySQL.

# Getting Started

## 📋 CaracterísticasTODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1.	Installation process

- ✅ Autenticación con JWT2.	Software dependencies

- ✅ Autorización por roles (Admin, Gerente, Empleado, Proveedor)3.	Latest releases

- ✅ CRUD completo para:4.	API references

  - Usuarios

  - Categorías# Build and Test

  - ProductosTODO: Describe and show how to build your code and run the tests. 

  - Pedidos

  - Movimientos de inventario# Contribute

- ✅ Actualización automática de stockTODO: Explain how other users and developers can contribute to make your code better. 

- ✅ Registro de movimientos (entradas/salidas)

- ✅ Validaciones y manejo de errores centralizadoIf you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)

## 🚀 Instalación- [Visual Studio Code](https://github.com/Microsoft/vscode)

- [Chakra Core](https://github.com/Microsoft/ChakraCore)
### 1. Instalar dependencias

```bash
cd StoreTechBackend
npm install
```

### 2. Configurar base de datos

Importa el archivo `storetech.sql` en tu servidor MySQL/MariaDB:

```bash
mysql -u root -p < ../storetech.sql
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=storetech
DB_PORT=3306

JWT_SECRET=cambia_este_secret_en_produccion
JWT_EXPIRES_IN=24h

PORT=4000
NODE_ENV=development
```

### 4. Actualizar contraseñas de usuarios

```bash
node src/utils/updatePasswords.js
```

### 5. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:4000`

## 📚 Endpoints de la API

### 🔐 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/verify` | Verificar token | Sí |

**Ejemplo Login:**
```json
POST /api/auth/login
{
  "email": "admin@inventariotech.com",
  "password": "admin123"
}

Respuesta:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nombre": "Admin User",
    "email": "admin@inventariotech.com",
    "rol": "admin"
  }
}
```

### 👥 Usuarios

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/usuarios` | Listar usuarios | admin, gerente |
| GET | `/api/usuarios/:id` | Obtener usuario | admin, gerente |
| POST | `/api/usuarios` | Crear usuario | admin, gerente |
| PUT | `/api/usuarios/:id` | Actualizar usuario | admin, gerente |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | admin, gerente |
| GET | `/api/usuarios/roles` | Listar roles | admin, gerente |

### 📦 Categorías

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/categorias` | Listar categorías | Todos |
| GET | `/api/categorias/:id` | Obtener categoría | Todos |
| POST | `/api/categorias` | Crear categoría | admin, gerente |
| PUT | `/api/categorias/:id` | Actualizar categoría | admin, gerente |
| DELETE | `/api/categorias/:id` | Eliminar categoría | admin, gerente |

### 🛍️ Productos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/productos` | Listar productos | Todos |
| GET | `/api/productos/:id` | Obtener producto | Todos |
| POST | `/api/productos` | Crear producto | admin, gerente, empleado |
| PUT | `/api/productos/:id` | Actualizar producto | admin, gerente, empleado |
| PUT | `/api/productos/:id/stock` | Actualizar stock | admin, gerente, empleado |
| DELETE | `/api/productos/:id` | Eliminar producto | admin, gerente, empleado |

### 📋 Pedidos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/pedidos` | Listar pedidos | admin, gerente, empleado |
| GET | `/api/pedidos/:id` | Obtener pedido | admin, gerente, empleado |
| POST | `/api/pedidos` | Crear pedido | admin, gerente, empleado |
| PUT | `/api/pedidos/:id` | Actualizar estado | admin, gerente, empleado |
| DELETE | `/api/pedidos/:id` | Eliminar pedido | admin, gerente, empleado |

**Ejemplo actualizar pedido a completado:**
```json
PUT /api/pedidos/1
{
  "estado": "completado",
  "productos": [
    { "producto_id": 1, "cantidad": 10 },
    { "producto_id": 3, "cantidad": 20 }
  ]
}
```

### 📊 Movimientos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/api/movimientos` | Listar movimientos | admin, gerente, empleado |
| GET | `/api/movimientos/:id` | Obtener movimiento | admin, gerente, empleado |
| POST | `/api/movimientos` | Crear movimiento | admin, gerente, empleado |
| GET | `/api/movimientos/stats` | Estadísticas | admin, gerente, empleado |

**Filtros disponibles para GET /api/movimientos:**
- `tipo`: entrada o salida
- `fecha_inicio`: YYYY-MM-DD
- `fecha_fin`: YYYY-MM-DD
- `usuario_id`: ID del usuario
- `producto_id`: ID del producto

## 🔑 Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@inventariotech.com | admin123 | admin |
| gerente@inventariotech.com | gerente123 | gerente |
| empleado@inventariotech.com | empleado123 | empleado |
| proveedor@supplier.com | proveedor123 | proveedor |

## 🔒 Autenticación

Todas las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

## 📁 Estructura del Proyecto

```
StoreTechBackend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración MySQL
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usuariosController.js
│   │   ├── categoriasController.js
│   │   ├── productosController.js
│   │   ├── pedidosController.js
│   │   └── movimientosController.js
│   ├── middlewares/
│   │   └── auth.js              # JWT y autorización
│   ├── routes/
│   │   ├── auth.js
│   │   ├── usuarios.js
│   │   ├── categorias.js
│   │   ├── productos.js
│   │   ├── pedidos.js
│   │   └── movimientos.js
│   ├── utils/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── updatePasswords.js   # Script de inicialización
│   └── server.js                # Punto de entrada
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tecnologías

- **Express.js** - Framework web
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **MySQL2** - Cliente de base de datos
- **dotenv** - Variables de entorno
- **CORS** - Cross-Origin Resource Sharing
- **express-validator** - Validaciones

## 📝 Notas Importantes

1. **Actualización automática de stock**: Cuando un pedido se marca como "completado", el stock se actualiza automáticamente y se registran los movimientos.

2. **Roles y permisos**:
   - **Admin/Gerente**: Acceso completo a todas las funciones
   - **Empleado**: Gestión de productos, pedidos y movimientos
   - **Proveedor**: Acceso limitado (futuras fases)

3. **Seguridad**:
   - Las contraseñas se almacenan hasheadas con bcrypt
   - Los tokens JWT expiran en 24 horas
   - Todas las rutas protegidas validan el token y el rol

## 🐛 Troubleshooting

**Error de conexión a MySQL:**
- Verifica que el servidor MySQL esté corriendo
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `storetech` exista

**Token inválido:**
- El token expira en 24 horas, solicita uno nuevo haciendo login
- Verifica que estés enviando el header `Authorization: Bearer <token>`

## 📧 Soporte

Para más información o reportar problemas, contacta al equipo de desarrollo.
