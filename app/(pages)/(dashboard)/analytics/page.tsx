import Link from "next/link";
import AppShell from "../../../components/layout/app-shell";

const STATS = [
  { label: "Total Generated", value: "128", change: "+12.4%" },
  { label: "Posts Published", value: "46", change: "+8.1%" },
  { label: "Best Platform", value: "LinkedIn", change: "34% of reach" },
  { label: "Credits Remaining", value: "184", change: "Current cycle" },
];

const POSTS = [
  {
    platform: "LinkedIn",
    title: "Dark mode launch update",
    status: "Published",
    date: "Today",
    metric: "1.8k impressions",
  },
  {
    platform: "Twitter",
    title: "Feature thread for onboarding improvements",
    status: "Draft",
    date: "Yesterday",
    metric: "Ready to post",
  },
  {
    platform: "Newsletter",
    title: "Weekly product improvements roundup",
    status: "Published",
    date: "2 days ago",
    metric: "42% open rate",
  },
  {
    platform: "Instagram",
    title: "Behind-the-scenes shipping update",
    status: "Draft",
    date: "3 days ago",
    metric: "Needs review",
  },
];

const PLATFORM_ROWS = [
  { platform: "LinkedIn", posts: 34, engagement: "6.2%", color: "bg-violet-400" },
  { platform: "Twitter", posts: 41, engagement: "4.8%", color: "bg-sky-400" },
  { platform: "Instagram", posts: 19, engagement: "5.4%", color: "bg-pink-400" },
  { platform: "Newsletter", posts: 12, engagement: "42% open", color: "bg-amber-400" },
];

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Track generated content, monitor performance, and move quickly from insight to creation."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-sm text-emerald-300">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Performance Overview</h2>
                <p className="mt-2 text-sm text-white/55">
                  Weekly activity across your generated and published content.
                </p>
              </div>

              <Link
                href="/compose"
                className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                New post
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11161c] p-5">
              <div className="flex h-64 items-end gap-4">
                {[42, 68, 54, 82, 60, 95, 72].map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full rounded-t-2xl bg-emerald-400/80"
                      style={{ height: `${height * 2}px` }}
                    />
                    <span className="text-xs text-white/40">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Recent Posts</h2>
              <p className="mt-2 text-sm text-white/55">
                The latest generated and published content from your workflow.
              </p>
            </div>

            <div className="space-y-3">
              {POSTS.map((post) => (
                <div
                  key={post.title}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#11161c] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm text-emerald-300">{post.platform}</p>
                    <h3 className="mt-1 text-base font-medium text-white">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/45">{post.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                      {post.status}
                    </span>
                    <span className="text-sm text-white/55">{post.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">Platform Mix</h2>
            <p className="mt-2 text-sm text-white/55">
              See which channels are driving most of your content activity.
            </p>

            <div className="mt-6 space-y-4">
              {PLATFORM_ROWS.map((row) => (
                <div key={row.platform}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/75">{row.platform}</span>
                    <span className="text-white/45">
                      {row.posts} posts · {row.engagement}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5">
                    <div
                      className={`h-3 rounded-full ${row.color}`}
                      style={{ width: `${Math.min(row.posts * 2, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <div className="mt-5 grid gap-3">
              <Link
                href="/compose"
                className="rounded-2xl bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Create new content
              </Link>
              <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:bg-white/5 hover:text-white">
                Export analytics
              </button>
              <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:bg-white/5 hover:text-white">
                View posting queue
              </button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}