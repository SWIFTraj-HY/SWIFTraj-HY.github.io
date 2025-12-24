## Data Fields
### Field Naming Conventions

To ensure consistency, portability, and ease of use across databases and analytics tools, all field names follow common database column naming practices:

- **Lowercase only:** use `vehicle_id` instead of `VehicleID` to avoid cross-platform compatibility issues.
- **Unified separator:** adopt **snake_case** consistently (e.g., `vehicle_id`).
- **Allowed characters:** use only letters, digits, and underscores; avoid spaces, hyphens, non-ASCII characters (e.g., Chinese), and other special symbols.
- **Avoid reserved keywords:** do not use database-reserved words such as `user`, `order`, `group`, `select`, `timestamp`, etc. When necessary, rename to more specific alternatives like `order_id` or `user_id`.

## Meta Information 

| Field | Type (Example) | Description (EN / 中文) | Notes (EN / 中文) |
|---|---|---|---|
| `data_file_name` | string (e.g., `A1_F1`) | Name of the data file / 数据文件名称 | Human-readable identifier / 用于展示与引用的名称 |
| `location_id` | string (e.g., `A1`) | Identifier or name of the data collection site / 数据采集站点的标识或名称 | Site-level identifier / 站点级标识 |
| `time_step` | float (e.g., `0.1`) | Time interval between consecutive frames  / 相邻帧的时间间隔（秒） |  |
| `start_timestamp_ms` | int64 (e.g., `1625012345000`) | Unix timestamp at the start of data collection (milliseconds) / 数据采集开始时刻的 Unix 时间戳（毫秒） | Timestamp of `frame_index[0]` / 对应轨迹数据中 `frame_index=0` 的时刻 |
| `duration_s` | float (e.g., `300.0`) | Total duration of the trajectory recording (seconds) / 轨迹数据时长（秒） | Can be computed from frame count and `time_step` / 可由帧数与 `time_step` 推导 |
| `timestamp_timezone` | string (e.g., `Asia/Shanghai`) | Time zone for interpreting Unix timestamps (if applicable) / Unix 时间戳解释所用时区（如适用） | Unix timestamps are typically UTC; still document explicitly / Unix 时间戳通常按 UTC 解释，建议明确写出 |
| `spatial_unit` | string (e.g., `m`) | Unit for metric spatial coordinates / 空间坐标单位 | Allowed: `m`, `ft` (default: `m`) / 可选：`m`、`ft`（默认 `m`） |

## Trajectory Information

> Assumption / 假设：Each row corresponds to one vehicle track (per-track). All per-frame list fields are aligned with `frame_index`.
> 每条记录对应一辆车轨迹（按车聚合）。所有逐帧 list 字段与 `frame_index` 一一对应对齐。

| Field | Type | Description (EN / 中文) | Comments (EN / 中文) |
|---|---|---|---|
| `vehicle_id` | int | Unique identifier of the vehicle track / 车辆轨迹唯一编号 | Per-track primary key / 每条记录对应一辆车轨迹的主键 |
| `vehicle_class` | string | Vehicle class (Car/Truck) / 车辆类别（Car/Truck） | Use a controlled vocabulary / 建议使用固定枚举值集合 |
| `vehicle_width` | float | Vehicle width / 车宽（默认米） | Unit follows meta spatial unit (default: m) / 单位跟随 meta 空间单位（默认米） |
| `vehicle_length` | float | Vehicle length / 车长（默认米） | Unit follows meta spatial unit (default: m) / 单位跟随 meta 空间单位（默认米） |
| `frame_index` | list[int] | Frame indices of this track / 该轨迹对应的帧编号序列 | All per-frame lists must align with `frame_index` / 所有逐帧 list 字段必须与 `frame_index` 一一对应对齐 |
| `frenet_s` | list[float] | Longitudinal position (center) in Frenet / 车辆中心点 Frenet 纵向位置 s（默认米） | Default unit: m (per meta definition) / 默认单位：米（由 meta 约定） |
| `frenet_d` | list[float] | Lateral offset (center) in Frenet / 车辆中心点 Frenet 横向偏移 d（米，非负） | Non-directional (always non-negative) / 不区分左右方向（恒为非负） |
| `frenet_s_speed` | list[float] | Longitudinal speed in Frenet / Frenet 纵向速度（默认 m/s） | Sign convention should be documented / 建议在文档中明确速度正负号规则 |
| `frenet_d_speed` | list[float] | Lateral speed in Frenet / Frenet 横向速度（默认 m/s） | Sign convention should be documented / 建议在文档中明确速度正负号规则 |
| `frenet_s_accel` | list[float] | Longitudinal acceleration / 纵向加速度（默认 m/s²） | Consider suffixing units (e.g., `_mps2`) in future versions / 后续版本可考虑在字段名中显式单位（如 `_mps2`） |
| `frenet_d_accel` | list[float] | Lateral acceleration / 横向加速度（默认 m/s²） | Consider suffixing units (e.g., `_mps2`) in future versions / 后续版本可考虑在字段名中显式单位（如 `_mps2`） |
| `lane_id` | list[int] | Lane identifier where the vehicle center lies / 车辆中心点所在车道区域编号 | `-1` indicates unlabelled area / `-1` 表示未标注区域 |
| `preceding_id` | list[int] | Preceding vehicle id in the same lane / 同车道前车编号 | Use a consistent “no vehicle” code (`-1`) / 无前车时使用缺失编码（`-1`） |
| `following_id` | list[int] | Following vehicle id in the same lane / 同车道后车编号 | Use a consistent “no vehicle” code ( `-1`) / 无后车时使用缺失编码（`-1`） |
| `space_headway` | list[float] | Distance headway (m) / 空间车头间距（米） | Computed between front bumpers along Frenet s; center-based Frenet is adjusted for computation / 基于 Frenet s 的前保险杠同位置点距离计算；Frenet 默认中心点，计算时已换算到前保险杠 |
| `pixel_x` | list[float] | Center x in pixel coordinates (px) / 车辆中心点像素坐标 x（像素） | Per-frame values aligned with `frame_index` / 与 `frame_index` 逐帧对齐 |
| `pixel_y` | list[float] | Center y in pixel coordinates (px) / 车辆中心点像素坐标 y（像素） | Per-frame values aligned with `frame_index` / 与 `frame_index` 逐帧对齐 |
| `ground_x` | list[float] | Center x in local/ground (user-defined) coordinates (m) / 车辆中心点本地/地面（用户自定义）坐标系 x（米） | Coordinate system must be defined in meta (origin, axes, unit) / 坐标系需在 meta 明确（原点、轴向、单位） |
| `ground_y` | list[float] | Center y in local/ground (user-defined) coordinates (m) / 车辆中心点本地/地面（用户自定义）坐标系 y（米） | Coordinate system must be defined in meta (origin, axes, unit) / 坐标系需在 meta 明确（原点、轴向、单位） |
| `pixel_corners` | list[list[float]] | 4 corners per frame in pixels (px): `[x1,y1,x2,y2,x3,y3,x4,y4]` / 每帧4角点像素坐标（像素，8浮点数） | Corner order is normalized:clockwise; aligned with `frame_index` / 角点顺序已规范：顺时针；与 `frame_index` 对齐 |
| `ground_corners` | list[list[float]] | 4 corners per frame in ground coords (m)/ 每帧4角点本地/地面坐标（米）| Corner order is identical to `pixel_corners` / 角点顺序与 `pixel_corners` 完全一致 |
| `is_imputed` | list[int] | Per-frame imputation flag aligned with `frame_index` (0 = observed, 1 = imputed/reconstructed) / 与 `frame_index` 对齐的逐帧插补标记（0=观测值，1=插补/重建值） | Store as 0/1 for CSV compatibility; length equals `len(frame_index)` / 为兼容 CSV 建议用 0/1 存储；长度等于 `len(frame_index)` |