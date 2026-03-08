# Happy Women's Day 8/3 – Mini Greeting Page

Trang web nhỏ chúc mừng ngày 8/3 chỉ dùng **HTML + CSS + JavaScript thuần**, không phụ thuộc framework.

## Cấu trúc chính

- `index.html` – entry, load CSS + JS.
- `styles.css` – toàn bộ style, animation (gradient, hoa, tuyết, thỏ, ảnh bay...).
- `js/config.js` – text, cấu hình nhạc, số lượng tuyết/ảnh, đường dẫn ảnh kỷ niệm.
- `js/helpers.js` – hàm helper chung (`createElement`, `typeText`,...).
- `js/components.*.js` – các component giao diện:
  - `components.intro.js` – màn intro (ảnh 1).
  - `components.sceneMain.js` – màn chính, tiêu đề + bó hoa + thỏ + tuyết/sao băng (ảnh 2–3).
  - `components.letterOverlay.js` – overlay lá thư gõ chữ (ảnh 4).
  - `components.photoRain.js` – ảnh kỷ niệm bay từ dưới lên (ảnh 5).
- `assets/` – nơi bạn đặt nhạc và hình.

## Chuẩn bị assets

1. **Nhạc**

   - Đặt file nhạc của bạn vào: `./assets/music.mp3`.
   - Có thể đổi đường dẫn trong `js/config.js` nếu muốn tên khác.

2. **Ảnh**

   - Intro + bó hoa đang dùng sẵn các ảnh mẫu đã được import sẵn trong repo (các file `.png` trong thư mục `assets/`).
   - Ảnh kỷ niệm:
     - Tạo thư mục: `./assets/photos/`
     - Thêm các file: `photo1.jpg`, `photo2.jpg`,... hoặc sửa danh sách `CONFIG.photos.sources` trong `js/config.js` trỏ đến ảnh bạn muốn.

## Chạy trang

Chỉ cần mở trực tiếp file `index.html` bằng trình duyệt (double-click) hoặc serve bằng một HTTP server tĩnh bất kỳ.

## Luồng hoạt động

1. Màn hình 1: câu hỏi + nút **“Oki, mở quà thôi !”**.
2. Bấm nút:
   - Chuyển sang nền trời đêm, hiện title *“Happy Women's Day 8/3”* trượt từ dưới lên.
   - Bó hoa trồi lên, tấm thiệp ở giữa + 2 chú thỏ nhảy hai bên.
   - Nhạc bắt đầu phát và tự lặp lại.
3. Bấm vào tấm thiệp:
   - Hiện overlay lá thư, nội dung gõ lần lượt: tiêu đề → nội dung → chữ ký + icon tim.
   - Khi gõ xong sẽ bật nút **“Tiếp tục”**.
4. Bấm **“Tiếp tục”**:
   - Đóng thư, kích hoạt hiệu ứng ảnh kỷ niệm nhỏ bay từ dưới lên, phân bố đều màn hình với góc xoay khác nhau.

Toàn bộ code được tách nhỏ, dễ chỉnh sửa text, hình và hiệu ứng theo ý bạn.

