import { z } from 'zod';
import { availabilityGuard, apiJson, invalidInput } from '../../../../../../../../lib/availability/api-security';
import { approveEmptyFeed } from '../../../../../../../../lib/availability/ics-approval';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const idSchema = z.string().uuid();

export async function POST(request: Request, context: { params: { sourceId: string; syncRunId: string } }): Promise<Response> {
  const denied = await availabilityGuard(request, true);
  if (denied) return denied;
  const sourceId = idSchema.safeParse(context.params.sourceId);
  const syncRunId = idSchema.safeParse(context.params.syncRunId);
  if (!sourceId.success || !syncRunId.success) return invalidInput();
  try {
    const result = await approveEmptyFeed(sourceId.data, syncRunId.data);
    if (result.status === 'approved') return apiJson({ approval: result });
    return apiJson({ error: result.code }, result.code === 'BUSY' ? 409 : 400);
  } catch {
    return apiJson({ error: 'APPROVAL_FAILED' }, 500);
  }
}
