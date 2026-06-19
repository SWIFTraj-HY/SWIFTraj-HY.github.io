## Tools & Visualization
<!-- 工具与可视化 -->

We provide python scripts to load and visualize the dataset.


## Demo

### Example data
Download sample Parquet files from Zenodo:

- 🚗 [**SWIFTraj–Hurong–Expressway (Demo)**](https://doi.org/10.5281/zenodo.18804176)

- 🚦 [**SWIFTraj–Hurong–Intersection (Demo)**](https://doi.org/10.5281/zenodo.18804203)

For the complete dataset and additional releases, please visit the  
- 👉 [Download Page](download.html).

### Example code

#### Prerequisites
- Python 3.8+
- pyarrow
- pandas

Parquet Data Reading Example Code
```python
import json
import pyarrow.parquet as pq

# Replace with your local Parquet file path
parquet_path = 'example.parquet'

# 1. Read Parquet file
table = pq.read_table(parquet_path)

# 2. Extract and parse Metadata
file_meta = table.schema.metadata
restored_meta_json = file_meta[b'dataset_meta'].decode('utf-8')
restored_meta = json.loads(restored_meta_json)

# 3. Extract trajectory
records = table.to_pylist()
restored_tracks = {}
for record in records:
    # Assume vehicle_id exists and is unique
    if 'vehicle_id' in record:
        vid = record['vehicle_id']
        del record['vehicle_id']
        restored_tracks[vid] = record
```
## Tools

For trajectory visualization and analysis, please refer to the following resources:

- 🚀 [**Google Colab (Recommended)**](https://colab.research.google.com/drive/1AaGVWD2c5y2hS0CuOEBeBJYj0kaJC20p?usp=sharing) 

- 💻 [**Trajectory Data Tools**](https://github.com/YuHan-Research-Group-SEU/trajectory-data-tools)


### Installation
Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/YuHan-Research-Group-SEU/trajectory-data-tools.git
cd trajectory-data-tools
```

(Optional) Install dependencies:
```bash
pip install -r requirements.txt
```

### Usage
Run the script to read data and generate space-time diagrams from a Parquet file.
```bash
python data_tools.py data/example.parquet
```

### Work-Zone Region Visualization

For work-zone road configuration visualization, the work-zone dataset also includes `road_config_*.json` files, which are used to describe the geometric and semantic information of the road network, including lane geometry, lane markings, road mileage reference lines, coordinate axes, and work zones. These JSON files are typically generated using the annotation tool LabelMe, and the corresponding field for construction or work-zone regions is `workzone`.

The files can be visualized online via the following tool:

- 🛠️ [**Road Configuration Visualization Tool**](https://xinkaiji.github.io/road_config_website/)
