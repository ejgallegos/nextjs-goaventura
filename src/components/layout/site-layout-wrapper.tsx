'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuideRoute = pathname?.startsWith('/guia');

  if (isGuideRoute) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-20 lg:pt-24">{children}</main>
      <Footer />
    </>
  );
}
