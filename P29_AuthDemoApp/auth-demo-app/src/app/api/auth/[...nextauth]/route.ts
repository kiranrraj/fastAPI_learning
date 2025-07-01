// src\app\api\auth\[...nextauth]\route.ts

// NextAuth is a function that generates API handlers for authentication (GET and POST).
// AuthOptions is the type describing the full configuration options.
import NextAuth, { AuthOptions } from "next-auth";

// CredentialsProvider allows NextAuth to use a username/password-based login system.
import CredentialsProvider from "next-auth/providers/credentials";

// Import JWT and session types from NextAuth
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

// Load FastAPI backend base URL from environment
const backendUrl: string = process.env.BACKEND_URL ?? "http://localhost:8010";

// authOptions holds the main config for NextAuth.
// Must be exported if you're using getServerSession() later in protected routes.
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" },
            },
            // This function is required by CredentialsProvider (next-auth/providers/credentials) and
            // called automatically by NextAuth when a user tries to sign in using the "credentials" provider.
            async authorize(credentials) {
                const res = await fetch(`${backendUrl}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                });

                // Parse the JSON response from your backend.
                const data = await res.json();

                // If the backend responds with a failure, throw an error.
                if (!res.ok) {
                    throw new Error(data.detail || "Login failed");
                }

                // Return a user object that will be passed to the jwt() callback
                return {
                    id: data.user_id,
                    name: data.email,
                    email: data.email,
                    role: data.role,
                    token: data.access_token,
                };
            },
        }),
    ],

    // Uses JWT to manage auth state. Secure, stateless.
    // TODO: Move to database session storage if persistent sessions are needed @kiranraj
    session: {
        strategy: "jwt", // Use JWT strategy, store accessToken in memory
    },

    // In NextAuth, the callbacks.jwt function runs whenever:
    // A user signs in (first time session created)
    // A JWT is updated (like session refresh)
    // You manually call getToken() to read the token
    callbacks: {
        // Called on token creation/update
        async jwt({ token, user }: { token: JWT; user?: User }) {
            // Only run on sign-in
            if (user) {
                token.id = user.id as string;
                token.role = (user as any).role; // Extend User type via next-auth.d.ts to avoid casting
                token.accessToken = (user as any).token;
            }
            return token;
        },

        // Called when session is created from token
        // This callback runs every time getSession() or useSession() is called on the client or server.
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                (session as any).accessToken = token.accessToken;
            }
            return session;
        },
    },

    // Custom pages for login and error handling
    pages: {
        signIn: "/gbeex/auth/login",
        error: "/gbeex/error",
    },

    // Secret used to sign JWT tokens
    secret: process.env.NEXTAUTH_SECRET!,
};

// Expose handlers for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Flow Summary
// 1. User submits login form, authorize() will get called and returns user + token
// 2. jwt() called with that user
// 3. jwt() saves user.id, role, accessToken into the JWT payload
// 4. session() extracts them into the session object