
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page just redirects to the main admin page
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/viajes');
  }, [router]);

  return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Redirigiendo al panel de administración...</p>
      </div>
  );
}
