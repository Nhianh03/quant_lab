# M0.01 — Tổ hợp, Phép đếm, Nguyên lý Bù trừ & Đối xứng Xác suất Sơ cấp

## 1. Trực giác & Động lực: Phép đếm Dưới Lăng kính Không gian Trạng thái

Trong vòng phỏng vấn đầu tiên tại Jane Street, Optiver, SIG hay Citadel, ứng viên phải giải các bài toán xác suất rời rạc dưới áp lực bấm giờ từ 3 đến 5 phút mỗi câu. Rất nhiều kỹ sư phần mềm giỏi thuật toán lại vấp ngã ở vòng này vì cố viết vòng lặp vét cạn trong đầu hoặc sa lầy vào biến đổi đại số rườm rà.

Bí quyết để làm chủ tổ hợp không phải là học thuộc lòng hàng chục công thức rời rạc, mà là tư duy như khi bạn thiết kế cấu trúc dữ liệu không trùng lặp: mỗi phép đếm thực chất là việc thiết lập một **song ánh** (Bijection) một-đối-một giữa tập hợp sự kiện thị trường phức tạp và một chuỗi ký hiệu chuẩn tắc dễ đếm. Khi mọi kịch bản sơ cấp trong không gian mẫu hữu hạn $\Omega$ có khả năng xảy ra ngang nhau, xác suất của biến cố $A \subseteq \Omega$ đơn giản là tỷ số đếm $\mathbb{P}(A) = \frac{|A|}{|\Omega|}$.

---

## 2. Quy tắc Đếm Cơ bản, Hoán vị, Tổ hợp & Hệ số Đa thức

### 2.1. Quy tắc Cộng, Quy tắc Nhân và Khử Thứ tự Nội bộ

Hai viên gạch nền tảng của mọi phép đếm tổ hợp tương ứng trực tiếp với kiểu hợp rời nhau và kiểu bản ghi tích trong khoa học máy tính:
- **Quy tắc Cộng** (Rule of Sum): Nếu một sự kiện có thể xảy ra theo một trong hai nhánh hoàn toàn xung khắc $A$ hoặc $B$ ($A \cap B = \varnothing$), tổng số kịch bản là $|A \cup B| = |A| + |B|$.
- **Quy tắc Nhân** (Rule of Product): Nếu quy trình gồm $k$ bước tuần tự, trong đó bước thứ $i$ luôn có đúng $n_i$ lựa chọn bất kể kết quả của các bước trước đó, tổng số chuỗi quyết định phân biệt là $n_1 \times n_2 \times \dots \times n_k$.

Từ quy tắc nhân, số cách xếp hàng có thứ tự $k$ phần tử lấy từ $n$ phần tử phân biệt ($0 \le k \le n$) là **chỉnh hợp** (Permutation) $P(n, k) = n(n - 1)\cdots(n - k + 1) = \frac{n!}{(n - k)!}$ (với quy ước $0! = 1$). Khi ta chỉ quan tâm đến tập con gồm $k$ phần tử mà bỏ qua thứ tự sắp xếp nội bộ giữa chúng, cứ mỗi tập con $k$ phần tử đã bị quy tắc nhân đếm lặp đúng $k!$ lần. Chia khử bội số dư thừa này cho ta công thức **tổ hợp** (Combination):

$$
\binom{n}{k} = \frac{P(n, k)}{k!} = \frac{n!}{k! \, (n - k)!}
$$

Tổng quát hơn, số cách phân hoạch $n$ đối tượng phân biệt vào $m$ nhóm có nhãn với kích thước cố định $(n_1, n_2, \dots, n_m)$ thỏa mãn $\sum_{i=1}^m n_i = n$ được cho bởi **hệ số đa thức** (Multinomial Coefficient):

$$
\binom{n}{n_1, n_2, \dots, n_m} = \frac{n!}{n_1! \, n_2! \cdots n_m!}
$$

### 2.2. Chứng minh Bằng Câu chuyện Tổ hợp: Đẳng thức Nhị thức và Vandermonde

Thay vì biến đổi giai thừa khô khan, phương pháp **chứng minh bằng câu chuyện tổ hợp** (Combinatorial Proof) đếm cùng một tập hợp theo hai góc nhìn khác nhau:
1. **Nhị thức Newton**: Khai triển $(x + y)^n = (x + y)(x + y)\cdots(x + y)$, để tạo ra hạng tử $x^k y^{n-k}$, ta phải chọn đúng $k$ ngoặc đơn lấy chữ $x$ (và $n - k$ ngoặc còn lại lấy $y$), có $\binom{n}{k}$ cách chọn, suy ra $(x + y)^n = \sum_{k=0}^n \binom{n}{k} x^k y^{n-k}$. Thay $x = y = 1$ cho tổng số tập con $\sum_{k=0}^n \binom{n}{k} = 2^n$; thay $x = 1, y = -1$ cho sự cân bằng tuyệt đối giữa tập con chẵn và tập con lẻ khi $n \ge 1$: $\sum_{k=0}^n (-1)^k \binom{n}{k} = 0$.
2. **Đẳng thức Vandermonde**: Để chọn $r$ mã cổ phiếu vào danh mục từ rổ gồm $m$ mã Công nghệ và $n$ mã Tài chính (tổng cộng $\binom{m + n}{r}$ cách), ta có thể phân tách theo số lượng $j$ mã Công nghệ được chọn ($0 \le j \le r$) kèm $r - j$ mã Tài chính:

$$
\sum_{j=0}^r \binom{m}{j} \binom{n}{r - j} = \binom{m + n}{r}
$$

---

## 3. Bài toán Chia kẹo Euler & Đếm Nghiệm Nguyên

Trong vi cấu trúc thị trường, bạn thường xuyên gặp bài toán phân bổ $n$ lô lệnh giống hệt nhau (không phân biệt từng lô) vào $k$ sàn giao dịch phân biệt. Đây chính là bài toán vách ngăn và ngôi sao kinh điển (Stars and Bars).

**Định lý 0.1 — Đếm Nghiệm Nguyên của Phương trình Tuyến tính:**
1. *Số bộ nghiệm nguyên dương $(y_1, y_2, \dots, y_k) \in \mathbb{Z}_{\ge 1}^k$ của phương trình $y_1 + y_2 + \dots + y_k = n$ (với $n \ge k \ge 1$) bằng $\binom{n - 1}{k - 1}$.*
2. *Số bộ nghiệm nguyên không âm $(x_1, x_2, \dots, x_k) \in \mathbb{Z}_{\ge 0}^k$ của phương trình $x_1 + x_2 + \dots + x_k = n$ (với $n \ge 0, k \ge 1$) bằng:*

$$
N_{\ge 0}(n, k) = \binom{n + k - 1}{k - 1} = \binom{n + k - 1}{n}
$$

**Chứng minh.**
- *Ý 1*: Xếp $n$ ngôi sao giống hệt nhau thành một hàng ngang, tạo ra đúng $n - 1$ khe trống nằm giữa các ngôi sao liền kề. Để chia hàng sao thành $k$ nhóm khác rỗng liên tiếp (nhóm thứ $i$ chứa $y_i \ge 1$ ngôi sao), ta đặt $k - 1$ vách ngăn vào $n - 1$ khe trống sao cho mỗi khe chứa tối đa một vách ngăn. Ánh xạ này là song ánh một-đối-một, nên số nghiệm bằng $\binom{n - 1}{k - 1}$.
- *Ý 2*: Khi cho phép $x_i \ge 0$ (một số sàn có thể nhận $0$ lô lệnh, tức hai vách ngăn được phép đứng sát nhau), ta thực hiện phép đổi biến cộng $1$: đặt $y_i = x_i + 1 \in \mathbb{Z}_{\ge 1}$. Khi đó:

$$
\sum_{i=1}^k x_i = n \iff \sum_{i=1}^k (y_i - 1) = n \iff y_1 + y_2 + \dots + y_k = n + k
$$

Áp dụng trực tiếp Ý 1 cho tổng mới $n + k$ với $y_i \ge 1$, số bộ nghiệm bằng $\binom{(n + k) - 1}{k - 1} = \binom{n + k - 1}{k - 1}$ (cũng trùng với số cách chọn vị trí cho $k - 1$ vách ngăn trong chuỗi gồm $n$ ngôi sao và $k - 1$ vách ngăn!). $\blacksquare$

### 3.1. Bảng Phân loại Bốn Mô hình Chọn Mẫu Kinh điển

Để tránh nhầm lẫn giữa các công thức đếm khi đọc đề bài phỏng vấn, hãy luôn tự hỏi hai câu hỏi độc lập: **Thứ tự rút có quan trọng không?** và **Có được phép lặp lại phần tử đã chọn không?**

| Mô hình Chọn $r$ Phần tử Từ $n$ Loại | Thứ tự Quan trọng? | Cho phép Lặp lại? | Công thức Đếm | Ví dụ Trong Giao dịch Định lượng |
| :--- | :---: | :---: | :---: | :--- |
| **Bộ chỉnh hợp có lặp** | Có | Có | $n^r$ | Chuỗi tín hiệu tăng/giảm/đi ngang ($n = 3$) trong $r = 10$ phiên liên tiếp. |
| **Chỉnh hợp không lặp** | Có | Không | $\frac{n!}{(n - r)!}$ | Xếp hạng ưu tiên $r = 3$ sàn khớp lệnh nhanh nhất từ $n = 8$ sàn kết nối. |
| **Tổ hợp chuẩn** | Không | Không | $\binom{n}{r}$ | Chọn rổ $r = 20$ cổ phiếu trọng số bằng nhau từ vũ trụ $n = 100$ mã vốn hóa lớn. |
| **Tổ hợp lặp (Chia kẹo)** | Không | Có | $\binom{r + n - 1}{n - 1}$ | Phân bổ $r = 50$ lô lệnh giống hệt nhau vào $n = 5$ thuật toán thực thi. |

---

## 4. Nguyên lý Bù trừ & Bài toán Mất thứ tự

Khi các biến cố $A_1, A_2, \dots, A_n$ giao nhau chồng chéo, quy tắc cộng đơn thuần sẽ đếm thừa những kịch bản rơi vào nhiều biến cố cùng lúc. **Nguyên lý Bù trừ** (Inclusion-Exclusion Principle) sửa sai số đếm lặp một cách chính xác tuyệt đối qua chuỗi đan dấu.

**Định lý 0.2 — Công thức Bù trừ Tổng quát và Xác suất Mất thứ tự:**
*Với mọi họ hữu hạn biến cố $A_1, \dots, A_n$ trên không gian xác suất $(\Omega, \mathcal{F}, \mathbb{P})$:*

$$
\mathbb{P}\left(\bigcup_{i=1}^n A_i\right) = \sum_{r=1}^n (-1)^{r-1} \sum_{1 \le i_1 < \dots < i_r \le n} \mathbb{P}\big(A_{i_1} \cap \dots \cap A_{i_r}\big)
$$

*Hệ quả đặc biệt: Nếu hoán vị ngẫu nhiên đều $n$ phần tử $\{1, 2, \dots, n\}$, xác suất để **không có phần tử nào nằm đúng vị trí ban đầu của nó** — gọi là hoán vị mất thứ tự (Derangement), ký hiệu số lượng là $!n$ — bằng:*

$$
p_n = \frac{!n}{n!} = \sum_{k=0}^n \frac{(-1)^k}{k!} \xrightarrow{n \to \infty} \frac{1}{e} \approx 0.367879
$$

**Chứng minh.**
Xét một kịch bản $\omega \in \Omega$ bất kỳ thuộc đúng $m$ biến cố trong họ $\{A_1, \dots, A_n\}$. Nếu $m = 0$, $\omega \notin \bigcup_{i=1}^n A_i$ nên đóng góp $0$ vào cả hai vế. Nếu $m \ge 1$, $\omega$ đóng góp $1$ vào vế trái; ở vế phải, với mỗi bậc giao $r \le m$, có đúng $\binom{m}{r}$ tập giao bậc $r$ chứa $\omega$. Tổng trọng số đóng góp của $\omega$ ở vế phải bằng:

$$
\sum_{r=1}^m (-1)^{r-1} \binom{m}{r} = 1 - \sum_{r=0}^m (-1)^r \binom{m}{r} = 1 - (1 - 1)^m = 1
$$

Lấy tổng xác suất trên toàn bộ $\omega$ hoàn tất công thức Bù trừ! Để tìm $!n$, gọi $A_i$ là biến cố phần tử $i$ giữ nguyên vị trí ($\pi(i) = i$). Giao của $r$ biến cố cố định $r$ vị trí và cho phép $(n - r)$ phần tử còn lại hoán vị tự do theo $(n - r)!$ cách, nên $\mathbb{P}(A_{i_1} \cap \dots \cap A_{i_r}) = \frac{(n - r)!}{n!}$. Có $\binom{n}{r}$ tập con kích thước $r$, suy ra $\mathbb{P}(\bigcup_{i=1}^n A_i) = \sum_{r=1}^n (-1)^{r-1} \binom{n}{r} \frac{(n-r)!}{n!} = \sum_{r=1}^n \frac{(-1)^{r-1}}{r!}$. Lấy phần bù $1 - \mathbb{P}(\bigcup_{i=1}^n A_i)$ cho ra đúng $\sum_{k=0}^n \frac{(-1)^k}{k!}$, hội tụ cực nhanh về chuỗi Taylor của $e^{-1}$ tại $-1$! $\blacksquare$

> [!TIP]
> **Tốc độ Hội tụ Siêu Cấp của $1/e$ Trong Phỏng vấn Nhẩm Nhanh:**
> Do phần dư chuỗi đan dấu bị chặn bởi số hạng kế tiếp $\frac{1}{(n+1)!}$, ngay từ $n = 5$ lá bài trở lên ($\frac{1}{6!} = \frac{1}{720} \approx 0.0014$), xác suất mất thứ tự hoàn toàn đã xấp xỉ $36.8\%$ chính xác tới ba chữ số thập phân — hầu như **không phụ thuộc vào kích thước bộ bài** là $10$, $52$ hay $1{,}000{,}000$ lá!

---

## 5. Nguyên lý Phản xạ, Định lý Bỏ phiếu Bertrand & Số Catalan

Xét đường đi trên lưới nguyên bắt đầu từ $(0, 0)$, mỗi bước tiến sang phải $1$ đơn vị thời gian và nhảy lên $+1$ (lệnh Mua / thắng $\$1$) hoặc xuống $-1$ (lệnh Bán / thua $\$1$). Sau $a$ bước lên và $b$ bước xuống, đường đi kết thúc tại đích $(a + b, \, a - b)$, với tổng số quỹ đạo không ràng buộc là $\binom{a + b}{a}$. Làm sao đếm số quỹ đạo **không bao giờ chạm xuống mức âm** (luôn giữ tài khoản tiền mặt $\ge 0$)?

**Định lý 0.3 — Nguyên lý Phản xạ (Reflection Principle), Số Catalan và Định lý Bertrand:**
1. *Với $a \ge b \ge 0$, số đường đi từ $(0, 0)$ đến $(a + b, \, a - b)$ luôn nằm từ trục hoành trở lên ($S_t \ge 0, \, \forall t$) bằng $\binom{a + b}{a} - \binom{a + b}{a + 1} = \frac{a - b + 1}{a + 1}\binom{a + b}{a}$. Đặc biệt khi $a = b = n$, số quỹ đạo hòa vốn cuối kỳ không bao giờ âm là **Số Catalan** thứ $n$:*

$$
C_n = \binom{2n}{n} - \binom{2n}{n + 1} = \frac{1}{n + 1}\binom{2n}{n}
$$

2. **Định lý Bỏ phiếu Bertrand** *(Ballot Theorem)*: *Nếu $a > b$, xác suất để quỹ đạo luôn **dương nghiêm ngặt** sau bước xuất phát ($S_t > 0$ với mọi $1 \le t \le a + b$) bằng đúng $\frac{a - b}{a + b}$.*

**Chứng minh Bằng Phép Phản xạ Gương của Désiré André.**
- *Ý 1*: Một đường đi bị gọi là "xấu" nếu nó rơi xuống dưới trục hoành, tức chạm đường thẳng $y = -1$ ít nhất một lần. Gọi $\tau$ là thời điểm đầu tiên đường đi xấu chạm mức $y = -1$. Ta giữ nguyên đoạn đường từ $0$ đến $\tau$, và **lật đối xứng gương toàn bộ phần đường đi sau $\tau$ qua đường ngang $y = -1$** (đổi mỗi bước $+1$ thành $-1$ và ngược lại). Vì điểm cuối gốc ở độ cao $a - b$, điểm cuối mới sau khi lật qua trục $y = -1$ sẽ nằm tại độ cao $-1 - \big[(a - b) - (-1)\big] = b - a - 2$ sau $a + b$ bước! Một đường đi từ $(0, 0)$ tới $(a + b, \, b - a - 2)$ gồm $(b - 1)$ bước lên và $(a + 1)$ bước xuống; ngược lại, mọi đường đi từ $(0, 0)$ đến độ cao âm $b - a - 2 \le -2$ chắc chắn phải cắt qua mức $y = -1$, nên lật lại tại điểm chạm đầu tiên khôi phục duy nhất đường đi xấu ban đầu! Song ánh này chứng minh số đường đi xấu bằng đúng $\binom{a + b}{a + 1}$, suy ra số đường đi tốt là $\binom{a + b}{a} - \binom{a + b}{a + 1} = \binom{a + b}{a}\left(1 - \frac{b}{a + 1}\right) = \frac{a - b + 1}{a + 1}\binom{a + b}{a}$.
- *Ý 2*: Để $S_t > 0$ với mọi $t \ge 1$, bước đầu tiên bắt buộc phải là $+1$ đưa quỹ đạo lên $(1, 1)$. Từ $(1, 1)$ đến $(a + b, \, a - b)$ còn lại $(a - 1)$ bước lên và $b$ bước xuống mà không được phép chạm mức $0$ (tức không được tụt xuống $-1$ so với gốc mới $(1, 1)$!). Áp dụng Ý 1 cho $a' = a - 1 \ge b$: số quỹ đạo hợp lệ là $\frac{(a - 1) - b + 1}{(a - 1) + 1}\binom{a + b - 1}{a - 1} = \frac{a - b}{a}\binom{a + b - 1}{a - 1}$. Chia cho tổng số quỹ đạo $\binom{a + b}{a} = \frac{a + b}{a}\binom{a + b - 1}{a - 1}$, hai hệ số tổ hợp triệt tiêu sạch sẽ, để lại đúng $\frac{a - b}{a + b}$! $\blacksquare$

---

## 6. Khai thác Tính Đối xứng & Ví dụ Phỏng vấn Giải Nhanh 30 Giây

Khi không gian hoán vị đối xứng dưới phép đổi nhãn, bạn có thể cô lập chỉ nhóm phần tử liên quan để đọc thẳng đáp án mà không cần đếm phần còn lại!

**Ví dụ 1 [Jane Street / SIG] — Khoảng cách Đến Quân Át Đầu tiên Bằng Vòng Tròn Đối xứng:**
Một cỗ bài chuẩn $52$ lá (gồm $4$ quân Át và $48$ lá thường) được xáo trộn ngẫu nhiên đều. Trung bình bạn phải lật bao nhiêu lá bài (tính cả quân Át đó) cho đến khi gặp quân Át đầu tiên?
- **Lời giải Đối xứng Không Cần Tổng Tổ hợp**: Ghép thêm một lá đánh dấu `"Đỉnh Bộ Bài"` cùng $4$ quân Át tạo thành $5$ vách ngăn phân biệt xếp trên một vòng tròn đối xứng. Khi thả $48$ lá bài thường vào vòng tròn, do tính đối xứng hoán vị hoàn hảo giữa $5$ khoảng trống tạo bởi $5$ vách ngăn, mỗi khoảng trống chứa trung bình đúng $\frac{48}{5} = 9.6$ lá bài thường! Cắt vòng tròn ngay tại vách `"Đỉnh Bộ Bài"`, số lá thường nằm trước quân Át đầu tiên có kỳ vọng $9.6$, cộng thêm chính lá Át được lật là **$9.6 + 1 = \frac{53}{5} = 10.6$ lá**! (Tổng quát với $k$ phần tử đặc biệt trong $N$ lá: $\frac{N + 1}{k + 1}$).

**Ví dụ 2 [Two Sigma / Citadel] — Phân bổ Lô Lệnh Có Trần Dung lượng:**
Cần chia $12$ lô lệnh giống hệt nhau vào $4$ sàn tối phân biệt sao cho mỗi sàn nhận ít nhất $1$ lô, nhưng không sàn nào được vượt quá $6$ lô (để tránh lộ dấu chân thanh khoản). Hỏi có bao nhiêu cách phân bổ?
- **Lời giải Kết hợp Vách ngăn và Bù trừ**:
  1. Theo Định lý 0.1 (Ý 1), số nghiệm nguyên dương $y_1 + y_2 + y_3 + y_4 = 12$ ($y_i \ge 1$) không bị chặn trên là $\binom{12 - 1}{4 - 1} = \binom{11}{3} = 165$ cách.
  2. Gọi $B_i$ là biến cố sàn thứ $i$ vi phạm trần $y_i \ge 7$. Đổi biến $z_i = y_i - 6 \ge 1$ và giữ nguyên $y_j \ge 1$ ($j \neq i$), phương trình trở thành $z_i + \sum_{j \neq i} y_j = 12 - 6 = 6$, có $\binom{6 - 1}{4 - 1} = \binom{5}{3} = 10$ nghiệm cho mỗi sàn $i$.
  3. Liệu hai sàn có thể vi phạm trần cùng lúc ($B_i \cap B_j$)? Không thể, vì nếu hai sàn nhận $\ge 7$ lô và hai sàn kia nhận $\ge 1$ lô thì tổng tối thiểu đã là $7 + 7 + 1 + 1 = 16 > 12 \implies |B_i \cap B_j| = 0$!
  4. Áp dụng công thức Bù trừ: số cách hợp lệ bằng $165 - \binom{4}{1} \times 10 + 0 = \mathbf{125}$ cách!

**Ví dụ 3 [Optiver] — Xác suất Tài khoản Luôn Xanh Trong Chuỗi Giao dịch:**
Một chiến lược ghi nhận $11$ lệnh thắng $+\$100$ và $5$ lệnh thua $-\$100$ theo thứ tự ngẫu nhiên đều trong ngày. Tính xác suất tổng lãi lỗ lũy kế luôn dương nghiêm ngặt từ sau lệnh thứ nhất cho đến hết phiên!
- **Lời giải**: Áp dụng trực tiếp Định lý Bỏ phiếu Bertrand với $a = 11 > b = 5$: xác suất bằng $\frac{11 - 5}{11 + 5} = \frac{6}{16} = \frac{3}{8} = \mathbf{37.5\%}$.

**Ví dụ 4 [Jane Street / Citadel] — Bài toán Hành khách Mất Vé Máy bay & Khai thác Đối xứng Nhị nguyên:**
Có $N = 100$ hành khách xếp hàng lần lượt lên máy bay có đúng $100$ ghế đánh số từ $1$ đến $100$. Hành khách số $1$ làm mất thẻ lên tàu nên chọn bừa một ghế hoàn toàn ngẫu nhiên. Kể từ hành khách số $2$ đến số $100$, mỗi người sẽ ngồi đúng ghế ghi trên vé của mình nếu ghế đó còn trống; nếu ghế của họ đã bị người trước ngồi mất, họ lại chọn ngẫu nhiên đều một trong các ghế đang còn trống.
1. Tính xác suất hành khách cuối cùng (số $100$) được ngồi đúng ghế số $100$ của mình!
2. Mở rộng: Tính xác suất hành khách thứ $k$ ($2 \le k \le 100$) ngồi đúng ghế số $k$!

- **Lời giải Bằng Bất biến Đối xứng (Không Cần Viết Đệ quy $100$ Bước)**:
  1. Xét trạng thái của **hai ghế đặc biệt: ghế số $1$ và ghế số $100$** trước khi người cuối cùng bước vào. Bất kỳ hành khách trung gian nào $j \in \{2, \dots, 99\}$ khi phải chọn ghế ngẫu nhiên đều đối xử với ghế số $1$ và ghế số $100$ **hoàn toàn bình đẳng như nhau**:
     - Nếu có ai đó (từ người số $1$ đến người số $99$) chọn trúng ghế số $1$, chuỗi chiếm chỗ dây chuyền chấm dứt ngay lập tức và mọi người sau đó (bao gồm người số $100$) chắc chắn ngồi đúng ghế của mình!
     - Nếu có ai đó chọn trúng ghế số $100$ trước, người số $100$ chắc chắn mất ghế (phải ngồi ghế số $1$).
     - Nếu người đó chọn ghế trung gian $m \in \{2, \dots, 99\}$, bài toán chỉ lùi thời điểm quyết định cho tới khi người thứ $m$ bước vào, và sự đối xứng giữa ghế $1$ với ghế $100$ vẫn giữ nguyên 100%!
     Do đó xác suất ghế số $1$ được lấp trước ghế số $100$ bằng đúng $\frac{1}{2}$:

$$
\mathbb{P}(\text{Khách thứ } 100 \text{ ngồi đúng ghế}) = \frac{1}{2} = \mathbf{50\%}
$$

  2. Tương tự cho hành khách thứ $k$: khi người thứ $k$ chuẩn bị bước lên tàu, toàn bộ tập $(N - k + 2)$ ghế thuộc $\{1, \, k, \, k + 1, \dots, N\}$ hoàn toàn đối xứng với mọi hành khách từ $1$ đến $k - 1$ (không ai trong nhóm $1 \dots k-1$ có vé mang số trong tập này ngoại trừ ghế $1$ của khách đầu tiên!). Ghế duy nhất còn lại bị bỏ trống từ nhóm trước để chờ người thứ $k$ có phân phối đều trên $(N - k + 2)$ ghế này; người thứ $k$ chỉ mất chỗ khi ghế của chính họ đã bị chọn mất trước toàn bộ $(N - k + 1)$ ghế $\{1, \, k + 1, \dots, N\}$! Vậy xác suất người thứ $k$ ngồi đúng ghế là:

$$
\mathbb{P}(\text{Khách thứ } k \text{ ngồi đúng ghế}) = \frac{N - k + 1}{N - k + 2}
$$

  (Kiểm tra: với $k = 100$ cho $\frac{1}{2}$; với $k = 2$ cho $\frac{99}{100}$ vì khách số $2$ chỉ mất ghế khi khách số $1$ ngồi đè ngay vào ghế số $2$!).

---

## 7. Các Bẫy Tổ hợp Kinh điển Trong Vòng Sơ loại

> [!WARNING]
> **Ba Bẫy Đếm Sai Phổ biến Nhất Khiến Ứng viên Mất Điểm Oan:**
> 1. **Áp dụng Chia kẹo Không Nhãn Để Tính Xác suất Vật lý Có Nhãn:** Khi tung $2$ con xúc xắc công bằng, có $\binom{2 + 6 - 1}{6 - 1} = 21$ cặp kết quả không phân biệt thứ tự, nhưng chúng **không đồng khả năng**! Kết quả $(3, 4)$ có xác suất $\frac{2}{36}$ gấp đôi kết quả kép $(6, 6)$ có xác suất $\frac{1}{36}$. Khi tính xác suất vật lý (tung đồng xu, xúc xắc, chia bài), luôn gắn nhãn phân biệt cho từng đối tượng trên không gian mẫu $6^2 = 36$ để bảo toàn tính đồng khả năng!
> 2. **Nhân Nhầm Quy tắc Nhân Rồi Quên Khử Đối xứng Nhóm (`Overcounting`):** Số cách chia $4$ cổ phiếu thành $2$ cặp giao dịch không phân biệt thứ tự hai cặp là $\frac{1}{2!}\binom{4}{2}\binom{2}{2} = 3$ cách chứ không phải $\binom{4}{2} = 6$ cách (vì chọn $\{A, B\}$ trước rồi còn lại $\{C, D\}$ trùng khít với chọn $\{C, D\}$ trước rồi còn lại $\{A, B\}$!).
> 3. **Dừng Bù trừ Quá Sớm Khi Giao Bậc Hai Khác Không:** Trong Ví dụ 2 nếu tổng số lô là $16$ thay vì $12$, giao $B_i \cap B_j$ sẽ có nghiệm ($7 + 7 + 1 + 1 = 16$); quên cộng trả lại $+\binom{4}{2}|B_1 \cap B_2|$ sẽ làm đáp án bị trừ khống!
