import { createHmac } from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

// Intercept server-only for standalone Node runner
try {
  const serverOnlyPath = require.resolve('server-only');
  require.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  } as any;
} catch {
  // Ignore if not present
}

// Mock environment variables for testing
const TEST_PIN = '123456';
const TEST_SALT = bcrypt.genSaltSync(10);
const TEST_HASH = bcrypt.hashSync(TEST_PIN, TEST_SALT);
const TEST_SECRET = 'a_very_secure_secret_with_more_than_32_characters_123456';
const FUTURE_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
const PAST_DATE = new Date(Date.now() - 1000 * 60 * 60).toISOString();

async function runTests() {
  console.log('--- Iniciando Suite de Pruebas: Guía Privada de Bienvenida ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Setup environment for testing
  process.env.GUEST_GUIDE_ALTOS_DPTO_PIN_HASH = TEST_HASH;
  process.env.GUEST_GUIDE_ALTOS_DPTO_PIN_EXPIRES_AT = FUTURE_DATE;
  process.env.GUEST_GUIDE_ALTOS_DPTO_SESSION_SECRET = TEST_SECRET;
  process.env.GUEST_GUIDE_ALTOS_DPTO_WIFI_NAME = 'TEST_WIFI_NETWORK';
  process.env.GUEST_GUIDE_ALTOS_DPTO_WIFI_PASSWORD = 'TEST_SECRET_PASSWORD_99';
  process.env.GUEST_GUIDE_ALTOS_DPTO_KEYBOX_CODE = '7788';

  // Dynamic import of config functions after env vars are set
  const {
    isGuestGuideConfigured,
    isGuestGuidePinActive,
    verifyGuestGuidePin,
    createGuestGuideSession,
    isGuestGuideSessionValid,
    getGuestGuidePrivateDetails,
    guestGuideSessionCookie,
  } = await import('../src/lib/guest-guide-config');

  const { POST } = await import('../src/app/api/guest-guide/access/route');

  // Test 1: Configuration check
  assert(isGuestGuideConfigured() === true, 'La guía reconoce estar correctamente configurada');
  assert(isGuestGuidePinActive() === true, 'El PIN activo y vigente es reconocido');

  // Test 2: PIN verification
  const isValid = await verifyGuestGuidePin(TEST_PIN);
  assert(isValid === true, 'El PIN válido se valida correctamente contra bcrypt');

  const isInvalid = await verifyGuestGuidePin('999999');
  assert(isInvalid === false, 'Un PIN incorrecto es rechazado');

  // Test 2b: Base64-encoded PIN hash support
  const base64Hash = Buffer.from(TEST_HASH).toString('base64');
  process.env.GUEST_GUIDE_ALTOS_DPTO_PIN_HASH = base64Hash;
  const isValidBase64 = await verifyGuestGuidePin(TEST_PIN);
  assert(isValidBase64 === true, 'El PIN válido se valida correctamente cuando el hash está en formato Base64');
  process.env.GUEST_GUIDE_ALTOS_DPTO_PIN_HASH = TEST_HASH;

  // Test 3: Session token generation and validation
  const session = createGuestGuideSession();
  assert(session !== null && typeof session.token === 'string', 'Crea una sesión firmada');
  assert(isGuestGuideSessionValid(session?.token) === true, 'La sesión recién creada es válida');

  // Test 4: Tampering resistance
  const [guideId, expiration, signature] = (session?.token || '').split('.');
  const tamperedExpiration = `${guideId}.${Date.now() + 9999999}.${signature}`;
  assert(isGuestGuideSessionValid(tamperedExpiration) === false, 'Rechaza token con fecha alterada');

  const tamperedSignature = `${guideId}.${expiration}.invalidsignature123`;
  assert(isGuestGuideSessionValid(tamperedSignature) === false, 'Rechaza token con firma alterada');

  const tamperedGuideId = `other-guide.${expiration}.${signature}`;
  assert(isGuestGuideSessionValid(tamperedGuideId) === false, 'Rechaza token con guideId diferente');

  // Test 5: Expired PIN
  process.env.GUEST_GUIDE_ALTOS_DPTO_PIN_EXPIRES_AT = PAST_DATE;
  assert(isGuestGuidePinActive() === false, 'Reconoce cuando el PIN ha vencido');
  const validWithExpired = await verifyGuestGuidePin(TEST_PIN);
  assert(validWithExpired === false, 'Rechaza PIN válido si la fecha venció');
  assert(createGuestGuideSession() === null, 'No permite crear sesión si el PIN venció');
  assert(isGuestGuideSessionValid(session?.token) === false, 'Invalida sesiones existentes si el PIN venció');

  // Restore future date
  process.env.GUEST_GUIDE_ALTOS_DPTO_PIN_EXPIRES_AT = FUTURE_DATE;

  // Test 6: API route handling
  // Invalid PIN via POST
  const badReq = new NextRequest('http://localhost:3000/api/guest-guide/access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.100' },
    body: JSON.stringify({ pin: '000000' }),
  });
  const badRes = await POST(badReq);
  assert(badRes.status === 401, 'POST con PIN incorrecto responde 401');

  // Valid PIN via POST
  const goodReq = new NextRequest('http://localhost:3000/api/guest-guide/access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.101' },
    body: JSON.stringify({ pin: TEST_PIN }),
  });
  const goodRes = await POST(goodReq);
  assert(goodRes.status === 200, 'POST con PIN correcto responde 200');

  const setCookie = goodRes.headers.get('set-cookie') || '';
  assert(setCookie.includes(guestGuideSessionCookie), 'La respuesta establece la cookie de sesión');
  assert(setCookie.toLowerCase().includes('httponly'), 'La cookie de sesión tiene atributo HttpOnly');
  assert(setCookie.toLowerCase().includes('samesite=strict'), 'La cookie de sesión tiene SameSite=Strict');

  // Test 7: Rate limiting
  const spamIp = '10.0.0.99';
  let rateLimited = false;
  for (let i = 0; i < 7; i++) {
    const req = new NextRequest('http://localhost:3000/api/guest-guide/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': spamIp },
      body: JSON.stringify({ pin: 'wrong-pin' }),
    });
    const res = await POST(req);
    if (res.status === 429) {
      rateLimited = true;
      break;
    }
  }
  assert(rateLimited === true, 'Aplica rate limiting (429) tras exceder intentos fallidos');

  // Test 8: Private details retrieval
  const details = getGuestGuidePrivateDetails();
  assert(details?.wifiName === 'TEST_WIFI_NETWORK', 'Obtiene nombre de Wi-Fi privado');
  assert(details?.wifiPassword === 'TEST_SECRET_PASSWORD_99', 'Obtiene contraseña de Wi-Fi privada');
  assert(details?.keyBoxCode === '7788', 'Obtiene código de caja de llaves privado');

  console.log(`\nResumen: ${passed} pasadas, ${failed} fallidas`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Error fatal durante la prueba:', err);
  process.exit(1);
});
