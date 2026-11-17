# M5.02 — Tối ưu hóa Lồi Danh mục, Điều kiện KKT, Trung hòa Nhân tố & Hàm phạt Vòng quay Vốn

## 1. Trực giác & Động lực: Khoảng cách Giữa "Xếp hạng Tín hiệu" và "Kiến tạo Danh mục Tổ chức"

Trong giai đoạn đầu làm quen với nghiên cứu tín hiệu chéo (như trên nền tảng mô phỏng WorldQuant BRAIN), bạn thường biến đổi trực tiếp vector tín hiệu $s_t \in \mathbb{R}^N$ thành trọng số danh mục bằng công thức heuristic đơn giản: xếp hạng phân vị, trừ trung bình ngành rồi chia cho tổng giá trị tuyệt đối $w_t = \frac{\tilde{s}_t}{\|\tilde{s}_t\|_1}$. Cách làm này tuyệt vời để kiểm định nhanh xem tín hiệu thô có chứa thông tin dự báo hay không, nhưng **hoàn toàn không thể đem ra giao dịch vốn thực tế hàng trăm triệu đô-la** tại một quỹ đa chiến lược vì bốn lỗ hổng chí mạng:
1. **Mù thông tin rủi ro dị biệt và tương quan chéo:** Hai cổ phiếu có cùng điểm hạng $+0.40$ được cấp vốn bằng nhau dù một mã có biến động $15\%/\text{năm}$ còn mã kia là cổ phiếu công nghệ sinh học biến động $95\%/\text{năm}$!
2. **Rò rỉ phơi nhiễm nhân tố ngầm:** Trung hòa tiền mặt trong từng ngành vẫn có thể để danh mục nghiêng hẳn về nhóm cổ phiếu Beta cao ($\beta_P = +0.35$) hoặc nhóm vốn hóa nhỏ thanh khoản mỏng; chỉ một phiên thị trường chung đảo chiều mạnh là toàn bộ lợi nhuận đặc thù cả tháng bị xóa sổ.
3. **Không có khái niệm "trạng thái danh mục hiện hữu":** Công thức heuristic tái tính toán $w_t$ độc lập mỗi ngày như thể bạn bắt đầu từ tiền mặt trắng tay, dẫn tới việc mua đi bán lại vô nghĩa những vị thế chỉ nhích nhẹ tín hiệu từ $+1.02$ xuống $+0.98$, đốt sạch lợi nhuận cho phí chênh lệch giá và trượt giá.
4. **Không kiểm soát được ràng buộc cứng vận hành:** Giới hạn tỷ trọng tối đa trên một mã (ví dụ $|w_i| \le 1.5\%$), giới hạn thanh khoản tối đa $5\%$ khối lượng giao dịch bình quân ngày, và giới hạn tổng đòn bẩy gộp.

Ngôn ngữ toán học thống nhất giải quyết đồng thời cả bốn bài toán trên với bảo chứng nghiệm tối ưu toàn cục duy nhất trong vài mili-giây chính là **Tối ưu hóa Lồi** (Convex Optimization) — cụ thể là **Quy hoạch Bậc hai** (Quadratic Programming) kết hợp giải tích dưới vi phân không trơn do Stephen Boyd và Ronald Kahn chuẩn hóa cho ngành quản lý quỹ hiện đại.

---

## 2. Nghiệm Đóng Markowitz & Phép Chiếu Nghiêng Dưới Ràng buộc Trung hòa Tuyến tính

### 2.1. Danh mục Tối ưu Không Ràng buộc

Xét vũ trụ $N$ tài sản có vector dự báo lợi nhuận phụ trội $\alpha \in \mathbb{R}^N$ (đã định cỡ chuẩn $\alpha_i = \sigma_i \cdot \text{IC} \cdot z_i$ từ Bài `M5.01`) và ma trận hiệp phương sai xác định dương nghiêm ngặt $\Sigma \in \mathbb{R}^{N \times N}$ ($\Sigma \succ 0$). Với tham số ngại rủi ro $\gamma > 0$, bài toán cực đại hóa hữu dụng trung bình - phương sai cơ sở là:

$$
\max_{w \in \mathbb{R}^N} \; U(w) = \alpha^\top w - \frac{\gamma}{2} w^\top \Sigma w
$$

Vì $\Sigma \succ 0$, ma trận đạo hàm bậc hai $\nabla^2 U(w) = -\gamma \Sigma \prec 0$ xác định âm nghiêm ngặt trên toàn $\mathbb{R}^N$, nên $U(w)$ là hàm lõm chặt. Điều kiện bậc nhất $\nabla U(w) = \alpha - \gamma \Sigma w = \mathbf{0}$ vừa là điều kiện cần vừa là điều kiện đủ cho nghiệm cực đại toàn cục duy nhất:

$$
w_{\text{unc}}^\star = \frac{1}{\gamma} \Sigma^{-1} \alpha
$$

Tại nghiệm này, rủi ro danh mục là $\omega_P^\star = \sqrt{(w_{\text{unc}}^\star)^\top \Sigma w_{\text{unc}}^\star} = \frac{1}{\gamma}\sqrt{\alpha^\top \Sigma^{-1} \alpha}$. Trong thực tế, thay vì đoán mò con số trừu tượng $\gamma$, giám đốc danh mục luôn cố định **Ngân sách Biến động Mục tiêu** $\sigma_{\text{target}}$ (ví dụ $\sigma_{\text{target}} = 10\%/\text{năm}$), từ đó suy ngược ra hệ số ngại rủi ro nội sinh $\gamma = \frac{\sqrt{\alpha^\top \Sigma^{-1}\alpha}}{\sigma_{\text{target}}}$!

### 2.2. Chứng minh Nghiệm Trung hòa Nhân tố Tuyến tính $C^\top w = \mathbf{0}$ Bằng Đối ngẫu Lagrange

Trong vận hành quỹ đầu cơ trung hòa thị trường (Market-Neutral), danh mục bắt buộc phải triệt tiêu đồng thời $K$ phơi nhiễm tuyến tính ($K < N$), gom chung vào phương trình ma trận $C^\top w = \mathbf{0}_K$, trong đó ma trận ràng buộc $C \in \mathbb{R}^{N \times K}$ có hạng cột đầy đủ $\operatorname{rank}(C) = K$:
- **Trung hòa Tiền mặt** (Dollar-Neutral): cột $\mathbf{1}_N = (1, 1, \dots, 1)^\top \implies \mathbf{1}_N^\top w = \sum_{i=1}^N w_i = 0$ (tổng giá trị mua bằng đúng tổng giá trị bán khống).
- **Trung hòa Beta Thị trường** (Beta-Neutral): cột $\beta = (\beta_1, \dots, \beta_N)^\top \implies \beta^\top w = \sum_{i=1}^N \beta_i w_i = 0$.
- **Trung hòa Ngành & Nhân tố Phong cách**: các cột chỉ báo ngành `GICS` và điểm chuẩn quy mô, giá trị sổ sách.

**Định lý 5.4 (Nghiệm Đóng Trung hòa Đa Nhân tố).** *Bài toán tối ưu hóa lồi có ràng buộc đẳng thức tuyến tính:*

$$
\min_{w \in \mathbb{R}^N} \; \frac{\gamma}{2} w^\top \Sigma w - \alpha^\top w \qquad \text{thỏa mãn} \qquad C^\top w = \mathbf{0}_K
$$

*có nghiệm tối ưu toàn cục duy nhất được cho bởi phép chiếu nghiêng chuẩn $\Sigma^{-1}$:*

$$
w^\star = \frac{1}{\gamma} \Sigma^{-1} \Big(I_N - C\big(C^\top \Sigma^{-1} C\big)^{-1} C^\top \Sigma^{-1}\Big) \alpha
$$

**Chứng minh Từng Bước:**
1. Lập hàm Lagrange với vector nhân tử đối ngẫu $\nu \in \mathbb{R}^K$:

$$
\mathcal{L}(w, \nu) = \frac{\gamma}{2} w^\top \Sigma w - \alpha^\top w + \nu^\top (C^\top w)
$$

2. Lấy gradient theo biến nguyên thủy $w$ và cho bằng $\mathbf{0}_N$:
   $$\nabla_w \mathcal{L}(w, \nu) = \gamma \Sigma w - \alpha + C \nu = \mathbf{0}_N \implies w = \frac{1}{\gamma} \Sigma^{-1} (\alpha - C\nu)$$
3. Thay biểu thức $w$ vừa tìm được vào điều kiện khả thi nguyên thủy $C^\top w = \mathbf{0}_K$:
   $$\frac{1}{\gamma} C^\top \Sigma^{-1} (\alpha - C\nu) = \mathbf{0}_K \iff \big(C^\top \Sigma^{-1} C\big) \nu = C^\top \Sigma^{-1} \alpha$$
   Vì $\Sigma \succ 0 \implies \Sigma^{-1} \succ 0$ và $C$ có hạng cột đầy đủ $K$, với mọi vector $u \in \mathbb{R}^K \setminus \{\mathbf{0}\}$ ta có $C u \neq \mathbf{0} \implies u^\top (C^\top \Sigma^{-1} C) u = (Cu)^\top \Sigma^{-1} (Cu) > 0$. Vậy ma trận Gram suy rộng $C^\top \Sigma^{-1} C \in \mathbb{R}^{K \times K}$ xác định dương nghiêm ngặt và khả nghịch!
4. Giải duy nhất nhân tử Lagrange $\nu^\star = \big(C^\top \Sigma^{-1} C\big)^{-1} C^\top \Sigma^{-1} \alpha$, rồi thế ngược vào biểu thức của $w$, ta thu được ngay công thức của Định lý 5.4! Kiểm tra lại $C^\top w^\star = \frac{1}{\gamma}\big[C^\top \Sigma^{-1} - (C^\top \Sigma^{-1} C)(C^\top \Sigma^{-1} C)^{-1} C^\top \Sigma^{-1}\big]\alpha = \mathbf{0}_K$. $\blacksquare$

> [!IMPORTANT]
> **Câu Hỏi Bẫy Kinh Điển Trong Phỏng Vấn Citadel / Two Sigma — "Khử Trung Bình Đơn Giản Có Đủ Trung Hòa Tiền Mặt?"**
> Giả sử hiệp phương sai chéo bằng $0$ nhưng phương sai từng mã khác nhau: $\Sigma = \operatorname{diag}(\sigma_1^2, \dots, \sigma_N^2)$, và bạn chỉ cần trung hòa tiền mặt $C = \mathbf{1}_N$. Nhiều ứng viên trả lời vội: *"Chỉ cần trừ trung bình cộng $\tilde{\alpha}_i = \alpha_i - \bar{\alpha}$ rồi chia cho $\sigma_i^2$!"* **SAI HOÀN TOÀN!** Nếu lấy $w_i \propto \frac{\alpha_i - \bar{\alpha}}{\sigma_i^2}$, tổng $\sum_i w_i$ sẽ khác $0$ vì mẫu số $\sigma_i^2$ không bằng nhau! Áp dụng Định lý 5.4 với $C = \mathbf{1}_N$: nhân tử Lagrange bằng $\nu^\star = \frac{\mathbf{1}^\top \Sigma^{-1}\alpha}{\mathbf{1}^\top \Sigma^{-1}\mathbf{1}} = \frac{\sum_{j=1}^N \alpha_j / \sigma_j^2}{\sum_{j=1}^N 1 / \sigma_j^2} \triangleq \bar{\alpha}_{\text{prec}}$, dẫn tới nghiệm đúng phải trừ **trung bình gia quyền theo độ chính xác** ($1/\sigma_j^2$):
> $$w_i^\star = \frac{1}{\gamma \sigma_i^2}\big(\alpha_i - \bar{\alpha}_{\text{prec}}\big)$$

---

## 3. Mô hình Rủi ro Cấu trúc Đa Nhân tố & Đảo Ma trận Nhanh Woodbury

Khi vũ trụ mở rộng lên $N = 3{,}000$ cổ phiếu toàn cầu, không ai lưu trữ hay nghịch đảo trực tiếp ma trận đặc $\Sigma \in \mathbb{R}^{3000 \times 3000}$ tốn $\mathcal{O}(N^3) \approx 2.7 \times 10^{10}$ phép tính dấu chấm động mỗi bước lặp! Thay vào đó, các hệ thống rủi ro tổ chức (như mô hình cấu trúc kiểu Barra) phân rã lợi nhuận $r = B f + \varepsilon$, kéo theo cấu trúc hiệp phương sai hạng thấp cộng đường chéo:

$$
\Sigma = B \Omega_F B^\top + D
$$

trong đó $B \in \mathbb{R}^{N \times M}$ là ma trận tải nhân tố ($M \approx 30\text{–}60 \ll N$), $\Omega_F \in \mathbb{R}^{M \times M} \succ 0$ là hiệp phương sai giữa $M$ nhân tố, và $D = \operatorname{diag}(d_1, \dots, d_N) \succ 0$ là ma trận đường chéo phương sai phần dư đặc thù từng cổ phiếu.

Nhờ **Đồng nhất thức Đảo Ma trận Sherman-Morrison-Woodbury**, phép nghịch đảo cỡ $N \times N$ rút gọn về phép nghịch đảo ma trận tí hon cỡ $M \times M$:

$$
\Sigma^{-1} = \big(D + B \Omega_F B^\top\big)^{-1} = D^{-1} - D^{-1} B \big(\Omega_F^{-1} + B^\top D^{-1} B\big)^{-1} B^\top D^{-1}
$$

*(Kiểm chứng trực tiếp bằng phép nhân $(D + B\Omega_F B^\top)\big[D^{-1} - D^{-1}B(\Omega_F^{-1} + B^\top D^{-1} B)^{-1} B^\top D^{-1}\big] = I_N + B\Omega_F B^\top D^{-1} - B(I_M + \Omega_F B^\top D^{-1} B)(\Omega_F^{-1} + B^\top D^{-1} B)^{-1} B^\top D^{-1} = I_N + B\Omega_F B^\top D^{-1} - B\Omega_F(\Omega_F^{-1} + B^\top D^{-1} B)(\Omega_F^{-1} + B^\top D^{-1} B)^{-1} B^\top D^{-1} = I_N$!).*

Hơn thế nữa, khi đưa vào bộ giải quy hoạch bậc hai hiện đại (như `OSQP` hoặc `Clarabel`), ta đặt thêm biến phụ phơi nhiễm nhân tố $y = B^\top w \in \mathbb{R}^M$ để tách hàm rủi ro thành dạng cực thưa $w^\top D w + y^\top \Omega_F y$ kèm ràng buộc tuyến tính $y - B^\top w = \mathbf{0}_M$, hạ độ phức tạp tính toán mỗi bước lặp từ $\mathcal{O}(N^3)$ xuống $\mathcal{O}(N M^2 + M^3)$ — tăng tốc gần **$10{,}000$ lần**!

---

## 4. Hàm Phạt Vòng quay Vốn Chuẩn $\ell_1$, Điều kiện KKT & Sự Hình thành Vùng Không Giao dịch

Giả sử ngay trước phiên tái cân bằng, danh mục đang nắm giữ trọng số thực tế sau biến động giá là $w^- \in \mathbb{R}^N$. Mọi thay đổi vị thế $\Delta w_i = w_i - w_i^-$ đều phải trả chi phí giao dịch tỷ lệ bậc nhất $\kappa_i > 0$ trên mỗi đơn vị vốn luân chuyển (bao gồm nửa độ rộng chào mua - chào bán cộng phí sàn). Kết hợp với ràng buộc hộp trên từng vị thế $l_i \le w_i \le u_i$ và ràng buộc trung hòa $C^\top w = \mathbf{0}$, bài toán tối ưu hóa danh mục đơn chu kỳ chuẩn thực chiến của Boyd-Kahn (2017) có dạng:

$$
\max_{w \in \mathbb{R}^N} \; \alpha^\top w - \frac{\gamma}{2} w^\top \Sigma w - \sum_{i=1}^N \kappa_i |w_i - w_i^-| \qquad \text{s.t.} \qquad C^\top w = \mathbf{0}_K, \quad l \le w \le u
$$

*(Mẹo chuyển đổi lập trình lồi: để đưa hàm không khả vi $|w_i - w_i^-|$ vào bộ giải quy hoạch bậc hai tiêu chuẩn không hỗ trợ trị tuyệt đối, ta tách $w - w^- = z^+ - z^-$ với hai vector biến mua/bán không âm $z^+ \ge \mathbf{0}, \, z^- \ge \mathbf{0}$ và thay $\sum_i \kappa_i |w_i - w_i^-|$ bằng hàm tuyến tính $\kappa^\top (z^+ + z^-)$ — vì $\kappa_i > 0$, tại nghiệm tối ưu không bao giờ xảy ra vừa mua vừa bán cùng một mã nên $z_i^+ z_i^- = 0$ tự động thỏa mãn!).*

### 4.1. Chứng minh Vùng Không Giao dịch Bằng Giải tích Dưới Vi phân Karush-Kuhn-Tucker

Để thấy rõ bản chất kinh tế học vi mô của hàm phạt chuẩn $\ell_1$, ta giải trực tiếp điều kiện tối ưu **Karush-Kuhn-Tucker** (viết tắt là `KKT`) sử dụng **Dưới vi phân** (Subdifferential) của hàm trị tuyệt đối $f(u) = |u|$:

$$
\partial |u| = \begin{cases} \{+1\}, & \text{nếu } u > 0 \;\; (\text{Mua ròng } w_i > w_i^-) \\ [-1, +1], & \text{nếu } u = 0 \;\; (\text{Đứng im } w_i = w_i^-) \\ \{-1\}, & \text{nếu } u < 0 \;\; (\text{Bán ròng } w_i < w_i^-) \end{cases}
$$

**Định lý 5.5 (Định lý Ngưỡng Không Giao dịch — No-Trade Zone).** *Xét bài toán tối ưu có chi phí giao dịch tuyến tính $\kappa_i |w_i - w_i^-|$ (giả sử nghiệm nằm bên trong miền hộp $l_i < w_i^\star < u_i$). Điểm $w^\star$ với $C^\top w^\star = \mathbf{0}$ là nghiệm tối ưu toàn cục khi và chỉ khi tồn tại $\nu^\star \in \mathbb{R}^K$ và các dưới đạo hàm $g_i \in \partial |w_i^\star - w_i^-|$ sao cho với mọi $i \in \{1, \dots, N\}$:*

$$
\alpha_i - \gamma (\Sigma w^\star)_i - (C\nu^\star)_i = \kappa_i g_i
$$

*Đặc biệt, trong trường hợp ma trận rủi ro đường chéo $\Sigma = \operatorname{diag}(\sigma_1^2, \dots, \sigma_N^2)$ không ràng buộc phụ, đặt vị thế mục tiêu không ma sát $w_i^{\text{aim}} \triangleq \frac{\alpha_i}{\gamma \sigma_i^2}$ và bán kính vùng trễ $\Delta_i \triangleq \frac{\kappa_i}{\gamma \sigma_i^2}$, nghiệm đóng chính xác theo từng cổ phiếu là:*

$$
w_i^\star = \begin{cases} w_i^{\text{aim}} - \Delta_i = \dfrac{\alpha_i - \kappa_i}{\gamma \sigma_i^2}, & \text{nếu } w_i^- < w_i^{\text{aim}} - \Delta_i \\[8pt] w_i^-, & \text{nếu } w_i^{\text{aim}} - \Delta_i \le w_i^- \le w_i^{\text{aim}} + \Delta_i \\[8pt] w_i^{\text{aim}} + \Delta_i = \dfrac{\alpha_i + \kappa_i}{\gamma \sigma_i^2}, & \text{nếu } w_i^- > w_i^{\text{aim}} + \Delta_i \end{cases}
$$

**Chứng minh:**
Với $\Sigma = \operatorname{diag}(\sigma_1^2, \dots, \sigma_N^2)$ và không có ràng buộc $C$, hàm mục tiêu tách thành tổng độc lập trên từng tài sản $i$: cực đại hóa $\alpha_i w_i - \frac{1}{2}\gamma\sigma_i^2 w_i^2 - \kappa_i |w_i - w_i^-|$. Điều kiện dừng `KKT` đòi hỏi $\alpha_i - \gamma\sigma_i^2 w_i^\star = \kappa_i g_i$ với $g_i \in \partial |w_i^\star - w_i^-|$. Ta xét đủ ba trường hợp loại trừ lẫn nhau:
1. **Trường hợp Đứng im ($w_i^\star = w_i^-$):** Cần và đủ là tồn tại $g_i \in [-1, +1]$ sao cho $\alpha_i - \gamma\sigma_i^2 w_i^- = \kappa_i g_i \iff |\alpha_i - \gamma\sigma_i^2 w_i^-| \le \kappa_i$. Chia hai vế cho $\gamma\sigma_i^2 > 0$ cho ta $|w_i^{\text{aim}} - w_i^-| \le \frac{\kappa_i}{\gamma\sigma_i^2} = \Delta_i \iff w_i^- \in [w_i^{\text{aim}} - \Delta_i, \, w_i^{\text{aim}} + \Delta_i]$. Về mặt kinh tế, lợi nhuận kỳ vọng biên đã điều chỉnh rủi ro tại vị thế cũ thấp hơn chi phí vượt chênh lệch giá $\kappa_i$, nên không giao dịch là tối ưu tuyệt đối!
2. **Trường hợp Mua thêm ($w_i^\star > w_i^-$):** Khi đó $g_i = +1$ bắt buộc, suy ra $\alpha_i - \gamma\sigma_i^2 w_i^\star = +\kappa_i \implies w_i^\star = \frac{\alpha_i - \kappa_i}{\gamma\sigma_i^2} = w_i^{\text{aim}} - \Delta_i$. Điều kiện tự nhất quán $w_i^\star > w_i^-$ tương đương với $w_i^- < w_i^{\text{aim}} - \Delta_i$.
3. **Trường hợp Bán bớt ($w_i^\star < w_i^-$):** Khi đó $g_i = -1$ bắt buộc, suy ra $\alpha_i - \gamma\sigma_i^2 w_i^\star = -\kappa_i \implies w_i^\star = \frac{\alpha_i + \kappa_i}{\gamma\sigma_i^2} = w_i^{\text{aim}} + \Delta_i$, tự nhất quán khi và chỉ khi $w_i^- > w_i^{\text{aim}} + \Delta_i$. $\blacksquare$

Hãy khắc cốt ghi tâm **hai bài học vàng** luôn được hỏi xoáy tại vòng phỏng vấn danh mục:
- **Giao dịch Vừa Đủ Chạm Biên chứ Không Nhảy Vào Tâm!** Khi $w_i^-$ nằm ngoài vùng không giao dịch (ví dụ $w_i^- = 0\%$ trong khi $w_i^{\text{aim}} = +2.0\%$ và $\Delta_i = 0.6\%$), nghiệm tối ưu **không phải** là mua lên $+2.0\%$, mà chỉ mua tới **$+1.4\%$** (đúng mép dưới $w_i^{\text{aim}} - \Delta_i$)! Bởi vì ở phần $0.6\%$ cuối cùng từ $+1.4\%$ lên $+2.0\%$, lợi ích biên của mỗi đồng vốn tăng thêm đã tụt xuống thấp hơn chi phí giao dịch tuyến tính $\kappa_i$! (Chỉ khi phí giao dịch là phí cố định trọn gói mới có quy tắc nhảy thẳng vào tâm $(s, S)$).
- **Đối chiếu Chuẩn $\ell_1$ (Đứng im) với Hàm Phạt Tác động Bậc hai $\frac{\lambda_i}{2}(w_i - w_i^-)^2$ (Dịch chuyển Mượt):** Nếu thay chi phí tuyến tính bằng chi phí tác động thị trường bậc hai $-\frac{\lambda_i}{2}(w_i - w_i^-)^2$, đạo hàm bậc nhất $\alpha_i - \gamma\sigma_i^2 w_i^\star - \lambda_i(w_i^\star - w_i^-) = 0$ cho nghiệm **trung bình gia quyền tuyến tính** $w_i^\star = \frac{\gamma\sigma_i^2}{\gamma\sigma_i^2 + \lambda_i} w_i^{\text{aim}} + \frac{\lambda_i}{\gamma\sigma_i^2 + \lambda_i} w_i^-$ (chính là bộ lọc làm mượt trung bình động mũ!). Trong hệ thống chuẩn tổ chức, ta kết hợp **cả hai** hạng tử phạt: chuẩn $\ell_1$ triệt tiêu các lệnh lặt vặt tốn phí chênh lệch giá, còn bậc hai (hoặc lũy thừa $3/2$) chia nhỏ các lệnh lớn qua nhiều phiên để giảm tác động đẩy giá!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Giải Quyết định Giao dịch Dưới Hàm Phạt Chuẩn $\ell_1$

**Đề bài (Phỏng vấn Vòng Nghiên cứu Danh mục — Millennium / Point72 Cubist):**
Xét 3 cổ phiếu có rủi ro đặc thù độc lập ($\Sigma = \operatorname{diag}(\sigma_1^2, \sigma_2^2, \sigma_3^2)$) với độ biến động năm lần lượt là $\sigma_1 = 20\%, \, \sigma_2 = 25\%, \, \sigma_3 = 40\%$. Hệ số ngại rủi ro của danh mục được cố định ở $\gamma = 5.0$, và chi phí giao dịch tuyến tính một chiều đều bằng $\kappa = 10\text{ bps} = 0.0010$ cho cả 3 mã (tạm bỏ ràng buộc trung hòa chéo để xét quyết định từng mã). Sáng nay danh mục đang nắm giữ vị thế đầu kỳ $w^- = (+1.20\%, \, -0.80\%, \, +0.50\%)^\top$, và mô hình phát tín hiệu lợi nhuận phụ trội kỳ vọng quy năm $\alpha = (+0.40\%, \, -0.20\%, \, +1.20\%)^\top$. Hãy xác định vị thế tối ưu mới $w^\star$ và lệnh giao dịch cần gửi đi $\Delta w^\star = w^\star - w^-$ cho từng cổ phiếu!

**Lời giải Chi tiết Từng Bước:**
Tính phương sai từng mã: $\sigma_1^2 = 0.04, \, \sigma_2^2 = 0.0625, \, \sigma_3^2 = 0.16$, suy ra mẫu số $\gamma \sigma_i^2$ lần lượt là:
$$\gamma \sigma_1^2 = 5.0 \times 0.04 = 0.20, \qquad \gamma \sigma_2^2 = 5.0 \times 0.0625 = 0.3125, \qquad \gamma \sigma_3^2 = 5.0 \times 0.16 = 0.80$$

Áp dụng Định lý 5.5 cho từng cổ phiếu với $\kappa = 0.0010$:
1. **Cổ phiếu 1 ($\alpha_1 = +0.0040, \, w_1^- = +1.20\%$):**
   - Vị thế mục tiêu không ma sát: $w_1^{\text{aim}} = \frac{0.0040}{0.20} = +0.0200 = \mathbf{+2.00\%}$.
   - Bán kính vùng không giao dịch: $\Delta_1 = \frac{0.0010}{0.20} = 0.0050 = \mathbf{0.50\%}$.
   - Dải băng đứng im là $[+2.00\% - 0.50\%, \, +2.00\% + 0.50\%] = [+1.50\%, \, +2.50\%]$.
   - Vì vị thế hiện có $w_1^- = +1.20\% < +1.50\%$ nằm dưới biên dưới, hệ thống quyết định **Mua thêm vừa đủ chạm biên dưới**: $w_1^\star = \mathbf{+1.50\%} \implies \Delta w_1^\star = \mathbf{+0.30\%}$.
2. **Cổ phiếu 2 ($\alpha_2 = -0.0020, \, w_2^- = -0.80\%$):**
   - Vị thế mục tiêu không ma sát: $w_2^{\text{aim}} = \frac{-0.0020}{0.3125} = -0.0064 = \mathbf{-0.64\%}$.
   - Bán kính vùng không giao dịch: $\Delta_2 = \frac{0.0010}{0.3125} = 0.0032 = \mathbf{0.32\%}$.
   - Dải băng đứng im là $[-0.64\% - 0.32\%, \, -0.64\% + 0.32\%] = [-0.96\%, \, -0.32\%]$.
   - Vì vị thế hiện tại $w_2^- = -0.80\%$ **nằm gọn bên trong** $[-0.96\%, \, -0.32\%]$, hệ thống quyết định **Đứng im hoàn toàn**: $w_2^\star = \mathbf{-0.80\%} \implies \Delta w_2^\star = \mathbf{0.00\%}$ (tiết kiệm phí giao dịch vô bổ!).
3. **Cổ phiếu 3 ($\alpha_3 = +0.0120, \, w_3^- = +0.50\%$):**
   - Vị thế mục tiêu không ma sát: $w_3^{\text{aim}} = \frac{0.0120}{0.80} = +0.0150 = \mathbf{+1.50\%}$.
   - Bán kính vùng không giao dịch: $\Delta_3 = \frac{0.0010}{0.80} = 0.00125 \approx \mathbf{0.125\%}$ (nhỏ hơn nhiều so với Cổ phiếu 1 vì $\sigma_3^2$ lớn nên chi phí rủi ro của việc lệch mục tiêu rất đắt!).
   - Dải băng đứng im là $[+1.375\%, \, +1.625\%]$. Vì $w_3^- = +0.50\% < +1.375\%$, hệ thống **Mua thêm lên biên dưới**: $w_3^\star = \mathbf{+1.375\%} \implies \Delta w_3^\star = \mathbf{+0.875\%}$.

---

## 6. Các Bẫy Vận hành Khi Đưa Bộ Tối ưu Lồi Vào Sản xuất Thực tế

> [!WARNING]
> **Ba Bẫy Kỹ thuật Khiến Bộ Giải Quy hoạch Danh mục Gặp Sự cố Trong Giờ Giao dịch:**
> 1. **Bài toán Vô nghiệm (`Infeasibility`) Khi Ràng buộc Cứng Xung đột Nhau:** Nếu bạn cài đồng thời ràng buộc cứng trung hòa $11$ ngành chính xác tuyệt đối ($C_{\text{sector}}^\top w = \mathbf{0}$), trung hòa Beta chính xác ($\beta^\top w = 0$), trần vị thế từng mã $|w_i| \le 1.0\%$, tổng đòn bẩy $\|w\|_1 = 2.0$ **cùng với** giới hạn vòng quay cứng $\|w - w^-\|_1 \le 10\%$ trong một phiên thị trường biến động dữ dội làm $\beta$ nhảy vọt, tập giao của các đa diện lồi có thể trở thành **tập rỗng** và bộ giải báo lỗi dừng khẩn cấp ngay trước phiên khớp lệnh! Quy tắc thiết kế chuẩn công nghiệp: chỉ giữ ràng buộc cứng cho giới hạn tuân thủ pháp lý/rủi ro cốt lõi, còn trung hòa nhân tố phụ và vòng quay vốn luôn phải chuyển thành **biến bù mềm có hàm phạt lớn** (Slack Variables with Soft Penalties) để bộ giải luôn hội tụ 100% mọi phiên!
> 2. **Quên Cập nhật Trọng số Trôi Giá Tự nhiên $w_{t-1}^+$ Trước Khi Tính Vòng quay:** Cuối ngày $t-1$ bạn giữ trọng số $w_{t-1}$; sau khi thị trường biến động với lợi nhuận $r_t$, trước khi bạn đặt bất kỳ lệnh mới nào vào cuối ngày $t$, trọng số thực tế trên sổ cái đã tự động trôi sang $w_t^- = \frac{w_{t-1} \odot (\mathbf{1} + r_t)}{1 + w_{t-1}^\top r_t}$! Nếu lập trình hàm phạt viết nhầm thành $\|w_t - w_{t-1}\|_1$ thay vì $\|w_t - w_t^-\|_1$, bộ tối ưu sẽ tưởng nhầm việc đứng yên là đang giao dịch và ngược lại!
> 3. **Khuếch đại Vòng quay Khi Thay đổi Hệ số Phạt Đột ngột:** Nếu ước lượng $\Sigma_t$ cửa sổ trượt nhảy mạnh mỗi khi một phiên sập thị trường rơi ra khỏi đuôi cửa sổ $252$ ngày, nghiệm $w^\star$ sẽ đảo lộn giả tạo. Luôn sử dụng hiệp phương sai trọng số mũ với chu kỳ bán rã êm (ví dụ $60\text{–}90$ ngày cho biến động và $120\text{–}180$ ngày cho tương quan) để giữ quỹ đạo trọng số trơn tru theo thời gian.
