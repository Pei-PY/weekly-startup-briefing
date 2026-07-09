// Static mapping: NVIDIA product/SDK → use-case table row
// Case study URLs sourced from nvidia.com/en-sg/case-studies/ where available
//
// caseStudy format:
//   Vertical-specific products (BioNeMo, Isaac ROS, etc.): flat { label, url }
//   Cross-vertical products (H100, NIM, DGX, etc.):        { default: {label,url}, byVertical: { verticalName: {label,url} } }
//
// Use getCaseStudy(productKey, vertical) to resolve — never access .caseStudy directly in render code.

const CS = {
  att:        { label: 'AT&T — 84% call-centre cost reduction',       url: 'https://www.nvidia.com/en-us/case-studies/att-drives-ai-agents-with-nemo/' },
  baseten:    { label: 'Baseten — 5× requests, 225% cost-perf',       url: 'https://www.nvidia.com/en-us/case-studies/baseten-cloud-scaling-ai-inference/' },
  thinkdeep:  { label: 'ThinkDeep — €2M saved, 2 days → 2 mins',      url: 'https://www.nvidia.com/en-us/case-studies/thinkdeep-sovereign-ai-agents-automate-public-services/' },
  mitRecurs:  { label: 'MIT & Recursion — 2–3× protein folding speedup', url: 'https://www.nvidia.com/en-us/case-studies/mit-recursion-open-source-protein-co-folding-model/' },
  agility:    { label: 'Agility Robotics — Digit humanoid robot',      url: 'https://www.nvidia.com/en-us/customer-stories/agility-robotics-digit-humanoid-robot/' },
  mitre:      { label: 'MITRE — federal AI sandbox',                   url: 'https://www.nvidia.com/en-us/case-studies/mitre-federal-ai-sandbox-unleashes-ai-potential-for-public-good/' },
};

export const NVIDIA_TECH = {
  'NIM': {
    useCase: 'On-prem & cloud LLM deployment',
    sdk: 'NVIDIA NIM, AI Enterprise',
    outcome: 'Deploy production-grade LLM APIs in minutes; optimised inference with enterprise SLA',
    caseStudy: {
      default: { label: 'NIM microservices overview', url: 'https://www.nvidia.com/en-us/ai/' },
      byVertical: {
        'Telecom':                              CS.att,
        'IT Services / SaaS':                  CS.att,
        'IT Services / Data Science / Mar-Legal-HR Tech': CS.att,
        'FinTech / FSI':                        CS.thinkdeep,
        'Global Public Sector':                 CS.thinkdeep,
        'Supercomputing / Global Public Sector':CS.thinkdeep,
        'Federal / US Public Sector / Defense': CS.mitre,
      },
    },
  },
  'TensorRT-LLM': {
    useCase: 'LLM inference throughput optimisation',
    sdk: 'TensorRT-LLM, Triton Inference Server',
    outcome: 'Up to 8× throughput vs unoptimised PyTorch on same GPU',
    caseStudy: { label: 'Baseten — 5× more requests, 225% cost-perf', url: 'https://www.nvidia.com/en-us/case-studies/baseten-cloud-scaling-ai-inference/' },
  },
  'TensorRT': {
    useCase: 'Deep learning inference optimisation',
    sdk: 'TensorRT, CUDA',
    outcome: 'Up to 6× faster inference; reduced latency for production CV/NLP models',
    caseStudy: { label: 'TensorRT developer hub', url: 'https://developer.nvidia.com/tensorrt' },
  },
  'Triton': {
    useCase: 'Multi-model inference serving at scale',
    sdk: 'Triton Inference Server',
    outcome: 'Serve 100s of models concurrently; GPU utilisation >90%',
    caseStudy: { label: 'Triton Inference Server', url: 'https://developer.nvidia.com/triton-inference-server' },
  },
  'H100': {
    useCase: 'Large-scale AI training & inference',
    sdk: 'CUDA, NVLink, cuDNN, NVMe',
    outcome: '30× faster LLM inference vs A100; 4× better energy efficiency per FLOP',
    caseStudy: {
      default: { label: 'H100 Tensor Core GPU', url: 'https://www.nvidia.com/en-us/data-center/h100/' },
      byVertical: {
        'Healthcare & Life Sciences':           CS.mitRecurs,
        'Supercomputing / Quantum':             CS.mitRecurs,
        'Supercomputing / Global Public Sector':CS.mitRecurs,
        'CRISP':                                CS.baseten,
        'AI Developer Tools':                   CS.baseten,
        'Telecom':                              CS.att,
        'FinTech / FSI':                        CS.thinkdeep,
        'Global Public Sector':                 CS.thinkdeep,
        'Federal / US Public Sector / Defense': CS.mitre,
      },
    },
  },
  'B200': {
    useCase: 'Next-gen AI compute (Blackwell architecture)',
    sdk: 'CUDA, NVLink 5, cuDNN',
    outcome: '5× faster training vs H100; 25× lower inference cost for LLMs',
    caseStudy: { label: 'NVIDIA Blackwell', url: 'https://www.nvidia.com/en-us/data-center/blackwell/' },
  },
  'H200': {
    useCase: 'Memory-bound LLM inference (141 GB HBM3e)',
    sdk: 'CUDA, NVLink, cuDNN',
    outcome: '2× inference throughput vs H100 for large models; full 80B+ param serving',
    caseStudy: { label: 'H200 Tensor Core GPU', url: 'https://www.nvidia.com/en-us/data-center/h200/' },
  },
  'GH200': {
    useCase: 'Unified CPU-GPU memory for massive models',
    sdk: 'CUDA, Grace CPU, NVLink-C2C',
    outcome: '480 GB unified memory; 10× bandwidth vs PCIe for graph & recommender workloads',
    caseStudy: { label: 'Grace Hopper Superchip', url: 'https://www.nvidia.com/en-us/data-center/grace-hopper-superchip/' },
  },
  'DGX': {
    useCase: 'Enterprise AI compute cluster (turnkey)',
    sdk: 'DGX OS, Base Command, NVAIE',
    outcome: 'Sovereign AI infrastructure; fastest time-to-first-token in on-prem deployments',
    caseStudy: {
      default: { label: 'DGX systems', url: 'https://www.nvidia.com/en-us/data-center/dgx-systems/' },
      byVertical: {
        'Global Public Sector':                 CS.thinkdeep,
        'Supercomputing / Global Public Sector':CS.thinkdeep,
        'FinTech / FSI':                        CS.thinkdeep,
        'Federal / US Public Sector / Defense': CS.mitre,
        'Supercomputing / Quantum':             CS.mitRecurs,
        'Healthcare & Life Sciences':           CS.mitRecurs,
      },
    },
  },
  'Jetson Orin': {
    useCase: 'Edge AI inference for robotics, drones, IoT',
    sdk: 'JetPack SDK, Isaac ROS, DeepStream',
    outcome: '275 TOPS at <60 W; 6× faster than previous gen Jetson for vision tasks',
    caseStudy: { label: 'Jetson Orin modules', url: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/' },
  },
  'Jetson': {
    useCase: 'Edge AI compute for embedded & autonomous systems',
    sdk: 'JetPack SDK, TensorRT, CUDA',
    outcome: 'AI inference at edge with <15 W TDP; real-time object detection & classification',
    caseStudy: { label: 'Jetson platform', url: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/' },
  },
  'Isaac ROS': {
    useCase: 'Hardware-accelerated robot perception',
    sdk: 'Isaac ROS, ROS 2, CUDA',
    outcome: '8× faster stereo depth estimation; GPU-accelerated SLAM & object detection',
    caseStudy: { label: 'Agility Robotics — Digit humanoid robot', url: 'https://www.nvidia.com/en-us/customer-stories/agility-robotics-digit-humanoid-robot/' },
  },
  'Isaac Sim': {
    useCase: 'Photorealistic robot simulation & synthetic data',
    sdk: 'Isaac Sim, Omniverse, PhysX',
    outcome: 'Generate 10M+ synthetic training images/day; reduce real-world data collection by 80%',
    caseStudy: { label: 'Isaac Sim', url: 'https://developer.nvidia.com/isaac/sim' },
  },
  'Isaac GR00T': {
    useCase: 'Foundation model for humanoid robot control',
    sdk: 'Isaac GR00T, Isaac Lab',
    outcome: 'Cross-embodiment policy training; generalise to new robot form factors without retraining',
    caseStudy: { label: 'Agility Robotics — Digit humanoid robot', url: 'https://www.nvidia.com/en-us/customer-stories/agility-robotics-digit-humanoid-robot/' },
  },
  'DeepStream': {
    useCase: 'Multi-stream video analytics pipeline',
    sdk: 'DeepStream SDK, TensorRT, Triton',
    outcome: 'Process 100+ HD streams on a single GPU; <5 ms end-to-end latency per frame',
    caseStudy: { label: 'DeepStream SDK', url: 'https://developer.nvidia.com/deepstream-sdk' },
  },
  'Metropolis': {
    useCase: 'Intelligent video analytics at city/enterprise scale',
    sdk: 'NVIDIA Metropolis, DeepStream, TAO',
    outcome: 'Centralised AI inference across 1000s of cameras; plug-and-play partner app ecosystem',
    caseStudy: { label: 'NVIDIA Metropolis', url: 'https://www.nvidia.com/en-us/autonomous-machines/intelligent-video-analytics-platform/' },
  },
  'Omniverse': {
    useCase: 'Industrial digital twins & 3D simulation',
    sdk: 'Omniverse Kit, OpenUSD, PhysX',
    outcome: 'Real-time collaborative simulation; $1B+ factory simulation savings reported by early adopters',
    caseStudy: { label: 'NVIDIA Omniverse', url: 'https://www.nvidia.com/en-us/omniverse/' },
  },
  'RAPIDS': {
    useCase: 'GPU-accelerated data science & ML pipelines',
    sdk: 'cuDF, cuML, cuGraph, RAFT',
    outcome: 'Up to 50× speedup over CPU-based pandas/sklearn on identical hardware',
    caseStudy: {
      default: { label: 'RAPIDS.ai', url: 'https://rapids.ai/' },
      byVertical: {
        'Telecom':                              CS.att,
        'IT Services / SaaS':                  CS.att,
        'IT Services / Data Science / Mar-Legal-HR Tech': CS.att,
        'FinTech / FSI':                        CS.att,
        'Adtech / Martech':                     CS.att,
      },
    },
  },
  'Morpheus': {
    useCase: 'Real-time AI-powered cybersecurity & threat detection',
    sdk: 'NVIDIA Morpheus, CUDA, TensorRT',
    outcome: 'Analyse 100Gbps packet streams in real time; detect insider threats at network speed',
    caseStudy: { label: 'NVIDIA Morpheus', url: 'https://developer.nvidia.com/morpheus-cybersecurity' },
  },
  'BlueField DPU': {
    useCase: 'Data-centre infrastructure offload & zero-trust security',
    sdk: 'DOCA SDK, BlueField DPU',
    outcome: 'Offload networking/storage from CPU; enforce zero-trust at line rate without host CPU overhead',
    caseStudy: { label: 'BlueField DPU', url: 'https://www.nvidia.com/en-us/networking/products/data-processing-unit/' },
  },
  'Spectrum-X': {
    useCase: 'AI fabric networking for GPU clusters',
    sdk: 'Spectrum-X, RoCE, NVIDIA NVLink',
    outcome: '1.6× AI job throughput improvement vs standard Ethernet in large-scale GPU clusters',
    caseStudy: { label: 'NVIDIA Spectrum-X', url: 'https://www.nvidia.com/en-us/networking/products/ethernet-switching/' },
  },
  'InfiniBand': {
    useCase: 'Ultra-low latency GPU interconnect for AI clusters',
    sdk: 'InfiniBand, NCCL, GPUDirect RDMA',
    outcome: 'Sub-microsecond latency; near-linear scaling to thousands of GPUs for distributed training',
    caseStudy: {
      default: { label: 'NVIDIA InfiniBand', url: 'https://www.nvidia.com/en-us/networking/infiniband/' },
      byVertical: {
        'Healthcare & Life Sciences':           CS.mitRecurs,
        'Supercomputing / Quantum':             CS.mitRecurs,
        'Supercomputing / Global Public Sector':CS.mitRecurs,
      },
    },
  },
  'BioNeMo': {
    useCase: 'Drug discovery & biomolecular AI',
    sdk: 'BioNeMo Framework, NIM for biology',
    outcome: 'Generate & screen 10M+ molecular candidates/day; 10× faster hit identification vs in-vitro screening',
    caseStudy: { label: 'MIT & Recursion — open-source protein co-folding', url: 'https://www.nvidia.com/en-us/case-studies/mit-recursion-open-source-protein-co-folding-model/' },
  },
  'Clara Holoscan': {
    useCase: 'Real-time AI for medical devices & surgical robotics',
    sdk: 'Clara Holoscan SDK, IGX Orin',
    outcome: '<10 ms end-to-end inference latency for intra-operative AI guidance',
    caseStudy: { label: 'Clara Holoscan', url: 'https://www.nvidia.com/en-us/clara/holoscan/' },
  },
  'Clara Parabricks': {
    useCase: 'GPU-accelerated genomics (WGS/WES pipeline)',
    sdk: 'Clara Parabricks, CUDA',
    outcome: 'Full 30× WGS analysis in <20 min vs 30 hrs on CPU; 50× speedup for GATK4',
    caseStudy: { label: 'Clara Parabricks', url: 'https://www.nvidia.com/en-us/clara/parabricks/' },
  },
  'MONAI': {
    useCase: 'Medical imaging AI model training & deployment',
    sdk: 'MONAI Framework, MONAI Deploy',
    outcome: 'State-of-the-art segmentation accuracy; accelerate medical AI from research to clinical deployment',
    caseStudy: { label: 'MONAI', url: 'https://monai.io/' },
  },
  'NeMo': {
    useCase: 'LLM training, fine-tuning & speech AI',
    sdk: 'NeMo Framework, NeMo Guardrails',
    outcome: 'Train custom LLMs on enterprise data; full pipeline from data curation to RLHF alignment',
    caseStudy: {
      default: { label: 'NVIDIA NeMo', url: 'https://www.nvidia.com/en-us/ai-data-science/products/nemo/' },
      byVertical: {
        'Telecom':                              CS.att,
        'IT Services / SaaS':                  CS.att,
        'IT Services / Data Science / Mar-Legal-HR Tech': CS.att,
        'Global Public Sector':                 CS.thinkdeep,
        'Supercomputing / Global Public Sector':CS.thinkdeep,
        'FinTech / FSI':                        CS.thinkdeep,
      },
    },
  },
  'Riva': {
    useCase: 'Real-time speech AI (ASR, TTS, NLP)',
    sdk: 'NVIDIA Riva, TensorRT',
    outcome: 'Production speech AI at <100 ms latency; supports 60+ languages',
    caseStudy: { label: 'NVIDIA Riva', url: 'https://www.nvidia.com/en-us/ai-data-science/products/riva/' },
  },
  'DRIVE Orin': {
    useCase: 'Autonomous vehicle & ADAS compute',
    sdk: 'NVIDIA DRIVE, DriveWorks, DRIVE Sim',
    outcome: '254 TOPS for full AV perception stack; ISO 26262 ASIL-D certified safety',
    caseStudy: { label: 'NVIDIA DRIVE Orin', url: 'https://www.nvidia.com/en-us/self-driving-cars/drive-platform/' },
  },
  'DRIVE Thor': {
    useCase: 'Centralised AV & cockpit compute (next-gen)',
    sdk: 'NVIDIA DRIVE, DriveWorks',
    outcome: '2000 TOPS; single SoC replaces multiple ECUs for vehicle compute consolidation',
    caseStudy: { label: 'NVIDIA DRIVE Thor', url: 'https://www.nvidia.com/en-us/self-driving-cars/drive-platform/' },
  },
  'FourCastNet': {
    useCase: 'AI-based global weather & climate forecasting',
    sdk: 'FourCastNet NIM, Earth-2, CUDA',
    outcome: '10,000× faster than traditional numerical weather prediction; ensemble forecasts in seconds',
    caseStudy: { label: 'NVIDIA Earth-2', url: 'https://www.nvidia.com/en-us/high-performance-computing/earth-2/' },
  },
  'cuQuantum': {
    useCase: 'GPU-accelerated quantum circuit simulation',
    sdk: 'cuQuantum SDK, cuStateVec, cuTensorNet',
    outcome: 'Up to 3× speedup for quantum circuit simulation; enables 30+ qubit simulation on single GPU',
    caseStudy: { label: 'cuQuantum SDK', url: 'https://developer.nvidia.com/cuquantum-sdk' },
  },
  'RTX': {
    useCase: 'Real-time ray tracing & AI rendering (DLSS)',
    sdk: 'RTX, DLSS, OptiX',
    outcome: 'DLSS 3 delivers 4× more frames with AI; photorealistic rendering at game/VR frame rates',
    caseStudy: { label: 'NVIDIA RTX', url: 'https://www.nvidia.com/en-us/geforce/rtx/' },
  },
  'Maxine': {
    useCase: 'AI-powered video conferencing & AR effects',
    sdk: 'NVIDIA Maxine, TensorRT',
    outcome: 'Reduce video streaming bandwidth by up to 90% with AI super-resolution; real-time AR overlays',
    caseStudy: { label: 'NVIDIA Maxine', url: 'https://developer.nvidia.com/maxine' },
  },
  'NVAIE': {
    useCase: 'Enterprise-grade AI software stack',
    sdk: 'NVIDIA AI Enterprise, NIM, NeMo',
    outcome: 'Certified, supported AI software with 3-year LTS; reduces deployment risk for regulated industries',
    caseStudy: {
      default: { label: 'NVIDIA AI Enterprise', url: 'https://www.nvidia.com/en-us/data-center/products/ai-enterprise/' },
      byVertical: {
        'Telecom':                              CS.att,
        'IT Services / SaaS':                  CS.att,
        'IT Services / Data Science / Mar-Legal-HR Tech': CS.att,
        'FinTech / FSI':                        CS.thinkdeep,
        'Global Public Sector':                 CS.thinkdeep,
        'Supercomputing / Global Public Sector':CS.thinkdeep,
        'Federal / US Public Sector / Defense': CS.mitre,
      },
    },
  },
};

// Per-vertical recommended NVIDIA products — used when text matching alone is insufficient
export const VERTICAL_NVIDIA_MAP = {
  'Healthcare & Life Sciences':    ['BioNeMo', 'Clara Holoscan', 'MONAI', 'Clara Parabricks'],
  'Auto / AV Infra':               ['DRIVE Orin', 'DRIVE Thor', 'Omniverse'],
  'Manufacturing & Industrial':    ['Omniverse', 'Jetson Orin', 'DeepStream', 'Isaac Sim'],
  'Robotics':                      ['Isaac GR00T', 'Isaac ROS', 'Isaac Sim', 'Jetson Orin'],
  'Federal / US Public Sector / Defense': ['Morpheus', 'NIM', 'Jetson', 'H100'],
  'Global Public Sector':          ['DGX', 'NIM', 'H100'],
  'Supercomputing / Global Public Sector': ['DGX', 'H100', 'InfiniBand', 'NIM'],
  'Telecom':                       ['H100', 'Spectrum-X', 'Morpheus', 'NIM'],
  'FinTech / FSI':                 ['RAPIDS', 'Morpheus', 'NIM', 'H100'],
  'IT Services / Data Science / Mar-Legal-HR Tech': ['RAPIDS', 'NIM', 'NeMo', 'NVAIE'],
  'IT Services / SaaS':            ['NIM', 'NeMo', 'RAPIDS', 'NVAIE'],
  'Cybersecurity':                 ['Morpheus', 'BlueField DPU', 'H100', 'NIM'],
  'Edtech / Higher Ed':            ['NIM', 'NeMo', 'H100'],
  'Media & Entertainment':         ['RTX', 'Maxine', 'TensorRT', 'NIM'],
  'Gaming':                        ['RTX', 'TensorRT', 'NIM'],
  'Smart Spaces':                  ['Metropolis', 'DeepStream', 'Jetson Orin'],
  'Energy (CleanTech / Oil & Gas)': ['H100', 'Omniverse', 'FourCastNet', 'RAPIDS'],
  'AgTech':                        ['Jetson Orin', 'Isaac Sim', 'TensorRT', 'DeepStream'],
  'Architecture, Engineering, Construction': ['Omniverse', 'RTX'],
  'AI Developer Tools':            ['NIM', 'TensorRT-LLM', 'NeMo', 'Triton'],
  'CRISP':                         ['H100', 'NIM', 'TensorRT-LLM', 'RAPIDS'],
  'Retail':                        ['Metropolis', 'DeepStream', 'Jetson Orin', 'RAPIDS'],
  'Supercomputing / Quantum':      ['H100', 'GH200', 'InfiniBand', 'cuQuantum'],
  'Adtech / Martech':              ['RAPIDS', 'TensorRT', 'NIM'],
  'Space':                         ['H100', 'TensorRT', 'Jetson'],
};

// Products to detect in relevancy text, ordered longest-match-first
export const NVIDIA_PRODUCT_PATTERNS = [
  { key: 'Isaac GR00T',    re: /\bIsaac\s+GR00T\b/i },
  { key: 'Isaac ROS',      re: /\bIsaac\s+ROS\b/i },
  { key: 'Isaac Sim',      re: /\bIsaac\s+Sim\b/i },
  { key: 'Isaac Lab',      re: /\bIsaac\s+Lab\b/i },
  { key: 'TensorRT-LLM',  re: /\bTensorRT-LLM\b/i },
  { key: 'TensorRT',       re: /\bTensorRT\b/i },
  { key: 'Clara Holoscan', re: /\bClara\s+Holoscan\b/i },
  { key: 'Clara Parabricks',re: /\bClara\s+Parabricks\b/i },
  { key: 'Jetson Orin',    re: /\bJetson\s+Orin\b/i },
  { key: 'Jetson',         re: /\bJetson\b/i },
  { key: 'DRIVE Orin',     re: /\bDRIVE\s+Orin\b/i },
  { key: 'DRIVE Thor',     re: /\bDRIVE\s+Thor\b/i },
  { key: 'DriveWorks',     re: /\bDriveWorks\b/i },
  { key: 'FourCastNet',    re: /\bFourCastNet\b/i },
  { key: 'BlueField DPU',  re: /\bBlueField\b/i },
  { key: 'Spectrum-X',     re: /\bSpectrum-X\b/i },
  { key: 'InfiniBand',     re: /\bInfiniBand\b/i },
  { key: 'BioNeMo',        re: /\bBioNeMo\b/i },
  { key: 'NeMo',           re: /\bNeMo\b/i },
  { key: 'Morpheus',       re: /\bMorpheus\b/i },
  { key: 'Metropolis',     re: /\bMetropolis\b/i },
  { key: 'Omniverse',      re: /\bOmniverse\b/i },
  { key: 'DeepStream',     re: /\bDeepStream\b/i },
  { key: 'Parabricks',     re: /\bParabricks\b/i },
  { key: 'Holoscan',       re: /\bHoloscan\b/i },
  { key: 'MONAI',          re: /\bMONAI\b/i },
  { key: 'RAPIDS',         re: /\bRAPIDS\b/i },
  { key: 'cuQuantum',      re: /\bcuQuantum\b/i },
  { key: 'Triton',         re: /\bTriton\b/i },
  { key: 'Maxine',         re: /\bMaxine\b/i },
  { key: 'Riva',           re: /\bRiva\b/i },
  { key: 'NVAIE',          re: /\bNVAIE\b/i },
  { key: 'NVAIE',          re: /\bAI Enterprise\b/i },
  { key: 'GH200',          re: /\bGH200\b/i },
  { key: 'H200',           re: /\bH200\b/i },
  { key: 'B200',           re: /\bB200\b/i },
  { key: 'H100',           re: /\bH100\b/i },
  { key: 'A100',           re: /\bA100\b/i },
  { key: 'DGX',            re: /\bDGX\b/i },
  { key: 'RTX',            re: /\bRTX\b/i },
  { key: 'NIM',            re: /\bNIM\b/i },
];

// Returns [{key, source}] where source is 'text' (explicitly mentioned) or 'vertical' (inferred from industry tag)
// Resolves the correct case study for a product given the company's vertical.
// Handles both flat { label, url } (vertical-specific products) and
// { default, byVertical } (cross-vertical products).
export function getCaseStudy(productKey, vertical) {
  const cs = NVIDIA_TECH[productKey]?.caseStudy;
  if (!cs) return { label: '', url: '#' };
  if (cs.byVertical) {
    return (vertical && cs.byVertical[vertical]) ? cs.byVertical[vertical] : cs.default;
  }
  return cs; // flat format
}

export function extractNvidiaTech(relevancyText, vertical) {
  const found = [];
  const seen = new Set();

  // Text-matched: explicitly named in the NVIDIA Relevancy field
  if (relevancyText) {
    for (const { key, re } of NVIDIA_PRODUCT_PATTERNS) {
      if (!seen.has(key) && re.test(relevancyText)) {
        seen.add(key);
        if (NVIDIA_TECH[key]) found.push({ key, source: 'text' });
      }
    }
  }

  // Vertical-inferred: suggested based on industry tag (capped at 3 to avoid noise)
  const verticalKeys = VERTICAL_NVIDIA_MAP[vertical] ?? [];
  let verticalAdded = 0;
  for (const key of verticalKeys) {
    if (verticalAdded >= 3) break;
    if (!seen.has(key) && NVIDIA_TECH[key]) {
      seen.add(key);
      found.push({ key, source: 'vertical' });
      verticalAdded++;
    }
  }

  return found;
}
