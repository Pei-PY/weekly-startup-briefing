# Top 10 Startup Stories
## April 4–6, 2026 · Combined Edition · NVIDIA Inception

> *Curated for: rling@nvidia.com · NVIDIA Inception Team · Pre-Seed through Series D · AI & Technology*
> *Combined edition — merges the April 5 weekend briefing and April 6 Monday briefing. 20 candidates evaluated; re-filtered with updated rules: >$200M total raised disqualified, Enterprise Customer AccountTag disqualified, 2+ Salesforce Opportunities disqualified. 8 candidates disqualified under new rules (Sarvam AI, Also, Halter, ScaleOps, Valar Atomics, Rebellions — >$200M; Alcatraz AI — Enterprise Customer tag + 17 opps; Coefficient Bio — acquired). 10 companies below are the strongest eligible candidates across 10 distinct verticals.*
> *Three High Touch disqualifications this cycle: ThinkLabs AI (NVentures-backed grid AI, $28M Series A), Starcloud ($170M Series A, orbital data centers with confirmed NVIDIA H100s), CATCHES (NVIDIA Omniverse-powered AI fashion retail, CNBC April 5). All three would have ranked in the top 5 by NVIDIA relevance.*

**NVIDIA Tech Alignment Legend:** 🟢 Active user — confirmed, explicit use of NVIDIA hardware or software (CUDA, H100, Jetson, TensorRT, NIM, Isaac, etc.) · 🟠 Potential — uses AI/ML but direct NVIDIA usage is unconfirmed or indirect · ⚪ Low fit — software-only, no meaningful compute, or built on non-NVIDIA silicon

---

### 1. ODC (ORAN Development Company)

**Vertical:** Telecom | **Total Raised to Date:** ~$47M | **Stage:** Series A | **NVIDIA Tech Alignment:** 🟢 Active user

**What we do:** ODC's Odyssey platform converts standard 5G base stations into distributed AI compute hubs — what the company calls "Token Factories." Rather than routing AI workloads to centralized data centers, ODC embeds inference capacity directly inside telecom infrastructure, enabling real-time AI at the radio access layer for autonomous systems, industrial robotics, and critical infrastructure applications.

**Today's interesting [article](https://www.prnewswire.com/news-releases/odc-completes-a-45m-series-a-funding-architecting-the-global-distributed-compute-grid-to-power-the-ai-native-era-302725604.html):** ODC closed a $45M Series A with NVIDIA, Cisco Investments, Nokia, AT&T, MTN, Telecom Italia, and Booz Allen Hamilton all as named investors — a rare single-round coalition of the three dominant pillars of AI (compute, networking, telecom) plus defense. That investor syndicate is effectively a customer commitment list.

**Investors:** Booz Allen Hamilton, Cisco Investments, Nokia, NVIDIA, AT&T, MTN, Telecom Italia, Phoenix Venture Partners (lead), Cerberus Capital Management (seed)

**NVIDIA Relevancy:** ODC's Odyssey platform explicitly integrates the NVIDIA AI Aerial software stack for 5G AI-RAN capabilities — confirmed in the PR Newswire release. NVIDIA is also a named Series A investor, indicating strategic alignment at the infrastructure level. Spectrum-X and H100/B200 are both relevant as AI-RAN workloads scale.

**Inception Status:** Not in Inception

---

### 2. Nomadic (NomadicML)

**Vertical:** Auto / AV Infra | **Total Raised to Date:** $8.4M | **Stage:** Seed | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Nomadic converts unstructured AV fleet footage and sensor data into structured, semantically searchable datasets using vision-language models. Engineering teams at AV companies can search petabytes of footage by describing what they want to find — "pedestrian crossing at night in rain" — rather than manually scrubbing video. They are building the data infrastructure layer that makes physical AI training practical at scale.

**Today's interesting [article](https://techcrunch.com/2026/03/31/nomadic-raises-8-4-million-to-wrangle-the-data-pouring-off-avs/):** Nomadic won first prize at NVIDIA GTC's startup pitch competition in March 2026 and counts Zoox and Mitsubishi Electric as customers at seed stage — unusually strong enterprise validation for a sub-$10M company. Jeff Dean (Google DeepMind, ex-Google Brain) is a personal angel investor.

**Investors:** TQ Ventures (lead), Pear VC, Jeff Dean (Google DeepMind), angels from OpenAI and Google DeepMind

**NVIDIA Relevancy:** Nomadic's VLM-based video indexing pipeline is GPU-intensive and could potentially run on H100 or Jetson at the fleet edge for real-time data structuring. Their NVIDIA GTC pitch win is a direct signal of alignment with NVIDIA's physical AI priorities. TensorRT-LLM and Triton Inference Server may be relevant to their inference serving stack.

**Salesforce:** [Account](https://nvcrm.lightning.force.com/lightning/r/Account/001Vv00000VsFzVIAV/view)

**Inception Status:** Community member

---

### 3. Linx Security

**Vertical:** Cybersecurity | **Total Raised to Date:** $83M | **Stage:** Series B | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Linx Security is an AI-native identity security and governance platform that maps every identity in an enterprise — human, non-human (service accounts, API keys), and agentic (AI agents) — and monitors all of them in real time. When identity-based threats emerge, Linx automatically remediates them rather than waiting for a human analyst to respond. Founded 2023, based in New York.

**Today's interesting [article](https://www.securityweek.com/linx-security-raises-50-million-for-identity-security-and-governance/):** Linx raised a $50M Series B less than 18 months after founding, with Insight Partners leading and Index Ventures joining — a Tier-1 investor syndicate that reflects how urgent enterprise customers consider the agentic identity problem. CEO Israel Duanis positioned it explicitly as "what Wiz did to cloud security, we can do to identity."

**Investors:** Insight Partners (lead), Cyberstarts, Index Ventures

**NVIDIA Relevancy:** Linx's real-time identity monitoring across high-volume enterprise event streams could potentially benefit from GPU-accelerated anomaly detection. NVIDIA Morpheus, which is specifically designed for GPU-accelerated cybersecurity AI on high-throughput data streams, may be directly applicable to their threat detection pipeline. BlueField DPU could potentially be relevant for inline identity traffic inspection at network speed.

**Inception Status:** Not in Inception

---

### 4. Antaris

**Vertical:** Space | **Total Raised to Date:** ~$42M | **Stage:** Series A | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Antaris builds an AI-powered platform for the full satellite lifecycle — design, simulation, manufacturing orchestration, and mission operations. Their "Full Mission Virtualization" approach lets satellite operators design and test complete missions in software before building hardware, dramatically compressing development timelines. Founded 2021 in Mountain View, CA. Focused on ISR and communications missions for DoD and allied governments.

**Today's interesting [article](https://spacenews.com/antaris-raises-28-million-series-a-to-accelerate-ai-driven-space-missions/):** Antaris raised a $28M Series A first close led by WestWave Capital with Lockheed Martin Ventures participating — a strategic defense prime as co-investor signals genuine DoD customer demand, not just venture speculation. The company also signed an MoA with SARsatX for a 16-satellite constellation in Saudi Arabia, adding international sovereign AI mission scope to their pipeline.

**Investors:** WestWave Capital (lead), Lockheed Martin Ventures, Streamlined, Acequia, HCVC, E2MC, Possible Ventures

**NVIDIA Relevancy:** AI-driven satellite mission planning, simulation, and ISR data processing are GPU-intensive workloads where H100/B200 clusters power ground-side analysis and TensorRT may accelerate onboard AI inference for next-generation satellites. NVIDIA's Omniverse could potentially be relevant to Antaris's mission simulation platform for physically-accurate sensor modeling. Jetson could potentially be relevant to onboard payload compute on smaller satellites.

**Salesforce:** [Account](https://nvcrm.lightning.force.com/lightning/r/Account/0018Z00003G7QO7QAN/view)

**Inception Status:** Community member

---

### 5. Manna Air Delivery

**Vertical:** AgTech | **Total Raised to Date:** ~$110M | **Stage:** Series B | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Manna builds and operates a full-stack autonomous drone delivery network — designing its own airframes, manufacturing them, and running the flight orchestration software. Deliveries are made from retail partners directly to customer doorsteps in under three minutes, at 85% lower CO2 per delivery than ground transport. Founded 2019 in Dublin, Ireland. Now operating in Ireland, Finland, and Texas.

**Today's interesting [article](https://dronelife.com/2026/04/01/manna-raises-50m-to-expand-drone-delivery-network-in-the-u-s/):** Manna raised $50M Series B led by ARK Invest on April 1, having completed 250,000+ regulated commercial UAV flights — a milestone that took years to reach regulatory approval for. With a net promoter score of 86 and 60% household adoption in their Dublin West launch market, the company is now scaling to 40 new U.S. bases. ARK's involvement is notable: Cathie Wood's fund does not typically lead Series B rounds in hardware-heavy logistics companies.

**Investors:** ARK Invest (lead), Ireland Strategic Investment Fund, Schooner Capital, Coca-Cola HBC, Molten Ventures

**NVIDIA Relevancy:** Autonomous drone delivery systems require real-time edge AI for obstacle detection, path planning, and airspace management — workloads that could potentially align with Jetson Orin for onboard inference and DeepStream for multi-drone traffic coordination. As Manna scales to 40 U.S. bases with large drone fleets, a centralized compute and sensor fusion infrastructure for fleet management may align with NVIDIA's Metropolis platform.

**Salesforce:** [Account](https://nvcrm.lightning.force.com/lightning/r/Account/0018Z00003FGZloQAH/view)

**Inception Status:** Community member

---

### 6. Soma Energy

**Vertical:** Energy (CleanTech) | **Total Raised to Date:** $7M | **Stage:** Seed | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Soma Energy is an AI platform that unlocks existing grid capacity for AI data centers — delivering power interconnections in months rather than years by optimizing how distributed energy resources, battery storage, and generation assets interact with wholesale electricity markets in real time. Founded by Ath Caramanolis (who built and scaled AWS's 10-gigawatt renewable energy optimization program) and CTO Mario Souto (who built the ML platform powering that portfolio), the company launched from stealth in April 2026 with 18 employees and 2 gigawatts of live U.S. grid assets already deployed.

**Today's interesting [article](https://www.axios.com/pro/climate-deals/2026/04/02/soma-energy-grid-ai-seed):** Soma emerged from stealth April 2 with $7M in seed funding and five AI data center companies as paying customers — already deployed, not in pilot. The founding team's credibility is exceptional: the same engineers who solved large-scale renewable energy optimization at AWS at 10 GW, who then left to commercialize it independently, and who already have enterprise proof points before raising institutional capital.

**Investors:** Category Ventures (lead), Haystack, RRE Ventures, TO.VC, Uncork Capital, Panache Ventures, Walter Kortschak (angel)

**NVIDIA Relevancy:** Soma Energy's customers are AI data centers — the same facilities housing NVIDIA H100 and B200 GPU clusters. Power availability is the primary bottleneck to H100/B200 cluster deployment at scale globally. A platform that accelerates grid interconnection and optimizes real-time power delivery is directly enabling faster NVIDIA GPU infrastructure buildout. NVIDIA's FourCastNet NIM could potentially be relevant to Soma's grid supply forecasting models.

**Inception Status:** Not in Inception

---

### 7. Whirl AI

**Vertical:** IT Services / Data Science | **Total Raised to Date:** $8.9M | **Stage:** Seed | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Whirl AI is an enterprise IT modernization platform that continuously ingests metadata from an organization's systems (ERP, cloud infrastructure, identity, ticketing) to build a living, queryable knowledge graph of the IT environment. AI agents then use this graph to research, design, implement, and test IT changes in hours rather than weeks — compressing months of IT transformation work into automated agent-driven workflows.

**Today's interesting [article](https://techfundingnews.com/ex-nvidia-snowflake-alums-whirl-ai-emerges-from-stealth-with-8-9m-from-iconiq/):** Whirl's founder Sunny Bedi served as VP of Corporate IT at NVIDIA and then CIO/CDO at Snowflake — two of the most demanding enterprise IT environments in AI. ICONIQ, whose principals worked directly with Bedi at Snowflake, made this their first-ever seed investment, treating it as a conviction bet on a founder they had already stress-tested.

**Investors:** ICONIQ Growth (lead — first seed check ever), angels from Okta, Splunk, VMware

**NVIDIA Relevancy:** Sunny Bedi's background as NVIDIA's VP Corporate IT gives the team direct knowledge of NVIDIA's internal enterprise infrastructure. At scale, Whirl's AI agent orchestration and knowledge graph workloads could potentially leverage NIM microservices and RAPIDS for real-time metadata processing. The ex-NVIDIA founding pedigree makes this a natural Inception engagement candidate.

**Inception Status:** Not in Inception

---

### 8. CavilinQ

**Vertical:** Supercomputing / Quantum | **Total Raised to Date:** $8.8M | **Stage:** Seed | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** CavilinQ is building the interconnect layer for modular quantum computing — a scalable light-matter interface architecture that links separate quantum processors together into a unified, high-fidelity quantum machine. Rather than trying to build a single massive quantum chip, CavilinQ's approach allows utility-scale quantum systems to be assembled from smaller, higher-quality modules. A spinout from the University of Chicago's Pritzker School of Molecular Engineering, co-founded by quantum faculty from UChicago and Harvard.

**Today's interesting [article](https://polsky.uchicago.edu/2026/04/02/cavilinq-secures-8-8m-seed-round-to-unlock-utility-scale-quantum-computing/):** CavilinQ's scientific co-founders — Hannes Bernien (UChicago) and Mikhail Lukin (Harvard) — are two of the most-cited researchers in quantum networking globally. The CEO completed his PhD at UChicago in 2025. Harper Court Ventures participation signals this is one of UChicago's highest-priority deep tech commercializations.

**Investors:** QVT / Quantonation (lead), Safar Partners, MFV Partners, Serendipity Capital, Harper Court Ventures (UChicago deep tech fund)

**NVIDIA Relevancy:** NVIDIA's cuQuantum library is designed precisely for GPU-accelerated quantum circuit simulation — the computational work needed to design, test, and validate quantum interconnects before physical implementation. As CavilinQ advances toward utility-scale quantum systems, classical GPU simulation of quantum network behavior (noise modeling, error correction, circuit optimization) may become a meaningful part of their R&D infrastructure.

**Inception Status:** Not in Inception

---

### 9. Generare

**Vertical:** Healthcare & Life Sciences | **Total Raised to Date:** ~€25M (~$27M) | **Stage:** Series A | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Generare is a Paris-based techbio company that decodes microbial genomes at scale to discover novel chemical compounds for drug development. Their AI platform reads microbial DNA, identifies gene sequences most likely to produce bioactive molecules, expresses them in laboratory conditions, and characterizes the resulting compounds — accessing the 97% of microbial chemistry that traditional approaches cannot reach. Founded in 2023 by Dr. Vincent Libis (ERC-funded synthetic biology pioneer) and Guillaume Vandenesch.

**Today's interesting [article](https://siliconangle.com/2026/04/02/generare-raises-23-2m-discover-unknown-molecules-advance-new-drugs/):** Generare raised €20M ($23.2M) Series A on April 2, co-led by Alven and Daphni, just one year after a €5M seed. They claim to already be the leading platform for evolution-based molecular data production and are targeting 10x novel molecules by 2027. An ERC-backed founding scientist, a 12-month Series A, and a specific 2027 production target together suggest real technical differentiation.

**Investors:** Alven (co-lead), Daphni (co-lead), Galion.exe, Teampact Ventures, VIVES Partners

**NVIDIA Relevancy:** Microbial genome decoding and AI-driven molecular characterization at scale are GPU-intensive bioinformatics workloads. NVIDIA BioNeMo NIMs — including AlphaFold2, MolMIM (molecular generation), and Clara Parabricks (genomics acceleration) — could potentially align with Generare's core discovery pipeline. As the company scales toward its 2027 production targets, GPU-accelerated generative chemistry and genomics workflows may become central to their infrastructure.

**Inception Status:** Not in Inception

---

### 10. Numos

**Vertical:** FinTech / FSI | **Total Raised to Date:** $4.25M | **Stage:** Seed | **NVIDIA Tech Alignment:** 🟠 Potential

**What we do:** Numos builds AI software for enterprise finance teams that integrates across accounting systems, billing tools, data warehouses, and spreadsheets to create a queryable, living understanding of an organization's financial state. AI agents then perform FP&A analysis, automate month-end close, and flag anomalies — enabling CFOs to cut reporting cycles by 80% and book-close time by more than half. Founded by Parijat Sarkar (former SVP at Zenefits) and Mitul Tiwari (LinkedIn AI veteran), with early customers Udemy and Dandy.

**Today's interesting [article](https://www.axios.com/pro/fintech-deals/2026/04/02/numos-ai-finance-general-catalyst):** General Catalyst led Numos's $4.25M seed round, announced April 2. General Catalyst's selection of Numos over a large competitive field is a meaningful signal from one of the most prolific AI investors of the past two years. The founding team's combination of enterprise SaaS scale (Zenefits) and AI platform experience (LinkedIn) is unusual in the finance tooling space.

**Investors:** General Catalyst (lead), Operator Collective

**NVIDIA Relevancy:** At enterprise scale, Numos's real-time financial anomaly detection and multi-system data processing could potentially benefit from RAPIDS for GPU-accelerated tabular data analytics pipelines. NIM microservices for on-premise LLM deployment are directly relevant to compliance-sensitive financial environments where CFO-grade AI analysis cannot run on public cloud infrastructure.

**Inception Status:** Not in Inception

---

## Summary Table

*Companies from this briefing ranked by NVIDIA relevance — for Inception pipeline review.*

| Rank | Company | Vertical | Stage | NVIDIA Tech Alignment | Key NVIDIA Tech | Inception Status | Salesforce |
|------|---------|---------|-------|-----------|-----------------|-----------------|------------|
| 1 | **ODC** | Telecom | Series A | 🟢 Active user | AI Aerial, Spectrum-X, H100/B200 | Not in Inception | — |
| 2 | **Nomadic** | Auto / AV Infra | Seed | 🟠 Potential | H100, TensorRT-LLM, Triton (GTC pitch winner) | Community member | [Account](https://nvcrm.lightning.force.com/lightning/r/Account/001Vv00000VsFzVIAV/view) |
| 3 | **Linx Security** | Cybersecurity | Series B | 🟠 Potential | Morpheus, BlueField DPU | Not in Inception | — |
| 4 | **Antaris** | Space | Series A | 🟠 Potential | H100/B200, TensorRT, Jetson, Omniverse | Community member | [Account](https://nvcrm.lightning.force.com/lightning/r/Account/0018Z00003G7QO7QAN/view) |
| 5 | **Manna Air Delivery** | AgTech | Series B | 🟠 Potential | Jetson Orin, DeepStream, Metropolis | Community member | [Account](https://nvcrm.lightning.force.com/lightning/r/Account/0018Z00003FGZloQAH/view) |
| 6 | **Soma Energy** | Energy / CleanTech | Seed | 🟠 Potential | H100/B200 (data center grid), FourCastNet NIM | Not in Inception | — |
| 7 | **Whirl AI** | IT Services / Data Science | Seed | 🟠 Potential | NIM, RAPIDS (ex-NVIDIA VP founder) | Not in Inception | — |
| 8 | **CavilinQ** | Supercomputing / Quantum | Seed | 🟠 Potential | cuQuantum | Not in Inception | — |
| 9 | **Generare** | Healthcare & Life Sciences | Series A | 🟠 Potential | BioNeMo NIMs, Clara Parabricks | Not in Inception | — |
| 10 | **Numos** | FinTech / FSI | Seed | 🟠 Potential | RAPIDS, NIM (on-prem compliance) | Not in Inception | — |

*Disqualified under updated filters: Sarvam AI, Also, Halter, ScaleOps, Valar Atomics, Rebellions (>$200M raised); Alcatraz AI (Enterprise Customer tag + 17 Salesforce opportunities); Coefficient Bio (acquired by Anthropic). High Touch disqualifications: ThinkLabs AI, Starcloud, CATCHES.*

---

## Vertical Coverage

| Vertical | Stories | Top Company |
|---------|---------|-------------|
| Telecom | 1 | ODC ($45M Series A — NVIDIA investor, AI Aerial confirmed) |
| Auto / AV Infra | 1 | Nomadic ($8.4M Seed — GTC pitch winner) |
| Cybersecurity | 1 | Linx Security ($83M Series B) |
| Space | 1 | Antaris ($42M Series A — Lockheed Martin Ventures) |
| AgTech | 1 | Manna Air Delivery ($110M Series B) |
| Energy / CleanTech | 1 | Soma Energy ($7M Seed — AWS energy team) |
| IT Services / Data Science | 1 | Whirl AI ($8.9M Seed — ex-NVIDIA VP founder) |
| Supercomputing / Quantum | 1 | CavilinQ ($8.8M Seed — UChicago/Harvard spinout) |
| Healthcare & Life Sciences | 1 | Generare ($27M Series A) |
| FinTech / FSI | 1 | Numos ($4.25M Seed — General Catalyst) |

*10 distinct verticals — maximum possible diversity for a 10-company briefing. Verticals with no coverage this week: Manufacturing & Industrial, Robotics, Federal/Defense, Global Public Sector, Edtech/Higher Ed, Media & Entertainment, Gaming, Smart Spaces, AEC, CRISP, Retail, Adtech/Martech.*

---

## Interesting Trends

1. **The companies NVIDIA doesn't know yet are almost all at seed stage** — After applying the new $200M cap and Salesforce filters, every company in the top 10 except Linx Security ($83M) and Manna ($110M) has raised under $50M. The pattern is clear: by the time a startup reaches Series C or $200M+ raised, NVIDIA has typically already engaged them through enterprise sales or NVentures. The genuine origination opportunity — companies with no NVIDIA Salesforce presence and no opportunities — is concentrated at seed and Series A. Nomadic ($8.4M, GTC pitch winner) and Soma Energy ($7M, 5 paying AI data center customers) are the archetype of what this briefing should surface.

2. **Physical AI data infrastructure is emerging as a distinct, fundable category** — ODC (distributed AI at the 5G radio layer) and Nomadic (AV data structuring via VLM) both represent the same underlying thesis: the physical world is generating unstructured data faster than software can process it, and a new layer of GPU-accelerated data infrastructure is required to make physical AI tractable. Nomadic's GTC pitch win is a direct signal that NVIDIA sees this as strategically central. Both companies are pre-Series B, not yet in Salesforce as active accounts, and building infrastructure that naturally runs on NVIDIA's edge-to-data-center stack.

3. **The AI energy constraint is being solved at seed stage before it becomes a crisis** — Soma Energy ($7M seed, 5 paying AI data center customers, 2 GW of live grid assets) shows that the power bottleneck to deploying Blackwell at scale is already attracting serious infrastructure founders — not just climate VCs, but AWS-pedigree engineers with direct enterprise proof points. NVIDIA's FourCastNet NIM and the broader data center power constraint make energy infrastructure startups a natural Inception category that is currently undercovered in the pipeline.

---

## Sources Consulted

- TechCrunch, Bloomberg, PR Newswire, Axios Pro, SecurityWeek, SpaceNews, DroneLife, SiliconAngle, TechFundingNews, University of Chicago Polsky Center — March 31–April 6, 2026
- Salesforce NVCRM (nvcrm-dev) — Account (incl. AccountTags__c), Inception Connect Profile, and Opportunity count lookups for all 20 candidates
- 135+ targeted search queries across all 23 NVIDIA Inception verticals (combined across both research runs)

---
*Generated by `/startup-briefing` · NVIDIA Inception · 2026-04-06 · Combined Edition (re-filtered)*

**Suggested email subject line:** `Daily Startup Briefing — April 4–6, 2026 · NVIDIA Inception Edition`
