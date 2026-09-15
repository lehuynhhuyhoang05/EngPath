# EngPath — Product & Development Specification

Status: Draft v1.1  
Platform: Android first  
Primary users: Vietnamese students in grades 6–9  
Product type: Self-study English learning application

## 1. Product vision

EngPath helps Vietnamese middle-school students study English independently by:

1. identifying knowledge gaps instead of giving every learner the same course;
2. creating a short, achievable daily learning path;
3. explaining mistakes in clear Vietnamese;
4. training pronunciation with feedback tailored to common Vietnamese learner errors;
5. providing a dedicated grade-10 entrance-exam mode for grade-9 students.

The product is not a teacher classroom-management system. Teachers may help validate content or recruit beta testers, but students remain the primary users and can complete the full learning loop themselves.

## 2. Product positioning

Working value proposition:

> A self-study English coach for Vietnamese middle-school students that finds missing foundations, explains how to fix each mistake, improves pronunciation, and prepares grade-9 learners for their local grade-10 entrance exam.

The differentiation is the combination of:

- a connected grade 6–9 skill map;
- prerequisite-based gap repair;
- Vietnamese-language mistake explanations;
- pronunciation remediation for common Vietnamese learner errors;
- province-aware grade-10 exam preparation;
- an Android experience that remains usable on lower-end devices and unstable networks.

## 3. Target users

### 3.1 Primary personas

#### Foundation learner

- Grade 6–9.
- Has missing vocabulary or grammar foundations.
- Does not know where to restart.
- Needs small lessons, visible progress, and non-judgmental feedback.

#### School-support learner

- Wants to reinforce topics currently studied at school.
- Needs practice by grade, unit, topic, and skill.
- Wants immediate explanations without waiting for a teacher.

#### Grade-9 exam learner

- Wants a target score for the grade-10 entrance exam.
- Needs timed practice, a weak-skill report, and a revision plan.
- May need to revisit prerequisites from grades 6–8.

### 3.2 Initial beta cohort

- 10–20 students recruited through the user's mother.
- Android is the only supported platform.
- Beta participants should include more than one ability level.
- No teacher assignment workflow is required.

## 4. Product principles

1. Diagnose before recommending.
2. Show why an answer is wrong, not only the final score.
3. Keep a normal daily session within 10–15 minutes.
4. Do not punish weaker learners through public ranking.
5. Use AI only where it adds measurable value.
6. Treat learning content as versioned product data, not hard-coded UI text.
7. Collect the minimum possible data from minors.
8. Design for content expansion without requiring all grade 6–9 content at launch.

## 5. Core learning loop

```text
Select grade and goal
        ↓
Short diagnostic
        ↓
Personal skill map
        ↓
Daily 10–15 minute mission
        ↓
Learn → practise → speak → review
        ↓
Mistake notebook and mastery update
        ↓
Next recommended mission
```

## 6. Product modes

### 6.1 Grade learning mode

Available for grades 6, 7, 8, and 9:

- learning units grouped by topic;
- vocabulary, grammar, reading, listening, and pronunciation activities;
- prerequisite links to earlier skills;
- daily mission and spaced review;
- personal mastery map.

### 6.2 Foundation repair mode

- activated when diagnostic results reveal prerequisite gaps;
- contains short explanations and focused practice;
- allows grade-9 students to repair grade 6–8 foundations without restarting an entire course;
- returns the learner to the original lesson after the prerequisite is recovered.

### 6.3 Grade-10 exam mode

Available to grade-9 learners:

- target score and target province;
- practice by exam question type;
- timed mock exams;
- analysis of lost marks by skill;
- revision recommendations;
- readiness trend rather than a single test score.

Exam templates must be versioned by province and school year because local formats can change.

## 7. MVP scope

### 7.1 MVP vertical slice

The first runnable product must support this end-to-end flow:

1. learner opens the app;
2. selects grade and learning goal;
3. completes a short diagnostic;
4. sees strong and weak skills;
5. receives a recommended mission;
6. completes one lesson and its questions;
7. performs one scripted pronunciation exercise;
8. sees updated mastery and mistake history.

### 7.2 MVP features

#### Onboarding

- Select grade 6–9.
- Select one primary goal: school support, foundation repair, pronunciation, or grade-10 exam.
- Use a local guest profile initially; account registration is deferred until sync is implemented.

#### Diagnostic

- 8–15 questions in the prototype.
- Questions tagged to skills and prerequisites.
- Produces a skill-level result, not only a total score.

#### Home and daily mission

- One recommended mission.
- Continue button.
- Current streak, weekly activity, and mastery summary.
- Grade-10 exam entry point for grade 9.

#### Lesson player

- Concise Vietnamese explanation.
- Examples.
- Multiple-choice and fill-in-the-blank activities.
- Immediate answer explanation.
- One optional pronunciation activity.

#### Pronunciation v1

- Scripted word and sentence prompts.
- Reference audio.
- Microphone recording only after explicit user action.
- Overall, word-level, and phoneme-level feedback when supported by the provider.
- Vietnamese remediation tips mapped from detected error types.
- Raw recordings are not retained by default.

#### Mistake notebook

- Stores incorrectly answered questions.
- Groups mistakes by skill.
- Provides explanation and a retry action.
- Schedules selected mistakes for later review.

#### Progress

- Mastery score by skill.
- Number of completed learning sessions.
- Recent improvement.
- Pronunciation attempts and best score.

#### Grade-10 exam prototype

- One exam template.
- One short mock exam for UX validation.
- Timer, submit, score, and skill breakdown.
- Full exam bank is part of beta content expansion, not the first vertical slice.

#### Internal content administration

- Content is stored as structured data and delivered through an API later.
- Each item has source, status, version, skill tags, answer, and explanation.
- Workflow: draft → reviewed → published → archived.
- Student-facing teacher dashboard and assignment workflows are out of scope.

### 7.3 Explicitly out of MVP

- iOS release;
- teacher assignments and classroom management;
- public class leaderboard;
- open-ended AI conversation;
- custom-trained end-to-end speech model;
- payments and subscriptions;
- advertisements;
- social chat;
- production-scale recommendation ML;
- Redis, microservices, and GraphQL.

## 8. Content rollout plan

Product scope and launch content scope are intentionally different.

### Prototype content

- Two representative topics per grade.
- A small prerequisite graph across grades.
- One complete grade-9 exam flow.
- A small pronunciation error catalogue.

### Private beta content

- Grade-9 core curriculum and exam practice.
- Foundation repair packs sourced from grades 6–8.
- At least 8–12 high-impact skill groups.
- A reviewed question bank sufficient for repeated two-week use.

### Expansion

1. Complete grade 8.
2. Complete grade 7.
3. Complete grade 6.
4. Expand province-specific grade-10 exam templates.

## 9. Content quality workflow

All student-facing content must include:

- a stable content identifier;
- grade and difficulty;
- one or more skill tags;
- answer and Vietnamese explanation;
- source or source rationale;
- authoring method: human, AI-assisted, or imported;
- review status and reviewer;
- revision number.

Automated checks should reject:

- multiple-choice questions without exactly one correct answer;
- missing explanations;
- duplicate options;
- invalid skill references;
- published content without a source record;
- exam questions incompatible with their exam template.

AI may generate drafts and variants, but it may not publish content automatically.

## 10. AI and recommendation strategy

### Phase A — deterministic personalization

- Every question maps to skills.
- Correctness, recency, difficulty, and number of attempts update mastery.
- The recommendation engine chooses weak skills whose prerequisites are satisfied.
- If a prerequisite is weak, a repair lesson is inserted first.

This phase requires no machine-learning model and remains explainable.

### Phase B — assisted explanation

- AI rewrites approved explanations at an appropriate reading level.
- Generation is grounded in reviewed content.
- The original approved explanation remains available as fallback.

### Phase C — pronunciation intelligence

- A speech provider performs acoustic assessment.
- EngPath maps provider results to its own Vietnamese feedback catalogue.
- Provider access is wrapped behind an adapter so vendors can be changed.

### Phase D — optional research model

- Collect recordings only through separate, informed opt-in.
- De-identify recordings and separate them from user profiles.
- Start with a narrow classifier such as final-consonant omission.
- Compare the custom model against the provider baseline.
- The production app must continue working without the research model.

## 11. Mastery model v1

Each skill has a score from 0–100 and a confidence level.

Prototype update rule:

```text
weighted_result = correctness × difficulty_weight
new_mastery = old_mastery × 0.7 + weighted_result × 0.3
```

Additional rules:

- recent results count more than old results;
- a single correct answer cannot mark a skill as mastered;
- repeated mistakes reduce confidence;
- pronunciation mastery is tracked separately from grammar/vocabulary mastery;
- thresholds are configurable rather than hard-coded throughout the app.

This simple model should be replaced only after beta data shows a concrete weakness.

## 12. Technical architecture

### 12.1 Initial architecture

```text
React Native / Expo Android app
            |
         REST API
            |
       NestJS modular monolith
            |
        PostgreSQL

Optional external service:
Speech pronunciation assessment provider
```

An internal Next.js content console can be added after the mobile vertical slice and API are stable.

### 12.2 Mobile responsibilities

- navigation and UI;
- local guest profile;
- cached lesson catalogue and progress;
- audio capture and playback;
- optimistic progress updates;
- offline-friendly access to downloaded lessons;
- event collection for product validation.

### 12.3 Backend responsibilities

- authentication and profile sync;
- versioned learning content;
- diagnostic and recommendation endpoints;
- attempt persistence;
- mastery calculation;
- review scheduling;
- exam templates and scoring;
- speech-provider proxy so API credentials never ship in the app;
- privacy deletion workflow.

### 12.4 Initial modules

- `identity`
- `catalog`
- `learning`
- `assessment`
- `mastery`
- `review`
- `pronunciation`
- `exam`
- `content-admin`

## 13. Core data model

```text
users
profiles

grades
courses
units
lessons

skills
skill_prerequisites
lesson_skills

questions
question_options
question_skills

learning_sessions
attempts
attempt_answers
mastery_states
review_schedules

pronunciation_prompts
pronunciation_attempts
pronunciation_error_types

exam_templates
mock_exams
mock_exam_questions

content_sources
content_revisions
question_reports
```

Raw voice recordings are transient by default and are not part of the persistent core model.

## 14. Initial REST API surface

```text
POST   /v1/guest-sessions
GET    /v1/catalog/grades
GET    /v1/catalog/grades/:gradeId/units

POST   /v1/diagnostics/start
POST   /v1/diagnostics/:id/answers
POST   /v1/diagnostics/:id/complete

GET    /v1/me/mastery
GET    /v1/me/recommendations
GET    /v1/me/mistakes

GET    /v1/lessons/:id
POST   /v1/learning-sessions
POST   /v1/learning-sessions/:id/answers
POST   /v1/learning-sessions/:id/complete

POST   /v1/pronunciation/assess

GET    /v1/exam-templates
POST   /v1/mock-exams/:id/start
POST   /v1/mock-exam-attempts/:id/submit

POST   /v1/questions/:id/reports
DELETE /v1/me
```

## 15. Privacy and safety

- No real name, phone number, address, or precise location is needed for the prototype.
- Microphone access is requested only in context.
- Raw speech is deleted after assessment unless separate research consent exists.
- No advertising SDK is included.
- No direct messaging or public profile is included.
- Analytics events use a pseudonymous identifier.
- A user can erase all synced data.
- Secrets for AI and speech services stay on the backend.

## 16. Non-functional requirements

- Android is the only release target for the beta.
- Core screens must remain responsive on a lower-end physical Android device.
- Lessons already opened should remain readable without a network connection.
- API errors must never discard a completed answer locally.
- Content schema changes must be backward-compatible with one previous app release.
- Accessibility: scalable text, adequate contrast, and no color-only correctness cues.
- Vietnamese is the interface and explanation language; learning content is English-first.

## 17. Product analytics and beta success criteria

Track only events needed to answer product questions:

- onboarding completed;
- diagnostic completed;
- mission started/completed;
- question answered and skill tag;
- explanation opened;
- pronunciation attempted/retried;
- mistake reviewed;
- mock exam completed.

Private beta succeeds when:

- at least 10 students use the app;
- at least 60% complete three or more sessions during two weeks;
- returning learners show measurable improvement on repeated skill checks;
- content errors can be reported and fixed without releasing a new app build;
- pronunciation retry behavior indicates that feedback is understandable;
- no raw voice recording is retained unintentionally.

## 18. Delivery roadmap

Các cổng pass/fail, test bắt buộc, bằng chứng nghiệm thu và thứ tự triển khai chính thức được quản lý trong [DELIVERY_PLAN.md](DELIVERY_PLAN.md). Danh sách dưới đây chỉ là bản tóm tắt phạm vi; một milestone không được coi là hoàn thành nếu chưa qua quality gate tương ứng.

1. **M0 — Product evidence và repository foundation.**
2. **M1 — UX direction và design foundation.**
3. **M2 — Local vertical slice chất lượng thật.**
4. **M3 — Content engine và learning quality.**
5. **M4 — Backend, account và sync.**
6. **M5 — Phát âm thật.**
7. **M6 — Chế độ thi vào 10.**
8. **M7 — Alpha hardening và APK nội bộ.**
9. **M8 — Private beta hai tuần.**
10. **M9 — Play internal testing và mở rộng có kiểm soát.**

## 19. Definition of done for the first vertical slice

Đây là điều kiện sản phẩm tối thiểu. Điều kiện kỹ thuật và kiểm thử đầy đủ nằm tại Milestone 2 của [DELIVERY_PLAN.md](DELIVERY_PLAN.md).

- The Android app starts without a backend.
- A learner can select a grade and goal.
- The learner can answer a diagnostic set.
- The result identifies at least one strong and one weak skill.
- The app recommends a lesson based on the result.
- The learner can complete the lesson and see explanations.
- The pronunciation screen supports the full UX using deterministic mock results.
- Progress remains available after restarting the app.
- Type checking and automated tests pass.
- The README explains how to run the project and what remains mocked.
