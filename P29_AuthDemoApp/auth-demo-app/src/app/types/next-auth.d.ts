// src\app\types\next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: DefaultSession["user"] & {
            id?: string;
            role?: string;
        };
        accessToken?: string;
    }

    interface User extends DefaultUser {
        id?: string;
        role?: string;
        token?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: string;
        accessToken?: string;
    }
}
