import { z } from "zod";

/** Skema validasi kredensial login untuk NextAuth Credentials Provider. */
export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
