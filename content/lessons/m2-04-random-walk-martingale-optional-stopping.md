# M2.04 — Bước đi Ngẫu nhiên, Quá trình Martingale, Định lý Dừng Tùy ý & Phá sản Con bạc

## 1. Trực giác & Động lực: Định luật Bảo toàn Kỳ vọng trong Thế giới Ngẫu nhiên

Trong vật lý cổ điển, thay vì giải hệ phương trình vi phân lực phức tạp theo từng mili-giây chuyển động của con lắc, nhà vật lý sử dụng **định luật bảo toàn năng lượng** nối thẳng trạng thái đầu với trạng thái cuối để tìm vận tốc tại đáy chỉ trong hai dòng đại số. Trong xác suất và toán tài chính định lượng, **Quá trình Martingale** cùng **Định lý Dừng Tùy ý của Doob** (Optional Stopping Theorem — `OST`) đóng chính xác vai trò định luật bảo toàn năng lượng đó!

Bất cứ khi nào vòng phỏng vấn cuối tại Jane Street, Citadel, Two Sigma hay D. E. Shaw đưa ra một bài toán hỏi: *"Một giá cổ phiếu nhảy ngẫu nhiên lên xuống cho đến khi chạm rào cản chốt lời $+A$ hoặc cắt lỗ $-B$, hãy tìm xác suất thắng và kỳ vọng số bước dừng"*, nếu bạn lập hệ hàng trăm phương trình Markov rồi cố giải quy nạp sai phân, bạn sẽ hết sạch thời gian. Ngược lại, nếu nhận diện được các bất biến Martingale ẩn bên trong bước đi ngẫu nhiên, bạn có thể viết thẳng đáp số đóng chỉ trong chưa đầy hai phút.

---

## 2. Luồng Lọc Thông tin, Quá trình Martingale & Tích phân Đặt cược Nhân quả

### 2.1. Luồng Lọc $(\mathcal{F}_n)_{n \ge 0}$ và Sự Khác biệt Giữa Thích nghi với Dự báo Được

Trên không gian xác suất $(\Omega, \mathcal{F}, \mathbb{P})$, một **luồng lọc thông tin** (Filtration) thời gian rời rạc là dãy các $\sigma$-đại số con lồng nhau tăng dần:

$$
\mathcal{F}_0 \subseteq \mathcal{F}_1 \subseteq \mathcal{F}_2 \subseteq \dots \subseteq \mathcal{F}
$$

trong đó $\mathcal{F}_n$ đại diện cho toàn bộ lịch sử dữ liệu thị trường đã quan sát được tính đến hết thời điểm $n$. Có hai khái niệm tính nhân quả thời gian sống còn mà mọi nhà nghiên cứu định lượng bắt buộc phải phân biệt rạch ròi:
1. **Quá trình Thích nghi** (Adapted Process): Dãy $(M_n)_{n \ge 0}$ gọi là thích nghi với $(\mathcal{F}_n)$ nếu $M_n$ là $\mathcal{F}_n$-đo được với mọi $n \ge 0$ (giá đóng cửa $P_n$ biết được ngay tại cuối phiên $n$).
2. **Quá trình Dự báo Được** (Predictable Process): Dãy $(H_n)_{n \ge 1}$ gọi là dự báo được nếu $H_n$ đã là **$\mathcal{F}_{n-1}$-đo được** với mọi $n \ge 1$! Khối lượng cổ phiếu $H_n$ mà thuật toán của bạn nắm giữ để hưởng chênh lệch giá $(P_n - P_{n-1})$ bắt buộc phải được chốt xong từ thời điểm $n-1$; nếu $H_n$ phụ thuộc vào $\mathcal{F}_n$, bạn đã phạm lỗi nhìn trước tương lai!

**Định nghĩa 2.1 (Martingale, Dưới Martingale & Trên Martingale).** *Một quá trình thích nghi $(M_n)_{n \ge 0}$ thỏa mãn điều kiện khả tích $\mathbb{E}[|M_n|] < \infty$ ($\forall n \ge 0$) được gọi là:*
- **Martingale** (Trò chơi công bằng) nếu $\mathbb{E}[M_{n+1} \mid \mathcal{F}_n] = M_n$ hầu chắc chắn với mọi $n \ge 0$.
- **Dưới Martingale** (Submartingale — Xu hướng tăng có lợi cho người nắm giữ) nếu $\mathbb{E}[M_{n+1} \mid \mathcal{F}_n] \ge M_n$.
- **Trên Martingale** (Supermartingale — Xu hướng hao mòn bất lợi, ví dụ đánh bài chịu phí sòng bạc) nếu $\mathbb{E}[M_{n+1} \mid \mathcal{F}_n] \le M_n$.

Bằng quy nạp và Tính chất Tháp của Bài `M2.02`, với mọi Martingale và mọi $m < n$, ta luôn có $\mathbb{E}[M_n \mid \mathcal{F}_m] = M_m$ và đặc biệt kỳ vọng vô điều kiện bất biến theo thời gian: $\mathbb{E}[M_n] = \mathbb{E}[M_0]$.

**Mệnh đề 2.3 (Biến đổi Martingale — Nguyên lý Không Thể Chiến Thắng Trò chơi Công bằng).** *Cho $(M_n)_{n \ge 0}$ là một Martingale và $(H_n)_{n \ge 1}$ là chiến lược quy mô vị thế dự báo được ($H_n \in \mathcal{F}_{n-1}$) bị chặn trên từng bước ($|H_n| \le C_n < \infty$). Khi đó quá trình lãi lỗ tích lũy $(H \bullet M)_n = \sum_{k=1}^n H_k (M_k - M_{k-1})$ (với $(H \bullet M)_0 = 0$) cũng là một Martingale, suy ra $\mathbb{E}[(H \bullet M)_n] = 0$ với mọi $n \ge 0$!*

**Chứng minh.** Tính khả tích $\mathbb{E}[|(H \bullet M)_n|] \le \sum_{k=1}^n C_k(\mathbb{E}[|M_k|] + \mathbb{E}[|M_{k-1}|]) < \infty$ được đảm bảo nhờ $H_k$ bị chặn. Xét bước chuyển từ $n$ sang $n+1$, vì $(H \bullet M)_n \in \mathcal{F}_n$ và đặc biệt **$H_{n+1} \in \mathcal{F}_n$**, áp dụng quy tắc đưa biến đã biết ra ngoài dấu kỳ vọng có điều kiện:

$$
\mathbb{E}\big[(H \bullet M)_{n+1} - (H \bullet M)_n \,\big|\, \mathcal{F}_n\big] = \mathbb{E}\big[H_{n+1}(M_{n+1} - M_n) \,\big|\, \mathcal{F}_n\big] = H_{n+1} \, \mathbb{E}[M_{n+1} - M_n \mid \mathcal{F}_n] = H_{n+1} \cdot 0 = 0
$$

Vậy dù bạn có tăng giảm đòn bẩy tinh vi đến đâu dựa trên đồ thị quá khứ, nếu quá trình giá cơ sở là một Martingale thuần túy thì kỳ vọng lợi nhuận tại mọi thời điểm cố định $n$ vẫn bằng đúng con số $0$! $\blacksquare$

---

## 3. Bộ Ba Martingale Chuẩn của Bước đi Ngẫu nhiên (Random Walk)

Xét **Bước đi Ngẫu nhiên tổng quát** $S_n = S_0 + \sum_{k=1}^n X_k$ ($n \ge 1$), trong đó $S_0$ là hằng số (hoặc $\mathcal{F}_0$-đo được) và các bước nhảy $X_1, X_2, \dots$ độc lập cùng phân phối có kỳ vọng $\mathbb{E}[X_k] = \mu$, phương sai $\operatorname{Var}(X_k) = \sigma^2 < \infty$, và hàm sinh mô-men (Moment Generating Function — `MGF`) $M_X(\theta) = \mathbb{E}[e^{\theta X_1}] < \infty$. Đặt luồng lọc tự nhiên $\mathcal{F}_n = \sigma(S_0, X_1, \dots, X_n)$ (lưu ý $X_{n+1}$ hoàn toàn độc lập với $\mathcal{F}_n$).

**Định lý 2.10 (Ba Vũ khí Martingale Kinh điển trên Bước đi Ngẫu nhiên).** *Cả ba quá trình dưới đây đều là các Martingale chính xác đối với $(\mathcal{F}_n)_{n \ge 0}$:*
1. **Martingale Tuyến tính Khử Trôi**: $M_n^{(1)} = S_n - n\mu$.
2. **Martingale Bậc hai Bù Phương sai**: $M_n^{(2)} = (S_n - S_0 - n\mu)^2 - n\sigma^2$ *(đặc biệt khi $S_0 = 0, \mu = 0$ thì $M_n^{(2)} = S_n^2 - n\sigma^2$)*.
3. **Martingale Hàm mũ Wald**: $M_n^{(3)} = \frac{\exp(\theta S_n)}{\big[M_X(\theta)\big]^n}$ *(với mọi $\theta \in \mathbb{R}$ sao cho $M_X(\theta) < \infty$)*.
   - **Hệ quả Martingale De Moivre cho Bước đi Lệch Đơn vị**: Nếu $X_k = +1$ với xác suất $p \in (0, 1)$ và $X_k = -1$ với xác suất $q = 1 - p$ ($p \neq q$), đặt tỷ số thua/thắng $\rho = \frac{q}{p} \neq 1$, thì quá trình **$M_n = \left(\frac{q}{p}\right)^{S_n}$** là một Martingale!

**Chứng minh Từng Quá trình:**
- *(1)* Vì $S_n \in \mathcal{F}_n$ và $X_{n+1} \perp \mathcal{F}_n$: $\mathbb{E}[S_{n+1} - (n+1)\mu \mid \mathcal{F}_n] = S_n + \mathbb{E}[X_{n+1}] - (n+1)\mu = S_n + \mu - (n+1)\mu = S_n - n\mu = M_n^{(1)}$.
- *(2)* Đặt tổng đã khử trôi $Z_n = S_n - S_0 - n\mu = \sum_{k=1}^n (X_k - \mu)$, khi đó gia số $\tilde{X}_{n+1} = X_{n+1} - \mu$ độc lập với $\mathcal{F}_n$, có $\mathbb{E}[\tilde{X}_{n+1}] = 0$ và $\mathbb{E}[\tilde{X}_{n+1}^2] = \sigma^2$. Khai triển bình phương $Z_{n+1}^2 = (Z_n + \tilde{X}_{n+1})^2$:

$$
\mathbb{E}\big[Z_{n+1}^2 - (n+1)\sigma^2 \,\big|\, \mathcal{F}_n\big] = Z_n^2 + 2 Z_n \mathbb{E}[\tilde{X}_{n+1}] + \mathbb{E}[\tilde{X}_{n+1}^2] - (n+1)\sigma^2 = Z_n^2 + 0 + \sigma^2 - (n+1)\sigma^2 = M_n^{(2)}
$$

- *(3)* Tách $e^{\theta S_{n+1}} = e^{\theta S_n} \cdot e^{\theta X_{n+1}}$, đưa $e^{\theta S_n} \in \mathcal{F}_n$ ra ngoài và dùng $X_{n+1} \perp \mathcal{F}_n$:

$$
\mathbb{E}\left[ \frac{e^{\theta S_{n+1}}}{M_X(\theta)^{n+1}} \,\middle|\, \mathcal{F}_n \right] = \frac{e^{\theta S_n}}{M_X(\theta)^{n+1}} \, \mathbb{E}\big[e^{\theta X_{n+1}}\big] = \frac{e^{\theta S_n}}{M_X(\theta)^{n+1}} \cdot M_X(\theta) = M_n^{(3)}
$$

  Để suy ra Martingale De Moivre cho bước nhảy $\pm 1$, chọn $\theta^\star = \ln(q/p)$ sao cho $e^{\theta^\star} = q/p$ và $e^{-\theta^\star} = p/q$. Khi đó mẫu số hàm sinh mô-men triệt tiêu kỳ diệu về đúng bằng **$1$**: $M_X(\theta^\star) = p e^{\theta^\star} + q e^{-\theta^\star} = p\left(\frac{q}{p}\right) + q\left(\frac{p}{q}\right) = q + p = 1$, biến $M_n^{(3)}$ thành $\left(\frac{q}{p}\right)^{S_n}$! $\blacksquare$

---

## 4. Thời gian Dừng, Định lý Dừng Tùy ý & Đẳng thức Wald

Một biến ngẫu nhiên nhận giá trị nguyên không âm mở rộng $\tau: \Omega \to \{0, 1, 2, \dots\} \cup \{\infty\}$ được gọi là một **Thời gian Dừng** (Stopping Time) đối với $(\mathcal{F}_n)$ nếu với mọi $n \ge 0$, biến cố $\{\tau \le n\} \in \mathcal{F}_n$ (tương đương $\{\tau = n\} = \{\tau \le n\} \setminus \{\tau \le n-1\} \in \mathcal{F}_n$). Nói bằng ngôn ngữ lập trình hệ thống giao dịch: tại thời điểm $n$, quyết định `"Dừng đóng vị thế ngay bây giờ hay tiếp tục?"` chỉ được phép đọc các biến trạng thái từ $0$ đến $n$.
- *Ví dụ Hợp lệ*: Thời điểm đầu tiên danh mục chạm chốt lời $+A$ hoặc cắt lỗ $-B$: $\tau = \inf\{n \ge 0 : S_n \notin (-B, A)\}$.
- *Ví dụ Không Hợp lệ*: Thời điểm đạt đỉnh giá cao nhất trong phiên $\tau_{\text{max}} = \arg\max_{0 \le k \le T} S_k$ (vì tại bước $n < T$, bạn không thể biết tương lai giá có vượt đỉnh mới nữa hay không!).

Xét quá trình bị đóng băng sau khi dừng $M_{n \wedge \tau}$ (với $n \wedge \tau = \min(n, \tau)$). Ta có biểu diễn tích phân đặt cược $M_{n \wedge \tau} = M_0 + \sum_{k=1}^n \mathbb{I}_{\{\tau \ge k\}}(M_k - M_{k-1})$. Vì $\{\tau \ge k\} = \{\tau \le k - 1\}^c \in \mathcal{F}_{k-1}$, chỉ báo $H_k = \mathbb{I}_{\{\tau \ge k\}}$ bị chặn bởi $1$ và dự báo được! Theo Mệnh đề 2.3, **với mọi thời điểm cố định $n$, đẳng thức $\mathbb{E}[M_{n \wedge \tau}] = \mathbb{E}[M_0]$ luôn luôn đúng vô điều kiện**!

Tuy nhiên, để chuyển dấu giới hạn qua dấu kỳ vọng $\lim_{n \to \infty} \mathbb{E}[M_{n \wedge \tau}] = \mathbb{E}\big[\lim_{n \to \infty} M_{n \wedge \tau}\big] = \mathbb{E}[M_\tau]$, ta bắt buộc phải kiểm tra ít nhất một trong ba bộ điều kiện biên chuẩn mực sau đây:

**Định lý 2.11 — Định lý Dừng Tùy ý của Doob:** *Cho Martingale $(M_n)_{n \ge 0}$ và thời gian dừng $\tau$. Đẳng thức bảo toàn kỳ vọng $\mathbb{E}[M_\tau] = \mathbb{E}[M_0]$ nghiệm đúng nếu thỏa mãn **một trong ba** điều kiện đủ sau:*
1. **Thời gian dừng bị chặn hữu hạn**: Tồn tại hằng số tất định $K < \infty$ sao cho $\tau \le K$ hầu chắc chắn (khi đó chọn $n = K$ có ngay $M_{K \wedge \tau} = M_\tau$).
2. **Quá trình trước khi dừng bị chặn đều**: $\mathbb{P}(\tau < \infty) = 1$ và tồn tại hằng số $C < \infty$ sao cho $|M_{n \wedge \tau}| \le C$ hầu chắc chắn với mọi $n \ge 0$ *(suy ra trực tiếp từ Định lý Hội tụ Bị chặn Lebesgue)*.
3. **Kỳ vọng thời gian dừng hữu hạn và bước nhảy bị chặn**: $\mathbb{E}[\tau] < \infty$ và tồn tại hằng số $C < \infty$ sao cho $\mathbb{E}\big[|M_{n+1} - M_n| \mid \mathcal{F}_n\big] \le C$ hầu chắc chắn trên biến cố $\{n < \tau\}$ *(vì khi đó $|M_{n \wedge \tau} - M_0| \le \sum_{k=1}^\tau |M_k - M_{k-1}|$ có kỳ vọng bị chặn bởi $C \, \mathbb{E}[\tau] < \infty$)*.

Áp dụng Định lý 2.11 vào $M_n^{(1)}$ và $M_n^{(2)}$ của bước đi ngẫu nhiên có $\mathbb{E}[\tau] < \infty$ cho ta **Đẳng thức Wald thứ nhất và thứ hai**:

$$
\mathbb{E}[S_\tau] = \mathbb{E}[S_0] + \mu \, \mathbb{E}[\tau], \qquad \text{và khi } \mu = 0: \quad \mathbb{E}\big[(S_\tau - S_0)^2\big] = \sigma^2 \, \mathbb{E}[\tau]
$$

### 4.1. Bất đẳng thức Cực đại Doob & Xác suất Sụt giảm Vốn Tối đa

Trong quản trị rủi ro quỹ đầu cơ (như giới hạn cắt vốn mà bạn đã học ở `M1.01`), nhà quản lý không chỉ quan tâm tới vốn cuối năm $S_N$, mà quan tâm tới **đỉnh hoặc đáy cực trị dọc toàn bộ quỹ đạo** $\max_{0 \le k \le N} M_k$. Cho quá trình Dưới Martingale không âm $(M_k)_{k \ge 0}$ ($M_k \ge 0$, $\mathbb{E}[M_{k+1} \mid \mathcal{F}_k] \ge M_k$) và ngưỡng $c > 0$. Đặt thời gian dừng chạm ngưỡng $\tau_c = \inf\{k \le N : M_k \ge c\}$ (quy ước $\tau_c = N$ nếu không chạm). Gọi $E = \left\{\max_{0 \le k \le N} M_k \ge c\right\} \in \mathcal{F}_{\tau_c}$, khi đó trên biến cố $E$ ta có $M_{\tau_c} \ge c$, đồng thời theo tính chất Dưới Martingale $\mathbb{E}[M_N \mathbb{I}_E] \ge \mathbb{E}[M_{\tau_c} \mathbb{I}_E] \ge c \, \mathbb{P}(E)$, suy ra **Bất đẳng thức Cực đại Doob**:

$$
\mathbb{P}\left( \max_{0 \le k \le N} M_k \ge c \right) \le \frac{\mathbb{E}[M_N \, \mathbb{I}_E]}{c} \le \frac{\mathbb{E}[M_N]}{c}
$$

Áp dụng trực tiếp cho chiến lược giao dịch có lợi thế dương $p > q \implies \rho = q/p < 1$: quá trình De Moivre $M_k = \rho^{S_k} > 0$ là một Martingale không âm có $\mathbb{E}[M_k] = M_0 = 1$. Biến cố danh mục bị sụt giảm vốn chạm mức cắt lỗ $-B$ tại bất kỳ thời điểm nào trong $N$ bước trùng khít với $\left\{\max_{0 \le k \le N} \rho^{S_k} \ge \rho^{-B}\right\}$ (do $\rho \in (0, 1)$ nên hàm $\rho^x$ nghịch biến nghiêm ngặt). Áp dụng bất đẳng thức Doob với ngưỡng $c = \rho^{-B}$ và cho $N \to \infty$, ta thu được cận trên hàm mũ cho **rủi ro sụt giảm vốn tối đa toàn thời gian**:

$$
\mathbb{P}\left( \inf_{k \ge 0} S_k \le -B \right) \le \frac{1}{\rho^{-B}} = \left(\frac{q}{p}\right)^B
$$

---

## 5. Giải Trọn vẹn Bài toán Phá sản Con bạc (Gambler's Ruin)

**Thiết lập Bài toán Chuẩn Phỏng vấn:** Xuất phát tại vốn ròng $S_0 = 0$, tại mỗi bước bạn lãi $+1$ đơn vị với xác suất $p \in (0, 1)$ và lỗ $-1$ đơn vị với xác suất $q = 1 - p$. Chiến lược giao dịch tự động dừng tại thời điểm đầu tiên chạm ngưỡng chốt lời nguyên dương $+A$ hoặc ngưỡng cắt lỗ nguyên âm $-B$ ($A, B \ge 1$): $\tau = \inf\{n \ge 0 : S_n = A \text{ hoặc } S_n = -B\}$. *(Nếu đề bài phát biểu xuất phát với vốn $x \in \{0, \dots, N\}$ dừng tại $0$ hoặc $N$, chỉ cần đặt $B = x$ và $A = N - x$ với $A + B = N$!).*

Trước hết, ta kiểm chứng nhanh $\mathbb{E}[\tau] < \infty$ (và do đó $\mathbb{P}(\tau < \infty) = 1$): chia trục thời gian thành các khối rời nhau độ dài $L = A + B$ bước; từ bất kỳ điểm nào bên trong $(-B, A)$, nếu xuất hiện $L$ bước $+1$ liên tiếp (xác suất tối thiểu $\varepsilon = p^L > 0$), quỹ đạo chắc chắn vượt ngưỡng $+A$ và dừng lại. Do đó $\mathbb{P}(\tau > m L) \le (1 - \varepsilon)^m$ giảm hàm mũ về $0$, đảm bảo mọi mô-men của $\tau$ đều hữu hạn!

### 5.1. Trường hợp Đối xứng Công bằng ($p = q = \frac{1}{2} \implies \mu = 0, \sigma^2 = 1$)

- **Tìm Xác suất Thắng $p_{\text{win}} = \mathbb{P}(S_\tau = A)$**: Quá trình $S_{n \wedge \tau}$ bị kẹp chặt trong đoạn hữu hạn $[-B, A]$, tức $|S_{n \wedge \tau}| \le \max(A, B) < \infty$ thỏa mãn Điều kiện (2) của `OST`! Do đó:

$$
0 = S_0 = \mathbb{E}[S_\tau] = p_{\text{win}} \cdot A + (1 - p_{\text{win}})(-B) \implies p_{\text{win}} = \frac{B}{A + B}, \qquad p_{\text{ruin}} = \frac{A}{A + B}
$$

- **Tìm Kỳ vọng Số Bước Giao dịch $\mathbb{E}[\tau]$**: Xét Martingale bậc hai $M_n^{(2)} = S_n^2 - n$. Tại mốc cắt cụt hữu hạn $n \wedge \tau \le n$, Điều kiện (1) cho phép viết $\mathbb{E}[S_{n \wedge \tau}^2 - (n \wedge \tau)] = S_0^2 - 0 = 0 \iff \mathbb{E}[n \wedge \tau] = \mathbb{E}[S_{n \wedge \tau}^2]$. Khi cho $n \to \infty$: vế trái $n \wedge \tau \uparrow \tau$ hội tụ theo Định lý Hội tụ Đơn điệu về $\mathbb{E}[\tau]$; vế phải $S_{n \wedge \tau}^2 \le \max(A^2, B^2)$ hội tụ bị chặn về $\mathbb{E}[S_\tau^2]$. Thay phân phối hai điểm của $S_\tau$:

$$
\mathbb{E}[\tau] = \mathbb{E}[S_\tau^2] = \frac{B}{A + B} A^2 + \frac{A}{A + B} B^2 = \frac{AB(A + B)}{A + B} = A \cdot B
$$

*(Ví dụ: bắt đầu tại $\$50$ muốn thắng lên $\$100$ trước khi cháy về $\$0$ bằng các lệnh cược $\$1$ công bằng có $B = 50, A = 50 \implies p_{\text{win}} = 50\%$ và tốn trung bình $50 \times 50 = 2{,}500$ bước!).*

### 5.2. Trường hợp Bước đi Lệch ($p \neq q$, đặt $\rho = \frac{q}{p} \neq 1$)

- **Tìm Xác suất Thắng $p_{\text{win}}$**: Không thể dùng $S_n$ trực tiếp vì $S_n$ có hệ số trôi $\mu = p - q \neq 0$, nhưng ta đã có **Martingale De Moivre** $M_n = \rho^{S_n}$! Vì $-B \le S_{n \wedge \tau} \le A$, quá trình $M_{n \wedge \tau} = \rho^{S_{n \wedge \tau}}$ bị chặn đều bởi $\max(\rho^{-B}, \rho^A) < \infty$, thỏa mãn hoàn hảo Điều kiện (2) của `OST`:

$$
1 = \rho^0 = \mathbb{E}\big[\rho^{S_\tau}\big] = p_{\text{win}} \, \rho^A + (1 - p_{\text{win}})\rho^{-B} \implies p_{\text{win}} = \frac{1 - \rho^{-B}}{\rho^A - \rho^{-B}} = \frac{\rho^B - 1}{\rho^{A + B} - 1} = \frac{1 - (q/p)^B}{1 - (q/p)^{A + B}}
$$

- **Tìm Kỳ vọng Số Bước $\mathbb{E}[\tau]$**: Dùng Martingale tuyến tính khử trôi $M_n^{(1)} = S_n - n(p - q)$ (thỏa mãn Điều kiện (3) vì $\mathbb{E}[\tau] < \infty$ và bước nhảy bị chặn bởi $1 + |p - q| \le 2$):

$$
0 = \mathbb{E}\big[S_\tau - (p - q)\tau\big] \implies \mathbb{E}[\tau] = \frac{\mathbb{E}[S_\tau]}{p - q} = \frac{A \, p_{\text{win}} - B(1 - p_{\text{win}})}{p - q}
$$

Ý nghĩa sống còn đối với giao dịch định lượng: Nếu chiến lược của bạn có lợi thế nhỏ dương $p = 0.51, q = 0.49 \implies \rho = \frac{49}{51} < 1$, khi bạn mở rộng vốn dự phòng chịu lỗ $B$ đủ lớn (ví dụ $B = 100$ đơn vị bước lệnh), xác suất cháy tài khoản trước khi chạm bất kỳ mục tiêu lớn $A$ nào cũng giảm hàm mũ $\rho^B = (49/51)^{100} \approx 1.8\%$! Ngược lại, nếu chiến lược có kỳ vọng âm sau phí ($p = 0.49, q = 0.51 \implies \rho > 1$), việc cố tình đặt chốt lời gần $A = 5$ và nới rộng cắt lỗ xa $B = 100$ sẽ lừa cảm giác thắng nhiều ngày nhỏ lẻ nhưng vẫn dẫn tới lỗ ròng kỳ vọng âm chặt!

---

## 6. Sòng bạc Martingale của Conway & Thực hành Trình Mô phỏng `sim-martingale`

**Bài toán Thực chiến (Giải Mẫu Chuỗi Ký tự Trong 5 Giây Bằng Martingale Conway — Green Book Ch. 4.4):** Chứng minh lại kết quả thời gian chờ $\mathbb{E}[\tau_{\text{HTH}}] = 10$ và tìm ngay lập tức $\mathbb{E}[\tau_{\text{HTHHTH}}]$ khi tung đồng xu công bằng mà không giải bất kỳ hệ phương trình Markov nào!

**Lời giải bằng Đặt cược Công bằng (Abracadabra Martingale):**
Tưởng tượng trước mỗi lần tung thứ $t = 1, 2, 3, \dots$, có đúng một con bạc mới số hiệu $t$ bước vào sòng bạc với **$\$1$ vốn** để cược toàn bộ tiền theo chuỗi ký tự mục tiêu `HTH` (cược tất tay tỷ lệ $1$ ăn $1$ công bằng: thắng nhân đôi tiền, thua mất sạch rời bàn):
- Lần 1 của người đó cược $\$1$ vào `H`: nếu đúng thu về $\$2$, rồi mang toàn bộ $\$2$ cược tiếp vào `T` (đúng thu về $\$4$), rồi mang toàn bộ $\$4$ cược vào `H` (đúng thu về $\$8 = 2^3$).
- Vì mỗi ván cược riêng lẻ đều công bằng và mỗi người chơi tối đa $3$ bước hữu hạn, tổng tài sản ròng của sòng bạc cộng trừ tài sản của các con bạc là một Martingale có bước nhảy bị chặn hữu hạn (tối đa chỉ có $3$ con bạc đang còn ngồi trên bàn tại bất kỳ thời điểm nào!). Do $\mathbb{E}[\tau_{\text{HTH}}] < \infty$, Điều kiện (3) của `OST` áp dụng hoàn hảo: tại thời điểm dừng $\tau$ ngay khi chuỗi `HTH` xuất hiện lần đầu tiên, **Tổng số tiền các con bạc đã đóng vào bàn ($\tau \times \$1 = \tau$) có kỳ vọng bằng chính xác tổng số tiền tất cả các con bạc cầm trên tay lúc kết thúc!**
- Ai đang còn tiền trên tay ngay khoảnh khắc 3 lần tung cuối vừa khớp `H-T-H`?
  1. Con bạc vào bàn từ $\tau - 2$ đã đoán trúng cả 3 ký tự `H-T-H`, đang cầm **$2^3 = \$8$**!
  2. Con bạc vào bàn từ $\tau - 1$ cược chữ đầu là `H` vào lần tung $\tau - 1$ (ra `T`), đã thua cháy túi (\$0).
  3. Con bạc vừa vào bàn ở đúng bước cuối $\tau$ cược chữ đầu là `H` vào lần tung $\tau$ (ra `H`), vừa thắng bước 1 nên đang cầm **$2^1 = \$2$**!
  4. Mọi con bạc vào bàn sớm hơn $\tau - 2$ đều đã thua cháy túi từ trước (vì nếu có ai trúng cả 3 chữ thì trò chơi đã dừng sớm hơn $\tau$ rồi!).
- Cộng tổng số tiền cầm về: $\mathbb{E}[\tau_{\text{HTH}}] = 2^3 + 2^1 = 8 + 2 = \mathbf{10}$!
- Tổng quát hóa thành **Công thức Nhẩm 5 Giây**: Kiểm tra mọi độ dài $k \in \{1, \dots, L\}$ mà $k$ ký tự đầu của mẫu trùng khít với $k$ ký tự cuối của mẫu, rồi cộng $\sum 2^k$!
  - Với `HHT`: chỉ khớp toàn chuỗi $k = 3 \implies \mathbb{E}[\tau_{\text{HHT}}] = 2^3 = \mathbf{8}$.
  - Với `HHH`: khớp tại $k = 1, 2, 3 \implies \mathbb{E}[\tau_{\text{HHH}}] = 2^1 + 2^2 + 2^3 = \mathbf{14}$.
  - Với `HTHHTH` ($L = 6$): tiền tố và hậu tố trùng nhau tại $k = 6$ (`HTHHTH`), $k = 3$ (`HTH`), và $k = 1$ (`H`), suy ra ngay lập tức $\mathbb{E}[\tau_{\text{HTHHTH}}] = 2^6 + 2^3 + 2^1 = 64 + 8 + 2 = \mathbf{74}$ lần tung!

> [!IMPORTANT]
> **Thực hành Trực tiếp trên Trình Mô phỏng Tương tác `sim-martingale` Ngay Bên Dưới:**
> Ngay dưới bài giảng này là phòng thí nghiệm tương tác **Bước đi Ngẫu nhiên, Martingale & Phá sản Con bạc**. Hãy trực tiếp kiểm chứng toán học bằng mô phỏng Monte Carlo hàng ngàn quỹ đạo:
> 1. Thiết lập trò chơi công bằng $p = 0.50$ với hai biên không đối xứng (ví dụ chốt lời $+A = 10$, cắt lỗ $-B = 30$), chạy hàng trăm đường mẫu để xác nhận tần suất chạm đỉnh hội tụ sát nút về $\frac{B}{A + B} = 75\%$ và số bước trung bình hội tụ về $A \cdot B = 300$.
> 2. Dịch chuyển xác suất thắng nhích nhẹ lên $p = 0.53$ rồi xuống $p = 0.47$ để cảm nhận sự uốn cong phi tuyến cực mạnh của hàm mũ $(q/p)^B$ đối với nguy cơ phá sản của một chiến lược giao dịch có đòn bẩy.

---

## 7. Phản Ví dụ Kinh điển Nhất Phố Wall: Vì sao Gấp thếp Cháy Tài khoản?

> [!WARNING]
> **Bẫy Áp dụng Định lý Dừng Tùy ý Mà Không Kiểm tra Điều kiện Biên (Nghịch lý Dừng Một Biên $+1$):**
> Xét bước đi ngẫu nhiên đối xứng $S_0 = 0$ ($p = q = \frac{1}{2}$) với quy tắc: *"Không bao giờ cắt lỗ ($B = \infty$), chỉ dừng ngay khi tài khoản chạm lãi $+1$"*, tức $\tau_1 = \inf\{n \ge 0 : S_n = 1\}$.
> - Lấy giới hạn công thức hai biên khi $B \to \infty$: $\mathbb{P}(\tau_1 < \infty) = \lim_{B \to \infty} \frac{B}{1 + B} = 1$! Nghĩa là với xác suất $100\%$, sớm muộn gì bạn cũng chạm mức $+1$, suy ra $S_{\tau_1} = 1$ hầu chắc chắn và **$\mathbb{E}[S_{\tau_1}] = 1 \neq 0 = \mathbb{E}[S_0]$**!
> - Tại sao bảo toàn kỳ vọng `OST` lại sụp đổ ở đây? Hãy kiểm tra cả 3 điều kiện của Định lý 2.11: (1) $\tau_1$ không bị chặn trên; (2) Không có biên dưới nên $S_{n \wedge \tau_1}$ có thể rơi tự do xuống $-\infty$ (không bị chặn dưới!); và (3) Kỳ vọng thời gian dừng phân kỳ ra vô cực: $\mathbb{E}[\tau_1] = \lim_{B \to \infty} (1 \cdot B) = +\infty$!
> - Trong thực tế tài chính, bất kỳ quỹ đầu cơ nào áp dụng chiến lược gồng lỗ trung bình giá xuống không điểm dừng đều đối mặt với hạn mức ký quỹ hữu hạn $B < \infty$ của nhà môi giới: những khoản lỗ đuôi hiếm hoi độ lớn $-B$ xóa sổ hoàn toàn hàng trăm phiên thắng nhỏ $+1$ trước đó, trả kỳ vọng tổng thể quay về đúng $0$ (và âm sau khi trừ phí giao dịch!).
