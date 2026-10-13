import { z } from 'zod';
import { availabilityGuard, apiJson, domainError } from '../../../../../lib/availability/api-security';
import { listSyncHistory } from '../../../../../lib/availability/availability-history';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const historySchema = z.object({ sourceId: z.string().uuid() }).strict();

export async function GET(request: Request): Promise<Response> {
  const denied = await availabilityGuard(request);
  if (denied) return denied;
  const parsed = historySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return domainError({ code: 'SOURCE_NOT_FOUND' });
  try { return apiJson({ history: await listSyncHistory(parsed.data.sourceId) }); } catch (error) { return domainError(error); }
}
