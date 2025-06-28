import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '@/lib/react-query';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.success && response.data.user) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              image: response.data.user.avatar,
              role: response.data.user.role,
              partnerId: response.data.user.partnerId,
              permissions: response.data.user.permissions,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.role = user.role;
        token.partnerId = user.partnerId;
        token.permissions = user.permissions;
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.partnerId = token.partnerId;
        session.user.permissions = token.permissions;
        session.accessToken = token.accessToken;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check if user exists or create new user
          const response = await apiClient.post('/auth/social-login', {
            provider: account.provider,
            providerId: account.providerAccountId,
            email: user.email,
            name: user.name,
            avatar: user.image,
          });

          if (response.success) {
            user.role = response.data.user.role;
            user.partnerId = response.data.user.partnerId;
            user.permissions = response.data.user.permissions;
            return true;
          }
        } catch (error) {
          console.error('Social login error:', error);
          return false;
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email);
    },
    async signOut({ session, token }) {
      console.log('User signed out:', session?.user?.email);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };