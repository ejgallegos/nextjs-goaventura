import { z } from 'zod';
import { availabilityGuard, apiJson, invalidInput, sourceError } from '../../../../../../lib/availability/api-security';
import { setSourceStatus } from '../../../../../../lib/availability/source-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sourceIdSchema = z.string().uuid();
const statusSchema = z.object({ status: z.enum(['active', 'inactive']) });

export function PATCH(request: Request, context: { params: { sourceId: string } }): Promise<Response>;
export function PATCH(request: Request, context: { params: Promise<{ sourceId: string }> }): Promise<Response>;
export async function PATCH(request: Request, context: { params: Promise<{ sourceId: string }> | { sourceId: string } }): Promise<Response> {
  const denied = await availabilityGuard(request, true);
  if (denied) return denied;
  const { sourceId: rawSourceId } = await context.params;
  const sourceId = sourceIdSchema.safeParse(rawSourceId);
  if (!sourceId.success) return invalidInput();
  let input: unknown;
  try { input = await request.json(); } catch { return invalidInput(); }
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return invalidInput();
  try {
    return apiJson({ source: await setSourceStatus(sourceId.data, parsed.data.status) });
  } catch (error) {
    return sourceError(error);
  }
}
