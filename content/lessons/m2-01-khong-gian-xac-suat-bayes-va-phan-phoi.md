# M2.01 — Không gian Xác suất, Suy luận Bayes, Thống kê Thứ tự & Các Phân phối Cốt lõi

## 1. Trực giác & Động lực: Tư duy Xác suất Dưới Góc nhìn Kỹ sư Hệ thống

Trong vòng lọc kỹ thuật đầu tiên của Jane Street, Citadel, Two Sigma hay WorldQuant, hơn $70\%$ ứng viên bị loại không phải vì thiếu kiến thức học máy sâu, mà vì lúng túng trước một bài toán xác suất có điều kiện hoặc thống kê thứ tự chỉ dài bốn dòng. Khi giải toán dưới áp lực bấm giờ 6–8 phút mỗi câu, việc nhớ máy móc hàng chục công thức tích phân rời rạc sẽ nhanh chóng sụp đổ; bạn cần nắm vững **cấu trúc bất biến và câu chuyện sinh dữ liệu** đằng sau các phân phối.

Đối với một kỹ sư phần mềm, cách tự nhiên nhất để xây dựng lại xác suất đại học lên chuẩn độ đo hiện đại không phải là học thuộc lòng các định lý khô khan, mà là hiểu **bộ ba Kolmogorov** $(\Omega, \mathcal{F}, \mathbb{P})$ như kiến trúc kiểu dữ liệu của một hệ thống ghi nhận sự kiện bất định theo thời gian.

---

## 2. Không gian Xác suất $(\Omega, \mathcal{F}, \mathbb{P})$ & Cấu trúc Thông tin

### 2.1. Vì sao Cần $\sigma$-Đại số $\mathcal{F}$ Thay vì Tập Lũy thừa $2^\Omega$?

Xét **không gian mẫu** (Sample Space) $\Omega$, tập hợp chứa mọi kịch bản sơ cấp $\omega$ có thể xảy ra của toàn bộ lịch sử thị trường. Nếu $\Omega$ hữu hạn (ví dụ tung đồng xu 10 lần có $|\Omega| = 2^{10}$), ta có thể gán xác suất cho mọi tập con $A \subseteq \Omega$. Tuy nhiên, khi không gian mẫu liên tục không đếm được (chẳng hạn quỹ đạo giá liên tục trên $[0, 1]$), giải tích thực chứng minh sự tồn tại của các tập con bệnh lý kiểu Vitali mà không một hàm độ dài bất biến tịnh tiến nào có thể gán giá trị nhất quán.

Quan trọng hơn nhiều đối với tài chính định lượng, **$\sigma$-đại số** (Sigma-Algebra) $\mathcal{F}$ đóng vai trò **giao diện truy vấn thông tin hợp lệ**: một tập con $A \subseteq \Omega$ thuộc $\mathcal{F}_t$ khi và chỉ khi tại đúng thời điểm $t$, một người quan sát lịch sử thị trường có đủ dữ liệu để trả lời dứt khoát câu hỏi Boolean `"Trạng thái thực ω có nằm trong A hay không?"` mà không cần nhìn trộm tương lai! Một họ các tập con $\mathcal{F} \subseteq 2^\Omega$ là một $\sigma$-đại số nếu thỏa mãn ba tiên đề đóng:
1. $\Omega \in \mathcal{F}$ (câu hỏi hiển nhiên luôn trả lời được).
2. Nếu $A \in \mathcal{F}$ thì phần bù $A^c = \Omega \setminus A \in \mathcal{F}$ (đóng với phép phủ định `NOT`).
3. Nếu $A_1, A_2, \dots \in \mathcal{F}$ là dãy đếm được các sự kiện thì hợp $\bigcup_{n=1}^\infty A_n \in \mathcal{F}$ (đóng với phép tuyển đếm được `OR`, và theo luật De Morgan cũng đóng với phép hội đếm được `AND` $\bigcap_{n=1}^\infty A_n \in \mathcal{F}$).

Một **độ đo xác suất** (Probability Measure) là ánh xạ $\mathbb{P}: \mathcal{F} \to [0, 1]$ thỏa mãn $\mathbb{P}(\Omega) = 1$ và **tính cộng tính đếm được** (Countable Additivity): với mọi họ sự kiện đôi một xung khắc $A_1, A_2, \dots \in \mathcal{F}$ ($A_i \cap A_j = \varnothing$ khi $i \neq j$), ta có $\mathbb{P}\left(\bigcup_{n=1}^\infty A_n\right) = \sum_{n=1}^\infty \mathbb{P}(A_n)$.

**Mệnh đề 2.1 (Tính Liên tục của Độ đo Xác suất & Cận Hợp Boole).** *Từ ba tiên đề Kolmogorov, với mọi dãy sự kiện lồng nhau tăng dần $A_1 \subseteq A_2 \subseteq \dots$ đặt $A = \bigcup_{n=1}^\infty A_n$, và dãy lồng nhau giảm dần $B_1 \supseteq B_2 \supseteq \dots$ đặt $B = \bigcap_{n=1}^\infty B_n$, ta luôn có:*

$$
\mathbb{P}\left(\bigcup_{n=1}^\infty A_n\right) = \lim_{n \to \infty} \mathbb{P}(A_n), \qquad \mathbb{P}\left(\bigcap_{n=1}^\infty B_n\right) = \lim_{n \to \infty} \mathbb{P}(B_n)
$$

**Chứng minh.** Ta khử phần giao nhau của dãy tăng bằng kỹ thuật "tách lớp vỏ rời nhau": đặt $C_1 = A_1$ và $C_k = A_k \setminus A_{k-1}$ với mọi $k \ge 2$. Khi đó các tập $C_k$ đôi một xung khắc, $\bigcup_{k=1}^n C_k = A_n$ và $\bigcup_{k=1}^\infty C_k = A$. Áp dụng tính cộng tính đếm được cho họ $(C_k)_{k \ge 1}$:

$$
\mathbb{P}(A) = \sum_{k=1}^\infty \mathbb{P}(C_k) = \lim_{n \to \infty} \sum_{k=1}^n \mathbb{P}(C_k) = \lim_{n \to \infty} \mathbb{P}\left(\bigcup_{k=1}^n C_k\right) = \lim_{n \to \infty} \mathbb{P}(A_n)
$$

Đẳng thức thứ hai cho dãy giảm suy ra tức thì bằng cách lấy phần bù tăng $A_n = B_n^c$. Cũng chính phép tách rời nhau này cho ra bất đẳng thức cận hợp $\mathbb{P}\left(\bigcup_{n=1}^\infty E_n\right) \le \sum_{n=1}^\infty \mathbb{P}(E_n)$ và **Bổ đề Borel-Cantelli thứ nhất**: nếu tổng xác suất các sự kiện thua lỗ cực đoan hữu hạn ($\sum_{n=1}^\infty \mathbb{P}(E_n) < \infty$), thì xác suất sự kiện đó lặp lại vô hạn lần bằng đúng **$0$**! $\blacksquare$

---

## 3. Suy luận Bayes Tuần tự & Tính Liên hợp Beta – Nhị thức

### 3.1. Cập nhật Tỷ lệ Cược Logarit Dưới Luồng Tín hiệu Giao dịch

Khi đánh giá một giả thuyết chế độ thị trường $H_1$ (ví dụ: "đang có quỹ lớn âm thầm thanh lý vị thế") đối lập với giả thuyết bình thường $H_0$ qua luồng dữ liệu quan sát $D_1, D_2, \dots, D_n$ độc lập có điều kiện, việc tính lặp đi lặp lại mẫu số chuẩn hóa Bayes rất dễ nhầm lẫn. Mẹo phản xạ nhanh nhất của dân định lượng là chia tỷ số hai phương trình Bayes để chuyển sang **dạng tỷ lệ cược** (Odds Form) và lấy logarit tự nhiên:

$$
\ln \frac{\mathbb{P}(H_1 \mid D_1, \dots, D_n)}{\mathbb{P}(H_0 \mid D_1, \dots, D_n)} = \ln \frac{\mathbb{P}(H_1)}{\mathbb{P}(H_0)} + \sum_{k=1}^n \ln \frac{f(D_k \mid H_1)}{f(D_k \mid H_0)}
$$

Mỗi quan sát mới $D_k$ chỉ đơn giản cộng thêm một trọng số bằng chứng **tỷ số hợp lý logarit** (Log-Likelihood Ratio — `LLR`) vào điểm tin cậy hiện tại — đây chính là cội nguồn toán học của thuật toán kiểm định tỷ số xác suất tuần tự Wald dùng để phát hiện đảo chiều chế độ thanh khoản nhanh nhất có thể.

### 3.2. Cặp Liên hợp Beta – Nhị thức và Hiệu ứng Co rút Bayes

Giả sử xác suất thắng thực sự $p \in (0, 1)$ của một tín hiệu giao dịch chưa biết và được gán phân phối tiên nghiệm **Beta** $p \sim \operatorname{Beta}(\alpha, \beta)$ ($\alpha, \beta > 0$) có hàm mật độ xác suất (Probability Density Function — `PDF`):

$$
f(p) = \frac{1}{B(\alpha, \beta)} p^{\alpha - 1}(1 - p)^{\beta - 1}, \qquad B(\alpha, \beta) = \int_0^1 u^{\alpha - 1}(1 - u)^{\beta - 1} \, du = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha + \beta)}
$$

Sau khi chạy thử nghiệm $n$ lệnh độc lập và ghi nhận $X = k$ lệnh thắng ($X \mid p \sim \operatorname{Bin}(n, p)$), mật độ hậu nghiệm $f(p \mid X = k)$ tỉ lệ thuận với tích hàm hợp lý và tiên nghiệm theo biến $p$:

$$
f(p \mid X = k) \propto \left[ \binom{n}{k} p^k (1 - p)^{n - k} \right] \cdot \left[ p^{\alpha - 1}(1 - p)^{\beta - 1} \right] \propto p^{(\alpha + k) - 1} (1 - p)^{(\beta + n - k) - 1}
$$

Không cần tính bất kỳ tích phân nào ở mẫu số, vì tổng mật độ xác suất trên $(0, 1)$ bắt buộc bằng $1$, nhân tử phụ thuộc $p$ duy nhất có dạng trên chính là hạt nhân của phân phối $\operatorname{Beta}(\alpha + k, \beta + n - k)$! Kỳ vọng hậu nghiệm của tỷ lệ thắng trở thành trung bình có trọng số co rút giữa kỳ vọng tiên nghiệm $\frac{\alpha}{\alpha + \beta}$ và tần suất mẫu $\frac{k}{n}$:

$$
\mathbb{E}[p \mid X = k] = \frac{\alpha + k}{\alpha + \beta + n} = \left(\frac{\alpha + \beta}{\alpha + \beta + n}\right) \frac{\alpha}{\alpha + \beta} + \left(\frac{n}{\alpha + \beta + n}\right) \frac{k}{n}
$$

Đặc biệt, khi chọn tiên nghiệm đều $\operatorname{Unif}(0, 1) \equiv \operatorname{Beta}(1, 1)$, ta thu được **Quy tắc Kế tiếp của Laplace**: xác suất lệnh thứ $n+1$ thắng sau chuỗi $k$ thắng trên $n$ thử nghiệm bằng $\frac{k + 1}{n + 2}$ (ví dụ thắng cả $3/3$ lệnh đầu tiên chỉ cho kỳ vọng $4/5 = 80\%$ chứ không phải $100\%$ ngây thơ của ước lượng tần suất).

---

## 4. Đối ngẫu Đếm – Chờ, Định thức Jacobi & Liên kết Beta – Gamma

### 4.1. Quá trình Poisson, Tính Không nhớ của Phân phối Mũ và Cuộc đua Tốc độ

Giả sử các lệnh thị trường xuất hiện trên sàn theo **Quá trình Poisson thuần nhất** cường độ $\lambda > 0$ sự kiện/giây: số lượng lệnh $N_t$ trong khoảng độ dài $t$ tuân theo $N_t \sim \operatorname{Pois}(\lambda t)$ với $\mathbb{P}(N_t = k) = e^{-\lambda t}\frac{(\lambda t)^k}{k!}$, và số sự kiện trên các khoảng thời gian rời nhau hoàn toàn độc lập.

Gọi $T_1$ là thời gian chờ đến lệnh đầu tiên. Biến cố $\{T_1 > t\}$ ("chưa có lệnh nào đến tính tới giây thứ $t$") trùng khít 100% với biến cố $\{N_t = 0\}$! Suy ra hàm phân phối tích lũy (Cumulative Distribution Function — `CDF`) của $T_1$ là $F_{T_1}(t) = 1 - \mathbb{P}(N_t = 0) = 1 - e^{-\lambda t}$ với $t \ge 0$, tức $T_1 \sim \operatorname{Exp}(\lambda)$ có $\mathbb{E}[T_1] = \frac{1}{\lambda}$ và $\operatorname{Var}(T_1) = \frac{1}{\lambda^2}$. Phân phối Mũ là phân phối liên tục duy nhất trên $(0, \infty)$ sở hữu **tính không nhớ** (Memoryless Property):

$$
\mathbb{P}(T_1 > t + s \mid T_1 > s) = \frac{e^{-\lambda(t + s)}}{e^{-\lambda s}} = e^{-\lambda t} = \mathbb{P}(T_1 > t)
$$

Hệ quả cực mạnh để giải nhẩm trong phòng thi: Nếu hai luồng lệnh Mua và Bán độc lập cùng chạy đua với thời gian chờ $T_B \sim \operatorname{Exp}(\lambda_B)$ và $T_A \sim \operatorname{Exp}(\lambda_A)$, thì thời điểm xảy ra giao dịch tiếp theo bất kể chiều nào là $T_{\min} = \min(T_B, T_A) \sim \operatorname{Exp}(\lambda_B + \lambda_A)$ (vì $\mathbb{P}(\min(T_B, T_A) > t) = \mathbb{P}(T_B > t)\mathbb{P}(T_A > t) = e^{-(\lambda_B + \lambda_A)t}$), và xác suất lệnh Mua đến trước lệnh Bán bằng đúng tỷ trọng cường độ $\mathbb{P}(T_B < T_A) = \frac{\lambda_B}{\lambda_B + \lambda_A}$! Hơn nữa, thời điểm đến của lệnh thứ $n$ là tổng $S_n = \sum_{i=1}^n \xi_i$ của $n$ biến $\operatorname{Exp}(\lambda)$ độc lập, tuân theo phân phối **Gamma** $\operatorname{Gamma}(n, \lambda)$ có mật độ $f_{S_n}(x) = \frac{\lambda^n}{(n-1)!} x^{n-1} e^{-\lambda x}$ ($x > 0$).

### 4.2. Định lý Đổi biến Jacobi và Chứng minh Độc lập Tổng – Tỷ số (Stat 110)

Cho vector ngẫu nhiên liên tục $\mathbf{X} \in \mathbb{R}^d$ có mật độ đồng thời $f_{\mathbf{X}}(\mathbf{x})$ và song ánh khả vi trơn $\mathbf{y} = \mathbf{g}(\mathbf{x})$ với ánh xạ ngược $\mathbf{x} = \mathbf{h}(\mathbf{y})$. Khi đó mật độ đồng thời tại không gian mới phải nhân với giá trị tuyệt đối của **định thức ma trận Jacobi** (Jacobian Determinant) đo hệ số co giãn thể tích vi phân:

$$
f_{\mathbf{Y}}(\mathbf{y}) = f_{\mathbf{X}}\big(\mathbf{h}(\mathbf{y})\big) \cdot \left| \det \frac{\partial \mathbf{h}(\mathbf{y})}{\partial \mathbf{y}} \right|
$$

**Định lý 2.1 (Đối ngẫu Độc lập Ngân hàng – Bưu điện giữa Gamma và Beta).** *Cho $X \sim \operatorname{Gamma}(a, \lambda)$ và $Y \sim \operatorname{Gamma}(b, \lambda)$ độc lập ($a, b, \lambda > 0$). Đặt tổng thời gian $S = X + Y$ và tỷ trọng thời gian $R = \frac{X}{X + Y}$. Khi đó $S \sim \operatorname{Gamma}(a + b, \lambda)$, $R \sim \operatorname{Beta}(a, b)$, và đặc biệt **$S$ độc lập thống kê hoàn toàn với $R$** ($S \perp R$)!*

**Chứng minh.** Miền xác định $(x, y) \in (0, \infty)^2$ ánh xạ song ánh sang $(s, r) \in (0, \infty) \times (0, 1)$ qua phép nghịch đảo $x = s r$ và $y = s(1 - r)$. Ma trận đạo hàm riêng Jacobi cấp $2 \times 2$ có định thức:

$$
J(s, r) = \det \begin{pmatrix} \frac{\partial x}{\partial s} & \frac{\partial x}{\partial r} \\ \frac{\partial y}{\partial s} & \frac{\partial y}{\partial r} \end{pmatrix} = \det \begin{pmatrix} r & s \\ 1 - r & -s \end{pmatrix} = -s r - s(1 - r) = -s \implies |J(s, r)| = s
$$

Thay $x = sr, y = s(1-r)$ và $|J| = s$ vào mật độ đồng thời $f_{X,Y}(x, y) = \frac{\lambda^a}{\Gamma(a)} x^{a-1} e^{-\lambda x} \cdot \frac{\lambda^b}{\Gamma(b)} y^{b-1} e^{-\lambda y}$:

$$
f_{S, R}(s, r) = \frac{\lambda^{a+b}}{\Gamma(a)\Gamma(b)} (sr)^{a-1} \big(s(1-r)\big)^{b-1} e^{-\lambda(sr + s - sr)} \cdot s = \underbrace{\left[ \frac{\lambda^{a+b}}{\Gamma(a+b)} s^{a+b-1} e^{-\lambda s} \right]}_{f_S(s): \, \operatorname{Gamma}(a+b, \lambda)} \cdot \underbrace{\left[ \frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)} r^{a-1}(1-r)^{b-1} \right]}_{f_R(r): \, \operatorname{Beta}(a, b)}
$$

Vì mật độ đồng thời $f_{S,R}(s, r)$ tách tích hoàn hảo thành một hàm chỉ phụ thuộc $s$ trên $(0, \infty)$ nhân với một hàm chỉ phụ thuộc $r$ trên $(0, 1)$ (đồng thời tích phân của hàm thứ nhất theo $s$ bằng $1$), nên $S$ và $R$ độc lập, $R \sim \operatorname{Beta}(a, b)$ và hằng số chuẩn hóa của Beta được chứng minh tự động là $B(a, b) = \frac{\Gamma(a)\Gamma(b)}{\Gamma(a+b)}$. $\blacksquare$

### 4.3. Bảng Tham chiếu Nhanh Hệ sinh thái Phân phối & Xấp xỉ Đuôi Chuẩn

Với biến chuẩn tắc $Z \sim \mathcal{N}(0, 1)$ có mật độ $\phi(x) = \frac{1}{\sqrt{2\pi}} e^{-x^2/2}$, xác suất vượt ngưỡng lớn $x > 0$ thỏa mãn bất đẳng thức kẹp **Tỷ số Mill** $\frac{x}{x^2 + 1}\phi(x) \le \mathbb{P}(Z > x) \le \frac{1}{x}\phi(x)$, cho phép nhẩm tức thì xác suất sự kiện đuôi cực đoan mà không cần bảng tra cứu:

| Phân phối | Ký hiệu & Tham số | Kỳ vọng $\mathbb{E}[X]$ | Phương sai $\operatorname{Var}(X)$ | Vai trò Cốt lõi trong Nghiên cứu Định lượng |
| :--- | :--- | :---: | :---: | :--- |
| **Poisson** | $\operatorname{Pois}(\lambda t)$ | $\lambda t$ | $\lambda t$ | Đếm số lệnh thị trường hoặc cú nhảy giá trong khoảng $[0, t]$ |
| **Mũ** | $\operatorname{Exp}(\lambda)$ | $1/\lambda$ | $1/\lambda^2$ | Khoảng thời gian chờ không nhớ giữa hai sự kiện sổ lệnh liên tiếp |
| **Gamma** | $\operatorname{Gamma}(a, \lambda)$ | $a/\lambda$ | $a/\lambda^2$ | Tổng thời gian chờ $a$ sự kiện; tiên nghiệm cho độ chính xác phương sai |
| **Beta** | $\operatorname{Beta}(\alpha, \beta)$ | $\frac{\alpha}{\alpha+\beta}$ | $\frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}$ | Tiên nghiệm liên hợp tỷ lệ thắng; phân phối thống kê thứ tự đều $U_{(k)}$ |
| **Chuẩn** | $\mathcal{N}(\mu, \sigma^2)$ | $\mu$ | $\sigma^2$ | Giới hạn trung tâm của tổng nhiễu vi mô; nền tảng lọc tuyến tính |

---

## 5. Thống kê Thứ tự (Order Statistics) & Khoảng cách Đều

Cho $X_1, X_2, \dots, X_n$ độc lập cùng phân phối liên tục có mật độ $f(x)$ và hàm tích lũy $F(x)$. Sắp xếp mẫu theo thứ tự tăng dần $X_{(1)} < X_{(2)} < \dots < X_{(n)}$ (với xác suất trùng nhau bằng $0$ do tính liên tục), trong đó $X_{(1)} = \min_i X_i$, $X_{(n)} = \max_i X_i$, và $X_{(k)}$ là **thống kê thứ tự thứ $k$**.

**Định lý 2.2 (Mật độ Biên và Mật độ Đồng thời của Thống kê Thứ tự).**
1. *Mật độ đồng thời của toàn bộ vector đã sắp xếp trên miền nêm $x_1 < x_2 < \dots < x_n$ bằng $f_{X_{(1)}, \dots, X_{(n)}}(x_1, \dots, x_n) = n! \prod_{i=1}^n f(x_i)$ (vì có đúng $n!$ hoán vị rời nhau của $(X_1, \dots, X_n)$ cùng sinh ra một bộ thứ tự $(x_1, \dots, x_n)$ với định thức Jacobi bằng $\pm 1$).*
2. *Mật độ biên của phần tử thứ $k$ ($1 \le k \le n$) là:*

$$
f_{X_{(k)}}(x) = \frac{n!}{(k - 1)! \, 1! \, (n - k)!} \big[F(x)\big]^{k - 1} \big[1 - F(x)\big]^{n - k} f(x)
$$

3. *Hệ quả Vàng cho Phân phối Đều Chuẩn: Nếu $U_1, \dots, U_n \stackrel{\text{i.i.d.}}{\sim} \operatorname{Unif}(0, 1)$, thì $U_{(k)} \sim \operatorname{Beta}(k, n - k + 1)$ với kỳ vọng và phương sai cách đều đoạn $[0, 1]$ thành $n + 1$ phần trung bình bằng nhau:*

$$
\mathbb{E}\big[U_{(k)}\big] = \frac{k}{n + 1}, \qquad \operatorname{Var}\big(U_{(k)}\big) = \frac{k(n - k + 1)}{(n + 1)^2 (n + 2)}
$$

**Giải thích Trực giác Vi phân (Multinomial Story Proof).** Để $X_{(k)}$ rơi vào lân cận vô cùng bé $[x, x + dx]$ độ rộng $dx$, trong $n$ biến độc lập phải có đúng $(k - 1)$ biến rơi bên trái $x$ (xác suất $F(x)$ mỗi biến), đúng $1$ biến rơi vào $[x, x + dx]$ (xác suất $f(x)\,dx$), và đúng $(n - k)$ biến rơi bên phải $x + dx$ (xác suất $1 - F(x)$ mỗi biến). Số cách phân chia $n$ biến vào ba nhóm kích thước $(k-1, 1, n-k)$ là hệ số đa thức $\frac{n!}{(k-1)!1!(n-k)!}$, chia cho $dx$ cho ra ngay công thức mật độ! Thay $F(x) = x$ và $f(x) = 1$ trên $(0, 1)$ cho $\operatorname{Unif}(0, 1)$, ta nhận diện ngay mật độ $\frac{n!}{(k-1)!(n-k)!} x^{k-1}(1-x)^{(n-k+1)-1}$ của $\operatorname{Beta}(k, n - k + 1)$.

---

## 6. Ví dụ Giải toán Phỏng vấn Thực chiến: Thống kê Thứ tự Hình học, Chọn lọc Ngược & Bayes

**Bài toán 1 (Bẻ Gãy Thanh Gỗ Thành Tam Giác — Green Book Ch. 3):** Chọn ngẫu nhiên và độc lập hai điểm cắt $U_1, U_2 \stackrel{\text{i.i.d.}}{\sim} \operatorname{Unif}(0, 1)$ trên một thanh gỗ độ dài $1$ để chia thanh gỗ thành ba đoạn thẳng. Tính xác suất ba đoạn thẳng đó ghép được thành một tam giác không suy biến.

**Lời giải Bài toán 1 (Bằng Mật độ Đồng thời của Thống kê Thứ tự):**
Gọi hai điểm cắt đã sắp xếp thứ tự là $X = U_{(1)} = \min(U_1, U_2)$ và $Y = U_{(2)} = \max(U_1, U_2)$. Theo Định lý 2.2 với $n = 2$ và $f(u) = 1$, mật độ đồng thời của $(X, Y)$ bằng hằng số $f_{X,Y}(x, y) = 2! = 2$ phân bố đều trên tam giác vuông miền xác định $\mathcal{T} = \{(x, y) : 0 < x < y < 1\}$ (có diện tích $\frac{1}{2}$).

Độ dài ba đoạn gỗ lần lượt là $L_1 = X$, $L_2 = Y - X$ và $L_3 = 1 - Y$ (với $L_1 + L_2 + L_3 = 1$). Ba đoạn thẳng có tổng bằng $1$ lập thành tam giác khi và chỉ khi không có đoạn nào chiếm từ $\frac{1}{2}$ tổng chiều dài trở lên (tức $L_i < \frac{1}{2}$ với mọi $i \in \{1, 2, 3\}$):

$$
X < \frac{1}{2}, \qquad Y - X < \frac{1}{2}, \qquad 1 - Y < \frac{1}{2} \iff Y > \frac{1}{2}
$$

Trên miền $\mathcal{T}$, ba bất đẳng thức tuyến tính $0 < x < \frac{1}{2}$, $\frac{1}{2} < y < 1$ và $y < x + \frac{1}{2}$ giới hạn một tam giác vuông nhỏ có các đỉnh tại $\left(0, \frac{1}{2}\right)$, $\left(\frac{1}{2}, \frac{1}{2}\right)$ và $\left(\frac{1}{2}, 1\right)$, với hai cạnh góc vuông đều bằng $\frac{1}{2}$ nên có diện tích bằng $\frac{1}{2} \times \frac{1}{2} \times \frac{1}{2} = \frac{1}{8}$. Nhân với mật độ đồng thời $f_{X,Y}(x, y) = 2$:

$$
\mathbb{P}(\text{Ghép được tam giác}) = \iint_{\mathcal{T}_{\text{valid}}} 2 \, dx \, dy = 2 \times \frac{1}{8} = \frac{1}{4} = 25\%
$$

**Bài toán 2 (Lời nguyền Kẻ Thắng Thầu Mua Công ty — Jane Street Classic):** Công ty $A$ có giá trị nội tại $V \sim \operatorname{Unif}(0, 100)$ triệu USD dưới sự điều hành hiện tại; ban lãnh đạo của $A$ biết chính xác $V$, còn bạn chỉ biết phân phối tiên nghiệm của $V$. Nếu mua lại thành công, đội ngũ công nghệ của bạn luôn nâng giá trị công ty lên gấp rưỡi thành $1.5 V$. Bạn gửi một mức giá chào mua tiền mặt $b \in [0, 100]$; ban lãnh đạo $A$ chấp nhận bán khi và chỉ khi $b \ge V$. Tìm $b$ tối ưu hóa lợi nhuận kỳ vọng!
- **Lời giải**: Biến cố được khớp lệnh mua là $\{V \le b\}$, xảy ra với xác suất $\frac{b}{100}$. Điều kiện hóa trên $\{V \le b\}$, phân phối hậu nghiệm của $V$ co lại thành $\operatorname{Unif}(0, b)$, nên kỳ vọng giá trị nội tại khi được khớp chỉ còn $\mathbb{E}[V \mid V \le b] = \frac{b}{2}$ (chứ không phải $50$!). Do đó lợi nhuận kỳ vọng toàn phần ở mọi mức $b > 0$ đều âm chặt:

$$
\mathbb{E}[\text{PnL}(b)] = \mathbb{P}(V \le b) \cdot \mathbb{E}[1.5 V - b \mid V \le b] = \frac{b}{100} \left(1.5 \times \frac{b}{2} - b\right) = -\frac{b^2}{400} \le 0
$$

  Nghiệm tối ưu duy nhất là **$b^\star = 0$** (không đặt lệnh!). Bài toán kinh điển này chính là mô hình thu nhỏ của lựa chọn bất lợi trên sổ lệnh mà bạn đã gặp ở `M1.02` và `M1.04`.

**Bài toán 3 (Tỷ lệ Cược Bayes — Phát hiện Tín hiệu Giả và Đồng xu Gian lận):** Trong kho 100 tín hiệu thử nghiệm, $99$ tín hiệu là nhiễu thuần túy có xác suất thắng ngày $p_0 = 0.50$, chỉ có $1$ tín hiệu thực sự có lợi thế với xác suất thắng ngày $p_1 = 0.60$. Chọn ngẫu nhiên một tín hiệu và quan sát thấy nó thắng $15$ trên $20$ phiên đầu tiên. Xác suất tín hiệu này thực sự là tín hiệu tốt bằng bao nhiêu?
- **Giải nhanh bằng Tỷ lệ cược**: Tiên nghiệm $\text{Odds}_0 = \frac{1}{99}$. Tỷ số khả năng của kết quả 15 thắng, 5 thua là:

$$
\text{LR} = \frac{(0.6)^{15}(0.4)^5}{(0.5)^{20}} = (1.2)^{15} \times (0.8)^5 \approx 15.407 \times 0.32768 \approx 5.049
$$

  Tỷ lệ cược hậu nghiệm chỉ đạt $\text{Odds}_{20} = \frac{1}{99} \times 5.049 \approx 0.0510 \implies \mathbb{P}(\text{Tín hiệu thật} \mid 15/20) = \frac{0.0510}{1.0510} \approx \mathbf{4.85\%}$! Mặc dù thắng tới $75\%$ trong một tháng giao dịch ($20$ phiên), xác suất hơn $95\%$ đó vẫn chỉ là nhiễu may mắn do tỷ lệ cơ sở tiên nghiệm quá thấp!

---

## 7. Các Bẫy Sai lầm Xác suất Thường gặp

> [!WARNING]
> **Bẫy Bỏ quên Tỷ lệ Cơ sở (`Base-Rate Neglect`) trong Khai phá Tín hiệu:** Như Bài toán 3 vừa chứng minh, độ chính xác của một phép kiểm định ($p$-value nhỏ) không có nghĩa là giả thuyết đúng có xác suất cao khi tỷ lệ tín hiệu thật trong không gian tìm kiếm chỉ là $1/1{,}000$. Đây chính là cầu nối trực tiếp sang Kiểm soát Tỷ lệ Khám phá Sai ở Học phần `M3`.

- **Bẫy Điều kiện hóa trên Sự kiện Xác suất Bằng Không (Nghịch lý Borel-Kolmogorov)**: Khi tính mật độ có điều kiện trên đa tạp chiều thấp như $\mathbb{P}(X > 0.5 \mid X = Y)$ với $X, Y$ liên tục, kết quả **phụ thuộc vào cách bạn lấy giới hạn hình học** ($|X - Y| < \varepsilon$ tạo dải băng độ rộng đều khác hẳn $|X/Y - 1| < \varepsilon$ tạo hình quạt nở rộng khi $X$ lớn!). Luôn phải đổi biến tường minh $(U, V)$ kèm định thức Jacobi rồi lấy mật độ biên $f_{U \mid V=0}(u) = \frac{f_{U,V}(u, 0)}{\int f_{U,V}(z, 0)\,dz}$.
- **Bẫy Quên Cập nhật Miền Xác định (Support Indicators)**: Khi làm việc với phân phối Đều $\operatorname{Unif}(0, \theta)$ hoặc Dịch chuyển Mũ, tham số nằm ngay trong hàm chỉ báo $\mathbb{I}_{\{\max_i X_i \le \theta\}}$. Quên viết hàm chỉ báo $\mathbb{I}$ sẽ dẫn tới đạo hàm sai hoàn toàn khi tìm ước lượng hợp lý cực đại hoặc tích phân mật độ hậu nghiệm.
