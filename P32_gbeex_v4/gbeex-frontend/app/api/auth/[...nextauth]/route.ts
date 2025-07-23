// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; // Import JWT type for better type safety

// Function to check if a JWT token is expired or close to expiring
// helper function to avoid repeating logic
function isJwtExpired(token: string | undefined): boolean {
    if (!token) return true; // Treat undefined/null tokens as expired

    try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        // Check if 'exp' (expiration time) exists and if current time is past it
        // Add a buffer (60 seconds) to refresh proactively
        const REFRESH_THRESHOLD_SECONDS = 60;
        return decoded.exp < (Date.now() / 1000) + REFRESH_THRESHOLD_SECONDS;
    } catch (e) {
        // Malformed token should be treated as expired
        console.error("Error decoding token for expiry check:", e);
        return true;
    }
}

// Function to call the FastAPI refresh endpoint
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
            {
                method: "POST",
                // Send refresh token in Auth header
                headers: { "Authorization": `Bearer ${refreshToken}` },
            }
        );

        if (!res.ok) {
            console.error("Failed to refresh token:", res.status, await res.text());
            return null;
        }

        const tokenData: { access_token: string; token_type: string; refresh_token: string } =
            await res.json();

        // Return new access and refresh tokens
        return {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token
        };

    } catch (error) {
        console.error("Error calling refresh endpoint:", error);
        return null;
    }
}


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
                const username = credentials?.username;
                const password = credentials?.password;
                if (!username || !password) {
                    return null;
                }

                const params = new URLSearchParams();
                params.append("username", username);
                params.append("password", password);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: params.toString(),
                    }
                );

                if (!res.ok) {
                    // Log the error response from FastAPI
                    const errorText = await res.text();
                    console.error("FastAPI login failed:", res.status, errorText);
                    return null;
                }

                // Parse out both access_token and refresh_token from the FastAPI response
                const tokenData: { access_token: string; token_type: string; refresh_token: string } =
                    await res.json();
                // Get refresh_token
                const { access_token, refresh_token } = tokenData;

                // Fetch the user profile from FastAPI using the new access_token
                const userRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
                    {
                        headers: { Authorization: `Bearer ${access_token}` },
                    }
                );
                if (!userRes.ok) {
                    console.error("FastAPI user profile fetch failed:", userRes.status, await userRes.text());
                    return null;
                }

                const user = await userRes.json();

                // Return a User object including our FastAPI access and refresh tokens
                return {
                    id: user.username,
                    name: `${user.firstName} ${user.lastName}`,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                } as any; // !!!Important: Cast to any to allow custom properties
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // On initial sign in (user object is present only on first sign in),
            // copy accessToken and refreshToken from the user object to the JWT token.
            if (user && (user as any).accessToken && (user as any).refreshToken) {
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken; // Store refresh token
                console.log("JWT Callback: Initial sign-in. Tokens set.");
            }
            // For subsequent requests (user is null), check and refresh tokens
            else if (token.accessToken && token.refreshToken) {
                // Check if the current access token is expired or nearing expiry
                if (isJwtExpired(token.accessToken as string)) {
                    console.log("JWT Callback: Access token expired or near expiry. Attempting refresh...");
                    const refreshedTokens = await refreshAccessToken(token.refreshToken as string);

                    if (refreshedTokens) {
                        token.accessToken = refreshedTokens.accessToken;
                        // Update refresh token (rotation)
                        token.refreshToken = refreshedTokens.refreshToken;
                        console.log("JWT Callback: Tokens successfully refreshed.");
                    } else {
                        // If refresh failed, invalidate tokens to force re-login
                        console.warn("JWT Callback: Failed to refresh tokens. Forcing re-login.");
                        token.accessToken = null; // Invalidate access token
                        token.refreshToken = null; // Invalidate refresh token
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Expose accessToken on the `session` object for client-side use.
            (session as any).accessToken = (token as any).accessToken;
            // You can optionally add other user-specific data from the token here
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