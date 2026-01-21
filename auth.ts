import NextAuth from 'next-auth';

import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';

const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ credential: z.string(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { credential, password } = parsedCredentials.data;
          const user = await prisma.user.findFirst({
            where: {
              OR: [{ email: credential }, { phone: credential }],
            },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

export { handlers, signIn, signOut, auth };
