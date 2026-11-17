# M7.01 — Giải phẫu Sáu Họ Tín hiệu Alpha Thực Chiến Trên Cổ phiếu Mỹ & Hợp đồng Tương lai

## 1. Trực giác & Động lực: Mọi Tín hiệu Alpha Thật Đều Phải Chỉ Rõ Ai Đang Trả Tiền

Khi bước vào bàn nghiên cứu cổ phiếu và hợp đồng tương lai tại WorldQuant, Trexquant, Two Sigma hay Citadel, nguyên tắc đầu tiên mà mọi trưởng nhóm truyền đạt là: *"Nếu bạn không chỉ ra được đối tác nào ở phía bên kia sổ lệnh đang chấp nhận mất phần bù cho bạn — vì ràng buộc pháp lý, áp lực thanh khoản hay thiên lệch hành vi nhận thức — thì đường cong lợi nhuận đẹp đẽ trên màn hình gần như chắc chắn chỉ là nhiễu quá khớp!"*

Hàng chục ngàn biểu thức tín hiệu giao dịch thực tế tại các quỹ định lượng hiện đại đều quy tụ về **sáu họ cơ chế kinh tế gốc**, trải dài từ chu kỳ nắm giữ vài ngày đến vài tháng:

| Họ Tín hiệu Alpha Cốt lõi | Chu kỳ nắm giữ | Vòng quay 1 chiều/ngày | Phía đối tác trả phần bù kinh tế | Chế độ vĩ mô gây sụt giảm nặng |
| :--- | :--- | :--- | :--- | :--- |
| **1. Đảo chiều ngắn hạn** | $1\text{–}5$ phiên | $40\%\text{–}70\%$ | Quỹ lớn rút/giải ngân gấp đòi thanh khoản tức thời | Khủng hoảng thanh lý dây chuyền nhiều tuần |
| **2. Động lượng phần dư** | $2\text{–}12$ tháng | $3\%\text{–}8\%$ | Nhà đầu tư chốt lời non & dòng vốn tổ chức phản ứng trễ | Đảo chiều chính sách tiền tệ đột ngột chữ V |
| **3. Trôi dạt lợi nhuận `PEAD`** | $15\text{–}60$ phiên | $5\%\text{–}12\%$ | Chuyên viên phân tích bán phía neo dự báo cũ bảo thủ | Mùa báo cáo có nhiễu sáp nhập / hướng dẫn ngược |
| **4. Sinh lời gộp & Dồn tích** | $3\text{–}12$ tháng | $1\%\text{–}4\%$ | Đám đông định giá theo P/E bề mặt bỏ qua dòng tiền thật | Sóng đầu cơ cổ phiếu rác lãi suất $0\%$ ép bán khống |
| **5. Thanh khoản Amihud** | $5\text{–}30$ phiên | $10\%\text{–}25\%$ | Tổ chức chịu giới hạn quy mô bỏ rơi mã thanh khoản vừa | Rút chạy toàn cầu tìm nơi trú ẩn an toàn |
| **6. Chuỗi cung ứng & Carry** | $10\text{–}45$ phiên | $8\%\text{–}20\%$ | Phân mảnh chú ý theo ngành hẹp & người mua bảo hiểm | Đứt gãy chuỗi cung ứng / giãn rộng chênh lệch kỳ hạn |

---

## 2. Họ 1 & Họ 2: Đảo chiều Ngắn hạn so với Động lượng Phần dư Trung hạn

### 2.1. Họ 1 — Đảo chiều Ngắn hạn Chu kỳ 1–5 Phiên

- **Cơ chế kinh tế:** Khi một quỹ tương hỗ lớn cần giải ngân hoặc rút vốn gấp mà không xuất phát từ thông tin nội tại mới của công ty, luồng lệnh một chiều tạm thời làm cạn thanh khoản sổ lệnh. Các nhà tạo lập thị trường và chiến lược **Đảo chiều Ngắn hạn** (Short-Term Reversal — Jegadeesh 1990; Nagel 2012) đóng vai trò người bảo hiểm thanh khoản: mua vào các cổ phiếu vừa bị bán tháo quá đà và bán khống các mã vừa bị đẩy vọt trong $1\text{–}5$ phiên gần nhất để thu phần bù hồi phục giá, đặc biệt sinh lời cao khi chỉ số VIX tăng làm thu hẹp hạn mức bảng cân đối của giới tạo lập truyền thống.
- **Công thức toán học tường minh:** Một sai lầm sơ đẳng là mua mù quáng mọi cổ phiếu giảm sàn — nếu cổ phiếu rơi $-15\%$ do báo cáo thu nhập quý tệ hại hoặc cảnh báo phá sản, giá sẽ trượt tiếp thay vì hồi phục! Tín hiệu chuẩn tổ chức phải tính trên **phần dư đặc thù** $\varepsilon_{i,t}$ đã khử thị trường và ngành, chia cho biến động $\hat{\sigma}_{i,t}$ và giảm mạnh trọng số vào những ngày phát sinh sự kiện tin tức $\mathbb{I}_{\text{news}}(i, t) \in \{0, 1\}$:

$$
\alpha_{i,t}^{\text{Rev}} = -\operatorname{zscore}_{\text{ind}}\left(\frac{\sum_{k=0}^{4} (5 - k)\,\varepsilon_{i, t-k}}{15\,\hat{\sigma}_{i,t}\big(1 + \gamma_{\text{news}}\,\mathbb{I}_{\text{news}}(i, t)\big)}\right)
$$

- **Điều kiện thất bại:** Do tín hiệu đổi dấu liên tục nên vòng quay vốn cực lớn; nếu trượt giá khớp lệnh vượt quá $8\text{–}10\text{ bps}$, toàn bộ lãi gộp biến thành lỗ ròng!

### 2.2. Họ 2 — Động lượng Lát cắt Ngang & Động lượng Phần dư Chu kỳ 2–12 Tháng

- **Cơ chế kinh tế:** Ở chân trời từ $1$ tháng đến $12$ tháng, hành vi giá đảo hẳn từ hồi quy trung bình sang xu hướng tiếp diễn nhờ sự lan tỏa thông tin chậm và tâm lý neo giá lịch sử. Lưu ý kỹ thuật bắt buộc: mọi tín hiệu động lượng trung hạn đều phải **bỏ qua $21$ phiên giao dịch gần nhất** trên cửa sổ $[t-252, t-21]$ để không va chạm ngược chiều với hiệu ứng đảo chiều ngắn hạn ở Họ 1!
- **Giải pháp Khử Thảm họa Hồi phục Gấu:** Động lượng tổng lợi nhuận cổ điển chịu tử huyệt **Sụp đổ Ép Beta** (Beta Squeeze Crash — Daniel & Moskowitz, 2016). Sau một năm khủng hoảng sâu như đầu năm 2009 hoặc tháng 04/2020, nhóm thắng cuộc 12 tháng trước toàn là cổ phiếu phòng thủ $\beta \approx 0.5$, còn nhóm thua cuộc bị bán khống nặng toàn là ngân hàng và hàng không có $\beta \approx 2.2$. Danh mục gánh phơi nhiễm $\beta_{\text{net}} \approx -1.7$ ẩn; ngay khi thị trường tạo đáy bật tăng $+20\%$, nhánh bán khống tăng vọt $+45\%$ thổi bay nhiều năm lợi nhuận! Blitz, Huij & Martens (2011) hóa giải triệt để tử huyệt này bằng **Động lượng Chéo Phần dư** (Residual Cross-Sectional Momentum) — hồi quy lợi nhuận vượt trội $r_{i,\tau}^e = a_i + b_i^\top F_\tau + \varepsilon_{i,\tau}$ trên các nhân tố Fama-French rồi chuẩn hóa tổng phần dư trên độ lệch chuẩn phần dư:

$$
\alpha_{i,t}^{\text{ResMom}} = \frac{\sum_{\tau = t-252}^{t-21} \hat{\varepsilon}_{i,\tau}}{\sqrt{\sum_{\tau = t-252}^{t-21} \big(\hat{\varepsilon}_{i,\tau} - \bar{\varepsilon}_{i,t}\big)^2}}
$$

---

## 3. Họ 3 & Họ 4: Trôi Dạt Sau Báo cáo Quý & Chất lượng Kế toán Dồn tích

### 3.1. Họ 3 — Trôi Dạt Sau Công bố Lợi nhuận & Bất ngờ Thu nhập Chuẩn hóa

- **Cơ chế kinh tế:** Thực nghiệm năm thập kỷ chứng minh hiện tượng **Trôi dạt Sau Công bố Lợi nhuận** (Post-Earnings Announcement Drift — `PEAD`, Bernard & Thomas 1989): những công ty vượt xa dự báo đồng thuận tiếp tục sinh lời vượt trội bền bỉ trong $40\text{–}60$ phiên tiếp theo, vì giới phân tích bán phía điều chỉnh dự phóng các quý kế tiếp quá dè dặt và các ủy ban đầu tư định chế cần nhiều tuần họp phê duyệt mới giải ngân hết quy mô lệnh.
- **Công thức toán học tường minh:** Kết hợp chỉ số bất ngờ lợi nhuận chuẩn hóa — ký hiệu quốc tế là `SUE`, đo chênh lệch thu nhập thực tế $\text{EPS}_{i,q}^{\text{act}}$ so với trung bình đồng thuận $\mu_{\text{est}}$ chia cho độ phân tán dự báo $\sigma_{\text{est}}$ — với phản ứng giá bất thường trong cửa sổ $3$ ngày quanh ngày ra tin $\text{CAR}_{i,[-1,+1]}$, suy giảm mũ theo số ngày đã trôi qua $\Delta t_{\text{earn}}$:

$$
\text{SUE}_{i,t} = \frac{\text{EPS}_{i,q}^{\text{act}} - \mu\big(\text{EPS}_{i,q}^{\text{est}}\big)}{\sigma\big(\text{EPS}_{i,q}^{\text{est}}\big) + \delta_0}, \qquad \alpha_{i,t}^{\text{PEAD}} = \left[\operatorname{rank}\big(\text{SUE}_{i,t}\big) + \operatorname{rank}\left(\frac{\text{CAR}_{i,[-1,+1]}}{\hat{\sigma}_{i,t}}\right)\right] e^{-\lambda_{\text{pead}} \Delta t_{\text{earn}}}
$$

- **Điều kiện thất bại:** Suy giảm mạnh ở nhóm $100$ cổ phiếu vốn hóa siêu lớn nơi thuật toán đọc văn bản báo cáo trong vài mili-giây, và rất dễ dính lỗi nhìn trước tương lai nếu căn sai mốc công bố trước giờ mở cửa so với sau giờ đóng cửa!

### 3.2. Họ 4 — Khả năng Sinh lời Gộp & Dị thường Kế toán Dồn tích

- **Cơ chế kinh tế:** Richard Sloan (1996) phát hiện ra **Dị thường Khoản Dồn tích Hoạt động** (Operating Accruals Anomaly). Lợi nhuận kế toán báo cáo luôn bằng dòng tiền mặt thực thu cộng phần kế toán dồn tích: $\text{Earnings} = \text{Operating Cash Flow} + \text{Accruals}$. Khi công ty báo lãi kỷ lục nhưng tiền mặt không chảy vào két — toàn bộ lợi nhuận nằm ở khoản phải thu khách hàng phình to hoặc hàng tồn kho ứ đọng do ban giám đốc nới tín dụng ép doanh số ảo — tính bền vững của lợi nhuận đó cực thấp. Thị trường định giá ngây thơ theo tổng EPS sẽ trả giá quá đắt cho nhóm dồn tích cao, khiến nhóm này tạo ra **lợi suất tương lai âm có hệ thống**!
- **Công thức toán học tường minh:** Ghép ngược dấu khoản dồn tích chuẩn hóa trên tài sản bình quân $\overline{\text{Assets}}_{i,t}$ với tỷ suất sinh lời gộp $\frac{\text{Rev} - \text{COGS}}{\text{Assets}}$ của Robert Novy-Marx (2013) bên trong từng ngành phi tài chính:

$$
\text{Accruals}_{i,t} = \frac{(\Delta \text{CA}_{i,t} - \Delta \text{Cash}_{i,t}) - (\Delta \text{CL}_{i,t} - \Delta \text{STD}_{i,t}) - \text{Dep}_{i,t}}{\overline{\text{Assets}}_{i,t}}, \qquad \alpha_{i,t}^{\text{Qual}} = \operatorname{zscore}_{\text{ind}}\left(\frac{\text{Rev}_{i,t} - \text{COGS}_{i,t}}{\text{Assets}_{i,t}}\right) - \operatorname{zscore}_{\text{ind}}\big(\text{Accruals}_{i,t}\big)
$$

---

## 4. Họ 5 & Họ 6: Kém Thanh khoản Amihud, Mạng Cung ứng & Lợi suất Lưu ký Phái sinh

### 4.1. Họ 5 — Phần bù Kém Thanh khoản Amihud & Tương tác Khối lượng – Biến động

- **Cơ chế kinh tế:** Yakov Amihud (2002) đo độ dịch chuyển giá tuyệt đối trên mỗi đô-la giá trị khớp lệnh hàng ngày như một xấp xỉ tần suất thấp cho hệ số tác động giá $\lambda$ của Kyle (`M1.04`). Ở chân trời hàng tháng, cổ phiếu có **Tỷ số Kém Thanh khoản Amihud** (Amihud Illiquidity Ratio) cao phải trả phần bù thanh khoản dương; ở chân trời $5\text{–}20$ phiên, tương quan âm giữa thứ hạng khối lượng và thứ hạng giá đóng cửa lại phát hiện sớm sự phân phối đỉnh:

$$
\text{ILLIQ}_{i,t} = \frac{1}{20}\sum_{d=0}^{19} \frac{|r_{i, t-d}|}{\text{DollarVolume}_{i, t-d}}, \qquad \alpha_{i,t}^{\text{VolPrc}} = -\operatorname{corr}_{15}\Big(\operatorname{rank}(\text{Volume}_{i,t}), \, \operatorname{rank}(\text{Close}_{i,t})\Big)
$$

### 4.2. Họ 6 — Lan truyền Dẫn – Trễ Chuỗi Cung ứng & Lợi suất Lưu ký Hợp đồng Tương lai

- **Cơ chế mạng liên doanh nghiệp:** Cohen & Frazzini (2008) cùng Menzly & Ozbas (2010) chỉ ra hiệu ứng **Dẫn – Trễ Chuỗi Cung ứng** (Supply-Chain Lead-Lag): khi rổ cổ phiếu các khách hàng lớn $j$ — chiếm tỷ trọng doanh thu $w_{ij,t}$ của nhà cung cấp linh kiện $i$ — tăng vọt trong $15$ phiên qua, cổ phiếu nhà cung cấp $i$ phản ứng chậm và sẽ tăng đuổi theo trong $10\text{–}20$ phiên kế tiếp:

$$
\alpha_{i,t}^{\text{Supply}} = \sum_{j \neq i} w_{ij, t} \, r_{j,[t-15, t-1]}^{\text{ind-adj}} - \gamma_{\text{self}} \, r_{i,[t-15, t-1]}^{\text{ind-adj}}, \qquad \text{với } \sum_{j \neq i} w_{ij, t} = 1
$$

- **Cơ chế phái sinh đa tài sản:** Trên hợp đồng tương lai hàng hóa, trái phiếu, ngoại hối và hợp đồng vĩnh cửu tiền mã hóa, **Lợi suất Lưu ký** (Carry Yield — Koijen et al., 2018) thu hoạch chênh lệch kỳ hạn khi đường cong giá giao ngay đứng yên, mua tài sản bù hoãn bán $F_{k,t}^{(T)} < S_{k,t}$ hoặc hưởng lãi suất tài trợ âm, nhưng chịu rủi ro **Thác Thanh lý Giảm Đòn bẩy** (Deleveraging Cascade) khi thị trường hoảng loạn:

$$
\text{Carry}_{k,t}^{\text{Fut}} = \frac{S_{k,t} - F_{k,t}^{(T)}}{F_{k,t}^{(T)}} \cdot \frac{365}{T - t}, \qquad \text{Carry}_{c,t}^{\text{Perp}} = -\operatorname{EMA}_{14}\big(\text{FundingRate}_{c,t}\big) \times 3 \times 365
$$

### 4.3. Cài đặt Vector Hóa Động lượng Phần dư, Thanh khoản Amihud & Điều tiết Động

Đoạn mã dưới đây cài đặt trọn vẹn bộ trích xuất phần dư trực giao $252$ phiên Blitz-Huij-Martens, chỉ số kém thanh khoản Amihud chuẩn hóa mặt cắt ngang, và bộ điều tiết trọng số động Daniel-Moskowitz tự động giảm đòn bẩy động lượng khi biến động thực hiện $22$ phiên tăng vọt sau thị trường giá xuống:

```python
import numpy as np

def cross_sectional_zscore(vec: np.ndarray, clip: float = 3.5) -> np.ndarray:
    z = (vec - np.nanmean(vec)) / (np.nanstd(vec) + 1e-8)
    return np.clip(z, -clip, clip)

def compute_residual_momentum(ret_window: np.ndarray, fac_window: np.ndarray, skip_days: int = 21) -> np.ndarray:
    """ret_window: (252, N) lợi nhuận vượt trội; fac_window: (252, K) nhân tố [t-251 .. t]."""
    T_win = ret_window.shape[0]
    X = np.column_stack([np.ones(T_win), fac_window])
    coef, _, _, _ = np.linalg.lstsq(X, ret_window, rcond=None)
    resid = ret_window - X @ coef
    core_resid = resid[:-skip_days, :]
    raw_score = core_resid.sum(axis=0) / (core_resid.std(axis=0, ddof=1) + 1e-8)
    return cross_sectional_zscore(raw_score)

def compute_amihud_signal(ret_20d: np.ndarray, dollar_vol_20d: np.ndarray) -> np.ndarray:
    """ret_20d, dollar_vol_20d: (20, N) trên cửa sổ 20 phiên gần nhất."""
    illiq = np.nanmean(np.abs(ret_20d) / np.maximum(dollar_vol_20d, 1e4), axis=0)
    return cross_sectional_zscore(np.log1p(illiq * 1e6))

def compute_quality_accruals_signal(
    rev: np.ndarray, cogs: np.ndarray, d_ca: np.ndarray, d_cash: np.ndarray,
    d_cl: np.ndarray, d_std: np.ndarray, dep: np.ndarray, avg_assets: np.ndarray,
) -> np.ndarray:
    """Kết hợp sinh lời gộp Novy-Marx dương với dị thường dồn tích Sloan đảo dấu âm."""
    gross_prof = (rev - cogs) / np.maximum(avg_assets, 1e-6)
    accruals = ((d_ca - d_cash) - (d_cl - d_std) - dep) / np.maximum(avg_assets, 1e-6)
    return cross_sectional_zscore(gross_prof) - cross_sectional_zscore(accruals)

def regime_blend_weights(mkt_cum_2y: float, mkt_vol_22d: float, target_vol: float = 0.15) -> tuple[float, float]:
    """Tăng tỷ trọng Đảo chiều và co hẹp Động lượng khi thị trường gấu bật tăng biến động cao."""
    panic_bear = (mkt_cum_2y < 0.0) and (mkt_vol_22d > 0.25)
    w_mom = min(1.0, (target_vol / max(mkt_vol_22d, 1e-4)) ** 2) * (0.5 if panic_bear else 1.0)
    w_rev = 1.35 if mkt_vol_22d > 0.25 else 0.85
    tot = w_mom + w_rev
    return w_rev / tot, w_mom / tot
```

> [!NOTE]
> **Cơ chế Điều tiết Biến động Theo Chế độ Thị trường Của Daniel & Moskowitz (2016):**
> Vì sao bàn giao dịch đa tín hiệu tại Citadel và Two Sigma hiếm khi giữ trọng số tĩnh $50\% / 50\%$ giữa Đảo chiều và Động lượng suốt cả năm? Nghiên cứu thực nghiệm cho thấy phương sai của nhân tố Động lượng có khả năng dự báo rất cao nhờ hiệu ứng cụm biến động GARCH, trong khi lợi nhuận kỳ vọng của nó lại chuyển sang âm đúng vào pha thị trường gấu bật hồi mạnh! Nếu gọi $\mathbb{I}_{\text{Bear}, t-1} \in \{0, 1\}$ là biến chỉ báo lợi nhuận tích lũy $24$ tháng qua của thị trường chung mang dấu âm và $\hat{\sigma}_{\text{Mom}, t}^2$ là phương sai thực hiện $22$ phiên gần nhất của rổ Động lượng, tỷ trọng phân bổ vốn tối ưu hóa tỷ số Sharpe có điều kiện tuân theo luật tỷ lệ nghịch phương sai:
>
> $$
> \lambda_{t}^{\text{Mom}} = \frac{\mu_0 - \gamma_{\text{bear}}\,\mathbb{I}_{\text{Bear}, t-1}\hat{\sigma}_{\text{Mkt}, t}}{\hat{\sigma}_{\text{Mom}, t}^2}
> $$
>
> Ngược lại, phần bù cung cấp thanh khoản của chiến lược Đảo chiều ngắn hạn lại nở rộng tuyến tính theo chỉ số VIX khi các ngân hàng đầu tư thắt chặt hạn mức tồn kho theo quy luật kinh tế học của Stefan Nagel năm 2012. Nhờ vậy, việc tự động dịch chuyển vốn từ Động lượng sang Đảo chiều đã lọc tin tức trong những tuần VIX vượt mốc $28$ giúp danh mục tổng thể đi qua các cuộc khủng hoảng năm 2009 và 2020 gần như không bị sụt giảm vốn sâu!

Bảng phân bổ ngân sách rủi ro chuẩn mực dưới đây minh họa cách một nhóm quản lý vốn \$200 triệu dịch chuyển tỷ trọng rủi ro mục tiêu giữa sáu họ tín hiệu theo ba chế độ biến động ngầm định của thị trường Mỹ:

| Chế độ Thị trường Theo VIX | Đảo chiều Ngắn hạn | Động lượng Phần dư | `PEAD` & `SUE` | Chất lượng & Dồn tích | Thanh khoản Amihud | Mạng Cung ứng & Carry |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Êm ả — $\text{VIX} < 16$** | $12\%$ | $28\%$ | $18\%$ | $15\%$ | $12\%$ | $15\%$ |
| **Bình thường — $16 \le \text{VIX} \le 26$** | $18\%$ | $22\%$ | $20\%$ | $18\%$ | $10\%$ | $12\%$ |
| **Căng thẳng — $\text{VIX} > 26$** | $28\%$ | $10\%$ | $18\%$ | $30\%$ | $6\%$ | $8\%$ |

Quan sát cột cuối và cột thứ tư khi $\text{VIX} > 26$: bàn giao dịch cắt giảm mạnh nhóm thu phí lưu ký và kém thanh khoản để tránh thác giải chấp đòn bẩy, hạ Động lượng xuống $10\%$, đồng thời dồn hỏa lực sang cặp bài trùng phòng thủ tốt nhất là **Chất lượng dòng tiền mặt** cùng **Đảo chiều cung cấp thanh khoản có lọc tin tức**!

---

## 5. Ví dụ Phỏng vấn Thực chiến: Ghép Tổ hợp Ngược Pha & Kiểm toán Dung lượng Phí

**Đề bài — Phỏng vấn Thiết kế Danh mục Đa Tín hiệu tại Point72 Cubist và Trexquant:**
1. **Phần A:** Bạn sở hữu $3$ danh mục chuẩn hóa biến động đơn vị gồm Đảo chiều ngắn hạn $\text{SR}_1 = 1.50$, Động lượng phần dư $\text{SR}_2 = 1.10$, và Chất lượng kế toán $\text{SR}_3 = 0.90$, với tương quan lợi nhuận ngày $\rho_{12} = -0.25, \rho_{13} = 0.00, \rho_{23} = -0.20$. Tìm tỷ số Sharpe gộp tối đa khi kết hợp ba họ này!
2. **Phần B:** Với biến động năm mục tiêu $\sigma_{\text{ann}} = 10\%$ và phí khớp lệnh cộng trượt giá một chiều $c = 5\text{ bps}$ tức $0.05\%$, biết vòng quay một chiều mỗi ngày của Đảo chiều là $\text{TO}_1 = 60\%$ còn của Động lượng phần dư là $\text{TO}_2 = 5\%$, hãy tính tỷ số Sharpe ròng sau phí của từng chiến lược!

**Lời giải Chi tiết:**
- **Giải Phần A:** Đặt $\mu_{\text{SR}} = (1.50, 1.10, 0.90)^\top$ và ma trận tương quan $R_\alpha = \begin{pmatrix} 1 & -0.25 & 0 \\ -0.25 & 1 & -0.20 \\ 0 & -0.20 & 1 \end{pmatrix}$ có $\det(R_\alpha) = 0.8975$. Giải hệ tuyến tính $R_\alpha v = \mu_{\text{SR}}$ được $0.8975\,v_2 = 1.10 + 0.375 + 0.180 = 1.655 \implies v \approx (1.961, 1.844, 1.269)^\top$, nâng tỷ số Sharpe kết hợp lên:

$$
\text{SR}_{\text{comb}} = \sqrt{\mu_{\text{SR}}^\top R_\alpha^{-1} \mu_{\text{SR}}} = \sqrt{1.50(1.961) + 1.10(1.844) + 0.90(1.269)} = \sqrt{6.112} \approx \mathbf{2.47}
$$

- **Giải Phần B:** Khấu trừ lực cản chi phí hàng năm $\Delta \text{SR} = \frac{252 \cdot \text{TO}_d \cdot c}{\sigma_{\text{ann}}}$ cho từng chiến lược:

$$
\text{SR}_{1, \text{net}} = 1.50 - \frac{252 \times 0.60 \times 0.0005}{0.10} = \mathbf{0.744}, \qquad \text{SR}_{2, \text{net}} = 1.10 - \frac{252 \times 0.05 \times 0.0005}{0.10} = \mathbf{1.037}
$$

  Dù Đảo chiều có Sharpe gộp cao hơn hẳn, sau $5\text{ bps}$ phí trượt giá, Động lượng phần dư lại thắng áp đảo về Sharpe ròng ($1.037 > 0.744$)! Vì vậy trên thực tế, các quỹ lớn dùng tín hiệu Đảo chiều làm bộ định thời điểm rải lệnh giới hạn cho danh mục trung hạn thay vì khớp lệnh thị trường độc lập.

---

## 6. Ba Cạm bẫy Sống Còn Khi Triển khai Các Họ Alpha Kinh điển

> [!WARNING]
> **Kiểm toán Bắt buộc Trước Khi Đưa Sáu Họ Tín hiệu Vào Vốn Thật:**
> 1. **Độ trễ Phê duyệt Dữ liệu Cơ bản & Chỉnh sửa Hồi tố:** Đối với Họ 3 và Họ 4, nhiều nhà cung cấp dữ liệu giá rẻ ghi đè số liệu báo cáo tài chính đã điều chỉnh kiểm toán sau $6$ tháng lên ngày kết thúc quý cũ! Bắt buộc chỉ đọc dữ liệu tại đúng dấu thời gian nộp hồ sơ công khai (`SEC Filing Acceptance Timestamp`).
> 2. **Bẫy Chia Mẫu Theo Vốn hóa Nhỏ Không Thể Bán Khống:** Hơn $70\%$ lợi nhuận trên giấy của các bài báo học thuật về Dị thường Kế toán và Kém thanh khoản nằm ở $20\%$ cổ phiếu siêu nhỏ có phí mượn kho bán khống $15\%\text{–}40\%/\text{năm}$! Mọi kiểm thử chuẩn quỹ phải khóa vũ trụ thanh khoản tối thiểu `TOP1500` hoặc `TOP3000` có thị giá trên \$5 và thanh khoản ngày trên \$5 triệu.
> 3. **Cộng hưởng Đuôi Âm Khi Dùng Chung Đòn bẩy:** Họ 1 và Họ 6 đều mang đặc tính bán bảo hiểm thanh khoản — lãi đều khi thị trường êm ả nhưng lỗ gắt khi nổ ra cú sốc vĩ mô; hệ thống quản trị rủi ro bắt buộc phải áp trần đòn bẩy gộp chung cho hai nhóm này.
