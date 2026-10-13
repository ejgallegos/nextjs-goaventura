import 'server-only';

import { eq } from 'drizzle-orm';

import { accommodations } from '../data/accommodations';
import { getDb, type Database } from '../db';
import { calendarSources } from '../db/schema';
import { encryptIcsUrl } from './ics-secrets';
import { validateIcsUrl } from './network-policy';

export type SourceStatus = 'active' | 'inactive';
export interface SourceView {
  id: string;
  accommodationSlug: string;
  status: SourceStatus;
  configured: boolean;
}

export type SourceAdminErrorCode = 'INVALID_URL' | 'SOURCE_NOT_FOUND' | 'SOURCE_MISMATCH' | 'SOURCE_NOT_CONFIGURED';

export class SourceAdminError extends Error {
  readonly code: SourceAdminErrorCode;

  constructor(code: SourceAdminErrorCode) {
    super(code);
    this.name = 'SourceAdminError';
    this.code = code;
  }
}

type SourceRow = Pick<typeof calendarSources.$inferSelect, 'id' | 'accommodationSlug' | 'status' | 'icsUrl'>;
export interface SourceAdminDependencies {
  db?: Database;
  validateUrl?: (value: string) => Promise<URL>;
  encryptUrl?: (value: string) => string;
}

function view(row: SourceRow): SourceView {
  return {
    id: row.id,
    accommodationSlug: row.accommodationSlug,
    status: row.status,
    configured: row.icsUrl !== null,
  };
}

function catalogIndex(slug: string): number {
  const index = accommodations.findIndex((accommodation) => accommodation.slug === slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export async function listSources(dependencies: SourceAdminDependencies = {}): Promise<SourceView[]> {
  const rows = await (dependencies.db ?? getDb()).select({
    id: calendarSources.id,
    accommodationSlug: calendarSources.accommodationSlug,
    status: calendarSources.status,
    icsUrl: calendarSources.icsUrl,
  }).from(calendarSources);
  return rows.sort((left, right) => catalogIndex(left.accommodationSlug) - catalogIndex(right.accommodationSlug)).map(view);
}

export async function configureSource(
  input: { sourceId: string; accommodationSlug: string; icsUrl: string },
  dependencies: SourceAdminDependencies = {},
): Promise<SourceView> {
  if (!accommodations.some((accommodation) => accommodation.slug === input.accommodationSlug)) {
    throw new SourceAdminError('SOURCE_MISMATCH');
  }
  const db = dependencies.db ?? getDb();
  const [source] = await db.select({
    id: calendarSources.id,
    accommodationSlug: calendarSources.accommodationSlug,
    status: calendarSources.status,
    icsUrl: calendarSources.icsUrl,
  }).from(calendarSources).where(eq(calendarSources.id, input.sourceId)).limit(1);
  if (!source) throw new SourceAdminError('SOURCE_NOT_FOUND');
  if (source.accommodationSlug !== input.accommodationSlug) throw new SourceAdminError('SOURCE_MISMATCH');
  let encryptedUrl: string;
  try {
    const url = await (dependencies.validateUrl ?? validateIcsUrl)(input.icsUrl);
    encryptedUrl = (dependencies.encryptUrl ?? encryptIcsUrl)(url.toString());
  } catch {
    throw new SourceAdminError('INVALID_URL');
  }
  const [updated] = await db.update(calendarSources).set({ icsUrl: encryptedUrl, updatedAt: new Date() })
    .where(eq(calendarSources.id, source.id)).returning({ id: calendarSources.id, accommodationSlug: calendarSources.accommodationSlug, status: calendarSources.status, icsUrl: calendarSources.icsUrl });
  if (!updated) throw new SourceAdminError('SOURCE_NOT_FOUND');
  return view(updated);
}

export async function setSourceStatus(
  sourceId: string,
  status: SourceStatus,
  dependencies: SourceAdminDependencies = {},
): Promise<SourceView> {
  const db = dependencies.db ?? getDb();
  const [source] = await db.select({ id: calendarSources.id, accommodationSlug: calendarSources.accommodationSlug, status: calendarSources.status, icsUrl: calendarSources.icsUrl })
    .from(calendarSources).where(eq(calendarSources.id, sourceId)).limit(1);
  if (!source) throw new SourceAdminError('SOURCE_NOT_FOUND');
  if (status === 'active' && !source.icsUrl) throw new SourceAdminError('SOURCE_NOT_CONFIGURED');
  const [updated] = await db.update(calendarSources).set({ status, updatedAt: new Date() })
    .where(eq(calendarSources.id, sourceId)).returning({ id: calendarSources.id, accommodationSlug: calendarSources.accommodationSlug, status: calendarSources.status, icsUrl: calendarSources.icsUrl });
  if (!updated) throw new SourceAdminError('SOURCE_NOT_FOUND');
  return view(updated);
}
