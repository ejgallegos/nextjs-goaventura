import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAccommodationBySlug } from '@/lib/data/accommodations';
import GuestRegistrationForm from '@/components/guest-registration-form';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const accommodation = getAccommodationBySlug(slug);
  if (!accommodation) return { title: 'No encontrado' };
  return {
    title: `Registro - ${accommodation.name} | Go Aventura`,
    description: `Recibí información sobre ${accommodation.name} y novedades de Go Aventura.`,
    robots: { index: false, follow: false },
  };
}

export default async function RegistroPage({ params }: Props) {
  const { slug } = await params;
  const accommodation = getAccommodationBySlug(slug);

  if (!accommodation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <GuestRegistrationForm slug={slug} propertyName={accommodation.name} />
    </div>
  );
}
