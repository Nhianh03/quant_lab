# M2.02 — Kỳ vọng Có điều kiện như Phép chiếu Trực giao, Tính chất Tháp & Luật Phương sai Toàn phần

## 1. Trực giác & Động lực: Dự báo Tối ưu Chính là Một Phép Chiếu Hình học

Nếu phải chọn ra một công cụ toán học duy nhất nối liền xác suất sơ cấp, hồi quy thống kê, quá trình Martingale, bộ lọc Kalman và định giá tài sản hiện đại, công cụ đó chắc chắn là **Kỳ vọng Có điều kiện** (Conditional Expectation) $\mathbb{E}[Y \mid \mathcal{G}]$.

Ở bậc đại học đại cương, sinh viên thường chỉ học công thức tính con số tĩnh $\mathbb{E}[Y \mid X = x] = \int y \, f_{Y \mid X}(y \mid x) \, dy$ tại một điểm $x$ cố định. Bước nhảy vọt tư duy của toán tài chính hiện đại nằm ở chỗ nâng cấp đối tượng này thành một **biến ngẫu nhiên** $\hat{Y} = \mathbb{E}[Y \mid \mathcal{G}]$ phụ thuộc vào toàn bộ thông tin quan sát được $\mathcal{G}$ tại thời điểm hiện tại. Dưới góc nhìn hình học của kỹ sư định lượng, mọi biến ngẫu nhiên có phương sai hữu hạn đều là một vector trong không gian vô hạn chiều, và việc trích xuất tín hiệu alpha $\hat{Y}$ từ lợi nhuận tương lai nhiễu loạn $Y$ chính xác 100% là **hạ đường vuông góc từ điểm $Y$ xuống mặt phẳng không gian con $\mathcal{G}$**!

---

## 2. Hình học Không gian Hilbert $L^2$ & Định nghĩa Kolmogorov

### 2.1. Không gian $L^2(\Omega, \mathcal{F}, \mathbb{P})$ và Điều kiện Trực giao Phần dư

Xét không gian tất cả các biến ngẫu nhiên thực có mô-men bậc hai hữu hạn trên $(\Omega, \mathcal{F}, \mathbb{P})$, ký hiệu $L^2(\mathcal{F}) = \{X : \mathcal{F}\text{-đo được}, \, \mathbb{E}[X^2] < \infty\}$ (đồng nhất hai biến bằng nhau hầu chắc chắn). Không gian này trở thành một **không gian Hilbert** hoàn chỉnh khi trang bị tích vô hướng và chuẩn khoảng cách sai số bình phương trung bình:

$$
\langle U, V \rangle = \mathbb{E}[U V], \qquad \|U\|_2 = \sqrt{\mathbb{E}[U^2]}
$$

Hai biến ngẫu nhiên $U, V$ gọi là **trực giao** ($U \perp_{L^2} V$) nếu $\mathbb{E}[UV] = 0$ (nếu ít nhất một biến có kỳ vọng bằng $0$, điều này đồng nghĩa $\operatorname{Cov}(U, V) = 0$). Giờ đây, giả sử tại thời điểm $t$, thông tin thị trường mà bạn quan sát được biểu diễn bởi một $\sigma$-đại số con $\mathcal{G} \subseteq \mathcal{F}$. Tập hợp mọi biến ngẫu nhiên có thể tính toán được hoàn toàn từ thông tin $\mathcal{G}$ tạo thành một **không gian vector con đóng** $L^2(\mathcal{G}) \subseteq L^2(\mathcal{F})$.

Theo Định nghĩa Tổng quát của Kolmogorov (áp dụng cho cả biến ngẫu nhiên khả tích $Y \in L^1(\mathcal{F})$, tức $\mathbb{E}[|Y|] < \infty$), kỳ vọng có điều kiện $\hat{Y} = \mathbb{E}[Y \mid \mathcal{G}]$ là biến ngẫu nhiên duy nhất hầu chắc chắn thỏa mãn hai tiên đề:
1. **Tính nhân quả / Đo được**: $\hat{Y}$ là $\mathcal{G}$-đo được (tại thời điểm có thông tin $\mathcal{G}$, giá trị của $\hat{Y}$ đã hoàn toàn xác định, không rò rỉ tương lai).
2. **Bảo toàn trung bình cục bộ trên mọi sự kiện khả kiến**: Với mọi tập sự kiện $G \in \mathcal{G}$, kỳ vọng của $\hat{Y}$ trên $G$ trùng khớp với kỳ vọng của $Y$ trên $G$:

$$
\mathbb{E}\big[\hat{Y} \, \mathbb{I}_G\big] = \mathbb{E}\big[Y \, \mathbb{I}_G\big] \iff \mathbb{E}\big[(Y - \hat{Y})\mathbb{I}_G\big] = 0 \quad (\forall G \in \mathcal{G})
$$

Khi $Y \in L^2(\mathcal{F})$, bằng cách xấp xỉ mọi hàm $W \in L^2(\mathcal{G})$ qua tổ hợp tuyến tính các hàm chỉ báo $\sum_k c_k \mathbb{I}_{G_k}$, tiên đề (2) tương đương hoàn toàn với **Nguyên lý Phép chiếu Trực giao**: phần dư dự báo $e = Y - \mathbb{E}[Y \mid \mathcal{G}]$ vuông góc với mọi biến dự báo khả kiến $W \in L^2(\mathcal{G})$!

**Định lý 2.3 (Tính Tối ưu Sai số Bình phương Trung bình Phi tuyến & Định lý Pythagoras).** *Với mọi $Y \in L^2(\mathcal{F})$, kỳ vọng có điều kiện $\hat{Y} = \mathbb{E}[Y \mid \mathcal{G}]$ là bộ dự báo cực tiểu hóa duy nhất sai số bình phương trung bình trên toàn bộ không gian các hàm đo được theo $\mathcal{G}$:*

$$
\mathbb{E}[Y \mid \mathcal{G}] = \arg\min_{Z \in L^2(\mathcal{G})} \mathbb{E}\big[(Y - Z)^2\big], \qquad \mathbb{E}[Y^2] = \mathbb{E}\big[(\mathbb{E}[Y \mid \mathcal{G}])^2\big] + \mathbb{E}\big[(Y - \mathbb{E}[Y \mid \mathcal{G}])^2\big]
$$

**Chứng minh.** Lấy bất kỳ một ứng viên dự báo khả kiến $Z \in L^2(\mathcal{G})$. Vì cả $\hat{Y}$ và $Z$ đều thuộc không gian con tuyến tính $L^2(\mathcal{G})$, hiệu số $W = \hat{Y} - Z$ cũng thuộc $L^2(\mathcal{G})$. Cộng trừ trung gian $\hat{Y}$ bên trong bình phương rồi khai triển:

$$
\mathbb{E}\big[(Y - Z)^2\big] = \mathbb{E}\big[\big((Y - \hat{Y}) + (\hat{Y} - Z)\big)^2\big] = \mathbb{E}\big[(Y - \hat{Y})^2\big] + 2\,\mathbb{E}\big[(Y - \hat{Y})(\hat{Y} - Z)\big] + \mathbb{E}\big[(\hat{Y} - Z)^2\big]
$$

Theo điều kiện trực giao phần dư với $W = \hat{Y} - Z \in L^2(\mathcal{G})$, tích chéo ở giữa bằng đúng **$0$**! Do hạng tử thứ ba $\mathbb{E}[(\hat{Y} - Z)^2] \ge 0$, biểu thức đạt cực tiểu tuyệt đối khi và chỉ khi $\mathbb{E}[(\hat{Y} - Z)^2] = 0 \iff Z = \hat{Y}$ hầu chắc chắn. Thay trường hợp riêng $Z = 0 \in L^2(\mathcal{G})$ vào đẳng thức trên cho ra ngay định lý Pythagoras xác suất $\|Y\|_2^2 = \|\hat{Y}\|_2^2 + \|Y - \hat{Y}\|_2^2$. $\blacksquare$

> [!NOTE]
> **Phân biệt với Hồi quy Tuyến tính Bình phương Tối thiểu (`OLS`):** Hồi quy tuyến tính chỉ tìm phép chiếu của $Y$ lên không gian con hữu hạn chiều rất nhỏ $\operatorname{span}\{1, X_1, \dots, X_p\}$, trong khi $\mathbb{E}[Y \mid X_1, \dots, X_p]$ chiếu lên toàn bộ không gian vô hạn chiều chứa **mọi hàm phi tuyến đo được** $g(X_1, \dots, X_p)$! Hai phép chiếu này trùng nhau khi vector $(Y, X_1, \dots, X_p)$ tuân theo phân phối chuẩn đồng thời.

---

## 3. Các Quy tắc Giải tích Cốt lõi & Chứng minh Tính chất Tháp

Để giải nhanh các bài toán kỳ vọng phức tạp mà không cần đụng tới hàm mật độ tích phân bội, nhà nghiên cứu chỉ cần kết hợp 4 quy tắc đại số sau cho $X, Y \in L^1(\mathcal{F})$ và các $\sigma$-đại số thông tin:

1. **Tính Tuyến tính**: $\mathbb{E}[a X + b Y \mid \mathcal{G}] = a\,\mathbb{E}[X \mid \mathcal{G}] + b\,\mathbb{E}[Y \mid \mathcal{G}]$ với mọi hằng số $a, b \in \mathbb{R}$.
2. **Tính Độc lập Thông tin**: Nếu $Y$ độc lập hoàn toàn với $\mathcal{G}$ ($Y \perp \mathcal{G}$), thông tin $\mathcal{G}$ vô dụng nên $\mathbb{E}[Y \mid \mathcal{G}] = \mathbb{E}[Y]$.
3. **Đưa Đại lượng Đã biết Ra Ngoài Dấu Kỳ vọng ("Taking Out What Is Known")**: Nếu $Z$ là $\mathcal{G}$-đo được (và $ZY \in L^1$), thì $Z$ hành xử hệt như một hằng số khi đứng dưới điều kiện $\mathcal{G}$:

$$
\mathbb{E}[Z Y \mid \mathcal{G}] = Z \, \mathbb{E}[Y \mid \mathcal{G}]
$$

   *(Kiểm chứng trực giao nhanh cho $Z, Y$ bị chặn: với mọi $G \in \mathcal{G}$, tích $Z \mathbb{I}_G$ vẫn là $\mathcal{G}$-đo được, nên $\mathbb{E}[(Z \mathbb{E}[Y \mid \mathcal{G}]) \mathbb{I}_G] = \mathbb{E}[\mathbb{E}[Y \mid \mathcal{G}] (Z \mathbb{I}_G)] = \mathbb{E}[Y (Z \mathbb{I}_G)] = \mathbb{E}[(ZY) \mathbb{I}_G]$, thỏa mãn đúng tiên đề định nghĩa duy nhất của Kolmogorov!).*

4. **Định lý 2.4 — Tính chất Tháp (Tower Property / Định luật Adam):** *Cho hai mức thông tin lồng nhau $\mathcal{H} \subseteq \mathcal{G} \subseteq \mathcal{F}$ (trong đó $\mathcal{H}$ là thông tin thô ít chi tiết hơn, ví dụ lịch sử đến hôm qua $\mathcal{F}_{t-1}$, còn $\mathcal{G}$ là thông tin mịn chi tiết hơn, ví dụ lịch sử đến hôm nay $\mathcal{F}_t$). Khi đó mức thông tin thô hơn luôn chiến thắng ở cả hai thứ tự lồng:*

$$
\mathbb{E}\big[ \mathbb{E}[Y \mid \mathcal{G}] \,\big|\, \mathcal{H} \big] = \mathbb{E}[Y \mid \mathcal{H}] = \mathbb{E}\big[ \mathbb{E}[Y \mid \mathcal{H}] \,\big|\, \mathcal{G} \big]
$$

*Đặc biệt, chọn $\mathcal{H} = \{\varnothing, \Omega\}$ (thông tin rỗng lúc ban đầu) cho ra Luật Kỳ vọng Toàn phần $\mathbb{E}\big[\mathbb{E}[Y \mid \mathcal{G}]\big] = \mathbb{E}[Y]$.*

**Chứng minh Từng Bước.**
- Vế phải thứ hai hiển nhiên vì bản thân biến $U = \mathbb{E}[Y \mid \mathcal{H}]$ đã là $\mathcal{H}$-đo được, mà $\mathcal{H} \subseteq \mathcal{G}$ nên $U$ cũng $\mathcal{G}$-đo được; áp dụng quy tắc "đưa cái đã biết ra ngoài" cho $\mathbb{E}[U \cdot 1 \mid \mathcal{G}] = U$.
- Với vế trái quan trọng nhất $\mathbb{E}[\mathbb{E}[Y \mid \mathcal{G}] \mid \mathcal{H}]$: đặt $Z = \mathbb{E}[\mathbb{E}[Y \mid \mathcal{G}] \mid \mathcal{H}]$. Hiển nhiên $Z$ là $\mathcal{H}$-đo được. Ta chỉ cần kiểm tra tiên đề Kolmogorov thứ hai trên một tập sự kiện tùy ý $H \in \mathcal{H}$:
  1. Theo định nghĩa kỳ vọng có điều kiện theo $\mathcal{H}$ áp dụng cho biến $\mathbb{E}[Y \mid \mathcal{G}]$, ta có $\mathbb{E}[Z \, \mathbb{I}_H] = \mathbb{E}\big[\mathbb{E}[Y \mid \mathcal{G}] \, \mathbb{I}_H\big]$.
  2. Chìa khóa cốt lõi nằm ở quan hệ bao hàm $\mathcal{H} \subseteq \mathcal{G}$: vì $H \in \mathcal{H}$ nên **chắc chắn $H \in \mathcal{G}$**!
  3. Do $H \in \mathcal{G}$, áp dụng tiếp tiên đề định nghĩa của $\mathbb{E}[Y \mid \mathcal{G}]$ trên sự kiện $H \in \mathcal{G}$, ta có $\mathbb{E}\big[\mathbb{E}[Y \mid \mathcal{G}] \, \mathbb{I}_H\big] = \mathbb{E}[Y \, \mathbb{I}_H]$.
  Bắc cầu hai đẳng thức suy ra $\mathbb{E}[Z \, \mathbb{I}_H] = \mathbb{E}[Y \, \mathbb{I}_H]$ với mọi $H \in \mathcal{H}$. Tính duy nhất của định nghĩa Kolmogorov kết luận $Z = \mathbb{E}[Y \mid \mathcal{H}]$ hầu chắc chắn! Trực giác hình học trong $\mathbb{R}^3$ cực kỳ trong sáng: chiếu một điểm không gian $Y$ vuông góc xuống mặt phẳng bàn $\mathcal{G}$, rồi từ hình chiếu đó lại gióng tiếp vuông góc vào trục thước kẻ $\mathcal{H}$ nằm gọn trên mặt bàn $\mathcal{G}$, điểm rơi cuối cùng trùng khít với việc hạ vuông góc trực tiếp từ $Y$ thẳng xuống trục $\mathcal{H}$. $\blacksquare$

---

## 4. Luật Phương sai Toàn phần & Quá trình Tổng Ngẫu nhiên

Phương sai có điều kiện của $Y$ khi biết $\mathcal{G}$ được định nghĩa là biến ngẫu nhiên $\mathcal{G}$-đo được:

$$
\operatorname{Var}(Y \mid \mathcal{G}) = \mathbb{E}\big[ \big(Y - \mathbb{E}[Y \mid \mathcal{G}]\big)^2 \,\big|\, \mathcal{G} \big] = \mathbb{E}[Y^2 \mid \mathcal{G}] - \big(\mathbb{E}[Y \mid \mathcal{G}]\big)^2
$$

**Định lý 2.5 — Luật Phương sai Toàn phần (Law of Total Variance / Eve's Law):** *Với mọi $Y \in L^2(\mathcal{F})$ và mọi $\sigma$-đại số con $\mathcal{G} \subseteq \mathcal{F}$, tổng phương sai của $Y$ phân rã thành tổng của phương sai nhiễu trung bình nội tại và phương sai của chính tín hiệu dự báo:*

$$
\operatorname{Var}(Y) = \mathbb{E}\big[\operatorname{Var}(Y \mid \mathcal{G})\big] + \operatorname{Var}\big(\mathbb{E}[Y \mid \mathcal{G}]\big)
$$

**Chứng minh.** Ký hiệu gọn $\hat{Y} = \mathbb{E}[Y \mid \mathcal{G}]$. Theo Tính chất Tháp, $\mathbb{E}[\hat{Y}] = \mathbb{E}[\mathbb{E}[Y \mid \mathcal{G}]] = \mathbb{E}[Y]$. Khai triển lần lượt hai hạng tử ở vế phải:
- Lấy kỳ vọng vô điều kiện của $\operatorname{Var}(Y \mid \mathcal{G}) = \mathbb{E}[Y^2 \mid \mathcal{G}] - \hat{Y}^2$ và dùng Tính chất Tháp cho $\mathbb{E}[\mathbb{E}[Y^2 \mid \mathcal{G}]] = \mathbb{E}[Y^2]$:

$$
\mathbb{E}\big[\operatorname{Var}(Y \mid \mathcal{G})\big] = \mathbb{E}[Y^2] - \mathbb{E}[\hat{Y}^2]
$$

- Áp dụng định nghĩa phương sai thông thường cho biến ngẫu nhiên $\hat{Y}$ (lưu ý $\mathbb{E}[\hat{Y}] = \mathbb{E}[Y]$):

$$
\operatorname{Var}(\hat{Y}) = \mathbb{E}[\hat{Y}^2] - \big(\mathbb{E}[\hat{Y}]\big)^2 = \mathbb{E}[\hat{Y}^2] - \big(\mathbb{E}[Y]\big)^2
$$

Cộng hai phương trình lại với nhau, số hạng trung gian $-\mathbb{E}[\hat{Y}^2]$ và $+\mathbb{E}[\hat{Y}^2]$ triệt tiêu hoàn hảo, để lại đúng $\mathbb{E}[Y^2] - (\mathbb{E}[Y])^2 = \operatorname{Var}(Y)$! Từ đây ta cũng suy ra tỷ lệ phương sai giải thích phi tuyến tổng quát $R_{\text{nonlin}}^2 = \frac{\operatorname{Var}(\mathbb{E}[Y \mid \mathcal{G}])}{\operatorname{Var}(Y)} \in [0, 1]$ và hệ quả quan trọng: $\operatorname{Var}(\mathbb{E}[Y \mid \mathcal{G}]) \le \operatorname{Var}(Y)$ (phép lấy kỳ vọng có điều kiện luôn làm giảm phương sai). $\blacksquare$

### 4.1. Ứng dụng Cốt lõi: Phương sai của Tổng Luồng lệnh Số lượng Ngẫu nhiên

Xét tổng khối lượng (hoặc tổng dịch chuyển giá) $S_N = \sum_{i=1}^N X_i$ trong một cửa sổ $1$ phút, nơi số lượng lệnh xuất hiện $N$ là một biến ngẫu nhiên nguyên không âm độc lập với dãy kích thước lệnh độc lập cùng phân phối $X_1, X_2, \dots$ (có $\mathbb{E}[X_i] = \mu_X$ và $\operatorname{Var}(X_i) = \sigma_X^2$). Điều kiện hóa trên biến số đếm $N$:
- Khi $N = n$ cố định, $\mathbb{E}[S_N \mid N = n] = n \mu_X \implies \mathbb{E}[S_N \mid N] = N \mu_X$, và $\operatorname{Var}(S_N \mid N) = N \sigma_X^2$.
- Áp dụng Tính chất Tháp và Luật Phương sai Toàn phần:

$$
\mathbb{E}[S_N] = \mathbb{E}[N] \, \mu_X, \qquad \operatorname{Var}(S_N) = \mathbb{E}[N \sigma_X^2] + \operatorname{Var}(N \mu_X) = \mathbb{E}[N] \, \sigma_X^2 + \mu_X^2 \operatorname{Var}(N)
$$

Nếu các lệnh đến theo quá trình Poisson $N \sim \operatorname{Pois}(\lambda)$ ($\mathbb{E}[N] = \operatorname{Var}(N) = \lambda$), phương sai tổng gộp đơn giản hóa cực đẹp thành $\operatorname{Var}(S_N) = \lambda(\sigma_X^2 + \mu_X^2) = \lambda \, \mathbb{E}[X_1^2]$! Nếu $N$ có phân phối đuôi dày do hiện tượng bầy đàn lệnh tin tức ($\operatorname{Var}(N) \gg \mathbb{E}[N]$), số hạng thứ hai $\mu_X^2 \operatorname{Var}(N)$ bùng nổ, giải thích trực tiếp hiện tượng co cụm biến động trên thị trường tài chính.

---

## 5. Cầu nối Biến Chỉ báo & Bất đẳng thức Jensen Có điều kiện

### 5.1. Biến Ngẫu nhiên Chỉ báo — Vũ khí Khử Phụ thuộc Tổ hợp

Với sự kiện $A \in \mathcal{F}$, biến chỉ báo $\mathbb{I}_A(\omega)$ nhận giá trị $1$ nếu $\omega \in A$ và $0$ nếu $\omega \notin A$, cho ra **Cầu nối Cơ bản** $\mathbb{E}[\mathbb{I}_A] = \mathbb{P}(A)$. Khi cần tính kỳ vọng số lượng sự kiện xảy ra $W = \sum_{i=1}^n \mathbb{I}_{A_i}$, tính tuyến tính của kỳ vọng đảm bảo $\mathbb{E}[W] = \sum_{i=1}^n \mathbb{P}(A_i)$ **ngay cả khi các sự kiện $A_1, \dots, A_n$ phụ thuộc chằng chịt vào nhau**!

### 5.2. Bất đẳng thức Jensen Có điều kiện & Hao hụt Biến động Tài chính

**Định lý 2.6 (Bất đẳng thức Jensen).** *Cho hàm lồi $\varphi: \mathbb{R} \to \mathbb{R}$ (ví dụ $x^2$, $e^x$, $-\ln x$, $\max(x - K, 0)$) và biến ngẫu nhiên $X \in L^1(\mathcal{F})$ sao cho $\varphi(X) \in L^1(\mathcal{F})$. Với mọi $\sigma$-đại số con $\mathcal{G} \subseteq \mathcal{F}$:*

$$
\varphi\big( \mathbb{E}[X \mid \mathcal{G}] \big) \le \mathbb{E}\big[ \varphi(X) \mid \mathcal{G} \big] \quad \text{(hầu chắc chắn)}
$$

**Chứng minh.** Theo tính chất hình học của hàm lồi, tại mọi điểm $m \in \mathbb{R}$ luôn tồn tại ít nhất một đường thẳng tựa tiếp xúc dưới có hệ số góc $c(m)$ sao cho $\varphi(x) \ge \varphi(m) + c(m)(x - m)$ với mọi $x \in \mathbb{R}$. Thay $x = X$ và chọn $m = \mathbb{E}[X \mid \mathcal{G}]$ (là biến $\mathcal{G}$-đo được nên $c(m)$ cũng $\mathcal{G}$-đo được), sau đó lấy kỳ vọng có điều kiện theo $\mathcal{G}$ cả hai vế (sử dụng tính đơn điệu bảo toàn dấu bất đẳng thức và đưa $\varphi(m), c(m)$ ra ngoài):

$$
\mathbb{E}[\varphi(X) \mid \mathcal{G}] \ge \varphi(m) + c(m)\big(\mathbb{E}[X \mid \mathcal{G}] - m\big) = \varphi\big(\mathbb{E}[X \mid \mathcal{G}]\big) + 0
$$

Trong quản lý danh mục đầu tư, áp dụng Jensen cho hàm lõm $\ln(1 + R)$ (tức $\varphi(x) = -\ln(1+x)$ lồi) kết hợp khai triển Taylor bậc hai cho thấy tốc độ tăng trưởng kép dài hạn luôn thấp hơn lợi nhuận trung bình số học một lượng đúng bằng **hao hụt biến động** (Volatility Drag): $\mathbb{E}[\ln(1 + R)] \approx \mathbb{E}[R] - \frac{1}{2}\operatorname{Var}(R)$! Một chiến lược nhân đôi tài sản $+50\%$ ngày chẵn rồi chia đôi $-50\%$ ngày lẻ có lợi nhuận trung bình số học $\mathbb{E}[R] = 0\%$, nhưng tăng trưởng gộp thực tế mỗi hai ngày là $(1.5)(0.5) = 0.75$ (lỗ ròng $-13.4\%$/ngày)! $\blacksquare$

---

## 6. Ví dụ Giải toán Phỏng vấn Thực chiến

**Bài toán 1 (Đếm Số Đỉnh Cực đại Địa phương trong Chuỗi Giá Ngẫu nhiên — Citadel / Two Sigma):** Giả sử $n \ge 2$ mức giá đóng cửa phân biệt trong $n$ ngày $P_1, P_2, \dots, P_n$ là một hoán vị ngẫu nhiên đồng khả năng (hoặc rút độc lập từ một phân phối liên tục không có xu hướng). Ngày thứ $i$ ($1 \le i \le n$) được gọi là một **đỉnh cục bộ** nếu giá ngày đó cao hơn tất cả các ngày lân cận trực tiếp của nó (cụ thể: $P_1 > P_2$ ở biên đầu; $P_n > P_{n-1}$ ở biên cuối; và $P_{i-1} < P_i > P_{i+1}$ với $2 \le i \le n-1$). Tính kỳ vọng tổng số đỉnh cục bộ!

**Lời giải Bài toán 1 (4 Dòng bằng Biến Chỉ báo & Đối xứng):**
Đặt biến chỉ báo $I_i = \mathbb{I}_{\{\text{ngày } i \text{ là đỉnh cục bộ}\}}$ cho $i = 1, \dots, n$, tổng số đỉnh là $M_n = \sum_{i=1}^n I_i$. Các biến $I_i$ phụ thuộc rất mạnh (nếu ngày $i$ là đỉnh thì ngày $i+1$ chắc chắn không thể là đỉnh!), nhưng kỳ vọng tuyến tính hoàn toàn phớt lờ sự phụ thuộc đó:
- Tại hai biên $i = 1$ và $i = n$: trong 2 số phân biệt $(P_1, P_2)$, theo tính đối xứng hoán vị $\mathbb{P}(P_1 > P_2) = \frac{1}{2}$, tương tự $\mathbb{P}(P_n > P_{n-1}) = \frac{1}{2}$.
- Tại mỗi điểm bên trong $2 \le i \le n - 1$: xét bộ ba lân cận $(P_{i-1}, P_i, P_{i+1})$, cả $3! = 6$ thứ tự lớn bé đều đồng khả năng và có đúng $2$ thứ tự mà phần tử đứng giữa $P_i$ lớn nhất trong cả ba (hoặc đơn giản hơn: mỗi phần tử trong 3 phần tử có cơ hội bằng nhau là số lớn nhất!), suy ra $\mathbb{P}(P_{i-1} < P_i > P_{i+1}) = \frac{1}{3}$.
Cộng tổng kỳ vọng trên toàn dãy $n \ge 2$:

$$
\mathbb{E}[M_n] = \mathbb{E}[I_1] + \sum_{i=2}^{n-1} \mathbb{E}[I_i] + \mathbb{E}[I_n] = \frac{1}{2} + (n - 2)\frac{1}{3} + \frac{1}{2} = \frac{n + 1}{3}
$$

*(Kiểm tra biên cực nhanh trong phòng thi: với $n = 2$, luôn có đúng $1$ số lớn hơn số kia nên số đỉnh chắc chắn bằng $1$, công thức cho $\frac{2+1}{3} = 1$ — đúng tuyệt đối!).*

**Bài toán 2 (Lọc Tín hiệu Khỏi Nhiễu & Kỳ vọng Đệ quy Tung Xúc xắc — Green Book Ch. 4):**
1. Lợi nhuận thực sự chưa biết của cổ phiếu là $S \sim \mathcal{N}(0, \sigma_S^2)$. Mô hình định lượng của bạn tạo ra tín hiệu bị lẫn nhiễu đo lường độc lập $X = S + \varepsilon$ với $\varepsilon \sim \mathcal{N}(0, \sigma_\varepsilon^2)$. Tìm bộ dự báo tối ưu $\hat{S} = \mathbb{E}[S \mid X]$ và phương sai sai số còn lại $\operatorname{Var}(S \mid X)$.
2. Tung một con xúc xắc 6 mặt cân đối liên tiếp. Nếu ra mặt $1, 2, 3, 4, 5$, bạn được cộng đúng số chấm đó vào tài khoản và tiếp tục tung; nếu ra mặt $6$, trò chơi kết thúc ngay lập tức và bạn được cầm về trọn vẹn tổng số tiền đã tích lũy trước lần tung ra $6$ đó. Tính kỳ vọng số tiền nhận được $E$.

**Lời giải Bài toán 2:**
1. **Bộ lọc Co rút Tỷ số Tín hiệu trên Nhiễu**: Do $(S, X)$ chuẩn đồng thời, tìm hằng số $c$ sao cho phần dư $S - cX$ trực giao với $X$:

$$
\mathbb{E}[(S - cX)X] = 0 \implies c = \frac{\mathbb{E}[S(S + \varepsilon)]}{\mathbb{E}[(S + \varepsilon)^2]} = \frac{\sigma_S^2}{\sigma_S^2 + \sigma_\varepsilon^2} = \frac{\text{SNR}}{1 + \text{SNR}}, \qquad \text{SNR} = \frac{\sigma_S^2}{\sigma_\varepsilon^2}
$$

   Vậy $\mathbb{E}[S \mid X] = \frac{\sigma_S^2}{\sigma_S^2 + \sigma_\varepsilon^2} X$ và theo Pythagoras $\operatorname{Var}(S \mid X) = \sigma_S^2 - c^2(\sigma_S^2 + \sigma_\varepsilon^2) = \frac{\sigma_S^2 \sigma_\varepsilon^2}{\sigma_S^2 + \sigma_\varepsilon^2}$. Khi tín hiệu rất nhiễu ($\text{SNR} = 0.01$), bạn buộc phải co rút dự báo về $0$ với hệ số $\approx 0.0099$ thay vì tin nguyên xi giá trị $X$!
2. **Phân rã theo Lần tung Đầu tiên $D_1$ (Luật Kỳ vọng Toàn phần)**: Gọi $Y$ là tổng tiền cuối cùng thu được với $E = \mathbb{E}[Y]$. Điều kiện hóa lên kết quả viên xúc xắc đầu tiên $D_1 \in \{1, 2, 3, 4, 5, 6\}$:
   - Nếu $D_1 = 6$ (xác suất $\frac{1}{6}$): trò chơi kết thúc ngay chưa kịp cộng gì, nhận $0$.
   - Nếu $D_1 = k \in \{1, 2, 3, 4, 5\}$ (mỗi trường hợp xác suất $\frac{1}{6}$): bạn bỏ túi chắc chắn $k$ đồng (vì quy tắc bảo toàn tổng điểm trước khi gặp mặt $6$!) và phần trò chơi từ lần tung thứ hai trở đi độc lập có phân phối giống hệt lúc đầu nên mang lại kỳ vọng cộng thêm đúng bằng $E$!
   Lập phương trình một dòng theo Tính chất Tháp:

$$
E = \frac{1}{6}(0) + \sum_{k=1}^5 \frac{1}{6}(k + E) = \frac{15}{6} + \frac{5}{6}E \implies \frac{1}{6}E = \frac{15}{6} \implies E = 15
$$

   *(Lưu ý cảnh giác đề bài biến thể: nếu đề bài đổi thành "ra mặt $6$ thì mất sạch toàn bộ tiền về $0$ và không được dừng chủ động", thì vì xác suất cuối cùng chắc chắn sẽ gặp mặt $6$ bằng $1$, trò chơi luôn kết thúc bằng $0$ đồng nên kỳ vọng bằng $0$!).*

---

## 7. Các Bẫy Sai lầm Thường gặp với Kỳ vọng Có điều kiện

> [!WARNING]
> **Bẫy Áp dụng Sai Tính chất Tháp khi Hai Tập Thông tin Không Lồng nhau:** Nhiều ứng viên viết bừa $\mathbb{E}[\mathbb{E}[Y \mid X_1] \mid X_2] = \mathbb{E}[Y]$ hoặc $\mathbb{E}[Y \mid X_1, X_2]$! Tính chất Tháp **chỉ đúng khi một $\sigma$-đại số là tập con của $\sigma$-đại số kia** ($\mathcal{H} \subseteq \mathcal{G}$). Nếu $X_1$ và $X_2$ là hai đặc trưng chéo khác nhau (hai mặt phẳng cắt nhau trong không gian Hilbert), chiếu lên mặt phẳng 1 rồi chiếu sang mặt phẳng 2 sẽ xoắn ốc hội tụ dần về giao tuyến chứ không dừng lại sau một bước!

- **Bẫy Ngộ nhận $\mathbb{E}[X / Y] = \mathbb{E}[X] / \mathbb{E}[Y]$**: Ngay cả khi $X$ và $Y > 0$ hoàn toàn độc lập, vì hàm $g(y) = \frac{1}{y}$ là hàm lồi chặt trên $(0, \infty)$, bất đẳng thức Jensen khẳng định $\mathbb{E}[X / Y] = \mathbb{E}[X] \, \mathbb{E}[1/Y] > \frac{\mathbb{E}[X]}{\mathbb{E}[Y]}$ (nếu $Y$ không suy biến thành hằng số)!
- **Bẫy Bỏ sót Thành phần Phương sai Giữa Các Chế độ**: Khi thị trường chuyển đổi ngẫu nhiên giữa chế độ bình lặng ($\sigma_{\text{low}} = 1\%$) và chế độ khủng hoảng ($\sigma_{\text{high}} = 4\%$) kèm kỳ vọng lợi nhuận khác nhau ($\mu_{\text{low}} = +0.1\%, \mu_{\text{high}} = -0.8\%$), phương sai toàn cục không chỉ bằng trung bình có trọng số của $\sigma_{\text{low}}^2$ và $\sigma_{\text{high}}^2$, mà còn cộng thêm bước nhảy bình phương giữa hai trung bình $\operatorname{Var}(\mu_{\text{regime}})$ theo đúng Định luật Eve!
