'use client';

import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Loader2, Smartphone, Check } from 'lucide-react';
import { guestRegistrationSchema } from '@/lib/security';

interface GuestRegistrationFormProps {
  slug: string;
  propertyName: string;
}

interface FormErrors {
  nombre?: string;
  telefono?: string;
  consent?: string;
}

type PageState = 'form' | 'loading' | 'success' | 'error';

const countryCodes = [
  { value: '54', label: '+54 (Argentina)' },
  { value: '55', label: '+55 (Brasil)' },
  { value: '56', label: '+56 (Chile)' },
  { value: '57', label: '+57 (Colombia)' },
  { value: '598', label: '+598 (Uruguay)' },
  { value: '595', label: '+595 (Paraguay)' },
  { value: '591', label: '+591 (Bolivia)' },
  { value: '51', label: '+51 (Perú)' },
  { value: '52', label: '+52 (México)' },
  { value: '34', label: '+34 (España)' },
  { value: '1', label: '+1 (EE. UU./Canadá)' },
];

export default function GuestRegistrationForm({
  slug,
  propertyName,
}: GuestRegistrationFormProps) {
  const [phonePrefix, setPhonePrefix] = useState('54');
  const [phoneInput, setPhoneInput] = useState('');
  const [nombre, setNombre] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pageState, setPageState] = useState<PageState>('form');
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (pageState === 'success') {
      const timer = setTimeout(() => {
        router.push('/');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [pageState, router]);

  const buildPhone = useCallback(
    (prefix: string, localNumber: string): string => {
      // Remove leading zeros and any non-digit characters
      const cleaned = localNumber.replace(/[^\d]/g, '').replace(/^0+/, '');
      return prefix + '9' + cleaned;
    },
    []
  );

  const validate = useCallback((): boolean => {
    const fullPhone = buildPhone(phonePrefix, phoneInput);

    const result = guestRegistrationSchema.safeParse({
      nombre,
      telefono: fullPhone,
      slug,
      consent,
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
  }, [nombre, phonePrefix, phoneInput, slug, consent, buildPhone]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setPageState('loading');
    setServerError('');

    const fullPhone = buildPhone(phonePrefix, phoneInput);

    try {
      const res = await fetch('/api/guest-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono: fullPhone,
          slug,
          cliente: 'inquilino',
          consent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar la solicitud');
      }

      setPageState('success');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error de conexión. Verifica tu internet e intenta de nuevo.';
      setServerError(message);
      setPageState('error');
    }
  }, [nombre, phonePrefix, phoneInput, slug, consent, validate, buildPhone]);

  const handleRetry = useCallback(() => {
    setPageState('form');
    setServerError('');
  }, []);

  const handleNombreChange = useCallback(
    (value: string) => {
      setNombre(value);
      if (errors.nombre) {
        setErrors((prev) => ({ ...prev, nombre: undefined }));
      }
    },
    [errors.nombre]
  );

  const handlePhoneInputChange = useCallback(
    (value: string) => {
      // Allow only digits
      const digits = value.replace(/[^\d]/g, '');
      setPhoneInput(digits);
      if (errors.telefono) {
        setErrors((prev) => ({ ...prev, telefono: undefined }));
      }
    },
    [errors.telefono]
  );

  const handleConsentChange = useCallback((checked: boolean) => {
    setConsent(checked);
    if (errors.consent) {
      setErrors((prev) => ({ ...prev, consent: undefined }));
    }
  }, [errors.consent]);

  const propertyDescription = (() => {
    switch (slug) {
      case 'loft-centro':
        return 'Departamento moderno en el corazón de Villa Unión';
      case 'altos-del-talampaya-casa':
        return 'Casa familiar con jardín y vistas a la montaña';
      case 'altos-del-talampaya-casa-ii':
        return 'Casa acogedora para parejas';
      default:
        return '';
    }
  })();

  return (
    <Card className="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-headline">
          Recibí novedades de {propertyName}
        </CardTitle>
        <CardDescription className="text-sm text-left mt-3 leading-relaxed space-y-2">
          <p>
            Registrate para recibir información útil sobre tu alojamiento,
            promociones exclusivas y novedades de los viajes y excursiones que
            organizamos en Go Aventura.
          </p>
          {propertyDescription && (
            <p className="text-xs text-muted-foreground">
              <span className="block mt-1 font-medium text-foreground/80">
                🏡 {propertyDescription}
              </span>
            </p>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {pageState === 'form' && (
          <div className="space-y-4">
            {serverError && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="guest-nombre">Nombre</Label>
              <Input
                id="guest-nombre"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => handleNombreChange(e.target.value)}
                aria-invalid={!!errors.nombre}
              />
              {errors.nombre && (
                <p className="text-xs text-destructive">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest-telefono">Teléfono</Label>
              <div className="flex gap-2">
                <Select
                  value={phonePrefix}
                  onValueChange={(v) => {
                    setPhonePrefix(v);
                    if (errors.telefono) {
                      setErrors((prev) => ({ ...prev, telefono: undefined }));
                    }
                  }}
                >
                  <SelectTrigger className="w-[160px] shrink-0" aria-label="Código de país">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((cc) => (
                      <SelectItem key={cc.value} value={cc.value}>
                        {cc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="guest-telefono"
                  type="tel"
                  inputMode="numeric"
                  placeholder="351 234 5678"
                  value={phoneInput}
                  onChange={(e) => handlePhoneInputChange(e.target.value)}
                  aria-invalid={!!errors.telefono}
                  className="flex-1"
                />
              </div>
              {errors.telefono ? (
                <p className="text-xs text-destructive">{errors.telefono}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {phonePrefix && phoneInput
                    ? `Recibirás la info al ${phonePrefix} 9 ${phoneInput}`
                    : 'Ingresá tu número sin el 9 inicial'}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="guest-consent"
                checked={consent}
                onCheckedChange={handleConsentChange}
                aria-invalid={!!errors.consent}
              />
              <Label
                htmlFor="guest-consent"
                className="text-xs leading-relaxed text-muted-foreground font-normal -mt-0.5 cursor-pointer"
              >
                Acepto recibir información sobre el alojamiento, promociones,
                novedades y viajes de Go Aventura al número registrado. Puedo
                darme de baja en cualquier momento.
              </Label>
            </div>
            {errors.consent && (
              <p className="text-xs text-destructive -mt-2">{errors.consent}</p>
            )}

            <Button
              className="w-full min-h-[48px] mt-2"
              size="lg"
              onClick={handleSubmit}
            >
              Registrarme
            </Button>
          </div>
        )}

        {pageState === 'loading' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={nombre} disabled />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={phonePrefix + ' 9 ' + phoneInput}
                disabled
              />
            </div>
            <Button className="w-full min-h-[48px]" size="lg" disabled>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registrando...
            </Button>
          </div>
        )}

        {pageState === 'success' && (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                ¡Gracias por registrarte!
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A partir de ahora vas a recibir información sobre{' '}
                <strong>{propertyName}</strong>, promociones exclusivas y
                novedades de viajes de Go Aventura en tu WhatsApp.
              </p>
            </div>
          </div>
        )}

        {pageState === 'error' && (
          <div className="space-y-4">
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
              {serverError || 'Ocurrió un error. Intenta de nuevo.'}
            </div>
            <Button
              className="w-full min-h-[48px]"
              size="lg"
              onClick={handleRetry}
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
