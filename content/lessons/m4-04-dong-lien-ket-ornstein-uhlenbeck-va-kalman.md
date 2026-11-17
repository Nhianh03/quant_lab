# M4.04 — Đồng liên kết, Quá trình Hồi quy Trung bình Ornstein-Uhlenbeck & Bộ lọc Kalman Tuyến tính

## 1. Trực giác & Động lực: Tương quan Khác Đồng liên kết Như Thế Nào?

Trong buổi phỏng vấn kinh điển của bàn Kinh doanh Chênh lệch Thống kê tại D. E. Shaw, Citadel hay Balyasny, người phỏng vấn thường mở đầu bằng câu hỏi: *"Hai tài sản có hệ số tương quan lợi nhuận hàng ngày bằng $+0.95$ có phải là một cặp giao dịch hội tụ an toàn không?"* Nếu ứng viên gật đầu đồng ý, cuộc phỏng vấn gần như khép lại!

Hãy chứng minh ngay phản ví dụ phản trực giác này bằng hai quá trình giá logarit rời rạc $p_{1,t}$ và $p_{2,t}$ chia sẻ chung cú sốc chuẩn $u_t \stackrel{\text{iid}}{\sim} \mathcal{N}(0, 1)$ nhưng có thêm hai nhiễu bước đi ngẫu nhiên độc lập nhỏ $e_{1,t}, e_{2,t} \stackrel{\text{iid}}{\sim} \mathcal{N}(0, 0.05)$ và chênh lệch hệ số trôi nhỏ:
- Lợi nhuận từng ngày $\Delta p_{1,t} = 0.001 + u_t + e_{1,t}$ và $\Delta p_{2,t} = u_t + e_{2,t}$ có hệ số tương quan cực cao $\operatorname{Corr}(\Delta p_{1,t}, \Delta p_{2,t}) = \frac{1}{1 + 0.05} \approx \mathbf{0.952}$!
- Thế nhưng hiệu số giá chênh lệch $S_t = p_{1,t} - p_{2,t} = 0.001 t + \sum_{s=1}^t (e_{1,s} - e_{2,s})$ lại là một **bước đi ngẫu nhiên có trôi** với $\mathbb{E}[S_t] = 0.001 t \to +\infty$ và $\operatorname{Var}(S_t) = 0.10 t \to +\infty$: khoảng cách giữa hai mã có thể trôi dạt ra vô cực và **không bao giờ quay đầu trở lại**!

Hình ảnh ẩn dụ nổi tiếng nhất của Michael Murray (1994) gói gọn trọn vẹn sự khác biệt bản chất này:
- **Tương quan lợi nhuận** giống như hai người say rượu bước ra khỏi quán bar không quen biết nhau nhưng cùng đi xuôi theo chiều gió thổi trong từng giây ngắn hạn — sau một giờ đồng hồ, khoảng cách giữa họ trôi xa hàng cây số không có gì kéo lại.
- **Đồng liên kết** (Cointegration) giống như **người say rượu và chú chó nhỏ buộc chung một sợi dây xích đàn hồi**: đường đi của từng cá thể riêng lẻ đều là bước đi ngẫu nhiên không dừng $I(1)$, nhưng độ căng của sợi dây xích buộc khoảng cách giữa họ luôn bị kéo giật về quanh độ dài tự nhiên dừng $I(0)$!

Bài giảng khép lại Học kỳ 2 này trang bị cho bạn bộ ba công cụ toán học hoàn chỉnh của Đồ án `CAP-02`: kiểm định đồng liên kết Engle-Granger/Johansen, nghiệm giải tích chính xác của phương trình vi phân ngẫu nhiên Ornstein-Uhlenbeck, và hệ phương trình không gian trạng thái của **Bộ lọc Kalman** cập nhật tỷ số phòng vệ động theo từng nhịp thở thị trường.

---

## 2. Hồi quy Giả tạo, Đồng liên kết Engle-Granger & Mô hình Johansen VECM

### 2.1. Hồi quy Giả tạo (Spurious Regression) so với Cặp Đồng liên kết $CI(1, 1)$

Năm 1974, Clive Granger và Paul Newbold (sau đó được Peter Phillips chứng minh giải tích năm 1986) phát hiện hiện tượng chấn động kinh tế lượng: nếu bạn lấy hai bước đi ngẫu nhiên hoàn toàn độc lập $Y_t = \sum_{s=1}^t u_s \sim I(1)$ và $X_t = \sum_{s=1}^t v_s \sim I(1)$ đem chạy hồi quy `OLS` $Y_t = \hat{\alpha} + \hat{\beta} X_t + \hat{z}_t$, hệ số $\hat{\beta}$ không hề hội tụ về $0$ mà hội tụ tới một biến ngẫu nhiên phi suy biến (tích phân hàm chuyển động Brown), hệ số $R^2$ khác $0$ lớn, còn thống kê $|t_{\hat{\beta}}| = \mathcal{O}_p(\sqrt{T}) \xrightarrow{T \to \infty} +\infty$ bác bỏ giả thuyết vô hiệu với tần suất tiến tới $100\%$! Lý do là phần dư $\hat{z}_t$ vẫn là một quá trình không dừng $I(1)$ có phương sai tăng tuyến tính theo $T$.

**Định nghĩa 4.2 — Đồng liên kết Bậc $(1, 1)$ & Định lý Biểu diễn:** *Cho vector gồm $N$ chuỗi giá không dừng tích hợp bậc một $P_t = (P_{1,t}, \dots, P_{N,t})^\top \sim I(1)$, tức bản thân $P_{i,t}$ không dừng nhưng sai phân bậc nhất $\Delta P_{i,t}$ dừng yếu $I(0)$. Ta nói $P_t$ **đồng liên kết** nếu tồn tại vector trọng số danh mục khác không $\beta \in \mathbb{R}^N \setminus \{0\}$ sao cho tổ hợp tuyến tính $Z_t = \beta^\top P_t - \mu$ trở thành một quá trình **dừng yếu $I(0)$**!*

Theo Định lý Biểu diễn của Robert Engle và Clive Granger năm 1987 — công trình đạt Giải Nobel Kinh tế năm 2003 — một hệ vector $P_t \sim I(1)$ đồng liên kết với hạng $r \in \{1, \dots, N - 1\}$ **khi và chỉ khi** nó tuân theo **Mô hình Hiệu chỉnh Sai số Vector** (Vector Error Correction Model — `VECM`):

$$
\Delta P_t = c + \underbrace{\alpha \beta^\top}_{\Pi \text{ hạng } r} P_{t-1} + \sum_{i=1}^{k-1} \Gamma_i \Delta P_{t-i} + \varepsilon_t
$$

trong đó $\beta^\top P_{t-1} \in \mathbb{R}^r$ đo độ lệch khỏi trạng thái cân bằng dài hạn tại kỳ trước, còn ma trận tải $\alpha \in \mathbb{R}^{N \times r}$ đo tốc độ kéo giật từng tài sản quay về xóa bỏ độ lệch đó!

### 2.2. Đối chiếu Kiểm định Hai Bước Engle-Granger và Kiểm định Hạng Johansen

| Tiêu chí kỹ thuật | Kiểm định Hai Bước Engle-Granger ($N = 2$) | Kiểm định Hợp lý Cực đại Johansen ($N \ge 2$) |
| :--- | :--- | :--- |
| **Quy trình ước lượng** | Bước 1: Chạy `OLS` $Y_t = \hat{\alpha} + \hat{\beta} X_t + \hat{z}_t$. Bước 2: Kiểm định nghiệm đơn vị lên chuỗi phần dư $\hat{z}_t$. | Ước lượng đồng thời ma trận hạng thu gọn $\Pi = \alpha \beta^\top$ trong `VECM` bằng phân tích tương quan chính tắc (bài toán trị riêng suy rộng $\hat{\lambda}_1 \ge \dots \ge \hat{\lambda}_N$). |
| **Tính đối xứng vai trò biến** | **Không đối xứng ở mẫu hữu hạn:** hồi quy $Y$ theo $X$ cho $\hat{\beta}_{Y|X} \neq 1 / \hat{\beta}_{X|Y}$ (chỉ trùng nhau khi $R^2 = 1$; khắc phục một phần bằng Hồi quy Trực giao Toàn phần `TLS`). | **Hoàn toàn đối xứng:** đối xử bình đẳng tuyệt đối với mọi tài sản trong rổ mà không cần chọn biến phụ thuộc tùy tiện! |
| **Giá trị tới hạn thống kê** | Vì `OLS` đã chủ động chọn $\hat{\beta}$ làm cực tiểu hóa phương sai mẫu của $\hat{z}_t$ (khiến $\hat{z}_t$ trông "có vẻ dừng giả tạo" hơn chuỗi thực!), phải tra **bảng MacKinnon khắt khe hơn** ($\approx -3.34$ ở mức $5\%$, thay vì $-2.86$ của Dickey-Fuller thường!). | Cung cấp hai kiểm định tuần tự tìm số vector đồng liên kết $r$: **Thống kê Vết** $\text{LR}_{\text{trace}}(r_0) = -T\sum_{i=r_0+1}^N \ln(1 - \hat{\lambda}_i)$ và **Thống kê Trị riêng Cực đại** $\text{LR}_{\max}(r_0) = -T\ln(1 - \hat{\lambda}_{r_0+1})$. |
| **Ứng dụng giao dịch** | Nhanh, trực quan cho giao dịch cặp 2 cổ phiếu cùng ngành (`KO` - `PEP`, `V` - `MA`). | Dựng danh mục chênh lệch giá giỏ $3\text{–}6$ tài sản hoặc các quỹ hoán đổi danh mục chỉ số có trọng số vector riêng tối ưu $\hat{\beta}^{(1)}$! |

---

## 3. Quá trình Ornstein-Uhlenbeck, Công thức Itô & Chu kỳ Bán rã

Trong thời gian liên tục, mô hình toán học chuẩn mực cho chuỗi chênh lệch giá dừng (hoặc phần dư tích lũy sau khi khử nhân tố `PCA` từ Bài `M4.01`) là **Quá trình Ornstein-Uhlenbeck** (Ornstein-Uhlenbeck Process — `OU`), thỏa mãn phương trình vi phân ngẫu nhiên tuyến tính với tốc độ kéo về trung bình $\theta > 0$, tâm cân bằng $\mu \in \mathbb{R}$, độ khuếch tán $\sigma > 0$ và chuyển động Brown chuẩn $W_t$:

$$
dX_t = \theta (\mu - X_t)\,dt + \sigma\,dW_t
$$

**Định lý 4.6 — Nghiệm Giải tích Chính xác & Phân phối Chuyển tiếp:** *Với mọi bước thời gian rời rạc $\Delta t > 0$, nghiệm chính xác của phương trình `OU` liên kết $X_{t + \Delta t}$ với $X_t$ là:*

$$
X_{t + \Delta t} = \mu + (X_t - \mu)e^{-\theta \Delta t} + \sigma \int_t^{t + \Delta t} e^{-\theta(t + \Delta t - s)}\,dW_s
$$

*Suy ra phân phối có điều kiện $X_{t + \Delta t} \mid X_t$ là phân phối chuẩn Gauss với kỳ vọng, phương sai và chu kỳ bán rã:*

$$
\mathbb{E}\big[X_{t+\Delta t} \mid X_t\big] = \mu + (X_t - \mu)e^{-\theta \Delta t}, \qquad \operatorname{Var}\big(X_{t+\Delta t} \mid X_t\big) = \frac{\sigma^2}{2\theta}\left(1 - e^{-2\theta \Delta t}\right), \qquad \tau_{1/2} = \frac{\ln 2}{\theta}
$$

**Chứng minh Từng Bước bằng Bổ đề Itô và Đẳng cự Itô (Câu hỏi Phỏng vấn Tần suất Số 1):**
1. *Nhân tử tích phân:* Đặt quá trình biến đổi $Y_s = f(s, X_s) = e^{\theta s}(X_s - \mu)$. Tính các đạo hàm riêng: $\frac{\partial f}{\partial s} = \theta e^{\theta s}(X_s - \mu)$, $\frac{\partial f}{\partial x} = e^{\theta s}$, và đặc biệt đạo hàm bậc hai theo $x$ bằng không $\frac{\partial^2 f}{\partial x^2} = 0$!
2. *Áp dụng Công thức Itô:* Vì $\frac{\partial^2 f}{\partial x^2} = 0$, số hạng bậc hai $(dX_s)^2$ biến mất hoàn toàn:
   $$dY_s = \theta e^{\theta s}(X_s - \mu)\,ds + e^{\theta s}\big[\theta(\mu - X_s)\,ds + \sigma\,dW_s\big] = \sigma e^{\theta s}\,dW_s$$
   Lấy tích phân từ $t$ đến $t + \Delta t$: $e^{\theta(t+\Delta t)}(X_{t+\Delta t} - \mu) - e^{\theta t}(X_t - \mu) = \sigma \int_t^{t+\Delta t} e^{\theta s}\,dW_s$. Nhân hai vế với $e^{-\theta(t+\Delta t)}$ cho ngay nghiệm tường minh ở trên!
3. *Tính mô-men bằng tích phân Wiener và Đẳng cự Itô:* Vì hàm dưới dấu tích phân $g(s) = \sigma e^{-\theta(t+\Delta t - s)}$ là tất định, tích phân ngẫu nhiên có phân phối chuẩn kỳ vọng $0$, và phương sai tính bằng **Đẳng cự Itô** $\operatorname{Var}\!\left(\int_t^{t+\Delta t} g(s)\,dW_s\right) = \int_t^{t+\Delta t} g(s)^2\,ds$:
   $$\operatorname{Var}\big(X_{t+\Delta t} \mid X_t\big) = \sigma^2 \int_t^{t+\Delta t} e^{-2\theta(t+\Delta t - s)}\,ds = \sigma^2 \left[ \frac{e^{-2\theta(t+\Delta t - s)}}{2\theta} \right]_{s=t}^{s=t+\Delta t} = \frac{\sigma^2}{2\theta}\left(1 - e^{-2\theta \Delta t}\right)$$
   Khi $\Delta t \to +\infty$, phân phối hội tụ về phân phối dừng cân bằng $\mathcal{N}\!\left(\mu, \, \sigma_{\text{eq}}^2\right)$ với **$\sigma_{\text{eq}}^2 = \frac{\sigma^2}{2\theta}$**. Cuối cùng, **Chu kỳ Bán rã** $\tau_{1/2}$ là khoảng thời gian cần thiết để độ lệch kỳ vọng thu hẹp còn đúng một nửa ban đầu: $e^{-\theta \tau_{1/2}} = \frac{1}{2} \iff \tau_{1/2} = \frac{\ln 2}{\theta}$! $\blacksquare$

### 3.1. Phép Ánh xạ Khớp Chính xác Từ AR(1) Rời rạc & Điểm Chuẩn s-score

Khi lấy mẫu đều đặn theo bước thời gian $\Delta t$ (ví dụ $\Delta t = \frac{1}{252}$ năm cho dữ liệu ngày, hoặc chọn đơn vị ngày $\Delta t = 1$), nghiệm `OU` viết lại thành hồi quy tuyến tính rời rạc bậc nhất $X_{t + \Delta t} = a + b X_t + \eta_t$ với:

$$
b = e^{-\theta \Delta t} \in (0, 1), \qquad a = \mu(1 - b), \qquad \sigma_\eta^2 = \operatorname{Var}(\eta_t) = \frac{\sigma^2}{2\theta}(1 - b^2)
$$

Đảo ngược hệ phương trình này từ ước lượng $(\hat{a}, \hat{b}, \hat{\sigma}_\eta)$ của hồi quy rời rạc (yêu cầu kiểm tra $0 < \hat{b} < 1$) cho phép hiệu chuẩn tham số liên tục chính xác mà không mắc sai số xấp xỉ Euler:

$$
\hat{\theta} = -\frac{\ln \hat{b}}{\Delta t}, \qquad \hat{\mu} = \frac{\hat{a}}{1 - \hat{b}}, \qquad \hat{\sigma}_{\text{eq}} = \frac{\hat{\sigma}_\eta}{\sqrt{1 - \hat{b}^2}}, \qquad \text{s-score}_t \triangleq \frac{X_t - \hat{\mu}}{\hat{\sigma}_{\text{eq}}}
$$

Quy tắc giao dịch chuẩn của Avellaneda & Lee (2010): chỉ giữ lại các cổ phiếu/cặp có tốc độ hồi quy đủ nhanh ($\tau_{1/2} \in [2, \, 30]$ ngày giao dịch để vượt chi phí vốn và tránh rủi ro gãy cấu trúc), mở vị thế bán chênh lệch khi $\text{s-score}_t > +1.25$ (hoặc $+2.0$), mua chênh lệch khi $\text{s-score}_t < -1.25$, và đóng chốt lời khi $|\text{s-score}_t| < 0.50$.

---

## 4. Không gian Trạng thái Tuyến tính & Chứng minh Bộ lọc Kalman Động

### 4.1. Tại sao Hồi quy Cửa sổ Trượt Thất bại Trước Tỷ số Phòng vệ Biến thiên?

Trên thị trường thực tế, hệ số chặn $\alpha_t$ và tỷ số phòng vệ $\beta_t$ giữa hai tài sản $y_t = \alpha_t + \beta_t x_t + v_t$ không bao giờ đứng yên mãi mãi (do thay đổi cấu trúc nợ vay, phát hành thêm cổ phiếu hay dịch chuyển biên lợi nhuận). Nếu bạn dùng hồi quy `OLS` trên cửa sổ trượt cố định $W$ ngày, bạn rơi vào thế tiến thoái lưỡng nan: chọn $W$ nhỏ ($30$ ngày) thì ước lượng $\hat{\beta}_t$ giật cục nhiễu cao làm tốn phí đảo vị thế; chọn $W$ lớn ($250$ ngày) thì mọi ngày cách đây 11 tháng được gán trọng số ngang bằng ngày hôm qua, khiến mô hình phản ứng quá chậm khi tỷ số phòng vệ đã dịch chuyển!

**Bộ lọc Kalman** (Kalman Filter) do Rudolf Kalman công bố năm 1960 giải quyết trọn vẹn bài toán này bằng cách mô hình hóa vector trạng thái ẩn $\theta_t \in \mathbb{R}^d$ — ví dụ $\theta_t = [\alpha_t, \, \beta_t]^\top \in \mathbb{R}^2$ — tiến hóa mượt qua thời gian và cập nhật trực tuyến đệ quy $\mathcal{O}(1)$ dữ liệu mỗi khi có quan sát mới $y_t \in \mathbb{R}^m$:
- **Phương trình chuyển trạng thái:** $\theta_t = F_t \theta_{t-1} + w_t$, với nhiễu quá trình $w_t \sim \mathcal{N}(0, Q_t)$ ($Q_t \succeq 0$). Đối với cặp giao dịch động, đặt $F_t = I_2$ là bước đi ngẫu nhiên trạng thái chậm với $Q_t = \delta_{\text{state}} I_2$ rất nhỏ cỡ $10^{-5}\text{–}10^{-4}$.
- **Phương trình quan sát:** $y_t = H_t \theta_t + v_t$, với nhiễu đo lường $v_t \sim \mathcal{N}(0, R_t)$ ($R_t \succ 0$, độc lập với $w_t$). Đối với cặp giao dịch, $y_t \in \mathbb{R}$ là giá tài sản $Y$ ngày $t$, ma trận quan sát biến thiên đã biết là $H_t = [1, \, x_t] \in \mathbb{R}^{1 \times 2}$, và $R_t = \sigma_v^2$.

### 4.2. Chứng minh Đầy đủ 5 Phương trình Dự báo - Cập nhật Kalman

Ký hiệu $\hat{\theta}_{t|s} = \mathbb{E}[\theta_t \mid \mathcal{Y}_s]$ và $P_{t|s} = \operatorname{Cov}(\theta_t \mid \mathcal{Y}_s)$ với lịch sử quan sát $\mathcal{Y}_s = \{y_1, \dots, y_s\}$. Toàn bộ bộ lọc Kalman chỉ dựa trên một bổ đề duy nhất của phân phối chuẩn đa biến đồng thời $\begin{pmatrix} A \\ B \end{pmatrix} \sim \mathcal{N}\!\left(\begin{pmatrix} \mu_A \\ \mu_B \end{pmatrix}, \begin{pmatrix} \Sigma_{AA} & \Sigma_{AB} \\ \Sigma_{BA} & \Sigma_{BB} \end{pmatrix}\right)$: phân phối có điều kiện $A \mid B = b$ là phân phối chuẩn có **kỳ vọng $\mu_{A|B} = \mu_A + \Sigma_{AB}\Sigma_{BB}^{-1}(b - \mu_B)$** và **hiệp phương sai $\Sigma_{A|B} = \Sigma_{AA} - \Sigma_{AB}\Sigma_{BB}^{-1}\Sigma_{BA}$**!

Giả sử tại cuối kỳ $t - 1$, ta đang có hậu nghiệm $\theta_{t-1} \mid \mathcal{Y}_{t-1} \sim \mathcal{N}\big(\hat{\theta}_{t-1|t-1}, \, P_{t-1|t-1}\big)$:

1. **Bước Dự báo Tiên nghiệm (`Predict` trước khi thấy $y_t$):**
   Vì $\theta_t = F_t \theta_{t-1} + w_t$ với $w_t \perp \mathcal{Y}_{t-1}$, lấy kỳ vọng và hiệp phương sai điều kiện theo $\mathcal{Y}_{t-1}$:

$$
\hat{\theta}_{t|t-1} = F_t \hat{\theta}_{t-1|t-1}, \qquad P_{t|t-1} = F_t P_{t-1|t-1} F_t^\top + Q_t
$$

2. **Sai số Đổi mới (`Innovation`) và Phân phối Đồng thời $(\theta_t, y_t) \mid \mathcal{Y}_{t-1}$:**
   Từ $y_t = H_t \theta_t + v_t$ ($v_t \perp \theta_t, \mathcal{Y}_{t-1}$), dự báo cho $y_t$ là $\hat{y}_{t|t-1} = H_t \hat{\theta}_{t|t-1}$. Đặt sai số dự báo đổi mới $e_t \triangleq y_t - H_t \hat{\theta}_{t|t-1}$, hiệp phương sai của nó là $S_t \triangleq \operatorname{Cov}(y_t \mid \mathcal{Y}_{t-1}) = H_t P_{t|t-1} H_t^\top + R_t$, và hiệp phương sai chéo là $\operatorname{Cov}(\theta_t, y_t \mid \mathcal{Y}_{t-1}) = \operatorname{Cov}(\theta_t, H_t \theta_t + v_t \mid \mathcal{Y}_{t-1}) = P_{t|t-1} H_t^\top$!

3. **Bước Cập nhật Hậu nghiệm (`Update` ngay khi quan sát $y_t$) & Độ lợi Kalman $K_t$:**
   Áp dụng trực tiếp bổ đề chiếu chuẩn với $A = \theta_t$, $B = y_t$, $\Sigma_{AB} = P_{t|t-1} H_t^\top$ và $\Sigma_{BB} = S_t$, đặt **Ma trận Độ lợi Kalman** $K_t \triangleq P_{t|t-1} H_t^\top S_t^{-1}$, ta thu được nghiệm đóng tối ưu toàn cục:

$$
K_t = P_{t|t-1} H_t^\top \big(H_t P_{t|t-1} H_t^\top + R_t\big)^{-1}
$$

$$
\hat{\theta}_{t|t} = \hat{\theta}_{t|t-1} + K_t \big(y_t - H_t \hat{\theta}_{t|t-1}\big), \qquad P_{t|t} = \big(I - K_t H_t\big) P_{t|t-1}
$$

*(Mẹo lập trình số học chuyên nghiệp: thay vì trừ thẳng $(I - K_t H_t)P_{t|t-1}$ có thể mất tính đối xứng nửa xác định dương do sai số làm tròn dấu chấm động, hãy cài đặt **dạng ổn định đối xứng Joseph** hoàn toàn tương đương đại số: $P_{t|t} = (I - K_t H_t)P_{t|t-1}(I - K_t H_t)^\top + K_t R_t K_t^\top \succeq 0$!).* $\blacksquare$

> [!IMPORTANT]
> **Trực giác Tuyệt đẹp của Độ lợi Kalman $K_t$ & Tín hiệu Giao dịch Trực tiếp $z_t$:**
> Trong trường hợp vô hướng, $K_t = \frac{P_{t|t-1}}{P_{t|t-1} + R} \in (0, 1)$: nếu nhiễu đo lường thị trường rất lớn ($R \gg P_{t|t-1}$), $K_t \to 0$ — bộ lọc giữ bình tĩnh tin vào trạng thái cũ chứ không bị giật theo nhiễu giá tức thời; ngược lại nếu bất định trạng thái lớn ($P_{t|t-1} \gg R$), $K_t \to 1$ — bộ lọc thích nghi cực nhanh theo mức giá mới! Đặc biệt hơn, đại lượng đổi mới chuẩn hóa **$z_t = \frac{e_t}{\sqrt{S_t}}$** chính là tín hiệu điểm chuẩn động có phương sai đơn vị đã tích hợp trọn vẹn cả sai số giá hiện hành $R_t$ lẫn độ bất định của ước lượng tỷ số phòng vệ $H_t P_{t|t-1} H_t^\top$: mở lệnh khi $|z_t| > 2.0$ tự động đòi hỏi biên an toàn rộng hơn trong những giai đoạn tỷ số phòng vệ $\beta_t$ đang bất định cao!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Khớp OU & Chạy Tay Một Bước Bộ lọc Kalman

**Đề bài (Phỏng vấn Vòng Cuối `StatArb` — Millennium / Balyasny):**
1. **Phần A — Hiệu chuẩn tham số hồi quy trung bình:** Chuỗi chênh lệch giá hàng ngày ($\Delta t = 1$ ngày) của một cặp cổ phiếu được hồi quy $X_{t+1} = a + b X_t + \eta_t$, thu được $\hat{a} = 0.20$, $\hat{b} = 0.90$ và độ lệch chuẩn phần dư $\hat{\sigma}_\eta = \$0.4359$. Tính tâm cân bằng $\hat{\mu}$, tốc độ hồi quy $\hat{\theta}$, chu kỳ bán rã $\tau_{1/2}$ theo đơn vị ngày, độ lệch chuẩn cân bằng $\hat{\sigma}_{\text{eq}}$ và điểm chuẩn $\text{s-score}_t$ nếu hiện tại $X_t = \$3.50$.
2. **Phần B — Cập nhật tỷ số phòng vệ động:** Xét mô hình tỷ số phòng vệ động một chiều không hệ số chặn $y_t = x_t \beta_t + v_t$ ($\beta_t = \beta_{t-1} + w_t$) với phương sai nhiễu trạng thái $Q = 0.01$ và phương sai nhiễu quan sát $R = 1.00$. Cuối ngày hôm qua ta có $\hat{\beta}_{t-1|t-1} = 1.50$ và $P_{t-1|t-1} = 0.03$. Hôm nay quan sát được giá $x_t = 5.0$ và $y_t = 8.5$. Tính lần lượt $P_{t|t-1}, \, e_t, \, S_t$, độ lợi $K_t$, tín hiệu chuẩn hóa $z_t$ và ước lượng mới $\hat{\beta}_{t|t}, \, P_{t|t}$!

**Lời giải Chi tiết Từng Bước:**
1. **Giải Phần A:**
   - Tâm cân bằng: $\hat{\mu} = \frac{0.20}{1 - 0.90} = \mathbf{\$2.00}$.
   - Tốc độ hồi quy ngày: $\hat{\theta} = -\ln(0.90) \approx \mathbf{0.10536\,\text{ngày}^{-1}} \implies \tau_{1/2} = \frac{\ln 2}{0.10536} = \frac{0.69315}{0.10536} \approx \mathbf{6.58\text{ ngày}}$ (chu kỳ rất lý tưởng cho giao dịch trung tần!).
   - Độ lệch chuẩn cân bằng: $\hat{\sigma}_{\text{eq}} = \frac{0.4359}{\sqrt{1 - 0.90^2}} = \frac{0.4359}{\sqrt{0.19}} \approx \frac{0.4359}{0.43589} = \mathbf{\$1.00}$.
   - Tại $X_t = \$3.50$, điểm chuẩn là $\text{s-score}_t = \frac{3.50 - 2.00}{1.00} = \mathbf{+1.50}$ (chênh lệch đang đắt hơn trung bình $1.5$ độ lệch chuẩn $\implies$ bán khống chênh lệch!).
2. **Giải Phần B ($F_t = 1, \, H_t = x_t = 5.0$):**
   - *Dự báo tiên nghiệm:* $\hat{\beta}_{t|t-1} = 1.50$, và $P_{t|t-1} = 0.03 + 0.01 = \mathbf{0.04}$.
   - *Sai số đổi mới & phương sai đổi mới:*
     $$e_t = y_t - x_t \hat{\beta}_{t|t-1} = 8.5 - 5.0(1.50) = \mathbf{+1.00}$$
     $$S_t = x_t^2 P_{t|t-1} + R = 25.0(0.04) + 1.00 = 1.00 + 1.00 = \mathbf{2.00}$$
   - *Tín hiệu giao dịch chuẩn hóa:* $z_t = \frac{e_t}{\sqrt{S_t}} = \frac{1.00}{\sqrt{2.00}} \approx \mathbf{+0.707}$.
   - *Độ lợi Kalman & cập nhật hậu nghiệm:*
     $$K_t = \frac{P_{t|t-1} x_t}{S_t} = \frac{0.04 \times 5.0}{2.00} = \mathbf{0.10}$$
     $$\hat{\beta}_{t|t} = 1.50 + 0.10(1.00) = \mathbf{1.60}, \qquad P_{t|t} = (1 - 0.10 \times 5.0)(0.04) = 0.50 \times 0.04 = \mathbf{0.02}$$
   Quan sát sự hài hòa tuyệt đối: cú lệch $+1.00$ được phân bổ hợp lý một nửa cho việc điều chỉnh nâng tỷ số phòng vệ từ $1.50$ lên $1.60$, đồng thời bất định hậu nghiệm giảm một nửa từ $0.04$ xuống $0.02$!

---

## 6. Những Cạm bẫy Sống Còn Trong Giao dịch Cặp Đồng liên kết Thực tế

> [!WARNING]
> **Ba Cái Bẫy Đốt Cháy Tài khoản Của Các Chiến lược Chênh lệch Giá Cặp:**
> 1. **Đặt Tỷ số Nhiễu Trạng thái $Q / R$ Quá Lớn Khiến Bộ lọc Kalman "Nuốt Chửng" Cơ hội Alpha:** Nếu bạn cài đặt ma trận $Q$ quá lớn so với $R$, mỗi khi cặp cổ phiếu vừa dãn rộng chênh lệch tạo cơ hội kiếm lời thật sự, bộ lọc Kalman sẽ lập tức bẻ cong $\hat{\beta}_{t|t}$ và $\hat{\alpha}_{t|t}$ đuổi sát theo mức giá mới, ép sai số đổi mới $e_t \approx 0$ khiến bạn không bao giờ vào lệnh (hoặc cắt lỗ sai ngay đáy)! Phải ước lượng $(Q, R)$ trên tập huấn luyện bằng **Hợp lý Cực đại Đổi mới** $\ell(Q, R) = -\frac{1}{2}\sum_t \big(\ln|S_t| + e_t^\top S_t^{-1} e_t\big)$ và giữ $Q$ cực nhỏ để $\beta_t$ chỉ biến thiên chậm ở quy mô hàng quý!
> 2. **Gãy Cấu trúc Doanh nghiệp Vĩnh viễn (`Structural Break` — Sáp nhập, Mua lại, Phá sản):** Tháng 10 năm 1998, quỹ đầu cơ huyền thoại `LTCM` sụp đổ một phần lớn vì gồng các cặp giao dịch giá trị tương đối khi thanh khoản rút cạn; ở cấp độ cổ phiếu đơn lẻ, khi Công ty A bất ngờ nhận lời chào mua thâu tóm bằng tiền mặt ở mức chênh $+35\%$, mối đồng liên kết lịch sử với Công ty B **chết vĩnh viễn ngay trong tích tắc**! Bắt buộc phải có bộ ngắt mạch cắt lỗ cứng (ví dụ $|\text{s-score}_t| > 4.0$ hoặc lọc loại bỏ sự kiện mua bán sáp nhập) thay vì mù quáng gấp thếp chờ quay về trung bình!
> 3. **Dùng Giá Chưa Logarit Khi Biên độ Biến thiên Lớn và Quên Chi phí Vay Bán khống (`Short Borrow Fee`):** Đồng liên kết trên mức giá đô-la thô dễ bị méo tỷ lệ khi thị trường tăng gấp ba sau nhiều năm; làm việc trên $\ln P_t$ giúp hệ số $\beta$ mang ý nghĩa tỷ trọng vốn đô-la ổn định hơn. Đồng thời, những mã bị bán khống đông đúc có thể chịu phí vay cổ phiếu lên tới $10\%\text{–}30\%/\text{năm}$, nuốt sạch toàn bộ biên lợi nhuận hồi quy trung bình nếu không trừ trực tiếp vào mô hình kiểm thử!
