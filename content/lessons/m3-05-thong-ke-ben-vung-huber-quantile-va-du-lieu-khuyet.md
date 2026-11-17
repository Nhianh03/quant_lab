# M3.05 — Thống kê Bền vững, Hồi quy Phân vị & Xử lý Dữ liệu Ngoại lai Tài chính

## 1. Trực giác & Động lực: Một Lỗi Dấu Chấm Thập phân Đánh Sập Cả Mô hình Alpha

Trên lý thuyết sách giáo khoa Gauss-Markov ở Bài `M3.02`, ước lượng bình phương tối thiểu thông thường (`OLS`) là ước lượng tuyến tính không chệch có phương sai nhỏ nhất. Thế nhưng trên dữ liệu tài chính thực tế — nơi tồn tại các giao dịch lỗi giá lệch bậc độ lớn, cú nhảy sáp nhập $+80\%$ qua đêm hay tỷ số tài chính có mẫu số vốn chủ sở hữu tiến sát $0$ — hàm phạt bình phương $r_i^2$ lại biến thành gót chân Achilles chí mạng!

Hãy hình dung bạn chạy hồi quy mặt cắt ngang dự báo lợi nhuận $N = 3{,}000$ cổ phiếu theo một đặc trưng định giá. Chỉ cần **duy nhất $1$ mã cổ phiếu** bị nhà cung cấp dữ liệu ghi nhầm đơn vị từ triệu đô sang nghìn đô tạo ra đặc trưng ngoại lai $x_0 = 1{,}000\,\sigma$ trong khi lợi nhuận $y_0 \approx 0$, phần tử đòn bẩy hình học $h_{00} = x_0^2 / \sum_{i=1}^N x_i^2$ lập tức tiến sát $1.0$ và kéo bẻ ngang hệ số góc $\hat{\beta}_{\text{OLS}} \to 0$ của toàn bộ $2{,}999$ cổ phiếu chuẩn xác còn lại! Bài giảng này xây dựng nền tảng toán học của thống kê bền vững, hồi quy phân vị và xử lý dữ liệu khuyết mang thông tin cho hệ thống nghiên cứu cấp tổ chức.

---

## 2. Hàm Ảnh hưởng Hampel, Điểm Gãy & Độ Lệch Tuyệt đối Trung vị

### 2.1. Hàm Ảnh hưởng và Sự Mong manh Tuyệt đối của Trung bình Mẫu

Xét một phiếm hàm thống kê $T(F)$ xác định trên không gian các phân phối xác suất $F$. Để đo độ nhạy vi phân của $T(F)$ khi quần thể bị nhiễm bẩn một tỷ trọng cực nhỏ $\epsilon \in (0, 1)$ bởi phân phối khối điểm $\Delta_z$ đặt tại giá trị ngoại lai $z \in \mathbb{R}$, Frank Hampel định nghĩa **Hàm Ảnh hưởng** (Influence Function) như sau:

$$
\operatorname{IF}(z; T, F) \triangleq \lim_{\epsilon \downarrow 0} \frac{T\big((1 - \epsilon)F + \epsilon \Delta_z\big) - T(F)}{\epsilon}
$$

Hãy đối chiếu hai ước lượng vị trí kinh điển trên phân phối đối xứng có mật độ dương liên tục $f$:
1. **Kỳ vọng trung bình** $T_{\text{mean}}(F) = \int x\,dF(x)$: do tính tuyến tính, $T_{\text{mean}}((1-\epsilon)F + \epsilon\Delta_z) = (1-\epsilon)\mu + \epsilon z$, suy ra $\operatorname{IF}(z; T_{\text{mean}}, F) = z - \mu$. Độ nhạy cực đại $\sup_{z \in \mathbb{R}} |\operatorname{IF}(z)| = +\infty$ **không bị chặn** — một điểm $z \to \infty$ duy nhất kéo trung bình trôi thẳng ra vô cực!
2. **Trung vị** $T_{\text{med}}(F) = F^{-1}(1/2) \triangleq \tilde{\mu}$: đặt $m(\epsilon)$ thỏa mãn $(1-\epsilon)F(m(\epsilon)) + \epsilon \mathbb{I}_{\{z \le m(\epsilon)\}} = \frac{1}{2}$. Lấy đạo hàm ẩn theo $\epsilon$ tại $\epsilon = 0^+$ cho ta $\operatorname{IF}(z; T_{\text{med}}, F) = \frac{\operatorname{sign}(z - \tilde{\mu})}{2 f(\tilde{\mu})}$, **bị chặn đều trên toàn trục thực** dù $|z| = 10^{12}$!

### 2.2. Điểm Gãy Hữu hạn Mẫu & Hằng số Hiệu chuẩn $1.4826$ của `MAD`

**Điểm Gãy** (Breakdown Point) $\varepsilon^\star$ của ước lượng $T_n(X_1, \dots, X_n)$ là tỷ lệ tối thiểu $\frac{m}{n}$ các quan sát cần bị thay thế bằng giá trị tùy ý để có thể đẩy $|T_n|$ ra vô cực. Trung bình mẫu $\bar{X}$, phương sai mẫu $s^2$ và hồi quy `OLS` đều có điểm gãy tệ nhất có thể: $\varepsilon^\star = \frac{1}{n} \xrightarrow{n \to \infty} \mathbf{0\%}$! Ngược lại, trung vị mẫu $\tilde{X}$ đạt ngưỡng lý thuyết tối đa cho mọi ước lượng bất biến tịnh tiến là **$\varepsilon^\star = 50\%$**.

Để ước lượng độ biến động hoặc chuẩn hóa đặc trưng với điểm gãy $50\%$ tương đương, các quỹ định lượng thay thế độ lệch chuẩn mẫu bằng **Độ lệch Tuyệt đối Trung vị** (Median Absolute Deviation — `MAD`).

**Mệnh đề 3.5 — Hệ số Nhất quán Chuẩn tắc của Độ lệch Tuyệt đối Trung vị.** *Nếu $X_1, \dots, X_n \stackrel{\text{iid}}{\sim} \mathcal{N}(\mu, \sigma^2)$, thì ước lượng độ lệch chuẩn bền vững hội tụ theo xác suất đúng về $\sigma$ được xác định bởi:*

$$
\widehat{\sigma}_{\text{MAD}} = \frac{1}{\Phi^{-1}(3/4)} \, \operatorname{median}_{1 \le i \le n}\big|X_i - \tilde{X}\big| \approx 1.4826 \cdot \operatorname{median}_{1 \le i \le n}\big|X_i - \tilde{X}\big|
$$

**Chứng minh.** Khi $n \to \infty$, $\tilde{X} \xrightarrow{p} \mu$ và trung vị mẫu của $|X_i - \tilde{X}|$ hội tụ tới trung vị quần thể $c_\sigma$ của $|X - \mu| = \sigma |Z|$ với $Z \sim \mathcal{N}(0, 1)$. Theo định nghĩa trung vị:
$\frac{1}{2} = \mathbb{P}(\sigma |Z| \le c_\sigma) = \mathbb{P}\!\left(-\frac{c_\sigma}{\sigma} \le Z \le \frac{c_\sigma}{\sigma}\right) = 2\Phi\!\left(\frac{c_\sigma}{\sigma}\right) - 1 \iff \Phi\!\left(\frac{c_\sigma}{\sigma}\right) = \frac{3}{4}$.
Suy ra $c_\sigma = \sigma \Phi^{-1}(0.75) \approx 0.67449\,\sigma$. Nhân nghịch đảo $\frac{1}{\Phi^{-1}(0.75)} \approx 1.482602$ khôi phục ước lượng không chệch tiệm cận của $\sigma$ trên dữ liệu chuẩn mà vẫn miễn nhiễm hoàn toàn trước tới $49.9\%$ điểm dữ liệu rác ở hai đuôi! $\blacksquare$

---

## 3. Hồi quy Bền vững Huber, Thuật toán `IRLS` & Hồi quy Phân vị

### 3.1. Hàm Mất mát Lai ghép Huber & Thuật toán Tái Trọng số Lặp

Nếu thay hoàn toàn bình phương phần dư bằng trị tuyệt đối $\sum_i |r_i|$ trong hồi quy chuẩn $\ell_1$, ước lượng bền vững trước ngoại lai trục $Y$ nhưng mất tính khả vi tại $r_i = 0$ và kém hiệu quả thống kê khi nhiễu thực sự gần chuẩn. Peter Huber (1964) thiết kế **Ước lượng Bền vững Huber** (Huber M-Estimator) nối trơn bậc một giữa parabol bậc hai trong vùng lõi $|r| \le \delta$ và đường thẳng tuyến tính ở vùng ngoại lai $|r| > \delta$:

$$
L_\delta(r) = \begin{cases} \dfrac{1}{2} r^2, & \text{nếu } |r| \le \delta \\[6pt] \delta\left(|r| - \dfrac{1}{2}\delta\right), & \text{nếu } |r| > \delta \end{cases} \qquad \Longrightarrow \qquad \psi_\delta(r) = L_\delta'(r) = \max\!\big(-\delta, \, \min(\delta, r)\big)
$$

Khi chọn ngưỡng chuyển pha $\delta = 1.345\,\widehat{\sigma}_{\text{MAD}}$, ước lượng này đạt đồng thời hai phẩm chất mơ ước: giữ lại **$95\%$ hiệu quả tiệm cận** của `OLS` nếu dữ liệu hoàn toàn sạch theo phân phối chuẩn, đồng thời sở hữu hàm ảnh hưởng theo phần dư bị chặn chặt trong $[-\delta, +\delta]$!

Để giải bài toán tối ưu lồi $\min_{\beta \in \mathbb{R}^p} \sum_{i=1}^n L_\delta(y_i - x_i^\top \beta)$, xét hệ phương trình đạo hàm bằng không $\sum_{i=1}^n \psi_\delta(r_i) x_i = 0$ với $r_i(\beta) = y_i - x_i^\top \beta$. Định nghĩa hàm trọng số phần dư $w(r) \triangleq \frac{\psi_\delta(r)}{r} = \min\!\left(1, \, \frac{\delta}{|r|}\right)$ và quy ước $w(0) = 1$. Hệ điều kiện bậc nhất biến thành phương trình chuẩn của **Bình phương Tối thiểu Tái Trọng số Lặp** (Iteratively Reweighted Least Squares — `IRLS`), cập nhật đóng tại mỗi vòng lặp $k = 0, 1, 2, \dots$ cho tới khi hội tụ:

$$
W^{(k)} = \operatorname{diag}\!\left(\min\!\left(1, \, \frac{\delta}{\big|y_i - x_i^\top \hat{\beta}^{(k)}\big|}\right)_{i=1}^n\right), \qquad \hat{\beta}^{(k+1)} = \Big(X^\top W^{(k)} X\Big)^{-1} X^\top W^{(k)} y
$$

Cơ chế tự bảo vệ của `IRLS` hiện lên cực kỳ trực quan: mọi cổ phiếu bình thường có $|r_i| \le \delta$ nhận trọn trọng số $w_i = 1$; bất kỳ cổ phiếu nào có cú nhảy dị thường $|r_i| = 20\delta$ lập tức bị thuật toán ghìm trọng số xuống $w_i = \frac{1}{20} = 0.05$! Lưu ý rằng hàm phạt trên phần dư $r_i$ chưa tự động kẹp đòn bẩy $x_i$ quá lớn, nên trong thực hành luôn phải tiền xử lý kẹp biên ma trận $X$ trước khi chạy `IRLS`.

### 3.2. Chứng minh Toán học Hồi quy Phân vị & Hàm Mất mát Ghim

Trong quản trị rủi ro danh mục và dự báo phân phối lợi nhuận bất đối xứng, việc biết kỳ vọng trung bình $\mathbb{E}[Y \mid X]$ là không đủ: một tín hiệu có thể làm tăng nhẹ trung bình nhưng đồng thời làm phình gấp đôi đuôi lỗ phân vị $5\%$! Roger Koenker và Gilbert Bassett (1978) giới thiệu **Hồi quy Phân vị** (Quantile Regression) dựa trên **Hàm Mất mát Ghim** (Pinball Loss) với mức phân vị mục tiêu $\tau \in (0, 1)$:

$$
\rho_\tau(u) = u\big(\tau - \mathbb{I}_{\{u < 0\}}\big) = \begin{cases} \tau u, & \text{nếu } u \ge 0 \\ (1 - \tau)(-u), & \text{nếu } u < 0 \end{cases}
$$

**Định lý 3.6 — Tính Nhất quán Phân vị Có Điều kiện của Hàm Mất mát Ghim.** *Cho biến ngẫu nhiên liên tục $Y$ có hàm mật độ có điều kiện $f_{Y|X}(y \mid x)$ và hàm phân phối tích lũy tăng nghiêm ngặt $F_{Y|X}(y \mid x)$ thỏa mãn $\mathbb{E}[|Y| \mid X = x] < \infty$. Khi đó bài toán cực tiểu hóa rủi ro kỳ vọng có điều kiện $\min_{q \in \mathbb{R}} \mathbb{E}\big[\rho_\tau(Y - q) \mid X = x\big]$ đạt cực tiểu toàn cục đúng tại phân vị mức $\tau$ có điều kiện $q^\star(x) = Q_\tau(Y \mid X = x) \triangleq F_{Y|X}^{-1}(\tau \mid x)$.*

**Chứng minh Bằng Quy tắc Đạo hàm Tích phân Leibniz.** Tách kỳ vọng $\mathcal{R}(q) \triangleq \mathbb{E}[\rho_\tau(Y - q) \mid X = x]$ theo điểm chia $y = q$ — với $y < q$ thì $u = y - q < 0 \implies \rho_\tau(u) = (1 - \tau)(q - y)$, còn với $y \ge q$ thì $u \ge 0 \implies \rho_\tau(u) = \tau(y - q)$:

$$
\mathcal{R}(q) = (1 - \tau)\int_{-\infty}^{q} (q - y)\,f_{Y|X}(y \mid x)\,dy + \tau \int_{q}^{+\infty} (y - q)\,f_{Y|X}(y \mid x)\,dy
$$

Áp dụng quy tắc Leibniz lấy đạo hàm theo cận tích phân $q$, chú ý cả hai biểu thức dưới dấu tích phân đều triệt tiêu bằng $0$ ngay tại biên $y = q$:

$$
\frac{\partial \mathcal{R}(q)}{\partial q} = (1 - \tau)\int_{-\infty}^{q} f_{Y|X}(y \mid x)\,dy - \tau \int_{q}^{+\infty} f_{Y|X}(y \mid x)\,dy = (1 - \tau)F_{Y|X}(q \mid x) - \tau\big[1 - F_{Y|X}(q \mid x)\big] = F_{Y|X}(q \mid x) - \tau
$$

Đạo hàm bậc hai $\frac{\partial^2 \mathcal{R}(q)}{\partial q^2} = f_{Y|X}(y \mid x)\big|_{y=q} > 0$ bảo đảm $\mathcal{R}(q)$ lồi nghiêm ngặt. Cho đạo hàm bậc nhất bằng $0$ ta thu được $F_{Y|X}(q^\star \mid x) = \tau \iff q^\star = F_{Y|X}^{-1}(\tau \mid x)$! Trên mẫu hữu hạn, đặt phần dư dương/âm $u_i^+ = \max(y_i - x_i^\top \beta, 0) \ge 0$ và $u_i^- = \max(x_i^\top \beta - y_i, 0) \ge 0$, bài toán cực tiểu hóa quy về một **Quy hoạch Tuyến tính** chuẩn tắc:

$$
\min_{\beta \in \mathbb{R}^p, \, u^+, u^- \in \mathbb{R}_+^n} \; \sum_{i=1}^{n} \Big[\tau\,u_i^+ + (1 - \tau)\,u_i^-\Big] \qquad \text{thỏa mãn} \qquad X\beta + u^+ - u^- = y
$$

*Lưu ý kỹ thuật khi ước lượng đa mức phân vị đồng thời:* Nếu khớp độc lập hai đường thẳng tại $\tau_1 = 0.05$ và $\tau_2 = 0.10$ trên mẫu nhỏ, ở miền ngoại biên đặc trưng lớn có thể xảy ra hiện tượng **giao cắt các đường phân vị** — tức $\hat{Q}_{0.05}(Y \mid x) > \hat{Q}_{0.10}(Y \mid x)$ phi lý về mặt xác suất! Trong sản xuất thực tế, các bàn rủi ro giải đồng thời nhiều mức $\tau_k$ kèm ràng buộc thứ tự $\hat{Q}_{\tau_1}(Y \mid x_i) \le \hat{Q}_{\tau_2}(Y \mid x_i)$ hoặc sắp xếp lại hàm phân vị hậu nghiệm của Chernozhukov. $\blacksquare$

---

## 4. Chuẩn hóa Mặt cắt Ngang & Giải phẫu Cơ chế Dữ liệu Khuyết Tài chính

### 4.1. Cắt cụt Phân vị so với Biến đổi Hạng Chuẩn Nghịch đảo

Trước khi kết hợp các đặc trưng thô trên mặt cắt $N$ cổ phiếu tại ngày $t$, nhà nghiên cứu phải lựa chọn giữa hai trường phái tiền xử lý ngoại lai:
1. **Kẹp Biên Bền vững** (Winsorization): Không bao giờ chuẩn hóa bằng $(x_i - \bar{x})/s$ ngay trên dữ liệu thô! Quy trình chuẩn là kẹp hai đầu vào ngưỡng $[\tilde{x} - 5\,\widehat{\sigma}_{\text{MAD}}, \, \tilde{x} + 5\,\widehat{\sigma}_{\text{MAD}}]$ hoặc phân vị $[q_{0.01}, q_{0.99}]$, sau đó mới trừ trung bình và chia độ lệch chuẩn đã kẹp. Phương pháp này **giữ lại thông tin khoảng cách tỷ lệ** giữa các cổ phiếu — một mã tăng trưởng doanh thu $+45\%$ vẫn mạnh gấp ba lần mã $+15\%$ — nhưng tạo cụm điểm dồn đống ở hai mép kẹp.
2. **Biến đổi Hạng Chuẩn Nghịch đảo** (Rank-Gauss Transformation): Sắp xếp hạng đặc trưng trên mặt cắt ngang ngày $t$ thành $\operatorname{rank}(x_i) \in \{1, 2, \dots, N\}$ với đồng hạng nhận hạng trung bình, rồi chiếu qua hàm phân vị chuẩn tắc nghịch đảo kèm hiệu chỉnh biên $-0.5$:

$$
z_i^{\text{RG}} = \Phi^{-1}\!\left(\frac{\operatorname{rank}(x_i) - 0.5}{N}\right) \in \big(-\infty, +\infty\big)
$$

   *Tại sao bắt buộc phải trừ $0.5$ trên tử số?* Nếu viết ngây thơ $\Phi^{-1}(\operatorname{rank}(x_i)/N)$, cổ phiếu đứng đầu bảng ($\operatorname{rank} = N$) nhận $\Phi^{-1}(1) = +\infty$ làm nổ tung ma trận! Biến đổi hạng chuẩn ép phân phối đầu ra trên mọi ngày $t$ đều chuẩn tắc hoàn hảo $\mathcal{N}(0, 1)$, bất biến tuyệt đối dưới mọi biến đổi đồng biến phi tuyến như $x \mapsto x^3$ hay $\sinh(x)$, cực kỳ lý tưởng khi đưa vào mạng nơ-ron hoặc kết hợp đa tín hiệu tại WorldQuant, đổi lại cái giá là xóa bỏ thông tin độ lớn cách biệt giữa hạng nhất và hạng nhì.

| Phương pháp xử lý | Điểm gãy bền vững | Bảo toàn khoảng cách tỷ lệ | Bất biến đơn điệu phi tuyến | Kịch bản sử dụng tối ưu |
| :--- | :--- | :--- | :--- | :--- |
| **Chuẩn hóa Z cổ điển** | $0\%$ | Có (khi sạch ngoại lai) | Không | Chỉ dùng sau khi đã lọc và kẹp biên kỹ |
| **Kẹp biên theo `MAD`** | $50\%$ | Có trong miền lõi $\pm 5\sigma$ | Không | Hồi quy nhân tố kinh tế cần giữ độ lớn cực trị vừa phải |
| **Hạng chuẩn nghịch đảo** | $50\%$ | Không (chỉ giữ thứ tự hạng) | Tuyệt đối $100\%$ | Kết hợp hàng trăm đặc trưng lệch đuôi hoặc mạng nơ-ron |

### 4.2. Phân loại Rubin (`MCAR / MAR / MNAR`) & Tín hiệu Alpha Từ Sự Vắng mặt

Trên dữ liệu kế toán doanh nghiệp và dữ liệu thay thế như lưu lượng thẻ tín dụng, ảnh vệ tinh hay ước tính phân tích viên, các ô trống `NaN` không hề vô tội! Gọi $M \in \{0, 1\}^N$ là vector chỉ báo bị khuyết, $X^{\text{obs}}$ là dữ liệu quan sát được và $X^{\text{mis}}$ là giá trị thực bị ẩn. Khung lý thuyết của Donald Rubin phân rã xác suất khuyết thành ba cấp độ nguy hiểm tăng dần:

$$
\begin{aligned}
\text{MCAR — Khuyết hoàn toàn ngẫu nhiên:} \quad & \mathbb{P}(M \mid X^{\text{obs}}, X^{\text{mis}}) = \mathbb{P}(M) \\
\text{MAR — Khuyết ngẫu nhiên có điều kiện:} \quad & \mathbb{P}(M \mid X^{\text{obs}}, X^{\text{mis}}) = \mathbb{P}(M \mid X^{\text{obs}}) \\
\text{MNAR — Khuyết mang thông tin ẩn:} \quad & \mathbb{P}(M \mid X^{\text{obs}}, X^{\text{mis}}) \neq \mathbb{P}(M \mid X^{\text{obs}})
\end{aligned}
$$

- **Phân biệt thực chiến:** Gói tin mạng bị rớt ngẫu nhiên 2 giây là `MCAR`. Cổ phiếu vốn hóa nhỏ không có báo cáo dự phóng `EPS` của Phố Wall do quy mô vốn hóa thấp — biến đã có sẵn trong $X^{\text{obs}}$ — là `MAR`: nếu tự ý xóa bỏ các dòng khuyết, mẫu kiểm thử của bạn sẽ dính thiên lệch vốn hóa lớn nghiêm trọng! Nguy hiểm nhất là `MNAR`: doanh nghiệp bán lẻ bất ngờ **ngừng công bố doanh số cửa hàng hàng tháng** hoặc chậm nộp báo cáo kiểm toán chính bởi vì lợi nhuận ẩn $X^{\text{mis}}$ đang sụt giảm thê thảm!

```python
import numpy as np
from scipy.optimize import linprog
from scipy.special import ndtri
from scipy.stats import rankdata

def rank_gauss_cross_section(x: np.ndarray) -> np.ndarray:
    """Biến đổi hạng chuẩn nghịch đảo xử lý an toàn các ô NaN trên mặt cắt ngang cổ phiếu."""
    out = np.full_like(x, np.nan, dtype=np.float64)
    valid = ~np.isnan(x)
    n_val = int(np.sum(valid))
    if n_val > 1:
        ranks = rankdata(x[valid], method="average")
        out[valid] = ndtri((ranks - 0.5) / n_val)
    return out

def huber_irls_fit(X: np.ndarray, y: np.ndarray, delta: float = 1.345, max_iter: int = 30, tol: float = 1e-6) -> np.ndarray:
    """Ước lượng hồi quy bền vững Huber bằng thuật toán bình phương tối thiểu tái trọng số lặp."""
    beta = np.linalg.lstsq(X, y, rcond=None)[0]
    for _ in range(max_iter):
        resid = y - X @ beta
        scale = max(1.4826 * float(np.median(np.abs(resid - np.median(resid)))), 1e-8)
        weights = np.minimum(1.0, (delta * scale) / np.maximum(np.abs(resid), 1e-12))
        beta_new = np.linalg.solve((X.T * weights) @ X, (X.T * weights) @ y)
        if np.linalg.norm(beta_new - beta) <= tol * (np.linalg.norm(beta) + tol):
            return beta_new
        beta = beta_new
    return beta

def quantile_regression_lp(X: np.ndarray, y: np.ndarray, tau: float = 0.05) -> np.ndarray:
    """Giải chính xác bài toán Hồi quy Phân vị Koenker-Bassett qua Quy hoạch Tuyến tính điểm trong."""
    n_obs, p_dim = X.shape
    c_obj = np.concatenate([np.zeros(p_dim), np.full(n_obs, tau), np.full(n_obs, 1.0 - tau)])
    a_eq = np.hstack([X, np.eye(n_obs), -np.eye(n_obs)])
    bounds = [(None, None)] * p_dim + [(0.0, None)] * (2 * n_obs)
    res = linprog(c_obj, A_eq=a_eq, b_eq=y, bounds=bounds, method="highs")
    return res.x[:p_dim]
```

---

## 5. Ví dụ Phỏng vấn Thực chiến & Quy tắc Xử lý Dữ liệu Sống Còn

**Bài toán — Phỏng vấn Nghiên cứu Tín hiệu Nhiễu cao tại Two Sigma / Citadel:**
Cho mẫu $5$ quan sát đặc trưng mặt cắt ngang: $X = [-1.0, \, 0.0, \, +1.0, \, +2.0, \, +100.0]$.
1. **Phần A:** Tính trung bình mẫu $\bar{X}$, độ lệch chuẩn mẫu $s$ với mẫu số $n - 1 = 4$, và so sánh với cặp ước lượng bền vững $(\tilde{X}, \widehat{\sigma}_{\text{MAD}})$. Tính điểm chuẩn hóa thông thường và điểm chuẩn hóa bền vững của quan sát $X_4 = +2.0$.
2. **Phần B:** Trong vòng lặp đầu tiên của hồi quy bền vững với ngưỡng $\delta = 1.5$, một cổ phiếu có phần dư hiện tại $r_i^{(0)} = -6.0$. Trọng số $w_i^{(0)}$ gán cho cổ phiếu này trong ma trận `IRLS` bằng bao nhiêu?

**Lời giải Chi tiết:**
1. **Giải Phần A:**
   - **Thống kê cổ điển bị phá hủy hoàn toàn:** $\bar{X} = \frac{102}{5} = \mathbf{20.4}$. Độ lệch chuẩn mẫu $s = \sqrt{\frac{1}{4}\big[(-21.4)^2 + (-20.4)^2 + (-19.4)^2 + (-18.4)^2 + (79.6)^2\big]} = \sqrt{\frac{7925.2}{4}} \approx \mathbf{44.51}$. Khi đó cổ phiếu $X_4 = +2.0$ vốn đứng nhì nhóm bình thường lại nhận điểm chuẩn hóa **âm**: $z_4^{\text{classic}} = \frac{2.0 - 20.4}{44.51} \approx \mathbf{-0.413}$, còn điểm ngoại lai $X_5 = 100$ cũng chỉ có $z_5^{\text{classic}} = \frac{79.6}{44.51} \approx +1.79 < 2.0$! Đây là **hiệu ứng tự che chắn ngoại lai** (Masking Effect): dùng ngưỡng $|z| > 3$ cổ điển sẽ không phát hiện ra chính điểm ngoại lai $100$ vì nó đã tự thổi phồng mẫu số $s$!
   - **Thống kê bền vững:** Trung vị $\tilde{X} = \mathbf{+1.0}$. Dãy độ lệch tuyệt đối $|X_i - 1.0| = [2.0, \, 1.0, \, 0.0, \, 1.0, \, 99.0]$, sắp xếp tăng dần có trung vị bằng $1.0 \implies \widehat{\sigma}_{\text{MAD}} = 1.4826 \times 1.0 = \mathbf{1.4826}$. Điểm chuẩn hóa bền vững của $X_4$ là $\frac{2.0 - 1.0}{1.4826} \approx \mathbf{+0.674}$ phản ánh chuẩn xác vị thế dương, và điểm ngoại lai $X_5$ lộ nguyên hình ở mức $\frac{99.0}{1.4826} \approx \mathbf{+66.8\,\sigma}$!
2. **Giải Phần B:**
   - Với $|r_i^{(0)}| = 6.0 > \delta = 1.5$, trọng số bằng $w_i^{(0)} = \frac{\delta}{|r_i^{(0)}|} = \frac{1.5}{6.0} = \mathbf{0.25}$, tức giảm ngay $75\%$ sức ảnh hưởng của quan sát dị thường ở bước cập nhật kế tiếp.

> [!IMPORTANT]
> **Ba Kỷ luật Bất khả Xâm phạm Khi Điền Khuyết & Cắt Ngoại lai Trong Kiểm thử:**
> 1. **Cấm tuyệt đối kéo dài giá trị cũ vô thời hạn (`forward-fill` không trần hết hạn):** Khi điền giá trị trước đó cho dữ liệu cơ bản hoặc dữ liệu thay thế, bắt buộc gắn giới hạn tuổi dữ liệu tối đa — ví dụ $95$ ngày cho báo cáo quý. Khi quá hạn mà chưa có bản tin mới, đây chính là sự kiện `MNAR` — phải ngắt tín hiệu cũ và bật cờ biến giả cảnh báo chậm công bố $\mathbb{I}_{\{\text{stale}\}} = 1$!
> 2. **Tách Rạch ròi Cắt Ngoại lai Đặc trưng $X$ và Lợi nhuận Mục tiêu $Y$:** Bạn **được phép và bắt buộc** kẹp biên hoặc biến đổi hạng trên ma trận đặc trưng $X_t$, nhưng khi **chấm điểm lãi lỗ kiểm thử danh mục**, tuyệt đối **cấm cắt cụt lợi nhuận thực hiện $Y_{t+1}$**! Nếu bạn kẹp biên lợi nhuận kiểm thử ở $\pm 10\%$, bạn đã xóa sổ giả tạo các cú lỗ $-60\%$ của danh mục bán khống bị mua thâu tóm!
> 3. **Điền Khuyết Mặt cắt Ngang Theo Nhóm Ngành Đồng cấp:** Với các đặc trưng `MAR`, điền khuyết bằng trung vị nội ngành tại đúng ngày $t$ kèm cột nhị phân đánh dấu khuyết, không bao giờ dùng trung bình toàn chuỗi thời gian $[1, T]$ gây rò rỉ tương lai.
