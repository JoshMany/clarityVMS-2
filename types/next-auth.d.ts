import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  type JWT = {
    email: string;
    username: string;
    uuid: string;
    rol: number;
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      uuid: string;
      rol: number;
    };
  }
}
