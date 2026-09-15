# M0 assumptions and risks

Status: Initial hypotheses — not validated  
Last updated: 2026-09-15

## Assumption register

| ID | Assumption | Product decision affected | Evidence needed | Current state |
|---|---|---|---|---|
| A01 | Learners often do not know which prerequisite caused a mistake | Diagnostic + foundation repair | Repeated recent examples from interviews; result-screen comprehension | Unvalidated |
| A02 | A single daily mission reduces choice overload | Today screen | Task success plus intent-to-return grounded in behavior | Unvalidated |
| A03 | Vietnamese mistake explanations lead to a correct retry | Lesson feedback | Observe explanation → retry across representative items | Unvalidated |
| A04 | Learners will speak into a phone when recording is explicit and private | Pronunciation | Context-specific comfort evidence and pronunciation task completion | Unvalidated |
| A05 | Actionable sound-level feedback produces useful retries | Pronunciation feedback | Learner can state what to change; retry behavior improves | Unvalidated |
| A06 | Grade-9 learners need lost-mark analysis tied to prerequisite skills | Exam mode | Recent mock-review behavior and prototype task evidence | Unvalidated |
| A07 | Core sessions are viable on lower-end Android devices and unstable networks | Offline-first Android | Participant device/network sample plus later device tests | Unvalidated |

## MVP traceability

| MVP feature | Learner problem/hypothesis | Evidence status |
|---|---|---|
| Grade and goal onboarding | Different study intent by learner/grade | Unvalidated |
| Diagnostic skill result | A01 | Unvalidated |
| Daily mission | A02 | Unvalidated |
| Lesson explanation and retry | A03 | Unvalidated |
| Pronunciation loop | A04, A05 | Unvalidated |
| Mistake notebook | A03; learners need later review | Partly specified, unvalidated |
| Progress/mastery | Learners need visible evidence of improvement | Unvalidated |
| Grade-10 exam mode | A06 | Unvalidated |
| Local persistence/offline | A07 | Unvalidated |

## Risk register

| Risk | Likelihood | Impact | Early mitigation | Gate |
|---|---|---|---|---|
| Diagnostic gives false precision from too few items | High | High | Confidence labels; minimum evidence; usability test | M1/M2 |
| AI-assisted content contains subtle errors | Medium | High | Draft-only, deterministic validators, independent review | M0/M3 |
| Speech feedback is inaccurate or discouraging | Medium | High | Provider spike, remediation catalogue, learner trials | M5 |
| Audio from minors is retained unintentionally | Low–Medium | Critical | Transient default, explicit action, deletion verification | M5 |
| Exam format becomes outdated by province/year | Medium | High | Versioned templates and source review | M3/M6 |
| App becomes too heavy for target devices | Medium | High | Small-device baseline, asset/performance budgets | M1/M7 |
| Gamification distracts or punishes weaker learners | Medium | Medium | No public ranking or punitive streaks | Product contract |
| Solo developer expands scope before validating core loop | High | High | Milestone gates and feature freeze until M1 | M0/M1 |

