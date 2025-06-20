// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

type EntityAccess = {
  name: string;
  read: boolean;
  write: boolean;
};

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      entity_access?: EntityAccess[];
    };
  }

  interface User {
    role?: string;
    entity_access?: EntityAccess[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    entity_access?: EntityAccess[];
  }
}
