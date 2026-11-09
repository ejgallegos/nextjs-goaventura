'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuideRoute = pathname?.startsWith('/guia');

  useEffect(() => {
    if (isGuideRoute) {
      document.body.classList.add('guide-active');
      return () => {
        document.body.classList.remove('guide-active');
      };
    }
  }, [isGuideRoute]);

  if (isGuideRoute) {
    return <div className="min-h-screen flex flex-col is-guide-page">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-20 lg:pt-24">{children}</main>
      <Footer />
    </>
  );
}
