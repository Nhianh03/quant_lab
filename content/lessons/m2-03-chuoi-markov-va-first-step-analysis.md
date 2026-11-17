# M2.03 — Chuỗi Markov Thời gian Rời rạc, Phân tích Bước Đầu tiên & Trạng thái Hấp thụ

## 1. Trực giác & Động lực: Mở rộng Máy Trạng thái Hữu hạn sang Thế giới Ngẫu nhiên

Mọi kỹ sư phần mềm đều quen thuộc với Máy Trạng thái Hữu hạn Tất định (`DFA` — Deterministic Finite Automaton) trong trình biên dịch và khớp biểu thức chính quy: tại mỗi nút trạng thái $i$, đọc một ký tự đầu vào cố định sẽ nhảy chắc chắn sang một nút kế tiếp $j$. Khi thay thế các mũi tên tất định đó bằng một phân phối xác suất chuyển tiếp $p_{ij}$ phụ thuộc duy nhất vào trạng thái hiện tại mà không cần lưu trữ toàn bộ lịch sử đường đi trước đó, ta thu được **Chuỗi Markov Thời gian Rời rạc** (Discrete-Time Markov Chain — `DTMC`).

Trong cả nghiên cứu vi cấu trúc thị trường (mô hình hóa độ dài hàng đợi sổ lệnh Cấp độ 1, chuyển đổi chế độ biến động thấp - cao) lẫn phỏng vấn định lượng Phố Wall (tính xác suất chạm rào cản chốt lời trước cắt lỗ, thời gian chờ trung bình để xuất hiện một mẫu tín hiệu chuỗi, hoặc thời gian quay lại đỉnh sổ), chuỗi Markov cung cấp một quy trình cơ giới hóa tuyệt đối: **biến bài toán xác suất vô hạn bước thành giải một hệ phương trình đại số tuyến tính hữu hạn chiều**.

---

## 2. Định nghĩa Chuỗi Markov & Phương trình Chapman - Kolmogorov

### 2.1. Tính chất Không nhớ Quá khứ Xa & Ma trận Ngẫu nhiên Hàng

Cho dãy biến ngẫu nhiên $(X_0, X_1, X_2, \dots)$ nhận giá trị trên không gian trạng thái hữu hạn hoặc đếm được $S$. Quá trình $(X_n)_{n \ge 0}$ được gọi là một **chuỗi Markov thuần nhất theo thời gian** nếu với mọi $n \ge 0$ và mọi lịch sử trạng thái $i_0, i_1, \dots, i_{n-1}, i, j \in S$ có xác suất điều kiện dương:

$$
\mathbb{P}(X_{n+1} = j \mid X_n = i, X_{n-1} = i_{n-1}, \dots, X_0 = i_0) = \mathbb{P}(X_{n+1} = j \mid X_n = i) = p_{ij}
$$

Toàn bộ động lực học của hệ thống được đóng gói trọn vẹn trong **ma trận chuyển trạng thái một bước** $P = (p_{ij})_{i, j \in S}$, là một ma trận ngẫu nhiên theo hàng (Row-Stochastic Matrix) thỏa mãn $p_{ij} \ge 0$ với mọi $i, j \in S$ và tổng mỗi hàng bằng $1$: $\sum_{j \in S} p_{ij} = 1$ (viết dưới dạng vector cột toàn số một $\mathbf{1}$ là $P\mathbf{1} = \mathbf{1}$, chứng tỏ $\lambda = 1$ luôn là một trị riêng của $P$).

> [!TIP]
> **Mẹo Thiết kế Trạng thái của Kỹ sư Phần mềm:** Nếu một bài toán phụ thuộc vào $2$ bước gần nhất (ví dụ $X_{n+1}$ phụ thuộc vào cả $X_n$ và $X_{n-1}$), quá trình gốc $X_n$ không có tính Markov bậc nhất, nhưng bạn chỉ cần định nghĩa trạng thái ghép $Y_n = (X_{n-1}, X_n) \in S \times S$ là $(Y_n)$ lập tức trở thành một chuỗi Markov bậc nhất chính tắc!

**Định lý 2.7 (Phương trình Chapman - Kolmogorov & Lũy thừa Ma trận).** *Đặt xác suất chuyển tiếp $n$ bước $p_{ij}^{(n)} = \mathbb{P}(X_{m+n} = j \mid X_m = i)$. Với mọi số nguyên không âm $m, n \ge 0$ và mọi cặp $i, j \in S$:*

$$
p_{ij}^{(m + n)} = \sum_{k \in S} p_{ik}^{(m)} p_{kj}^{(n)}, \qquad \text{tương đương } P^{(n)} = P^n \text{ và } \mu_n = \mu_0 P^n
$$

*trong đó $\mu_n$ là vector hàng phân phối xác suất biên $\mu_n(j) = \mathbb{P}(X_n = j)$ tại thời điểm $n$.*

**Chứng minh.** Tách biến cố $\{X_{m+n} = j\}$ theo toàn bộ các trạng thái trung gian xung khắc có thể ghé qua tại mốc thời gian $m$, tức $\{X_m = k\}_{k \in S}$, rồi áp dụng công thức xác suất toàn phần có điều kiện:

$$
p_{ij}^{(m+n)} = \sum_{k \in S} \mathbb{P}(X_{m+n} = j, X_m = k \mid X_0 = i) = \sum_{k \in S} \mathbb{P}(X_m = k \mid X_0 = i) \, \mathbb{P}(X_{m+n} = j \mid X_m = k, X_0 = i)
$$

Theo tính chất Markov tại thời điểm $m$ và tính thuần nhất thời gian, thừa số thứ hai rút gọn thành $\mathbb{P}(X_{m+n} = j \mid X_m = k) = p_{kj}^{(n)}$, còn thừa số thứ nhất là $p_{ik}^{(m)}$. Tổng $\sum_{k \in S} p_{ik}^{(m)} p_{kj}^{(n)}$ chính là định nghĩa phép nhân hàng $i$ của ma trận $P^{(m)}$ với cột $j$ của ma trận $P^{(n)}$, quy nạp suy ra $P^{(n)} = P^n$. $\blacksquare$

---

## 3. Phân loại Trạng thái, Phân phối Dừng & Cân bằng Chi tiết

### 3.1. Tính Bất khả quy, Chu kỳ và Hồi quy Ergodic

Để biết khi $n \to \infty$ chuỗi Markov quên đi điểm xuất phát hay dao động vĩnh viễn, ta phân tích cấu trúc đồ thị có hướng của các cạnh $i \to j$ có $p_{ij} > 0$:
- **Liên thông & Bất khả quy** (Irreducibility): Trạng thái $i$ dẫn tới $j$ ($i \to j$) nếu tồn tại $n \ge 0$ sao cho $p_{ij}^{(n)} > 0$. Chuỗi gọi là **bất khả quy** nếu mọi cặp trạng thái đều đi tới được nhau ($i \leftrightarrow j$ với mọi $i, j \in S$).
- **Tính Phi tuần hoàn** (Aperiodicity): Chu kỳ của trạng thái $i$ là ước chung lớn nhất $d(i) = \gcd\{n \ge 1 : p_{ii}^{(n)} > 0\}$. Nếu $d(i) = 1$, trạng thái gọi là **phi tuần hoàn** (lưu ý mẹo nhận diện nhanh: chỉ cần một trạng thái trong lớp liên thông có khuyên tự lặp $p_{ii} > 0$ thì toàn bộ lớp đó chắc chắn có chu kỳ $d = 1$!).
- **Hồi quy so với Thoáng qua** (Recurrent vs Transient): Gọi $T_i^+ = \inf\{n \ge 1 : X_n = i\}$ là thời điểm đầu tiên quay lại $i$. Trạng thái $i$ là **hồi quy** nếu $\mathbb{P}_i(T_i^+ < \infty) = 1$ (tương đương $\sum_{n=1}^\infty p_{ii}^{(n)} = \infty$, chuỗi chắc chắn quay lại $i$ vô hạn lần) và là **thoáng qua** nếu $\mathbb{P}_i(T_i^+ < \infty) < 1$ (tương đương $\sum_{n=1}^\infty p_{ii}^{(n)} < \infty$). Trong không gian trạng thái hữu hạn, không thể mọi trạng thái đều thoáng qua, và nếu chuỗi hữu hạn bất khả quy thì mọi trạng thái đều hồi quy dương.

**Định lý 2.8 (Phân phối Dừng Duy nhất, Hội tụ Ergodic & Thời gian Quay lại Kac).** *Một phân phối xác suất hàng $\pi = (\pi_i)_{i \in S}$ ($\pi_i \ge 0, \sum_{i \in S} \pi_i = 1$) được gọi là **phân phối dừng** (Stationary Distribution) nếu thỏa mãn phương trình trị riêng trái $\pi P = \pi$, tức $\pi_j = \sum_{i \in S} \pi_i p_{ij}$ với mọi $j \in S$. Nếu chuỗi Markov trên không gian hữu hạn $S$ là **bất khả quy**, tồn tại duy nhất một phân phối dừng $\pi$ với $\pi_j > 0$ liên hệ trực tiếp với kỳ vọng thời gian quay lại trạng thái $j$ qua công thức Kac:*

$$
\pi_j = \frac{1}{\mathbb{E}_j\big[T_j^+\big]} \iff \mathbb{E}_j\big[T_j^+\big] = \frac{1}{\pi_j}
$$

*Hơn nữa, nếu chuỗi đồng thời **phi tuần hoàn**, phân phối $n$ bước hội tụ về $\pi$ bất chấp điểm xuất phát: $\lim_{n \to \infty} p_{ij}^{(n)} = \pi_j$ với mọi $i, j \in S$.*

### 3.2. Chuỗi Thuận nghịch & Phương trình Cân bằng Chi tiết (Detailed Balance)

Giải trực tiếp hệ $\pi P = \pi$ cấp $|S| \times |S|$ bằng khử Gauss rất tốn thời gian trong phỏng vấn. Rất nhiều mô hình vật lý thống kê, bước đi trên đồ thị và hàng đợi sổ lệnh sở hữu tính đối xứng dòng chảy từng cặp gọi là **Cân bằng Chi tiết**:

$$
\pi_i p_{ij} = \pi_j p_{ji} \quad (\forall i, j \in S)
$$

**Mệnh đề 2.2 (Cân bằng Chi tiết Kéo theo Phân phối Dừng).** *Nếu tìm được vector dương $(\pi_i)_{i \in S}$ có tổng bằng $1$ thỏa mãn $\pi_i p_{ij} = \pi_j p_{ji}$ với mọi cặp $(i, j)$, thì $\pi$ chắc chắn là phân phối dừng của $P$.*

**Chứng minh (2 dòng).** Với mọi trạng thái $j \in S$, lấy tổng vế trái theo toàn bộ $i \in S$ và thế $\pi_i p_{ij} = \pi_j p_{ji}$:

$$
(\pi P)_j = \sum_{i \in S} \pi_i p_{ij} = \sum_{i \in S} \pi_j p_{ji} = \pi_j \sum_{i \in S} p_{ji} = \pi_j \cdot 1 = \pi_j
$$

vì tổng hàng thứ $j$ của ma trận chuyển tiếp $P$ bằng $1$! Áp dụng ngay cho hai hệ thống kinh điển:
1. **Bước đi ngẫu nhiên đều trên đồ thị vô hướng liên thông $G = (V, E)$**: Từ đỉnh $u$ có bậc $\deg(u)$, hạt nhảy sang một đỉnh kề $v$ bất kỳ với xác suất $p_{uv} = \frac{1}{\deg(u)}$. Thử $\pi_u \propto \deg(u)$: với mọi cạnh $\{u, v\} \in E$, ta có $\pi_u p_{uv} \propto \deg(u) \cdot \frac{1}{\deg(u)} = 1 = \deg(v) \cdot \frac{1}{\deg(v)} \propto \pi_v p_{vu}$! Chuẩn hóa bằng tổng bậc $\sum_{u \in V} \deg(u) = 2|E|$ cho nghiệm tức thì **$\pi_u = \frac{\deg(u)}{2|E|}$**!
2. **Chuỗi Sinh - Tử Mô hình Hàng đợi Sổ lệnh**: Khối lượng chờ tại đỉnh sổ $k \in \{0, 1, \dots, K\}$ tăng lên $k+1$ (thêm lệnh giới hạn) với xác suất $\lambda_k$ và giảm về $k-1$ (hủy hoặc khớp lệnh) với xác suất $\mu_k$. Vì đồ thị là đường thẳng không có chu trình, cân bằng chi tiết $\pi_k \lambda_k = \pi_{k+1} \mu_{k+1}$ luôn nghiệm đúng, suy ra $\pi_k = \pi_0 \prod_{m=0}^{k-1} \frac{\lambda_m}{\mu_{m+1}}$. $\blacksquare$

---

## 4. Trạng thái Hấp thụ, Phân tích Bước Đầu tiên & Ma trận Cơ sở

Một trạng thái $a \in S$ gọi là **trạng thái hấp thụ** (Absorbing State) nếu $p_{aa} = 1$ (một khi chạm vào không bao giờ thoát ra được, ví dụ chạm ngưỡng chốt lời, cháy tài khoản, hoặc hoàn tất khớp mẫu ký tự). Khi sắp xếp lại thứ tự không gian trạng thái gồm $t$ trạng thái thoáng qua $\mathcal{T}$ đứng trước và $r$ trạng thái hấp thụ $\mathcal{A}$ đứng sau, ma trận chuyển tiếp $P$ có dạng khối tam giác trên chuẩn tắc:

$$
P = \begin{pmatrix} Q & R \\ \mathbf{0} & I_r \end{pmatrix}, \qquad P^n = \begin{pmatrix} Q^n & \left(\sum_{k=0}^{n-1} Q^k\right) R \\ \mathbf{0} & I_r \end{pmatrix}
$$

trong đó $Q \in \mathbb{R}^{t \times t}$ mô tả chuyển tiếp nội bộ giữa các trạng thái chưa kết thúc và $R \in \mathbb{R}^{t \times r}$ mô tả bước nhảy rơi vào vùng hấp thụ.

**Định lý 2.9 — Phương pháp Phân tích Bước Đầu tiên (First-Step Analysis — `FSA`) & Ma trận Cơ sở $N$:** *Giả sử từ mọi trạng thái thuộc $\mathcal{T}$ đều có đường đi tới $\mathcal{A}$ (khi đó bán kính phổ $\rho(Q) < 1$ nên $Q^n \to \mathbf{0}$ khi $n \to \infty$). Định nghĩa **Ma trận Cơ sở** (Fundamental Matrix) $N = \sum_{n=0}^\infty Q^n = (I_t - Q)^{-1}$. Khi đó:*
1. *Phần tử $N_{ij}$ bằng chính xác **kỳ vọng tổng số lần chuỗi ghé thăm trạng thái thoáng qua $j$** trước khi bị hấp thụ khi xuất phát từ $i \in \mathcal{T}$ (tính cả thời điểm $n = 0$ nếu $j = i$).*
2. *Kỳ vọng thời gian dừng chạm tập hấp thụ $k_i = \mathbb{E}_i[\tau_{\mathcal{A}}]$ thỏa mãn hệ bước đầu tiên $k_i = 1 + \sum_{j \in \mathcal{T}} q_{ij} k_j$, tức dưới dạng vector $\mathbf{k} = (I_t - Q)^{-1}\mathbf{1} = N \mathbf{1}$.*
3. *Xác suất chạm trạng thái hấp thụ cụ thể $a \in \mathcal{A}$ xuất phát từ $i \in \mathcal{T}$, ký hiệu $B_{ia} = \mathbb{P}_i(X_{\tau_{\mathcal{A}}} = a)$, thỏa mãn hệ $B_{ia} = R_{ia} + \sum_{j \in \mathcal{T}} q_{ij} B_{ja}$, tức $B = (I_t - Q)^{-1} R = N R$.*

**Chứng minh.**
- *(1)* Tổng số lần ghé thăm $j \in \mathcal{T}$ là $V_j = \sum_{n=0}^\infty \mathbb{I}_{\{X_n = j\}}$ (hữu hạn hầu chắc chắn vì chuỗi cuối cùng bị hấp thụ). Lấy kỳ vọng tuyến tính xuất phát từ $X_0 = i$: $\mathbb{E}_i[V_j] = \sum_{n=0}^\infty \mathbb{P}_i(X_n = j) = \sum_{n=0}^\infty (Q^n)_{ij} = N_{ij}$. Vì chuỗi hình học ma trận hội tụ, $(I_t - Q)\sum_{n=0}^\infty Q^n = I_t \implies N = (I_t - Q)^{-1}$.
- *(2) & (3) bằng Phân tích Bước Đầu tiên `FSA`*: Xuất phát tại $X_0 = i \in \mathcal{T}$, ta tốn chắc chắn **$1$ bước thời gian** để chuyển sang $X_1$. Điều kiện hóa trên kết quả của bước nhảy đầu tiên $X_1$: nếu $X_1 = a \in \mathcal{A}$ (xác suất $R_{ia}$) thì thời gian chờ thêm bằng $0$ và biến cố hấp thụ tại $a$ có xác suất $1$; nếu $X_1 = j \in \mathcal{T}$ (xác suất $q_{ij}$), theo tính chất Markov quá trình khởi động lại như mới từ $j$ với kỳ vọng thời gian chờ thêm là $k_j$ và xác suất hấp thụ tại $a$ là $B_{ja}$. Áp dụng Tính chất Tháp của Bài `M2.02`:

$$
k_i = 1 + \sum_{j \in \mathcal{T}} q_{ij} k_j \iff (I_t - Q)\mathbf{k} = \mathbf{1}, \qquad B_{ia} = R_{ia} + \sum_{j \in \mathcal{T}} q_{ij} B_{ja} \iff (I_t - Q)B = R
$$

Nhân trái cả hai phương trình với $(I_t - Q)^{-1} = N$ hoàn tất chứng minh! $\blacksquare$

---

## 5. Ví dụ Giải toán Phỏng vấn Kinh điển: Nghịch lý Mẫu Chuỗi `HHT` vs `HTH` & Quân Mã Bàn Cờ

**Bài toán 1 (Câu hỏi Huyền thoại tại Jane Street / Citadel / WorldQuant):** Tung một đồng xu cân đối độc lập liên tiếp ($\mathbb{P}(\text{H}) = \mathbb{P}(\text{T}) = \frac{1}{2}$).
1. Tính kỳ vọng số lần tung $\mathbb{E}[\tau_{\text{HHT}}]$ để xuất hiện chuỗi ba mặt liên tiếp `HHT`, và so sánh với kỳ vọng số lần tung $\mathbb{E}[\tau_{\text{HTH}}]$ để xuất hiện chuỗi `HTH`! Tại sao hai mẫu đều có xác suất xuất hiện ở 3 lần tung cố định bằng $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$ nhưng thời gian chờ trung bình lại khác nhau?
2. Nếu hai người chơi cùng nhìn vào một chuỗi tung đồng xu duy nhất, Người A chọn `HHT` và Người B chọn `HTH`, xác suất Người A thắng cuộc (mẫu `HHT` xuất hiện trước `HTH`) bằng bao nhiêu?

**Lời giải Chi tiết Bài toán 1:**

**Phần 1A — Kỳ vọng chờ `HHT`:** Xây dựng các trạng thái theo **tiền tố dài nhất của mục tiêu `HHT` vừa khớp được ở đuôi chuỗi hiện tại**: $S = \{\varnothing, \text{H}, \text{HH}, \text{HHT}\}$. Gọi $e_0, e_1, e_2$ là kỳ vọng số lần tung thêm từ $\varnothing, \text{H}, \text{HH}$ (với $e_3 = 0$ tại đích `HHT`). Thiết lập hệ phương trình bước đầu tiên:
- Từ $\varnothing$: tung ra `H` sang $\text{H}$, tung ra `T` ở lại $\varnothing$:
  $e_0 = 1 + \frac{1}{2}e_1 + \frac{1}{2}e_0 \implies e_0 = 2 + e_1$.
- Từ $\text{H}$: tung ra `H` sang $\text{HH}$, tung ra `T` thành `HT` (không khớp tiền tố nào của `HHT`, rơi về $\varnothing$):
  $e_1 = 1 + \frac{1}{2}e_2 + \frac{1}{2}e_0$.
- Từ $\text{HH}$: tung ra `T` thành `HHT` (chạm đích, chờ thêm $0$!), còn tung ra `H` thành `HHH` — **điểm mấu chốt**: hai ký tự cuối vẫn là `HH`, nên hệ thống **đứng yên ở trạng thái $\text{HH}$ chứ không bị tụt lùi**:
  $e_2 = 1 + \frac{1}{2}(0) + \frac{1}{2}e_2 \implies e_2 = 2$.

Thay ngược $e_2 = 2$ vào phương trình giữa: $e_1 = 1 + 1 + \frac{1}{2}e_0 = 2 + \frac{1}{2}e_0$. Thế vào $e_0 = 2 + e_1 = 4 + \frac{1}{2}e_0 \implies \mathbf{\mathbb{E}[\tau_{\text{HHT}}] = e_0 = 8}$ lần tung!

**Phần 1B — Kỳ vọng chờ `HTH`:** Không gian tiền tố là $\{\varnothing, \text{H}, \text{HT}, \text{HTH}\}$ với thời gian chờ $m_0, m_1, m_2$:
- Từ $\varnothing$: $m_0 = 1 + \frac{1}{2}m_1 + \frac{1}{2}m_0 \implies m_0 = 2 + m_1$.
- Từ $\text{H}$: tung ra `H` giữ nguyên tiền tố $\text{H}$, tung ra `T` tiến sang $\text{HT}$:
  $m_1 = 1 + \frac{1}{2}m_1 + \frac{1}{2}m_2 \implies m_1 = 2 + m_2$.
- Từ $\text{HT}$: tung ra `H` chạm đích `HTH` ($0$), nhưng nếu tung trượt ra `T` tạo thành `HTT` thì hậu tố không khớp gì với `HTH`, bị **phạt rơi thẳng về vạch xuất phát $\varnothing$**:
  $m_2 = 1 + \frac{1}{2}(0) + \frac{1}{2}m_0$.

Thế ngược dồn một dòng:

$$
m_0 = 2 + m_1 = 4 + m_2 = 5 + \frac{1}{2}m_0 \implies \mathbf{\mathbb{E}[\tau_{\text{HTH}}] = m_0 = 10} \text{ lần tung!}
$$

**Giải thích Trực giác Tự Chồng lấp (Self-Overlap):** Mẫu `HTH` có tiền tố độ dài 1 (`H`) trùng với hậu tố độ dài 1 (`H`). Khi `HTH` vừa xuất hiện, nó đồng thời tặng sẵn chữ `H` đầu tiên cho lần xuất hiện `HTH` tiếp theo, khiến các cụm `HTH` có xu hướng dính chùm nhau (ví dụ `HTHTH` chứa hai lần `HTH` chỉ trong 5 lần tung!), kéo phương sai lớn hơn và đẩy thời gian chờ lần đầu tiên xa hơn ($10 > 8$). Tương tự, mẫu `HHH` tự chồng lấp cả độ dài 1 lẫn độ dài 2 nên tốn tới $2^1 + 2^2 + 2^3 = \mathbf{14}$ lần tung!

**Phần 2 — Cuộc đua Trực tiếp `HHT` đấu với `HTH`:** Xét không gian trạng thái gộp $\{\varnothing, \text{H}, \text{HH (A thắng)}, \text{HT}, \text{HTH (B thắng)}\}$. Để ý rằng một khi chuỗi chạm vào $\text{HH}$, Người A **thắng chắc chắn với xác suất $1$** ($h_{\text{HH}} = 1$), vì mọi mặt `H` tiếp theo giữ nguyên đuôi `HH` và mặt `T` đầu tiên xuất hiện sẽ hoàn tất `HHT` ngay lập tức trước khi `HTH` kịp hình thành! Gọi $h_i$ là xác suất A thắng từ trạng thái $i$:
- Từ $\varnothing$: $h_\varnothing = \frac{1}{2}h_{\text{H}} + \frac{1}{2}h_\varnothing \implies h_\varnothing = h_{\text{H}}$.
- Từ $\text{HT}$: nếu ra `H` thì thành `HTH` (B thắng ngay, xác suất $0$); nếu ra `T` thành `HTT` quay về trạng thái không có `H` nào ($\varnothing$): $h_{\text{HT}} = \frac{1}{2}(0) + \frac{1}{2}h_\varnothing = \frac{1}{2}h_{\text{H}}$.
- Từ $\text{H}$: $h_{\text{H}} = \frac{1}{2}h_{\text{HH}} + \frac{1}{2}h_{\text{HT}} = \frac{1}{2}(1) + \frac{1}{2}\left(\frac{1}{2}h_{\text{H}}\right) = \frac{1}{2} + \frac{1}{4}h_{\text{H}} \implies \frac{3}{4}h_{\text{H}} = \frac{1}{2} \implies \mathbf{h_\varnothing = \frac{2}{3}}$!

| Mẫu Ký tự ($p = 1/2$) | Cấu trúc Tiền tố - Hậu tố Trùng nhau | Ma trận Phương trình Rút gọn | Kỳ vọng Chờ $\mathbb{E}[\tau]$ |
| :---: | :--- | :--- | :---: |
| **`HHT`** | Không tự chồng lấp ($0$) | $e_2 = 2, \; e_1 = 2 + \frac{1}{2}e_0, \; e_0 = 2 + e_1$ | **$8$** |
| **`HTH`** | Trùng biên độ dài $1$ (`H`) | $m_2 = 1 + \frac{1}{2}m_0, \; m_1 = 2 + m_2, \; m_0 = 2 + m_1$ | **$10$** |
| **`HHH`** | Trùng biên độ dài $1$ (`H`) và $2$ (`HH`) | $k_2 = 1 + \frac{1}{2}k_0, \; k_1 = 1 + \frac{1}{2}k_2 + \frac{1}{2}k_0, \; k_0 = 2 + k_1$ | **$14$** |

**Bài toán 2 (Giải trong 20 Giây bằng Cân bằng Chi tiết — Quân Mã Trên Bàn Cờ Vua):** Đặt một quân Mã tại ô góc `a1` của bàn cờ vua chuẩn $8 \times 8$. Tại mỗi bước, quân Mã nhảy đồng khả năng sang một trong các ô hợp lệ từ vị trí hiện tại. Tính kỳ vọng số nước đi để quân Mã quay trở lại đúng ô góc `a1` lần đầu tiên!
- **Lời giải**: Đồ thị nước đi của quân Mã trên bàn cờ $8 \times 8$ liên thông (bất khả quy) và vô hướng. Áp dụng công thức cân bằng chi tiết trên đồ thị $\pi_u = \frac{\deg(u)}{\sum_{v \in V} \deg(v)}$ và công thức Kac $\mathbb{E}_{\text{a1}}[T_{\text{a1}}^+] = \frac{1}{\pi_{\text{a1}}}$:
  - Ô góc `a1` chỉ có đúng $\deg(\text{a1}) = 2$ nước đi hợp lệ (`b3` và `c2`).
  - Đếm tổng bậc của 64 ô trên bàn cờ theo tính đối xứng hình vuông: 4 ô góc có bậc $2$ ($4 \times 2 = 8$); 8 ô sát góc có bậc $3$ ($8 \times 3 = 24$); 20 ô sát biên còn lại (16 ô biên ngoài + 4 ô góc vòng trong `b2, g2, b7, g7`) có bậc $4$ ($20 \times 4 = 80$); 16 ô vành trong có bậc $6$ ($16 \times 6 = 96$); và 16 ô trung tâm $4 \times 4$ có bậc $8$ ($16 \times 8 = 128$).
  - Tổng bậc toàn bàn cờ bằng $8 + 24 + 80 + 96 + 128 = 336$.
  - Suy ra $\pi_{\text{a1}} = \frac{2}{336} = \frac{1}{168} \implies \mathbb{E}_{\text{a1}}[T_{\text{a1}}^+] = \mathbf{168}$ nước đi! *(Lưu ý cực hay: đồ thị quân Mã là đồ thị hai phía đen - trắng nên chuỗi có chu kỳ $d = 2$, $p_{ii}^{(n)}$ không hội tụ điểm, nhưng Định lý 2.8 đảm bảo công thức Kac $\mathbb{E}_i[T_i^+] = 1/\pi_i$ **chỉ cần tính bất khả quy chứ không hề cần tính phi tuần hoàn**!).*

**Bài toán 3 (Ứng dụng Ma trận Cơ sở $N = (I - Q)^{-1}$ vào Hàng đợi Đỉnh Sổ lệnh):** Tại mức chào mua tốt nhất $b_t$, hàng đợi còn $i \in \{1, 2\}$ lô trước khi cạn về $0$ (hấp thụ giảm giá) hoặc đầy lên $3$ lô (hấp thụ giữ/nâng giá). Giả sử tại mỗi sự kiện, xác suất thêm $1$ lô là $p = \frac{1}{3}$, rút $1$ lô là $q = \frac{2}{3}$. Tính ma trận cơ sở $N$, kỳ vọng số sự kiện trước khi chạm biên $\{0, 3\}$ và xác suất mức giá $b_t$ trụ vững chạm $3$ trước $0$ khi xuất phát từ $i = 1$ và $i = 2$.
- **Lời giải Tường minh**: Trên tập thoáng qua $\mathcal{T} = \{1, 2\}$ và tập hấp thụ $\mathcal{A} = \{0, 3\}$, ma trận $Q$ và $R$ lần lượt là:

$$
Q = \begin{pmatrix} 0 & 1/3 \\ 2/3 & 0 \end{pmatrix}, \quad R = \begin{pmatrix} 2/3 & 0 \\ 0 & 1/3 \end{pmatrix} \implies I_2 - Q = \begin{pmatrix} 1 & -1/3 \\ -2/3 & 1 \end{pmatrix}
$$

  Định thức $\det(I_2 - Q) = 1 - \frac{2}{9} = \frac{7}{9}$, suy ra ma trận cơ sở $N$, thời gian hấp thụ $\mathbf{k} = N\mathbf{1}$ và xác suất hấp thụ $B = N R$:

$$
N = \frac{9}{7} \begin{pmatrix} 1 & 1/3 \\ 2/3 & 1 \end{pmatrix} = \begin{pmatrix} 9/7 & 3/7 \\ 6/7 & 9/7 \end{pmatrix}, \quad \mathbf{k} = N \begin{pmatrix} 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 12/7 \\ 15/7 \end{pmatrix}, \quad B = N R = \begin{pmatrix} 6/7 & 1/7 \\ 4/7 & 3/7 \end{pmatrix}
$$

  Từ $i = 1$ lô, hàng đợi chịu trung bình $\frac{12}{7}$ sự kiện và có tới $\frac{6}{7} \approx 85.7\%$ nguy cơ sập về $0$ trước khi dày lên $3$ lô!

---

## 6. Các Bẫy Sai lầm Kinh điển Khi Giải Chuỗi Markov

> [!WARNING]
> **Bẫy Quên Cộng $+1$ Bước Thời gian hoặc Quên Điều kiện Biên Hấp thụ:** Khi viết phương trình bước đầu tiên, công thức xác suất chạm $h_i = \sum_j p_{ij} h_j$ **không có hằng số $+1$** (với biên $h_{\text{win}} = 1, h_{\text{lose}} = 0$), trong khi công thức kỳ vọng thời gian chờ $k_i = 1 + \sum_{j \notin \mathcal{A}} p_{ij} k_j$ **bắt buộc phải cộng $+1$** ở mọi trạng thái chưa dừng (với biên $k_{\text{target}} = 0$). Viết nhầm $k_{\text{target}} = 1$ hoặc quên số $1$ đầu dòng là lỗi trượt phỏng vấn đáng tiếc nhất!

- **Bẫy Đánh đồng Tồn tại Phân phối Dừng Duy nhất với Hội tụ $P^n$**: Xét chuỗi 2 trạng thái đổi chỗ chắc chắn $P = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$. Chuỗi bất khả quy và có phân phối dừng duy nhất $\pi = (\frac{1}{2}, \frac{1}{2})$, nhưng vì chu kỳ $d = 2$ nên $P^{2k} = I_2$ và $P^{2k+1} = P$ dao động mãi mãi không bao giờ hội tụ (chỉ có trung bình Cesàro thời gian $\frac{1}{n}\sum_{m=1}^n P^m$ hội tụ về $\pi$).
- **Bẫy Áp dụng Sai Mối liên hệ Giữa Xác suất Xuất hiện Tĩnh và Thời gian Chờ Động**: Nhìn thấy $\mathbb{P}(\text{3 lần tung đầu ra HHH}) = \frac{1}{8}$ rồi phán bừa thời gian chờ trung bình bằng $\frac{1}{1/8} = 8$ là nhầm biến cố trên các khối 3 lần tung rời nhau với cửa sổ trượt chồng lấp từng bước! Ở Bài giảng `M2.04` tiếp theo, bạn sẽ học thêm kỹ thuật sòng bạc Martingale của Conway giúp nhẩm ra ngay con số $14$, $10$ và $8$ chỉ trong đúng **5 giây** mà không cần giải bất kỳ hệ phương trình nào!
