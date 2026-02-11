<!-- ### Field Naming Conventions -->
<!-- To ensure consistency, portability, and ease of use across databases and analytics tools, all field names follow common database column naming practices:
- **Lowercase only:** use `vehicle_id` instead of `VehicleID` to avoid cross-platform compatibility issues.
- **Unified separator:** adopt **snake_case** consistently (e.g., `vehicle_id`).
- **Allowed characters:** use only letters, digits, and underscores; avoid spaces, hyphens, non-ASCII characters (e.g., Chinese), and other special symbols.
- **Avoid reserved keywords:** do not use database-reserved words such as `user`, `order`, `group`, `select`, `timestamp`, etc. When necessary, rename to more specific alternatives like `order_id` or `user_id`. -->
The dataset is organized into two main components: metadata and trajectory data. The metadata component provides file-level and site-level information required for interpreting and using the trajectory data. The trajectory data component contains detailed spatiotemporal records of individual vehicles observed in the scene. 

The dataset is distributed in three file formats: JSON, CSV, and Parquet. Specifically, JSON files store the metadata, CSV files contain the trajectory data, and Parquet files provide an integrated representation that includes both metadata and trajectory data in a unified, columnar format. The Parquet files offer a compact, columnar representation that improves storage efficiency and I/O performance, particularly for large-scale data processing and machine learning applications.

 
## Metadata 

| Field | Type (Example) | Description (EN / 中文) | Notes (EN / 中文) |
|---|---|---|---|
| `data_file_name` | string (e.g., `A1_F1`) | Name of the trajectory data file / 数据文件名称 | Human-readable identifier / 用于展示与引用的名称 |
| `location_id` | string (e.g., `A1`) | Identifier of the data collection site / 数据采集站点的id | Site-level identifier / 站点级标识 |
| `location_name` | string (e.g., `HurongFreeway-Nanjing-Jiangsu-China`) | Textual description of the data collection location / 数据采集位置名称 | Use specific-to-country order (e.g., location-city-province-country) / 按“地点-城市-省-国家”顺序 |
| `frame_interval` | float (e.g., `0.1`) | Time interval between consecutive frames after trajectory resampling, in seconds  / 相邻帧的时间间隔（秒） |  |
| `start_timestamp_ms` | int64 (e.g., `1655420390457`) | Unix timestamp at the start of data collection (milliseconds) / 数据采集开始时刻的 Unix 时间戳（毫秒） | Timestamp of `frame_index[0]` / 对应轨迹数据中 `frame_index=0` 的时刻 |
| `start_datetime` | string (e.g., `2022-06-17 06:59:50`) | Human-readable start time of data collection in local time, formatted as YYYY-MM-DD HH:MM:SS | Equivalent to start_timestamp_ms, representing the time of frame_index = 0 |
| `total_duration` | float (e.g., `300.0`) | Total duration of the trajectory recording (seconds) / 轨迹数据时长（秒） | Can be computed from frame count and `frame_interval` / 可由帧数与 `frame_interval` 推导 |
| `timestamp_timezone` | string (e.g., `Asia/Shanghai`) | Time zone used to interpret the Unix timestamps / Unix 时间戳解释所用时区 | in IANA time zone format /  |
| `spatial_unit` | string (e.g., `m`) | Unit for metric spatial coordinates / 空间坐标单位 | Allowed: `m`, `ft` (default: `m`) / 可选：`m`、`ft`（默认 `m`） |
| `dataset_version` | string | Version of the dataset release / 数据集发布版本号 | Use semantic versioning (e.g., `1.0.0`) and increment for each public release / 建议采用语义化版本（如 `1.0.0`），每次公开发布递增 |
| `lane_sequence_to_movement_map` | dict (e.g., `{"1-3-20": "Right-turn"}`) | Mapping between each movement ID and its movement direction. A movement ID is defined in the form of “incoming road segment–intersection–outgoing road segment / 流向ID与通行方向间的映射。其中，流项ID用进口道编号-路口编号-出口道编号的形式来表示，值表示对应的通行方向 | Intersection-only / 仅用于交叉口数据 |
| `total_vehicle_count` | int (e.g., `12345`) | Total number of vehicle trajectories contained in the data file / 车辆轨迹总数 | Count of unique `vehicle_id` / 统计唯一 `vehicle_id` 的数量 |
| `unique_lane_ids` | list[int] (e.g., `[1,2,3,20]`) | List of all unique lane identifiers appearing in the data file / 该文件中所有的车道编号 | Sorted unique values extracted from `lane_id` / 从 `lane_id` 提取的唯一且排序的集合 |

## Trajectory data

> Assumption / 假设：Each row corresponds to one vehicle track (per-track). All per-frame list fields are aligned with `frame_index`.
> 每条记录对应一辆车轨迹（按车聚合）。所有逐帧 list 字段与 `frame_index` 一一对应对齐。

| Field | Type | Description (EN / 中文) | Comments (EN / 中文) |
|---|---|---|---|
| `vehicle_id` | int | Unique identifier of a vehicle trajectory / 车辆轨迹唯一编号 | Per-track primary key / 每条记录对应一辆车轨迹的主键 |
| `vehicle_class` | string | Vehicle category (Car/Truck) / 车辆类别（Car/Truck） | Use a controlled vocabulary / 使用固定枚举值集合 |
| `vehicle_width` | float | Vehicle width / 车宽（默认米） | Unit follows meta spatial unit (default: m) / 单位跟随 meta 空间单位（默认米） |
| `vehicle_length` | float | Vehicle length / 车长（默认米） | Unit follows meta spatial unit (default: m) / 单位跟随 meta 空间单位（默认米） |
| `frame_index` | list[int] | Sequence of frame indices associated with the trajectory / 该轨迹对应的帧编号序列 | All per-frame lists must align with `frame_index` / 所有逐帧 list 字段必须与 `frame_index` 一一对应对齐 |
| `frenet_s` | list[float] | Longitudinal position of the vehicle center in the Frenet coordinate system (applicable to expressway data) / 车辆中心点 Frenet 纵向位置（适用于快速路数据） | Default unit: m (per meta definition) / 默认单位：米（由 meta 约定） |
| `frenet_d` | list[float] | Lateral offset of the vehicle center in the Frenet coordinate system (applicable to expressway data) / 车辆中心点 Frenet 横向偏移（适用于快速路数据） | Non-directional (always non-negative) / 不区分左右方向（恒为非负） |
| `frenet_s_speed`†  | list[float] | Longitudinal speed in the Frenet coordinate system (applicable to expressway data) / Frenet 纵向速度（适用于快速路数据） | Default unit: m/s / 默认单位：m/s |
| `frenet_d_speed` | list[float] | Lateral speed in the Frenet coordinate system (applicable to expressway data)  / Frenet 横向速度（适用于快速路数据） | Default unit: m/s / 默认单位：m/s |
| `frenet_s_accel` | list[float] | Longitudinal acceleration (applicable to expressway data) / 纵向加速度（默认 m/s²） |
| `frenet_d_accel` | list[float] | Lateral acceleration (applicable to expressway data) / 横向加速度（默认 m/s²） |
| `lane_id`‡ | list[int] | Identifier for the lane (freeway) or the corresponding road segment or intersection (urban road) in which the vehicle center is located at each frame. / lane_id 表示车辆在每一帧中，其中心点所在的人工标注区域的 ID。其中，在高速公路上特指某一车道，而在城市道路中指某一路段或路口。| `-1` indicates unlabelled area / `-1` 表示未标注区域 |
| `pixel_x` | list[float] | Per-frame horizontal coordinate of the vehicle center in pixel space / 逐帧画面中，车辆中心在像素空间内的水平坐标 | Per-frame values aligned with `frame_index` / 与 `frame_index` 逐帧对齐 |
| `pixel_y` | list[float] | Per-frame vertical coordinate of the vehicle center in pixel space / 逐帧画面中，车辆中心在像素空间内的垂直坐标 | Per-frame values aligned with `frame_index` / 与 `frame_index` 逐帧对齐 |
| `ground_x` | list[float] | Per-frame horizontal coordinate of the vehicle center in the local ground coordinate system  / 逐帧画面中，车辆中心在局部地面坐标系下的水平坐标 | Per-frame values aligned with `frame_index` / 与 `frame_index` 逐帧对齐 |
| `ground_y` | list[float] |  Per-frame vertical coordinate of the vehicle center in the local ground coordinate system / 逐帧画面中，车辆中心在局部地面坐标系下的垂直坐标 | Per-frame values aligned with `frame_index` / 与 `frame_index` 逐帧对齐 |
| `pixel_corners` | list[list[float]] | Per-frame pixel coordinates of the four vehicle corners, ordered clockwise: `[x1,y1,x2,y2,x3,y3,x4,y4]` / 逐帧画面中车辆四角的像素坐标，按顺时针顺序排列：`[x1,y1,x2,y2,x3,y3,x4,y4]` | Corner order is normalized:clockwise; aligned with `frame_index` / 角点顺序已规范：顺时针；与 `frame_index` 对齐 |
| `ground_corners` | list[list[float]] | Per-frame ground coordinates of the four vehicle corners, ordered consistently with pixel\_corners / 每帧4角点本地/地面坐标（米）| Corner order is identical to `pixel_corners` / 角点顺序与 `pixel_corners` 完全一致 |
| `is_imputed` | list[int] | Per-frame indicator of whether the state is observed (0) or imputed/reconstructed (1) / 逐帧画面中状态的观测标识：0 表示观测所得，1 表示插值或重建所得 | Store as 0/1 for CSV compatibility; length equals `len(frame_index)` / 为兼容 CSV 建议用 0/1 存储；长度等于 `len(frame_index)` |

---
### Note †: Speed and Acceleration Computation
† Vehicle speed and acceleration are computed using central difference schemes for interior frames, with forward and backward differences applied at the boundaries:
- Interior (i = 1 ... N-1):
  v[i] = (x[i+1] - x[i-1]) / (2 * dt)
  a[i] = (x[i+1] - 2*x[i] + x[i-1]) / (dt * dt)
- Boundaries:
  v[0] = (x[1] - x[0]) / dt
  v[N] = (x[N] - x[N-1]) / dt
  a[0] = (x[2] - 2*x[1] + x[0]) / (dt * dt)
  a[N] = (x[N] - 2*x[N-1] + x[N-2]) / (dt * dt)
where x[i] is the position at frame i, dt is the frame interval (seconds), and N is the last frame index.
---
### Note ‡: `lane_id` Definition
#### 1. Expressway Data
In expressway scenarios, a region represented by a single `lane_id` on the main road usually corresponds to a single physical lane. In contrast, a `lane_id` associated with a ramp does not necessarily represent a single lane and may include **two or more physical lanes**.
#### Expressway Mainline
- **Lane IDs 1–5**: lanes with a driving direction from **northeast to southwest**;
- **Lane IDs 20–25**: lanes with a driving direction from **southwest to northeast**.
#### Ramp Areas
- Ramp regions usually have `lane_id` values such as **101**, **102**, etc.

#### 2. Intersection Data
In intersection datasets, `lane_id` does not refer to a physical freeway lane, but to an area corresponding to a specific road segment or an intersection.

It should be noted that the incoming and outgoing road segments represented by a `lane_id` usually **contains multiple lanes**.   

The correspondence between specific `lane_id` values and the actual road lanes can be found in the images provided in the data files.



