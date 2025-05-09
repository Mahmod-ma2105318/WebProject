import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import repo from "@/app/repo/repo";

// You must export this so you can use it in getServerSession() later
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await repo.getUser(credentials.username, credentials.password);
                // Inside the authorize function
                console.log(user); // This will help you debug and check if 'role' is in the user object

                if (!user || credentials.password !== user.password) {
                    return null; // Invalid login
                }

                // Only include essential info in the session
                return {
                    id: user.id,
                    name: user.username,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
    },

    pages: {
        signIn: "/", // your custom login screen
    },

    secret: process.env.NEXTAUTH_SECRET, // store in .env
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
