import { drizzleDb } from '.';
import { postsTable } from './schemas';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function seed() {
  const jsonPath = resolve(process.cwd(), 'src', 'db', 'seed', 'posts.json');
  const { posts } = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  await drizzleDb.insert(postsTable).values(posts).onConflictDoNothing();

  console.log(`✓ ${posts.length} posts inseridos no banco.`);
  process.exit(0);
}

seed();
