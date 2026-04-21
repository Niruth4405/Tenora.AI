import AppShell from "../../../components/layout/app-shell";

const OUTPUTS = [
  {
    platform: "LinkedIn",
    copy: "We just launched dark mode in Tenora. It now follows system preference automatically, which means a smoother experience for teams working late or switching between devices throughout the day.",
  },
  {
    platform: "Twitter",
    copy: "We shipped dark mode for Tenora.\n\nNo toggle hunting.\nNo extra setup.\nIt follows your system preference automatically.\n\nSmall change, much better feel.",
  },
  {
    platform: "Instagram",
    copy: "Dark mode is now live in Tenora ✨\n\nIt follows your system preference automatically, so your workspace feels right the moment you open it.\n\nSmall product changes like this make day-to-day work smoother.",
  },
  {
    platform: "Newsletter",
    copy: "This week we rolled out dark mode in Tenora. It automatically follows system preference, making the product feel more natural across different devices and work setups.",
  },
];

const TAGS = ["direct", "minimal", "technical", "founder-led"];

export default function ComposePage() {
  return (
    <AppShell
      title="Compose"
      subtitle="Turn a raw update into polished drafts, review every output, and copy or post directly from one workspace."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">Input Context</h2>
            <p className="mt-2 text-sm text-white/55">
              Add the update, product context, and brand direction for generation.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Raw Update
                </label>
                <textarea
                  className="min-h-36 w-full rounded-2xl border border-white/10 bg-[#11161c] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                  placeholder="We launched dark mode today. It follows system preference automatically and is live for all users."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Product / Audience Context
                </label>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#11161c] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                  placeholder="Tenora helps startups and lean teams generate multi-platform content from a single update."
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-white/75">
                  Brand Voice Tags
                </label>
                <div className="flex flex-wrap gap-3">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/15"
                    >
                      #{tag}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="rounded-full border border-dashed border-white/15 px-4 py-2 text-sm text-white/45 transition hover:bg-white/5 hover:text-white"
                  >
                    + Add tag
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-white/75">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-3">
                  {["LinkedIn", "Twitter", "Instagram", "Newsletter"].map(
                    (platform) => (
                      <button
                        key={platform}
                        type="button"
                        className="rounded-full border border-white/10 bg-[#11161c] px-4 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                      >
                        {platform}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300">
                Generate outputs
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Generated Outputs</h2>
                <p className="mt-2 text-sm text-white/55">
                  Review the drafts, copy them, or send them into your posting flow.
                </p>
              </div>

              <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white">
                Regenerate
              </button>
            </div>

            <div className="space-y-4">
              {OUTPUTS.map((output) => (
                <div
                  key={output.platform}
                  className="rounded-2xl border border-white/10 bg-[#11161c] p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-300">{output.platform}</p>
                      <h3 className="mt-1 text-base font-medium text-white">
                        Ready-to-post draft
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                      Draft
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-sm leading-7 text-white/75">
                    {output.copy}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300">
                      Copy draft
                    </button>
                    <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white">
                      Post now
                    </button>
                    <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white">
                      Save output
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}