export type Platform =
  | "TWITTER"
  | "LINKEDIN"
  | "INSTAGRAM"
  | "NEWSLETTER";

export type ContentSize =
  | "small"
  | "medium"
  | "large"
  | "custom";
export type Tier = "STARTER" | "PREMIUM" | "ENTERPRISE";
export interface CompanyContext {
  brandName?: string;
  audience?: string;
  productsOrServices?: string;
  tone?: string;
  brandVoiceSamples?: string[];
}

export interface GenerateInput {
  rawUpdate: string;
  context?: string;
  brandVoiceTags?: string[];
  platforms?: Platform[];
  size?: ContentSize;
  customWordCount?: number;
}

export interface PlatformOutput {
  platform: Platform ;

  draft: string | string[];

  hashtags?: string[];

  notes?: string;

  wordCount?: number;
}

export interface GenerateResponse {
  outputs: PlatformOutput[];

  creditsRemaining: number;
}