# M5.03 — Lịch Thực thi Lệnh Tối ưu Almgren-Chriss, Luật Căn bậc Hai & Tiêu chuẩn Kelly Đa Tài sản

## 1. Trực giác & Động lực: Hai Bức Tường Vật Lý Ngăn Cách Alpha Lý Thuyết Với Lợi Nhuận Thực

Giả sử bộ tối ưu hóa danh mục ở Bài `M5.02` vừa ra chỉ thị bán thanh lý $X_0 = 200{,}000$ cổ phiếu của một tập đoàn công nghiệp đang giao dịch tại giá trung tâm $S_0 = \$100.00$ (tương đương quy mô lệnh $\$20\text{ triệu}$, chiếm $12\%$ thanh khoản bình quân ngày của mã đó). Bàn thực thi lệnh đứng trước **thế tiến thoái lưỡng nan kinh điển của nhà giao dịch tổ chức**:

- **Phương án A — Đập toàn bộ bằng một lệnh thị trường duy nhất ngay tức khắc:** Bạn loại bỏ hoàn toàn rủi ro giá biến động bất lợi trong những giờ tới, nhưng lệnh bán khổng lồ sẽ quét sạch hàng chục bậc giá chào mua trên sổ lệnh giới hạn, chịu chi phí trượt giá tức thời lên tới $80\text{–}150\text{ bps}$, tự tay biếu không hàng trăm ngàn đô-la cho các bàn tạo lập thị trường tần số cao!
- **Phương án B — Chia siêu nhỏ rải đều suốt cả tuần giao dịch:** Chi phí trượt giá tức thời trên mỗi lệnh con gần như bằng không, nhưng trong suốt 5 ngày phơi mình giữ đống tồn kho chưa bán hết đó, một tin tức vĩ mô xấu hay báo cáo ngành tiêu cực có thể kéo giá thị trường trượt tự nhiên xuống $\$94.00$ — gây thiệt hại phương sai khổng lồ!

Bài báo nền tảng năm 2000 của **Robert Almgren và Neil Chriss** giải quyết trọn vẹn sự đánh đổi giữa **Chi phí Tác động Thị trường Kỳ vọng** và **Phương sai Rủi ro Thời gian Thực thi**, khai sinh ra biên hiệu quả thực thi lệnh thuật toán hiện đại. Ở nửa sau bài giảng, chúng ta giải quyết câu hỏi đối xứng ở tầng vĩ mô của toàn bộ danh mục: khi đã có lợi thế thống kê ròng sau phí thực thi, **Tiêu chuẩn Kelly Liên tục Đa Tài sản** quy định mức đòn bẩy tối ưu $f^\star = \Sigma^{-1}(\mu - r\mathbf{1})$ như thế nào, và tại sao mọi quỹ đầu cơ chuyên nghiệp từ Renaissance, Citadel tới Millennium chỉ vận hành ở vùng **Kelly Phân số** ($0.25\times\text{–}0.50\times$) thay vì đặt cược tối đa theo lý thuyết?

---

## 2. Mô hình Thực thi Lệnh Tối ưu Almgren-Chriss (2000)

### 2.1. Thiết lập Tồn kho, Tác động Giá Vĩnh viễn và Tác động Giá Tạm thời

Xét bài toán cần bán thanh lý hoàn toàn khối lượng ban đầu $X_0 > 0$ cổ phiếu trong khoảng thời gian cố định $[0, T]$, chia đều thành $N$ bước thời gian rời rạc độ dài $\tau = \frac{T}{N}$ tại các mốc $t_j = j\tau$ ($j = 0, 1, \dots, N$).
- Gọi $x_j$ là **tồn kho còn nắm giữ** tại thời điểm $t_j$, thỏa mãn điều kiện biên đầu - cuối bắt buộc:

$$
x_0 = X_0, \qquad x_N = 0
$$

- Gọi $n_j \triangleq x_{j-1} - x_j$ là khối lượng cổ phiếu bán ra trong khoảng thời gian thứ $j$ tức $(t_{j-1}, t_j]$, tương ứng với **tốc độ giao dịch trung bình** $v_j \triangleq \frac{n_j}{\tau}$ (suy ra $\sum_{j=1}^N n_j = X_0$).

Almgren và Chriss tách cơ học phản ứng của thị trường thành hai thành phần vật lý hoàn toàn khác nhau:

1. **Tác động Giá Vĩnh viễn** (Permanent Market Impact) $g(v_j) = \gamma v_j$ ($\gamma > 0$): Khi thị trường quan sát luồng lệnh bán ròng tốc độ $v_j$, các nhà tạo lập cập nhật kỳ vọng giá trị cơ bản xuống thấp hơn một lượng $\tau g(v_j) = \gamma n_j$ **không bao giờ phục hồi lại**, cộng chồng lên bước đi ngẫu nhiên số học có biến động $\sigma$:

$$
S_j = S_{j-1} + \sigma \sqrt{\tau}\,\xi_j - \gamma n_j, \qquad \xi_j \stackrel{\text{iid}}{\sim} (0, 1)
$$

2. **Tác động Giá Tạm thời** (Temporary Market Impact) $h(v_j) = \varepsilon \operatorname{sign}(n_j) + \eta v_j$ ($\varepsilon \ge 0, \, \eta > 0$): Khoản phí thanh khoản tức thời chỉ đánh lên riêng lô giao dịch $n_j$ của bạn để vượt qua nửa chênh lệch giá cố định $\varepsilon$ và vét sâu vào hàng đợi sổ lệnh tỷ lệ thuận với tốc độ bán $\frac{\eta}{\tau} n_j$. Sang bước $j+1$, sổ lệnh được các nhà cung cấp thanh khoản lấp đầy trở lại quanh mức cân bằng mới $S_j$, nên giá thực khớp thực tế $\tilde{S}_j$ tại bước $j$ là:

$$
\tilde{S}_j = S_{j-1} - h\!\left(\frac{n_j}{\tau}\right) = S_{j-1} - \varepsilon \operatorname{sign}(n_j) - \frac{\eta}{\tau} n_j
$$

### 2.2. Chứng minh Kỳ vọng và Phương sai của Thiếu hụt Thực thi

Theo André Perold (1988), **Thiếu hụt Thực thi** (Implementation Shortfall) — viết tắt là `IS` — đo tổng chi phí đô-la bị hụt đi khi so sánh giá trị danh mục trên giấy lúc ra quyết định ban đầu ($X_0 S_0$) với tổng tiền mặt thực thu về từ tất cả $N$ lệnh con ($\sum_{j=1}^N n_j \tilde{S}_j$):

$$
\text{IS} \triangleq X_0 S_0 - \sum_{j=1}^N n_j \tilde{S}_j
$$

**Định lý 5.6 (Phân rã Chi phí - Phương sai & Quỹ đạo Hyperbolic Almgren-Chriss).** *Với mọi lịch bán đơn điệu $n_j \ge 0$ thỏa mãn $\sum_{j=1}^N n_j = X_0$, kỳ vọng và phương sai của thiếu hụt thực thi bằng chính xác:*

$$
\mathbb{E}[\text{IS}] = \frac{1}{2}\gamma X_0^2 + \varepsilon X_0 + \frac{\tilde{\eta}}{\tau}\sum_{j=1}^N n_j^2, \qquad \operatorname{Var}(\text{IS}) = \sigma^2 \tau \sum_{j=1}^N x_j^2, \qquad \text{với } \tilde{\eta} \triangleq \eta - \frac{1}{2}\gamma\tau > 0
$$

*Hơn nữa, bài toán cực tiểu hóa hàm mục tiêu điều chỉnh rủi ro $\min_{\{x_j\}} \big\{\mathbb{E}[\text{IS}] + \lambda_A \operatorname{Var}(\text{IS})\big\}$ với hệ số ngại rủi ro thực thi $\lambda_A > 0$ có nghiệm tối ưu đóng duy nhất dạng hàm sinh hyperbolic:*

$$
x_j^\star = X_0 \frac{\sinh\!\big(\kappa (T - t_j)\big)}{\sinh(\kappa T)}, \qquad n_j^\star = 2 X_0 \frac{\sinh\!\big(\frac{1}{2}\kappa\tau\big)}{\sinh(\kappa T)} \cosh\!\Big(\kappa\!\left(T - t_j + \frac{\tau}{2}\right)\Big)
$$

*trong đó tham số độ khẩn cấp $\kappa > 0$ trong giới hạn liên tục $\tau \to 0$ thỏa mãn $\kappa = \sqrt{\frac{\lambda_A \sigma^2}{\eta}}$ (và trong rời rạc chính xác thỏa mãn $\frac{2}{\tau^2}(\cosh(\kappa\tau) - 1) = \frac{\lambda_A \sigma^2}{\tilde{\eta}} \triangleq \tilde{\kappa}^2$).*

**Chứng minh Từng Bước Đầy đủ:**
1. **Bước 1 — Đẳng thức Tổng Từng phần Khử $S_{j-1}$:**
   Sử dụng $n_j = x_{j-1} - x_j$, xét hiệu lồng nhau (telescoping sum) với $x_0 = X_0$ và $x_N = 0$:
   $$\sum_{j=1}^N x_j (S_j - S_{j-1}) = \sum_{j=1}^N x_j S_j - \sum_{j=0}^{N-1} x_{j+1} S_j = -x_0 S_0 + \sum_{j=1}^{N} (x_{j-1} - x_j) S_{j-1} = -X_0 S_0 + \sum_{j=1}^N n_j S_{j-1}$$
   Chuyển vế suy ra $X_0 S_0 - \sum_{j=1}^N n_j S_{j-1} = -\sum_{j=1}^N x_j (S_j - S_{j-1})$. Thay $\tilde{S}_j = S_{j-1} - \varepsilon - \frac{\eta}{\tau}n_j$ và $S_j - S_{j-1} = \sigma\sqrt{\tau}\xi_j - \gamma n_j$ vào định nghĩa `IS`:

$$
\text{IS} = -\sigma\sqrt{\tau}\sum_{j=1}^N x_j \xi_j + \gamma\sum_{j=1}^N x_j n_j + \varepsilon\sum_{j=1}^N n_j + \frac{\eta}{\tau}\sum_{j=1}^N n_j^2
$$

2. **Bước 2 — Hằng đẳng thức Bất biến của Tác động Vĩnh viễn:**
   Biến đổi tổng $\sum_{j=1}^N x_j n_j = \sum_{j=1}^N x_j (x_{j-1} - x_j)$ bằng cách dùng hằng đẳng thức $x_j(x_{j-1} - x_j) = \frac{1}{2}\big(x_{j-1}^2 - x_j^2 - (x_{j-1} - x_j)^2\big)$:
   $$\sum_{j=1}^N x_j n_j = \frac{1}{2}(x_0^2 - x_N^2) - \frac{1}{2}\sum_{j=1}^N n_j^2 = \frac{1}{2}X_0^2 - \frac{1}{2}\sum_{j=1}^N n_j^2$$
   Thế vào biểu thức `IS`, lấy kỳ vọng với $\mathbb{E}[\xi_j] = 0$ (với lịch tất định $x_j$) và phương sai với $\xi_j$ độc lập phương sai $1$, ta thu được ngay hai công thức $\mathbb{E}[\text{IS}]$ và $\operatorname{Var}(\text{IS})$! *(Chú ý ý nghĩa kinh tế sâu sắc: trong giới hạn liên tục $\tau \to 0$, phần tác động giá vĩnh viễn hội tụ về đúng hằng số $\frac{1}{2}\gamma X_0^2$ **hoàn toàn độc lập với lịch rải lệnh** — bạn bán nhanh hay bán chậm thì khi bán từ $X_0$ về $0$, trung bình bạn vẫn nhận mức giá đã trượt đi một nửa tổng biên độ $\gamma X_0$, triệt tiêu mọi mưu mẹo giao dịch thao túng khứ hồi!)*

3. **Bước 3 — Giải Phương trình Vi phân Euler-Lagrange (và Sai phân Rời rạc):**
   Trong giới hạn liên tục $\tau \to 0$ ($n_j / \tau \to -\dot{x}(t)$ và $\tilde{\eta} \to \eta$), bỏ qua hằng số $\frac{1}{2}\gamma X_0^2 + \varepsilon X_0$, bài toán cực tiểu hóa biến thành tích phân phiếm hàm lồi chặt:

$$
\min_{x(0)=X_0, \, x(T)=0} \; \int_0^T \Big(\eta \,\dot{x}(t)^2 + \lambda_A \sigma^2 x(t)^2\Big) dt
$$

   Áp dụng phương trình Euler-Lagrange $\frac{\partial L}{\partial x} - \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{x}}\right) = 0$:
   $$2\lambda_A \sigma^2 x(t) - 2\eta \ddot{x}(t) = 0 \iff \ddot{x}(t) - \kappa^2 x(t) = 0, \qquad \kappa = \sqrt{\frac{\lambda_A \sigma^2}{\eta}}$$
   Nghiệm tổng quát viết theo cơ sở đối xứng mốc cuối $T$ là $x(t) = c_1 \sinh\!\big(\kappa(T - t)\big) + c_2 \cosh\!\big(\kappa(T - t)\big)$. Điều kiện biên cuối $x(T) = 0 \implies c_2 \cosh(0) = c_2 = 0$; điều kiện biên đầu $x(0) = X_0 \implies c_1 = \frac{X_0}{\sinh(\kappa T)}$, cho nghiệm $x^\star(t) = X_0 \frac{\sinh(\kappa(T - t))}{\sinh(\kappa T)}$! (Trong rời rạc, đạo hàm theo $x_j$ của $\frac{\tilde{\eta}}{\tau}\big[(x_{j-1}-x_j)^2 + (x_j - x_{j+1})^2\big] + \lambda_A \sigma^2 \tau x_j^2$ cho phương trình sai phân $\frac{x_{j-1} - 2x_j + x_{j+1}}{\tau^2} = \tilde{\kappa}^2 x_j$, thay thử nghiệm $x_j = A\sinh(\kappa(T - j\tau))$ dùng $\sinh(a+b) + \sinh(a-b) = 2\sinh(a)\cosh(b)$ khớp chính xác với $\frac{2}{\tau^2}(\cosh(\kappa\tau) - 1) = \tilde{\kappa}^2$!). $\blacksquare$

Hãy kiểm tra hai chế độ giới hạn cực kỳ trực quan của tham số thời gian đặc trưng $\tau_{\text{char}} = \frac{1}{\kappa} = \sqrt{\frac{\eta}{\lambda_A \sigma^2}}$:
- **Giới hạn Trung hòa Rủi ro ($\lambda_A \to 0^+$ hoặc $\sigma \to 0 \implies \kappa \to 0^+$):** Dùng khai triển $\sinh(\kappa u) \approx \kappa u$, quỹ đạo suy biến thành đường thẳng tuyến tính $x^\star(t) = X_0 \left(1 - \frac{t}{T}\right)$ với tốc độ bán đều không đổi $v^\star(t) = \frac{X_0}{T}$. Đó chính là thuật toán **Giá Trung bình Gia quyền Thời gian** (Time-Weighted Average Price — viết tắt là `TWAP`), đạt cực tiểu chi phí tác động tạm thời kỳ vọng $\mathbb{E}[\text{IS}]_{\min} = \frac{1}{2}\gamma X_0^2 + \varepsilon X_0 + \frac{\eta X_0^2}{T}$!
- **Giới hạn Sợ Rủi ro Cao hoặc Biến động Bão táp ($\kappa T \gg 1$):** Vì $\sinh(u) \approx \frac{1}{2}e^u$, quỹ đạo biến thành hàm mũ suy giảm nhanh $x^\star(t) \approx X_0 e^{-\kappa t}$, ép thuật toán **dồn khối lượng bán mạnh ngay đầu phiên** (Front-Loading) với khoảng $63.2\%$ tổng lệnh được giải quyết ngay trong khoảng thời gian đầu tiên $t = 1/\kappa$!

---

## 3. Quy luật Tác động Thị trường Căn bậc Hai Thực nghiệm & Trần Dung lượng Chiến lược

Mô hình Almgren-Chriss giả định tác động tạm thời tuyến tính theo tốc độ để thu được nghiệm giải tích đóng. Tuy nhiên, khi các nhóm nghiên cứu vi cấu trúc tại Capital Fund Management, Citigroup và AQR tổng hợp dữ liệu thực thi hàng triệu lệnh tổ chức quy mô lớn (Meta-Orders) trên khắp thị trường cổ phiếu, hợp đồng tương lai và tiền mã hóa toàn cầu, họ phát hiện một định luật thực nghiệm phổ quát bậc nhất tài chính định lượng — **Quy luật Tác động Căn bậc Hai** (Square-Root Market Impact Law):

$$
\frac{\Delta P_{\text{impact}}}{P_0} \approx Y \cdot \sigma_{\text{daily}} \cdot \sqrt{\frac{Q}{V_{\text{ADV}}}}, \qquad Y \in [0.5, 1.0]
$$

trong đó $Q$ là tổng số cổ phiếu của toàn bộ lệnh cha, $V_{\text{ADV}}$ là khối lượng giao dịch bình quân ngày, $\sigma_{\text{daily}}$ là độ biến động lợi nhuận ngày của mã đó, và $Y \approx 0.7$ là hằng số không thứ nguyên gần như bất biến trên mọi sàn đấu giá điện tử!

Quy luật lõm $\sqrt{Q / V_{\text{ADV}}}$ quyết định trực tiếp **Dung lượng Vốn Tối đa** (Strategy Capacity) của mọi tín hiệu định lượng:
- Nếu chiến lược của bạn có lợi nhuận kỳ vọng gộp trước phí trên mỗi vòng giao dịch là $\alpha_{\text{bps}}$ (tính bằng điểm cơ bản), còn mỗi lệnh chiếm tỷ lệ tham gia thị trường $p = \frac{Q}{V_{\text{ADV}}}$, thì chi phí tác động giá trên mỗi đơn vị giao dịch tăng theo $Y \sigma_{\text{daily}} \sqrt{p}$, tức tổng tiền lợi nhuận đô-la ròng tỷ lệ với:

$$
\text{Net Dollar Profit}(Q) \propto \alpha_{\text{bps}} \cdot Q - c_0 \cdot Q^{3/2}
$$

- Đạo hàm hàm lợi nhuận đô-la ròng $\alpha_{\text{bps}} Q - c_0 Q^{3/2}$ theo $Q$ và cho bằng $0$: $\alpha_{\text{bps}} - \frac{3}{2} c_0 \sqrt{Q_{\max}} = 0$! Nghĩa là tổng lợi nhuận đô-la tuyệt đối của quỹ đạt đỉnh cực đại đúng tại quy mô vốn mà **chi phí tác động giá trung bình ăn mất $\frac{2}{3}$ tổng alpha gộp** (tức chi phí biên của đồng đô-la cuối cùng bằng $100\%$ alpha gộp!). Bơm thêm dù chỉ $\$1$ vốn vượt qua ngưỡng $Q_{\max}$ đó không những làm giảm tỷ suất sinh lời phần trăm, mà còn **làm giảm luôn tổng số tiền lãi tuyệt đối kiếm được**!

---

## 4. Tiêu chuẩn Kelly Đa Tài sản & Toán học Của Kelly Phân số (`0.25x – 0.50x`)

Sau khi đã định hình trọng số tương đối và tối ưu hóa thực thi, câu hỏi cuối cùng của nhà quản lý rủi ro là: **nên dùng tổng đòn bẩy bao nhiêu trên vốn chủ sở hữu $W_t$?** Năm 1956, nhà vật lý thông tin John L. Kelly Jr. tại Bell Labs và sau đó là Edward O. Thorp chứng minh tiêu chuẩn cực đại hóa tốc độ tăng trưởng tài sản gộp kép dài hạn.

Xét $N$ tài sản rủi ro trong thời gian liên tục có vector lợi nhuận kỳ vọng tức thời $\mu \in \mathbb{R}^N$, lãi suất phi rủi ro $r$, và ma trận hiệp phương sai tức thời $\Sigma \succ 0$. Nếu quỹ duy trì vector tỷ trọng đòn bẩy $f \in \mathbb{R}^N$ trên tổng vốn ròng $W_t$ (chú ý $\mathbf{1}^\top f$ có thể lớn hơn $1$ nhờ vay ký quỹ hoặc bằng $0$ với danh mục tự tài trợ), phương trình vi phân ngẫu nhiên của tài sản là:

$$
\frac{dW_t}{W_t} = \Big(r + f^\top (\mu - r\mathbf{1})\Big) dt + f^\top \Sigma^{1/2} \, dB_t
$$

**Định lý 5.7 (Công thức Kelly Đa Tài sản & Phân phối Sụt giảm Vốn của Fractional Kelly).**
*1. Tốc độ tăng trưởng hình học kỳ vọng dài hạn $g(f) \triangleq \lim_{T \to \infty} \frac{1}{T}\mathbb{E}\big[\ln(W_T / W_0)\big]$ bằng:*

$$
g(f) = r + f^\top (\mu - r\mathbf{1}) - \frac{1}{2} f^\top \Sigma f
$$

*và đạt cực đại toàn cục duy nhất tại vector **Kelly Toàn phần** $f^\star_{\text{Kelly}} = \Sigma^{-1}(\mu - r\mathbf{1})$ với tốc độ tăng trưởng tối đa $g(f^\star_{\text{Kelly}}) = r + \frac{1}{2}\text{SR}_{\max}^2$, trong đó $\text{SR}_{\max} = \sqrt{(\mu - r\mathbf{1})^\top \Sigma^{-1} (\mu - r\mathbf{1})}$ là Tỷ số Sharpe tối đa của tổ hợp.*
*2. Nếu danh mục vận hành theo **Kelly Phân số** $f_c = c \cdot f^\star_{\text{Kelly}}$ ($c \in (0, 2)$, xét $r = 0$), tốc độ tăng trưởng và xác suất xuyên thủng mức sụt giảm tài sản còn tỷ lệ $x \in (0, 1)$ trên chân trời vô hạn là:*

$$
g(c f^\star_{\text{Kelly}}) = c\!\left(1 - \frac{c}{2}\right)\text{SR}_{\max}^2, \qquad \mathbb{P}\!\left(\inf_{t \ge 0} \frac{W_t}{W_0} \le x\right) = x^{\frac{2}{c} - 1}
$$

**Chứng minh Bằng Bổ đề Itô & Martingale Mũ:**
1. Áp dụng trực tiếp **Bổ đề Itô** cho hàm lõm $\phi(W) = \ln W$ (với $\phi'(W) = \frac{1}{W}$ và $\phi''(W) = -\frac{1}{W^2}$, chú ý bình phương vi phân bậc hai $(dW_t)^2 = W_t^2 (f^\top \Sigma f)\,dt$):
   $$d(\ln W_t) = \frac{1}{W_t} dW_t - \frac{1}{2 W_t^2} (dW_t)^2 = \Big(r + f^\top (\mu - r\mathbf{1}) - \frac{1}{2} f^\top \Sigma f\Big) dt + f^\top \Sigma^{1/2}\,dB_t$$
   Hạng tử $-\frac{1}{2} f^\top \Sigma f$ chính là **Lực cản Biến động** (Volatility Drag)! Lấy kỳ vọng đạo hàm bậc nhất theo $f$: $\nabla_f g(f) = (\mu - r\mathbf{1}) - \Sigma f = \mathbf{0} \implies f^\star_{\text{Kelly}} = \Sigma^{-1}(\mu - r\mathbf{1})$ (trùng khớp hướng với nghiệm Markowitz $\gamma = 1$!).
2. Thế $f_c = c \Sigma^{-1}\mu$ (với $r = 0$) vào $g(f)$: $\mu^\top f_c = c (\mu^\top \Sigma^{-1}\mu) = c\,\text{SR}_{\max}^2$ và $\frac{1}{2} f_c^\top \Sigma f_c = \frac{c^2}{2}\text{SR}_{\max}^2$, suy ra trôi dạt logarit $\mu_X = \left(c - \frac{c^2}{2}\right)\text{SR}_{\max}^2 > 0$ (khi $0 < c < 2$) và phương sai logarit $\sigma_X^2 = c^2 \text{SR}_{\max}^2$.
   Quá trình $X_t = \ln(W_t / W_0) = \mu_X t + \sigma_X B_t$ là chuyển động Brown có trôi dương. Xét Martingale mũ $M_t = \exp(\theta X_t)$ với $\theta^\star = -\frac{2\mu_X}{\sigma_X^2} = -\frac{2(c - c^2/2)}{c^2} = -\left(\frac{2}{c} - 1\right) < 0$ (vì $\theta^\star \mu_X + \frac{1}{2}(\theta^\star)^2 \sigma_X^2 = 0$). Áp dụng Định lý Dừng Tùy ý tại thời điểm chạm biên dưới $b = \ln x < 0$ (cho biên trên tiến ra $+\infty$): $1 = M_0 = \mathbb{E}[M_{\tau_b}] = \mathbb{P}(\tau_b < \infty) e^{\theta^\star \ln x} \implies \mathbb{P}(\tau_b < \infty) = x^{-\theta^\star} = x^{\frac{2}{c} - 1}$! $\blacksquare$

Hãy nhìn vào con số chấn động giải thích tại sao **không một quỹ tổ chức nào dám đánh Full Kelly ($c = 1.0$)**:
- Tại **Full Kelly ($c = 1.0$):** Bạn đạt $100\%$ tốc độ tăng trưởng lý thuyết ($\frac{1}{2}\text{SR}^2$), nhưng số mũ rủi ro là $\frac{2}{1} - 1 = 1$: xác suất tài khoản bị **chia đôi ($x = 0.50$, sụt giảm $50\%$)** là **$50\%$**, và xác suất sụt giảm $20\%$ ($x = 0.80$) lên tới **$80\%$** — mức sụt giảm mà tại Millennium hay Citadel, pod của bạn đã bị đóng cửa cắt vốn từ đời nào (thường ngưỡng giải thể pod chỉ là $-8\%$ đến $-12\%$)!
- Tại **Nửa Kelly ($c = 0.50$):** Bạn vẫn thu về $0.5(1 - 0.25) / 0.5 = \mathbf{75\%}$ tốc độ tăng trưởng tối đa, nhưng **phương sai danh mục giảm đi $4$ lần** ($c^2 = 0.25$), và xác suất bị chia đôi tài sản lao dốc từ $50\%$ xuống $0.5^3 = \mathbf{12.5\%}$! Ở mức **Một phần tư Kelly ($c = 0.25$)**, bạn giữ lại $43.75\%$ tăng trưởng tối đa trong khi xác suất chia đôi tài sản chỉ còn $0.5^7 \approx \mathbf{0.78\%}$!
- **Thảm họa Đặt Cược Quá Kelly Do Sai số Ước lượng ($c \ge 2.0$):** Vì hàm tăng trưởng $c(1 - c/2)$ bất đối xứng khốc liệt và $\hat{\mu}$ ngoài thực tế luôn nhiễu nặng, nếu bạn ước lượng lạc quan gấp đôi sự thật ($\hat{\mu} = 2\mu_{\text{true}} \implies c = 2.0$), tốc độ tăng trưởng kép ròng **rơi thẳng về $0$**; còn nếu $c > 2.0$, $g(f) < 0 \implies W_t \xrightarrow{\text{a.s.}} 0$ (phá sản chắc chắn dù chiến lược có kỳ vọng số học dương)!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Lịch Thực thi Almgren-Chriss & Định cỡ Đòn bẩy Kelly

**Đề bài (Phỏng vấn Vòng Superday — Citadel Securities / Jane Street):**
1. **Phần A — Thực thi lệnh:** Bạn cần thanh lý $X_0 = 100{,}000$ cổ phiếu trong $T = 1.0$ ngày giao dịch (quy đổi thời gian chuẩn hóa $T = 1$). Biến động giá số học ngày là $\sigma = \$1.50$, hệ số tác động vĩnh viễn $\gamma = 2 \times 10^{-6}\text{ USD/cổ phiếu}$, chênh lệch cố định $\varepsilon = \$0.02\text{/cổ phiếu}$, và hệ số tác động tạm thời liên tục $\eta = 5 \times 10^{-6}\text{ USD}\cdot\text{ngày/cổ phiếu}$.
   - Tính thiếu hụt thực thi kỳ vọng $\mathbb{E}[\text{IS}]$ và độ lệch chuẩn $\sqrt{\operatorname{Var}(\text{IS})}$ nếu chạy thuật toán rải lệnh đều `TWAP` ($x(t) = X_0(1 - t)$).
   - Nếu giám đốc rủi ro đặt tham số ngại rủi ro $\lambda_A = \frac{20}{9} \times 10^{-6}\text{ USD}^{-1}$, hãy tính hằng số khẩn cấp $\kappa$ và tỷ lệ phần trăm khối lượng đã bán xong tại thời điểm giữa ngày $t = 0.5$!
2. **Phần B — Định cỡ Kelly:** Một chiến lược giao dịch trung hòa tiền mặt ($r = 0$) có Tỷ số Sharpe thực ngoài mẫu $\text{SR} = 2.0/\text{năm}$ tại mức biến động cơ sở $\sigma_0 = 10\%/\text{năm}$ ($\mu_0 = 20\%/\text{năm}$). Tính đòn bẩy Full Kelly, đòn bẩy Half Kelly, và tốc độ tăng trưởng hình học kỳ vọng năm của cả hai mức!

**Lời giải Chi tiết:**
1. **Giải Phần A:**
   - Với lịch tuyến tính `TWAP` $x(t) = X_0(1 - t) \implies \dot{x}(t) = -X_0$:
     - Thành phần tác động vĩnh viễn: $\frac{1}{2}\gamma X_0^2 = 0.5 \times 2 \times 10^{-6} \times 10^{10} = \mathbf{\$10{,}000}$.
     - Thành phần chênh lệch cố định: $\varepsilon X_0 = 0.02 \times 10^5 = \mathbf{\$2{,}000}$.
     - Thành phần tác động tạm thời: $\int_0^1 \eta \dot{x}(t)^2\,dt = \eta X_0^2 = 5 \times 10^{-6} \times 10^{10} = \mathbf{\$50{,}000}$.
     - Tổng kỳ vọng thiếu hụt `TWAP`: $\mathbb{E}[\text{IS}]_{\text{TWAP}} = 10{,}000 + 2{,}000 + 50{,}000 = \mathbf{\$62{,}000}$.
     - Phương sai thiếu hụt `TWAP`: $\operatorname{Var}(\text{IS})_{\text{TWAP}} = \sigma^2 \int_0^1 X_0^2 (1 - t)^2\,dt = \frac{1}{3} \sigma^2 X_0^2 = \frac{1}{3} \times 2.25 \times 10^{10} = 0.75 \times 10^{10}\text{ USD}^2 \implies \text{Std}(\text{IS})_{\text{TWAP}} = \sqrt{0.75} \times 10^5 \approx \mathbf{\$86{,}603}$!
   - Với $\lambda_A = \frac{20}{9} \times 10^{-6}$, hằng số khẩn cấp là:
     $$\kappa = \sqrt{\frac{\lambda_A \sigma^2}{\eta}} = \sqrt{\frac{\frac{20}{9} \times 10^{-6} \times \frac{9}{4}}{5 \times 10^{-6}}} = \sqrt{\frac{5}{5}} = \mathbf{1.0\text{ ngày}^{-1}}$$
     Tại nửa ngày $t = 0.5$ ($T = 1.0$), tồn kho còn lại theo quỹ đạo Almgren-Chriss là:
     $$\frac{x^\star(0.5)}{X_0} = \frac{\sinh(1.0 \times 0.5)}{\sinh(1.0)} = \frac{\sinh(0.5)}{2\sinh(0.5)\cosh(0.5)} = \frac{1}{2\cosh(0.5)} \approx \frac{1}{2 \times 1.1276} \approx 0.4434$$
     Vậy thuật toán tối ưu đã **bán xong $1 - 0.4434 = \mathbf{55.66\%}$ khối lượng ngay trong nửa phiên sáng** (thay vì $50\%$ như `TWAP`) để cắt giảm phương sai tồn kho!
2. **Giải Phần B:**
   - Đòn bẩy Full Kelly trên đơn vị danh mục cơ sở là: $f^\star_{\text{Kelly}} = \frac{\mu_0}{\sigma_0^2} = \frac{0.20}{0.01} = \mathbf{20\times}$ quy mô cơ sở (tương ứng biến động danh mục $20 \times 10\% = \mathbf{200\%/\text{năm}}$!), mang lại tốc độ tăng trưởng logarit tối đa $g_{\max} = \frac{1}{2}\text{SR}^2 = \frac{1}{2}(2.0)^2 = \mathbf{200\%/\text{năm}}$.
   - Ở mức Half Kelly ($c = 0.5$): đòn bẩy là $\mathbf{10\times}$ (biến động $100\%/\text{năm}$), tốc độ tăng trưởng hình học đạt $0.75 \times 200\% = \mathbf{150\%/\text{năm}}$ với biến động giảm một nửa! (Trên thực tế các quỹ còn có ràng buộc giải chấp nên thường đặt mục tiêu biến động $\sigma_P \approx 10\%\text{–}20\%/\text{năm}$, tương ứng $c \approx 0.05\text{–}0.10$ của Full Kelly).

---

## 6. Các Bẫy Thực nghiệm Trong Thuật toán Khớp Lệnh & Quản lý Vốn

> [!WARNING]
> **Ba Sai lầm Thực chiến Đắt Giá Khi Rải Lệnh Thuật toán & Áp Dụng Kelly:**
> 1. **Rò rỉ Dấu chân Thuật toán Cho Các Tay Săn Thanh khoản (`Predatory Trading`):** Nếu bạn chạy lịch `TWAP` đều đặn gửi đúng $500$ cổ phiếu vào đầu mỗi phút $00\text{s}$ như đồng hồ cơ học, các mô hình phân loại luồng lệnh tần số cao sẽ nhận diện ngay lập tức sự hiện diện của một lệnh tổ chức lớn đang thanh lý, chạy trước gom thanh khoản (Front-Running / Liquidity Detection) và làm hệ số $\eta$ thực tế tăng vọt gấp $3$ lần! Mọi thuật toán thực thi hiện đại đều phải ngẫu nhiên hóa thời điểm và kích thước lô con theo quá trình điểm Poisson không đồng nhất và ưu tiên khớp theo biến động thanh khoản thực (`VWAP` kết hợp tín hiệu `OFI` ngắn hạn).
> 2. **Phá vỡ Giả định Khuếch tán Liên tục Của Kelly Bởi Nhảy Giá Đuôi Dày (`Jump Risk`):** Công thức $f^\star = \Sigma^{-1}\mu$ dựa hoàn toàn trên Bổ đề Itô cho chuyển động Brown liên tục (cho phép tái cân bằng tức thời không trượt giá). Nếu tài sản có xác suất nhỏ nhảy vọt gián đoạn $-30\%$ qua đêm (như rủi ro hủy niêm yết, sáp nhập hoặc sập thanh khoản cuối tuần trên sàn tiền mã hóa), đòn bẩy Kelly liên tục có thể làm $W_t$ **âm ngay lập tức** ($\ln W_t$ không xác định)! Với phân phối có bước nhảy rời rạc, nghiệm Kelly thực sự luôn thấp hơn rất xa so với $\mu / \sigma^2$.
> 3. **Thiên lệch Giá Quyết định Khi Chấm Điểm Thực thi (`Arrival Price Gaming`):** Nếu đánh giá bàn giao dịch bằng giá bình quân ngày thay vì Giá Lúc Ra Quyết định $S_0$ của `IS`, bộ phận thực thi có động cơ trì hoãn lệnh sang cuối ngày hoặc giao dịch thụ động đẩy giá bình quân trôi theo hướng có lợi cho chỉ số đánh giá của họ nhưng làm quỹ mất trắng alpha ngắn hạn!
