
"use client";

import { usePathname } from 'next/navigation';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isGuideRoute = pathname?.startsWith('/guia');
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;

    if (!recaptchaKey || isGuideRoute) {
        if (!recaptchaKey && process.env.NODE_ENV !== 'production') {
            console.warn("reCAPTCHA v3 site key not found. reCAPTCHA will be disabled.");
        }
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            {children}
        </GoogleReCaptchaProvider>
    );
}
