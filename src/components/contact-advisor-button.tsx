'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactAdvisorSchema } from '@/lib/security';
import { Loader2, PhoneCall } from 'lucide-react';

interface ContactAdvisorButtonProps {
  productId: string;
  productName: string;
  productType: 'excursion' | 'transfer' | 'accommodation';
  buttonText?: string;
  className?: string;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  consulta?: string;
}

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  consulta: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactAdvisorButton({
  productId,
  productName,
  productType,
  buttonText = 'Que un asesor me contacte',
  className,
}: ContactAdvisorButtonProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    consulta: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [serverError, setServerError] = useState('');

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const result = contactAdvisorSchema.safeParse({
      ...formData,
      productId,
      productName,
      productType,
      pageUrl: window.location.href,
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [formData, productId, productName, productType]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/contact-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId,
          productName,
          productType,
          pageUrl: window.location.href,
          cliente: 'prospecto',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar la solicitud');
      }

      // Track GA4 event client-side
      if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
        window.gtag('event', 'contact_advisor', {
          product_id: productId,
          product_type: productType,
          page_location: window.location.href,
        });
      }

      setSubmitStatus('success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error de conexión. Verifica tu internet e intenta de nuevo.';
      setServerError(message);
      setSubmitStatus('error');
    }
  }, [formData, productId, productName, productType, validate]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setTimeout(() => {
        setFormData({ nombre: '', apellido: '', telefono: '', consulta: '' });
        setErrors({});
        setSubmitStatus('idle');
        setServerError('');
      }, 200);
    }
  }, []);

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className={`w-full min-h-[48px] ${className ?? ''}`}
        onClick={() => setOpen(true)}
      >
        <PhoneCall className="mr-2 h-5 w-5" />
        {buttonText}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-headline">
              Que un asesor te contacte
            </DialogTitle>
            <DialogDescription>
              Completá tus datos y un asesor de Go Aventura se comunicará con vos a la brevedad.
            </DialogDescription>
          </DialogHeader>

          {submitStatus === 'success' ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-4xl">✅</div>
              <p className="text-lg font-medium text-foreground">
                ¡Gracias! Un asesor se comunicará pronto
              </p>
              <p className="text-sm text-muted-foreground">
                Revisamos tu consulta y te contactamos a la brevedad.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleOpenChange(false)}
              >
                Cerrar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {serverError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="advisor-nombre">Nombre</Label>
                  <Input
                    id="advisor-nombre"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    aria-invalid={!!errors.nombre}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-destructive">{errors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advisor-apellido">Apellido</Label>
                  <Input
                    id="advisor-apellido"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    aria-invalid={!!errors.apellido}
                  />
                  {errors.apellido && (
                    <p className="text-xs text-destructive">{errors.apellido}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advisor-telefono">Teléfono</Label>
                <Input
                  id="advisor-telefono"
                  type="tel"
                  placeholder="11 2345-6789"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  aria-invalid={!!errors.telefono}
                />
                {errors.telefono && (
                  <p className="text-xs text-destructive">{errors.telefono}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="advisor-consulta">Consulta</Label>
                <Textarea
                  id="advisor-consulta"
                  placeholder="¿Qué te gustaría saber? Ej: disponibilidad, precios, actividades..."
                  rows={3}
                  value={formData.consulta}
                  onChange={(e) => handleChange('consulta', e.target.value)}
                  aria-invalid={!!errors.consulta}
                />
                {errors.consulta && (
                  <p className="text-xs text-destructive">{errors.consulta}</p>
                )}
              </div>

              <Button
                className="w-full min-h-[48px]"
                size="lg"
                onClick={handleSubmit}
                disabled={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Solicitar contacto'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
