# M3.03 — Đa Kiểm định Giả thuyết, Thủ tục Benjamini-Hochberg & Tỷ số Sharpe Giảm phát

## 1. Trực giác & Động lực: Căn bệnh Quá khớp Lựa chọn và "Vườn thú Nhân tố"

Hãy tưởng tượng một thí nghiệm tư tưởng đơn giản nhưng tàn khốc: bạn thuê $K = 1{,}000$ thực tập sinh, giao cho mỗi người một trình tạo số ngẫu nhiên tung đồng xu công bằng hoàn toàn vô tri ($\mu = 0$), mô phỏng giao dịch trên 5 năm dữ liệu lịch sử cổ phiếu Mỹ. Do phân phối chuẩn chuẩn hóa của tỷ số Sharpe 5 năm dưới giả thuyết vô hiệu có sai số chuẩn $\operatorname{SE} \approx \frac{1}{\sqrt{5}} \approx 0.447$, xác suất một thực tập sinh bất kỳ đạt tỷ số Sharpe trong mẫu vượt ngưỡng $1.35$ (tương đương thống kê $t > 3.0$, $p\text{-value}$ một phía $\approx 0.00135$) chỉ là $0.135\%$. Thế nhưng trên toàn bộ $1{,}000$ thực tập sinh độc lập, xác suất xuất hiện **ít nhất một chiến lược rác** vượt qua ngưỡng vàng $t > 3.0$ lên tới:

$$
\mathbb{P}\left(\max_{1 \le k \le 1000} t_k > 3.0\right) = 1 - (1 - 0.00135)^{1000} \approx \mathbf{74.1\%}
$$

Trong thực tế tại các cụm máy chủ nghiên cứu hiện đại, một nhà nghiên cứu định lượng không chỉ thử $1{,}000$ ý tưởng: khi quét lưới siêu tham số chu kỳ trung bình động ($5, 10, 20, 60$ ngày), ngưỡng cắt ngoại lai, phương pháp chuẩn hóa ngành và bộ lọc thanh khoản, bạn đang ngầm thực hiện hàng chục ngàn phép kiểm định giả thuyết đồng thời trên cùng một chuỗi lịch sử hữu hạn! Năm 2016, Campbell Harvey, Yan Liu và Heqing Zhu khảo sát hơn $300$ nhân tố dự báo lợi nhuận đã công bố trên các tạp chí tài chính hàng đầu và chứng minh rằng phần lớn "phát hiện" vượt ngưỡng cổ điển $t > 1.96$ chỉ là sản phẩm phình đại cực trị của đa kiểm định.

Bài giảng này xây dựng ba tuyến phòng thủ toán học bắt buộc tại mọi quỹ định lượng hàng đầu: (1) Định luật giá trị cực trị cho cực đại của $K$ nhiễu chuẩn; (2) Kiểm soát tỷ lệ khám phá sai bằng thủ tục bậc thang Benjamini-Hochberg; và (3) Công thức **Tỷ số Sharpe Giảm phát** của Bailey & López de Prado tích hợp cả độ lệch, độ nhọn lẫn tổng số phép thử.

---

## 2. Phình đại Cực đại của $K$ Quá trình Nhiễu & Gia tăng Sai lầm Loại I

### 2.1. Chứng minh Thang đo $\sqrt{2 \ln K}$ cho Cực đại Biến Chuẩn

Giả sử $Z_1, Z_2, \dots, Z_K \stackrel{\text{iid}}{\sim} \mathcal{N}(0, 1)$ là thống kê chuẩn hóa của $K$ chiến lược hoàn toàn không có alpha ($\mu_k = 0$). Đặt $M_K = \max_{1 \le k \le K} Z_k$. Ta chứng minh $M_K$ hội tụ theo xác suất quanh mức $\sqrt{2 \ln K}$ khi $K$ lớn:

1. **Chứng minh Cận trên bằng Bất đẳng thức Hợp Boole và Cận Đuôi Chuẩn Mill:**
   Với mọi ngưỡng $x > 0$, tích phân đuôi chuẩn $\bar{\Phi}(x) = \int_x^\infty \frac{1}{\sqrt{2\pi}} e^{-u^2/2}\,du \le \int_x^\infty \frac{u}{x} \frac{1}{\sqrt{2\pi}} e^{-u^2/2}\,du = \frac{1}{x\sqrt{2\pi}} e^{-x^2/2}$. Chọn $x_K = \sqrt{2 \ln K}$, bất đẳng thức hợp cho ta:

$$
\mathbb{P}\big(M_K > \sqrt{2 \ln K}\big) \le \sum_{k=1}^K \mathbb{P}\big(Z_k > \sqrt{2 \ln K}\big) \le K \cdot \frac{1}{\sqrt{4\pi \ln K}} e^{-\ln K} = \frac{1}{\sqrt{4\pi \ln K}} \xrightarrow{K \to \infty} 0
$$

2. **Xấp xỉ Giải tích Chính xác Gumbel (Euler-Mascheroni):**
   Vì phân phối chuẩn thuộc miền hút cực trị loại I (Gumbel), chuẩn hóa vị trí - tỷ lệ của $M_K$ hội tụ về phân phối Gumbel có kỳ vọng bằng hằng số Euler-Mascheroni $\gamma \approx 0.57721566$. Bailey và López de Prado (2014) chứng minh xấp xỉ cực kỳ sắc nét cho kỳ vọng cực đại hữu hạn $\mathbb{E}[M_K]$ với mọi $K \ge 2$:

$$
\mathbb{E}\!\left[\max_{1 \le k \le K} Z_k\right] \approx (1 - \gamma)\,\Phi^{-1}\!\left(1 - \frac{1}{K}\right) + \gamma\,\Phi^{-1}\!\left(1 - \frac{1}{K e}\right) \sim \sqrt{2 \ln K}
$$

| Số chiến lược thử nghiệm $K$ | $\sqrt{2 \ln K}$ (Bậc đầu) | $\mathbb{E}[\max_{k \le K} Z_k]$ chính xác | Sharpe năm cực đại kỳ vọng chỉ từ nhiễu thuần túy ($T_{\text{năm}} = 5$) |
| :--- | :--- | :--- | :--- |
| $K = 1$ | $0.00$ | $0.00$ | $0.00$ |
| $K = 10$ | $2.15$ | $1.54$ | $1.54 / \sqrt{5} \approx \mathbf{0.69}$ |
| $K = 100$ | $3.03$ | $2.51$ | $2.51 / \sqrt{5} \approx \mathbf{1.12}$ |
| $K = 1{,}000$ | $3.72$ | $3.24$ | $3.24 / \sqrt{5} \approx \mathbf{1.45}$ |
| $K = 10{,}000$ | $4.29$ | $3.85$ | $3.85 / \sqrt{5} \approx \mathbf{1.72}$ |

Nhìn vào dòng cuối: nếu quy trình khai phá tự động của bạn quét qua $10{,}000$ tổ hợp đặc trưng trên 5 năm dữ liệu, chiến lược tốt nhất bước ra từ đống nhiễu trắng **mặc định đã có tỷ số Sharpe kỳ vọng bằng $1.72$** dù tương lai ngoài mẫu bằng $0$ tròn trĩnh!

---

## 3. Kiểm soát FWER so với Tỷ lệ Khám phá Sai Benjamini-Hochberg

Giả sử ta kiểm định đồng thời $K$ giả thuyết vô hiệu $H_{0,1}, \dots, H_{0,K}$ (trong đó có $K_0$ giả thuyết thực sự vô hiệu và $K_1 = K - K_0$ tín hiệu có alpha thật), thu được $p\text{-value}$ tương ứng $p_1, \dots, p_K$. Gọi $R$ là tổng số giả thuyết bị bác bỏ (được chọn đưa vào danh mục) và $V$ là số lượng giả thuyết vô hiệu bị bác bỏ nhầm (dương tính giả).

### 3.1. Hạn chế của Hiệu chỉnh Šidák và Bonferroni

Phương pháp cổ điển kiểm soát **Mức Sai lầm Toàn họ** (`FWER`), định nghĩa là xác suất để lọt **dù chỉ một** tín hiệu giả: $\text{FWER} = \mathbb{P}(V \ge 1) \le \alpha$.
- **Hiệu chỉnh Šidák** (chính xác khi $K$ kiểm định độc lập): Đặt ngưỡng từng kiểm định $\alpha_{\text{Šidák}} = 1 - (1 - \alpha)^{1/K}$, vì khi mọi giả thuyết đều vô hiệu thì $\mathbb{P}(V \ge 1) = 1 - \mathbb{P}(\forall k, \, p_k > \alpha_{\text{Šidák}}) = 1 - (1 - \alpha_{\text{Šidák}})^K = \alpha$.
- **Hiệu chỉnh Bonferroni** (đúng với mọi cấu trúc tương quan bất kỳ nhờ bất đẳng thức hợp): Đặt ngưỡng $\alpha_{\text{Bonf}} = \frac{\alpha}{K}$, suy ra $\mathbb{P}(V \ge 1) \le \sum_{k \in \mathcal{H}_0} \mathbb{P}(p_k \le \alpha / K) = \frac{K_0}{K}\alpha \le \alpha$.

*Điểm yếu chí mạng trong nghiên cứu danh mục đa tín hiệu:* Khi sàng lọc $K = 2{,}000$ tín hiệu yếu để xây dựng một rổ gồm $80$ tín hiệu kết hợp, ta **không cần** tất cả $80$ tín hiệu đều đúng $100\%$ tuyệt đối (việc gạt nhầm toàn bộ $80$ tín hiệu thật vì ngưỡng $\alpha / 2000 = 0.000025$ quá khắc nghiệt gây thiệt hại cơ hội nặng nề hơn nhiều so với việc chấp nhận $4$ tín hiệu nhiễu lẫn trong $76$ tín hiệu thật!).

### 3.2. Thủ tục Bậc thang Benjamini-Hochberg (1995) và Chứng minh Chặt chẽ

Thay vì ép $\mathbb{P}(V \ge 1) \le \alpha$, Yoav Benjamini và Yosef Hochberg đề xuất kiểm soát **Tỷ lệ Khám phá Sai** (False Discovery Rate — `FDR`), tức kỳ vọng tỷ trọng tín hiệu rác trong tập các tín hiệu được chọn:

$$
\text{FDR} \triangleq \mathbb{E}\!\left[ \frac{V}{\max(R, 1)} \right] = \mathbb{E}\!\left[ \frac{V}{R} \,\mathbb{I}_{\{R > 0\}} \right]
$$

**Thuật toán Bậc thang Lên Benjamini-Hochberg (`BH`) ở mức mục tiêu $q \in (0, 1)$:**
1. Sắp xếp tăng dần $K$ giá trị $p\text{-value}$: $p_{(1)} \le p_{(2)} \le \dots \le p_{(K)}$.
2. Tìm chỉ số lớn nhất $k^\star$ vượt qua đường thẳng bậc thang có độ dốc $q / K$:
   $$k^\star = \max\left\{ i \in \{1, \dots, K\} : p_{(i)} \le \frac{i}{K} q \right\}$$
3. Nếu tồn tại $k^\star$, bác bỏ toàn bộ $k^\star$ giả thuyết đầu tiên tương ứng với $p_{(1)}, \dots, p_{(k^\star)}$ (ngược lại không bác bỏ giả thuyết nào).

**Định lý 3.4 — Bảo toàn Tỷ lệ Khám phá Sai Dưới Tính Độc lập:** *Nếu các thống kê kiểm định tương ứng với tập giả thuyết thực sự vô hiệu $\mathcal{H}_0$ ($|\mathcal{H}_0| = K_0$) là độc lập với nhau và độc lập với nhóm có tín hiệu thật, thủ tục `BH` thỏa mãn đẳng thức chính xác:*

$$
\text{FDR} = \frac{K_0}{K} q \le q
$$

**Chứng minh Ngắn gọn Bằng Kỹ thuật Điều kiện hóa Khéo léo:**
Với mỗi giả thuyết thực sự vô hiệu $i \in \mathcal{H}_0$, biến ngẫu nhiên $p_i \sim \operatorname{Uniform}(0, 1)$. Lưu ý $V = \sum_{i \in \mathcal{H}_0} \mathbb{I}_{\{i \text{ bị bác bỏ}\}}$, do đó theo tính tuyến tính của kỳ vọng:

$$
\text{FDR} = \mathbb{E}\!\left[\frac{\sum_{i \in \mathcal{H}_0} \mathbb{I}_{\{i \text{ bị bác bỏ}\}}}{\max(R, 1)}\right] = \sum_{i \in \mathcal{H}_0} \mathbb{E}\!\left[\frac{\mathbb{I}_{\{p_i \le \frac{R}{K} q\}}}{\max(R, 1)}\right]
$$

Cố định một $i \in \mathcal{H}_0$ và gọi $p^{(-i)}$ là bộ $(K - 1)$ giá trị $p\text{-value}$ còn lại sau khi bỏ $p_i$. Với mỗi cấu hình cố định của $p^{(-i)}$, hãy định nghĩa $R(0 \to p_i)$ là số lượng giả thuyết bị bác bỏ nếu ta **ép giả định $p_i = 0$**: cụ thể đặt $r_i = R(p_i = 0, p^{(-i)}) \ge 1$ (chỉ phụ thuộc vào $p^{(-i)}$, hoàn toàn độc lập với $p_i$!). Nhận xét mấu chốt: giả thuyết $i$ nằm trong tập bị bác bỏ (với tổng số bác bỏ đúng bằng $R = r_i$) **khi và chỉ khi** $p_i \le \frac{r_i}{K} q$! Thật vậy, nếu $p_i \le \frac{r_i}{K} q$ thì tại vị trí hạng thứ $r_i$ ngưỡng bậc thang vẫn được thỏa mãn giống hệt như khi $p_i = 0$, nên $R = r_i$; ngược lại nếu $p_i > \frac{r_i}{K} q$ thì $i$ không thể được chọn.

Áp dụng Tính chất Tháp lấy kỳ vọng có điều kiện theo $p^{(-i)}$ (vì $r_i$ là hằng số biết trước khi biết $p^{(-i)}$ và $p_i \perp p^{(-i)}$):

$$
\mathbb{E}\!\left[ \frac{\mathbb{I}_{\{i \text{ bị bác bỏ}\}}}{\max(R, 1)} \,\middle|\, p^{(-i)} \right] = \mathbb{E}\!\left[ \frac{\mathbb{I}_{\{p_i \le \frac{r_i}{K} q\}}}{r_i} \,\middle|\, p^{(-i)} \right] = \frac{1}{r_i} \cdot \mathbb{P}\!\left(p_i \le \frac{r_i}{K} q \,\middle|\, p^{(-i)}\right) = \frac{1}{r_i} \cdot \frac{r_i q}{K} = \frac{q}{K}
$$

Lấy kỳ vọng vô điều kiện và cộng qua đúng $K_0$ phần tử thuộc $\mathcal{H}_0$, ta thu được $\text{FDR} = \sum_{i \in \mathcal{H}_0} \frac{q}{K} = \frac{K_0}{K} q \le q$! $\blacksquare$

> [!NOTE]
> **Mở rộng Cho Các Tín hiệu Tương quan Bất kỳ (Benjamini-Yekutieli, 2001):** Nếu $K$ biến thể alpha có cấu trúc phụ thuộc dương thông thường (`PRDS`), thủ tục `BH` nguyên gốc **vẫn giữ nguyên** $\text{FDR} \le q$. Trong trường hợp phụ thuộc âm hoặc phi tuyến tùy ý bất kỳ, Benjamini và Yekutieli chứng minh chỉ cần chia ngưỡng cho tổng điều hòa $c(K) = \sum_{j=1}^K \frac{1}{j} \approx \ln K + \gamma$, tức dùng ngưỡng $p_{(i)} \le \frac{i}{K \, c(K)} q$, bảo toàn chặt $\text{FDR} \le q$ dưới mọi ma trận hiệp phương sai!

---

## 4. Phương sai Tiệm cận Phi Chuẩn & Tỷ số Sharpe Giảm phát

### 4.1. Chứng minh Sai số Chuẩn Tiệm cận của Tỷ số Sharpe dưới Độ lệch & Độ nhọn

Xét chuỗi lợi nhuận phụ trội độc lập cùng phân phối $r_1, \dots, r_T$ trên $T$ quan sát chưa nhân thường niên có kỳ vọng $\mu$, phương sai $\sigma^2$, **độ lệch** (Skewness) $\gamma_3 = \frac{\mathbb{E}[(r_t - \mu)^3]}{\sigma^3}$ và **độ nhọn gốc** (Raw Kurtosis) $\gamma_4 = \frac{\mathbb{E}[(r_t - \mu)^4]}{\sigma^4}$ — lưu ý dưới phân phối chuẩn Gauss thì $\gamma_3 = 0$ và $\gamma_4 = 3$. Tỷ số Sharpe thực là $SR = \frac{\mu}{\sigma}$ và ước lượng mẫu là $\widehat{SR} = \frac{\hat{\mu}}{\hat{\sigma}}$.

**Định lý 3.5 — Công thức Phương sai Tiệm cận của Mertens:** *Sai số chuẩn tiệm cận của $\widehat{SR}$ dưới phân phối bất kỳ có mô-men bậc bốn hữu hạn được cho bởi:*

$$
\operatorname{SE}\big(\widehat{SR}\big) = \sqrt{\frac{1 - \gamma_3 \, SR + \frac{\gamma_4 - 1}{4} \, SR^2}{T}}
$$

**Chứng minh Từng Bước bằng Phương pháp Delta Đa biến:**
Đặt vector tham số $\theta = (\mu, v)^\top$ với $v = \sigma^2$, ước lượng mẫu $\hat{\theta} = (\hat{\mu}, \hat{v})^\top$, và hàm trơn $g(\mu, v) = \mu v^{-1/2} = SR$. Theo Định lý Giới hạn Trung tâm cho trung bình mẫu và phương sai mẫu, $\sqrt{T}(\hat{\theta} - \theta) \xrightarrow{d} \mathcal{N}_2(0, \Sigma_\theta)$ với ba thành phần ma trận hiệp phương sai tiệm cận chuẩn:
- $[\Sigma_\theta]_{11} = T \operatorname{Var}(\hat{\mu}) = \sigma^2$.
- $[\Sigma_\theta]_{12} = T \operatorname{Cov}(\hat{\mu}, \hat{v}) = \mathbb{E}[(r_t - \mu)^3] = \gamma_3 \sigma^3$.
- $[\Sigma_\theta]_{22} = T \operatorname{Var}(\hat{v}) = \mathbb{E}[(r_t - \mu)^4] - \sigma^4 = (\gamma_4 - 1)\sigma^4$.

Tính gradient của $g(\mu, v) = \mu v^{-1/2}$ tại $(\mu, \sigma^2)$:

$$
\nabla g(\theta) = \begin{pmatrix} \dfrac{\partial g}{\partial \mu} \\[8pt] \dfrac{\partial g}{\partial v} \end{pmatrix} = \begin{pmatrix} \dfrac{1}{\sigma} \\[8pt] -\dfrac{\mu}{2\sigma^3} \end{pmatrix} = \begin{pmatrix} \dfrac{1}{\sigma} \\[8pt] -\dfrac{SR}{2\sigma^2} \end{pmatrix}
$$

Nhân dạng toàn phương phương pháp Delta $\sigma_{\text{asym}}^2(\widehat{SR}) = \nabla g(\theta)^\top \Sigma_\theta \nabla g(\theta)$, mọi lũy thừa của $\sigma$ triệt tiêu hoàn hảo:

$$
\nabla g^\top \Sigma_\theta \nabla g = \left(\frac{1}{\sigma}\right)^2 \sigma^2 + 2\left(\frac{1}{\sigma}\right)\left(-\frac{SR}{2\sigma^2}\right)\big(\gamma_3 \sigma^3\big) + \left(-\frac{SR}{2\sigma^2}\right)^2 (\gamma_4 - 1)\sigma^4 = 1 - \gamma_3 \, SR + \frac{\gamma_4 - 1}{4} \, SR^2
$$

Chia cho cỡ mẫu $T$ — hoặc $T - 1$ để hiệu chỉnh mẫu nhỏ — và lấy căn bậc hai, ta thu được công thức cần chứng minh! $\blacksquare$

> [!IMPORTANT]
> **Cảnh giác Ký hiệu Độ nhọn $\gamma_4$ Khi Viết Mã Kiểm thử — Bẫy Phỏng vấn Số 1:**
> - Trong bài báo gốc của Mertens năm 2002 và Bailey cùng López de Prado năm 2014, $\gamma_4$ là **độ nhọn gốc** bằng $3$ đối với phân phối chuẩn Gauss, nên hệ số nhân với $SR^2$ là $\frac{\gamma_4 - 1}{4}$, trả về đúng $\frac{3 - 1}{4} = \frac{1}{2}$ khớp công thức kinh điển của Andrew Lo: $\operatorname{SE}_{\text{Gauss}} = \sqrt{\frac{1 + \frac{1}{2}SR^2}{T}}$.
> - Nếu hàm thư viện thống kê của bạn trả về **độ nhọn phụ trội** $\kappa_{\text{ex}} = \gamma_4 - 3$ như mặc định `fisher=True` trong `scipy.stats` hay `pandas`, bạn bắt buộc phải viết $\frac{2 + \kappa_{\text{ex}}}{4} = \frac{1}{2} + \frac{\kappa_{\text{ex}}}{4}$! Truyền nhầm $\kappa_{\text{ex}} = 0$ vào công thức $\frac{\gamma_4 - 1}{4}$ sẽ biến hệ số thành $-\frac{1}{4}$, làm sai lệch hoàn toàn định giá rủi ro!

### 4.2. Ba Thống kê Chuẩn hóa Thẩm định Hồ sơ Kiểm thử

Hãy nhìn kỹ ý nghĩa kinh tế của dấu trừ trước $-\gamma_3 SR$ và dấu cộng trước $+\frac{\gamma_4 - 1}{4} SR^2$: một chiến lược **bán khống biến động hoặc gồng lãi chênh lệch lãi suất** có tỷ số Sharpe dương ($SR > 0$), **độ lệch âm nặng** ($\gamma_3 < 0 \implies -\gamma_3 SR > 0$) và **đuôi dày** ($\gamma_4 \gg 3$) sẽ gánh chịu sai số chuẩn $\operatorname{SE}(\widehat{SR})$ phình to gấp bội! Những chiến lược kiếm vài xu đều đặn mỗi ngày trước khi nổ tung một lần rất dễ tạo ra $\widehat{SR}$ giả tạo cực cao trên cửa sổ ngắn.

Từ phân phối tiệm cận này, Bailey và López de Prado xây dựng hệ thống ba chỉ số chuẩn hóa:
1. **Tỷ số Sharpe Xác suất** (`PSR`) so với ngưỡng chuẩn $SR^\star$:
   $$\widehat{\text{PSR}}(SR^\star) = \Phi\!\left( \frac{\big(\widehat{SR} - SR^\star\big)\sqrt{T - 1}}{\sqrt{1 - \hat{\gamma}_3 \widehat{SR} + \frac{\hat{\gamma}_4 - 1}{4}\widehat{SR}^2}} \right)$$
2. **Độ dài Hồ sơ Kiểm thử Tối thiểu** (Minimum Track Record Length — `MinTRL`): Để khẳng định $SR > SR^\star$ ở độ tin cậy $(1 - \alpha)$ — chẳng hạn $95\% \implies z_{1-\alpha} = 1.645$ — giải bất phương trình $\widehat{\text{PSR}}(SR^\star) \ge 1 - \alpha$ theo $T$ cho số lượng quan sát tối thiểu bắt buộc:
   $$\text{MinTRL} = 1 + \left[ 1 - \hat{\gamma}_3 \widehat{SR} + \frac{\hat{\gamma}_4 - 1}{4}\widehat{SR}^2 \right] \left( \frac{z_{1 - \alpha}}{\widehat{SR} - SR^\star} \right)^2$$
3. **Tỷ số Sharpe Giảm phát** (Deflated Sharpe Ratio — `DSR`): Khi chiến lược tốt nhất $\widehat{SR}$ được tuyển chọn từ $K_{\text{eff}}$ chiến lược độc lập hiệu dụng có phương sai chéo giữa các tỷ số Sharpe thử nghiệm là $\widehat{\operatorname{Var}}\big(\{\widehat{SR}_k\}\big)$, ngưỡng kỳ vọng cực đại sinh ra từ nhiễu thuần túy không còn là $0$, mà nâng lên thành:

$$
SR_0 = \sqrt{\widehat{\operatorname{Var}}\big(\{\widehat{SR}_k\}\big)} \left[ (1 - \gamma)\,\Phi^{-1}\!\left(1 - \frac{1}{K_{\text{eff}}}\right) + \gamma\,\Phi^{-1}\!\left(1 - \frac{1}{K_{\text{eff}} \, e}\right) \right]
$$

Thay ngưỡng rào cản $SR^\star = SR_0$ vào công thức `PSR`, ta thu được $\text{DSR} = \widehat{\text{PSR}}(SR_0) \in (0, 1)$. Tại các hội đồng duyệt mô hình cấp quỹ, một tín hiệu mới thường phải đạt **$\text{DSR} \ge 0.95$** mới được cấp vốn thử nghiệm thực tế!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Thẩm định Chiến lược Có Độ lệch Âm Sau 100 Lần Thử

**Đề bài (Phỏng vấn Nghiên cứu Định lượng — Squarepoint / Citadel):**
Một ứng viên trình bày chiến lược giao dịch tần suất tuần được chọn lọc tốt nhất từ $K_{\text{eff}} = 100$ biến thể độc lập trên $T = 105$ tuần ($\approx 2$ năm, $T - 1 = 104$). Chiến lược đạt tỷ số Sharpe thường niên $\widehat{SR}_{\text{ann}} = 2.16$ (quy đổi sang đơn vị tuần với $52$ tuần/năm: $\widehat{SR} = \frac{2.16}{\sqrt{52}} \approx 0.300$). Tuy nhiên, phân phối lợi nhuận tuần có độ lệch âm $\hat{\gamma}_3 = -2.0$ và độ nhọn gốc $\hat{\gamma}_4 = 9.0$. Biết độ lệch chuẩn giữa $100$ tỷ số Sharpe tuần đã thử nghiệm là $\sqrt{\widehat{\operatorname{Var}}(\{\widehat{SR}_k\})} = 0.100$.
1. Nếu ngây thơ giả định chuẩn Gauss và quên mất đã thử $100$ lần ($SR^\star = 0$), thống kê $z$ bằng bao nhiêu?
2. Tính ngưỡng giảm phát $SR_0$, sai số chuẩn điều chỉnh đuôi dày và chỉ số `DSR` thực sự. Chiến lược này có đạt chuẩn $\text{DSR} \ge 0.95$ không?

**Lời giải Từng Bước:**
1. **Đánh giá ngây thơ:** Dưới Gauss ($\gamma_3 = 0, \gamma_4 = 3$) và $SR^\star = 0$:
   $$z_{\text{naive}} = \frac{0.300 \times \sqrt{104}}{\sqrt{1 + 0.5(0.300)^2}} = \frac{3.0594}{\sqrt{1.045}} \approx \mathbf{2.99} \implies \Phi(2.99) = \mathbf{99.86\%}$$
   Bề ngoài trông như một phát hiện xuất chúng chắc chắn $99.86\%$!
2. **Thẩm định bằng `DSR`:**
   - Tra kỳ vọng thống kê thứ tự cực đại chuẩn chính xác $\mathbb{E}[\max_{1 \le k \le 100} Z_k]$ tại $K_{\text{eff}} = 100$: hệ số nhân bằng $2.508$ (trong khi công thức xấp xỉ Gumbel phía trên cho $2.531$). Suy ra ngưỡng rào cản đa kiểm định theo đơn vị tuần là:
     $$SR_0 = 0.100 \times 2.508 = 0.2508 \quad (\text{tương đương Sharpe năm } 0.2508 \times \sqrt{52} \approx 1.81!)$$
   - Tính hệ số phình đại mẫu số do độ lệch âm $\hat{\gamma}_3 = -2.0$ và đuôi dày $\hat{\gamma}_4 = 9.0$ tại $\widehat{SR} = 0.300$:
     $$1 - (-2.0)(0.300) + \frac{9.0 - 1}{4}(0.300)^2 = 1 + 0.600 + 2.0(0.090) = 1.780 \implies \sqrt{1.780} \approx 1.3342$$
   - Tính thống kê $z_{\text{DSR}}$ và xác suất `DSR`:
     $$z_{\text{DSR}} = \frac{(0.300 - 0.2508)\sqrt{104}}{1.3342} = \frac{0.0492 \times 10.198}{1.3342} \approx \mathbf{0.376} \implies \text{DSR} = \Phi(0.376) \approx \mathbf{64.7\%}$$
   **Kết luận sắc lạnh:** Sau khi phạt $100$ lần mò mẫm tham số và rủi ro nổ tung đuôi trái, xác suất chiến lược thực sự vượt ngưỡng nhiễu rơi thẳng đứng từ $99.86\%$ xuống chỉ còn **$64.7\%$** (thấp xa mức $95\%$, hồ sơ bị bác bỏ ngay tại vòng thẩm định!).

---

## 6. Cạm bẫy Thực nghiệm: Ước lượng Số Phép thử Độc lập Hiệu dụng $K_{\text{eff}}$

> [!WARNING]
> **Hai Cạm bẫy Phổ biến Nhất Khi Triển khai Kiểm soát Đa Kiểm định:**
> 1. **Giấu Nhẹm Các Thử nghiệm Thất bại ("Bóng ma Nghiên cứu Viên"):** Công thức `DSR` chỉ trung thực nếu nhật ký hệ thống ghi nhận **mọi** lần chạy kiểm thử lịch sử, bao gồm cả những lần nhà nghiên cứu nhìn đồ thị lợi nhuận thấy xấu rồi âm thầm đổi cửa sổ từ $15$ ngày sang $22$ ngày và chạy lại! Tại WorldQuant và Two Sigma, hệ thống máy chủ tự động đếm toàn bộ số lần truy vấn kiểm thử của từng tài khoản nghiên cứu để cập nhật ngưỡng phạt đa kiểm định.
> 2. **Truyền Tổng số Biến thể Tương quan $M$ Thay vì Số Thử nghiệm Độc lập Hiệu dụng $K_{\text{eff}}$:** Nếu bạn quét chu kỳ trung bình trượt $L \in \{20, 21, 22, \dots, 40\}$ gồm $21$ biến thể có tương quan lợi nhuận chéo $\bar{\rho} \approx 0.96$, việc điền $K = 21$ coi như $21$ phép thử độc lập sẽ phạt quá tay không đúng bản chất. Công thức chuẩn của López de Prado năm 2018 ước lượng số cụm độc lập hiệu dụng từ trung bình tương quan ngoài đường chéo $\bar{\rho}$ là:
>    $$K_{\text{eff}} = \bar{\rho} + (1 - \bar{\rho}) M \in [1, M]$$
>    Kiểm tra biên: khi $\bar{\rho} \to 1$ (các biến thể trùng khít nhau) thì $K_{\text{eff}} \to 1$; khi $\bar{\rho} \to 0$ (độc lập hoàn toàn) thì $K_{\text{eff}} \to M$!
