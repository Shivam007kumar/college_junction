// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add your logic to verify the credentials
        const user = { id: 1, email: "user@example.com", name: "John Doe" };

        if (
          credentials.email === user.email &&
          credentials.password === "password" // Replace with actual password check
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      session.user.id = user.id;
      session.user.name = user.name;
      return session;
    },
  },
});