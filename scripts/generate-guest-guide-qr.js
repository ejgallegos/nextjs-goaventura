const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generateQrAssets() {
  const guideUrl = 'https://goaventura.com.ar/guia/altos-del-talampaya-dpto';
  const targetDir = path.join(__dirname, '../public/guest-guides/altos-del-talampaya-dpto');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const svgPath = path.join(targetDir, 'qr.svg');
  const pngPath = path.join(targetDir, 'qr.png');

  // SVG version
  const svgString = await QRCode.toString(guideUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#1D2D44',
      light: '#FFFFFF',
    },
  });
  fs.writeFileSync(svgPath, svgString, 'utf8');

  // High-resolution PNG version (1200x1200px)
  await QRCode.toFile(pngPath, guideUrl, {
    type: 'png',
    errorCorrectionLevel: 'H',
    width: 1200,
    margin: 2,
    color: {
      dark: '#1D2D44',
      light: '#FFFFFF',
    },
  });

  console.log(`Successfully generated QR assets for ${guideUrl}`);
  console.log(`SVG: ${svgPath}`);
  console.log(`PNG: ${pngPath}`);
}

generateQrAssets().catch((err) => {
  console.error('Error generating QR assets:', err);
  process.exit(1);
});
