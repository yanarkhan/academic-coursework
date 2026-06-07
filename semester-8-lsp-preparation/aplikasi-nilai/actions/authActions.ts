"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginActionState = {
  sukses: boolean;
  pesan: string;
};

/**
 * Memproses login pengguna melalui NextAuth Credentials Provider.
 * @param _prevState - State form sebelumnya dari useActionState
 * @param formData - Data form login berisi username dan password
 * @returns Pesan error jika validasi atau autentikasi gagal
 */
export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const validasi = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validasi.success) {
    return {
      sukses: false,
      pesan: "Username dan password wajib diisi.",
    };
  }

  try {
    await signIn("credentials", {
      username: validasi.data.username,
      password: validasi.data.password,
      redirectTo: "/login",
    });

    return {
      sukses: true,
      pesan: "Login berhasil.",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return {
        sukses: false,
        pesan: "Username atau password tidak sesuai.",
      };
    }

    throw error;
  }
}

/**
 * Menghapus session pengguna dan mengarahkan kembali ke halaman login.
 * @returns Promise yang selesai setelah NextAuth memproses logout
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
