import bcrypt from 'bcryptjs';
import db from '../config/database.js';

/**
 * Script para actualizar las contraseñas de los usuarios existentes
 * Este script hashea las contraseñas de prueba para poder hacer login
 */

const usuarios = [
  { email: 'admin@inventariotech.com', password: 'admin123' },
  { email: 'empleado@inventariotech.com', password: 'empleado123' },
  { email: 'gerente@inventariotech.com', password: 'gerente123' },
  { email: 'proveedor@supplier.com', password: 'proveedor123' }
];

async function updatePasswords() {
  console.log('🔐 Actualizando contraseñas de usuarios...\n');

  try {
    for (const usuario of usuarios) {
      const hashedPassword = await bcrypt.hash(usuario.password, 10);
      
      await db.query(
        'UPDATE usuarios SET password_hash = ? WHERE email = ?',
        [hashedPassword, usuario.email]
      );

      console.log(`✅ ${usuario.email} - Password: ${usuario.password}`);
    }

    console.log('\n✨ Contraseñas actualizadas exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    usuarios.forEach(u => {
      console.log(`Email: ${u.email}`);
      console.log(`Pass:  ${u.password}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

updatePasswords();
