# M2 manual test — local vertical slice

Build:
Tester:
Date:
Viewport/device:

Ghi `PASS`, `FAIL` hoặc `BLOCKED` và mô tả ngắn. M2 chưa pass nếu còn P0/P1 trong core loop.

## A. Diagnostic persistence

- [ ] Reset app, chọn lớp và mục tiêu, bắt đầu diagnostic.
- [ ] Chọn 2 câu, bấm `Thoát`, quay lại diagnostic và thấy câu đã chọn vẫn còn.
- [ ] Reload app giữa diagnostic; app tiếp tục đúng câu đang làm dở.
- [ ] Đổi lớp khác thì diagnostic draft cũ không bị dùng sai.

## B. Lesson persistence

- [ ] Hoàn thành diagnostic và mở nhiệm vụ đầu tiên.
- [ ] Chọn đáp án trong bài học, quay lại Hôm nay, mở lại bài và thấy lựa chọn vẫn còn.
- [ ] Kiểm tra đáp án, reload app, mở lại bài và thấy feedback đúng/sai vẫn còn.
- [ ] Hoàn thành bài thì draft của bài đó được xóa và số buổi/bài tăng đúng.

## C. Mistake notebook

- [ ] Chọn sai trong bài học; tab `Luyện` hiện `Sổ lỗi sai` với số câu cần ôn.
- [ ] Mở `Sổ lỗi sai`; thấy câu sai, đáp án đã chọn, đáp án đúng và giải thích.
- [ ] Bấm `Ôn lại bài này`, chọn đáp án đúng và hoàn thành; lỗi chuyển khỏi danh sách active.
- [ ] Today chỉ hiện hàng `Ôn lỗi sai` khi đang có lỗi active.

## D. Mastery and recommendation

- [ ] Sau diagnostic, Progress hiển thị kỹ năng đã kiểm tra với lượng bằng chứng.
- [ ] Sau một câu đúng/sai trong lesson, Progress đổi số quan sát hoặc mức kỹ năng.
- [ ] Nếu prerequisite yếu hoặc chưa đủ dữ liệu, bài gợi ý ưu tiên sửa nền trước.
- [ ] Một câu đúng độc lập không làm kỹ năng thành `Khá vững`.

## E. Android and accessibility smoke

- [ ] Viewport nhỏ không tràn ngang ở Today, Lesson, Sổ lỗi sai và Progress.
- [ ] Font scale lớn vẫn đọc được; CTA không chồng chữ.
- [ ] TalkBack/focus order đi qua các control chính theo thứ tự hợp lý.
- [ ] Đúng/sai và trạng thái lỗi không phụ thuộc riêng vào màu.

## Kết quả

- Self-test evidence: `npm run e2e:web` pass ở 420 × 860 và 360 × 640; typecheck, lint, 29 tests, Android/web bundle và Expo doctor pass.
- P0/P1: none known.
- P2: Android runtime/TalkBack chưa chạy vì laptop hiện không có `adb`, `emulator` hoặc `maestro`.
- Quyết định: **PASS FOR M2 LOCAL VERTICAL SLICE** — Android runtime smoke carried to pre-APK gate.
