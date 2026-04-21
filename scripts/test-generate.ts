import { generateMultiPlatformContent } from "../app/lib/ai/generate";
import type { Platform, CompanyContext, Tier } from "../app/lib/ai/generate";

const UPDATE = `We just shipped dark mode for Tenora.AI.
It took 3 weeks, two refactors, and way too many late nights.
Available now for all users — no settings change needed, it follows your system preference automatically.`;

const CONTEXT: CompanyContext = {
  brandName: "Tenora.AI",
  audience:
    "Solo founders, small startups, and lean teams who want consistent multi-platform content without a content team",
  productsOrServices:
    "AI-powered content operations platform that turns company updates into ready-to-publish content for LinkedIn, X, Instagram, and email",
  tone: "Direct, honest, no fluff",
  brandVoiceSamples: [
    "shipped dark mode. took longer than expected. worth it.",
    "we don't promise virality. we promise you'll actually show up consistently.",
    "content ops shouldn't require a content team. that's the whole point.",
  ],
};

const ALL_PLATFORMS: Platform[] = [
  "TWITTER",
  "LINKEDIN",
  "INSTAGRAM",
  "NEWSLETTER",
];

async function pause(ms = 2500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testTier(
  label: string,
  tier: Tier,
  platforms: Platform[],
  creditsRemaining: number
) {
  console.log(`\n${"█".repeat(70)}`);
  console.log(
    `TIER: ${label} | Credits: ${
      creditsRemaining === Infinity ? "Unlimited" : creditsRemaining
    } | Platforms: ${platforms.join(", ")}`
  );
  console.log(`${"█".repeat(70)}`);

  const result = await generateMultiPlatformContent({
    update: UPDATE,
    platforms,
    context: CONTEXT,
    tier,
    creditsRemaining,
  });

  if (!result.success) {
    console.log(`\n🚫 Blocked/Error: ${result.error}`);
    return;
  }

  if (result.error) {
    console.log(`\n⚠️ Warning: ${result.error}`);
  }

  console.log(`\n✅ Credits Used: ${result.creditsUsed ?? 0}`);

  for (const platform of platforms) {
    const output = result.results?.[platform];
    if (!output) continue;

    console.log(`\n${"─".repeat(56)}`);
    console.log(`Platform: ${platform}`);
    console.log(`${"─".repeat(56)}`);
    console.log("\n📝 Draft:\n");
    console.log(output.draft.replace(/\\n/g, "\n"));
    console.log("\n#️⃣ Hashtags:", output.hashtags.join(", ") || "none");
    if (output.notes) {
      console.log("\n💡 Notes:", output.notes);
    }
  }
}

async function run() {
  console.log("\n🚀 Tenora.AI — Multi-Platform Tier Stress Test");
  console.log(`Update: "${UPDATE.trim().slice(0, 100)}..."`);

  await testTier("STARTER — 1 platform, 10 credits", "STARTER", ["TWITTER"], 10);
  await pause();

  await testTier(
    "STARTER — tries 2 platforms (should block)",
    "STARTER",
    ["TWITTER", "LINKEDIN"],
    10
  );
  await pause();

  await testTier(
    "STARTER — 0 credits (should block)",
    "STARTER",
    ["TWITTER"],
    0
  );
  await pause();

  await testTier(
    "PREMIUM — all 4 platforms, 10 credits",
    "PREMIUM",
    ALL_PLATFORMS,
    10
  );
  await pause();

  await testTier(
    "PREMIUM — 4 platforms requested, only 2 credits",
    "PREMIUM",
    ALL_PLATFORMS,
    2
  );
  await pause();

  await testTier(
    "ENTERPRISE — all 4 platforms, unlimited",
    "ENTERPRISE",
    ALL_PLATFORMS,
    Infinity
  );
}

run().catch((err) => {
  console.error("\n❌ Test runner crashed:", err);
});