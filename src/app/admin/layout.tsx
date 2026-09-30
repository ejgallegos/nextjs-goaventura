import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Panel de administración no disponible</h1>
        <p className="mt-4 text-muted-foreground">La administración de contenidos requiere una integración de autenticación que no está habilitada.</p>
        <Link className="mt-6 inline-block underline" href="/">Volver al inicio</Link>
      </div>
      {children}
    </div>
  );
}
