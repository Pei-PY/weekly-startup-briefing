# NVIDIA Technology Deep Dive

> *Reference document for NVIDIA Inception team members evaluating AI startups. Use this to assess whether a startup is already using NVIDIA tech, could benefit from it, or represents a greenfield opportunity for the ecosystem.*

*Last updated: April 2026 · Sources: nvidia.com, developer.nvidia.com, NVIDIA blog, VentureBeat, Tom's Hardware, ServeTheHome, AnandTech*

---

## Table of Contents

1. [Data Center GPU Hardware](#1-data-center-gpu-hardware)
2. [Edge & Embedded AI](#2-edge--embedded-ai)
3. [Networking & Interconnect](#3-networking--interconnect)
4. [Core Software Frameworks (CUDA-X)](#4-core-software-frameworks-cuda-x)
5. [AI & LLM Tools](#5-ai--llm-tools)
6. [NVIDIA NIM — Inference Microservices](#6-nvidia-nim--inference-microservices)
7. [Omniverse & Simulation](#7-omniverse--simulation)
8. [Robotics (Isaac Platform)](#8-robotics-isaac-platform)
9. [Healthcare & Life Sciences (Clara + BioNeMo)](#9-healthcare--life-sciences-clara--bionemo)
10. [Automotive (DRIVE Platform)](#10-automotive-drive-platform)
11. [DGX Cloud & Enterprise Software](#11-dgx-cloud--enterprise-software)
12. [Developer SDKs by Vertical](#12-developer-sdks-by-vertical)
13. [NVIDIA Tech Stack by Startup Vertical](#13-nvidia-tech-stack-by-startup-vertical)

---

## 1. Data Center GPU Hardware

### Hopper Architecture (Current Generation — Widely Deployed)

#### H100 — The Workhorse of AI Training

| Variant | Memory | Bandwidth | Peak FP8 TFLOPS | NVLink BW | TDP |
|---------|--------|-----------|-----------------|-----------|-----|
| H100 SXM | 80 GB HBM2e | 3.35 TB/s | 3,958 | 900 GB/s | 700W |
| H100 NVL | 94 GB HBM2e | 3.9 TB/s | 3,341 | 600 GB/s | 400W |

- Up to 4x faster LLM training vs. A100 (GPT-3 175B benchmark)
- Up to 30x faster LLM inference on 530B parameter models
- **Multi-Instance GPU (MIG):** Split one H100 into up to 7 isolated GPU instances — ideal for multi-tenant inference serving
- H100 NVL includes 5-year NVIDIA AI Enterprise subscription

#### H200 — Memory-Optimized Inference Drop-in

| Variant | Memory | Bandwidth | Key Upgrade |
|---------|--------|-----------|-------------|
| H200 SXM | 141 GB HBM3e | 4.8 TB/s | 1.9x faster Llama2 70B inference vs. H100 |
| H200 NVL | 141 GB HBM3e | 4.8 TB/s | Same power envelope as H100 |

Best for: inference-heavy workloads where model size exceeds H100 VRAM (e.g., 70B+ parameter models, mixture-of-experts).

#### Grace Hopper GH200 Superchip — Unified CPU+GPU Memory

Combines 72-core ARM Neoverse V2 Grace CPU + H100 GPU in one package, connected via NVLink-C2C at 900 GB/s (7x faster than PCIe Gen5).

| Component | Spec |
|-----------|------|
| GPU Memory | 96 GB HBM3 @ 4 TB/s |
| CPU Memory | 480 GB LPDDR5X @ 546 GB/s |
| **Unified Memory** | **576 GB coherent address space** |
| TDP | Up to 1,000W |

Best for: workloads that exceed GPU VRAM but need GPU compute — giant recommendation models, genomics pipelines, graph analytics, HPC simulations. Used in DGX GH200 (256 GH200 chips all-connected).

---

### Blackwell Architecture (New Generation — Now Shipping)

The successor to Hopper. Dual-die chiplet design (208B transistors, TSMC 4NP). Adds FP4/FP6 precision, 2x NVLink bandwidth, and mandatory liquid cooling at high-end configs.

| GPU | Memory | Bandwidth | Peak FP8 TFLOPS | TDP |
|-----|--------|-----------|-----------------|-----|
| B100 | 192 GB HBM3e | 8 TB/s | ~7,000 | ~700W |
| B200 | 192 GB HBM3e | 8 TB/s | ~9,000 | 1,000–1,200W |
| B200 Ultra | 288 GB HBM3e | >8 TB/s | Higher | ~1,400W |

**Performance vs. H100:**
- 2.2x faster LLM fine-tuning
- 2x faster GPT-3 175B pre-training
- **30x more tokens/sec on inference at trillion-parameter scale** (in NVL72 config)
- 25x better performance per watt

#### GB200 Grace Blackwell Superchip

Two B200 GPUs + one Grace CPU per package. Building block for NVL72.

#### GB200 NVL72 — Rack-Scale AI Factory

36 Grace CPUs + 72 B200 GPUs in a single liquid-cooled rack. "An exascale computer in a single rack."

| Spec | Value |
|------|-------|
| GPU Memory | 13.4 TB HBM3e |
| GPU Memory BW | 576 TB/s aggregate |
| CPU Memory | 17 TB LPDDR5X |
| NVLink All-to-All | 130 TB/s (6th gen: 260 TB/s in Rubin) |
| FP8/FP6 Compute | 720 PFLOPS |
| NVFP4 Compute | 1,440 PFLOPS (sparse) |

**Key implication for Inception:** Startups building frontier model training or trillion-parameter inference infrastructure need to be on Blackwell. Ask whether prospects are planning B200/NVL72 migration.

---

### DGX Systems — Turnkey AI Servers

| System | GPU Config | Key Use Case |
|--------|-----------|--------------|
| DGX H100 | 8 × H100 SXM, 640 GB HBM | LLM training, mid-scale |
| DGX H200 | 8 × H200 SXM, 1.13 TB HBM3e | Large model inference |
| DGX GH200 | 256 × GH200, 144 TB unified mem | Frontier research, HPC |
| DGX B200 | 8 × B200, 1.5 TB HBM3e | Current-gen training |
| DGX Spark | GB10 Superchip, 128 GB unified | Developer desktop — run 200B param models locally |
| DGX Station | GB300, 748 GB coherent mem | Workstation AI supercomputer |
| DGX SuperPOD | Multi-rack DGX cluster | Enterprise AI factory |

---

### NVLink & NVSwitch — GPU Interconnect

| Generation | NVLink BW/GPU | NVSwitch Aggregate | Used In |
|------------|---------------|--------------------|---------|
| 4th gen | 900 GB/s | 7.2 TB/s | H100, H200 |
| 5th gen | 1,800 GB/s | 130 TB/s | B200 (NVL72) |
| 6th gen | 3,600 GB/s | 260 TB/s | Rubin (next) |

NVSwitch chips include **SHARP** engines for in-network all-reduce — reduces GPU idle time during distributed training by processing collective operations inside the switch fabric.

---

## 2. Edge & Embedded AI

### Jetson Orin — Production Edge AI

The standard platform for robotics, smart cameras, industrial AI, and medical devices.

| Module | AI TOPS | GPU | CPU | Memory | Power | Entry Price |
|--------|---------|-----|-----|--------|-------|-------------|
| AGX Orin 64GB | 275 | 2048 Ampere cores | 12-core A78AE | 64 GB LPDDR5 | 15–60W | $1,999 (dev kit) |
| AGX Orin 32GB | 200 | 2048 | 8-core | 32 GB | 15–40W | ~$999 |
| Orin NX 16GB | 157 | 1792 | 8-core | 16 GB | 10–40W | — |
| Orin Nano 8GB | 67 | 1024 | 6-core | 8 GB | 7–25W | $249 (dev kit) |

All run JetPack SDK. Fully compatible with Isaac ROS. 8x the performance of the previous Xavier generation.

**Who uses Jetson:** Autonomous robots, surgical systems, industrial inspection cameras, drones, edge inference for retail/logistics, smart agriculture.

### IGX Orin — Safety-Certified Industrial Edge

Same Orin SoC as Jetson but hardened for:
- Functional safety: ISO 26262 (automotive), IEC 61508 (industrial)
- Medical-grade workloads (pairs with Clara Holoscan)
- 24/7 continuous uptime requirements

**Who uses IGX:** Surgical robotics companies, medical imaging at the device edge, industrial automation, robotic cells requiring safety certification.

### Clara Holoscan SDK

Real-time sensor AI runtime for physical AI pipelines: multimodal sensor fusion (ultrasound probes, endoscopes, cameras, LiDAR) + AI inference + deterministic low-latency output. Runs on both IGX Orin (edge device) and DGX (cloud/data center).

**Who uses Holoscan:** Medical device startups, surgical AI companies, industrial perception systems requiring real-time, safety-critical inference.

---

## 3. Networking & Interconnect

### InfiniBand (Quantum-2) — Best for Tight Clusters

| Product | Speed | Key Feature |
|---------|-------|-------------|
| Quantum-2 switch | 400 Gbps NDR | SHARP in-network compute |
| ConnectX-7 NIC | 400 Gbps | InfiniBand + Ethernet, RDMA |
| BlueField-3 DPU | 400 Gbps | 16 ARM cores, offloads networking/storage/security |

Best for: tightly-coupled LLM training clusters where NCCL all-reduce latency matters. InfiniBand + SHARP reduces GPU idle time during gradient synchronization.

### Spectrum-X — Ethernet for AI at Scale

Purpose-built Ethernet for large AI clusters that prefer Ethernet over InfiniBand (hyperscalers, cloud providers, multi-tenant environments).

| Component | Spec |
|-----------|------|
| Spectrum SN5600 switch | 400 GbE per port |
| ConnectX-8 SuperNIC | 800 Gb/s RoCE |

Claims 1.6x better network efficiency vs. standard Ethernet for AI. Sustains 95% efficiency across 100,000+ GPU clusters.

### BlueField DPU — Data Processing Units

Offloads networking, storage, and security workloads from CPUs onto the NIC itself. Key for: AI infrastructure companies building secure multi-tenant GPU clouds, high-performance storage systems, or zero-trust networking.

---

## 4. Core Software Frameworks (CUDA-X)

### CUDA — The Foundation

Current version: **CUDA 13.2**

- The universal GPU programming platform. Every NVIDIA GPU workload runs on CUDA.
- ~4,000 CUDA-accelerated applications in the ecosystem
- New in 13.2: CUDA Tile (tile-based programming model), cuTile Python bindings, unified ARM ecosystem support
- Supports full stack: H100/B200 data center → Jetson edge

**CUDA-X Accelerated Libraries:**

| Library | Purpose | Typical Speedup |
|---------|---------|-----------------|
| **cuDNN** | Deep neural network primitives (conv, pooling, normalization, attention) | Foundational — all DL frameworks use it |
| **cuBLAS** | BLAS linear algebra (matrix multiply) | Core to transformer ops |
| **cuFFT** | Fast Fourier Transforms | Signal processing, scientific |
| **cuSPARSE** | Sparse matrix operations | Graph ML, science |
| **NCCL** | Multi-GPU collective comms (all-reduce, broadcast, scatter) | Critical for distributed training |
| **DALI** | GPU data loading and augmentation | Eliminates CPU preprocessing bottleneck |

### RAPIDS — GPU-Accelerated Data Science

Replaces CPU pandas/scikit-learn/NetworkX with near-zero code changes.

| Library | Replaces | Typical Speedup |
|---------|---------|-----------------|
| cuDF | pandas | 30–40x on ETL pipelines |
| cuML | scikit-learn | Significant (algo-dependent) |
| cuGraph | NetworkX | Massive for graph analytics |

RAPIDS 25.08 added: cuml.accel profiler, Polars GPU engine with streaming for out-of-GPU-memory datasets.

**Who uses RAPIDS:** Fintech AI (fraud detection, risk modeling), adtech, recommendation systems, any startup with large tabular data pipelines.

### TensorRT — Inference Optimization Compiler

Optimizes trained models for production deployment via quantization (FP8, FP4, INT8, AWQ), layer fusion, kernel auto-tuning, and structured sparsity.

- 36x faster vs. CPU inference
- 8x faster for GPT-J 6B, 4x for Llama2 70B, 5.3x TCO improvement at scale
- Runs on H100/H200/Blackwell, Jetson Orin, DRIVE, RTX workstations

### TensorRT-LLM — LLM Inference Optimization

Open-source Python library for optimizing LLM inference specifically. Backbone of all NIM microservices.
- Paged attention, in-flight batching, speculative decoding
- FP4/FP8 quantization
- Supports Llama, Mistral, Falcon, GPT variants, DeepSeek, and more

### Triton Inference Server (NVIDIA Dynamo-Triton)

Production model serving platform for heterogeneous model deployments.
- Supports: TensorRT, PyTorch, ONNX, OpenVINO, Python, RAPIDS FIL backends
- Dynamic batching, concurrent model execution, streaming, ensemble pipelines
- Kubernetes-native with Prometheus observability

**NVIDIA Dynamo** — New complementary LLM-specific inference framework for disaggregated prefill/decode serving, prefix caching, and KV-cache management across multi-node LLM deployments.

---

## 5. AI & LLM Tools

### NeMo Framework — Enterprise LLM Lifecycle

End-to-end toolkit for building, fine-tuning, aligning, and deploying LLMs and multimodal models.

| Component | What It Does |
|-----------|-------------|
| NeMo Framework (core) | Training + fine-tuning LLMs and multimodal models at scale |
| NeMo RL | Post-training with RLHF, DPO, reinforcement learning |
| NeMo Customizer | Domain-specific fine-tuning via PEFT (LoRA, P-tuning) |
| NeMo Evaluator | Benchmarking and evaluation framework |
| NeMo Guardrails | Safety, compliance, jailbreak prevention |
| NeMo Retriever | RAG embedding and retrieval pipelines |

### Nemotron Model Family

NVIDIA's own foundation models available as NIMs:
- Nemotron-4 340B (largest), Nemotron-4 15B, Nemotron-70B
- Nemotron-CC (high-quality pretraining data)
- Reasoning-focused models (code, math)
- Multimodal variants

### NeMo Guardrails — LLM Safety Layer

Open-source toolkit for adding programmable safety rails to production LLM apps.
- Content moderation, PII detection, topic relevance enforcement
- Jailbreak detection (now with NIM: ~0.5s latency, 1.4x better detection)
- Supports LangGraph, tool calling, multi-agent workflows
- Available as three NIMs: content safety, jailbreak detection, topic control

### Megatron-Core — Frontier Model Training

NVIDIA's open-source library for training massive transformer models across thousands of GPUs.
- Tensor, pipeline, sequence, context, and MoE expert parallelism
- FP8 training, v0.11 adds multi-data center LLM training
- Megatron Bridge: HuggingFace ↔ Megatron checkpoint converter

---

## 6. NVIDIA NIM — Inference Microservices

### What NIMs Are

Containerized, optimized AI model deployments with OpenAI-compatible REST APIs. Each NIM = trained model + TensorRT-LLM engine + Triton serving + health checks in a single Docker container.

**Deploy on any NVIDIA GPU:** laptop RTX GPU → DGX system → CSP cloud. Same container, same API.

### Why NIMs Are the Most Important On-Ramp for Startups

| Benefit | What It Means |
|---------|--------------|
| **OpenAI-compatible API** | One-line change to switch from OpenAI to self-hosted NIM |
| **Instant production-grade inference** | Skip 3–6 months of MLOps engineering |
| **Free prototyping** | build.nvidia.com offers free GPU-backed API to 100+ models |
| **Data privacy** | Run on-prem — data never leaves the building (critical for healthcare, legal, finance) |
| **No vendor lock-in** | Same NIM runs dev → staging → production → any cloud |
| **Enterprise supply chain** | Available in AWS/Azure/GCP Marketplace + NVAIE — satisfies enterprise procurement |

### NIM Catalog (100+ models, build.nvidia.com)

| Category | Available Models |
|---------|----------------|
| **LLMs** | Llama 3.x (8B/70B/405B), Mistral 7B/8x7B, Nemotron-4/70B, DeepSeek-R1, Kimi-K2.5, MiniMax-M2.5, GLM-5, CodeLlama, StarCoder 2 |
| **Vision/Multimodal** | Llama 3.2 Vision, CLIP, DINO, document VLMs |
| **Speech** | Riva Parakeet ASR, Canary multilingual ASR, Riva TTS |
| **Biology** | AlphaFold2, ESM-2, RFdiffusion, ProteinMPNN, MolMIM, Evo 2 |
| **Embeddings/RAG** | NV-Embed-v2, BAAI/bge-m3, rerankers |
| **Safety** | NeMo Guardrails (content safety, jailbreak detection, topic control) |
| **Science/Climate** | FourCastNet (weather forecasting) |

---

## 7. Omniverse & Simulation

### What Omniverse Is

A collection of libraries, microservices, and APIs for building **physical AI applications** — industrial digital twins, robotics simulation, autonomous vehicle testing, synthetic data generation. Built on **OpenUSD** as the universal data format.

**Core technology stack:**

| Layer | Technology |
|-------|-----------|
| Data Interoperability | OpenUSD (Universal Scene Description) |
| Rendering | NVIDIA RTX — physically-based, ray-traced |
| Physics | NVIDIA PhysX + NVIDIA Warp (GPU-accelerated) |
| Sensor Simulation | RTX-based LiDAR, camera, radar |

### OpenUSD — The Key Standard to Watch

NVIDIA is betting heavily on OpenUSD as the lingua franca for physical AI. Major integrators: Cadence, Siemens, PTC, Synopsys, Dassault Systèmes, Rockwell, Ansys, Trimble, Microsoft. NVIDIA offers an industry OpenUSD Developer Certification.

**Implication for Inception:** Startups building industrial software, simulation, or robotics should be asked about OpenUSD adoption. This is NVIDIA's platform standard for the physical world.

### Omniverse Cloud APIs

| API | Function |
|-----|---------|
| USD Render | Ray-traced renders of OpenUSD scenes |
| USD Write | Modify/interact with live USD scenes |
| USD Query | Real-time scene queries |
| USD Notify | Track USD changes in real time |
| Omniverse Channel | Multi-user geographically distributed collaboration |

### Key Omniverse Use Cases

- **Industrial digital twins:** Factory layout, simulation, validation before physical build
- **Synthetic data generation:** Training vision models without real-world data collection
- **Robot simulation:** Physics-accurate pre-deployment robot learning
- **AV simulation:** Sensor-realistic environments for autonomous vehicle testing
- **Engineering collaboration:** Distributed teams working on shared 3D environments

---

## 8. Robotics (Isaac Platform)

| Component | What It Is | Who Uses It |
|-----------|-----------|-------------|
| **Isaac ROS** | GPU-accelerated ROS 2 packages for perception and navigation | Autonomous mobile robot (AMR) companies, warehouse automation, last-mile delivery |
| **Isaac Sim** | Physics-based robot simulation on Omniverse/USD | Companies training robots in simulation before hardware deployment |
| **Isaac Lab** | RL training environment (successor to Isaac Gym) | Manipulation, locomotion, and navigation policy training |
| **Isaac GR00T** | Foundation model for humanoid robots | Humanoid robot startups |

### Isaac ROS Packages (GEMs)

| Package | Function |
|---------|---------|
| Visual SLAM | 250 fps localization and mapping |
| nvBlox | 3D scene reconstruction from RGB-D / LiDAR |
| Pose Estimation | 6D object pose tracking |
| cuMotion | CUDA-accelerated motion planning |
| Image processing, stereo depth, AprilTag | Perception primitives |

Runs on: Jetson Orin, AGX Thor, DGX Spark, x86 + RTX workstations.

### Isaac GR00T N1 / N1.6 — Humanoid Robot Foundation Model

Announced March 2025. Open-weight Vision-Language-Action (VLA) model for generalist humanoid skills.

- Input: language instructions + images → output: robot manipulation actions
- N1.6 integrates Cosmos Reason (reasoning VLM for physical AI)
- 780,000 synthetic training trajectories (6,500 hours equivalent) generated in 11 hours → 40% performance improvement vs. real-data-only
- Built on Newton physics engine (co-developed with Google DeepMind + Disney Research)

**Implication for Inception:** Any humanoid robot startup should be using or aware of GR00T. It's NVIDIA's clearest bet on physical AI.

---

## 9. Healthcare & Life Sciences (Clara + BioNeMo)

### Clara Platform

| Product | What It Does | Who Uses It |
|---------|-------------|-------------|
| **Clara Parabricks** | GPU-accelerated genomics — 100x faster whole genome sequencing secondary analysis; 23 tools for cancer, rare disease, population genomics | Genomics startups, clinical labs, pharma |
| **Clara Holoscan SDK** | Real-time sensor AI for surgical/endoscopic/ultrasound pipelines — deterministic latency, multimodal fusion | Surgical AI, medical device, digital pathology |
| **MONAI** | Open-source medical imaging AI (PyTorch-based); 50+ pretrained models for segmentation, registration, multimodal | Medical imaging AI startups |
| **Isaac for Healthcare** | Hospital robotics simulation — autonomous ultrasound, surgical autonomy, teleoperation | Surgical and care robotics startups |
| **Nemotron (Healthcare)** | Foundation models for ambient healthcare agents, clinical documentation, deep clinical research | Clinical AI, ambient intelligence |

### BioNeMo — AI Drug Discovery Platform

Models, libraries, datasets, and NIMs for AI-driven biology and drug discovery.

| Model / Tool | Function |
|-------------|---------|
| **AlphaFold2 NIM** | Protein structure prediction |
| **RFdiffusion** | Diffusion model for protein binder design |
| **ProteinMPNN** | Amino acid sequence generation from protein backbone |
| **ESM-2** | Protein language model — embeddings, function prediction |
| **MolMIM** | Small molecule generative model for novel drug candidate generation |
| **Evo 2** | Genome foundation model trained on 9.3T nucleotides from 128,000+ species (largest open biology model; co-developed with Arc Institute) |

**Protein Binder Design Blueprint (Jan 2025):** End-to-end pipeline: AlphaFold2 (structure) → RFdiffusion (binder exploration) → ProteinMPNN (sequence generation). Accelerates therapeutic protein design from months to days.

**Implication for Inception:** Biotech startups in drug discovery should be evaluated on BioNeMo adoption. This is NVIDIA's clearest wedge into biopharma beyond compute.

---

## 10. Automotive (DRIVE Platform)

| Product | TOPS | Target | Status |
|---------|------|--------|--------|
| **DRIVE Orin SoC** | 254 | L2/L3 ADAS + cockpit | In production (most 2024–25 AV programs) |
| **DRIVE Thor** | 2,000 | L4 AV + centralized compute | Production starts 2025–26 (Zeekr in production) |
| **DRIVE AGX** | Dev platform | AV development systems | Active |

**DRIVE Orin:** Single SoC consolidating ADAS, cockpit, infotainment, and parking. Powers most production autonomous vehicle programs today.

**DRIVE Thor:** Nearly 8x the AI performance of Orin. Combines Hopper MIG GPU + Grace CPU + Ada Lovelace GPU. First AV chip with Transformer Engine. Delivers 2,000 TOPS for combined AV + cockpit.

**Supporting software:**

| Tool | Function |
|------|---------|
| DriveWorks SDK | Sensor abstraction, perception pipelines, HD mapping, path planning, safety |
| DRIVE Sim | AV simulation on Omniverse — physics-based sensor simulation |
| DRIVE Hyperion | Reference sensor architecture for AV development vehicles |

---

## 11. DGX Cloud & Enterprise Software

### DGX Cloud

Managed AI cloud service providing DGX-grade infrastructure without on-prem deployment.

**Available on:** AWS Marketplace, Microsoft Azure, Google Cloud, Oracle Cloud Infrastructure.

> **Important note for Inception teams (April 2026):** DGX Cloud has shifted primarily to internal NVIDIA use (model development, architecture validation) rather than active customer-facing promotion. Direct startups toward:
> - CSP-based NVIDIA GPU instances (AWS EC2 P/Trn instances, Azure NDv5, GCP A3)
> - DGX Cloud Innovation Lab (2 months free access for select Inception members)

### NVIDIA AI Enterprise (NVAIE)

Enterprise software subscription wrapping all NVIDIA AI frameworks with production support, stable APIs, and security.

**What's included:**
- All CUDA-X libraries, NeMo, Triton, NIM, RAPIDS, Riva, Morpheus
- vGPU compute licensing (required for virtualized GPU environments)
- Enterprise security, versioned/stable APIs
- 8x5 or 24x7 support options

**Licensing:** Per GPU, per year subscription or 5-year perpetual + support.
- H100 NVL and H200 NVL include NVAIE bundled (5-year)
- B200/B300 DGX systems require separate NVAIE purchase
- vGPU: one license per vGPU instance

---

## 12. Developer SDKs by Vertical

| SDK | Vertical | What It Does |
|-----|---------|-------------|
| **Riva** | Speech AI | GPU-accelerated ASR, TTS, translation. Multilingual, real-time, customizable. Available as NIM. |
| **Maxine** | Video/Conferencing | AI video conferencing: noise cancellation, super-resolution, background removal, eye contact correction, face re-lighting |
| **Metropolis** | Video Analytics | Platform for vision AI — transforms pixel/sensor data to actionable insights. Integrates DeepStream. |
| **DeepStream** | Video Analytics | GStreamer-based streaming analytics for real-time multi-sensor video/audio/image AI pipelines |
| **Morpheus** | Cybersecurity | GPU-accelerated cybersecurity AI: anomaly detection, phishing, DGA classification, sensitive data inspection on high-volume real-time streams |
| **DALI** | Training Infrastructure | GPU data loading and augmentation — eliminates CPU preprocessing bottleneck in training pipelines |
| **Nsight Suite** | Dev Tools | GPU debugging and profiling (Nsight Compute, Nsight Systems) |

---

## 13. NVIDIA Tech Stack by Startup Vertical

Use this as a quick-reference cheat sheet when evaluating a startup in a given space.

| Startup Vertical | Most Relevant NVIDIA Tech |
|-----------------|--------------------------|
| **LLM / Foundation Model** | H100/H200/B200, TensorRT-LLM, NeMo, Megatron-Core, NIM, NCCL, InfiniBand |
| **AI Inference / Serving** | TensorRT, Triton, NVIDIA Dynamo, NIM, H100 MIG |
| **Enterprise AI / RAG** | NeMo Retriever, NeMo Guardrails NIMs, NIM catalog, NVAIE |
| **Agentic AI** | NeMo Guardrails, NIM microservices, NeMo RL |
| **Robotics (General)** | Isaac ROS, Isaac Sim, Isaac Lab, Jetson Orin, Omniverse |
| **Humanoid Robots** | Isaac GR00T, Isaac Lab, Newton physics engine, Omniverse |
| **Autonomous Vehicles** | DRIVE Orin/Thor, DriveWorks, DRIVE Sim, Omniverse |
| **Medical Devices / Surgical AI** | Clara Holoscan, IGX Orin, MONAI, Isaac for Healthcare |
| **Drug Discovery / Biotech** | BioNeMo NIMs (AlphaFold2, RFdiffusion, MolMIM), Clara Parabricks, Evo 2 |
| **Genomics** | Clara Parabricks, GPU-accelerated secondary analysis |
| **Computer Vision** | TensorRT, DeepStream, Metropolis, Jetson Orin |
| **Video Analytics** | DeepStream, Metropolis, Maxine |
| **Speech / Voice AI** | Riva NIM, Maxine |
| **Data Science / MLOps** | RAPIDS, DALI, Triton, TensorRT |
| **Cybersecurity AI** | Morpheus, BlueField DPU |
| **Industrial Digital Twin** | Omniverse, OpenUSD, Isaac Sim |
| **Climate / Scientific** | FourCastNet NIM, HPC (GH200/NVL72), RAPIDS |
| **GPU Cloud Infrastructure** | HGX, InfiniBand, Spectrum-X, BlueField DPU, NVAIE |
| **Edge AI (IoT/Industrial)** | Jetson Orin, IGX Orin, DeepStream, TensorRT |

---

*For Inception team use. Cross-reference with [NVIDIA Inception Program & Startup Origination Role](NVIDIA%20Inception%20program%20and%20Startup%20Origination%20role.md) when evaluating pipeline fit.*
