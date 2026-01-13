In general, the trajectory processing procedure consists of three main stages: trajectory extraction, trajectory reconstruction and trajectory stitching.

### Trajectory Extraction

Vehicle trajectories are extracted using [OpenVTER](https://ieeexplore.ieee.org/document/10736977/), an open-source UAV-based trajectory extraction framework built on rotated bounding boxes (RBBs). The processing pipeline includes video stabilization, vehicle detection, and multi-object tracking. Stabilized UAV videos are cropped to road regions, where vehicles are detected and tracked across frames. Vehicle trajectories are then generated as time-ordered sequences of tracked vehicle positions.

### Trajectory Reconstruction

Overpass bridges introduce partial occlusions along the roadway, resulting in fragmented and incomplete trajectories. To recover missing segments, vehicle trajectory reconstruction is performed within bridge-occluded regions. This problem is formulated as two steps: vehicle matching across occlusions and trajectory generation. We adopted a hybrid macro–micro framework that incorporates macroscopic traffic-wave dynamics into the reconstruction of trajectories in bridge-occluded regions.

### Multi-UAV Trajectory Stitching

After reconstruction, continuous vehicle trajectories are obtained for each individual UAV. Trajectories observed by adjacent UAVs are further stitched together within overlapping regions to form unified and continuous vehicle trajectories across multiple UAV platforms. This process ensures spatial–temporal consistency over extended road segments.

