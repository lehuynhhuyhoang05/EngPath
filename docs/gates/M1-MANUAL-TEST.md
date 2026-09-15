# M1 manual test — owner checklist

Build: local web phone preview / Android emulator later  
Tester:  
Date:  
Viewport/device:  

Ghi `PASS`, `FAIL` hoặc `BLOCKED` và mô tả ngắn. Chụp màn hình nếu có lỗi bố cục.

## A. First-run core flow

- [ ] Màn hình nằm trọn trong khung điện thoại; CTA `Tiếp tục` luôn nhìn thấy.
- [ ] Chọn lớp 6–8 thì mục tiêu `Ôn thi vào lớp 10` biến mất.
- [ ] Chọn lớp 9 thì mục tiêu thi vào 10 xuất hiện và chọn được.
- [ ] Đọc màn giới thiệu và hiểu bài chẩn đoán không phải kỳ thi/xếp hạng.
- [ ] Chọn `Em chưa biết`; nút câu tiếp theo bật và đi tiếp đúng.
- [ ] Hoàn thành chẩn đoán; kết quả không dùng điểm lớn 0–100 và nói rõ độ tin cậy.

## B. Today + navigation

- [ ] Trong tối đa 10 giây, xác định được nhiệm vụ nên học hôm nay.
- [ ] Bốn tab `Hôm nay / Học / Luyện / Tiến độ` đều bấm được, trạng thái đang chọn rõ.
- [ ] Với lớp 9 + mục tiêu thi vào 10, khu thi xuất hiện; đây là shell và không giả có đề thật.
- [ ] Đặt lại với lớp 7; khu thi không làm nhiễu màn Hôm nay và tab Luyện ghi rõ phạm vi.

## C. Lesson

- [ ] Chọn một đáp án sai → `Kiểm tra đáp án` → thấy vì sao sai và ví dụ gần giống.
- [ ] Đặt lại/chạy lại và chọn đúng → feedback đúng hiển thị bằng icon + text.
- [ ] `Báo nội dung có vấn đề` phản hồi rõ, không làm mất lựa chọn.
- [ ] `Hoàn thành bài` quay về Hôm nay và số buổi/bài đã học tăng.

## D. Pronunciation mock

- [ ] Nhãn `Mô phỏng UX` và thông báo không thu/gửi âm thanh đủ dễ thấy.
- [ ] Đi qua `Nghe mẫu → Thu bản thử → đếm ngược → dừng → phản hồi` được.
- [ ] Hiểu một âm/từ cần sửa và hành động cụ thể cho lần thử sau.
- [ ] `Thử lại` quay đúng trạng thái ban đầu; `Hoàn thành` về tab Luyện.
- [ ] Mở state từ chối micro; vẫn có lối tiếp tục không dùng micro.

## E. Persistence + visual/accessibility

- [ ] Reload app: hồ sơ, diagnostic và tiến độ đã hoàn thành vẫn còn.
- [ ] Profile → `Đặt lại để xem onboarding` cần xác nhận và xóa state đúng.
- [ ] Thử viewport khoảng 360 × 640: không có chữ/control tràn ngang, CTA không bị che.
- [ ] Zoom/font scale 200%: vẫn hiểu luồng, nội dung cuộn được, CTA không chồng chữ.
- [ ] Dùng bàn phím/Tab trên web: focus đi theo thứ tự hợp lý và mọi control kích hoạt được.
- [ ] Màu chữ dễ đọc; đúng/sai không phụ thuộc riêng vào màu.

## Kết quả

- P0/P1:
- P2: Vòng 1 có visual language quá giống template AI; quá nhiều card bo tròn, pill và icon box.
- Điểm khó hiểu nhất: Không ghi nhận vấn đề business flow trong phản hồi vòng 1.
- Màn hình cần chỉnh nhất: Toàn bộ visual system, không phải một màn riêng lẻ.
- Quyết định owner: **FIX AND RETEST** — functional/business flow có vẻ ổn; visual direction chưa được duyệt.

## Vòng 2

- Build/commit: `6276e4f`
- [ ] Visual mới có cảm giác được thiết kế có chủ đích, không còn kiểu AI dashboard.
- [ ] Ít card/pill hơn nhưng thứ bậc và vùng bấm vẫn rõ.
- [ ] Màu xanh lá đậm + vermilion không gây cảm giác quá trẻ con hoặc quá doanh nghiệp.
- [ ] Onboarding, Hôm nay, Lesson và Phát âm cùng một ngôn ngữ hình ảnh.
- Quyết định owner: PASS / FIX AND RETEST

## Vòng 3

- Build/commit: pending final commit
- [x] Progress không còn dùng thống kê ba cột và thanh mastery phần trăm gây cảm giác dashboard AI.
- [x] Kết quả học tập dùng nhãn theo lượng bằng chứng, không cho một câu đúng thành `Khá vững`.
- [x] Copy học sinh bỏ các thuật ngữ nội bộ như milestone, khung UX hoặc điểm AI.
- [x] Onboarding không mặc định ép mục tiêu thi vào 10; thi vào 10 vẫn hiện đúng cho lớp 9.
- [x] Diagnostic giữ lại bản làm dở khi thoát/restart.
- Quyết định M1: **PASS FOR M1** — đủ đóng prototype/design/flow gate và mở M2; Android device/TalkBack/font-scale thật chuyển sang M2.
