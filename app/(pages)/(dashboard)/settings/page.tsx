"use client";

import { useState, useTransition } from "react";
import { saveCompanyContext } from "@/app/actions/save-company-context";

const TONE_OPTIONS = [
  "Professional",
  "Casual",
  "Witty",
  "Authoritative",
  "Inspirational",
  "Educational",
];

export default function SettingsPage() {
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");
  const [productsOrServices, setProductsOrServices] = useState("");
  const [tone, setTone] = useState("");
  const [samples, setSamples] = useState<string[]>([""]);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [isSaving, startSaving] = useTransition();

  function addSample() {
    if (samples.length < 5) setSamples((prev) => [...prev, ""]);
  }

  function updateSample(i: number, val: string) {
    setSamples((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  }

  function removeSample(i: number) {
    setSamples((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const validSamples = samples.map((s) => s.trim()).filter(Boolean);
    if (validSamples.length === 0) {
      setMessage({ text: "Add at least one brand voice sample.", ok: false });
      return;
    }
    startSaving(async () => {
      const result = await saveCompanyContext({
        brandName: brandName.trim(),
        audience: audience.trim(),
        productsOrServices: productsOrServices.trim(),
        tone: tone.trim(),
        brandVoiceSamples: validSamples,
      });
      setMessage({
        text: result.success
          ? "Brand profile saved. You can now generate content."
          : (result.error ?? "Failed to save."),
        ok: result.success,
      });
    });
  }

  return (
    <main className="min-h-screen bg-[#0b0f14] px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Brand Settings</h1>
          <p className="mt-1 text-sm text-white/40">
            This context is used by the AI to generate on-brand content. Fill it out once before composing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Brand Name */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <FieldLabel n={1} title="Brand / Creator name" required />
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Tenora AI, Acme Corp, Jane Doe"
              className="w-full rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
            />
          </section>

          {/* Audience */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <FieldLabel n={2} title="Primary target audience" required />
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              required
              minLength={5}
              placeholder="e.g. Solo founders building SaaS products, DevOps engineers"
              className="w-full rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
            />
            <p className="text-xs text-white/30">Who do you primarily create content for?</p>
          </section>

          {/* Products / Services */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <FieldLabel n={3} title="What do you offer?" />
            <textarea
              value={productsOrServices}
              onChange={(e) => setProductsOrServices(e.target.value)}
              rows={3}
              placeholder="e.g. AI-powered content scheduling and repurposing for lean teams"
              className="w-full resize-none rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
            />
            <p className="text-xs text-white/30">Optional — helps the AI reference your product accurately.</p>
          </section>

          {/* Tone */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <FieldLabel n={4} title="Content tone" />
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone((prev) => (prev === t ? "" : t))}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    tone === t
                      ? "bg-emerald-400 text-black"
                      : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Or describe your own tone…"
              className="w-full rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
            />
          </section>

          {/* Brand Voice Samples */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <FieldLabel n={5} title="Brand voice samples" required />
            <p className="text-xs text-white/30">
              Paste 1–5 real posts or sentences that represent your voice. The AI uses these to match your style.
            </p>
            <div className="space-y-2">
              {samples.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={s}
                    onChange={(e) => updateSample(i, e.target.value)}
                    rows={2}
                    placeholder={`Sample ${i + 1}…`}
                    className="flex-1 resize-none rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
                  />
                  {samples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSample(i)}
                      className="self-start mt-1 rounded-lg bg-white/[0.04] px-2 py-2 text-xs text-white/30 hover:bg-red-400/10 hover:text-red-400 transition-all"
                      aria-label="Remove sample"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {samples.length < 5 && (
              <button
                type="button"
                onClick={addSample}
                className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors"
              >
                + Add another sample
              </button>
            )}
          </section>

          {/* Save */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-2xl bg-emerald-400 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Brand Profile"}
          </button>

          {message && (
            <p className={`rounded-xl px-4 py-3 text-sm ${
              message.ok ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
            }`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

function FieldLabel({ n, title, required }: { n: number; title: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold text-emerald-400">
        {n}
      </span>
      <h2 className="text-sm font-medium text-white">
        {title}
        {required && <span className="ml-1 text-emerald-400">*</span>}
      </h2>
    </div>
  );
}