# M3.02 — Hình học Bình phương Tối thiểu, Định lý Frisch-Waugh-Lovell, Ridge/LASSO & Sai số Newey-West

## 1. Trực giác & Động lực: Vì sao $R^2 = 0.001$ Vẫn Tạo Ra Quỹ Đầu cơ Tỷ Đô?

Khi một kỹ sư phần mềm bước từ học máy công nghiệp sang nghiên cứu định lượng tại WorldQuant, Trexquant hay Squarepoint Capital, cú sốc văn hóa lớn nhất nằm ở con số hệ số xác định $R^2$. Trong dự báo giá nhà hay tỷ lệ nhấp quảng cáo, một mô hình hồi quy đạt $R^2 = 0.001$ (tức chỉ giải thích nổi **$0.1\%$ phương sai** của biến mục tiêu, để sót $99.9\%$ nhiễu) sẽ lập tức bị xóa khỏi kho mã nguồn. Thế nhưng trong dự báo lợi nhuận chéo cổ phiếu Mỹ hàng ngày, một tín hiệu ổn định ngoài mẫu đạt $R^2 = 0.001$ lại là viên ngọc quý có thể vận hành hàng trăm triệu đô-la vốn!

Hãy chứng minh nghịch lý này bằng toán học sơ cấp. Xét bài toán dự báo lợi nhuận phụ trội ngày mai $y_{t,i}$ của $N = 2{,}000$ cổ phiếu thanh khoản cao từ điểm tín hiệu chuẩn hóa $x_{t,i}$ (có trung bình $0$, phương sai $1$). Hệ số tương quan tuyến tính chéo hàng ngày — hay hệ số thông tin — liên hệ với $R^2$ qua căn bậc hai:

$$
r = \operatorname{Corr}(x, y) = \sqrt{R^2} = \sqrt{0.001} \approx 0.0316
$$

Tại sao $r \approx 0.0316$ lại mạnh đến vậy? Giả sử sau khi trung hòa rủi ro thị trường và ngành, phần dư lợi nhuận của $N_{\text{eff}} = 500$ cụm cổ phiếu độc lập hiệu dụng trong ngày có độ biến động ngày $\sigma$, tức $y_{t,i} = r \sigma x_{t,i} + \varepsilon_{t,i}$ với $\operatorname{Var}(\varepsilon_{t,i}) = (1 - r^2)\sigma^2 \approx \sigma^2$. Nếu mỗi ngày ta phân bổ trọng số tỷ lệ với tín hiệu $w_{t,i} = \frac{x_{t,i}}{N_{\text{eff}}}$, kỳ vọng và độ lệch chuẩn lợi nhuận ngày của toàn danh mục là:

$$
\mathbb{E}[R_{p,t}] = \frac{1}{N_{\text{eff}}} \sum_{i=1}^{N_{\text{eff}}} \mathbb{E}[x_{t,i} y_{t,i}] = r \sigma, \qquad \operatorname{SD}(R_{p,t}) \approx \frac{\sigma}{\sqrt{N_{\text{eff}}}}
$$

Quy đổi sang tỷ số Sharpe hàng năm trên $252$ phiên giao dịch độc lập theo thời gian:

$$
\text{Sharpe}_{\text{ann}} = \sqrt{252} \cdot \frac{\mathbb{E}[R_{p,t}]}{\operatorname{SD}(R_{p,t})} \approx r \sqrt{252 \cdot N_{\text{eff}}} = 0.0316 \times \sqrt{252 \times 500} \approx \mathbf{11.2} \quad (\text{trước phí giao dịch!})
$$

Ngay cả khi bề rộng độc lập thực tế chỉ đạt $N_{\text{eff}} = 80$ cược độc lập mỗi ngày (tương đương $20{,}160$ cược/năm, mang lại tỷ số Sharpe gộp trước phí $\approx 4.49$) và trừ đi một nửa lợi nhuận cho chi phí trượt giá thực thi, một mô hình có $R^2 = 0.001$ vẫn mang lại tỷ số Sharpe ròng $\approx \mathbf{2.25}$ vượt mốc **$2.0$**! Tuy nhiên, chính vì tín hiệu thật mong manh ở mức $r \approx 0.03$, chỉ cần một sai sót nhỏ trong đại số hồi quy — như đa cộng tuyến giữa các đặc trưng, rò rỉ nhân tố ẩn chưa trực giao hóa đúng cách, hoặc đánh giá sai số chuẩn trên chuỗi lợi nhuận chồng lấp — toàn bộ $0.1\%$ tín hiệu đó sẽ bị nuốt chửng bởi nhiễu ước lượng.

---

## 2. Hình học Không gian Cột của OLS & Định lý Frisch-Waugh-Lovell

### 2.1. Phép chiếu Trực giao và Ma trận Mũ $H$

Xét mô hình tuyến tính $y = X\beta + \varepsilon$, trong đó $y \in \mathbb{R}^n$ là vector lợi nhuận thực hiện, $X \in \mathbb{R}^{n \times p}$ ($n > p$, giả sử hạng cột đầy đủ $\operatorname{rank}(X) = p$) là ma trận thiết kế gồm $p$ đặc trưng dự báo, và $\beta \in \mathbb{R}^p$. Khi $\beta$ biến thiên khắp $\mathbb{R}^p$, vector dự báo $\hat{y} = X\beta$ quét toàn bộ **không gian cột** $\mathcal{C}(X) \subset \mathbb{R}^n$ có số chiều $p$.

Bài toán **Bình phương Tối thiểu Thông thường** (Ordinary Least Squares — `OLS`) tìm $\hat{\beta} = \arg\min_{\beta \in \mathbb{R}^p} \|y - X\beta\|_2^2$ về mặt hình học Euclid chính là tìm hình chiếu vuông góc $\hat{y} \in \mathcal{C}(X)$ gần điểm $y$ nhất. Điều kiện cần và đủ là vector phần dư $\hat{\varepsilon} = y - X\hat{\beta}$ phải **trực giao với mọi cột của $X$**:

$$
X^\top (y - X\hat{\beta}) = 0 \iff X^\top X \hat{\beta} = X^\top y \implies \hat{\beta}_{\text{OLS}} = (X^\top X)^{-1} X^\top y
$$

Nhân trái $\hat{\beta}_{\text{OLS}}$ với $X$, ta thu được hai toán tử chiếu đối ngẫu chi phối toàn bộ kinh tế lượng tuyến tính — **ma trận chiếu mũ** (Projection Hat Matrix) $H$ lên $\mathcal{C}(X)$ và **ma trận phần bù triệt tiêu** (Residual Annihilator) $M_X$ chiếu lên $\mathcal{C}(X)^\perp$:

$$
\hat{y} = H y, \quad H = X(X^\top X)^{-1} X^\top; \qquad \hat{\varepsilon} = M_X y, \quad M_X = I_n - H
$$

**Bốn Tính chất Bất biến Phải Thuộc nằm lòng khi Phỏng vấn:**
1. **Đối xứng & Lũy đẳng** ($H^\top = H, \, H^2 = H$ và $M_X^\top = M_X, \, M_X^2 = M_X$): Chiếu một vector đã nằm sẵn trên mặt phẳng $\mathcal{C}(X)$ thêm lần nữa thì nó đứng yên: $H^2 = X(X^\top X)^{-1}(X^\top X)(X^\top X)^{-1}X^\top = H$. Hơn nữa $H M_X = H - H^2 = 0$, kéo theo định lý Pythagoras tổng bình phương $\|y\|_2^2 = \|Hy + M_X y\|_2^2 = \|\hat{y}\|_2^2 + \|\hat{\varepsilon}\|_2^2$.
2. **Phổ trị riêng nhị phân & Vết bằng số đặc trưng**: Từ $H q = \lambda q \implies \lambda q = H^2 q = \lambda^2 q$, mọi trị riêng của $H$ chỉ có thể thuộc $\{0, 1\}$. Dùng tính hoán vị vòng quanh của vết ma trận $\operatorname{tr}(AB) = \operatorname{tr}(BA)$:
   $$\operatorname{tr}(H) = \operatorname{tr}\!\left(X(X^\top X)^{-1}X^\top\right) = \operatorname{tr}\!\left((X^\top X)^{-1}X^\top X\right) = \operatorname{tr}(I_p) = p \implies \operatorname{tr}(M_X) = n - p$$
   Hệ quả trực tiếp: nếu $\mathbb{E}[\varepsilon] = 0, \operatorname{Cov}(\varepsilon) = \sigma^2 I_n$, vì $M_X X = 0$ nên $\hat{\varepsilon} = M_X(X\beta + \varepsilon) = M_X \varepsilon$, do đó $\mathbb{E}[\|\hat{\varepsilon}\|_2^2] = \mathbb{E}[\varepsilon^\top M_X \varepsilon] = \sigma^2 \operatorname{tr}(M_X) = (n - p)\sigma^2$, giải thích vì sao ước lượng phương sai không chệch phải chia cho $(n - p)$!
3. **Độ đòn bẩy điểm dữ liệu** $h_{ii} = x_i^\top (X^\top X)^{-1} x_i \in [0, 1]$: Vì $H = H^\top H$, phần tử đường chéo $h_{ii} = \sum_{j=1}^n h_{ij}^2 = h_{ii}^2 + \sum_{j \neq i} h_{ij}^2 \implies 0 \le h_{ii} \le 1$, và $\operatorname{Var}(\hat{\varepsilon}_i) = \sigma^2 (1 - h_{ii})$. Một cổ phiếu có đặc trưng cực đoan ($h_{ii} \to 1$) hút chặt mặt phẳng hồi quy đi qua chính nó, ép phần dư nội mẫu $\hat{\varepsilon}_i \to 0$ giả tạo!
4. **Định lý Gauss-Markov**: Dưới giả thiết $\mathbb{E}[\varepsilon \mid X] = 0$ và $\operatorname{Cov}(\varepsilon \mid X) = \sigma^2 I_n$ (không cần giả thiết chuẩn!), trong lớp mọi ước lượng tuyến tính không chệch $\tilde{\beta} = C y$ ($CX = I_p$), đặt $D = C - (X^\top X)^{-1}X^\top$ thì $DX = CX - I_p = 0$, suy ra $\operatorname{Cov}(\tilde{\beta} \mid X) = \sigma^2 \big[(X^\top X)^{-1} + D D^\top\big] \succeq \sigma^2 (X^\top X)^{-1} = \operatorname{Cov}(\hat{\beta}_{\text{OLS}} \mid X)$ theo thứ tự nửa xác định dương Loewner (`BLUE`).

### 2.2. Định lý Frisch-Waugh-Lovell: Nền tảng Toán học của Trung hòa Nhân tố

Trong nghiên cứu alpha chéo (như bạn sẽ lập trình ở Đồ án `CAP-01`), ta muốn kiểm tra sức mạnh dự báo riêng của nhóm tín hiệu mới $X_2 \in \mathbb{R}^{n \times p_2}$ sau khi đã loại bỏ ảnh hưởng của các nhân tố rủi ro đã biết $X_1 \in \mathbb{R}^{n \times p_1}$ (beta thị trường, quy mô vốn hóa, nhóm ngành GICS).

**Định lý 3.3 (Định lý Frisch-Waugh-Lovell — `FWL`).** *Xét hồi quy phân khối $y = X_1 \beta_1 + X_2 \beta_2 + \varepsilon$ với $X = [X_1 \;\; X_2]$ khả nghịch hạng cột. Gọi $M_1 = I_n - X_1(X_1^\top X_1)^{-1} X_1^\top$ là ma trận chiếu phần dư trực giao với $\mathcal{C}(X_1)$. Khi đó vector hệ số $\hat{\beta}_2$ và vector phần dư tổng thể $\hat{\varepsilon}$ từ hồi quy gộp toàn phần trùng khít tuyệt đối với nghiệm của hồi quy hai bước sau:*
1. *Trực giao hóa cả biến mục tiêu lẫn tín hiệu mới đối với $X_1$: $\tilde{y} = M_1 y$ và $\tilde{X}_2 = M_1 X_2$.*
2. *Hồi quy $\tilde{y}$ theo $\tilde{X}_2$: $\hat{\beta}_2 = (\tilde{X}_2^\top \tilde{X}_2)^{-1} \tilde{X}_2^\top \tilde{y} = (X_2^\top M_1 X_2)^{-1} X_2^\top M_1 y$.*

**Chứng minh Ngắn gọn & Sắc bén:**
Hệ phương trình chuẩn $X^\top(y - X_1\hat{\beta}_1 - X_2\hat{\beta}_2) = 0$ tách thành hai khối phương trình:
- Khối (1): $X_1^\top y = X_1^\top X_1 \hat{\beta}_1 + X_1^\top X_2 \hat{\beta}_2 \implies \hat{\beta}_1 = (X_1^\top X_1)^{-1} X_1^\top (y - X_2 \hat{\beta}_2)$.
- Khối (2): $X_2^\top(y - X_1\hat{\beta}_1 - X_2\hat{\beta}_2) = 0$.

Thế biểu thức của $\hat{\beta}_1$ từ Khối (1) vào Khối (2) và gom nhóm theo $M_1 = I_n - X_1(X_1^\top X_1)^{-1}X_1^\top$:

$$
X_2^\top \Big[ y - X_1(X_1^\top X_1)^{-1} X_1^\top (y - X_2 \hat{\beta}_2) - X_2 \hat{\beta}_2 \Big] = 0 \iff X_2^\top M_1 (y - X_2 \hat{\beta}_2) = 0
$$

Vì $M_1^\top M_1 = M_1$, phương trình trên viết lại thành $(M_1 X_2)^\top (M_1 y) = (M_1 X_2)^\top (M_1 X_2) \hat{\beta}_2$, cho ngay $\hat{\beta}_2 = (\tilde{X}_2^\top \tilde{X}_2)^{-1}\tilde{X}_2^\top \tilde{y}$. Cuối cùng, phần dư của hồi quy bước hai là $\tilde{y} - \tilde{X}_2\hat{\beta}_2 = M_1(y - X_2\hat{\beta}_2) = y - X_2\hat{\beta}_2 - X_1(X_1^\top X_1)^{-1}X_1^\top(y - X_2\hat{\beta}_2) = y - X_1\hat{\beta}_1 - X_2\hat{\beta}_2 = \hat{\varepsilon}$! $\blacksquare$

> [!IMPORTANT]
> **Chi tiết Sống còn Khi Trung hòa Alpha Thực tế:** Chú ý $M_1^\top M_1 = M_1$ nên tử số $\tilde{X}_2^\top \tilde{y} = X_2^\top M_1 y = \tilde{X}_2^\top y$! Nghĩa là nếu bạn **đã trực giao hóa tín hiệu** $\tilde{X}_2 = M_1 X_2$ đối với ngành và beta thị trường, thì hệ số góc $\hat{\beta}_2$ khi hồi quy lợi nhuận thô $y$ lên $\tilde{X}_2$ **bằng đúng** hệ số góc khi hồi quy cả hai biến đã khử nhân tố! Tuy nhiên, nếu bạn chỉ khử nhân tố ở $y$ ($\tilde{y} = M_1 y$) rồi đem hồi quy lên tín hiệu thô $X_2$ chưa trực giao hóa, mẫu số sẽ trở thành $(X_2^\top X_2)^{-1}$ thay vì $(X_2^\top M_1 X_2)^{-1}$ — làm **chệch giảm hệ số góc về 0** (Attenuation Bias) bất cứ khi nào $X_2$ tương quan với $X_1$!

---

## 3. Đa Cộng tuyến, Hồi quy Co rút Ridge & Chọn lọc Thưa LASSO

### 3.1. Giải phẫu Phổ Giá trị Kỳ dị của Ridge Regression

Khi bạn gộp $p = 150$ biến thể tín hiệu giá - khối lượng có độ tương quan cao vào cùng một ma trận $X$, ma trận $X^\top X$ trở nên suy biến gần kỳ dị. Viết phân rã giá trị kỳ dị $X = U D V^\top$ (với $U \in \mathbb{R}^{n \times p}$ có cột trực chuẩn $U^\top U = I_p$, $D = \operatorname{diag}(d_1, \dots, d_p)$ với $d_1 \ge \dots \ge d_p > 0$, và $V \in \mathbb{R}^{p \times p}$ trực giao). Khi đó phương sai hiệp phương sai của `OLS` bùng nổ theo nghịch đảo bình phương giá trị kỳ dị nhỏ nhất $d_p \to 0$:

$$
\hat{\beta}_{\text{OLS}} = \sum_{j=1}^p \frac{u_j^\top y}{d_j} v_j, \qquad \operatorname{tr}\big(\operatorname{Cov}(\hat{\beta}_{\text{OLS}})\big) = \sigma^2 \sum_{j=1}^p \frac{1}{d_j^2} \xrightarrow{d_p \to 0} +\infty
$$

**Hồi quy Ridge** (Tikhonov Regularization) cộng thêm hàm phạt chuẩn $\ell_2$ bình phương với siêu tham số $\lambda > 0$:

$$
\hat{\beta}_{\text{Ridge}}(\lambda) = \arg\min_{\beta \in \mathbb{R}^p} \Big\{ \|y - X\beta\|_2^2 + \lambda \|\beta\|_2^2 \Big\} = (X^\top X + \lambda I_p)^{-1} X^\top y
$$

Ba góc nhìn tương đương phải trình bày liền mạch trong phòng thi:
1. **Góc nhìn Đại số Lọc Phổ & Bậc tự do Hiệu dụng**: Thay $X = U D V^\top$ và $I_p = V V^\top$, ta có $(V D^2 V^\top + \lambda V V^\top)^{-1} V D U^\top y = V(D^2 + \lambda I_p)^{-1} D U^\top y$, tức là:

$$
\hat{\beta}_{\text{Ridge}}(\lambda) = \sum_{j=1}^p \underbrace{\left(\frac{d_j^2}{d_j^2 + \lambda}\right)}_{\text{Bộ lọc co rút } \in (0, 1)} \frac{u_j^\top y}{d_j} v_j, \qquad \operatorname{df}(\lambda) \triangleq \operatorname{tr}\big(H_\lambda\big) = \sum_{j=1}^p \frac{d_j^2}{d_j^2 + \lambda}
$$

   Các hướng thành phần chính mạnh ($d_j^2 \gg \lambda$) được giữ gần như nguyên vẹn ($\frac{d_j^2}{d_j^2 + \lambda} \approx 1$), trong khi các hướng đa cộng tuyến nhiễu ($d_j^2 \ll \lambda$) bị dập tắt trơn tru về $0$ thay vì chia cho $d_j \approx 0$!
2. **Góc nhìn Hậu nghiệm Cực đại Bayes** (Maximum A Posteriori — `MAP`): Đặt tiên nghiệm Gauss đẳng hướng $\beta \sim \mathcal{N}(0, \tau^2 I_p)$ kết hợp mô hình hợp lý $y \mid X, \beta \sim \mathcal{N}(X\beta, \sigma^2 I_n)$. Hậu nghiệm logarit trừ đi hằng số bằng $-\frac{1}{2\sigma^2}\|y - X\beta\|_2^2 - \frac{1}{2\tau^2}\|\beta\|_2^2$. Cực đại hóa hậu nghiệm chính là bài toán Ridge với $\lambda = \frac{\sigma^2}{\tau^2} = \frac{1}{\text{SNR}}$: **tỷ số tín hiệu trên nhiễu càng thấp, hệ số phạt $\lambda$ bắt buộc phải càng lớn!**
3. **Định lý Tồn tại Đánh đổi Chệch - Phương sai**: Vì $\operatorname{tr}\operatorname{Cov}\big(\hat{\beta}_{\text{Ridge}}(\lambda)\big) = \sigma^2 \sum_{j=1}^p \frac{d_j^2}{(d_j^2 + \lambda)^2}$, tại lân cận $\lambda \to 0^+$, độ chệch bình phương tăng bậc hai $\mathcal{O}(\lambda^2)$ trong khi phương sai giảm bậc nhất tuyến tính $-\mathcal{O}(\lambda)$ (cụ thể đạo hàm $\left.\frac{d}{d\lambda}\mathbb{E}\big[\|\hat{\beta}_{\text{Ridge}}(\lambda) - \beta\|_2^2\big]\right|_{\lambda = 0^+} = -2\sigma^2 \sum_{j=1}^p \frac{1}{d_j^4} < 0$). Do đó **luôn luôn tồn tại $\lambda > 0$** có tổng sai số bình phương trung bình nhỏ hơn `OLS` với mọi vector tham số thực $\beta$!

### 3.2. Đối chiếu Hình học Chuẩn $\ell_1$ (LASSO) với Chuẩn $\ell_2$ (Ridge) trong Low-SNR

**Hồi quy LASSO** thay chuẩn $\ell_2^2$ bằng chuẩn $\ell_1$ không khả vi tại $0$: $\min_\beta \frac{1}{2}\|y - X\beta\|_2^2 + \lambda \|\beta\|_1$. Với ma trận thiết kế trực chuẩn $X^\top X = I_p$ (đặt $\hat{\beta}^{\text{OLS}} = X^\top y$), bài toán tách rời theo từng tọa độ $\min_{\beta_j} \frac{1}{2}(\beta_j - \hat{\beta}_j^{\text{OLS}})^2 + \lambda |\beta_j|$. Xét dưới vi phân (Subdifferential) $\partial |\beta_j|$ bằng $\operatorname{sign}(\beta_j)$ khi $\beta_j \neq 0$ và đoạn $[-1, 1]$ khi $\beta_j = 0$, ta suy ra **toán tử ngưỡng mềm** (Soft-Thresholding Operator):

$$
\hat{\beta}_j^{\text{LASSO}}(\lambda) = \operatorname{sign}\big(\hat{\beta}_j^{\text{OLS}}\big) \max\!\left(\big|\hat{\beta}_j^{\text{OLS}}\big| - \lambda, \, 0\right)
$$

| Tiêu chí so sánh | Hồi quy Ridge — chuẩn $\ell_2^2$ | Hồi quy LASSO — chuẩn $\ell_1$ | Hệ quả Thực chiến Tổ hợp Alpha khi `SNR` thấp |
| :--- | :--- | :--- | :--- |
| **Miền ràng buộc hình học** | Quả cầu tròn trơn $\|\beta\|_2 \le t$ | Đa diện hình thoi có đỉnh nhọn $\|\beta\|_1 \le t$ | Mặt mức elip của hàm mất mát dễ chạm đỉnh nhọn trên trục tọa độ của $\ell_1$, triệt tiêu đúng $\beta_j = 0$. |
| **Ứng xử với 2 tín hiệu giống hệt nhau ($x_1 = x_2$)** | Chia đều trọng số $\hat{\beta}_1 = \hat{\beta}_2$ (giảm nửa phương sai danh mục!) | Chọn ngẫu nhiên bất định 1 biến, gán biến kia bằng $0$ | Trong tài chính, gộp trung bình nhiều tín hiệu yếu tương quan để khử nhiễu tốt hơn hẳn chọn đại 1 biến! |
| **Độ ổn định trọng số trượt theo thời gian** | Biến thiên liên tục Lipschitz theo dữ liệu $\implies$ vòng quay vốn thấp | Nhảy bậc chọn biến thất thường giữa các cửa sổ trượt $\implies$ phí giao dịch cao | Các quỹ định lượng thường ưu tiên **Ridge** hoặc **Elastic Net** ($\lambda_1 \|\beta\|_1 + \lambda_2 \|\beta\|_2^2$) thay vì LASSO thuần túy. |

---

## 4. Bình phương Tối thiểu Trọng số & Ma trận Hiệp phương sai Newey-West HAC

Khi giả thiết nhiễu cầu đồng nhất $\operatorname{Cov}(\varepsilon \mid X) = \sigma^2 I_n$ bị vi phạm bởi $\operatorname{Cov}(\varepsilon \mid X) = \Omega \neq \sigma^2 I_n$:
1. **Phương sai Thay đổi Chéo**: Trên lát cắt ngang cổ phiếu, cổ phiếu vốn hóa nhỏ biến động mạnh gấp 3–4 lần cổ phiếu vốn hóa lớn ($\Omega = \operatorname{diag}(\sigma_1^2, \dots, \sigma_n^2)$). Nhân tiền xử lý cả hai vế phương trình với $\Omega^{-1/2}$ khôi phục nhiễu chuẩn hóa đơn vị, cho nghiệm **Bình phương Tối thiểu Trọng số** (`WLS`): $\hat{\beta}_{\text{WLS}} = (X^\top \Omega^{-1} X)^{-1} X^\top \Omega^{-1} y$. Trong mô hình nhân tố rủi ro cổ phiếu chuẩn tổ chức như MSCI Barra, người ta đặt trọng số $w_i \propto \sqrt{\text{MarketCap}_i}$ hoặc $1/\hat{\sigma}_i^2$ để ngăn vài trăm mã siêu nhỏ làm lệch ước lượng lợi nhuận nhân tố ngành!
2. **Tự tương quan Chuỗi Thời gian do Nhãn Chồng lấp (Overlapping Returns) & Newey-West HAC**:
   Giả sử tại mỗi ngày $t = 1, \dots, T$, bạn đánh giá sức mạnh dự báo cho lợi nhuận tích lũy **$h$ ngày tới** $R_{t \to t+h} = \sum_{s=1}^h r_{t+s}$. Ngay cả khi cú sốc từng ngày $r_t$ độc lập hoàn toàn, hai quan sát liên tiếp $R_{t \to t+h}$ và $R_{t+1 \to t+1+h}$ dùng chung tới **$(h - 1)$ ngày giao dịch**! Do đó phần dư $\varepsilon_t$ tuân theo quá trình trung bình trượt bậc $(h - 1)$ có tự tương quan dương đậm đặc tới độ trễ $h - 1$. Nếu dùng sai số chuẩn `OLS` mặc định, phương sai thực của $\hat{\beta}$ bị đánh giá thấp đi xấp xỉ **$h$ lần**, tức thống kê $t$ bị **phóng đại ảo gấp $\approx \sqrt{h}$ lần** (với chân trời nắm giữ $h = 20$ ngày giao dịch, một nhiễu vô dụng có $t_{\text{true}} = 0.8$ sẽ hiện lên màn hình thành $t_{\text{naive}} \approx 0.8 \times \sqrt{20} \approx 3.58$)!

Công thức phương sai bánh kẹp tổng quát của $\hat{\beta}_{\text{OLS}}$ là $\operatorname{Cov}(\hat{\beta}_{\text{OLS}} \mid X) = (X^\top X)^{-1} (X^\top \Omega X) (X^\top X)^{-1}$. Đặt $g_t = x_t \hat{\varepsilon}_t \in \mathbb{R}^p$ và ma trận tự hiệp phương sai mẫu độ trễ $\ell$ là $\hat{\Gamma}_\ell = \frac{1}{T} \sum_{t = \ell + 1}^T g_t g_{t-\ell}^\top$. Nếu cộng thẳng $\hat{\Gamma}_0 + \sum_{\ell=1}^L (\hat{\Gamma}_\ell + \hat{\Gamma}_\ell^\top)$ (ước lượng Hansen-Hodrick cắt cụt chữ nhật), ma trận thu được ở mẫu hữu hạn **có thể nhận trị riêng âm** (vi phạm tính xác định nửa dương, cho căn bậc hai sai số chuẩn là số ảo!). Năm 1987, Whitney Newey và Kenneth West giải quyết triệt để bằng cách nhân **nhân tam giác Bartlett** giảm tuyến tính về $0$ cho ước lượng bền vững phương sai thay đổi và tự tương quan (Heteroskedasticity and Autocorrelation Consistent — `HAC`):

$$
\widehat{\operatorname{Cov}}_{\text{NW}}\big(\hat{\beta}_{\text{OLS}}\big) = (X^\top X)^{-1} \left( T \, \hat{S}_{\text{NW}} \right) (X^\top X)^{-1}, \qquad \hat{S}_{\text{NW}} = \hat{\Gamma}_0 + \sum_{\ell=1}^L \left(1 - \frac{\ell}{L + 1}\right)\big(\hat{\Gamma}_\ell + \hat{\Gamma}_\ell^\top\big)
$$

**Chứng minh Ngắn Vì sao Nhân Bartlett Đảm bảo Tính Xác định Nửa Dương Mọi Lúc:**
Với mọi vector thử $v \in \mathbb{R}^p$, đặt chuỗi vô hướng $z_t = v^\top g_t$ ($1 \le t \le T$, quy ước $z_t = 0$ ngoài $[1, T]$). Xét tổng bình phương không âm của các cửa sổ trượt độ dài $(L + 1)$:

$$
0 \le \frac{1}{T(L + 1)} \sum_{s = -L}^{T} \left( \sum_{j = 0}^L z_{s + j} \right)^2 = \frac{1}{T} \sum_{t=1}^T z_t^2 + \frac{2}{T} \sum_{\ell = 1}^L \left(1 - \frac{\ell}{L + 1}\right) \sum_{t = \ell + 1}^T z_t z_{t - \ell} = v^\top \hat{S}_{\text{NW}} v
$$

Vì chỉ có đúng $(L + 1 - \ell)$ cặp chỉ số $(j, j') \in \{0, \dots, L\}^2$ cách nhau khoảng cách $|j - j'| = \ell$, hệ số Bartlett $w_\ell = \frac{L + 1 - \ell}{L + 1} = 1 - \frac{\ell}{L + 1}$ xuất hiện tự nhiên từ bình phương của một tổng thực, đảm bảo $v^\top \hat{S}_{\text{NW}} v \ge 0$ tuyệt đối với mọi mẫu dữ liệu! Trong thực hành với nhãn lợi nhuận chồng lấp $h$ kỳ, bạn bắt buộc phải chọn độ trễ cắt $L \ge h - 1$ (hoặc theo quy tắc tiệm cận $L = \lfloor 4(T/100)^{2/9} \rfloor$ cho chuỗi tự tương quan tổng quát). $\blacksquare$

---

## 5. Ví dụ Phỏng vấn Thực chiến: Kiểm định Trung bình Lợi nhuận Chồng lấp 5 Ngày

**Đề bài (Phỏng vấn Vòng Nghiên cứu Alpha — Millennium / WorldQuant):**
Một chiến lược giao dịch nắm giữ cổ phiếu trong $h = 5$ ngày và tái cân bằng hàng ngày trên chuỗi $T = 250$ phiên giao dịch. Hồi quy chuỗi lợi nhuận 5 ngày chồng lấp $R_t^{(5)}$ lên hằng số $1$ ($X = \mathbf{1}_T$, ước lượng trung bình $\hat{\mu} = \bar{R}^{(5)} = 0.40\%$) cho tự hiệp phương sai phần dư mẫu $\hat{\gamma}_0 = 4.00$ ($\text{pct}^2$) và $\hat{\gamma}_\ell = \left(1 - \frac{\ell}{5}\right) \hat{\gamma}_0$ với $\ell \in \{1, 2, 3, 4\}$, $\hat{\gamma}_\ell = 0$ với $\ell \ge 5$.
1. Tính thống kê $t_{\text{OLS}}$ ngây thơ nếu bỏ qua tự tương quan.
2. Tính sai số chuẩn Newey-West với độ trễ $L = 4$ và thống kê $t_{\text{NW}}$ thực tế, đồng thời so sánh với phương sai lý thuyết chính xác khi không nhân giảm trọng số tam giác. Kết luận ý nghĩa thống kê ở mức $5\%$ có đổi chiều không?

**Lời giải Chi tiết:**
1. **Sai số chuẩn `OLS` ngây thơ:**
   $$\operatorname{SE}_{\text{OLS}}(\hat{\mu}) = \sqrt{\frac{\hat{\gamma}_0}{T}} = \sqrt{\frac{4.00}{250}} = \sqrt{0.016} \approx 0.1265\% \implies t_{\text{OLS}} = \frac{0.40\%}{0.1265\%} = \mathbf{3.16}$$
   Nhìn vào $t = 3.16 > 1.96$, người thiếu kinh nghiệm sẽ kết luận chiến lược có ý nghĩa thống kê cực cao ($p \approx 0.0016$)!
2. **Hiệu chỉnh Newey-West ($L = 4 \implies L + 1 = 5$):**
   Với mô hình chỉ có hệ số chặn $X = \mathbf{1}_T$, ta có $(X^\top X)^{-1} = 1/T$, $\hat{\Gamma}_\ell = \hat{\gamma}_\ell = 4.00 \left(1 - \frac{\ell}{5}\right)$ và trọng số Bartlett $w_\ell = 1 - \frac{\ell}{5}$:
   $$\hat{S}_{\text{NW}} = \hat{\gamma}_0 + 2 \sum_{\ell=1}^4 \left(1 - \frac{\ell}{5}\right) \hat{\gamma}_\ell = 4.00 \left[ 1 + 2 \sum_{\ell=1}^4 \left(1 - \frac{\ell}{5}\right)^2 \right]$$
   Tính tổng: $\sum_{\ell=1}^4 \left(\frac{5 - \ell}{5}\right)^2 = \frac{16 + 9 + 4 + 1}{25} = \frac{30}{25} = 1.20$. Suy ra:
   $$\hat{S}_{\text{NW}} = 4.00 \times [1 + 2(1.20)] = 4.00 \times 3.40 = 13.60$$
   $$\operatorname{SE}_{\text{NW}}(\hat{\mu}) = \sqrt{\frac{\hat{S}_{\text{NW}}}{T}} = \sqrt{\frac{13.60}{250}} = \sqrt{0.0544} \approx 0.2332\% \implies t_{\text{NW}} = \frac{0.40\%}{0.2332\%} = \mathbf{1.715}$$
   *Lưu ý đối chiếu:* Nếu tính tổng tự hiệp phương sai lý thuyết đầy đủ của quá trình $\text{MA}(4)$ không suy giảm trọng số: $1 + 2\sum_{\ell=1}^4 (1 - \ell/5) = 1 + 2(2.0) = 5.0 \implies \operatorname{SE}_{\text{exact}} = \sqrt{\frac{20}{250}} \approx 0.2828\%$ và $t_{\text{exact}} = \mathbf{1.414}$!
   Kết luận đảo chiều hoàn toàn: cả $t_{\text{NW}} = 1.715$ lẫn $t_{\text{exact}} = 1.414$ đều **không vượt qua ngưỡng $1.96$** ở mức ý nghĩa hai phía $5\%$! Thực chất $250$ phiên chồng lấp 5 ngày chỉ chứa tương đương $250 / 5 = 50$ chu kỳ nắm giữ độc lập!

---

## 6. Các Cạm bẫy Kinh tế lượng Thường gặp Khi Xây dựng Mô hình Alpha

> [!WARNING]
> **Ba Cạm bẫy Khiến Hồi quy Tuyến tính Thất bại Ngoài Mẫu:**
> 1. **Quên Chuẩn hóa Tỷ lệ Các Cột Trước Khi Chạy Ridge/LASSO:** Khác với `OLS` vốn bất biến khi nhân một đặc trưng $X_j$ với hằng số $c \neq 0$ (hệ số $\hat{\beta}_j$ tự chia cho $c$), nghiệm Ridge và LASSO **phụ thuộc trực tiếp vào đơn vị đo** của từng cột! Nếu cột $X_1$ tính theo tỷ số $P/E \sim 20$ còn cột $X_2$ tính theo lợi nhuận ngày $\sim 0.01$, hàm phạt $\lambda(\beta_1^2 + \beta_2^2)$ sẽ đè bẹp $\beta_2$ bất công. Bắt buộc phải chuẩn hóa điểm chuẩn hoặc chuẩn hóa hạng chéo về cùng phương sai đơn vị trên tập huấn luyện trước khi áp phạt!
> 2. **Phạt Nhầm Hệ số Chặn $\beta_0$ hoặc Phơi nhiễm Trung hòa Bắt buộc:** Không bao giờ đưa hệ số chặn $\beta_0$ vào chuẩn phạt $\lambda \sum_{j=1}^p \beta_j^2$ (nếu phạt cả $\beta_0$, dự báo sẽ phụ thuộc vào phép tịnh tiến gốc tọa độ của $y$). Tương tự, khi muốn trung hòa cứng beta thị trường/ngành trước rồi mới co rút alpha, hãy áp dụng Định lý `FWL` chiếu khử nhân tố rủi ro trước khi đưa tín hiệu vào Ridge!
> 3. **Hồi quy Gộp Panel Bỏ qua Tương quan Chéo Cùng Ngày (Cross-Sectional Dependence):** Sai số chuẩn Newey-West trên chuỗi thời gian chỉ xử lý tự tương quan dọc theo trục $t$ của một danh mục. Nếu bạn xếp chồng $N \times T$ dòng dữ liệu `(ngày, mã cổ phiếu)` vào một hồi quy gộp duy nhất mà chỉ bật `HAC` theo thời gian, các cú sốc chung toàn thị trường trong cùng một ngày $t$ sẽ làm nổ tung thống kê $t$; khi đó bắt buộc phải dùng hồi quy lát cắt từng kỳ **Fama-MacBeth** (kết hợp Newey-West lên chuỗi hệ số góc $\hat{\beta}_t$) hoặc gom cụm sai số chuẩn hai chiều theo cả ngày lẫn mã cổ phiếu!
