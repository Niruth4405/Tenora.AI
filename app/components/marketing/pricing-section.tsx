import Link from "next/link";

const TIERS = [
  {
    name: "Starter",
    label: "For getting started",
    description:
      "Best for solo creators and early teams that want to generate content for one platform at a time.",
    price: "Free",
    features: [
      "Single-platform generation",
      "Limited monthly credits",
      "Basic brand context",
      "Manual review before posting",
    ],
    cta: "Start free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Premium",
    label: "Most popular",
    description:
      "Built for consistent startups and small teams that need multi-platform output from one source update.",
    price: "₹999/mo",
    features: [
      "Multi-platform generation",
      "Higher monthly credits",
      "Brand voice tags",
      "Draft review workflow",
      "Priority output quality",
    ],
    cta: "Get premium",
    href: "/signup",
    featured: true,
  },
  {
    name: "Enterprise",
    label: "For high-volume ops",
    description:
      "For teams that need unlimited generation, stronger controls, and a scalable content workflow.",
    price: "Custom",
    features: [
      "Unlimited generation",
      "Advanced team workflows",
      "Priority support",
      "Flexible usage controls",
      "Custom onboarding",
    ],
    cta: "Contact sales",
    href: "/signup",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">
            Pricing direction
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Pick the workflow that matches your content volume.
          </h2>

          <p className="mt-4 text-base leading-7 text-white/60">
            Start simple, scale when the team needs more output, and keep the
            creation process aligned with how often you publish.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl border p-6 ${
                tier.featured
                  ? "border-emerald-400/30 bg-emerald-400/[0.06]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-white">{tier.name}</p>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                    tier.featured
                      ? "bg-emerald-400 text-black"
                      : "bg-white/5 text-white/50"
                  }`}
                >
                  {tier.label}
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold text-white">
                {tier.price}
              </p>

              <p className="mt-4 text-sm leading-7 text-white/60">
                {tier.description}
              </p>

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-white/70"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  tier.featured
                    ? "bg-emerald-400 text-black hover:bg-emerald-300"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}