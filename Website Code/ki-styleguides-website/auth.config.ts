import { defineConfig } from 'auth-astro';
import type { AuthConfig } from '@auth/core';
import { getProviders } from './src/lib/auth/providers';

export default defineConfig({
  providers: getProviders(),
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies AuthConfig);