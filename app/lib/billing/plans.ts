import { PlanTier } from "@prisma/client";

export const PLAN_CONFIG = {
  BASIC: {
    name: "Basic",
    credits: 0,
    maxPlatformsPerGeneration: 1,
    sizes: ["SMALL", "MEDIUM", "LARGE", "CUSTOM"],
    canUseCustomSize: false,
    canDirectPost: false,
  },
  PREMIUM: {
    name: "Premium",
    credits: 150,
    maxPlatformsPerGeneration: 4,
    sizes: ["SMALL", "MEDIUM", "LARGE", "CUSTOM"],
    canUseCustomSize: true,
    canDirectPost: true,
  },
  ENTERPRISE: {
    name: "Enterprise",
    credits: 999999,
    maxPlatformsPerGeneration: 10,
    sizes: ["SMALL", "MEDIUM", "LARGE", "CUSTOM"],
    canUseCustomSize: true,
    canDirectPost: true,
  },
} as const satisfies Record<PlanTier, {
  name: string;
  credits: number;
  maxPlatformsPerGeneration: number;
  sizes: string[];
  canUseCustomSize: boolean;
  canDirectPost: boolean;
}>;