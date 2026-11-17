# Danh Mục Thư Viện Chuẩn Ngành & Hướng Dẫn Đọc Song Song

Tài liệu này đóng vai trò chỉ mục trung tâm cho kho thư viện cá nhân tại thư mục `content/library/` của nền tảng **Quant Research Academy**. Khi bạn tải các giáo trình mở hoặc bài báo khoa học định dạng `.pdf` về đặt trực tiếp vào thư mục `content/library/`, hệ thống máy chủ nội bộ sẽ tự động nhận diện để bạn mở đọc đối chiếu ở chế độ chia đôi màn hình (Split View) ngay cạnh bài giảng và khung ghi chú công thức.

---

## 1. Quy Tắc Tổ Chức Tệp PDF Trong `content/library/`

Để danh sách tệp trên thanh chọn thư viện gọn gàng và dễ tra cứu theo từng học phần, khuyến nghị đặt tên tệp không dấu theo quy ước `<nhom>-<tac-gia>-<nam>-<ten-rut-gon>.pdf`:

```text
content/library/
├── READING_GUIDE.md
├── prob-blitzstein-2019-stat110-probability.pdf
├── interview-zhou-2008-green-book.pdf
├── interview-crack-heard-on-the-street.pdf
├── linalg-strang-2019-learning-from-data.pdf
├── opt-boyd-2004-convex-optimization.pdf
├── opt-boyd-kahn-2017-multi-period-trading.pdf
├── stat-wasserman-2004-all-of-statistics.pdf
├── stat-efron-hastie-2016-casi.pdf
├── stat-hastie-2009-esl.pdf
├── ts-tsay-2010-financial-time-series.pdf
├── micro-hasbrouck-2007-empirical-microstructure.pdf
├── micro-cont-kukanov-stoikov-2014-ofi.pdf
├── exec-almgren-chriss-2000-optimal-execution.pdf
├── alpha-kakushadze-2016-101-formulaic-alphas.pdf
├── rmt-laloux-bouchaud-1999-noise-dressing.pdf
├── statarb-avellaneda-lee-2010-pca-ou.pdf
└── pm-grinold-kahn-1999-active-portfolio-management.pdf
```

> **Lưu ý bản quyền học thuật**: Chỉ tải trực tiếp các bản PDF được tác giả, trường đại học hoặc kho lưu trữ khoa học mở công bố hợp pháp. Với các sách chuyên khảo thương mại, hãy sử dụng bản mua hợp pháp hoặc bản thư viện trường đại học rồi lưu bản cá nhân vào thư mục cục bộ trên máy của bạn.

---

## 2. Giáo Trình Đại Học & Sách Chuyên Khảo Mở Chính Thống

Các tài liệu dưới đây được chính tác giả và nhà xuất bản cung cấp bản điện tử học thuật miễn phí trên trang chủ đại học:

### 2.1. Xác suất, Chuỗi Markov & Suy luận Thống kê
1. **Joseph K. Blitzstein & Jessica Hwang — *Introduction to Probability*, 2nd Ed., CRC Press, 2019 (Harvard Stat 110)**
   - Trang học liệu chính thức & bản đọc trực tuyến miễn phí: https://projects.iq.harvard.edu/stat110/home
   - Trọng tâm cho Nghiên cứu Định lượng (Quantitative Research):
     - **Chương 1 – 2**: Không gian mẫu, chứng minh bằng câu chuyện tổ hợp và cập nhật Bayes tuần tự.
     - **Chương 4, 6 & 9**: Biến ngẫu nhiên chỉ báo, hàm sinh mô-men, kỳ vọng có điều kiện $\mathbb{E}[Y \mid X]$, tính chất tháp và luật phương sai toàn phần $\operatorname{Var}(Y) = \mathbb{E}[\operatorname{Var}(Y \mid X)] + \operatorname{Var}(\mathbb{E}[Y \mid X])$.
     - **Chương 7 – 8**: Đổi biến nhiều chiều với định thức Jacobi, tính độc lập tổng - tỷ số của phân phối Gamma - Beta và mật độ của thống kê thứ tự.
     - **Chương 11**: Chuỗi Markov rời rạc, phân phối dừng $\pi = \pi P$, tính thuận nghịch và phương pháp phân tích bước đầu tiên.

2. **J. R. Norris — *Markov Chains*, Cambridge University Press, 1997**
   - Bản giảng mở Đại học Cambridge (Chương 1): https://www.statslab.cam.ac.uk/~james/Markov/
   - Trọng tâm: Ma trận chuyển tiếp, thời gian chạm trạng thái hấp thụ, định lý hội tụ ergodic cho chuỗi bất khả quy phi tuần hoàn.

3. **Trevor Hastie, Robert Tibshirani & Jerome Friedman — *The Elements of Statistical Learning*, 2nd Ed., Springer, 2009**
   - Bản PDF chính thức của tác giả tại Đại học Stanford: https://hastie.su.domains/ElemStatLearn/
   - Trọng tâm:
     - **Chương 3**: Hình học phép chiếu trực giao bình phương tối thiểu, hồi quy co rút bậc hai Ridge, hồi quy chọn biến LASSO và phân tích giá trị kỳ dị của ma trận thiết kế.
     - **Chương 7**: Đánh giá sai số tổng quát hóa và bẫy rò rỉ thông tin khi sàng lọc biến dự báo trước khi chia tập kiểm định chéo (Mục 7.10.2).

4. **Bradley Efron & Trevor Hastie — *Computer Age Statistical Inference*, Cambridge University Press, 2016**
   - Bản PDF chính thức của tác giả: https://hastie.su.domains/CASI/
   - Trọng tâm: **Chương 7** (Ước lượng James-Stein và Bayes thực nghiệm), **Chương 15** (Kiểm định giả thuyết quy mô lớn và kiểm soát tỷ lệ khám phá sai).

### 2.2. Đại số Tuyến tính, Toán Tài chính MIT & Tối ưu hóa Lồi
5. **Stephen Boyd & Lieven Vandenberghe — *Convex Optimization*, Cambridge University Press, 2004**
   - Bản PDF toàn văn miễn phí tại Stanford: https://web.stanford.edu/~boyd/cvxbook/
   - Trọng tâm:
     - **Chương 2 – 3**: Tập lồi, hàm lồi, bất đẳng thức Jensen và điều kiện bậc hai xác định nửa dương $\nabla^2 f(x) \succeq 0$.
     - **Chương 4 (Mục 4.4 & 4.6)**: Quy hoạch bậc hai cho danh mục Markowitz, ràng buộc hình nón bậc hai cho giới hạn rủi ro theo dõi.
     - **Chương 5**: Đối ngẫu Lagrange, bổ đề Farkas, điều kiện Slater và hệ phương trình tối ưu Karush-Kuhn-Tucker giải thích vùng băng chết không giao dịch khi có phí tuyến tính chuẩn $\ell_1$.

6. **Stephen Boyd, Enzo Busseti, Steven Diamond, Ronald N. Kahn et al. — *Multi-Period Trading via Convex Optimization*, 2017**
   - Bản PDF chính thức: https://stanford.edu/~boyd/papers/cvx_portfolio.html
   - Trọng tâm: Chuẩn mực công nghiệp hiện đại cho tối ưu hóa danh mục đơn chu kỳ và đa chu kỳ tích hợp chi phí vay bán khống, phí chênh lệch giá và chi phí tác động thị trường lũy thừa $3/2$.

7. **MIT 18.06 (*Linear Algebra*) & MIT 18.065 (*Linear Algebra and Learning from Data*) — Gilbert Strang**
   - Khóa học mở MIT OCW 18.06: https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/
   - Khóa học mở MIT OCW 18.065: https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/
   - Trọng tâm: Bốn không gian con cơ bản, phân rã phổ $S = Q \Lambda Q^\top$, phân rã giá trị kỳ dị $A = U \Sigma V^\top$, giả nghịch đảo Moore-Penrose và xấp xỉ hạng thấp tối ưu Eckart-Young.

8. **MIT 18.S096 — *Topics in Mathematics with Applications in Finance* (Peter Kempthorne, Choongbum Lee, Vasily Strela, Jake Xia)**
   - Trang bài giảng & ghi chú PDF mở: https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/
   - Trọng tâm: Kết nối trực tiếp toán đại học với thực tiễn quỹ định lượng từ mô hình nhân tố tuyến tính, chuỗi thời gian ARMA/GARCH, phân tích thành phần chính đến kinh doanh chênh lệch thống kê.

---

## 3. Bộ Sách Chuyên Khảo Kinh Điển Của Phố Wall & Quỹ Đầu Cơ

Đây là bộ giáo trình cốt lõi luôn nằm trên bàn làm việc của các nhà nghiên cứu phía mua (Buy-Side Researchers):

| STT | Tác phẩm & Tác giả | Học phần Áp dụng | Các Chương Bắt buộc Nắm Chắc |
| :-: | :--- | :---: | :--- |
| 1 | **A Practical Guide to Quantitative Finance Interviews** (*Green Book*) — Xinfeng Zhou, 2008 | `M2`, `M3` | **Ch. 1** (Tư duy bất biến & đối xứng), **Ch. 3** (Xác suất & Thống kê thứ tự), **Ch. 4** (Chuỗi Markov, Martingale, Thời gian dừng & Đẳng thức Wald). |
| 2 | **Heard on the Street** — Timothy Falcon Crack, 21st/22nd Ed. | `M1`, `M2`, `M5` | **Ch. 1** (Câu hỏi tư duy định lượng), **Ch. 3** (Vi cấu trúc thị trường & Tiêu chuẩn Kelly), **Ch. 4** (Xác suất, Hồi quy & Bẫy thống kê). |
| 3 | **Probability with Martingales** — David Williams, 1991 | `M2` | **Ch. 9** (Phép chiếu kỳ vọng có điều kiện trên $L^2$), **Ch. 10** (Quá trình Martingale, Biến đổi dự báo được & Định lý dừng Doob). |
| 4 | **All of Statistics** — Larry Wasserman, 2004 | `M3` | **Ch. 6** (Hội tụ thống kê), **Ch. 9** (Hợp lý cực đại, Thông tin Fisher & Cramér-Rao), **Ch. 10.7** (Kiểm soát FDR của Benjamini-Hochberg). |
| 5 | **Analysis of Financial Time Series**, 3rd Ed. — Ruey S. Tsay, 2010 | `M1`, `M3`, `M4` | **Ch. 1** (Đuôi dày lợi nhuận), **Ch. 2** (ARMA & Nghiệm đơn vị), **Ch. 3** (ARCH/GARCH), **Ch. 8** (Đồng liên kết Engle-Granger & Johansen), **Ch. 11** (Không gian trạng thái & Bộ lọc Kalman). |
| 6 | **Empirical Market Microstructure** — Joel Hasbrouck, 2007 | `M1` | **Ch. 2** (Cơ chế sổ lệnh giới hạn), **Ch. 3** (Mô hình tự hiệp phương sai âm của Roll), **Ch. 5** (Mô hình tuần tự Glosten-Milgrom), **Ch. 7** (Mô hình đấu giá Kyle & Hệ số trượt giá $\lambda$). |
| 7 | **Active Portfolio Management**, 2nd Ed. — Richard C. Grinold & Ronald N. Kahn, 1999 | `M1`, `M5` | **Ch. 2–5** (Alpha phụ trội & Tỷ số thông tin), **Ch. 6** (Định luật cơ bản $\text{IR} = \text{IC}\sqrt{\text{BR}}$), **Ch. 10** (Quy tắc chuyển đổi điểm chuẩn), **Ch. 14, 16 & 17** (Tối ưu có phí & Quy kết hiệu quả). |
| 8 | **Advances in Financial Machine Learning** — Marcos López de Prado, 2018 | `M1`, `M3`, `M4`, `M5` | **Ch. 2–4** (Thanh giá trị, Gán nhãn ba rào cản & Trọng số mẫu), **Ch. 5** (Sai phân bậc phân số), **Ch. 7** (Kiểm định chéo cắt bỏ & Khoảng cách ly), **Ch. 8** (Đặc trưng trực giao), **Ch. 14** (Deflated Sharpe Ratio). |

---

## 4. Tuyển Tập Bài Báo Gốc Nền Tảng (ArXiv, SSRN & Tạp Chí Khoa Học)

Mỗi bài báo dưới đây định hình trực tiếp một mảng câu hỏi thảo luận chuyên sâu trong vòng phỏng vấn cuối cùng (Superday):

1. **Mất cân bằng Luồng lệnh Sổ lệnh Cấp 1 (`M1.04` & `CAP-03`)**
   - Rama Cont, Arseniy Kukanov & Sasha Stoikov (2014), *The Price Impact of Order Book Events*, `Journal of Financial Econometrics`, 12(1), 47–88.
   - Bản thảo mở ArXiv: https://arxiv.org/abs/1011.6402
   - Phương trình cốt lõi cần chứng minh lại: $\Delta P_k = \beta \, \text{OFI}_k + \varepsilon_k$ với hệ số độ dốc tỷ lệ nghịch cùng độ sâu thanh khoản $\beta = \frac{\alpha}{D^\lambda}$.

2. **101 Biểu thức Tín hiệu Chéo Cổ phiếu (`M1.01` & `CAP-01`)**
   - Zura Kakushadze (2016), *101 Formulaic Alphas*, `Wilmott`, 2016(84), 72–81.
   - Bản thảo mở ArXiv: https://arxiv.org/abs/1601.00991
   - Điểm mấu chốt: Tương quan cặp trung bình thấp ($\approx 15.9\%$) cho phép kết hợp hàng trăm tín hiệu yếu ($\text{IC} \in [0.015, 0.04]$) thành danh mục có tỷ số Sharpe cao theo đúng nguyên lý bề rộng đặt cược.

3. **Lọc Nhiễu Ma trận Tương quan bằng Lý thuyết Ma trận Ngẫu nhiên (`M4.02` & `CAP-02`)**
   - Laurent Laloux, Pierre Cizeau, Jean-Philippe Bouchaud & Marc Potters (1999), *Noise Dressing of Financial Correlation Matrices*, `Physical Review Letters`, 83(7), 1467–1470 — https://arxiv.org/abs/cond-mat/9810255
   - Joël Bun, Jean-Philippe Bouchaud & Marc Potters (2017), *Cleaning Large Correlation Matrices: Tools from Random Matrix Theory*, `Physics Reports`, 666, 1–109 — https://arxiv.org/abs/1610.08104
   - Olivier Ledoit & Michael Wolf (2004), *A Well-Conditioned Estimator for Large-Dimensional Covariance Matrices*, `Journal of Multivariate Analysis`, 88(2), 365–411 — https://doi.org/10.1016/S0047-259X(03)00096-4

4. **Kinh doanh Chênh lệch Thống kê Phần dư Thành phần Chính & Quá trình Ornstein-Uhlenbeck (`M4.01`, `M4.04` & `CAP-02`)**
   - Marco Avellaneda & Jeong-Hyun Lee (2010), *Statistical Arbitrage in the U.S. Equities Market*, `Quantitative Finance`, 10(7), 761–782.
   - Bản thảo mở ArXiv: https://arxiv.org/abs/0807.2211

5. **Thực thi Lệnh Tối ưu & Kiểm soát Rủi ro Thanh lý (`M5.03` & `CAP-03`)**
   - Robert Almgren & Neil Chriss (2000), *Optimal Execution of Portfolio Transactions*, `Journal of Risk`, 3(2), 5–39.
   - Bản PDF học thuật: https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf
   - Edward O. Thorp (2006), *The Kelly Criterion in Blackjack, Sports Betting, and the Stock Market*: https://www.eecs.harvard.edu/cs286r/courses/fall12/papers/Thorpe_KellyCriterion2007.pdf

6. **Kiểm soát Đa Kiểm định & Khấu trừ Tỷ số Sharpe Ảo (`M1.03`, `M3.02`, `M3.03` & `CAP-01`)**
   - Whitney K. Newey & Kenneth D. West (1987), *A Simple, Positive Semi-Definite, Heteroskedasticity and Autocorrelation Consistent Covariance Matrix*, `Econometrica`, 55(3), 703–708 — https://doi.org/10.2307/1913610
   - David H. Bailey & Marcos López de Prado (2014), *The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting, and Non-Normality*, `Journal of Portfolio Management`, 40(5), 94–107 — https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551
   - Campbell R. Harvey, Yan Liu & Heqing Zhu (2016), *... and the Cross-Section of Expected Returns*, `Review of Financial Studies`, 29(1), 5–68 — https://doi.org/10.1093/rfs/hhv059

7. **Hệ số Chuyển đổi Danh mục & Điều chuẩn Phức tạp Chiều cao (`M5.01`, `M5.04` & `CAP-04`)**
   - Roger Clarke, Harindra de Silva & Steven Thorley (2002), *Portfolio Constraints and the Fundamental Law of Active Management*, `Financial Analysts Journal`, 58(5), 48–66 — https://doi.org/10.2469/faj.v58.n5.2468
   - Bryan Kelly, Semyon Malamud & Kangying Zhou (2024), *The Virtue of Complexity in Return Prediction*, `Journal of Finance`, 79(1), 459–503 — https://doi.org/10.1111/jofi.13298

---

## 5. Phương Pháp Đọc Chủ Động 3 Bước Cho Kỹ Sư Phần Mềm

Để biến kiến thức toán học thành phản xạ nghiên cứu thực chiến trong 24 tháng thay vì đọc thụ động:

1. **Bước 1 — Đọc Bài giảng Cầu nối ở nửa màn hình trái**: Nắm vững trực giác hình học, ký hiệu chuẩn hóa và bức tranh liên kết giữa định lý toán học với dữ liệu thị trường thực tế trước khi mở sách gốc.
2. **Bước 2 — Tự chứng minh lại trên Khung Ghi chú LaTeX nửa màn hình phải**: Đóng phần chứng minh lại, tự gõ từng dòng biến đổi từ giả thiết sang kết luận (ví dụ biến đổi kỳ vọng có điều kiện trong mô hình Glosten-Milgrom hoặc nghiệm tối ưu KKT của danh mục có phí bậc nhất), sau đó mới mở PDF chương gốc trong thẻ **Thư viện PDF** để kiểm tra các điều kiện biên tinh tế.
3. **Bước 3 — Kiểm chứng bằng Mô phỏng Số & Ngân hàng Đề Phỏng vấn**: Mọi định lý xác suất hay đại số tuyến tính đều phải được kiểm tra chéo bằng vài chục dòng mã mô phỏng Monte Carlo hoặc NumPy trên dữ liệu nhiễu tổng hợp để trực tiếp cảm nhận sai số hữu hạn mẫu trước khi bước vào vòng luyện đề lặp lại ngắt quãng.
