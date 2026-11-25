import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User { token: string; role?: string; uid?: string }
  interface Session { apiToken?: string; user: { id?: string; name?: string | null; email?: string | null; role?: string } }
}
declare module "next-auth/jwt" {
  interface JWT { apiToken?: string; role?: string; uid?: string }
}
