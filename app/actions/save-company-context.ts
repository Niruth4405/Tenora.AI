"use server";

import { z } from "zod";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";

const SaveCompanyContextSchema = z.object({
  brandName: z.string().min(2, "Brand name is required."),
  audience: z.string().min(5, "Audience is required."),
  brandVoiceSamples: z
    .array(z.string().trim().min(1))
    .min(1, "At least one brand voice sample is required.")
    .max(5, "Maximum 5 brand voice samples allowed."),
  productsOrServices: z.string().optional().or(z.literal("")),
  tone: z.string().optional().or(z.literal("")),
});

export type SaveCompanyContextInput = z.infer<typeof SaveCompanyContextSchema>;

export interface SaveCompanyContextResult {
  success: boolean;
  error?: string;
}

export async function saveCompanyContext(
  input: SaveCompanyContextInput
): Promise<SaveCompanyContextResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized." };
    }

    const parsed = SaveCompanyContextSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      };
    }

    const data = parsed.data;

    await prisma.companyContext.upsert({
      where: { userId: session.user.id },
      update: {
        brandName: data.brandName.trim(),
        audience: data.audience.trim(),
        brandVoiceSamples: data.brandVoiceSamples.map((s) => s.trim()),
        productsOrServices: data.productsOrServices?.trim() || null,
        tone: data.tone?.trim() || null,
      },
      create: {
        userId: session.user.id,
        brandName: data.brandName.trim(),
        audience: data.audience.trim(),
        brandVoiceSamples: data.brandVoiceSamples.map((s) => s.trim()),
        productsOrServices: data.productsOrServices?.trim() || null,
        tone: data.tone?.trim() || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[saveCompanyContext] Error:", error);
    return {
      success: false,
      error: "Failed to save company context.",
    };
  }
}