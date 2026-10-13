import { z } from 'zod';
import { availabilityGuard, apiJson, domainError } from '../../../../../lib/availability/api-security';
import { queryAvailability } from '../../../../../lib/availability/availability-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const querySchema = z.object({ checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), guests: z.coerce.number() }).strict();

export async function GET(request: Request): Promise<Response> {
  const denied = await availabilityGuard(request);
  if (denied) return denied;
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return domainError({ code: 'INVALID_DATE' });
  try { return apiJson({ results: await queryAvailability(parsed.data) }); } catch (error) { return domainError(error); }
}
