# EngPath — M1 visual language, iteration 3

Status: Implemented; internal self-audit passed
Direction: **Study notebook / editorial**, not generic AI dashboard

## Why iteration 1 failed visually

The business flow was accepted by the owner, but the first Study Coach implementation relied on patterns that now read as generic AI output:

- nearly every section was a rounded card;
- repeated pastel pills and icons inside tinted rounded squares;
- dark hero cards followed by more cards with equal visual weight;
- generous but uniform spacing that made every screen feel templated;
- decoration communicated “polished mockup” more strongly than “tool a student uses daily”.

This is a P2 visual-direction finding. It does not change the product scope or learning flow.

## Chosen direction

EngPath should feel like a thoughtfully typeset study notebook:

- calm off-white working surface rather than a dashboard canvas;
- deep green as the functional color and a restrained vermilion accent;
- rules, dividers and margin marks create structure before containers do;
- typography and spacing carry hierarchy;
- status color appears as a narrow rule or compact label, not a large pastel blob;
- familiar system typography keeps Vietnamese readable and the Android package light.

## Rules for implementation

1. Use a card only when content genuinely forms one object or temporary system state.
2. Prefer a top/bottom divider or left margin rule for lists, explanations and recommendations.
3. Use radius `4/8/12`; reserve `16` for rare state containers. Do not round every section.
4. Pills are for short status metadata only: time, confidence, mock state.
5. Do not place every icon inside a colored rounded square.
6. Avoid a dark hero as the default hierarchy shortcut; the main action should win through type, position and one accent rule.
7. Keep one strong accent moment per screen.
8. Preserve 48 dp controls, contrast, text scaling and the sticky primary action.

## Iteration 3 correction

The second iteration still looked like a templated analytics screen on Progress. The final internal pass therefore removes equal statistic boxes and percentage-like mastery bars, uses numbered editorial rows, adds a useful next action, and bans abstract/project-internal copy from student screens. See `docs/gates/M1-SELF-AUDIT.md`.

## Product decision

- **Keep:** the accepted business flow and information architecture.
- **Change:** the complete visual grammar and reusable UI tokens.
- **Defer:** illustration/mascot and custom display font until real learners show they improve clarity or identity.
- **Reject:** decorative blobs, glassmorphism, gradients, excessive capsules and generic AI-chat styling.
