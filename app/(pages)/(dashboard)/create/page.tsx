"use client";

import { useState, useTransition } from "react";
import { generateDrafts } from "@/app/actions/generate-drafts";
import { saveGeneratedDrafts } from "@/app/actions/save-generated-drafts";
import type { Platform } from "@/app/lib/ai/generate";

const PLATFORM_OPTIONS: Platform[] = [
  "TWITTER",
  "LINKEDIN",
  "INSTAGRAM",
  "NEWSLETTER",
];

export default function CreatePage() {
  const [update, setUpdate] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "TWITTER",
  ]);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof generateDrafts>
  > | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();

  function togglePlatform(platform: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setSaveMessage(null);
    setResult(null);

    startGenerating(async () => {
      const response = await generateDrafts({
        update,
        selectedPlatforms,
      });

      setResult(response);

      if (!response.success) {
        setMessage(response.error ?? "Failed to generate drafts.");
        return;
      }

      if (response.error) {
        setMessage(response.error);
      } else {
        setMessage("Drafts generated successfully.");
      }
    });
  }

  function handleSaveDrafts() {
    if (!result?.results) return;

    setSaveMessage(null);

    const drafts = Object.entries(result.results)
      .filter(([, output]) => Boolean(output))
      .map(([platform, output]) => ({
        platform: platform as Platform,
        draft: output!.draft,
        hashtags: output!.hashtags,
        notes: output!.notes,
      }));

    if (drafts.length === 0) {
      setSaveMessage("No drafts available to save.");
      return;
    }

    startSaving(async () => {
      const response = await saveGeneratedDrafts({
        sourceUpdate: update,
        drafts,
      });

      if (!response.success) {
        setSaveMessage(response.error ?? "Failed to save drafts.");
        return;
      }

      setSaveMessage(`Saved ${response.savedCount} draft(s).`);
    });
  }

  const hasGeneratedResults =
    result?.results && Object.keys(result.results).length > 0;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Generate Drafts</h1>
        <p className="text-sm text-gray-600 mt-2">
          Enter a raw company update, choose your target platforms, and generate
          channel-specific drafts using your saved company context.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label htmlFor="update" className="block mb-2 font-medium">
            Raw Update
          </label>
          <textarea
            id="update"
            value={update}
            onChange={(e) => setUpdate(e.target.value)}
            className="w-full rounded border px-3 py-3 min-h-36"
            placeholder="We just launched dark mode for our app. It follows system preference automatically and is now live for all users."
          />
          <p className="text-xs text-gray-500 mt-2">
            This can be messy, informal, or short — the AI will adapt it using
            your saved company context.
          </p>
        </div>

        <div>
          <label className="block mb-2 font-medium">Platforms</label>
          <div className="flex flex-wrap gap-3">
            {PLATFORM_OPTIONS.map((platform) => {
              const checked = selectedPlatforms.includes(platform);

              return (
                <label
                  key={platform}
                  className={`rounded border px-4 py-2 cursor-pointer text-sm transition ${
                    checked
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePlatform(platform)}
                    className="hidden"
                  />
                  {platform}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isGenerating}
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>

          {message && <p className="text-sm text-gray-700">{message}</p>}
        </div>
      </form>

      {result && (
        <section className="mt-10 space-y-6">
          <div className="rounded border p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">Generation Summary</h2>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Status:</span> {result.status}
              </p>

              {result.tier && (
                <p>
                  <span className="font-medium">Tier:</span> {result.tier}
                </p>
              )}

              {typeof result.creditsBefore !== "undefined" && (
                <p>
                  <span className="font-medium">Credits:</span>{" "}
                  {String(result.creditsBefore)} → {String(result.creditsAfter)}
                </p>
              )}

              {typeof result.creditsUsed !== "undefined" && (
                <p>
                  <span className="font-medium">Credits Used:</span>{" "}
                  {result.creditsUsed}
                </p>
              )}

              {result.allowedPlatforms && result.allowedPlatforms.length > 0 && (
                <p>
                  <span className="font-medium">Generated For:</span>{" "}
                  {result.allowedPlatforms.join(", ")}
                </p>
              )}

              {result.error && (
                <p className="text-red-600">
                  <span className="font-medium">Notice:</span> {result.error}
                </p>
              )}
            </div>
          </div>

          {hasGeneratedResults && (
            <>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDrafts}
                  disabled={isSaving}
                  className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Drafts"}
                </button>

                {saveMessage && (
                  <p className="text-sm text-gray-700">{saveMessage}</p>
                )}
              </div>

              <div className="space-y-5">
                {PLATFORM_OPTIONS.map((platform) => {
                  const output = result.results?.[platform];
                  if (!output) return null;

                  return (
                    <article
                      key={platform}
                      className="rounded border p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{platform}</h3>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Draft</p>
                        <div className="rounded bg-gray-50 border p-4">
                          <pre className="whitespace-pre-wrap text-sm font-sans">
                            {output.draft}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Hashtags</p>
                        <p className="text-sm text-gray-700">
                          {output.hashtags.length > 0
                            ? output.hashtags.join(", ")
                            : "none"}
                        </p>
                      </div>

                      {output.notes && (
                        <div>
                          <p className="text-sm font-medium mb-2">Notes</p>
                          <p className="text-sm text-gray-700">{output.notes}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}