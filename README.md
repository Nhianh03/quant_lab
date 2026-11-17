# Quant Research Academy

Nền tảng tự học và nghiên cứu định lượng chuyên sâu trên máy cá nhân, thiết kế theo lộ trình **24 tháng** dành cho kỹ sư phần mềm xây dựng nền tảng toán học và vi cấu trúc thị trường để ứng tuyển vị trí Nghiên cứu Định lượng (Quantitative Researcher) tại các quỹ đầu cơ (Hedge Fund) Mỹ.

---

## 1. Triết Lý Học Thuật & Kiến Trúc 3 Tầng

Chương trình tập trung vào nền tảng toán định lượng và mảng nghiên cứu phía mua (Buy-Side P-Measure) kết nối sang định giá phái sinh cốt lõi, trải dài trên **8 học phần** (`M0`–`M7`): toán đại học nền tảng, vi cấu trúc sổ lệnh giới hạn (Limit Order Book) và phái sinh, xác suất nâng cao cùng quá trình Martingale, thống kê bền vững trong môi trường nhiễu cao, lý thuyết ma trận ngẫu nhiên (Random Matrix Theory) và chuỗi thời gian chế độ ẩn, giải tích ngẫu nhiên Itô, kỹ nghệ thiết kế tín hiệu thực chiến, đến quản trị danh mục lồi, mô hình rủi ro Barra và thực thi lệnh tối ưu.

Hệ thống tách biệt hoàn toàn mã nguồn giao diện khỏi kho học liệu theo ba tầng:

1. **Tầng 1 — Bài giảng cầu nối (`content/lessons/*.md`)**: **36 chuyên đề** biên soạn chuẩn giáo trình đại học, đi từ trực giác hình học, định nghĩa chặt chẽ, chứng minh từng bước các định lý phỏng vấn cốt lõi đến các bẫy dữ liệu thực tế.
2. **Tầng 2 — Chỉ mục giáo trình kinh điển & Ngân hàng luyện đề (`content/syllabus.json`, `content/library/READING_GUIDE.md` & `content/problems.json`)**: Gắn từng bài học với 108 mục đọc chương sách chuẩn ngành và bài báo gốc, đi kèm **120 bài toán phỏng vấn** định lượng có gợi ý từng bậc và lời giải chi tiết.
3. **Tầng 3 — Kho thư viện cá nhân (`content/library/`)**: Tự động nhận diện mọi tệp `.pdf` hoặc `.md` đặt trong thư mục để mở đối chiếu trực tiếp ở chế độ chia đôi màn hình (Split View) ngay cạnh bài giảng và sổ ghi chú công thức.

---

## 2. Yêu Cầu Hệ Thống & Khởi Chạy Nhanh

Ứng dụng chỉ sử dụng thư viện chuẩn của **Python 3** có sẵn trên macOS và Linux, không cần cài đặt bất kỳ gói phụ thuộc bên ngoài nào.

### Khởi chạy bằng một lệnh

```bash
git clone https://github.com/Nhianh03/quant_lab.git
cd quant_lab
./start.sh
```

Lệnh trên sẽ khởi động máy chủ cục bộ tại `http://127.0.0.1:8686` và tự động mở trình duyệt mặc định.

### Tùy chỉnh cổng hoặc chạy trực tiếp bằng Python

```bash
# Đổi cổng lắng nghe sang 9000
PORT=9000 ./start.sh

# Hoặc chạy trực tiếp không tự mở trình duyệt
NO_BROWSER=1 ./start.sh
python3 server.py --host 127.0.0.1 --port 8686
```

---

## 3. Cấu Trúc Thư Mục

```text
quant_lab/
├── server.py                     # Máy chủ HTTP & REST API nội bộ dùng thư viện chuẩn Python 3
├── start.sh                      # Kịch bản khởi chạy nhanh và mở trình duyệt
├── README.md                     # Tài liệu hướng dẫn vận hành và mở rộng học liệu
├── content/
│   ├── syllabus.json             # Lộ trình 4 học kỳ, 8 học phần, 36 chuyên đề & 4 đồ án
│   ├── problems.json             # Ngân hàng 120 bài toán phỏng vấn kèm gợi ý và lời giải chi tiết
│   ├── lessons/                  # Các tệp bài giảng Markdown tích hợp công thức KaTeX
│   └── library/                  # Nơi lưu trữ sách PDF và bài báo nghiên cứu cá nhân
├── user_data/
│   ├── progress.json             # Trạng thái tiến độ, ghi chú cá nhân, lịch ôn tập & đồ án
│   └── progress.backup.json      # Bản sao lưu tự động trước mỗi thao tác ghi mới
├── web/                          # Giao diện người dùng tĩnh và các mô phỏng tương tác HTML5 Canvas
└── tests/
    ├── test_server.py            # Kiểm thử đơn vị cho máy chủ, lưu trữ nguyên tử & bảo mật đường dẫn
    └── validate_content.py       # Kiểm tra tính toàn vẹn của giáo trình, công thức toán & quy tắc biên tập
```

---

## 4. Hướng Dẫn Sử Dụng Thư Viện PDF & Mở Rộng Học Liệu

### 4.1. Bổ sung sách PDF hoặc bài báo vào Thư viện Đọc đôi

1. Sao chép bất kỳ tệp sách giáo khoa `.pdf` hoặc tài liệu `.md` nào vào thư mục `content/library/`.
2. Trên giao diện đọc bài giảng, bật khung bên phải, chọn thẻ **Thư viện PDF** và nhấn nút làm mới danh sách.
3. Chọn tệp vừa thêm để đọc song song cùng bài giảng hoặc đối chiếu khi ghi chú chứng minh toán học.

### 4.2. Thêm bài giảng hoặc câu hỏi phỏng vấn mới

- **Thêm bài giảng**: Tạo tệp `content/lessons/<ma-bai-hoc>.md` (đặt tên chỉ gồm chữ thường `a-z`, chữ số `0-9` và dấu gạch ngang `-`), sau đó khai báo mục bài giảng tương ứng trong mảng `lessons` của học phần thuộc `content/syllabus.json`.
- **Thêm bài toán luyện phỏng vấn**: Bổ sung đối tượng câu hỏi mới vào mảng `problems` trong `content/problems.json` với đầy đủ đề bài, gợi ý từng bước và lời giải chứng minh, nơi hệ thống ôn tập lặp lại ngắt quãng (Spaced Repetition) sẽ tự động đưa bài mới vào hàng đợi luyện tập.

---

## 5. Cơ Chế An Toàn Dữ Liệu & Sao Lưu Tiến Độ

Toàn bộ dữ liệu học tập của người dùng được lưu cục bộ tại `user_data/progress.json` theo quy trình ghi nguyên tử (Atomic Write):

1. Máy chủ kiểm tra chặt chẽ kiểu dữ liệu của cấu trúc JSON gửi lên.
2. Nếu `progress.json` hiện tại hợp lệ, hệ thống sao chép sang `user_data/progress.backup.json`.
3. Dữ liệu mới được ghi vào tệp tạm `progress.json.tmp`, ép đồng bộ xuống đĩa bằng `os.fsync`, sau đó hoán đổi nguyên tử qua `os.replace`.
4. Nếu tệp chính bị hỏng ngoài ý muốn, lệnh đọc `/api/progress` sẽ tự động khôi phục từ `progress.backup.json`.

Ngoài ra, người học có thể xuất tệp sao lưu JSON ra ngoài hoặc nhập lại bản sao lưu từ thanh điều hướng bên trái của giao diện bất kỳ lúc nào.

---

## 6. Kiểm Thử Tự Động

Chạy bộ kiểm thử máy chủ để xác minh các giao diện lập trình ứng dụng, cơ chế sao lưu tự phục hồi và bộ chặn truy cập trái phép ngoài thư mục:

```bash
PYTHONPATH=. python3 -m unittest discover -s tests -p "test_server.py" -v
python3 tests/validate_content.py --phase full
node --test tests/test_frontend_logic.mjs
```
