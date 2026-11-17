# M1.05 — Cơ chế Hợp đồng Tương lai, Ngang giá Quyền chọn & Tác động Dòng tiền Phòng vệ Gamma

## 1. Trực giác & Động lực: Khi Cái Đuôi Phái sinh Vẫy Con Chó Cơ sở

Trong giáo trình tài chính nhập môn, chứng khoán phái sinh thường được mô tả như những tờ giấy cá cược thụ động ăn theo biến động của cổ phiếu hay hàng hóa gốc. Trên sàn giao dịch điện tử hiện đại, trật tự nhân quả đã đảo chiều ngoạn mục: giá trị danh nghĩa giao dịch hàng ngày của hợp đồng tương lai chỉ số E-mini S&P 500 (`ES`) và tổ hợp quyền chọn ngắn hạn vượt gấp nhiều lần tổng giá trị khớp lệnh của toàn bộ $500$ cổ phiếu thành phần cộng lại!

Khi hàng tỷ đô-la quyền chọn đổi chủ mỗi phiên, các tổ chức tạo lập thị trường đứng ở phía đối ứng không hề ngồi im ôm rủi ro hướng giá; hệ thống thuật toán của họ liên tục bắn lệnh mua bán hợp đồng tương lai để tái cân bằng trạng thái trung hòa. Nắm vững định giá không kinh doanh chênh lệch giá, cạm bẫy dữ liệu cuộn kỳ hạn và cơ chế phản hồi phòng vệ động là điều kiện tiên quyết để nhà nghiên cứu định lượng không nhầm lẫn dòng tiền cơ học thành tín hiệu cơ bản giả tạo.

---

## 2. Định giá Hợp đồng Tương lai, Cấu trúc Kỳ hạn & Bẫy Ghép nối Chuỗi Liên tục

### 2.1. Lập luận Không Kinh doanh Chênh lệch Giá & Mô hình Chi phí Lưu giữ

Xét một tài sản giao ngay có giá $S_t$ tại thời điểm $t$, lãi suất phi rủi ro ghép lãi liên tục là $r$, tỷ suất cổ tức hoặc lợi tức ngoại tệ liên tục là $q$, chi phí lưu kho vật chất tính theo tỷ lệ giá trị là $u \ge 0$, và **lợi tức tiện ích** (Convenience Yield) của việc nắm giữ hàng hóa vật chất sẵn trong kho để không đứt gãy sản xuất là $y \ge 0$. Với khoảng thời gian còn lại đến ngày đáo hạn $\tau = T - t$, **Mô hình Chi phí Lưu giữ** (Cost-of-Carry Model) khẳng định giá hợp lý của hợp đồng kỳ hạn/tương lai dưới lãi suất tất định phải thỏa mãn:

$$
F_{t,T} = S_t \, e^{(r - q + u - y)(T - t)}
$$

**Chứng minh Đối với Tài sản Đầu tư Khả mại Không Thiếu hụt Kho ($y = 0$).** Giả sử tồn tại định giá lệch $F_{t,T} > S_t e^{(r - q + u)\tau}$. Tại thời điểm $t$, quỹ định lượng lập tức thực hiện chiến lược **Mua giao ngay – Bán tương lai** `Cash-and-Carry`:
1. Vay số tiền $S_t e^{(u - q)\tau}$ ở lãi suất $r$: dùng $S_t e^{-q\tau}$ mua $e^{-q\tau}$ đơn vị tài sản — tái đầu tư cổ tức liên tục $q$ để đến ngày $T$ nở thành đúng $1$ đơn vị tài sản — và trích phần hiện giá chi phí lưu kho để thanh toán chi phí giữ hàng đến $T$.
2. Đồng thời mở vị thế bán $1$ hợp đồng tương lai kỳ hạn $T$ tại mức giá khóa cứng $F_{t,T}$ không tốn chi phí mở vị thế ban đầu ngoài ký quỹ.
3. Tại thời điểm đáo hạn $T$, giao đúng $1$ đơn vị tài sản vào hợp đồng tương lai thu về $F_{t,T}$ và trả khoản nợ gốc lãi $S_t e^{(u - q)\tau} e^{r\tau} = S_t e^{(r - q + u)\tau}$. Lợi nhuận chắc chắn phi rủi ro bằng $F_{t,T} - S_t e^{(r - q + u)\tau} > 0$, mâu thuẫn với tiên đề không kinh doanh chênh lệch giá! Chiều ngược lại $F_{t,T} < S_t e^{(r - q + u)\tau}$ bị triệt tiêu hoàn toàn tương tự qua chiến lược bán khống giao ngay và mua tương lai, miễn là tài sản không bị khan hiếm kho vật chất — khi khan hiếm hàng tồn kho thực tế, người nắm giữ vật chất không cho vay bán khống vì hưởng lợi tức ngầm $y > 0$, làm giảm giá tương lai theo nhân tử $e^{-y\tau}$. $\blacksquare$

### 2.2. Cấu trúc Kỳ hạn, Phân tách Lợi suất Cuộn & Bẫy Ghép nối Lịch sử

Đặt hệ số chi phí lưu giữ ròng $c_{\text{net}} \triangleq r - q + u - y$. Độ dốc đường cong kỳ hạn tạo ra hai chế độ thị trường kinh điển:
- **Bù hoãn mua** (Contango — $c_{\text{net}} > 0 \implies F_{t,T_2} > F_{t,T_1} > S_t$): Thường gặp ở vàng do chi phí vốn $r + u > 0, y \approx 0$, hợp đồng tương lai biến động `VIX` trong thời bình, hoặc dầu thô khi dư cung tồn kho.
- **Bù hoãn bán** (Backwardation — $c_{\text{net}} < 0 \implies F_{t,T_2} < F_{t,T_1} < S_t$): Xuất hiện khi tỷ suất cổ tức vượt lãi suất ($q > r$) hoặc hàng hóa năng lượng/nông sản rơi vào khan hiếm giao ngay đẩy $y \gg r + u$.

Lấy vi phân logarit của $\ln F_{t,T} = \ln S_t + c_{\text{net}}(T - t)$ theo thời gian thực $t$ với ngày đáo hạn $T$ cố định ($\frac{d(T - t)}{dt} = -1$ và giữ $c_{\text{net}}$ hằng định địa phương), lợi suất tức thời của vị thế mua hợp đồng tương lai phân rã chính xác thành **Lợi suất Giao ngay** (Spot Return) cộng **Lợi suất Đảo kỳ hạn** — tức `Roll Return`:

$$
\frac{dF_{t,T}}{F_{t,T}} = \underbrace{\frac{dS_t}{S_t}}_{\text{Biến động giá giao ngay}} + \underbrace{(-c_{\text{net}})\,dt}_{\text{Hội tụ về giá giao ngay khi } t \to T}
$$

Nếu giá giao ngay đứng yên hoàn toàn ($dS_t = 0$) nhưng thị trường nằm trong trạng thái dốc lên ($c_{\text{net}} > 0$), giá hợp đồng tương lai buộc phải trượt giảm dần về $S_T$ với tốc độ $-c_{\text{net}}\,dt < 0$, gây lỗ bào mòn âm thầm cho các quỹ hoán đổi hàng hóa nắm giữ dài hạn!

> [!WARNING]
> **Bẫy Chết Người Khi Nối Chuỗi Hợp đồng Tương lai Liên tục:** Mỗi hợp đồng tương lai đều hết hạn sau vài tháng. Nếu bạn ghép nối thô giá hợp đồng tháng gần sang tháng xa ngay ngày đảo kỳ hạn $\tau_j$, bước nhảy chênh lệch kỳ hạn $F_{\tau_j}^{(j+1)} - F_{\tau_j}^{(j)}$ sẽ tạo ra một khoản lãi/lỗ ảo không hề có thật! Để triệt tiêu bước nhảy đó, nhiều nhà cung cấp dữ liệu dùng **Điều chỉnh Cộng lùi Kênh đào Panama** (Panama Canal Back-Adjustment) bằng cách cộng dồn hiệu số đô-la vào toàn bộ lịch sử trước $\tau_j$. Trên chuỗi nhiều năm dốc lên mạnh như dầu thô hay khí tự nhiên, phép cộng lùi này đẩy giá lịch sử quá khứ lùi xuống sát $\$0$ hoặc **biến thành giá âm**, làm nổ tung mọi phép tính lợi suất phần trăm $\frac{F_t - F_{t-1}}{F_{t-1}}$ và độ biến động!

Để bảo toàn nguyên vẹn tỷ suất sinh lời phần trăm thực tế của một danh mục tự tài trợ đảo kỳ hạn tại chuỗi ngày chuyển giao $\tau_1 < \tau_2 < \dots < \tau_{K-1}$ tới hợp đồng hiện hành thứ $K$, ta phải dùng **Điều chỉnh Tỷ lệ Nhân tích lũy** — `Proportional Adjustment` — cho mọi mô hình lợi suất tương đối:

$$
F_t^{\text{ratio}} = F_t^{(k)} \prod_{j=k}^{K-1} \frac{F_{\tau_j}^{(j+1)}}{F_{\tau_j}^{(j)}} \qquad \forall t \in (\tau_{k-1}, \tau_k]
$$

| Phương pháp ghép nối | Công thức tại ngày đảo kỳ hạn $\tau_j$ | Đại lượng được bảo toàn chính xác | Rủi ro sai số mô hình |
| :--- | :--- | :--- | :--- |
| **Nối thô không chỉnh** | Giữ nguyên $F_t^{(k)}$ | Giá danh nghĩa từng thời điểm lịch sử | Tạo nhảy vọt lãi/lỗ giả tạo ngay ngày cuộn hợp đồng |
| **Cộng lùi hiệu số** | Cộng $\sum_{j=k}^{K-1} \big(F_{\tau_j}^{(j+1)} - F_{\tau_j}^{(j)}\big)$ | Thay đổi điểm giá tuyệt đối $\Delta F_t$ cho $1$ lô | Giá quá khứ có thể âm; phá hỏng hoàn toàn lợi suất $\%$ |
| **Nhân lùi tỷ lệ** | Nhân $\prod_{j=k}^{K-1} \big(F_{\tau_j}^{(j+1)} / F_{\tau_j}^{(j)}\big)$ | Tỷ suất sinh lời phần trăm & lợi suất logarit | Thay đổi độ lớn tuyệt đối của bước nhảy điểm đô-la |

---

## 3. Ngang giá Quyền chọn Mua – Bán, Quyền chọn Mỹ & Bề mặt Biến động Hàm ẩn

### 3.1. Chứng minh Đẳng thức Ngang giá Quyền chọn Kiểu Âu

Xét quyền chọn mua giá $C_t$ và quyền chọn bán giá $P_t$ kiểu Âu chỉ thực hiện đúng tại ngày đáo hạn $T = t + \tau$, viết trên cùng tài sản cơ sở $S_t$ trả cổ tức liên tục $q$ và cùng **giá thực hiện** (Strike Price) $K$.

**Định lý 1.4 — Ngang giá Quyền chọn Mua – Bán (Put-Call Parity).** *Trong thị trường không có cơ hội kinh doanh chênh lệch giá và không có ma sát vay mượn với lãi suất phi rủi ro $r$, giá quyền chọn mua và bán kiểu Âu luôn ràng buộc chặt chẽ bởi đẳng thức độc lập mô hình:*

$$
C_t - P_t = S_t e^{-q\tau} - K e^{-r\tau} = e^{-r\tau}\big(F_{t,T} - K\big)
$$

**Chứng minh Bằng Hai Danh mục Nhân bản.** Tại thời điểm $t$, thiết lập hai danh mục đầu tư giữ tĩnh tới ngày đáo hạn $T$:
- **Danh mục $\Pi_A$:** Mua $1$ quyền chọn mua $C_t$ và gửi tiết kiệm số tiền mặt hiện giá $K e^{-r\tau}$ ở lãi suất $r$, nở thành đúng $K$ tiền mặt tại $T$. Tổng chi phí lập danh mục lúc $t$ là $V_t(\Pi_A) = C_t + K e^{-r\tau}$.
- **Danh mục $\Pi_B$:** Mua $1$ quyền chọn bán $P_t$ và mua $e^{-q\tau}$ đơn vị cổ phiếu cơ sở có tái đầu tư toàn bộ cổ tức liên tục vào chính cổ phiếu đó, nở thành đúng $1$ cổ phiếu trị giá $S_T$ tại $T$. Tổng chi phí lúc $t$ là $V_t(\Pi_B) = P_t + S_t e^{-q\tau}$.

Xét giá trị thanh toán cuối cùng tại thời điểm $T$ trên toàn bộ không gian trạng thái của $S_T$:
- Nếu $S_T \ge K$: $V_T(\Pi_A) = (S_T - K) + K = S_T$, còn quyền chọn bán vô giá trị nên $V_T(\Pi_B) = 0 + S_T = S_T$.
- Nếu $S_T < K$: Quyền chọn mua vô giá trị nên $V_T(\Pi_A) = 0 + K = K$, còn $V_T(\Pi_B) = (K - S_T) + S_T = K$.

Vì $V_T(\Pi_A) \equiv V_T(\Pi_B) = \max(S_T, K)$ trong **mọi kịch bản thế giới có thể xảy ra** mà không cần bất kỳ giả thiết phân phối chuẩn hay chuyển động Brown nào của Black-Scholes, định luật một giá bắt buộc $V_t(\Pi_A) = V_t(\Pi_B) \iff C_t + K e^{-r\tau} = P_t + S_t e^{-q\tau}$. $\blacksquare$

### 3.2. Giới hạn Dưới của Quyền chọn Mỹ so với Quyền chọn Âu

Do giá quyền chọn không bao giờ âm ($P_t \ge 0, C_t \ge 0$), Định lý 1.4 kéo theo ngay chặn dưới chặt cho quyền chọn kiểu Âu: $C_t \ge \max\big(S_t e^{-q\tau} - K e^{-r\tau}, \, 0\big)$ và $P_t \ge \max\big(K e^{-r\tau} - S_t e^{-q\tau}, \, 0\big)$.

Đối với **Quyền chọn Kiểu Mỹ** (American Options) cho phép người mua thực hiện quyền tại bất kỳ thời điểm dừng nào trước hoặc tại $T$ với giá $C_t^{\text{Am}} \ge C_t$ và $P_t^{\text{Am}} \ge P_t$:
1. **Không bao giờ thực hiện sớm Quyền chọn Mua Mỹ khi không có cổ tức ($q = 0, r > 0$):** Nếu thực hiện ngay lúc $t$, nhà đầu tư chỉ thu được $S_t - K$. Trong khi đó, giá thị trường của quyền chọn mua luôn thỏa mãn $C_t^{\text{Am}} \ge C_t \ge S_t - K e^{-r\tau} > S_t - K$ do $e^{-r\tau} < 1$: việc tất toán sớm vừa đánh mất giá trị bảo hiểm chiều giảm ($P_t \ge 0$), vừa nộp tiền $K$ sớm mất tiền lãi $(1 - e^{-r\tau})K$! Do đó khi $q = 0$, quyền thực hiện sớm có giá trị bằng $0$ và $C_t^{\text{Am}} \equiv C_t$. Chỉ khi cổ phiếu sắp chia cổ tức lớn $q > 0$, người cầm quyền chọn mua mới cân nhắc thực hiện ngay trước giờ giao dịch không hưởng quyền; ngược lại, quyền chọn bán Mỹ sâu trong tiền có thể tối ưu khi thực hiện sớm để thu tiền mặt $K$ đem gửi lấy lãi $r$ ngay lập tức.
2. Khi có cả cổ tức $q \ge 0$ và lãi suất $r \ge 0$, đẳng thức ngang giá thu hẹp thành **bất đẳng thức kẹp hai đầu** cho hiệu giá quyền chọn Mỹ:

$$
S_t e^{-q\tau} - K \;\le\; C_t^{\text{Am}} - P_t^{\text{Am}} \;\le\; S_t - K e^{-r\tau}
$$

### 3.3. Bề mặt Biến động Hàm ẩn: Độ lệch Nhếch mép & Cấu trúc Kỳ hạn

Thay vì giả định biến động hằng số của mô hình Black-Scholes-Merton, thị trường thực tế báo giá quyền chọn qua **Biến động Hàm ẩn** (Implied Volatility) $\sigma_{\text{IV}}(K, \tau)$, tức nghiệm duy nhất khi đảo ngược công thức Black-Scholes theo giá thị trường quan sát được. Trên không gian hai chiều tiền tệ chuẩn hóa $k = \ln(K / F_{t,T})$ và kỳ hạn $\tau$, bề mặt $\sigma_{\text{IV}}(k, \tau)$ xấp xỉ bậc hai địa phương quanh vùng ngang giá ($k = 0$) có dạng:

$$
\sigma_{\text{IV}}(k, \tau) \approx \sigma_{\text{ATM}}(\tau) + \psi(\tau)\,k + \frac{1}{2}\kappa(\tau)\,k^2
$$

- **Độ lệch Nhếch mép Âm trên Chỉ số Cổ phiếu** (Skew, $\psi(\tau) < 0$): Kể từ cú sập Thứ Hai Đen tối tháng 10/1987, các quyền chọn bán ngoài tiền ở cánh trái ($K \ll S_t \iff k < 0$) trên S&P 500 luôn giao dịch ở mức $\sigma_{\text{IV}}$ cao hơn $5\text{–}15$ điểm phần trăm so với vùng ngang giá! Nguyên nhân đến từ hai lực cấu trúc: hiệu ứng đòn bẩy kinh tế khiến biến động nhảy vọt bất đối xứng khi thị trường rơi tự do, và cầu bảo hiểm đuôi khổng lồ mang tính một chiều từ các quỹ hưu trí luôn sẵn sàng trả phí đắt cho quyền chọn bán bảo vệ danh mục.
- **Đảo ngược Cấu trúc Kỳ hạn Biến động** (Term Structure Inversion): Trong điều kiện êm ả, đường cong $\tau \mapsto \sigma_{\text{ATM}}(\tau)$ dốc lên ($\sigma_{\text{ATM}}(1\text{M}) < \sigma_{\text{ATM}}(6\text{M})$) do phần bù rủi ro bất định dài hạn. Ngay khi nổ ra cú sốc hoảng loạn vĩ mô, $\sigma_{\text{ATM}}$ kỳ hạn ngắn 1 tuần – 1 tháng vọt thẳng đứng vượt xa kỳ hạn 6 tháng bởi nhà giao dịch hiểu biến động tuân theo quá trình hồi quy trung bình, tạo tín hiệu cảnh báo chế độ rủi ro tức thời cực mạnh.

---

## 4. Cơ chế Phơi nhiễm Gamma Nhà Tạo lập & Phản hồi Khuếch đại Cú Sập

### 4.1. Luật Tái Phòng vệ Delta Cơ học của Bàn Tạo lập Quyền chọn

Xét quần thể các tổ chức tạo lập thị trường quyền chọn nắm giữ danh mục quyền chọn tổng hợp có giá trị $V_t(S_t)$, hệ số nhạy cảm bậc nhất $\Delta_{\text{dealer}}(S_t) = \frac{\partial V_t}{\partial S_t}$ và độ cong bậc hai $\Gamma_{\text{dealer}}(S_t) = \frac{\partial^2 V_t}{\partial S_t^2}$. Để giữ danh mục tổng thể trung hòa hướng giá bậc nhất ($\Delta_{\text{total}} = 0$), bàn tạo lập phải nắm giữ khối lượng cổ phiếu hoặc hợp đồng tương lai đối ứng bằng $H_t = -\Delta_{\text{dealer}}(S_t)$. Khi giá tài sản cơ sở dịch chuyển một lượng $\Delta S_t$, khai triển Taylor bậc nhất buộc hệ thống tự động của họ phải bắn lệnh thị trường mua/bán một lượng $\Delta H_t$:

$$
\Delta H_t = -\Delta_{\text{dealer}}(S_t + \Delta S_t) + \Delta_{\text{dealer}}(S_t) \approx -\Gamma_{\text{dealer}}(S_t)\,\Delta S_t
$$

Trên toàn thị trường, các bộ phận định lượng ước tính **Phơi nhiễm Gamma Nhà tạo lập** (Dealer Gamma Exposure — `GEX`) quy đổi thành tổng số đô-la cổ phiếu/tương lai mà các nhà tạo lập phải giao dịch đối ứng khi chỉ số cơ sở biến động $+1\%$, với hệ số nhân hợp đồng $M$, khối lượng hợp đồng mở $\text{OI}_i$ và dấu chiều nắm giữ ước tính của nhà tạo lập $s_i \in \{+1, -1\}$:

$$
\text{GEX}_{\$} = \sum_{i} s_i \cdot \text{OI}_i \cdot \Gamma_i \cdot M \cdot \frac{S_t^2}{100}
$$

Để hiểu vì sao quyền chọn sắp đáo hạn lại gây chấn động vi cấu trúc mạnh gấp hàng chục lần quyền chọn dài hạn, hãy nhìn vào nghiệm giải tích của độ cong Black-Scholes đối với mật độ chuẩn tắc $\phi(z) = \frac{1}{\sqrt{2\pi}}e^{-z^2/2}$:

$$
\Gamma_i(S_t, K_i, \tau) = \frac{e^{-q\tau}\,\phi(d_1)}{S_t\,\sigma_{\text{IV}}\sqrt{\tau}}, \qquad \lim_{\tau \to 0^+} \Gamma_i(S_t = K_i, \tau) = +\infty
$$

Khi thời gian còn lại $\tau$ thu hẹp về vài giờ cuối phiên đáo hạn ($\tau \to 0^+$):
- Ở mọi mức giá xa điểm thực hiện ($S_t \neq K_i$), $|d_1| \propto \tau^{-1/2} \to \infty$ kéo $\phi(d_1) \to 0$ cực nhanh.
- Riêng ngay sát vùng ngang giá ($S_t \approx K_i \implies d_1 \approx 0$), mẫu số $\sqrt{\tau} \to 0$ làm $\Gamma_i$ **nổ tung theo cấp số $\tau^{-1/2}$**! Chỉ cần giá chỉ số nhảy qua lại vài điểm quanh $K_i$ lúc $15\text{:}30$ chiều, hệ số $\Delta_i$ giật thẳng từ $0$ sang $\pm 1$, ép thuật toán phòng vệ phải đảo chiều hàng trăm triệu đô-la hợp đồng tương lai chỉ trong tích tắc.

Trên chỉ số cổ phiếu Mỹ truyền thống, các quỹ đầu tư thường xuyên **bán quyền chọn mua ngoài tiền phía trên** ($K > S_t$) để thu phí tăng thêm lợi tức — khiến nhà tạo lập đứng phía mua đối ứng $s_i = +1$, dương độ cong ở vùng cao — và **mua quyền chọn bán ngoài tiền phía dưới** ($K < S_t$) để phòng hộ sập sàn — khiến nhà tạo lập đứng phía bán đối ứng $s_i = -1$, âm độ cong ở vùng thấp. Điểm giao cắt nơi tổng $\text{GEX}_{\$} = 0$ tạo thành ngưỡng chuyển pha động lực học của thị trường.

### 4.2. Chứng minh Toán học Sự Nén và Khuếch đại Biến động Nội sinh

Ghép phương trình luồng lệnh phòng vệ cơ học $\Delta H_t = -\Gamma_{\text{dealer}}\,\Delta S_t$ vào quy luật tác động giá tuyến tính của Kyle ở Bài `M1.04` với hệ số bất thanh khoản sổ lệnh $\lambda > 0$ và luồng lệnh ngoại sinh từ các nhà đầu tư khác là $\xi_t$ ($\operatorname{Var}(\xi_t) = \sigma_\xi^2$):

$$
\Delta S_t = \lambda\big(\xi_t + \Delta H_t\big) = \lambda\big(\xi_t - \Gamma_{\text{dealer}}\,\Delta S_t\big) \implies \Delta S_t = \frac{\lambda}{1 + \lambda\,\Gamma_{\text{dealer}}}\,\xi_t
$$

Lấy độ lệch chuẩn hai vế với $\sigma_{\text{fund}} \triangleq \lambda \sigma_\xi$ là biến động cơ bản khi vắng bóng quyền chọn ($\Gamma_{\text{dealer}} = 0$), ta thu được công thức biến động thực tế nội sinh:

$$
\sigma_{\text{realized}} = \frac{\sigma_{\text{fund}}}{\big|1 + \lambda\,\Gamma_{\text{dealer}}\big|}
$$

Công thức thanh lịch này giải thích trọn vẹn hai bộ mặt trái ngược của thị trường hiện đại:
1. **Chế độ Dương Gamma ($\Gamma_{\text{dealer}} > 0 \implies 1 + \lambda\Gamma_{\text{dealer}} > 1 \implies \sigma_{\text{realized}} < \sigma_{\text{fund}}$):** Theo $\Delta H_t = -\Gamma_{\text{dealer}}\,\Delta S_t$, mỗi khi thị trường tăng điểm ($\Delta S_t > 0$) thì $\Delta H_t < 0$ nên nhà tạo lập **bán ra chốt lời cơ học**, còn mỗi khi thị trường giảm điểm ($\Delta S_t < 0$) thì $\Delta H_t > 0$ nên nhà tạo lập **mua đỡ giá cơ học**. Bàn tạo lập đóng vai trò bộ giảm xóc khổng lồ mua thấp – bán cao, ghìm nén biến động thực tế xuống thấp và hút chặt giá đóng cửa về các mức thực hiện lớn vào chiều đáo hạn!
2. **Chế độ Âm Gamma ($\Gamma_{\text{dealer}} < 0 \implies 0 < 1 + \lambda\Gamma_{\text{dealer}} < 1 \implies \sigma_{\text{realized}} \gg \sigma_{\text{fund}}$):** Khi chỉ số rơi thủng ngưỡng chuyển dấu xuống vùng dày đặc quyền chọn bán đã bán cho khách, dấu trừ của $-\Gamma_{\text{dealer}}$ đảo thành **dương** khiến $\Delta H_t = |\Gamma_{\text{dealer}}|\,\Delta S_t$ cùng dấu với $\Delta S_t$! Thị trường giảm điểm ($\Delta S_t < 0$) buộc các thuật toán phòng vệ **bán tháo hợp đồng tương lai thuận xu hướng**, đẩy giá lún sâu hơn! Đặc biệt khi $|\Gamma_{\text{dealer}}|$ tiến sát ngưỡng tới hạn $1/\lambda$ trong bối cảnh thanh khoản rút chạy làm $\lambda$ tăng vọt, mẫu số $1 + \lambda\Gamma_{\text{dealer}} \to 0^+$ gây ra **vòng lặp phản hồi nổ tung thanh khoản** — cơ chế cốt lõi đứng sau cú sập chớp nhoáng (Flash Crash) hoặc đợt ép mua điên cuồng `Gamma Squeeze` khi đám đông cá nhân ồ ạt gom quyền chọn mua ngắn hạn buộc nhà tạo lập phải mua đuổi cổ phiếu bằng mọi giá!

```python
import numpy as np

def ratio_back_adjust(raw_prices: np.ndarray, roll_indices: np.ndarray, next_prices_at_roll: np.ndarray) -> np.ndarray:
    """Ghép nối chuỗi hợp đồng tương lai liên tục bằng tỷ lệ nhân lùi bảo toàn lợi suất phần trăm."""
    factors = np.ones_like(raw_prices, dtype=np.float64)
    cum_ratio = 1.0
    for idx, f_next in zip(roll_indices[::-1], next_prices_at_roll[::-1]):
        cum_ratio *= f_next / raw_prices[idx]
        factors[: idx + 1] = cum_ratio
    return raw_prices * factors

def compute_dollar_gex(spot: float, oi: np.ndarray, gamma: np.ndarray, dealer_sign: np.ndarray, mult: float = 100.0) -> float:
    """Tính tổng phơi nhiễm GEX quy đổi USD cho mỗi 1% dịch chuyển của chỉ số cơ sở."""
    return float(np.sum(dealer_sign * oi * gamma) * mult * (spot ** 2) / 100.0)
```

---

## 5. Ví dụ Phỏng vấn Thực chiến & Các Bẫy Thực nghiệm

**Bài toán — Phỏng vấn Bàn Phái sinh Định lượng tại Optiver / Citadel Securities:**
Chỉ số S&P 500 đang ở mức $S_0 = 5{,}000$, lãi suất phi rủi ro $r = 5\%/\text{năm}$, tỷ suất cổ tức $q = 1.5\%/\text{năm}$.
1. **Phần A:** Tính giá hợp lý của hợp đồng tương lai kỳ hạn $\tau = 0.5\text{ năm}$. Nếu trên sàn quyền chọn Âu cùng kỳ hạn $\tau = 0.5$ tại giá thực hiện $K = 5{,}000$ đang khớp $C_0 = 215.00$ điểm và $P_0 = 118.00$ điểm không tính phí giao dịch, hãy chỉ ra cơ hội kinh doanh chênh lệch giá và lợi nhuận khóa cứng bằng điểm chỉ số!
2. **Phần B:** Một bàn tạo lập đang âm ròng $20{,}000$ hợp đồng quyền chọn bán S&P 500 hệ số nhân $M = \$100/\text{điểm}$, mỗi quyền chọn có $\Gamma_i = +0.0012\text{ điểm}^{-1}$. Nếu chỉ số bất ngờ sụt giảm $\Delta S = -40$ điểm, bàn tạo lập buộc phải mua hay bán bao nhiêu giá trị danh nghĩa hợp đồng tương lai để trung hòa Delta?

**Lời giải Chi tiết:**
1. **Giải Phần A:**
   - Giá hợp đồng tương lai lý thuyết: $F_{0, 0.5} = 5{,}000 \times e^{(0.05 - 0.015) \times 0.5} = 5{,}000 \times e^{0.0175} \approx \mathbf{5{,}088.27}\text{ điểm}$, cấu trúc dốc lên do $r > q$.
   - Theo Định lý Ngang giá Quyền chọn, chênh lệch lý thuyết phải bằng $C_0^{\text{fair}} - P_0^{\text{fair}} = 5{,}000 e^{-0.0075} - 5{,}000 e^{-0.025} \approx 4{,}962.64 - 4{,}876.55 = \mathbf{86.09}\text{ điểm}$.
   - Trên sàn đang giao dịch $C_0 - P_0 = 215.00 - 118.00 = \mathbf{97.00}\text{ điểm} > 86.09\text{ điểm}$, tức cặp tổng hợp đang đắt hơn hợp đồng tương lai gốc đúng $10.91$ điểm! Chiến lược **Đảo ngược Chuyển đổi** (Reversal/Conversion Arbitrage): **Bán** $1$ quyền chọn mua thu $215$, **Mua** $1$ quyền chọn bán chi $118$, đồng thời **Mua** $e^{-0.0075}$ đơn vị giỏ chỉ số và vay $5{,}000 e^{-0.025}$. Ngay lập tức tại $t = 0$, bạn đút túi tiền mặt phi rủi ro $97.00 - 86.09 = \mathbf{+\$10.91 \times M}$ trên mỗi lô mà dòng tiền tất toán lúc đáo hạn triệt tiêu bằng $0$ tuyệt đối!
2. **Giải Phần B:**
   - Do bàn tạo lập **bán** $20{,}000$ quyền chọn nên trạng thái độ cong đô-la điểm của họ âm: $\Gamma_{\text{dealer}}^{\text{units}} = -20{,}000 \times 100 \times 0.0012 = -2{,}400$ đơn vị chỉ số trên mỗi điểm dịch chuyển.
   - Khi chỉ số rơi $\Delta S = -40$ điểm, khối lượng điều chỉnh phòng vệ là $\Delta H = -\Gamma_{\text{dealer}}^{\text{units}} \times \Delta S = -(-2{,}400) \times (-40) = \mathbf{-96{,}000}\text{ đơn vị chỉ số}$.
   - Ở mức giá $S_1 = 4{,}960$, bàn tạo lập buộc phải **bán tháo khẩn cấp** lượng hợp đồng tương lai có giá trị danh nghĩa $96{,}000 \times \$4{,}960 \approx \mathbf{\$476.16\text{ triệu}}$ ngay giữa lúc thị trường đang rơi!

> [!IMPORTANT]
> **Hai Nguyên tắc Thực nghiệm Khi Đưa Dữ liệu Phái sinh Vào Mô hình Alpha:**
> - **Giả định Tồn kho Nhà tạo lập Không Phải Hằng số:** Các chỉ báo `GEX` công khai thường mặc định nhà tạo lập luôn mua quyền chọn mua và bán quyền chọn bán. Đối với cổ phiếu đơn lẻ công nghệ hoặc quyền chọn siêu ngắn hạn hết hạn trong ngày (`0DTE`), khách hàng cá nhân lại chủ yếu **mua quyền chọn mua**, khiến nhà tạo lập thực chất **âm độ cong ở cả phía trên**! Muốn ước lượng dấu $s_i$ chuẩn xác phải phân loại chiều khớp lệnh gốc trên luồng dữ liệu quyền chọn (`OPRA`) theo giá chào mua – chào bán tại mili-giây khớp lệnh.
> - **Đồng bộ Dấu Thời gian Giữa Cơ sở và Quyền chọn:** Trước khi kiểm định vi phạm ngang giá quyền chọn hoặc rút trích độ lệch biến động hàm ẩn làm tín hiệu dự báo lợi nhuận cổ phiếu, luôn tính trung điểm báo giá quyền chọn cùng mili-giây với hợp đồng tương lai/cổ phiếu và quy đổi cổ tức rời rạc dự kiến thay vì lấy giá khớp cuối cùng lệch pha hàng chục phút của các mức thực hiện kém thanh khoản!
