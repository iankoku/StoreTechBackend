// src/utils/updatePasswords.cjs
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');  // ← AQUÍ EL CAMBIO
require('dotenv').config();

const usuarios = [
  { id: 1, password: 'admin123' },
  { id: 2, password: 'empleado123' },
  { id: 3, password: 'gerente123' },
  { id: 4, password: 'proveedor123' }
];

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('Conectado a storetech');

    for (const usuario of usuarios) {
      const hash = await bcrypt.hash(usuario.password, 10);
      await connection.execute(
        'UPDATE usuarios SET password_hash = ? WHERE id = ?',
        [hash, usuario.id]
      );
      console.log(`Hasheado ID ${usuario.id} → ${usuario.password}`);
    }

    console.log('\n¡LOGIN YA FUNCIONA!');
    console.log('Credenciales válidas:');
    console.log('→ admin@inventariotech.com     / admin123');
    console.log('→ empleado@inventariotech.com  / empleado123');
    console.log('→ gerente@inventariotech.com   / gerente123');
    console.log('→ proveedor@supplier.com       / proveedor123');

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();