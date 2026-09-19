# EngPath — Kế hoạch phát triển và Quality Gates

Status: Active v1.4
Current milestone: M4 — Backend, account và sync
Last reviewed: 2026-09-19

Đối tượng lập kế hoạch: một developer chính, có người hỗ trợ duyệt nội dung và tuyển beta  
Nguyên tắc: **không qua cổng chất lượng thì không chuyển milestone**

## 1. Mục đích

Tài liệu này là nguồn chuẩn cho thứ tự phát triển từ prototype đến Android release. `PRODUCT_SPEC.md` quyết định xây sản phẩm gì; tài liệu này quyết định khi nào một phần thực sự hoàn thành.

Mỗi milestone phải có đủ:

- đầu ra chạy được;
- tiêu chí chấp nhận đo được;
- automated tests phù hợp;
- kiểm tra tay trên Android;
- bằng chứng lưu lại;
- không còn lỗi chặn cổng.

Ước tính toàn bộ đến private beta là 18–24 tuần cho một developer, không tính thời gian biên soạn ngân hàng nội dung lớn. Đây là dải lập kế hoạch, không phải cam kết lịch; chỉ chốt ngày sau Milestone 1 khi đã đo velocity thực tế.

## 2. Trạng thái thực tế hiện tại

| Hạng mục | Trạng thái | Nhận định |
|---|---|---|
| Product contract | Đạt cho M2 | Tầm nhìn và phạm vi đúng; nghiên cứu học sinh thật được dời tới lúc có bản đủ ổn để thử |
| Quyết định nền tảng | Đạt | React Native/Expo, Android-first đã được ghi bằng ADR |
| Prototype local | M3 đã qua gate, M4 đang làm | Hai chủ điểm mỗi lớp, chẩn đoán 8–14 câu, lesson objective/exit check riêng; 7 câu và 2 bài lớp 9 đã `reviewed`, chưa `published`; báo lỗi còn lưu cục bộ |
| Automated tests | Một phần | 40 test Vitest gồm content/exam validation, skill graph, revision, scoring, diagnostic/mastery/storage; web phone-frame E2E smoke pass; chưa có component test stack chuẩn Expo |
| Pronunciation | Mock | Chưa thu âm, chưa có provider, consent hoặc deletion verification |
| Backend/sync | Chưa làm | Chưa có API/PostgreSQL |
| Grade-10 exam | M3 content draft | Có mẫu luyện thi 3 câu và schema/template chấm điểm; app mới có entry card, màn làm đề thuộc M6; chưa gắn tỉnh/năm chính thức |
| Beta readiness | Chưa đạt | Chưa có APK beta, analytics tối thiểu, privacy flow hoặc field test |

Prototype hiện tại đã qua M3 ở phạm vi content engine local. [M0 gate](gates/M0-2026-09-15.md), [M1 gate](gates/M1-2026-09-15.md), [M2 gate](gates/M2-2026-09-15.md) và [M3 gate](gates/M3-2026-09-19.md) đã pass; M4 triển khai backend/sync. M3 không đồng nghĩa với việc toàn bộ content đã được publish.

## 3. Luật qua cổng chung

Một milestone chỉ được chuyển sang `DONE` khi:

1. mọi acceptance criterion được đánh dấu pass và có link tới bằng chứng;
2. typecheck, lint, unit và integration tests đều pass trên CI;
3. E2E smoke của các luồng bị ảnh hưởng pass; Android runtime E2E bắt buộc khi milestone dùng native behavior hoặc trước APK;
4. đã test tay trên ít nhất một viewport Android nhỏ và một thiết bị Android vật lý mục tiêu khi milestone yêu cầu native behavior;
5. không còn P0 hoặc P1; P2 phải có ticket, owner và quyết định xử lý;
6. tài liệu, trạng thái mock và giới hạn sản phẩm được cập nhật;
7. người duyệt cổng ghi ngày, commit/build và kết luận `PASS` hoặc `FAIL`.

Nếu một mục không áp dụng, phải ghi `N/A` kèm lý do; không được bỏ trống.

### Mức lỗi

- **P0:** mất dữ liệu, rò rỉ dữ liệu, crash chặn toàn app, chấm sai hàng loạt.
- **P1:** không hoàn thành được luồng lõi, kết quả học tập sai, micro/đồng bộ hoạt động sai nghiêm trọng.
- **P2:** chức năng vẫn hoàn thành được nhưng UX, hiệu năng hoặc hiển thị có lỗi đáng kể.
- **P3:** polish hoặc lỗi nhỏ không ảnh hưởng mục tiêu học tập.

### Definition of Ready cho một story

- Có learner problem và outcome.
- Có acceptance criteria bằng ví dụ cụ thể.
- Biết dữ liệu/content nào cần dùng.
- Có trạng thái loading, empty, error, offline và accessibility nếu liên quan.
- Biết test sẽ nằm ở tầng unit, component, integration hay E2E.
- Không chứa quyết định sản phẩm chưa được chốt.

### Definition of Done cho một story

- Code và content được review.
- Không còn dữ liệu demo trá hình trong production path.
- Test mới được thêm và pass.
- Analytics chỉ được thêm khi trả lời một product question cụ thể.
- Accessibility label, touch target và dynamic text đã kiểm tra.
- Error path không làm mất câu trả lời của học sinh.
- Tài liệu thay đổi hành vi đã cập nhật.

## 4. Chiến lược kiểm thử

Không dùng một con số coverage tổng thể để thay thế chất lượng. Coverage là tín hiệu; cổng chính là hành vi quan trọng và rủi ro đã được kiểm thử.

| Tầng | Mục đích | Công cụ dự kiến | Khi chạy |
|---|---|---|---|
| Schema/content validation | Chặn nội dung sai cấu trúc, đáp án mơ hồ, reference hỏng | TypeScript validators + Jest | Mỗi thay đổi content |
| Unit | Scoring, mastery, recommendation, review schedule, exam timer/scoring | jest-expo/Jest | Mỗi commit/PR |
| Component | Render state, tương tác, accessibility role/label | jest-expo + React Native Testing Library | Mỗi PR |
| Integration | Storage, API contract, offline queue, speech adapter | Jest + test doubles/contract tests | Mỗi PR |
| E2E | Luồng thật trên app đã build | Web phone-frame smoke ở M2; Maestro/Android từ khi có SDK hoặc trước APK | Smoke mỗi PR; full suite trước gate/release |
| Visual | Layout, overflow, font scaling, viewport nhỏ | Screenshot baseline + manual review | Khi đổi UI |
| Accessibility | TalkBack, focus order, label, contrast, touch target | Accessibility Scanner + manual | Mỗi UX gate/release |
| Usability | Học sinh có hiểu và tự hoàn thành không | Scripted observation | Milestone 1, 2 và beta |
| Device/performance | Startup, memory, mạng yếu, app background/resume | Physical Android + profiling | Milestone 6 trở đi |
| Security/privacy | Secrets, auth, deletion, microphone lifecycle | Checklist + automated/API tests | Milestone 4 trở đi |

Các domain module có tác động trực tiếp đến chấm điểm, mastery, recommendation, privacy deletion và exam scoring phải đạt tối thiểu 90% branch coverage, đồng thời có boundary/error tests. Không đặt ngưỡng 90% cho toàn UI vì dễ tạo test hình thức.

Prototype hiện dùng Vitest cho 5 test TypeScript thuần. Trước gate M2, chuyển hoặc hợp nhất về `jest-expo` để domain và React Native component dùng một test stack; không duy trì hai runner nếu không có lợi ích đo được.

## 5. Milestone và cổng hoàn thành

### M0 — Product evidence và nền repository

**Thời lượng ước tính:** 1–2 tuần  
**Mục tiêu:** khóa vấn đề cần giải quyết và có nền kỹ thuật lặp lại được.

Đầu ra:

- research protocol, initial learner-problem hypotheses, assumptions và risk register;
- product spec, ADR nền tảng, content schema v1;
- quyết định cấu trúc Git/repository và CI;
- seed content nhỏ, có nguồn và trạng thái review.

Gate M0:

- Mỗi feature MVP liên kết tới ít nhất một learner problem.
- Không có teacher assignment, public leaderboard hoặc AI chat tự do trong MVP.
- Repository có một nguồn version control rõ ràng; nested Git được xử lý có chủ đích.
- Clean install → typecheck → test → bundle chạy được từ README.
- Content validator chặn thiếu đáp án, giải thích, skill ID và source record.

Test bắt buộc:

- clean-install smoke;
- schema/content validation tests;
- deterministic seed test;
- Android và web bundle smoke.

### M1 — UX direction và design foundation

**Thời lượng ước tính:** 2 tuần  
**Mục tiêu:** chốt hướng UX và chứng minh nội bộ rằng luồng tự học đủ rõ để bước sang vertical slice thật.

Đầu ra:

- sitemap và six-core-flow wireframes;
- prototype bấm được;
- design tokens, typography, icon direction và component inventory;
- state catalogue: loading, empty, error, offline, permission denied;
- owner review vòng 1 và internal UX self-audit;
- research kit sẵn sàng cho vòng học sinh thật sau khi bản local vertical slice đủ ổn để đưa thử.

Gate M1:

- Có prototype bấm được cho sáu luồng lõi: onboarding, chẩn đoán, kết quả, Hôm nay, bài học và phát âm mô phỏng.
- Owner manual review xác nhận luồng tự học hợp lý ở mức prototype và không còn P0/P1 về nghiệp vụ.
- UI self-audit xác nhận màn hình không còn kiểu dashboard/AI-template gây hiểu nhầm, đặc biệt ở kết quả và tiến độ.
- Người dùng lớp 9 thấy được khu thi vào 10 khi chọn đúng hồ sơ; học sinh lớp 6–8 không thấy mục tiêu này.
- Kết quả chẩn đoán nói rõ độ tin cậy thấp, không cho một câu trả lời biến thành `Khá vững`.
- Contrast, touch target và nhãn accessibility pass ở mức code/static audit; Android TalkBack/font-scale chuyển sang M2 khi có test device/emulator.

Test bắt buộc:

- owner scripted manual test;
- contrast/touch target audit;
- font scale 200% visual pass ở web phone frame, Android xác nhận ở M2;
- prototype task completion log.

**Không qua M1:** không xây backend và không sản xuất ngân hàng content lớn.  
**Ghi chú gate:** 8–12 học sinh thật không còn là điều kiện để pass M1 vì app ở M1 chưa đủ hoàn chỉnh để đưa cho learner thật. Nghiên cứu này vẫn bắt buộc trước private beta và được đưa vào M7/M8; các kiểm chứng nhỏ có thể chạy sau M2 khi luồng local đã ổn.

### M2 — Local vertical slice chất lượng thật

**Thời lượng ước tính:** 3–4 tuần  
**Mục tiêu:** toàn bộ core loop chạy offline với local data và kiến trúc có thể kiểm thử.

Đầu ra:

- navigation và screen architecture tách khỏi `App.tsx`;
- onboarding, diagnostic, result, Today, lesson, mock pronunciation, mistake notebook, progress;
- mastery có confidence, prerequisite-aware recommendation;
- local persistence có migration/version;
- component primitives và accessibility contract.

Gate M2:

- App cold start không cần backend.
- Core loop chạy từ đầu đến cuối và giữ progress sau restart.
- Diagnostic đang làm dở được giữ lại khi thoát/restart.
- Một câu trả lời không thể tạo 100% mastery; result nói rõ khi confidence thấp.
- Thoát app giữa diagnostic/lesson không làm mất câu đã lưu.
- Mock pronunciation được gắn nhãn ở code, UI và README.
- Không còn P0/P1; test suite pass ba lần liên tiếp từ clean state.

Test bắt buộc:

- unit: diagnostic, mastery, confidence, prerequisite recommendation, review schedule;
- component: mỗi màn hình với happy/error/empty state;
- integration: storage save/load/migration/corrupt data fallback;
- web phone-frame E2E: first-run core loop, resume after restart, return learner, mistake retry và pronunciation mock;
- Android bundle smoke;
- Android runtime/TalkBack smoke: required before M7 APK, and earlier if Android SDK/emulator becomes available.

### M3 — Content engine và learning quality

**Thời lượng ước tính:** 2–3 tuần  
**Mục tiêu:** content là dữ liệu có version và chất lượng đo được, không nằm cứng trong UI.

Đầu ra:

- skill graph và prerequisite rules v1;
- versioned lesson/question/pronunciation/exam schemas;
- draft → reviewed → published → archived workflow;
- hai topic đại diện mỗi lớp và một grade-9 exam sample;
- report-content-error flow.

Gate M3:

- 100% published items có source, explanation, skill tag, revision và reviewer.
- Nếu prototype chưa có published item, validator và test phải chặn việc publish thiếu các trường trên; không dùng tập published rỗng để khẳng định nội dung đã được duyệt.
- Không có MCQ trùng đáp án hoặc khác không đúng duy nhất một đáp án.
- Mỗi lesson có learning objective và exit check.
- Tối thiểu hai người duyệt độc lập sample grade 9/exam; bất đồng được ghi lại.
- Content có thể thay đổi mà không sửa component UI.

Test bắt buộc:

- schema and referential-integrity tests;
- duplicate/answer uniqueness tests;
- deterministic scoring tests;
- hai phiếu duyệt độc lập sample lớp 9/thi và owner walkthrough nội bộ về mục tiêu, lời giải, báo lỗi.

Quan sát học sinh thật về mức hiểu lời giải được dời sang gate M7, sau khi app có build Android đủ ổn để đưa người ngoài team thử. Quyết định này giữ đúng nguyên tắc đã áp dụng ở M1: không yêu cầu học sinh thật thử một prototype còn dang dở, nhưng không bỏ kiểm chứng trước private beta.

### M4 — Backend, account và sync

**Thời lượng ước tính:** 3–4 tuần  
**Mục tiêu:** dữ liệu học đồng bộ an toàn mà không phá offline-first.

Đầu ra:

- NestJS modular monolith + PostgreSQL migrations;
- versioned REST API, auth/guest migration;
- catalog, attempts, mastery, mistakes và recommendation endpoints;
- offline queue, retry/idempotency và conflict policy;
- delete-my-data flow;
- CI cho API, database và contract.

Gate M4:

- API contract versioned và mobile contract tests pass.
- Gửi lại cùng attempt không tạo điểm/mastery trùng.
- Offline answer sync sau reconnect, không mất hoặc nhân đôi.
- Guest → account giữ nguyên progress.
- Delete flow xóa dữ liệu theo chính sách và có verification test.
- Không có secret trong mobile bundle hoặc repository.

Test bắt buộc:

- unit/service tests;
- API integration với database thật trong CI;
- contract tests mobile ↔ API;
- offline/retry/conflict E2E;
- auth authorization matrix;
- migration up/down trên database test.

### M5 — Phát âm thật

**Thời lượng ước tính:** 2–3 tuần  
**Mục tiêu:** feedback phát âm có ích, minh bạch và bảo vệ dữ liệu trẻ vị thành niên.

Đầu ra:

- provider adapter sau backend proxy;
- permission/consent states;
- record, playback, upload, timeout, retry và fallback;
- Vietnamese remediation catalogue;
- cost, latency và deletion observability.

Gate M5:

- API key không xuất hiện trong APK/mobile traffic trực tiếp tới provider nếu kiến trúc yêu cầu proxy.
- Không thu âm trước explicit action; denial không chặn các phần học khác.
- Raw audio bị xóa theo policy và được xác minh bằng integration test.
- Ít nhất 8/10 learner trials hiểu feedback và biết lần sau cần sửa gì.
- P95 round trip đạt mục tiêu được chốt sau provider spike; timeout có fallback rõ ràng.
- Có cost ceiling/session và kill switch.

Test bắt buộc:

- adapter contract tests với recorded fixtures;
- permission denied/interrupted/background/timeout tests;
- upload retry và deletion verification;
- physical-device microphone E2E;
- manual review với giọng học sinh ở nhiều mức độ.

### M6 — Chế độ thi vào 10

**Thời lượng ước tính:** 2–3 tuần  
**Mục tiêu:** lớp 9 luyện đúng cấu trúc đề và nhận kế hoạch ôn có thể hành động.

Đầu ra:

- versioned province/year exam template;
- practice by question type;
- timed mock, autosave/resume, submit và breakdown;
- readiness trend và recommendation nối về prerequisite grades 6–8.

Gate M6:

- Scoring khớp answer key và rule của template trên golden test set.
- Background, force-close và mất mạng không làm mất bài đang thi.
- Timer dùng nguồn thời gian đúng, không bị kéo dài bởi pause/resume ngoài policy.
- Template sai version bị chặn publish.
- Học sinh hiểu “mất điểm ở đâu” và tìm được bài cần ôn tiếp.

Test bắt buộc:

- golden scoring tests;
- boundary tests cho timer/submit/blank answers;
- resume and offline E2E;
- content-template compatibility tests;
- manual comparison với đề nguồn đã duyệt.

### M7 — Alpha hardening và APK nội bộ

**Thời lượng ước tính:** 2 tuần  
**Mục tiêu:** biến feature set thành build ổn định có thể đưa cho người ngoài team.

Đầu ra:

- signed internal APK/build pipeline;
- crash/error reporting phù hợp quyền riêng tư;
- minimal analytics theo product questions;
- network/performance budget;
- privacy notice, account deletion và support/report flow;
- release checklist và rollback plan.

Gate M7:

- Full E2E pass trên release build.
- Không P0/P1, P2 release blockers đã đóng.
- 30 phút exploratory test trên ít nhất hai thiết bị Android, gồm một máy cấu hình thấp.
- Cold start, memory, download size và API latency có baseline; không có regression chưa giải thích.
- Analytics không chứa câu trả lời tự do, audio hoặc PII ngoài policy.
- Có thể rollback content và app release.
- Quan sát ít nhất 2–3 học sinh đúng nhóm tuổi: tự hoàn thành một bài ngắn và giải thích được vì sao đáp án sai, không cần người lớn hướng dẫn từng bước; ghi lại điểm không hiểu để sửa trước private beta.

Test bắt buộc:

- release-build smoke/E2E;
- upgrade từ build trước;
- flaky-network/background/low-storage scenarios;
- accessibility regression;
- security/privacy checklist.

### M8 — Private beta hai tuần

**Thời lượng:** 2 tuần sử dụng + 1 tuần tổng hợp  
**Mục tiêu:** chứng minh app có ích trong đời thật, không chỉ chạy đúng.

Đầu ra:

- 10–20 học sinh dùng build;
- cohort dashboard tối thiểu;
- issue/content-error triage hằng ngày;
- interviews đầu/cuối beta;
- beta report với quyết định keep/change/defer/reject.

Gate M8:

- Ít nhất 10 học sinh có dữ liệu hợp lệ.
- Ít nhất 60% hoàn thành từ ba session trong hai tuần.
- Repeated skill checks cho thấy xu hướng cải thiện, không tuyên bố nhân quả quá mức.
- Feedback phát âm tạo hành vi retry có ý nghĩa và học sinh mô tả được điều cần sửa.
- Không có raw audio bị lưu ngoài consent/policy.
- Mọi content error P0/P1 được sửa hoặc gỡ publish mà không cần app release.

Test bắt buộc:

- production telemetry sanity;
- daily P0/P1 review;
- sample audit giữa event log và hành vi thật;
- post-beta regression suite;
- qualitative interview synthesis.

### M9 — Play internal testing và mở rộng có kiểm soát

**Thời lượng:** 2–4 tuần cho release readiness; content tiếp tục theo đợt  
**Mục tiêu:** phát hành an toàn và chỉ mở rộng phần đã có bằng chứng.

Đầu ra:

- store assets, privacy/data-safety declarations và internal testing release;
- staged rollout/rollback process;
- grade-9 core content plan;
- thứ tự mở rộng grade 8 → 7 → 6;
- AI explanation chỉ khi có eval set và fallback được duyệt.

Gate M9:

- Store declarations khớp hành vi app và SDK thực tế.
- Release candidate vượt full regression, security/privacy và device matrix.
- Crash-free/session và product metrics có threshold/alert được chốt từ beta baseline.
- Mỗi content pack mới qua cùng M3 gate.
- Tính năng AI mới có offline eval, cost ceiling, safety fallback và human-reviewed source grounding.

## 6. Test matrix theo luồng lõi

| Luồng | Unit | Component | Integration | E2E | Test tay/người dùng |
|---|---:|---:|---:|---:|---:|
| Onboarding/profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Diagnostic/result | ✓ | ✓ | ✓ | ✓ | ✓ |
| Recommendation/prerequisite | ✓ | ✓ | ✓ | ✓ | ✓ |
| Lesson/explanation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mistake review | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pronunciation | ✓ | ✓ | ✓ | ✓ | ✓ thiết bị thật |
| Offline/sync | ✓ | ✓ | ✓ | ✓ | ✓ mạng yếu |
| Exam/timer/scoring | ✓ | ✓ | ✓ | ✓ | ✓ |
| Delete my data | ✓ | ✓ | ✓ | ✓ | ✓ verification |

## 7. Mẫu biên bản qua cổng

Sao chép [gates/TEMPLATE.md](gates/TEMPLATE.md) thành `docs/gates/MX-YYYY-MM-DD.md` cho mỗi lần review:

```text
Milestone:
Build/commit:
Reviewer:
Ngày:

Acceptance criteria: PASS / FAIL
Automated tests: PASS / FAIL (link log)
Android E2E: PASS / FAIL (link artifact)
Manual/device test: PASS / FAIL (device/build)
Usability/content review: PASS / FAIL / N/A (evidence)
Open P0/P1/P2:
Known limitations:

Decision: PASS / FAIL
Next milestone unlocked: YES / NO
```

## 8. Thứ tự công việc ngay từ trạng thái hiện tại

1. Không thêm feature mới trong prototype hiện tại.
2. Đóng các khoảng trống M0: root Git, CI cơ bản, content validator và research kit.
3. M1 đã pass bằng wireframe, prototype, design foundation, owner manual review và internal self-audit; learner research thật chuyển sang khi có bản đủ ổn cho học sinh.
4. M2 đã pass bằng local vertical slice, persistence, mastery/recommendation, mistake notebook, web phone-frame E2E và Android/web bundle smoke.
5. M3 đã pass ở phạm vi prototype content engine, với hai phiếu duyệt sample lớp 9/thi và chín item `reviewed`; learner comprehension thật vẫn là điều kiện M7 trước beta.
6. Đang thực hiện M4 backend/sync theo lát cắt nhỏ, giữ app local-first cho tới khi API và offline queue được kiểm thử.
7. Phát âm thật và thi vào 10 được xây thành hai milestone độc lập để không che lấp rủi ro của nhau.
8. AI generative feature đứng sau beta evidence; deterministic personalization đi trước.
