"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/authActions";

const initialLoginActionState = {
  sukses: false,
  pesan: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginActionState
  );

  return (
    <Form action={formAction} className="space-y-5">
      <FormField>
        <FormItem className="space-y-2">
          <FormLabel htmlFor="username" className="text-sm font-medium">
            Username
          </FormLabel>
          <FormControl>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                className="h-12 rounded-xl border-border/80 bg-muted/20 pl-10 shadow-none transition-colors focus-visible:border-primary/60 focus-visible:ring-primary/20"
                disabled={isPending}
                required
              />
            </div>
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem className="space-y-2">
          <FormLabel htmlFor="password" className="text-sm font-medium">
            Password
          </FormLabel>
          <FormControl>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="h-12 rounded-xl border-border/80 bg-muted/20 pl-10 shadow-none transition-colors focus-visible:border-primary/60 focus-visible:ring-primary/20"
                disabled={isPending}
                required
              />
            </div>
          </FormControl>
        </FormItem>
      </FormField>

      {state.pesan ? (
        <FormMessage className="rounded-xl border border-destructive/15 bg-destructive/5 px-3 py-2 text-sm">
          {state.pesan}
        </FormMessage>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
        disabled={isPending}
      >
        <LogIn className="size-4" />
        {isPending ? "Memproses..." : "Masuk"}
      </Button>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        Jika lupa kredensial, hubungi Admin untuk reset akun.
      </p>
    </Form>
  );
}
