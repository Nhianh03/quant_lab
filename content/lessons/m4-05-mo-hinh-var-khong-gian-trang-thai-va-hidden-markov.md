# M4.05 — Tự hồi quy Vector Đa biến, Dẫn dắt Nhân quả Granger & Mô hình Chuyển đổi Chế độ Markov Ẩn

## 1. Trực giác & Động lực: Lan truyền Tín hiệu Chéo và Sự Đứt gãy Chế độ Vĩ mô

Ở các bài học trước của Học phần `M4`, chúng ta đã mô hình hóa chuỗi lợi nhuận và biến động của từng tài sản đơn lẻ hoặc các cặp đồng liên kết tuyến tính có tham số cố định. Tuy nhiên, thị trường tài chính đa tài sản vận hành trên hai quy luật động lực sâu sắc hơn nhiều:
1. **Sự lan truyền thông tin không đồng tốc giữa các lớp tài sản:** Khi Cục Dự trữ Liên bang Mỹ phát tín hiệu chính sách, hợp đồng tương lai chỉ số và các siêu cổ phiếu thanh khoản cao phản ứng ngay trong vài chục mili-giây, trong khi nhóm cổ phiếu vốn hóa vừa và nhỏ hoặc trái phiếu doanh nghiệp mất hàng chục phút tới cả phiên giao dịch để hấp thụ trọn vẹn thông tin đó.
2. **Sự nhảy pha chế độ phi tuyến:** Không một bộ tham số trung bình – phương sai hằng định nào có thể mô tả chung cả giai đoạn tăng trưởng êm đềm năm 2017 với biến động chỉ số dưới $10\%$ lẫn cơn bão thanh khoản tháng 3/2020 khi biến động vọt lên $80\%$ và mọi tương quan chéo tiến sát $+1$.

Bài giảng này trang bị hai trụ cột toán học giải quyết trực tiếp hai bài toán trên: hệ **Tự hồi quy Vector** (Vector Autoregression — `VAR`) kết hợp kiểm định dẫn dắt nhân quả dự báo, và **Mô hình Markov Ẩn** (Hidden Markov Model — `HMM`) với thuật toán lọc nhân quả thời gian thực của Hamilton.

---

## 2. Tự hồi quy Vector Đa biến $\operatorname{VAR}(p)$, Nhân quả Granger & Phản ứng Đẩy

### 2.1. Cấu trúc $\operatorname{VAR}(p)$ và Điều kiện Dừng qua Ma trận Đồng hành

Cho vector gồm $K$ chuỗi thời gian dừng — ví dụ lợi nhuận của $K$ nhóm ngành hoặc cặp hợp đồng tương lai và giao ngay — $y_t = (y_{1,t}, \dots, y_{K,t})^\top \in \mathbb{R}^K$. Mô hình $\operatorname{VAR}(p)$ bậc trễ $p \ge 1$ của Christopher Sims (1980) biểu diễn mỗi tài sản như tổ hợp tuyến tính của quá khứ chính nó và quá khứ toàn bộ $K - 1$ tài sản còn lại:

$$
y_t = c + A_1 y_{t-1} + A_2 y_{t-2} + \dots + A_p y_{t-p} + \varepsilon_t, \qquad \varepsilon_t \stackrel{\text{iid}}{\sim} (0, \Sigma_\varepsilon)
$$

trong đó $c \in \mathbb{R}^K$, các ma trận hệ số trễ $A_\ell \in \mathbb{R}^{K \times K}$ ($\ell = 1, \dots, p$), và ma trận hiệp phương sai nhiễu đồng thời $\Sigma_\varepsilon \succ 0$. Để khảo sát tính dừng và tính dự báo đa bước, ta xếp chồng $p$ vector trễ thành vector trạng thái mở rộng $Y_t = (y_t^\top, y_{t-1}^\top, \dots, y_{t-p+1}^\top)^\top \in \mathbb{R}^{Kp}$, đưa hệ bậc $p$ về đúng dạng bậc nhất Markov $Y_t = C + \mathbf{F} Y_{t-1} + U_t$ với **Ma trận Đồng hành** (Companion Matrix) khối $\mathbf{F} \in \mathbb{R}^{Kp \times Kp}$:

$$
\mathbf{F} = \begin{pmatrix}
A_1 & A_2 & \cdots & A_{p-1} & A_p \\
I_K & 0 & \cdots & 0 & 0 \\
0 & I_K & \cdots & 0 & 0 \\
\vdots & \vdots & \ddots & \vdots & \vdots \\
0 & 0 & \cdots & I_K & 0
\end{pmatrix}
$$

**Định lý 4.3 — Điều kiện Ổn định & Dừng Hiệp phương sai của $\operatorname{VAR}(p)$.** *Hệ $\operatorname{VAR}(p)$ ổn định tiệm cận và dừng yếu — có biểu diễn trung bình trượt nhân quả hội tụ tuyệt đối $y_t = \mu + \sum_{h=0}^\infty \Phi_h \varepsilon_{t-h}$ với $\mu = (I_K - A_1 - \dots - A_p)^{-1}c$ — khi và chỉ khi toàn bộ $Kp$ trị riêng phức của ma trận đồng hành $\mathbf{F}$ đều nằm nghiêm ngặt bên trong đường tròn đơn vị:*

$$
\rho(\mathbf{F}) \triangleq \max_{1 \le m \le Kp} \big|\lambda_m(\mathbf{F})\big| < 1 \quad \Longleftrightarrow \quad \det\!\Big(I_K - A_1 z - A_2 z^2 - \dots - A_p z^p\Big) \neq 0 \quad (\forall z \in \mathbb{C}, \, |z| \le 1)
$$

Chú ý sự đối ngẫu giữa hai cách viết: trị riêng $\lambda$ của $\mathbf{F}$ chính là nghịch đảo $1/z$ của nghiệm đa thức đặc trưng toán tử trễ, nên $|\lambda| < 1$ hoàn toàn tương đương $|z| > 1$!

### 2.2. Kiểm định Dẫn dắt Nhân quả Granger & Hiệu ứng Dẫn dắt – Độ trễ

Andrew Lo và Craig MacKinlay phát hiện trên thị trường chứng khoán Mỹ hiện tượng **Hiệu ứng Dẫn dắt – Độ trễ** (Lead-Lag Effect): lợi nhuận tuần này của danh mục cổ phiếu vốn hóa lớn dự báo dương có ý nghĩa thống kê cao cho lợi nhuận tuần tới của danh mục vốn hóa nhỏ, nhưng chiều ngược lại hoàn toàn bằng không! Công cụ chuẩn tắc để kiểm định giả thuyết này là **Nhân quả Dự báo Granger** (Granger Causality).

Xét hệ $\operatorname{VAR}(p)$ hai biến $(y_{1,t}, y_{2,t})^\top$, trong đó phương trình của tài sản $2$ viết tường minh là $y_{2,t} = c_2 + \sum_{\ell=1}^p a_{21}^{(\ell)} y_{1, t-\ell} + \sum_{\ell=1}^p a_{22}^{(\ell)} y_{2, t-\ell} + \varepsilon_{2,t}$. Chuỗi $y_1$ được gọi là **dẫn dắt dự báo** đối với $y_2$ nếu việc bổ sung lịch sử của $y_1$ giúp giảm nghiêm ngặt sai số dự báo bình phương trung bình một bước của $y_2$ so với chỉ dùng lịch sử của riêng $y_2$. Kiểm định giả thuyết vô hiệu "không có dẫn dắt từ $y_1 \to y_2$" tương đương kiểm định đồng thời $p$ hệ số chéo bằng không thông qua thống kê $F$ so sánh tổng bình phương phần dư mô hình thu hẹp $\text{RSS}_R$ với mô hình đầy đủ $\text{RSS}_U$:

$$
H_0: a_{21}^{(1)} = a_{21}^{(2)} = \dots = a_{21}^{(p)} = 0, \qquad F_{\text{GC}} = \frac{(\text{RSS}_R - \text{RSS}_U)/p}{\text{RSS}_U / (T - 2p - 1)} \;\underset{H_0}{\overset{\text{xấp xỉ}}{\sim}}\; F(p, \, T - 2p - 1)
$$

Cảnh báo triết học thống kê: kiểm định này chỉ đo **khả năng dự báo đi trước về mặt thời gian**, tuyệt đối không chứng minh nhân quả can thiệp vật lý — doanh số bán áo mưa chiều hôm trước dự báo trời mưa sáng hôm sau, nhưng đóng cửa tiệm áo mưa không làm trời nắng!

### 2.3. Hàm Phản ứng Đẩy Trực giao hóa

Khi muốn đo lường quỹ đạo lan truyền theo thời gian $h = 0, 1, 2, \dots$ của một cú sốc đơn vị xuất phát từ tài sản $j$ sang toàn bộ các tài sản khác, ta không thể sốc độc lập từng thành phần $\varepsilon_{j,t}$ vì ma trận $\Sigma_\varepsilon$ có hiệp phương sai ngoài đường chéo khác không! Lấy phân rã Cholesky tam giác dưới $\Sigma_\varepsilon = L_\varepsilon L_\varepsilon^\top$ để biến đổi sang vector cú sốc trực chuẩn $\varepsilon_t = L_\varepsilon u_t$ ($\operatorname{Cov}(u_t) = I_K$), **Hàm Phản ứng Đẩy** (Impulse Response Function — `IRF`) tại chân trời $h$ bước với $\Phi_h = J \mathbf{F}^h J^\top$, $J = [I_K, 0, \dots, 0]$ được xác định bởi:

$$
\Theta_h \triangleq \frac{\partial y_{t+h}}{\partial u_t^\top} = \Phi_h L_\varepsilon \in \mathbb{R}^{K \times K}
$$

Vì phân rã Cholesky gán toàn bộ tương quan đồng thời cho biến đứng đầu danh sách, luôn đặt tài sản phản ứng nhanh nhất — chẳng hạn hợp đồng tương lai chỉ số hoặc lợi suất trái phiếu kho bạc — lên dòng số $1$, hoặc đối chiếu với hàm phản ứng đẩy suy rộng bất biến thứ tự của Pesaran-Shin!

**Thiết kế Chiến lược Giao dịch Chéo Từ Tín hiệu Dẫn dắt:**
Giả sử $y_{1,t}$ là lợi nhuận rổ hợp đồng tương lai hoặc cổ phiếu vốn hóa lớn thanh khoản dày và $y_{2,t}$ là rổ cổ phiếu vốn hóa trung bình phản ứng chậm với $a_{21}^{(1)} > 0$ có ý nghĩa thống kê ngoài mẫu. Dự báo kỳ vọng có điều kiện đa bước từ biểu diễn mở rộng $Y_t$ suy ra trực tiếp qua lũy thừa ma trận:

$$
\mathbb{E}\big[Y_{t+h} - \boldsymbol{\mu}_Y \,\big|\, \mathcal{F}_t\big] = \mathbf{F}^h \big(Y_t - \boldsymbol{\mu}_Y\big) \implies \hat{y}_{t+h \mid t} = \mu + J \mathbf{F}^h \big(Y_t - \boldsymbol{\mu}_Y\big)
$$

Để khai thác độ lệch truyền dẫn mà vẫn trung hòa rủi ro thị trường chung, bàn giao dịch mở đồng thời vị thế mua rổ phản ứng trễ $y_2$ và bán phòng vệ rổ dẫn dắt $y_1$ theo tỷ số beta đồng thời ngay khi quan sát cú sốc dương trên $y_{1,t}$!

---

## 3. Mô hình Markov Ẩn Nhận diện Chế độ Thị trường

### 3.1. Kiến trúc Chuyển đổi Chế độ của Hamilton (1989)

Giả sử tại mỗi thời điểm $t \in \{1, \dots, T\}$, thị trường nằm trong một trạng thái chế độ ẩn không quan sát được trực tiếp $S_t \in \{1, \dots, M\}$: điển hình với $M = 2$, $S_t = 1$ là **Tăng trưởng Êm ả** có $\mu_1 > 0$ và $\sigma_1$ thấp, còn $S_t = 2$ là **Khủng hoảng Biến động Cao** có $\mu_2 < 0$ và $\sigma_2 \gg \sigma_1$. Dãy $(S_t)$ vận hành như một xích Markov bậc nhất thời gian rời rạc có ma trận xác suất chuyển tiếp hàng ngang cộng bằng $1$ là $P = [p_{ij}]_{M \times M}$ với $p_{ij} \triangleq \mathbb{P}(S_t = j \mid S_{t-1} = i)$. Với mô hình hai chế độ ($M = 2$), xác suất dừng dài hạn và kỳ vọng số phiên lưu trú liên tiếp trong chế độ $j$ trước khi đảo pha là:

$$
P = \begin{pmatrix} p_{11} & 1 - p_{11} \\ 1 - p_{22} & p_{22} \end{pmatrix}, \qquad \pi_1 = \frac{1 - p_{22}}{2 - p_{11} - p_{22}}, \qquad \mathbb{E}[\text{Duration}_j] = \frac{1}{1 - p_{jj}}
$$

Trên chuỗi S&P 500 hàng ngày, ước lượng thực nghiệm thường cho $p_{11} \approx 0.990$ ứng với chu kỳ êm ả trung bình $100$ phiên và $p_{22} \approx 0.960$ ứng với chu kỳ khủng hoảng trung bình $25$ phiên. Khi biết trạng thái $S_t = j$, vector lợi nhuận quan sát $y_t$ tuân theo mật độ phát xạ có điều kiện $\eta_{t,j} \triangleq f(y_t \mid S_t = j, \mathcal{F}_{t-1}; \theta)$ như mật độ chuẩn $\mathcal{N}(\mu_j, \sigma_j^2)$ hoặc phân phối đuôi dày Student-$t$.

### 3.2. Chứng minh Đệ quy Bộ lọc Nhân quả Hamilton Thời gian Thực

Trong giao dịch trực tiếp tại cuối phiên $t$, bạn chỉ nắm tập thông tin lịch sử $\mathcal{F}_t = \{y_1, y_2, \dots, y_t\}$. Làm thế nào tính chính xác vector xác suất chế độ lọc thời gian thực $\xi_{t \mid t} \in \mathbb{R}^M$ với thành phần $\xi_{t \mid t, j} \triangleq \mathbb{P}(S_t = j \mid \mathcal{F}_t)$ **mà tuyệt đối không chạm vào dữ liệu tương lai $y_{t+1}, \dots, y_T$**?

**Định lý 4.4 — Đệ quy Hai Bước Bộ lọc Tiến Nhân quả (Hamilton Forward Filter).** *Xuất phát từ phân phối tiên nghiệm $\xi_{1 \mid 0} = \pi$, với mọi $t = 1, \dots, T$, xác suất dự báo một bước $\xi_{t \mid t-1}$ và xác suất lọc hậu nghiệm $\xi_{t \mid t}$ được cập nhật đóng hoàn toàn nhân quả qua hai phương trình vector:*

$$
\xi_{t \mid t-1} = P^\top \xi_{t-1 \mid t-1} \qquad \text{(Bước Dự phóng Markov từ } t-1 \text{ sang } t\text{)}
$$

$$
\xi_{t \mid t} = \frac{\xi_{t \mid t-1} \odot \eta_t}{\mathbf{1}_M^\top \big(\xi_{t \mid t-1} \odot \eta_t\big)}, \qquad \ell(\theta) = \sum_{t=1}^T \ln\!\Big(\mathbf{1}_M^\top \big(\xi_{t \mid t-1} \odot \eta_t\big)\Big)
$$

*trong đó $\eta_t = (\eta_{t,1}, \dots, \eta_{t,M})^\top$, ký hiệu $\odot$ là tích từng phần tử Hadamard và $\ell(\theta)$ là hàm hợp lý logarit chính xác của toàn bộ chuỗi quan sát.*

**Chứng minh Chặt chẽ.**
1. **Bước Dự phóng:** Nhờ tính chất Markov $\mathbb{P}(S_t = j \mid S_{t-1} = i, \mathcal{F}_{t-1}) = p_{ij}$, áp dụng công thức xác suất toàn phần trên $\mathcal{F}_{t-1}$:
   $\xi_{t \mid t-1, j} = \sum_{i=1}^M \mathbb{P}(S_t = j \mid S_{t-1} = i)\,\mathbb{P}(S_{t-1} = i \mid \mathcal{F}_{t-1}) = \sum_{i=1}^M p_{ij}\,\xi_{t-1 \mid t-1, i} = (P^\top \xi_{t-1 \mid t-1})_j$.
2. **Bước Cập nhật Bayes:** Khi quan sát mới $y_t$ vừa xuất hiện ($\mathcal{F}_t = \mathcal{F}_{t-1} \cup \{y_t\}$), mật độ đồng thời có điều kiện của $(y_t, S_t = j)$ biết $\mathcal{F}_{t-1}$ bằng $f(y_t \mid S_t = j, \mathcal{F}_{t-1})\,\mathbb{P}(S_t = j \mid \mathcal{F}_{t-1}) = \eta_{t,j}\,\xi_{t \mid t-1, j}$. Lấy tổng theo mọi trạng thái $j = 1, \dots, M$ cho mật độ biên dự báo một bước $f(y_t \mid \mathcal{F}_{t-1}) = \sum_{m=1}^M \xi_{t \mid t-1, m}\,\eta_{t,m} = \mathbf{1}_M^\top (\xi_{t \mid t-1} \odot \eta_t)$. Chia mật độ đồng thời cho mật độ biên theo định lý Bayes thu ngay công thức $\xi_{t \mid t}$! Hơn nữa, theo quy tắc nhân xác suất dây chuyền $f(y_1, \dots, y_T) = \prod_{t=1}^T f(y_t \mid \mathcal{F}_{t-1})$, lấy logarit hai vế chứng minh ngay biểu thức hàm hợp lý $\ell(\theta)$. $\blacksquare$

### 3.3. Làm mượt Toàn mẫu Kim / Viterbi & Thuật toán `EM` Baum-Welch

| Bài toán suy luận | Đại lượng toán học | Tập thông tin sử dụng | Hợp lệ cho tín hiệu giao dịch ngày $t$? |
| :--- | :--- | :--- | :--- |
| **Dự báo chế độ** | $\xi_{t+1 \mid t} = P^\top \xi_{t \mid t}$ | Quá khứ $\mathcal{F}_t = \{y_1, \dots, y_t\}$ | **Hợp lệ $100\%$** (dùng phân bổ vị thế phiên $t+1$) |
| **Lọc thời gian thực** | $\xi_{t \mid t} = \mathbb{P}(S_t \mid \mathcal{F}_t)$ | Quá khứ $\mathcal{F}_t = \{y_1, \dots, y_t\}$ | **Hợp lệ $100\%$** ngay sau giá đóng cửa ngày $t$ |
| **Làm mượt Kim** | $\gamma_t = \mathbb{P}(S_t \mid \mathcal{F}_T)$ | Toàn mẫu $\mathcal{F}_T$ (gồm cả tương lai!) | **CẤM TUYỆT ĐỐI** (chỉ dùng ở Bước E tập huấn luyện) |
| **Giải mã Viterbi** | $\arg\max_{s_{1:T}} \mathbb{P}(S_{1:T} \mid \mathcal{F}_T)$ | Toàn mẫu $\mathcal{F}_T$ (quy hoạch động lùi) | **CẤM TUYỆT ĐỐI** (chỉ gắn nhãn lịch sử hậu nghiệm) |

Khi ước lượng tham số chưa biết $\theta = (\pi, P, \{\mu_j, \sigma_j^2\})$ trên cửa sổ huấn luyện quá khứ $[1, T_{\text{train}}]$, thuật toán **Kỳ vọng – Cực đại hóa Baum-Welch** (Expectation-Maximization — `EM`) lặp hai bước: ở Bước E chạy Tiến – Lùi trong nội bộ tập huấn luyện để tính xác suất làm mượt biên $\gamma_{t,j} = \mathbb{P}(S_t = j \mid y_{1:T_{\text{train}}})$ và xác suất chuyển tiếp đôi $\xi_{t, ij}^{\text{joint}} = \mathbb{P}(S_{t-1} = i, S_t = j \mid y_{1:T_{\text{train}}})$; sau đó Bước M cập nhật đóng có trọng số mềm:

$$
\hat{p}_{ij}^{\text{new}} = \frac{\sum_{t=2}^{T_{\text{train}}} \xi_{t, ij}^{\text{joint}}}{\sum_{t=2}^{T_{\text{train}}} \gamma_{t-1, i}}, \qquad \hat{\mu}_j^{\text{new}} = \frac{\sum_{t=1}^{T_{\text{train}}} \gamma_{t,j}\,y_t}{\sum_{t=1}^{T_{\text{train}}} \gamma_{t,j}}, \qquad \big(\hat{\sigma}_j^2\big)^{\text{new}} = \frac{\sum_{t=1}^{T_{\text{train}}} \gamma_{t,j}\big(y_t - \hat{\mu}_j^{\text{new}}\big)^2}{\sum_{t=1}^{T_{\text{train}}} \gamma_{t,j}}
$$

```python
import numpy as np
from scipy.special import logsumexp

def check_var_stability_and_irf(lag_matrices: list[np.ndarray], sigma_eps: np.ndarray, horizon: int = 10) -> tuple[float, np.ndarray]:
    """Kiểm tra bán kính phổ ma trận đồng hành VAR(p) và tính Hàm phản ứng đẩy Cholesky."""
    p_lags = len(lag_matrices)
    k_dim = lag_matrices[0].shape[0]
    comp = np.zeros((k_dim * p_lags, k_dim * p_lags), dtype=np.float64)
    comp[:k_dim, :] = np.hstack(lag_matrices)
    if p_lags > 1:
        comp[k_dim:, :-k_dim] = np.eye(k_dim * (p_lags - 1))
    spec_radius = float(np.max(np.abs(np.linalg.eigvals(comp))))
    chol = np.linalg.cholesky(sigma_eps)
    irf = np.zeros((horizon + 1, k_dim, k_dim), dtype=np.float64)
    f_pow = np.eye(k_dim * p_lags)
    for h in range(horizon + 1):
        irf[h] = f_pow[:k_dim, :k_dim] @ chol
        f_pow = f_pow @ comp
    return spec_radius, irf

def hamilton_causal_filter_gaussian(y: np.ndarray, pi: np.ndarray, trans_mat: np.ndarray, mu: np.ndarray, sigma: np.ndarray) -> tuple[np.ndarray, float]:
    """Bộ lọc tiến Hamilton nhân quả trên miền logarit chống tràn số dưới tuyệt đối cho backtest."""
    t_len, n_states = len(y), len(pi)
    filtered = np.zeros((t_len, n_states), dtype=np.float64)
    log_prev, log_trans, total_ll = np.log(pi), np.log(trans_mat), 0.0
    for t in range(t_len):
        log_pred = logsumexp(log_prev[:, None] + log_trans, axis=0)
        log_emit = -0.5 * np.log(2.0 * np.pi) - np.log(sigma) - 0.5 * ((y[t] - mu) / sigma) ** 2
        log_joint = log_pred + log_emit
        log_marg = float(logsumexp(log_joint))
        total_ll += log_marg
        log_prev = log_joint - log_marg
        filtered[t] = np.exp(log_prev)
    return filtered, total_ll
```

---

## 4. Ví dụ Giải toán Phỏng vấn Thực chiến & Các Bẫy Triển khai

**Bài toán — Phỏng vấn Định lượng Vĩ mô & Chuỗi Thời gian tại D. E. Shaw / Graham Capital:**
1. **Phần A — Kiểm tra tính dừng $\operatorname{VAR}(1)$:** Cho hệ hai tài sản $y_t = A y_{t-1} + \varepsilon_t$ với $A = \begin{pmatrix} 0.7 & 0.4 \\ 0.2 & 0.5 \end{pmatrix}$. Hệ này có dừng yếu không? Có tồn tại dẫn dắt dự báo chéo giữa hai tài sản không?
2. **Phần B — Tính tay một bước Bộ lọc Hamilton:** Xét `HMM` hai chế độ (Chế độ $1$: Êm ả $\mu_1 = 0, \sigma_1 = 1\%$; Chế độ $2$: Khủng hoảng $\mu_2 = 0, \sigma_2 = 3\%$) với ma trận chuyển tiếp $p_{11} = 0.95, p_{12} = 0.05$ và $p_{21} = 0.10, p_{22} = 0.90$. Cuối ngày hôm qua, hệ thống đang tự tin ở chế độ êm ả với $\xi_{t-1 \mid t-1} = (0.90, \, 0.10)^\top$. Hôm nay thị trường bất ngờ sập mạnh $y_t = -3.0\%$. Hãy tính xác suất chế độ khủng hoảng cập nhật $\xi_{t \mid t, 2}$ ngay cuối phiên hôm nay!

**Lời giải Chi tiết:**
1. **Giải Phần A:**
   - Đa thức đặc trưng của $A$: $\det(A - \lambda I_2) = (0.7 - \lambda)(0.5 - \lambda) - (0.4)(0.2) = \lambda^2 - 1.2\lambda + 0.27 = (\lambda - 0.9)(\lambda - 0.3) = 0$.
   - Hai trị riêng là $\lambda_1 = 0.9$ và $\lambda_2 = 0.3$, nên bán kính phổ $\rho(A) = \max(0.9, 0.3) = \mathbf{0.9 < 1}$: hệ **dừng yếu hoàn toàn ổn định**! Vì cả hai phần tử ngoài đường chéo $a_{12} = 0.4 \neq 0$ và $a_{21} = 0.2 \neq 0$, tồn tại **dẫn dắt dự báo hai chiều** phản hồi qua lại giữa hai tài sản.
2. **Giải Phần B:**
   - **Bước 1 — Dự phóng tiên nghiệm sáng nay:**
     $\xi_{t \mid t-1, 1} = 0.90 \times 0.95 + 0.10 \times 0.10 = \mathbf{0.865}$; $\xi_{t \mid t-1, 2} = 0.90 \times 0.05 + 0.10 \times 0.90 = \mathbf{0.135}$.
   - **Bước 2 — Tỷ số mật độ phát xạ chuẩn tại $y_t = -3\%$:** Bỏ hằng số chung $\frac{1}{\sqrt{2\pi}}$ ở cả tử và mẫu:
     - Ở Chế độ $1$ ($\sigma_1 = 1$, điểm chuẩn hóa $z_1 = -3$): $\tilde{\eta}_{t,1} = \frac{1}{1}\exp\!\left(-\frac{9}{2}\right) = e^{-4.5} \approx 0.011109$.
     - Ở Chế độ $2$ ($\sigma_2 = 3$, điểm chuẩn hóa $z_2 = -1$): $\tilde{\eta}_{t,2} = \frac{1}{3}\exp\!\left(-\frac{1}{2}\right) = \frac{1}{3} e^{-0.5} \approx 0.202177$, lớn gấp **$18.2$ lần** mật độ của Chế độ $1$!
   - **Chuẩn hóa Bayes:** Tích chưa chuẩn hóa là $0.865 \times 0.011109 \approx 0.009609$ và $0.135 \times 0.202177 \approx 0.027294$. Suy ra xác suất chế độ khủng hoảng nhảy vọt ngay trong một phiên từ $10\%$ lên $\xi_{t \mid t, 2} = \frac{0.027294}{0.009609 + 0.027294} \approx \mathbf{73.96\%}$!

> [!WARNING]
> **Ba Cạm bẫy Chí mạng Khi Lập trình `VAR` và `HMM` Trong Thực tế:**
> 1. **Bẫy Rò rỉ Tương lai Của Hàm `.predict_proba()` Trong Thư viện `hmmlearn`:** Khi bạn truyền mảng lợi nhuận kiểm thử vào `model.predict_proba(X_test)`, hàm đó mặc định chạy thuật toán **Tiến – Lùi trên trọn vẹn chuỗi đầu vào**, nghĩa là xác suất chế độ tại ngày thứ Hai đã nhìn trộm cú sập ngày thứ Sáu tuần sau! Trong kiểm thử định lượng, bạn **bắt buộc phải dùng hàm `hamilton_causal_filter_gaussian` tiến một chiều** như đoạn mã chuẩn ở trên!
> 2. **Bẫy Tráo đổi Nhãn Chế độ Khi Huấn luyện Cửa sổ Trượt** (Label Switching): Hàm hợp lý của `HMM` bất biến hoàn toàn khi hoán vị tên gọi các trạng thái! Ở cửa sổ tháng 1, thuật toán `EM` có thể gán Nhãn `0` là Êm ả; sang tháng 2 với khởi tạo ngẫu nhiên khác, nó đảo ngược Nhãn `0` thành Khủng hoảng! Sau mỗi lần khớp `EM`, bắt buộc sắp xếp lại thứ tự các trạng thái theo quy tắc bất biến vật lý **tăng dần theo phương sai ước lượng** ($\hat{\sigma}_1^2 < \hat{\sigma}_2^2 < \dots < \hat{\sigma}_M^2$) và hoán vị tương ứng các hàng/cột của $\hat{P}$!
> 3. **Nổ Số lượng Tham số Bậc Hai Trong $\operatorname{VAR}(p)$:** Một mô hình $\operatorname{VAR}(p)$ trên $K = 50$ cổ phiếu với $p = 5$ độ trễ cần ước lượng $p K^2 = \mathbf{12{,}500}$ tham số hồi quy — gây quá khớp thảm khốc trên chuỗi ngày vài năm! Với $K \ge 10$, bắt buộc áp dụng điều chuẩn tiên nghiệm Minnesota (Minnesota Prior) làm co mạnh các trễ xa $\ell$ theo $1/\ell^2$ và co các hệ số chéo về $0$.
