import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  mode: "login" | "signup";
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthShell({
  mode,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-[#0f1318] p-10 xl:p-14">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
                T
              </div>
              <div>
                <p className="text-sm font-medium tracking-wide text-white/80">
                  Tenora
                </p>
                <p className="text-xs text-white/45">
                  Content engine for lean teams
                </p>
              </div>
            </Link>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-emerald-300/80">
              Write once. Adapt everywhere.
            </p>

            <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
              Turn raw company updates into platform-specific drafts that are
              ready to review.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
              Save your company context once. Then turn launches, product
              updates, and internal wins into polished LinkedIn posts, X
              threads, Instagram captions, and newsletter copy.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Raw update
                </p>
                <p className="mt-2 text-sm text-white/85">
                  “We just launched dark mode. No toggle needed — it follows
                  system preference automatically.”
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
                    X
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Punchy thread with a sharp first hook.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/80">
                    LinkedIn
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Clean, professional post with strong opening lines.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">
                    Newsletter
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Brief, direct copy without filler.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/40">
            Built for solo founders, startups, and lean teams.
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
                  T
                </div>
                <div>
                  <p className="text-sm font-medium tracking-wide text-white/80">
                    Tenora
                  </p>
                  <p className="text-xs text-white/45">
                    Content engine for lean teams
                  </p>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
              <div className="mb-8">
                <p className="mb-3 text-sm uppercase tracking-[0.22em] text-white/40">
                  {isLogin ? "Sign in" : "Create account"}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {subtitle}
                </p>
              </div>

              {children}

              <div className="mt-8 text-center text-sm text-white/50">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-white transition hover:text-emerald-300"
                    >
                      Create one
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-white transition hover:text-emerald-300"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}