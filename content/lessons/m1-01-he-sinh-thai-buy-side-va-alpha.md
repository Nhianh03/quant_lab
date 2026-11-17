# M1.01 — Hệ sinh thái Phía Mua, Độ đo P so với Độ đo Q & Bản chất của Alpha

## 1. Trực giác & Động lực Thị trường: Hai Thế giới của Toán Tài chính

Khi một kỹ sư phần mềm bắt đầu tìm hiểu tài chính định lượng (Quantitative Finance), rào cản lớn nhất không nằm ở độ khó của giải tích ngẫu nhiên hay đại số tuyến tính, mà nằm ở sự nhầm lẫn giữa hai nhánh nghề nghiệp có mục tiêu toán học hoàn toàn đối lập nhau trên Phố Wall: **định giá phái sinh phía bán** (Sell-Side Derivatives Pricing) và **nghiên cứu dự báo phía mua** (Buy-Side Quantitative Research).

Hãy hình dung sòng bài và bàn cá cược thể thao dưới góc nhìn của một kỹ sư hệ thống:

- Tại một ngân hàng đầu tư như Goldman Sachs, Morgan Stanley hay J.P. Morgan, bộ phận định lượng bàn giao dịch đóng vai trò nhà cung cấp sản phẩm cấu trúc. Khi khách hàng doanh nghiệp muốn mua một quyền chọn ngoại hối kỳ hạn sáu tháng phức tạp, nhà toán học tại ngân hàng không cố đoán xem tỷ giá EUR/USD sáu tháng tới tăng hay giảm. Thay vào đó, họ giải bài toán **nội suy và phòng vệ động**: nếu giá tài sản cơ sở hôm nay đang là $S_0$ và các quyền chọn tiêu chuẩn trên thị trường đang giao dịch ở mặt phẳng biến động ngụ ý đã biết, thì quyền chọn kỳ dị kia phải có giá hợp lý bằng bao nhiêu để không ai có thể trục lợi phi rủi ro, đồng thời ngân hàng cần mua bán bao nhiêu đơn vị tài sản cơ sở mỗi phút để triệt tiêu rủi ro biến động giá?
- Ngược lại, tại các quỹ đầu cơ định lượng như WorldQuant, Citadel, Millennium, Point72 Cubist, Two Sigma hay Squarepoint Capital, bạn không nhận phí hoa hồng tạo lập cấu trúc từ khách hàng. Bạn trực tiếp phân bổ vốn vào thị trường dựa trên các dự báo thống kê có lợi thế nhỏ nhưng lặp lại hàng vạn lần. Câu hỏi sống còn duy nhất là: *Dựa trên luồng thông tin lịch sử và vi cấu trúc hiện tại $\mathcal{F}_t$, phân phối xác suất thực sự của lợi nhuận tương lai ở ngày mai hoặc năm phút tới lệch đi đâu so với sự đồng thuận của đám đông?*

Sự chia tách về mô hình kinh doanh này dẫn thẳng tới sự phân nhánh toán học nền tảng giữa hai độ đo xác suất trên cùng một không gian mẫu thị trường.

---

## 2. Độ đo Vật lý $\mathbb{P}$ so với Độ đo Trung hòa Rủi ro $\mathbb{Q}$

### 2.1. Định nghĩa Hình thức qua Nhân tử Chiết khấu Ngẫu nhiên

Xét không gian xác suất có luồng lọc thông tin $(\Omega, \mathcal{F}, (\mathcal{F}_t)_{t \ge 0}, \mathbb{P})$, trong đó $\mathbb{P}$ là **độ đo xác suất vật lý** (Physical Probability Measure) mô tả tần suất xảy ra thực tế của các trạng thái thế giới trong tự nhiên và nền kinh tế. Dưới $\mathbb{P}$, một cổ phiếu rủi ro cao bắt buộc phải mang lại lợi nhuận kỳ vọng $\mu_i = \mathbb{E}^{\mathbb{P}}[R_{i, t+1} \mid \mathcal{F}_t]$ cao hơn lãi suất phi rủi ro $r_f$, bởi các nhà đầu tư trên thị trường ghét rủi ro và đòi hỏi phần bù rủi ro dương để nắm giữ tài sản biến động mạnh trong giai đoạn suy thoái.

Tuy nhiên, theo Định lý Cơ bản Thứ nhất của Định giá Tài sản (First Fundamental Theorem of Asset Pricing), một thị trường không tồn tại cơ hội kinh doanh chênh lệch giá không rủi ro khi và chỉ khi tồn tại ít nhất một **độ đo trung hòa rủi ro** (Risk-Neutral Measure) $\mathbb{Q}$ tương đương với $\mathbb{P}$ (tức $\mathbb{P}(A) = 0 \iff \mathbb{Q}(A) = 0$ với mọi $A \in \mathcal{F}$) sao cho giá của mọi tài sản giao dịch được sau khi chiết khấu theo lãi suất phi rủi ro đều trở thành một quá trình Martingale dưới $\mathbb{Q}$:

$$
S_t = \mathbb{E}^{\mathbb{Q}}\left[ e^{-r_f (T - t)} S_T \,\middle|\, \mathcal{F}_t \right]
$$

Mối liên hệ giải tích giữa hai thế giới được nối qua quá trình mật độ đạo hàm Radon-Nikodym $Z_t = \left.\frac{d\mathbb{Q}}{d\mathbb{P}}\right|_{\mathcal{F}_t} > 0$ (một $\mathbb{P}$-Martingale có $\mathbb{E}^{\mathbb{P}}[Z_T \mid \mathcal{F}_t] = Z_t$). Theo quy tắc Bayes trừu tượng khi đổi độ đo có điều kiện $\mathbb{E}^{\mathbb{Q}}[X \mid \mathcal{F}_t] = \frac{\mathbb{E}^{\mathbb{P}}[Z_T X \mid \mathcal{F}_t]}{Z_t}$, ta định nghĩa **nhân tử chiết khấu ngẫu nhiên** (Stochastic Discount Factor) $M_{t,T} = e^{-r_f(T - t)} \frac{\left.(d\mathbb{Q}/d\mathbb{P})\right|_{\mathcal{F}_T}}{\left.(d\mathbb{Q}/d\mathbb{P})\right|_{\mathcal{F}_t}} = e^{-r_f(T - t)} \frac{Z_T}{Z_t}$ (sao cho $\mathbb{E}^{\mathbb{P}}[M_{t,T} \mid \mathcal{F}_t] = e^{-r_f(T - t)}$ nghiệm đúng với mọi $t \ge 0$), từ đó thu được phân rã:

$$
S_t = \mathbb{E}^{\mathbb{P}}\left[ M_{t,T} \, S_T \,\middle|\, \mathcal{F}_t \right] = e^{-r_f(T-t)} \mathbb{E}^{\mathbb{P}}[S_T \mid \mathcal{F}_t] + \operatorname{Cov}^{\mathbb{P}}(M_{t,T}, S_T \mid \mathcal{F}_t)
$$

Biểu thức hiệp phương sai $\operatorname{Cov}^{\mathbb{P}}(M_{t,T}, S_T \mid \mathcal{F}_t)$ chứa đựng bản chất kinh tế sắc bén: nhân tử $M_{t,T}$ phản ánh biên độ hữu dụng cận biên của đồng tiền và có giá trị rất cao trong các kịch bản khủng hoảng khan hiếm tiền mặt. Một cổ phiếu sụp đổ đúng lúc kinh tế suy thoái có $\operatorname{Cov}^{\mathbb{P}}(M_{t,T}, S_T) < 0$, khiến giá hiện tại $S_t$ bị chiết khấu sâu hơn và do đó tạo ra lợi nhuận kỳ vọng thực tế $\mathbb{E}^{\mathbb{P}}[R_{t,T}] > r_f$. Khi chuyển từ $\mathbb{P}$ sang $\mathbb{Q}$ thông qua định lý Girsanov trong thời gian liên tục, toàn bộ hệ số trôi thực tế $\mu_i$ bị thay thế cưỡng bức bằng lãi suất phi rủi ro $r_f$ bằng cách dịch chuyển tâm phân phối xác suất sang các trạng thái xấu.

| Tiêu chí Đối chiếu | Định lượng Độ đo $\mathbb{Q}$ (Phía Bán) | Định lượng Độ đo $\mathbb{P}$ (Phía Mua) |
| :--- | :--- | :--- |
| **Mục tiêu cốt lõi** | Nội suy nhất quán giá phái sinh & tính hệ số phòng vệ $\Delta, \Gamma, \mathcal{V}$ | Dự báo phân phối lợi nhuận tương lai & tối ưu hóa danh mục đầu tư |
| **Nguồn dữ liệu chính** | Lát cắt bề mặt biến động ngụ ý và đường cong lãi suất hiện tại | Chuỗi lịch sử sổ lệnh, giá - khối lượng, báo cáo tài chính, dữ liệu thay thế |
| **Công cụ toán học chủ đạo** | Phương trình đạo hàm riêng, giải tích Itô, cây nhị thức, hiệu chỉnh mô hình | Thống kê nhiễu cao, học máy, đại số ma trận ngẫu nhiên, tối ưu hóa lồi |
| **Tiêu chuẩn thành công** | Sai số khớp giá thị trường nhỏ, chi phí tái phòng vệ thấp | Tỷ số Sharpe ngoài mẫu cao sau khi trừ phí giao dịch, sụt giảm vốn thấp |
| **Tỷ số Tín hiệu trên Nhiễu** | Rất cao (quan hệ kế toán & không kinh doanh chênh lệch giá gần như tất định) | Cực thấp ($\text{SNR} \ll 1$, hệ số tương quan dự báo thường chỉ từ $0.01$ đến $0.04$) |

> [!IMPORTANT]
> Toàn bộ chương trình huấn luyện này tập trung 100% vào thế giới **độ đo $\mathbb{P}$ của phía mua**. Trong vòng phỏng vấn Quantitative Researcher tại các quỹ đầu cơ Mỹ, bạn gần như không bao giờ bị yêu cầu giải phương trình đạo hàm riêng Black-Scholes cho quyền chọn rào cản kỳ dị, nhưng chắc chắn sẽ phải giải quyết bài toán cập nhật xác suất Bayes, bước đi ngẫu nhiên, hồi quy tuyến tính có tỷ số tín hiệu trên nhiễu bằng $0.02$ và kiểm soát chi phí trượt giá khi giao dịch.

---

## 3. Cấu trúc Tổ chức Quỹ Đầu cơ: Đa Quản lý (Pod Shop) so với Đơn Quản lý

Không phải mọi quỹ đầu cơ định lượng đều vận hành giống nhau. Cấu trúc phân bổ vốn và cơ chế quản trị rủi ro của từng tổ chức định hình trực tiếp loại tín hiệu mà bạn được phép nghiên cứu. Trên thị trường Mỹ hiện nay, các tổ chức tuyển dụng lớn nhất chia thành hai mô hình kiến trúc rõ rệt:

### 3.1. Quỹ Đơn Quản lý Hợp nhất (Single-Manager Collaborative Funds)

Các quỹ tiêu biểu bao gồm Renaissance Technologies, D. E. Shaw, Two Sigma và mô hình nhà máy tín hiệu tập trung của WorldQuant. Tại đây, hàng trăm nhà nghiên cứu cùng đóng góp các tín hiệu dự báo con vào một kho dữ liệu trung tâm. Một hệ thống tối ưu hóa danh mục bậc cao ở cấp độ toàn quỹ sẽ kết hợp hàng vạn tín hiệu yếu, triệt tiêu các lệnh mua - bán ngược chiều nhau ngay trong nội bộ (internal crossing) trước khi gửi phần chênh lệch ròng ra sàn giao dịch. Nhờ cơ chế hợp nhất này, quỹ chịu được các tín hiệu có chu kỳ hội tụ dài hơn hoặc có mức sụt giảm cục bộ cao miễn là tương quan với phần còn lại của kho tín hiệu bằng không.

### 3.2. Quỹ Đa Quản lý Theo Cụm Độc lập (Multi-Manager Pod Platforms)

Các nền tảng tiêu biểu gồm Millennium Management, Citadel, Point72 (nhánh định lượng Cubist Systematic Strategies), Balyasny Asset Management và Squarepoint Capital. Toàn bộ vốn của quỹ mẹ được chia thành hàng chục đến hàng trăm **cụm danh mục độc lập** (Trading Pods), mỗi cụm do một Nhà quản lý Danh mục (Portfolio Manager — `PM`) đứng đầu cùng đội ngũ từ 2 đến 8 nhà nghiên cứu và kỹ sư dữ liệu.

Mỗi cụm vận hành như một doanh nghiệp nhỏ được quỹ mẹ cấp hạn mức giá trị thị trường gộp (Gross Market Value — `GMV`, chẳng hạn \$500 triệu tổng giá trị vị thế mua cộng vị thế bán trên \$100 triệu vốn gốc phân bổ, tương đương đòn bẩy gộp $5\times$), đi kèm **khung kỷ luật quản trị rủi ro cứng** do bộ phận rủi ro trung tâm giám sát theo thời gian thực:

1. **Ràng buộc Trung hòa Nhân tố Tuyệt đối**: Danh mục của cụm bị ép buộc giữ tổng giá trị ròng bằng không ($\sum_i w_i \approx 0$) và độ nhạy cảm với thị trường chung, nhóm ngành GICS cũng như các nhân tố phong cách chuẩn (Quy mô, Giá trị, Động lượng 12 tháng, Biến động) nằm trong biên độ cực hẹp, ví dụ $|\beta_{\text{market}}| \le 0.03$. Quỹ mẹ không trả phí thưởng hiệu suất $15\%\text{–}20\%$ cho một PM chỉ để người đó âm thầm mua ròng chỉ số S&P 500.
2. **Cơ chế Cắt lỗ Sụt giảm Vốn Tự động (Hard Drawdown Stops)**: Khác với các quỹ đầu tư giá trị có thể gồng lỗ $-20\%$ chờ thị trường hồi phục, một cụm danh mục tại nền tảng đa quản lý phải tuân thủ hai ngưỡng cắt vốn nghiêm ngặt tính từ đỉnh lợi nhuận tích lũy cao nhất (High-Water Mark):
   - **Ngưỡng giảm vốn bậc 1** (thường tại $-4\%$ đến $-5\%$ tính trên hạn mức phân bổ chuẩn hóa): hạn mức vốn giao dịch của cụm lập tức bị cắt giảm một nửa ($50\%$). Việc bị cắt một nửa sức mua ngay ở vùng đáy khiến cụm phải kiếm gấp đôi tỷ suất sinh lời trên phần vốn còn lại mới quay về được đỉnh cũ!
   - **Ngưỡng đóng băng bắt buộc** (thường tại $-7\%$ đến $-10\%$): hệ thống rủi ro trung tâm thu hồi quyền giao dịch, thanh lý toàn bộ vị thế về tiền mặt và giải thể cụm danh mục.

### 3.3. Định lý Đa dạng hóa Cấp độ Nền tảng Đa Cụm

Vì sao các quỹ đa quản lý áp đặt giới hạn sụt giảm khắc nghiệt như vậy nhưng vẫn có thể duy trì tỷ số Sharpe toàn quỹ ở mức $2.5\text{–}4.0$ suốt nhiều thập kỷ? Câu trả lời nằm ở phép cộng phương sai của các cụm trung hòa nhân tố.

**Mệnh đề 1.1 (Nhân bội Tỷ số Sharpe qua Đa dạng hóa Cụm Độc lập).** *Giả sử một quỹ đa chiến lược phân bổ vốn đều vào $M$ cụm giao dịch. Sau khi đã trung hòa hoàn toàn beta thị trường và các nhân tố chung, lợi nhuận phụ trội của cụm $m$ có kỳ vọng $\mu_m = \mu > 0$, độ lệch chuẩn $\sigma_m = \sigma > 0$ (tức tỷ số Sharpe riêng lẻ $\text{SR}_{\text{pod}} = \mu / \sigma$) và hệ số tương quan cặp trung bình giữa hai cụm bất kỳ $m \neq n$ bằng $\bar{\rho} \in [0, 1)$. Khi đó tỷ số Sharpe của danh mục toàn quỹ thỏa mãn:*

$$
\text{SR}_{\text{fund}} = \frac{\text{SR}_{\text{pod}}}{\sqrt{\frac{1}{M} + \left(1 - \frac{1}{M}\right)\bar{\rho}}} \xrightarrow{\bar{\rho} = 0} \sqrt{M} \, \text{SR}_{\text{pod}}
$$

**Chứng minh.** Xét lợi nhuận danh mục trung bình $R_{\text{fund}} = \frac{1}{M} \sum_{m=1}^M R_m$. Theo tính tuyến tính của kỳ vọng, lợi nhuận kỳ vọng toàn quỹ bằng $\mathbb{E}[R_{\text{fund}}] = \frac{1}{M}\sum_{m=1}^M \mu = \mu$. Phương sai của $R_{\text{fund}}$ được khai triển tường minh thành tổng của $M$ phương sai đường chéo và $M(M-1)$ hiệp phương sai ngoài đường chéo:

$$
\operatorname{Var}(R_{\text{fund}}) = \frac{1}{M^2} \left( \sum_{m=1}^M \operatorname{Var}(R_m) + \sum_{m=1}^M \sum_{n \neq m} \operatorname{Cov}(R_m, R_n) \right) = \frac{1}{M^2} \left( M\sigma^2 + M(M-1)\bar{\rho}\sigma^2 \right)
$$

Rút thừa số chung $\sigma^2$ và chia cả tử lẫn mẫu của $\text{SR}_{\text{fund}} = \mathbb{E}[R_{\text{fund}}] / \sqrt{\operatorname{Var}(R_{\text{fund}})}$ cho $\sigma$, ta thu được ngay đẳng thức cần chứng minh. Khi toàn bộ các cụm tuân thủ kỷ luật trung hòa nhân tố khiến tương quan chéo $\bar{\rho} \to 0$, việc kết hợp $M = 25$ cụm mà mỗi cụm chỉ có $\text{SR}_{\text{pod}} = 1.0$ sẽ tạo ra cỗ máy cấp quỹ có $\text{SR}_{\text{fund}} = \sqrt{25} \times 1.0 = 5.0$. Ngược lại, chỉ cần các cụm lén lút phơi nhiễm chung vào một nhân tố ẩn khiến $\bar{\rho}$ tăng vọt lên $0.25$ trong một cú sốc thanh khoản, mẫu số hội tụ cứng về $\sqrt{\bar{\rho}} = 0.5$, kéo trần tỷ số Sharpe toàn quỹ sập xuống tối đa $2.0$ bất chấp số lượng cụm $M \to \infty$! $\blacksquare$

---

## 4. Phân rã Tuyến tính của Lợi nhuận, Bản chất của Alpha & Dung lượng Vốn

### 4.1. Phương trình Tách nhân tố Grinold - Kahn

Theo khung quản trị danh mục chủ động chuẩn mực của Grinold và Kahn (1999), lợi nhuận vượt trội so với lãi suất phi rủi ro $r_{i,t}^e = R_{i,t} - r_{f,t}$ của tài sản thứ $i \in \{1, \dots, N\}$ trong kỳ $t$ được biểu diễn qua mô hình đa nhân tố tuyến tính gồm $K$ nhân tố rủi ro hệ thống $f_{1,t}, \dots, f_{K,t}$:

$$
r_{i,t}^e = \alpha_{i,t} + \sum_{k=1}^K \beta_{i,k,t-1} f_{k,t} + \varepsilon_{i,t}, \qquad \mathbb{E}[\varepsilon_{i,t} \mid \mathcal{F}_{t-1}] = 0, \quad \operatorname{Cov}(\varepsilon_{i,t}, f_{k,t} \mid \mathcal{F}_{t-1}) = 0
$$

Trong biểu thức trên:
- $\beta_{i,k,t-1}$ là **độ nhạy nhân tố tiền định** (đo được hoàn toàn tại thời điểm $t-1$ trước khi kỳ giao dịch bắt đầu, ví dụ beta thị trường ước lượng trượt 252 ngày, chỉ báo ngành công nghệ, hoặc tỷ số giá trị sổ sách trên vốn hóa).
- $f_{k,t}$ là lợi nhuận thực hiện của nhân tố chung thứ $k$ trong kỳ $t$. Tổng $\sum_{k=1}^K \beta_{i,k,t-1} f_{k,t}$ giải thích biến động đồng pha của các cổ phiếu cùng nhóm.
- $\alpha_{i,t} = \mathbb{E}^{\mathbb{P}}\left[ r_{i,t}^e - \sum_{k=1}^K \beta_{i,k,t-1} f_{k,t} \,\middle|\, \mathcal{F}_{t-1} \right]$ là **lợi nhuận kỳ vọng đặc thù có điều kiện** (Conditional Idiosyncratic Expected Return) — đây mới chính là định nghĩa toán học nghiêm ngặt của **Alpha**!
- $\varepsilon_{i,t}$ là cú sốc nhiễu đặc thù không dự báo được của riêng doanh nghiệp $i$ với phương sai $\sigma_{\varepsilon, i}^2$.

Nếu nhà quản lý xây dựng vector trọng số danh mục $\mathbf{w}_{t-1} = (w_{1,t-1}, \dots, w_{N,t-1})^\top$ thỏa mãn đồng thời điều kiện trung hòa tiền mặt $\mathbf{1}^\top \mathbf{w}_{t-1} = 0$ và trung hòa toàn bộ $K$ nhân tố $\mathbf{B}_{t-1}^\top \mathbf{w}_{t-1} = \mathbf{0}$ (với $\mathbf{B}_{t-1} \in \mathbb{R}^{N \times K}$), thì lợi nhuận danh mục $R_{p,t} = \mathbf{w}_{t-1}^\top \mathbf{r}_t^e$ loại bỏ sạch thành phần rủi ro hệ thống:

$$
R_{p,t} = \mathbf{w}_{t-1}^\top \boldsymbol{\alpha}_t + \mathbf{w}_{t-1}^\top \boldsymbol{\varepsilon}_t
$$

### 4.2. Hệ thống Phân loại Nguồn gốc Alpha (Alpha Taxonomy)

Trong một thị trường cạnh tranh khốc liệt, tại sao $\alpha_{i,t} \neq 0$ lại tồn tại? Một nhà nghiên cứu định lượng không bao giờ tin vào một dãy công thức chỉ vì nó cho đường lợi nhuận đi lên trên tập mẫu lịch sử; mọi tín hiệu bền vững đều phải bắt nguồn từ ít nhất một trong ba cơ chế kinh tế thực tiễn sau:

1. **Alpha Cấu trúc & Vi cấu trúc (Structural & Institutional Friction Alpha)**: Phát sinh từ các quy tắc giao dịch bắt buộc không nhạy cảm với giá của các định chế lớn. Ví dụ điển hình gồm: lực mua/bán cưỡng bức của các quỹ chỉ số thụ động vào phiên đóng cửa ngày tái cân bằng rổ Russell 2000 hoặc MSCI; áp lực thanh lý vị thế ký quỹ tự động trên thị trường hợp đồng tương lai tiền mã hóa; hoặc độ trễ lan truyền thanh khoản giữa cổ phiếu chính với chứng chỉ lưu ký và giỏ quỹ hoán đổi danh mục cùng ngành.
2. **Alpha Hành vi & Lan truyền Thông tin Chậm (Behavioral & Slow-Diffusion Alpha)**: Bắt nguồn từ giới hạn nhận thức và sự phân mảnh chú ý của con người. Ví dụ kinh điển là hiện tượng trôi giá sau công bố lợi nhuận (Post-Earnings Announcement Drift) khi giới phân tích điều chỉnh dự phóng chậm chạp, hiệu ứng lan tỏa chuỗi cung ứng (khi khách hàng lớn công bố doanh thu vượt kỳ vọng nhưng cổ phiếu nhà cung cấp linh kiện chưa kịp phản ánh ngay trong ngày đầu tiên), hoặc hiện tượng quá đà rồi đảo chiều ngắn hạn từ 1 đến 5 ngày của Kakushadze (2016) do nhu cầu thanh khoản tức thời của nhà đầu tư cá nhân.
3. **Phần bù Rủi ro Thay thế & Cung cấp Thanh khoản (Alternative Risk Premia & Liquidity Provision)**: Khi bạn mua những cổ phiếu vừa giảm sàn do nhà đầu tư khác hoảng loạn tháo chạy và bán những mã vừa tăng nóng, bạn thực chất đóng vai trò người bảo hiểm thanh khoản trung hạn và nhận phần bù rủi ro cho việc chấp nhận gánh hàng tồn kho trong lúc thị trường căng thẳng.

### 4.3. Định luật Đánh đổi giữa Tỷ số Sharpe, Vòng quay Vốn và Dung lượng Chiến lược

Mọi chiến lược có tỷ số Sharpe cao ngất ngưởng đều vấp phải một bức tường vật lý: **dung lượng vốn tối đa** (Strategy Capacity). Giả sử một chiến lược giao dịch danh mục tổng giá trị vị thế gộp là $C$ (đơn vị USD), tạo ra tỷ suất sinh lời gộp kỳ vọng trước phí hàng năm là $\mu_{\text{gross}}$, độ lệch chuẩn lợi nhuận năm là $\sigma$, và có vòng quay danh mục hai chiều hàng năm là $\tau_{\text{turn}}$ (ví dụ đảo toàn bộ danh mục mỗi ngày tương ứng $\tau_{\text{turn}} \approx 2 \times 252 = 504$ lần/năm).

Khi quy mô vốn $C$ tăng lên, lệnh đặt của quỹ chiếm tỷ trọng ngày càng lớn trong giá trị giao dịch trung bình ngày $\text{ADV}$ của thị trường. Theo quy luật căn bậc hai thực nghiệm của tác động thị trường (Square-Root Law of Market Impact), chi phí trượt giá trung bình trên mỗi đồng vốn luân chuyển tỉ lệ với $(C / V_{\text{mkt}})^{1/2}$, cộng với nửa chênh lệch giá mua - bán cố định $c_0$. Do đó tổng lợi nhuận ròng bằng tiền mặt hàng năm $\Pi(C)$ được mô hình hóa bởi hàm lõm:

$$
\Pi(C) = C \cdot \left( \mu_{\text{gross}} - \tau_{\text{turn}} c_0 - \tau_{\text{turn}} \kappa \sqrt{\frac{C}{V_{\text{mkt}}}} \right) = (\mu_{\text{net},0}) C - \gamma C^{3/2}
$$

trong đó $\mu_{\text{net},0} = \mu_{\text{gross}} - \tau_{\text{turn}} c_0 > 0$ là biên lợi nhuận ròng ở quy mô vốn rất nhỏ và $\gamma = \tau_{\text{turn}} \kappa V_{\text{mkt}}^{-1/2} > 0$. Lấy đạo hàm bậc nhất $\Pi'(C) = \mu_{\text{net},0} - \frac{3}{2}\gamma C^{1/2} = 0$ (với $\Pi''(C) = -\frac{3}{4}\gamma C^{-1/2} < 0$), ta thu được công thức giải tích cho **dung lượng vốn tối ưu cực đại hóa tổng lợi nhuận đô-la** $C^\star$ và **dung lượng bão hòa triệt tiêu toàn bộ lợi nhuận biên** $C_{\text{max}}$:

$$
C^\star = \left( \frac{2 \, (\mu_{\text{gross}} - \tau_{\text{turn}} c_0)}{3 \, \tau_{\text{turn}} \kappa} \right)^2 V_{\text{mkt}}, \qquad C_{\text{max}} = \frac{9}{4} C^\star
$$

Công thức trên giải thích trọn vẹn bức tranh phân tầng của toàn ngành định lượng:
- Một hãng giao dịch tần số cao như Virtu hay Citadel Securities có thể đạt tỷ số Sharpe $> 10$, nhưng vì vòng quay $\tau_{\text{turn}}$ lên tới hàng ngàn lần mỗi năm, dung lượng vốn $C^\star \propto \tau_{\text{turn}}^{-2}$ bị khóa chặt ở mức vài chục đến vài trăm triệu USD, không thể nhận vốn ủy thác hàng chục tỷ USD từ các quỹ hưu trí.
- Ngược lại, một quỹ định lượng trung hạn giữ vị thế từ 1 đến 3 tháng như AQR có $\tau_{\text{turn}}$ nhỏ nên triển khai được \$50 tỷ vốn quản lý, đổi lại tỷ số Sharpe kỳ vọng chỉ dao động quanh mức $0.7\text{–}1.2$.
- Vùng ngọt ngào tuyển dụng nhiều Quantitative Researcher nhất chính là **tín hiệu thống kê trung - ngắn hạn** (chu kỳ nắm giữ từ 30 phút đến 10 ngày như bộ 101 Formulaic Alphas của Kakushadze): dung lượng đạt từ \$500 triệu đến vài tỷ USD mỗi chiến lược, đủ lớn để tạo ra hàng trăm triệu USD lợi nhuận thực tế nhưng đủ nhanh để tích lũy hàng ngàn quan sát độc lập nhằm đạt tỷ số Sharpe $2.0\text{–}3.5$.

---

## 5. Ví dụ Thực chiến: Thiết kế Ngân sách Rủi ro & Dung lượng cho Cụm Cổ phiếu Mỹ

**Bài toán (Phong cách Phỏng vấn Tình huống tại Millennium / Point72):** Bạn vừa gia nhập một cụm giao dịch cổ phiếu Mỹ vùng thanh khoản TOP1500 với vốn gốc phân bổ \$50 triệu và đòn bẩy gộp $4\times$, tức tổng giá trị vị thế gộp $C = \$200$ triệu (\$100 triệu mua và \$100 triệu bán khống). Cụm bị áp giới hạn cắt giảm một nửa vốn nếu lỗ lũy kế chạm \$3.5 triệu (tương đương $-7\%$ trên vốn gốc \$50 triệu). Bộ tín hiệu chéo bạn phát triển có kỳ vọng trước phí trên phần vốn gộp là $\mu_{\text{gross}} = 14\%$/năm, độ lệch chuẩn hàng năm trên vốn gộp là $\sigma_{\text{gross}} = 4.5\%$/năm, chu kỳ nắm giữ trung bình $H = 5$ ngày giao dịch (trong năm có 252 ngày giao dịch), chi phí chênh lệch cố định $c_0 = 2.5$ điểm cơ bản ($1\text{ bps} = 0.01\% = 10^{-4}$) mỗi chiều giao dịch, hệ số tác động thị trường hiệu dụng $\kappa \sqrt{C / V_{\text{mkt}}} = 3.5\text{ bps}$ tại quy mô $C = \$200$ triệu.

1. Hãy tính vòng quay danh mục hai chiều hàng năm $\tau_{\text{turn}}$, lợi nhuận ròng bằng tiền mặt kỳ vọng mỗi năm, độ lệch chuẩn tiền mặt hàng năm và tỷ số Sharpe ròng sau phí.
2. Giả sử cụm có quyền nâng đòn bẩy gộp lên $8\times$ ($C = \$400$ triệu) trên cùng vũ trụ cổ phiếu. Lợi nhuận tiền mặt ròng thay đổi ra sao và rủi ro chạm ngưỡng cắt vốn \$3.5 triệu biến đổi như thế nào?

**Lời giải Chi tiết:**

**Bước 1 — Vòng quay và chi phí giao dịch tại $C_1 = \$200$ triệu:**
Với thời gian nắm giữ trung bình $H = 5$ ngày, mỗi ngày danh mục thay thế khoảng $1/5$ vị thế mua/bán (một vòng đóng vị thế cũ mở vị thế mới gồm 2 chiều giao dịch). Do đó vòng quay đơn chiều tương ứng $252 / 5 = 50.4$ vòng/năm, hay tổng khối lượng khớp lệnh hai chiều tính theo tỷ lệ trên quy mô danh mục gộp là:

$$
\tau_{\text{turn}} = \frac{2 \times 252}{5} = 100.8 \text{ lần/năm}
$$

Tổng chi phí trên mỗi đơn vị khối lượng giao dịch tại quy mô $C_1 = \$200$ triệu bằng $c_{\text{total}}(C_1) = 2.5\text{ bps} + 3.5\text{ bps} = 6.0\text{ bps} = 0.0006$. Hao hụt lợi nhuận hàng năm do phí giao dịch trên vốn gộp là:

$$
\text{Cost}_1 = 100.8 \times 0.0006 = 0.06048 \approx 6.05\%/\text{năm}
$$

Lợi suất ròng trên vốn gộp đạt $\mu_{\text{net}}(C_1) = 14.0\% - 6.05\% = 7.95\%$/năm. Nhân với quy mô gộp $C_1 = \$200$ triệu:
- **Lợi nhuận tiền mặt ròng kỳ vọng**: $\mathbb{E}[\Pi_1] = \$200\text{ triệu} \times 7.95\% = \$15.90\text{ triệu/năm}$ (tương đương tỷ suất sinh lời $31.8\%$ trên \$50 triệu vốn gốc!).
- **Độ lệch chuẩn tiền mặt hàng năm**: $\Sigma_1 = \$200\text{ triệu} \times 4.5\% = \$9.00\text{ triệu/năm}$.
- **Tỷ số Sharpe ròng sau phí**: $\text{SR}_{\text{net}}(C_1) = \frac{7.95\%}{4.50\%} \approx 1.77$. Ngưỡng cắt vốn \$3.5 triệu cách mức 0 khoảng $3.5 / 9.0 \approx 0.39$ độ lệch chuẩn năm, đòi hỏi nhà quản lý phải thu hẹp biến động ngay khi lỗ vượt \$1.5 triệu để bảo vệ tài khoản.

**Bước 2 — Hệ quả phi tuyến khi nhân đôi đòn bẩy lên $C_2 = \$400$ triệu:**
Khi $C_2 = 2 C_1$, thành phần tác động thị trường bậc căn tăng lên $\sqrt{2} \times 3.5\text{ bps} \approx 4.95\text{ bps}$, nâng tổng phí mỗi lần khớp lên $2.5 + 4.95 = 7.45\text{ bps}$. Tổng hao hụt giao dịch vọt lên $100.8 \times 0.000745 \approx 7.51\%$/năm, kéo lợi suất ròng trên vốn gộp tụt xuống $\mu_{\text{net}}(C_2) = 14.0\% - 7.51\% = 6.49\%$/năm:
- Lợi nhuận tiền mặt ròng kỳ vọng tăng lên $\$400\text{ triệu} \times 6.49\% = \$25.96\text{ triệu/năm}$ (không tăng gấp đôi mà mất đi gần \$6 triệu do trượt giá!).
- Tuy nhiên, độ lệch chuẩn tiền mặt hàng năm tăng vọt gấp đôi lên $\Sigma_2 = \$400\text{ triệu} \times 4.5\% = \$18.00\text{ triệu/năm}$ và tỷ số Sharpe ròng tụt xuống $6.49\% / 4.50\% = 1.44$. Lúc này ngưỡng cắt vốn cứng \$3.5 triệu chỉ tương đương **một cú rung lắc chưa đầy một tuần lễ giao dịch xấu** ($\Sigma_{\text{tuần}} = \$18\text{ triệu} / \sqrt{52} \approx \$2.50\text{ triệu}$), khiến xác suất chạm ngưỡng bị cắt nửa vốn trong năm tiến sát mức chắc chắn! Đây là lý do trong thực tế các PM giỏi luôn vận hành dưới trần dung lượng tối đa để giữ biên độ an toàn trước rủi ro sụt giảm.

---

## 6. Các Bẫy Sai lầm Kinh điển trong Nghiên cứu Định lượng Thực tế

> [!WARNING]
> **Bẫy 1 — Ngụy trang Beta Ẩn thành Alpha (Disguised Factor Exposure):** Một ứng viên khoe chiến lược mua rổ cổ phiếu có biến động thấp hoặc giá trị sổ sách cao cho tỷ số Sharpe $1.4$ trong kiểm thử lịch sử mà chỉ trừ đi chỉ số S&P 500. Khi đưa vào mô hình rủi ro chuẩn kiểu Barra gồm 12 nhân tố phong cách và 60 nhóm ngành, phần dư $\alpha_{i,t}$ sụt về $0.00\%$ kèm chi phí giao dịch âm. Luôn luôn hồi quy phần dư lợi nhuận của bạn lên bộ nhân tố chuẩn trước khi tuyên bố phát hiện tín hiệu mới!

- **Bẫy 2 — Bỏ qua Tương quan Đám đông và Rủi ro Ép Mua Trả Hàng Bán Khống (Crowding & Short Squeeze)**: Các nhân tố học thuật công khai rộng rãi thu hút hàng chục quỹ định lượng cùng mở vị thế giống hệt nhau. Tháng 8/2007 ("Quant Quake") và tháng 1/2021 là bài học đắt giá: chỉ cần một quỹ lớn bị rút vốn phải thanh lý danh mục mua giá trị - bán động lượng, giá các cổ phiếu bị bán khống đông đúc tăng dựng đứng, kích hoạt đồng loạt hạn mức cắt lỗ của hàng loạt cụm danh mục khác mặc dù hoạt động kinh doanh cơ bản của doanh nghiệp không hề thay đổi.
- **Bẫy 3 — Lẫn lộn Tỷ số Sharpe Trước Phí với Sau Phí ở Chu kỳ Ngắn**: Một tín hiệu đảo chiều 5 phút có hệ số tương quan dự báo $\text{IC} = 0.03$ có thể hiện ra tỷ số Sharpe trước phí bằng $8.0$ trên màn hình giả lập. Nhưng nếu biên lợi nhuận trung bình mỗi lệnh chỉ đạt $1.8\text{ bps}$ trong khi nửa độ rộng chênh lệch giá trên sàn đã là $2.5\text{ bps}$, chiến lược đó thực chất lỗ ròng ngay từ lệnh đầu tiên trừ khi được thiết kế lại hoàn toàn dưới dạng thuật toán đặt lệnh giới hạn chờ khớp — chủ đề mà chúng ta sẽ mổ xẻ chi tiết ngay ở Bài giảng `M1.02`.
