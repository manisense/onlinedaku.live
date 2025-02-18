import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Credentials } from '@/types/auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email === process.env.ADMIN_EMAIL && 
            credentials.password === process.env.ADMIN_PASSWORD) {
          return {
            id: '1',
            email: credentials.email,
            role: 'admin'
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);