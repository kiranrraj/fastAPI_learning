// app/types/next-auth.d.ts
// This file extends the NextAuth.js types to include custom properties

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Extend the Session type to include your custom properties
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: string; // Add your custom accessToken property
        // You can add other custom properties here if you expose them in the session callback
        // Example: user?: { id?: string; name?: string; email?: string; role?: string; } & DefaultSession['user'];
        // For now, we only need accessToken explicitly here.
        user: DefaultSession["user"] & {
            // You might have custom user properties here from your authorize callback
            // Example: id?: string;
            // Example: role?: string;
        };
    }

    /**
     * Returned by the `authorize` callback and used by the `session` and `jwt` callbacks
     * for the `session.user` object.
     */
    interface User extends DefaultUser {
        accessToken?: string; // Add accessToken to User type (from authorize callback)
        refreshToken?: string; // Add refreshToken to User type (from authorize callback)
        // Add other custom user properties from your authorize callback
        // Example: id?: string;
        // Example: role?: string;
    }
}

// Extend the JWT type to include your custom properties
declare module "next-auth/jwt" {
    /**
     * Returned by the `jwt` callback and used by the `session` callback
     */
    interface JWT extends DefaultJWT {
        accessToken?: string; // Add accessToken property
        refreshToken?: string; // Add refreshToken property
        // Add other custom properties you store in the JWT token
    }
}