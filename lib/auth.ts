import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_BASE } from "./api/config";

function userIdFromToken(token: string): string | undefined {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).id;
  } catch {
    return undefined;
  }
}

export let authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        let res = await fetch(`${API_BASE}/v1/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        let json = await res.json().catch(() => null);
        if (!res.ok || !json?.token) throw new Error(json?.message ?? "Incorrect email or password");
        return { id: json.user.email, name: json.user.name, email: json.user.email, role: json.user.role, token: json.token, uid: userIdFromToken(json.token) };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) { token.name = session.name ?? token.name; token.email = session.email ?? token.email; }
      if (user) { token.apiToken = user.token; token.role = user.role; token.uid = user.uid; }
      return token;
    },
    async session({ session, token }) {
      session.apiToken = token.apiToken;
      if (session.user) { session.user.role = token.role; session.user.id = token.uid; }
      return session;
    },
  },
};
