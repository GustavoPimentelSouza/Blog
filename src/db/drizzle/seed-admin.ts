import { drizzleDb } from '.';
import { usersTable } from './schemas';
import { hashSync } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env.local antes de rodar o seed.');
    process.exit(1);
  }

  await drizzleDb.insert(usersTable).values({
    id: randomUUID(),
    email,
    password: hashSync(password, 10),
    createdAt: new Date().toISOString(),
  }).onConflictDoNothing();

  console.log(`✓ Admin criado — email: ${email}`);
  process.exit(0);
}

seedAdmin();
