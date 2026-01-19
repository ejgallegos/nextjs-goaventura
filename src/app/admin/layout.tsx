
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authenticateRequest, UserRole } from '@/lib/auth-rbac';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // For now, any authenticated user gets admin access
          // TODO: Implement proper role verification when Firebase Admin is configured
          if (user.email) {
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        } catch (error) {
          console.error('Error verifying permissions:', error);
          setIsAuth(false); // Don't redirect, just show error
        }
      } else {
        setIsAuth(false); // Don't redirect, just show login required
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            Necesitas iniciar sesión para acceder al panel de administración.
          </p>
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
