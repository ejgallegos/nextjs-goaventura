import { calendarSources } from './schema';
import { closeDb, getDb, type Database } from './index';

export const AVAILABILITY_ACCOMMODATION_SLUGS = [
  'loft-centro',
  'altos-del-talampaya-casa',
  'altos-del-talampaya-casa-ii',
  'casa-altos-del-talampaya-iii',
  'altos-del-talampaya-dpto',
] as const;

export async function seedAvailability(db: Database = getDb()): Promise<number> {
  const now = new Date();

  await db
    .insert(calendarSources)
    .values(
      AVAILABILITY_ACCOMMODATION_SLUGS.map((accommodationSlug) => ({
        accommodationSlug,
        icsUrl: null,
        status: 'inactive' as const,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoUpdate({
      target: calendarSources.accommodationSlug,
      set: { updatedAt: now },
    });

  return AVAILABILITY_ACCOMMODATION_SLUGS.length;
}

export async function runAvailabilitySeed(): Promise<void> {
  const sourceCount = await seedAvailability();
  console.log(`Seeded ${sourceCount} availability calendar sources.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAvailabilitySeed()
    .catch((error: unknown) => {
      console.error('Availability seed failed.', error);
      process.exitCode = 1;
    })
    .finally(closeDb);
}
