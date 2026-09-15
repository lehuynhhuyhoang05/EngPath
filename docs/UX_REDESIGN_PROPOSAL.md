# EngPath — Đề xuất thiết kế lại UI/UX

Status: Proposed v1.0  
Phạm vi: Android-first, học sinh Việt Nam lớp 6–9  
Quyết định đề xuất: thiết kế lại theo hướng **Study Coach**, chưa mở rộng thêm tính năng trước khi luồng lõi được kiểm chứng

## 1. Kết luận

Bản hiện tại đã đủ để kiểm tra luồng kỹ thuật, nhưng chưa nên dùng làm nền hình ảnh cuối cùng. Vấn đề chính không phải chỉ là bảng màu mà là thứ bậc thông tin, độ tin cậy của kết quả học tập và cảm giác sử dụng hằng ngày.

Hướng nên chọn là một “người bạn học có phương pháp”:

- hiện đại, sáng và có năng lượng nhưng không trẻ con;
- mỗi màn hình chỉ có một hành động chính;
- luôn cho học sinh biết hôm nay nên làm gì và vì sao;
- phân biệt rõ chế độ học thường với chế độ thi vào 10;
- phản hồi phát âm cụ thể, có thể thử lại ngay;
- không biến việc học thành chuỗi điểm số hoặc bảng xếp hạng gây áp lực.

## 2. Đánh giá bản hiện tại

### Giữ lại

- Luồng onboarding → chẩn đoán → kết quả → nhiệm vụ → bài học → phát âm → tiến độ.
- Một nhiệm vụ được đề xuất nổi bật trên trang chủ.
- Giải thích lỗi bằng tiếng Việt ngay sau khi trả lời.
- Trạng thái phát âm mô phỏng được ghi rõ, không giả là kết quả AI thật.
- Khung điện thoại trên web phục vụ kiểm tra nhanh tại laptop.

### Thiết kế lại ngay

1. **Thứ bậc hình ảnh:** quá nhiều cỡ chữ lớn và `fontWeight: 900`; gần như mọi thành phần cùng “hét”, nên người dùng khó biết điểm cần nhìn đầu tiên.
2. **Mật độ thẻ:** màn hình có nhiều khối bo tròn cùng trọng lượng thị giác. Thẻ chỉ nên dùng cho nội dung có ranh giới hoặc hành động rõ ràng.
3. **Onboarding:** nội dung dài, CTA dễ nằm dưới nếp gấp màn hình. Chọn lớp và mục tiêu nên hoàn thành nhanh trên một màn hình hoặc hai bước rất ngắn.
4. **Điều hướng:** state machine một file phù hợp prototype nhưng không tạo mô hình điều hướng quen thuộc. Sau onboarding cần bottom navigation ổn định.
5. **Kết quả chẩn đoán:** điểm 0–100 sau rất ít câu tạo cảm giác chính xác giả. Cần hiển thị mức `Cần củng cố / Đang tiến bộ / Khá vững` và độ tin cậy; chỉ đưa điểm chi tiết khi đã đủ số quan sát.
6. **Tiến độ:** không được coi một câu đúng là 100% thành thạo. Tiến độ phải thể hiện cả mức độ và lượng bằng chứng.
7. **Phát âm:** thiếu nút nghe mẫu nổi bật, trạng thái xin quyền micro, đếm ngược, phát lại bản thu và phản hồi theo từ/âm.
8. **Icon:** ký tự Unicode chỉ phù hợp bản nháp. Cần một bộ icon vector nhất quán, có nhãn accessibility.
9. **Trạng thái hệ thống:** chưa có thiết kế cho loading, empty, offline, lỗi API, quyền micro bị từ chối và nội dung đã hết hạn.
10. **Kiến trúc UI:** `App.tsx` chứa toàn bộ màn hình và style, làm việc chỉnh UX và viết component test trở nên khó khăn.

### Hoãn

- Avatar phức tạp, cửa hàng vật phẩm và gamification nặng.
- AI chat tự do.
- Theme theo từng khối lớp.
- Animation 3D hoặc minh họa tốn nhiều tài nguyên.
- Dark mode trước private beta.

### Loại bỏ

- Bảng xếp hạng công khai và cơ chế phạt mất streak.
- Dashboard giao bài cho giáo viên.
- Điểm AI hoặc nhãn “yếu” khi chưa đủ bằng chứng.
- Tự phát audio hoặc tự bật micro.
- Nhiều CTA chính cạnh tranh trên cùng màn hình.

## 3. Hướng hình ảnh đề xuất: Study Coach

### Tính cách

`Rõ ràng + ấm áp + có động lực + đáng tin`.

Không dùng phong cách quá trẻ con như app tiểu học, cũng không biến toàn bộ app thành giao diện luyện đề căng thẳng. Chế độ thi vào 10 có thể đậm và tập trung hơn nhưng vẫn dùng cùng design system.

### Hệ thống hình ảnh ban đầu

- Nền chính: trắng hoặc xám xanh rất nhạt, hạn chế nền kem phủ toàn app.
- Màu chính: xanh cobalt/indigo để tạo cảm giác tin cậy.
- Màu hỗ trợ: mint cho tiến bộ, amber cho cần chú ý, đỏ chỉ dùng cho lỗi thật sự.
- Typography: tối đa ba mức độ đậm; nội dung dài dùng regular/medium, tiêu đề dùng semibold/bold.
- Grid spacing: bội số 4; khoảng cách màn hình ưu tiên 16/20/24.
- Bo góc: 12–16 cho control, 20–24 chỉ cho hero card.
- Touch target: tối thiểu 48 × 48 dp.
- Màu chữ thường đạt contrast 4.5:1; trạng thái đúng/sai luôn có icon hoặc text, không dựa riêng vào màu.

Các token chỉ được chốt sau khi đo contrast và xem trên một máy Android màn hình nhỏ; không lấy mockup web làm chuẩn duy nhất.

## 4. Kiến trúc thông tin

Sau onboarding, ứng dụng có bốn tab:

1. **Hôm nay:** nhiệm vụ chính, review đến hạn, streak nhẹ nhàng.
2. **Học:** chủ đề theo lớp, lộ trình và phần sửa nền tảng.
3. **Luyện:** phát âm, sổ lỗi; lớp 9 có thêm thi vào 10.
4. **Tiến độ:** bản đồ kỹ năng, lịch sử và mục tiêu.

Hồ sơ và cài đặt nằm ở góc trên, không cần tab riêng trong MVP.

## 5. Luồng màn hình đề xuất

### Onboarding

- Màn 1: chọn lớp và mục tiêu trên cùng một trang, CTA sticky ở cuối.
- Màn 2: giải thích chẩn đoán trong 2–3 câu, nêu thời lượng và quyền riêng tư.
- Không buộc đăng ký tài khoản.
- Nếu chọn lớp 6–8, ẩn mục tiêu thi vào 10 thay vì để người dùng chọn rồi tự đổi ngầm.

### Chẩn đoán

- Một câu mỗi màn hình, progress có `Câu 3/10` và thanh tiến độ.
- Có lựa chọn “Em chưa biết” để giảm đoán mò.
- Không cho biết đúng/sai giữa bài nếu điều đó làm sai lệch câu sau.
- Cho phép thoát và tiếp tục khi dữ liệu được lưu.

### Kết quả

- Dẫn bằng câu trả lời: “Nên bắt đầu từ đâu?”, không dẫn bằng một số điểm lớn.
- Hiển thị 2–3 nhóm kỹ năng có đủ bằng chứng.
- Mỗi nhận định có lý do ngắn: số câu đã quan sát và mức tin cậy.
- CTA duy nhất: “Bắt đầu nhiệm vụ đầu tiên”.
- Nếu bằng chứng ít, nói rõ đây là lộ trình tạm và sẽ cập nhật sau các buổi học.

### Trang Hôm nay

- Hero card: một nhiệm vụ, thời gian dự kiến và lợi ích cụ thể.
- Review đến hạn đặt ngay dưới nhiệm vụ.
- Streak là thông tin phụ; không dùng lời lẽ gây tội lỗi.
- Chế độ thi vào 10 chỉ nổi bật với học sinh lớp 9 đã chọn mục tiêu tương ứng.

### Lesson player

- Chia thành các bước ngắn: `Hiểu → Thử → Giải thích → Ôn lại`.
- CTA sticky, không bị đẩy khỏi màn hình.
- Khi sai, giải thích vì sao lựa chọn của học sinh sai và đưa một ví dụ gần giống.
- Có nút báo lỗi nội dung.
- Tránh chuyển sang phát âm bắt buộc nếu bài học không có mục tiêu phát âm liên quan.

### Phát âm

Luồng chuẩn:

```text
Nghe mẫu → xem mẹo khẩu hình → bấm thu → đếm ngược
→ nói → nghe lại → nhận phản hồi → thử lại hoặc hoàn thành
```

Phản hồi theo ba tầng:

- kết quả dễ hiểu: `Rõ / Gần đúng / Thử lại`;
- từ hoặc âm cần sửa;
- một hành động cụ thể bằng tiếng Việt.

Điểm số nhà cung cấp chỉ là dữ liệu hỗ trợ, không phải toàn bộ trải nghiệm.

### Thi vào 10

- Một khu riêng trong tab Luyện, không trộn timer vào luồng học thường.
- Dashboard gồm mục tiêu điểm, mức sẵn sàng, dạng câu yếu và bài mock gần nhất.
- Sau bài mock, ưu tiên “mất điểm ở đâu và ôn gì tiếp theo” hơn huy hiệu.

## 6. Wireframe chữ tối thiểu

```text
HÔM NAY                         [Hồ sơ]
Chào Minh, mình học 12 phút nhé

┌ NHIỆM VỤ HÔM NAY ───────────────┐
│ Thì hiện tại đơn                 │
│ Sửa một lỗ hổng từ bài chẩn đoán │
│ 8 phút · 4 hoạt động             │
│ [Bắt đầu]                        │
└──────────────────────────────────┘

Ôn lại hôm nay                         3 câu
Phát âm: âm /θ/                        3 phút

[Hôm nay] [Học] [Luyện] [Tiến độ]
```

## 7. Cổng duyệt UX trước khi triển khai toàn bộ

Không chuyển sang xây backend hoặc thêm nhiều nội dung cho đến khi đạt đủ:

- Có prototype bấm được cho 6 luồng: onboarding, chẩn đoán, kết quả, bài học, phát âm và trang Hôm nay.
- Ít nhất 5 học sinh lớp 6–9 thử bản prototype; tối thiểu 4/5 tự hoàn thành ba tác vụ lõi mà không được hướng dẫn.
- Mỗi học sinh hiểu “hôm nay nên học gì” trong tối đa 10 giây ở trang Hôm nay.
- Người thử phân biệt được điểm mô phỏng, mức ước lượng và kết quả đã có đủ bằng chứng.
- Không còn CTA chính bị khuất ở viewport Android nhỏ mục tiêu.
- Tất cả control tương tác đạt tối thiểu 48 × 48 dp và có accessibility label phù hợp.
- Text thường đạt contrast 4.5:1; UI vẫn hiểu được khi phóng chữ lên 200% ở các luồng lõi.
- Có thiết kế được duyệt cho loading, empty, error, offline và microphone denied.
- Không còn lỗi P0/P1 sau usability test; P2 có owner và mốc xử lý.

## 8. Trình tự triển khai UI

1. Chốt sitemap, task flow và wireframe grayscale.
2. Test wireframe với học sinh trước khi polish màu sắc.
3. Chốt token và component foundation.
4. Tách `App.tsx` thành navigation, screens, features và UI primitives.
5. Làm lại onboarding + trang Hôm nay.
6. Làm lại diagnostic + result với confidence.
7. Làm lesson player + pronunciation.
8. Thêm progress, exam shell và các trạng thái hệ thống.
9. Chạy component, accessibility, E2E và usability gate.

Không cần làm mọi màn hình hoàn mỹ cùng lúc. Cần làm hoàn chỉnh một vertical slice bằng design system thật rồi mới nhân rộng.

