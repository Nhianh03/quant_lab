# M1.03 — Dữ liệu Đúng Thời điểm, Sự kiện Doanh nghiệp & Mười Bẫy Kiểm thử Lịch sử

## 1. Trực giác & Động lực: Căn bệnh Tỷ số Sharpe Ảo Bằng 4.0

Trong các đội ngũ kỹ thuật tại quỹ đầu cơ định lượng, có một quy luật bất thành văn: *Nếu kiểm thử lịch sử đầu tay của một ứng viên đạt tỷ số Sharpe bằng $0.8$, có khả năng anh ta tìm ra một ý tưởng đáng đào sâu; nếu tỷ số Sharpe vọt lên $4.5$ trên cổ phiếu vốn hóa lớn ở chu kỳ giữ lệnh theo ngày, gần như chắc chắn $100\%$ đường ống dữ liệu đã bị rò rỉ thông tin từ tương lai.*

Khác với bài toán phân loại ảnh trong thị giác máy tính nơi mỗi bức ảnh là một thực thể tĩnh bất biến, một bản ghi dữ liệu tài chính luôn sống trên **hai chiều thời gian độc lập**: thời điểm sự kiện kinh tế xảy ra ngoài đời thực và thời điểm thị trường thực sự nhìn thấy con số đó (hoặc con số đó bị sửa đổi lại nhiều tháng sau). Chỉ cần một câu truy vấn nối bảng ngây thơ, một bộ lọc thị giá đặt nhầm lên chuỗi giá đã điều chỉnh chia tách lùi, hoặc việc tải danh sách thành phần chỉ số S&P 500 từ Wikipedia hôm nay để chạy kiểm thử lùi về năm 2008, bạn đã vô tình trao cho thuật toán khả năng "đọc báo ngày mai" — biến một mô hình vô dụng thành cỗ máy in tiền giả tạo trên màn hình máy tính.

---

## 2. Kiến trúc Dữ liệu Đúng Thời điểm & Hai Trục Thời gian

### 2.1. Mô hình Bảng Lưỡng Thời gian (Bitemporal Data Model)

Xét báo cáo kết quả kinh doanh Quý 4 năm 2024 của một tập đoàn bán lẻ Mỹ có năm tài chính kết thúc vào ngày `2024-12-31`. Con số lợi nhuận trên mỗi cổ phiếu `EPS = $2.40` gắn với ít nhất ba dấu thời gian khác nhau hoàn toàn:

1. **Mốc Kết thúc Kỳ Kế toán** ($t_{\text{period}}$ — Fiscal Period End): `2024-12-31`. Tại thời điểm chuông đóng cửa phiên cuối năm vang lên, ngay cả Giám đốc Tài chính của tập đoàn cũng chưa chốt xong sổ kiểm toán!
2. **Dấu Thời gian Công bố Lần đầu** ($t_{\text{known}}^{(1)}$ — Initial Filing Timestamp): `2025-02-19 16:05:12 ET`, thời điểm bản báo cáo `10-K` (hoặc thông cáo báo chí `8-K`) xuất hiện trên hệ thống điện tử EDGAR của Ủy ban Chứng khoán Mỹ sau giờ đóng cửa phiên ngày 19 tháng 2.
3. **Dấu Thời gian Điều chỉnh Hồi tố** ($t_{\text{known}}^{(2)}$ — Restatement Date): Giả sử đến ngày `2025-08-14`, công ty phát hiện sai sót ghi nhận doanh thu và nộp bản sửa đổi `10-K/A` hạ lợi nhuận thực tế của Quý 4/2024 xuống còn `EPS = $1.85`.

Các nhà cung cấp dữ liệu tài chính phổ thông giá rẻ thường **ghi đè tại chỗ** (Overwrite-in-Place): họ lưu duy nhất một dòng ``(ticker='XYZ', quarter='2024Q4', eps=1.85)``. Nếu nhà nghiên cứu nối dòng này vào bảng giá từ ngày `2025-01-02`, thuật toán mắc đồng thời hai lỗi **Thiên lệch nhìn trước** (Look-Ahead Bias): thứ nhất, biết trước kết quả kinh doanh Quý 4 sớm tới $49$ ngày trước khi công bố; thứ hai, biết trước luôn cả vụ bê bối điều chỉnh giảm lợi nhuận sẽ chỉ nổ ra vào tháng 8 năm sau!

Để triệt tiêu tận gốc căn bệnh này, các cơ sở dữ liệu chuẩn tổ chức như Compustat Snapshot, FactSet hay kho dữ liệu nội bộ của WorldQuant và Two Sigma luôn lưu trữ mọi bản ghi $d$ dưới dạng bộ lưỡng thời gian $(k_d, t_{\text{period}}(d), t_{\text{known}}(d), v_d)$ chỉ cho phép thêm dòng mới chứ không bao giờ xóa sửa dòng cũ. Tại bất kỳ thời điểm ra quyết định giao dịch $t$ nào trong quá khứ, lát cắt **Dữ liệu Đúng thời điểm** (Point-in-Time — `PIT`) hợp lệ duy nhất mà mô hình được phép truy cập là:

$$
\mathcal{D}_{\text{PIT}}(t) = \left\{ d \in \mathcal{D}_{\text{master}} \,:\, t_{\text{known}}(d) \le t \right\}
$$

Khi truy xuất giá trị mới nhất của chỉ tiêu cơ bản cho kỳ kế toán $p$ tính đến đúng mili-giây ra quyết định $t$, phép toán truy vấn chuẩn (tương đương toán tử `ASOF JOIN` trong cơ sở dữ liệu chuỗi thời gian như kdb+/ClickHouse/DuckDB) phải lấy phần tử cực đại theo trục thời gian nhận thức:

$$
v_{\text{PIT}}(i, p; t) = v_{d^\star}, \qquad d^\star = \arg\max_{\substack{d \in \mathcal{D}_{\text{master}}(i, p) \\ t_{\text{known}}(d) \le t}} t_{\text{known}}(d)
$$

---

## 3. Thiên lệch Sống sót & Bảng Định danh Chứng khoán Động

### 3.1. Định lượng Độ chệch Dương khi Lọc trên Kẻ Sống sót

Giả sử tại đầu năm $t_0 = 2010$ có $N_0 = 3{,}000$ công ty đang giao dịch tích cực tạo nên vũ trụ $\mathcal{U}_{t_0}$. Qua 15 năm cạnh tranh và các đợt suy thoái, có $(1 - \pi_S) N_0$ doanh nghiệp làm ăn thua lỗ, vi phạm quy chuẩn niêm yết hoặc phá sản (như Lehman Brothers, Silicon Valley Bank, Bed Bath & Beyond) bị hủy niêm yết, chỉ còn lại tỷ lệ $\pi_S \in (0, 1)$ công ty trụ vững trong danh sách hiện tại $\mathcal{U}_T$.

Gọi $R$ là lợi nhuận tích lũy toàn kỳ và $S \in \{0, 1\}$ là biến cố doanh nghiệp còn tồn tại đến ngày $T$ với $\mathbb{P}(S = 1) = \pi_S$. Theo định lý kỳ vọng toàn phần, kỳ vọng lợi nhuận chân thực của một nhà đầu tư phân bổ vốn từ năm $t_0$ là:

$$
\mathbb{E}[R] = \pi_S \, \mathbb{E}[R \mid S = 1] + (1 - \pi_S) \, \mathbb{E}[R \mid S = 0]
$$

Nếu nhà nghiên cứu chỉ tải danh sách mã cổ phiếu còn đang hoạt động hôm nay để chạy kiểm thử ngược về quá khứ, anh ta thực chất đang ước lượng $\mathbb{E}[R \mid S = 1]$. Độ lệch do **Thiên lệch sống sót** (Survivorship Bias) bằng:

$$
\text{Bias}_{\text{surv}} = \mathbb{E}[R \mid S = 1] - \mathbb{E}[R] = (1 - \pi_S)\big( \mathbb{E}[R \mid S = 1] - \mathbb{E}[R \mid S = 0] \big) > 0
$$

Hậu quả của $\text{Bias}_{\text{surv}}$ đối với các chiến lược định lượng đặc biệt độc hại ở hai khía cạnh:
1. **Thổi phồng giả tạo các chiến lược bắt đáy / mua giá trị**: Chiến lược mua cổ phiếu vừa giảm giá $70\%$ hoặc có tỷ số nợ cao sẽ trông như "mỏ vàng" trên tập sống sót vì bạn đã loại bỏ sẵn toàn bộ những công ty giảm $70\%$ rồi tiếp tục về $\$0.00$, chỉ giữ lại đúng những trường hợp kỳ diệu hồi sinh ngoạn mục!
2. **Tái sử dụng Mã Giao dịch (`Ticker Reuse`) và Lợi nhuận Hủy niêm yết**: Trên sàn chứng khoán Mỹ, ký hiệu chữ cái như `C`, `V` hay `GM` có thể được thu hồi từ công ty cũ đã giải thể để cấp lại cho một doanh nghiệp mới hoàn toàn vài năm sau. Hệ thống định lượng chuyên nghiệp không bao giờ dùng `Ticker` làm khóa chính, mà bắt buộc dùng định danh vĩnh viễn bất biến (như `PERMNO` trong bộ dữ liệu học thuật CRSP hoặc `FIGI`/`GVKEY`), đồng thời ghép nối đầy đủ **lợi nhuận thanh lý khi hủy niêm yết** $R_{i, t}^{\text{delist}}$ (thường âm từ $-30\%$ đến $-100\%$ ở phiên giao dịch cuối cùng trên sàn hồng OTC):

$$
1 + R_{i, t}^{\text{total}} = \left(1 + R_{i, t}^{\text{trade}}\right)\left(1 + R_{i, t}^{\text{delist}}\right)
$$

---

## 4. Chuỗi Nhân tử Điều chỉnh Sự kiện Doanh nghiệp & Toán học Lợi nhuận

### 4.1. Đẳng thức Bảo toàn Tài sản qua Chia tách và Cổ tức

Giả sử kết thúc phiên $t-1$, bạn nắm giữ $1$ cổ phiếu có thị giá đóng cửa thô (Unadjusted Raw Close) là $P_{t-1}^{\text{raw}}$. Bước sang đầu phiên ngày giao dịch không hưởng quyền $t$ (Ex-Date), doanh nghiệp thực hiện đồng thời hai sự kiện doanh nghiệp (Corporate Actions):
- **Chia tách hoặc gộp cổ phiếu** với hệ số nhân số lượng $s_t > 0$ (ví dụ tách $4$ ăn $1$ thì mỗi cổ phiếu cũ đổi thành $s_t = 4$ cổ phiếu mới; gộp ngược $1$ đổi $10$ thì $s_t = 0.1$; ngày bình thường không chia tách thì $s_t = 1$).
- **Chi trả cổ tức tiền mặt** $D_t \ge 0$ tính trên mỗi cổ phiếu sau chia tách (ngày bình thường $D_t = 0$).

Cuối ngày $t$, thị giá đóng cửa thô của một cổ phiếu mới trên sàn là $P_t^{\text{raw}}$. Tổng giá trị tài sản thực tế của bạn (nếu giả định cổ tức tiền mặt vừa phát sinh được ghi nhận ngay cuối ngày $t$) chuyển từ $W_{t-1} = P_{t-1}^{\text{raw}}$ sang $W_t = s_t P_t^{\text{raw}} + s_t D_t$. Do đó **lợi nhuận đơn tổng thể chân thực** (True Total Simple Return) $R_t$ giữa hai phiên bắt buộc phải bằng:

$$
1 + R_t = \frac{s_t \left( P_t^{\text{raw}} + D_t \right)}{P_{t-1}^{\text{raw}}}
$$

*(Lưu ý quy ước thực tế: nếu nhà cung cấp dữ liệu báo cáo cổ tức $D_t^{\text{pre}}$ tính trên cổ phiếu trước chia tách thì công thức rút gọn thành $1 + R_t = \frac{s_t P_t^{\text{raw}} + D_t^{\text{pre}}}{P_{t-1}^{\text{raw}}}$; hai công thức hoàn toàn tương đương khi đổi đơn vị $D_t^{\text{pre}} = s_t D_t$).*

### 4.2. Điều chỉnh Lùi so với Chỉ số Tài sản Điều chỉnh Tiến — Cái bẫy Ngưỡng Giá

Để vẽ biểu đồ giá liên tục không bị gãy khúc sụt giảm $-75\%$ giả tạo vào ngày tách $4:1$, hầu hết các thư viện dữ liệu tạo ra chuỗi **Giá Điều chỉnh Lùi Tích lũy** (Backward-Adjusted Price) $P_t^{\text{back}}$ bằng cách neo cố định ngày hiện tại $T$ ($P_T^{\text{back}} = P_T^{\text{raw}}$) rồi định nghĩa đệ quy ngược về quá khứ qua nhân tử điều chỉnh $m_t$:

$$
P_{t-1}^{\text{back}} = P_t^{\text{back}} \cdot \frac{1}{1 + R_t} = P_{t-1}^{\text{raw}} \prod_{u = t}^{T} \frac{1}{s_u} \left( 1 - \frac{s_u D_u}{s_u P_u^{\text{raw}} + s_u D_u} \right)_{\text{chuẩn hóa}}
$$

Trong đó cách cài đặt chính xác đảm bảo tỷ số hai ngày liên tiếp $\frac{P_t^{\text{back}}}{P_{t-1}^{\text{back}}} = 1 + R_t$ luôn bảo toàn lợi nhuận tổng thể: đặt nhân tử bước $a_t = \frac{P_t^{\text{raw}}}{s_t(P_t^{\text{raw}} + D_t)}$ (hoặc theo chuẩn CRSP/Yahoo dùng giá đóng cửa phiên trước $a_t^{\text{ref}} = \frac{1}{s_t}\left(1 - \frac{D_t^{\text{pre}}}{P_{t-1}^{\text{raw}}}\right)$ để khớp đúng giá tham chiếu mở cửa ngày không hưởng quyền!).

> [!IMPORTANT]
> **Bẫy Thiên lệch Nhìn trước từ Chuỗi Giá Điều chỉnh Lùi:** Cổ phiếu NVIDIA (`NVDA`) đã trải qua nhiều đợt chia tách cổ phiếu tổng cộng $40:1$ trong giai đoạn 2021–2024 (tách $4:1$ năm 2021 và tách $10:1$ năm 2024). Một cổ phiếu `NVDA` giao dịch ngoài đời thực ở thị giá thô **$\$140.00$** vào năm 2019 sẽ hiện ra trong cột `adj_close` tải hôm nay chỉ còn khoảng **$\$3.50$**! Nếu bạn viết điều kiện lọc vũ trụ thanh khoản `adj_close >= 5.0` để loại bỏ cổ phiếu rác thị giá thấp (Penny Stocks), bộ lọc của bạn sẽ **loại bỏ oan những siêu cổ phiếu tăng trưởng mạnh nhất lịch sử** vì chúng chia tách nhiều lần ở tương lai, hoặc ngược lại giữ lại những cổ phiếu sắp chết đã thực hiện gộp cổ phiếu $1:20$ nâng giá điều chỉnh quá khứ lên hàng trăm đô-la!
> **Quy tắc bất di bất dịch:** Mọi bộ lọc ngưỡng giá thị trường (`price >= $5`), vốn hóa và bước giá tối thiểu đều phải tính trên **Giá Thô Đúng Thời điểm** $P_t^{\text{raw}}$; còn chuỗi lợi nhuận tính tín hiệu và lãi lỗ danh mục phải tính từ **Chuỗi Nhân tử Tổng Lợi nhuận Tiến** $I_t = I_0 \prod_{u=1}^t (1 + R_u)$!

### 4.3. Tính Cộng Chéo của Lợi nhuận Đơn đối lập với Tính Cộng Thời gian của Lợi nhuận Logarit

Cho lợi nhuận đơn $R_{i,t} = \frac{I_{i,t}}{I_{i,t-1}} - 1$ và **lợi nhuận gộp liên tục** (Log Return) $r_{i,t} = \ln(1 + R_{i,t})$. Hai đại lượng này tuyệt đối không được phép dùng lẫn lộn trong mã nguồn kiểm thử:

1. **Theo chiều thời gian của một tài sản đơn lẻ**: Lợi nhuận logarit có tính cộng tuyến tính chính xác qua $K$ kỳ vì $r_{i, t \to t+K} = \ln\prod_{k=1}^K (1 + R_{i, t+k}) = \sum_{k=1}^K r_{i, t+k}$, rất thuận tiện khi xây dựng mô hình chuỗi thời gian `ARMA/GARCH`.
2. **Theo chiều ngang danh mục $N$ tài sản trong cùng một kỳ**: Nếu đầu kỳ bạn phân bổ trọng số tiền mặt $w_1, \dots, w_N$ ($\sum_{i=1}^N w_i = 1$ cho danh mục chỉ mua, hoặc danh mục tự tài trợ có đòn bẩy), lợi nhuận đơn của danh mục là tổ hợp tuyến tính chính xác $R_{p,t} = \sum_{i=1}^N w_i R_{i,t}$. Ngược lại, do hàm $\exp(x)$ là hàm lồi chặt, theo bất đẳng thức Jensen ta luôn có:

$$
r_{p,t} = \ln\left( \sum_{i=1}^N w_i e^{r_{i,t}} \right) > \sum_{i=1}^N w_i r_{i,t} \quad (\text{khi các } r_{i,t} \text{ không đồng nhất và } w_i > 0)
$$

Cộng trực tiếp $\sum_i w_i r_{i,t}$ để tính lãi lỗ danh mục mua - bán khống sẽ đánh giá sai lệch đáng kể lợi nhuận thực tế (gọi là phần bù biến động tái cân bằng hay sai số lồi bậc hai $\approx \frac{1}{2}\sigma_{\text{cross}}^2$), đặc biệt nghiêm trọng đối với tài sản biến động lớn hoặc vị thế bán khống nơi $R_{i,t} = +100\%$ làm bạn cháy $100\%$ giá trị vị thế nhưng $r_{i,t} = \ln(2) \approx +69.3\%$ lại đánh giá thấp khoản lỗ tới hơn $30\%$!

---

## 5. Căn chỉnh Thanh Dữ liệu & Danh mục Mười Bẫy Kiểm thử Lịch sử Kinh điển

### 5.1. Đồng hồ Thời gian Thực so với Thanh Khối lượng và Thanh Giá trị

Chuỗi lợi nhuận lấy mẫu đều đặn mỗi $5$ phút theo đồng hồ treo tường chịu hiện tượng phương sai thay đổi chữ U cực mạnh trong ngày (sôi động dữ dội $30$ phút đầu sau mở cửa `09:30 ET` và $30$ phút cuối trước phiên đấu giá đóng cửa, nhưng lặng sóng buổi trưa), khiến phân phối có đuôi nhọn quá mức. Như Marcos López de Prado (2018) chỉ ra, nếu ta đóng một thanh nến mới mỗi khi thị trường trao tay đủ một ngưỡng **giá trị giao dịch cố định** $V^\star$ — chẳng hạn mỗi \$50 triệu giá trị khớp lệnh tạo thành một **Thanh Giá trị** (Dollar Bar) — tốc độ lấy mẫu sẽ tự động co giãn đồng bộ với cường độ dòng thông tin mới đến thị trường và miễn nhiễm tự nhiên trước các đợt chia tách cổ phiếu hay lạm phát thị giá dài hạn.

### 5.2. Bảng Kiểm toán Mười Đại tội Kiểm thử Lịch sử (10 Backtest Sins)

Mọi đồ án nghiên cứu trước khi trình lên hội đồng quản trị rủi ro đều phải vượt qua danh mục 10 điểm kiểm tra bắt buộc sau:

| Mã Kiểm toán | Tên Bẫy Kiểm thử | Cơ chế Gây Sai lệch Toán học | Quy chuẩn Khắc phục Cấp Tổ chức |
| :---: | :--- | :--- | :--- |
| **B01** | **Báo cáo tài chính chưa công bố** | Dùng mốc kết thúc quý $t_{\text{period}}$ thay vì giờ nộp báo cáo $t_{\text{known}}$ | Bắt buộc nối bảng theo cấu trúc hai trục thời gian `PIT` |
| **B02** | **Vũ trụ cổ phiếu sống sót** | Lọc danh mục từ rổ chỉ số hiện tại $\mathcal{U}_T$, bỏ sót mã phá sản | Xây dựng vũ trụ thành phần động theo từng ngày + ghép lợi nhuận hủy niêm yết |
| **B03** | **Lọc ngưỡng trên giá điều chỉnh lùi** | Áp điều kiện `adj_close > $5` làm rò rỉ lịch sử chia tách tương lai | Áp điều kiện thanh khoản trên $P_t^{\text{raw}}$, tính lợi nhuận trên chỉ số $I_t$ |
| **B04** | **Chuẩn hóa toàn cục rò rỉ tương lai** | Tính trung bình, độ lệch chuẩn hoặc ngưỡng cắt ngoại lai trên toàn mẫu $[0, T]$ | Chỉ chuẩn hóa chéo trong cùng thời điểm $t$ hoặc dùng cửa sổ trượt nhân quả $\le t$ |
| **B05** | **Khớp lệnh cùng thanh đóng nến** | Dùng giá đóng cửa $C_t$ tính tín hiệu rồi giả định mua xong ngay tại chính $C_t$ | Trễ tối thiểu 1 thanh (khớp tại `Open` hoặc `VWAP` kỳ $t+1$) hoặc tính tín hiệu lúc `15:45` để đặt lệnh phiên đóng cửa `MOC` |
| **B06** | **Ảo tưởng thanh khoản vốn hóa nhỏ** | Giả định mua được hàng triệu USD cổ phiếu thanh khoản kém không làm nhúc nhích giá | Khóa tỷ lệ tham gia tối đa $1\%\text{–}5\%\,\text{ADV}$ và trừ hàm chi phí trượt giá bậc căn |
| **B07** | **Bỏ qua chi phí vay bán khống** | Giả định bán khống miễn phí ở những cổ phiếu đang bị khan hiếm nguồn cho vay | Trừ phí vay mượn cổ phiếu (`Borrow Fee`, có thể lên tới $10\%\text{–}50\%$/năm ở mã nóng) |
| **B08** | **Lệch múi giờ đa tài sản quốc tế** | Ghép giá đóng cửa Tokyo (`15:00 JST`) với đóng cửa New York (`16:00 ET`) cùng ngày lịch | Quy đổi toàn bộ dấu thời gian sự kiện về trục chuẩn `UTC` tuyệt đối trước khi nối |
| **B09** | **Quá khớp đa kiểm định tập kiểm tra** | Chạy 500 biến thể tham số, chọn đường cong đẹp nhất trên tập ngoài mẫu | Áp dụng kiểm định chéo cắt bỏ, kiểm soát tỷ lệ khám phá sai và Tỷ số Sharpe Giảm phát |
| **B10** | **Cộng tuyến tính lợi nhuận logarit chéo** | Tính lãi danh mục mua - bán bằng $\sum_i w_i \ln(1 + R_i)$ làm méo rủi ro đuôi | Tính lãi lỗ danh mục bằng lợi nhuận đơn $\sum_i w_i R_i$, chỉ đổi sang logarit ở cấp danh mục tổng |

---

## 6. Ví dụ Giải toán Thực chiến: Xây dựng Chuỗi Điều chỉnh Chuẩn & Bắt lỗi Rò rỉ

**Bài toán:** Cổ phiếu `XYZ` có chuỗi giá đóng cửa thô qua 4 phiên liên tiếp từ Thứ Hai ($t=1$) đến Thứ Năm ($t=4$) lần lượt là: $P_1^{\text{raw}} = \$100.00$, $P_2^{\text{raw}} = \$105.00$, $P_3^{\text{raw}} = \$36.00$, $P_4^{\text{raw}} = \$37.80$. Biết rằng vào sáng Thứ Tư ($t=3$, ngày giao dịch không hưởng quyền), công ty thực hiện tách cổ phiếu tỷ lệ $3:1$ ($s_3 = 3$) đồng thời trả cổ tức tiền mặt $D_3 = \$1.00$ trên mỗi cổ phiếu **sau chia tách** (tức tương đương $D_3^{\text{pre}} = \$3.00$ cho mỗi cổ phiếu cũ). Không có sự kiện nào khác ở các ngày còn lại.
1. Tính chuỗi lợi nhuận đơn tổng thể thực tế $R_2, R_3, R_4$ của nhà đầu tư nắm giữ cổ phiếu.
2. Dựng chỉ số tổng tài sản điều chỉnh tiến $I_t$ (gốc $I_1 = 100.00$) và chuỗi giá điều chỉnh lùi $P_t^{\text{back}}$ neo tại $P_4^{\text{back}} = P_4^{\text{raw}} = \$37.80$.

**Lời giải Chi tiết:**

1. **Tính lợi nhuận đơn tổng thể từng phiên:**
   - Ngày $t = 2$ ($s_2 = 1, D_2 = 0$):

$$
1 + R_2 = \frac{1 \times (105.00 + 0)}{100.00} = 1.0500 \implies R_2 = +5.00\%
$$

   - Ngày $t = 3$ ($s_3 = 3, D_3 = \$1.00$ trên mỗi cổ phiếu mới): Một cổ phiếu cũ trị giá $\$105.00$ cuối Thứ Ba biến thành $3$ cổ phiếu mới trị giá $3 \times \$36.00 = \$108.00$ cộng thêm $3 \times \$1.00 = \$3.00$ tiền cổ tức, tổng cộng bằng $\$111.00$! Do đó lợi nhuận thực sự của phiên Thứ Tư là tăng giá chứ không phải sụt giảm $-65.7\%$ như giá thô:

$$
1 + R_3 = \frac{3 \times (36.00 + 1.00)}{105.00} = \frac{111.00}{105.00} = \frac{37}{35} \approx 1.057143 \implies R_3 \approx +5.7143\%
$$

   - Ngày $t = 4$ ($s_4 = 1, D_4 = 0$):

$$
1 + R_4 = \frac{37.80}{36.00} = 1.0500 \implies R_4 = +5.00\%
$$

2. **Đối chiếu Chỉ số Tiến $I_t$ và Chuỗi Điều chỉnh Lùi $P_t^{\text{back}}$:**
   - **Chỉ số tiến** (nhân tích lũy từ $I_1 = 100.00$, không bao giờ phải viết lại quá khứ khi tương lai có chia tách mới!):
     - $I_1 = 100.00$
     - $I_2 = 100.00 \times 1.05 = 105.00$
     - $I_3 = 105.00 \times \frac{37}{35} = 111.00$
     - $I_4 = 111.00 \times 1.05 = 116.55$
   - **Chuỗi điều chỉnh lùi** (neo $P_4^{\text{back}} = \$37.80$ rồi chia lùi liên tiếp cho $1 + R_t$):
     - $P_4^{\text{back}} = \$37.80$
     - $P_3^{\text{back}} = \frac{37.80}{1.05} = \$36.00$
     - $P_2^{\text{back}} = \frac{36.00}{37 / 35} = \frac{1260}{37} \approx \$34.0541$
     - $P_1^{\text{back}} = \frac{1260 / 37}{1.05} = \frac{1200}{37} \approx \$32.4324$

**Bài toán Phụ (Kiểm toán Truy vấn Lưỡng Thời gian):** Bảng báo cáo tài chính `PIT` của mã `ABC` chứa ba dòng cho kỳ `2024Q2` (`t_period = 2024-06-30`):
- Dòng 1: `t_known = 2024-07-28 16:10`, `net_income = $120M` (thông cáo sơ bộ `8-K`).
- Dòng 2: `t_known = 2024-08-05 17:02`, `net_income = $118M` (báo cáo kiểm toán `10-Q` chính thức).
- Dòng 3: `t_known = 2024-11-12 08:30`, `net_income = $92M` (điều chỉnh hồi tố `10-Q/A`).

Khi mô hình tái cân bằng danh mục vào lúc `09:35 ET` sáng ngày `2024-08-05`, giá trị `net_income` hợp lệ của kỳ `2024Q2` là bao nhiêu?
- **Giải đáp**: Tại mốc `2024-08-05 09:35`, chỉ có Dòng 1 thỏa mãn $t_{\text{known}} \le t$ (bản `10-Q` nộp lúc `17:02` chiều cùng ngày vẫn chưa ra đời!). Vậy giá trị đúng duy nhất là **$\$120\text{M}$**. Nếu bộ xử lý dữ liệu chỉ lưu ngày lịch `2024-08-05` không kèm giờ phút giây rồi nối bằng dấu `<=`, mô hình sẽ dùng nhầm con số $\$118\text{M}$ sớm trước $7.5$ tiếng đồng hồ!

> [!WARNING]
> Hãy quan sát con số $P_2^{\text{back}} \approx \$34.0541$: nếu không trừ cổ tức mà chỉ chia đơn thuần cho tỷ lệ tách $3$, bạn sẽ ghi nhầm $105 / 3 = \$35.00$, làm sai lệch lợi nhuận ngày Thứ Tư thành $(36 - 35)/35 = +2.857\%$ và đánh mất gần một nửa lợi nhuận cổ tức thực tế ($+5.714\%$). Ngược lại, trong các hệ thống sản xuất thực tế, ta luôn lưu trữ bảng sự kiện $(s_t, D_t)$ tách rời khỏi bảng giá thô $P_t^{\text{raw}}$ để có thể tái dựng chính xác trạng thái thị trường tại bất kỳ lát cắt lịch sử nào.
