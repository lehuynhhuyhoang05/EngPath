# EngPath content review workflow (M3)

## Current state

The local catalogue is a prototype. In revision 2, the seven questions and two lessons in the [M3 grade-9 review packet](M3-GRADE9-REVIEW-PACKET.md) are `ai-assisted` / `reviewed`, with the [two supplied review forms summarized here](M3-REVIEW-RESULTS.md). All other items, the pronunciation prompt and the exam template remain `draft`. Nothing is `published`. Passing automated validation alone does not make an item ready to publish.

## Revision path

1. Create or edit a `draft` item with stable ID, grade, difficulty, skill and prerequisite tags, original source rationale, answer and Vietnamese explanation. Lessons also need a learning objective, explained example and separate exit question.
2. Run `npm test` and `npm run typecheck` in `apps/mobile`. Catalogue validation checks IDs, references, skill cycles, grade order, question structure and review metadata.
3. An educator solves objective items without looking at the answer key, checks alternative answers, English naturalness, explanation, grade fit and source ownership. For pronunciation, check the target sound and reference. Record the reviewer's ID, date, decision and corrections.
4. Move `draft → reviewed` with version +1 only after corrections pass. Move `reviewed → published` with version +1 and no change to reviewed payload. Any content change sends the item back to `draft` and another review. Old published items move to `archived`; IDs remain stable for saved attempts.
5. For the grade 9 and exam sample, obtain two independent reviews and record disagreement before M3 gate. Exam template and province/year evidence must be verified before publication.

## Learner error reports

Diagnostic, lesson exit check and pronunciation screens store a selected report reason with the content ID and version on the device. Each screen explicitly labels the report as **not sent**. M4 must add upload, retry, deduplication and an internal triage destination before reports can reach the content team.

## M3 publication checklist

- No `draft` item is exposed as reviewed or published.
- Every published item has real source or rationale, reviewer, review date, revision, skill tags and explanation.
- Objective answer and plausible distractors pass independent review; automated checks cannot prove a unique semantic answer.
- Every lesson has a stated learning objective and a different exit question from the diagnostic item.
- Grade 9 and exam samples have two independent signed reviews.
- Use [the grade-9 review packet](M3-GRADE9-REVIEW-PACKET.md) and preserve the [review result](M3-REVIEW-RESULTS.md) before updating any publication status.
