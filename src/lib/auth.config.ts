import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  providers: [Credentials({})],
  pages: {
    signIn: '/admin/login',
  },
};
