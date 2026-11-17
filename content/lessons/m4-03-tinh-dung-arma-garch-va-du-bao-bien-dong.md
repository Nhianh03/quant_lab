# M4.03 — Tính dừng Hiệp phương sai, Mô hình ARMA, Phân cụm Biến động GARCH & Điều chỉnh Quy mô Rủi ro

## 1. Trực giác & Động lực: Tấm Gương Phản Chiếu Giữa Lợi nhuận và Biến động

Nếu bạn vẽ đồ thị chuỗi giá cổ phiếu S&P 500 suốt 30 năm, mức giá $P_t$ trôi dạt không giới hạn từ vài trăm điểm lên vài ngàn điểm — mọi trung bình mẫu hay độ lệch chuẩn tính trên $P_t$ đều vô nghĩa vì phụ thuộc hoàn toàn vào năm bạn bắt đầu đo. Khi chuyển sang chuỗi lợi nhuận logarit ngày $r_t = \ln(P_t / P_{t-1})$, một nghịch lý thực nghiệm kỳ thú hiện ra ngay trước mắt mọi nhà nghiên cứu chuỗi thời gian tài chính:
1. **Bản thân chuỗi lợi nhuận có dấu $r_t$ gần như không có tự tương quan tuyến tính** ($\operatorname{Corr}(r_t, r_{t-k}) \approx 0$ với hầu hết $k \ge 1$, trừ hiệu ứng nảy vi cấu trúc cực ngắn hoặc đảo chiều nhẹ ở chân trời vài ngày).
2. **Thế nhưng chuỗi độ lớn tuyệt đối $|r_t|$ và bình phương lợi nhuận $r_t^2$ lại có tự tương quan dương cực mạnh kéo dài hàng chục tuần!** Như Benoit Mandelbrot đã đúc kết từ năm 1963: *"Những biến động lớn có xu hướng nối đuôi nhau bởi những biến động lớn (dù mang dấu âm hay dương), và những phiên tĩnh lặng nối đuôi nhau bởi những phiên tĩnh lặng"*.

Hiện tượng **phân cụm biến động** (Volatility Clustering) này là chìa khóa vàng của quản trị danh mục hiện đại: dù lợi nhuận kỳ vọng ngày mai cực khó đoán, **rủi ro phương sai ngày mai $\sigma_{t+1|t}^2$ lại hoàn toàn dự báo được với độ chính xác cao**! Làm chủ toán học của tính dừng, mô hình tự hồi quy tuyến tính và họ mô hình phương sai có điều kiện giúp bạn vừa tránh bẫy hồi quy trên chuỗi không dừng, vừa tự động co giãn đòn bẩy theo thời gian thực để nâng cao tỷ số Sharpe và cắt cụt các cú sụt giảm vốn thảm khốc.

---

## 2. Tính Dừng Mạnh, Tính Dừng Yếu & Hàm Tự Tương quan

### 2.1. Hai Cấp độ Tính Dừng và Các Phản Ví dụ Phỏng vấn Kinh điển

**Định nghĩa 4.1 — Tính Dừng Nghiêm ngặt so với Tính Dừng Hiệp phương sai:** *Cho quá trình ngẫu nhiên thời gian rời rạc $\{X_t\}_{t \in \mathbb{Z}}$:*
1. **Tính Dừng Mạnh** (Strict Stationarity): Với mọi $k \ge 1$, mọi bộ thời điểm $(t_1, \dots, t_k)$ và mọi độ dịch thời gian $\tau \in \mathbb{Z}$, phân phối đồng thời bất biến: $(X_{t_1}, \dots, X_{t_k}) \stackrel{d}{=} (X_{t_1+\tau}, \dots, X_{t_k+\tau})$.
2. **Tính Dừng Yếu / Dừng Hiệp phương sai** (Covariance-Stationary Process): Quá trình thỏa mãn đồng thời ba điều kiện mô-men bậc hai hữu hạn:
   - $\mathbb{E}[X_t] = \mu$ là hằng số không phụ thuộc vào $t$;
   - $\operatorname{Var}(X_t) = \mathbb{E}[(X_t - \mu)^2] = \gamma(0) < \infty$ hữu hạn với mọi $t$;
   - Tự hiệp phương sai $\operatorname{Cov}(X_t, X_{t-h}) = \gamma(h)$ **chỉ phụ thuộc vào độ trễ $h$** chứ không phụ thuộc vào mốc thời gian $t$ (suy ra tính chẵn $\gamma(-h) = \gamma(h)$).

> [!NOTE]
> **Câu hỏi Bẫy Vòng Kỹ thuật: "Dừng mạnh có suy ra dừng yếu không, và ngược lại?" — Câu trả lời là KHÔNG theo cả hai chiều!**
> - *Dừng mạnh nhưng KHÔNG dừng yếu:* Dãy $X_t \stackrel{\text{iid}}{\sim} \operatorname{Cauchy}(0, 1)$ có phân phối đồng thời bất biến tuyệt đối qua thời gian, nhưng $\mathbb{E}[X_t^2] = +\infty$ không tồn tại phương sai nên vi phạm định nghĩa dừng yếu! (Tương tự một quá trình `GARCH(1,1)` có $\alpha_1 + \beta_1 = 1$ ở một số tham số có thể dừng nghiêm ngặt nhưng phương sai không điều kiện bằng vô cực!).
> - *Dừng yếu nhưng KHÔNG dừng mạnh:* Cho các biến độc lập trong đó tại $t$ chẵn thì $X_t \sim \mathcal{N}(0, 1)$, còn tại $t$ lẻ thì $X_t \in \{-1, +1\}$ xác suất đều $1/2$. Mọi $t$ đều có $\mathbb{E}[X_t] = 0$, $\operatorname{Var}(X_t) = 1$ và $\operatorname{Cov}(X_t, X_s) = 0$ ($t \neq s$), nên quá trình là nhiễu trắng dừng yếu hoàn hảo, nhưng phân phối biên tại $t$ chẵn (liên tục) khác hẳn $t$ lẻ (rời rạc)! *(Chỉ riêng đối với **quá trình chuẩn Gauss**, vì phân phối đồng thời hoàn toàn được xác định bởi kỳ vọng và hiệp phương sai, dừng yếu mới tương đương 100% với dừng mạnh!).*

### 2.2. Hàm Tự Tương quan, Tự Tương quan Riêng phần & Kiểm định Ljung-Box

Trên quá trình dừng yếu, **Hàm Tự Tương quan** (Autocorrelation Function — `ACF`) chuẩn hóa về $[-1, 1]$ là $\rho(h) = \frac{\gamma(h)}{\gamma(0)}$. Để tách tác động truyền dẫn bắc cầu qua các biến trung gian $(X_{t-1}, \dots, X_{t-h+1})$ ra khỏi mối liên hệ trực tiếp giữa $X_t$ và $X_{t-h}$, ta định nghĩa **Tự Tương quan Riêng phần** (`PACF`) tại độ trễ $h \ge 2$ là hệ số cuối cùng $\phi_{hh}$ trong phép chiếu tuyến tính bình phương tối thiểu $X_t$ lên $(1, X_{t-1}, \dots, X_{t-h})$ — tức tương quan giữa hai phần dư của $X_t$ và $X_{t-h}$ sau khi đã khử tuyến tính khối ở giữa:
- Quá trình trung bình trượt bậc $q$ có `ACF` **cắt cụt đột ngột về $0$** tại mọi $|h| > q$, còn `PACF` tắt dần hàm mũ/dao động.
- Quá trình tự hồi quy bậc $p$ có `ACF` tắt dần hàm mũ/dao động, còn `PACF` **cắt cụt đột ngột về $0$** tại mọi $h > p$!

Để kiểm định đồng thời giả thuyết nhiễu trắng $H_0: \rho(1) = \rho(2) = \dots = \rho(m) = 0$ (ví dụ kiểm tra phần dư của mô hình dự báo đã vắt kiệt tín hiệu tuyến tính hay chưa), thống kê hộp **Ljung-Box** hiệu chỉnh cỡ mẫu nhỏ hội tụ về phân phối Chi-bình phương bậc $m$:

$$
Q_{\text{LB}}(m) = T(T + 2) \sum_{k=1}^m \frac{\hat{\rho}_k^2}{T - k} \xrightarrow[H_0]{d} \chi^2_m
$$

---

## 3. Toán tử Trễ, Mô hình `ARMA`, Nghiệm Đơn vị ADF & Sai phân Phân số

### 3.1. Điều kiện Vòng tròn Đơn vị của Quá trình `ARMA`

Định nghĩa **toán tử trễ** $B$ bởi $B X_t = X_{t-1}$, kéo theo $B^k X_t = X_{t-k}$. Một quá trình **Trung bình Trượt Tự hồi quy** (Autoregressive Moving Average — `ARMA`) bậc $(p, q)$ với nhiễu trắng $\varepsilon_t \sim \operatorname{WN}(0, \sigma_\varepsilon^2)$ được viết gọn qua hai đa thức đặc trưng $\Phi(z) = 1 - \sum_{i=1}^p \phi_i z^i$ và $\Theta(z) = 1 + \sum_{j=1}^q \theta_j z^j$:

$$
\Phi(B) X_t = c + \Theta(B) \varepsilon_t \iff X_t = c + \sum_{i=1}^p \phi_i X_{t-i} + \varepsilon_t + \sum_{j=1}^q \theta_j \varepsilon_{t-j}
$$

**Định lý 4.5 (Điều kiện Nhân quả Dừng & Khả nghịch).** *Giả sử $\Phi(z)$ và $\Theta(z)$ không có nghiệm phức chung:*
1. *Mô hình `ARMA(p, q)` có biểu diễn nhân quả dừng duy nhất dưới dạng chuỗi trung bình trượt vô hạn Wold $X_t = \mu + \sum_{j=0}^\infty \psi_j \varepsilon_{t-j}$ (với $\sum_{j=0}^\infty |\psi_j| < \infty$) **khi và chỉ khi mọi nghiệm phức $z_i$ của $\Phi(z) = 0$ đều nằm nghiêm ngặt BÊN NGOÀI vòng tròn đơn vị** ($|z_i| > 1, \, \forall i = 1, \dots, p$).*
2. *Mô hình khả nghịch (biểu diễn được $\varepsilon_t$ hội tụ tuyệt đối theo quá khứ $\{X_{t-k}\}_{k \ge 0}$) **khi và chỉ khi mọi nghiệm phức của $\Theta(z) = 0$ cũng nằm nghiêm ngặt bên ngoài vòng tròn đơn vị**.*

**Chứng minh Trực quan Vì sao Nghiệm Phải Lớn hơn 1 (Tránh Nhầm Dấu Trong Phỏng vấn!):**
Xét trường hợp cơ sở `AR(1)`: $(1 - \phi_1 B) X_t = c + \varepsilon_t$. Đa thức đặc trưng là $\Phi(z) = 1 - \phi_1 z = 0 \implies$ nghiệm duy nhất là **$z_1 = \frac{1}{\phi_1}$**! Khai triển chuỗi cấp số nhân toán tử nghịch đảo $(1 - \phi_1 B)^{-1} = \sum_{j=0}^\infty \phi_1^j B^j$ hội tụ tuyệt đối khi và chỉ khi $|\phi_1| < 1 \iff |z_1| = \left|\frac{1}{\phi_1}\right| > 1$! Khi $|\phi_1| < 1$, ta tính ngay ba đại lượng chuẩn:

$$
\mu = \mathbb{E}[X_t] = \frac{c}{1 - \phi_1}, \qquad \gamma(0) = \operatorname{Var}(X_t) = \frac{\sigma_\varepsilon^2}{1 - \phi_1^2}, \qquad \rho(h) = \phi_1^{|h|}
$$

Tổng quát với bậc $p$, phân tích $\Phi(z) = \prod_{i=1}^p \left(1 - \frac{z}{z_i}\right)$ thành phân thức đơn cho thấy chuỗi toán tử $\Phi(B)^{-1}$ hội tụ tuyệt đối trên $\{|B| \le 1\}$ khi và chỉ khi $|1/z_i| < 1 \iff |z_i| > 1$ với mọi $i$! $\blacksquare$

### 3.2. Kiểm định Nghiệm Đơn vị ADF & Sai phân Bậc Phân số Giữ Bộ nhớ

Khi $\Phi(1) = 0$ (ví dụ $\phi_1 = 1$ trong `AR(1)` thành bước đi ngẫu nhiên $Y_t = Y_{t-1} + \varepsilon_t$), phương sai $\operatorname{Var}(Y_t) = t \sigma_\varepsilon^2 \to \infty$ nổ tung tuyến tính theo thời gian — quá trình được gọi là **tích hợp bậc một** $I(1)$. Để kiểm định giả thuyết có nghiệm đơn vị hay không, **Kiểm định Dickey-Fuller Mở rộng** (Augmented Dickey-Fuller — `ADF`) biến đổi phương trình bằng cách trừ $Y_{t-1}$ hai vế và thêm các trễ sai phân để lọc sạch tự tương quan phần dư:

$$
\Delta Y_t = \alpha + \beta t + \gamma Y_{t-1} + \sum_{i=1}^{p-1} \delta_i \Delta Y_{t-i} + \varepsilon_t, \qquad H_0: \gamma = 0 \;\; (\text{không dừng } I(1)) \quad \text{đối lập} \quad H_1: \gamma < 0 \;\; (\text{dừng})
$$

*Điểm cốt tử:* Dưới $H_0: \gamma = 0$, biến giải thích $Y_{t-1}$ là một quá trình tích hợp không dừng nên định lý giới hạn trung tâm chuẩn bị phá vỡ; thống kê $t_{\hat{\gamma}} = \hat{\gamma} / \operatorname{SE}(\hat{\gamma})$ hội tụ về phân phối phi chuẩn Dickey-Fuller biểu diễn qua tích phân Itô của chuyển động Brown (bị lệch hẳn sang âm: ở mức ý nghĩa $5\%$ có hệ số chặn không xu hướng, ngưỡng tới hạn là **$-2.86$** chứ không phải $-1.645$!).

**Đánh đổi Tính Dừng - Bộ nhớ bằng Sai phân Bậc Phân số (López de Prado, 2018):**
Khi biến chuỗi log-giá $y_t = \ln P_t \sim I(1)$ thành lợi nhuận sai phân bậc nguyên $d = 1$: $(1 - B)^1 y_t = y_t - y_{t-1}$, chuỗi đạt tính dừng hoàn toàn nhưng **xóa sạch 100% ký ức về vùng hỗ trợ/kháng cự và mức giá lịch sử dài hạn**! Khai triển nhị thức Newton tổng quát cho số thực $d \in (0, 1)$ định nghĩa toán tử sai phân phân số:

$$
(1 - B)^d = \sum_{k=0}^\infty (-1)^k \binom{d}{k} B^k = \sum_{k=0}^\infty \omega_k B^k, \qquad \omega_0 = 1, \quad \omega_k = -\omega_{k-1} \frac{d - k + 1}{k}
$$

Với $d = 1$, ta có $\omega_0 = 1, \omega_1 = -1$ và $\omega_k = 0$ ($\forall k \ge 2$). Ngược lại với $d \in (0.30, 0.45)$, dãy trọng số $\omega_k$ suy giảm chậm theo luật lũy thừa: tìm giá trị $d^\star$ nhỏ nhất vừa đủ vượt qua ngưỡng kiểm định `ADF` ($t_{\text{ADF}} < -2.86$) giúp đặc trưng học máy của bạn vừa đảm bảo tính dừng thống kê ngoài mẫu, vừa giữ lại hệ số tương quan $> 85\%$ với chuỗi log-giá gốc!

---

## 4. Mô hình GARCH(1, 1): Chứng minh Đuôi dày Nội sinh & Dự báo Nhiều bước

Để mô hình hóa trực tiếp động lực của phương sai có điều kiện $\sigma_t^2 \triangleq \operatorname{Var}(r_t \mid \mathcal{F}_{t-1})$, Tim Bollerslev năm 1986 mở rộng mô hình của Robert Engle thành quá trình **Phương sai Thay đổi Có điều kiện Tự hồi quy Tổng quát** (Generalized Autoregressive Conditional Heteroskedasticity — `GARCH`). Dạng bậc nhất `GARCH(1, 1)` thống trị tuyệt đối thực hành Phố Wall nhờ sự tinh gọn đáng kinh ngạc:

$$
r_t = \mu + \varepsilon_t, \qquad \varepsilon_t = \sigma_t z_t \;\; \big(z_t \stackrel{\text{iid}}{\sim} (0, 1)\big), \qquad \sigma_t^2 = \omega + \alpha_1 \varepsilon_{t-1}^2 + \beta_1 \sigma_{t-1}^2
$$

với các ràng buộc đảm bảo phương sai dương nghiêm ngặt: $\omega > 0, \, \alpha_1 \ge 0, \, \beta_1 \ge 0$. Ở đây $\alpha_1$ đo tốc độ phản ứng tức thời trước cú sốc tin tức hôm qua $\varepsilon_{t-1}^2$ (thường $\alpha_1 \approx 0.05\text{–}0.12$ trên cổ phiếu ngày), còn $\beta_1$ đo bộ nhớ quán tính của bản thân biến động ($\beta_1 \approx 0.85\text{–}0.92$).

### 4.1. Chứng minh Ba Kết quả Phỏng vấn Cốt lõi của GARCH(1, 1)

**1. Phương sai Không điều kiện Dài hạn $\sigma^2$ và Điều kiện Dừng $\alpha_1 + \beta_1 < 1$:**
Lưu ý $\mathbb{E}[\varepsilon_t^2 \mid \mathcal{F}_{t-1}] = \sigma_t^2 \mathbb{E}[z_t^2] = \sigma_t^2$, suy ra theo Tính chất Tháp $\mathbb{E}[\varepsilon_t^2] = \mathbb{E}[\sigma_t^2] \triangleq \sigma^2$. Lấy kỳ vọng vô điều kiện hai vế phương trình `GARCH(1, 1)` khi quá trình dừng bậc hai:

$$
\sigma^2 = \omega + \alpha_1 \sigma^2 + \beta_1 \sigma^2 \implies \sigma^2 = \frac{\omega}{1 - \alpha_1 - \beta_1} \qquad (\text{tồn tại hữu hạn dương} \iff \alpha_1 + \beta_1 < 1)
$$

*(Nếu $\alpha_1 + \beta_1 = 1$ và $\omega = 0$, mô hình suy biến thành trung bình động mũ `EWMA` $\sigma_t^2 = (1 - \lambda)\varepsilon_{t-1}^2 + \lambda \sigma_{t-1}^2$ của RiskMetrics với $\lambda \approx 0.94$: cú sốc biến động tồn tại vĩnh viễn không bao giờ hồi quy về mức trung bình dài hạn!).*

**2. Chứng minh GARCH(1, 1) Tự Sinh Phân phối Đuôi dày ($\kappa > 3$) Dù $z_t \sim \mathcal{N}(0, 1)$ Chuẩn Thuần khiết:**
Giả sử $z_t \stackrel{\text{iid}}{\sim} \mathcal{N}(0, 1)$ có $\mathbb{E}[z_t^2] = 1$ và $\mathbb{E}[z_t^4] = 3$. Vì $z_t$ độc lập với $\sigma_t \in \mathcal{F}_{t-1}$, ta có $\mathbb{E}[\varepsilon_t^4] = \mathbb{E}[\sigma_t^4]\mathbb{E}[z_t^4] = 3\mathbb{E}[\sigma_t^4]$. Bình phương hai vế của $\sigma_t^2 = \omega + (\alpha_1 z_{t-1}^2 + \beta_1)\sigma_{t-1}^2$ và lấy kỳ vọng dùng $z_{t-1} \perp \sigma_{t-1}$:

$$
\mathbb{E}[\sigma_t^4] = \omega^2 + 2\omega(\alpha_1 + \beta_1)\mathbb{E}[\sigma_{t-1}^2] + \mathbb{E}\big[(\alpha_1 z_{t-1}^2 + \beta_1)^2\big] \mathbb{E}[\sigma_{t-1}^4]
$$

Thay $\mathbb{E}[(\alpha_1 z_{t-1}^2 + \beta_1)^2] = 3\alpha_1^2 + 2\alpha_1\beta_1 + \beta_1^2 = (\alpha_1 + \beta_1)^2 + 2\alpha_1^2$ và thay $\omega = \sigma^2(1 - \alpha_1 - \beta_1)$ vào cụm hằng số đầu $\omega^2 + 2\omega(\alpha_1 + \beta_1)\sigma^2 = \sigma^4(1 - \alpha_1 - \beta_1)(1 + \alpha_1 + \beta_1) = \sigma^4\big[1 - (\alpha_1 + \beta_1)^2\big]$, với điều kiện tồn tại mô-men bậc bốn $(\alpha_1 + \beta_1)^2 + 2\alpha_1^2 < 1$, ta rút ra ngay độ nhọn không điều kiện:

$$
\kappa = \frac{\mathbb{E}[\varepsilon_t^4]}{\sigma^4} = \frac{3\mathbb{E}[\sigma_t^4]}{\sigma^4} = \frac{3\big[1 - (\alpha_1 + \beta_1)^2\big]}{1 - (\alpha_1 + \beta_1)^2 - 2\alpha_1^2} > 3 \qquad (\forall \alpha_1 > 0)
$$

Sự giao thoa ngẫu nhiên của độ biến động theo thời gian tự động nén nhọn đỉnh và kéo dày hai đuôi của lợi nhuận vô điều kiện!

**3. Công thức Dự báo Hồi quy Trung bình $h$ Bước Tới hạn $\mathbb{E}_t[\sigma_{t+h}^2]$:**
Trừ $\sigma^2 = \omega + (\alpha_1 + \beta_1)\sigma^2$ khỏi phương trình gốc cho dạng độ lệch tâm: $\sigma_{t+h}^2 - \sigma^2 = \alpha_1 \varepsilon_{t+h-1}^2 + \beta_1 \sigma_{t+h-1}^2 - (\alpha_1 + \beta_1)\sigma^2$. Với $h \ge 2$, lấy kỳ vọng có điều kiện tại thời điểm $t$ (dùng Tính chất Tháp $\mathbb{E}_t[\varepsilon_{t+h-1}^2] = \mathbb{E}_t\big[\mathbb{E}_{t+h-2}[\varepsilon_{t+h-1}^2]\big] = \mathbb{E}_t[\sigma_{t+h-1}^2]$!):

$$
\mathbb{E}_t\big[\sigma_{t+h}^2 - \sigma^2\big] = (\alpha_1 + \beta_1)\,\mathbb{E}_t\big[\sigma_{t+h-1}^2 - \sigma^2\big] = \dots = (\alpha_1 + \beta_1)^{h-1}\big(\sigma_{t+1}^2 - \sigma^2\big)
$$

trong đó bước đầu $\sigma_{t+1}^2 = \omega + \alpha_1 \varepsilon_t^2 + \beta_1 \sigma_t^2$ đã hoàn toàn xác định tại cuối ngày $t$! Phương sai dự báo hội tụ hàm mũ về mức cân bằng dài hạn $\sigma^2$ với tốc độ dai dẳng $p = \alpha_1 + \beta_1$ và chu kỳ bán rã $\tau_{1/2}^{\text{vol}} = \frac{\ln 2}{-\ln(\alpha_1 + \beta_1)}$. $\blacksquare$

### 4.2. Điều chỉnh Quy mô Vị thế Theo Mục tiêu Biến động (Risk-Scaled Position Sizing)

Alan Moreira và Tyler Muir năm 2017 trên tạp chí *Journal of Finance* chứng minh thực nghiệm trên gần một thế kỷ dữ liệu cổ phiếu và nhân tố Mỹ rằng: khi biến động thị trường tăng gấp đôi sau một cú sốc khủng hoảng, lợi nhuận kỳ vọng tháng kế tiếp **không hề tăng gấp bốn** để bù đắp phương sai $\sigma_t^2$! Do đó, thay vì giữ đòn bẩy tĩnh cố định $w_t^{\text{raw}}$, việc co giãn quy mô vị thế hàng ngày tỷ lệ nghịch với độ lệch chuẩn dự báo từ `GARCH` nhằm ghim chặt rủi ro danh mục quanh mức mục tiêu $\sigma_{\text{target}}$ như $10\%/\text{năm}$:

$$
w_t^{\text{managed}} = \min\!\left( L_{\max}, \, \frac{\sigma_{\text{target}}}{\hat{\sigma}_{t+1|t}} \right) w_t^{\text{raw}}
$$

không chỉ chuẩn hóa chuỗi lợi nhuận đã chia biến động $r_{t+1} / \hat{\sigma}_{t+1|t}$ quay về xấp xỉ phân phối chuẩn êm ả (triệt tiêu phần lớn đuôi dày trước khi đưa vào tối ưu danh mục!), mà còn cải thiện đáng kể tỷ số Sharpe ngoài mẫu nhờ tự động hạ đòn bẩy ngay từ những phiên rung lắc đầu tiên của khủng hoảng.

---

## 5. Ví dụ Phỏng vấn Thực chiến: Khớp Tham số & Dự báo Cấu trúc Kỳ hạn Biến động

**Đề bài (Phỏng vấn Định lượng Quyền chọn & Rủi ro — Citadel / Optiver):**
Chuỗi lợi nhuận ngày của chỉ số S&P 500 được ước lượng bởi mô hình `GARCH(1, 1)` với $\mu = 0$, $\omega = 0.04$ ($\text{pct}^2$), $\alpha_1 = 0.08$, $\beta_1 = 0.90$ và cú sốc chuẩn $z_t \sim \mathcal{N}(0, 1)$.
1. Kiểm tra điều kiện dừng bậc hai, tính độ biến động không điều kiện thường niên $\sigma_{\text{ann}}$ ($252$ ngày/năm), chu kỳ bán rã của cú sốc phương sai và độ nhọn không điều kiện $\kappa$.
2. Hôm nay biến động hiện hành là $\sigma_t = 1.0\%/\text{ngày}$ nhưng thị trường vừa sập mạnh $r_t = -4.0\%$. Hãy tính độ biến động dự báo cho phiên ngày mai $\sigma_{t+1}$ và cho phiên thứ $11$ tới ($\mathbb{E}_t[\sigma_{t+11}^2]$).

**Lời giải Từng Bước:**
1. **Các đặc trưng dừng dài hạn:**
   - Độ dai dẳng $\alpha_1 + \beta_1 = 0.08 + 0.90 = 0.98 < 1$ (dừng hiệp phương sai hợp lệ).
   - Phương sai ngày dài hạn: $\sigma^2 = \frac{0.04}{1 - 0.98} = 2.00\text{ pct}^2 \implies \sigma_{\text{daily}} = \sqrt{2.00} \approx 1.414\%/\text{ngày}$, tương đương biến động thường niên $\sigma_{\text{ann}} = \sqrt{252 \times 2.00} = \sqrt{504} \approx \mathbf{22.45\%/\text{năm}}$.
   - Chu kỳ bán rã phương sai: $\tau_{1/2}^{\text{vol}} = \frac{\ln 2}{-\ln(0.98)} \approx \frac{0.6931}{0.0202} \approx \mathbf{34.3\text{ phiên}}$ ($\approx 1.5$ tháng giao dịch).
   - Kiểm tra điều kiện mô-men bậc bốn: $(\alpha_1 + \beta_1)^2 + 2\alpha_1^2 = 0.98^2 + 2(0.08)^2 = 0.9604 + 0.0128 = 0.9732 < 1$. Độ nhọn không điều kiện:
     $$\kappa = \frac{3(1 - 0.9604)}{1 - 0.9732} = \frac{3 \times 0.0396}{0.0268} \approx \mathbf{4.43} \quad (\text{độ nhọn phụ trội } \kappa_{\text{ex}} \approx 1.43)$$
2. **Dự báo động sau cú sập $-4.0\%$ ($\varepsilon_t^2 = 16.0\text{ pct}^2, \, \sigma_t^2 = 1.0\text{ pct}^2$):**
   - Ngày mai ($h = 1$): $\sigma_{t+1}^2 = 0.04 + 0.08(16.0) + 0.90(1.0) = 0.04 + 1.28 + 0.90 = \mathbf{2.22\text{ pct}^2} \implies \sigma_{t+1} = \sqrt{2.22} \approx \mathbf{1.490\%/\text{ngày}}$ (tăng vọt từ $1.0\%$ vượt qua mức cân bằng dài hạn $1.414\%$!).
   - Phiên thứ $11$ ($h = 11 \implies h - 1 = 10$):
     $$\mathbb{E}_t\big[\sigma_{t+11}^2\big] = 2.00 + (0.98)^{10}(2.22 - 2.00) \approx 2.00 + 0.8171(0.22) = \mathbf{2.180\text{ pct}^2}$$

---

## 6. Cạm bẫy Thực chiến Khi Mô hình hóa Biến động Tài chính

> [!WARNING]
> **Ba Hạn chế Của GARCH Đối xứng Chuẩn & Cách Khắc phục Tại Bàn Giao dịch:**
> 1. **Bỏ qua Hiệu ứng Đòn bẩy Bất đối xứng (`Leverage Effect`):** Trong phương trình `GARCH(1, 1)` chuẩn, cú sốc tăng trần $+4\%$ và cú sập sàn $-4\%$ tạo ra cùng một $\varepsilon_{t-1}^2 = 16$ tác động giống hệt nhau lên $\sigma_t^2$. Trên thực tế cổ phiếu Mỹ, cú sập âm làm tăng biến động tương lai mạnh gấp đôi cú tăng dương cùng biên độ! Trong sản xuất, hãy nâng cấp lên **GJR-GARCH** của Glosten-Jagannathan-Runkle thêm số hạng chỉ báo âm $\gamma_1 \varepsilon_{t-1}^2 \mathbb{I}_{\{\varepsilon_{t-1} < 0\}}$ ($\gamma_1 > 0$) hoặc **EGARCH** của Nelson trên $\ln \sigma_t^2$.
> 2. **Ước lượng Hợp lý Cực đại Gauss Khi $z_t$ Thực Sự Có Đuôi Dày:** Dù ước lượng giả hợp lý cực đại (`QMLE`) dùng mật độ Gauss vẫn vững khi $\mathbb{E}[z_t^4] < \infty$, việc thay mật độ của $z_t$ bằng phân phối Student-$t$ chuẩn hóa khi khớp `GARCH` giúp các tham số $(\alpha_1, \beta_1)$ không bị giật cục bởi một vài phiên nhảy giá đứt gãy đơn lẻ.
> 3. **Lãng phí Dữ liệu Trong Ngày Khi Chỉ Dùng Lợi nhuận Đóng cửa - Đóng cửa:** Bình phương một điểm lợi nhuận ngày $r_t^2$ là ước lượng cực kỳ nhiễu cho phương sai ngày hôm đó — chẳng hạn thị trường lao dốc $-3\%$ buổi sáng rồi hồi phục $+3\%$ buổi chiều đóng cửa tại $0\%$ cho $r_t^2 = 0$ dù phiên đó biến động dữ dội! Thay $\varepsilon_{t-1}^2$ bằng **Phương sai Thực hiện** tính từ tổng bình phương lợi nhuận $5$ phút trong phiên như mô hình `HAR-RV` của Corsi giúp nâng lực dự báo $R^2$ của biến động ngày mai tăng gấp $3\text{–}4$ lần!
