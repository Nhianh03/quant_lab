# M7.02 — Hệ thống Toán tử Thiết kế Alpha, Trung hòa Đa tầng & Chu kỳ Suy thoái Tín hiệu

## 1. Trực giác & Động lực: Đại số Biểu thức Trên Ma trận Không gian – Thời gian

Kể từ công trình kinh điển *101 Formulaic Alphas* của Zura Kakushadze (2016) và hệ sinh thái *WorldQuant BRAIN*, ngôn ngữ biểu thức toán tử đã trở thành tiêu chuẩn công nghiệp để thiết kế nhanh, kiểm thử chéo và kết hợp hàng vạn tín hiệu định lượng tại Trexquant, Squarepoint Capital cũng như các nhóm cổ phiếu hệ thống.

Hãy hình dung toàn bộ kho dữ liệu thị trường là một chồng các ma trận hai chiều $X \in \mathbb{R}^{T \times N}$, trong đó hàng $t \in \{1, \dots, T\}$ biểu diễn ngày giao dịch và cột $i \in \{1, \dots, N\}$ biểu diễn mã cổ phiếu trong vũ trụ thanh khoản như `TOP3000` cổ phiếu Mỹ. Mọi công thức Alpha chuẩn mực đều đi qua bốn tầng biến đổi nối tiếp:
1. **Tầng Trích xuất Đặc trưng Dọc:** Tác động dọc theo lịch sử quá khứ $[t - d + 1, t]$ của từng cổ phiếu $i$ để khử tính không dừng của chuỗi giá và đo lường bất thường cục bộ.
2. **Tầng Chuẩn hóa Ngang:** Biến đổi trên toàn bộ $N$ cổ phiếu tại cùng ngày $t$ để đưa các đại lượng khác đơn vị về chung một thang đo không thứ nguyên, chống nhiễu đuôi dày.
3. **Tầng Trung hòa Rủi ro Đa cấp:** Chiếu trực giao tín hiệu lên không gian bù của các giỏ ngành, quy mô vốn hóa hoặc phân vị biến động để cô lập lợi nhuận đặc thù.
4. **Tầng Làm mượt Suy thoái & Quy đổi Trọng số:** Kéo dài chu kỳ lưu giữ tín hiệu nhằm hạ vòng quay vốn xuống dưới ngưỡng chi phí thực thi, rồi chuẩn hóa thành trọng số danh mục trung hòa đô-la có $\sum_{i=1}^N w_{i,t} = 0$ và $\sum_{i=1}^N |w_{i,t}| = 1$.

---

## 2. Giải phẫu Toán học Toán tử Chuỗi Thời gian so với Biến đổi Lát cắt Ngang

### 2.1. Nhóm Toán tử Chuỗi Thời gian Theo Chiều Dọc

Các **Toán tử Chuỗi Thời gian** (Time-Series Operators) chỉ đọc cửa sổ $d$ phiên quá khứ $\{x_{i, t-d+1}, \dots, x_{i,t}\}$ của từng tài sản độc lập mà không bao giờ chạm tới tương lai $t + 1$:
- `ts_delta(x, d)` $= x_{i,t} - x_{i, t-d}$ và `ts_zscore(x, d)` $= \frac{x_{i,t} - \mu_{i,t}^{(d)}}{\sigma_{i,t}^{(d)}}$: đo sai phân tuyệt đối và độ lệch chuẩn hóa theo lịch sử riêng của mã đó.
- `ts_rank(x, d)` và `ts_decay_linear(x, d)`: `ts_rank` kháng ngoại lai tuyệt đối khi khối lượng nhảy vọt gấp mười lần vào ngày cơ cấu quỹ chỉ số, còn `ts_decay_linear` tính trung bình trượt trọng số giảm tuyến tính từ $d$ về $1$ để nén vòng quay danh mục:

$$
\operatorname{ts\_rank}(x, d)_{i,t} = \frac{1}{d - 1}\sum_{k=1}^{d-1} \mathbb{I}_{\{x_{i,t} > x_{i, t-k}\}} + \frac{1}{2(d - 1)}\sum_{k=1}^{d-1} \mathbb{I}_{\{x_{i,t} = x_{i, t-k}\}}, \qquad \operatorname{ts\_decay\_linear}(x, d)_{i,t} = \frac{\sum_{k=0}^{d-1} (d - k)\,x_{i, t-k}}{d(d + 1) / 2}
$$

- `ts_corr(x, y, d)` so với `ts_cov(x, y, d)`: Trong khi `ts_corr` chia bỏ độ lệch chuẩn của cả $x$ lẫn $y$ nên đối xử bình đẳng giữa mã biến động thấp với mã biến động cao, `ts_cov` giữ nguyên tích biên độ $\sigma_{x,i} \sigma_{y,i}$, tự động khuếch đại cược ở nhóm cổ phiếu đang dao động mạnh.
- `ts_regression(y, x, d, rettype=0)`: Thực hiện phép chiếu bình phương tối thiểu chuỗi $y$ theo biến giải thích $x$ trên cửa sổ $d$ phiên và trả về **phần dư trực giao tại ngày $t$** — cho phép bóc tách phần biến động giá không giải thích được bởi khối lượng hoặc bởi chỉ số chung ngay trong một biểu thức:

$$
\operatorname{ts\_regression}(y, x, d)_{i,t} = \big(y_{i,t} - \bar{y}_{i,t}^{(d)}\big) - \frac{\sum_{k=0}^{d-1}\big(x_{i, t-k} - \bar{x}_{i,t}^{(d)}\big)\big(y_{i, t-k} - \bar{y}_{i,t}^{(d)}\big)}{\sum_{k=0}^{d-1}\big(x_{i, t-k} - \bar{x}_{i,t}^{(d)}\big)^2 + \epsilon} \big(x_{i,t} - \bar{x}_{i,t}^{(d)}\big)
$$

### 2.2. Nhóm Biến đổi Lát cắt Ngang Theo Chiều Rộng

Nếu bạn cộng trực tiếp `ts_delta(close, 5)` tính bằng đô-la với `volume` tính bằng triệu cổ phiếu mà quên chuẩn hóa ngang, vài mã thị giá \$900 sẽ nuốt trọn danh mục! Các **Biến đổi Lát cắt Ngang** (Cross-Sectional Transformations) hoạt động trên mặt cắt $N$ mã tại mỗi ngày $t$:

$$
\operatorname{rank}(x)_{i,t} = \frac{\#\{j : x_{j,t} < x_{i,t}\}}{N - 1}, \qquad \operatorname{signed\_power}(s, p)_{i,t} = \operatorname{sign}(s_{i,t})\,|s_{i,t}|^p, \qquad w_{i,t} = \frac{s_{i,t} - \bar{s}_t}{\sum_{j=1}^N |s_{j,t} - \bar{s}_t|}
$$

Bảng tra cứu thực chiến dưới đây định hướng cách chọn đúng toán tử cho từng tình huống dữ liệu:

| Toán tử thiết kế | Chiều tác động | Kháng ngoại lai đuôi dày | Ảnh hưởng lên `Turnover` | Quy tắc phối hợp thực chiến trên sàn |
| :--- | :--- | :--- | :--- | :--- |
| **`ts_rank(x, d)`** | Dọc $d$ phiên | Tuyệt đối — bị chặn $[0, 1]$ | Trung bình – Cao | Chuẩn hóa chuỗi không dừng như khối lượng, chênh lệch giá |
| **`ts_regression(y,x,d)`** | Dọc $d$ phiên | Nhạy cảm điểm đòn bẩy | Trung bình | Nên bọc `winsorize` hoặc `ts_rank` đầu vào trước khi chiếu |
| **`ts_decay_linear(x,d)`** | Dọc $d$ phiên | Giữ nguyên phân phối gốc | **Giảm mạnh** $\propto d^{-1/2}$ | Đặt ở lớp sát cuối cùng trước hoặc ngay sau trung hòa ngành |
| **`rank(x)`** | Ngang $N$ mã | Tuyệt đối — đều trên $[0, 1]$ | Ổn định mặt cắt ngang | Bắt buộc dùng trước khi cộng, nhân hoặc chia hai đặc trưng khác thứ nguyên |
| **`signed_power(x, p)`** | Ngang $N$ mã | $p < 1$ nén đuôi; $p > 1$ bung đuôi | $p < 1$ giúp giảm vòng quay | Chọn $p \in [0.5, 0.8]$ để dàn đều vốn, tăng độ rộng hiệu dụng |

---

## 3. Trung hòa Phân nhóm Đa tầng: Nhân Đôi Sharpe Hay Tự Triệt tiêu Tín hiệu?

Hệ thống ngành chuẩn GICS chia thị trường theo bốn cấp độ mịn tăng dần: `Market` ($1$ giỏ) $\to$ `Sector` ($11$ lĩnh vực) $\to$ `Industry` ($\approx 74$ ngành) $\to$ `Subindustry` ($\approx 163$ tiểu ngành), bên cạnh các giỏ phân vị động như mười phân vị vốn hóa `bucket(rank(cap))` hoặc giỏ ghép hai chiều ngành $\times$ biến động.

Toán tử **Trung hòa Phân nhóm Phân cấp** (Hierarchical Group Neutralization) `group_neutralize(x, g)` khử trung bình bên trong từng cụm $G_{k,t}$, loại bỏ hoàn toàn phương sai giữa các cụm trong định lý phương sai toàn phần:

$$
\tilde{x}_{i,t} = x_{i,t} - \frac{1}{|G_{k(i), t}|} \sum_{j \in G_{k(i), t}} x_{j,t}, \qquad \operatorname{Var}(x_t) = \underbrace{\operatorname{Var}\big(\mathbb{E}[x_t \mid G_t]\big)}_{\text{Phương sai Giữa các Ngành}} + \underbrace{\mathbb{E}\big[\operatorname{Var}(x_t \mid G_t)\big]}_{\text{Phương sai Nội bộ Ngành}}
$$

Gọi $R_{\text{grp}}^2 \in (0, 1)$ là tỷ trọng phương sai lợi nhuận danh mục thô bị chi phối bởi biến động chung của cụm ngành, và $\phi_{\text{grp}}$ là tỷ trọng lợi nhuận kỳ vọng đến từ việc dự báo hướng đi của cả ngành. Tỷ số khuếch đại Sharpe sau trung hòa tuân theo phương trình:

$$
\frac{\text{SR}_{\text{neutral}}}{\text{SR}_{\text{raw}}} = \frac{1 - \phi_{\text{grp}}}{\sqrt{1 - R_{\text{grp}}^2}}
$$

- **Khi nào trung hòa giúp nhân đôi Sharpe?** Với tín hiệu Định giá cơ bản hoặc Đảo chiều ngắn hạn, chênh lệch tỷ số P/B cố hữu giữa ngành Ngân hàng và ngành Phần mềm không hề dự báo ngành nào sắp tăng ($\phi_{\text{grp}} \approx 0$), nhưng cú sốc lãi suất vĩ mô lại khiến rổ ngành dao động chiếm $R_{\text{grp}}^2 \approx 0.75$ tổng phương sai! Áp dụng `group_neutralize(..., subindustry)` giữ nguyên tử số $1$ và cắt mẫu số còn $\sqrt{1 - 0.75} = 0.50$, **lập tức nhân đôi tỷ số Sharpe** từ $0.95$ lên $1.90$!
- **Khi nào trung hòa quá tay tiêu diệt sạch tín hiệu?** Thứ nhất, khi bản thân tín hiệu dự báo sự dịch chuyển dòng vốn liên ngành ($\phi_{\text{grp}} \to 1$), khử trung bình `Subindustry` làm tử số $1 - \phi_{\text{grp}} \to 0$. Thứ hai là bẫy **Suy biến Cụm Siêu nhỏ** (Small-Cluster Degeneracy): trên vũ trụ hẹp `TOP500` mà ép chia theo $163$ tiểu ngành nhân với $5$ nhóm vốn hóa tạo thành $815$ ô lưới, đa số ô chỉ còn đúng $1$ cổ phiếu khiến $\tilde{x}_{i,t} \equiv 0$! Quy tắc bất di bất dịch: mỗi cụm trung hòa phải chứa tối thiểu $8\text{–}12$ cổ phiếu hoạt động.

---

## 4. Hồ sơ Chu kỳ Suy thoái Tín hiệu & Ngưỡng Kiểm duyệt Sản xuất

Trước khi chọn tham số làm mượt, nhà nghiên cứu luôn lập **Hồ sơ Suy thoái Tín hiệu** (Signal Decay Profile) — đo chuỗi hệ số thông tin $\operatorname{IC}(h) = \operatorname{Corr}_t(\alpha_{i,t}, \, r_{i, t+h})$ tại các độ trễ $h \in \{1, 2, 5, 10, 20\}$ phiên và thời gian bán rã $h_{1/2}$:

$$
\operatorname{IC}(h) \approx \operatorname{IC}(1)\,e^{-\lambda (h - 1)}, \qquad h_{1/2} = 1 + \frac{\ln 2}{\lambda}
$$

Một biểu thức khớp trễ một phiên (`Delay-1`) trên cổ phiếu Mỹ muốn vượt rào kiểm duyệt kho sản xuất phải đạt đồng thời bốn tiêu chí: $\text{Sharpe} > 1.25$, vòng quay vốn hai chiều $\text{Turnover} \in [1\%, 70\%]$, tương quan tự thân nội bộ $< 0.70$, và **Chỉ số Độ khỏe Tổng hợp** (Fitness Metric) vượt $1.0$:

$$
\text{Turnover}_t = \sum_{i=1}^N \big|w_{i,t} - w_{i, t-1}^+\big|, \qquad \text{Fitness} = \text{Sharpe} \times \sqrt{\frac{|\text{Returns}_{\text{ann}}|}{\max\big(\overline{\text{Turnover}}, \, 0.125\big)}} > 1.0
$$

Khi bọc tín hiệu dừng chuẩn có tự tương quan bậc nhất $\rho_1$ bằng bộ làm mượt trung bình động mũ $s_t^{\text{ema}} = (1 - \kappa) s_{t-1}^{\text{ema}} + \kappa s_t^{\text{raw}}$ với $\kappa \in (0, 1]$ rồi chuẩn hóa lại quy mô danh mục hằng ngày qua `scale()` ($\|w_t\|_1 = 1$), vòng quay vốn giảm mạnh theo hệ số:

$$
\overline{\text{Turnover}}(\kappa) \approx \sqrt{\frac{\kappa}{1 + (1 - \kappa)\rho_1}} \; \overline{\text{Turnover}}_{\text{raw}}
$$

Bảng chẩn đoán dưới đây đối chiếu ba mẫu hình suy thoái $\operatorname{IC}(h)$ điển hình để bạn quyết định ngay độ dài cửa sổ làm mượt mà không cần dò mẫm mù quáng:

| Mẫu hình Tín hiệu Thực nghiệm | $\operatorname{IC}(1)$ | $\operatorname{IC}(2)$ | $\operatorname{IC}(5)$ | $\operatorname{IC}(10)$ | Bán rã $h_{1/2}$ | Chiến thuật Thiết kế Toán tử Tối ưu |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Vi cấu trúc sổ lệnh siêu ngắn** | $0.042$ | $0.006$ | $0.001$ | $0.000$ | $\approx 1.2$ phiên | Không thể đánh trễ 1 ngày; chỉ dùng làm tín hiệu rải lệnh trong phiên |
| **Đảo chiều khối lượng – giá** | $0.024$ | $0.019$ | $0.011$ | $0.004$ | $\approx 4.5$ phiên | Khớp trễ 1 ngày tốt; bọc `ts_decay_linear(..., 6)` để đẩy `Fitness` $> 1.3$ |
| **Chất lượng kế toán & `PEAD`** | $0.011$ | $0.011$ | $0.010$ | $0.009$ | $> 25$ phiên | Tự thân vòng quay rất thấp $< 8\%$; tuyệt đối không làm mượt quá tay gây trễ |

> [!NOTE]
> **Thứ tự Không Giao hoán Giữa `group_neutralize` và `ts_decay_linear`:**
> Hai toán tử tuyến tính này tưởng như giao hoán với nhau, nhưng trên dữ liệu thực tế lại cho kết quả khác biệt đáng kể! Khi một cổ phiếu vừa được thêm mới vào rổ `TOP3000`, bị tạm ngừng giao dịch một phiên, hoặc chuyển mã ngành GICS sau thương vụ tái cơ cấu, việc đặt `ts_decay_linear` **bên ngoài cùng** sau `group_neutralize` sẽ trộn lẫn các trọng số lịch sử khác tập thành phần ngành, làm tổng trọng số của từng ngành tại ngày $t$ bị lệch khỏi con số $0$! Kinh nghiệm chuẩn sản xuất là: thực hiện `group_neutralize` cho tín hiệu ngày để khử cú sốc ngành từng phiên, đi qua `ts_decay_linear(..., d)` để giảm vòng quay, rồi **chốt thêm một lớp `group_neutralize` nhẹ ở ngoài cùng** nhằm khóa cứng phơi nhiễm ròng từng ngành bằng $0.00\%$ tuyệt đối trước khi gửi lệnh!

### 4.1. Cài đặt Bộ Toán tử Lõi & Chẩn đoán Hồ sơ Suy thoái Bằng NumPy

```python
import numpy as np

def group_neutralize(mat: np.ndarray, group_ids: np.ndarray) -> np.ndarray:
    """mat: (T, N) tín hiệu; group_ids: (N,) mã ngành nguyên từ 0 đến G-1."""
    out = mat.copy()
    for g in np.unique(group_ids):
        cols = group_ids == g
        if np.sum(cols) > 1:
            out[:, cols] -= np.nanmean(out[:, cols], axis=1, keepdims=True)
    return out

def ts_decay_linear(mat: np.ndarray, d: int) -> np.ndarray:
    weights = np.arange(1, d + 1, dtype=float)
    weights /= weights.sum()
    T, N = mat.shape
    res = np.full_like(mat, np.nan, dtype=float)
    for t in range(d - 1, T):
        res[t] = weights @ mat[t - d + 1 : t + 1]
    return res

def compute_ic_decay(alpha: np.ndarray, fwd_ret_1d: np.ndarray, horizons=(1, 2, 5, 10, 20)) -> dict[int, float]:
    """Đo IC(h) trung bình mặt cắt ngang theo từng độ trễ h phiên."""
    T = alpha.shape[0]
    profile = {}
    for h in horizons:
        ics = [np.corrcoef(alpha[t], fwd_ret_1d[t + h - 1])[0, 1] for t in range(T - h)]
        profile[h] = float(np.nanmean(ics))
    return profile

def evaluate_worldquant_fitness(daily_ret: np.ndarray, weights: np.ndarray) -> dict[str, float]:
    """Tính đồng thời Sharpe năm hóa, Vòng quay hai chiều bình quân và chỉ số Fitness chuẩn."""
    ann_ret = float(np.nanmean(daily_ret) * 252.0)
    ann_vol = float(np.nanstd(daily_ret, ddof=1) * np.sqrt(252.0))
    sharpe = ann_ret / max(ann_vol, 1e-8)
    turnover = float(np.nanmean(np.sum(np.abs(np.diff(weights, axis=0)), axis=1)))
    fitness = sharpe * np.sqrt(abs(ann_ret) / max(turnover, 0.125))
    return {"sharpe": sharpe, "ann_ret": ann_ret, "turnover": turnover, "fitness": fitness}
```

---

## 5. Ví dụ Phẫu thuật Thực chiến: Nâng cấp Alpha Bị Loại Lên Chuẩn Sản xuất

**Bài toán Thực tế:** Trên vũ trụ `TOP3000` cổ phiếu Mỹ khớp trễ một phiên, bạn xuất phát từ ý tưởng: *"Cổ phiếu đóng cửa cao hơn nhiều so với giá bình quân gia quyền khối lượng `vwap` trong 3 phiên liên tiếp đang bị mua đuổi quá mức và sẽ đảo chiều"*, viết thành biểu thức thô $\alpha^{(0)} = -\operatorname{ts\_delta}(\text{close} / \text{vwap}, 3)$.
Kết quả kiểm thử 5 năm của $\alpha^{(0)}$ bị loại thẳng tay: $\text{Sharpe} = 1.38$, lợi suất năm $\text{Returns}_{\text{ann}} = 8.4\%$, nhưng $\overline{\text{Turnover}} = 112\%/\text{ngày}$ làm $\text{Fitness} = 1.38 \times \sqrt{0.084 / 1.12} = \mathbf{0.378} < 1.0$ kèm năm 2020 sụt giảm vốn $-14\%$.

**Quy trình Phẫu thuật 4 Bước Có Kiểm soát:**
1. *Điều kiện hóa cạn kiệt khối lượng:* Sự lệch giá `close / vwap` đảo chiều mạnh nhất khi khối lượng sụt giảm so với trung bình $20$ phiên thông qua nhân tử $\operatorname{rank}(\text{adv20} / \text{volume})$.
2. *Chuẩn hóa và nén mũ giảm tập trung đuôi:* Dùng `zscore` kết hợp `signed_power(..., 0.7)` để tránh dồn vốn vào vài mã sinh học nhảy giá cực đoan.
3. *Trung hòa đa tầng Tiểu ngành $\times$ Phân vị biến động:* Khử trung bình trên giỏ ghép $\text{grp}_{\text{sub}\times\text{vol}}$ chặn đứng rủi ro biến động mùa dịch 2020.
4. *Làm mượt khớp hồ sơ suy thoái:* Vì $\operatorname{IC}(h)$ có $h_{1/2} = 4.2$ phiên, bọc ngoài bằng `ts_decay_linear(..., 6)`:

$$
\alpha_{\text{prod}} = \operatorname{ts\_decay\_linear}\!\Big(\operatorname{group\_neutralize}\!\Big(-\operatorname{signed\_power}\big(\operatorname{zscore}(\operatorname{ts\_delta}(\text{close}/\text{vwap}, 3)), \, 0.7\big) \cdot \operatorname{rank}\big(\text{adv20}/\text{volume}\big), \, \text{grp}_{\text{sub}\times\text{vol}}\Big), \, 6\Big)
$$

Đối chiếu các chỉ số kiểm định trước và sau phẫu thuật:

$$
\begin{cases}
\text{Trước phẫu thuật } \alpha^{(0)}: & \text{Sharpe} = 1.38, \quad \text{Returns} = 8.4\%, \quad \text{Turnover} = 112\%, \quad \text{Fitness} = \mathbf{0.38} \text{ — Rớt} \\
\text{Sau phẫu thuật } \alpha_{\text{prod}}: & \text{Sharpe} = 1.94, \quad \text{Returns} = 11.8\%, \quad \text{Turnover} = 23.5\%, \quad \text{Fitness} = 1.94\sqrt{\frac{0.118}{0.235}} = \mathbf{1.37} \text{ — Đạt!}
\end{cases}
$$

---

## 6. Nguyên tắc Kỷ luật: Tính Kiệm lời Cú pháp Chống Quá khớp Biểu thức

> [!WARNING]
> **Luật Kiệm lời Cú pháp** (Syntactic Parsimony) **Trên Sàn Đấu Định lượng:**
> Khi có trong tay hơn $60$ toán tử, cám dỗ lớn nhất là nối hàng chục phép chia, cộng hằng số lẻ kiểu `ts_delta(x, 13) + 0.37 * ts_rank(y, 19)` và chèn câu lệnh rẽ nhánh `trade_when(...)` chỉ để vá đúng ba tuần thua lỗ lịch sử! Tại WorldQuant và Trexquant, hệ thống thẩm định phạt nặng độ sâu cây cú pháp:
> 1. **Giới hạn tối đa $3\text{–}4$ tham số bậc tự do:** Chỉ dùng các con số mang ý nghĩa lịch giao dịch tự nhiên $d \in \{3, 5, 10, 20, 60, 120, 252\}$. Nếu đổi $d = 20$ sang $d = 15$ hoặc $d = 25$ mà Sharpe rớt quá $25\%$, biểu thức đó là rác quá khớp!
> 2. **Kiểm tra Bất biến Vũ trụ Con:** Một biểu thức bắt trúng quy luật vi cấu trúc trên `TOP3000` bắt buộc phải giữ nguyên dấu dương và đạt tối thiểu $65\%\text{–}75\%$ tỷ số Sharpe khi chạy nguyên bản không sửa một ký tự nào trên tập thanh khoản lớn `TOP1000`.
