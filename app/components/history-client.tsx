"use client";

import { useState } from "react";
import { useRouter,usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const PLATFORMS = ["LINKEDIN", "TWITTER", "INSTAGRAM", "NEWSLETTER"] as const;

const PLATFORM_COLORS: Record<string, string> = {
  LINKEDIN: "text-sky-300",
  TWITTER: "text-blue-300",
  INSTAGRAM: "text-pink-300",
  NEWSLETTER: "text-amber-300",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-white/50 border-white/10",
  READY: "text-emerald-300 border-emerald-300/30",
  PUBLISHED: "text-emerald-400 border-emerald-400/30",
  FAILED: "text-red-400 border-red-400/30",
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

export default function HistoryClient({
  initialPosts,
  pagination,
  activePlatform,
}: {
  initialPosts: Post[];
  pagination: { page: number; totalPages: number; total: number };
  activePlatform?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function navigate(page: number, platform?: string) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (platform) params.set("platform", platform);
    router.push(`${pathname}?${params.toString()}`);
  }

  async function copyContent(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Platform filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(1, undefined)}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !activePlatform
              ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/75"
          }`}
        >
          All
        </button>
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => navigate(1, p)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activePlatform === p
                ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/75"
            }`}
          >
            {p.charAt(0) + p.slice(1).toLowerCase()}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-white/40">
          {pagination.total} generation{pagination.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Posts list */}
      {initialPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] py-24 text-center">
          <p className="text-lg font-medium text-white">No generations yet</p>
          <p className="mt-2 text-sm text-white/50">
            Posts you generate will appear here.
          </p>
          <a
            href="/compose"
            className="mt-6 rounded-2xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            Generate your first post
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {initialPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-sm font-medium ${PLATFORM_COLORS[post.platform] ?? "text-white"}`}>
                      {post.platform.charAt(0) + post.platform.slice(1).toLowerCase()}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${STATUS_COLORS[post.status] ?? "text-white/50 border-white/10"}`}>
                      {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-white/40">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-white/75">
                    {post.sourceUpdate}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => copyContent(post.id, post.content)}
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
                  >
                    {copied === post.id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
                  >
                    {expanded === post.id ? "Collapse" : "View"}
                  </button>
                </div>
              </div>

              {expanded === post.id && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#11161c] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                    {post.content}
                  </p>
                  {post.hashtags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-xs text-emerald-400/70">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => navigate(pagination.page - 1, activePlatform)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-sm text-white/40">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => navigate(pagination.page + 1, activePlatform)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}