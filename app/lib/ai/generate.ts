import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { buildSystemPrompt } from "./prompts";
import type {
  ContentSize,
  PlatformOutput,
  Platform,
  CompanyContext,
} from "./types";

function getWordBand(targetWords: number) {
  const target = Math.max(20, targetWords);
  return {
    min: Math.round(target * 0.95),  // -5%
    target,
    max: Math.round(target * 1.05),  // +5%
  };
}
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// function getWordRange(size: ContentSize, customWordCount?: number) {
//   if (size !== "custom") return sizeToRange[size];

//   const target = Math.max(20, customWordCount ?? 100);
//   return {
//     min: Math.max(15, Math.round(target * 0.9)),
//     target,
//     max: Math.round(target * 1.2),
//   };
// }

async function generateSinglePlatform(params: {
  update: string;
  platform: Platform;
  wordCount: number;
}): Promise<PlatformOutput> {
  const range = getWordBand(params.wordCount);

  const system = buildSystemPrompt(
    params.platform,
    undefined,           // or a structured companyContext if you add one later
    [],                  // brandVoiceTags, if you reintroduce tags in UI
    { targetWords: params.wordCount },
  );

  const approxTokens = Math.round(range.max * 1.3);

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    system,
    prompt: [
      params.update,  // the composed string with context, tone, requirement, audience, length
      `Target length: ${params.wordCount} words.`,
      `Return only the final content.`,
      `Stop writing as soon as you reach about ${params.wordCount} words.`,
    ].join("\n\n"),
    maxOutputTokens: Math.max(256, approxTokens),
  });

  const content = result.text.trim();
  const wordCount = countWords(content);

  // Expand if too short
  if (wordCount < range.min) {
    // expansion call similar to what you already have
  }

  // Trim if too long
  if (wordCount > range.max) {
    // trimming call similar to what we discussed
  }

  return {
    platform: params.platform,
    draft: content,
    wordCount,
    hashtags: [],
  };
}

export async function generatePlatformOutputs(params: {
  companyContext?: CompanyContext;
  update: string;
  platforms: Platform[];
  wordCount: number;
}): Promise<PlatformOutput[]> {
  return Promise.all(
    params.platforms.map((platform) =>
      generateSinglePlatform({
        update: params.update,
        platform,
        wordCount: params.wordCount,
      }),
    ),
  );
}