/**
 * Script utilitario para el anfitrión de Altos del Talampaya Dpto
 *
 * Uso:
 *   node scripts/generate-guest-pin.js [PIN] [DIAS_VIGENCIA]
 *
 * Ejemplo:
 *   node scripts/generate-guest-pin.js 4589 4
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function main() {
  const pin = process.argv[2] || Math.floor(1000 + Math.random() * 9000).toString();
  const days = parseInt(process.argv[3] || '5', 10);

  const saltRounds = 12;
  const hash = await bcrypt.hash(pin, saltRounds);

  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + days);
  expiresDate.setHours(12, 0, 0, 0); // Vence a las 12:00 del día final

  const sessionSecret = crypto.randomBytes(32).toString('hex');

  console.log('\n======================================================');
  console.log('   CONFIGURACIÓN PARA NUEVA ESTADÍA — ALTOS DEL TALAMPAYA');
  console.log('======================================================');
  console.log(`PIN para el huésped: ${pin}`);
  console.log(`Vigencia estimada:   ${days} días (hasta ${expiresDate.toLocaleString('es-AR')})`);
  console.log('------------------------------------------------------');
  console.log('Variables de entorno para .env.local o Vercel:');
  console.log('');
  console.log(`GUEST_GUIDE_ALTOS_DPTO_PIN_HASH=${hash}`);
  console.log(`GUEST_GUIDE_ALTOS_DPTO_PIN_EXPIRES_AT=${expiresDate.toISOString()}`);
  console.log(`GUEST_GUIDE_ALTOS_DPTO_SESSION_SECRET=${sessionSecret}`);
  console.log('');
  console.log('Datos operativos (fijos o según estadía):');
  console.log('GUEST_GUIDE_ALTOS_DPTO_WIFI_NAME=HUAWEI');
  console.log('GUEST_GUIDE_ALTOS_DPTO_WIFI_PASSWORD=AltosDptos26');
  console.log('GUEST_GUIDE_ALTOS_DPTO_KEYBOX_CODE=3417');
  console.log('======================================================\n');
}

main().catch(console.error);
