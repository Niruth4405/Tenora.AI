import Link from "next/link";
import { auth } from "../../auth";

const PLATFORM_CARDS = [
  {
    name: "X / Twitter",
    text: "Punchy threads with sharp hooks and concise follow-through.",
  },
  {
    name: "LinkedIn",
    text: "Professional posts that sound human, clear, and credible.",
  },
  {
    name: "Instagram",
    text: "Warm captions with stronger emotional framing and CTA.",
  },
  {
    name: "Newsletter",
    text: "Short, direct updates without bloated intro copy.",
  },
];

export default async function HeroSection() {
  const session = await auth();
  const user = session?.user;

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.12),transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-28">
        <div className="relative z-10">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-emerald-300/80">
            From raw update to channel-ready content
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Turn one company update into polished drafts for every platform.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Tenora helps founders, startups, and lean teams turn messy launch
            notes, product updates, and wins into review-ready content for X,
            LinkedIn, Instagram, and email.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                >
                  Start free
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/45">
            <span>Store company context once</span>
            <span>Generate by platform</span>
            <span>Review before publishing</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-[#11161c] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Raw update
              </p>
              <p className="mt-3 text-sm leading-7 text-white/85">
                We just launched dark mode for Tenora. No toggle needed — it
                follows system preference automatically.
              </p>
            </div>

            <div className="my-4 flex items-center justify-center">
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-300">
                Generated outputs
              </div>
            </div>

            <div className="grid gap-4">
              {PLATFORM_CARDS.map((card) => (
                <div
                  key={card.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {card.name}
                    </p>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                      Draft
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}