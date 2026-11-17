# M4.01 — Phân rã Phổ, Phân rã Giá trị Kỳ dị, Thành phần Chính & Danh mục Trị riêng

## 1. Trực giác & Động lực: Tách Hệ Mặt trời Nhân tố Khỏi Nhiễu Đặc thù

Trên sàn chứng khoán Mỹ mỗi ngày có hơn $3{,}000$ mã cổ phiếu thanh khoản cao giao dịch liên tục. Nhìn qua bảng điện tử nhấp nháy xanh đỏ hỗn loạn, người mới bước chân vào thị trường dễ lầm tưởng rằng có $3{,}000$ quá trình ngẫu nhiên độc lập đang vận động. Nhưng dưới lăng kính hình học của nhà nghiên cứu định lượng tại Morgan Stanley `PDT`, Renaissance Technologies hay Squarepoint Capital, đám mây điểm lợi nhuận trong không gian $\mathbb{R}^{3000}$ thực chất bị nén dẹt thành một **khối elip siêu phẳng**: chỉ khoảng $10$ đến $15$ trục chính vĩ mô, ngành và phong cách đã chi phối phần lớn hiệp phương sai chéo toàn thị trường, trong khi hơn $2{,}985$ chiều còn lại là chuyển động phần dư đặc thù của từng doanh nghiệp!

Hiểu thấu đáo hình học của khối elip đó thông qua **Định lý Phổ**, **Phân rã Giá trị Kỳ dị** và **Phân tích Thành phần Chính** mang lại cho bạn hai siêu năng lực định lượng cốt lõi:
1. **Quản trị rủi ro nhân tố không cần phân ngành tĩnh:** Một công ty như Amazon vừa là bán lẻ tiêu dùng, vừa là hạ tầng đám mây công nghệ; phân loại ngành tĩnh cứng nhắc thường trễ hàng năm trời khi mô hình kinh doanh dịch chuyển. Các vector riêng trích xuất trực tiếp từ ma trận tương quan lợi nhuận tự động phát hiện cấu trúc cụm ngành thực tế của dòng tiền!
2. **Kinh doanh chênh lệch thống kê** (Statistical Arbitrage — `StatArb`): Lợi nhuận thô $R_{t,i}$ của một cổ phiếu là bước đi ngẫu nhiên gần như không thể dự báo chiều hướng thị trường chung; nhưng một khi bạn chiếu vuông góc để lột bỏ hoàn toàn $K$ danh mục trị riêng đầu tiên, phần dư đặc thù còn lại thường thể hiện lực hồi quy trung bình ngắn hạn cực kỳ sắc nét!

---

## 2. Định lý Phổ cho Ma trận Đối xứng Thực & Dạng Toàn phương Rayleigh

Cho ma trận đối xứng thực $S \in \mathbb{R}^{N \times N}$ ($S^\top = S$, điển hình là ma trận hiệp phương sai $\Sigma$ hoặc ma trận tương quan $C$).

**Định lý 4.1 — Phân rã Phổ cho Ma trận Đối xứng Thực:** *Mọi ma trận đối xứng thực $S \in \mathbb{R}^{N \times N}$ đều chéo hóa trực giao được trên trường số thực:*

$$
S = Q \Lambda Q^\top = \sum_{k=1}^N \lambda_k q_k q_k^\top
$$

*trong đó $\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_N)$ chứa các trị riêng thực sắp thứ tự giảm dần $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_N$, và $Q = [q_1 \;\; q_2 \;\; \dots \;\; q_N] \in \mathbb{R}^{N \times N}$ là ma trận trực giao ($Q^\top Q = Q Q^\top = I_N$, tức $q_i^\top q_j = \delta_{ij}$).*

**Chứng minh Ba Bước Chuẩn Mực Cho Vòng Phỏng vấn Bảng trắng:**
1. *Mọi trị riêng đều là số thực:* Giả sử $S z = \lambda z$ với $z \in \mathbb{C}^N \setminus \{0\}$. Lấy liên hợp chuyển vị Hermitian $z^*$ nhân trái: $z^* S z = \lambda \|z\|_2^2$. Vì $S$ thực và đối xứng ($S^* = S^\top = S$), ta có $\overline{z^* S z} = (z^* S z)^* = z^* S^* z = z^* S z$, tức $z^* S z \in \mathbb{R}$. Do $\|z\|_2^2 > 0$, suy ra $\lambda = \bar{\lambda} \in \mathbb{R}$ (và có thể chọn phần thực để lấy vector riêng thực).
2. *Vector riêng ứng với trị riêng phân biệt thì trực giao:* Nếu $S q_1 = \lambda_1 q_1$ và $S q_2 = \lambda_2 q_2$ với $\lambda_1 \neq \lambda_2$, ta tính đại lượng vô hướng $q_2^\top S q_1$ theo hai cách:
   $$\lambda_1 (q_2^\top q_1) = q_2^\top (S q_1) = (S^\top q_2)^\top q_1 = (S q_2)^\top q_1 = \lambda_2 (q_2^\top q_1) \implies (\lambda_1 - \lambda_2)(q_2^\top q_1) = 0 \implies q_2^\top q_1 = 0$$
3. *Quy nạp trên phần bù trực giao (xử lý cả trường hợp trị riêng bội):* Chọn vector riêng chuẩn hóa đầu tiên $q_1 \in \mathbb{R}^N$ ($\|q_1\|_2 = 1$) ứng với $\lambda_1$. Xét không gian con $(N - 1)$ chiều $W = q_1^\perp = \{x \in \mathbb{R}^N : q_1^\top x = 0\}$. Với mọi $x \in W$, ta có $q_1^\top (S x) = (S q_1)^\top x = \lambda_1 q_1^\top x = 0$, chứng tỏ **$W$ bất biến dưới tác động của $S$** ($S(W) \subseteq W$)! Thu hẹp toán tử tự liên hợp $S$ lên không gian Euclid $(N - 1)$ chiều $W$ và áp dụng giả thiết quy nạp cho cơ sở trực chuẩn $\{q_2, \dots, q_N\}$ của $W$, ta hoàn tất $S = Q \Lambda Q^\top$. $\blacksquare$

### 2.1. Tính Xác định Nửa Dương và Định lý Cực trị Thương số Rayleigh

Một ma trận đối xứng $\Sigma$ là ma trận hiệp phương sai hợp lệ của một vector ngẫu nhiên $R \in \mathbb{R}^N$ **khi và chỉ khi** $\Sigma$ là **xác định nửa dương** (Positive Semi-Definite — `PSD`, ký hiệu $\Sigma \succeq 0$), bởi vì phương sai của mọi danh mục tuyến tính $w \in \mathbb{R}^N$ không bao giờ được âm:

$$
0 \le \operatorname{Var}\big(w^\top R\big) = w^\top \Sigma w = (Q^\top w)^\top \Lambda (Q^\top w) = \sum_{k=1}^N \lambda_k \big(q_k^\top w\big)^2
$$

Đặt tọa độ xoay $z = Q^\top w$ (bảo toàn độ dài $\|z\|_2 = \|w\|_2$ vì $Q$ trực giao). Chọn $w = q_j$ cho thấy $\lambda_j = q_j^\top \Sigma q_j \ge 0$ ($\forall j$). Đồng thời trên mặt cầu đơn vị $\|w\|_2 = 1 \iff \sum_{k=1}^N z_k^2 = 1$, tổng có trọng số lồi $\sum_{k=1}^N \lambda_k z_k^2$ bị kẹp chặt giữa $\lambda_N$ và $\lambda_1$, dẫn trực tiếp tới **Nguyên lý Biến phân Rayleigh-Ritz (Courant-Fischer)**:

$$
\lambda_1 = \max_{\|w\|_2 = 1} w^\top \Sigma w \;\; (\text{đạt tại } w = \pm q_1), \qquad \lambda_k = \max_{\substack{\|w\|_2 = 1 \\ w \perp q_1, \dots, q_{k-1}}} w^\top \Sigma w \;\; (\text{đạt tại } w = \pm q_k)
$$

Hai bất biến đại số cực nhanh dùng để kiểm tra chéo tính toán trong phỏng vấn là: **Vết ma trận bằng tổng các trị riêng** $\operatorname{tr}(\Sigma) = \sum_{k=1}^N \lambda_k$ (tổng phương sai từng tài sản) và **Định thức bằng tích các trị riêng** $\det(\Sigma) = \prod_{k=1}^N \lambda_k$ (bình phương thể tích khối elip rủi ro).

---

## 3. Phân rã Giá trị Kỳ dị & Định lý Xấp xỉ Hạng thấp Eckart-Young

Trong thực hành số học máy tính, bạn không chỉ có ma trận vuông $\Sigma \in \mathbb{R}^{N \times N}$, mà xuất phát từ **ma trận dữ liệu chữ nhật đã trừ trung bình** $X \in \mathbb{R}^{T \times N}$ ($T$ phiên giao dịch theo hàng, $N$ mã cổ phiếu theo cột, hạng $r = \operatorname{rank}(X) \le \min(T, N)$).

**Định lý 4.2 — Phân rã Giá trị Kỳ dị:** *Mọi ma trận thực $X \in \mathbb{R}^{T \times N}$ hạng $r$ đều phân rã được dưới dạng tích (Singular Value Decomposition — `SVD`) rút gọn:*

$$
X = U_r D_r V_r^\top = \sum_{k=1}^r \sigma_k u_k v_k^\top
$$

*trong đó $D_r = \operatorname{diag}(\sigma_1, \dots, \sigma_r)$ chứa các giá trị kỳ dị dương $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_r > 0$; cột của $V_r = [v_1 \dots v_r] \in \mathbb{R}^{N \times r}$ trực chuẩn $V_r^\top V_r = I_r$ gọi là các **vector kỳ dị phải** nằm trên không gian tài sản; và cột của $U_r = [u_1 \dots u_r] \in \mathbb{R}^{T \times r}$ trực chuẩn $U_r^\top U_r = I_r$ gọi là các **vector kỳ dị trái** biểu diễn chuỗi thời gian nhân tố chuẩn hóa.*

**Xây dựng và Liên kết với Hiệp phương sai Mẫu:**
Xét ma trận Gram đối xứng nửa xác định dương $X^\top X \in \mathbb{R}^{N \times N}$. Áp dụng Định lý 4.1 cho $X^\top X = V \operatorname{diag}(\sigma_1^2, \dots, \sigma_r^2, 0, \dots, 0) V^\top$ với $\sigma_k = \sqrt{\lambda_k(X^\top X)} > 0$ cho $1 \le k \le r$. Đặt $u_k = \frac{1}{\sigma_k} X v_k$ ($1 \le k \le r$), ta kiểm tra ngay tính trực chuẩn của $\{u_k\}$:

$$
u_i^\top u_j = \frac{1}{\sigma_i \sigma_j} v_i^\top (X^\top X) v_j = \frac{\sigma_j^2}{\sigma_i \sigma_j} v_i^\top v_j = \delta_{ij}
$$

Nhân phải $X$ với cơ sở trực chuẩn đầy đủ $V = [V_r \;\; V_0]$ — trong đó $k > r \implies \|X v_k\|_2^2 = v_k^\top X^\top X v_k = 0 \implies X v_k = 0$ — ta có $X = X V V^\top = \sum_{k=1}^r (X v_k) v_k^\top = \sum_{k=1}^r \sigma_k u_k v_k^\top$! Đặc biệt, ma trận hiệp phương sai mẫu $\hat{\Sigma} = \frac{1}{T - 1} X^\top X = V \Lambda V^\top$ nhận **chính các vector kỳ dị phải $v_k$ làm vector riêng** và trị riêng $\hat{\lambda}_k = \frac{\sigma_k^2}{T - 1}$!

> [!NOTE]
> **Ổn định Số học Dấu chấm Động Khi Lập trình Thực tế:**
> Trong thư viện đại số tuyến tính chuẩn như `LAPACK` và `NumPy`, để tìm các thành phần chính của ma trận lợi nhuận $X \in \mathbb{R}^{T \times N}$, bạn nên gọi trực tiếp `numpy.linalg.svd(X, full_matrices=False)` thay vì nhân tường minh $S = X^\top X / (T - 1)$ rồi mới gọi hàm trị riêng! Lý do là phép nhân $X^\top X$ làm **bình phương số điều kiện** $\kappa(X^\top X) = \big(\sigma_1 / \sigma_r\big)^2 = \kappa(X)^2$: nếu $\kappa(X) = 10^8$, ma trận $X^\top X$ có $\kappa = 10^{16}$ vượt quá độ chính xác 64-bit $\epsilon_{\text{mach}} \approx 2.2 \times 10^{-16}$, xóa sạch hoàn toàn các giá trị kỳ dị nhỏ!

**Định lý 4.3 — Định lý Xấp xỉ Hạng thấp Eckart-Young-Mirsky:** *Trong tập mọi ma trận $B \in \mathbb{R}^{T \times N}$ có hạng tối đa $K < r$, ma trận cắt cụt $K$ thành phần đầu $X_K = \sum_{k=1}^K \sigma_k u_k v_k^\top$ là xấp xỉ gần $X$ nhất đồng thời theo cả chuẩn phổ toán tử $\|\cdot\|_2$ lẫn chuẩn Frobenius $\|\cdot\|_F$:*

$$
\min_{\operatorname{rank}(B) \le K} \|X - B\|_2 = \|X - X_K\|_2 = \sigma_{K+1}, \qquad \min_{\operatorname{rank}(B) \le K} \|X - B\|_F^2 = \|X - X_K\|_F^2 = \sum_{k = K + 1}^r \sigma_k^2
$$

**Chứng minh Ngắn gọn cho Chuẩn Toán tử (Điểm cộng Tuyệt đối Trong Phỏng vấn):**
Trước hết $\|X - X_K\|_2 = \left\|\sum_{k=K+1}^r \sigma_k u_k v_k^\top\right\|_2 = \sigma_{K+1}$ và $\|X - X_K\|_F^2 = \operatorname{tr}\big((X - X_K)^\top(X - X_K)\big) = \sum_{k=K+1}^r \sigma_k^2$. Lấy bất kỳ ma trận $B$ nào có $\operatorname{rank}(B) \le K$: không gian hạch $\ker(B) \subseteq \mathbb{R}^N$ có số chiều $\dim\ker(B) = N - \operatorname{rank}(B) \ge N - K$. Mặt khác, không gian con $V_{K+1} = \operatorname{span}(v_1, \dots, v_{K+1})$ có số chiều $K + 1$. Vì $(N - K) + (K + 1) = N + 1 > N$, theo công thức chiều giao hai không gian con, tồn tại vector đơn vị $w \in \ker(B) \cap V_{K+1}$ ($\|w\|_2 = 1$, $B w = 0$, $w = \sum_{k=1}^{K+1} c_k v_k$ với $\sum_{k=1}^{K+1} c_k^2 = 1$). Khi đó:

$$
\|X - B\|_2^2 \ge \big\|(X - B)w\big\|_2^2 = \|X w\|_2^2 = \left\| \sum_{k=1}^{K+1} c_k \sigma_k u_k \right\|_2^2 = \sum_{k=1}^{K+1} c_k^2 \sigma_k^2 \ge \sigma_{K+1}^2 \sum_{k=1}^{K+1} c_k^2 = \sigma_{K+1}^2
$$

suy ra $\|X - B\|_2 \ge \sigma_{K+1}$ với mọi $\operatorname{rank}(B) \le K$! (Từ bất đẳng thức giá trị kỳ dị Weyl $\sigma_{i+K}(X) \le \sigma_{i+0}(X - B) + \sigma_{K+1}(B) = \sigma_i(X - B)$ do $\sigma_{K+1}(B) = 0$, bình phương cộng qua $i \ge 1$ cũng suy ra ngay cận dưới chuẩn Frobenius $\sum_{k=K+1}^r \sigma_k^2$!). Tỷ lệ phương sai dữ liệu được giữ lại bởi $K$ thành phần đầu chính là $\text{FVE}(K) = \frac{\sum_{k=1}^K \sigma_k^2}{\sum_{j=1}^r \sigma_j^2} = \frac{\sum_{k=1}^K \hat{\lambda}_k}{\sum_{j=1}^N \hat{\lambda}_j}$. $\blacksquare$

---

## 4. Thành phần Chính & Danh mục Trị riêng Avellaneda-Lee

### 4.1. Tại sao Phải Chạy PCA Trên Ma trận Tương quan Thay vì Hiệp phương sai Thô?

Xét lát cắt $N$ cổ phiếu có lợi nhuận ngày $R_{t,i}$ trên cửa sổ $T$ phiên. Nếu bạn áp dụng **Phân tích Thành phần Chính** (Principal Component Analysis — `PCA`) trực tiếp lên ma trận hiệp phương sai thô $\hat{\Sigma}$ mà không chuẩn hóa độ biến động: một mã cổ phiếu công nghệ sinh học nhỏ có biến động ngày $\hat{\sigma}_{\text{bio}} = 8\%$ sở hữu phương sai $\hat{\sigma}_{\text{bio}}^2 = 64\text{ pct}^2$, lớn gấp **64 lần** một trụ cột vốn hóa lớn như Johnson & Johnson ($\hat{\sigma}_{\text{JNJ}} = 1\% \implies \hat{\sigma}_{\text{JNJ}}^2 = 1\text{ pct}^2$). Theo nguyên lý cực đại Rayleigh $\max_{\|w\|_2=1} w^\top \hat{\Sigma} w$, thành phần chính thứ nhất sẽ dồn toàn bộ trọng số vào vài chục mã đầu cơ biến động điên rồ nhất thay vì phản ánh thị trường chung!

Theo quy trình chuẩn của Marco Avellaneda và Jeong-Hyun Lee năm 2010, ta chuẩn hóa điểm chuẩn từng mã cổ phiếu trên cửa sổ huấn luyện lùi $T$ ngày:

$$
Z_{t,i} = \frac{R_{t,i} - \bar{R}_i}{\hat{\sigma}_i}, \qquad \hat{C} = \frac{1}{T - 1} Z^\top Z \in \mathbb{R}^{N \times N}
$$

trong đó $\hat{C}_{ii} = 1$ ($\forall i$), nên tổng toàn bộ $N$ trị riêng của ma trận tương quan thực nghiệm bằng đúng số lượng tài sản: $\operatorname{tr}(\hat{C}) = \sum_{k=1}^N \hat{\lambda}_k = N$.

### 4.2. Xây dựng Trọng số Tiền mặt của Danh mục Trị riêng

Gọi $v^{(k)} = (v_{1,k}, \dots, v_{N,k})^\top$ là vector riêng chuẩn hóa thứ $k$ của $\hat{C}$ thỏa mãn $\hat{C} v^{(k)} = \hat{\lambda}_k v^{(k)}$ và $\|v^{(k)}\|_2 = 1$. Thành phần chính chuẩn hóa thứ $k$ có giá trị tại ngày $t$ là $\tilde{F}_{t,k} = \sum_{i=1}^N v_{i,k} Z_{t,i}$. Để biến $\tilde{F}_{t,k}$ thành một **Danh mục Trị riêng** (Eigenportfolio) có thể đặt lệnh giao dịch trực tiếp bằng tiền thật trên lợi nhuận gốc $R_{t,i}$, ta chia mỗi phần tử của vector riêng cho độ biến động $\hat{\sigma}_i$ của mã tương ứng:

$$
w_i^{(k)} = \frac{v_{i,k}}{\hat{\sigma}_i}, \qquad F_{t,k} \triangleq \sum_{i=1}^N w_i^{(k)} R_{t,i} = \sum_{i=1}^N \frac{v_{i,k}}{\hat{\sigma}_i} R_{t,i}
$$

Kiểm tra tính trực giao thống kê giữa hai danh mục trị riêng $k$ và $m$ trên cửa sổ mẫu (ký hiệu $D_\sigma = \operatorname{diag}(\hat{\sigma}_1, \dots, \hat{\sigma}_N)$ sao cho $\hat{\Sigma} = D_\sigma \hat{C} D_\sigma$ và $w^{(k)} = D_\sigma^{-1} v^{(k)}$):

$$
\widehat{\operatorname{Cov}}\big(F_k, F_m\big) = \big(w^{(k)}\big)^\top \hat{\Sigma} \, w^{(m)} = \big(v^{(k)}\big)^\top D_\sigma^{-1} \big(D_\sigma \hat{C} D_\sigma\big) D_\sigma^{-1} v^{(m)} = \big(v^{(k)}\big)^\top \hat{C} v^{(m)} = \hat{\lambda}_k \, \delta_{km}
$$

Các danh mục trị riêng **hoàn toàn không tương quan với nhau** ($\widehat{\operatorname{Cov}}(F_k, F_m) = 0$ với mọi $k \neq m$) và có phương sai đúng bằng trị riêng $\hat{\lambda}_k$!

### 4.3. Giải mã Kinh tế học các Thành phần Đầu tiên & Trích xuất Phần dư

| Thứ tự Phổ | Cấu trúc Vector riêng $v^{(k)}$ & Trị riêng $\hat{\lambda}_k$ | Ý nghĩa Kinh tế trên Cổ phiếu Mỹ | Tương tự trên Đường cong Lãi suất Kho bạc Mỹ |
| :--- | :--- | :--- | :--- |
| **Thành phần 1 — `PC1`** | $\hat{\lambda}_1 \gg \hat{\lambda}_2$ chiếm $25\%\text{–}45\%$ tổng phương sai $N$ và vọt lên $>65\%$ khi khủng hoảng; mọi tọa độ $v_{i,1} > 0$ cùng dấu! | **Chế độ Thị trường Chung**: trọng số $w_i^{(1)} = v_{i,1}/\hat{\sigma}_i > 0$ chính là danh mục mua toàn thị trường có trọng số nghịch đảo biến động! | **Dịch chuyển Song song** (Level Shift — giải thích $\approx 85\%$ biến động lợi suất các kỳ hạn). |
| **Thành phần `PC2..PC_K`** ($K \approx 10\text{–}15$) | Các tọa độ mang cả dấu dương lẫn dấu âm, thỏa $\sum_i v_{i,k} v_{i,1} = 0$ nên tự động trung hòa với `PC1`! | **Các Danh mục Mua - Bán Ngành & Phong cách**: Công nghệ mua / Năng lượng - Tài chính bán, Tăng trưởng / Giá trị, Vốn hóa lớn / nhỏ. | **Độ dốc** `PC2` — ngắn hạn ngược chiều dài hạn $\approx 10\%$ — và **Độ cong** `PC3` — cánh bướm kỳ hạn giữa so với hai đầu $\approx 3\%$. |
| **Phần còn lại ($k > K$)** | Hàng ngàn trị riêng nhỏ gom cụm quanh $1$ | **Không gian Phần dư Đặc thù + Nhiễu ngẫu nhiên** | Sai số định giá cục bộ giữa các kỳ hạn trái phiếu cụ thể (cơ hội giao dịch giá trị tương đối!). |

Để trích xuất phần dư đặc thù phục vụ chiến lược hồi quy trung bình (chuẩn bị cho Bài `M4.04` và Đồ án `CAP-02`), với mỗi cổ phiếu $i$, ta hồi quy chuỗi lợi nhuận $R_{t,i}$ lên $K$ danh mục trị riêng đầu tiên $F_{t,1}, \dots, F_{t,K}$:

$$
R_{t,i} = \alpha_i + \sum_{k=1}^K \beta_{i,k} F_{t,k} + \varepsilon_{t,i}
$$

Chuỗi phần dư tích lũy $X_{t,i} = \sum_{s \le t} \varepsilon_{s,i}$ đã được khử sạch hoàn toàn rủi ro beta thị trường lẫn sóng ngành động, trở thành nguyên liệu tinh khiết cho mô hình Ornstein-Uhlenbeck!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Giải Phổ 3 Cổ phiếu & Dựng Eigenportfolio

**Đề bài (Phỏng vấn Định lượng — Morgan Stanley / Point72):**
Xét vũ trụ thu gọn gồm $N = 3$ cổ phiếu (Mã 1 và Mã 2 cùng ngành Bán dẫn, Mã 3 thuộc ngành Tiện ích Điện) có độ biến động ngày $\hat{\sigma}_1 = 2\%, \, \hat{\sigma}_2 = 4\%, \, \hat{\sigma}_3 = 1\%$ và ma trận tương quan đối xứng khối:

$$
\hat{C} = \begin{pmatrix} 1 & 0.5 & 0 \\ 0.5 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}
$$

1. Tìm đầy đủ các trị riêng $\lambda_1 \ge \lambda_2 \ge \lambda_3$, tỷ lệ phương sai giải thích của từng thành phần và hệ cơ sở vector riêng trực chuẩn $v^{(1)}, v^{(2)}, v^{(3)}$.
2. Tính vector trọng số danh mục trị riêng thứ nhất $w^{(1)}$ và danh mục trị riêng thứ ba $w^{(3)}$ (chuẩn hóa tổng giá trị tuyệt đối $\|w\|_1 = 1$), rồi giải thích trực giác kinh tế của từng danh mục!

**Lời giải Từng Bước:**
1. **Tìm trị riêng và vector riêng trực chuẩn:**
   - Khối $2 \times 2$ đầu $\begin{pmatrix} 1 & 0.5 \\ 0.5 & 1 \end{pmatrix}$ có tổng đường chéo bằng $2$ và hiệu bằng $0.5$, nên hai trị riêng là $1 + 0.5 = 1.5$ đi kèm hướng đối xứng $\frac{1}{\sqrt{2}}(1, 1)^\top$ và $1 - 0.5 = 0.5$ đi kèm hướng phản đối xứng $\frac{1}{\sqrt{2}}(1, -1)^\top$. Khối $1 \times 1$ cuối cho trị riêng bằng $1.0$.
   - Sắp xếp giảm dần ($\sum \lambda_k = 1.5 + 1.0 + 0.5 = 3.0 = N$):
     - $\lambda_1 = 1.50$ ($\text{FVE}_1 = 1.5 / 3.0 = \mathbf{50.0\%}$), $v^{(1)} = \left(\frac{1}{\sqrt{2}}, \, \frac{1}{\sqrt{2}}, \, 0\right)^\top$.
     - $\lambda_2 = 1.00$ ($\text{FVE}_2 = 1.0 / 3.0 = \mathbf{33.3\%}$), $v^{(2)} = (0, \, 0, \, 1)^\top$.
     - $\lambda_3 = 0.50$ ($\text{FVE}_3 = 0.5 / 3.0 = \mathbf{16.7\%}$), $v^{(3)} = \left(\frac{1}{\sqrt{2}}, \, -\frac{1}{\sqrt{2}}, \, 0\right)^\top$.
2. **Dựng trọng số tiền mặt $w_i^{(k)} \propto v_{i,k} / \hat{\sigma}_i$ (chuẩn hóa $\|w\|_1 = 1$):**
   - Với `PC1`: chưa chuẩn hóa $\tilde{w}^{(1)} = \frac{1}{\sqrt{2}}\left(\frac{1}{0.02}, \, \frac{1}{0.04}, \, 0\right)^\top \propto (2, \, 1, \, 0)^\top$. Chuẩn hóa $\|w^{(1)}\|_1 = 1$ được $w^{(1)} = \left(+\frac{2}{3}, \, +\frac{1}{3}, \, 0\right)^\top$: danh mục **mua ròng cụm ngành Bán dẫn** với tỷ lệ vốn trên Mã 1 gấp đôi Mã 2 để cân bằng độ biến động ($2\% \times \frac{2}{3} = 4\% \times \frac{1}{3}$)!
   - Với `PC3` (trị riêng nhỏ nhất $\lambda_3 = 0.50$): chưa chuẩn hóa $\tilde{w}^{(3)} \propto \left(+\frac{1}{0.02}, \, -\frac{1}{0.04}, \, 0\right)^\top \propto (+2, \, -1, \, 0)^\top$, chuẩn hóa được $w^{(3)} = \left(+\frac{2}{3}, \, -\frac{1}{3}, \, 0\right)^\top$: đây chính là **cặp giao dịch chênh lệch giá trung hòa rủi ro ngành** (mua $\$66.7$ Mã 1, bán khống $\$33.3$ Mã 2 sao cho rủi ro biến động hai chân cân bằng tuyệt đối, khử sạch sóng chung của ngành Bán dẫn!).

---

## 6. Cạm bẫy Thực chiến Khi Vận hành PCA Trượt Theo Thời gian

> [!WARNING]
> **Ba Bẫy Kỹ thuật Khiến Mô hình Thành phần Chính Giao dịch Thua lỗ Thực tế:**
> 1. **Hiện tượng Lật dấu Ngẫu nhiên của Vector Riêng (`Sign Flipping`):** Nếu $v^{(k)}$ là vector riêng đơn vị của $\hat{C}_t$ thì $-v^{(k)}$ cũng là một vector riêng hợp lệ 100%! Các hàm thư viện số như `numpy.linalg.eigh` có thể trả về $+v^{(k)}$ ở phiên hôm qua và đột ngột đổi dấu sang $-v^{(k)}$ ở phiên hôm nay chỉ vì nhiễu làm tròn số học. Nếu bạn dùng trực tiếp vector riêng làm đặc trưng đầu vào cho mô hình học máy mà không neo dấu quy ước — chẳng hạn ép $\sum_i v_{i,1} > 0$ cho `PC1` và ép tích vô hướng $\big(v_t^{(k)}\big)^\top v_{t-1}^{(k)} > 0$ với phiên liền trước — tín hiệu sẽ đảo chiều điên loạn $180^\circ$ không lý do!
> 2. **Trộn Lẫn Tương lai Khi Chuẩn hóa & Phân rã Trên Toàn Bộ Lịch sử:** Khớp $\hat{C}$ một lần trên toàn bộ 10 năm dữ liệu rồi dùng các $v^{(k)}$ đó trích xuất phần dư quay ngược lại năm thứ nhất là lỗi nhìn trước tương lai kinh điển (tạo lợi nhuận hồi quy trung bình ảo nhờ biết trước cặp cổ phiếu nào giữ được tương quan tới cuối chu kỳ!). Bắt buộc phải ước lượng $\hat{C}_t$ chỉ từ cửa sổ quá khứ $[t - W, t]$ (ví dụ $W = 252$ ngày).
> 3. **Chọn Số lượng Nhân tố $K$ Tùy tiện Mà Chưa Lọc Nhiễu Chiều cao:** Làm sao biết nên cắt tại $K = 5, 15$ hay $50$ khi $N = 500$ và $T = 252$? Câu trả lời toán học chính xác nằm ở **Định luật Phổ Marchenko-Pastur** của bài giảng kế tiếp `M4.02`!
