import { NextResponse } from "next/server";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import { PlanTier, SubscriptionStatus } from "@prisma/client";

const DEFAULT_CREDITS: Record<PlanTier, number> = {
  BASIC: 50,
  PREMIUM: 500,
  ENTERPRISE: 999999,
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        subscription: {
          select: {
            tier: true,
            creditsRemaining: true,
            status: true,
            creditsResetAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const plan = user.subscription?.tier ?? PlanTier.BASIC;
    const creditsRemaining =
      user.subscription?.creditsRemaining ?? DEFAULT_CREDITS[plan];

    return NextResponse.json({
      plan,
      creditsRemaining,
      status: user.subscription?.status ?? SubscriptionStatus.ACTIVE,
      creditsResetAt: user.subscription?.creditsResetAt ?? null,
    });
  } catch (error) {
    console.error("Subscription route error:", error);

    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}