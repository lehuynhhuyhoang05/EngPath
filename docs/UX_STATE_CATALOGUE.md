# EngPath — M1 state catalogue

Status: Review candidate  
Updated: 2026-09-15

| State | Khi xảy ra | Nội dung chính | Hành động | Prototype M1 |
|---|---|---|---|---|
| Loading | Đọc local storage / mở màn | `Đang mở lộ trình…` và brand mark | Tự hoàn tất, không CTA giả | Có trong app startup |
| Empty | Chưa có tiến độ/sổ lỗi | Nói rõ chưa có dữ liệu và cách tạo dữ liệu | Bắt đầu chẩn đoán hoặc quay về nhiệm vụ | Component + màn Tiến độ/Sổ lỗi |
| Error | Không đọc được dữ liệu/nội dung | Không đổ lỗi người học; giữ input hiện tại | Thử lại, về Hôm nay, báo lỗi | Wireframe; error API thật thuộc M4 |
| Offline | Mất mạng | `Em vẫn có thể học phần đã tải`; không giả đồng bộ thành công | Tiếp tục offline, thử đồng bộ lại | Wireframe; app M1 vốn local-only |
| Micro denied | Từ chối quyền micro | Phần khác vẫn dùng được; chỉ dẫn mở Settings | Thử cấp quyền lại hoặc tiếp tục không micro | Clickable trong màn Phát âm |
| Recording interrupted | App background/cuộc gọi | Không gửi bản thu dở; giải thích cần thu lại | Thu lại | Wireframe; native behavior thuộc M5 |
| Speech timeout | Provider quá chậm | Không kết luận phát âm sai | Thử lại hoặc học không chấm | Wireframe; provider thuộc M5 |
| Stale content | Version nội dung không còn hợp lệ | Không chấm câu cũ | Tải lại content | Wireframe; version enforcement thuộc M3/M4 |

## Wireframe cho error/offline

```text
┌ Không thể tải phần mới ─────────────┐
│ Tiến độ trên máy vẫn an toàn.       │
│ [Thử lại]                           │
│ Tiếp tục với bài đã tải             │
└─────────────────────────────────────┘
```

## Accessibility contract

- Control lõi tối thiểu 48 × 48 dp; bottom tab tối thiểu 64 dp chiều cao.
- Pressable có role, label và selected/disabled state phù hợp.
- Thông báo đếm ngược, feedback và xác nhận dùng live region.
- Đúng/sai luôn có icon + text, không chỉ đổi màu.
- CTA chính ở footer riêng, không bị nội dung cuộn đẩy ra khỏi viewport.
- Chưa tuyên bố PASS contrast, focus order hoặc font scale cho tới khi checklist manual được chạy.
