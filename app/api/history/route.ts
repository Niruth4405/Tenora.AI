import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const platform = searchParams.get("platform") ?? undefined;
  const limit = 20;
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

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

  return NextResponse.json({
    posts,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  });
}