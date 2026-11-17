# M0.02 — Biến Ngẫu nhiên, Hiệp phương sai, Hàm sinh Mô-men, Luật Số Lớn & Định lý Giới hạn Trung tâm

## 1. Trực giác & Động lực: Biến Ngẫu nhiên Là Hàm Thuần Khiết, Không Phải Biến Trạng thái

Khi một lập trình viên nghe cụm từ "biến ngẫu nhiên", phản xạ tự nhiên là hình dung một ô nhớ chứa giá trị nhảy loạn xạ mỗi lần gọi hàm `rand()`. Trong toán học xác suất, cách hiểu đó gây cản trở nghiêm trọng khi bạn phải tính kỳ vọng của tổng phụ thuộc hay đổi biến mật độ.

Thực chất, một **biến ngẫu nhiên** (Random Variable) $X$ là một **hàm ánh xạ xác định** $X: \Omega \to \mathbb{R}$ gán cho mỗi kịch bản thị trường sơ cấp $\omega \in \Omega$ một con số thực cụ thể (chẳng hạn lãi lỗ cuối ngày $X(\omega)$ bằng đô-la). Toàn bộ tính ngẫu nhiên nằm ở độ đo xác suất $\mathbb{P}$ chọn kịch bản $\omega$ từ không gian mẫu $\Omega$, còn bản thân $X$ là một đường ống tính toán bất biến. Nắm vững góc nhìn hàm số này giúp bạn hiểu ngay vì sao kỳ vọng luôn tuyến tính và vì sao tổng hàng ngàn nhiễu vi mô lại hội tụ về hình chuông Gauss.

---

## 2. Hàm Khối, Hàm Mật độ, Hàm Tích lũy & Đổi biến Một chiều

### 2.1. Ba Biểu diễn của Luật Phân phối và Định lý Kỳ vọng Vô thức

Mọi biến ngẫu nhiên thực $X$ đều được đặc trưng trọn vẹn bởi **hàm phân phối tích lũy** (Cumulative Distribution Function — `CDF`) $F_X(x) \triangleq \mathbb{P}(X \le x)$, một hàm không giảm, liên tục bên phải với $\lim_{x \to -\infty} F_X(x) = 0$ và $\lim_{x \to +\infty} F_X(x) = 1$:
- **Biến rời rạc**: Nhận giá trị trên tập đếm được $\mathcal{X}$ với **hàm khối xác suất** (Probability Mass Function — `PMF`) $p_X(x) = \mathbb{P}(X = x) \ge 0$ thỏa mãn $\sum_{x \in \mathcal{X}} p_X(x) = 1$.
- **Biến liên tục tuyệt đối**: Tồn tại **hàm mật độ xác suất** (Probability Density Function — `PDF`) không âm $f_X(x) \ge 0$ sao cho $F_X(x) = \int_{-\infty}^x f_X(u)\,du$. Tại mọi điểm $f_X$ liên tục, đạo hàm $F_X'(x) = f_X(x)$ đo mật độ xác suất trên mỗi đơn vị chiều dài: $\mathbb{P}(x \le X \le x + dx) \approx f_X(x)\,dx$ (lưu ý xác suất tại đúng một điểm đơn lẻ luôn bằng $0$: $\mathbb{P}(X = x) = 0$).

Để tính kỳ vọng của một biến đổi phi tuyến $Y = g(X)$ (ví dụ khoản thanh toán quyền chọn mua $g(S_T) = \max(S_T - K, 0)$), bạn **không cần** tìm mật độ mới của $Y$ trước, mà tích phân trực tiếp theo phân phối gốc của $X$ nhờ công thức **LOTUS** (Law of the Unconscious Statistician):

$$
\mathbb{E}\big[g(X)\big] = \begin{cases} \displaystyle \sum_{x \in \mathcal{X}} g(x) \, p_X(x) & \text{(rời rạc)} \\[10pt] \displaystyle \int_{-\infty}^{+\infty} g(x) \, f_X(x)\,dx & \text{(liên tục)} \end{cases}
$$

### 2.2. Công thức Đổi biến Mật độ Một chiều từ Hàm Tích lũy

Khi bạn thực sự cần tìm hàm mật độ $f_Y(y)$ của $Y = g(X)$ với $g$ khả vi và đơn điệu nghiêm ngặt, hãy luôn xuất phát từ định nghĩa `CDF` để không bao giờ quên hệ số co giãn đạo hàm! Nếu $g$ đồng biến nghiêm ngặt ($g' > 0$), $F_Y(y) = \mathbb{P}(g(X) \le y) = \mathbb{P}(X \le g^{-1}(y)) = F_X(g^{-1}(y))$; nếu $g$ nghịch biến nghiêm ngặt ($g' < 0$), dấu bất đẳng thức đảo chiều thành $F_Y(y) = \mathbb{P}(X \ge g^{-1}(y)) = 1 - F_X(g^{-1}(y))$. Lấy đạo hàm theo $y$ qua quy tắc dây chuyền thống nhất cả hai chiều bằng dấu giá trị tuyệt đối:

$$
f_Y(y) = f_X\!\big(g^{-1}(y)\big) \cdot \left| \frac{d}{dy} g^{-1}(y) \right| = \frac{f_X(x)}{\big|g'(x)\big|}\Bigg|_{x = g^{-1}(y)}
$$

Nếu $g$ không đơn điệu trên toàn miền — điển hình là bình phương biến chuẩn tắc $Y = X^2$ với $X \sim \mathcal{N}(0, 1)$ — ta cộng đóng góp của cả hai nhánh căn đối xứng $\pm\sqrt{y}$ ($y > 0$): $F_Y(y) = \mathbb{P}(-\sqrt{y} \le X \le \sqrt{y}) = F_X(\sqrt{y}) - F_X(-\sqrt{y})$. Đạo hàm theo $y$ cho ra mật độ phân phối Chi-bình phương một bậc tự do $\chi_1^2$: $f_Y(y) = \frac{1}{2\sqrt{y}}\big[f_X(\sqrt{y}) + f_X(-\sqrt{y})\big] = \frac{1}{\sqrt{2\pi y}} e^{-y/2}$ ($y > 0$).

---

## 3. Tính Tuyến tính Kỳ vọng, Hiệp phương sai & Bất đẳng thức Đuôi

### 3.1. Siêu Vũ khí Tuyến tính Kỳ vọng và Ma trận Hiệp phương sai

Vì tích phân và phép lấy tổng là toán tử tuyến tính trên không gian các hàm trên $\Omega$, kỳ vọng sở hữu tính chất quý giá nhất trong toàn bộ môn xác suất: với **mọi** biến ngẫu nhiên $X_1, \dots, X_n$ có kỳ vọng hữu hạn, **bất kể chúng độc lập hay phụ thuộc chằng chịt vào nhau**, ta luôn có:

$$
\mathbb{E}\!\left[\sum_{i=1}^n a_i X_i\right] = \sum_{i=1}^n a_i \, \mathbb{E}[X_i]
$$

Ví dụ minh họa sức mạnh tức thì: Trong bài toán mất thứ tự ở `M0.01`, gọi $X$ là tổng số lá bài nằm đúng vị trí ban đầu khi xáo bộ bài $n$ lá. Thay vì tính tổng $\sum_{k=0}^n k \cdot \mathbb{P}(X = k)$ cực kỳ vất vả, ta phân tách $X = \sum_{i=1}^n \mathbb{I}_i$, trong đó biến chỉ báo $\mathbb{I}_i = 1$ nếu lá thứ $i$ nằm đúng chỗ (xác suất $\frac{1}{n}$) và $0$ nếu ngược lại. Dù các $\mathbb{I}_i$ phụ thuộc chặt vào nhau, tính tuyến tính cho ngay $\mathbb{E}[X] = \sum_{i=1}^n \mathbb{E}[\mathbb{I}_i] = n \times \frac{1}{n} = \mathbf{1}$ với mọi $n \ge 1$!

Ngược lại, **phương sai** (Variance) $\operatorname{Var}(X) \triangleq \mathbb{E}[(X - \mathbb{E}[X])^2] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2 \ge 0$ là bậc hai nên phụ thuộc trực tiếp vào **hiệp phương sai** (Covariance) $\operatorname{Cov}(X, Y) \triangleq \mathbb{E}\big[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])\big] = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]$. Với vector trọng số danh mục $w = (w_1, \dots, w_n)^\top \in \mathbb{R}^n$ và vector lợi nhuận $R = (R_1, \dots, R_n)^\top$ có ma trận hiệp phương sai $\Sigma_{ij} = \operatorname{Cov}(R_i, R_j)$:

$$
\operatorname{Var}\!\left(\sum_{i=1}^n w_i R_i\right) = \sum_{i=1}^n w_i^2 \operatorname{Var}(R_i) + 2 \sum_{1 \le i < j \le n} w_i w_j \operatorname{Cov}(R_i, R_j) = w^\top \Sigma w \ge 0
$$

Áp dụng tính không âm $\operatorname{Var}(t X + Y) = t^2 \operatorname{Var}(X) + 2t\operatorname{Cov}(X, Y) + \operatorname{Var}(Y) \ge 0$ với mọi $t \in \mathbb{R}$: tam thức bậc hai theo $t$ không âm khi và chỉ khi biệt thức $\Delta' = \big(\operatorname{Cov}(X, Y)\big)^2 - \operatorname{Var}(X)\operatorname{Var}(Y) \le 0$ (**Bất đẳng thức Cauchy-Schwarz**!). Chia hai vế cho $\sigma_X \sigma_Y > 0$, **hệ số tương quan Pearson** (Pearson Correlation) luôn bị kẹp trong $[-1, 1]$:

$$
\rho_{X,Y} \triangleq \frac{\operatorname{Cov}(X, Y)}{\sigma_X \, \sigma_Y} \in [-1, +1]
$$

trong đó $|\rho_{X,Y}| = 1$ xảy ra khi và chỉ khi $Y = a X + b$ phụ thuộc tuyến tính hoàn toàn vào $X$ với xác suất bằng $1$.

### 3.2. Bất đẳng thức Markov và Chebyshev Không Cần Biết Hình dáng Phân phối

**Mệnh đề 0.4 — Bất đẳng thức Markov và Bất đẳng thức Chebyshev:**
1. *(Markov)* *Nếu biến ngẫu nhiên không âm $Y \ge 0$ có kỳ vọng hữu hạn và ngưỡng $a > 0$, thì $\mathbb{P}(Y \ge a) \le \frac{\mathbb{E}[Y]}{a}$.*
2. *(Chebyshev)* *Nếu $X$ có kỳ vọng $\mu$ và phương sai $\sigma^2 < \infty$, thì với mọi $\varepsilon > 0$:*

$$
\mathbb{P}\big(|X - \mu| \ge \varepsilon\big) \le \frac{\sigma^2}{\varepsilon^2}
$$

**Chứng minh.** Với mọi kịch bản $\omega \in \Omega$, kiểm tra từng trường hợp $Y(\omega) < a$ (vế trái bằng $0 \le Y(\omega)$) và $Y(\omega) \ge a$ (vế trái bằng $a \le Y(\omega)$) cho thấy bất đẳng thức hàm điểm $a \, \mathbb{I}_{\{Y \ge a\}} \le Y$ luôn đúng! Lấy kỳ vọng hai vế dùng tính đơn điệu: $a \, \mathbb{P}(Y \ge a) = \mathbb{E}[a \, \mathbb{I}_{\{Y \ge a\}}] \le \mathbb{E}[Y]$, chia cho $a > 0$ thu được Markov. Tiếp theo, đặt biến không âm $Y = (X - \mu)^2 \ge 0$ và ngưỡng $a = \varepsilon^2 > 0$: vì $\{|X - \mu| \ge \varepsilon\} = \{(X - \mu)^2 \ge \varepsilon^2\}$, áp dụng Markov cho ra ngay $\mathbb{P}(|X - \mu| \ge \varepsilon) \le \frac{\mathbb{E}[(X - \mu)^2]}{\varepsilon^2} = \frac{\sigma^2}{\varepsilon^2}$. $\blacksquare$

---

## 4. Hàm Sinh Mô-men, Luật Số Lớn Yếu & Định lý Giới hạn Trung tâm

### 4.1. Hàm Sinh Mô-men và Phép Nhân Tổng Độc lập

**Hàm sinh mô-men** (Moment Generating Function — `MGF`) của biến ngẫu nhiên $X$ được định nghĩa là $M_X(t) \triangleq \mathbb{E}[e^{tX}]$, với điều kiện kỳ vọng này hữu hạn trên một lân cận mở $(-t_0, t_0)$ quanh gốc $t = 0$ ($t_0 > 0$). Khai triển chuỗi lũy thừa $e^{tX} = \sum_{k=0}^\infty \frac{t^k X^k}{k!}$ và lấy kỳ vọng từng số hạng trên miền hội tụ:

$$
M_X(t) = \sum_{k=0}^\infty \frac{\mathbb{E}[X^k]}{k!} t^k \implies \mathbb{E}[X^k] = \frac{d^k}{dt^k} M_X(t)\Bigg|_{t = 0}
$$

Hai lý do khiến `MGF` trở thành công cụ giải tích tối thượng trong xác suất định lượng:
1. **Định lý Duy nhất**: Nếu $M_X(t) = M_Y(t)$ với mọi $t \in (-t_0, t_0)$, thì $X$ và $Y$ có **cùng phân phối xác suất** ($F_X \equiv F_Y$).
2. **Biến Phép Tích chập Thành Phép Nhân**: Nếu $X_1, \dots, X_n$ độc lập, thì $M_{X_1 + \dots + X_n}(t) = \mathbb{E}\big[\prod_{i=1}^n e^{t X_i}\big] = \prod_{i=1}^n M_{X_i}(t)$! Ví dụ, với biến chuẩn tắc $Z \sim \mathcal{N}(0, 1)$, ghép bình phương đủ trên số mũ cho:

$$
M_Z(t) = \int_{-\infty}^{+\infty} e^{tz} \frac{1}{\sqrt{2\pi}} e^{-z^2/2}\,dz = e^{t^2/2} \int_{-\infty}^{+\infty} \frac{1}{\sqrt{2\pi}} e^{-(z - t)^2/2}\,dz = e^{t^2/2}
$$

Từ đó $X = \mu + \sigma Z \sim \mathcal{N}(\mu, \sigma^2)$ có $M_X(t) = e^{\mu t} M_Z(\sigma t) = \exp\!\left(\mu t + \frac{1}{2}\sigma^2 t^2\right)$. Khi cộng hai biến chuẩn độc lập $X_1 + X_2$, tích hai hàm mũ cho $\exp\!\big((\mu_1 + \mu_2)t + \frac{1}{2}(\sigma_1^2 + \sigma_2^2)t^2\big)$, chứng minh ngay $X_1 + X_2 \sim \mathcal{N}(\mu_1 + \mu_2, \, \sigma_1^2 + \sigma_2^2)$ mà không cần tính tích phân chập!

Mẹo tính nhanh hơn nữa trong nghiên cứu định lượng là lấy logarit tự nhiên $K_X(t) \triangleq \ln M_X(t)$, gọi là **hàm sinh tích lũy** (Cumulant Generating Function): khi cộng các biến độc lập thì tích lũy cộng tuyến tính $K_{X+Y}(t) = K_X(t) + K_Y(t)$, đồng thời hai đạo hàm đầu tại $t = 0$ cho thẳng kỳ vọng $K_X'(0) = \mathbb{E}[X]$ và phương sai $K_X''(0) = \operatorname{Var}(X)$ mà không cần trừ bình phương kỳ vọng!

| Phân phối Sơ cấp | Ký hiệu & Tham số | Hàm Sinh Mô-men $M_X(t) = \mathbb{E}[e^{tX}]$ | Miền Hội tụ | Tính Đóng Khi Cộng Các Biến Độc lập |
| :--- | :--- | :---: | :---: | :--- |
| **Bernoulli** | $\operatorname{Bern}(p)$ | $1 - p + p e^t$ | $t \in \mathbb{R}$ | Tổng $n$ biến $\operatorname{Bern}(p)$ cho $\operatorname{Bin}(n, p)$. |
| **Nhị thức** | $\operatorname{Bin}(n, p)$ | $(1 - p + p e^t)^n$ | $t \in \mathbb{R}$ | $\operatorname{Bin}(n_1, p) + \operatorname{Bin}(n_2, p) \sim \operatorname{Bin}(n_1 + n_2, p)$. |
| **Poisson** | $\operatorname{Pois}(\lambda)$ | $\exp\big(\lambda(e^t - 1)\big)$ | $t \in \mathbb{R}$ | $\operatorname{Pois}(\lambda_1) + \operatorname{Pois}(\lambda_2) \sim \operatorname{Pois}(\lambda_1 + \lambda_2)$. |
| **Mũ** | $\operatorname{Exp}(\lambda)$ | $\frac{\lambda}{\lambda - t}$ | $t < \lambda$ | Tổng $n$ biến $\operatorname{Exp}(\lambda)$ cho $\operatorname{Gamma}(n, \lambda)$. |
| **Chuẩn** | $\mathcal{N}(\mu, \sigma^2)$ | $\exp\big(\mu t + \frac{1}{2}\sigma^2 t^2\big)$ | $t \in \mathbb{R}$ | $\mathcal{N}(\mu_1, \sigma_1^2) + \mathcal{N}(\mu_2, \sigma_2^2) \sim \mathcal{N}(\mu_1+\mu_2, \sigma_1^2+\sigma_2^2)$. |

### 4.2. Chứng minh Luật Số Lớn Yếu và Định lý Giới hạn Trung tâm

Cho dãy $X_1, X_2, \dots, X_n$ độc lập và cùng phân phối có kỳ vọng $\mu$ và phương sai hữu hạn $0 < \sigma^2 < \infty$. Đặt trung bình mẫu $\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i$.

**Định lý 0.5 — Luật Số Lớn Yếu (Weak Law of Large Numbers) & Định lý Giới hạn Trung tâm (Central Limit Theorem):**
1. *Với mọi $\varepsilon > 0$, trung bình mẫu hội tụ theo xác suất về kỳ vọng lý thuyết: $\lim_{n \to \infty} \mathbb{P}\big(|\bar{X}_n - \mu| \ge \varepsilon\big) = 0$.*
2. *Tổng chuẩn hóa theo căn bậc hai cỡ mẫu hội tụ theo phân phối về phân phối chuẩn tắc $\mathcal{N}(0, 1)$:*

$$
Z_n \triangleq \frac{\sum_{i=1}^n X_i - n\mu}{\sigma\sqrt{n}} = \frac{\sqrt{n}(\bar{X}_n - \mu)}{\sigma} \xrightarrow[n \to \infty]{d} \mathcal{N}(0, 1)
$$

**Chứng minh.**
- *Ý 1*: Do các $X_i$ độc lập không tương quan, $\mathbb{E}[\bar{X}_n] = \mu$ và $\operatorname{Var}(\bar{X}_n) = \frac{1}{n^2}\sum_{i=1}^n \sigma^2 = \frac{\sigma^2}{n}$. Áp dụng trực tiếp Bất đẳng thức Chebyshev với mọi $\varepsilon > 0$:

$$
0 \le \mathbb{P}\big(|\bar{X}_n - \mu| \ge \varepsilon\big) \le \frac{\operatorname{Var}(\bar{X}_n)}{\varepsilon^2} = \frac{\sigma^2}{n\varepsilon^2} \xrightarrow{n \to \infty} 0
$$

- *Ý 2 — Chứng minh bằng khai triển `MGF`*: Chuẩn hóa từng hạng tử $Y_i = \frac{X_i - \mu}{\sigma}$ sao cho $Y_i$ độc lập cùng phân phối với $\mathbb{E}[Y_i] = 0$, $\mathbb{E}[Y_i^2] = 1$, và $Z_n = \frac{1}{\sqrt{n}}\sum_{i=1}^n Y_i$. Giả sử $M_Y(s) = \mathbb{E}[e^{s Y_1}]$ tồn tại quanh $s = 0$ (nếu không tồn tại mô-men mũ, chứng minh giữ nguyên 100% khi thay $s$ bằng $is$ dùng **hàm đặc trưng** — Characteristic Function $\varphi_Y(s) = \mathbb{E}[e^{isY_1}]$ vốn luôn tồn tại và bị chặn $|\varphi_Y(s)| \le 1$!). Khai triển Taylor bậc hai của $M_Y(s)$ quanh $s = 0$ với $M_Y(0) = 1$, $M_Y'(0) = \mathbb{E}[Y_1] = 0$ và $M_Y''(0) = \mathbb{E}[Y_1^2] = 1$:

$$
M_Y(s) = 1 + 0 \cdot s + \frac{1}{2} s^2 + o(s^2) \qquad (s \to 0)
$$

Vì $Z_n$ là tổng của $n$ biến độc lập $\frac{1}{\sqrt{n}}Y_i$, thay $s = \frac{t}{\sqrt{n}}$ với $t \in \mathbb{R}$ cố định khi $n \to \infty$:

$$
M_{Z_n}(t) = \left[ M_Y\!\left(\frac{t}{\sqrt{n}}\right) \right]^n = \left[ 1 + \frac{t^2}{2n} + o\!\left(\frac{1}{n}\right) \right]^n \xrightarrow{n \to \infty} e^{t^2 / 2} = M_Z(t)
$$

Theo Định lý Liên tục Curtiss — Lévy, sự hội tụ điểm của hàm sinh mô-men (hoặc hàm đặc trưng) về $e^{t^2/2}$ kéo theo $\lim_{n\to\infty} \mathbb{P}(Z_n \le z) = \Phi(z) = \int_{-\infty}^z \frac{1}{\sqrt{2\pi}} e^{-u^2/2}\,du$ với mọi $z \in \mathbb{R}$! $\blacksquare$

---

## 5. Ví dụ Thực chiến: Định cỡ Mẫu Kiểm thử Alpha Bằng Giới hạn Trung tâm

**Bài toán (WorldQuant / Two Sigma — Tại sao Chiến lược Tốt Vẫn Thua lỗ Ngắn hạn?):**
Một chiến lược giao dịch định lượng có lợi nhuận ngày độc lập cùng phân phối với kỳ vọng thực $\mu = +0.08\%/\text{ngày}$ và độ biến động ngày $\sigma = 1.00\%/\text{ngày}$ (tương đương tỷ số Sharpe quy năm lý thuyết $\text{SR}_{\text{ann}} = \frac{0.08}{1.00}\sqrt{252} \approx 1.27$, một mức rất tốt trên thực tế!).
1. Sau $1$ quý giao dịch ($n = 64$ phiên), xác suất quỹ đang chịu **tổng lỗ ròng** ($\sum_{i=1}^{64} R_i < 0$) bằng bao nhiêu?
2. Cần chạy kiểm thử ngoài mẫu tối thiểu bao nhiêu phiên $n$ (và bao nhiêu năm) để thống kê kiểm định $T_n = \frac{\sqrt{n}\bar{R}_n}{\sigma}$ vượt ngưỡng có ý nghĩa thống kê một phía $z_{0.95} = 1.645$ với xác suất phát hiện đạt $80\%$ (cho $z_{0.80} = 0.842$, $\Phi(-0.64) \approx 0.261$)?

**Lời giải Từng Bước:**
1. **Xác suất thua lỗ sau $1$ quý ($n = 64$):**
   Theo Định lý Giới hạn Trung tâm, tổng lợi nhuận $S_{64} = \sum_{i=1}^{64} R_i$ xấp xỉ chuẩn với kỳ vọng $64 \times 0.08\% = +5.12\%$ và độ lệch chuẩn $\sqrt{64} \times 1.00\% = 8.00\%$:

$$
\mathbb{P}(S_{64} < 0) = \mathbb{P}\!\left(\frac{S_{64} - n\mu}{\sigma\sqrt{n}} < -\frac{\sqrt{64} \times 0.08}{1.00}\right) \approx \Phi(-0.64) \approx \mathbf{26.1\%}
$$

   Gần **một phần tư thời gian**, một chiến lược có Sharpe $1.27$ vẫn đóng quý trong sắc đỏ thuần túy do nhiễu phương sai $\sqrt{n}$ lấn át xu hướng tuyến tính $n$ ở cỡ mẫu nhỏ!
2. **Định cỡ mẫu để chứng minh Alpha có ý nghĩa thống kê:**
   Viết $T_n = \frac{\sqrt{n}(\bar{R}_n - \mu)}{\sigma} + \frac{\sqrt{n}\mu}{\sigma} = Z_n + 0.08\sqrt{n}$ với $Z_n \approx \mathcal{N}(0, 1)$. Yêu cầu $\mathbb{P}(T_n \ge 1.645) \ge 0.80$:

$$
\mathbb{P}\big(Z_n \ge 1.645 - 0.08\sqrt{n}\big) \ge 0.80 \iff 1.645 - 0.08\sqrt{n} \le -0.842 \iff \sqrt{n} \ge \frac{2.487}{0.08} = 31.0875
$$

   Bình phương hai vế cho $n \ge 966.4 \implies \mathbf{967\text{ phiên}}$ (tức gần **$3.84$ năm** giao dịch thực tế nếu chỉ giao dịch một tài sản đơn lẻ!). Đây chính là lý do sống còn khiến các quỹ định lượng phải mở rộng chiều rộng sang hàng ngàn mã cổ phiếu độc lập (Định luật Grinold-Kahn ở `M5.01`) thay vì ngồi chờ $4$ năm trên một chỉ số duy nhất!

**Bài toán 2 (Citadel / Optiver — Đổi biến Mật độ và Kỳ vọng Của Giá Cổ phiếu Log-Chuẩn):**
Trong mô hình Black-Scholes, log-lợi nhuận sau thời gian $T$ là $X \sim \mathcal{N}(m, v^2)$ và giá cổ phiếu cuối kỳ là $S_T = S_0 e^X$ ($S_0 > 0$). Hãy tìm hàm mật độ $f_{S_T}(s)$ trên $(0, \infty)$, kỳ vọng $\mathbb{E}[S_T]$ và phương sai $\operatorname{Var}(S_T)$!
- **Lời giải Kết hợp Đổi biến Một chiều và `MGF`**:
  1. Ánh xạ $s = g(x) = S_0 e^x$ đồng biến nghiêm ngặt từ $\mathbb{R}$ lên $(0, \infty)$, có hàm ngược $x = g^{-1}(s) = \ln(s / S_0)$ và đạo hàm $\frac{d}{ds}g^{-1}(s) = \frac{1}{s} > 0$. Áp dụng công thức đổi biến Mục 2.2:

$$
f_{S_T}(s) = f_X\!\big(\ln(s / S_0)\big) \cdot \frac{1}{s} = \frac{1}{s \, v\sqrt{2\pi}} \exp\!\left(-\frac{\big(\ln(s / S_0) - m\big)^2}{2 v^2}\right) \qquad (s > 0)
$$

  2. Để tính kỳ vọng và phương sai, **tuyệt đối không** tích phân trực tiếp hàm mật độ trên mà nhận diện ngay $\mathbb{E}[e^{k X}] = M_X(k) = \exp\!\big(k m + \frac{1}{2} k^2 v^2\big)$! Thay $k = 1$ và $k = 2$:

$$
\mathbb{E}[S_T] = S_0 M_X(1) = S_0 e^{m + v^2 / 2}, \qquad \operatorname{Var}(S_T) = S_0^2\big(M_X(2) - M_X(1)^2\big) = S_0^2 e^{2m + v^2}\big(e^{v^2} - 1\big)
$$

  Lưu ý sự xuất hiện của phần bù lồi $+v^2 / 2$ trên số mũ: do hàm mũ lồi nghiêm ngặt ($e^X$ theo bất đẳng thức Jensen), kỳ vọng $\mathbb{E}[S_T] = S_0 e^{m + v^2/2}$ luôn lớn hơn trung vị $\operatorname{Median}(S_T) = S_0 e^m$!

---

## 6. Các Bẫy Xác suất Thường gặp Về Tương quan và Phân phối Đuôi Dày

> [!WARNING]
> **Ba Bẫy Sai lầm Chí mạng Trong Phỏng vấn & Quản trị Rủi ro:**
> 1. **Ngộ nhận Không Tương quan Kéo theo Độc lập ($\operatorname{Cov}(X, Y) = 0 \not\Rightarrow X \perp Y$):** Hệ số tương quan Pearson chỉ đo mối liên hệ **tuyến tính**. Nếu $X \sim \mathcal{N}(0, 1)$ và biến động thực tế là $Y = X^2$, mặc dù $Y$ bị quyết định hoàn toàn 100% bởi $X$, nhưng do tính lẻ đối xứng $\mathbb{E}[X^3] = 0$, ta lại có $\operatorname{Cov}(X, X^2) = \mathbb{E}[X^3] - 0 = 0$! (Ngoại lệ quan trọng: nếu $(X, Y)$ có phân phối **chuẩn đồng thời** hai chiều thì $\operatorname{Cov}(X, Y) = 0$ thực sự tương đương $X \perp Y$).
> 2. **Áp dụng Máy móc Định lý Giới hạn Trung tâm Cho Phân phối Đuôi Dày:** Giả thiết sống còn của Định lý 0.5 là phương sai hữu hạn $\sigma^2 < \infty$. Với các biến cố sụp đổ thanh khoản tuân theo luật lũy thừa Pareto có số mũ đuôi $\alpha \le 2$ (hoặc phân phối Cauchy có mật độ $\frac{1}{\pi(1+x^2)}$), phương sai nổ ra vô cực và trung bình mẫu $\bar{X}_n$ **không bao giờ hội tụ về phân phối chuẩn** dù $n = 10^9$!
> 3. **Nhầm Tồn tại Mô-men Với Tồn tại `MGF`:** Phân phối Log-chuẩn ($Y = e^X$ với $X \sim \mathcal{N}(0, 1)$) dùng định giá cổ phiếu Black-Scholes có hữu hạn mọi mô-men $\mathbb{E}[Y^k] = e^{k^2/2} < \infty$, nhưng tích phân $\mathbb{E}[e^{t e^X}] = +\infty$ với mọi $t > 0$ nên **không tồn tại `MGF`** quanh $0$!
