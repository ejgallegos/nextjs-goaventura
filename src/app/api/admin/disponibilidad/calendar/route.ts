import { z } from 'zod';
import { availabilityGuard, apiJson, domainError } from '../../../../../lib/availability/api-security';
import { queryAvailabilityCalendar } from '../../../../../lib/availability/availability-calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const calendarSchema = z.object({ month: z.string(), guests: z.coerce.number() }).strict();

export async function GET(request: Request): Promise<Response> {
  const denied = await availabilityGuard(request);
  if (denied) return denied;
  const parsed = calendarSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return domainError({ code: 'INVALID_CALENDAR_QUERY' });
  try { return apiJson(await queryAvailabilityCalendar(parsed.data)); } catch (error) { return domainError(error); }
}
