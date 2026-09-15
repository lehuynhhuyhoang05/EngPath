# EngPath repository guidance

## Product contract

- EngPath is a self-study English application for Vietnamese students in grades 6–9.
- Grade 9 includes a dedicated grade-10 entrance-exam mode.
- Pronunciation practice is a core product pillar.
- Teacher assignment, classroom management, public chat, and public ranking are outside the current product core.
- Read `docs/PRODUCT_SPEC.md` before making product-scope or architecture changes.

## Project workflows

- Use `.agents/skills/engpath-product-steward/SKILL.md` for product, roadmap, scope, and UX prioritization work.
- Use `.agents/skills/engpath-content-lab/SKILL.md` for authoring or reviewing student-facing English content.
- Keep student-facing content structured and versioned; do not hard-code a growing content catalogue inside screens.
- Treat AI-generated learning content as a draft until it passes the content review workflow.

## Engineering direction

- Mobile: React Native with Expo and TypeScript.
- API: NestJS modular monolith with REST.
- Database: PostgreSQL when backend persistence is introduced.
- Prefer a working vertical slice over speculative infrastructure.
- Do not add Redis, GraphQL, microservices, or a custom ML model without a measured requirement.
- Keep speech vendors behind an adapter and never ship provider secrets in the mobile application.

## Verification

- Run type checking for every TypeScript change.
- Add tests for learning calculations, content validation, scoring, and persistence behavior where regressions would affect student results.
- UI-only changes need focused manual verification; do not create tests that merely mirror styling.

