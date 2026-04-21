import Link from "next/link";
import { auth } from "../../auth";

export default async function CtaSection() {
  const session = await auth();
  const user = session?.user;

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">
          Final call
        </p>

        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          Stop rewriting the same update for every channel.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60">
          Save your company context once. Paste your raw update. Get drafts
          tailored to each platform, then review and approve before publishing.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}