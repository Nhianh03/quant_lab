# M1.02 — Cơ chế Sổ lệnh Giới hạn, Quy tắc Reg NMS & Hợp đồng Vĩnh cửu Tiền mã hóa

## 1. Trực giác & Động lực: Thị trường Như một Máy Trạng thái Hàng đợi Phân tán

Đối với một kỹ sư phần mềm, sai lầm nguy hiểm nhất khi bước chân vào nghiên cứu định lượng là coi "giá cổ phiếu lúc 10:15:00" như một số thực duy nhất được trả về từ cơ sở dữ liệu. Trong thế giới thực của các sàn giao dịch điện tử hiện đại như NASDAQ, NYSE Arca, CME hay Binance, không hề tồn tại một biến vô hướng nào tên là "giá chân thực". Thứ duy nhất tồn tại vật lý bên trong bộ nhớ RAM của máy chủ khớp lệnh là một cấu trúc dữ liệu hai phía luôn biến động từng nano-giây: **Sổ lệnh giới hạn** (Limit Order Book — `LOB`).

Mọi biểu đồ nến phút hay chuỗi lợi nhuận ngày mà bạn nhìn thấy chỉ là ảnh chụp nén mất mát thông tin của hàng triệu thông điệp thêm lệnh, hủy lệnh và khớp lệnh tác động lên cấu trúc hàng đợi đó. Nếu không hiểu tường tận quy tắc ưu tiên khớp lệnh, cấu trúc hoàn phí tạo lập thanh khoản, sự phân mảnh đa sàn tại Mỹ và cơ chế thanh toán lãi suất tài trợ trên thị trường tài sản số, bạn sẽ viết ra những chiến lược kiếm bộn tiền trên giấy nhưng mất sạch vốn ngay ở tầng thực thi lệnh.

---

## 2. Biểu diễn Toán học của Sổ lệnh Giới hạn & Cơ chế Khớp lệnh

### 2.1. Không gian Trạng thái Rời rạc, Giá Trung tâm và Giá Vi mô

Sàn giao dịch quy định hai đơn vị lượng tử hóa cơ bản: **bước giá tối thiểu** (Tick Size) $\vartheta > 0$ (ví dụ $\vartheta = \$0.01$ đối với phần lớn cổ phiếu Mỹ niêm yết có thị giá từ \$1.00 trở lên theo Quy tắc 612) và **lô khối lượng tối thiểu** (Lot Size) $\ell_0 > 0$. Mọi mức giá hợp lệ đều phải nằm trên lưới rời rạc $\mathcal{P} = \{k\vartheta : k \in \mathbb{N}\}$.

Tại thời điểm liên tục $t \ge 0$, mỗi lệnh giới hạn đang chờ trên sổ được đặc trưng bởi bộ bốn $x = (p_x, q_x, \epsilon_x, \tau_x)$, trong đó $p_x \in \mathcal{P}$ là mức giá giới hạn, $q_x > 0$ là khối lượng còn lại chưa khớp, $\epsilon_x \in \{+1, -1\}$ chỉ chiều lệnh ($+1$ cho mua, $-1$ cho bán), và $\tau_x \le t$ là dấu thời gian ghi nhận tại cổng khớp lệnh của sàn. Từ tập hợp các lệnh đang mở, ta định nghĩa hàm độ sâu thanh khoản phía mua $V_t^b(p) = \sum_{x : \epsilon_x = +1, p_x = p} q_x$ và phía bán $V_t^a(p) = \sum_{x : \epsilon_x = -1, p_x = p} q_x$, dẫn tới các đại lượng Cấp độ 1 cốt lõi:

- **Giá chào mua cao nhất** (Best Bid): $b_t = \max \{p \in \mathcal{P} : V_t^b(p) > 0\}$, đi kèm tổng khối lượng chờ mua tại đỉnh sổ $q_t^b = V_t^b(b_t)$.
- **Giá chào bán thấp nhất** (Best Ask): $a_t = \min \{p \in \mathcal{P} : V_t^a(p) > 0\}$, đi kèm tổng khối lượng chờ bán tại đỉnh sổ $q_t^a = V_t^a(a_t)$.
- **Độ rộng chênh lệch mua - bán** (Bid-Ask Spread): $s_t = a_t - b_t \ge \vartheta$ (trong trạng thái sổ lệnh bình thường không bị vắt chéo, luôn có $b_t < a_t$).
- **Giá trung tâm** (Mid-Price): $m_t = \frac{a_t + b_t}{2}$.

Mặc dù $m_t$ được dùng phổ biến làm mốc tham chiếu đối xứng, nó hoàn toàn phớt lờ sự mất cân bằng khối lượng tại hai đầu hàng đợi. Hãy xét một cổ phiếu có $b_t = \$100.00$ với $q_t^b = 9{,}500$ cổ phiếu đang xếp hàng chờ mua, trong khi tại $a_t = \$100.01$ chỉ còn vỏn vẹn $q_t^a = 500$ cổ phiếu chờ bán. Trực giác hàng đợi cho thấy chỉ cần một lệnh mua thị trường nhỏ quét qua $500$ cổ phiếu là mức chào bán $\$100.01$ lập tức cạn sạch và mặt bằng giá nhích lên, trái lại cần tới một lực bán gấp $19$ lần mới đánh sập được bức tường mua tại $\$100.00$. Để nắm bắt thông tin này, các bàn giao dịch định lượng sử dụng **giá vi mô có trọng số khối lượng đảo ngược** (Microprice):

$$
p_t^{\text{micro}} = \frac{q_t^b \, a_t + q_t^a \, b_t}{q_t^b + q_t^a} = m_t + \frac{s_t}{2} \cdot I_t, \qquad I_t = \frac{q_t^b - q_t^a}{q_t^b + q_t^a} \in [-1, 1]
$$

**Chứng minh Trực giác Hấp thụ Đối xứng cho Giá Vi mô.** Giả sử luồng sự kiện rút thanh khoản ròng ở hai đầu sổ lệnh diễn ra đối xứng với cường độ bằng nhau theo những bước đơn vị nhỏ cho tới khi một trong hai hàng đợi $q_t^b$ hoặc $q_t^a$ cạn về $0$ trước: nếu $q_t^a$ cạn trước thì giá hiệu quả bật lên $a_t$; nếu $q_t^b$ cạn trước thì giá tụt xuống $b_t$. Xem quá trình chênh lệch khối lượng tương đối như một bước đi ngẫu nhiên đối xứng bắt đầu tại $q_t^b$ trên đoạn $[0, q_t^b + q_t^a]$, xác suất chạm biên trên $q_t^b + q_t^a$ (tức phía bán $q_t^a$ bị ăn hết về $0$ trước) chính xác bằng tỷ lệ $\pi_{\text{up}} = \frac{q_t^b}{q_t^b + q_t^a}$, còn xác suất phía mua cạn trước là $\pi_{\text{down}} = \frac{q_t^a}{q_t^b + q_t^a}$. Lấy kỳ vọng giá tại thời điểm một đầu hàng đợi vừa cạn sạch:

$$
\mathbb{E}[P_{\tau} \mid \mathcal{F}_t] = \pi_{\text{up}} \, a_t + \pi_{\text{down}} \, b_t = \frac{q_t^b \, a_t + q_t^a \, b_t}{q_t^b + q_t^a} = p_t^{\text{micro}}
$$

Chính vì nhân chéo $q_t^b$ với $a_t$ và $q_t^a$ với $b_t$ (chứ không phải nhân thuận $q_t^b b_t + q_t^a a_t$ như công thức trung bình cộng khối lượng sai lầm của người mới!), $p_t^{\text{micro}} - m_t$ trở thành một trong những đặc trưng dự báo biến động giá ngắn hạn mạnh nhất ở tần số mili-giây đến vài giây. $\blacksquare$

### 2.2. Hàng đợi Ưu tiên Giá - Thời gian, Các Loại Lệnh và Lựa chọn Bất lợi Vị trí Hàng đợi

Đại đa số các sàn cổ phiếu và tiền mã hóa áp dụng thuật toán khớp lệnh **Ưu tiên Giá – Thời gian** (Price-Time Priority / FIFO): lệnh mua trả giá cao hơn luôn được khớp trước; ở cùng một mức giá $p$, lệnh nào có dấu thời gian đến máy chủ khớp lệnh $\tau_x$ nhỏ hơn đứng đầu hàng đợi. (Một ngoại lệ quan trọng là các hợp đồng tương lai lãi suất ngắn hạn như SOFR trên sàn CME sử dụng cơ chế **phân bổ tỷ lệ thuận** — Pro-Rata Allocation — chia khối lượng khớp theo tỷ trọng kích thước lệnh hiển thị, dẫn tới cuộc đua phóng đại kích thước lệnh treo).

Bên cạnh lệnh giới hạn tiêu chuẩn và lệnh thị trường (Market Order), bộ công cụ thực thi của quỹ đầu cơ dựa vào bốn biến thể kiểm soát trạng thái khớp:
- **`IOC` (Immediate-or-Cancel)**: Khớp ngay lập tức tối đa phần khối lượng có sẵn tại mức giá chỉ định hoặc tốt hơn, tự động hủy ngay phần dư chưa khớp để không bao giờ để lộ ý định trên sổ lệnh.
- **`FOK` (Fill-or-Kill)**: Chỉ thực thi nếu toàn bộ khối lượng yêu cầu được đáp ứng tức thì, bằng không hủy trọn vẹn cả lệnh.
- **`Post-Only` (Chỉ Cung cấp Thanh khoản)**: Nếu tại thời điểm thông điệp tới sàn, giá sổ lệnh đã dịch chuyển khiến lệnh của bạn vô tình vắt chéo sang phía đối ứng và trở thành lệnh lấy thanh khoản chịu phí cao, sàn sẽ tự động từ chối hoặc trượt giá lùi một bước để đảm bảo bạn luôn nhận hoàn phí tạo lập.
- **Lệnh Ẩn / Lệnh Tảng băng (Hidden / Iceberg Order)**: Chỉ hiển thị một phần nhỏ khối lượng nổi trên bảng điện Cấp độ 2 để che giấu quy mô thực của định chế, đổi lại phần khối lượng ẩn bị xếp độ ưu tiên thấp hơn mọi lệnh hiển thị công khai ở cùng mức giá đó.

Hầu hết các sàn hiện đại vận hành theo biểu phí **Tạo lập – Lấy thanh khoản** (Maker-Taker Pricing): người lấy thanh khoản chủ động trả phí $f_{\text{take}} > 0$ (ví dụ $0.30$ xu mỗi cổ phiếu trên NASDAQ hoặc $2\text{–}4\text{ bps}$ trên sàn tiền mã hóa), trong khi người treo lệnh giới hạn thụ động được sàn trả khoản **hoàn phí** (Rebate) $r_{\text{make}} > 0$ (ví dụ $0.20$ xu mỗi cổ phiếu). Một số sàn như Nasdaq BX hoặc Cboe EDGA đảo ngược cấu trúc này thành **Thu phí Tạo lập – Hoàn phí Lấy thanh khoản** (Inverted / Taker-Maker Venue), trả tiền cho người gửi lệnh thị trường để giành quyền xếp đầu hàng đợi ở những cổ phiếu bị kẹp cứng độ rộng chênh lệch đúng bằng 1 xu!

**Mệnh đề 1.2 (Điều kiện Sinh lời Kỳ vọng của Lệnh Giới hạn và Cái bẫy Cuối Hàng đợi).** *Xét nhà giao dịch đặt lệnh mua giới hạn tại $b_t = m_t - \frac{s}{2}$ chờ thu nửa chênh lệch $\frac{s}{2}$ cộng hoàn phí $r_{\text{make}}$. Gọi $F \in \{0, 1\}$ là biến cố lệnh được khớp trong chân trời $\Delta t$. Lợi nhuận kỳ vọng có điều kiện khi lệnh được khớp là:*

$$
\mathbb{E}[\text{PnL} \mid F = 1] = \frac{s}{2} + r_{\text{make}} + \mathbb{E}[m_{t + \Delta t} - m_t \mid F = 1]
$$

**Phân tích Vi cấu trúc.** Trong giả lập ngây thơ, người mới giả định $\mathbb{E}[m_{t+\Delta t} - m_t \mid F = 1] = 0$ và tưởng rằng treo lệnh giới hạn luôn ăn chắc $\frac{s}{2} + r_{\text{make}} > 0$. Trên thực tế, nếu bạn đứng ở **cuối hàng đợi** (Back of the Queue) sau $10{,}000$ cổ phiếu của các hãng tần số cao, lệnh mua của bạn chỉ được khớp khi một làn sóng bán tháo lớn quét sạch toàn bộ $10{,}000$ cổ phiếu đứng trước VÀ đâm xuyên qua mức giá $b_t$, kéo giá trung tâm mới sập xuống $m_{t+\Delta t} \ll b_t$. Ngược lại, những lần thị trường chỉ rung nhẹ rồi tăng vọt lên $m_{t+\Delta t} \gg a_t$, chỉ có những người đứng đầu hàng đợi được khớp còn lệnh của bạn bị bỏ rơi không khớp ($F = 0$). Hiện tượng $\mathbb{E}[\Delta m \mid F = 1] < -(\frac{s}{2} + r_{\text{make}})$ chính là **lựa chọn bất lợi vị trí hàng đợi** (Queue-Position Adverse Selection) — lý do cốt lõi khiến kiểm thử lệnh giới hạn không mô phỏng hàng đợi luôn thổi phồng lợi nhuận ảo.

---

## 3. Phân mảnh Thị trường Cổ phiếu Mỹ, Quy tắc Reg NMS & Hồ Thanh khoản Tối

Khác với thị trường chứng khoán Việt Nam nơi một mã cổ phiếu chỉ khớp lệnh tập trung trên một sở giao dịch duy nhất, một cổ phiếu Mỹ như Apple (`AAPL`) được niêm yết tại NASDAQ nhưng đồng thời giao dịch song song trên **16 sàn giao dịch công khai** (Lit Exchanges) cộng với hơn **30 hệ thống giao dịch thay thế ngoài sàn** (Alternative Trading Systems — `ATS`) và các nhà nội bộ hóa bán lẻ như Citadel Securities hay Virtu.

### 3.1. Quy tắc Bảo vệ Lệnh và Độ trễ Dữ liệu NBBO

Để ngăn các sàn phân mảnh khớp lệnh ở mức giá bất lợi cho nhà đầu tư, Ủy ban Chứng khoán Mỹ ban hành **Quy định Hệ thống Thị trường Quốc gia** (Regulation National Market System — `Reg NMS`, áp dụng từ năm 2005–2007). Trụ cột của khung pháp lý này là:

1. **Giá Chào Mua Bán Tốt nhất Toàn quốc** (National Best Bid and Offer — `NBBO`): Tập hợp từ mức giá chào mua hiển thị cao nhất và mức giá chào bán hiển thị thấp nhất của các lô chẵn (Round Lots, thông thường 100 cổ phiếu) trên toàn bộ các sàn công khai:

$$
B_t^{\text{NBBO}} = \max_{v \in \mathcal{V}_{\text{lit}}} b_{t, v}, \qquad A_t^{\text{NBBO}} = \min_{v \in \mathcal{V}_{\text{lit}}} a_{t, v}
$$

2. **Quy tắc Cấm Khớp Xuyên Giá (`Rule 611` — Order Protection Rule)**: Một sàn giao dịch $v_1$ đang có giá chào bán tốt nhất chỉ ở mức $\$100.02$ **bị cấm pháp lý** tự ý khớp một lệnh mua thị trường ở giá $\$100.02$ nếu ngay lúc đó sàn $v_2$ đang hiển thị lệnh bán công khai ở mức tốt hơn là $\$100.01$. Sàn $v_1$ bắt buộc phải định tuyến lệnh sang sàn $v_2$ hoặc từ chối lệnh, trừ khi người đặt lệnh chủ động gắn cờ **Lệnh Quét Liên Sàn** (`ISO` — Intermarket Sweep Order) cam kết rằng chính hệ thống của họ đã đồng thời bắn các lệnh song song đi quét sạch toàn bộ thanh khoản giá $\$100.01$ trên mọi sàn liên quan.

Một chi tiết kỹ thuật quyết định thắng bại ở tần số mili-giây nằm ở sự tồn tại của **hai đường truyền dữ liệu song song**:
- **Luồng Dữ liệu Hợp nhất Công cộng** (`SIP` — Securities Information Processor): Gom báo giá từ mọi sàn về một trung tâm xử lý rồi phát ra `NBBO` chính thức.
- **Luồng Dữ liệu Trực tiếp Độc quyền** (Proprietary Direct Feeds như NASDAQ TotalView-ITCH, NYSE Pillar): Truyền thẳng từng sự kiện sổ lệnh từ máy chủ sàn qua cáp quang riêng tới tủ máy đặt sát sàn (Co-location).

Do khoảng cách địa lý giữa các trung tâm dữ liệu tại bang New Jersey (Carteret, Mahwah và Secaucus) và bước hợp nhất trung gian, luồng `SIP` chậm hơn luồng trực tiếp từ vài chục đến vài trăm micro-giây. Trong khoảng mù ngắn ngủi đó, một mức giá `NBBO` trên luồng công cộng có thể đã biến mất ngoài đời thực (hiện tượng **Độ trễ Kinh doanh Chênh lệch** — Latency Arbitrage), khiến các sàn như **IEX** phải thiết kế cuộn cáp quang dài $38$ dặm ("Speed Bump" trễ $350\,\mu\text{s}$) nhằm bảo vệ lệnh neo trung điểm của các quỹ định chế khỏi bị bắn tỉa bởi tín hiệu nhanh.

### 3.2. Hồ Thanh khoản Tối (Dark Pools)

Chiếm gần $40\%$ tổng khối lượng cổ phiếu Mỹ giao dịch ngoài các sàn hiển thị là các hồ thanh khoản không công bố sổ lệnh trước giao dịch. Một quỹ đầu cơ muốn mua $200{,}000$ cổ phiếu trung bình mà không làm lộ ý định trên sổ lệnh công khai có thể gửi lệnh neo tại trung điểm `NBBO` ($P_{\text{exec}} = \frac{1}{2}(B_t^{\text{NBBO}} + A_t^{\text{NBBO}})$) vào hồ tối. Cả người mua lẫn người bán đều tiết kiệm được trọn vẹn nửa độ rộng chênh lệch $\frac{s_t}{2}$, nhưng phải đối mặt với rủi ro bị các bên dò thanh khoản thả lệnh mồi nhỏ để phát hiện sự hiện diện của "cá voi" rồi lập tức đẩy giá trên sàn sáng chạy trước.

---

## 4. Hợp đồng Tương lai Vĩnh cửu Tiền mã hóa & Kinh doanh Chênh lệch Cơ sở

Nếu thị trường cổ phiếu Mỹ bị chi phối bởi cấu trúc pháp lý phân mảnh giờ hành chính, thì thị trường tài sản số đã khai sinh ra công cụ phái sinh có thanh khoản lớn nhất thế giới giao dịch liên tục $24/7/365$: **Hợp đồng Tương lai Vĩnh cửu** (Perpetual Futures / Crypto Perps, được Robert Shiller đề xuất ý tưởng năm 1992 và sàn BitMEX triển khai năm 2016).

### 4.1. Công thức Lãi suất Tài trợ và Cơ chế Neo giá Không Đáo hạn

Một hợp đồng tương lai truyền thống có ngày đáo hạn cố định $T$, tại đó giá hợp đồng $F_{t,T}$ buộc phải hội tụ về giá giao ngay $S_T$ nhờ quy trình thanh toán cuối kỳ: $F_{t,T} = S_t e^{(r - q)(T - t)}$. Hợp đồng vĩnh cửu loại bỏ hoàn toàn ngày đáo hạn ($T = \infty$) để không bao giờ phải đảo kỳ hạn hợp đồng, thay thế sự hội tụ cuối kỳ bằng dòng tiền **Lãi suất Tài trợ Định kỳ** (Funding Rate) trao đổi trực tiếp ngang hàng giữa bên nắm vị thế mua và bên nắm vị thế bán sau mỗi chu kỳ $\Delta \tau$ (tiêu chuẩn công nghiệp trên Binance, Bybit là mỗi $8$ giờ vào các mốc `00:00`, `08:00`, `16:00 UTC`; trên Hyperliquid hay dYdX là mỗi $1$ giờ):

- Khi $F > 0$ (thị trường phái sinh hưng phấn giao dịch cao hơn giá giao ngay): **Phe Mua trả tiền cho Phe Bán** khoản thanh toán bằng $\text{Notional} \times F$.
- Khi $F < 0$ (thị trường phái sinh bi quan chiết khấu dưới giá giao ngay): **Phe Bán trả tiền cho Phe Mua** khoản thanh toán bằng $\text{Notional} \times |F|$.

Trên hầu hết các sàn tập trung lớn, lãi suất tài trợ $F$ cho mỗi chu kỳ $8$ giờ được tính bởi công thức kẹp chuẩn mực:

$$
F = P + \operatorname{clamp}\big(I - P, \, -0.05\%, \, +0.05\%\big)
$$

trong đó hàm kẹp được định nghĩa bởi $\operatorname{clamp}(x, -d, +d) = \max(-d, \min(+d, x))$, đi kèm hai thành phần vi cấu trúc quan trọng:
1. **Chênh lệch Lãi suất Cơ sở** $I$ (Interest Rate Differential): Phản ánh chênh lệch chi phí vốn mượn đồng định giá USD/USDT so với mượn tài sản cơ sở BTC/ETH, thường được ấn định cố định ở mức $I = 0.01\%$ mỗi $8$ giờ (tương đương $0.03\%$/ngày hay $10.95\%$/năm).
2. **Chỉ số Chênh lệch Giá** $P$ (Premium Index): Không tính thô sơ bằng giá khớp cuối dễ bị thao túng, mà tính bằng trung bình trọng số thời gian của **giá mua tác động** $P_{\text{impact}}^{\text{bid}}$ và **giá bán tác động** $P_{\text{impact}}^{\text{ask}}$ (mức giá trung bình khi quét một khối lượng chuẩn, ví dụ \$10{,}000 hoặc \$200{,}000 ký quỹ trên sổ lệnh hợp đồng vĩnh cửu) so với chỉ số giá giao ngay tổng hợp đa sàn $S_{\text{index}}$:

$$
P_t = \frac{\max\left(0, \, P_{\text{impact}, t}^{\text{bid}} - S_{\text{index}, t}\right) - \max\left(0, \, S_{\text{index}, t} - P_{\text{impact}, t}^{\text{ask}}\right)}{S_{\text{index}, t}}
$$

Hãy khảo sát hành vi phân đoạn từng khúc của hàm $F(P)$ với $I = +0.01\%$ và biên kẹp $d = 0.05\%$:
- **Vùng cân bằng yên ả** khi $|I - P| \le 0.05\% \iff P \in [-0.04\%, +0.06\%]$: khi đó $\operatorname{clamp}(I - P, -0.05\%, +0.05\%) = I - P$, suy ra $F = P + (I - P) = I = +0.01\%$ hằng định! Vùng đệm rộng $10\text{ bps}$ này giữ cho lãi suất tài trợ ổn định ở mức chuẩn $+0.01\%$ khi độ lệch cơ sở chỉ là nhiễu vi cấu trúc nhỏ.
- **Vùng quá nhiệt phía mua** khi $P > +0.06\% \implies I - P < -0.05\%$: hàm kẹp chạm sàn $-0.05\%$, suy ra $F = P - 0.05\%$, tăng tuyến tính theo độ lệch $P$ để thu hút các quỹ định lượng nhảy vào bán hợp đồng vĩnh cửu kéo giá xuống.
- **Vùng chiết khấu phía bán** khi $P < -0.04\% \implies I - P > +0.05\%$: hàm kẹp chạm trần $+0.05\%$, suy ra $F = P + 0.05\% < +0.01\%$ (và âm sâu khi $P < -0.05\%$), thưởng tiền cho người mở vị thế mua giữ giá không trượt xa khỏi giao ngay.

### 4.2. Toán học của Chiến lược Kinh doanh Chênh lệch Cơ sở Trung hòa Delta

Chiến lược nền tảng mang lại quy mô hàng tỷ USD cho các bàn giao dịch tài sản số là **Kinh doanh Chênh lệch Cơ sở Mua Giao ngay – Bán Vĩnh cửu** (Cash-and-Carry Funding Arbitrage). Giả sử tại $t = 0$, nhà nghiên cứu mua $Q$ đơn vị tài sản trên thị trường giao ngay với giá thực thi $S_0$ (bỏ ra vốn $Q S_0$) và đồng thời mở vị thế bán khống $Q$ đơn vị hợp đồng vĩnh cửu với giá khớp $P_0^{\text{perp}} = S_0 (1 + b_0)$ trên tài khoản ký quỹ có tỷ lệ ký quỹ duy trì $m_{\text{maint}}$ và vốn ký quỹ cấp phát là $\alpha_{\text{col}} Q S_0$ ($\alpha_{\text{col}} \in (0, 1]$, tổng vốn bị khóa của toàn chiến lược là $C_{\text{total}} = (1 + \alpha_{\text{col}}) Q S_0$).

Sau $K$ kỳ thanh toán lãi suất tài trợ (tổng thời gian nắm giữ $T$ ngày) và đóng đồng thời cả hai chân tại giá giao ngay $S_T$ cùng giá hợp đồng $P_T^{\text{perp}} = S_T(1 + b_T)$, tổng lãi lỗ bằng tiền mặt trước phí là:

$$
\text{PnL}_{\text{gross}} = \underbrace{Q(S_T - S_0)}_{\text{Chân Mua Giao ngay}} + \underbrace{Q(P_0^{\text{perp}} - P_T^{\text{perp}})}_{\text{Chân Bán Vĩnh cửu}} + \underbrace{\sum_{k=1}^K Q \, P_{t_k}^{\text{mark}} F_k}_{\text{Dòng tiền Lãi suất Tài trợ}}
$$

Khai triển hai hạng tử đầu khi độ lệch cơ sở thu hẹp từ $b_0$ về $b_T \approx 0$ (hoặc biến thiên nhỏ), độ nhạy bậc nhất đối với biến động giá chung $\Delta S = S_T - S_0$ triệt tiêu hoàn toàn ($\Delta_{\text{net}} = +Q - Q = 0$), chỉ còn lại phần hội tụ chênh lệch cơ sở $Q(S_0 b_0 - S_T b_T)$ cộng tổng dòng thu tài trợ trừ tổng phí giao dịch bốn lần vào/ra hai sàn $c_{\text{roundtrip}}$. Tỷ suất sinh lời thực tế trên tổng vốn phân bổ $(1 + \alpha_{\text{col}}) Q S_0$ đạt:

$$
R_{\text{arb}} = \frac{1}{1 + \alpha_{\text{col}}} \left( \frac{S_0 b_0 - S_T b_T}{S_0} + \sum_{k=1}^K \frac{P_{t_k}^{\text{mark}}}{S_0} F_k - c_{\text{roundtrip}} \right)
$$

### 4.3. Đối chiếu Cấu trúc Vi mô Ba Thị trường Định lượng Lớn nhất

| Đặc trưng Vi cấu trúc | Cổ phiếu Mỹ Niêm yết — `Reg NMS` | Hợp đồng Tương lai Truyền thống — `CME` | Hợp đồng Vĩnh cửu Tài sản Số |
| :--- | :--- | :--- | :--- |
| **Thời gian vận hành** | Phiên chính `09:30–16:00 ET` ($6.5$ giờ/ngày, T2–T6) | Gần như $23$ giờ/ngày, nghỉ cuối tuần | Liên tục $24/7/365$, không có phiên đóng cửa |
| **Phân mảnh thanh khoản** | Cực cao (16 sàn sáng + >30 hồ tối + nội bộ hóa) | Tập trung độc quyền theo từng sở giao dịch | Phân mảnh đa sàn độc lập, không có `Rule 611` |
| **Cơ chế hội tụ giá cơ sở** | Tài sản cơ sở trực tiếp (chi phí mượn cổ phiếu khi bán khống) | Đáo hạn thanh toán định kỳ hàng tháng / hàng quý | Dòng tiền lãi suất tài trợ $F$ mỗi $1\text{–}8$ giờ |
| **Đối tác bù trừ & Phá sản** | Trung tâm lưu ký `DTCC` / Môi giới chính (Prime Broker) | Phòng bù trừ `CME Clearing` qua thành viên bù trừ | Thanh lý trực tiếp thời gian thực + Quỹ bảo hiểm + `ADL` |
| **Bước giá tối thiểu** | Chuẩn $\$0.01$ (nén hàng đợi sâu ở mã thị giá thấp) | Cố định theo đặc tả hợp đồng (`ES`: $0.25$ điểm) | Linh hoạt theo bậc thị giá ($0.10$ hoặc $0.01\text{ USDT}$) |

---

## 5. Ví dụ Giải toán Thực chiến: Giá Vi mô & Định cỡ Vốn Arbitrage Vĩnh cửu

**Bài toán 1 (Đọc trạng thái Sổ lệnh & Giá Vi mô):** Cổ phiếu `NVDA` đang hiển thị đỉnh sổ lệnh tại $b_0 = \$120.00$ ($q_0^b = 3{,}000$ cổ phiếu) và $a_0 = \$120.02$ ($q_0^a = 1{,}000$ cổ phiếu). Ngay sau đó xuất hiện liên tiếp hai sự kiện: (1) Một lệnh hủy mua rút $1{,}800$ cổ phiếu khỏi mức $\$120.00$; (2) Một lệnh mua `IOC` giới hạn giá $\$120.02$ với khối lượng $1{,}500$ cổ phiếu đi vào sàn (biết mức chào bán kế tiếp ở $\$120.03$ có $2{,}400$ cổ phiếu). Hãy xác định giá trung tâm $m_t$, mất cân bằng đỉnh sổ $I_t$ và giá vi mô $p_t^{\text{micro}}$ trước và sau hai sự kiện, đồng thời cho biết kết quả khớp lệnh của lệnh `IOC`.

**Lời giải Bài toán 1:**
- **Tại $t = 0$**: Giá trung tâm $m_0 = \frac{120.00 + 120.02}{2} = \$120.01$, độ rộng $s_0 = \$0.02$. Hệ số mất cân bằng $I_0 = \frac{3000 - 1000}{3000 + 1000} = +0.50$. Giá vi mô nghiêng hẳn về phía chào bán:

$$
p_0^{\text{micro}} = 120.01 + \frac{0.02}{2} \times 0.50 = \$120.015
$$

- **Sau sự kiện (1)**: Khối lượng chờ mua tại $\$120.00$ giảm còn $3{,}000 - 1{,}800 = 1{,}200$ cổ phiếu.
- **Sau sự kiện (2)**: Lệnh mua `IOC` khối lượng $1{,}500$ tại giới hạn $\$120.02$ ăn sạch toàn bộ $1{,}000$ cổ phiếu đang chờ bán ở $\$120.02$. Phần dư $500$ cổ phiếu không được phép khớp lên $\$120.03$ (vượt giá giới hạn $\$120.02$) và vì gắn cờ `IOC` nên $500$ cổ phiếu dư bị **hủy tức thì**, không treo lại làm giá chào mua mới tại $\$120.02$! Do đó đỉnh sổ mới trở thành $b_2 = \$120.00$ ($q_2^b = 1{,}200$) và $a_2 = \$120.03$ ($q_2^a = 2{,}400$). Lúc này $m_2 = \$120.015$, $s_2 = \$0.03$, $I_2 = \frac{1200 - 2400}{3600} = -\frac{1}{3}$, và giá vi mô mới bằng:

$$
p_2^{\text{micro}} = 120.015 + \frac{0.03}{2}\left(-\frac{1}{3}\right) = \$120.010
$$

**Bài toán 2 — Định lượng Rủi ro Thanh lý Ký quỹ Chiến lược Cơ sở:** Hợp đồng vĩnh cửu `ETH-PERP` đang giao dịch cao hơn giao ngay với chỉ số chênh lệch trung bình ổn định $P = +0.11\%$ mỗi kỳ $8$ giờ ($I = 0.01\%$). Bạn triển khai \$1{,}000{,}000 tổng vốn theo tỷ lệ phân bổ $\alpha_{\text{col}} = 0.25$ (tức mua giao ngay trị giá $V_0 = \$800{,}000$ và nạp $\$200{,}000$ USDT làm ký quỹ cho chân bán khống vĩnh cửu trị giá $\$800{,}000$). Tỷ lệ ký quỹ duy trì của sàn là $m_{\text{maint}} = 2.0\%$. Tổng chi phí trượt giá và phí mở/đóng trọn vòng cho cả hai chân là $c_{\text{roundtrip}} = 14\text{ bps} = 0.14\%$. Tính lãi suất tài trợ $F$ mỗi kỳ, số ngày hòa vốn chi phí giao dịch, tỷ suất sinh lời ròng năm hóa nếu mức $P$ duy trì trong $30$ ngày, và mức tăng giá đột ngột tối đa của `ETH` khiến chân bán khống bị sàn cưỡng bức thanh lý nếu không kịp bơm thêm tiền!

**Lời giải Bài toán 2:**
1. Vì $I - P = 0.01\% - 0.11\% = -0.10\% < -0.05\%$, công thức kẹp cho $F = 0.11\% - 0.05\% = +0.06\%$ mỗi $8$ giờ, tức mỗi ngày (3 kỳ) chân bán thu về $3 \times 0.06\% = 0.18\%$ tính trên giá trị danh nghĩa $V_0$.
2. Để bù đắp tổng phí hai đầu $c_{\text{roundtrip}} = 0.14\%$ (giả định độ lệch cơ sở lúc đóng bằng lúc mở), chiến lược chỉ cần nắm giữ $0.14\% / 0.18\% \approx 0.78$ ngày (khoảng $19$ giờ, tức 3 kỳ thu phí tài trợ). Trong $30$ ngày nắm giữ (giả sử giá đánh dấu dao động quanh $S_0$), lợi suất ròng trên tổng vốn \$1{,}000{,}000 là:

$$
R_{30\text{d}} = \frac{1}{1 + 0.25} \left( 30 \times 0.18\% - 0.14\% \right) = 0.8 \times 5.26\% = 4.208\% \quad (\text{tương đương } \approx 51.2\%/\text{năm lãi đơn})
$$

3. **Điểm chí mạng — Ngưỡng Thanh lý Ký quỹ**: Mặc dù tổng tài sản hai ví của bạn trung hòa biến động giá, máy chủ thanh lý của sàn phái sinh **không nhìn thấy số ETH nằm ở ví giao ngay tách biệt** (trừ khi dùng tài khoản ký quỹ hợp nhất thế chấp trực tiếp bằng chính đồng ETH đó với hệ số chiết khấu tài sản đảm bảo)! Nếu giá `ETH` tăng vọt tỷ lệ $r > 0$ lên $S_0(1+r)$, chân bán khống lỗ chưa thực hiện $V_0 r$, làm vốn chủ sở hữu tài khoản phái sinh giảm còn $\$200{,}000 - \$800{,}000 \, r$, trong khi yêu cầu ký quỹ duy trì tăng lên $2.0\% \times \$800{,}000(1+r)$. Phương trình chạm ngưỡng thanh lý:

$$
0.25 - r = 0.02(1 + r) \implies 1.02 r = 0.23 \implies r \approx 22.55\%
$$
   Một cây nến tăng sốc $+23\%$ trong đêm của thị trường tiền mã hóa sẽ quét thanh lý chân bán khống của bạn ngay lập tức ở đỉnh sóng, biến danh mục trung hòa thành vị thế mua trần trụi đúng lúc giá quay đầu sập mạnh!

---

## 6. Các Bẫy Thực tiễn về Sổ lệnh & Thị trường Phái sinh

> [!NOTE]
> **Bẫy Tự động Giảm Đòn bẩy (`ADL` — Auto-Deleveraging):** Trên các sàn tiền mã hóa không có thành viên bù trừ chịu trách nhiệm vô hạn như Phố Wall, nếu một cú sập giá quá nhanh khiến lệnh thanh lý của phe mua thua lỗ vượt quá số dư Quỹ Bảo hiểm của sàn, hệ thống sẽ kích hoạt `ADL` — tự động đóng cưỡng bức vị thế đang có lãi lớn nhất và dùng đòn bẩy cao nhất ở phe đối ứng (chính là chân bán khống trong chiến lược trung hòa của bạn!), khiến bạn bất ngờ lộ phơi nhiễm giá giao ngay mà không hề hay biết nếu hệ thống cảnh báo không kiểm tra trạng thái vị thế từng giây.

- **Bẫy Giả định Khớp Giá Trung tâm** (Midpoint Execution Fallacy): Trong các bài báo học thuật sơ cấp, tác giả thường tính lợi nhuận kiểm thử bằng cách giả định mua bán ngay tại $m_t$. Trên thực tế, lệnh chủ động luôn mất tối thiểu $\frac{s_t}{2} + f_{\text{take}}$, còn lệnh neo trung điểm trong hồ tối chịu xác suất khớp thấp hơn nhiều vào đúng những phiên tín hiệu mạnh nhất do cả thị trường đều xếp hàng cùng một phía!
- **Bẫy Đảo chiều Lãi suất Tài trợ Âm Kéo dài**: Khi thị trường bước vào chu kỳ giá xuống hoảng loạn, $F$ có thể chuyển sang âm sâu ($-0.05\%$ đến $-0.20\%$ mỗi $8$ giờ) suốt nhiều tuần liền. Lúc này nếu vội vã đóng vị thế Cash-and-Carry, bạn vừa phải chịu độ lệch giá âm $b_T < 0$ vừa gánh thêm $14\text{ bps}$ phí giao dịch hai đầu, ăn mòn phần lớn lợi nhuận tích lũy của cả tháng trước đó.
