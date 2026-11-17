# M0.05 — Chuỗi số, Phương trình Sai phân Tuyến tính & Xấp xỉ Tiệm cận Trong Định lượng

## 1. Trực giác & Động lực: Giải Đệ quy Thành Công thức Đóng Trên Giấy Trong 60 Giây

Mọi kỹ sư phần mềm đều quen thuộc với quy hoạch động một chiều dạng `dp[n] = a * dp[n-1] + b * dp[n-2]`. Trên máy tính, bạn chỉ cần một vòng lặp `for` chạy $N$ bước. Nhưng trong phòng phỏng vấn của Jane Street hay khi phân tích tính dừng của chuỗi thời gian tự hồi quy `AR(2)` ở `M4.03`, bạn không có trình biên dịch Python trước mặt và $N$ có thể tiến ra vô cực!

Năng lực biến một hệ thức truy hồi rời rạc hoặc một tổng vô hạn thành **biểu thức giải tích đóng** và **xấp xỉ tiệm cận sắc nét** chính là mảnh ghép cuối cùng của cầu nối toán đại học `M0`. Nắm vững chương này giúp bạn đọc vị tức thì công thức chiết khấu cổ tức Gordon, định lượng lực cản biến động của lãi kép, tính nhẩm xác suất bước đi ngẫu nhiên trở lại gốc bằng công thức Stirling, và giải trọn vẹn bài toán Phá sản Con bạc trước cả khi học tới Martingale ở `M2.04`.

---

## 2. Chuỗi Cấp số Nhân, Đạo hàm Chuỗi Lũy thừa & Bốn Chuỗi Maclaurin Cốt lõi

### 2.1. Kỹ thuật Đạo hàm Từng Số hạng Trên Chuỗi Cấp số Nhân

Với công bội thực hoặc phức thỏa mãn $|r| < 1$, tổng riêng phần $S_n = \sum_{k=0}^n r^k = \frac{1 - r^{n+1}}{1 - r}$ hội tụ tuyệt đối về công thức nền tảng bậc nhất của định giá dòng tiền vĩnh cửu: $\sum_{k=0}^\infty r^k = \frac{1}{1 - r}$.

Khi gặp các bài toán tính kỳ vọng hoặc phương sai của biến ngẫu nhiên Hình học (số lần thử đến khi khớp lệnh đầu tiên), tuyệt đối đừng biến đổi sai phân thủ công! Vì chuỗi lũy thừa khả vi vô hạn lần bên trong bán kính hội tụ $|r| < 1$, ta **lấy đạo hàm theo $r$ hai vế** liên tiếp rồi nhân thêm $r$:

$$
\sum_{k=1}^\infty k r^{k-1} = \frac{d}{dr}\!\left(\frac{1}{1 - r}\right) = \frac{1}{(1 - r)^2} \implies \sum_{k=1}^\infty k r^k = \frac{r}{(1 - r)^2}
$$

Đạo hàm lần thứ hai cho mô-men giai thừa $\sum_{k=2}^\infty k(k - 1) r^{k-2} = \frac{2}{(1 - r)^3}$, suy ra ngay tổng bình phương $\sum_{k=1}^\infty k^2 r^k = \sum_{k=1}^\infty \big[k(k - 1) + k\big] r^k = \frac{2 r^2}{(1 - r)^3} + \frac{r}{(1 - r)^2} = \frac{r(1 + r)}{(1 - r)^3}$! Áp dụng cho $X \sim \operatorname{Geom}(p)$ với $r = 1 - p$: $\mathbb{E}[X] = \sum_{k=1}^\infty k (1 - p)^{k-1} p = p \cdot \frac{1}{p^2} = \frac{1}{p}$ trong đúng một dòng!

### 2.2. Bốn Khai triển Chuỗi Taylor và Nghịch lý Lực cản Biến động

Để xấp xỉ nhanh khi biến số $x$ rất nhỏ ($|x| \ll 1$, điển hình là lợi nhuận ngày $|R_t| \approx 0.01$ hoặc bước thời gian $\Delta t \to 0$), bạn cần phản xạ tức thì bốn khai triển Maclaurin quanh $x = 0$:
1. **Hàm mũ** ($\forall x \in \mathbb{R}$): $e^x = \sum_{k=0}^\infty \frac{x^k}{k!} = 1 + x + \frac{x^2}{2} + \frac{x^3}{6} + \mathcal{O}(x^4)$, kéo theo giới hạn lãi kép liên tục $\lim_{n \to \infty} \left(1 + \frac{x}{n}\right)^n = \lim_{n \to \infty} \exp\!\big(n \ln(1 + x/n)\big) = e^x$.
2. **Logarit tự nhiên** ($|x| < 1$, hội tụ có điều kiện tại $x = 1$ về $\ln 2$):

$$
\ln(1 + x) = \sum_{k=1}^\infty (-1)^{k-1} \frac{x^k}{k} = x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \dots
$$

3. **Nhị thức tổng quát với số mũ thực $\alpha \in \mathbb{R}$ bất kỳ** ($|x| < 1$): $(1 + x)^\alpha = 1 + \alpha x + \frac{\alpha(\alpha - 1)}{2} x^2 + \mathcal{O}(x^3)$ (ví dụ $\frac{1}{\sqrt{1 - x}} = (1 - x)^{-1/2} = 1 + \frac{1}{2}x + \frac{3}{8}x^2 + \dots$).
4. **Tổng riêng phần Chuỗi Điều hòa** ($n \to \infty$): $H_n = \sum_{k=1}^n \frac{1}{k} = \ln n + \gamma + \frac{1}{2n} + \mathcal{O}\!\left(\frac{1}{n^2}\right)$, với hằng số Euler-Mascheroni $\gamma \approx 0.5772$ (phân kỳ chậm theo logarit!).

**Ứng dụng Sát sườn — Giải thích Lực cản Biến động (Volatility Drag):** Xét tài sản có lợi nhuận đơn ngày $R_t$ với kỳ vọng nhỏ $\mathbb{E}[R_t] = \mu$ và phương sai $\operatorname{Var}(R_t) = \sigma^2$ ($\mathbb{E}[R_t^2] = \sigma^2 + \mu^2 \approx \sigma^2$). Tốc độ tăng trưởng vốn kép dài hạn trên mỗi phiên là kỳ vọng của lợi nhuận logarit $\ln(1 + R_t)$. Khai triển bậc hai từ Chuỗi số 2 cho ngay lập tức:

$$
g = \mathbb{E}\big[\ln(1 + R_t)\big] \approx \mathbb{E}\!\left[R_t - \frac{1}{2} R_t^2\right] \approx \mu - \frac{1}{2}\sigma^2
$$

Số hạng âm $-\frac{1}{2}\sigma^2$ chính là cội nguồn của Bổ đề Itô trong giải tích ngẫu nhiên và tiêu chuẩn đặt cược tối ưu Kelly ở `M5.03`: nếu bạn dùng đòn bẩy quá lớn làm $\sigma$ tăng gấp $k$ lần, lợi nhuận trung bình chỉ tăng theo $k\mu$ nhưng lực cản biến động bị phạt theo bình phương $-\frac{1}{2} k^2 \sigma^2$, sớm muộn kéo tốc độ tăng trưởng kép xuống âm!

---

## 3. Ký hiệu Tiệm cận Bachmann-Landau & Công thức Stirling

Trong phỏng vấn thuật toán phần mềm, kỹ sư thường dùng chung chữ `Big-O` cho mọi tốc độ tăng. Trong giải tích định lượng và lý thuyết xác suất, việc phân biệt rạch ròi ba ký hiệu tiệm cận khi $n \to \infty$ (hoặc $h \to 0$) quyết định đúng sai của cả một phép chứng minh vi phân:
- **$f(n) = \mathcal{O}\big(g(n)\big)$** *(Chặn trên cùng bậc)*: Tồn tại hằng số $C > 0$ và $n_0$ sao cho $|f(n)| \le C |g(n)|$ với mọi $n \ge n_0$.
- **$f(n) = o\big(g(n)\big)$** *(Nhỏ hơn không đáng kể về bậc)*: $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$ (ví dụ $(\Delta t)^{3/2} = o(\Delta t)$ khi $\Delta t \to 0$ — các số hạng $o(\Delta t)$ sẽ triệt tiêu sạch khi chia cho $\Delta t$ lấy đạo hàm thời gian!).
- **$f(n) \sim g(n)$** *(Tương đương tiệm cận — Asymptotic Equivalence)*: $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 1$, tương đương $f(n) = g(n)\big[1 + o(1)\big]$.

**Định lý 0.10 — Công thức Xấp xỉ Stirling và Xác suất Hòa vốn Bước đi Ngẫu nhiên:**
*Khi $n \to \infty$, giai thừa $n!$ thỏa mãn tương đương tiệm cận:*

$$
n! \sim \sqrt{2\pi n} \left(\frac{n}{e}\right)^n \iff \ln(n!) = n\ln n - n + \frac{1}{2}\ln(2\pi n) + \mathcal{O}\!\left(\frac{1}{n}\right)
$$

*Hệ quả trực tiếp: Xác suất một bước đi ngẫu nhiên đối xứng đồng xu công bằng quay đúng về điểm hòa vốn $S_{2n} = 0$ sau $2n$ bước suy giảm theo căn bậc hai thời gian:*

$$
\mathbb{P}(S_{2n} = 0) = \binom{2n}{n} \frac{1}{2^{2n}} \sim \frac{1}{\sqrt{\pi n}} \qquad (n \to \infty)
$$

**Chứng minh Sườn Tích phân & Áp dụng.** Lấy logarit $\ln(n!) = \sum_{k=1}^n \ln k$. Vì hàm $\ln x$ đồng biến và lõm trên $[1, \infty)$, kẹp tổng diện tích hình chữ nhật bởi tích phân $\int_1^n \ln x\,dx = \big[x\ln x - x\big]_1^n = n\ln n - n + 1$ thu được ngay hai số hạng dẫn đầu $n\ln n - n$; hiệu chỉnh hình thang Euler-Maclaurin cho số hạng bậc tiếp theo $\frac{1}{2}\ln n + \frac{1}{2}\ln(2\pi)$ (hằng số $\sqrt{2\pi}$ khớp với giới hạn chuẩn hóa Gauss!). Thay $n! \sim \sqrt{2\pi n}(n/e)^n$ và $(2n)! \sim \sqrt{4\pi n}(2n/e)^{2n}$ vào $\frac{(2n)!}{(n!)^2 4^n}$:

$$
\binom{2n}{n} 2^{-2n} \sim \frac{\sqrt{4\pi n} \, (2n)^{2n} \, e^{-2n}}{\big(\sqrt{2\pi n} \, n^n \, e^{-n}\big)^2 \cdot 4^n} = \frac{2\sqrt{\pi n} \cdot 4^n n^{2n} e^{-2n}}{2\pi n \cdot n^{2n} e^{-2n} \cdot 4^n} = \frac{1}{\sqrt{\pi n}}
$$

Vì chuỗi $\sum_{n=1}^\infty \frac{1}{\sqrt{\pi n}} = +\infty$ phân kỳ (bậc $p = 1/2 \le 1$), số lần trở lại điểm hòa vốn kỳ vọng trên trục thời gian vô hạn là $+\infty$, giải thích vì sao bước đi ngẫu nhiên 1 chiều chắc chắn quay lại vạch xuất phát với xác suất $100\%$! $\blacksquare$

---

## 4. Phương trình Sai phân Tuyến tính Bậc hai & Hàm Sinh

Xét **phương trình sai phân tuyến tính bậc hai hệ số hằng** (Second-Order Linear Difference Equation) dạng tổng quát $a u_{n+2} + b u_{n+1} + c u_n = d_n$ ($a \neq 0, c \neq 0$). Tương tự phương trình vi phân, nghiệm tổng quát bằng tổng của nghiệm thuần nhất $u_n^{(h)}$ (khi vế phải bằng $0$) cộng một nghiệm riêng $u_n^{(p)}$ bất kỳ của phương trình đầy đủ.

**Định lý 0.11 — Nghiệm Tổng quát Qua Đa thức Đặc trưng $a r^2 + b r + c = 0$:**
*Đặt $r_1, r_2 \in \mathbb{C}$ là hai nghiệm của đa thức đặc trưng $P(r) = a r^2 + b r + c = 0$:*
1. **Hai nghiệm phân biệt ($r_1 \neq r_2$)**: *Nghiệm thuần nhất tổng quát là $u_n^{(h)} = C_1 r_1^n + C_2 r_2^n$. (Nếu $r_{1,2} = \rho e^{\pm i\theta}$ phức liên hợp, viết dạng thực $u_n^{(h)} = \rho^n(A\cos n\theta + B\sin n\theta)$; mọi nghiệm tắt dần về $0$ khi $n \to \infty \iff \max(|r_1|, |r_2|) < 1$).*
2. **Nghiệm kép ($r_1 = r_2 = r_0 = -\frac{b}{2a}$ khi $b^2 - 4ac = 0$)**: *Nghiệm thuần nhất tổng quát có nhân tử tuyến tính $n$:*

$$
u_n^{(h)} = (C_1 + C_2 n) r_0^n
$$

3. **Nghiệm riêng khi vế phải là hằng số $d_n \equiv d$**: *Chọn dạng thử $u_n^{(p)} = \alpha$ nếu $P(1) = a + b + c \neq 0$; nhân thêm $n$ thành $u_n^{(p)} = \alpha n$ nếu $r = 1$ là nghiệm đơn của $P(r)$; và nhân $n^2$ thành $u_n^{(p)} = \alpha n^2$ nếu $r = 1$ là nghiệm kép!*

**Chứng minh Cho Trường hợp Nghiệm kép.** Vì $u_0, u_1$ xác định duy nhất toàn bộ dãy $(u_n)_{n \ge 0}$, không gian nghiệm thuần nhất có số chiều bằng đúng $2$. Khi $r_0 = -\frac{b}{2a}$ là nghiệm kép, ta có đồng thời $a r_0^2 + b r_0 + c = 0$ và đạo hàm $P'(r_0) = 2a r_0 + b = 0$. Thế dãy thứ hai $v_n = n r_0^n$ vào vế trái:

$$
a(n + 2)r_0^{n+2} + b(n + 1)r_0^{n+1} + c n r_0^n = n r_0^n \underbrace{\big(a r_0^2 + b r_0 + c\big)}_{=\,0} + r_0^{n+1} \underbrace{\big(2a r_0 + b\big)}_{=\,0} = 0
$$

Do $r_0 \neq 0$, hai dãy $(r_0^n)$ và $(n r_0^n)$ độc lập tuyến tính nên tổ hợp $(C_1 + C_2 n)r_0^n$ quét trọn không gian nghiệm 2 chiều! $\blacksquare$

**Phương pháp Hàm Sinh (Generating Functions):** Một hướng tiếp cận đại số song song là đóng gói toàn bộ dãy $(u_n)_{n \ge 0}$ vào chuỗi hình thức $G(z) = \sum_{n=0}^\infty u_n z^n$. Ví dụ với dãy $u_n = 3u_{n-1} - 2u_{n-2}$ ($u_0 = 1, u_1 = 2$), nhân $z^n$ và lấy tổng từ $n = 2$ cho:

$$
G(z) - 1 - 2z = 3z\big(G(z) - 1\big) - 2z^2 G(z) \implies G(z) = \frac{1 - z}{1 - 3z + 2z^2} = \frac{1 - z}{(1 - z)(1 - 2z)} = \frac{1}{1 - 2z} = \sum_{n=0}^\infty 2^n z^n
$$

đọc thẳng hệ số $u_n = 2^n$! Trong xác suất rời rạc, khi $u_n = \mathbb{P}(X = n)$ với biến nguyên không âm $X \in \mathbb{Z}_{\ge 0}$, chuỗi $P_X(z) \triangleq \mathbb{E}[z^X] = \sum_{n=0}^\infty \mathbb{P}(X = n) z^n$ được gọi là **hàm sinh xác suất** (Probability Generating Function — `PGF`), thỏa mãn $P_X(1) = 1$, $P_X'(1) = \mathbb{E}[X]$ và $P_X''(1) = \mathbb{E}[X(X - 1)]$.

| Dạng Phương trình Sai phân / Tổng | Điều kiện Tham số | Nghiệm Đóng / Tiệm cận Chuẩn Mực | Ngữ cảnh Ứng dụng Định lượng |
| :--- | :--- | :---: | :--- |
| $a u_{n+2} + b u_{n+1} + c u_n = 0$ | $r_1 \neq r_2$ ($a r^2 + b r + c = 0$) | $C_1 r_1^n + C_2 r_2^n$ | Xác suất chạm biên bất đối xứng; hàm tự tương quan `AR(2)`. |
| $a u_{n+2} + b u_{n+1} + c u_n = 0$ | $r_1 = r_2 = r_0$ ($\Delta = 0$) | $(C_1 + C_2 n) r_0^n$ | Xác suất chạm biên khi bước đi ngẫu nhiên không xu hướng ($p = 1/2$). |
| $\sum_{k=1}^n \frac{1}{k}$ | $n \to \infty$ | $\ln n + \gamma + \mathcal{O}(1/n)$ | Thời gian thu thập đủ $n$ trạng thái thanh khoản (*Coupon Collector*). |
| $\binom{2n}{n} 2^{-2n}$ | $n \to \infty$ (qua Stirling) | $\frac{1}{\sqrt{\pi n}}\big[1 + \mathcal{O}(1/n)\big]$ | Xác suất hòa vốn và mật độ thời gian chạm biên rời rạc. |

---

## 5. Ví dụ Phỏng vấn Kinh điển: Phá sản Con bạc & Nghịch lý Thời gian Chờ Mẫu Đồng Xu

**Ví dụ 1 (Jane Street / Citadel — Gambler's Ruin & Thời gian Chạm Biên):**
Một thuật toán khởi đầu với vốn nguyên $k \in \{0, 1, \dots, M\}$ đơn vị. Ở mỗi lệnh độc lập, vốn tăng $+1$ với xác suất $p \in (0, 1)$ hoặc giảm $-1$ với xác suất $q = 1 - p$. Thuật toán dừng ngay khi chạm mục tiêu chốt lời $M$ hoặc cháy vốn $0$.
1. Tìm xác suất chạm $M$ trước $0$, ký hiệu $u_k$, trong cả hai trường hợp $p \neq 1/2$ và $p = 1/2$!
2. Khi trò chơi công bằng $p = q = 1/2$, tìm số lệnh giao dịch kỳ vọng $t_k$ cho tới khi kết thúc!

**Lời giải Ví dụ 1 Bằng Định lý 0.11:**
1. **Giải xác suất thắng $u_k$ (với điều kiện biên $u_0 = 0, \, u_M = 1$):**
   Phân tích bước đầu tiên từ $k \in \{1, \dots, M - 1\}$ cho $u_k = p u_{k+1} + q u_{k-1} \iff p u_{k+1} - u_k + q u_{k-1} = 0$. Đa thức đặc trưng (nhớ $p + q = 1$):

$$
p r^2 - (p + q) r + q = 0 \iff (r - 1)(p r - q) = 0 \implies r_1 = 1, \quad r_2 = \frac{q}{p}
$$

   - *Nếu $p \neq q$ ($r_1 \neq r_2$)*: $u_k = C_1 (1)^k + C_2 (q/p)^k$. Biên $u_0 = 0 \implies C_1 + C_2 = 0 \implies C_2 = -C_1$; biên $u_M = 1 \implies C_1\big(1 - (q/p)^M\big) = 1$. Vậy:

$$
u_k = \frac{1 - (q/p)^k}{1 - (q/p)^M} \qquad (p \neq 1/2)
$$

   - *Nếu $p = q = 1/2$ ($r_1 = r_2 = 1$ là nghiệm kép!)*: Theo Ý 2 Định lý 0.11, $u_k = C_1 + C_2 k$. Thay $u_0 = 0 \implies C_1 = 0$ và $u_M = 1 \implies C_2 = \frac{1}{M}$, thu được $u_k = \frac{k}{M}$!
2. **Giải thời gian giao dịch kỳ vọng $t_k$ khi $p = q = 1/2$ ($t_0 = t_M = 0$):**
   Mỗi bước tốn đúng $1$ lệnh rồi chuyển sang $k + 1$ hoặc $k - 1$: $t_k = 1 + \frac{1}{2} t_{k+1} + \frac{1}{2} t_{k-1} \iff \frac{1}{2} t_{k+1} - t_k + \frac{1}{2} t_{k-1} = -1$. Vì $r = 1$ là **nghiệm kép** của đa thức đặc trưng $\frac{1}{2}(r - 1)^2 = 0$, theo Ý 3 Định lý 0.11 ta thử nghiệm riêng bậc hai $t_k^{(p)} = \alpha k^2$:

$$
\frac{1}{2}\alpha(k + 1)^2 - \alpha k^2 + \frac{1}{2}\alpha(k - 1)^2 = \alpha = -1 \implies t_k^{(p)} = -k^2
$$

   Cộng nghiệm thuần nhất $C_1 + C_2 k$ được $t_k = C_1 + C_2 k - k^2$. Áp biên $t_0 = 0 \implies C_1 = 0$ và $t_M = 0 \implies C_2 M - M^2 = 0 \implies C_2 = M$. Vậy $t_k = \mathbf{k(M - k)}$ (ví dụ từ $k = 50$ với biên $M = 100$ cần trung bình tới $50 \times 50 = 2{,}500$ bước mới chạm biên!).

**Ví dụ 2 [Optiver / SIG] — Tại Sao Chờ Chuỗi `HH` Lâu Hơn Chờ Chuỗi `HT`?:**
Tung liên tiếp một đồng xu công bằng ($p = 1/2$). Dùng hệ phương trình sai phân trạng thái để tính số lần tung kỳ vọng cho đến khi xuất hiện hai mặt Ngửa liên tiếp `HH` so với cho đến khi xuất hiện mặt Ngửa rồi mặt Sấp liên tiếp `HT`!
- **Lời giải Bằng Máy Trạng thái Hữu hạn**:
  - **Tìm thời gian chờ `HH`**: Gọi $E_{\varnothing}$ là số lần tung kỳ vọng từ vạch xuất phát (hoặc vừa ra `T`), và $E_{\text{H}}$ là số lần tung còn lại kỳ vọng khi vừa mới có $1$ mặt `H`. Ta có hệ $2$ phương trình tuyến tính:

$$
E_{\varnothing} = 1 + \frac{1}{2} E_{\text{H}} + \frac{1}{2} E_{\varnothing} \implies E_{\varnothing} = 2 + E_{\text{H}}, \qquad E_{\text{H}} = 1 + \frac{1}{2}(0) + \frac{1}{2} E_{\varnothing}
$$

  Thế $E_{\text{H}} = 1 + \frac{1}{2} E_{\varnothing}$ vào phương trình đầu: $E_{\varnothing} = 2 + 1 + \frac{1}{2} E_{\varnothing} \implies \frac{1}{2} E_{\varnothing} = 3 \implies E_{\varnothing}(\text{HH}) = \mathbf{6\text{ lần}}$!
  - **Tìm thời gian chờ `HT`**: Vẫn có $\tilde{E}_{\varnothing} = 2 + \tilde{E}_{\text{H}}$ (chờ trung bình $2$ lần để thấy chữ `H` đầu tiên). Nhưng một khi đã đứng ở trạng thái `H`, hai mặt tiếp theo đồng khả năng $1/2$: nếu tung ra `T` thì xong ngay ($0$ bước nữa), còn nếu tung ra `H` thì **bạn vẫn đang giữ sẵn chữ `H` ở đuôi** (không bị rơi ngược về vạch xuất phát như trường hợp `HH` bị `T` phá hỏng!):

$$
\tilde{E}_{\text{H}} = 1 + \frac{1}{2}(0) + \frac{1}{2}\tilde{E}_{\text{H}} \implies \tilde{E}_{\text{H}} = 2 \implies \tilde{E}_{\varnothing}(\text{HT}) = 2 + 2 = \mathbf{4\text{ lần}}!
$$

  Chỉ một khác biệt tự chồng lấp của mẫu ký hiệu đã làm thời gian chờ kỳ vọng lệch nhau tới $50\%$!

**Ví dụ 3 (DE Shaw / Two Sigma — Định giá Trái phiếu Vĩnh cửu Tăng trưởng Tuyến tính):**
Một hợp đồng bản quyền thanh toán dòng tiền cuối mỗi năm thứ $k$ ($k = 1, 2, \dots$) bằng $C_k = k \times \$10$ triệu USD kéo dài vĩnh viễn. Với lãi suất chiết khấu năm cố định $y = 25\%$ (hệ số chiết khấu một năm $r = \frac{1}{1 + 0.25} = 0.80$), tính giá trị hiện tại ròng chính xác của toàn bộ dòng tiền!
- **Lời giải**: Áp dụng trực tiếp công thức đạo hàm chuỗi cấp số nhân ở Mục 2.1 với $r = 0.80 \in (-1, 1)$:

$$
\text{PV} = \sum_{k=1}^\infty (10 k) \, r^k = 10 \cdot \frac{r}{(1 - r)^2} = 10 \cdot \frac{0.80}{(0.20)^2} = 10 \times \frac{0.80}{0.04} = \mathbf{\$200\text{ triệu USD}}
$$

(Tổng quát với lãi suất chiết khấu $y > 0$, thay $r = \frac{1}{1 + y}$ cho công thức nhẩm tức thì $\sum_{k=1}^\infty \frac{k}{(1 + y)^k} = \frac{1 + y}{y^2}$!).

---

## 6. Các Bẫy Sai lầm Về Chuỗi Vô hạn và Phương trình Sai phân

> [!WARNING]
> **Ba Bẫy Đại số Khiến Ứng viên Giải Sai Hệ thức Đệ quy Trong Phỏng vấn:**
> 1. **Quên Nhân Bậc Đa thức $n$ Hoặc $n^2$ Khi Nghiệm Đặc trưng Trùng $r = 1$:** Trong phần 2 bài toán trên, nếu bạn ngây thơ đặt nghiệm riêng hằng số $t_k^{(p)} = \alpha$, vế trái cho $\frac{1}{2}\alpha - \alpha + \frac{1}{2}\alpha = 0 = -1$ (vô lý!). Bất cứ khi nào có hằng số cộng thêm $+1$ ở mỗi bước của chuỗi Markov (nơi tổng xác suất chuyển hàng bằng $1$ nên $r = 1$ **luôn luôn** là nghiệm đặc trưng!), nghiệm riêng tối thiểu phải từ bậc nhất $\alpha k$ trở lên!
> 2. **Nhầm Điều kiện Ổn định Tiệm cận Giữa Rời rạc và Liên tục:** Nghiệm phương trình vi phân $\dot{x} = \lambda x$ tắt dần khi $\operatorname{Re}(\lambda) < 0$ (nửa mặt phẳng phức trái), nhưng nghiệm phương trình sai phân $x_{n+1} = r x_n$ tắt dần khi $|r| < 1$ (**bên trong đĩa tròn đơn vị**!).
> 3. **Tự ý Đổi Thứ tự Tổng Của Chuỗi Hội tụ Có Điều kiện:** Chuỗi đan dấu $1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \dots = \ln 2$ hội tụ, nhưng tổng trị tuyệt đối phân kỳ ($\sum \frac{1}{k} = \infty$). Theo Định lý Hoán vị Riemann, đổi thứ tự cộng các số hạng có thể biến tổng thành bất kỳ con số thực nào! Chỉ được hoán đổi thứ tự tổng hai lớp (Định lý Fubini-Tonelli) khi các số hạng không âm hoặc hội tụ tuyệt đối.
