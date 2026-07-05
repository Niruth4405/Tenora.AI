"use client";

import { useState, useTransition } from "react";
import { generateDrafts } from "@/app/actions/generate-drafts";
import { saveGeneratedDrafts } from "@/app/actions/save-generated-drafts";
import type { Platform } from "@/app/lib/ai/types";

const PLATFORM_OPTIONS: {
  value: Platform;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: "LINKEDIN", label: "LinkedIn", icon: "in", color: "text-[#0A66C2]" },
  { value: "TWITTER", label: "Twitter / X", icon: "𝕏", color: "text-white" },
  {
    value: "NEWSLETTER",
    label: "Newsletter",
    icon: "✉",
    color: "text-emerald-400",
  },
  { value: "INSTAGRAM", label: "Instagram", icon: "◈", color: "text-pink-400" },
];

const TONE_OPTIONS = [
  "Professional",
  "Casual",
  "Witty",
  "Authoritative",
  "Inspirational",
  "Educational",
];

const MIN_WORDS = 50;
const MAX_WORDS = 800;

export default function ComposePage() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("");
  const [requirement, setRequirement] = useState("");
  const [audience, setAudience] = useState("");
  const [wordCount, setWordCount] = useState(150);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "LINKEDIN",
  ]);
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();

  function togglePlatform(platform: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }

  function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setSaveMessage(null);
    setResult(null);

    startGenerating(async () => {
      const composed = [
        `Context: ${context}`,
        `Tone: ${tone || "Professional"}`,
        `Requirement: ${requirement}`,
        `Target audience: ${audience}`,
        `Length: approximately ${wordCount} words`,
      ].join("\n");

      const response = await generateDrafts({
        update: composed,
        selectedPlatforms,
      });

      setResult(response);
      setMessage(
        response.success
          ? "Drafts generated successfully."
          : (response.error ?? "Failed to generate drafts."),
      );
    });
  }

  function handleSaveDrafts() {
    if (!result?.results) return;
    setSaveMessage(null);

    const drafts = Object.entries(result.results)
      .filter(([, output]) => Boolean(output))
      .map(([platform, output]: any) => ({
        platform,
        draft: Array.isArray(output?.draft)
          ? output.draft.join("\n")
          : (output?.draft ?? ""),
        hashtags: output?.hashtags ?? [],
        notes: output?.notes,
        size: "MEDIUM" as const,
      }));

    if (drafts.length === 0) {
      setSaveMessage("No drafts available to save.");
      return;
    }

    startSaving(async () => {
      const response = await saveGeneratedDrafts({
        sourceUpdate: requirement,
        drafts,
      });
      setSaveMessage(
        response.success
          ? `Saved ${response.savedCount} draft(s).`
          : (response.error ?? "Failed to save drafts."),
      );
    });
  }

  const sliderPercent =
    ((wordCount - MIN_WORDS) / (MAX_WORDS - MIN_WORDS)) * 100;

  return (
    <main className="min-h-screen bg-[#0b0f14] px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Compose</h1>
          <p className="mt-1 text-sm text-white/40">
            Fill in the details below and generate platform-ready drafts.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* 1. Context */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <StepLabel n={1} title="Context" />
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              required
              minLength={8}
              rows={3}
              className="w-full resize-none rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
              placeholder="What is this content about? e.g. We just launched a new CI/CD feature…"
            />
          </section>

          {/* 2. Tone */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <StepLabel n={2} title="Tone" />
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
          </section>

          {/* 3. Requirement */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <StepLabel n={3} title="Requirement" />
            <textarea
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              required
              minLength={5}
              rows={3}
              className="w-full resize-none rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
              placeholder="What should the AI create? e.g. A LinkedIn post announcing the launch with a CTA to try it free…"
            />
          </section>

          {/* 4. Targeted Audience */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3">
            <StepLabel n={4} title="Targeted Audience" />
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              required
              className="w-full rounded-xl bg-[#0d1117] border border-white/[0.07] px-4 py-3 text-sm placeholder-white/25 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
              placeholder="e.g. DevOps engineers, SaaS founders, indie hackers…"
            />
          </section>

          {/* 5. Length + Platform */}
          <section className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-5">
            <StepLabel n={5} title="Length & Platform" />

            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">
                  Short (~{MIN_WORDS}w)
                </span>
                <span className="rounded-lg bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  ~{wordCount} words
                </span>
                <span className="text-xs text-white/30">
                  Long (~{MAX_WORDS}w)
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-white/[0.07]">
                <div
                  className="absolute left-0 top-0 h-2 rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${sliderPercent}%` }}
                />
                <input
                  type="range"
                  min={MIN_WORDS}
                  max={MAX_WORDS}
                  step={25}
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="absolute inset-0 w-full cursor-pointer opacity-0"
                  aria-label="Word count"
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-emerald-400 bg-[#11161c] shadow transition-all"
                  style={{ left: `${sliderPercent}%` }}
                />
              </div>
              <div className="flex gap-2">
                {[75, 150, 300, 500].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWordCount(w)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      wordCount === w
                        ? "bg-emerald-400 text-black"
                        : "bg-white/[0.06] text-white/40 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {w}w
                  </button>
                ))}
              </div>
            </div>

            {/* Platform picker */}
            <div className="grid grid-cols-2 gap-2">
              {PLATFORM_OPTIONS.map((p) => {
                const active = selectedPlatforms.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    aria-pressed={active}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                        : "border-white/[0.07] bg-[#0d1117] text-white/40 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    <span
                      className={`text-base font-bold ${active ? p.color : "text-white/30"}`}
                    >
                      {p.icon}
                    </span>
                    <span>{p.label}</span>
                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
            {selectedPlatforms.length === 0 && (
              <p className="text-xs text-red-400/80">
                Select at least one platform.
              </p>
            )}
          </section>

          {/* Generate */}
          <button
            type="submit"
            disabled={isGenerating || selectedPlatforms.length === 0}
            className="w-full rounded-2xl bg-emerald-400 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating…
              </span>
            ) : (
              `Generate ${selectedPlatforms.length} Draft${selectedPlatforms.length !== 1 ? "s" : ""}`
            )}
          </button>

          {message && (
            <p
              className={`rounded-xl px-4 py-3 text-sm ${
                result?.success
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {/* Results */}
        {result?.success && result.results && (
          <div className="mt-8 space-y-4">
            <h2 className="text-sm font-medium text-white">Generated Drafts</h2>

            {Object.entries(result.results).map(([platform, output]: any) => (
              <div
                key={platform}
                className="rounded-2xl bg-[#11161c] border border-white/[0.06] p-5 space-y-3"
              >
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/60">
                  {platform}
                </span>
                <p className="whitespace-pre-wrap text-sm text-white/80 leading-relaxed">
                  {Array.isArray(output.draft)
                    ? output.draft.join("\n")
                    : output.draft}
                </p>
                {output.hashtags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {output.hashtags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleSaveDrafts}
              disabled={isSaving}
              className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/5 py-3.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-50 transition-all"
            >
              {isSaving ? "Saving…" : "Save All Drafts"}
            </button>

            {saveMessage && (
              <p className="rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-white/50">
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold text-emerald-400">
        {n}
      </span>
      <h2 className="text-sm font-medium text-white">{title}</h2>
    </div>
  );
}
