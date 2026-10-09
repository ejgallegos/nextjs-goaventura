import { closeDb } from '../src/lib/db';
import { runAvailabilitySeed } from '../src/lib/db/seed';

async function main(): Promise<void> {
  try {
    await runAvailabilitySeed();
  } catch {
    console.error('Availability seed failed.');
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

void main();
