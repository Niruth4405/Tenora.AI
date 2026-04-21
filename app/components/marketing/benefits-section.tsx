const BENEFITS = [
  {
    title: "Store context once",
    text: "Save your brand, audience, voice tags, and product context once — then reuse it across every generation.",
  },
  {
    title: "Write raw updates",
    text: "Drop in messy product updates, launch notes, or internal wins. Tenora turns them into cleaner platform-ready drafts.",
  },
  {
    title: "Review before publishing",
    text: "Every draft comes back for editing and approval, so you stay in control instead of blindly trusting automation.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">
            How it works
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Built for teams that do not have time to write from scratch every
            single time.
          </h2>

          <p className="mt-4 text-base leading-7 text-white/60">
            Tenora keeps the workflow simple: capture context once, turn rough
            updates into polished drafts, and review everything before it goes
            live.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BENEFITS.map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-semibold text-black">
                {index + 1}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/60">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}