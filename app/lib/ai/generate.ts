import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { buildSystemPrompt } from "./prompts";
import type {
  ContentSize,
  PlatformOutput,
  Platform,
  CompanyContext,
} from "./types";

const sizeToRange: Record<
  ContentSize,
  { min: number; target: number; max: number }
> = {
  small: { min: 30, target: 40, max: 55 },
  medium: { min: 60, target: 75, max: 95 },
  large: { min: 120, target: 150, max: 180 },
  custom: { min: 1, target: 1, max: 1 },
};

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getWordRange(size: ContentSize, customWordCount?: number) {
  if (size !== "custom") return sizeToRange[size];

  const target = Math.max(20, customWordCount ?? 100);
  return {
    min: Math.max(15, Math.round(target * 0.9)),
    target,
    max: Math.round(target * 1.2),
  };
}

async function generateSinglePlatform(params: {
  update: string;
  context?: string;
  platform: Platform;
  companyContext?: CompanyContext;
  brandVoiceTags?: string[];
  size?: ContentSize;
  customWordCount?: number;
}): Promise<PlatformOutput> {
  const range = getWordRange(params.size ?? "medium", params.customWordCount);

  const system = buildSystemPrompt(
    params.platform,
    params.companyContext,
    params.brandVoiceTags ?? [],
    {
      minWords: range.min,
      targetWords: range.target,
      maxWords: range.max,
    }
  );

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    system,
    prompt: [
      `Source update: ${params.update}`,
      params.context
        ? `Product / audience context: ${params.context}`
        : "",
      `Write for ${params.platform}.`,
      `Target length: ${range.min}-${range.max} words. Aim for about ${range.target} words.`,
      `Return only the final content.`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    maxOutputTokens: Math.max(256, range.max * 4),
  });

  let content = result.text.trim();
  let wordCount = countWords(content);

  if (wordCount < range.min) {
    try {
      const expanded = await generateText({
        model: groq("llama-3.1-8b-instant"),
        system,
        prompt: [
          `Expand the draft below to ${range.min}-${range.max} words without changing the meaning.`,
          `Keep the same platform voice and make it natural.`,
          `Draft:\n${content}`,
        ].join("\n\n"),
        maxOutputTokens: Math.max(256, range.max * 4),
      });

      content = expanded.text.trim();
      wordCount = countWords(content);
    } catch (error) {
      console.error(`Expansion failed for ${params.platform}:`, error);
    }
  }

  return {
    platform: params.platform,
    draft:content,
    wordCount,
    hashtags: [],
  };
}

export async function generatePlatformOutputs(params: {
  rawUpdate: string;
  context?: string;
  brandVoiceTags?: string[];
  platforms: Platform[];
  size?: ContentSize;
  customWordCount?: number;
  companyContext?: CompanyContext;
}): Promise<PlatformOutput[]> {
  return Promise.all(
    params.platforms.map((platform) =>
      generateSinglePlatform({
        update: params.rawUpdate,
        context: params.context,
        platform,
        companyContext: params.companyContext,
        brandVoiceTags: params.brandVoiceTags,
        size: params.size,
        customWordCount: params.customWordCount,
      })
    )
  );
}