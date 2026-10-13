import { z } from 'zod';
import { availabilityGuard, apiJson, invalidInput, sourceError } from '../../../../../lib/availability/api-security';
import { configureSource, listSources } from '../../../../../lib/availability/source-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const configureSchema = z.object({
  sourceId: z.string().uuid(),
  accommodationSlug: z.string().trim().min(1).max(120),
  icsUrl: z.string().url().max(2048),
});

export async function GET(request: Request): Promise<Response> {
  const denied = await availabilityGuard(request);
  if (denied) return denied;
  try {
    return apiJson({ sources: await listSources() });
  } catch (error) {
    return sourceError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  const denied = await availabilityGuard(request, true);
  if (denied) return denied;
  let input: unknown;
  try { input = await request.json(); } catch { return invalidInput(); }
  const parsed = configureSchema.safeParse(input);
  if (!parsed.success) return invalidInput();
  try {
    return apiJson({ source: await configureSource(parsed.data) });
  } catch (error) {
    return sourceError(error);
  }
}
