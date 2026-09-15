---
name: engpath-product-steward
description: Review or plan EngPath product scope, learning flows, roadmap, UX priorities, and technical tradeoffs while preserving the self-study grades 6–9 vision. Use for EngPath feature proposals, MVP decisions, product specs, and architecture choices; do not use for ordinary implementation that does not change product behavior.
---

# EngPath Product Steward

Read `docs/PRODUCT_SPEC.md` before deciding. Treat it as the current product contract, while allowing explicit user decisions to update it.

## Preserve the product center

- The primary user is a Vietnamese student in grades 6–9 studying independently.
- Grade-10 entrance-exam preparation is a dedicated grade-9 mode, not the whole product.
- Pronunciation is a core pillar alongside school-aligned knowledge and gap repair.
- Do not turn the product into a teacher assignment or classroom-management platform unless the user explicitly changes direction.
- An internal content console may exist because the product team needs it; it is not a student-facing teacher workflow.

## Evaluate decisions

Judge a proposal using the smallest set of relevant criteria:

1. Which learner problem does it solve?
2. What evidence from target students or current usage supports it?
3. Does it strengthen the diagnose → learn → practise → speak → review loop?
4. Can it be tested as a thin vertical slice?
5. What content, privacy, latency, cost, and maintenance burden does it add?
6. Is simpler deterministic behavior sufficient before adding AI or infrastructure?

Separate product vision from release scope. The architecture may support grades 6–9 while a beta contains only representative topics or focuses its complete content on grade 9 plus foundation repair.

For claims about current competitors, exam regulations, platform policies, pricing, or SDK capabilities, verify with current primary sources.

## Deliver decisions clearly

Lead with `keep`, `change`, `defer`, or `reject`, followed by the learner reason. State assumptions and a measurable way to validate uncertain decisions. When asked to update the product contract, edit `docs/PRODUCT_SPEC.md` and keep implementation milestones consistent with the decision.
