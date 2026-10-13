import { z } from 'zod';
import { availabilityGuard, apiJson, invalidInput } from '../../../../../../../lib/availability/api-security';
import { syncSource } from '../../../../../../../lib/availability/ics-sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sourceIdSchema = z.string().uuid();
const optionsSchema = z.object({ force: z.boolean().default(false) }).strict();

async function readOptions(request: Request): Promise<{ force: boolean } | null> {
  const text = await request.text();
  if (!text) return { force: false };
  try {
    const parsed = optionsSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request, context: { params: { sourceId: string } }): Promise<Response> {
  const denied = await availabilityGuard(request, true);
  if (denied) return denied;
  const sourceId = sourceIdSchema.safeParse(context.params.sourceId);
  const options = await readOptions(request);
  if (!sourceId.success || !options) return invalidInput();
  try {
    return apiJson({ outcome: await syncSource(sourceId.data, options) });
  } catch {
    return apiJson({ error: 'SYNC_FAILED' }, 500);
  }
}
