// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // credentials may be undefined if the form wasn't submitted properly
                const username = credentials?.username;
                const password = credentials?.password;
                if (!username || !password) {
                    return null;
                }

                // Prepare application/x-www-form-urlencoded body
                const params = new URLSearchParams();
                params.append("username", username);
                params.append("password", password);

                // Call FastAPI login endpoint
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: params.toString(),
                    }
                );
                if (!res.ok) {
                    return null;
                }

                // Parse out the token
                const tokenData: { access_token: string; token_type: string } =
                    await res.json();
                const { access_token } = tokenData;

                // Fetch the user profile from FastAPI
                const userRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
                    {
                        headers: { Authorization: `Bearer ${access_token}` },
                    }
                );
                if (!userRes.ok) {
                    return null;
                }

                const user = await userRes.json();
                // Return a User object including our FastAPI access token
                return {
                    id: user.username,         // ensure this matches your UserResponse model
                    name: `${user.firstName} ${user.lastName}`,
                    accessToken: access_token, // attached for jwt callback
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // On initial sign in, copy accessToken from user to token
            if (user && (user as any).accessToken) {
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            // Expose accessToken on the `session` object
            (session as any).accessToken = (token as any).accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
