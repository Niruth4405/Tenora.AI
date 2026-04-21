"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "../../../components/auth-shell";
import { signupAction } from "@/app/actions/signup";

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const signupResult = await signupAction({
        name,
        email,
        password,
        confirmPassword,
      });

      if (!signupResult.success) {
        toast.error(signupResult.error ?? "Failed to create account.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Account created. Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Account created successfully.");
      router.push("/");
      router.refresh();
    });
  }

  function handleGoogleSignIn() {
    startTransition(async () => {
      await signIn("google", { callbackUrl: "/" });
    });
  }

  return (
    <AuthShell
      mode="signup"
      title="Create your Tenora account"
      subtitle="Save your company context once and turn raw updates into polished drafts for every platform."
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white/80"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Niruth Ananth"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/60 focus:bg-white/[0.07]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/80"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/60 focus:bg-white/[0.07]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white/80"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/60 focus:bg-white/[0.07]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-white/80"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/60 focus:bg-white/[0.07]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-60"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-white/35">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-60"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v2.98h5.36c-.23 1.52-1.14 2.8-2.43 3.66v2.43h3.92c2.3-2.12 3.62-5.24 3.62-8.94 0-.76-.07-1.49-.2-2.2ZM12 22c2.7 0 4.96-.9 6.61-2.44l-3.92-2.43c-1.09.73-2.48 1.16-4.01 1.16-3.08 0-5.69-2.08-6.62-4.88H.02v2.5A9.99 9.99 0 0 0 12 22Zm-6.62-8.59a5.98 5.98 0 0 1 0-3.82v-2.5H.02a9.99 9.99 0 0 0 0 8.82l4.36-2.5Zm6.62-7.7c1.47 0 2.8.5 3.84 1.48l2.88-2.88C16.95 2.69 14.69 2 12 2A9.99 9.99 0 0 0 .02 8.09l4.36 2.5c.93-2.8 3.54-4.88 6.62-4.88Z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </AuthShell>
  );
}