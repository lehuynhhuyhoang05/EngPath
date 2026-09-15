---
name: engpath-content-lab
description: Create, transform, or independently audit EngPath English-learning content for Vietnamese students in grades 6–9, including diagnostics, lessons, quizzes, pronunciation prompts, explanations, and grade-10 exam practice. Use when student-facing content or content-quality decisions are requested; do not use for UI copy or general application code.
---

# EngPath Content Lab

Start by identifying the mode: `author`, `review`, or `transform`.

- For authoring or transformation, read [content contract](references/content-contract.md).
- For review, read both the [content contract](references/content-contract.md) and [quality rubric](references/quality-rubric.md).
- Read `docs/PRODUCT_SPEC.md` only when grade coverage, learning flow, or release scope affects the task.

## Shared requirements

- Write original content. Public availability of a textbook or question bank is not permission to reproduce it.
- Match the requested grade, skill, difficulty, and Vietnamese learner context.
- Use concise Vietnamese explanations and natural English examples.
- Attach a real source or a clear source rationale. Never invent citations, curriculum mappings, or exam provenance.
- Keep answer scoring deterministic for objective questions.
- Mark AI-created output as `ai-assisted` and `draft`; never publish it automatically.
- Do not infer a student's intelligence or identity from mistakes.

## Author mode

Produce the smallest content set requested. Solve every question before setting its answer, then check that distractors are plausible without becoming ambiguous. Link prerequisite skills when a learner may need foundation repair.

For pronunciation items, focus on scripted words or sentences. Include a trusted pronunciation reference, target feature, and a Vietnamese remediation tip. Do not claim that text similarity alone measures pronunciation quality.

## Review mode

Review independently: solve the item before looking at its declared answer when the input format permits. Report issues by severity and do not silently rewrite disputed content.

Reject publication when an item has ambiguous answers, incorrect English, a misleading explanation, unverifiable provenance, an invalid grade/difficulty claim, or copied content without usable rights.

Return a publication decision: `pass`, `revise`, or `reject`, with concrete corrections.

## Transform mode

Preserve meaning, answer validity, source metadata, and stable identifiers unless the user explicitly requests a new item. Re-run all applicable validation after transformation.
