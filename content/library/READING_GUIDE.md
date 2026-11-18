# Danh Mục Thư Viện Chuẩn Ngành & Nghiên Cứu Mới Nhất 2022–2025

Tài liệu này đóng vai trò chỉ mục trung tâm cho kho thư viện cá nhân tại thư mục `content/library/` của nền tảng **Quant Research Academy** — bao quát toàn bộ 8 học phần `M0`–`M7`, 36 chuyên đề học thuật, 120 bài toán phỏng vấn và 4 đồ án thực chiến. Mỗi chuyên đề trong lộ trình áp dụng chuẩn tuyển chọn tài liệu **1 Kinh điển Nền tảng + 2 Giáo trình / Nghiên cứu Hiện đại 2022–2025** kèm 100% liên kết trực tiếp tới nhà xuất bản đại học, bản PDF mở hoặc kho lưu trữ khoa học ArXiv. Khi bạn tải các giáo trình mở hoặc bài báo định dạng `.pdf` về đặt trực tiếp vào thư mục `content/library/`, hệ thống máy chủ nội bộ sẽ tự động nhận diện để bạn mở đọc đối chiếu ở chế độ chia đôi màn hình (Split View) ngay cạnh bài giảng và khung ghi chú công thức.

---

## 1. Quy Tắc Tổ Chức Tệp PDF Trong `content/library/`

Để danh sách tệp trên thanh chọn thư viện gọn gàng và dễ tra cứu theo từng học phần từ Toán đại học nền tảng đến Kỹ nghệ Alpha cấp độ tổ chức, khuyến nghị đặt tên tệp không dấu theo quy ước `<nhom>-<tac-gia>-<nam>-<ten-rut-gon>.pdf`:

```text
content/library/
├── READING_GUIDE.md
├── prob-blitzstein-2019-stat110-probability.pdf
├── prob-roch-2024-modern-discrete-probability.pdf
├── prob-vershynin-2025-high-dimensional-probability-2e.pdf
├── prob-chan-2022-probability-for-data-science.pdf
├── linalg-strang-2023-intro-linear-algebra-6e.pdf
├── linalg-deisenroth-2023-mathematics-for-ml.pdf
├── ml-murphy-2022-probabilistic-ml-intro.pdf
├── ml-murphy-2023-probabilistic-ml-advanced.pdf
├── stat-islp-2023-statistical-learning-python.pdf
├── causal-chernozhukov-2024-applied-causal-ml.pdf
├── opt-boyd-2004-convex-optimization.pdf
├── opt-boyd-kahn-2024-markowitz-at-seventy.pdf
├── stoch-shreve-2004-stochastic-calculus-vol2.pdf
├── stoch-legall-2022-measure-probability-stochastic.pdf
├── stoch-sarkka-svensson-2023-bayesian-filtering-2e.pdf
├── vol-bayer-gatheral-2023-rough-volatility.pdf
├── deriv-hull-2022-options-futures-11e.pdf
├── micro-hasbrouck-2007-empirical-microstructure.pdf
├── micro-webster-2023-price-impact-modeling.pdf
├── micro-cont-cucuringu-zhang-2023-cross-impact-ofi.pdf
├── micro-kolm-turiel-westray-2023-deep-ofi.pdf
├── crypto-ackerer-hugonnier-jermann-2024-perpetual-futures.pdf
├── fml-kelly-xiu-2023-financial-machine-learning.pdf
├── fml-kelly-malamud-zhou-2024-virtue-of-complexity.pdf
├── factor-jensen-kelly-pedersen-2023-replication-crisis.pdf
├── factor-lopez-de-prado-2023-causal-factor-investing.pdf
├── rmt-ledoit-wolf-2022-nonlinear-shrinkage-guide.pdf
├── pm-isichenko-2021-quantitative-portfolio-management.pdf
└── pm-paleologo-2025-elements-of-quantitative-investing.pdf
```

> **Lưu ý bản quyền học thuật**: Chỉ tải trực tiếp các bản PDF được tác giả, trường đại học hoặc kho lưu trữ khoa học mở công bố hợp pháp. Với các sách chuyên khảo thương mại, hãy sử dụng bản mua hợp pháp hoặc bản thư viện trường đại học rồi lưu bản cá nhân vào thư mục cục bộ trên máy của bạn.

---

## 2. Giáo Trình Đại Học Mở Thế Hệ Mới 2022–2025 & Kinh Điển Bất Hủ

Các tài liệu dưới đây được chính tác giả và nhà xuất bản đại học cung cấp học liệu và bản đọc trực tuyến miễn phí:

### 2.1. Toán Đại học Nền tảng, Xác suất Số chiều Cao & Đại số Hiện đại (`M0`, `M2`)
1. **Roman Vershynin — *High-Dimensional Probability: An Introduction with Applications in Data Science*, 2nd Ed., Cambridge University Press, 2025**
   - Bản PDF mở chính thức của tác giả tại UC Irvine: https://www.math.uci.edu/~rvershyn/papers/HDP-book/HDP-2.pdf
   - Trọng tâm cho `M0.02` & `M4.02`: Bất đẳng thức tập trung phi tiệm cận Hoeffding - Bernstein, biến ngẫu nhiên cận Gauss, cận mũ và phổ ma trận ngẫu nhiên hữu hạn mẫu.

2. **Sébastien Roch — *Modern Discrete Probability: An Essential Toolkit*, Cambridge University Press, 2024**
   - Bản mở chính thức tại Đại học Wisconsin-Madison: https://people.math.wisc.edu/~roch/mdp/
   - Trọng tâm cho `M0.01`, `M0.05`, `M2.02–M2.04`: Phương pháp mô-men thứ nhất - thứ hai, quá trình phân nhánh bằng hàm sinh, chuỗi Markov thuận nghịch qua mạng điện trở, thời gian trộn và Martingale rời rạc.

3. **Stanley H. Chan — *Introduction to Probability for Data Science*, Michigan Publishing, 2022**
   - Bản PDF mở toàn văn kèm mã Python: https://probability4datascience.com/
   - Trọng tâm cho `M0.01`, `M0.02` & `M2.01`: Tổ hợp hiện đại, biến ngẫu nhiên liên tục đa chiều, cập nhật Bayes và mô phỏng Monte Carlo kiểm chứng hội tụ phân phối.

4. **Joseph K. Blitzstein & Jessica Hwang — *Introduction to Probability*, 2nd Ed., CRC Press, 2019 — Harvard Stat 110**
   - Trang học liệu chính thức & bản đọc trực tuyến miễn phí: https://projects.iq.harvard.edu/stat110/home
   - Trọng tâm cho Nghiên cứu Định lượng (Quantitative Research): Chứng minh tổ hợp bằng câu chuyện, liên hợp Beta - Gamma, thống kê thứ tự, tính chất tháp $\mathbb{E}[\mathbb{E}[Y \mid X]] = \mathbb{E}[Y]$ và luật phương sai toàn phần $\operatorname{Var}(Y) = \mathbb{E}[\operatorname{Var}(Y \mid X)] + \operatorname{Var}(\mathbb{E}[Y \mid X])$.

5. **Gilbert Strang — *Introduction to Linear Algebra*, 6th Ed., Wellesley-Cambridge Press, 2023 & *Mathematics for Machine Learning* — Marc Peter Deisenroth, A. Aldo Faisal & Cheng Soon Ong, Cambridge University Press, 2023**
   - Trang sách ấn bản 6 MIT: https://math.mit.edu/~gs/linearalgebra/ila6/indexila6.html
   - Bản PDF mở Cambridge MML: https://mml-book.github.io/
   - Trọng tâm cho `M0.03`, `M0.04` & `M4.01`: Bốn không gian con cơ bản, chiếu trực giao QR, phân rã tam giác Cholesky $\Sigma = L L^\top$, định thức Jacobi, khai triển bậc hai Hessian và phân rã giá trị kỳ dị $A = U \Sigma V^\top$.

### 2.2. Thống kê Hiện đại, Học máy Xác suất & Suy luận Nhân quả (`M3`, `M4`)
6. **Kevin P. Murphy — *Probabilistic Machine Learning: An Introduction*, MIT Press, 2022 & *Advanced Topics*, MIT Press, 2023**
   - Bản PDF mở chính thức Tập 1 & Tập 2: https://probml.github.io/pml-book/book1.html và https://probml.github.io/pml-book/book2.html
   - Trọng tâm cho `M0.04`, `M2.01`, `M3.01`, `M3.05` & `M4.05`: Họ phân phối Student-t đuôi dày, ước lượng co rút Bayes thực nghiệm, mất mát bền vững Huber, hồi quy phân vị và mô hình không gian trạng thái Markov ẩn HMM.

7. **Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani & Jonathan Taylor — *An Introduction to Statistical Learning with Applications in Python*, Springer, 2023**
   - Bản PDF mở chính thức của nhóm tác giả Stanford: https://www.statlearning.com/
   - Trọng tâm cho `M3.02` & `M3.04`: Hình học bình phương tối thiểu, hồi quy co rút bậc hai Ridge, chọn biến LASSO và kỷ luật chống rò rỉ thông tin khi thẩm định chéo bằng Python.

8. **Victor Chernozhukov, Christian Hansen, Nathan Kallus, Martin Spindler & Vasilis Syrgkanis — *Applied Causal Inference Powered by ML and AI*, 2024**
   - Bản PDF mở toàn văn: https://www.causalml-book.org/
   - Trọng tâm cho `M3.02` & `M3.03`: Hình học định lý Frisch-Waugh-Lovell, trực giao hóa phần dư Neyman trong không gian nhiều chiều và tách biệt tương quan ngụy tạo khỏi tác động nhân quả.

9. **Rob J. Hyndman & George Athanasopoulos — *Forecasting: Principles and Practice*, 3rd Ed., OTexts, 2024**
   - Giáo trình trực tuyến mở cập nhật liên tục: https://otexts.com/fpp3/
   - Trọng tâm cho `M4.03`: Tính dừng chuỗi thời gian, sai phân, tự tương quan riêng phần và đánh giá dự báo cửa sổ trượt.

### 2.3. Tối ưu hóa Lồi, Lọc Trạng thái & Giải tích Ngẫu nhiên Hiện đại (`M4`, `M5`, `M6`)
10. **Stephen Boyd & Lieven Vandenberghe — *Convex Optimization*, Cambridge University Press, 2004**
    - Bản PDF toàn văn miễn phí tại Stanford: https://web.stanford.edu/~boyd/cvxbook/
    - Trọng tâm cho `M0.04` & `M5.02`: Quy hoạch bậc hai, hình nón bậc hai, đối ngẫu Lagrange và điều kiện tối ưu Karush-Kuhn-Tucker giải thích vùng băng chết không giao dịch dưới chi phí chuẩn $\ell_1$.

11. **Jean-François Le Gall — *Measure Theory, Probability, and Stochastic Processes*, Springer Graduate Texts in Mathematics, 2022 & Steven E. Shreve — *Stochastic Calculus for Finance II*, Springer, 2004**
    - Trang xuất bản Springer 2022: https://doi.org/10.1007/978-3-031-14206-2
    - Trọng tâm cho `M2.02–M2.04` & `M6.01–M6.03`: Phép chiếu kỳ vọng có điều kiện trên $L^2$, bất đẳng thức cực đại Doob, nguyên lý phản xạ chuyển động Brown, biến thiên bậc hai $[W, W]_T = T$, tích phân Itô, định lý đổi độ đo Girsanov và hệ phương trình Feynman-Kac / Black-Scholes.

---

## 3. Bộ Sách Chuyên Khảo Mới Nhất Của Các Quỹ Đầu Cơ Mỹ 2021–2025

Đây là những cuốn sách chuyên khảo phản ánh trực tiếp kiến trúc nghiên cứu hiện đại tại các quỹ đa chiến lược và tạo lập thị trường định lượng hàng đầu Phố Wall:

| STT | Tác phẩm & Tác giả | Học phần Áp dụng | Trọng tâm Nghiên cứu Thực chiến |
| :-: | :--- | :---: | :--- |
| 1 | **The Elements of Quantitative Investing** — Giuseppe A. Paleologo, Wiley Finance, 2025 | `M1`, `M3`, `M4`, `M5`, `M7` | Thống kê chuỗi lợi suất đuôi dày, mô hình nhân tố PCA so với Barra, ước lượng hiệp phương sai, tối ưu hóa danh mục có ma sát, rủi ro thanh lý đám đông và quy trình báo cáo nghiên cứu tại quỹ đa chiến lược. |
| 2 | **Handbook of Price Impact Modeling** — Kevin T. Webster, Chapman & Hall / CRC, 2023 | `M1`, `M2`, `M5` | Dữ liệu vi cấu trúc sổ lệnh hiện đại, chọn lựa bất lợi khi khớp lệnh giới hạn, luật căn bậc hai của tác động thị trường, hạt nhân suy giảm bộ nhớ giá và lịch thực thi lệnh tối ưu. |
| 3 | **Causal Factor Investing: Can Factor Investing Become Scientific?** — Marcos López de Prado, Cambridge University Press, 2023 | `M1`, `M3`, `M7` | Sai lệch đặc tả hồi quy nhân tố truyền thống, kiểm soát đa kiểm định, đồ thị nhân quả và quy trình phản biện khoa học tại vòng phỏng vấn Superday. |
| 4 | **Rough Volatility** — Christian Bayer, Peter K. Friz, Masaaki Fukasawa, Jim Gatheral, Antoine Jacquier & Mathieu Rosenbaum, SIAM, 2023 | `M6` | Chuyển động Brown phân số $H \ll 1/2$, bằng chứng thực nghiệm độ nhám biến động, định giá quyền chọn kỳ hạn ngắn và độ dốc mặt cười biến động hiện đại. |
| 5 | **Bayesian Filtering and Smoothing**, 2nd Ed. — Simo Särkkä & Lennart Svensson, Cambridge University Press, 2023 | `M4`, `M6` | Rời rạc hóa phương trình vi phân ngẫu nhiên, bộ lọc Kalman cập nhật tỷ số phòng vệ động và phân biệt rạch ròi giữa bộ lọc nhân quả thời gian thực với bộ làm trơn toàn mẫu. |
| 6 | **Heard on the Street**, 24th Ed. — Timothy Falcon Crack, 2023 & **Options, Futures, and Other Derivatives**, 11th Ed. — John C. Hull, 2022 | `M1`, `M2`, `M6` | Chiến thuật giải toán tư duy bằng bất biến, đấu giá Lời nguyền Kẻ thắng cuộc, định giá phái sinh chuẩn SOFR hậu LIBOR và quản trị độ nhạy Delta - Gamma - Vega. |
| 7 | **Quantitative Portfolio Management: The Art and Science of Statistical Arbitrage** — Michael Isichenko, Wiley, 2021 | `M5`, `M7` | Giải phẫu sáu họ tín hiệu alpha theo chân trời nắm giữ, tối ưu hóa đa chu kỳ, bù trừ lệnh nội bộ và tiêu chuẩn tuyển nạp tín hiệu vào hệ thống sản xuất. |
| 8 | **Active Portfolio Management**, 2nd Ed. — Richard C. Grinold & Ronald N. Kahn, 1999 & **Empirical Market Microstructure** — Joel Hasbrouck, 2007 | `M1`, `M5` | Hai trụ cột kinh điển bất biến về Định luật Cơ bản $\text{IR} \approx \text{IC}\sqrt{\text{BR}}$, phân rã PnL và bộ ba vi cấu trúc Roll - Glosten-Milgrom - Kyle. |

---

## 4. Tuyển Tập Bài Báo Đỉnh Cao Giai Đoạn 2022–2024 (ArXiv & Tạp Chí Hạng Nhất)

Mỗi công trình nghiên cứu mới dưới đây định hình trực tiếp các cuộc thảo luận chuyên môn sâu trong vòng phỏng vấn cuối cùng tại Mỹ:

1. **Tối Ưu Hóa Danh Mục Chuẩn Công Nghiệp Hiện Đại Sau 70 Năm Markowitz (`M5.01`, `M5.02`, `M5.03`, `M5.05`, `M7.02`)**
   - Stephen Boyd, Kasper Johansson, Ronald Kahn, Philipp Schiele & Thomas Schmelzer (2024), *Markowitz Portfolio Construction at Seventy*, `Journal of Portfolio Management`, 50(8) — https://arxiv.org/abs/2401.05080
   - Hợp nhất dự báo alpha đa chân trời, cấu trúc hiệp phương sai nhân tố hạng thấp $\Sigma = F \Sigma_f F^\top + D$, hàm phạt vòng quay vốn và chi phí tác động thị trường lũy thừa $3/2$ trong một bài toán lồi duy nhất.

2. **Độ Phức Tạp Có Chính Quy Hóa & Tổng Quan Học Máy Tài Chính (`M1.01`, `M3.04`, `M3.05`, `M5.04`)**
   - Bryan Kelly, Semyon Malamud & Kangying Zhou (2024), *The Virtue of Complexity in Return Prediction*, `Journal of Finance`, 79(1), 459–503 — https://doi.org/10.1111/jofi.13298
   - Bryan Kelly & Dacheng Xiu (2023), *Financial Machine Learning*, `Foundations and Trends in Finance`, 13(3–4), 205–363 — https://doi.org/10.1561/0500000064

3. **Kiểm Chứng Khả Năng Tái Lập Nhân Tố Toàn Cầu & Đa Kiểm Định Phân Cấp Bayes (`M1.03`, `M3.03`, `M7.01`)**
   - Theis Ingerslev Jensen, Bryan T. Kelly & Lasse Heje Pedersen (2023), *Is There a Replication Crisis in Finance?*, `Journal of Finance`, 78(5), 2465–2518 — https://doi.org/10.1111/jofi.13249

4. **Mất Cân Bằng Luồng Lệnh Đa Tầng & Tác Động Chéo Giữa Các Cổ Phiếu (`M1.04` & `CAP-03`)**
   - Rama Cont, Mihai Cucuringu & Chao Zhang (2023), *Cross-Impact of Order Flow Imbalance in Equity Markets*, `Quantitative Finance`, 23(10), 1373–1393 — https://arxiv.org/abs/2112.13213
   - Petter N. Kolm, Jeremy Turiel & Nicholas Westray (2023), *Deep Order Flow Imbalance: Extracting Alpha at Multiple Horizons from the Limit Order Book*, `Mathematical Finance`, 33(4), 1044–1081 — https://doi.org/10.1111/mafi.12413

5. **Định Giá Hợp Đồng Tương Lai Vĩnh Cửu Trên Thị Trường Tài Sản Số 24/7 (`M1.02`)**
   - Damien Ackerer, Julien Hugonnier & Urban Jermann (2024), *Perpetual Futures Pricing*, `Mathematical Finance`, 34(3) — https://arxiv.org/abs/2310.11771

6. **Làm Co Phi Tuyến Ma Trận Hiệp Phương Sai & Kinh Doanh Chênh Lệch Thống Kê Hiện Đại (`M4.02`, `M4.04` & `CAP-02`)**
   - Olivier Ledoit & Michael Wolf (2022), *The Power of (Non-)Linear Shrinking: A Review and Guide to Covariance Matrix Estimation*, `Journal of Financial Econometrics`, 20(1), 187–218 — https://doi.org/10.1093/jjfinec/nbaa007
   - Jorge Guijarro-Ordonez, Markus Pelger & Greg Zanotti (2024), *Deep Learning Statistical Arbitrage*, `Management Science` / Stanford Working Paper — https://arxiv.org/abs/2106.04028

7. **Biến Động Phụ Thuộc Đường Đi & Dự Báo Lợi Suất Quyền Chọn (`M1.05`, `M4.03`, `M6.02`)**
   - Julien Guyon & Jordan Lekeufack (2023), *Volatility Is Mostly Path-Dependent*, `Quantitative Finance`, 23(9), 1221–1258 — https://doi.org/10.1080/14697688.2023.2221281
   - Turan G. Bali, Heiner Beckmeyer, Mathis Mörke & Florian Weigert (2023), *Option Return Predictability with Machine Learning and Big Data*, `Review of Financial Studies`, 36(9), 3548–3602 — https://doi.org/10.1093/rfs/hhad017

---

## 5. Phương Pháp Đọc Đối Chiếu 3 Bước Cho Nhà Nghiên Cứu Định Lượng

Để biến hệ thống tài liệu chuẩn quốc tế thành phản xạ nghiên cứu thực chiến trong 24 tháng thay vì đọc thụ động:

1. **Bước 1 — Đọc Bài giảng Cầu nối & Sách Kinh điển ở nửa màn hình trái**: Nắm vững định lý gốc, ký hiệu toán học chuẩn hóa và điều kiện biên bất biến trước khi đi vào các mô hình mở rộng phức tạp.
2. **Bước 2 — Mở Đối chiếu Nghiên cứu 2022–2025 & Tự Chứng minh lại**: Nhấn trực tiếp liên kết **Nguồn xuất bản / ArXiv ↗** trên từng thẻ đọc để mở bản PDF mở hoặc bài báo mới nhất, đồng thời tự gõ lại các bước biến đổi cốt lõi ngay trên khung ghi chú trực tiếp cạnh đoạn văn bản đang đọc.
3. **Bước 3 — Kiểm chứng Số học & Ngân hàng 120 Đề Phỏng vấn**: Mọi giả thuyết từ sách và bài báo đều cần được kiểm tra lại bằng mô phỏng Python/NumPy trên dữ liệu nhiễu hữu hạn mẫu và rèn tốc độ giải đề trực tiếp trong kho 120 bài toán định lượng chuẩn Phố Wall.
