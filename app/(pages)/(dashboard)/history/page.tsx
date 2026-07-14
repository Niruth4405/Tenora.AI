import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import AppShell from "../../../components/layout/app-shell";
import HistoryClient from "../../../components/history-client";
import { SocialPlatform } from "@prisma/client";   // ✅ new import

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; platform?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const platform = params.platform;
  const limit = 20;
  const skip = (page - 1) * limit;

  // ✅ Validate query param is a real SocialPlatform before passing to Prisma
  const validPlatforms = Object.values(SocialPlatform) as string[];
  const platformFilter: SocialPlatform | undefined =
    platform && validPlatforms.includes(platform)
      ? (platform as SocialPlatform)
      : undefined;

  const where = {
    userId: session.user.id,
    ...(platformFilter ? { platform: platformFilter } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.generatedPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        platform: true,
        sourceUpdate: true,
        content: true,
        hashtags: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.generatedPost.count({ where }),
  ]);

  // Serialize dates — Server → Client boundary requires plain objects
  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <AppShell
      title="History"
      subtitle="Every post you've generated — browse, filter, and revisit past content."
    >
      <HistoryClient
        initialPosts={serialized}
        pagination={{ page, totalPages: Math.ceil(total / limit), total }}
        activePlatform={platform}
      />
    </AppShell>
  );
}