"use server";

import { z } from "zod";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";
import { generatePlatformOutputs } from "@/app/lib/ai/generate";
import type { PlatformOutput, Platform } from "@/app/lib/ai/types";
import { toCompanyContext } from "@/app/lib/ai/context";
import { SocialPlatform, DraftStatus } from "@prisma/client";  // ← ADD THIS

const GenerateDraftsSchema = z.object({
  update: z.string().min(8, "Please enter a more descriptive update."),
  selectedPlatforms: z
    .array(z.enum(["TWITTER", "LINKEDIN", "INSTAGRAM", "NEWSLETTER"] as const))
    .min(1, "Select at least one platform."),
});

export type GenerateDraftsInput = z.infer<typeof GenerateDraftsSchema>;
export type ContentOutput = PlatformOutput;

export interface GenerateDraftsResult {
  success: boolean;
  status: "SUCCESS" | "PARTIAL_SUCCESS" | "ERROR";
  allowedPlatforms?: Platform[];
  results?: Partial<Record<Platform, ContentOutput>>;
  error?: string;
}

export async function generateDrafts(
  input: GenerateDraftsInput
): Promise<GenerateDraftsResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, status: "ERROR", error: "Unauthorized." };
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

    const companyContextRecord = await prisma.companyContext.findUnique({
      where: { userId: session.user.id },
    });

    const context = toCompanyContext(companyContextRecord);

    const outputs = await generatePlatformOutputs({
      rawUpdate: update,
      platforms: selectedPlatforms as Platform[],
      companyContext: context ?? undefined,
    });

    const results: Partial<Record<Platform, ContentOutput>> = {};
    for (const output of outputs) {
      results[output.platform] = output;
    }

    const allowedPlatforms = outputs.map((o) => o.platform);

    // ── AUTO-SAVE TO GeneratedPost ─────────────────────────────────────────
    // Every generation is persisted immediately so /history always has a log.
    if (outputs.length > 0) {
      await prisma.generatedPost.createMany({
        data: outputs.map((output) => ({
          userId: session.user.id,
          platform: output.platform as SocialPlatform,
          sourceUpdate: update,
          content: Array.isArray(output.draft)
            ? output.draft.join("\n")
            : (output.draft ?? ""),
          hashtags: output.hashtags ?? [],
          voiceTags: [],
          status: DraftStatus.DRAFT,
        })),
      });
    }
    // ──────────────────────────────────────────────────────────────────────

    return {
      success: true,
      status:
        allowedPlatforms.length < selectedPlatforms.length
          ? "PARTIAL_SUCCESS"
          : "SUCCESS",
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