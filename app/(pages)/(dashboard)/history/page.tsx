import AppShell from "../../../components/layout/app-shell";
import HistoryClient from "./../../../components/history-client";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; platform?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const platform = params.platform;
  const limit = 20;
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) redirect("/login");

  const where = {
    userId: user.id,
    ...(platform ? { platform: platform as any } : {}),
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

  return (
    <AppShell
      title="History"
      subtitle="Every post you've generated — browse, filter, and revisit past content."
    >
      <HistoryClient
        initialPosts={posts}
        pagination={{ page, totalPages: Math.ceil(total / limit), total }}
        activePlatform={platform}
      />
    </AppShell>
  );
}