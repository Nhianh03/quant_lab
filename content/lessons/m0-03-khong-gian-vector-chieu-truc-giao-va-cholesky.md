# M0.03 — Không gian Vector, Hạng, Phép chiếu Trực giao, Gram-Schmidt & Phân rã Cholesky

## 1. Trực giác & Động lực: Nhìn Ma trận Như Hình học Không gian Thay Vì Mảng Hai Chiều

Khi lập trình hệ thống phần mềm, hầu hết kỹ sư nhìn nhận ma trận $A \in \mathbb{R}^{m \times n}$ như một mảng hai chiều `float[m][n]` và phép nhân ma trận $Ax$ như ba vòng lặp lồng nhau độ phức tạp $\mathcal{O}(mn)$. Tuy nhiên, khi đọc một bài báo nghiên cứu của Citadel hay chuẩn bị cho học phần `M3.02` và `M4.01`, cách nhìn theo từng ô phần tử sẽ làm bạn chìm nghỉm giữa rừng ký hiệu chỉ số.

Chìa khóa mở toang toàn bộ đại số tuyến tính định lượng nằm ở hai góc nhìn hình học bổ trợ nhau cho tích $Ax$ với $A = [a_1 \;\; a_2 \;\; \dots \;\; a_n] \in \mathbb{R}^{m \times n}$ và $x = (x_1, \dots, x_n)^\top \in \mathbb{R}^n$:
1. **Góc nhìn tổ hợp cột**: $Ax = x_1 a_1 + x_2 a_2 + \dots + x_n a_n$ là một tổ hợp tuyến tính của $n$ vector cột sống trong $\mathbb{R}^m$.
2. **Góc nhìn tích vô hướng hàng**: Tọa độ thứ $i$ của $Ax$ là tích vô hướng giữa hàng thứ $i$ của $A$ và vector $x$.

Khi chuyển sang ngôn ngữ hình học này, bài toán hồi quy bình phương tối thiểu biến thành việc hạ đường vuông góc từ một điểm xuống một mặt phẳng, còn việc mô phỏng $500$ mã cổ phiếu tương quan thực chất là xoay và kéo giãn một quả cầu chuẩn tắc qua ma trận tam giác Cholesky.

---

## 2. Độc lập Tuyến tính, Hạng & Bốn Không gian Con Cơ bản của Gilbert Strang

### 2.1. Cơ sở, Số chiều và Bốn Không gian Con Cốt lõi

Một họ vector $\{v_1, \dots, v_k\} \subseteq \mathbb{R}^m$ được gọi là **độc lập tuyến tính** (Linearly Independent) nếu tổ hợp duy nhất tạo ra vector không là tổ hợp tầm thường: $c_1 v_1 + \dots + c_k v_k = 0 \implies c_1 = \dots = c_k = 0$. Tập mọi tổ hợp tuyến tính của chúng lập thành một **không gian con** (Subspace) $V = \operatorname{span}(v_1, \dots, v_k)$ (luôn chứa gốc $0$ và đóng với phép cộng cùng phép nhân vô hướng). Một hệ sinh độc lập tuyến tính của $V$ gọi là **cơ sở** (Basis), và mọi cơ sở của $V$ đều có cùng số lượng phần tử gọi là **số chiều** $\dim(V)$.

Với mọi ma trận thực $A \in \mathbb{R}^{m \times n}$, số cột độc lập tuyến tính tối đa luôn bằng đúng số hàng độc lập tuyến tính tối đa, được gọi là **hạng của ma trận** (Matrix Rank) $r = \operatorname{rank}(A) \le \min(m, n)$. Giáo sư Gilbert Strang tại MIT đúc kết toàn bộ cấu trúc của $A$ vào **Bốn Không gian Con Cơ bản** (Four Fundamental Subspaces):

| Không gian Con | Ký hiệu & Định nghĩa | Không gian Chứa | Số chiều | Ý nghĩa Thực chiến Trong Danh mục Định lượng (với $A = B^\top \in \mathbb{R}^{K \times N}$ là phơi nhiễm $K$ nhân tố của $N$ mã) |
| :--- | :--- | :---: | :---: | :--- |
| **Không gian Cột** | $\mathcal{C}(A) = \{Ax : x \in \mathbb{R}^n\}$ | $\mathbb{R}^m$ | $r$ | Tập mọi vector phơi nhiễm nhân tố có thể tạo ra từ danh mục $x \in \mathbb{R}^N$. |
| **Không gian Hạch** | $\mathcal{N}(A) = \{x \in \mathbb{R}^n : Ax = 0\}$ | $\mathbb{R}^n$ | $n - r$ | **Không gian danh mục trung hòa nhân tố**: mọi danh mục $x$ có phơi nhiễm bằng đúng $0$ lên toàn bộ $K$ nhân tố! |
| **Không gian Hàng** | $\mathcal{C}(A^\top) = \{A^\top y : y \in \mathbb{R}^m\}$ | $\mathbb{R}^n$ | $r$ | Không gian các danh mục nhân tố thuần túy sinh bởi tổ hợp các hàng phơi nhiễm. |
| **Không gian Hạch Trái** | $\mathcal{N}(A^\top) = \{y \in \mathbb{R}^m : A^\top y = 0\}$ | $\mathbb{R}^m$ | $m - r$ | Các tổ hợp nhân tố dư thừa bị suy biến cộng tuyến hoàn toàn. |

### 2.2. Định lý Hạng – Số chiều và Tính Bù Trực giao Tuyệt đối

Hai vector $u, v \in \mathbb{R}^n$ gọi là **trực giao** (Orthogonal), ký hiệu $u \perp v$, nếu tích vô hướng Euclid $\langle u, v \rangle = u^\top v = \sum_{i=1}^n u_i v_i = 0$; khi đó Định lý Pythagoras khẳng định $\|u + v\|_2^2 = (u + v)^\top(u + v) = \|u\|_2^2 + 2u^\top v + \|v\|_2^2 = \|u\|_2^2 + \|v\|_2^2$. Hai không gian con $V, W \subseteq \mathbb{R}^n$ là **phần bù trực giao** (Orthogonal Complement), viết $W = V^\perp$, nếu mọi vector của $W$ vuông góc với mọi vector của $V$ và $\dim(V) + \dim(W) = n$.

**Định lý 0.6 — Định lý Cơ bản của Đại số Tuyến tính và Hạng – Số chiều (Rank-Nullity Theorem):**
*Cho $A \in \mathbb{R}^{m \times n}$ có hạng $r = \operatorname{rank}(A)$. Khi đó $\operatorname{rank}(A) + \dim\mathcal{N}(A) = n$, đồng thời:*

$$
\mathcal{N}(A) = \mathcal{C}(A^\top)^\perp \;\; \text{trong } \mathbb{R}^n, \qquad \mathcal{N}(A^\top) = \mathcal{C}(A)^\perp \;\; \text{trong } \mathbb{R}^m
$$

**Chứng minh.** Khử Gauss đưa $A$ về dạng bậc thang có đúng $r$ cột chốt độc lập tuyến tính và $(n - r)$ biến tự do; gán lần lượt một biến tự do bằng $1$ và các biến tự do khác bằng $0$ sinh ra đúng $(n - r)$ nghiệm cơ sở độc lập tuyến tính của $Ax = 0$, nên $\dim\mathcal{N}(A) = n - r$. Tiếp theo, $x \in \mathcal{N}(A) \iff Ax = 0 \iff$ tích vô hướng của $x$ với mọi hàng của $A$ đều bằng $0 \iff x$ vuông góc với mọi tổ hợp tuyến tính các hàng của $A$, tức $(A^\top y)^\top x = y^\top (Ax) = 0$ ($\forall y \in \mathbb{R}^m$). Kết hợp tổng số chiều $\dim\mathcal{C}(A^\top) + \dim\mathcal{N}(A) = r + (n - r) = n$, ta suy ra $\mathcal{N}(A) = \mathcal{C}(A^\top)^\perp$ (mọi vector $x \in \mathbb{R}^n$ đều phân tách duy nhất thành $x = x_{\text{row}} + x_{\text{null}}$ với $x_{\text{row}} \perp x_{\text{null}}$!). Thay $A$ bởi $A^\top$ chứng minh vế còn lại. $\blacksquare$

---

## 3. Hình học Phép chiếu Trực giao & Phương trình Chuẩn

Giả sử hệ phương trình $Ax = b$ với $A \in \mathbb{R}^{m \times n}$ ($m > n$, đủ hạng cột $\operatorname{rank}(A) = n$) vô nghiệm vì vector mục tiêu $b \in \mathbb{R}^m$ nằm chệch ra ngoài không gian cột $\mathcal{C}(A)$ (điển hình: hồi quy lợi nhuận $m = 1{,}000$ phiên của cổ phiếu theo $n = 3$ nhân tố Fama-French). Làm sao tìm điểm $\hat{b} = A\hat{x} \in \mathcal{C}(A)$ gần $b$ nhất theo chuẩn $\ell_2$, tức cực tiểu hóa $\|b - Ax\|_2^2$ mà không cần đạo hàm giải tích?

**Định lý 0.7 — Phép chiếu Trực giao và Tính Lũy đẳng Đối xứng:**
*Với $A \in \mathbb{R}^{m \times n}$ có $\operatorname{rank}(A) = n$, ma trận Gram $A^\top A \in \mathbb{R}^{n \times n}$ đối xứng xác định dương nên khả nghịch. Nghiệm duy nhất cực tiểu hóa $\|b - Ax\|_2^2$ thỏa mãn phương trình chuẩn $A^\top A \hat{x} = A^\top b$, cho bởi:*

$$
\hat{x} = (A^\top A)^{-1} A^\top b, \qquad \hat{b} = P b \quad \text{với} \quad P = A(A^\top A)^{-1} A^\top \in \mathbb{R}^{m \times m}
$$

*Hơn nữa, ma trận chiếu $P$ và ma trận chiếu phần dư $M = I_m - P$ đều **đối xứng** ($P^\top = P$) và **lũy đẳng** ($P^2 = P$, $M^2 = M$, $PM = 0$).*

**Chứng minh Hình học Bằng Pythagoras.**
1. *Khả nghịch của $A^\top A$*: Với mọi $v \in \mathbb{R}^n \setminus \{0\}$, do cột của $A$ độc lập tuyến tính nên $Av \neq 0 \implies v^\top (A^\top A) v = \|Av\|_2^2 > 0$. Vậy $A^\top A$ xác định dương nghiêm ngặt, suy ra $\mathcal{N}(A^\top A) = \{0\}$ và $(A^\top A)^{-1}$ tồn tại duy nhất.
2. *Tính vuông góc tối ưu*: Chọn $\hat{x} = (A^\top A)^{-1} A^\top b$ và đặt vector phần dư $e = b - A\hat{x}$. Kiểm tra thấy ngay $A^\top e = A^\top b - (A^\top A)(A^\top A)^{-1} A^\top b = 0$, nghĩa là $e \in \mathcal{N}(A^\top) = \mathcal{C}(A)^\perp$! Với bất kỳ ứng viên $x \in \mathbb{R}^n$ nào khác, hiệu $A\hat{x} - Ax = A(\hat{x} - x)$ nằm trong $\mathcal{C}(A)$ nên vuông góc với $e$. Áp dụng Định lý Pythagoras cho $b - Ax = e + A(\hat{x} - x)$:

$$
\|b - Ax\|_2^2 = \|e\|_2^2 + \big\|A(\hat{x} - x)\big\|_2^2 \ge \|e\|_2^2
$$

Dấu bằng chỉ xảy ra khi $A(\hat{x} - x) = 0 \iff x = \hat{x}$! Kiểm tra đại số trực tiếp cho $P^\top = \big(A(A^\top A)^{-1}A^\top\big)^\top = P$ và $P^2 = A(A^\top A)^{-1}(A^\top A)(A^\top A)^{-1}A^\top = P$ (chiếu thêm lần thứ hai lên cùng một mặt phẳng giữ nguyên điểm ảnh!). $\blacksquare$

---

## 4. Trực chuẩn hóa Gram-Schmidt, Phân rã $QR$ & Thể tích Định thức

Nếu các cột của $Q = [q_1 \dots q_n] \in \mathbb{R}^{m \times n}$ đã đôi một **trực chuẩn** (Orthonormal) — tức $q_i^\top q_j = \delta_{ij} \iff Q^\top Q = I_n$ — thì ma trận chiếu giản lược ngoạn mục thành $P = Q Q^\top = \sum_{k=1}^n q_k q_k^\top$ mà không tốn bất kỳ phép nghịch đảo nào! Thuật toán **Gram-Schmidt** xây dựng cơ sở trực chuẩn $\{q_1, \dots, q_n\}$ từ các cột độc lập tuyến tính $\{a_1, \dots, a_n\}$ của $A$ bằng cách ở mỗi bước thứ $k$, lột bỏ toàn bộ hình chiếu của $a_k$ lên $(k - 1)$ trục trực chuẩn trước đó rồi chuẩn hóa độ dài:

$$
u_1 = a_1, \quad q_1 = \frac{u_1}{\|u_1\|_2}; \qquad u_k = a_k - \sum_{j=1}^{k-1} \big(q_j^\top a_k\big) q_j, \quad q_k = \frac{u_k}{\|u_k\|_2} \quad (k = 2, \dots, n)
$$

Chuyển vế $a_k = \sum_{j=1}^{k-1} r_{jk} q_j + r_{kk} q_k$ với $r_{jk} = q_j^\top a_k$ ($j < k$) và $r_{kk} = \|u_k\|_2 > 0$, ta thu được **Phân rã $QR$** (QR Decomposition):

$$
A = Q R, \qquad Q \in \mathbb{R}^{m \times n} \; (Q^\top Q = I_n), \qquad R = \begin{pmatrix} r_{11} & r_{12} & \cdots & r_{1n} \\ 0 & r_{22} & \cdots & r_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & r_{nn} \end{pmatrix} \in \mathbb{R}^{n \times n}
$$

Thay $A = QR$ vào phương trình chuẩn $A^\top A \hat{x} = A^\top b$ cho $R^\top (Q^\top Q) R \hat{x} = R^\top Q^\top b \iff R \hat{x} = Q^\top b$, giải ngay bằng phép thế ngược tam giác trên trong $\mathcal{O}(n^2)$!

**Ý nghĩa Hình học Tuyệt đẹp của Định thức qua $A = QR$:** Với ma trận vuông $A \in \mathbb{R}^{n \times n}$, ma trận vuông trực giao $Q$ chỉ thực hiện phép quay hoặc đối xứng gương bảo toàn độ dài và góc ($\det(Q^\top Q) = (\det Q)^2 = 1 \implies |\det Q| = 1$). Do định thức của ma trận tam giác bằng tích đường chéo:

$$
|\det(A)| = |\det(Q)| \cdot |\det(R)| = 1 \cdot \prod_{k=1}^n r_{kk} = \|u_1\|_2 \cdot \|u_2\|_2 \cdots \|u_n\|_2
$$

Nhận xét rằng $\|u_1\|_2 = \|a_1\|_2$ là cạnh đáy đầu tiên, $\|u_2\|_2$ là chiều cao hạ vuông góc từ $a_2$ xuống $a_1$, và $\|u_k\|_2$ là chiều cao hạ vuông góc từ $a_k$ xuống siêu phẳng $(k - 1)$ chiều trước đó! Vậy **$|\det(A)|$ chính là thể tích $n$ chiều của khối hộp bình hành dựng trên các cột của $A$** (và dấu của $\det(A)$ cho biết định hướng tay phải hay tay trái). Khi các cột phụ thuộc tuyến tính, một chiều cao sụp về $\|u_k\|_2 = 0$, kéo thể tích $\det(A) = 0$!

---

## 5. Phân rã Cholesky & Mô phỏng Monte Carlo Đa Tài sản

Một ma trận đối xứng thực $\Sigma \in \mathbb{R}^{N \times N}$ ($\Sigma^\top = \Sigma$) được gọi là **xác định dương đối xứng** (Symmetric Positive Definite — `SPD`, viết $\Sigma \succ 0$) nếu $x^\top \Sigma x > 0$ với mọi $x \in \mathbb{R}^N \setminus \{0\}$ (theo **Tiêu chuẩn Sylvester**, điều này tương đương toàn bộ $N$ định thức con chính dẫn đầu từ góc trên bên trái đều dương nghiêm ngặt: $\Delta_1 > 0, \Delta_2 > 0, \dots, \Delta_N = \det(\Sigma) > 0$).

**Định lý 0.8 — Phân rã Cholesky và Phép Biến đổi Tương quan Đa chiều:**
1. *Mọi ma trận $\Sigma \succ 0$ đều phân rã duy nhất dưới dạng $\Sigma = L L^\top$, trong đó nhân tử Cholesky $L \in \mathbb{R}^{N \times N}$ là ma trận tam giác dưới có đường chéo dương ($L_{jj} > 0$), tính tuần tự từ cột $j = 1$ đến $N$:*

$$
L_{jj} = \sqrt{\Sigma_{jj} - \sum_{k=1}^{j-1} L_{jk}^2}, \qquad L_{ij} = \frac{1}{L_{jj}}\left(\Sigma_{ij} - \sum_{k=1}^{j-1} L_{ik} L_{jk}\right) \quad (i > j)
$$

2. *Nếu $Z = (Z_1, \dots, Z_N)^\top \sim \mathcal{N}(0, I_N)$ là vector gồm $N$ biến chuẩn tắc độc lập ($\operatorname{Cov}(Z) = I_N$), thì vector biến đổi tuyến tính $R = \mu + L Z$ tuân theo phân phối chuẩn đa chiều $\mathcal{N}(\mu, \Sigma)$ với đúng kỳ vọng $\mathbb{E}[R] = \mu$ và ma trận hiệp phương sai $\operatorname{Cov}(R) = \Sigma$!*

**Chứng minh.**
- *Ý 1 (Quy nạp phân khối)*: Với $N = 1$, $\Sigma_{11} > 0 \implies L_{11} = \sqrt{\Sigma_{11}} > 0$ duy nhất. Giả sử đúng tới cấp $N - 1$, chia khối $\Sigma = \begin{pmatrix} \sigma_{11} & c^\top \\ c & \Sigma_{22} \end{pmatrix}$ với $\sigma_{11} = e_1^\top \Sigma e_1 > 0$. Đặt $l_{11} = \sqrt{\sigma_{11}} > 0$ và vector cột dưới $l_{21} = \frac{1}{l_{11}}c$. Ta cần tìm tam giác dưới $L_{22}$ sao cho:

$$
\begin{pmatrix} l_{11} & 0 \\ l_{21} & L_{22} \end{pmatrix} \begin{pmatrix} l_{11} & l_{21}^\top \\ 0 & L_{22}^\top \end{pmatrix} = \begin{pmatrix} l_{11}^2 & l_{11} l_{21}^\top \\ l_{11} l_{21} & l_{21} l_{21}^\top + L_{22} L_{22}^\top \end{pmatrix} = \begin{pmatrix} \sigma_{11} & c^\top \\ c & \Sigma_{22} \end{pmatrix}
$$

Phần bù Schur $S = \Sigma_{22} - \frac{1}{\sigma_{11}} c c^\top \in \mathbb{R}^{(N-1)\times(N-1)}$ đối xứng và xác định dương nghiêm ngặt, bởi với mọi $v \in \mathbb{R}^{N-1} \setminus \{0\}$, xét vector ghép $x = \big(-\frac{c^\top v}{\sigma_{11}}, \, v^\top\big)^\top \neq 0$ cho $0 < x^\top \Sigma x = v^\top S v$! Áp dụng giả thiết quy nạp cho $S = L_{22} L_{22}^\top$ hoàn tất chứng minh tồn tại và duy nhất (đồng nhất từng phần tử $(i, j)$ của $\Sigma_{ij} = \sum_{k=1}^{\min(i,j)} L_{ik} L_{jk}$ rút ra đúng công thức căn đệ quy ở trên!).
- *Ý 2*: Theo tính tuyến tính kỳ vọng, $\mathbb{E}[R] = \mu + L \mathbb{E}[Z] = \mu$. Ma trận hiệp phương sai bằng:

$$
\operatorname{Cov}(R) = \mathbb{E}\big[(R - \mu)(R - \mu)^\top\big] = \mathbb{E}\big[(L Z)(L Z)^\top\big] = L \, \mathbb{E}[Z Z^\top] \, L^\top = L I_N L^\top = L L^\top = \Sigma \quad \blacksquare
$$

> [!NOTE]
> **Tại sao Phân rã Cholesky Nhanh Gấp Đôi Khử Gauss Khi Giải Hệ Tối ưu Danh mục?**
> Khi giải hệ phương trình tuyến tính đối xứng xác định dương $\Sigma w = \alpha$ (chẳng hạn tìm trọng số Markowitz cho $N = 2{,}000$ mã cổ phiếu), phép phân rã $LU$ tổng quát tốn $\frac{2}{3}N^3$ phép toán dấu chấm động. Trong khi đó, nhờ tính đối xứng, phân rã Cholesky $\Sigma = L L^\top$ chỉ tốn đúng **$\frac{1}{3}N^3$ phép toán** (một nửa chi phí!), sau đó giải hai hệ tam giác liên tiếp trong $\mathcal{O}(N^2)$: thế xuôi $L y = \alpha$ tìm $y$, rồi thế ngược $L^\top w = y$ tìm $w$ mà không cần hoán vị hàng chốt!

---

## 6. Ví dụ Phỏng vấn Thực chiến: Mô phỏng Cholesky $3 \times 3$ & Phân rã $QR$ Trung hòa Alpha

**Ví dụ 1 — Tính Tay Nhân tử Cholesky $3 \times 3$ Trong Phỏng vấn Bàn Phái sinh (Citadel / Optiver):**
Cho ma trận tương quan của ba tài sản chuẩn hóa $\sigma_1 = \sigma_2 = \sigma_3 = 1$:

$$
C = \begin{pmatrix} 1 & 0.60 & 0 \\ 0.60 & 1 & 0.50 \\ 0 & 0.50 & 1 \end{pmatrix}
$$

Kiểm tra tính xác định dương của $C$ và viết công thức sinh bộ ba chuẩn tương quan $(X_1, X_2, X_3)$ từ $(Z_1, Z_2, Z_3) \stackrel{\text{i.i.d.}}{\sim} \mathcal{N}(0, 1)$!
- **Lời giải**:
  1. Kiểm tra Sylvester: $\Delta_1 = 1 > 0$; $\Delta_2 = 1 - 0.60^2 = 0.64 > 0$; $\Delta_3 = \det(C) = 1(1 - 0.25) - 0.60(0.60 - 0) + 0 = 0.75 - 0.36 = 0.39 > 0 \implies C \succ 0$!
  2. Chạy công thức Cholesky từng cột:
     - Cột $1$: $L_{11} = \sqrt{1} = 1$, $L_{21} = \frac{0.60}{1} = 0.60$, $L_{31} = \frac{0}{1} = 0$.
     - Cột $2$: $L_{22} = \sqrt{1 - 0.60^2} = \sqrt{0.64} = 0.80$; $L_{32} = \frac{0.50 - 0 \times 0.60}{0.80} = \frac{5}{8} = 0.625$.
     - Cột $3$: $L_{33} = \sqrt{1 - 0^2 - (5/8)^2} = \sqrt{1 - \frac{25}{64}} = \frac{\sqrt{39}}{8} \approx 0.7806$.
  3. Công thức mô phỏng tường minh $X = L Z$: $X_1 = Z_1$, $X_2 = 0.60 Z_1 + 0.80 Z_2$, và $X_3 = 0.625 Z_2 + \frac{\sqrt{39}}{8} Z_3$! (Chú ý trường hợp $2 \times 2$ cực kỳ quen thuộc cần thuộc nằm lòng: $X_1 = Z_1$ và $X_2 = \rho Z_1 + \sqrt{1 - \rho^2} Z_2$).

**Ví dụ 2 — Thực hành Gram-Schmidt, Phân rã $QR$ và Khử Đa Nhân tố Cho Vector Tín hiệu (WorldQuant / Two Sigma):**
Trên vũ trụ $m = 4$ cổ phiếu, cho ma trận phơi nhiễm $n = 2$ nhân tố $A = [a_1 \;\; a_2]$ gồm cột thị trường $a_1 = (1, 1, 1, 1)^\top$ và cột quy mô vốn hóa $a_2 = (3, 1, 1, -1)^\top$, cùng vector tín hiệu thô $b = (6, 2, 0, -4)^\top$.
1. Chạy Gram-Schmidt tìm phân rã $A = Q R$ và tính thể tích hình bình hành $2$ chiều dựng bởi $(a_1, a_2)$ trong $\mathbb{R}^4$.
2. Giải hệ $R \hat{x} = Q^\top b$ để tìm phần chiếu nhân tố $\hat{b} = Q Q^\top b$ và tín hiệu phần dư thuần khiết $e = b - \hat{b}$!

- **Lời giải Từng Bước**:
  1. **Trực chuẩn hóa Gram-Schmidt**:
     - Trục thứ nhất: $\|a_1\|_2 = \sqrt{4} = 2 \implies r_{11} = 2$ và $q_1 = \frac{1}{2}(1, 1, 1, 1)^\top$.
     - Chiếu $a_2$ lên $q_1$: $r_{12} = q_1^\top a_2 = \frac{1}{2}(3 + 1 + 1 - 1) = 2$. Trừ hình chiếu: $u_2 = a_2 - r_{12} q_1 = (3, 1, 1, -1)^\top - (1, 1, 1, 1)^\top = (2, 0, 0, -2)^\top$.
     - Chuẩn hóa trục thứ hai: $r_{22} = \|u_2\|_2 = \sqrt{2^2 + (-2)^2} = 2\sqrt{2}$, nên $q_2 = \frac{1}{\sqrt{2}}(1, 0, 0, -1)^\top$.

$$
Q = \begin{pmatrix} 1/2 & 1/\sqrt{2} \\ 1/2 & 0 \\ 1/2 & 0 \\ 1/2 & -1/\sqrt{2} \end{pmatrix}, \qquad R = \begin{pmatrix} 2 & 2 \\ 0 & 2\sqrt{2} \end{pmatrix}
$$

     Diện tích hình bình hành căng bởi $(a_1, a_2)$ bằng tích đường chéo của $R$: $\text{Area} = r_{11} r_{22} = 2 \times 2\sqrt{2} = \mathbf{4\sqrt{2}}$ (khớp với $\sqrt{\det(A^\top A)} = \sqrt{4 \times 12 - 4^2} = \sqrt{32} = 4\sqrt{2}$!).
  2. **Chiếu trực giao và trích xuất Alpha phần dư**:
     - Tính $Q^\top b = \big(q_1^\top b, \, q_2^\top b\big)^\top = \left(\frac{6 + 2 + 0 - 4}{2}, \, \frac{6 - (-4)}{\sqrt{2}}\right)^\top = (2, \, 5\sqrt{2})^\top$.
     - Giải thế ngược $R\hat{x} = Q^\top b$: hàng dưới $2\sqrt{2}\hat{x}_2 = 5\sqrt{2} \implies \hat{x}_2 = 2.5$; hàng trên $2\hat{x}_1 + 2(2.5) = 2 \implies \hat{x}_1 = -1.5$.
     - Phần chiếu nhân tố là $\hat{b} = 2 q_1 + 5\sqrt{2} q_2 = (1, 1, 1, 1)^\top + (5, 0, 0, -5)^\top = (6, 1, 1, -4)^\top$, suy ra tín hiệu phần dư $e = b - \hat{b} = \mathbf{(0, \, 1, \, -1, \, 0)^\top}$ (kiểm tra tức thì: $a_1^\top e = 0$ và $a_2^\top e = 0$ — trung hòa tuyệt đối cả hai nhân tố!).

---

## 7. Cạm bẫy Đại số Tuyến tính Số Học Khi Lập trình

> [!WARNING]
> **Ba Cạm bẫy Phổ biến Làm Sập Hệ thống Tối ưu và Mô phỏng Định lượng:**
> 1. **Ghép Tay Ma trận Tương quan Vi phạm Điều kiện Xác định Dương:** Nhiều người kiểm định căng thẳng kịch bản khủng hoảng bằng cách tự gán $\rho_{12} = 0.8$, $\rho_{23} = 0.8$ nhưng giữ $\rho_{13} = -0.5$. Khi đó $\det(C) = 1 - 0.64 - 0.64 - 0.25 + 2(0.8)(0.8)(-0.5) = -1.17 < 0$ — ma trận bất khả thi về mặt toán học khiến `scipy.linalg.cholesky` lập tức ném ngoại lệ căn số âm! (Với $\rho_{12} = \rho_{23} = 0.8$, điều kiện $\det(C) \ge 0$ bắt buộc $\rho_{13} \ge 2(0.8^2) - 1 = +0.28$!).
> 2. **Suy biến Hạng Khi Cửa sổ Thời gian Ngắn Hơn Số Tài sản ($T < N$):** Nếu bạn ước lượng ma trận hiệp phương sai mẫu $\hat{\Sigma} = \frac{1}{T - 1} X^\top X \in \mathbb{R}^{N \times N}$ cho $N = 500$ cổ phiếu chỉ từ $T = 250$ ngày giao dịch, hạng tối đa của $\hat{\Sigma}$ chỉ là $\operatorname{rank}(\hat{\Sigma}) \le T - 1 = 249 < 500$. Tối thiểu $251$ chiều rơi vào không gian hạch $\mathcal{N}(\hat{\Sigma})$ có phương sai mẫu bằng đúng $0$, làm $\det(\hat{\Sigma}) = 0$ và phá vỡ hoàn toàn phép nghịch đảo hay phân rã Cholesky chuẩn (đây chính là lý do bắt buộc phải dùng Co rút Ledoit-Wolf ở `M4.02`!).
> 3. **Mất Tính Trực giao Trong Gram-Schmidt Cổ điển (`CGS` vs `MGS` / Householder):** Khi các cột của $A$ gần cộng tuyến, phép trừ tất cả hình chiếu cùng lúc từ vector gốc $a_k$ làm tích tụ sai số triệt tiêu dấu chấm động khiến các $q_k$ không còn vuông góc. Trong thực tế sản xuất, luôn dùng `numpy.linalg.qr` dựa trên phép phản xạ Householder ổn định ngược tuyệt đối!

### 7.1. Bảng Tóm tắt Kiểm tra Tính Chất Ma trận Vuông Thực $M \in \mathbb{R}^{N \times N}$

| Lớp Ma trận | Điều kiện Đại số Định nghĩa | Tính Chất Đường chéo / Định thức | Vai trò Điển hình Trong Định lượng |
| :--- | :--- | :--- | :--- |
| **Ma trận Chiếu Trực giao** $P$ | $P^\top = P$ và $P^2 = P$ | $\operatorname{tr}(P) = \operatorname{rank}(P)$, $\det(P) \in \{0, 1\}$ | Chiếu hồi quy tuyến tính và khử nhân tố rủi ro. |
| **Ma trận Trực giao** $Q$ | $Q^\top Q = Q Q^\top = I_N$ | Bảo toàn chuẩn $\|Qx\|_2 = \|x\|_2$, $\det(Q) = \pm 1$ | Xoay hệ trục sang cơ sở danh mục trị riêng. |
| **Ma trận Xác định Dương** $\Sigma$ | $\Sigma^\top = \Sigma$ và $x^\top \Sigma x > 0 \; (\forall x \neq 0)$ | $\Sigma_{ii} > 0$, mọi định thức con chính $> 0$, $\Sigma = L L^\top$ | Ma trận hiệp phương sai không suy biến của tài sản. |
