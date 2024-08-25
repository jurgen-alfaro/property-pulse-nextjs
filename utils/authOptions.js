import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/database';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization
      // When you try to login it does not automatically use the last
      // Google account that you used.
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign in
    async signIn({ profile }) {
      // 1. Connect to db
      await connectDB();
      const userExists = await User.findOne({ email: profile.email });
      // 2. Check if user exists
      if (!userExists) {
        // Truncate username if too long
        const username = profile.name.slice(0, 20);
        // 3. If not, create user
        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      // 4. Return true to allow sign in
      return true;
    },
    // Session callback function that modifies the session object
    async session({ session }) {
      // 1. Get the user from db
      const user = await User.findOne({ email: session.user.email });
      // 2. Assign user id from the session
      session.user.id = user._id.toString();
      // 3. Return session
      return session;
    },
  },
};
