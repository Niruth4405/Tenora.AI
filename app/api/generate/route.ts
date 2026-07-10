import { NextResponse } from "next/server";

import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

import { generatePlatformOutputs } from "../../lib/ai/generate";

import type {
  GenerateInput,
  Platform,
} from "../../lib/ai/types";

import {
  PlanTier,
  SubscriptionStatus,
  DraftStatus,
  SocialPlatform,
} from "@prisma/client";

const VALID_PLATFORMS: Platform[] = [
  "LINKEDIN",
  "TWITTER",
  "INSTAGRAM",
  "NEWSLETTER",
];

const PLATFORM_MAP: Record<
  Platform,
  SocialPlatform
> = {
  LINKEDIN: SocialPlatform.LINKEDIN,

  TWITTER: SocialPlatform.TWITTER,

  INSTAGRAM: SocialPlatform.INSTAGRAM,

  NEWSLETTER: SocialPlatform.NEWSLETTER,
};

const DEFAULT_CREDITS: Record<
  PlanTier,
  number
> = {
  BASIC: 50,

  PREMIUM: 500,

  ENTERPRISE: 999999,
};

const CREDIT_COST_PER_OUTPUT = 1;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body =
      (await req.json()) as GenerateInput;

    if (!body.rawUpdate?.trim()) {
      return NextResponse.json(
        { error: "Raw update is required" },
        { status: 400 },
      );
    }

    const platforms = (
      body.platforms || []
    ).filter((platform) =>
      VALID_PLATFORMS.includes(platform),
    );

    if (!platforms.length) {
      return NextResponse.json(
        {
          error:
            "At least one platform must be selected",
        },
        { status: 400 },
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },

        select: {
          id: true,

          subscription: {
            select: {
              id: true,

              tier: true,

              creditsRemaining: true,

              status: true,
            },
          },
        },
      });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const tier =
      user.subscription?.tier ??
      PlanTier.BASIC;

    const creditsRemaining =
      user.subscription
        ?.creditsRemaining ??
      DEFAULT_CREDITS[tier];

    const creditsToUse =
      platforms.length *
      CREDIT_COST_PER_OUTPUT;

    if (
      tier !== PlanTier.ENTERPRISE &&
      user.subscription?.status !==
        SubscriptionStatus.TRIALING &&
      creditsRemaining < creditsToUse
    ) {
      return NextResponse.json(
        {
          error: "Not enough credits",

          creditsRemaining,
        },
        { status: 402 },
      );
    }

   const outputs = await generatePlatformOutputs({
  update: body.rawUpdate,
  platforms,
  wordCount: body.customWordCount ?? 150,
  // optionally:
  companyContext: undefined, // or build from body.context/body.brandVoiceTags
});

    const result =
      await prisma.$transaction(
        async (tx) => {
          let newCreditsRemaining =
            creditsRemaining;

          if (
            user.subscription?.id &&
            tier !== PlanTier.ENTERPRISE
          ) {
            const updatedSubscription =
              await tx.subscription.update({
                where: {
                  id: user.subscription.id,
                },

                data: {
                  creditsRemaining: {
                    increment: -creditsToUse,
                  },

                  creditsUsedThisMonth: {
                    increment: creditsToUse,
                  },
                },

                select: {
                  creditsRemaining: true,
                },
              });

            newCreditsRemaining =
              updatedSubscription.creditsRemaining;
          }

          if (outputs.length > 0) {
            await tx.generatedPost.createMany({
              data: outputs.map((output) => ({
                userId: user.id,

                platform:
                  PLATFORM_MAP[
                    output.platform
                  ],

                sourceUpdate:
                  body.rawUpdate,

                context:
                  body.context ?? "",

                content:
                  Array.isArray(
                    output.draft,
                  )
                    ? output.draft.join(
                        "\n",
                      )
                    : output.draft,

                voiceTags:
                  body.brandVoiceTags ??
                  [],

                hashtags: [],

                customWordCount:
                  undefined,

                status:
                  DraftStatus.DRAFT,
              })),
            });
          }

          return {
            creditsRemaining:
              newCreditsRemaining,
          };
        },
      );

    return NextResponse.json({
      outputs,

      creditsRemaining:
        result.creditsRemaining,
    });
  } catch (error) {
    console.error(
      "[GENERATE_ROUTE_ERROR]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate outputs",
      },
      { status: 500 },
    );
  }
}