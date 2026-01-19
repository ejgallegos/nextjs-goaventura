import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import nodemailer from 'nodemailer';
import { contactFormSchema, getSecurityHeaders, sanitizeUserInput } from '@/lib/security';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_V3_SECRET_KEY;
  if (!secret) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });

    const result = await response.json();
    return result.success && result.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { 
      allowed: false, 
      error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` 
    };
  }

  entry.count++;
  return { allowed: true };
}

async function sendEmail(data: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'info@goaventura.com.ar',
    subject: `Contacto: ${data.subject}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Asunto:</strong> ${data.subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${data.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.error },
        { 
          status: 429, 
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': '900'
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const sanitizedData = sanitizeUserInput(body);
    
    const validatedData = contactFormSchema.parse(sanitizedData);

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Send email
    await sendEmail(validatedData);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors.map(e => e.message) 
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS?.split(',')[0] || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}