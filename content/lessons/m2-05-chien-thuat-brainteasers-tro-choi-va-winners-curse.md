# M2.05 — Chiến thuật Giải Đố Định lượng, Lý thuyết Trò chơi & Lời nguyền Kẻ thắng cuộc

## 1. Trực giác & Động lực: Tư duy Cấu trúc Đằng sau Những Câu Đố Phố Wall

Tại sao Jane Street, Citadel, Optiver, SIG hay WorldQuant lại dành trọn các vòng phỏng vấn trực tiếp để hỏi ứng viên những câu đố xác suất, trò chơi đặt cược và ước lượng thị trường trong giới hạn $3\text{–}6$ phút mỗi câu? Người phỏng vấn không hề kiểm tra xem bạn có thuộc lòng mẹo vặt hay khả năng nhân nhẩm sáu chữ số; họ đang quan sát **kiến trúc tư duy dưới áp lực bất định**: cách bạn thu gọn bài toán lớn về cấu trúc đối xứng tối giản, cách bạn định giá thông tin ẩn từ hành động của đối thủ, và cách bạn tự phòng vệ khi biết mình có thể đang sai!

Bài giảng khép lại Học phần `M2` này hệ thống hóa $5$ vũ khí giải toán cấu trúc sắc bén nhất, tiếp nối bằng lý thuyết cân bằng chiến lược hỗn hợp và khép lại với chứng minh toán học đầy đủ cho hiện tượng **Lời nguyền Kẻ thắng cuộc** (Winner's Curse) — nguyên lý sống còn giải thích vì sao đại đa số chiến lược đặt lệnh giới hạn ngây thơ đều cháy tài khoản dù dự báo đúng trung bình vô điều kiện.

---

## 2. Năm Vũ khí Giải Nhanh Câu Đố Định lượng Vòng Phỏng vấn

| Vũ khí cấu trúc | Dấu hiệu nhận diện đề bài | Ánh xạ toán học cốt lõi | Độ phức tạp lời giải |
| :--- | :--- | :--- | :--- |
| **1. Bất biến & Đơn biến** | Hỏi trạng thái đích có đạt được không hoặc trò chơi có dừng không | $I(T(x)) \equiv I(x) \pmod m$ hoặc $M(T(x)) \le M(x) - 1$ | $\mathcal{O}(1)$ dòng chứng minh |
| **2. Đối xứng & Hoán vị** | Rút bài không hoàn lại, đếm đỉnh kỷ lục, khoảng cách tới quân Át | Chiếu lên hoán vị đều của $(k + 1)$ ngăn tương đương | Tránh hoàn toàn tổng tổ hợp |
| **3. Quy nạp Ngược** | Trò chơi dừng nhiều vòng, chia vàng hải tặc, tung xúc xắc giữ/bỏ | Giải lùi Bellman $v_r = \mathbb{E}[\max(X, v_{r-1})]$ từ vòng cuối | Tuyến tính theo số vòng $K$ |
| **4. Song ánh Tổ hợp** | Đường đi trên lưới không chạm rào cản, kiểm phiếu luôn dẫn điểm | Lật phản xạ đường xấu sang tập đếm không ràng buộc | Đóng gọn thành hiệu hai tổ hợp |
| **5. Tạo lập Fermi** | Yêu cầu chào giá mua – bán khoảng tin cậy $90\%$ cho đại lượng thực | Tổng phương sai sai số trên thang logarit $\sum_i \sigma_{\ln X_i}^2$ | Chuẩn hóa rủi ro sai số mô hình |

### 2.1. Vũ khí 1 — Đại lượng Bất biến & Đơn biến (Invariants & Monovariants)

Khi đề bài mô tả một hệ thống biến đổi trạng thái phức tạp qua hàng ngàn bước ngẫu nhiên hoặc tất định $x_0 \to x_1 \to \dots \to x_t$ và hỏi *"Trạng thái đích $x^\star$ có đạt được không?"* hoặc *"Quá trình có chắc chắn kết thúc sau hữu hạn bước không?"*, tuyệt đối đừng liệt kê cây nhánh! Hãy xây dựng ánh xạ hàm trạng thái $I: \mathcal{S} \to \mathbb{R}$ hoặc $M: \mathcal{S} \to \mathbb{Z}_{\ge 0}$ thỏa mãn:

$$
I\big(T(x)\big) = I(x) \quad \big(\text{hoặc } \equiv I(x) \pmod m\big), \qquad M\big(T(x)\big) \le M(x) - 1
$$

- **Ứng dụng Bất biến:** Nếu $I(x_0) \neq I(x^\star)$, trạng thái đích $x^\star$ có xác suất đạt tới bằng **$0$ tuyệt đối**! Ví dụ kinh điển: một cái bình có $20$ viên bi đỏ và $21$ viên bi xanh; mỗi bước rút ngẫu nhiên $2$ viên — nếu cùng màu thì bỏ vào $1$ viên đỏ, nếu khác màu thì bỏ vào $1$ viên xanh. Hỏi viên cuối cùng còn lại màu gì? Đếm số bi xanh $B_t$: rút $2$ đỏ làm $B_t \mapsto B_t$, rút $2$ xanh làm $B_t \mapsto B_t - 2$, rút $1$ đỏ $1$ xanh làm $B_t \mapsto B_t - 1 + 1 = B_t$. Trong cả ba trường hợp, $B_t \bmod 2$ là bất biến! Vì ban đầu $B_0 = 21$ là số lẻ, khi còn $1$ viên bi duy nhất thì $B_{\text{end}} \in \{0, 1\}$ bắt buộc phải lẻ $\implies B_{\text{end}} = 1$, tức viên cuối cùng **chắc chắn $100\%$ là màu xanh**!
- **Ứng dụng Đơn biến:** Mọi đại lượng nguyên không âm $M(x_t) \ge 0$ giảm ít nhất $1$ đơn vị sau mỗi bước hợp lệ đều ép quá trình dừng sau tối đa $M(x_0)$ bước — nền tảng của các bài toán chia bài, lật đồng xu và hội tụ đồ thị.

### 2.2. Vũ khí 2 — Khai thác Tính Đối xứng & Hoán vị Ngẫu nhiên (Symmetry & Random Permutations)

Nhiều bài toán đếm bước dừng trên bộ bài hoặc dãy giá ngẫu nhiên trông như đòi hỏi tổng tổ hợp khổng lồ, nhưng tan biến ngay lập tức khi chiếu lên hoán vị đều của các phần tử đánh dấu:
1. **Phân hoạch Ngăn Đối xứng:** Giả sử một cỗ bài $N$ lá có $k$ quân đặc biệt — chẳng hạn $N = 52$ lá có $k = 4$ quân Át — được xáo trộn đều. Bốn quân Át chia $N - k = 48$ lá bài thường thành đúng $k + 1 = 5$ ngăn hoàn toàn đối xứng phân phối! Do mọi lá bài thường có xác suất rơi vào từng ngăn bằng nhau $\frac{1}{k+1}$, kỳ vọng độ dài mỗi ngăn và số lá phải lật đến quân Át đầu tiên $\tau_1$ là:

$$
\mathbb{E}[L_1] = \mathbb{E}[L_2] = \dots = \mathbb{E}[L_{k+1}] = \frac{N - k}{k + 1} \implies \mathbb{E}[\tau_1] = \mathbb{E}[L_1] + 1 = \frac{N + 1}{k + 1}
$$

   Thay $N = 52, k = 4$ cho ngay đáp số trong ba giây: $\mathbb{E}[\tau_1] = \frac{53}{5} = 10.6$ lá!
2. **Đếm Đỉnh Kỷ lục Giá:** Cho $X_1, \dots, X_n$ độc lập cùng phân phối liên tục. Xác suất để $X_j$ phá đỉnh cao nhất từ đầu chuỗi đến $j$ chỉ phụ thuộc vào hoán vị thứ tự tương đối của $j$ phần tử đầu tiên: $\mathbb{P}\big(X_j = \max_{1 \le i \le j} X_i\big) = \frac{1}{j}$. Suy ra kỳ vọng số lần phá đỉnh mới trong $n$ phiên bằng đúng số điều hòa $\mathbb{E}[R_n] = \sum_{j=1}^n \frac{1}{j} = H_n \approx \ln n + \gamma_{\text{EM}}$.

### 2.3. Vũ khí 3 — Nguyên lý Cực hạn & Quy nạp Ngược (Backward Induction)

Đối với mọi trò chơi dừng tối ưu nhiều vòng hoặc đàm phán tuần tự hữu hạn bước $t = 1, 2, \dots, K$, luôn giải **lùi từ bước cuối cùng $K$ ngược về bước $1$** thông qua phương trình đệ quy giá trị Bellman. Xét câu hỏi chuẩn mực: *Bạn được tung một con xúc xắc 6 mặt công bằng tối đa $K = 3$ lần; sau mỗi lần tung thấy điểm $X$, bạn có thể dừng lại nhận $\$X$ hoặc bỏ kết quả đó để tung tiếp. Chiến lược tối ưu và giá trị kỳ vọng trò chơi $v_3$ là bao nhiêu?*

Gọi $v_r$ là giá trị kỳ vọng tối ưu khi còn trong tay $r$ lượt tung. Tại lượt cuối cùng ($r = 1$), bắt buộc phải nhận kết quả nên $v_1 = \mathbb{E}[X] = 3.5$. Khi còn $r \ge 2$ lượt và vừa tung ra mặt $x$, ta dừng nếu $x > v_{r-1}$ và tung lại nếu $x < v_{r-1}$:

$$
v_r = \mathbb{E}\big[\max(X, \, v_{r-1})\big] = \frac{1}{6}\sum_{x=1}^{6} \max(x, \, v_{r-1})
$$

Tính nhẩm tuần tự từng nấc:
- Với $r = 2$: giữ $\{4, 5, 6\}$ và tung lại $\{1, 2, 3\}$ để nhận kỳ vọng $3.5$, suy ra $v_2 = \frac{3 \times 3.5 + (4 + 5 + 6)}{6} = \frac{25.5}{6} = \mathbf{4.25}$.
- Với $r = 3$: chỉ giữ $\{5, 6\}$ — vì $4 < 4.25$, tung ra $4$ ở lượt đầu vẫn phải bỏ đi — và tung lại $\{1, 2, 3, 4\}$, suy ra $v_3 = \frac{4 \times 4.25 + (5 + 6)}{6} = \frac{28}{6} = \frac{14}{3} \approx \mathbf{4.67}$.

### 2.4. Vũ khí 4 — Song ánh Tổ hợp & Nguyên lý Phản xạ (Combinatorial Bijection)

Bài toán **Kiểm phiếu Bertrand / Đường đi Catalan**: Trong cuộc bầu cử hoặc chuỗi lệnh mua/bán rời rạc, ứng viên $A$ nhận tổng cộng $p$ phiếu và ứng viên $B$ nhận $q$ phiếu ($p > q$). Nếu kiểm ngẫu nhiên từng phiếu một, xác suất để $A$ **luôn dẫn điểm nghiêm ngặt hơn $B$ tại mọi thời điểm từ phiếu đầu tiên đến phiếu cuối cùng** là bao nhiêu?

Mọi chuỗi dẫn trước hợp lệ bắt buộc mở đầu bằng một phiếu cho $A$ với xác suất $\frac{p}{p+q}$. Từ điểm xuất phát $(1, +1)$, ta cần đếm số đường đi tới $(p + q, p - q)$ không bao giờ chạm mức hòa $y = 0$. Theo **Nguyên lý Phản xạ André**, lấy mọi đường đi "xấu" bắt đầu từ $(1, +1)$ có chạm trục $y = 0$ tại thời điểm đầu tiên $\tau_0$, rồi lật đối xứng toàn bộ đoạn đầu từ $(0, 0) \to (1, +1) \to \dots \to (\tau_0, 0)$ qua trục hoành thành đường đi bắt đầu bằng $(0, 0) \to (1, -1)$ đi tới cùng đích $(p + q, p - q)$. Phép lật này là một **song ánh $1\text{-}1$ hoàn hảo** giữa tập đường xấu mở đầu bằng $A$ và toàn bộ tập đường mở đầu bằng $B$ gồm đúng $\binom{p+q-1}{p}$ đường! Vậy số đường tốt và xác suất cần tìm là:

$$
|\mathcal{P}_{\text{good}}| = \binom{p+q-1}{p-1} - \binom{p+q-1}{p} \implies \mathbb{P}(\text{luôn dẫn trước}) = \frac{|\mathcal{P}_{\text{good}}|}{\binom{p+q}{p}} = \frac{p - q}{p + q}
$$

Hệ quả tức thì: khi $p = n + 1, q = n$ và bỏ phiếu đầu cố định, số đường đi không âm độ dài $2n$ chính là số Catalan $C_n = \frac{1}{n+1}\binom{2n}{n}$!

### 2.5. Vũ khí 5 — Báo giá Tạo lập Thị trường Fermi (Fermi Market-Making)

Tại bàn giao dịch của Jane Street và Optiver, câu hỏi *"Hãy tạo lập thị trường khoảng tin cậy $90\%$ cho doanh thu hàng năm của toàn bộ các tiệm cà phê tại Manhattan"* không tìm một con số duy nhất, mà đánh giá kỹ năng **quản trị rủi ro sai số mô hình**! Quy trình chuẩn gồm ba bước:
1. **Phân rã nhân tính độc lập:** Viết $Q = \prod_{i=1}^m X_i$, ví dụ dân số vãng lai ngày nhân tỷ lệ uống cà phê ngoài tiệm nhân giá trung bình hóa đơn nhân $365$ ngày.
2. **Ước lượng trên thang logarit:** Với mỗi thừa số $X_i$, chọn cận dưới $L_i$ và cận trên $U_i$ ở mức tin cậy $90\%$ ứng với $\pm z_{0.95} \approx \pm 1.645$ độ lệch chuẩn logarit. Khi đó trung vị hình học là $\hat{m}_i = \sqrt{L_i U_i}$ và độ lệch chuẩn logarit của thừa số thứ $i$ là $\hat{\sigma}_i = \frac{\ln(U_i / L_i)}{2 z_{0.95}}$. Vì sai số ước lượng các khâu xấp xỉ độc lập, phương sai logarit cộng tính thay vì cộng độ rộng tuyến tính làm khoảng giá phình quá rộng:

$$
\hat{Q}_{\text{med}} = \prod_{i=1}^m \sqrt{L_i U_i}, \qquad \hat{\sigma}_{\text{total}} = \sqrt{\sum_{i=1}^m \hat{\sigma}_i^2}, \qquad [B, A] = \Big[\hat{Q}_{\text{med}}\,e^{-1.645\,\hat{\sigma}_{\text{total}}}, \; \hat{Q}_{\text{med}}\,e^{+1.645\,\hat{\sigma}_{\text{total}}}\Big]
$$

3. **Phản xạ cập nhật khi bị người phỏng vấn giao dịch:** Nếu bạn vừa chào $[B, A]$ và người phỏng vấn nói *"Tôi Mua ở giá $A$ của bạn!"*, điều đó hàm ý giá trị thật nhiều khả năng cao hơn $A$. Khi chào lại thị trường mới cho lô thứ hai, bạn bắt buộc phải **dịch chuyển cả tâm báo giá vọt lên trên $A$ cũ** đồng thời nới rộng biên độ phòng thủ!

---

## 3. Lý thuyết Trò chơi Định lượng: Nguyên lý Bàng quan & Tư duy Cấp bậc

### 3.1. Cân bằng Nash Chiến lược Hỗn hợp & Nguyên lý Bàng quan

Trong trò chơi tổng quát hữu hạn hai người với ma trận thu hoạch $(U_1, U_2)$, luôn tồn tại ít nhất một **Cân bằng Nash Chiến lược Hỗn hợp** (Mixed-Strategy Nash Equilibrium) $(\sigma_1^\star, \sigma_2^\star)$. Vũ khí đại số nhanh nhất để giải $(\sigma_1^\star, \sigma_2^\star)$ không phải là lấy đạo hàm hàm hai biến, mà là **Nguyên lý Bàng quan** (Indifference Principle): *Người chơi $1$ chỉ sẵn lòng trộn ngẫu nhiên với xác suất dương nghiêm ngặt giữa các hành động thuần túy $i \in \operatorname{supp}(\sigma_1^\star)$ khi và chỉ khi chiến lược $\sigma_2^\star$ của đối thủ làm cho mọi hành động $i$ trong giá đỡ đó mang lại cùng một kỳ vọng thu hoạch $v_1^\star$ bằng nhau và không có hành động nào ngoài giá đỡ vượt quá $v_1^\star$:*

$$
\forall i \in \operatorname{supp}(\sigma_1^\star): \; e_i^\top U_1 \sigma_2^\star = v_1^\star, \qquad \forall j \notin \operatorname{supp}(\sigma_1^\star): \; e_j^\top U_1 \sigma_2^\star \le v_1^\star
$$

Chú ý hệ quả phản trực giác cực hay xuất hiện trong đề thi: **xác suất trộn cân bằng $\sigma_2^\star$ của người chơi $2$ được quyết định bởi ma trận lợi ích $U_1$ của người chơi $1$** nhằm khóa chặt không cho người chơi $1$ khai thác lệch, chứ không phải bởi $U_2$!

**Ví dụ Tính Nhẩm 30 Giây — Trò chơi Săn Lệnh Tảng băng Ẩn:**
Một quỹ định lượng cần mua lô lớn và chọn giữa đặt lệnh tại Sàn Sáng (hành động $L$, tiết kiệm phí nếu không bị bắt bài) hoặc Sàn Tối (hành động $D$, an toàn hơn nhưng tốn phí). Thuật toán săn mồi chọn Quét Sàn Sáng ($S$, xác suất $q$) hoặc Nghỉ ($R$, xác suất $1 - q$). Ma trận thu hoạch của quỹ định lượng là:
- Nếu quỹ chọn $L$: thu $+4$ khi đối thủ chọn $R$, nhưng lỗ $-2$ nếu bị đối thủ chọn $S$ bắt bài.
- Nếu quỹ chọn $D$: thu chắc chắn $+1$ bất kể đối thủ chọn $S$ hay $R$.

Để quỹ định lượng bàng quan giữa $L$ và $D$, thuật toán săn mồi phải trộn xác suất quét $q^\star$ sao cho kỳ vọng của $L$ bằng đúng kỳ vọng của $D$:

$$
(-2)q^\star + 4(1 - q^\star) = 1 \iff 4 - 6q^\star = 1 \iff q^\star = \frac{1}{2}
$$

Nếu kẻ săn mồi tăng tần suất quét lên $q > \frac{1}{2}$, quỹ lập tức rút $100\%$ khối lượng sang Sàn Tối khiến kẻ săn mồi đói mồi!

### 3.2. Trò chơi Đoán số $2/3$ Trung bình & Khoảng cách Giữa Lý thuyết với Đám đông

Xét trò chơi cuộc thi sắc đẹp Keynes do Rosemarie Nagel thực nghiệm năm 1995: $N \ge 3$ nhà đầu tư đồng thời chọn một con số thực $x_i \in [0, 100]$; người có con số gần mục tiêu $M = \frac{2}{3}\left(\frac{1}{N}\sum_{j=1}^N x_j\right)$ nhất giành trọn giải thưởng. Hãy áp dụng **Loại trừ Lặp các Chiến lược Bị Áp đảo** (Iterated Elimination of Dominated Strategies):
- **Tư duy bậc $1$:** Trung bình cộng $\bar{x}$ không bao giờ vượt quá $100$, nên $\frac{2}{3}\bar{x} \le \frac{200}{3} \approx 66.67$. Mọi lựa chọn $x_i \in (66.67, 100]$ đều bị áp đảo ngặt bởi $66.67$!
- **Tư duy bậc $2$:** Khi biết mọi đối thủ hợp lý đều không chọn trên $66.67$, mục tiêu tối đa tụt xuống $\frac{2}{3} \times 66.67 \approx 44.44$. Lặp quy nạp đến tư duy bậc $k$:

$$
x_{\max}^{(k)} = 100 \left(\frac{2}{3}\right)^k \xrightarrow{k \to \infty} x_{\text{eq}}^\star = 0
$$

Trong điểm cân bằng duy nhất dưới kiến thức chung về sự hợp lý vô hạn bậc, mọi người chơi đều chọn **$0$**! Thế nhưng trong hàng trăm thí nghiệm thực tế trên độc giả báo tài chính và sinh viên cao học, con số chiến thắng thực sự ở vòng đầu luôn rơi quanh vùng **$22\text{–}33$** tương ứng tư duy bậc $k \in [1.5, 2]$, còn người chọn đáp án lý thuyết $0$ lại thua trắng! Định giá bong bóng tài sản trên thị trường thực không phụ thuộc vào giá trị hội tụ ở bậc vô cực, mà phụ thuộc vào bậc tư duy $(k + 1)$ đi trước đám đông đúng một nhịp!

---

## 4. Lời nguyền Kẻ thắng cuộc & Bài toán Thâu tóm Công ty Tổng quát

### 4.1. Chứng minh Nghịch lý Lỗ Chắc chắn trong Bài toán Thâu tóm Công ty

Xét đề bài phỏng vấn huyền thoại của Samuelson & Bazerman: Công ty mục tiêu $T$ nắm thông tin nội bộ và biết chính xác giá trị hiện tại của mình là biến ngẫu nhiên $V \sim \operatorname{Uniform}[0, 100]\text{ triệu USD}$. Tập đoàn đi thâu tóm $A$ chỉ biết phân phối tiên nghiệm của $V$, nhưng biết chắc rằng nhờ công nghệ cộng hưởng, dưới sự điều hành của $A$ công ty đó sẽ có giá trị cao hơn $\gamma$ lần so với dưới tay chủ cũ — xét trường hợp chuẩn $\gamma = 1.5$, tức tăng giá trị thêm $50\%$ trong mọi trạng thái! Tập đoàn $A$ đưa ra một mức giá chào mua tiền mặt duy nhất $b \in [0, 100]$; chủ công ty $T$ chấp nhận bán khi và chỉ khi $b \ge V$. Tập đoàn $A$ nên chào giá $b^\star$ bằng bao nhiêu?

Hơn $90\%$ ứng viên chưa qua đào tạo lập luận: *"Kỳ vọng của $V$ là $\$50\text{ triệu}$, sang tay mình thành $\$75\text{ triệu}$, vậy chào giá $b = \$60\text{ triệu}$ vừa có lời $\$15\text{ triệu}$ vừa dễ mua được!"* Lập luận này **sai lầm chí mạng** vì bỏ quên sự kiện điều kiện hóa: chủ cũ chỉ bán cho bạn khi $V \le b$ — nếu công ty thực sự đáng giá $\$80\text{ triệu}$, họ đã từ chối thẳng thừng mức $\$60\text{ triệu}$ của bạn! Với $V \sim \operatorname{Uniform}[0, V_{\max}]$, khi lời chào $b \in (0, V_{\max}]$ được chấp nhận, phân phối hậu nghiệm của $V \mid \{V \le b\}$ là phân phối đều trên $[0, b]$, có kỳ vọng có điều kiện chỉ bằng $\mathbb{E}[V \mid V \le b] = \frac{b}{2}$! Lợi nhuận kỳ vọng vô điều kiện của tập đoàn $A$ bằng:

$$
\mathbb{E}\big[\Pi_A(b)\big] = \mathbb{P}(V \le b) \cdot \mathbb{E}\big[\gamma V - b \,\big|\, V \le b\big] = \frac{b}{V_{\max}}\left(\gamma \frac{b}{2} - b\right) = \frac{b^2}{2 V_{\max}}(\gamma - 2)
$$

Nhìn vào nhân tử $(\gamma - 2)$: với mọi hệ số cộng hưởng $1 < \gamma < 2$ như $\gamma = 1.5 \implies \gamma - 2 = -0.5 < 0$, ta có $\mathbb{E}[\Pi_A(b)] = -\frac{b^2}{4 V_{\max}} < 0$ với **mọi mức giá chào dương $b > 0$**! Dù việc sáp nhập tạo ra thặng dư xã hội dương $50\%$, bất cân xứng thông tin gây ra lựa chọn bất lợi dữ dội đến mức chiến lược tối ưu duy nhất là **$b^\star = 0$, tức từ chối chào giá**!

### 4.2. Mở rộng Tổng quát Khi Giá trị Sàn Dương $V \sim \operatorname{Uniform}[a, b_{\max}]$

Trong vòng phỏng vấn nâng cao tại Jane Street, người phỏng vấn nối tiếp câu hỏi: *"Nếu giá trị công ty có chặn dưới dương $V \sim \operatorname{Uniform}[a, b_{\max}]$ với $0 < a < b_{\max}$ và $\gamma \in (1, 2)$, liệu bên mua có thể kiếm lời dương được không?"* Với mọi mức chào $b \in [a, b_{\max}]$, xác suất khớp là $\frac{b - a}{b_{\max} - a}$ và kỳ vọng hậu nghiệm $\mathbb{E}[V \mid a \le V \le b] = \frac{a + b}{2}$. Hàm mục tiêu bậc hai lõm nghiêm ngặt theo $b$ là:

$$
\mathbb{E}\big[\Pi_A(b)\big] = \frac{b - a}{b_{\max} - a}\left[\gamma \frac{a + b}{2} - b\right] = \frac{1}{2(b_{\max} - a)}(b - a)\big[\gamma a - (2 - \gamma)b\big]
$$

Tam thức bậc hai theo $b$ có hai nghiệm tại $b_1 = a$ và $b_2 = \frac{\gamma a}{2 - \gamma} > a$, đạt đỉnh parabol đúng tại trung điểm hai nghiệm là $\tilde{b} = \frac{1}{2}\left(a + \frac{\gamma a}{2 - \gamma}\right) = \frac{a}{2 - \gamma}$! Kẹp trong miền $[a, b_{\max}]$, mức chào giá tối ưu đóng là:

$$
b^\star = \min\!\left(b_{\max}, \; \frac{a}{2 - \gamma}\right) \qquad \big(\forall \gamma \in (1, 2)\big)
$$

Ví dụ với $V \sim \operatorname{Uniform}[20, 100]$ và $\gamma = 1.5$: $\frac{a}{2 - \gamma} = \frac{20}{0.5} = \mathbf{\$40\text{ triệu}}$, mang lại lợi nhuận kỳ vọng dương $\frac{(40 - 20)(30 - 20)}{2 \times 80} = +\$1.25\text{ triệu}$ nhờ tấm đệm giá trị sàn chắc chắn $a = 20$ không bị xói mòn bởi bất cân xứng thông tin!

```python
import numpy as np

def fermi_lognormal_market(bounds_90pct: list[tuple[float, float]], z_val: float = 1.645) -> tuple[float, float, float]:
    """Tổng hợp báo giá Bid-Ask khoảng tin cậy 90% từ danh sách cận (L_i, U_i) của các thừa số độc lập."""
    lows, highs = np.array([b[0] for b in bounds_90pct]), np.array([b[1] for b in bounds_90pct])
    q_med = float(np.prod(np.sqrt(lows * highs)))
    sigma_tot = float(np.sqrt(np.sum((np.log(highs / lows) / (2.0 * z_val)) ** 2)))
    return q_med * np.exp(-z_val * sigma_tot), q_med, q_med * np.exp(z_val * sigma_tot)

def optimal_acquirer_bid(a: float, b_max: float, gamma: float) -> tuple[float, float]:
    """Tính mức giá chào mua tối ưu và lợi nhuận kỳ vọng cho bài toán Thâu tóm Công ty tổng quát."""
    b_star = a if gamma <= 1.0 else (b_max if gamma >= 2.0 else min(b_max, a / (2.0 - gamma)))
    ev_pnl = ((b_star - a) / (b_max - a)) * (gamma * 0.5 * (a + b_star) - b_star)
    return b_star, ev_pnl

def simulate_common_value_auction_shading(n_bidders: int = 3, half_width: float = 10.0, n_sims: int = 200_000) -> float:
    """Mô phỏng Monte Carlo định lượng phần ước lượng vọt lố trung bình của người thắng đấu giá."""
    rng = np.random.default_rng(42)
    signals_err = rng.uniform(-half_width, half_width, size=(n_sims, n_bidders))
    winner_err = np.max(signals_err, axis=1)
    return float(np.mean(winner_err))
```

---

## 5. Ví dụ Phỏng vấn Tổng hợp & Quy tắc Sống Còn Cho Tạo lập Thị trường

**Bài toán — Đấu giá Giá trị Chung (Common-Value Auction) tại Citadel:**
Ba quỹ định lượng độc lập thẩm định giá trị thực $V$ của một lô cổ phiếu thanh lý. Quỹ $i$ ($i = 1, 2, 3$) quan sát tín hiệu có nhiễu $S_i = V + \varepsilon_i$, trong đó tiên nghiệm khuếch tán phẳng và sai số thẩm định độc lập $\varepsilon_i \stackrel{\text{iid}}{\sim} \operatorname{Uniform}[-10, +10]\text{ USD}$. Trong phiên đấu giá kín giá thứ nhất, cả ba quỹ cùng áp dụng chiến lược đối xứng giảm trừ tuyến tính $B(S_i) = S_i - c$. Hãy tìm hằng số giảm trừ tối thiểu $c_{\text{be}}$ để người thắng cuộc không bị lỗ kỳ vọng!

**Lời giải Chi tiết:**
- Vì hàm đặt giá $B(s) = s - c$ đồng biến nghiêm ngặt, quỹ $1$ thắng đấu giá khi và chỉ khi tín hiệu của quỹ $1$ là thống kê thứ tự lớn nhất trong $3$ tín hiệu: $S_1 = \max(S_1, S_2, S_3) \iff \varepsilon_1 = \max(\varepsilon_1, \varepsilon_2, \varepsilon_3) \triangleq \varepsilon_{(3)}$.
- Đặt $U_i = \frac{\varepsilon_i + 10}{20} \stackrel{\text{iid}}{\sim} \operatorname{Uniform}[0, 1]$. Theo phân phối thống kê thứ tự cực đại của $n = 3$ biến đều độc lập, $\mathbb{E}[U_{(3)}] = \frac{n}{n + 1} = \frac{3}{4}$. Quy đổi ngược sang $\varepsilon_{(3)} = 20 U_{(3)} - 10$:
  $\mathbb{E}[\varepsilon_1 \mid \text{Quỹ 1 thắng}] = \mathbb{E}[\varepsilon_{(3)}] = 20 \times \frac{3}{4} - 10 = \mathbf{+\$5.00}$!
- Nghĩa là bất cứ khi nào bạn thắng cuộc đấu giá với $2$ đối thủ ngang cơ, tín hiệu $S_1$ của bạn trung bình đã **ước lượng vọt lố cao hơn giá trị thật đúng $+\$5.00$**! Để hòa vốn có điều kiện $\mathbb{E}[V - (S_1 - c) \mid S_1 = S_{(3)}] = -\mathbb{E}[\varepsilon_{(3)}] + c \ge 0$, bạn bắt buộc phải gọt bớt ít nhất $c_{\text{be}} = \$5.00$ — và trong điểm cân bằng Bayes-Nash bất biến tịnh tiến của đấu giá kín giá thứ nhất với $n = 3$ đối thủ trên $[-L, +L]$, người chơi tối ưu còn cộng thêm thặng dư kỳ vọng có điều kiện $\frac{2L}{n + 1} = \$5.00$, đẩy mức giảm trừ cân bằng lên đúng $c^\star = L \frac{n - 1}{n + 1} + \frac{2L}{n + 1} = L = \mathbf{\$10.00}$!

> [!WARNING]
> **Lời nguyền Kẻ thắng cuộc Trong Kiểm thử Lệnh Giới hạn (Backtesting Limit Orders):**
> Một lỗi kinh điển của người mới nghiên cứu vi cấu trúc là giả định trong mô phỏng rằng *"cứ giá khớp trên sàn chạm đúng mức giá giới hạn mua $p_{\text{bid}}$ của tôi thì tôi được khớp $100\%$ rồi hưởng trọn chênh lệch giá"*. Trong thực tế sổ lệnh ưu tiên giá – thời gian, nếu giá chỉ chạm nhẹ $p_{\text{bid}}$ rồi bật tăng ngay, các lệnh đứng đầu hàng đợi lấy hết thanh khoản và lệnh của bạn **không hề được khớp** (`0% fill`); lệnh của bạn chỉ được khớp đầy $100\%$ khi có một cơn xả hàng khổng lồ quét thủng sạch hàng đợi $p_{\text{bid}}$ và đâm xuyên xuống sâu hơn! Luôn mô phỏng vị trí hàng đợi bảo thủ — chỉ ghi nhận khớp khi giá giao dịch xuyên qua mức giới hạn ít nhất $1$ bước giá hoặc trừ đi toàn bộ khối lượng đứng trước — để miễn nhiễm trước ảo giác lợi nhuận tạo lập thị trường.
