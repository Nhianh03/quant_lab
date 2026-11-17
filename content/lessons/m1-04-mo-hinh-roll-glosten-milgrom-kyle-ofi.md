# M1.04 — Mô hình Roll, Bất cân xứng Glosten-Milgrom, Đấu giá Kyle & Mất cân bằng Luồng lệnh

## 1. Trực giác & Động lực: Vì sao Mọi Giao dịch Đều Làm Dịch chuyển Giá?

Nếu thị trường tài chính thực sự vận hành như các mô hình kinh tế tân cổ điển sơ cấp — nơi giá cả chỉ thay đổi khi có bản tin vĩ mô công bố công khai và mọi nhà đầu tư đều có thể mua bán khối lượng tùy ý tại mức giá cân bằng — thì độ rộng chênh lệch mua bán sẽ bằng không và một lệnh mua $100{,}000$ cổ phiếu sẽ không bao giờ đẩy giá nhích lên dù chỉ một xu.

Thực tế trên bàn giao dịch lại kể một câu chuyện ngược hẳn: đại đa số biến động giá trong ngày diễn ra mà không hề có bất kỳ dòng tin tức báo chí nào xuất hiện! Thông tin mới không tự động bay từ dữ liệu kinh tế vào bảng giá; nó được **cấy vào giá thông qua hành động đặt lệnh của những người giao dịch có thông tin vượt trội**. Nhà tạo lập thị trường đứng ở phía bên kia sổ lệnh hiểu rõ rằng mỗi khi có một lệnh thị trường hung hãn lao vào khớp lệnh giới hạn của mình, luôn tồn tại xác suất người đối diện biết điều gì đó mà mình chưa biết.

Bài giảng này chứng minh trọn vẹn bốn trụ cột lý thuyết và thực nghiệm quan trọng nhất của kinh tế lượng vi cấu trúc thị trường (Market Microstructure Econometrics): từ hiện tượng nảy giá tĩnh của **Roll (1984)**, trò chơi cập nhật xác suất Bayes tuần tự của **Glosten & Milgrom (1985)**, cân bằng chiến lược che giấu lệnh của **Kyle (1985)**, cho tới biến **Mất cân bằng Luồng lệnh** (Order Flow Imbalance — `OFI`) hiện đại của **Cont, Kukanov & Stoikov (2014)**.

---

## 2. Mô hình Tự Hiệp phương sai Âm của Roll (1984)

### 2.1. Giả thiết Cấu trúc & Chứng minh Công thức Chênh lệch Ngụ ý

Vào đầu thập niên 1980, dữ liệu lịch sử chỉ ghi lại chuỗi **giá khớp lệnh cuối cùng** $P_1, P_2, \dots, P_T$ mà không hề lưu trữ báo giá chào mua $b_t$ và chào bán $a_t$. Richard Roll (1984) đặt câu hỏi: *Chỉ nhìn vào chuỗi giá khớp $P_t$, ta có thể khôi phục ngược lại độ rộng chênh lệch mua - bán $s$ đang ẩn bên dưới hay không?*

Xét các giả thiết chuẩn của mô hình Roll:
1. Giá trị hợp lý cơ bản (Efficient Fundamental Price) $m_t$ biến thiên theo bước đi ngẫu nhiên không trôi: $m_t = m_{t-1} + u_t$, với cú sốc thông tin công khai $u_t$ độc lập theo thời gian, $\mathbb{E}[u_t] = 0$ và $\operatorname{Var}(u_t) = \sigma_u^2$.
2. Nhà tạo lập duy trì độ rộng chênh lệch cố định $s = 2c > 0$ đối xứng quanh $m_t$ (nửa chênh lệch hiệu dụng $c = s/2$ bù đắp chi phí xử lý lệnh cố định, chưa xét bất cân xứng thông tin).
3. Tại mỗi bước $t$, lệnh thị trường đến có dấu chiều giao dịch $q_t \in \{+1, -1\}$ ($+1$ là lệnh mua khớp tại $m_t + c$, $-1$ là lệnh bán khớp tại $m_t - c$) tuân theo phân phối đối xứng $\mathbb{P}(q_t = +1) = \mathbb{P}(q_t = -1) = \frac{1}{2}$, độc lập giữa các kỳ ($\mathbb{E}[q_t q_{t-k}] = 0$ với mọi $k \ge 1$) và độc lập với chuỗi thông tin $(u_t)$.

Từ phương trình giá khớp quan sát $P_t = m_t + c q_t$, lấy sai phân bậc nhất $\Delta P_t = P_t - P_{t-1}$:

$$
\Delta P_t = (m_t - m_{t-1}) + c(q_t - q_{t-1}) = u_t + c(q_t - q_{t-1})
$$

**Định lý 1.1 (Cấu trúc Hiệp phương sai Chuỗi Giá Khớp của Roll).** *Dưới các giả thiết trên, chuỗi thay đổi giá $\Delta P_t$ có kỳ vọng bằng $0$, phương sai bằng $\sigma_u^2 + 2c^2$, tự hiệp phương sai bậc nhất âm chặt và mọi tự hiệp phương sai bậc cao triệt tiêu:*

$$
\operatorname{Cov}(\Delta P_t, \Delta P_{t-1}) = -c^2 = -\frac{s^2}{4}, \qquad \operatorname{Cov}(\Delta P_t, \Delta P_{t-k}) = 0 \quad (\forall k \ge 2)
$$

*Từ đó suy ra công thức ước lượng độ rộng chênh lệch ngụ ý của Roll:*

$$
s_{\text{Roll}} = 2c = 2\sqrt{-\operatorname{Cov}(\Delta P_t, \Delta P_{t-1})}
$$

**Chứng minh.** Vì $\mathbb{E}[u_t] = 0$ và $\mathbb{E}[q_t] = 0$ nên $\mathbb{E}[\Delta P_t] = 0$. Do $q_t^2 \equiv 1 \implies \operatorname{Var}(q_t) = \mathbb{E}[q_t^2] = 1$ và $u_t, q_t, q_{t-1}$ đôi một độc lập, phương sai của $\Delta P_t$ bằng:

$$
\operatorname{Var}(\Delta P_t) = \operatorname{Var}(u_t) + c^2\big(\operatorname{Var}(q_t) + \operatorname{Var}(q_{t-1})\big) = \sigma_u^2 + 2c^2
$$

Tiếp theo, xét tích hai sai phân liên tiếp $\Delta P_t = u_t + c q_t - c q_{t-1}$ và $\Delta P_{t-1} = u_{t-1} + c q_{t-1} - c q_{t-2}$:

$$
\operatorname{Cov}(\Delta P_t, \Delta P_{t-1}) = \mathbb{E}\big[ \big(u_t + c q_t - c q_{t-1}\big)\big(u_{t-1} + c q_{t-1} - c q_{t-2}\big) \big]
$$

Khai triển 9 tích chéo: mọi hạng tử chứa $u_t, u_{t-1}, q_t$ hoặc $q_{t-2}$ đều tách kỳ vọng bằng $0$ do tính độc lập đôi một. Hạng tử duy nhất xuất hiện ở cả hai ngoặc là $(-c q_{t-1})(+c q_{t-1}) = -c^2 q_{t-1}^2$. Vì $q_{t-1}^2 = 1$ hầu chắc chắn, ta thu được ngay $\operatorname{Cov}(\Delta P_t, \Delta P_{t-1}) = -c^2 \mathbb{E}[q_{t-1}^2] = -c^2$. Với $k \ge 2$, hai tập chỉ số $\{t, t-1\}$ và $\{t-k, t-k-1\}$ hoàn toàn rời nhau nên $\operatorname{Cov}(\Delta P_t, \Delta P_{t-k}) = 0$. Giải $s = 2c$ theo $-\operatorname{Cov}(\Delta P_t, \Delta P_{t-1})$ cho ra biểu thức căn bậc hai của định lý. $\blacksquare$

**Ý nghĩa Thực chiến — Ảo giác Đảo chiều Ngắn hạn do Nảy Giá Mua - Bán (Bid-Ask Bounce):** Giả sử giá trị cơ bản đứng yên ($u_t = 0$), một lệnh mua khớp tại giá chào bán $\$100.05$ khiến lệnh kế tiếp chỉ có hai khả năng: khớp tiếp tại $\$100.05$ ($\Delta P_{t+1} = 0$) hoặc khớp xuống giá chào mua $\$99.95$ ($\Delta P_{t+1} = -\$0.10$), tức kỳ vọng thay đổi giá kế tiếp âm! Hệ số tự tương quan bậc nhất $\rho_1 = \frac{-c^2}{\sigma_u^2 + 2c^2} \in \left[-\frac{1}{2}, 0\right)$ hoàn toàn là ảo ảnh cơ học của việc nảy qua lại giữa hai bờ chênh lệch, không thể khai thác được bằng lệnh thị trường vì bạn phải trả đúng $2c$ để vượt qua chênh lệch đó!

---

## 3. Mô hình Bất cân xứng Thông tin Tuần tự Glosten - Milgrom (1985)

Roll giả định lệnh mua/bán không mang thông tin gì về giá trị cơ bản ($q_t \perp u_t$). Lawrence Glosten và Paul Milgrom (1985) đảo ngược hoàn toàn góc nhìn này: ngay cả khi chi phí vận hành của nhà tạo lập bằng **$0$**, độ rộng chênh lệch giá dương vẫn bắt buộc phải xuất hiện như một tấm khiên bảo hiểm trước **lựa chọn bất lợi** (Adverse Selection) từ những kẻ giao dịch nội gián!

### 3.1. Thiết lập Trò chơi Tuần tự & Cập nhật Bayes của Nhà Tạo lập

Xét một tài sản rủi ro có giá trị thanh lý cuối cùng $V \in \{V_L, V_H\}$ ($V_L < V_H$) với xác suất tiên nghiệm công khai trước phiên giao dịch thứ nhất là $\theta_0 = \mathbb{P}(V = V_H) \in (0, 1)$, tức kỳ vọng vô điều kiện $V_0 = \mathbb{E}[V] = \theta_0 V_H + (1 - \theta_0) V_L$. Quần thể nhà giao dịch trên thị trường gồm hai nhóm:
- **Người giao dịch có thông tin** (Informed Traders, chiếm tỷ trọng $\alpha \in (0, 1)$): Biết chính xác giá trị thực của $V$; họ chắc chắn đặt lệnh Mua $1$ đơn vị nếu $V = V_H$ và đặt lệnh Bán $1$ đơn vị nếu $V = V_L$.
- **Người giao dịch nhiễu thanh khoản** (Uninformed / Noise Traders, chiếm tỷ trọng $1 - \alpha$): Giao dịch vì nhu cầu tiền mặt cá nhân không liên quan đến $V$; họ Mua với xác suất $\frac{1}{2}$ và Bán với xác suất $\frac{1}{2}$.

Nhà tạo lập thị trường trung hòa rủi ro và cạnh tranh hoàn hảo (lợi nhuận kỳ vọng trên mỗi chiều giao dịch bằng $0$) công bố giá chào bán $A_1$ (mức giá mà tại đó khách hàng sẽ gửi lệnh Mua $B_1^{\text{ord}}$) và giá chào mua $B_1$ (mức giá mà tại đó khách hàng sẽ gửi lệnh Bán $S_1^{\text{ord}}$) sao cho không bị lỗ kỳ vọng sau khi biết chiều lệnh khách vừa chọn:

$$
A_1 = \mathbb{E}\big[V \mid B_1^{\text{ord}}\big], \qquad B_1 = \mathbb{E}\big[V \mid S_1^{\text{ord}}\big]
$$

**Định lý 1.2 (Độ rộng Chênh lệch Glosten-Milgrom & Tính chất Martingale của Giá Khớp).** *Tại bước giao dịch đầu tiên, xác suất hậu nghiệm để $V = V_H$ sau khi quan sát một lệnh Mua hoặc lệnh Bán lần lượt là:*

$$
\theta_1^+ = \frac{\theta_0 \left(\alpha + \frac{1 - \alpha}{2}\right)}{\theta_0 \alpha + \frac{1 - \alpha}{2}} = \frac{\theta_0 (1 + \alpha)}{1 - \alpha + 2\alpha \theta_0}, \qquad \theta_1^- = \frac{\theta_0 (1 - \alpha)}{1 + \alpha - 2\alpha \theta_0}
$$

*Suy ra độ rộng chênh lệch mua - bán $s_1 = A_1 - B_1$ bằng:*

$$
s_1 = \frac{4\alpha \, \theta_0(1 - \theta_0)}{1 - \alpha^2(1 - 2\theta_0)^2} (V_H - V_L), \qquad \text{đặc biệt khi } \theta_0 = \frac{1}{2} \implies s_1 = \alpha (V_H - V_L)
$$

**Chứng minh.** Theo công thức xác suất toàn phần, xác suất xuất hiện lệnh Mua ở bước 1 là:
$\mathbb{P}(B_1^{\text{ord}}) = \mathbb{P}(V = V_H)\mathbb{P}(B_1^{\text{ord}} \mid V = V_H) + \mathbb{P}(V = V_L)\mathbb{P}(B_1^{\text{ord}} \mid V = V_L) = \theta_0 \left(\alpha + \frac{1-\alpha}{2}\right) + (1-\theta_0)\left(0 + \frac{1-\alpha}{2}\right) = \frac{1 - \alpha}{2} + \alpha \theta_0$.
Áp dụng định lý Bayes cho $\theta_1^+ = \mathbb{P}(V = V_H \mid B_1^{\text{ord}}) = \frac{\theta_0(\frac{1+\alpha}{2})}{\frac{1-\alpha}{2} + \alpha \theta_0} = \frac{\theta_0(1+\alpha)}{1 - \alpha + 2\alpha \theta_0}$. Tương tự, $\mathbb{P}(S_1^{\text{ord}}) = 1 - \mathbb{P}(B_1^{\text{ord}}) = \frac{1+\alpha}{2} - \alpha \theta_0$ và $\mathbb{P}(S_1^{\text{ord}} \mid V = V_H) = \frac{1-\alpha}{2}$, cho ta $\theta_1^- = \frac{\theta_0(1-\alpha)}{1 + \alpha - 2\alpha \theta_0}$.

Vì $A_1 = V_L + \theta_1^+ (V_H - V_L)$ và $B_1 = V_L + \theta_1^- (V_H - V_L)$, ta có $s_1 = (\theta_1^+ - \theta_1^-)(V_H - V_L)$. Quy đồng mẫu số chung $(1 + 2\alpha\theta_0 - \alpha)(1 - 2\alpha\theta_0 + \alpha) = 1 - \alpha^2(1 - 2\theta_0)^2$, tử số của $\theta_1^+ - \theta_1^-$ rút gọn thành $\theta_0(1+\alpha)(1+\alpha-2\alpha\theta_0) - \theta_0(1-\alpha)(1-\alpha+2\alpha\theta_0) = 4\alpha\theta_0(1-\theta_0)$, hoàn tất biểu thức $s_1$. Khi $\theta_0 = \frac{1}{2}$, mẫu số bằng $1$ và $4\theta_0(1-\theta_0) = 1$, cho ngay kết quả thanh lịch $s_1 = \alpha(V_H - V_L)$!

Hơn nữa, gọi $\mathcal{H}_t$ là lịch sử chuỗi lệnh công khai đến thời điểm $t$ và $P_t \in \{A_t, B_t\}$ là giá giao dịch thực hiện tại bước $t$, ta luôn có $P_t = \mathbb{E}[V \mid \mathcal{H}_t]$. Áp dụng tính chất tháp của kỳ vọng có điều kiện với $\mathcal{H}_{t-1} \subset \mathcal{H}_t$:
$\mathbb{E}[P_t \mid \mathcal{H}_{t-1}] = \mathbb{E}\big[\mathbb{E}[V \mid \mathcal{H}_t] \,\big|\, \mathcal{H}_{t-1}\big] = \mathbb{E}[V \mid \mathcal{H}_{t-1}] = P_{t-1}$.
Như vậy, khác hẳn mô hình Roll, trong Glosten-Milgrom **lịch sử giao dịch dần tiết lộ thông tin nội gián vào giá công khai**, biến dãy giá khớp thành một quá trình Martingale không có nảy giá âm (nhà tạo lập dời cả cặp $(B_{t+1}, A_{t+1})$ dịch lên ngay sau một lệnh mua!). Về mặt kinh tế, nhà tạo lập luôn chịu lỗ trước nhóm nội gián $\alpha$ và thu lại đúng khoản lỗ đó từ độ rộng chênh lệch do nhóm giao dịch nhiễu $1 - \alpha$ chi trả. $\blacksquare$

---

## 4. Mô hình Đấu giá Chiến lược của Kyle (1985) & Hệ số $\lambda$

Trong thực tế, một quỹ đầu cơ nắm thông tin độc quyền không bị giới hạn chỉ đặt đúng $1$ cổ phiếu như Glosten-Milgrom; họ phải quyết định **khối lượng đặt lệnh tối ưu** $x$: đặt quá ít thì bỏ phí lợi thế thông tin, đặt quá lớn thì làm lộ bài và đẩy giá khớp tăng vọt chống lại chính mình! Albert S. Kyle (1985) giải quyết bài toán này bằng lý thuyết trò chơi cân bằng Nash dưới phân phối chuẩn.

### 4.1. Cấu trúc Đấu giá Lô Đơn Kỳ & Chứng minh Nghiệm Cân bằng Tuyến tính

Xét phiên đấu giá một kỳ gồm ba tác nhân:
1. Giá trị thanh lý của tài sản $v \sim \mathcal{N}(p_0, \Sigma_0)$.
2. Nhóm giao dịch nhiễu gửi tổng khối lượng ròng ngẫu nhiên $u \sim \mathcal{N}(0, \sigma_u^2)$, độc lập thống kê với $v$.
3. Một người giao dịch nội gián duy nhất biết chính xác giá trị thực $v$ (nhưng không biết $u$), chọn khối lượng đặt lệnh $x = X(v)$ nhằm cực đại hóa lợi nhuận kỳ vọng $\mathbb{E}\big[(v - P(x + u)) x \mid v\big]$.
4. Nhà tạo lập thị trường không thể phân biệt lệnh nội gián với lệnh nhiễu; họ chỉ quan sát được **tổng luồng lệnh ròng gộp** $y = x + u$ và ấn định quy tắc giá hiệu quả bán mạnh $P(y) = \mathbb{E}[v \mid y]$.

**Định lý 1.3 (Cân bằng Nash Tuyến tính Duy nhất của Kyle).** *Tồn tại duy nhất một cân bằng tuyến tính trong đó chiến lược đặt lệnh của người nội gián là $X(v) = \beta_K (v - p_0)$ và quy tắc định giá của nhà tạo lập là $P(y) = p_0 + \lambda y$, với các tham số cân bằng được xác định bởi:*

$$
\beta_K = \sqrt{\frac{\sigma_u^2}{\Sigma_0}}, \qquad \lambda = \frac{1}{2}\sqrt{\frac{\Sigma_0}{\sigma_u^2}}, \qquad \operatorname{Var}(v \mid y) = \frac{1}{2}\Sigma_0
$$

**Chứng minh Từng Bước (Câu hỏi Phỏng vấn Kinh điển tại Citadel / Jane Street):**

- **Bước 1 — Phản ứng tối ưu của Người nội gián khi biết quy tắc giá $P(y) = \mu_K + \lambda y$:**
  Với $v$ đã biết và $\mathbb{E}[u \mid v] = 0$, hàm mục tiêu lợi nhuận kỳ vọng của người nội gián theo biến quyết định $x \in \mathbb{R}$ là một tam thức bậc hai theo $x$:

$$
\mathbb{E}[\pi(x) \mid v] = \mathbb{E}\big[ \big(v - \mu_K - \lambda(x + u)\big) x \,\big|\, v \big] = (v - \mu_K) x - \lambda x^2
$$

  Lấy đạo hàm bậc nhất theo $x$ cho bằng $0$: $(v - \mu_K) - 2\lambda x = 0 \implies x^\star(v) = \frac{v - \mu_K}{2\lambda}$. Điều kiện bậc hai để $x^\star$ là điểm cực đại toàn cục đòi hỏi chặt chẽ $\frac{\partial^2}{\partial x^2}\mathbb{E}[\pi \mid v] = -2\lambda < 0 \iff \lambda > 0$. Đồng nhất $x^\star(v) = \alpha_K + \beta_K(v - p_0)$ ta thu được hệ thức thứ nhất:

$$
\alpha_K = \frac{p_0 - \mu_K}{2\lambda}, \qquad \beta_K = \frac{1}{2\lambda}
$$

- **Bước 2 — Định giá hiệu quả Bayes của Nhà tạo lập khi biết chiến lược $X(v) = \alpha_K + \beta_K(v - p_0)$:**
  Vì $v$ và $u$ độc lập cùng có phân phối chuẩn, cặp biến $(v, y)$ với $y = \alpha_K + \beta_K(v - p_0) + u$ tuân theo phân phối chuẩn đồng thời hai chiều có $\mathbb{E}[v] = p_0$, $\mathbb{E}[y] = \alpha_K$, $\operatorname{Cov}(v, y) = \beta_K \Sigma_0$ và $\operatorname{Var}(y) = \beta_K^2 \Sigma_0 + \sigma_u^2$. Áp dụng công thức kỳ vọng có điều kiện chuẩn (hồi quy tuyến tính chính xác):

$$
P(y) = \mathbb{E}[v \mid y] = \mathbb{E}[v] + \frac{\operatorname{Cov}(v, y)}{\operatorname{Var}(y)}\big(y - \mathbb{E}[y]\big) = p_0 + \frac{\beta_K \Sigma_0}{\beta_K^2 \Sigma_0 + \sigma_u^2}(y - \alpha_K)
$$

  Đồng nhất với dạng $P(y) = \mu_K + \lambda y$ cho ta $\lambda = \frac{\beta_K \Sigma_0}{\beta_K^2 \Sigma_0 + \sigma_u^2}$ và $\mu_K = p_0 - \lambda \alpha_K$.

- **Bước 3 — Giải hệ phương trình điểm bất động:**
  Thay $\alpha_K = \frac{p_0 - \mu_K}{2\lambda}$ vào $\mu_K = p_0 - \lambda \alpha_K$ suy ra $\mu_K = p_0 - \frac{1}{2}(p_0 - \mu_K) \implies \mu_K = p_0$ và $\alpha_K = 0$. Tiếp tục thế $\lambda = \frac{1}{2\beta_K}$ (từ Bước 1) vào phương trình $\lambda$ của Bước 2:

$$
\frac{1}{2\beta_K} = \frac{\beta_K \Sigma_0}{\beta_K^2 \Sigma_0 + \sigma_u^2} \iff \beta_K^2 \Sigma_0 + \sigma_u^2 = 2 \beta_K^2 \Sigma_0 \iff \beta_K^2 \Sigma_0 = \sigma_u^2
$$

  Do điều kiện bậc hai $\lambda > 0 \implies \beta_K > 0$, ta lấy nghiệm dương duy nhất $\beta_K = \sqrt{\sigma_u^2 / \Sigma_0}$, dẫn tới $\lambda = \frac{1}{2\beta_K} = \frac{1}{2}\sqrt{\Sigma_0 / \sigma_u^2}$. Cuối cùng, phương sai hậu nghiệm của giá trị cơ bản sau phiên đấu giá là:
  $\operatorname{Var}(v \mid y) = \Sigma_0 - \frac{\operatorname{Cov}(v, y)^2}{\operatorname{Var}(y)} = \Sigma_0 - \frac{\beta_K^2 \Sigma_0^2}{2 \sigma_u^2} = \Sigma_0 - \frac{(\sigma_u^2 / \Sigma_0)\Sigma_0^2}{2\sigma_u^2} = \frac{1}{2}\Sigma_0$. $\blacksquare$

Ba kết luận kinh tế sâu sắc từ nghiệm của Kyle:
1. **Hệ số Bất thanh khoản $\lambda$ (Kyle's Lambda)** đo độ dốc tác động giá $\Delta P = \lambda y$ trên mỗi đơn vị luồng lệnh ròng: $\lambda$ tỉ lệ thuận với mức độ bất định thông tin $\sqrt{\Sigma_0}$ và tỉ lệ nghịch với bề dày thanh khoản nhiễu $\sigma_u$. Độ sâu thị trường $\frac{1}{\lambda} = 2\frac{\sigma_u}{\sqrt{\Sigma_0}}$ càng lớn khi càng có nhiều dòng tiền cá nhân/quỹ thụ động giao dịch không vì tin nội gián!
2. **Ngụy trang Tín hiệu Hoàn hảo**: Cường độ đặt lệnh của quỹ định lượng $\beta_K (v - p_0)$ có phương sai $\beta_K^2 \Sigma_0 = \sigma_u^2$ — **bằng chính xác phương sai của nhiễu thị trường**! Nhờ tự kìm hãm quy mô lệnh tỷ lệ với $\sigma_u$, dù thanh khoản nhiễu có dày gấp $100$ lần thì phương sai thông tin rò rỉ ra giá $\operatorname{Var}(v \mid y) = \frac{1}{2}\Sigma_0$ vẫn luôn giữ cố định ở mức tiết lộ đúng một nửa thông tin riêng!
3. **Lợi nhuận Kỳ vọng Trước Phiên**: $\mathbb{E}[\pi^\star] = \mathbb{E}\left[\frac{(v - p_0)^2}{4\lambda}\right] = \frac{\Sigma_0}{4\lambda} = \frac{1}{2}\sqrt{\Sigma_0 \sigma_u^2}$ — người có thông tin kiếm lời tỉ lệ thuận với $\sigma_u$, chứng minh tại sao các quỹ định lượng luôn ưu tiên triển khai tín hiệu trên những thị trường dồi dào dòng tiền bán lẻ không thông tin!

---

## 5. Mất cân bằng Luồng lệnh Sổ lệnh Cấp 1 — Cont, Kukanov & Stoikov (2014)

Trong mô hình Kyle cổ điển, $y$ chỉ đếm các lệnh thị trường đã khớp. Trên sổ lệnh điện tử hiện đại, giá trung tâm $m_t$ có thể nhảy vọt ngay cả khi **chưa có cổ phiếu nào được khớp** (ví dụ hàng loạt lệnh bán giới hạn đột ngột hủy đồng loạt ở mức $a_t$ trong khi các lệnh mua mới đắp dày lên $b_t$). Rama Cont, Arseniy Kukanov và Sasha Stoikov (2014) tổng quát hóa luồng lệnh sang toàn bộ chuỗi sự kiện sổ lệnh Cấp độ 1.

Xét trạng thái đỉnh sổ tại sự kiện thứ $n$ là $(b_n, q_n^b, a_n, q_n^a)$. Mỗi sự kiện cập nhật từ $n-1$ sang $n$ đóng góp một lượng áp lực cầu ròng $e_n$ được định nghĩa chặt chẽ qua các biến chỉ báo dịch chuyển biên giá:

$$
e_n = \mathbb{I}_{\{b_n \ge b_{n-1}\}} q_n^b - \mathbb{I}_{\{b_n \le b_{n-1}\}} q_{n-1}^b - \mathbb{I}_{\{a_n \le a_{n-1}\}} q_n^a + \mathbb{I}_{\{a_n \ge a_{n-1}\}} q_{n-1}^a
$$

Hãy kiểm tra bốn kịch bản của nửa phía mua $\Delta W_n^b = \mathbb{I}_{\{b_n \ge b_{n-1}\}} q_n^b - \mathbb{I}_{\{b_n \le b_{n-1}\}} q_{n-1}^b$:
- Nếu giá chào mua giữ nguyên ($b_n = b_{n-1}$): cả hai chỉ báo đều bằng $1$, suy ra $\Delta W_n^b = q_n^b - q_{n-1}^b$ (thêm lệnh mua làm tăng cầu dương, hủy lệnh mua hoặc bị lệnh bán thị trường khớp làm giảm cầu âm).
- Nếu xuất hiện lệnh mua nâng bước giá mới cao hơn ($b_n > b_{n-1}$): chỉ báo đầu bằng $1$, chỉ báo sau bằng $0$, đóng góp trọn vẹn $+q_n^b$ tại đỉnh mới.
- Nếu mức chào mua cũ bị quét sạch hoặc hủy sạch tụt xuống giá thấp hơn ($b_n < b_{n-1}$): đóng góp $-q_{n-1}^b$ phản ánh đúng lượng cầu vừa bốc hơi.

Cộng gộp $e_n$ trong mỗi cửa sổ thời gian ngắn $[t_{k-1}, t_k]$ (ví dụ $1$ giây hoặc $10$ giây) tạo thành biến **Mất cân bằng Luồng lệnh** $\text{OFI}_k = \sum_{n \in (t_{k-1}, t_k]} e_n$. Cont, Kukanov và Stoikov chứng minh cả bằng mô hình hàng đợi giải tích lẫn thực nghiệm trên 50 cổ phiếu S&P 500 rằng biến động giá trung tâm $\Delta m_k = m_{t_k} - m_{t_{k-1}}$ tuân theo quy luật tuyến tính đồng thời với hệ số giải thích $R^2 \approx 65\%\text{–}75\%$ (vượt xa biến chênh lệch khối lượng khớp thuần túy):

$$
\Delta m_k = \beta_k \, \text{OFI}_k + \varepsilon_k, \qquad \beta_k = \frac{c_{\text{tick}}}{2 \, D_k}
$$

trong đó hệ số tác động giá $\beta_k$ đóng vai trò phiên bản tần số cao của $\lambda$ trong mô hình Kyle và **tỷ lệ nghịch trực tiếp với độ sâu hàng đợi trung bình** $D_k$ trên đỉnh sổ lệnh!

---

## 6. Ví dụ Giải toán Thực chiến & Thực hành Trình Mô phỏng `sim-lob`

**Bài toán Tổng hợp — Phỏng vấn Vòng Kỹ thuật Vi cấu trúc:**
1. **Phần A — Tự hiệp phương sai Roll:** Chuỗi thay đổi giá khớp từng tích tắc $\Delta P_t$ của một cổ phiếu có phương sai mẫu $\widehat{\operatorname{Var}}(\Delta P_t) = 0.0009\text{ USD}^2$ và tự hiệp phương sai bậc nhất $\widehat{\operatorname{Cov}}(\Delta P_t, \Delta P_{t-1}) = -0.0001\text{ USD}^2$. Tính độ rộng chênh lệch hiệu dụng $s_{\text{Roll}}$ và tỷ trọng phương sai thay đổi giá thực sự đến từ thông tin mới $\sigma_u^2 / \operatorname{Var}(\Delta P_t)$.
2. **Phần B — Bất cân xứng thông tin tuần tự:** Một cổ phiếu có giá trị thực $V \in \{\$48, \$52\}$ với xác suất tiên nghiệm đều $\theta_0 = 0.5$ và tỷ lệ giao dịch nội gián $\alpha = 0.25$. Nhà tạo lập công bố $(B_1, A_1)$ bằng bao nhiêu? Nếu hai lệnh thị trường đầu tiên liên tiếp đều là lệnh **Mua**, hãy tính giá chào bán mới $A_3$ trước bước thứ ba!

**Lời giải Chi tiết:**
1. Từ công thức Roll, $c = \sqrt{0.0001} = \$0.01 \implies s_{\text{Roll}} = 2c = \$0.02$ (đúng 2 xu). Phương sai thông tin cơ bản là $\hat{\sigma}_u^2 = \widehat{\operatorname{Var}}(\Delta P_t) - 2c^2 = 0.0009 - 2(0.0001) = 0.0007\text{ USD}^2$. Như vậy $0.0007 / 0.0009 \approx 77.8\%$ phương sai đến từ dịch chuyển giá trị thực, còn $22.2\%$ chỉ là nhiễu nảy giá mua - bán!
2. Tại bước 1 ($\theta_0 = 0.5, \alpha = 0.25, V_H - V_L = \$4$):
   - $\theta_1^+ = \frac{0.5(1 + 0.25)}{1} = 0.625 \implies A_1 = 48 + 0.625 \times 4 = \$50.50$.
   - $\theta_1^- = 0.375 \implies B_1 = 48 + 0.375 \times 4 = \$49.50$ (kiểm tra nhanh: $s_1 = 50.50 - 49.50 = \$1.00 = 0.25 \times \$4$, khớp công thức!).
   - Để cập nhật nhanh sau hai lệnh Mua liên tiếp mà không phải viết lại mẫu số dài dòng, hãy dùng **Tỷ lệ cược Bayes** (Odds Ratio): tại mỗi lệnh Mua, tỷ số khả năng $\frac{\mathbb{P}(\text{Buy} \mid V_H)}{\mathbb{P}(\text{Buy} \mid V_L)} = \frac{(1 + \alpha)/2}{(1 - \alpha)/2} = \frac{1.25}{0.75} = \frac{5}{3}$.
   - Do đó sau 2 lệnh Mua, tỷ lệ cược hậu nghiệm trước bước 3 là $O_2 = O_0 \times \left(\frac{5}{3}\right)^2 = 1 \times \frac{25}{9}$, suy ra $\theta_2 = \frac{25}{25 + 9} = \frac{25}{34}$.
   - Để tìm $A_3 = \mathbb{E}[V \mid \text{Buy}_1, \text{Buy}_2, \text{Buy}_3]$, nếu bước 3 lại là một lệnh Mua nữa thì $O_3^+ = \frac{25}{9} \times \frac{5}{3} = \frac{125}{27} \implies \theta_3^+ = \frac{125}{125 + 27} = \frac{125}{152} \approx 0.8224$. Vậy giá chào bán mới vọt lên $A_3 = 48 + \frac{125}{152} \times 4 = \$51.2895$, đồng thời độ rộng chênh lệch bắt đầu **thu hẹp dần** về $0$ khi thị trường dần khám phá ra chân tướng $V = \$52$!

> [!IMPORTANT]
> **Thực hành Trực tiếp trên Trình Mô phỏng Tương tác `sim-lob` Ngay Bên Dưới:**
> Bài giảng này được gắn trực tiếp với phòng thí nghiệm **Sổ lệnh Giới hạn & Hệ số $\lambda$ của Kyle** hiển thị ngay phía dưới trang đọc. Bạn hãy thử nghiệm ba thao tác kiểm chứng lý thuyết:
> 1. Tăng thanh trượt tỷ lệ giao dịch có thông tin $\alpha$ (hoặc phương sai bất định $\Sigma_0$) để quan sát độ rộng chênh lệch chào giá và hệ số tác động giá $\lambda$ mở rộng tuyến tính theo đúng Định lý 1.2 và 1.3.
> 2. Giảm độ sâu thanh khoản nhiễu $\sigma_u$ ở các mức giá đỉnh sổ rồi bắn thử một lệnh thị trường lớn để thấy giá vi mô $p_t^{\text{micro}}$ và chuỗi `OFI` dịch chuyển đường giá trung tâm mạnh gấp nhiều lần so với sổ lệnh dày.
> 3. Quan sát độ tương quan giữa tích lũy $\text{OFI}_k$ và $\Delta m_k$ qua các bước mô phỏng để xây dựng trực giác trực quan trước khi bước vào Đồ án `CAP-03`.

---

## 7. Các Bẫy Thực nghiệm Khi Ước lượng Mô hình Vi cấu trúc

> [!WARNING]
> **Bẫy Hiệp phương sai Mẫu Dương trong Công thức Roll ($\widehat{\operatorname{Cov}}(\Delta P_t, \Delta P_{t-1}) > 0$):** Khi áp dụng trực tiếp công thức $2\sqrt{-\hat{\gamma}_1}$ lên dữ liệu thanh phút hoặc trên thị trường có các thuật toán chia nhỏ lệnh lớn (Algo Execution như `TWAP`/`VWAP`) tạo chuỗi lệnh mua liên tiếp cùng chiều ($\mathbb{E}[q_t q_{t-1}] > 0$), thành phần xu hướng luồng lệnh dương có thể lấn át lực nảy âm $-c^2$, biến biểu thức dưới dấu căn thành **số âm**! Trong thực hành, bạn phải ước lượng trên dữ liệu từng giao dịch trong giai đoạn cân bằng, sử dụng biến thể Bayes Gibbs của Hasbrouck hoặc chuyển sang đo độ rộng chênh lệch hiệu dụng trực tiếp nhờ thuật toán phân loại chiều lệnh của Lee-Ready ($2 q_t (P_t - m_t)$).

- **Bẫy Nhầm lẫn Tác động Giá Đồng thời với Tín hiệu Dự báo Tương lai** (Predictive Alpha): Phương trình $\Delta m_k = \beta_k \text{OFI}_k + \varepsilon_k$ đạt $R^2 \approx 65\%$ khi cả hai vế đo trên **cùng một khoảng thời gian** $[t_{k-1}, t_k]$. Khi dùng $\text{OFI}_k$ của kỳ hiện tại để dự báo lợi nhuận kỳ kế tiếp $\Delta m_{k+1}$, hệ số $R^2$ sụt giảm ngay xuống mức $0.1\%\text{–}1.0\%$ (nhưng vẫn đủ tạo ra tín hiệu giao dịch giá trị cao ở chân trời ngắn hạn nếu kết hợp đa mức độ sâu sổ lệnh và kiểm soát chặt chi phí thực thi).
