# M3 — Phiếu duyệt độc lập mẫu lớp 9

Catalogue revision: `engpath-prototype` / schema 1 / revision 1. Tất cả câu dưới đây là nội dung gốc do AI hỗ trợ soạn, trạng thái `draft`. Ba câu `exam-sample-*` là **bài luyện mô phỏng**, không nhận là đề chính thức của tỉnh hoặc năm học nào.

Mỗi người duyệt nhận một bản sao phiếu này, tự giải trước khi xem đáp án trong mã nguồn hoặc ý kiến của người còn lại. Sau đó kiểm tra ngữ pháp, tính tự nhiên, độ rõ của câu hỏi, đáp án khác có thể đúng hay không, mức phù hợp lớp 9 và phần giải thích tiếng Việt trong dữ liệu nội dung.

## Câu cần giải độc lập

| ID | Câu hỏi | A | B | C | D |
|---|---|---|---|---|---|
| `diag-relative-clause-01` | The student ___ won the contest is in my class. | which | who | where | when |
| `diag-first-conditional-01` | If it rains tomorrow, we ___ at home. | stay | stayed | will stay | would stay |
| `exit-relative-clause-01` | The teacher ___ helped me is very kind. | which | who | where | when |
| `exit-first-conditional-01` | If you study tonight, you ___ the lesson better. | understand | understood | will understand | would understand |
| `exam-sample-conditional-01` | If Mai finishes her homework early tonight, she ___ her cousin tomorrow. | called | has called | will call | would call |
| `exam-sample-relative-01` | The volunteer ___ helped us lives nearby. | which | who | where | when |
| `exam-sample-reading-01` | At the end of each term, students at Hoa’s school exchange books they have finished reading. Each student can take home a different book without buying a new one. What is the passage mainly about? | A school book exchange | A new bookshop near school | How to write a novel | Why students stop reading |

Hai bài học lớp 9 đi kèm là `lesson-relative-clause-01` và `lesson-first-conditional-01`. Người duyệt mở app để xem mục tiêu, quy tắc, ví dụ, phần giải thích đáp án và luồng báo lỗi, rồi ghi nhận nếu có câu nào quá khó hoặc dễ hiểu sai. Với bài luyện thi, đánh giá như một mẫu luyện kỹ năng ngắn; **không** đánh giá mức độ giống đề thi tỉnh khi chưa có nguồn đề chính thức.

## Mẫu ghi kết quả cho từng người duyệt

Người duyệt: __________  Chuyên môn/đơn vị: __________  Ngày: __________

| ID | Đáp án tự giải | Có đáp án khác hợp lý? | Giải thích tiếng Việt đúng/rõ? | Quyết định `pass/revise/reject` | Lỗi cụ thể và đề xuất sửa |
|---|---|---|---|---|---|
| `diag-relative-clause-01` | | | | | |
| `diag-first-conditional-01` | | | | | |
| `exit-relative-clause-01` | | | | | |
| `exit-first-conditional-01` | | | | | |
| `exam-sample-conditional-01` | | | | | |
| `exam-sample-relative-01` | | | | | |
| `exam-sample-reading-01` | | | | | |

Kiểm tra bài học và UX (mục tiêu, quy tắc, ví dụ, giải thích, báo lỗi): __________

Đánh giá tổng thể theo [rubric](../../.agents/skills/engpath-content-lab/references/quality-rubric.md): Accuracy __/2, Clarity __/2, Pedagogy __/2, Grade fit __/2, Distractors __/2, Vietnamese support __/2, Metadata __/2. Tổng __/14.

Người tổng hợp sau khi có **hai phiếu riêng biệt** ghi bất đồng, quyết định sửa và ID phiên bản mới vào biên bản gate M3. Không tự động chuyển nội dung sang `reviewed` hoặc `published` chỉ vì test chạy xanh.
