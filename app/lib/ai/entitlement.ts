import type { Platform } from "./types";

export type Tier = "STARTER" | "PREMIUM" | "ENTERPRISE";

export interface EntitlementResult {
  allowed: boolean;
  reason?: string;
  allowedPlatforms: Platform[];
}

export function checkEntitlement(
  tier: Tier,
  requestedPlatforms: Platform[],
  creditsRemaining: number
): EntitlementResult {
  const uniquePlatforms = Array.from(new Set(requestedPlatforms));

  if (uniquePlatforms.length === 0) {
    return {
      allowed: false,
      reason: "Please select at least one platform.",
      allowedPlatforms: [],
    };
  }

  if (tier === "ENTERPRISE") {
    return {
      allowed: true,
      allowedPlatforms: uniquePlatforms,
    };
  }

  if (creditsRemaining <= 0) {
    return {
      allowed: false,
      reason: "You have no credits remaining. Please upgrade your plan.",
      allowedPlatforms: [],
    };
  }

  if (tier === "STARTER") {
    if (uniquePlatforms.length > 1) {
      return {
        allowed: false,
        reason:
          "Your plan supports generating for one platform at a time. Upgrade to Premium to generate across multiple platforms simultaneously.",
        allowedPlatforms: [],
      };
    }

    return {
      allowed: true,
      allowedPlatforms: uniquePlatforms,
    };
  }

  if (tier === "PREMIUM") {
    const affordablePlatforms = uniquePlatforms.slice(0, creditsRemaining);

    if (affordablePlatforms.length === 0) {
      return {
        allowed: false,
        reason: "You have no credits remaining. Please upgrade your plan.",
        allowedPlatforms: [],
      };
    }

    if (affordablePlatforms.length < uniquePlatforms.length) {
      return {
        allowed: true,
        allowedPlatforms: affordablePlatforms,
        reason: `Only ${creditsRemaining} credit(s) remaining. Generating for ${affordablePlatforms.length} platform(s) only.`,
      };
    }

    return {
      allowed: true,
      allowedPlatforms: uniquePlatforms,
    };
  }

  return {
    allowed: false,
    reason: "Unknown subscription tier.",
    allowedPlatforms: [],
  };
}