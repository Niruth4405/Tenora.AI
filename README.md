<div align="center">

# Tenora AI

**AI-powered social content engine for creators, founders, and teams.**

Generate platform-ready posts for LinkedIn, Twitter/X, Instagram, and Newsletters — in seconds.

[![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![Helm](https://img.shields.io/badge/Helm-0F1689?logo=helm&logoColor=white)](https://helm.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## What is Tenora AI?

Tenora AI removes the blank-page problem for social media content. You fill in four inputs — what you want to say, your tone, your target audience, and how long — and the AI returns polished, platform-optimised drafts with hashtags in one click. Drafts can be edited inline, copied, and saved to your account for later publishing.

---

## Key Features

- **Multi-platform generation** — one prompt, separate drafts for LinkedIn, Twitter/X, Instagram, and Newsletter
- **Structured compose form** — context · tone · requirement · target audience · word-count slider
- **Inline draft editing & copy** — tweak and copy any draft without leaving the page
- **Brand context** — save your brand voice, audience, and tone so every generation stays on-brand
- **Credit-based plans** — BASIC / PREMIUM / ENTERPRISE tiers with monthly credit resets
- **Post analytics** — impressions, engagement, clicks, shares, and comments per draft
- **Full auth suite** — email/password, OAuth (Google), and OTP-based password reset

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| AI | Vercel AI SDK · Google Gemini · Groq (LLaMA) |
| Database | MongoDB Atlas via Prisma ORM |
| Auth | NextAuth v5 + Prisma Adapter |
| Email | Resend / Nodemailer |
| Payments | Stripe |
| Validation | Zod v4 |
| Containerisation | Docker + Docker Compose |
| Orchestration | Kubernetes (3 replicas, rolling updates, zero downtime) |
| Deployment | Helm 3 (templated chart, versioned releases) |
| Ingress | Nginx Ingress Controller + cert-manager (TLS) |

---

## Infrastructure & DevOps

Tenora AI is fully containerised and production-ready on Kubernetes, deployed and managed via Helm.

```
docker build + push
       ↓
helm upgrade --set image.tag=vX.X.X
       ↓
Kubernetes Rolling Update (zero downtime)
```

### Kubernetes Setup
- **3 replicas** with rolling update strategy (`maxUnavailable: 1`, `maxSurge: 1`)
- **Readiness & liveness probes** on `/api/health`
- **Resource limits** — CPU: 500m, Memory: 512Mi per pod
- **TLS termination** via cert-manager + Let's Encrypt
- **Secrets** managed via Helm values, never hardcoded in manifests

### Helm Chart Structure
```
helm/
└── tenora-chart/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        ├── ingress.yaml
        ├── secret.yaml
        └── namespace.yaml
```

---

## Getting Started

### Local Development

```bash
# 1. Clone and install
git clone https://github.com/Niruth4405/Tenora.AI.git
cd Tenora.AI
npm install

# 2. Add environment variables
cp .env.example .env.local   # fill in your values

# 3. Push schema to MongoDB
npx prisma db push

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run with Docker Compose

```bash
docker-compose up
```

### Deploy to Kubernetes with Helm

```bash
# 1. Create your secrets file (never commit this)
cp helm/values-secrets.example.yml helm/tenora-chart/values-secrets.yml
# Fill in your real values

# 2. Install
helm install tenora helm/tenora-chart \
  -f helm/tenora-chart/values-secrets.yml \
  --namespace tenora --create-namespace

# 3. Upgrade with new image version
helm upgrade tenora helm/tenora-chart \
  -f helm/tenora-chart/values-secrets.yml \
  --set image.tag=v1.1.0

# 4. Rollback if needed
helm rollback tenora 1 -n tenora
```

### Required Environment Variables

```env
DATABASE_URL=                          # MongoDB Atlas connection string
AUTH_SECRET=                           # Random secret (openssl rand -base64 32)
GOOGLE_GENERATIVE_AI_API_KEY=
GROQ_API_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Project Structure

```
app/
├── (pages)/
│   ├── (auth)/          # Sign-in, sign-up, password reset
│   └── (dashboard)/     # Compose, Drafts, Analytics, Settings, Billing
├── actions/             # Next.js Server Actions (generate, save, auth)
├── api/                 # NextAuth + Stripe webhook handlers
├── components/          # Shared UI components
└── lib/                 # AI config, Prisma client, email, utilities
prisma/
└── schema.prisma        # MongoDB data models
helm/
└── tenora-chart/        # Helm chart for Kubernetes deployment
k8s/
└── manifests/           # Raw Kubernetes manifests (reference)
```

---

## How the AI Pipeline Works

1. User fills the compose form (context, tone, requirement, audience, word count)
2. Fields are assembled into a structured prompt in the server action
3. Google Gemini (or Groq as fallback) returns a JSON response with `draft` and `hashtags` per platform
4. Drafts render in the UI as editable cards — ready to copy or save to MongoDB

---

## License

MIT © [Niruth Ananth](https://github.com/Niruth4405)
