# EngPath — M1 sitemap và task flow

Status: Clickable candidate v1  
Updated: 2026-09-15  
Scope: UX foundation, chưa phải feature-complete M2

## Sitemap

```text
Khởi động
├─ Lần đầu
│  ├─ Chọn lớp + mục tiêu
│  ├─ Giới thiệu chẩn đoán
│  ├─ Chẩn đoán từng câu
│  └─ Định hướng ban đầu
└─ Đã có hồ sơ
   └─ Hôm nay
      ├─ Học
      │  └─ Bài học: Hiểu → Thử → Giải thích → Hoàn thành
      ├─ Luyện
      │  ├─ Phát âm mô phỏng
      │  ├─ Sổ lỗi sai (empty state)
      │  └─ Thi vào 10 (chỉ lớp 9)
      ├─ Tiến độ
      └─ Hồ sơ + đặt lại bản mẫu
```

Bottom navigation chỉ xuất hiện sau onboarding và giữ bốn điểm đến quen thuộc: `Hôm nay`, `Học`, `Luyện`, `Tiến độ`. Hồ sơ nằm ở góc trên, không chiếm một tab.

## Sáu task flow lõi

1. **Onboarding:** chọn lớp → chỉ thấy mục tiêu hợp lệ → chọn mục tiêu → tiếp tục.
2. **Chẩn đoán:** đọc cam kết ngắn → trả lời từng câu hoặc chọn `Em chưa biết` → xem định hướng.
3. **Kết quả:** thấy điểm nên bắt đầu → hiểu độ tin cậy còn thấp → bắt đầu nhiệm vụ duy nhất.
4. **Hôm nay:** trong 10 giây xác định nhiệm vụ chính → bắt đầu bài → thấy mục ôn phát âm ở cấp thứ hai.
5. **Bài học:** hiểu quy tắc → chọn đáp án → xem giải thích đúng/sai → hoàn thành.
6. **Phát âm:** nghe mẫu mô phỏng → đọc mẹo → đếm ngược → mô phỏng thu → xem lại → nhận feedback → thử lại hoặc hoàn thành.

## Quyết định M1

### Giữ

- Một nhiệm vụ nổi bật trong `Hôm nay`.
- Giải thích lỗi bằng tiếng Việt.
- Khung điện thoại trên web để review nhanh.
- Local persistence cho hồ sơ và tiến độ mẫu.

### Thay đổi

- Tách màn hình và component khỏi `App.tsx`.
- Dùng màu indigo, nền xám xanh nhạt và tối đa ba cấp độ đậm chữ.
- Dùng bottom navigation bốn tab và SVG icon nội bộ thống nhất.
- Kết quả chẩn đoán dùng mức học + lượng bằng chứng, không dẫn bằng điểm 0–100.
- Phát âm có đủ state của luồng nhưng ghi rõ mọi audio/AI hiện là mô phỏng.

### Hoãn

- Navigation library, backend, tài khoản và sync tới M2/M4 theo kế hoạch.
- Thu âm và AI chấm thật tới M5, sau privacy/provider spike.
- Sổ lỗi sai đầy đủ tới M2 và ngân hàng đề tới M6.

### Loại khỏi core

- Teacher assignment, classroom management, public chat/ranking.
- AI chat tự do, gamification nặng và cơ chế phạt streak.

## Component inventory

- `Screen`: vùng cuộn + footer CTA cố định.
- `Button`, `TextButton`, `BackButton`: control tối thiểu 48 dp.
- `Pill`, `ProgressBar`, `EmptyState`: feedback không dựa riêng vào màu.
- `BottomTabs`: bốn tab có role/selected state.
- `Icon`: bộ SVG nội bộ, không dùng Unicode làm icon giao diện.
- Feature cards: mission, skill evidence, lesson feedback, pronunciation state.

Màu, spacing, radius và typography nằm tập trung tại `apps/mobile/src/ui/theme.ts`. Token chỉ là candidate cho tới khi qua contrast, Android viewport nhỏ và font scale 200%.
