"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";

const PLATFORMS = ["LINKEDIN", "TWITTER", "INSTAGRAM", "NEWSLETTER"] as const;

const PLATFORM_COLORS: Record<string, string> = {
  LINKEDIN:   "text-sky-300",
  TWITTER:    "text-blue-300",
  INSTAGRAM:  "text-pink-300",
  NEWSLETTER: "text-amber-300",
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT:     "text-white/50 border-white/10",
  READY:     "text-emerald-300 border-emerald-300/30",
  PUBLISHED: "text-emerald-400 border-emerald-400/30",
  FAILED:    "text-red-400 border-red-400/30",
};

type Post = {
  id: string;
  platform: string;
  sourceUpdate: string;
  content: string;
  hashtags: string[];
  status: string;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export default function HistoryClient({
  initialPosts,
  pagination,
  activePlatform,
}: {
  initialPosts: Post[];
  pagination: { page: number; totalPages: number; total: number };
  activePlatform?: string;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied]     = useState<string | null>(null);

  function navigate(page: number, platform?: string) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (platform) params.set("platform", platform);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  async function copyContent(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">

      {/* ── Platform filter ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => navigate(1, undefined)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
            !activePlatform
              ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
          }`}
        >
          All
        </button>
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => navigate(1, p)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              activePlatform === p
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {p.charAt(0) + p.slice(1).toLowerCase()}
          </button>
        ))}
        <span className="ml-auto text-xs text-white/30">
          {pagination.total} generation{pagination.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Empty state ── */}
      {initialPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] py-24 text-center">
          <p className="text-base font-medium text-white">No generations yet</p>
          <p className="mt-2 text-sm text-white/40">
            Posts you generate from Compose will appear here automatically.
          </p>
          <a
            href="/compose"
            className="mt-6 rounded-2xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            Go to Compose
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {initialPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition hover:border-white/[0.12]"
            >
              {/* ── Card header ── */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`text-xs font-semibold ${PLATFORM_COLORS[post.platform] ?? "text-white"}`}>
                      {post.platform.charAt(0) + post.platform.slice(1).toLowerCase()}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${STATUS_STYLES[post.status] ?? "text-white/40 border-white/10"}`}>
                      {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-white/30">{timeAgo(post.createdAt)}</span>
                  </div>
                  {/* Source update preview */}
                  <p className="mt-2 line-clamp-1 text-sm text-white/60">
                    {post.sourceUpdate}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => copyContent(post.id, post.content)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      copied === post.id
                        ? "bg-emerald-400/15 text-emerald-400"
                        : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/70"
                    }`}
                  >
                    {copied === post.id
                      ? <><IoCheckmarkOutline size={13} /> Copied!</>
                      : <><IoCopyOutline size={13} /> Copy</>}
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                    className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/70"
                  >
                    {expanded === post.id ? "Collapse" : "View"}
                  </button>
                </div>
              </div>

              {/* ── Expanded content ── */}
              {expanded === post.id && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                      {post.content}
                    </p>
                  </div>
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-white/[0.06] pt-3">
                    <p className="text-xs text-white/30">Source update</p>
                    <p className="mt-1 text-sm text-white/50 whitespace-pre-wrap">
                      {post.sourceUpdate}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => navigate(pagination.page - 1, activePlatform)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-xs text-white/30">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => navigate(pagination.page + 1, activePlatform)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}