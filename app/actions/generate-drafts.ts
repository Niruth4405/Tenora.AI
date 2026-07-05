"use server";

import { z } from "zod";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";
import { generatePlatformOutputs } from "@/app/lib/ai/generate";
import type { PlatformOutput, Platform } from "@/app/lib/ai/types";
import { toCompanyContext } from "@/app/lib/ai/context";

const GenerateDraftsSchema = z.object({
  update: z.string().min(8, "Please enter a more descriptive update."),
  selectedPlatforms: z
    .array(z.enum(["TWITTER", "LINKEDIN", "INSTAGRAM", "NEWSLETTER"] as const))
    .min(1, "Select at least one platform."),
});

export type GenerateDraftsInput = z.infer<typeof GenerateDraftsSchema>;
export type Tier = "STARTER" | "PREMIUM" | "ENTERPRISE";
export type ContentOutput = PlatformOutput;

export interface GenerateDraftsResult {
  success: boolean;
  status: "SUCCESS" | "PARTIAL_SUCCESS" | "BLOCKED" | "ERROR";
  tier?: Tier;
  creditsBefore?: number;
  creditsUsed?: number;
  creditsAfter?: number;
  allowedPlatforms?: Platform[];
  results?: Partial<Record<Platform, ContentOutput>>;
  error?: string;
}

function normalizeTier(rawTier: string | null | undefined): Tier {
  if (rawTier === "ENTERPRISE") return "ENTERPRISE";
  if (rawTier === "PREMIUM") return "PREMIUM";
  return "STARTER";
}

export async function generateDrafts(
  input: GenerateDraftsInput
): Promise<GenerateDraftsResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        status: "ERROR",
        error: "Unauthorized.",
      };
    }

    const parsed = GenerateDraftsSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: "ERROR",
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      };
    }

    const { update, selectedPlatforms } = parsed.data;

    const [companyContextRecord, subscription] = await Promise.all([
      prisma.companyContext.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.subscription.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    const context = toCompanyContext(companyContextRecord);

    // if (!context) {
    //   return {
    //     success: false,
    //     status: "ERROR",
    //     error: "Company context is missing. Please save your brand details first.",
    //   };
    // }

    const tier = normalizeTier(subscription?.tier);
    const creditsBefore =
      tier === "ENTERPRISE" ? Infinity : (subscription?.creditsRemaining ?? 0);

    if (tier !== "ENTERPRISE" && creditsBefore < selectedPlatforms.length) {
      return {
        success: false,
        status: "BLOCKED",
        tier,
        creditsBefore,
        creditsUsed: 0,
        creditsAfter: creditsBefore,
        allowedPlatforms: [],
        error: "Not enough credits to generate drafts for the selected platforms.",
      };
    }

    const outputs = await generatePlatformOutputs({
      rawUpdate: update,
      platforms: selectedPlatforms as Platform[],
      companyContext: context ?? undefined,
    });

    const results: Partial<Record<Platform, ContentOutput>> = {};
    for (const output of outputs) {
      results[output.platform] = output;
    }

    const creditsUsed = tier === "ENTERPRISE" ? 0 : outputs.length;
    const allowedPlatforms = outputs.map((o) => o.platform);

    let creditsAfter = creditsBefore;
    if (tier !== "ENTERPRISE" && Number.isFinite(creditsBefore)) {
      creditsAfter = Math.max(0, creditsBefore - creditsUsed);

      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: { creditsRemaining: creditsAfter },
      });
    }

    return {
      success: true,
      status:
        allowedPlatforms.length < selectedPlatforms.length
          ? "PARTIAL_SUCCESS"
          : "SUCCESS",
      tier,
      creditsBefore,
      creditsUsed,
      creditsAfter,
      allowedPlatforms,
      results,
    };
  } catch (error) {
    console.error("[generateDrafts] Error:", error);

    return {
      success: false,
      status: "ERROR",
      error: "Failed to generate drafts. Please try again.",
    };
  }
}