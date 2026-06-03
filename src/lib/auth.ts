import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compareSync } from 'bcryptjs';
import { drizzleDb } from '@/db/drizzle';
import { usersTable } from '@/db/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const [user] = await drizzleDb
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email));

        if (!user) return null;

        const passwordMatch = compareSync(password, user.password);
        if (!passwordMatch) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
});
