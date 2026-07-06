import type { CompanyContext } from "./prompts";

export interface StoredCompanyContext {
  brandName: string;
  audience: string;
  brandVoiceSamples: string[];
  productsOrServices?: string | null;
  tone?: string | null;
}

export function toCompanyContext(
  stored: StoredCompanyContext | null | undefined
): CompanyContext | undefined {
  if (!stored) return undefined;

  const brandName = stored.brandName?.trim();
  const audience = stored.audience?.trim();
  const brandVoiceSamples = Array.isArray(stored.brandVoiceSamples)
    ? stored.brandVoiceSamples
        .map((sample) => sample.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];

  if (!brandName || !audience) return undefined;

  return {
    audience,
    brandVoiceSamples,
    productsOrServices: stored.productsOrServices?.trim() || undefined,
    tone: stored.tone?.trim() || undefined,
  };
}