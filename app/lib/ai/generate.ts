import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { buildSystemPrompt, CompanyContext, Platform } from "./prompts";
import { checkEntitlement, Tier } from "./entitlement";

export type { Platform, CompanyContext, Tier };

export interface ContentOutput {
  draft: string;
  hashtags: string[];
  notes?: string;
}

export interface GenerateContentInput {
  update: string;
  platform: Platform;
  context?: CompanyContext;
}

export interface MultiGenerateInput {
  update: string;
  platforms: Platform[];
  context?: CompanyContext;
  tier: Tier;
  creditsRemaining: number;
}

export interface MultiGenerateOutput {
  success: boolean;
  results?: Partial<Record<Platform, ContentOutput>>;
  error?: string;
  creditsUsed?: number;
}

function validateUpdate(update: string): string | null {
  const normalized = update.trim();

  if (!normalized) {
    return "Please enter an update before generating content.";
  }

  if (normalized.length < 8) {
    return "Your update is too short. Please add a bit more context.";
  }

  return null;
}

function normalizeHashtags(hashtags: unknown): string[] {
  if (!Array.isArray(hashtags)) return [];

  return hashtags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim().replace(/^#+/, ""))
    .filter(Boolean)
    .slice(0, 8);
}

function safeParseJSON(raw: string): ContentOutput {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);

    return {
      draft:
        typeof parsed?.draft === "string" && parsed.draft.trim()
          ? parsed.draft.trim()
          : cleaned,
      hashtags: normalizeHashtags(parsed?.hashtags),
      notes:
        typeof parsed?.notes === "string" && parsed.notes.trim()
          ? parsed.notes.trim()
          : undefined,
    };
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return {
        draft: cleaned,
        hashtags: [],
        notes: undefined,
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        draft:
          typeof parsed?.draft === "string" && parsed.draft.trim()
            ? parsed.draft.trim()
            : cleaned,
        hashtags: normalizeHashtags(parsed?.hashtags),
        notes:
          typeof parsed?.notes === "string" && parsed.notes.trim()
            ? parsed.notes.trim()
            : undefined,
      };
    } catch {
      return {
        draft: cleaned,
        hashtags: [],
        notes: undefined,
      };
    }
  }
}

export async function generateContent(
  input: GenerateContentInput
): Promise<ContentOutput> {
  const { update, platform, context } = input;

  const validationError = validateUpdate(update);
  if (validationError) {
    throw new Error(validationError);
  }

  const systemPrompt = buildSystemPrompt(platform, context);

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    prompt: `Generate ${platform} content for the following company update:\n\n${update.trim()}`,
  });

  return safeParseJSON(text);
}

export async function generateMultiPlatformContent(
  input: MultiGenerateInput
): Promise<MultiGenerateOutput> {
  const { update, platforms, context, tier, creditsRemaining } = input;

  const validationError = validateUpdate(update);
  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  const entitlement = checkEntitlement(tier, platforms, creditsRemaining);

  if (!entitlement.allowed) {
    return {
      success: false,
      error: entitlement.reason,
    };
  }

  try {
    const settled = await Promise.allSettled(
      entitlement.allowedPlatforms.map(async (platform) => {
        const content = await generateContent({ update, platform, context });
        return { platform, content };
      })
    );

    const results: Partial<Record<Platform, ContentOutput>> = {};
    const errors: string[] = [];

    for (const outcome of settled) {
      if (outcome.status === "fulfilled") {
        results[outcome.value.platform] = outcome.value.content;
      } else {
        errors.push(outcome.reason?.message ?? "Unknown error");
      }
    }

    const successCount = Object.keys(results).length;

    if (successCount === 0) {
      return {
        success: false,
        error: errors[0] ?? "Generation failed. Please try again.",
      };
    }

    const warningMessages = [
      entitlement.reason,
      errors.length > 0
        ? `Some platforms failed: ${errors.join("; ")}`
        : undefined,
    ].filter(Boolean);

    return {
      success: true,
      results,
      creditsUsed: tier === "ENTERPRISE" ? 0 : successCount,
      ...(warningMessages.length > 0
        ? { error: warningMessages.join(" ") }
        : {}),
    };
  } catch (err) {
    console.error("[generateMultiPlatformContent] Fatal error:", err);

    return {
      success: false,
      error: "Generation failed. Please try again.",
    };
  }
}