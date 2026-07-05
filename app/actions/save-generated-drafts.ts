"use server";

import { z } from "zod";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";


const DraftSchema = z.object({
  platform: z.enum(["TWITTER", "LINKEDIN", "INSTAGRAM", "NEWSLETTER"] as const),
  draft: z.string().min(1),
  hashtags: z.array(z.string()),
  notes: z.string().optional(),
});

const SaveGeneratedDraftsSchema = z.object({
  sourceUpdate: z.string().min(1),
  drafts: z.array(DraftSchema).min(1),
});

export type SaveGeneratedDraftsInput = z.infer<typeof SaveGeneratedDraftsSchema>;

export interface SaveGeneratedDraftsResult {
  success: boolean;
  error?: string;
  savedCount?: number;
}

export async function saveGeneratedDrafts(
  input: SaveGeneratedDraftsInput
): Promise<SaveGeneratedDraftsResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized." };
    }
   const userId = session.user.id;
    const parsed = SaveGeneratedDraftsSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      };
    }

    const { sourceUpdate, drafts } = parsed.data;

    await prisma.contentDraft.createMany({
      data: drafts.map((item) => ({
        userId: userId,
        platform: item.platform,
        sourceUpdate,
        draft: item.draft,
        hashtags: item.hashtags,
        notes: item.notes ?? null,
        status: "DRAFT",
      })),
    });

    return {
      success: true,
      savedCount: drafts.length,
    };
  } catch (error) {
    console.error("[saveGeneratedDrafts] Error:", error);
    return {
      success: false,
      error: "Failed to save generated drafts.",
    };
  }
}