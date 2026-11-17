# M4.02 — Định luật Phổ Marchenko-Pastur, Lọc Nhiễu Ma trận Ngẫu nhiên & Làm co Ledoit-Wolf

## 1. Trực giác & Động lực: Lời nguyền Chiều cao Trong Tối ưu Danh mục Markowitz

Năm 1952, Harry Markowitz đặt nền móng cho lý thuyết danh mục hiện đại với công thức phân bổ trọng số tối ưu tỷ lệ với $\Sigma^{-1}\alpha$ (trong đó $\Sigma \in \mathbb{R}^{N \times N}$ là ma trận hiệp phương sai lợi nhuận của $N$ tài sản). Trên giấy bút học thuật khi $\Sigma$ được giả định là hằng số thiên phú đã biết trước, công thức này hoàn hảo không tì vết. Thế nhưng khi các kỹ sư định lượng mang ma trận hiệp phương sai mẫu $S = \frac{1}{T} X^\top X$ ước lượng từ cửa sổ lịch sử hữu hạn $T$ phiên giao dịch cắm thẳng vào bộ giải tối ưu hóa, danh mục thu được thường xuyên giao dịch cực đoan và sụp đổ ngoài mẫu — đến mức nhà kinh tế lượng Richard Michaud gọi tối ưu hóa trung bình - phương sai ngây thơ là **"Cỗ máy Cực đại hóa Sai số Ước lượng"**!

Nguyên nhân nằm ở toán học đếm bậc tự do trong chế độ chiều cao khi tỷ số khía cạnh $q = \frac{N}{T}$ không tiến về $0$:
- Ma trận đối xứng $S \in \mathbb{R}^{N \times N}$ đòi hỏi bạn phải ước lượng đồng thời $\frac{N(N + 1)}{2}$ tham số độc lập từ tổng cộng $N \times T$ điểm dữ liệu (trung bình mỗi hệ số hiệp phương sai chỉ có vỏn vẹn $\frac{2T}{N + 1} \approx \frac{2}{q}$ quan sát!).
- Với vũ trụ cổ phiếu S&P 500 ($N = 500$) ước lượng trên 2 năm dữ liệu ngày ($T = 500 \implies q = 1.0$), bạn phải ước lượng $125{,}250$ tham số từ $250{,}000$ con số — trung bình chưa tới $2$ điểm dữ liệu cho mỗi tham số!
- Tệ hơn nữa, nếu bạn rút ngắn cửa sổ xuống 1 năm ($T = 252 < N = 500 \implies q \approx 1.98 > 1$) để bám sát biến động thị trường gần nhất, hạng đại số thỏa mãn $\operatorname{rank}(S) \le T - 1 = 251 < 500$: ma trận $S$ chắc chắn có tối thiểu **$500 - 251 = 249$ trị riêng bằng đúng số $0$**, khiến $S$ suy biến không thể nghịch đảo!

**Lý thuyết Ma trận Ngẫu nhiên** (Random Matrix Theory) — viết tắt là `RMT`, khởi nguồn từ vật lý hạt nhân năng lượng cao của Eugene Wigner và hoàn thiện bởi Vladimir Marchenko cùng Leonid Pastur năm 1967 — cho phép ta tính chính xác ranh giới giữa "nhiễu hữu hạn mẫu" và "nhân tố rủi ro thật sự", đồng thời dẫn dắt tới các bộ làm co hiệp phương sai hiện đại đang chạy hàng ngày bên trong mọi hệ thống danh mục tổ chức.

---

## 2. Định luật Phổ Marchenko-Pastur cho Ma trận Hiệp phương sai Nhiễu Thuần túy

Xét trường hợp chuẩn đối chứng hoàn toàn không có bất kỳ mối liên hệ nào giữa các tài sản: ma trận dữ liệu $X \in \mathbb{R}^{T \times N}$ gồm các biến ngẫu nhiên độc lập cùng phân phối có kỳ vọng $0$, phương sai thực $\sigma^2 > 0$ và mô-men bậc bốn hữu hạn, tức ma trận hiệp phương sai quần thể thực sự là ma trận cầu $\Sigma_{\text{true}} = \sigma^2 I_N$ (mọi trị riêng thực đều bằng đúng $\sigma^2$).

Ta lập ma trận hiệp phương sai mẫu $S = \frac{1}{T} X^\top X \in \mathbb{R}^{N \times N}$ có các trị riêng $\hat{\lambda}_1 \ge \hat{\lambda}_2 \ge \dots \ge \hat{\lambda}_N \ge 0$. Trong thống kê cổ điển chiều thấp ($N$ cố định, $T \to \infty \implies q = N/T \to 0$), Luật Số Lớn đảm bảo $S \to \sigma^2 I_N$ nên cả $N$ trị riêng chụm khít tại $\sigma^2$. Ngược lại, trong **giới hạn tiệm cận chiều cao Kolmogorov** khi cả $N \to \infty$ và $T \to \infty$ đồng thời sao cho tỷ số $\frac{N}{T} \to q \in (0, \infty)$ giữ cố định, phổ trị riêng không hề hội tụ về $\sigma^2$ mà giãn nở thành một phân phối liên tục xác định!

**Định lý 4.4 (Định luật Phổ Marchenko-Pastur — `MP`).** *Khi $N, T \to \infty$ với $N/T \to q > 0$, phân phối phổ thực nghiệm $\hat{\mu}_N(\lambda) = \frac{1}{N}\sum_{i=1}^N \delta_{\hat{\lambda}_i}(\lambda)$ của $S = \frac{1}{T} X^\top X$ hội tụ yếu hầu chắc chắn tới phân phối có mật độ:*

$$
f_{\text{MP}}(\lambda) = \frac{1}{2\pi \sigma^2 q \lambda} \sqrt{(\lambda_+ - \lambda)(\lambda - \lambda_-)} \, \mathbb{I}_{[\lambda_-, \, \lambda_+]}(\lambda) + \max\!\left(0, \, 1 - \frac{1}{q}\right) \delta_0(\lambda)
$$

*trong đó biên dưới $\lambda_-$ và biên trên $\lambda_+$ của dải phổ nhiễu được xác định chính xác bởi:*

$$
\lambda_- = \sigma^2 \left(1 - \sqrt{q}\right)^2 = \sigma^2 \left(1 - \sqrt{\frac{N}{T}}\right)^2, \qquad \lambda_+ = \sigma^2 \left(1 + \sqrt{q}\right)^2 = \sigma^2 \left(1 + \sqrt{\frac{N}{T}}\right)^2
$$

Hãy kiểm tra bốn hệ quả trực quan sống còn của công thức biên $\lambda_{\pm} = \sigma^2 (1 \pm \sqrt{q})^2$ (chuẩn hóa cho ma trận tương quan có $\sigma^2 = 1$):
1. **Khi $q \to 0$ ($T \gg N$):** Cả $\lambda_-$ lẫn $\lambda_+$ ép sát về $1$, mật độ co lại thành xung Dirac tại $\lambda = 1$ — khôi phục tính vững cổ điển.
2. **Khi $q = 0.5$ ($N = 500$ cổ phiếu, $T = 1{,}000$ ngày):** Dù mọi cổ phiếu độc lập 100%, trị riêng mẫu trải rộng từ $\lambda_- = (1 - \sqrt{0.5})^2 \approx \mathbf{0.0858}$ lên tới $\lambda_+ = (1 + \sqrt{0.5})^2 \approx \mathbf{2.9142}$! Số điều kiện $\kappa(S) = \lambda_+ / \lambda_- \approx \mathbf{34.0}$ xuất hiện hoàn toàn từ ảo giác mẫu hữu hạn!
3. **Khi $q \to 1^-$ ($N = T$):** Biên dưới chạm đáy $\lambda_- = 0$ trong khi $\lambda_+ = 4\sigma^2$, khiến $\kappa(S) \to +\infty$! Khi $q > 1$ ($N > T$), xuất hiện khối xác suất điểm nguyên tử tỷ trọng $\left(1 - \frac{1}{q}\right) = \frac{N - T}{N}$ nằm chết cứng tại $\lambda = 0$.
4. **Khám phá Thực nghiệm S&P 500 của Laloux, Cizeau, Bouchaud & Potters (1999):** Khi vẽ biểu đồ tần suất trị riêng của ma trận tương quan thực nghiệm $N = 406$ mã S&P 500 trên $T = 1{,}309$ ngày ($q \approx 0.31$), các tác giả phát hiện **tới $94\%$ tổng số trị riêng nằm gọn bên trong ranh giới lý thuyết $[\lambda_-, \lambda_+]$ của nhiễu ngẫu nhiên thuần túy**! Chỉ có khoảng $6\%$ trị riêng lớn nhất — đứng đầu là $\hat{\lambda}_1 \approx 25 \gg \lambda_+$ của chế độ thị trường và khoảng $15\text{–}20$ trị riêng ngành — vọt hẳn ra ngoài biên phải $\lambda_+$ là mang thông tin kinh tế thực sự!

### 2.1. Chứng minh Nhanh Phương sai Phổ Nhiễu $\operatorname{Var}_{\text{MP}}(\lambda) = q \sigma^4$ Qua Vết Ma trận

Trong phỏng vấn trực tiếp tại Two Sigma hay Citadel, người phỏng vấn thường hỏi: *"Không cần nhớ hàm mật độ căn thức phức tạp của Marchenko-Pastur, hãy chứng minh từ đại số vết ma trận rằng phương sai phân tán của các trị riêng mẫu quanh $\sigma^2$ tỷ lệ thuận chính xác với $q = N / T$!"*

**Chứng minh Bốn Dòng Bằng Đại số Vết:**
Với $S = \frac{1}{T} X^\top X$ trong đó $X_{t,i} \stackrel{\text{iid}}{\sim} (0, \sigma^2)$:
1. *Mô-men phổ bậc nhất:* Kỳ vọng trung bình các trị riêng là $\frac{1}{N}\mathbb{E}[\operatorname{tr}(S)] = \frac{1}{N}\sum_{i=1}^N \mathbb{E}[S_{ii}] = \sigma^2$.
2. *Mô-men phổ bậc hai:* Ta có $\operatorname{tr}(S^2) = \sum_{i=1}^N \hat{\lambda}_i^2 = \sum_{i=1}^N S_{ii}^2 + \sum_{i \neq j} S_{ij}^2$:
   - Trên đường chéo ($N$ phần tử): $S_{ii} = \frac{1}{T}\sum_{t=1}^T X_{t,i}^2$ có $\mathbb{E}[S_{ii}^2] = \big(\mathbb{E}[S_{ii}]\big)^2 + \operatorname{Var}(S_{ii}) = \sigma^4 + \mathcal{O}(1/T)$.
   - Ngoài đường chéo ($N(N - 1)$ phần tử với $i \neq j$): vì cột $i$ độc lập với cột $j$, biến $S_{ij} = \frac{1}{T}\sum_{t=1}^T X_{t,i} X_{t,j}$ có kỳ vọng $0$ và phương sai $\mathbb{E}[S_{ij}^2] = \frac{1}{T^2}\sum_{t=1}^T \mathbb{E}[X_{t,i}^2]\mathbb{E}[X_{t,j}^2] = \frac{\sigma^4}{T}$!

Cộng toàn bộ $N$ phần tử đường chéo và $N(N - 1)$ phần tử ngoài đường chéo rồi chia cho $N$:

$$
\frac{1}{N}\mathbb{E}\!\left[\sum_{i=1}^N \hat{\lambda}_i^2\right] = \frac{1}{N}\left[ N\sigma^4 + N(N - 1)\frac{\sigma^4}{T} + \mathcal{O}\!\left(\frac{N}{T}\right) \right] \xrightarrow{N/T \to q} (1 + q)\sigma^4
$$

Trừ đi bình phương mô-men bậc nhất $(\sigma^2)^2 = \sigma^4$, ta thu được ngay phương sai của phổ trị riêng nhiễu: **$\operatorname{Var}_{\text{MP}}(\lambda) = (1 + q)\sigma^4 - \sigma^4 = q\sigma^4 = \frac{N}{T}\sigma^4$**! Chính hàng trăm ngàn sai số hiệp phương sai ngoài đường chéo nhỏ li ti cỡ $1/\sqrt{T}$ đã tích tụ thành độ lệch phổ vĩ mô $q\sigma^4$ không hề biến mất! $\blacksquare$

> [!NOTE]
> **Hiệu chỉnh Phương sai Nhiễu Hiệu dụng $\sigma_{\text{eff}}^2$ Khi Áp Ngưỡng $\lambda_+$ Lên Dữ liệu Thực:**
> Trên ma trận tương quan cổ phiếu thực ($\operatorname{tr}(\hat{C}) = N$), vì riêng trị riêng thị trường $\hat{\lambda}_1$ và $K - 1$ trị riêng ngành đã chiếm mất tỷ trọng phương sai đáng kể $\frac{1}{N}\sum_{k=1}^K \hat{\lambda}_k$ (thường từ $35\%$ đến $50\%$), phần phương sai còn lại dành cho $(N - K)$ chế độ nhiễu không còn là $\sigma^2 = 1$ nữa, mà giảm xuống còn **$\sigma_{\text{eff}}^2 = 1 - \frac{1}{N}\sum_{k=1}^K \hat{\lambda}_k$**! Trong nghiên cứu chuẩn tại quỹ Capital Fund Management — `CFM`, người ta luôn nhân biên nhiễu lý thuyết với hệ số hiệu chỉnh này: $\lambda_+^{\text{eff}} = \sigma_{\text{eff}}^2 (1 + \sqrt{q})^2$.

---

## 3. Giải phẫu Sự Sụp đổ của $\hat{\Sigma}^{-1}$ trong Tối ưu Hóa Danh mục

Tại sao sự giãn nở phổ xuống sát $\lambda_- \to 0$ lại giết chết danh mục Markowitz? Viết phân rã phổ cho ma trận hiệp phương sai mẫu $S = \sum_{i=1}^N \hat{\lambda}_i \hat{q}_i \hat{q}_i^\top$, khi đó ma trận nghịch đảo đảo ngược hoàn toàn vai trò lớn nhỏ của các trị riêng:

$$
S^{-1} = \sum_{i=1}^N \frac{1}{\hat{\lambda}_i} \hat{q}_i \hat{q}_i^\top
$$

Xét bài toán **Danh mục Phương sai Tối thiểu Toàn cục** (Global Minimum Variance — `GMV`): $\min_w w^\top S w$ với ràng buộc đầu tư đầy đủ $\mathbf{1}^\top w = 1$, có nghiệm đóng $\hat{w}_{\text{GMV}} = \frac{S^{-1} \mathbf{1}}{\mathbf{1}^\top S^{-1} \mathbf{1}} \propto \sum_{i=1}^N \frac{\hat{q}_i^\top \mathbf{1}}{\hat{\lambda}_i} \hat{q}_i$ (hoặc nghiệm tối ưu tổng quát $\hat{w}^\star \propto \sum_{i=1}^N \frac{\hat{q}_i^\top \alpha}{\hat{\lambda}_i} \hat{q}_i$).

Hãy nhìn vào mẫu số $\frac{1}{\hat{\lambda}_i}$:
- Thành phần thị trường và ngành được ước lượng chính xác nhất ($\hat{\lambda}_1$ rất lớn) lại nhận hệ số $1/\hat{\lambda}_1 \approx 0$.
- Ngược lại, các tổ hợp danh mục nằm ở cuối phổ ($\hat{q}_N, \hat{q}_{N-1}$) có $\hat{\lambda}_N \approx \sigma^2(1 - \sqrt{q})^2 \to 0$ lại bị nhân phóng đại bởi $\frac{1}{\hat{\lambda}_N} \to +\infty$! Mà theo Định luật `MP`, các vector $\hat{q}_N$ đó **100% là những tổ hợp mua - bán tình cờ triệt tiêu biến động của nhau trong quá khứ chỉ do ngẫu nhiên trùng hợp**! Bộ tối ưu lầm tưởng nó vừa tìm được "mỏ vàng chênh lệch giá không rủi ro", dồn đòn bẩy khổng lồ vào đúng các hướng nhiễu tệ hại nhất!

**Mệnh đề 4.1 (Độ Lệch Đánh giá Thấp Rủi ro Ngoài mẫu dưới Phân phối Wishart).** *Nếu lợi nhuận độc lập chuẩn $R_t \stackrel{\text{iid}}{\sim} \mathcal{N}_N(\mu, \Sigma)$ với $T > N + 2$ và bạn tối ưu $\hat{w}_{\text{GMV}}$ trên ma trận hiệp phương sai mẫu đã trừ trung bình $S$ ($T - 1$ bậc tự do), thì kỳ vọng phương sai báo cáo trong mẫu $\sigma_{\text{IS}}^2 = \mathbb{E}\big[\hat{w}_{\text{GMV}}^\top S \hat{w}_{\text{GMV}}\big]$ và phương sai thực tế ngoài mẫu $\sigma_{\text{OOS}}^2 = \mathbb{E}\big[\hat{w}_{\text{GMV}}^\top \Sigma \hat{w}_{\text{GMV}}\big]$ so với mức tối ưu lý thuyết $\sigma_\star^2 = (\mathbf{1}^\top \Sigma^{-1} \mathbf{1})^{-1}$ bằng chính xác:*

$$
\mathbb{E}\big[\hat{w}_{\text{GMV}}^\top S \hat{w}_{\text{GMV}}\big] = \frac{T - N}{T - 1}\,\sigma_\star^2 \approx (1 - q)\,\sigma_\star^2, \qquad \mathbb{E}\big[\hat{w}_{\text{GMV}}^\top \Sigma \hat{w}_{\text{GMV}}\big] = \frac{T - 2}{T - N - 1}\,\sigma_\star^2 \approx \frac{1}{1 - q}\,\sigma_\star^2
$$

*Hệ quả chấn động:* Kiểm tra biên $N = 1$ cho thấy cả hai vế trả về đúng $\sigma_\star^2$; nhưng với $N = 300$ cổ phiếu trên $T = 400$ ngày ($q = 0.75$), báo cáo kiểm thử trong mẫu khoe khoang rủi ro danh mục chỉ bằng $\frac{100}{399} \approx 25.1\%$ mức chuẩn, trong khi rủi ro thực tế ngày mai ngoài mẫu vọt lên $\frac{398}{99} \approx \mathbf{402.0\%}$ mức tối ưu — tức **sai lệch gấp $16$ lần** giữa phương sai ngoài mẫu và phương sai trong mẫu!

---

## 4. Cắt gọt Phổ RMT & Ước lượng Làm co Tuyến tính Tối ưu Ledoit-Wolf

Để khử độc $S$ trước khi nghịch đảo, hai trường phái chính quy hóa phổ được áp dụng rộng rãi nhất tại các quỹ định lượng là:

### 4.1. Phương pháp Cắt gọt Trị riêng Bảo toàn Vết (Eigenvalue Clipping — Laloux-Bouchaud-Potters)

Trên ma trận tương quan thực nghiệm $\hat{C} = \sum_{i=1}^N \hat{\lambda}_i \hat{v}_i \hat{v}_i^\top$:
1. Giữ nguyên toàn bộ $K$ trị riêng tín hiệu vượt trên biên nhiễu Marchenko-Pastur ($\hat{\lambda}_1 \ge \dots \ge \hat{\lambda}_K > \lambda_+^{\text{eff}}$).
2. Gom toàn bộ $(N - K)$ trị riêng rơi bên trong dải nhiễu $\le \lambda_+^{\text{eff}}$ thay bằng **cùng một hằng số trung bình $\bar{\lambda}_{\text{bulk}}$** sao cho tổng vết ma trận $\operatorname{tr}(\hat{C}_{\text{RMT}}) = N$ được bảo toàn nguyên vẹn (sau đó chuẩn hóa nhẹ đường chéo về $1$ và nhân trả lại độ biến động $D_\sigma \hat{C}_{\text{RMT}} D_\sigma$):

$$
\hat{\lambda}_i^{\text{RMT}} = \begin{cases} \hat{\lambda}_i, & \text{nếu } 1 \le i \le K \;\; (\hat{\lambda}_i > \lambda_+^{\text{eff}}) \\[6pt] \bar{\lambda}_{\text{bulk}} = \dfrac{1}{N - K} \sum_{j = K + 1}^N \hat{\lambda}_j, & \text{nếu } K + 1 \le i \le N \end{cases}
$$

Thao tác này xóa sạch hoàn toàn các mẫu số $\hat{\lambda}_N \approx 0$ nguy hiểm mà không cần dùng thêm bất kỳ siêu tham số tùy ý nào!

### 4.2. Chứng minh Làm co Tuyến tính Tối ưu Ledoit-Wolf

Olivier Ledoit và Michael Wolf (2004) tiếp cận từ góc nhìn tối ưu hóa lồi hình học trực tiếp trên không gian ma trận đối xứng với tích vô hướng Frobenius $\langle A, B \rangle_F = \operatorname{tr}(A^\top B)$ và chuẩn $\|A\|_F^2 = \operatorname{tr}(A^\top A) = \sum_{i,j} A_{ij}^2$ — bằng tổng bình phương các trị riêng đối với ma trận đối xứng.

Ta tìm tổ hợp lồi tuyến tính giữa ma trận hiệp phương sai mẫu không chệch nhưng phương sai cao $S$ ($\mathbb{E}[S] = \Sigma$) và **mục tiêu co rút có cấu trúc cầu** $F = \mu I_N$ có phương sai thấp:

$$
\Sigma^\star = (1 - \delta) S + \delta \mu I_N, \qquad \delta \in [0, 1]
$$

nhằm cực tiểu hóa hàm rủi ro bình phương chuẩn Frobenius kỳ vọng $\mathcal{R}(\mu, \delta) = \mathbb{E}\big[\|\Sigma^\star - \Sigma\|_F^2\big]$.

**Chứng minh Từng Bước Công thức Cường độ Co rút Tối ưu $\delta^\star$:**
1. *Tìm tâm cầu tối ưu $\mu^\star$:* Viết $\Sigma^\star - \Sigma = (1 - \delta)(S - \Sigma) + \delta(\mu I_N - \Sigma)$. Vì $\mathbb{E}[S - \Sigma] = 0$, tích chéo kỳ vọng $\mathbb{E}\big[\langle S - \Sigma, \, \mu I_N - \Sigma \rangle_F\big] = \langle \mathbb{E}[S - \Sigma], \, \mu I_N - \Sigma \rangle_F = 0$ triệt tiêu hoàn toàn! Do đó định lý Pythagoras trong không gian Hilbert cho ta:

$$
\mathbb{E}\Big[\big\|\Sigma^\star - \Sigma\big\|_F^2\Big] = (1 - \delta)^2 \, \mathbb{E}\big[\|S - \Sigma\|_F^2\big] + \delta^2 \, \big\|\mu I_N - \Sigma\big\|_F^2
$$

   Đạo hàm số hạng thứ hai $\|\mu I_N - \Sigma\|_F^2 = \operatorname{tr}\big((\mu I_N - \Sigma)^2\big) = N\mu^2 - 2\mu\operatorname{tr}(\Sigma) + \operatorname{tr}(\Sigma^2)$ theo $\mu$ và cho bằng $0$ được ngay tâm tối ưu không phụ thuộc vào $\delta$: **$\mu^\star = \frac{1}{N}\operatorname{tr}(\Sigma) = \frac{1}{N}\sum_{i=1}^N \lambda_i(\Sigma)$** (ước lượng không chệch tự nhiên từ mẫu là trung bình các trị riêng mẫu $\hat{\mu} = \frac{1}{N}\operatorname{tr}(S)$!).
2. *Tìm cường độ làm co tối ưu $\delta^\star$:* Đặt hai hằng số bất biến bậc hai theo đúng ký hiệu bài báo gốc:
   - $\beta^2 \triangleq \mathbb{E}\big[\|S - \Sigma\|_F^2\big]$ (tổng phương sai sai số ước lượng của $S$).
   - $\alpha^2 \triangleq \|\Sigma - \mu^\star I_N\|_F^2$ (độ lệch cấu trúc thực sự của $\Sigma$ so với mặt cầu đẳng hướng).
   - $\gamma^2 \triangleq \mathbb{E}\big[\|S - \mu^\star I_N\|_F^2\big]$. Khai triển $S - \mu^\star I_N = (S - \Sigma) + (\Sigma - \mu^\star I_N)$ và dùng lại $\mathbb{E}[S - \Sigma] = 0$, ta thu được **Đẳng thức Tam giác Vuông Bất biến Ledoit-Wolf**: **$\gamma^2 = \beta^2 + \alpha^2$**!

   Cực tiểu hóa hàm bậc hai $(1 - \delta)^2 \beta^2 + \delta^2 \alpha^2$ theo $\delta$ bằng đạo hàm $-2(1 - \delta)\beta^2 + 2\delta \alpha^2 = 0$:

$$
\delta^\star = \frac{\beta^2}{\beta^2 + \alpha^2} = \frac{\beta^2}{\gamma^2} = \frac{\mathbb{E}\big[\|S - \Sigma\|_F^2\big]}{\mathbb{E}\big[\|S - \mu^\star I_N\|_F^2\big]} \in [0, 1]
$$

Hãy chiêm ngưỡng sự thanh thoát của nghiệm $\delta^\star$:
- Vì $S$ và $I_N$ có chung mọi hệ vector riêng ($\hat{q}_i$), ma trận làm co **giữ nguyên các hướng vector riêng $\hat{q}_i$ nhưng kéo toàn bộ các trị riêng về tâm $\hat{\mu}$**: $\lambda_i^{\text{LW}} = (1 - \hat{\delta}^\star)\hat{\lambda}_i + \hat{\delta}^\star \hat{\mu}$!
- Trị riêng quá lớn ở đỉnh bị kéo thấp xuống; trị riêng bằng $0$ (ngay cả khi $N = 2{,}000 > T = 250$!) lập tức được nâng lên tối thiểu bằng sàn dương chặt $\hat{\delta}^\star \hat{\mu} > 0$, đảm bảo $\Sigma_{\text{LW}}$ **luôn khả nghịch xác định dương nghiêm ngặt** với số điều kiện bị chặn cứng $\kappa(\Sigma_{\text{LW}}) \le \frac{(1 - \hat{\delta}^\star)\hat{\lambda}_1 + \hat{\delta}^\star \hat{\mu}}{\hat{\delta}^\star \hat{\mu}} < \infty$!
- Trong giới hạn mẫu lớn $T \to \infty$ ($N$ cố định), tử số $\beta^2 = \mathcal{O}(1/T) \to 0$ nên $\hat{\delta}^\star \to 0$ (tự động nhường quyền cho $S$); ngược lại khi dữ liệu quá ít ỏi hoặc nhiễu cực lớn ($\beta^2 \approx \gamma^2$), $\hat{\delta}^\star \to 1$ tự động co mạnh về ma trận cầu an toàn! $\blacksquare$

> [!IMPORTANT]
> **Thực hành Trực tiếp trên Phòng Thí nghiệm Phổ Ma trận Ngẫu nhiên (`sim-rmt`) Ngay Bên Dưới:**
> Ngay bên dưới trang bài giảng này, giao diện ứng dụng đã gắn sẵn trình mô phỏng tương tác **Phổ Trị riêng Marchenko-Pastur & Làm co Hiệp phương sai Ledoit-Wolf**. Bạn hãy trực tiếp kéo các thanh trượt để kiểm nghiệm toán học bằng mắt thường:
> 1. Tăng tỷ số chiều $q = N / T$ từ $0.10$ lên sát $0.95$: quan sát đường cong lý thuyết vòm `MP` loang rộng ra hai phía và trị riêng nhỏ nhất $\hat{\lambda}_{\min}$ lao dốc thẳng về $0$, kéo theo số điều kiện $\kappa(S)$ và sai số danh mục ngoài mẫu bùng nổ phi tuyến.
> 2. Thêm các nhân tố thị trường và ngành có cường độ thực dương để thấy các gai trị riêng tách hẳn ra khỏi biên phải $\lambda_+ = \sigma^2(1 + \sqrt{q})^2$ trong khi phần thân nhiễu vẫn tuân thủ vòm lý thuyết.
> 3. Bật chế độ làm co Ledoit-Wolf và thay đổi hệ số $\delta$ để quan sát cách các trị riêng đuôi sát $0$ được nâng bổng lên sàn an toàn, dập tắt hoàn toàn hiện tượng phóng đại sai số của $S^{-1}$.

---

## 5. Ví dụ Phỏng vấn Thực chiến: Lọc Phổ & Ghim Số Điều kiện Danh mục

**Đề bài (Phỏng vấn Nghiên cứu Danh mục — Two Sigma / Squarepoint Capital):**
Bạn ước lượng ma trận tương quan thực nghiệm $\hat{C}$ của $N = 400$ cổ phiếu Mỹ từ $T = 1{,}600$ phiên giao dịch ngày. Ba trị riêng lớn nhất thu được là $\hat{\lambda}_1 = 100.0$, $\hat{\lambda}_2 = 16.0$, $\hat{\lambda}_3 = 8.0$, còn trị riêng nhỏ nhất là $\hat{\lambda}_{400} = 0.08$.
1. Tính tỷ số $q$, ranh giới phổ nhiễu Marchenko-Pastur chưa hiệu chỉnh $[\lambda_-, \lambda_+]$, và ranh giới biên phải đã hiệu chỉnh $\lambda_+^{\text{eff}}$ sau khi trừ tỷ trọng phương sai của 3 nhân tố đứng đầu.
2. Nếu áp dụng làm co tuyến tính $\hat{C}_{\text{LW}} = (1 - \delta)\hat{C} + \delta I_{400}$ với cường độ ước lượng $\delta = 0.20$, số điều kiện $\kappa$ của ma trận giảm đi bao nhiêu lần so với $\hat{C}$ gốc?

**Lời giải Chi tiết:**
1. **Tính ranh giới phổ `MP`:**
   - Ta có $q = \frac{N}{T} = \frac{400}{1600} = 0.25 \implies \sqrt{q} = 0.50$.
   - Với $\sigma^2 = 1$ (chưa hiệu chỉnh): $\lambda_- = (1 - 0.50)^2 = \mathbf{0.25}$ và $\lambda_+ = (1 + 0.50)^2 = \mathbf{2.25}$. (Chú ý $\hat{\lambda}_{400} = 0.08$ còn thấp hơn cả $0.25$ chính bởi vì 3 trị riêng đầu đã hút bớt phương sai của phần thân!).
   - Tính phương sai nhiễu hiệu dụng sau khi tách 3 nhân tố lớn ($\sum_{k=1}^3 \hat{\lambda}_k = 100 + 16 + 8 = 124$ trên tổng vết $N = 400$):
     $$\sigma_{\text{eff}}^2 = 1 - \frac{124}{400} = 1 - 0.31 = 0.69$$
     Suy ra biên nhiễu hiệu chỉnh chính xác là $\lambda_-^{\text{eff}} = 0.69 \times 0.25 = \mathbf{0.1725}$ và $\lambda_+^{\text{eff}} = 0.69 \times 2.25 = \mathbf{1.5525}$! Mọi trị riêng vượt trên $1.5525$ đều là tín hiệu cấu trúc có ý nghĩa.
2. **Đánh giá độ ổn định số điều kiện $\kappa = \lambda_{\max} / \lambda_{\min}$:**
   - Trên ma trận mẫu gốc $\hat{C}$: $\kappa(\hat{C}) = \frac{100.0}{0.08} = \mathbf{1{,}250.0}$.
   - Sau khi làm co Ledoit-Wolf với $\delta = 0.20$ về tâm $\hat{\mu} = \frac{1}{400}\operatorname{tr}(\hat{C}) = 1.0$:
     - Trị riêng lớn nhất mới: $\lambda_1^{\text{LW}} = 0.80(100.0) + 0.20(1.0) = 80.20$.
     - Trị riêng nhỏ nhất mới: $\lambda_{400}^{\text{LW}} = 0.80(0.08) + 0.20(1.0) = 0.064 + 0.200 = 0.264$.
     - Số điều kiện mới giảm sập xuống còn $\kappa(\hat{C}_{\text{LW}}) = \frac{80.20}{0.264} \approx \mathbf{303.8}$ — cải thiện độ ổn định nghịch đảo hơn **$4.1$ lần** chỉ bằng một phép biến đổi lồi đơn giản!

---

## 6. Các Bẫy Thực nghiệm Khi Ứng dụng RMT và Làm co Hiệp phương sai

> [!WARNING]
> **Ba Bẫy Nguy hiểm Khi Áp dụng Marchenko-Pastur Lên Chuỗi Thời gian Thực:**
> 1. **Tự tương quan Thời gian và Phân cụm Biến động Làm Giãn Rộng Biên $\lambda_+$:** Định lý `MP` nguyên bản giả định $T$ hàng quan sát độc lập hoàn toàn và có phương sai không đổi theo thời gian. Trên dữ liệu tài chính thực có phân cụm biến động `GARCH` hoặc trung bình trượt chồng lấp, cỡ mẫu độc lập hiệu dụng $T_{\text{eff}} < T$ nhỏ hơn số dòng thực tế, đẩy tỷ số $q_{\text{eff}} = N / T_{\text{eff}}$ tăng lên và làm vòm phổ nhiễu phình rộng kèm đuôi dày hơn công thức $(1 + \sqrt{N/T})^2$! Nếu không chuẩn hóa biến động chuỗi thời gian trước (khử `GARCH` cho từng mã), bạn sẽ nhận nhầm nhiều trị riêng nhiễu sát biên phải thành nhân tố thật.
> 2. **Giao dịch Không Đồng bộ (`Epps Effect`) Ở Tần suất Trong Ngày:** Khi ước lượng tương quan trên thanh $1$ phút hoặc $5$ phút giữa cổ phiếu thanh khoản cao và cổ phiếu khớp lệnh thưa thớt, độ trễ cập nhật giá kéo tương quan mẫu chệch mạnh về $0$, làm méo toàn bộ cấu trúc phổ trị riêng.
> 3. **Dùng Làm co Tuyến tính Khi $q$ Quá Cao Mà Chưa Thử Làm co Phi tuyến (`Nonlinear Shrinkage`):** Làm co tuyến tính năm 2004 áp cùng một công thức bậc nhất cho toàn bộ phổ. Trong các hệ thống hiện đại dùng thuật toán `QuEST` và giải tích hàm Hilbert qua biến đổi Stieltjes, mỗi trị riêng mẫu $\hat{\lambda}_i$ được ánh xạ phi tuyến riêng biệt dựa trên mật độ các trị riêng lân cận, đẩy lực co rút cục bộ đạt cực trị tối ưu tiệm cận tuyệt đối trong lớp mọi hàm bất biến quay!
