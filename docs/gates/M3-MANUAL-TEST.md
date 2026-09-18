# M3 — Kiểm tra tay trên khung điện thoại local

Mở `http://localhost:8082` khi dev server chạy. Nếu không còn chạy, từ `apps/mobile` chạy `npm run web -- --port 8082 --host localhost`. Dùng hồ sơ thử nghiệm; chức năng phát âm vẫn mô phỏng, mẫu đề M3 mới là dữ liệu và chưa có màn làm đề (màn thi thuộc M6).

## 1. Nội dung theo lớp

1. Đặt lại hồ sơ trong màn Hồ sơ, chọn lớp 8, làm chẩn đoán. Kỳ vọng có 12 câu; câu đọc hiểu hỏi ý chính đoạn văn và hiển thị trọn văn bản trên khung điện thoại.
2. Ở tab Học, mở bài “Ý chính đoạn văn”. Kỳ vọng thấy mục tiêu học, quy tắc, ví dụ và câu kiểm tra cuối bài khác câu chẩn đoán. Thử đáp án sai và đúng; lời giải phải dễ hiểu và không tràn ngang.
3. Đặt lại, chọn lớp 9. Kỳ vọng chẩn đoán có 14 câu, khu ôn thi vào 10 xuất hiện, nhưng chưa tự nhận có đề tỉnh thật.

## 2. Báo lỗi nội dung

1. Ở câu chẩn đoán, bấm “Báo nội dung có vấn đề”, chọn một lý do. Kỳ vọng thông báo “Đã lưu báo cáo trên máy. Báo cáo chưa được gửi...”. Tải lại trang ngay tại câu đó; thông báo còn.
2. Trong bài học, thử báo lỗi câu kiểm tra cuối bài rồi tải lại. Kỳ vọng báo cáo còn, câu trả lời đã chọn vẫn còn.
3. Ở màn Phát âm mô phỏng, báo “Câu luyện có vấn đề”. Kỳ vọng thông báo lưu cục bộ; app không xin quyền micro và không gửi âm thanh.
4. Đặt lại toàn bộ hồ sơ. Kỳ vọng các báo cáo cục bộ bị xóa cùng tiến độ mẫu.

Ghi lại: viewport/kích thước máy, thao tác không đúng kỳ vọng, ảnh màn hình (nếu có), mức lỗi P0/P1/P2/P3 và nhận xét câu nào khó hiểu. Đây là kiểm tra owner trên web; Android runtime/TalkBack vẫn cần kiểm tra khi có công cụ hoặc thiết bị.
