# M5.04 — Kết hợp Phi tuyến Có kiểm soát, Trực giao hóa Gram-Schmidt/Đối xứng & Phân rã PnL Chuẩn Quỹ

## 1. Trực giác & Động lực: Nghịch lý Học máy Trong Môi trường Tỷ số Tín hiệu Trên Nhiễu $10^{-3}$

Một kỹ sư học máy xuất sắc bước ra từ lĩnh vực thị giác máy tính hoặc xếp hạng quảng cáo thường mang theo niềm tin rằng: *"Chỉ cần gom $500$ đặc trưng giá, khối lượng và báo cáo tài chính đưa vào mạng nơ-ron sâu hoặc rừng cây tăng cường độ dốc 12 tầng là mô hình sẽ tự động khám phá ra cỗ máy in tiền!"* Thực tế tại mọi quỹ định lượng hàng đầu diễn ra ngược lại hoàn toàn: những mô hình phức tạp không kiểm soát có tỷ số Sharpe trong mẫu lên tới $6.0$ thường xuyên sụp đổ về $-0.8$ ngay tuần đầu tiên giao dịch tiền thật, trong khi một mô hình hồi quy tuyến tính điều chuẩn Ridge giản dị lại kiếm lời bền bỉ suốt nhiều năm!

Sự khác biệt nằm ở **Thiên lệch Quy nạp** (Inductive Bias) đặt trong chế độ **Tỷ số Tín hiệu trên Nhiễu Cực thấp** ($\text{SNR} = \frac{R^2}{1 - R^2} \approx 0.001 \implies R^2 \approx 0.1\%$ cho lợi nhuận cổ phiếu ngày):

1. **Điểm mù ngoại suy và bẫy ghi nhớ ngoại lai của Cây Quyết định (`GBDT` — XGBoost / LightGBM):**
   - Một cây quyết định phân hoạch không gian đặc trưng $\mathbb{R}^p$ thành các hình hộp chữ nhật rời rạc và gán hằng số trung bình mẫu cho từng lá. Do là hàm bậc thang hằng số từng khúc, **cây quyết định hoàn toàn mất khả năng ngoại suy tuyến tính** (Zero Extrapolation): nếu trong lịch sử biến động thị trường chỉ dao động từ $10\%$ đến $45\%$, khi nổ ra khủng hoảng làm biến động vọt lên $80\%$, mọi quan sát mới đều rơi chung vào chiếc lá ngoài cùng của mốc $45\%$ và nhận dự báo bị kẹp trần cứng nhắc!
   - Nguy hiểm hơn, trên dữ liệu lợi nhuận đuôi dày có những cú nhảy $\pm 30\%$ do tin sáp nhập ngẫu nhiên, một cây sâu (`max_depth` $\ge 8$) sẽ dễ dàng chẻ nhỏ các ngưỡng đặc trưng để cô lập vài phiên ngoại lai đó vào một chiếc lá riêng biệt, biến nhiễu lịch sử thành tín hiệu giả tạo có độ tự tin cực đoan.
2. **Cách các tổ nghiên cứu hiện đại khai thác phi tuyến có kỷ luật:**
   - **Ép cấu trúc nông & lá khổng lồ:** Chỉ dùng cây cực nông (`max_depth` $\in \{2, 3\}$ — tối đa tương tác bậc hai hoặc bậc ba giữa các đặc trưng!), ép mỗi lá phải chứa tối thiểu hàng ngàn điểm dữ liệu cổ phiếu - ngày (`min_child_samples` $\ge 2{,}000$), kết hợp tốc độ học siêu nhỏ $\eta_{\text{lr}} \le 0.01$ và lấy mẫu con cột đặc trưng.
   - **Kiến trúc Cộng tính Lai ghép (Residual Hybrid Stacking):** Khớp trước mô hình tuyến tính điều chuẩn Ridge $\hat{y}_{\text{lin}} = X \hat{\beta}_{\text{Ridge}}$ để nắm bắt trọn vẹn xu hướng đơn điệu toàn cục và khả năng ngoại suy, sau đó chỉ cho cây nông học phần tương tác phi tuyến còn sót lại trên phần dư $e = y - \hat{y}_{\text{lin}}$ với hệ số co rút mạnh: $\hat{y}_{\text{total}} = X\hat{\beta}_{\text{Ridge}} + \lambda_{\text{nl}} f_{\text{tree}}(X)$.
   - **Gán nhãn Siêu Mức cược** (Meta-Labeling — Marcos López de Prado, 2018) & **Đức tính Của Độ Phức tạp Có Điều chuẩn** (Bryan Kelly, Semyon Malamud & Kangying Zhou, 2024): tách rời mô hình kinh tế tuyến tính minh bạch quyết định **chiều giao dịch** ($\operatorname{sign} \in \{-1, +1\}$) khỏi mô hình học máy ước lượng **xác suất thành công có hiệu chuẩn** để quyết định quy mô đặt cược $w_i \in [0, w_{\max}]$, hoặc mở rộng đặc trưng phi tuyến ngẫu nhiên nhưng bắt buộc đi kèm phạt chuẩn $\ell_2$ cực lớn!

---

## 2. Trực giao hóa Tín hiệu: Gram-Schmidt Tuần tự so với Đối xứng Löwdin / Klein-Chow

Tại các quỹ đa tín hiệu như WorldQuant, Two Sigma hay Point72 Cubist, kho tín hiệu chung đã chứa sẵn hàng trăm biểu thức cùng bộ nhân tố rủi ro chuẩn (Thị trường, Ngành, Quy mô, Giá trị, Động lượng, Biến động thấp). Khi bạn đề xuất một tín hiệu mới hoặc cần kết hợp $M$ tín hiệu tương quan chéo với nhau trên mặt cắt $N$ cổ phiếu ($N \gg M$), bài toán trung tâm là **Trực giao hóa** (Orthogonalization).

Giả sử $M$ cột tín hiệu trong ma trận $S = [s_1, s_2, \dots, s_M] \in \mathbb{R}^{N \times M}$ đã được khử trung bình chéo và chuẩn hóa độ dài sao cho $\frac{1}{N} s_m^\top s_m = 1$ với mọi $m$, tức ma trận tương quan chéo thực nghiệm giữa các tín hiệu là:

$$
C_S \triangleq \frac{1}{N} S^\top S \in \mathbb{R}^{M \times M}, \qquad C_S \succ 0, \qquad (C_S)_{mm} = 1
$$

Ta cần biến đổi tuyến tính $S \mapsto \tilde{S} = S W \in \mathbb{R}^{N \times M}$ sao cho các cột mới hoàn toàn không tương quan chéo và có phương sai đơn vị: $\frac{1}{N} \tilde{S}^\top \tilde{S} = W^\top C_S W = I_M$. Có vô số ma trận $W$ thỏa mãn phương trình này (tương ứng với mọi phép quay trực giao trong $\mathbb{R}^M$)! Vậy phép biến đổi nào phù hợp cho bài toán nào?

### 2.1. Trực giao hóa Tuần tự Gram-Schmidt (Khi Có Thứ tự Ưu tiên Cấp bậc)

Nếu bạn cần khử **nhân tố rủi ro đã biết** $F \in \mathbb{R}^{N \times K}$ ra khỏi tín hiệu mới $s_{\text{new}}$, hoặc kiểm tra xem tín hiệu thứ $M$ mang lại bao nhiêu thông tin ròng **ngoài những gì $M - 1$ tín hiệu cũ đã biết**, thứ tự ưu tiên là bất đối xứng hoàn toàn. Khi đó ta dùng phép chiếu phần dư bình phương tối thiểu (tương đương phân rã `QR` / Cholesky tam giác trên $W_{\text{GS}}$):

$$
s_{\text{new}}^{\perp} = \Big(I_N - F\big(F^\top F\big)^{-1} F^\top\Big) s_{\text{new}}
$$

**Nhược điểm chí mạng nếu áp cho $M$ tín hiệu Alpha ngang hàng:** Gram-Schmidt phụ thuộc thô bạo vào thứ tự liệt kê! Tín hiệu đặt ở cột $1$ được giữ nguyên $100\%$ ($\tilde{s}_1 = s_1$), trong khi các tín hiệu xếp ở cuối hàng bị cắt xén qua $M - 1$ phép chiếu liên tiếp, méo mó xa rời ý nghĩa kinh tế ban đầu và nhận trọng số sai lệch!

### 2.2. Chứng minh Trực giao hóa Đối xứng Tối ưu Löwdin (1950) / Klein-Chow (2013)

Khi $M$ tín hiệu alpha hoặc $M$ nhân tố có vị thế bình đẳng như nhau, Per-Olov Löwdin (trong cơ học lượng tử năm 1950) và sau này là phương pháp của Klein & Chow (2013, trong phân rã rủi ro danh mục) đặt bài toán hình học tối ưu tự nhiên nhất: tìm $\tilde{S} \in \mathbb{R}^{N \times M}$ trực giao chuẩn tắc ($\frac{1}{N}\tilde{S}^\top \tilde{S} = I_M$) sao cho **tổng sai lệch bình phương chuẩn Frobenius so với các tín hiệu gốc là nhỏ nhất có thể**:

$$
\min_{\tilde{S} \in \mathbb{R}^{N \times M}} \; \frac{1}{N}\big\|\tilde{S} - S\big\|_F^2 \qquad \text{thỏa mãn} \qquad \frac{1}{N}\tilde{S}^\top \tilde{S} = I_M
$$

**Định lý 5.8 (Định lý Trực giao hóa Đối xứng Căn bậc Hai Nghịch đảo).** *Với $S \in \mathbb{R}^{N \times M}$ có hạng cột đầy đủ $M$ ($C_S = \frac{1}{N}S^\top S \succ 0$), bài toán cực tiểu hóa biến dạng Frobenius có nghiệm tối ưu toàn cục duy nhất là:*

$$
\tilde{S}^\star = S \, C_S^{-1/2}, \qquad \text{trong đó } C_S^{-1/2} = V \Lambda_S^{-1/2} V^\top
$$

*với $C_S = V \Lambda_S V^\top$ là phân rã phổ trực giao của $C_S$. Hơn nữa, nghiệm này bất biến với mọi phép hoán vị thứ tự các tín hiệu, và hệ số tương quan giữ lại giữa từng tín hiệu gốc $s_m$ với phiên bản trực giao $\tilde{s}_m^\star$ bằng chính phần tử đường chéo thứ $m$ của ma trận căn bậc hai dương $C_S^{1/2}$: $\operatorname{Corr}(s_m, \tilde{s}_m^\star) = (C_S^{1/2})_{mm}$.*

**Chứng minh Trọn vẹn Bằng Phân rã Giá trị Kỳ dị (`SVD`):**
1. Khai triển hàm mục tiêu qua vết ma trận, sử dụng $\frac{1}{N}\tilde{S}^\top \tilde{S} = I_M$ và $\operatorname{tr}(C_S) = \sum_{m=1}^M (C_S)_{mm} = M$:

$$
\frac{1}{N}\big\|\tilde{S} - S\big\|_F^2 = \frac{1}{N}\operatorname{tr}(\tilde{S}^\top \tilde{S}) + \frac{1}{N}\operatorname{tr}(S^\top S) - \frac{2}{N}\operatorname{tr}(\tilde{S}^\top S) = 2M - \frac{2}{N}\operatorname{tr}(\tilde{S}^\top S)
$$

   Do đó, cực tiểu hóa biến dạng tương đương hoàn toàn với **cực đại hóa tổng tương quan đường chéo** $\frac{1}{N}\operatorname{tr}(\tilde{S}^\top S) = \sum_{m=1}^M \operatorname{Corr}(\tilde{s}_m, s_m)$!
2. Đặt $A \triangleq \frac{1}{\sqrt{N}} S \in \mathbb{R}^{N \times M}$ và $Q \triangleq \frac{1}{\sqrt{N}}\tilde{S} \in \mathbb{R}^{N \times M}$ (ràng buộc viết gọn thành $Q^\top Q = I_M$). Viết phân rã giá trị kỳ dị thu gọn của $A = U \Sigma_A V^\top$, trong đó $U \in \mathbb{R}^{N \times M}$ có cột trực chuẩn ($U^\top U = I_M$), $\Sigma_A = \operatorname{diag}(\sigma_1, \dots, \sigma_M) \succ 0$ (vì $\operatorname{rank}(S) = M \implies \sigma_m > 0$), và $V \in \mathbb{R}^{M \times M}$ là ma trận trực giao vuông ($V^\top V = V V^\top = I_M$).
   Khi đó $C_S = A^\top A = V \Sigma_A^2 V^\top$, suy ra $\Lambda_S = \Sigma_A^2$, $C_S^{1/2} = V \Sigma_A V^\top$ và $C_S^{-1/2} = V \Sigma_A^{-1} V^\top$.
3. Biến đổi đại lượng cần cực đại hóa nhờ tính hoán vị vòng quanh của vết:

$$
\frac{1}{N}\operatorname{tr}(\tilde{S}^\top S) = \operatorname{tr}(Q^\top A) = \operatorname{tr}(Q^\top U \Sigma_A V^\top) = \operatorname{tr}\big((V^\top Q^\top U) \Sigma_A\big) = \sum_{m=1}^M Z_{mm} \sigma_m
$$

   với $Z \triangleq V^\top Q^\top U \in \mathbb{R}^{M \times M}$. Với mọi vector đơn vị $e_m$, theo bất đẳng thức Cauchy-Schwarz và tính bảo toàn chuẩn của các cột trực chuẩn $Q, U, V$:
   $$|Z_{mm}| = \big|(Q V e_m)^\top (U e_m)\big| \le \|Q V e_m\|_2 \, \|U e_m\|_2 = 1 \times 1 = 1$$
   Vì mọi $\sigma_m > 0$, tổng $\sum_{m=1}^M Z_{mm} \sigma_m \le \sum_{m=1}^M \sigma_m = \operatorname{tr}(C_S^{1/2})$, và dấu bằng đạt được **duy nhất** khi $Z_{mm} = 1$ ($\forall m$) $\iff Z = I_M \iff U^\top Q V = I_M$. Do $Q^\top Q = I_M$ và $\|P_U Q\|_F^2 = \operatorname{tr}(Q^\top U U^\top Q) \le \operatorname{tr}(Q^\top Q) = M$, điều kiện $U^\top Q = V^\top$ buộc toàn bộ không gian cột của $Q$ nằm khít trong không gian cột của $U$, dẫn tới nghiệm duy nhất:
   $$Q^\star = U V^\top = (U \Sigma_A V^\top)(V \Sigma_A^{-1} V^\top) = A \, C_S^{-1/2} \iff \tilde{S}^\star = S \, C_S^{-1/2}$$
4. Cuối cùng, ma trận hiệp phương sai chéo giữa gốc và mới là $\frac{1}{N} S^\top \tilde{S}^\star = \frac{1}{N} S^\top S C_S^{-1/2} = C_S C_S^{-1/2} = C_S^{1/2}$, nên phần tử thứ $m$ trên đường chéo chính là $\operatorname{Corr}(s_m, \tilde{s}_m^\star) = (C_S^{1/2})_{mm}$! $\blacksquare$

### 2.3. Kết hợp Đa Tín hiệu Tối ưu & Luật Cộng hưởng `IR`

Khi kết hợp $M$ tín hiệu chuẩn hóa có vector kỹ năng kỳ vọng $\mu_{\text{IC}} = (\text{IC}_1, \dots, \text{IC}_M)^\top$ và ma trận tương quan tín hiệu $C_S$, tín hiệu tổng hợp $s_{\text{comb}} = S v$ đạt Tỷ số Thông tin tối đa tại trọng số $v^\star \propto C_S^{-1} \mu_{\text{IC}}$, nâng bình phương kỹ năng tổng hợp lên $\text{IC}_{\text{comb}}^2 = \mu_{\text{IC}}^\top C_S^{-1} \mu_{\text{IC}}$!
- Nếu $M$ tín hiệu **trực giao hoàn toàn** ($C_S = I_M$): $\text{IR}_{\text{comb}} = \sqrt{\sum_{m=1}^M \text{IR}_m^2}$ (ghép $4$ tín hiệu độc lập có $\text{IR} = 1.0$ tạo ra siêu tín hiệu có $\text{IR} = \sqrt{4} = \mathbf{2.0}$!).
- Nếu $2$ tín hiệu có cùng cường độ $\text{IR}_0$ và tương quan $\rho \in (-1, 1)$ ($v^\star = (\frac{1}{2}, \frac{1}{2})^\top$):

$$
\text{IR}_{\text{comb}} = \frac{\frac{1}{2}\text{IR}_0 + \frac{1}{2}\text{IR}_0}{\sqrt{\frac{1}{4}(1) + \frac{1}{4}(1) + 2\left(\frac{1}{4}\right)\rho}} = \text{IR}_0 \sqrt{\frac{2}{1 + \rho}}
$$

---

## 3. Phân rã Lãi lỗ Chuẩn Tổ chức: Bóc Trần Alpha Thật và Beta Ẩn

Một nhà quản lý danh mục tại quỹ đa chiến lược không bao giờ được đánh giá chỉ bằng con số tổng lãi cuối tháng; bộ phận quản trị rủi ro chạy hệ thống **Phân rã Lãi lỗ** (Profit and Loss Attribution — viết tắt là `PnL Attribution`) mỗi tối sau khi đóng cửa thị trường theo hai lăng kính chuẩn xác:

### 3.1. Phân rã Tuyến tính Nhân tố - Đặc thù - Chi phí Thực thi

Xét mô hình nhân tố rủi ro cấu trúc tại kỳ $t$: lợi nhuận thực hiện kỳ tới của $N$ cổ phiếu là $r_{t+1} = B_t f_{t+1} + \varepsilon_{t+1}$, trong đó vector lợi nhuận nhân tố thực hiện $f_{t+1} \in \mathbb{R}^K$ được ước lượng từ mặt cắt ngang ngày $t+1$ bằng bình phương tối thiểu gia quyền nghịch đảo phương sai đặc thù $W_t = D_t^{-1}$:

$$
f_{t+1} = \big(B_t^\top D_t^{-1} B_t\big)^{-1} B_t^\top D_t^{-1} r_{t+1}, \qquad \varepsilon_{t+1} = r_{t+1} - B_t f_{t+1}
$$

Nhân trái với vector trọng số danh mục đầu kỳ $w_t^\top$ và trừ đi chi phí thực tế phát sinh trên sổ cái, lợi nhuận ròng thực hiện $R_{P, t+1}^{\text{net}}$ tách thành **đẳng thức kế toán khớp khít 100% từng xu**:

$$
R_{P, t+1}^{\text{net}} = \underbrace{\sum_{k=1}^K \big(B_{t,\cdot k}^\top w_t\big) f_{k, t+1}}_{\text{PnL Phơi nhiễm Nhân tố (Factor Timing / Tilt)}} + \underbrace{w_t^\top \varepsilon_{t+1}}_{\text{PnL Alpha Đặc thù (Idiosyncratic Alpha)}} - \underbrace{\text{Cost}_{\text{exec}, t+1}}_{\text{Trượt giá & Phí Sàn}} - \underbrace{\text{Cost}_{\text{financing}, t+1}}_{\text{Phí Vay Bán khống & Lãi Ký quỹ}}
$$

Hơn thế nữa, ma trận chiếu $W_{\text{mimic}} \triangleq D_t^{-1} B_t \big(B_t^\top D_t^{-1} B_t\big)^{-1} \in \mathbb{R}^{N \times K}$ trong công thức ước lượng $f_{t+1} = W_{\text{mimic}}^\top r_{t+1}$ không chỉ là một thủ thuật đại số, mà chính là tập hợp **$K$ Danh mục Mô phỏng Nhân tố Thuần túy** (Pure Factor-Mimicking Portfolios)! Hãy kiểm chứng trực tiếp hai tính chất vật lý của cột thứ $k$ là $w_{\text{mimic}, k}$:
1. **Phơi nhiễm đơn vị với nhân tố $k$ và bằng $0$ với mọi nhân tố khác:**
   $$B_t^\top W_{\text{mimic}} = B_t^\top D_t^{-1} B_t \big(B_t^\top D_t^{-1} B_t\big)^{-1} = I_K$$
2. **Rủi ro đặc thù tối thiểu toàn cục:** Giữa vô số danh mục có cùng phơi nhiễm $B_t^\top w = e_k$, cột $w_{\text{mimic}, k}$ chính là nghiệm bài toán quy hoạch bậc hai cực tiểu hóa phương sai phần dư $\min_w \frac{1}{2} w^\top D_t w$! Nhờ đó, phần lợi nhuận nhân tố $f_{k, t+1}$ đo lường chính xác lợi nhuận của một rổ cổ phiếu thực tế có thể giao dịch được trên sàn.

> [!IMPORTANT]
> **Tiêu chuẩn Vàng Của Các Quỹ Đa Chiến lược (Citadel / Millennium / Point72):**
> Ban giám đốc vốn của quỹ không trả phí hiệu suất $20\%$ cho bạn để bạn lén ôm nhân tố Động lượng hay Beta nhóm cổ phiếu Công nghệ — bởi quỹ có thể tự tái tạo phơi nhiễm nhân tố $B_t^\top w_t$ ở cấp độ trung tâm bằng hợp đồng tương lai hoặc rổ $W_{\text{mimic}}$ với chi phí gần bằng $0$! Một pod cổ phiếu chuẩn mực bắt buộc phải giữ **tỷ trọng phương sai đặc thù $\frac{\operatorname{Var}(w_t^\top \varepsilon_{t+1})}{\operatorname{Var}(w_t^\top r_{t+1})} \ge 75\%$** và chứng minh chuỗi tích lũy `Idiosyncratic Alpha` tăng trưởng đều đặn độc lập với chu kỳ thị trường.

### 3.2. Chứng minh Đẳng thức Phân rã Brinson-Fachler (1985) Theo Ngành

Khi so sánh danh mục chủ động có trọng số ngành $w_{P, g}$ và lợi nhuận nội ngành $R_{P, g}$ ($g = 1, \dots, G$, với $\sum_{g=1}^G w_{P, g} = \sum_{g=1}^G w_{B, g} = 1$) đối với chỉ số chuẩn có trọng số $w_{B, g}$, lợi nhuận ngành chuẩn $R_{B, g}$ và tổng lợi nhuận chuẩn $R_B = \sum_{g=1}^G w_{B, g} R_{B, g}$, phương pháp **Brinson-Fachler** phân rã chính xác lợi nhuận vượt chuẩn $R_P - R_B$ thành ba nguồn gốc kỹ năng:

$$
R_P - R_B = \underbrace{\sum_{g=1}^G (w_{P,g} - w_{B,g})(R_{B,g} - R_B)}_{\text{Hiệu ứng Phân bổ Ngành (Allocation)}} + \underbrace{\sum_{g=1}^G w_{B,g}(R_{P,g} - R_{B,g})}_{\text{Hiệu ứng Chọn Mã Nội ngành (Selection)}} + \underbrace{\sum_{g=1}^G (w_{P,g} - w_{B,g})(R_{P,g} - R_{B,g})}_{\text{Hiệu ứng Tương tác (Interaction)}}
$$

**Chứng minh Đại số Ba Dòng:**
Khai triển tổng của hạng tử thứ hai và hạng tử thứ ba ở vế phải: $w_{B,g}(R_{P,g} - R_{B,g}) + (w_{P,g} - w_{B,g})(R_{P,g} - R_{B,g}) = w_{P,g}(R_{P,g} - R_{B,g}) = w_{P,g} R_{P,g} - w_{P,g} R_{B,g}$.
Cộng thêm hạng tử Phân bổ thứ nhất $(w_{P,g} - w_{B,g})R_{B,g} - (w_{P,g} - w_{B,g})R_B$, các tích chéo $\pm w_{P,g} R_{B,g}$ triệt tiêu sạch sẽ, còn lại:

$$
\sum_{g=1}^G \Big(w_{P,g} R_{P,g} - w_{B,g} R_{B,g} - (w_{P,g} - w_{B,g}) R_B\Big) = R_P - R_B - R_B \underbrace{\sum_{g=1}^G (w_{P,g} - w_{B,g})}_{1 - 1 = 0} = R_P - R_B \quad \blacksquare
$$

Chú ý vẻ đẹp trực giác của hạng tử hiệu chỉnh $-R_B$ trong Brinson-Fachler: nếu bạn tăng tỷ trọng (`Overweight`, $w_{P,g} > w_{B,g}$) vào một ngành tăng điểm $+2\%$, nhưng toàn thị trường chung hôm đó tăng $+5\%$ ($R_{B,g} - R_B = -3\% < 0$), quyết định phân bổ ngành của bạn bị ghi nhận **âm điểm chính xác** thay vì dương giả tạo!

---

## 4. Ví dụ Phỏng vấn Thực chiến: Tính Tay Trực giao Löwdin $2 \times 2$ & Kiểm toán PnL

**Đề bài (Phỏng vấn Vòng Cuối Nghiên cứu Đa Tín hiệu — Two Sigma / Squarepoint):**
1. **Phần A — Trực giao hóa Löwdin so với Gram-Schmidt:** Bạn có $2$ tín hiệu chuẩn hóa $s_1, s_2$ có tương quan chéo $\rho = 0.60$, tức $C_S = \begin{pmatrix} 1 & 0.6 \\ 0.6 & 1 \end{pmatrix}$.
   - Tìm tường minh ma trận căn bậc hai $C_S^{1/2}$ và ma trận trực giao hóa đối xứng $W^\star = C_S^{-1/2}$.
   - So sánh hệ số tương quan giữ lại $\operatorname{Corr}(s_m, \tilde{s}_m)$ của cả hai tín hiệu dưới phương pháp đối xứng Löwdin so với phương pháp Gram-Schmidt đặt $s_1$ lên trước!
   - Nếu cả hai tín hiệu gốc đều có $\text{IR}_1 = \text{IR}_2 = 1.20$, tín hiệu kết hợp tối ưu có $\text{IR}_{\text{comb}}$ bằng bao nhiêu?
2. **Phần B — Kiểm toán PnL:** Một danh mục vốn $\$50\text{ triệu}$ kết thúc tháng lãi gộp $+\$1{,}100{,}000$ ($+2.20\%$). Báo cáo rủi ro cho biết phơi nhiễm trung bình của danh mục với Nhân tố Động lượng là $b_{\text{Mom}} = +0.40$ và với Beta thị trường là $b_{\text{Mkt}} = +0.15$; trong tháng đó thị trường tăng $+4.00\%$ và Nhân tố Động lượng tăng $+3.00\%$. Chi phí trượt giá thực thi hết $\$180{,}000$ và phí vay bán khống hết $\$70{,}000$. Hãy tính chính xác `Idiosyncratic Alpha PnL` và lãi ròng thực tế!

**Lời giải Chi tiết Từng Bước:**
1. **Giải Phần A:**
   - Ma trận đối xứng $2 \times 2$ có $C_S = \begin{pmatrix} 1 & 0.6 \\ 0.6 & 1 \end{pmatrix}$ sở hữu hai trị riêng $\lambda_1 = 1 + 0.6 = 1.6 = \frac{8}{5}$ với vector riêng chuẩn hóa $v_1 = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}$, và $\lambda_2 = 1 - 0.6 = 0.4 = \frac{2}{5}$ với $v_2 = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix}$.
   - Ta có $\sqrt{\lambda_1} = \frac{2\sqrt{10}}{5}$ và $\sqrt{\lambda_2} = \frac{\sqrt{10}}{5}$, cùng nghịch đảo $\lambda_1^{-1/2} = \frac{\sqrt{10}}{4}$ và $\lambda_2^{-1/2} = \frac{\sqrt{10}}{2}$. Ghép lại theo $V \Lambda^{\pm 1/2} V^\top$:
     $$C_S^{1/2} = \frac{1}{2}\begin{pmatrix} \frac{3\sqrt{10}}{5} & \frac{\sqrt{10}}{5} \\[4pt] \frac{\sqrt{10}}{5} & \frac{3\sqrt{10}}{5} \end{pmatrix} = \frac{\sqrt{10}}{10}\begin{pmatrix} 3 & 1 \\ 1 & 3 \end{pmatrix}, \qquad C_S^{-1/2} = \frac{\sqrt{10}}{8}\begin{pmatrix} 3 & -1 \\ -1 & 3 \end{pmatrix}$$
     *(Kiểm tra nhanh bình phương: $\big(C_S^{-1/2}\big)^2 = \frac{10}{64}\begin{pmatrix} 10 & -6 \\ -6 & 10 \end{pmatrix} = \frac{1}{0.64}\begin{pmatrix} 1 & -0.6 \\ -0.6 & 1 \end{pmatrix} = C_S^{-1}$, chính xác tuyệt đối!).*
   - Dưới trực giao hóa Löwdin, **cả hai tín hiệu đều giữ tương quan cao như nhau** với bản gốc: $\operatorname{Corr}(s_1, \tilde{s}_1^\star) = \operatorname{Corr}(s_2, \tilde{s}_2^\star) = \frac{3\sqrt{10}}{10} \approx \mathbf{0.9487}$ (trung bình đạt **$94.87\%$**!). Ngược lại, dưới Gram-Schmidt ($\tilde{s}_1^{\text{GS}} = s_1$, $\tilde{s}_2^{\text{GS}} = \frac{s_2 - 0.6 s_1}{\sqrt{1 - 0.6^2}} = 1.25 s_2 - 0.75 s_1$), tín hiệu $1$ giữ $100\%$ nhưng tín hiệu $2$ chỉ còn tương quan $\sqrt{1 - 0.6^2} = \mathbf{0.8000}$ (trung bình chỉ đạt $90.00\% < 94.87\%$!).
   - Khi kết hợp đều hai tín hiệu có $\text{IR}_0 = 1.20$ và $\rho = 0.60$:
     $$\text{IR}_{\text{comb}} = 1.20 \times \sqrt{\frac{2}{1 + 0.60}} = 1.20 \times \sqrt{1.25} = 1.20 \times \frac{\sqrt{5}}{2} \approx \mathbf{1.3416}$$
2. **Giải Phần B:**
   - Lợi nhuận phần trăm đến từ phơi nhiễm nhân tố:
     $$R_{\text{Factor}} = b_{\text{Mkt}} f_{\text{Mkt}} + b_{\text{Mom}} f_{\text{Mom}} = 0.15(4.00\%) + 0.40(3.00\%) = 0.60\% + 1.20\% = \mathbf{+1.80\%}$$
     tương đương $+\$900{,}000$ trên quy mô vốn $\$50\text{ triệu}$!
   - Suy ra lợi nhuận đặc thù gộp thực chất chỉ là: $R_{\text{Idio}} = 2.20\% - 1.80\% = \mathbf{+0.40\%}$, tức $+\$200{,}000$ (chỉ chiếm $18.2\%$ lãi gộp — phần lớn lãi gộp đến từ đu bám thị trường và động lượng!).
   - Sau khi trừ chi phí thực thi và vay hàng $(\$180{,}000 + \$70{,}000 = \$250{,}000 = 0.50\%$), phần **Alpha đặc thù ròng sau phí thực chất bị âm $-\$50{,}000$ ($-0.10\%$)**, mặc dù tổng tài khoản vẫn báo lãi ròng $+\$850{,}000$ ($+1.70\%$)! Một hội đồng thẩm định tại Millennium sẽ bác bỏ ngay lập tức luận điểm "chiến lược có alpha tốt" nếu nhìn thấy bảng kiểm toán này!

---

## 5. Các Bẫy Thực nghiệm Sống Còn Khi Kết hợp Tín hiệu & Quản trị Đa Nhân tố

> [!WARNING]
> **Ba Cạm bẫy Hệ thống Ở Tầng Cuối Cùng Của Quy trình Nghiên cứu Định lượng:**
> 1. **Thảm họa Đám đông Thanh lý Đồng loạt (`Crowding & Quant Quake` — Tháng 8/2007):** Hai tín hiệu Giá trị và Động lượng có thể có tương quan lịch sử $\rho \approx -0.30$ trên dữ liệu cơ bản, nhưng khi hàng chục quỹ định lượng lớn cùng nắm giữ những danh mục tối ưu hóa giống hệt nhau và một quỹ lớn bị buộc phải bán tháo khẩn cấp để rút vốn, giá của mọi cổ phiếu đang được các mô hình định lượng mua nhiều đồng loạt sập sàn còn nhóm bị bán khống đồng loạt tăng trần! Trong 4 ngày từ 06/08 đến 09/08/2007, tương quan thực tế giữa các tín hiệu vốn dĩ độc lập vọt lên $+0.85$, gây lỗ $15\sigma$ cho hàng loạt quỹ lớn! Luôn phải bổ sung **Nhân tố Mức độ Đông đúc** (ví dụ tỷ lệ cổ phiếu đang bị bán khống trên thanh khoản — `Short Interest Ratio`) vào ma trận kiểm soát rủi ro.
> 2. **Rò rỉ Tương lai Khi Ước lượng Ma trận Trực giao $C_S^{-1/2}$ và Trọng số Kết hợp Trên Toàn Mẫu:** Mọi phép tính trung bình, độ lệch chuẩn, ma trận tương quan tín hiệu $C_{S, t}$ và trọng số kết hợp $v_t^\star$ bắt buộc phải ước lượng bằng cửa sổ trượt hoặc cửa sổ mở rộng **chỉ dùng dữ liệu nghiêm ngặt trước thời điểm $t$** (`Out-of-Sample Rolling Orthogonalization`), kèm làm co hiệp phương sai $C_{S, t}$ để tránh nhảy dấu ma trận căn bậc hai khi hai tín hiệu gần đồng tuyến!
> 3. **Lệch Pha Thời điểm Định giá Trong Báo cáo Phân rã PnL:** Nếu mô hình rủi ro tính lợi nhuận nhân tố từ giá đóng cửa $16\text{:}00$ ngày $t-1$ sang $16\text{:}00$ ngày $t$, trong khi danh mục của bạn khớp lệnh thực tế lúc $10\text{:}30$ sáng ngày $t$, toàn bộ biến động nhân tố trong $60$ phút đầu phiên sẽ bị hạch toán nhầm sang phần dư đặc thù hoặc chi phí thực thi nếu không tách riêng hai sổ cái: **PnL Giữ qua Đêm** (Holding PnL) và **PnL Giao dịch Trong Ngày** (Trading PnL).
