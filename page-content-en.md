# Open Vehicle Trajectory Prediction

## Project Links
- [📄 Paper](https://arxiv.org/pdf/2024.12345.pdf)
- [📦 Supplementary Material](static/pdfs/supplementary_material.pdf)
- [💻 Code](https://github.com/your-username/open-vehicle-trajectory)
- [📚 arXiv](https://arxiv.org/abs/2024.12345)

---

## Video Introduction

This research proposes an innovative vehicle trajectory prediction method that achieves high-precision, real-time multi-modal trajectory prediction in complex traffic scenes. By introducing spatio-temporal attention mechanisms and interaction modeling modules, our method achieves state-of-the-art performance on multiple benchmark datasets.

---

## Abstract

Vehicle trajectory prediction is one of the core tasks in autonomous driving systems and is crucial for achieving safe and efficient autonomous driving. Existing methods often face challenges of insufficient prediction accuracy and low computational efficiency when dealing with complex interaction scenarios.

This paper proposes a novel **multi-modal trajectory prediction framework** with the following key features:

1. **Spatio-Temporal Attention Mechanism**: Adaptively focuses on key spatio-temporal features in historical trajectories
2. **Interaction Modeling Module**: Effectively captures complex interaction relationships between vehicles
3. **Multi-Modal Generation Network**: Generates diverse and physically-constrained future trajectories

We conduct extensive experiments on three large-scale datasets: nuScenes, Argoverse, and INTERACTION. Results demonstrate that our method significantly outperforms existing methods in prediction accuracy while maintaining real-time inference capability. Specifically, we reduce the Average Displacement Error (ADE) by **23.5%** and the Final Displacement Error (FDE) by **28.7%** on the nuScenes dataset.

Furthermore, we conduct detailed ablation experiments to verify the effectiveness of each module and analyze model performance across different scenarios. Experimental results demonstrate the robustness of our method in handling challenging scenarios such as complex interactions, occlusions, and non-linear motion.

---

## Method Overview

### 1. Overall Architecture

Our method adopts an encoder-decoder architecture, consisting of the following main modules:

#### 1.1 Trajectory Encoder
- Uses **Transformer** architecture to extract temporal features of historical trajectories
- Introduces **Spatio-temporal attention mechanism** for adaptive focus on important spatial-temporal information
- Incorporates vehicle state information (velocity, acceleration, heading angle, etc.)

#### 1.2 Interaction Modeling Module
Uses **Graph Neural Networks (GNN)** to model vehicle interaction relationships:

```python
class InteractionModule(nn.Module):
    def __init__(self, hidden_dim):
        super().__init__()
        self.spatial_gnn = SpatialGNN(hidden_dim)
        self.temporal_gnn = TemporalGNN(hidden_dim)
        
    def forward(self, vehicle_features, adjacency_matrix):
        # Spatial interaction modeling
        spatial_features = self.spatial_gnn(vehicle_features, adjacency_matrix)
        # Temporal interaction modeling
        temporal_features = self.temporal_gnn(spatial_features)
        return temporal_features
```

#### 1.3 Multi-Modal Decoder
- Generates **K** candidate trajectories and their confidence scores
- Uses **Variational Autoencoder (VAE)** to ensure trajectory diversity
- Applies **physical constraints** to guarantee trajectory feasibility

### 2. Training Strategy

We adopt a multi-task learning framework, jointly optimizing the following objectives:

| Loss Function | Weight | Description |
|--------------|--------|-------------|
| Trajectory Prediction Loss | 1.0 | L2 Distance |
| Classification Loss | 0.5 | Trajectory Confidence |
| Diversity Loss | 0.3 | Ensure Multi-modality |
| Physics Constraint Loss | 0.2 | Kinematic Constraints |

**Training Hyperparameters**:
- Optimizer: AdamW
- Learning Rate: 1e-4 (cosine decay)
- Batch Size: 64
- Training Epochs: 100
- GPU: 4 × NVIDIA A100

---

## Experimental Results

### Main Results Comparison

Performance comparison on **nuScenes** dataset:

| Method | ADE ↓ | FDE ↓ | MR ↓ | FPS ↑ |
|--------|-------|-------|------|-------|
| LSTM Baseline | 1.88 | 4.32 | 0.28 | 45 |
| Social-GAN | 1.65 | 3.89 | 0.24 | 32 |
| Trajectron++ | 1.51 | 3.45 | 0.21 | 28 |
| LaneGCN | 1.38 | 3.12 | 0.19 | 35 |
| **Ours** | **1.06** | **2.31** | **0.15** | **42** |

> 📊 **Key Finding**: Our method significantly improves prediction accuracy while maintaining real-time performance.

### Ablation Study

Contribution of each module to performance:

- **Complete Model**: ADE = 1.06
- Remove Spatio-temporal Attention: ADE = 1.34 (+26.4%)
- Remove Interaction Module: ADE = 1.52 (+43.4%)
- Remove Multi-modality: ADE = 1.41 (+33.0%)

### Qualitative Results

Our method is capable of:
- ✅ Accurately predicting vehicle turning intentions
- ✅ Handling complex multi-vehicle interaction scenarios
- ✅ Maintaining robustness under occlusions
- ✅ Generating trajectories that comply with traffic rules

---

## Qualitative Analysis

### Scenario 1: Left Turn at Intersection

In complex intersection scenarios, our model can:
1. Recognize vehicle turning intentions
2. Predict interactions with oncoming vehicles
3. Generate reasonable evasion trajectories

### Scenario 2: Highway Lane Change

In high-speed scenarios, the model demonstrates:
- Accurate prediction of high-speed vehicle motion
- Effective modeling of adjacent lane vehicles
- Smooth trajectories that respect kinematic constraints

### Scenario 3: Pedestrian Interaction

In mixed traffic scenarios:
- Can simultaneously handle vehicles and pedestrians
- Correctly predicts pedestrian crossing behavior
- Generates safe evasion strategies

---

## Code Usage

### Install Dependencies

```bash
# Create virtual environment
conda create -n trajectory python=3.8
conda activate trajectory

# Install dependencies
pip install torch==1.12.0 torchvision==0.13.0
pip install numpy pandas matplotlib
pip install pyquaternion nuscenes-devkit
```

### Training

```bash
# Train on nuScenes dataset
python train.py --dataset nuscenes \
                --batch_size 64 \
                --epochs 100 \
                --lr 1e-4 \
                --gpu 0,1,2,3

# Train on Argoverse dataset
python train.py --dataset argoverse \
                --batch_size 64 \
                --epochs 100
```

### Evaluation

```bash
# Evaluate pre-trained model
python eval.py --checkpoint checkpoints/best_model.pth \
               --dataset nuscenes \
               --split val

# Visualize prediction results
python visualize.py --checkpoint checkpoints/best_model.pth \
                    --scene_id 12345
```

### Quick Test

```python
from trajectory_predictor import TrajectoryPredictor
import numpy as np

# Load model
model = TrajectoryPredictor()
model.load_checkpoint('checkpoints/best_model.pth')

# Prepare input data (history_length=20, num_vehicles=5)
history_trajectories = np.random.randn(5, 20, 4)  # [N, T, (x,y,vx,vy)]
adjacency_matrix = np.ones((5, 5))

# Predict future trajectories (future_length=30)
predictions = model.predict(history_trajectories, adjacency_matrix)
# predictions: [N, K, 30, 2]  K=6 is the number of candidate trajectories

print(f"Prediction shape: {predictions.shape}")
print(f"Confidence scores: {model.get_confidences()}")
```

---

## Datasets

### nuScenes
- **Scale**: 1,000 scenes, 40,000 samples
- **Features**: Complex urban scenes, multi-sensor fusion
- **Download**: [nuScenes Official](https://www.nuscenes.org/)

### Argoverse
- **Scale**: 324,000 trajectory sequences
- **Features**: High-definition maps, diverse scene types
- **Download**: [Argoverse Official](https://www.argoverse.org/)

### INTERACTION
- **Scale**: 16,000 interaction scenarios
- **Features**: Focus on vehicle interaction behavior
- **Download**: [INTERACTION Official](https://interaction-dataset.com/)

---

## Limitations and Future Work

### Current Limitations

1. **Long-term Prediction**: Accuracy decreases for predictions beyond 5 seconds
2. **Rare Scenarios**: Limited generalization ability for scenes rarely seen in training data
3. **Computational Resources**: Training large-scale models requires substantial GPU resources

### Future Research Directions

- [ ] Introduce **Large-scale Pre-training** for improved generalization
- [ ] Incorporate **High-definition Maps** to improve prediction accuracy
- [ ] Explore **Online Learning** methods to adapt to new scenarios
- [ ] Develop **Lightweight Models** to reduce computational costs
- [ ] Research **Explainability** methods to understand model decisions

---

## Frequently Asked Questions

**Q: Can the model handle real-time data streams?**
A: Yes, our model achieves 42 FPS on a single GPU, meeting real-time requirements.

**Q: How to choose the number of candidate trajectories K?**
A: Default is K=6. Increasing K improves diversity but increases computational cost. For most scenarios, K=6 is a good balance.

**Q: Does the model support other datasets?**
A: Yes, we provide a unified data interface that can be easily extended to other datasets.

**Q: How long does training take?**
A: On 4 A100 GPUs, complete training on nuScenes takes approximately 12 hours.

---

## Citation

If this research is helpful to your work, please cite:

```bibtex
@inproceedings{zhang2024open,
  title={Open Vehicle Trajectory Prediction: A Multi-Modal Approach},
  author={Zhang, San and Li, Si and Wang, Wu},
  booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages={12345--12354},
  year={2024}
}
```

---

## Acknowledgments

This research is supported by:
- National Natural Science Foundation of China (No. 62106123)
- Key Research and Development Program of the Ministry of Science and Technology (No. 2021YFB2501200)

We thank the providers of nuScenes, Argoverse, and INTERACTION datasets.

Special thanks to all members of our laboratory and reviewers for their valuable comments.

---

**Last Updated**: December 2024 | **Contact**: zhangsan@university.edu.cn
