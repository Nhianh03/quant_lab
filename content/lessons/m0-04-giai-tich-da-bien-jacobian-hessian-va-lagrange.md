# M0.04 — Giải tích Đa biến: Gradient, Jacobian, Hessian, Khai triển Taylor & Nhân tử Lagrange

## 1. Trực giác & Động lực: Giải tích Đa biến Như Bản Đồ Địa Hình Rủi ro – Lợi nhuận

Trong kỹ thuật phần mềm truyền thống, rất hiếm khi bạn phải đụng tới đạo hàm riêng bậc hai hay định thức đổi biến tích phân bội. Nhưng ngay khi bước vào bàn nghiên cứu định lượng — từ việc sinh số ngẫu nhiên chuẩn trên CPU, tính độ nhạy quyền chọn, cho đến tối ưu hóa danh mục Markowitz dưới hàng chục ràng buộc rủi ro — mọi bài toán đều quy về việc khảo sát hình học cục bộ của một hàm nhiều biến $f: \mathbb{R}^n \to \mathbb{R}$ hoặc ánh xạ vector $g: \mathbb{R}^n \to \mathbb{R}^m$.

Cách trực quan nhất để làm chủ giải tích đa biến là hình dung đồ thị $z = f(x_1, \dots, x_n)$ như một bề mặt địa hình đồi núi:
- **Bậc nhất — đạo hàm riêng và độ dốc** thay mặt cong tại điểm đứng bằng **mặt phẳng tiếp diện**, cho biết hướng leo dốc nhanh nhất và tỷ lệ co giãn thể tích vi phân khi đổi hệ tọa độ.
- **Bậc hai — ma trận độ cong** đo **độ cong bát úp hay bát ngửa** theo mọi hướng để phân biệt đáy thung lũng thật sự với điểm yên ngựa và định lượng lợi nhuận lồi khi biến động vọt tăng.

---

## 2. Đạo hàm Theo hướng, Vector Gradient & Quy tắc Dây chuyền Đa biến

### 2.1. Hình học của Vector Gradient và Tính Vuông góc với Mặt mức

Cho hàm khả vi liên tục $f: \mathbb{R}^n \to \mathbb{R}$. Tập hợp $n$ đạo hàm riêng bậc nhất tại điểm $x = (x_1, \dots, x_n)^\top$ lập thành vector cột **Gradient** $\nabla f(x) \triangleq \left(\frac{\partial f}{\partial x_1}(x), \dots, \frac{\partial f}{\partial x_n}(x)\right)^\top \in \mathbb{R}^n$.

Xét một hướng dịch chuyển có độ dài đơn vị $u \in \mathbb{R}^n$ ($\|u\|_2 = 1$). Tốc độ biến thiên tức thời của $f$ khi bước từ $x$ theo hướng $u$ được gọi là **đạo hàm theo hướng** (Directional Derivative) $D_u f(x)$, tính bằng quy tắc dây chuyền cho hàm một biến $\phi(h) = f(x + h u)$ tại $h = 0$:

$$
D_u f(x) \triangleq \lim_{h \to 0} \frac{f(x + h u) - f(x)}{h} = \sum_{i=1}^n \frac{\partial f}{\partial x_i}(x) u_i = \nabla f(x)^\top u = \|\nabla f(x)\|_2 \cos\theta
$$

trong đó $\theta \in [0, \pi]$ là góc hợp bởi $\nabla f(x)$ và $u$ (do $\|u\|_2 = 1$). Đẳng thức tích vô hướng ngắn gọn này mở khóa ngay lập tức hai định luật hình học nền tảng:
1. **Hướng tăng dốc nhất**: $D_u f(x)$ đạt cực đại bằng $\|\nabla f(x)\|_2$ khi $\cos\theta = 1$ ($u = \frac{\nabla f(x)}{\|\nabla f(x)\|_2}$) và giảm nhanh nhất khi $u = -\frac{\nabla f(x)}{\|\nabla f(x)\|_2}$ — nguyên lý của thuật toán **Hạ Gradient** (Gradient Descent) $x_{k+1} = x_k - \eta \nabla f(x_k)$.
2. **Vuông góc với mặt mức**: Xét một đường cong khả vi bất kỳ $x(t)$ chạy hoàn toàn bên trên **mặt mức** (Level Surface) $\{x \in \mathbb{R}^n : f(x) = c\}$ đi qua $x_0 = x(0)$. Lấy đạo hàm hai vế đẳng thức hằng $f(x(t)) = c$ tại $t = 0$ cho $\nabla f(x_0)^\top x'(0) = 0$: **vector $\nabla f(x_0)$ luôn vuông góc với mọi vector tiếp tuyến $x'(0)$ của mặt mức tại $x_0$**!

### 2.2. Ma trận Jacobian và Quy tắc Dây chuyền Tổng quát

Với ánh xạ vector khả vi $g: \mathbb{R}^n \to \mathbb{R}^m$, $g(x) = \big(g_1(x), \dots, g_m(x)\big)^\top$, xấp xỉ tuyến tính bậc nhất $g(x + \Delta x) \approx g(x) + J_g(x) \Delta x$ được đại diện bởi **ma trận Jacobian** (Jacobian Matrix) cấp $m \times n$ có hàng thứ $i$ là $\nabla g_i(x)^\top$:

$$
J_g(x) \triangleq \frac{\partial g(x)}{\partial x} = \begin{pmatrix} \frac{\partial g_1}{\partial x_1} & \cdots & \frac{\partial g_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial g_m}{\partial x_1} & \cdots & \frac{\partial g_m}{\partial x_n} \end{pmatrix} \in \mathbb{R}^{m \times n}
$$

Nếu ghép nối tiếp hai ánh xạ $z = h(y)$ ($h: \mathbb{R}^m \to \mathbb{R}^p$) và $y = g(x)$, **Quy tắc Dây chuyền Đa biến** (Multivariable Chain Rule) phát biểu rằng đạo hàm của hàm hợp chính là tích hai ma trận Jacobian:

$$
J_{h \circ g}(x) = J_h\big(g(x)\big) \cdot J_g(x) \in \mathbb{R}^{p \times n}
$$

*(Với kỹ sư học máy: lan truyền ngược thực chất chỉ là việc nhân chuỗi ma trận này từ trái qua phải khi $p = 1$ để giữ kích thước trung gian luôn là vector hàng $1 \times m$ thay vì ma trận $m \times n$ đắt đỏ!).*

---

## 3. Đổi biến Tích phân Bội, Tích phân Gauss & Thuật toán Box-Muller

Khi thực hiện phép đổi biến song ánh khả vi liên tục $y = g(x)$ giữa hai miền mở trong $\mathbb{R}^n$, một ô siêu lập phương vô cùng bé cạnh $(dx_1, \dots, dx_n)$ có thể tích $dx_1 \cdots dx_n$ bị ánh xạ tuyến tính cục bộ $J_g(x)$ biến thành một khối hộp bình hành dựng trên các cột $\frac{\partial g}{\partial x_j} dx_j$. Nhờ ý nghĩa hình học của định thức đã chứng minh ở `M0.03`, thể tích vi phân mới bằng đúng $|\det J_g(x)| \, dx_1 \cdots dx_n$, cho công thức đổi biến tích phân bội:

$$
\int_{\Omega_y} \varphi(y) \, dy_1 \cdots dy_n = \int_{\Omega_x} \varphi\big(g(x)\big) \, \big|\det J_g(x)\big| \, dx_1 \cdots dx_n
$$

**Định lý 0.9 — Chứng minh Tích phân Chuẩn hóa Gauss và Phép Sinh Số Chuẩn Box-Muller:**
1. *Tích phân Gauss trên toàn trục thực bằng $\int_{-\infty}^{+\infty} e^{-x^2 / 2} \, dx = \sqrt{2\pi}$ (do đó $\phi(x) = \frac{1}{\sqrt{2\pi}} e^{-x^2/2}$ là mật độ hợp lệ).*
2. **Phép biến đổi Box-Muller**: *Nếu $U_1, U_2 \stackrel{\text{i.i.d.}}{\sim} \operatorname{Unif}(0, 1)$, thì hai biến ngẫu nhiên:*

$$
Z_1 = \sqrt{-2\ln U_1} \cos(2\pi U_2), \qquad Z_2 = \sqrt{-2\ln U_1} \sin(2\pi U_2)
$$

*tuân theo phân phối chuẩn tắc $\mathcal{N}(0, 1)$ và **hoàn toàn độc lập thống kê với nhau**!*

**Chứng minh.**
- *Ý 1*: Đặt $I = \int_{-\infty}^{+\infty} e^{-x^2/2}\,dx > 0$. Vì nguyên hàm của $e^{-x^2/2}$ không biểu diễn được qua hàm sơ cấp, mẹo thiên tài của Poisson là bình phương $I$ thành tích phân kép trên $\mathbb{R}^2$ rồi đổi sang tọa độ cực $(x, y) = (r\cos\theta, \, r\sin\theta)$ với $r \in (0, \infty)$, $\theta \in [0, 2\pi)$:

$$
\det J(r, \theta) = \det \begin{pmatrix} \cos\theta & -r\sin\theta \\ \sin\theta & r\cos\theta \end{pmatrix} = r\cos^2\theta + r\sin^2\theta = r > 0
$$

Thay $x^2 + y^2 = r^2$ và $dx\,dy = r\,dr\,d\theta$ (xuất hiện nhân tử $r$ cứu tinh để đổi biến $w = r^2/2, \, dw = r\,dr$!):

$$
I^2 = \int_{-\infty}^{+\infty}\int_{-\infty}^{+\infty} e^{-(x^2 + y^2)/2} \, dx\,dy = \int_0^{2\pi} d\theta \int_0^{+\infty} r e^{-r^2/2} \, dr = 2\pi \Big[-e^{-r^2/2}\Big]_0^{+\infty} = 2\pi \implies I = \sqrt{2\pi}
$$

- *Ý 2*: Giải ngược $(u_1, u_2) \in (0, 1)^2$ theo $(z_1, z_2) \in \mathbb{R}^2 \setminus \{(0,0)\}$: bình phương cộng lại cho $z_1^2 + z_2^2 = -2\ln u_1 \implies u_1 = e^{-(z_1^2 + z_2^2)/2}$, và chia tỷ số cho $u_2 = \frac{1}{2\pi}\operatorname{atan2}(z_2, z_1)$ (có $\frac{\partial u_2}{\partial z_1} = -\frac{z_2}{2\pi(z_1^2+z_2^2)}$, $\frac{\partial u_2}{\partial z_2} = \frac{z_1}{2\pi(z_1^2+z_2^2)}$). Tính định thức Jacobian của ánh xạ ngược $(z_1, z_2) \mapsto (u_1, u_2)$:

$$
\det \frac{\partial(u_1, u_2)}{\partial(z_1, z_2)} = \det \begin{pmatrix} -z_1 e^{-(z_1^2+z_2^2)/2} & -z_2 e^{-(z_1^2+z_2^2)/2} \\ -\frac{z_2}{2\pi(z_1^2+z_2^2)} & \frac{z_1}{2\pi(z_1^2+z_2^2)} \end{pmatrix} = -\frac{z_1^2 + z_2^2}{2\pi(z_1^2 + z_2^2)} e^{-(z_1^2+z_2^2)/2} = -\frac{1}{2\pi} e^{-(z_1^2+z_2^2)/2}
$$

Do $(U_1, U_2)$ có mật độ đồng thời bằng $1$ trên $(0, 1)^2$, mật độ đồng thời của $(Z_1, Z_2)$ là $f_{Z_1, Z_2}(z_1, z_2) = 1 \cdot \left|\det \frac{\partial(u_1, u_2)}{\partial(z_1, z_2)}\right| = \left(\frac{1}{\sqrt{2\pi}} e^{-z_1^2/2}\right)\left(\frac{1}{\sqrt{2\pi}} e^{-z_2^2/2}\right)$ — tách tích thành hai hàm mật độ $\mathcal{N}(0, 1)$ độc lập trên toàn bộ $\mathbb{R}^2$! $\blacksquare$

---

## 4. Ma trận Hessian, Khai triển Taylor Bậc hai & Xấp xỉ Delta-Gamma

Với hàm khả vi liên tục hai lần $f \in C^2(\mathbb{R}^n)$, Định lý Schwarz bảo đảm thứ tự lấy đạo hàm hỗn hợp là bất biến ($\frac{\partial^2 f}{\partial x_i \partial x_j} = \frac{\partial^2 f}{\partial x_j \partial x_i}$), tạo nên **ma trận Hessian** đối xứng $H_f(x) = \nabla^2 f(x) \in \mathbb{R}^{n \times n}$ với $[H_f(x)]_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}(x)$. Áp dụng khai triển Taylor một biến cho $\phi(t) = f(x_0 + t\Delta x)$ tại $t = 1$ với $\phi'(0) = \nabla f(x_0)^\top \Delta x$ và $\phi''(0) = \Delta x^\top H_f(x_0) \Delta x$, ta được **Khai triển Taylor Bậc hai Đa chiều**:

$$
f(x_0 + \Delta x) = f(x_0) + \nabla f(x_0)^\top \Delta x + \frac{1}{2} \Delta x^\top H_f(x_0) \Delta x + o\big(\|\Delta x\|_2^2\big)
$$

**Hai Ứng dụng Trực tiếp Trong Tài chính Định lượng:**
1. **Phân loại Cực trị và Tính Lồi**: Tại **điểm dừng** (Stationary Point) $x^\star$ thỏa mãn $\nabla f(x^\star) = 0$, số hạng bậc nhất biến mất nên $f(x^\star + \Delta x) - f(x^\star) \approx \frac{1}{2}\Delta x^\top H_f(x^\star)\Delta x$. Do đó:
   - Nếu $H_f(x^\star) \succ 0$ (mọi trị riêng dương): $x^\star$ là **cực tiểu địa phương chặt**. Đặc biệt nếu $H_f(x) \succeq 0$ với mọi $x$ trên miền lồi, $f$ là **hàm lồi** (Convex Function) và mọi điểm dừng đều là **cực tiểu toàn cục**!
   - Nếu $H_f(x^\star) \prec 0$ (mọi trị riêng âm): $x^\star$ là **cực đại địa phương chặt**.
   - Nếu $H_f(x^\star)$ có cả trị riêng dương lẫn âm: $x^\star$ là **điểm yên ngựa** (Saddle Point) — cong lên theo hướng này nhưng chúi xuống theo hướng khác.
2. **Xấp xỉ Rủi ro Delta-Gamma Danh mục Phái sinh**: Gọi $V(S)$ là giá trị danh mục quyền chọn phụ thuộc vào vector giá $n$ tài sản cơ sở $S \in \mathbb{R}^n$. Trong ngôn ngữ phố Wall, vector đạo hàm bậc nhất là $\Delta = \nabla_S V$ và ma trận đạo hàm bậc hai là $\Gamma = \nabla_S^2 V$, nên thay đổi giá trị danh mục qua cú nhảy giá tức thời $\Delta S$ là $\Delta V \approx \Delta^\top \Delta S + \frac{1}{2}\Delta S^\top \Gamma \Delta S$. Nếu nhà giao dịch phòng hộ trung hòa $\Delta = 0$ bằng tài sản cơ sở trong khi nắm giữ danh mục quyền chọn có $\Gamma \succ 0$, thì $\Delta V \approx \frac{1}{2}\Delta S^\top \Gamma \Delta S > 0$ luôn sinh lời dương bất kể thị trường sập sâu hay tăng bốc đầu (đổi lại họ phải trả phí hao mòn thời gian Theta mỗi ngày!).

---

## 5. Nhân tử Lagrange & Bài toán Danh mục Phương sai Tối thiểu Toàn cục

Xét bài toán tối ưu có ràng buộc đẳng thức: tìm cực trị của $f(x)$ trên mặt ràng buộc $g_k(x) = 0$ ($k = 1, \dots, m$, với các $\nabla g_k(x^\star)$ độc lập tuyến tính). **Trực giác hình học cốt lõi**: Nếu tại $x^\star$, vector $\nabla f(x^\star)$ vẫn còn một thành phần chiếu khác không nằm dọc theo mặt tiếp tuyến của ràng buộc, ta chỉ cần trượt một bước vô cùng bé dọc theo hướng tiếp tuyến đó là giữ nguyên $g(x) = 0$ nhưng cải thiện được $f(x)$! Vậy tại điểm tối ưu $x^\star$, $\nabla f(x^\star)$ bắt buộc phải vuông góc với mặt tiếp tuyến — tức nằm trọn trong không gian pháp tuyến sinh bởi $\{\nabla g_k(x^\star)\}_{k=1}^m$.

Đặt hàm **Lagrange** $\mathcal{L}(x, \lambda) \triangleq f(x) + \sum_{k=1}^m \lambda_k g_k(x)$ với vector **nhân tử Lagrange** (Lagrange Multipliers) $\lambda \in \mathbb{R}^m$, điều kiện cần bậc nhất là:

$$
\nabla_x \mathcal{L}(x^\star, \lambda^\star) = \nabla f(x^\star) + \sum_{k=1}^m \lambda_k^\star \nabla g_k(x^\star) = 0, \qquad g_k(x^\star) = 0 \;\; (k = 1, \dots, m)
$$

**Quy tắc Vàng Đạo hàm Giải tích Ma trận Cần Thuộc Lòng:** Với $a, x \in \mathbb{R}^n$, $A \in \mathbb{R}^{m \times n}$, $b \in \mathbb{R}^m$ và ma trận đối xứng $\Sigma = \Sigma^\top \in \mathbb{R}^{n \times n}$:

| Hàm Vô hướng $f(x)$ ($x \in \mathbb{R}^n$) | Vector Gradient $\nabla f(x) \in \mathbb{R}^n$ | Ma trận Hessian $\nabla^2 f(x) \in \mathbb{R}^{n \times n}$ | Xuất hiện Trong Bài toán Định lượng Nào? |
| :--- | :---: | :---: | :--- |
| $a^\top x = \sum_{i=1}^n a_i x_i$ | $a$ | $0_{n \times n}$ | Lợi nhuận kỳ vọng danh mục $\mu^\top w$ hoặc ràng buộc $\mathbf{1}^\top w = 1$. |
| $\frac{1}{2} x^\top \Sigma x$ ($\Sigma^\top = \Sigma$) | $\Sigma x$ | $\Sigma$ | Phương sai danh mục Markowitz $\frac{1}{2} w^\top \Sigma w$. |
| $\frac{1}{2} \|A x - b\|_2^2$ | $A^\top (A x - b)$ | $A^\top A \succeq 0$ | Hồi quy bình phương tối thiểu ($\nabla f = 0 \iff A^\top A x = A^\top b$!). |
| $-\sum_{i=1}^n x_i \ln x_i$ ($x_i > 0$) | $-\big(1 + \ln x_i\big)_{i=1}^n$ | $-\operatorname{diag}(1/x_1, \dots, 1/x_n) \prec 0$ | Hàm Entropy thông tin Shannon của phân phối xác suất rời rạc. |

**Ví dụ 1 — Dẫn xuất Danh mục Phương sai Tối thiểu Toàn cục (Citadel / BlackRock):**
Cho $N$ tài sản có ma trận hiệp phương sai xác định dương $\Sigma \succ 0$. Tìm vector trọng số đầu tư hết vốn $w \in \mathbb{R}^N$ ($\mathbf{1}^\top w = 1$) cực tiểu hóa phương sai danh mục $\sigma_p^2(w) = w^\top \Sigma w$, và tính phương sai tối thiểu đạt được!
- **Lời giải Đầy đủ Bằng Nhân tử Lagrange**:
  1. Cực tiểu hóa $w^\top \Sigma w$ tương đương cực tiểu hóa $f(w) = \frac{1}{2} w^\top \Sigma w$ (nhân $\frac{1}{2}$ để triệt tiêu số $2$ khi đạo hàm!) dưới ràng buộc $1 - \mathbf{1}^\top w = 0$. Lập hàm Lagrange $\mathcal{L}(w, \lambda) = \frac{1}{2} w^\top \Sigma w + \lambda(1 - \mathbf{1}^\top w)$.
  2. Lấy gradient theo $w$ cho bằng $0$:

$$
\nabla_w \mathcal{L} = \Sigma w - \lambda \mathbf{1} = 0 \iff \Sigma w = \lambda \mathbf{1} \implies w = \lambda \Sigma^{-1} \mathbf{1}
$$

  3. Thế vào phương trình ràng buộc ngân sách $\mathbf{1}^\top w = 1$: $\lambda \big(\mathbf{1}^\top \Sigma^{-1} \mathbf{1}\big) = 1 \implies \lambda^\star = \frac{1}{\mathbf{1}^\top \Sigma^{-1} \mathbf{1}}$ (mẫu số dương chặt vì $\Sigma \succ 0 \implies \Sigma^{-1} \succ 0$).
  4. Vì Hessian $\nabla_w^2 f(w) = \Sigma \succ 0$ xác định dương toàn cục trên tập lồi phẳng $\mathbf{1}^\top w = 1$, nghiệm dừng duy nhất chắc chắn là cực tiểu toàn cục tuyệt đối:

$$
w_{\text{GMVP}}^\star = \frac{\Sigma^{-1} \mathbf{1}}{\mathbf{1}^\top \Sigma^{-1} \mathbf{1}}, \qquad \sigma_{\min}^2 = (w_{\text{GMVP}}^\star)^\top \Sigma w_{\text{GMVP}}^\star = \frac{\mathbf{1}^\top \Sigma^{-1} \Sigma \Sigma^{-1} \mathbf{1}}{\big(\mathbf{1}^\top \Sigma^{-1} \mathbf{1}\big)^2} = \frac{1}{\mathbf{1}^\top \Sigma^{-1} \mathbf{1}} = \lambda^\star
$$

  Chú ý nhân tử $\lambda^\star$ trùng khít với phương sai tối thiểu và đo đúng **giá bóng** (Shadow Price) biên của vốn!

**Ví dụ 2 — Cực đại Hóa Entropy Shannon & Phân phối Đều Ít Giả định Nhất (Two Sigma / DE Shaw):**
Một biến ngẫu nhiên rời rạc nhận $n$ kịch bản với xác suất $p = (p_1, \dots, p_n)^\top \in (0, 1)^n$ thỏa mãn $\sum_{i=1}^n p_i = 1$. Chứng minh bằng Nhân tử Lagrange và ma trận Hessian rằng độ bất định Shannon $H(p) = -\sum_{i=1}^n p_i \ln p_i$ đạt cực đại toàn cục duy nhất tại phân phối đều $p_i^\star = \frac{1}{n}$, từ đó suy ra bất đẳng thức $H(p) \le \ln n$!
- **Lời giải**:
  1. Thiết lập hàm Lagrange cho ràng buộc $\sum_{i=1}^n p_i - 1 = 0$: $\mathcal{L}(p, \lambda) = -\sum_{i=1}^n p_i \ln p_i - \lambda\left(\sum_{i=1}^n p_i - 1\right)$.
  2. Lấy đạo hàm riêng theo từng tọa độ $p_i$ ($i = 1, \dots, n$) và cho bằng $0$:

$$
\frac{\partial \mathcal{L}}{\partial p_i} = -(\ln p_i + 1) - \lambda = 0 \iff \ln p_i = -1 - \lambda \iff p_i = e^{-1 - \lambda}
$$

  3. Mọi $p_i$ đều bằng cùng một hằng số độc lập với chỉ số $i$! Thay vào $\sum_{i=1}^n p_i = 1$ suy ra $n e^{-1-\lambda} = 1 \implies p_1^\star = \dots = p_n^\star = \frac{1}{n}$.
  4. Kiểm tra điều kiện bậc hai toàn cục: Ma trận Hessian của $H(p)$ trên miền mở $(0, \infty)^n$ là ma trận đường chéo $\nabla^2 H(p) = \operatorname{diag}\!\left(-\frac{1}{p_1}, \dots, -\frac{1}{p_n}\right) \prec 0$ (mọi phần tử đường chéo âm nghiêm ngặt nên $H(p)$ là **hàm lõm chặt** toàn cục!). Vậy $p^\star = \left(\frac{1}{n}, \dots, \frac{1}{n}\right)^\top$ là điểm cực đại toàn cục duy nhất, cho giá trị $H(p) \le -\sum_{i=1}^n \frac{1}{n}\ln\frac{1}{n} = \mathbf{\ln n}$!

**Ví dụ 3 — Định lượng Lãi lỗ Bậc hai Delta-Gamma Trên Rổ Phái sinh Đa Tài sản (Optiver / IMC):**
Một nhà tạo lập thị trường nắm giữ rổ quyền chọn trên hai chỉ số cổ phiếu có giá hiện tại $S_0 = (100, \, 200)^\top$ USD. Bàn giao dịch đã bán khống hợp đồng tương lai để phòng hộ trung hòa bậc nhất $\Delta = \nabla_S V(S_0) = (0, \, 0)^\top$, và đo được ma trận độ cong bậc hai $\Gamma = \nabla_S^2 V(S_0) = \begin{pmatrix} 1.2 & -0.4 \\ -0.4 & 0.5 \end{pmatrix}$ (nghìn USD / $\text{USD}^2$).
1. Chứng minh danh mục sở hữu độ lồi dương theo **mọi** hướng biến động giá khác không $\Delta S = (\Delta S_1, \, \Delta S_2)^\top \neq (0, 0)^\top$.
2. Ước tính lãi lỗ tức thời của danh mục theo khai triển Taylor bậc hai khi xảy ra cú sốc lệch pha $\Delta S = (+4, \, -6)^\top$ USD!

- **Lời giải**:
  1. Kiểm tra tiêu chuẩn Sylvester cho ma trận đối xứng $\Gamma$: định thức con cấp một là $\Gamma_{11} = 1.2 > 0$; định thức cấp hai là $\det(\Gamma) = (1.2)(0.5) - (-0.4)^2 = 0.60 - 0.16 = 0.44 > 0$. Vậy $\Gamma \succ 0$ xác định dương nghiêm ngặt, kéo theo $\frac{1}{2} \Delta S^\top \Gamma \Delta S > 0$ với mọi $\Delta S \neq 0$!
  2. Vì $\Delta = 0$, khai triển Taylor bậc hai quanh $S_0$ cho:

$$
\Delta V \approx \Delta^\top \Delta S + \frac{1}{2} \Delta S^\top \Gamma \Delta S = \frac{1}{2}\Big[ 1.2(\Delta S_1)^2 + 2(-0.4)\Delta S_1 \Delta S_2 + 0.5(\Delta S_2)^2 \Big]
$$

  Thay $\Delta S_1 = +4$ và $\Delta S_2 = -6$ (lưu ý hạng tử chéo $-0.8 \times 4 \times (-6) = +19.2$ cộng hưởng làm tăng lãi khi hai tài sản đi ngược chiều!):

$$
\Delta V \approx \frac{1}{2}\Big[ 1.2(16) - 0.8(-24) + 0.5(36) \Big] = \frac{1}{2}(19.2 + 19.2 + 18.0) = \mathbf{+\$28.2\text{ nghìn USD}}
$$

---

## 6. Các Bẫy Giải tích Đa biến Thường gặp

> [!WARNING]
> **Ba Bẫy Kỹ thuật Khiến Lời giải Tối ưu Hóa hoặc Đổi biến Bị Bác bỏ:**
> 1. **Quên Giá trị Tuyệt đối Của Định thức Jacobian Khi Ánh xạ Đảo Chiều Định hướng:** Trong chứng minh Box-Muller ở Mục 3, định thức $\det\frac{\partial(u_1, u_2)}{\partial(z_1, z_2)}$ mang dấu **âm** ($-\frac{1}{2\pi}e^{-(z_1^2+z_2^2)/2}$). Nếu bạn quên trị tuyệt đối $|\det J|$, hàm mật độ xác suất thu được sẽ mang giá trị âm vô nghĩa!
> 2. **Kết luận Cực tiểu Mà Không Kiểm tra Tính Xác định Dương Của Hessian:** Nghiệm của $\nabla_x \mathcal{L} = 0$ chỉ là điểm dừng! Chẳng hạn cực trị hóa $f(x, y) = xy$ trên đường tròn $x^2 + y^2 = 1$ cho bốn điểm dừng $(\pm\frac{1}{\sqrt{2}}, \pm\frac{1}{\sqrt{2}})$, trong đó hai điểm cho cực đại $+1/2$ còn hai điểm cho cực tiểu $-1/2$. Luôn kiểm tra Hessian (hoặc tính đóng và bị chặn của miền ràng buộc theo Định lý Weierstrass) để phân định cực đại và cực tiểu!
> 3. **Dùng Công thức $\nabla_x(x^\top A x) = 2Ax$ Khi $A$ Không Đối xứng:** Nếu ma trận $A$ không đối xứng, đạo hàm đúng phải là $\nabla_x(x^\top A x) = (A + A^\top)x$! Mẹo an toàn tuyệt đối: luôn đối xứng hóa dạng toàn phương ngay từ dòng đầu tiên $x^\top A x = x^\top \!\left(\frac{A + A^\top}{2}\right)\! x$.
