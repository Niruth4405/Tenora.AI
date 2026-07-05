"use client";

import { useState, useTransition } from "react";

import { generateDrafts } from "@/app/actions/generate-drafts";
import { saveGeneratedDrafts } from "@/app/actions/save-generated-drafts";

import type { Platform } from "@/app/lib/ai/types";
import type { ContentSize } from "@prisma/client";

const PLATFORM_OPTIONS: Platform[] = [
  "TWITTER",
  "LINKEDIN",
  "INSTAGRAM",
  "NEWSLETTER",
];

const DEFAULT_TAGS = [
  "direct",
  "minimal",
  "technical",
  "founder-led",
];

const SIZE_OPTIONS: {
  label: string;
  value: ContentSize;
  words: number;
}[] = [
  {
    label: "Small",
    value: "SMALL",
    words: 75,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    words: 150,
  },
  {
    label: "Large",
    value: "LARGE",
    words: 300,
  },
  {
    label: "Custom",
    value: "CUSTOM",
    words: 0,
  },
];

export default function ComposePage() {
  const [update, setUpdate] = useState("");
  const [context, setContext] = useState("");

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "TWITTER",
  ]);

  const [selectedTags, setSelectedTags] =
    useState<string[]>(DEFAULT_TAGS);

  const [selectedSize, setSelectedSize] =
    useState<ContentSize>("MEDIUM");

  const [customWordLimit, setCustomWordLimit] =
    useState<number>(500);

  const [result, setResult] = useState<any>(null);

  const [message, setMessage] = useState<string | null>(null);

  const [saveMessage, setSaveMessage] =
    useState<string | null>(null);

  const [isGenerating, startGenerating] = useTransition();

  const [isSaving, startSaving] = useTransition();

  function togglePlatform(platform: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag],
    );
  }

  function handleGenerate(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setMessage(null);
    setSaveMessage(null);
    setResult(null);

    startGenerating(async () => {
      const response = await generateDrafts({
        update,
        context,
        selectedPlatforms,
        selectedTags,
        size: selectedSize,
        customWordCount:
          selectedSize === "CUSTOM"
            ? customWordLimit
            : undefined,
      });

      setResult(response);

      if (!response.success) {
        setMessage(
          response.error ?? "Failed to generate drafts.",
        );
        return;
      }

      setMessage("Drafts generated successfully.");
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
          : output?.draft ?? "",
        hashtags: output?.hashtags ?? [],
        notes: output?.notes,
        size: selectedSize,
        customWordCount:
          selectedSize === "CUSTOM"
            ? customWordLimit
            : undefined,
      }));

    if (drafts.length === 0) {
      setSaveMessage("No drafts available to save.");
      return;
    }

    startSaving(async () => {
      const response = await saveGeneratedDrafts({
        sourceUpdate: update,
        context,
        drafts,
      });

      if (!response.success) {
        setSaveMessage(
          response.error ?? "Failed to save drafts.",
        );
        return;
      }

      setSaveMessage(
        `Saved ${response.savedCount} draft(s).`,
      );
    });
  }

  return (
    <main className="min-h-screen bg-[#0b0f14] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <form
          onSubmit={handleGenerate}
          className="space-y-6"
        >
          <textarea
            value={update}
            onChange={(e) => setUpdate(e.target.value)}
            className="w-full rounded-2xl bg-[#11161c] p-4"
            placeholder="Raw update"
          />

          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full rounded-2xl bg-[#11161c] p-4"
            placeholder="Context"
          />

          <div className="flex flex-wrap gap-3">
            {SIZE_OPTIONS.map((size) => {
              const active =
                selectedSize === size.value;

              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() =>
                    setSelectedSize(size.value)
                  }
                  className={`rounded-full px-4 py-2 ${
                    active
                      ? "bg-emerald-400 text-black"
                      : "bg-[#11161c]"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>

          {selectedSize === "CUSTOM" && (
            <input
              type="number"
              value={customWordLimit}
              onChange={(e) =>
                setCustomWordLimit(
                  Number(e.target.value),
                )
              }
              className="w-full rounded-2xl bg-[#11161c] p-4"
              placeholder="Custom word limit"
            />
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="rounded-2xl bg-emerald-400 px-6 py-3 font-semibold text-black"
          >
            {isGenerating
              ? "Generating..."
              : "Generate"}
          </button>

          {message && (
            <p className="text-sm text-white/70">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}