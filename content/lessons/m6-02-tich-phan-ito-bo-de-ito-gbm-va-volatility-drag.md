# M6.02 — Tích phân Ngẫu nhiên Itô, Bổ đề Itô, Chuyển động Brown Hình học & Sự Bào mòn Biến động

## 1. Trực giác & Động lực: Tại sao Phải Chọn Điểm Đầu Trái Không Nhìn Trước Tương lai?

Trong giải tích cổ điển, tích phân của hàm trơn $\int_0^T H_t \, dg(t)$ hoàn toàn bất biến dù bạn lấy giá trị hàm dưới dấu tích phân tại đầu trái $t_i$, trung điểm $\frac{t_i + t_{i+1}}{2}$, hay đầu phải $t_{i+1}$ của mỗi đoạn chia lưới nhỏ. Nhưng ở `M6.01`, ta đã chứng minh chuyển động Brown $W_t$ có biến thiên bậc một bằng $+\infty$ và biến thiên bậc hai $\sum (\Delta W_i)^2 \to T > 0$! Sự khác không của bậc hai khiến vị trí điểm lấy mẫu trên đoạn $[t_i, t_{i+1}]$ làm thay đổi tận gốc kết quả của tích phân ngẫu nhiên $\int_0^T H_t \, dW_t$.

Trên phân hoạch $\Pi_n = \{0 = t_0 < t_1 < \dots < t_n = T\}$, hai phép xây dựng đối lập nhau trong toán học ứng dụng là:
1. **Quy tắc Điểm Đầu Trái Không Tiên tri** (Left-Endpoint Non-Anticipating Rule) của Kiyosi Itô: Đánh giá $H$ chặt chẽ tại mốc mở đầu $t_i$, tức $\sum_{i=0}^{n-1} H_{t_i}(W_{t_{i+1}} - W_{t_i})$. Trong tài chính định lượng, nếu $W_t$ là giá tài sản và $H_t$ là số lượng cổ phiếu nắm giữ trên khoảng $(t_i, t_{i+1}]$, quyết định khối lượng $H_{t_i}$ **bắt buộc phải chốt xong tại thời điểm $t_i$** chỉ dựa trên lịch sử $\mathcal{F}_{t_i}$ trước khi bước nhảy giá $W_{t_{i+1}} - W_{t_i}$ diễn ra!
2. **Lược đồ Trung điểm Stratonovich** (Stratonovich Midpoint Scheme) dùng trong cơ học vật lý: Đánh giá tại trung điểm $\sum_{i=0}^{n-1} H_{(t_i + t_{i+1})/2}(W_{t_{i+1}} - W_{t_i})$. Dù bảo toàn quy tắc đạo hàm dây chuyền cổ điển, lược đồ này vi phạm tính nhân quả tài chính vì trạng thái tại $\frac{t_i + t_{i+1}}{2}$ đã chứa một nửa bước nhảy tương lai, tạo ra lợi nhuận ảo kỳ vọng dương từ trò chơi công bằng!

Hãy chứng minh ngay sự khác biệt chấn động này bằng cách giải trực tiếp $\int_0^T W_t \, dW_t$ theo định nghĩa điểm đầu trái. Dùng đồng nhất thức đại số $a(b - a) = \frac{1}{2}(b^2 - a^2) - \frac{1}{2}(b - a)^2$ với $a = W_{t_i}$ và $b = W_{t_{i+1}}$, tổng riêng tách thành một tổng vi phân triệt tiêu nối đuôi trừ đi một nửa tổng biến thiên bậc hai:

$$
\sum_{i=0}^{n-1} W_{t_i}(W_{t_{i+1}} - W_{t_i}) = \frac{1}{2}\sum_{i=0}^{n-1} \big(W_{t_{i+1}}^2 - W_{t_i}^2\big) - \frac{1}{2}\sum_{i=0}^{n-1} (W_{t_{i+1}} - W_{t_i})^2 \xrightarrow[\|\Pi_n\| \to 0]{L^2} \frac{1}{2}W_T^2 - \frac{1}{2}T
$$

Đối chiếu toàn diện hai hệ tích phân để không bao giờ nhầm lẫn trong phòng thi:

| Tiêu chí so sánh | Phép tính Điểm Đầu Trái Itô $\int_0^T H_t \, dW_t$ | Phép tính Trung điểm Stratonovich $\int_0^T H_t \circ dW_t$ |
| :--- | :--- | :--- |
| **Điểm lấy mẫu trên $[t_i, t_{i+1}]$** | Mốc mở đầu $t_i^* = t_i$ — hoàn toàn $\mathcal{F}_{t_i}$-đo được | Trung điểm $t_i^* = \frac{t_i + t_{i+1}}{2}$ — nhìn trước nửa bước nhảy |
| **Tính chất Martingale** | Bảo toàn tuyệt đối $\mathbb{E}\big[\int_0^T H_t \, dW_t\big] = 0$ | Phá vỡ tính công bằng $\mathbb{E}\big[\int_0^T W_t \circ dW_t\big] = \frac{1}{2}T \neq 0$ |
| **Kết quả cho $\int_0^T W_t \, dW_t$** | $\frac{1}{2}W_T^2 - \frac{1}{2}T$ — xuất hiện số hạng hiệu chỉnh $-\frac{1}{2}T$ | $\frac{1}{2}W_T^2$ — giống nguyên hàm giải tích sơ cấp |
| **Ứng dụng cốt lõi** | Định giá phái sinh, danh mục tự tài trợ, kinh tế lượng tài chính | Hệ động lực vật lý có nhiễu nhiệt trơn hữu hạn dải tần |

---

## 2. Tính chất Martingale & Chứng minh Đẳng cự Itô

Gọi $\mathcal{L}^2([0, T] \times \Omega)$ là không gian Hilbert các quá trình thích nghi $(H_t)_{0 \le t \le T}$ thỏa mãn điều kiện bình phương khả tích $\mathbb{E}\left[\int_0^T H_t^2 \, dt\right] < \infty$. Tích phân $I_T(H) = \int_0^T H_t \, dW_t$ được xây dựng trước hết trên tập trù mật các quá trình bậc thang thích nghi $H_t = \sum_{i=0}^{n-1} H_i \, \mathbb{I}_{(t_i, t_{i+1}]}(t)$ — trong đó mỗi $H_i$ là $\mathcal{F}_{t_i}$-đo được và $\mathbb{E}[H_i^2] < \infty$ — qua tổng lãi lỗ rời rạc $I_T(H) = \sum_{i=0}^{n-1} H_i \Delta W_i$ với $\Delta W_i = W_{t_{i+1}} - W_{t_i}$, rồi thác triển liên tục duy nhất sang toàn bộ $\mathcal{L}^2([0, T] \times \Omega)$.

**Định lý 6.3 — Tính chất Martingale và Đẳng cự Itô** (Itô Isometry): *Với mọi $H \in \mathcal{L}^2([0, T] \times \Omega)$, quá trình tích phân chạy $I_t(H) = \int_0^t H_s \, dW_s$ là một Martingale liên tục có kỳ vọng bằng không $\mathbb{E}\left[\int_0^T H_t \, dW_t\right] = 0$, đồng thời bảo toàn chuẩn bình phương trung bình:*

$$
\mathbb{E}\left[\left(\int_0^T H_t \, dW_t\right)^2\right] = \mathbb{E}\left[\int_0^T H_t^2 \, dt\right]
$$

**Chứng minh Trọn vẹn Trên Quá trình Bậc thang & Mở rộng Giới hạn:**
1. *Kỳ vọng bằng không:* Với mỗi chỉ số $i$, vì $H_i \in \mathcal{F}_{t_i}$ và $\Delta W_i \perp \mathcal{F}_{t_i}$, áp dụng Tính chất Tháp tại $\mathcal{F}_{t_i}$ cho ta $\mathbb{E}[H_i \Delta W_i] = \mathbb{E}\big[H_i \, \mathbb{E}[\Delta W_i \mid \mathcal{F}_{t_i}]\big] = \mathbb{E}[H_i \cdot 0] = 0$. Cộng tuyến tính qua $i$ suy ra $\mathbb{E}[I_T(H)] = 0$.
2. *Khai triển bình phương chuẩn $L^2$:* Tách bình phương của tổng thành phần đường chéo $i = j$ và phần tích chéo $i < j$:

$$
\mathbb{E}\big[I_T(H)^2\big] = \sum_{i=0}^{n-1} \mathbb{E}\big[H_i^2 (\Delta W_i)^2\big] + 2 \sum_{0 \le i < j \le n-1} \mathbb{E}\big[H_i H_j \Delta W_i \Delta W_j\big]
$$

   - Với mọi cặp $i < j$ suy ra $t_i < t_{i+1} \le t_j < t_{j+1}$: tích $H_i \Delta W_i H_j$ đã đo được hoàn toàn đối với $\mathcal{F}_{t_j}$, còn gia số tương lai $\Delta W_j$ độc lập với $\mathcal{F}_{t_j}$, nên $\mathbb{E}[H_i H_j \Delta W_i \, \mathbb{E}[\Delta W_j \mid \mathcal{F}_{t_j}]] = 0$ — mọi tích chéo triệt tiêu sạch sẽ!
   - Với hạng tử đường chéo $i = j$: nhờ $H_i^2 \in \mathcal{F}_{t_i}$ và $\mathbb{E}[(\Delta W_i)^2 \mid \mathcal{F}_{t_i}] = t_{i+1} - t_i$, ta có $\sum_{i=0}^{n-1} \mathbb{E}[H_i^2](t_{i+1} - t_i) = \mathbb{E}\left[\int_0^T H_t^2 \, dt\right]$. Nhờ bảo toàn chuẩn đẳng cự giữa hai không gian Hilbert đầy đủ, mọi dãy bậc thang $H^{(k)} \to H$ kéo theo $I_T(H^{(k)})$ hội tụ trong $L^2(\Omega)$ tới giới hạn duy nhất $I_T(H)$. $\blacksquare$

Bằng phân cực hóa $(H + G)^2 - (H - G)^2$, ta thu ngay hiệp phương sai của hai tích phân ngẫu nhiên và phân phối chuẩn chính xác khi hàm dưới dấu tích phân $h(t)$ là hàm tất định:

$$
\mathbb{E}\left[\left(\int_0^T H_t \, dW_t\right)\left(\int_0^T G_t \, dW_t\right)\right] = \mathbb{E}\left[\int_0^T H_t G_t \, dt\right], \qquad \int_0^T h(t) \, dW_t \sim \mathcal{N}\left(0, \, \int_0^T h(t)^2 \, dt\right)
$$

---

## 3. Suy dẫn Bổ đề Itô Một Chiều và Đa Chiều

Xét quá trình khuếch tán $X_t = X_0 + \int_0^t a_s \, ds + \int_0^t b_s \, dW_s$, viết gọn dưới dạng vi phân là $dX_t = a_t \, dt + b_t \, dW_t$. Theo bảng nhân vi phân $(dt)^2 = 0$, $dt \, dW_t = 0$ và $(dW_t)^2 = dt$ từ `M6.01`, bình phương vi phân của $X_t$ giữ lại duy nhất bình phương hệ số khuếch tán: $(dX_t)^2 = (a_t \, dt + b_t \, dW_t)^2 = b_t^2 \, dt$.

Với hàm trơn $f(t, x) \in C^{1,2}([0, T] \times \mathbb{R})$ khả vi cấp một theo $t$ và cấp hai theo $x$, khai triển Taylor đến bậc hai cho $df(t, X_t) = \frac{\partial f}{\partial t} dt + \frac{\partial f}{\partial x} dX_t + \frac{1}{2}\frac{\partial^2 f}{\partial x^2} (dX_t)^2 + o(dt)$ rồi thế $dX_t$ cùng $(dX_t)^2 = b_t^2 \, dt$ vào, số hạng đạo hàm bậc hai đóng góp trực tiếp vào hệ số trôi $dt$, tạo nên **Bổ đề Itô một chiều**:

$$
df(t, X_t) = \left(\frac{\partial f}{\partial t} + a_t \frac{\partial f}{\partial x} + \frac{1}{2} b_t^2 \frac{\partial^2 f}{\partial x^2}\right) dt + b_t \frac{\partial f}{\partial x} \, dW_t
$$

Kiểm tra nhanh lại ví dụ mở đầu: chọn $X_t = W_t$ có $a_t = 0, b_t = 1$ và $f(x) = \frac{1}{2}x^2$ có $f'(x) = x, f''(x) = 1$, công thức trên cho ngay $d\left(\frac{1}{2}W_t^2\right) = \frac{1}{2} dt + W_t \, dW_t \iff \int_0^T W_t \, dW_t = \frac{1}{2}W_T^2 - \frac{1}{2}T$ trong đúng một dòng!

Khi mở rộng sang không gian đa chiều cho $d$ quá trình $dX_t^{(i)} = a_t^{(i)} dt + \sigma_t^{(i)} dW_t^{(i)}$ có tương quan tức thời $dW_t^{(i)} dW_t^{(j)} = \rho_{ij, t} \, dt \implies dX_t^{(i)} dX_t^{(j)} = \rho_{ij, t} \sigma_t^{(i)} \sigma_t^{(j)} dt$, ta có **Bổ đề Itô đa chiều và Quy tắc Tích Ngẫu nhiên**:

$$
df(t, X_t) = \frac{\partial f}{\partial t} dt + \sum_{i=1}^d \frac{\partial f}{\partial x_i} dX_t^{(i)} + \frac{1}{2}\sum_{i=1}^d \sum_{j=1}^d \frac{\partial^2 f}{\partial x_i \partial x_j} dX_t^{(i)} dX_t^{(j)}, \qquad d(X_t Y_t) = X_t \, dY_t + Y_t \, dX_t + dX_t \, dY_t
$$

---

## 4. Chuyển động Brown Hình học, Bào mòn Biến động & Bơm Tăng trưởng Shannon

### 4.1. Giải Tường minh Chuyển động Brown Hình học & Sự Bào mòn Biến động

Mô hình chuẩn cho giá cổ phiếu dương có lợi suất kỳ vọng $\mu \in \mathbb{R}$ và độ biến động $\sigma > 0$ là **Chuyển động Brown Hình học** (Geometric Brownian Motion — `GBM`): $dS_t = \mu S_t \, dt + \sigma S_t \, dW_t$ với $S_0 > 0$. Đặt $f(S) = \ln S$ có $f'(S) = \frac{1}{S}$ và $f''(S) = -\frac{1}{S^2} < 0$, áp dụng Bổ đề Itô với $a_t = \mu S_t, b_t = \sigma S_t$:

$$
d(\ln S_t) = \frac{1}{S_t}(\mu S_t \, dt + \sigma S_t \, dW_t) + \frac{1}{2}\left(-\frac{1}{S_t^2}\right)(\sigma^2 S_t^2 \, dt) = \left(\mu - \frac{1}{2}\sigma^2\right) dt + \sigma \, dW_t \implies S_T = S_0 \exp\left(\left(\mu - \frac{1}{2}\sigma^2\right) T + \sigma W_T\right)
$$

Hạng tử âm $-\frac{1}{2}\sigma^2$ trong số mũ chính là **Sự Bào mòn Biến động** (Volatility Drag). Hãy đặt cạnh nhau kỳ vọng số học, trung vị và tốc độ tăng trưởng kép dài hạn của $S_T$:

$$
\mathbb{E}[S_T] = S_0 e^{(\mu - \frac{1}{2}\sigma^2)T} \mathbb{E}\big[e^{\sigma W_T}\big] = S_0 e^{\mu T}, \qquad \operatorname{Med}(S_T) = S_0 e^{(\mu - \frac{1}{2}\sigma^2)T}, \qquad \lim_{T \to \infty} \frac{1}{T}\ln\frac{S_T}{S_0} = \mu - \frac{1}{2}\sigma^2 \quad (\text{h.c.c.})
$$

Xét một mã cổ phiếu đầu cơ có lợi suất trung bình số học dương $\mu = +10\%/\text{năm}$ nhưng biến động cao $\sigma = 60\%/\text{năm}$: mặc dù $\mathbb{E}[S_T] = S_0 e^{0.10 T} \to +\infty$, tốc độ tăng trưởng kép hình học thực tế lại âm chặt $\mu - \frac{1}{2}\sigma^2 = 0.10 - 0.18 = -8.0\%/\text{năm} < 0$! Nhờ $\frac{W_T}{T} \to 0$, với xác suất $100\%$ tài sản của nhà đầu tư ôm giữ thụ động sẽ suy tàn về $0$ ($S_T \to 0$ hầu chắc chắn); kỳ vọng số học $\mathbb{E}[S_T]$ chỉ dương nhờ cực ít siêu quỹ đạo trúng độc đắc ở đuôi phải phân phối Log-chuẩn!

### 4.2. Nghịch lý Con quỷ Shannon & Phần bù Tái cân bằng Danh mục Liên tục

Từ công thức bào mòn biến động, Claude Shannon chỉ ra hiện tượng **Con quỷ Shannon hay Bơm Tăng trưởng Thặng dư** (Shannon's Demon / Excess Growth Pumping): giữ tỷ trọng cố định $w \in (0, 1)$ vào cổ phiếu `GBM` ở trên ($\mu = 10\%, \sigma = 60\%$) và $(1 - w)$ vào tiền mặt lãi suất $0$, tái cân bằng liên tục sao cho $\frac{dV_t}{V_t} = w \frac{dS_t}{S_t} = w\mu \, dt + w\sigma \, dW_t$. Tốc độ tăng trưởng hình học của danh mục đạt cực đại Kelly dương chặt:

$$
g(w) = w\mu - \frac{1}{2}w^2\sigma^2, \qquad w^\star = \frac{\mu}{\sigma^2} \approx 27.8\%, \qquad g(w^\star) = \frac{\mu^2}{2\sigma^2} \approx +1.39\%/\text{năm} > 0
$$

Tổng quát cho $K$ tài sản `GBM` không tương quan cùng có $(\mu, \sigma)$ tái cân bằng đều $w_i = \frac{1}{K}$, phương sai danh mục giảm còn $\frac{\sigma^2}{K}$, nâng tăng trưởng kép lên $g_{\text{port}} = \mu - \frac{\sigma^2}{2K} = g_{\text{asset}} + \frac{K - 1}{2K}\sigma^2$, trong đó $\frac{K - 1}{2K}\sigma^2 > 0$ là **Phần bù Tái cân bằng** (Rebalancing Bonus) thu được nhờ tự động chốt lời tài sản vừa tăng để mua thêm tài sản vừa giảm! Đoạn mã NumPy dưới đây kiểm chứng trực tiếp nghịch lý này trên $40{,}000$ quỹ đạo trong $T = 25$ năm:

```python
import numpy as np

rng = np.random.default_rng(42)
T, steps, n_paths = 25.0, 25 * 252, 40_000
dt, mu, sigma = T / steps, 0.10, 0.60
dW = rng.normal(0.0, np.sqrt(dt), size=(n_paths, steps))

# 1. Ôm thụ động 100% tài sản GBM (mu = 10%, sigma = 60% -> g = -8%/năm)
S_T = np.exp(np.sum((mu - 0.5 * sigma**2) * dt + sigma * dW, axis=1))
# 2. Tái cân bằng liên tục Kelly w* = mu / sigma^2 = 27.8% (g* = +1.39%/năm)
w_star = mu / (sigma**2)
V_T = np.exp(np.sum((w_star * mu - 0.5 * (w_star * sigma) ** 2) * dt + w_star * sigma * dW, axis=1))

print(f"Buy & Hold -> Mean: {S_T.mean():.2f}x (ly thuyet {np.exp(mu*T):.2f}x), Median: {np.median(S_T):.3f}x")
print(f"Shannon Kelly -> Median: {np.median(V_T):.3f}x (ly thuyet {np.exp(0.5*(mu/sigma)**2 * T):.3f}x)")
```

> [!NOTE]
> **Quy tắc Half-Kelly Trên Bàn Phân bổ Vốn Đa Chiến lược:**
> Nhìn vào hàm tăng trưởng $g(w) = w\mu - \frac{1}{2}w^2\sigma^2$, hãy chú ý sự bất đối xứng cực kỳ nguy hiểm quanh điểm tối ưu $w^\star = \frac{\mu}{\sigma^2}$:
> - Nếu bạn dùng đòn bẩy **gấp đôi mức Kelly** là $w = 2w^\star = \frac{2\mu}{\sigma^2}$, toàn bộ tốc độ tăng trưởng dài hạn bị bào mòn về đúng con số không: $g(2w^\star) = \frac{2\mu^2}{\sigma^2} - \frac{1}{2}\frac{4\mu^2}{\sigma^4}\sigma^2 = 0$, trong khi bạn phải gánh chịu biến động gấp đôi! Nếu ước lượng $\hat{\mu}$ của bạn bị phóng đại quá lạc quan khiến $w > 2w^\star$, tài khoản chuyển sang suy tàn hàm mũ $g(w) < 0$!
> - Ngược lại, nếu bạn thận trọng chỉ đặt cược **nửa mức Kelly** là $w = \frac{1}{2}w^\star = \frac{\mu}{2\sigma^2}$:
>
> $$
> g\!\left(\frac{1}{2}w^\star\right) = \frac{\mu^2}{2\sigma^2} - \frac{1}{2}\left(\frac{\mu^2}{4\sigma^4}\right)\sigma^2 = \frac{3}{8}\frac{\mu^2}{\sigma^2} = \frac{3}{4}\,g(w^\star)
> $$
>
> Bạn giữ lại được tới **$75\%$ tốc độ tăng trưởng kép tối đa**, nhưng cắt giảm được **$50\%$ độ biến động danh mục** và hạ xác suất sụt giảm vốn sâu đi theo hàm mũ! Đây là lý do toán học khiến hầu hết các quỹ định lượng như Renaissance, Two Sigma và Citadel luôn vận hành ở vùng $0.3\times\text{–}0.5\times$ Kelly lý thuyết.

---

## 5. Ví dụ Phỏng vấn Thực chiến: Giải Quá trình Ornstein-Uhlenbeck & Mô-men Bậc cao

**Đề bài — Phỏng vấn Nghiên cứu Định lượng tại Two Sigma và D. E. Shaw:**
1. **Phần A:** Giải tường minh phương trình hồi quy trung bình Ornstein-Uhlenbeck $dX_t = \kappa(\theta - X_t) \, dt + \sigma \, dW_t$ với $\kappa > 0, \sigma > 0$ và tìm phương sai dừng khi $T \to \infty$.
2. **Phần B:** Không tính bất kỳ tích phân mật độ xác suất nào, hãy dùng Bổ đề Itô tìm công thức truy hồi của $\mathbb{E}[W_T^{2m}]$ và tính nhẩm $\mathbb{E}[W_T^4]$, $\mathbb{E}[W_T^6]$.

**Lời giải Chi tiết:**
- **Giải Phần A:** Viết lại $dX_t + \kappa X_t \, dt = \kappa \theta \, dt + \sigma \, dW_t$ và nhân thừa số tích phân trơn $e^{\kappa t}$. Do $e^{\kappa t}$ có biến thiên bậc hai bằng $0$, quy tắc tích ngẫu nhiên cho $d(e^{\kappa t} X_t) = e^{\kappa t} dX_t + \kappa e^{\kappa t} X_t \, dt = \kappa \theta e^{\kappa t} dt + \sigma e^{\kappa t} dW_t$. Lấy tích phân trên $[0, T]$, chia cho $e^{\kappa T}$ và áp dụng đẳng cự cho hàm tất định $h(t) = \sigma e^{-\kappa(T - t)}$:

$$
X_T = X_0 e^{-\kappa T} + \theta(1 - e^{-\kappa T}) + \sigma \int_0^T e^{-\kappa(T - t)} \, dW_t, \qquad \operatorname{Var}(X_T) = \sigma^2 \int_0^T e^{-2\kappa(T - t)} \, dt = \frac{\sigma^2}{2\kappa}\big(1 - e^{-2\kappa T}\big)
$$

  Khi $T \to \infty$, trạng thái $X_T$ quên sạch điểm xuất phát $X_0$ với chu kỳ bán rã $\frac{\ln 2}{\kappa}$ và hội tụ về phân phối chuẩn dừng $\mathcal{N}\left(\theta, \, \frac{\sigma^2}{2\kappa}\right)$!
- **Giải Phần B:** Áp dụng Bổ đề Itô cho $f(x) = x^{2m}$ với $m \ge 2$ rồi lấy kỳ vọng hai vế để triệt tiêu tích phân Martingale $\mathbb{E}\left[\int_0^T W_t^{2m-1} dW_t\right] = 0$:

$$
W_T^{2m} = 2m \int_0^T W_t^{2m-1} \, dW_t + m(2m - 1) \int_0^T W_t^{2m-2} \, dt \implies \mathbb{E}[W_T^{2m}] = m(2m - 1) \int_0^T \mathbb{E}[W_t^{2m-2}] \, dt
$$

  Từ $\mathbb{E}[W_t^2] = t$, thay $m = 2$ có $\mathbb{E}[W_T^4] = 6 \int_0^T t \, dt = \mathbf{3T^2}$; thay tiếp $m = 3$ có $\mathbb{E}[W_T^6] = 15 \int_0^T 3t^2 \, dt = \mathbf{15T^3}$ chỉ trong vài giây!

---

## 6. Cạm bẫy Thực tế: Sai số Rời rạc Hóa & Ảo tưởng Tái cân bằng Không Ma sát

Khi mô phỏng phương trình tổng quát $dX_t = a(X_t)\,dt + b(X_t)\,dW_t$ chưa có nghiệm đóng — chẳng hạn mô hình biến động ngẫu nhiên Heston hay lãi suất đàn hồi hằng số — khai triển Taylor-Itô bậc hai giữ thêm số hạng $\int_{t_k}^{t_{k+1}} \int_{t_k}^s b(X_u)b'(X_u)\,dW_u\,dW_s \approx \frac{1}{2}b(X_k)b'(X_k)\big[(\Delta W_k)^2 - \Delta t\big]$:

$$
X_{k+1}^{\text{Milstein}} = X_k + a(X_k)\Delta t + b(X_k)\Delta W_k + \frac{1}{2}b(X_k)b'(X_k)\Big[(\Delta W_k)^2 - \Delta t\Big]
$$

Bảng đối chiếu dưới đây giúp bạn chọn ngay lược đồ số chuẩn xác trên cụm máy chủ mô phỏng:

| Sơ đồ rời rạc hóa trên lưới $\Delta t$ | Công thức cập nhật bước $X_{k+1} - X_k$ | Bậc hội tụ mạnh $\mathbb{E}[\|X_T - \hat{X}_T\|]$ | Khi nào bắt buộc nâng cấp? |
| :--- | :--- | :--- | :--- |
| **Cộng tuyến tính ngây thơ** | $a(X_k)\Delta t + b(X_k)\Delta W_k$ | $O\big(\Delta t^{1/2}\big)$ — hội tụ rất chậm | Phá vỡ miền dương của giá và biến động khi $b'(x) \neq 0$ |
| **Hiệu chỉnh bậc hai Milstein** | $a(X_k)\Delta t + b(X_k)\Delta W_k + \frac{1}{2}b(X_k)b'(X_k)\big[(\Delta W_k)^2 - \Delta t\big]$ | $O(\Delta t)$ — tăng gấp đôi bậc hội tụ | Mọi quá trình có hệ số khuếch tán phụ thuộc trạng thái $b'(X) \neq 0$ |
| **Biến đổi Log-chính xác cho `GBM`** | $X_k\big(\exp[(a_0 - \frac{1}{2}\sigma^2)\Delta t + \sigma\Delta W_k] - 1\big)$ | Chính xác tuyệt đối phân phối tại mọi $\Delta t$ | Luôn ưu tiên số một khi có phép đổi biến tuyến tính hóa Bổ đề Itô |

> [!WARNING]
> **Hai Cái bẫy Khi Đưa Công thức Liên tục Vào Bộ Kiểm thử Lịch sử:**
> 1. **Giá trị Âm Giả tạo Của Phép Rời rạc Hóa Euler-Maruyama** (Euler-Maruyama Discretization): Nếu bạn mô phỏng `GBM` bằng phép cộng tuyến tính $S_{t + \Delta t} = S_t(1 + \mu \Delta t + \sigma \Delta W_t)$, biến chuẩn $\Delta W_t$ không bị chặn dưới nên có xác suất dương làm giá cổ phiếu âm khi $\sigma \sqrt{\Delta t}$ lớn! Luôn dùng hiệu chỉnh bậc hai Milstein $\frac{1}{2}b(X_k)b'(X_k)\big[(\Delta W_k)^2 - \Delta t\big]$ hoặc rời rạc hóa chính xác trên không gian logarit.
> 2. **Phí Giao dịch Nuốt chửng Con quỷ Shannon:** Tái cân bằng tỷ trọng liên tục dọc theo chuyển động Brown đòi hỏi khối lượng mua bán tích lũy tỉ lệ với biến thiên bậc một $\sum |w^\star \Delta S_i| = +\infty$! Khi có phí giao dịch tỷ lệ $c_{\text{cost}} > 0$, tái cân bằng mỗi phút sẽ đốt cháy tài khoản vì trượt giá. Ngoài thực tế như đã chứng minh ở `M5.02`, chiến lược bơm tăng trưởng chỉ có lãi ròng khi cài đặt vùng đệm không giao dịch xung quanh $w^\star$ có bề rộng tỉ lệ với căn bậc ba của phí giao dịch $\Delta w_{\text{band}} \propto c_{\text{cost}}^{1/3}$.
