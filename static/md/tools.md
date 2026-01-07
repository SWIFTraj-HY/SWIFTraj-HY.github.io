## Tools & Visualization
<!-- 工具与可视化 -->

We provide python scripts to load and visualize the dataset.





## Demo

### Example data
Download example data from Zendo

### Example code

#### Prerequisites
- Python 3.8+
- pyarrow
- pandas

Parquet Data Reading Example Code
```python
import json
import pyarrow.parquet as pq
parquet_path = ''
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
For more trajectory visualization code, please refer to the data tools code we provided, the GitHub repository, and the Jupyter notebook on Google Colab.

[Google Colab](https://colab.research.google.com/drive/1AaGVWD2c5y2hS0CuOEBeBJYj0kaJC20p?usp=sharing)

[Link to GitHub Repository](https://github.com/your-repo)
### Installation
Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/your-repo/data_tools
cd data_tools
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