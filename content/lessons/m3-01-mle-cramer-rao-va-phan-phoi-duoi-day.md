# M3.01 — Ước lượng Hợp lý Cực đại, Cận dưới Cramér-Rao, Co rút James-Stein & Đuôi dày

## 1. Trực giác & Động lực: Suy luận Thống kê Giữa Đại dương Nhiễu Tài chính

Trong các bài toán kỹ thuật phần mềm truyền thống như nhận diện ảnh y khoa hay dịch máy, tỷ số tín hiệu trên nhiễu (Signal-to-Noise Ratio — `SNR`) thường rất lớn: một bức ảnh con mèo vẫn là con mèo dù có thêm vài phần trăm điểm ảnh nhiễu. Trái lại, trên thị trường cổ phiếu Mỹ và phái sinh định lượng dưới độ đo thực tế $\mathbb{P}$, cạnh tranh khốc liệt giữa hàng trăm quỹ đầu cơ đẩy hệ thống về sát trạng thái hiệu quả cận biên. Một chiến lược giao dịch cổ phiếu tần suất ngày có lợi nhuận kỳ vọng hàng năm $\mu_{\text{ann}} = 10\%$ và biến động hàng năm $\sigma_{\text{ann}} = 10\%$ đạt tỷ số Sharpe bằng $1.0$ rất đáng mơ ước, nhưng khi quy đổi xuống từng phiên giao dịch riêng lẻ ($252$ ngày/năm):

$$
\mu_{\text{daily}} = \frac{0.10}{252} \approx 0.0397\% \text{ (tức } 3.97\text{ bps)}, \qquad \sigma_{\text{daily}} = \frac{0.10}{\sqrt{252}} \approx 0.630\% \text{ (tức } 63.0\text{ bps)}
$$

Tỷ số `SNR` trên mỗi quan sát ngày chỉ vỏn vẹn $\mu_{\text{daily}} / \sigma_{\text{daily}} = 1 / \sqrt{252} \approx 0.063$: biên độ nhiễu ngẫu nhiên của một ngày giao dịch lớn gấp **16 lần** giá trị kỳ vọng của tín hiệu! Nghiêm trọng hơn, lợi nhuận tài chính thực tế không tuân theo phân phối chuẩn êm ả mà sở hữu phần đuôi dày do các cú sốc thanh khoản, công bố lợi nhuận bất ngờ và giải chấp đòn bẩy dây chuyền.

Trong bối cảnh nhiễu lấn át tín hiệu như vậy, ba câu hỏi nền tảng luôn xuất hiện tại vòng phỏng vấn định lượng của Two Sigma, Citadel, WorldQuant và Point72:
1. Với một mô hình xác suất tham số $f(x; \theta)$, cách thức hệ thống nào tạo ra ước lượng tiệm cận tối ưu, và **giới hạn vật lý tối thiểu** của phương sai sai số ước lượng là bao nhiêu?
2. Khi phân phối lợi nhuận có đuôi dày dạng lũy thừa thay vì hàm mũ Gauss, vì sao trung bình mẫu cổ điển $\bar{X}$ đánh mất tính hiệu quả nghiêm trọng và ước lượng hợp lý cực đại tự động bảo vệ danh mục trước ngoại lai như thế nào?
3. Khi ước lượng đồng thời kỳ vọng lợi nhuận của $N \ge 3$ tài sản hoặc nhân tố, tại sao việc giữ nguyên ước lượng không chệch từng mã riêng lẻ lại **chắc chắn thua kém** một phép co rút có chệch về tâm chung?

---

## 2. Ước lượng Hợp lý Cực đại, Hàm Điểm & Thông tin Fisher

### 2.1. Hàm Hợp lý Logarit và Đẳng thức Bartlett Thứ nhất

Giả sử ta quan sát mẫu ngẫu nhiên $X_1, X_2, \dots, X_n$ độc lập và cùng phân phối theo mật độ (hoặc khối xác suất) $f(x; \theta)$, trong đó tham số thực sự $\theta_0 \in \Theta \subseteq \mathbb{R}^p$ chưa biết. Hàm hợp lý đo lường mật độ đồng thời của dữ liệu quan sát được xem như một hàm theo tham số $\theta$. Lấy logarit tự nhiên chuyển tích thành tổng, ta thu được **hàm hợp lý logarit** $\ell_n(\theta)$:

$$
L_n(\theta) = \prod_{i=1}^n f(X_i; \theta), \qquad \ell_n(\theta) = \ln L_n(\theta) = \sum_{i=1}^n \ln f(X_i; \theta)
$$

**Định nghĩa 3.1 (Ước lượng Hợp lý Cực đại).** *Ước lượng hợp lý cực đại (Maximum Likelihood Estimation — `MLE`) là giá trị tham số làm cực đại hóa khả năng sinh ra bộ dữ liệu thực nghiệm đang có trong tay:*

$$
\hat{\theta}_{\text{MLE}} = \arg\max_{\theta \in \Theta} \ell_n(\theta)
$$

Về mặt giải tích thông tin, khi chia cả hai vế của $\ell_n(\theta)$ cho $n$, theo Luật Số Lớn $\frac{1}{n}\ell_n(\theta) \xrightarrow{\mathbb{P}} \mathbb{E}_{\theta_0}[\ln f(X; \theta)]$. Cực đại hóa $\mathbb{E}_{\theta_0}[\ln f(X; \theta)]$ tương đương với cực tiểu hóa $\mathbb{E}_{\theta_0}\!\left[\ln \frac{f(X; \theta_0)}{f(X; \theta)}\right] = D_{\text{KL}}\big(f(\cdot; \theta_0) \,\|\, f(\cdot; \theta)\big) \ge 0$, tức `MLE` chính là phép chiếu tìm phân phối tham số có **phân kỳ Kullback-Leibler** nhỏ nhất so với phân phối sinh dữ liệu thực sự $\theta_0$!

Xét trường hợp tham số vô hướng $\theta \in \mathbb{R}$ dưới các **điều kiện chính quy chuẩn** (miền giá trị $\{x : f(x; \theta) > 0\}$ không phụ thuộc vào $\theta$, hàm $f(x; \theta)$ khả vi bậc hai theo $\theta$ và đạo hàm theo $\theta$ được phép đổi chỗ với dấu tích phân theo $x$). Đạo hàm bậc nhất của hàm hợp lý logarit được gọi là **hàm điểm** (Score Function):

$$
s(X; \theta) = \frac{\partial}{\partial \theta} \ln f(X; \theta) = \frac{f_\theta(X; \theta)}{f(X; \theta)}, \qquad S_n(\theta) = \sum_{i=1}^n s(X_i; \theta) = \ell_n'(\theta)
$$

**Mệnh đề 3.1 — Đẳng thức Bartlett Thứ nhất & Thứ hai:** *Tại giá trị tham số thực $\theta$, hàm điểm có kỳ vọng bằng $0$, và phương sai của hàm điểm bằng đúng đối số kỳ vọng đạo hàm bậc hai của hàm hợp lý logarit. Đại lượng này được định nghĩa là **Thông tin Fisher** (Fisher Information) $I_1(\theta)$ của một quan sát đơn lẻ:*

$$
\mathbb{E}_\theta\big[s(X; \theta)\big] = 0, \qquad I_1(\theta) \triangleq \operatorname{Var}_\theta\big(s(X; \theta)\big) = \mathbb{E}_\theta\big[s(X; \theta)^2\big] = -\mathbb{E}_\theta\!\left[\frac{\partial^2}{\partial \theta^2} \ln f(X; \theta)\right]
$$

**Chứng minh Từng Bước (Câu hỏi Bảng trắng Cốt lõi):**
1. *Đẳng thức thứ nhất:* Xuất phát từ hằng đẳng thức tích phân mật độ xác suất luôn bằng $1$ với mọi $\theta \in \Theta$: $\int f(x; \theta)\,dx = 1$. Đạo hàm hai vế theo $\theta$ và đổi chỗ đạo hàm qua dấu tích phân nhờ điều kiện chính quy:

$$
0 = \frac{\partial}{\partial \theta} \int f(x; \theta)\,dx = \int \frac{\partial f(x; \theta)}{\partial \theta}\,dx = \int \left(\frac{1}{f(x; \theta)}\frac{\partial f(x; \theta)}{\partial \theta}\right) f(x; \theta)\,dx = \mathbb{E}_\theta\big[s(X; \theta)\big]
$$

2. *Đẳng thức thứ hai:* Tiếp tục đạo hàm đẳng thức $\int s(x; \theta) f(x; \theta)\,dx = 0$ thêm một lần nữa theo $\theta$ bằng quy tắc đạo hàm tích:

$$
0 = \int \left[ \frac{\partial s(x; \theta)}{\partial \theta} f(x; \theta) + s(x; \theta) \frac{\partial f(x; \theta)}{\partial \theta} \right] dx
$$

Thay $\frac{\partial s}{\partial \theta} = \frac{\partial^2 \ln f}{\partial \theta^2}$ và $\frac{\partial f}{\partial \theta} = s(x; \theta) f(x; \theta)$ vào biểu thức trên, ta thu được ngay:

$$
0 = \mathbb{E}_\theta\!\left[\frac{\partial^2 \ln f(X; \theta)}{\partial \theta^2}\right] + \mathbb{E}_\theta\big[s(X; \theta)^2\big] \implies \mathbb{E}_\theta\big[s(X; \theta)^2\big] = -\mathbb{E}_\theta\!\left[\frac{\partial^2 \ln f(X; \theta)}{\partial \theta^2}\right]
$$

Với $n$ quan sát độc lập cùng phân phối, vì $S_n(\theta) = \sum_{i=1}^n s(X_i; \theta)$ là tổng các biến độc lập có kỳ vọng $0$, thông tin Fisher của toàn mẫu có **tính cộng tuyến tính**: $I_n(\theta) = \operatorname{Var}_\theta(S_n(\theta)) = n I_1(\theta)$. Trực giác hình học cực kỳ rõ ràng: $-\ell_n''(\theta)$ đo **độ cong hướng xuống tại đỉnh** của đồ thị hợp lý logarit; đỉnh càng nhọn (độ cong càng lớn), dữ liệu càng khóa chặt vị trí của $\theta$, thông tin Fisher càng cao và bất định ước lượng càng nhỏ! $\blacksquare$

---

## 3. Cận dưới Cramér-Rao & Tính Tiệm cận Tối ưu của MLE

### 3.1. Chứng minh Bất đẳng thức Cramér-Rao

**Định lý 3.1 — Bất đẳng thức Cận dưới Phương sai:** *Cho mẫu $X = (X_1, \dots, X_n)$ tuân theo mật độ chính quy $f_n(x; \theta)$ có thông tin Fisher toàn mẫu $0 < I_n(\theta) < \infty$. Xét bất kỳ thống kê ước lượng $T = T(X)$ nào có phương sai hữu hạn $\operatorname{Var}_\theta(T) < \infty$ và kỳ vọng khả vi $\psi(\theta) \triangleq \mathbb{E}_\theta[T(X)]$. Khi đó:*

$$
\operatorname{Var}_\theta\big(T(X)\big) \ge \frac{\big[\psi'(\theta)\big]^2}{I_n(\theta)}
$$

*Đặc biệt, nếu $T(X)$ là ước lượng **không chệch** của $\theta$ (tức $\psi(\theta) = \theta \implies \psi'(\theta) = 1$) trên mẫu độc lập cùng phân phối, phương sai của nó không bao giờ xuống thấp hơn nghịch đảo thông tin Fisher (Cramér-Rao Lower Bound — `CRLB`):*

$$
\operatorname{Var}_\theta\big(T(X)\big) \ge \frac{1}{I_n(\theta)} = \frac{1}{n \, I_1(\theta)}
$$

**Chứng minh chặt chẽ qua Bất đẳng thức Cauchy-Schwarz:**
Xét hiệp phương sai giữa thống kê $T(X)$ và hàm điểm toàn mẫu $S_n(\theta) = \frac{\partial}{\partial \theta}\ln f_n(X; \theta)$. Vì $\mathbb{E}_\theta[S_n(\theta)] = 0$ theo Đẳng thức Bartlett thứ nhất, ta có $\operatorname{Cov}_\theta(T, S_n) = \mathbb{E}_\theta[T(X) S_n(\theta)]$. Viết tường minh dưới dạng tích phân trên toàn không gian mẫu:

$$
\operatorname{Cov}_\theta\big(T(X), S_n(\theta)\big) = \int T(x) \left(\frac{1}{f_n(x; \theta)} \frac{\partial f_n(x; \theta)}{\partial \theta}\right) f_n(x; \theta)\,dx = \int T(x) \frac{\partial f_n(x; \theta)}{\partial \theta}\,dx
$$

Đưa đạo hàm theo $\theta$ ra ngoài dấu tích phân:

$$
\operatorname{Cov}_\theta\big(T(X), S_n(\theta)\big) = \frac{\partial}{\partial \theta} \int T(x) f_n(x; \theta)\,dx = \frac{\partial}{\partial \theta} \mathbb{E}_\theta[T(X)] = \psi'(\theta)
$$

Áp dụng bất đẳng thức Cauchy-Schwarz trong không gian $L^2$: $\big[\operatorname{Cov}_\theta(T, S_n)\big]^2 \le \operatorname{Var}_\theta(T) \cdot \operatorname{Var}_\theta(S_n)$. Thay $\operatorname{Cov}_\theta(T, S_n) = \psi'(\theta)$ và $\operatorname{Var}_\theta(S_n) = I_n(\theta) > 0$, ta suy ra ngay $\operatorname{Var}_\theta(T) \ge \frac{[\psi'(\theta)]^2}{I_n(\theta)}$.

**Điều kiện Đạt Dấu Bằng:** Trong Cauchy-Schwarz, dấu bằng xảy ra khi và chỉ khi hai biến đã trừ trung bình phụ thuộc tuyến tính hầu chắc chắn, tức tồn tại hàm tất định $a(\theta)$ sao cho $S_n(\theta) = a(\theta)\big(T(X) - \psi(\theta)\big)$. Lấy nguyên hàm theo $\theta$, mật độ $f_n(x; \theta)$ bắt buộc phải thuộc **họ phân phối mũ một tham số** với thống kê đủ tự nhiên là $T(X)$! $\blacksquare$

### 3.2. Phân phối Chuẩn Tiệm cận và Tính Bất biến của MLE

Dù ở cỡ mẫu hữu hạn nhỏ, `MLE` không nhất thiết không chệch (ví dụ ước lượng phương sai chuẩn $\hat{\sigma}^2_{\text{MLE}} = \frac{1}{n}\sum_{i=1}^n (X_i - \bar{X})^2$ có kỳ vọng $\frac{n-1}{n}\sigma^2$), nhưng khi cỡ mẫu $n \to \infty$, khai triển Taylor bậc nhất phương trình điểm $0 = \ell_n'(\hat{\theta}_{\text{MLE}}) \approx \ell_n'(\theta_0) + \ell_n''(\theta_0)(\hat{\theta}_{\text{MLE}} - \theta_0)$ cho ta:

$$
\sqrt{n}\big(\hat{\theta}_{\text{MLE}} - \theta_0\big) \approx \frac{\frac{1}{\sqrt{n}}\sum_{i=1}^n s(X_i; \theta_0)}{-\frac{1}{n}\sum_{i=1}^n \ell_1''(X_i; \theta_0)} \xrightarrow{d} \frac{\mathcal{N}\big(0, I_1(\theta_0)\big)}{I_1(\theta_0)} = \mathcal{N}\!\left(0, \, I_1(\theta_0)^{-1}\right)
$$

Kết quả nền tảng này khẳng định `MLE` **đạt chính xác cận dưới Cramér-Rao ở giới hạn tiệm cận** (hiệu quả tiệm cận $100\%$), đồng thời thỏa mãn **nguyên lý bất biến hàm**: nếu $\hat{\theta}_{\text{MLE}}$ là ước lượng hợp lý cực đại của $\theta$ thì với mọi ánh xạ $g(\cdot)$, đại lượng $g(\hat{\theta}_{\text{MLE}})$ tự động là ước lượng hợp lý cực đại của $g(\theta)$!

---

## 4. Lợi nhuận Đuôi dày Student-$t$ so với Phân phối Chuẩn Gauss

### 4.1. Tại sao Trung bình Mẫu Sụp đổ Dưới Đuôi dày?

Nếu lợi nhuận chuỗi thời gian $X_1, \dots, X_n \stackrel{\text{iid}}{\sim} \mathcal{N}(\mu, \sigma^2)$, hàm hợp lý logarit là $\ell_n(\mu, \sigma^2) = -\frac{n}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{i=1}^n (X_i - \mu)^2$. Đạo hàm theo $\mu$ tỉ lệ với tổng sai lệch bậc nhất $\sum_{i=1}^n (X_i - \mu) = 0$, cho nghiệm $\hat{\mu}_{\text{MLE}} = \bar{X} = \frac{1}{n}\sum_{i=1}^n X_i$ đạt chính xác `CRLB` bằng $\sigma^2 / n$. Lưu ý rằng hàm phạt bậc hai $(X_i - \mu)^2$ trao **trọng số tuyến tính không giới hạn** cho mọi quan sát: một phiên sập sàn $-12\sigma$ kéo trung bình mẫu lệch gấp $12$ lần một phiên bình thường!

Trên thực tế, phân phối thực nghiệm của lợi nhuận cổ phiếu ngày và tiền mã hóa có **độ nhọn phụ trội** (Excess Kurtosis) $\kappa_{\text{ex}} = \frac{\mathbb{E}[(X - \mu)^4]}{\sigma^4} - 3$ dao động từ $4$ đến hơn $20$. Mô hình tham số chuẩn mực để nắm bắt đuôi lũy thừa là **phân phối Student-$t$ có vị trí $\mu$, tham số tỷ lệ $s > 0$ và bậc tự do $\nu > 2$**, với hàm mật độ:

$$
f(x; \mu, s, \nu) = \frac{\Gamma\!\left(\frac{\nu + 1}{2}\right)}{\sqrt{\nu \pi}\, s \, \Gamma\!\left(\frac{\nu}{2}\right)} \left(1 + \frac{(x - \mu)^2}{\nu s^2}\right)^{-\frac{\nu + 1}{2}}
$$

Các mô-men của phân phối này quyết định trực tiếp độ ổn định của các thống kê rủi ro:
- **Phương sai** tồn tại khi $\nu > 2$: $\operatorname{Var}(X) = \sigma^2 = \frac{\nu}{\nu - 2} s^2$ (phân kỳ ra $\infty$ khi $\nu \le 2$!).
- **Độ nhọn phụ trội** chỉ hữu hạn khi $\nu > 4$: $\kappa_{\text{ex}} = \frac{6}{\nu - 4}$ (với $\nu = 5 \implies \kappa_{\text{ex}} = 6$; với $\nu \in (2, 4]$ rất phổ biến trên các mã vốn hóa vừa và tiền mã hóa, mô-men bậc bốn $\mathbb{E}[X^4] = \infty$, khiến sai số chuẩn của ước lượng phương sai mẫu nổ tung!).

### 4.2. Cơ chế Tự Giảm Trọng số Ngoại lai của MLE Student-$t$

Cố định $(s, \nu)$ để khảo sát ước lượng tâm lợi nhuận $\mu$, phần phụ thuộc vào $\mu$ trong hàm hợp lý logarit của Student-$t$ là $\ell_n(\mu) = -\frac{\nu + 1}{2} \sum_{i=1}^n \ln\!\left(1 + \frac{(X_i - \mu)^2}{\nu s^2}\right) + C$. Lấy đạo hàm theo $\mu$ và đặt bằng $0$:

$$
\ell_n'(\mu) = \frac{1}{s^2} \sum_{i=1}^n w_i(\mu)(X_i - \mu) = 0, \qquad \text{với } w_i(\mu) = \frac{\nu + 1}{\nu + \left(\frac{X_i - \mu}{s}\right)^2}
$$

Hãy quan sát vẻ đẹp giải tích của phương trình điểm cố định $\hat{\mu}_{\text{MLE}} = \frac{\sum_{i=1}^n w_i X_i}{\sum_{i=1}^n w_i}$:
- Khi $\nu \to \infty$ — tức giới hạn chuẩn Gauss — trọng số $w_i \to 1$ với mọi $i$, nghiệm suy biến lại về trung bình cộng đều $\bar{X}$.
- Khi đuôi dày với $\nu$ hữu hạn như $\nu = 4$, nếu xuất hiện cú sốc thiên nga đen $|X_i - \mu| = 10 s$, trọng số của quan sát đó tự động bị nén xuống $w_i = \frac{5}{4 + 100} \approx 0.048$, ngăn chặn hoàn toàn một phiên hỗn loạn làm méo mó ước lượng xu hướng dài hạn!

Tính tích phân thông tin Fisher của tham số vị trí $\mu$ cho phân phối Student-$t_\nu$ cho kết quả đóng $I_1(\mu) = \frac{\nu + 1}{(\nu + 3) s^2}$. So sánh phương sai tiệm cận của trung bình mẫu ngây thơ $\bar{X}$ với ước lượng `MLE` tối ưu qua **Hiệu quả Tương đối Tiệm cận** (Asymptotic Relative Efficiency — `ARE`):

$$
\operatorname{ARE}\big(\bar{X}, \, \hat{\mu}_{\text{MLE}}\big) = \frac{\operatorname{Var}_{\text{asym}}(\hat{\mu}_{\text{MLE}})}{\operatorname{Var}(\bar{X})} = \frac{\frac{\nu + 3}{\nu + 1} s^2}{\frac{\nu}{\nu - 2} s^2} = \frac{(\nu - 2)(\nu + 3)}{\nu(\nu + 1)}
$$

| Bậc tự do $\nu$ | Độ nhọn phụ trội $\kappa_{\text{ex}}$ | $\operatorname{Var}(\bar{X}) / (s^2 / n)$ | $\operatorname{Var}(\hat{\mu}_{\text{MLE}}) / (s^2 / n)$ | Hiệu quả của $\bar{X}$ so với `MLE` |
| :--- | :--- | :--- | :--- | :--- |
| $\nu \to \infty$ — chuẩn tắc | $0$ | $1.000$ | $1.000$ | $100.0\%$ |
| $\nu = 6$ | $3.0$ | $1.500$ | $1.286$ | $85.7\%$ |
| $\nu = 4$ | $\infty$ | $2.000$ | $1.400$ | $70.0\%$ |
| $\nu = 3$ | $\infty$ | $3.000$ | $1.500$ | **$50.0\%$** (lãng phí một nửa dữ liệu!) |
| $\nu \to 2^+$ | $\infty$ | $\to \infty$ | $\to 1.667$ | **$0.0\%$** (trung bình mẫu thất bại hoàn toàn) |

Bảng trên giải thích tại sao tại các bàn giao dịch định lượng chuyên nghiệp, không ai lấy trung bình cộng thô lên chuỗi lợi nhuận hoặc chuỗi tín hiệu chưa cắt ngưỡng: chỉ với bậc tự do $\nu = 3$, việc dùng $\bar{X}$ tương đương với việc tự tay **vứt bỏ đúng 50% lịch sử dữ liệu** bạn đã bỏ hàng trăm ngàn đô-la để mua!

---

## 5. Nghịch lý Co rút James-Stein: Khi Chệch Có Kiểm soát Đánh bại Không Chệch

Giả sử bạn ước lượng vector kỳ vọng lợi nhuận $\theta = (\theta_1, \dots, \theta_N)^\top \in \mathbb{R}^N$ của $N$ chiến lược độc lập từ vector quan sát $X \sim \mathcal{N}_N(\theta, \sigma^2 I_N)$ (với $\sigma^2$ đã biết, ví dụ chuẩn hóa theo sai số chuẩn của từng chiến lược). Với $N = 1$ hoặc $N = 2$, ước lượng tự nhiên $\hat{\theta}^{\text{MLE}} = X$ là **chấp nhận được** (Admissible) dưới hàm tổn thất tổng sai số bình phương $\mathcal{L}(\theta, \hat{\theta}) = \|\hat{\theta} - \theta\|_2^2 = \sum_{i=1}^N (\hat{\theta}_i - \theta_i)^2$, tức không tồn tại ước lượng nào khác có rủi ro kỳ vọng nhỏ hơn trên toàn không gian tham số.

Năm 1956, Charles Stein và Willard James gây chấn động thống kê học thế kỷ 20 khi chứng minh rằng ngay khi số chiều **$N \ge 3$**, ước lượng `MLE` không chệch $X$ trở nên **không chấp nhận được**: dù $N$ cổ phiếu hay nhân tố chẳng hề liên quan vật lý gì tới nhau, việc co rút đồng thời tất cả các tọa độ về gốc tọa độ (hoặc trung bình chung) luôn mang lại tổng sai số bình phương kỳ vọng nhỏ hơn nghiêm ngặt với **mọi** vector $\theta \in \mathbb{R}^N$!

**Bổ đề 3.1 — Đẳng thức Tích phân Từng phần của Stein:** *Nếu $Z \sim \mathcal{N}(\theta_i, \sigma^2)$ và $g: \mathbb{R} \to \mathbb{R}$ là hàm khả vi tuyệt đối liên tục sao cho $\mathbb{E}[|g'(Z)|] < \infty$, thì $\mathbb{E}\big[(Z - \theta_i) g(Z)\big] = \sigma^2 \, \mathbb{E}\big[g'(Z)\big]$.*
*Chứng minh trực tiếp trong một dòng bằng tích phân từng phần với chú ý đạo hàm mật độ chuẩn $\phi_{\theta_i, \sigma^2}'(z) = -\frac{z - \theta_i}{\sigma^2}\phi_{\theta_i, \sigma^2}(z)$.*

**Định lý 3.2 — Định lý Co rút Nhiều Chiều cho $N \ge 3$:** *Cho $X \sim \mathcal{N}_N(\theta, \sigma^2 I_N)$ với $N \ge 3$. Xét **Ước lượng James-Stein** (James-Stein Estimator):*

$$
\hat{\theta}^{\text{JS}}(X) = \left(1 - \frac{(N - 2)\sigma^2}{\|X\|_2^2}\right) X
$$

*Khi đó với mọi vector tham số thực $\theta \in \mathbb{R}^N$, rủi ro bình phương trung bình của $\hat{\theta}^{\text{JS}}$ luôn nhỏ hơn nghiêm ngặt rủi ro $N\sigma^2$ của ước lượng `MLE`:*

$$
\mathbb{E}_\theta\Big[\big\|\hat{\theta}^{\text{JS}}(X) - \theta\big\|_2^2\Big] = N\sigma^2 - (N - 2)^2 \sigma^4 \, \mathbb{E}_\theta\!\left[\frac{1}{\|X\|_2^2}\right] < N\sigma^2 = \mathbb{E}_\theta\big[\|X - \theta\|_2^2\big]
$$

**Chứng minh Từng Bước:**
Đặt $c = (N - 2)\sigma^2$ và viết $\hat{\theta}^{\text{JS}} - \theta = (X - \theta) - c \frac{X}{\|X\|_2^2}$. Khai triển chuẩn Euclid bình phương và lấy kỳ vọng:

$$
\mathbb{E}_\theta\Big[\big\|\hat{\theta}^{\text{JS}} - \theta\big\|_2^2\Big] = \mathbb{E}_\theta\big[\|X - \theta\|_2^2\big] - 2c \sum_{i=1}^N \mathbb{E}_\theta\!\left[(X_i - \theta_i) \frac{X_i}{\|X\|_2^2}\right] + c^2 \, \mathbb{E}_\theta\!\left[\frac{\|X\|_2^2}{\|X\|_2^4}\right]
$$

Số hạng đầu tiên chính là $\sum_{i=1}^N \operatorname{Var}(X_i) = N\sigma^2$. Với số hạng giữa, cố định các biến $X_{-i}$ và áp dụng Bổ đề Stein theo biến $X_i$ cho hàm $g_i(X) = \frac{X_i}{\sum_{j=1}^N X_j^2}$ (lưu ý khi $N \ge 3$, kỳ vọng $\mathbb{E}[1/\|X\|_2^2] < \infty$ hoàn toàn hội tụ gần gốc $0$ nhờ yếu tố thể tích cầu $r^{N-1}dr$ trong tọa độ cực!):

$$
\frac{\partial g_i(X)}{\partial X_i} = \frac{\|X\|_2^2 - X_i(2 X_i)}{\|X\|_2^4} = \frac{\|X\|_2^2 - 2 X_i^2}{\|X\|_2^4}
$$

Cộng đạo hàm riêng này qua toàn bộ $i = 1, \dots, N$ làm xuất hiện hằng số thần kỳ $(N - 2)$:

$$
\sum_{i=1}^N \frac{\partial g_i(X)}{\partial X_i} = \frac{N\|X\|_2^2 - 2\sum_{i=1}^N X_i^2}{\|X\|_2^4} = \frac{N - 2}{\|X\|_2^2}
$$

Thay kết quả Bổ đề Stein $\sum_{i=1}^N \mathbb{E}_\theta\big[(X_i - \theta_i) g_i(X)\big] = \sigma^2 (N - 2) \mathbb{E}_\theta\big[1/\|X\|_2^2\big]$ vào phương trình rủi ro:

$$
\mathbb{E}_\theta\Big[\big\|\hat{\theta}^{\text{JS}} - \theta\big\|_2^2\Big] = N\sigma^2 + \Big[-2c(N - 2)\sigma^2 + c^2\Big] \mathbb{E}_\theta\!\left[\frac{1}{\|X\|_2^2}\right]
$$

Hàm bậc hai $-2(N - 2)\sigma^2 c + c^2$ đạt cực tiểu toàn cục đúng tại $c^\star = (N - 2)\sigma^2$, cho giá trị âm chặt $-(N - 2)^2 \sigma^4 \mathbb{E}_\theta[1/\|X\|_2^2] < 0$ với mọi $N \ge 3$! $\blacksquare$

> [!NOTE]
> **Giải thích Trực giác Hình học & Góc nhìn Bayes Thực nghiệm (Empirical Bayes):**
> Vì $\mathbb{E}[\|X\|_2^2] = \|\theta\|_2^2 + N\sigma^2 > \|\theta\|_2^2$, chuẩn độ dài của vector quan sát nhiễu $\|X\|_2$ **luôn bị thổi phồng có hệ thống** so với độ dài tín hiệu thực $\|\theta\|_2$ khi chiều $N$ lớn! Những chiến lược có lợi nhuận mẫu cao nhất trong backtest thực chất là sự cộng hưởng giữa alpha vừa phải và nhiễu dương may mắn (Lời nguyền Kẻ thắng cuộc). Nếu giả định tiên nghiệm $\theta_i \sim \mathcal{N}(0, \tau^2)$, kỳ vọng hậu nghiệm Bayes là $\frac{\tau^2}{\tau^2 + \sigma^2} X_i = \left(1 - \frac{\sigma^2}{\tau^2 + \sigma^2}\right) X_i$. Vì $\mathbb{E}\!\left[\frac{N - 2}{\|X\|_2^2}\right] \approx \frac{1}{\tau^2 + \sigma^2}$ khi $\theta$ sinh từ tiên nghiệm đó, công thức James-Stein chính là bộ lọc Bayes tự ước lượng phương sai tín hiệu từ dữ liệu chéo! Trong thực hành, người ta luôn co về trung bình chéo $\bar{X}\mathbf{1}$ (mất $1$ bậc tự do nên hệ số tử số là $N - 3$, đòi hỏi $N \ge 4$) và dùng phiên bản cắt dương $\max\!\left(0, 1 - \frac{(N-3)\sigma^2}{\|X - \bar{X}\mathbf{1}\|_2^2}\right)$ của Baranchik để tránh đổi dấu tín hiệu khi $\|X\|_2$ quá nhỏ.

---

## 6. Ví dụ Phỏng vấn Thực chiến: Ước lượng Alpha Đa Ngành & Lọc Đuôi dày

**Đề bài (Vòng Kỹ thuật Thống kê — Point72 Cubist / Two Sigma):**
1. **Phần A:** Giả sử độ biến động thực hiện hàng ngày $V_1, \dots, V_n$ được mô hình hóa độc lập theo phân phối Mũ mật độ $f(v; \lambda) = \lambda e^{-\lambda v}$ ($v > 0, \lambda > 0$). Hãy tìm `MLE` cho tham số kỳ vọng $\mu = 1/\lambda$, tính thông tin Fisher $I_n(\mu)$, cận dưới `CRLB` cho mọi ước lượng không chệch của $\mu$, và kiểm tra xem ước lượng của bạn có đạt dấu bằng không.
2. **Phần B:** Một nhà nghiên cứu chạy $N = 6$ chiến lược độc lập chuẩn hóa có cùng sai số chuẩn năm $\sigma = 1.0$ (tính theo đơn vị tỷ số Sharpe thực nghiệm trên 1 năm kiểm thử), thu được vector kết quả mẫu $X = (2.2, \, 1.8, \, 0.9, \, 0.5, \, -0.4, \, -1.0)^\top$. Áp dụng ước lượng James-Stein co về gốc $0$ (và biến thể co về trung bình chéo $\bar{X}$), dự báo Sharpe thực sự của chiến lược dẫn đầu ($X_1 = 2.2$) giảm xuống còn bao nhiêu?

**Lời giải Chi tiết:**
1. **Giải Phần A:**
   - Viết mật độ trực tiếp theo tham số mục tiêu $\mu > 0$: $f(v; \mu) = \frac{1}{\mu} e^{-v / \mu}$, suy ra hàm hợp lý logarit $\ell_n(\mu) = -n \ln \mu - \frac{1}{\mu} \sum_{i=1}^n V_i$.
   - Hàm điểm: $\ell_n'(\mu) = -\frac{n}{\mu} + \frac{\sum_{i=1}^n V_i}{\mu^2} = \frac{n}{\mu^2}(\bar{V} - \mu)$. Cho bằng $0$ được $\hat{\mu}_{\text{MLE}} = \bar{V}$ (không chệch vì $\mathbb{E}[\bar{V}] = \mu$).
   - Đạo hàm bậc hai: $\ell_n''(\mu) = \frac{n}{\mu^2} - \frac{2\sum_{i=1}^n V_i}{\mu^3}$. Lấy kỳ vọng âm với $\mathbb{E}[\sum V_i] = n\mu$:
     $$I_n(\mu) = -\mathbb{E}[\ell_n''(\mu)] = -\frac{n}{\mu^2} + \frac{2 n \mu}{\mu^3} = \frac{n}{\mu^2} \implies \text{CRLB}(\mu) = \frac{\mu^2}{n}$$
   - Phương sai thực tế của $\bar{V}$ là $\operatorname{Var}(\bar{V}) = \frac{\operatorname{Var}(V_1)}{n} = \frac{\mu^2}{n}$, khớp khít `CRLB` tại **mọi cỡ mẫu $n \ge 1$**! Điều kiện dấu bằng thỏa mãn hoàn hảo vì $\ell_n'(\mu) = \frac{n}{\mu^2}(\bar{V} - \mu)$ là hàm tuyến tính thuần nhất của $(\bar{V} - \mu)$.
2. **Giải Phần B:**
   - Tổng bình phương chuẩn gốc: $\|X\|_2^2 = 2.2^2 + 1.8^2 + 0.9^2 + 0.5^2 + (-0.4)^2 + (-1.0)^2 = 4.84 + 3.24 + 0.81 + 0.25 + 0.16 + 1.00 = 10.30$.
   - Với $N = 6, \sigma^2 = 1.0$, hệ số làm co về gốc $0$ là $1 - \frac{(6 - 2)(1.0)}{10.30} = 1 - \frac{4}{10.30} \approx 0.6117$. Do đó chiến lược số 1 từ mức hào nhoáng $2.20$ phải được hạ kỳ vọng xuống $\hat{\theta}_1^{\text{JS}} = 0.6117 \times 2.2 = \mathbf{1.35}$!
   - Nếu co về trung bình chéo $\bar{X} = \frac{4.0}{6} \approx 0.6667$: tổng bình phương độ lệch tâm $\|X - \bar{X}\mathbf{1}\|_2^2 = \|X\|_2^2 - N\bar{X}^2 = 10.30 - 6(4/6)^2 = 10.30 - 2.6667 = 7.6333$. Hệ số co rút với $(N - 3) = 3$ là $1 - \frac{3(1.0)}{7.6333} \approx 0.6070$, cho dự báo $\hat{\theta}_1 = 0.6667 + 0.6070(2.2 - 0.6667) = \mathbf{1.60}$. Cả hai phép tính đều cảnh báo nhà quản lý danh mục rằng từ $25\%$ đến $40\%$ phong độ của chiến lược số 1 đến từ nhiễu chọn lọc!

---

## 7. Các Cạm bẫy Thực chiến Trong Nghiên cứu Định lượng

> [!WARNING]
> **Ba Sai lầm Kinh điển Khi Áp dụng MLE và Co rút Lên Dữ liệu Thị trường Thực:**
> 1. **Ảo tưởng Khoảng tin cậy Chuẩn Khi $\nu \le 4$:** Nhiều kỹ sư tính độ biến động mẫu $\hat{\sigma}$ rồi dùng công thức sai số chuẩn cổ điển $\operatorname{SE}(\hat{\sigma}^2) = \hat{\sigma}^2 \sqrt{\frac{2}{n}}$ vốn chỉ đúng dưới phân phối chuẩn có $\kappa_{\text{ex}} = 0$. Dưới phân phối thực có độ nhọn phụ trội $\kappa_{\text{ex}} > 0$, phương sai tiệm cận đúng của $\hat{\sigma}^2$ là $\frac{\sigma^4}{n}(2 + \kappa_{\text{ex}})$ — tức rộng gấp $3\text{–}5$ lần công thức sách giáo khoa phổ thông, và thậm chí vô nghĩa hoàn toàn nếu $\nu \le 4$!
> 2. **Co rút Các Tài sản Không Đồng nhất Quy mô Nhiễu (Heterogeneous Variance):** Công thức James-Stein cơ bản giả định mọi tọa độ có cùng phương sai nhiễu $\sigma^2 I_N$. Nếu bạn gộp chung cổ phiếu vốn hóa siêu lớn như Apple ($\sigma_{\text{ann}} \approx 22\%$) với cổ phiếu sinh học vốn hóa nhỏ ($\sigma_{\text{ann}} \approx 95\%$) mà không chuẩn hóa theo độ biến động đặc thù $\sigma_i$ trước khi làm co, hệ số co rút sẽ bị chi phối sai lệch hoàn toàn bởi nhóm biến động cực đoan.
> 3. **Dùng Cắt Ngưỡng Cứng Không Đối xứng Thay cho Hàm Tổn thất Bền vững:** Cắt bỏ thẳng tay các ngày lợi nhuận âm lớn trong quá khứ dưới danh nghĩa "lọc ngoại lai thống kê" đối với chiến lược bán quyền chọn hoặc giao dịch chênh lệch thanh khoản chính là hành vi xóa sổ rủi ro đuôi trái thật sự — biến một chiến lược mang kỳ vọng âm thành cỗ máy in tiền giả tạo trên giấy!
