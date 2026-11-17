# M6.03 — Định lý Feynman-Kac, Phương trình Black-Scholes, Đổi Độ đo Girsanov & Động lực học Greeks

## 1. Trực giác & Động lực: Sự Thống nhất Kỳ diệu Giữa Giải tích Đạo hàm Riêng và Xác suất

Trong toán tài chính định lượng, có hai con đường tưởng chừng độc lập hoàn toàn để định giá một hợp đồng phái sinh phụ thuộc vào tài sản cơ sở $X_t$ tại ngày đáo hạn $T$:
- **Con đường Giải tích Tất định:** Lập danh mục phòng vệ triệt tiêu hoàn toàn thành phần nhiễu ngẫu nhiên ở từng khoảnh khắc $dt$, từ đó ép hàm giá trị $u(t, x)$ phải thỏa mãn một **Phương trình Đạo hàm Riêng Parabolic** (Parabolic Partial Differential Equation) giải ngược từ điều kiện biên cuối kỳ $T$ về hiện tại $t$.
- **Con đường Xác suất Martingale:** Giữ nguyên quỹ đạo ngẫu nhiên, chuyển hệ quy chiếu từ thế giới vật lý $\mathbb{P}$ sang thế giới trung hòa rủi ro $\mathbb{Q}$ nơi mọi tài sản sinh lời kỳ vọng bằng lãi suất phi rủi ro $r$, rồi lấy trực tiếp kỳ vọng giá trị chiết khấu của khoản chi trả đáo hạn!

Hai con đường này hội tụ làm một thông qua hai định lý nền tảng: **Định lý Feynman-Kac** và **Định lý Girsanov**. Không dừng lại ở công thức định giá lý thuyết, việc mổ xẻ từng số hạng trong phương trình Black-Scholes-Merton còn bóc trần cơ chế hạch toán lãi lỗ hàng ngày của các bàn giao dịch quyền chọn tại Citadel Securities, Optiver hay Susquehanna: nắm giữ quyền chọn đã phòng vệ tuyến tính thực chất là đặt cược trực tiếp vào chênh lệch giữa phương sai thực hiện và phương sai hàm ẩn!

---

## 2. Định lý Feynman-Kac: Biểu diễn Nghiệm Đạo hàm Riêng Bằng Kỳ vọng Khuếch tán

Xét quá trình khuếch tán Markov $X_s$ trên đoạn thời gian $s \in [t, T]$ xuất phát từ trạng thái $X_t = x$, tuân theo phương trình vi phân ngẫu nhiên $dX_s = \mu(s, X_s) \, ds + \sigma(s, X_s) \, dW_s$. Cho trước hàm tốc độ chiết khấu liên tục $r(t, x) \ge 0$ và hàm chi trả đáo hạn $\Psi(x)$. Xét bài toán biên ngược thời gian tìm hàm trơn $u(t, x) \in C^{1,2}([0, T) \times \mathbb{R}) \cap C([0, T] \times \mathbb{R})$ thỏa mãn:

$$
\frac{\partial u}{\partial t}(t, x) + \mu(t, x)\frac{\partial u}{\partial x}(t, x) + \frac{1}{2}\sigma^2(t, x)\frac{\partial^2 u}{\partial x^2}(t, x) - r(t, x) u(t, x) = 0, \qquad u(T, x) = \Psi(x)
$$

**Định lý 6.4 — Định lý Biểu diễn Feynman-Kac** (Feynman-Kac Representation Theorem): *Giả sử $u(t, x)$ là nghiệm của bài toán biên trên và thỏa điều kiện tăng trưởng đa thức sao cho tích phân ngẫu nhiên liên kết khả tích bình phương. Khi đó $u(t, x)$ trùng khít với kỳ vọng có điều kiện của khoản chi trả cuối kỳ đã chiết khấu dọc theo quỹ đạo khuếch tán:*

$$
u(t, x) = \mathbb{E}\left[\exp\left(-\int_t^T r(s, X_s) \, ds\right) \Psi(X_T) \,\middle|\, X_t = x\right]
$$

**Chứng minh Ngắn gọn Tuyệt đẹp Bằng Quá trình Chiết khấu Martingale:**
1. Với mốc xuất phát $t$ cố định và $X_t = x$, đặt nhân tử chiết khấu tích lũy $D_s \triangleq \exp\left(-\int_t^s r(v, X_v) \, dv\right)$ cho $s \in [t, T]$. Lưu ý $D_t = 1$ và $D_s$ có biến thiên hữu hạn trơn theo $s$ với vi phân tất định $dD_s = -r(s, X_s) D_s \, ds$, kéo theo biến thiên bậc hai chéo $dD_s \cdot du(s, X_s) = 0$.
2. Xét quá trình giá trị chiết khấu $M_s \triangleq D_s \, u(s, X_s)$. Áp dụng Quy tắc Tích Ngẫu nhiên kết hợp Bổ đề Itô cho $du(s, X_s)$:

$$
dM_s = D_s \left[\frac{\partial u}{\partial s} + \mu(s, X_s)\frac{\partial u}{\partial x} + \frac{1}{2}\sigma^2(s, X_s)\frac{\partial^2 u}{\partial x^2} - r(s, X_s) u\right] ds + D_s \sigma(s, X_s) \frac{\partial u}{\partial x}(s, X_s) \, dW_s
$$

3. Vì $u$ thỏa mãn phương trình đạo hàm riêng nêu trên, toàn bộ biểu thức trong ngoặc vuông nhân với $ds$ **triệt tiêu đồng nhất bằng $0$**! Tích phân từ $s = t$ đến $s = T$ cho $M_T - M_t = \int_t^T D_s \sigma(s, X_s) \frac{\partial u}{\partial x}(s, X_s) \, dW_s$.
4. Lấy kỳ vọng có điều kiện $\mathbb{E}[\,\cdot \mid X_t = x]$ hai vế: tích phân Itô có kỳ vọng bằng $0$, suy ra $u(t, x) = M_t = \mathbb{E}[M_T \mid X_t = x] = \mathbb{E}\big[D_T \Psi(X_T) \mid X_t = x\big]$! $\blacksquare$

---

## 3. Suy dẫn Phương trình Black-Scholes-Merton & Đổi Độ đo Girsanov

### 3.1. Danh mục Phòng vệ Tự tài trợ và Sự Biến mất Của Tốc độ Trôi Vật lý $\mu$

Giả sử dưới độ đo thực tế $\mathbb{P}$, cổ phiếu không trả cổ tức tuân theo chuyển động Brown hình học $dS_t = \mu S_t \, dt + \sigma S_t \, dW_t^{\mathbb{P}}$ với $\sigma > 0$, và tài khoản tiền tệ hưởng lãi suất phi rủi ro liên tục $r$. Để định giá quyền chọn $V(t, S_t)$ có chi trả đáo hạn $\Psi(S_T)$, ta lập **Danh mục Phòng vệ Tự tài trợ** (Self-Financing Hedged Portfolio) mua $1$ quyền chọn và bán khống $\Delta_t$ cổ phiếu: $\Pi_t = V(t, S_t) - \Delta_t S_t$.

Trong khoảng thời gian vô cùng bé $dt$ mà số lượng cổ phiếu $\Delta_t$ vừa khóa tại đầu đoạn, biến thiên tự tài trợ bằng $d\Pi_t = dV(t, S_t) - \Delta_t \, dS_t$. Khai triển $dV$ bằng Bổ đề Itô rồi chọn tỷ số phòng vệ $\Delta_t = \frac{\partial V}{\partial S}(t, S_t)$:
- Thành phần nhiễu ngẫu nhiên $\sigma S_t \left(\frac{\partial V}{\partial S} - \Delta_t\right) dW_t^{\mathbb{P}}$ triệt tiêu hoàn toàn về $0$, biến $\Pi_t$ thành tài sản phi rủi ro cục bộ.
- Đồng thời hai số hạng chứa tốc độ trôi chủ quan $\pm \mu S_t \frac{\partial V}{\partial S} dt$ **cũng triệt tiêu lẫn nhau sạch dấu vết**!

Điều kiện không kinh doanh chênh lệch giá buộc danh mục phi rủi ro phải sinh lời đúng bằng lãi suất $r$: $d\Pi_t = r \Pi_t \, dt = r\left(V - S_t \frac{\partial V}{\partial S}\right) dt$, dẫn thẳng tới phương trình Black-Scholes-Merton:

$$
\frac{\partial V}{\partial t} + r S \frac{\partial V}{\partial S} + \frac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} - r V = 0, \qquad V(T, S) = \Psi(S)
$$

Câu trả lời kinh điển cho mọi buổi phỏng vấn: *Tại sao hai nhà đầu tư có kỳ vọng xu hướng cổ phiếu trái ngược nhau ($\mu_1 = +25\%$ so với $\mu_2 = -15\%$) vẫn định giá quyền chọn bằng đúng một con số?* Bởi vì phần thưởng rủi ro $\mu$ đã bị khóa chặt và khử sạch qua chân bán khống $-\Delta_t S_t$; chi phí tái tạo quyền chọn chỉ phụ thuộc vào chi phí vốn $r$ và biến động $\sigma$!

### 3.2. Định lý Đổi Độ đo Girsanov & Nghiệm Đóng Quyền chọn Kiểu Âu

Đối chiếu phương trình Black-Scholes với Định lý Feynman-Kac, hệ số trôi $\mu S$ đã được thay bằng $r S$. **Định lý Đổi Độ đo Girsanov** (Girsanov Change-of-Measure) thực hiện phép tịnh tiến hệ số trôi này trên không gian xác suất: đặt giá thị trường của rủi ro $\theta \triangleq \frac{\mu - r}{\sigma}$ và định nghĩa mật độ Radon-Nikodym dương $Z_t$ từ Martingale hàm mũ của `M6.01`:

$$
Z_t \triangleq \left.\frac{d\mathbb{Q}}{d\mathbb{P}}\right|_{\mathcal{F}_t} = \exp\left(-\theta W_t^{\mathbb{P}} - \frac{1}{2}\theta^2 t\right), \qquad W_t^{\mathbb{Q}} \triangleq W_t^{\mathbb{P}} + \theta t = W_t^{\mathbb{P}} + \frac{\mu - r}{\sigma} t
$$

Với kỳ vọng mới $\mathbb{E}^{\mathbb{Q}}[Y] = \mathbb{E}^{\mathbb{P}}[Z_T Y]$, hàm sinh mô-men có điều kiện dưới $\mathbb{Q}$ của $W_t^{\mathbb{Q}} - W_s^{\mathbb{Q}}$ bằng đúng $\exp\big(\frac{1}{2}\lambda^2(t-s)\big)$, chứng minh $W_t^{\mathbb{Q}}$ là chuyển động Brown chuẩn dưới độ đo trung hòa rủi ro $\mathbb{Q}$! Thế $dW_t^{\mathbb{P}} = dW_t^{\mathbb{Q}} - \frac{\mu - r}{\sigma}dt$ vào phương trình cổ phiếu, ta được $dS_t = r S_t \, dt + \sigma S_t \, dW_t^{\mathbb{Q}}$. Tính kỳ vọng chiết khấu Feynman-Kac với kỳ hạn còn lại $\tau = T - t$ cho ra nghiệm đóng quyền chọn Mua $C$, quyền chọn Bán $P$ cùng hệ thức **Ngang giá Quyền chọn Mua – Bán** (Put-Call Parity):

$$
C(t, S) = S \Phi(d_1) - K e^{-r\tau} \Phi(d_2), \qquad C(t, S) - P(t, S) = S - K e^{-r\tau}, \qquad d_{1,2} = \frac{\ln(S / K) + \left(r \pm \frac{1}{2}\sigma^2\right)\tau}{\sigma \sqrt{\tau}}
$$

Lưu ý phân biệt sắc bén trong phòng thi: $\Phi(d_2) = \mathbb{Q}(S_T > K)$ là xác suất quyền chọn Mua đáo hạn có tiền dưới độ đo $\mathbb{Q}$, trong khi $\Phi(d_1) > \Phi(d_2)$ là xác suất dưới độ đo chọn cổ phiếu $S_t$ làm đơn vị hạch toán!

---

## 4. Động lực học Hệ số Nhạy cảm Greeks & Bản chất Lãi lỗ Của Bàn Giao dịch Biến động

### 4.1. Giải phẫu Bốn Hệ số Nhạy cảm Cốt lõi ($\Delta, \Gamma, \Theta, \mathcal{V}$)

Với hàm mật độ chuẩn tắc $\phi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2/2}$ và đồng nhất thức nội tại $S \phi(d_1) = K e^{-r\tau} \phi(d_2)$, bốn đạo hàm nhạy cảm chủ chốt của quyền chọn kiểu Âu gồm:

$$
\Delta_C = \frac{\partial C}{\partial S} = \Phi(d_1), \qquad \Gamma = \frac{\partial^2 V}{\partial S^2} = \frac{\phi(d_1)}{S \sigma \sqrt{\tau}} > 0, \qquad \mathcal{V} = \frac{\partial V}{\partial \sigma} = S \sqrt{\tau} \phi(d_1) = \sigma \tau S^2 \Gamma, \qquad \Theta_C = \frac{\partial C}{\partial t} = -\frac{S \sigma \phi(d_1)}{2\sqrt{\tau}} - r K e^{-r\tau}\Phi(d_2)
$$

Bảng dưới đây tóm tắt hành vi tiệm cận của các hệ số nhạy cảm quyền chọn Mua khi tiến sát giờ đáo hạn $\tau \to 0^+$:

| Trạng thái Giá so với $K$ | Độ nghiêng $\Delta_C$ khi $\tau \to 0^+$ | Độ lồi $\Gamma$ khi $\tau \to 0^+$ | Độ nhạy biến động $\mathcal{V}$ | Cảnh báo Quản trị Rủi ro Thực chiến |
| :--- | :--- | :--- | :--- | :--- |
| **Ngoài tiền sâu ($S \ll K$)** | Tiến nhanh về $0$ | Sụp về $0$ | Tiến về $0$ | Quyền chọn mất hết giá trị thời gian lẫn độ nhạy |
| **Ngang giá ($S = K$)** | Dao động quanh $0.50$ | **Bùng nổ ra $+\infty$** theo $\tau^{-1/2}$ | Tiến về $0$ theo $\sqrt{\tau}$ | Gây **Rủi ro Ghim Giá Đáo hạn** (Pin Risk) cực độ |
| **Trong tiền sâu ($S \gg K$)** | Tiến nhanh về $1$ | Sụp về $0$ | Tiến về $0$ | Hành xử tương đương nắm giữ $100\%$ cổ phiếu cơ sở |

### 4.2. Đẳng thức Đánh đổi Theta – Gamma và Phương trình PnL Biến động Thực hiện

Thay trực tiếp các ký hiệu $\Theta, \Delta, \Gamma$ vào phương trình Black-Scholes ở Mục 3.1, ta thu được **Đẳng thức Đánh đổi Theta – Gamma** (Theta-Gamma Tradeoff):

$$
\Theta + r S \Delta + \frac{1}{2}\sigma^2 S^2 \Gamma = r V \iff \Theta + \frac{1}{2}\sigma^2 S^2 \Gamma = r(V - S \Delta)
$$

Khi danh mục đã trung hòa Delta và gửi/vay phần tiền mặt $(V - S\Delta)$ ở lãi suất $r$, đẳng thức rút gọn thành $\Theta_{\text{net}} = -\frac{1}{2}\sigma^2 S^2 \Gamma$: không bao giờ có bữa trưa miễn phí — muốn sở hữu độ lồi dương $\Gamma > 0$ để kiếm tiền khi giá giật mạnh hai chiều, bàn giao dịch bắt buộc phải trả tiền thuê mỗi ngày bằng hao mòn thời gian $\Theta < 0$!

Đặc biệt, giả sử bạn mua quyền chọn tại mức biến động hàm ẩn $\sigma_{\text{imp}}$ và phòng vệ theo $\Delta_{\text{imp}} = \frac{\partial V}{\partial S}(t, S_t; \sigma_{\text{imp}})$, nhưng thị trường thực tế dao động với biến động thực hiện $\sigma_{\text{real}, t}$ theo $dS_t = \mu S_t \, dt + \sigma_{\text{real}, t} S_t \, dW_t^{\mathbb{P}}$. Khai triển Bổ đề Itô cho $dV(t, S_t; \sigma_{\text{imp}})$ với $(dS_t)^2 = \sigma_{\text{real}, t}^2 S_t^2 \, dt$ rồi thế $\Theta_{\text{imp}} - r(V_t - \Delta_{\text{imp}} S_t) = -\frac{1}{2}\sigma_{\text{imp}}^2 S_t^2 \Gamma_{\text{imp}}$, lãi lỗ ròng tức thời thu gọn thành công thức kim chỉ nam của mọi quỹ giao dịch biến động:

$$
d\text{PnL}_t = dV_t - \Delta_{\text{imp}} \, dS_t - r(V_t - \Delta_{\text{imp}} S_t)\,dt = \frac{1}{2} \Gamma_{\text{imp}} S_t^2 \left(\sigma_{\text{real}, t}^2 - \sigma_{\text{imp}}^2\right) dt
$$

Lãi lỗ từng ngày hoàn toàn độc lập với hướng đi $\mu$ bậc nhất và tỉ lệ thuận với tích giữa Dollar-Gamma $\frac{1}{2}\Gamma_{\text{imp}} S_t^2$ cùng chênh lệch phương sai thực hiện trừ phương sai hàm ẩn!

### 4.3. Mô phỏng Lướt Độ lồi Trên Đường Giá Rời rạc Bằng NumPy

Đoạn mã dưới đây tái hiện chính xác bàn giao dịch mua quyền chọn Mua kỳ hạn $T = 0.25$ năm tại biến động hàm ẩn $\sigma_{\text{imp}} = 20\%$, nhưng cổ phiếu ngoài đời thực biến động ở mức $\sigma_{\text{real}} = 30\%$ với hai kịch bản xu hướng trái chiều $\mu \in \{-25\%, +35\%\}$. Nhờ phòng vệ $\Delta_{\text{imp}}$ hàng giờ, lãi lỗ cuối kỳ hội tụ sát nút về tích phân lý thuyết $\int_0^T \frac{1}{2}\Gamma_{\text{imp}} S_t^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\,dt > 0$ bất chấp cổ phiếu tăng mạnh hay lao dốc:

```python
import numpy as np
from scipy.stats import norm

def bs_call_delta_gamma(S, K, tau, r, sigma):
    tau = np.maximum(tau, 1e-8)
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * tau) / (sigma * np.sqrt(tau))
    d2 = d1 - sigma * np.sqrt(tau)
    price = S * norm.cdf(d1) - K * np.exp(-r * tau) * norm.cdf(d2)
    delta = norm.cdf(d1)
    gamma = norm.pdf(d1) / (S * sigma * np.sqrt(tau))
    return price, delta, gamma

rng = np.random.default_rng(11)
S0, K, T, r, sig_imp, sig_real, n_steps = 100.0, 100.0, 0.25, 0.02, 0.20, 0.30, 600
dt = T / n_steps

for mu_true in (-0.25, 0.35):
    S = S0
    V0, delta, gamma = bs_call_delta_gamma(S, K, T, r, sig_imp)
    cash, theo_integral = -V0 + delta * S, 0.0
    for step in range(1, n_steps + 1):
        theo_integral += 0.5 * gamma * (S**2) * (sig_real**2 - sig_imp**2) * dt
        cash *= np.exp(r * dt)
        S *= np.exp((mu_true - 0.5 * sig_real**2) * dt + sig_real * rng.normal(0.0, np.sqrt(dt)))
        _, new_delta, gamma = bs_call_delta_gamma(S, K, T - step * dt, r, sig_imp)
        cash -= (new_delta - delta) * S
        delta = new_delta
    realized_pnl = max(S - K, 0.0) - delta * S + cash
    print(f"mu={mu_true:+.2f} | S_T={S:6.2f} | Hedged PnL={realized_pnl:+.3f} | Tich phan Gamma={theo_integral:+.3f}")
```

> [!NOTE]
> **Phương sai Phụ thuộc Đường đi Của Lãi lỗ Lướt Độ lồi:**
> Dù dấu của $\frac{1}{2}\Gamma_{\text{imp}} S_t^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)$ luôn dương khi $\sigma_{\text{real}} > \sigma_{\text{imp}}$ hằng số, **tổng số tiền lãi tuyệt đối** lại phụ thuộc mạnh vào quỹ đạo giá $S_t$! Nếu cổ phiếu đi ngang quanh giá thực hiện $S_t \approx K$ suốt kỳ hạn, $\Gamma_{\text{imp}}$ luôn ở đỉnh cực đại giúp bạn thu hoạch tối đa chênh lệch biến động; ngược lại nếu ngay tuần đầu cổ phiếu trôi dạt một mạch ra quá xa vùng $K$, $\Gamma_{\text{imp}} \to 0$ làm dòng thu nhập độ lồi tắt dần sớm. Để khử sự phụ thuộc vào mức giá $S_t$, các quỹ vĩ mô sử dụng **Hợp đồng Hoán đổi Phương sai** — được tổng hợp tĩnh từ dải quyền chọn trọng số $\frac{1}{K^2}$ trên toàn bộ mặt cắt giá thực hiện — để khóa cứng Dollar-Gamma hằng số tại mọi mức giá!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Định giá Hợp đồng Lũy thừa & Kiểm toán PnL Lướt Độ lồi

**Đề bài — Phỏng vấn Tạo lập Thị trường Quyền chọn tại Optiver, SIG và Citadel Securities:**
1. **Phần A:** Trong mô hình Black-Scholes, hãy tìm giá hợp lý tại $t = 0$ của hợp đồng lũy thừa trả $\Psi(S_T) = S_T^p$ với $p \in \mathbb{R}$ tại ngày đáo hạn $T$, và chỉ ra hệ số phòng vệ $\Delta_t$.
2. **Phần B:** Bàn của bạn mua ròng $1{,}000$ hợp đồng quyền chọn Mua ngang giá trên cổ phiếu $S = \$100$ — tổng quy mô $N_{\text{sh}} = 100{,}000$ cổ phiếu — tại biến động hàm ẩn năm $\sigma_{\text{imp}} = 20\%$ trên lịch $252$ phiên/năm với $\Gamma = 0.04$ mỗi cổ phiếu và $r = 0$. Hôm nay cổ phiếu đóng cửa tăng $+2.0\%$ lên $\$102$. Tính lãi lỗ ròng trong ngày của danh mục đã phòng vệ Delta!

**Lời giải Chi tiết:**
- **Giải Phần A:** Dưới $\mathbb{Q}$, $\ln(S_T / S_0) = \left(r - \frac{1}{2}\sigma^2\right)T + \sigma W_T^{\mathbb{Q}}$. Nâng lên lũy thừa $p$ và dùng hàm sinh mô-men chuẩn $\mathbb{E}^{\mathbb{Q}}\big[e^{p \sigma W_T^{\mathbb{Q}}}\big] = e^{\frac{1}{2}p^2 \sigma^2 T}$:

$$
V_0 = e^{-rT} \mathbb{E}^{\mathbb{Q}}\big[S_T^p\big] = S_0^p \exp\left(-rT + p\left(r - \frac{1}{2}\sigma^2\right)T + \frac{1}{2}p^2 \sigma^2 T\right) = S_0^p \exp\left(\left[(p - 1)r + \frac{1}{2}p(p - 1)\sigma^2\right] T\right)
$$

  Kiểm chứng nhanh: $p = 1$ cho $V_0 = S_0$; $p = 0$ cho $V_0 = e^{-rT}$; $p = 2$ cho $V_0 = S_0^2 e^{(r + \sigma^2)T}$ với tỷ số phòng vệ $\Delta_t = \frac{\partial V}{\partial S} = p \frac{V_t}{S_t}$!
- **Giải Phần B:** Phương sai hàm ẩn một phiên là $\frac{0.20^2}{252} \approx 0.00015873$, tương ứng ngưỡng biến động hòa vốn ngày $\frac{20\%}{\sqrt{252}} \approx 1.26\%$. Hôm nay cổ phiếu dịch chuyển $+2.0\% > 1.26\%$ nên $(\Delta S / S)^2 = 0.0004$, mang về khoản lãi ròng:

$$
\Delta \text{PnL}_{\text{day}} \approx \frac{1}{2} N_{\text{sh}} \Gamma S^2 \left[\left(\frac{\Delta S}{S}\right)^2 - \frac{\sigma_{\text{imp}}^2}{252}\right] = \frac{1}{2}(100{,}000)(0.04)(100^2)\big(0.0004 - 0.00015873\big) \approx +\$4{,}825.40
$$

  Trong đó tiền lời độ lồi từ cú nhảy $+2\%$ là $+\$8{,}000$, trừ hao mòn thời gian một ngày $-\$3{,}174.60$, chốt lãi ròng $+\$4{,}825.40$!

---

## 6. Cạm bẫy Thực tế: Độ Lệch Biến động Hàm ẩn & Thảm họa Bán Khống Độ Lồi

> [!WARNING]
> **Hai Giới hạn Sinh tử Của Giả định Black-Scholes Hằng số Trên Sàn Thực tế:**
> 1. **Độ Lệch Biến động Hàm ẩn** (Implied Volatility Skew): Giả định $\sigma$ hằng số bị bác bỏ hoàn toàn trên thị trường chỉ số S&P 500 — các quyền chọn Bán ngoài tiền sâu bảo vệ sập sàn luôn giao dịch ở mức $\sigma_{\text{imp}}$ cao hơn quyền chọn ngang giá từ $5\%$ đến $15\%$ do rủi ro nhảy giá xuống và cầu bảo hiểm định chế. Nếu dùng chung một tham số $\sigma$ phẳng để tính $\Delta$, bạn sẽ bỏ sót độ nhạy chéo giữa giá và biến động.
> 2. **Nổ Tài khoản Do Bán Khống Độ Lồi** (Short Convexity Blowup): Phương trình $d\text{PnL}_t$ giả định đường giá liên tục cho phép tái cân bằng mượt mà. Nếu bạn bán khống quyền chọn hưởng $\Theta > 0$ nhỏ giọt hàng ngày nhưng chịu $\Gamma < 0$, chỉ một buổi sáng cổ phiếu mở cửa nhảy hố $-25\%$ qua đêm sau tin tức xấu sẽ khiến bạn mất khả năng khớp lệnh phòng vệ ở mức giá trung gian; khoản lỗ bậc hai $-\frac{1}{2}|\Gamma|(\Delta S)^2$ phình gấp $25$ lần mức lỗ của cú giảm $-5\%$, xóa sổ nhiều năm lợi nhuận tích lũy!
