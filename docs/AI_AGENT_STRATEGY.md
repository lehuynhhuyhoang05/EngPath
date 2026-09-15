# EngPath AI agent, skill, prompt, and evaluation strategy

## Why this belongs in the project

A portfolio gains little from a folder containing many prompts. It gains value when the repository demonstrates a repeatable AI workflow with explicit boundaries, structured inputs and outputs, evaluation cases, and evidence that failures led to targeted improvements.

EngPath therefore treats four concepts separately:

| Artifact | Purpose | EngPath example |
| --- | --- | --- |
| `AGENTS.md` | Durable repository-wide rules | Product contract, stack, verification |
| Agent skill | Reusable workflow and domain decisions | Author or audit learning content |
| Runtime prompt | Behavior for one AI feature | Explain a student's mistake |
| Evaluation | Measures observable quality | Explanation is correct, grounded, and age-appropriate |

## Initial skill suite

### `engpath-product-steward`

Use for product and architecture decisions. It prevents scope drift, distinguishes the grades 6–9 vision from beta scope, and requires current evidence for changing market or exam claims.

### `engpath-content-lab`

Use to author, transform, or audit learning items. It defines structured content, independent answer checking, publication gates, and pronunciation-specific checks.

## Skills to add only after the workflow exists

- `engpath-feedback-synthesis`: when multiple beta interview notes need the same evidence-tagging and prioritization process.
- `engpath-pronunciation-eval`: when a real speech provider exists and repeated benchmark comparisons are needed.
- `engpath-release-readiness`: when APK releases repeatedly require the same privacy, migration, and device checks.

Do not create these in advance. First perform the workflow manually, identify repeated decisions or failures, then encode only the non-obvious stable guidance.

## Prompt architecture

Runtime prompts should be assembled in this order:

1. stable role and safety contract;
2. approved learning content and relevant skill definition;
3. output schema;
4. dynamic learner attempt and requested task.

Keep stable content first to support prompt caching. Do not include secrets, unnecessary profile data, or raw historical conversations.

## Runtime AI boundaries

- Objective scoring remains deterministic.
- The model may explain an approved answer but cannot change it silently.
- The model may recommend from eligible lessons supplied by the backend; it cannot invent a lesson ID.
- The model should acknowledge insufficient context rather than invent curriculum facts.
- Student-facing language must avoid humiliation, diagnosis, or claims about intelligence.
- Raw voice should not be sent to a general language model when a dedicated speech assessment service is sufficient.

## Evaluation approach

Maintain representative cases for:

- correct and incorrect student answers;
- ambiguous questions;
- incorrect declared answers;
- prompt injection inside imported learning content;
- missing source material;
- explanations for foundation and advanced learners;
- pronunciation provider results with missing phoneme detail;
- requests for personal or sensitive information.

Evaluate behavior rather than wording. Useful assertions include:

- no fabricated rule or citation;
- declared uncertainty when evidence is missing;
- no answer contradiction;
- valid structured output;
- appropriate Vietnamese reading level;
- feedback includes one actionable next step;
- no sensitive learner attribute is inferred.

## Interview narrative

Present the work as an AI engineering loop:

1. identify a repeated, high-risk workflow;
2. define a narrow skill and contract;
3. build representative evaluation cases;
4. run the skill on real content;
5. record failure categories;
6. update only the instruction or validator responsible for repeated failures;
7. compare quality, latency, and cost before and after.

This shows domain modeling, prompt engineering, evaluation, privacy thinking, and software integration. The number of prompts is not a meaningful success metric.

