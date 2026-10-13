import { z } from 'zod';
import { availabilityGuard, apiJson, invalidInput } from '../../../../../lib/availability/api-security';
import { syncAllSources } from '../../../../../lib/availability/ics-sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const optionsSchema = z.object({ force: z.boolean().default(false) }).strict();

export async function POST(request: Request): Promise<Response> {
  const denied = await availabilityGuard(request, true);
  if (denied) return denied;
  const text = await request.text();
  let input: unknown = {};
  if (text) {
    try { input = JSON.parse(text); } catch { return invalidInput(); }
  }
  const options = optionsSchema.safeParse(input);
  if (!options.success) return invalidInput();
  try {
    return apiJson({ outcomes: await syncAllSources(options.data) });
  } catch {
    return apiJson({ error: 'SYNC_FAILED' }, 500);
  }
}
