"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = { status: "idle" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoFocus className="mt-2 h-11" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required className="mt-2 h-11" />
      </div>
      {state.status === "error" && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} className="btn-clay h-11 w-full text-base">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
}
