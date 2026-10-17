import { DefaultSession } from "next-auth";

// เพิ่ม field id และ role ให้ TypeScript รู้จักใน session / user / token
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
