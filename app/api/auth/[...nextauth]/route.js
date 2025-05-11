import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.password) {
          throw new Error('Please login with Google');
        }

        const hashedPassword = crypto
          .createHash('sha256')
          .update(credentials.password)
          .digest('hex');

        console.log('Login Debug:', { email: credentials.email, userPassword: user.password, hashedPassword });

        if (hashedPassword !== user.password) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            password: '', // Google users don't need a password
          });
        }
      }
      return true;
    },
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email });
      session.user.id = user._id.toString();
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// HTTP मेथड्स को नामित एक्सपोर्ट के रूप में डिफाइन करें
export { handler as GET, handler as POST };
export { authOptions }; 