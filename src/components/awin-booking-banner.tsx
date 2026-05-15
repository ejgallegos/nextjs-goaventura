/**
 * Banner de Booking.com via Awin (Programa de afiliados)
 * Código proporcionado por Awin para Booking.com LATAM
 * Tamaño: 336x280
 */

export default function AwinBookingBanner() {
  return (
    <a
      rel="noopener noreferrer sponsored"
      href="https://www.awin1.com/cread.php?s=4655943&v=18119&q=593890&r=2868851"
      target="_blank"
      className="block w-[336px] h-[280px]"
    >
      <img
        src="https://www.awin1.com/cshow.php?s=4655943&v=18119&q=593890&r=2868851"
        alt="Booking.com - Reserva tu alojamiento en Latinoamérica"
        width={336}
        height={280}
        className="w-full h-full object-contain rounded-lg"
        loading="lazy"
      />
    </a>
  );
}