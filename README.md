# EngPath

EngPath is an Android-first self-study English coach for Vietnamese students in grades 6–9. It diagnoses missing foundations, recommends short daily missions, explains mistakes in Vietnamese, supports pronunciation practice, and includes a grade-10 entrance-exam mode for grade-9 learners.

The product contract is in [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md). The milestone gates and test strategy are in [docs/DELIVERY_PLAN.md](docs/DELIVERY_PLAN.md), and the proposed interface direction is in [docs/UX_REDESIGN_PROPOSAL.md](docs/UX_REDESIGN_PROPOSAL.md).

AI workflow design is documented in [docs/AI_AGENT_STRATEGY.md](docs/AI_AGENT_STRATEGY.md). Project-local reusable skills live under `.agents/skills/`, and runtime prompt drafts live under `ai/prompts/`.

The mobile technology decision is recorded in [docs/ADR-001-mobile-platform.md](docs/ADR-001-mobile-platform.md).

## Repository status

The first React Native/Expo vertical slice is implemented with local seed data. It includes onboarding, a grade-aware diagnostic, a skill map, a recommended lesson, a mocked pronunciation assessment flow, progress, and local persistence. A NestJS API and PostgreSQL persistence follow in the next milestone.

## Run the mobile prototype

Expo SDK 57 requires Node.js 22.13 or newer. From `apps/mobile`:

```powershell
npm install
npm run lint
npm run typecheck
npm test
npm run android
```

CI also runs deterministic Android and web bundle smoke checks. Run the same checks locally with:

```powershell
npm run bundle:android
npm run bundle:web
```

The current workstation also has an older broken NVM-managed npm earlier on `PATH`. Until that local Node setup is repaired, use the Node.js 24 installation explicitly:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
npm run android
```

The pronunciation score is intentionally mocked. The UI states this clearly and does not record or upload audio yet.

## Current milestone

M0 foundation work is active. The learner interview kit starts at [docs/research/M0_INTERVIEW_GUIDE.md](docs/research/M0_INTERVIEW_GUIDE.md), and gate evidence is recorded under `docs/gates/`.
