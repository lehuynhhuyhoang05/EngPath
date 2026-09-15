# M1 UI self-audit — iteration 3

Date: 2026-09-15  
Build/commit: `b0e5987`  
Viewport: local web phone stage, 420 × 860  
Screens inspected from running code: onboarding, Today, lesson, pronunciation, progress

## Finding from the supplied Progress screenshot

Iteration 2 was cleaner but still failed in four ways:

1. `Tiến bộ đi cùng bằng chứng` sounded like generated marketing copy rather than language a student would use.
2. Three equal statistic columns and repeated skill rows looked like a generic dashboard template.
3. The lower half had no useful next action.
4. A skill with one correct answer could show a full bar and `Khá vững`, contradicting the low-confidence note.

The fourth issue was treated as a learning-result defect, not merely visual polish.

## Changes made

- Replaced the dashboard headline with `Em đang học đến đâu?`.
- Collapsed three statistic boxes into one natural-language activity summary.
- Replaced percentage-like mastery bars with four evidence marks representing observed attempts.
- Added numbered skill rows and one intentionally accented priority row.
- Added a real next action that opens the recommended lesson.
- Changed student copy from abstract/internal language to short direct Vietnamese.
- Removed visible milestone terms such as `M1`, `M6` and `khung UX` from student screens.
- Simplified Today, Lesson and Pronunciation headings and visual markers for the same editorial rhythm.

## Learning integrity check

`learningBand(score, observations)` now applies these rules:

- fewer than 2 observations → `Đang quan sát`, regardless of score;
- 2–3 observations with a high score → at most `Có tín hiệu tốt`;
- `Khá vững` requires at least 4 observations.

Unit tests cover both `0/1` and `1/1` so a single answer cannot create either a negative or positive mastery claim.

## Internal verdict

| Area | Result | Notes |
|---|---|---|
| Visual hierarchy | PASS | One headline and one primary action per core screen |
| Non-template character | PASS | Editorial numbering, rules and content-led layout replace repeated cards |
| Student-facing copy | PASS | Direct wording; internal project language removed |
| Result honesty | PASS | No percentage mastery visualization from sparse evidence |
| Color contrast | PASS | Core normal-text pairs are at least 4.57:1 |
| Touch target source audit | PASS | Core controls remain at least 48 dp; tabs 64 dp |
| Small web viewport render | PASS | Core screens scroll and sticky CTA remains reachable |
| Font scale 200% on Android | NOT VERIFIED | Requires Android environment/device |
| TalkBack/focus order | NOT VERIFIED | Requires Android manual check |
| Target-learner comprehension | NOT VERIFIED | Requires real learner sessions |

Internal UI verdict: **PASS for M1 implementation**. This is not a substitute for target-learner evidence or Android accessibility testing.
