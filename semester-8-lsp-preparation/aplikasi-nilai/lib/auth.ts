import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/authSchema";

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "production"
    ? undefined
    : "development-secret-aplikasi-nilai-lsp");

/**
 * Memastikan nilai unknown merupakan role yang valid di sistem.
 * @param value - Nilai role dari token atau sumber eksternal
 * @returns true jika value adalah role resmi aplikasi
 */
function isRole(value: unknown): value is Role {
  return value === "ADMIN" || value === "GURU" || value === "SISWA";
}

/**
 * Konfigurasi NextAuth.js v5 dengan Credentials Provider.
 * Autentikasi menggunakan tabel users dan password bcrypt.
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validasi = loginSchema.safeParse(credentials);
        if (!validasi.success) return null;

        const user = await prisma.user.findUnique({
          where: { username: validasi.data.username },
        });
        if (!user) return null;

        const passwordCocok = await bcrypt.compare(
          validasi.data.password,
          user.password
        );
        if (!passwordCocok) return null;

        return {
          id: user.id,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * Menyimpan id dan role user ke JWT agar middleware dapat membaca role.
     * @param token - Token JWT yang sedang diproses
     * @param user - User hasil login credentials
     * @returns Token JWT yang sudah diperkaya id dan role
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    /**
     * Menyalin id dan role dari token ke session.
     * @param session - Session yang akan dikirim ke aplikasi
     * @param token - Token JWT sumber data user
     * @returns Session yang sudah memiliki id dan role
     */
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      if (session.user && isRole(token.role)) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: authSecret,
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
