# EngPath

EngPath is an Android-first self-study English coach for Vietnamese students in grades 6–9. It diagnoses missing foundations, recommends short daily missions, explains mistakes in Vietnamese, supports pronunciation practice, and includes a grade-10 entrance-exam mode for grade-9 learners.

The product contract is in [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md). The milestone gates and test strategy are in [docs/DELIVERY_PLAN.md](docs/DELIVERY_PLAN.md), and the proposed interface direction is in [docs/UX_REDESIGN_PROPOSAL.md](docs/UX_REDESIGN_PROPOSAL.md).

AI workflow design is documented in [docs/AI_AGENT_STRATEGY.md](docs/AI_AGENT_STRATEGY.md). Project-local reusable skills live under `.agents/skills/`, and runtime prompt drafts live under `ai/prompts/`.

The mobile technology decision is recorded in [docs/ADR-001-mobile-platform.md](docs/ADR-001-mobile-platform.md).

## Repository status

The React Native/Expo local vertical slice has passed M2. It includes onboarding, a grade-aware diagnostic, a skill map, recommended lessons, a mocked pronunciation flow, progress, mistake review and local persistence. M3 content work is in progress: the structured catalogue has two prototype topics per grade, a draft grade-9 exam-style sample and local content error reports. None of this learning content is published or educator-approved yet. Backend sync follows after the M3 quality gate.

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

To inspect the phone-frame UI on this laptop, run `npm run web -- --port 8082 --host localhost` from `apps/mobile`, then open `http://localhost:8082`. The M3 owner check is in [docs/gates/M3-MANUAL-TEST.md](docs/gates/M3-MANUAL-TEST.md).

## Current milestone

M0, M1 and M2 have passed. M3 remains open until independent content review, learner comprehension and owner manual checks are recorded. The grade-9 reviewer packet is in [docs/content/M3-GRADE9-REVIEW-PACKET.md](docs/content/M3-GRADE9-REVIEW-PACKET.md), and gate evidence is recorded under `docs/gates/`.
