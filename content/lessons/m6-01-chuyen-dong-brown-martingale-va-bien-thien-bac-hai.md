# M6.01 — Chuyển động Brown Chuẩn, Martingale Liên tục & Biến thiên Bậc hai

## 1. Trực giác & Động lực: Tỷ lệ Hóa Bước đi Ngẫu nhiên Sang Thời gian Liên tục

Ở Học phần `M2.04`, ta đã khảo sát bước đi ngẫu nhiên đối xứng trên lưới thời gian rời rạc $S_n = \sum_{k=1}^n \xi_k$, trong đó mỗi bước tung đồng xu độc lập nhận giá trị $\mathbb{P}(\xi_k = +1) = \mathbb{P}(\xi_k = -1) = \frac{1}{2}$ với $\mathbb{E}[\xi_k] = 0$ và $\operatorname{Var}(\xi_k) = 1$. Tuy nhiên, thị trường điện tử hiện đại khớp lệnh ở thang micro-giây và các mô hình định giá phái sinh hay tối ưu danh mục đòi hỏi một quá trình giới hạn trên trục thời gian liên tục $t \in [0, T]$.

Giả sử ta chia mỗi đơn vị thời gian thành $n$ bước nhỏ đều nhau $\Delta t = \frac{1}{n}$, nghĩa là tính đến mốc $t > 0$ đã diễn ra $\lfloor n t \rfloor$ bước nhảy. Ta cần chọn biên độ mỗi bước không gian $\Delta x$ phụ thuộc vào $n$ như thế nào để giới hạn khi $n \to \infty$ không suy biến về $0$ cũng không nổ tung ra $\infty$?
- **Nếu co tuyến tính $\Delta x = \frac{1}{n} = \Delta t$:** Phương sai tại thời điểm $t$ bằng $\lfloor n t \rfloor \cdot \left(\frac{1}{n}\right)^2 \approx \frac{t}{n} \xrightarrow{n \to \infty} 0$, khiến nhiễu ngẫu nhiên tự triệt tiêu thành đường thẳng không đổi vô nghĩa.
- **Quy luật căn bậc hai thời gian $\Delta x = \sqrt{\Delta t} = \frac{1}{\sqrt{n}}$:** Khi và chỉ khi biên độ bước nhảy tỉ lệ với $\sqrt{\Delta t}$, phương sai tích lũy $\operatorname{Var}(W_t^{(n)}) = \lfloor n t \rfloor \cdot \frac{1}{n} \to t$ mới hội tụ về hằng số dương hữu hạn tỉ lệ thuận với thời gian thực!

Theo **Định lý Bất biến Donsker** (Donsker's Invariance Theorem), quá trình nội suy từ bước đi ngẫu nhiên tỷ lệ hóa hội tụ yếu trên không gian hàm liên tục $C([0, T])$ tới một quá trình phổ quát duy nhất, bất kể phân phối gốc của $\xi_k$ là nhị phân hay phân phối bất kỳ có kỳ vọng $0$ và phương sai $1$:

$$
W_t^{(n)} \triangleq \frac{1}{\sqrt{n}} \sum_{k=1}^{\lfloor n t \rfloor} \xi_k \xrightarrow[n \to \infty]{d} W_t \sim \mathcal{N}(0, t)
$$

Mối quan hệ $\Delta W_t \sim \sqrt{\Delta t}$ chính là hạt nhân vật lý giải thích toàn bộ sự khác biệt giữa giải tích cổ điển Newton-Leibniz và giải tích ngẫu nhiên trên Phố Wall: trên đường giá liên tục, tỷ sai phân cục bộ phân kỳ $\frac{|\Delta W_t|}{\Delta t} \sim \frac{1}{\sqrt{\Delta t}} \to \infty$, khiến đạo hàm thông thường $\frac{dW_t}{dt}$ hoàn toàn không tồn tại tại bất kỳ điểm nào!

---

## 2. Bốn Tiên đề Định nghĩa & Cấu trúc Hiệp phương sai Gaussian

Trên không gian xác suất có luồng lọc $(\Omega, \mathcal{F}, (\mathcal{F}_t)_{t \ge 0}, \mathbb{P})$, một quá trình ngẫu nhiên thích nghi $(W_t)_{t \ge 0}$ được gọi là **Chuyển động Brown Chuẩn** (Standard Brownian Motion) — hay quá trình Wiener — nếu thỏa mãn trọn vẹn bốn tiên đề:
1. **Khởi đầu tại gốc tọa độ:** $W_0 = 0$ hầu chắc chắn, tức $\mathbb{P}(W_0 = 0) = 1$.
2. **Gia số độc lập** (Independent Increments): Với mọi $0 \le s < t$, bước nhảy tương lai $W_t - W_s$ độc lập thống kê với toàn bộ lịch sử thông tin $\mathcal{F}_s$; hệ quả là trên mọi lưới $0 = t_0 < t_1 < \dots < t_m$, các gia số $(W_{t_1} - W_{t_0}), \dots, (W_{t_m} - W_{t_{m-1}})$ độc lập lẫn nhau.
3. **Gia số dừng phân phối chuẩn:** Với mọi $0 \le s < t$, gia số tuân theo phân phối chuẩn tâm không có phương sai bằng đúng độ dài khoảng thời gian trôi qua: $W_t - W_s \sim \mathcal{N}(0, t - s)$.
4. **Quỹ đạo mẫu liên tục:** Với hầu hết mọi $\omega \in \Omega$, hàm đường đi $t \mapsto W_t(\omega)$ liên tục khắp nơi trên $[0, \infty)$.

Từ bốn tiên đề trên, mọi vector hữu hạn chiều $(W_{t_1}, \dots, W_{t_m})^\top$ đều là một vector chuẩn đa biến vì nó là tổ hợp tuyến tính của các gia số chuẩn độc lập. Do $\mathbb{E}[W_t] = 0$ với mọi $t \ge 0$, phân phối đồng thời của toàn bộ quá trình được quyết định duy nhất bởi hàm hiệp phương sai giữa hai thời điểm $s, t \ge 0$. Giả sử $0 \le s \le t$, tách $W_t = W_s + (W_t - W_s)$ và khai thác tính độc lập giữa $W_s \in \mathcal{F}_s$ với $W_t - W_s$:

$$
\operatorname{Cov}(W_s, W_t) = \mathbb{E}[W_s W_t] = \mathbb{E}\big[W_s^2\big] + \mathbb{E}[W_s]\,\mathbb{E}[W_t - W_s] = s + 0 = \min(s, t)
$$

Đối xứng hóa vai trò của $s$ và $t$, ta luôn có $\operatorname{Cov}(W_s, W_t) = \min(s, t)$ và hệ số tương quan $\operatorname{Corr}(W_s, W_t) = \sqrt{\frac{\min(s, t)}{\max(s, t)}}$. Công thức này chứng minh ngay ba phép đối xứng bảo toàn phân phối của chuyển động Brown chuẩn:
- **Tự đồng dạng tỷ lệ không gian – thời gian:** Với mọi $c > 0$, quá trình $\widetilde{W}_t = \frac{1}{\sqrt{c}} W_{ct}$ vẫn là chuyển động Brown chuẩn vì $\operatorname{Cov}(\widetilde{W}_s, \widetilde{W}_t) = \frac{1}{c}\min(cs, ct) = \min(s, t)$.
- **Đối xứng gương và dịch gốc Markov:** Quá trình $-W_t$ và quá trình dịch thời gian $B_u = W_{t_0 + u} - W_{t_0}$ với $u \ge 0$ đều là các chuyển động Brown chuẩn độc lập với $\mathcal{F}_{t_0}$.
- **Nghịch đảo thời gian:** Quá trình $Y_t = t W_{1/t}$ với $t > 0$ và $Y_0 = 0$ cũng có $\operatorname{Cov}(Y_s, Y_t) = s t \min(1/s, 1/t) = \min(s, t)$, nên là chuyển động Brown chuẩn — suy ra Luật Số lớn Mạnh $\lim_{u \to \infty} \frac{W_u}{u} = \lim_{t \to 0^+} Y_t = 0$ hầu chắc chắn!

---

## 3. Bộ Ba Martingale Liên tục Nền tảng & Nguyên lý Phản xạ Chạm Rào

### 3.1. Chứng minh Ba Quá trình Martingale Cốt lõi Của Chuyển động Brown

Trong các vòng thi kỹ thuật tại Jane Street, Citadel hay D. E. Shaw, ba quá trình dưới đây là công cụ giải tích tức thì để tính mô-men thời gian dừng và xác suất vượt ngưỡng mà không cần giải phương trình đạo hàm riêng.

**Định lý 6.1 — Bộ Ba Martingale Chuẩn Trên Không gian Liên tục:** *Đối với luồng lọc $(\mathcal{F}_t)_{t \ge 0}$, cả ba quá trình thích nghi khả tích dưới đây đều là các **Martingale liên tục** (Continuous Martingales):*
1. **Martingale tuyến tính gốc:** $M_t^{(1)} = W_t$.
2. **Martingale bậc hai bù phương sai:** $M_t^{(2)} = W_t^2 - t$.
3. **Martingale hàm mũ liên tục:** $M_t^{(3)} = \exp\left(\theta W_t - \frac{1}{2}\theta^2 t\right)$ với mọi tham số thực $\theta \in \mathbb{R}$.

**Chứng minh Tường minh Với Mọi $0 \le s < t$:**
- *Với $M_t^{(1)}$:* Ta có $\mathbb{E}[|W_t|] = \sqrt{\frac{2t}{\pi}} < \infty$. Tách $W_t = W_s + (W_t - W_s)$, vì $W_s \in \mathcal{F}_s$ và $W_t - W_s \perp \mathcal{F}_s$ nên $\mathbb{E}[W_t \mid \mathcal{F}_s] = W_s + \mathbb{E}[W_t - W_s] = W_s$.
- *Với $M_t^{(2)}$:* Khai triển bình phương $W_t^2 = \big(W_s + (W_t - W_s)\big)^2 = W_s^2 + 2 W_s(W_t - W_s) + (W_t - W_s)^2$, sử dụng $\mathbb{E}[(W_t - W_s)^2 \mid \mathcal{F}_s] = \operatorname{Var}(W_t - W_s) = t - s$:

$$
\mathbb{E}\big[W_t^2 - t \,\big|\, \mathcal{F}_s\big] = W_s^2 + 2 W_s \underbrace{\mathbb{E}[W_t - W_s]}_{0} + \underbrace{\mathbb{E}\big[(W_t - W_s)^2\big]}_{t - s} - t = W_s^2 - s = M_s^{(2)}
$$

- *Với $M_t^{(3)}$:* Biến chuẩn $Z \sim \mathcal{N}(0, \sigma^2)$ có hàm sinh mô-men $\mathbb{E}[e^{\theta Z}] = e^{\frac{1}{2}\theta^2 \sigma^2}$. Áp dụng cho gia số $Z = W_t - W_s \sim \mathcal{N}(0, t - s)$ độc lập với $\mathcal{F}_s$:

$$
\mathbb{E}\left[\exp\left(\theta W_t - \frac{1}{2}\theta^2 t\right) \,\middle|\, \mathcal{F}_s\right] = \exp\left(\theta W_s - \frac{1}{2}\theta^2 t\right) \mathbb{E}\big[e^{\theta(W_t - W_s)}\big] = \exp\left(\theta W_s - \frac{1}{2}\theta^2 t + \frac{1}{2}\theta^2(t - s)\right) = M_s^{(3)}
$$

Hơn thế nữa, định lý đặc trưng hóa Paul Lévy khẳng định chiều ngược lại: bất kỳ quá trình liên tục xuất phát từ $0$ nào vừa là Martingale vừa có $M_t^2 - t$ là Martingale thì bắt buộc phải là chuyển động Brown chuẩn! $\blacksquare$

### 3.2. Nguyên lý Phản xạ và Phân phối Cực đại Chạy Một Phía

Xét ngưỡng rào dương $a > 0$, quá trình cực đại chạy $M_t^* \triangleq \max_{0 \le s \le t} W_s$ và thời gian dừng chạm ngưỡng đầu tiên $\tau_a \triangleq \inf\{s \ge 0 : W_s = a\}$. Nhờ tính liên tục của quỹ đạo mẫu xuất phát từ $W_0 = 0 < a$, biến cố vượt ngưỡng trước hoặc tại mốc $t$ trùng khít hoàn toàn với $\{\tau_a \le t\} = \{M_t^* \ge a\}$.

Theo **Nguyên lý Phản xạ** (Reflection Principle) dựa trên tính Markov mạnh tại thời điểm dừng $\tau_a$: ngay khi quỹ đạo vừa chạm rào $W_{\tau_a} = a$, phần đường đi tiếp theo $(W_{\tau_a + u} - a)_{u \ge 0}$ lại là một chuyển động Brown đối xứng hoàn toàn độc lập với lịch sử trước $\tau_a$. Do đó, với mỗi quỹ đạo chạm $a$ trước mốc $t$ rồi kết thúc bên trên ngưỡng $a$ ($W_t > a$), tồn tại một quỹ đạo đối xứng gương qua đường thẳng ngang $y = a$ là $\widetilde{W}_s = 2a - W_s$ cho $s > \tau_a$ kết thúc bên dưới ngưỡng $a$ ($\widetilde{W}_t < a$) với mật độ xác suất bằng hệt nhau! Nhờ $\mathbb{P}(W_t = a) = 0$ và $\{W_t \ge a\} \subseteq \{M_t^* \ge a\}$, ta thu được công thức vàng của định giá quyền chọn rào cản:

$$
\mathbb{P}\left(\max_{0 \le s \le t} W_s \ge a\right) = \mathbb{P}(\tau_a \le t) = 2\mathbb{P}(W_t \ge a) = 2\left[1 - \Phi\left(\frac{a}{\sqrt{t}}\right)\right] = \mathbb{P}(|W_t| \ge a)
$$

Lấy đạo hàm của $\mathbb{P}(\tau_a \le t) = \sqrt{\frac{2}{\pi}} \int_{a/\sqrt{t}}^\infty e^{-z^2 / 2} \, dz$ theo biến thời gian $t > 0$, hàm mật độ thời điểm chạm rào tuân theo phân phối Lévy đuôi cực dày:

$$
f_{\tau_a}(t) = \frac{d}{dt}\mathbb{P}(\tau_a \le t) = \frac{a}{\sqrt{2\pi t^3}} \exp\left(-\frac{a^2}{2t}\right), \qquad t > 0
$$

Quan sát hai hệ quả xác suất đối nghịch nhau khi $t \to \infty$: một mặt $\mathbb{P}(\tau_a < \infty) = \lim_{t \to \infty} 2\big[1 - \Phi(a/\sqrt{t})\big] = 1$, nghĩa là chắc chắn $100\%$ sớm muộn đường giá sẽ chạm mức $a$; mặt khác đuôi mật độ suy giảm quá chậm theo luật lũy thừa $t^{-3/2}$, khiến kỳ vọng thời gian chờ $\mathbb{E}[\tau_a] = \int_0^\infty t \, f_{\tau_a}(t) \, dt \propto \int_1^\infty t^{-1/2} \, dt = +\infty$!

---

## 4. Biến thiên Bậc một Vô hạn & Hội tụ $L^2$ Của Biến thiên Bậc hai

Xét dãy phân hoạch $\Pi_n = \{0 = t_0 < t_1 < \dots < t_n = T\}$ trên đoạn $[0, T]$ có bước lưới cực đại $\|\Pi_n\| \triangleq \max_{1 \le i \le n} \Delta t_i \to 0$ khi $n \to \infty$, trong đó $\Delta t_i = t_i - t_{i-1}$ và $\Delta W_i = W_{t_i} - W_{t_{i-1}} \sim \mathcal{N}(0, \Delta t_i)$.

### 4.1. Chứng minh Biến thiên Bậc hai Hội tụ Trung bình Bình phương Về $T$

Đặt tổng bình phương các bước nhảy là $Q_{\Pi_n} \triangleq \sum_{i=1}^n (\Delta W_i)^2$. Giới hạn $L^2$ của đại lượng này khi lưới chia mịn dần được gọi là **Biến thiên Bậc hai** (Quadratic Variation), ký hiệu $[W, W]_T$.

**Định lý 6.2 — Định lý Hội tụ $L^2$ Của Biến thiên Bậc hai:** *Khi $\|\Pi_n\| \to 0$, tổng ngẫu nhiên $Q_{\Pi_n}$ triệt tiêu hoàn toàn phương sai và hội tụ trung bình bình phương về đúng thời gian thực $T$, tức $\lim_{\|\Pi_n\| \to 0} \mathbb{E}\big[(Q_{\Pi_n} - T)^2\big] = 0$.*

**Chứng minh Đầy đủ Trong Không gian $L^2(\Omega)$:**
1. *Tính kỳ vọng không chệch:* Do $\mathbb{E}[(\Delta W_i)^2] = \operatorname{Var}(\Delta W_i) = \Delta t_i$, tuyến tính hóa kỳ vọng cho ta $\mathbb{E}[Q_{\Pi_n}] = \sum_{i=1}^n \Delta t_i = t_n - t_0 = T$.
2. *Tính phương sai từng hạng tử:* Viết $\Delta W_i = \sqrt{\Delta t_i} \, Z_i$ với các biến chuẩn tắc $Z_1, \dots, Z_n \stackrel{\text{i.i.d.}}{\sim} \mathcal{N}(0, 1)$. Vì mô-men chuẩn tắc bậc hai là $\mathbb{E}[Z_i^2] = 1$ và bậc bốn là $\mathbb{E}[Z_i^4] = 3$, suy ra $\operatorname{Var}(Z_i^2) = 3 - 1^2 = 2$, kéo theo $\operatorname{Var}\big((\Delta W_i)^2\big) = \operatorname{Var}(\Delta t_i Z_i^2) = 2(\Delta t_i)^2$.
3. *Đánh giá sai số toàn cục:* Do các gia số $\Delta W_i$ trên các khoảng rời nhau độc lập thống kê nên $(\Delta W_i)^2$ cũng độc lập, phương sai của tổng bằng tổng các phương sai:

$$
\mathbb{E}\left[\left(\sum_{i=1}^n (\Delta W_i)^2 - T\right)^2\right] = \operatorname{Var}(Q_{\Pi_n}) = \sum_{i=1}^n 2(\Delta t_i)^2 \le 2 \left(\max_{1 \le i \le n} \Delta t_i\right) \sum_{i=1}^n \Delta t_i = 2 \|\Pi_n\| T \xrightarrow{\|\Pi_n\| \to 0} 0
$$

Trên lưới chia đôi nhị phân $\Delta t_i = T / 2^n$, tổng $\sum_{n=1}^\infty \mathbb{E}[(Q_{\Pi_n} - T)^2] = \sum_{n=1}^\infty \frac{2T^2}{2^n} = 2T^2 < \infty$, nên theo Bổ đề Borel-Cantelli, $Q_{\Pi_n} \to T$ **hầu chắc chắn**! $\blacksquare$

### 4.2. Chứng minh Biến thiên Bậc một Bằng Vô cực & Bảng Đối chiếu Quỹ đạo

Từ kết quả $[W, W]_T = T > 0$, ta chứng minh ngay bằng phản chứng rằng biến thiên bậc một $\sup_{\Pi} \sum_{i=1}^n |\Delta W_i| = +\infty$ hầu chắc chắn! Trên mọi quỹ đạo mẫu liên tục $\omega$ cố định trên đoạn compact $[0, T]$, tính liên tục đều đảm bảo $\max_{1 \le i \le n} |\Delta W_i(\omega)| \to 0$ khi $\|\Pi_n\| \to 0$. Chặn trên tổng bình phương bằng bất đẳng thức sơ cấp:

$$
\sum_{i=1}^n (\Delta W_i)^2 \le \left(\max_{1 \le i \le n} |\Delta W_i|\right) \cdot \sum_{i=1}^n |\Delta W_i|
$$

Dọc dãy phân hoạch nhị phân nơi vế trái hội tụ tới $T > 0$ còn thừa số $\max_i |\Delta W_i| \to 0$, tổng độ dài bậc nhất bắt buộc phải nổ tung $\lim_{n \to \infty} \sum_{i=1}^n |\Delta W_i| = +\infty$ hầu chắc chắn! Tương tự, kiểm tra chuẩn $L^2$ của tích chéo thời gian – nhiễu:

$$
\mathbb{E}\left[\left(\sum_{i=1}^n \Delta t_i \Delta W_i\right)^2\right] = \sum_{i=1}^n (\Delta t_i)^2 \operatorname{Var}(\Delta W_i) = \sum_{i=1}^n (\Delta t_i)^3 \le \|\Pi_n\|^2 T \xrightarrow{\|\Pi_n\| \to 0} 0
$$

Ba giới hạn hội tụ này thiết lập quy tắc nhân vi phân nền tảng $(dt)^2 = 0$, $dt \cdot dW_t = 0$, và **$(dW_t)^2 = dt$**, đặt chuyển động Brown vào vị trí độc nhất vô nhị so với hàm khả vi cổ điển:

| Lớp hàm / Quá trình trên $[0, T]$ | Tính liên tục quỹ đạo | Đạo hàm điểm | Biến thiên bậc một $V_T^{(1)}$ | Biến thiên bậc hai $[X, X]_T$ |
| :--- | :--- | :--- | :--- | :--- |
| **Hàm trơn khả vi $f \in C^1([0, T])$** | Liên tục khắp nơi | Tồn tại hữu hạn $f'(t)$ | Hữu hạn $\int_0^T |f'(t)|\,dt < \infty$ | Bằng không tuyệt đối ($0$) |
| **Quá trình đếm Poisson $N_t$** | Gián đoạn bước nhảy $+1$ | Bằng $0$ ngoài điểm nhảy | Hữu hạn bằng tổng số nhảy $N_T$ | Khác không bằng $N_T$ |
| **Chuyển động Brown chuẩn $W_t$** | Liên tục khắp nơi | Không tồn tại ở mọi điểm | Phân kỳ ra vô cực ($+\infty$) | Tất định chính xác bằng $T$ |

### 4.3. Kiểm chứng Thực nghiệm Hội tụ $L^2$ & Nguyên lý Phản xạ Bằng Vector Hóa NumPy

Đoạn mã dưới đây mô phỏng $50{,}000$ quỹ đạo trên $[0, 1]$ với hai độ mịn lưới $n \in \{250, 10{,}000\}$ để xác nhận đồng thời ba định lý: biến thiên bậc một bùng nổ theo $\sqrt{n}$, biến thiên bậc hai hội tụ chặt về $T = 1$ với phương sai lý thuyết $\frac{2T^2}{n}$, và tần suất vượt rào $a = 1.2$ khớp khít công thức $2\big[1 - \Phi(a / \sqrt{T})\big]$:

```python
import numpy as np
from math import erf, sqrt

rng = np.random.default_rng(7)
T, a, n_paths = 1.0, 1.2, 50_000

for n_steps in (250, 10_000):
    dt = T / n_steps
    dW = rng.normal(0.0, np.sqrt(dt), size=(n_paths, n_steps))
    v1 = np.sum(np.abs(dW), axis=1)        # Biến thiên bậc một
    qv = np.sum(dW * dW, axis=1)           # Biến thiên bậc hai
    print(f"n={n_steps:5d} | E[V1]={v1.mean():6.2f} | E[QV]={qv.mean():.4f} | Var(QV)={qv.var():.5f} (ly thuyet {2*T**2/n_steps:.5f})")

# Kiểm chứng Nguyên lý Phản xạ trên lưới mịn
paths = np.hstack([np.zeros((n_paths, 1)), np.cumsum(dW, axis=1)])
emp_hit = np.mean(np.max(paths, axis=1) >= a)
theo_hit = 2.0 * (1.0 - 0.5 * (1.0 + erf(a / sqrt(2.0 * T))))
print(f"Xac suat cham rao a={a}: Mo phong = {emp_hit:.4f} | Phan xa ly thuyet = {theo_hit:.4f}")
```

---

## 5. Ví dụ Phỏng vấn Thực chiến: Quá trình Brown Tích hợp & Chạm Rào Có Trôi

**Đề bài — Vòng Cuối Nghiên cứu Định lượng tại Citadel và Jane Street:**
1. **Phần A:** Đặt tích phân thời gian $I_T = \int_0^T W_t \, dt$ dùng trong định giá quyền chọn châu Á trung bình số học. Xác định phân phối chính xác của $I_T$ và hệ số tương quan $\operatorname{Corr}(W_T, I_T)$.
2. **Phần B:** Quỹ đạo lợi nhuận tích lũy tuân theo chuyển động Brown có trôi âm $X_t = \mu t + \sigma W_t$ với $\mu < 0 < \sigma$, xuất phát tại $X_0 = 0$. Tìm xác suất chiến lược chạm chốt lời $+a$ với $a > 0$ trước khi chạm cắt lỗ $-b$ với $b > 0$, rồi suy ra xác suất bao giờ chạm được $+a$ khi bỏ rào cắt lỗ $b \to \infty$.

**Lời giải Chuẩn Phòng Thi:**
- **Giải Phần A:** Vì $I_T$ là giới hạn tổng Riemann tuyến tính của quá trình Gaussian tâm $0$, $I_T$ tuân theo phân phối chuẩn với $\mathbb{E}[I_T] = 0$. Đổi thứ tự tích phân Fubini trên hình vuông $[0, T]^2$ chia làm hai tam giác đối xứng qua đường chéo $s = t$:

$$
\operatorname{Var}\left(\int_0^T W_t \, dt\right) = \int_0^T \int_0^T \min(s, t) \, ds \, dt = 2 \int_0^T \left(\int_0^t s \, ds\right) dt = 2 \int_0^T \frac{t^2}{2} \, dt = \frac{T^3}{3}
$$

  Đồng thời $\operatorname{Cov}(W_T, I_T) = \int_0^T \min(T, t) \, dt = \int_0^T t \, dt = \frac{T^2}{2}$, suy ra $I_T \sim \mathcal{N}\left(0, \frac{T^3}{3}\right)$ và hệ số tương quan giữa giá cuối kỳ với giá trung bình kỳ luôn bằng hằng số bất biến $\operatorname{Corr}(W_T, I_T) = \frac{T^2 / 2}{\sqrt{T \cdot T^3 / 3}} = \frac{\sqrt{3}}{2} \approx 0.866$!
- **Giải Phần B:** Chọn $\theta \neq 0$ để $e^{\theta X_t} = \exp\left(\theta\sigma W_t + \theta\mu t\right)$ trùng khít với Martingale hàm mũ $M_t^{(3)}$: đồng nhất hệ số của $t$ cho $\theta \mu = -\frac{1}{2}\theta^2\sigma^2 \implies \theta^\star = -\frac{2\mu}{\sigma^2} > 0$. Đặt $\tau = \inf\{t \ge 0 : X_t \in \{-b, a\}\}$; quá trình dừng $e^{\theta^\star X_{t \wedge \tau}}$ bị chặn đều trong đoạn $[e^{-\theta^\star b}, e^{\theta^\star a}]$, nên Định lý Dừng Tùy ý bảo toàn kỳ vọng $\mathbb{E}[e^{\theta^\star X_\tau}] = e^{\theta^\star X_0} = 1$:

$$
p_{\text{hit}}(a) \, e^{\theta^\star a} + \big(1 - p_{\text{hit}}(a)\big) e^{-\theta^\star b} = 1 \implies p_{\text{hit}}(a) = \frac{1 - e^{\frac{2\mu b}{\sigma^2}}}{e^{-\frac{2\mu a}{\sigma^2}} - e^{\frac{2\mu b}{\sigma^2}}} \xrightarrow{b \to \infty} \exp\left(\frac{2\mu a}{\sigma^2}\right)
$$

  Khi $\mu < 0$ và $b \to \infty$, vì $\frac{2\mu a}{\sigma^2} < 0$, xác suất chạm được mức dương $+a$ giảm hàm mũ $\exp\left(-\frac{2|\mu|a}{\sigma^2}\right) < 1$: với xác suất dương $1 - e^{-2|\mu|a/\sigma^2}$, tài khoản gồng lỗ không điểm dừng sẽ trôi vĩnh viễn xuống $-\infty$ mà chưa từng một lần hòa vốn!

---

## 6. Cạm bẫy Thực nghiệm: Nhiễu Vi cấu trúc Phá vỡ Biến thiên Bậc hai Ở Tần suất Siêu cao

> [!WARNING]
> **Hiện tượng Bùng nổ Chữ ký Biến động Khi Lấy Mẫu Từng Giao dịch:**
> Lý thuyết $[W, W]_T = T$ khiến nhiều người mới vào nghề lầm tưởng rằng muốn ước lượng **Biến động Thực hiện** (Realized Volatility) $\hat{\sigma}_T^2 = \sum_{i=1}^n (\Delta \ln P_{t_i})^2$ chính xác nhất, chỉ cần lấy mẫu dày tới từng mili-giây khớp lệnh $\Delta t \to 0$. Trên dữ liệu sàn thực tế xảy ra điều ngược lại hoàn toàn!
> Như mô hình Roll ở `M1.04` đã chỉ ra, giá khớp lệnh quan sát được là $\ln P_{t_i} = X_{t_i} + \varepsilon_{t_i}$, với $X_t = \sigma W_t$ là giá hiệu quả ẩn và $\varepsilon_{t_i} \in \{-c, +c\}$ là nhiễu nảy qua lại giữa giá chào mua và chào bán có $\operatorname{Var}(\varepsilon_i) = c^2$ độc lập với $\Delta t$. Khi đó kỳ vọng tổng bình phương sai phân thực tế bằng:
> $\mathbb{E}\left[\sum_{i=1}^n (\Delta \ln P_{t_i})^2\right] = \sum_{i=1}^n \left(\sigma^2 \Delta t_i + \mathbb{E}\big[(\varepsilon_{t_i} - \varepsilon_{t_{i-1}})^2\big]\right) = \sigma^2 T + 2 n c^2 \xrightarrow{n \to \infty} +\infty$!
> Vẽ $\hat{\sigma}_T^2$ theo tần suất lấy mẫu tạo ra đường cong vọt lên dữ dội khi $\Delta t < 1\text{ phút}$ mang tên **Đồ thị Chữ ký** (Signature Plot). Trong thực chiến định lượng, bạn bắt buộc phải tính trên giá trung tâm sổ lệnh kết hợp cửa sổ lấy mẫu $5\text{ phút}$ hoặc bộ ước lượng lấy trung bình trước hai thang thời gian để khử sạch thành phần $2nc^2$.
