# M3.04 — Rò rỉ Nhãn Chồng lấp, Kiểm định Chéo Cắt bỏ, Khoảng Cách ly & Cửa sổ Trượt

## 1. Trực giác & Động lực: Tội ác Chia Tập Xáo Trộn Ngẫu nhiên Trên Dữ liệu Tài chính

Trong lập trình học máy tiêu chuẩn trên dữ liệu bảng độc lập (chấm điểm tín dụng khách hàng hoặc phân loại thư rác), hàm `KFold(n_splits=5, shuffle=True)` của thư viện `scikit-learn` là tiêu chuẩn vàng để ước lượng sai số tổng quát hóa. Thế nhưng, nếu một ứng viên mang thói quen đó áp thẳng vào dữ liệu chuỗi thời gian tài chính trong bài tập về nhà của Jane Street, Citadel hay Two Sigma, bài nộp sẽ bị đánh trượt ngay lập tức dù điểm kiểm định chéo báo cáo cao tới đâu!

Tại sao kiểm định chéo tiêu chuẩn lại sụp đổ thảm hại trong tài chính định lượng? Có **ba cơ chế rò rỉ thông tin cấu trúc** luôn đồng thời tồn tại trên dữ liệu thị trường:
1. **Sự chồng lấp chân trời nhãn dự báo** (Overlapping Label Spans): Tại ngày $t$, để giảm nhiễu vi cấu trúc, nhãn mục tiêu $y_t$ thường đo lợi nhuận tích lũy trong $h$ ngày tới $[t, t+h]$ hoặc thời điểm chạm rào cản chốt lời/cắt lỗ ba biên $[t_{i,0}, t_{i,1}]$. Khi chia ngẫu nhiên (hoặc ngay cả khi cắt khối liền kề mà không cắt mép biên!), quan sát $t$ rơi vào tập kiểm tra nhưng hai hàng xóm sát vách $t-1$ và $t+1$ lại nằm trong tập huấn luyện — chứa sẵn gần như trọn vẹn kết quả tương lai của ngày $t$!
2. **Bộ nhớ tự tương quan dài của ma trận đặc trưng $X_t$**: Các đặc trưng phổ biến như biến động trung bình động mũ 20 ngày, chỉ báo động lượng 60 ngày hay độ lệch chuẩn trượt đều tích hợp thông tin của hàng chục phiên liền trước.
3. **Sự đồng bộ chéo cùng thời điểm** (Contemporaneous Market Co-Movement): Trong ngày Cục Dự trữ Liên bang Mỹ công bố lãi suất, $80\%$ cổ phiếu S&P 500 cùng tăng hoặc cùng giảm. Nếu tại cùng ngày $t$, mã `AAPL` nằm ở tập huấn luyện còn mã `MSFT` nằm ở tập kiểm tra, mô hình cây quyết định chiều sâu lớn sẽ học thuộc lòng cú sốc vĩ mô của ngày $t$ từ `AAPL` để đoán trúng `MSFT`!

---

## 2. Chứng minh Toán học Sự Rò rỉ Nhãn Chồng lấp & Tiền xử lý Trước Chia Tập

### 2.1. Định lượng Tương quan Giả tạo Khi Chia Ngẫu nhiên Chuỗi Bước đi Ngẫu nhiên

Xét một thị trường hoàn toàn hiệu quả không hề có bất kỳ tín hiệu dự báo nào: chuỗi lợi nhuận logarit từng ngày $r_1, r_2, \dots \stackrel{\text{iid}}{\sim} \mathcal{N}(0, \sigma^2)$. Tại mỗi ngày $t$, ta gán nhãn lợi nhuận dự phóng $h$ ngày tới ($h \ge 2$):

$$
y_t = \sum_{j=1}^h r_{t+j}, \qquad \operatorname{Var}(y_t) = h\sigma^2
$$

Xét hai thời điểm $t$ và $t + s$ cách nhau $|s| < h$ ngày. Số lượng ngày giao dịch dùng chung giữa $[t+1, t+h]$ và $[t+s+1, t+s+h]$ là đúng $(h - |s|)$ ngày! Do đó hiệp phương sai và tương quan giữa hai nhãn liền kề khác $0$ rất mạnh dù quá trình gốc là nhiễu trắng độc lập:

$$
\operatorname{Cov}(y_t, y_{t+s}) = (h - |s|)\sigma^2 \implies \operatorname{Corr}(y_t, y_{t+s}) = 1 - \frac{|s|}{h} \qquad (\forall |s| < h)
$$

Giả sử bạn dùng một bộ nhớ láng giềng gần nhất hoặc rừng ngẫu nhiên sâu kết hợp đặc trưng có tính liên tục cao theo thời gian (ví dụ mức giá hoặc biến động trượt nhận diện được vị trí thời gian gần nhau), và chia tập ngẫu nhiên khiến $t$ rơi vào tập kiểm tra trong khi cả hai láng giềng $t-1$ lẫn $t+1$ đều rơi vào tập huấn luyện. Hãy tính phép chiếu tuyến tính dự báo $y_t$ từ trung bình cộng hai láng giềng huấn luyện $\hat{y}_t = \frac{c}{2}(y_{t-1} + y_{t+1})$!

Ta có $\operatorname{Cov}(y_t, y_{t-1} + y_{t+1}) = 2(h - 1)\sigma^2$, trong khi $\operatorname{Var}(y_{t-1} + y_{t+1}) = 2h\sigma^2 + 2(h - 2)\sigma^2 = (4h - 4)\sigma^2$ (với $h \ge 2$). Hệ số xác định ngoài mẫu giả tạo đạt mức kinh hoàng:

$$
R_{\text{leak}}^2 = \frac{\big[\operatorname{Cov}(y_t, \, y_{t-1} + y_{t+1})\big]^2}{\operatorname{Var}(y_t)\,\operatorname{Var}(y_{t-1} + y_{t+1})} = \frac{\big[2(h - 1)\sigma^2\big]^2}{h\sigma^2 \cdot 4(h - 1)\sigma^2} = \frac{h - 1}{h} = 1 - \frac{1}{h}
$$

Hãy dừng lại chiêm nghiệm kết quả này: với chân trời dự báo $h = 10$ ngày trên một **bước đi ngẫu nhiên vô nghĩa 100%**, kiểm định chéo ngẫu nhiên trao cho mô hình quá khớp điểm số ngoài mẫu **$R^2 = \frac{9}{10} = 90\%$**! Ngay khi đem mô hình đó chạy thực tế tại thời điểm hiện tại $T$ (nơi $y_{T+1}$ đương nhiên chưa tồn tại và $y_{T-1}$ chưa đóng nến xong!), $R^2$ lập tức sụp về $0$ và danh mục bốc hơi vì phí giao dịch.

### 2.2. Thí nghiệm Sàng lọc Đặc trưng Trước Khi Chia Tập (Hastie-Tibshirani-Friedman, Mục 7.10)

Một lỗi tinh vi thứ hai cực kỳ phổ biến trong mã nguồn nghiên cứu là thực hiện **chuẩn hóa dữ liệu, phân tích thành phần chính hoặc lọc chọn đặc trưng trên toàn bộ ma trận $[1, T]$ trước khi bước vào vòng lặp kiểm định chéo**:
- Giả sử bạn có $n = 100$ quan sát nhãn nhị phân nhiễu thuần túy $y_i \stackrel{\text{iid}}{\sim} \operatorname{Bernoulli}(0.5)$ và $p = 5{,}000$ đặc trưng nhiễu chuẩn độc lập $X_{ij} \stackrel{\text{iid}}{\sim} \mathcal{N}(0, 1)$ hoàn toàn độc lập với $y$.
- **Quy trình Sai:** Tính tương quan mẫu của toàn bộ $5{,}000$ đặc trưng với $y$ trên đủ $100$ dòng, giữ lại $20$ đặc trưng có $|r_j|$ cao nhất, rồi mới đưa $20$ đặc trưng đó vào kiểm định chéo $5$ phần! Bởi vì $20$ đặc trưng kia đã được tuyển chọn nhờ khớp ngẫu nhiên với nhãn của **cả các dòng kiểm tra**, sai số kiểm định chéo sẽ báo cáo độ chính xác phân loại $\approx 75\%\text{–}80\%$ dù sự thật ngoài mẫu là đúng $50\%$!
- **Quy tắc Bất khả Xâm phạm:** Mọi phép biến đổi học tham số từ dữ liệu — từ trung bình/độ lệch chuẩn chuẩn hóa, ngưỡng cắt phân vị ngoại lai, vector riêng thành phần chính, cho tới trọng số hồi quy và chọn đặc trưng — **bắt buộc phải khớp độc lập bên trong từng tập huấn luyện con**, rồi mới đóng băng tham số đó áp sang tập kiểm tra!

---

## 3. Trọng số Độc nhất Mẫu Chồng lấp (Sample Uniqueness)

Trước khi sửa quy trình chia tập, ngay bên trong tập huấn luyện, việc các nhãn chồng lấp lên nhau cũng vi phạm giả thiết mẫu độc lập của cây quyết định và hồi quy. Theo Marcos López de Prado (2018), giả sử mẫu thứ $i \in \{1, \dots, I\}$ được gán nhãn phụ thuộc vào quỹ đạo giá trên đoạn thời gian $[t_{i,0}, t_{i,1}]$ (ví dụ phương pháp rào cản ba biên dừng tại $t_{i,1}$).

Đặt hàm chỉ báo hoạt động $\mathbb{I}_{t,i} = 1$ nếu $t \in [t_{i,0}, t_{i,1}]$ và $0$ nếu ngược lại. Tại mỗi mốc thời gian cơ sở $t \in \{1, \dots, T\}$, **mức độ đồng thời** (Concurrency) đếm tổng số nhãn đang cùng chia sẻ cú sốc giá tại thời điểm $t$:

$$
c_t = \sum_{i=1}^I \mathbb{I}_{t,i}
$$

Độ độc nhất tức thời của mẫu $i$ tại thời điểm $t$ là $u_{t,i} = \frac{\mathbb{I}_{t,i}}{c_t}$, và **Độ Độc nhất Trung bình** của mẫu $i$ trên suốt vòng đời nhãn của nó được định nghĩa là:

$$
\bar{u}_i = \left( \sum_{t = t_{i,0}}^{t_{i,1}} \mathbb{I}_{t,i} \right)^{-1} \sum_{t = t_{i,0}}^{t_{i,1}} \frac{\mathbb{I}_{t,i}}{c_t} \in (0, 1]
$$

Khi huấn luyện mô hình (qua tham số trọng số mẫu trong hồi quy điều chuẩn hoặc cây tăng cường độ dốc), việc gán trọng số tỷ lệ thuận với $\bar{u}_i$ ngăn chặn hoàn toàn tình trạng một giai đoạn thị trường biến động kéo dài có hàng chục nhãn chồng chéo thống trị hàm mất mát so với các giai đoạn độc lập khác.

### 3.1. Thuật toán Lấy mẫu Có Hoàn lại Tuần tự (Sequential Bootstrap)

Đối với rừng ngẫu nhiên (Random Forest), nếu lấy mẫu đồng đều có hoàn lại $I$ lần từ $I$ nhãn chồng lấp, xác suất rút trùng các sự kiện cùng cụm thời gian vẫn rất cao, làm suy giảm nghiêm trọng tính đa dạng giữa các cây quyết định. Thuật toán lấy mẫu tuần tự khắc phục triệt để bằng cách **cập nhật động xác suất rút thăm** sau từng lượt bốc:

Giả sử sau $m - 1$ lượt bốc đầu tiên, ta đã chọn được dãy chỉ số $\mathcal{S}^{(m-1)} = \{i_1, \dots, i_{m-1}\}$. Xét ứng viên $k \in \{1, \dots, I\}$ cho lượt bốc thứ $m$: nếu thêm $k$ vào túi hiện tại, mức độ đồng thời giả định tại thời điểm $t$ sẽ là $c_{t,k}^{(m)} = 1 + \sum_{j \in \mathcal{S}^{(m-1)}} \mathbb{I}_{t,j}$ trên mọi $t$ mà $\mathbb{I}_{t,k} = 1$. Độ độc nhất biên của ứng viên $k$ đối với các mẫu đã bốc và phân phối xác suất bốc lượt $m$ được xác định bởi:

$$
\bar{u}_k^{(m)} = \left( \sum_{t = t_{k,0}}^{t_{k,1}} \mathbb{I}_{t,k} \right)^{-1} \sum_{t = t_{k,0}}^{t_{k,1}} \frac{\mathbb{I}_{t,k}}{1 + \sum_{j \in \mathcal{S}^{(m-1)}} \mathbb{I}_{t,j}}, \qquad \delta_k^{(m)} = \frac{\bar{u}_k^{(m)}}{\sum_{r=1}^I \bar{u}_r^{(m)}}
$$

*Kiểm chứng nhanh trên ví dụ 3 nhãn trên trục $t \in \{1, 2, 3, 4\}$:* Nhãn 1 chiếm $[1, 3]$, Nhãn 2 chiếm $[2, 3]$ (chồng khít lên Nhãn 1!), còn Nhãn 3 chiếm $[3, 4]$. Ở lượt bốc đầu tiên ($\mathcal{S}^{(0)} = \emptyset$), cả ba nhãn có xác suất đều $1/3$. Giả sử lượt 1 bốc trúng Nhãn 1 ($\mathcal{S}^{(1)} = \{1\}$): sang lượt 2, Nhãn 2 trùng hoàn toàn với Nhãn 1 trên cả $t=2, 3$ nên $\bar{u}_2^{(2)} = \frac{1}{2}\left(\frac{1}{2} + \frac{1}{2}\right) = 0.50$, trong khi Nhãn 3 có điểm $t=4$ hoàn toàn mới nên $\bar{u}_3^{(2)} = \frac{1}{2}\left(\frac{1}{2} + \frac{1}{1}\right) = 0.75$ — tự động được ưu tiên xác suất bốc cao gấp rưỡi Nhãn 2!

---

## 4. Kiểm định Chéo Cắt bỏ & Khoảng Cách ly Hậu Kiểm tra

### 4.1. Điều kiện Toán học Chính xác của Cắt bỏ Vùng Giao thoa

Chia trục thời gian có thứ tự $\{1, \dots, T\}$ thành $K$ khối thời gian liên tục rời nhau $G_1, G_2, \dots, G_K$ (tuyệt đối không xáo trộn thứ tự thời gian, và tại mỗi thời điểm $t$, toàn bộ $N$ mã cổ phiếu trên lát cắt ngang phải nằm chung trong cùng một khối!). Trong lượt kiểm định dùng khối $G_k$ làm tập kiểm tra $\mathcal{S}_{\text{test}}$, mọi mẫu kiểm tra $j \in \mathcal{S}_{\text{test}}$ có khoảng thời gian hình thành nhãn $[t_{j,0}, t_{j,1}]$.

**Quy tắc Kiểm định Chéo Cắt bỏ** (Purged K-Fold Cross-Validation): *Một mẫu $i \notin \mathcal{S}_{\text{test}}$ bị **loại bỏ hoàn toàn** khỏi tập huấn luyện nếu khoảng thời gian nhãn $[t_{i,0}, t_{i,1}]$ của nó có giao khác rỗng với bất kỳ khoảng thời gian nhãn $[t_{j,0}, t_{j,1}]$ nào thuộc tập kiểm tra:*

$$
\mathcal{S}_{\text{train}}^{\text{purged}} = \Big\{ i \notin \mathcal{S}_{\text{test}} \;:\; \forall j \in \mathcal{S}_{\text{test}}, \quad \max(t_{i,0}, t_{j,0}) > \min(t_{i,1}, t_{j,1}) \Big\}
$$

Nếu tập kiểm tra là một khối liền mạch duy nhất có điểm khởi đầu sớm nhất $t_{\min}^{\text{test}} = \min_{j \in \mathcal{S}_{\text{test}}} t_{j,0}$ và điểm kết thúc nhãn muộn nhất $t_{\max}^{\text{test}} = \max_{j \in \mathcal{S}_{\text{test}}} t_{j,1}$, việc cắt bỏ tác động lên **cả hai đầu biên** của khối kiểm tra (trường hợp khối kiểm tra nằm ở giữa lịch sử, tức có dữ liệu huấn luyện cả ở phía trước lẫn phía sau nó!):
- **Ở biên trái — trước tập kiểm tra:** Loại bỏ mọi mẫu huấn luyện $i$ khởi phát trước $t_{\min}^{\text{test}}$ nhưng chân trời nhãn vươn tràn vào trong tập kiểm tra ($t_{i,0} < t_{\min}^{\text{test}} \le t_{i,1}$).
- **Ở biên phải — ngay sau tập kiểm tra:** Loại bỏ mọi mẫu huấn luyện $i$ khởi phát sau khi tập kiểm tra bắt đầu nhưng trước khi các nhãn cuối cùng của tập kiểm tra kết thúc ($t_{i,0} \le t_{\max}^{\text{test}}$).

### 4.2. Khoảng Cách ly Sau Tập Kiểm tra

Tại sao đã cắt sạch phần giao thoa nhãn rồi mà thông tin vẫn còn có thể rò rỉ ở biên phải? Bởi vì trong kiểm định chéo $K$ phần (khác với trượt xuôi một chiều), khi khối kiểm tra $G_k$ nằm ở năm 2021 còn khối $G_{k+1}$ ở đầu năm 2022 được đưa vào tập huấn luyện: giả sử đặc trưng $X_i$ tại tuần đầu năm 2022 được tính bằng tốc độ thay đổi khối lượng hoặc biến động trượt 20 ngày nhìn lùi về cuối năm 2021. Khi đó vector đặc trưng $X_i$ của tập huấn luyện phía sau đang chứa trực tiếp các cú sốc giá vừa diễn ra trong tập kiểm tra $G_k$!

Để chặt đứt nốt kênh tự tương quan đặc trưng này, ta áp đặt thêm một **Khoảng Cách ly** (Embargo Period) độ dài $h_{\text{emb}}$ (thường chọn lớn hơn độ dài cửa sổ nhìn lùi của đặc trưng $\ell_X$, hoặc xấp xỉ $1\%\text{–}2\%$ tổng độ dài chuỗi $T$) **ngay liền sau biên phải** của mỗi khối kiểm tra. Hợp nhất cả hai điều kiện cắt bỏ giao thoa nhãn và cách ly tự tương quan đặc trưng cho một khối kiểm tra bao đóng $[t_{\min}^{\text{test}}, t_{\max}^{\text{test}}]$, tập huấn luyện hợp lệ cuối cùng là:

$$
\mathcal{S}_{\text{train}}^{\text{clean}} = \Big\{ i \in \{1, \dots, I\} \;:\; t_{i,1} < t_{\min}^{\text{test}} \;\;\text{hoặc}\;\; t_{i,0} > t_{\max}^{\text{test}} + h_{\text{emb}} \Big\}
$$

---

## 5. Cửa sổ Bước tiến Trượt so với Kiểm định Chéo Tổ hợp Cắt bỏ

Trong thực tế vận hành, hai phương pháp thẩm định mô hình chủ đạo có ưu nhược điểm bổ khuyết rõ rệt:

| Đặc tính kỹ thuật | Kiểm thử Bước tiến Trượt (Walk-Forward) | Kiểm định Chéo Tổ hợp (`CPCV`) |
| :--- | :--- | :--- |
| **Cấu trúc thời gian** | Tuân thủ mũi tên nhân quả nghiêm ngặt: huấn luyện $[t - W, t]$, kiểm tra $[t + h_{\text{purge}}, t + \Delta]$. | Chia lịch sử thành $N$ khối, lấy mọi tổ hợp $k$ khối làm tập kiểm tra có cắt bỏ và cách ly tại mọi ranh giới tiếp giáp. |
| **Số lượng quỹ đạo kiểm thử ngoài mẫu** | **Chỉ duy nhất $1$ đường lịch sử thực hiện** — rất dễ vô tình tinh chỉnh siêu tham số khớp đúng duy nhất chuỗi sự kiện lịch sử đó! | Tạo ra **$\varphi(N, k) = \binom{N - 1}{k - 1}$ đường kiểm thử ngoài mẫu hoàn chỉnh** để ước lượng toàn bộ phân phối tỷ số Sharpe! |
| **Sử dụng dữ liệu đầu chuỗi** | Giai đoạn khởi động $W$ năm đầu tiên không bao giờ được kiểm tra ngoài mẫu. | Mọi khối thời gian từ đầu đến cuối chuỗi đều xuất hiện đúng $\binom{N - 1}{k - 1}$ lần trong vai trò ngoài mẫu. |
| **Đánh đổi Mở rộng vs Cửa sổ Cố định $W$** | Cửa sổ mở rộng giảm phương sai ước lượng khi thị trường dừng; cửa sổ trượt cố định $W$ thích nghi nhanh hơn khi chế độ thị trường dịch chuyển. | Thích hợp nhất để đo **Xác suất Quá khớp Kiểm thử** trước khi khóa siêu tham số đưa vào chạy bước tiến cuối cùng. |

### 5.1. Chứng minh Công thức Số Đường Ngoài Mẫu $\varphi(N, k)$ và Đo lường Xác suất Quá khớp

Chia chuỗi $T$ thành $N$ khối thời gian rời nhau. Mỗi lần chọn $k$ khối làm tập kiểm tra (và $N - k$ khối còn lại sau khi cắt biên/cách ly làm tập huấn luyện), ta có tổng cộng $\binom{N}{k}$ phép chia mô hình. Trên toàn bộ $\binom{N}{k}$ phép chia này, tổng số lượt khối kiểm tra được dự báo là $k \binom{N}{k}$. Do tính đối xứng tổ hợp hoàn hảo, mỗi một trong $N$ khối thời gian được dự báo ngoài mẫu chính xác số lần bằng nhau là:

$$
\varphi(N, k) = \frac{k}{N} \binom{N}{k} = \frac{k}{N} \cdot \frac{N!}{k!(N - k)!} = \binom{N - 1}{k - 1}
$$

Ghép các dự báo ngoài mẫu của cùng một lượt cho từng khối $1, 2, \dots, N$ theo thứ tự thời gian sẽ lắp ghép thành đúng **$\binom{N - 1}{k - 1}$ đường cong tài sản ngoài mẫu độc lập cấu trúc** có độ dài trọn vẹn từ $1$ đến $T$! Ví dụ chỉ với $N = 6$ khối và $k = 2$ khối kiểm tra mỗi lượt: ta huấn luyện $\binom{6}{2} = 15$ lượt và thu về $\binom{5}{1} = \mathbf{5}$ quỹ đạo kiểm thử hoàn chỉnh thay vì chỉ $1$ quỹ đạo đơn độc!

Hơn thế nữa, khi có $M$ cấu hình chiến lược ứng viên, trên mỗi tổ hợp chia $c \in \{1, \dots, \binom{N}{k}\}$ (thường chọn $k = N/2$ chẵn), gọi $m_c^\star$ là cấu hình đạt tỷ số Sharpe **trong mẫu cao nhất**, và gọi $\omega_c \in (0, 1)$ là **thứ hạng phần trăm tương đối ngoài mẫu** của chính cấu hình $m_c^\star$ đó so với $M$ đối thủ trên tập kiểm tra tương ứng. Bailey, Borwein, López de Prado và Zhu (2017) định nghĩa biến logit thứ hạng $\lambda_c = \ln\frac{\omega_c}{1 - \omega_c}$ và đo **Xác suất Quá khớp Kiểm thử** (Probability of Backtest Overfitting — `PBO`):

$$
\text{PBO} \triangleq \mathbb{P}\big(\lambda_c < 0\big) \approx \frac{1}{\binom{N}{N/2}} \sum_{c=1}^{\binom{N}{N/2}} \mathbb{I}\!\left(\omega_c < \frac{1}{2}\right)
$$

Nếu $\text{PBO} > 0.50$, chiến lược đứng đầu bảng trong mẫu lại thường xuyên rơi xuống **nửa dưới trung vị** khi bước sang ngoài mẫu — dấu hiệu toán học không thể chối cãi rằng quá trình chọn lọc tham số chỉ đang học thuộc nhiễu!

> [!NOTE]
> **Ví dụ Định lượng Nhanh về Ma trận Lắp ghép Đường Ngoài Mẫu của `CPCV` ($N = 6, k = 2$):**
> Giả sử bạn chia 6 năm dữ liệu thành $N = 6$ khối $G_1, \dots, G_6$ (mỗi khối 1 năm) và chọn $k = 2$ khối làm kiểm tra mỗi lượt, tạo ra $\binom{6}{2} = 15$ lượt huấn luyện đánh số $s = 1, \dots, 15$. Mỗi khối năm $G_m$ xuất hiện trong vai trò tập kiểm tra ở đúng $\varphi(6, 2) = \binom{5}{1} = 5$ lượt khác nhau:
> - Lần xuất hiện kiểm tra thứ nhất của từng khối $G_1, G_2, G_3, G_4, G_5, G_6$ ghép nối tiếp nhau tạo thành **Đường Ngoài Mẫu Hoàn chỉnh số 1**;
> - Lần xuất hiện kiểm tra thứ hai của từng khối ghép thành **Đường Ngoài Mẫu Hoàn chỉnh số 2**, v.v. cho tới đủ **5 đường kiểm thử độc lập dài đủ 6 năm**!
> Từ 5 tỷ số Sharpe ngoài mẫu $(\widehat{SR}^{(1)}, \dots, \widehat{SR}^{(5)})$, bạn tính được ngay cả trung bình lẫn độ lệch chuẩn của hiệu năng ngoài mẫu trước các kịch bản chế độ vĩ mô đảo thứ tự khác nhau, thay vì đặt cược toàn bộ vốn vào một chuỗi lịch sử duy nhất!

---

## 6. Ví dụ Phỏng vấn Thực chiến: Tính Toán Chỉ số Cắt bỏ & Cách ly Cụ thể

**Đề bài (Bài thi Thiết kế Hệ thống Nghiên cứu — Trexquant / WorldQuant):**
Bạn có chuỗi dữ liệu $T = 1{,}000$ ngày giao dịch đánh số $t \in \{1, 2, \dots, 1000\}$. Tại mỗi ngày $t$ ($1 \le t \le 990$), mẫu thứ $t$ sử dụng đặc trưng trung bình động nhìn lùi $\ell_X = 15$ phiên $[t - 14, t]$ để dự báo nhãn lợi nhuận $h = 10$ phiên tới có khoảng thời gian hình thành nhãn $[t, t + 10]$ (tức $t_{i,0} = i, \, t_{i,1} = i + 10$).
Bạn chia tập mẫu $I = 990$ thành $K = 5$ khối đều nhau ($198$ mẫu/khối), và đang xét lượt thứ 3 trong đó khối kiểm tra là $G_3 = \{397, 398, \dots, 594\}$. Áp dụng kiểm định chéo cắt bỏ kèm khoảng cách ly $h_{\text{emb}} = 15$ ngày:
1. Xác định chính xác tập chỉ số mẫu bị cắt bỏ ở biên trái (thuộc $G_2$) và biên phải (thuộc $G_4$).
2. Xác định thêm các chỉ số mẫu bị loại bởi khoảng cách ly $h_{\text{emb}} = 15$, và tính tổng kích thước tập huấn luyện hợp lệ còn lại.

**Lời giải Chi tiết Từng Mốc Chỉ số:**
1. **Xác định bao đóng thời gian nhãn của tập kiểm tra $G_3 = \{397, \dots, 594\}$:**
   - Điểm bắt đầu sớm nhất: $t_{\min}^{\text{test}} = t_{397, 0} = 397$.
   - Điểm kết thúc nhãn muộn nhất: mẫu cuối $j = 594$ có nhãn kéo dài tới $t_{\max}^{\text{test}} = 594 + 10 = \mathbf{604}$!
2. **Cắt bỏ vùng giao thoa nhãn:**
   - *Biên trái ($i < 397$):* Mẫu $i$ giao cắt với $[397, 604]$ khi và chỉ khi $t_{i,1} = i + 10 \ge 397 \iff i \ge 387$. Vậy ta phải cắt bỏ **$10$ mẫu** cuối khối $G_2$: $\{387, 388, \dots, 396\}$ (đúng công thức $t_{i,1} < 397 \iff i \le 386$).
   - *Biên phải ($i > 594$):* Mẫu $i$ khởi đầu trước hoặc ngay tại lúc nhãn cuối của $G_3$ kết thúc khi $t_{i,0} = i \le 604$. Vậy cắt bỏ **$10$ mẫu** đầu khối $G_4$: $\{595, 596, \dots, 604\}$.
3. **Áp khoảng cách ly đặc trưng $h_{\text{emb}} = 15$ ngày sau $t_{\max}^{\text{test}} = 604$:**
   - Cấm tiếp mọi mẫu có $t_{i,0} \in (604, \, 604 + 15] = \{605, 606, \dots, 619\}$, tức loại thêm **$15$ mẫu** kế tiếp trong $G_4$! Kiểm tra nhân quả: tại mẫu đầu tiên được giữ lại bên phải là $i = 620$, cửa sổ đặc trưng nhìn lùi 15 phiên $[606, 620]$ hoàn toàn nằm sau mốc $604$, không chạm bất kỳ ngày nào của nhãn kiểm tra $G_3$!
   - **Tổng kết kích thước tập huấn luyện sạch:** Từ $990$ mẫu tổng cộng, trừ đi $198$ mẫu kiểm tra $G_3$, $10$ mẫu cắt trái, $10$ mẫu cắt phải và $15$ mẫu cách ly, tập huấn luyện sạch còn lại đúng $990 - 198 - 10 - 10 - 15 = \mathbf{757}$ mẫu!

---

## 7. Những Sai lầm Chí mạng Trong Kiến trúc Kiểm thử Học máy Tài chính

> [!WARNING]
> **Ba Lỗ hổng Kiến trúc Phá hỏng Mọi Hệ thống Kiểm định Chéo Trong Thực tế:**
> 1. **Chia Tập Theo Hàng Dữ liệu Thay Vì Theo Trục Ngày Lịch (`Group-by-Date`):** Trên dữ liệu bảng gồm $3{,}000$ mã cổ phiếu $\times 1{,}000$ ngày $= 3{,}000{,}000$ dòng, nếu bạn chưa sắp xếp và gom nhóm cứng toàn bộ $3{,}000$ mã của cùng ngày $t$ vào cùng một khối mà cắt chỉ số dòng tùy tiện, ngày biên giới sẽ bị xẻ đôi cho cả huấn luyện lẫn kiểm tra, rò rỉ ngay lập tức nhân tố thị trường trong ngày đó!
> 2. **Tái Sử dụng Tập Kiểm tra Cuối Cùng Để Chọn Kiến trúc ("Rò rỉ Cấp độ Siêu Tham số"):** Ngay cả khi dùng `CPCV` hoàn hảo để chọn ra mô hình tốt nhất trong $500$ mô hình, bản thân điểm số `CPCV` của người chiến thắng vẫn chịu thiên lệch tuyển chọn đa kiểm định đã học ở Bài `M3.03`! Bắt buộc phải khóa kín hoàn toàn một **Khoang Kiểm chứng Ngoài Mẫu Cuối cùng** (Hold-out Vault — ví dụ 2 năm cuối cùng như thiết kế của Đồ án `CAP-01`) chỉ được phép bấm chạy đúng một lần duy nhất trước khi đưa vào sản xuất.
> 3. **Dùng Đặc trưng Trung bình Động Mũ Chuỗi Vô hạn Mà Không Cắt Cửa sổ Khởi tạo:** Một bộ lọc trung bình động mũ $E_t = (1 - \alpha) E_{t-1} + \alpha X_t$ về mặt toán học mang bộ nhớ suy giảm hàm mũ từ tận đầu chuỗi thời gian $t = 0$. Khi tính đặc trưng cho khối huấn luyện nằm sau khối kiểm tra, hãy đảm bảo khoảng cách ly $h_{\text{emb}}$ lớn gấp ít nhất $3$ lần chu kỳ bán rã của bộ lọc (để trọng số rò rỉ còn dưới $12.5\%$ của nhiễu biên) hoặc khởi tạo lại bộ lọc bên trong từng phân đoạn độc lập!
