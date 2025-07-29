
"use client";

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;

    if (!recaptchaKey) {
        console.warn("reCAPTCHA v3 site key not found. reCAPTCHA will be disabled.");
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            {children}
        </GoogleReCaptchaProvider>
    );
}
