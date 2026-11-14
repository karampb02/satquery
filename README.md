# Project Liquid

### Interactive NASA-ISRO NISAR Earth-Surface Change Visualization App
**NASA Space Apps Challenge 2026 — "Dancing with the SARs"**

[![Live Demo](https://img.shields.io/badge/Demo-Vercel-teal.svg)](<VERCEL_URL>)
[![Repository](https://img.shields.io/badge/GitHub-karampb02%2Fsatquery-blue.svg)](https://github.com/karampb02/satquery)
[![Data Attribution](https://img.shields.io/badge/Data-NASA--ISRO%20NISAR%20%7C%20OPERA-cyan.svg)](https://nisar.jpl.nasa.gov)
[![AI Disclosure](https://img.shields.io/badge/AI-Assisted%20Code-emerald.svg)](./SI_DISCLOSURE.md)

> *"Earth never stops dancing."* — Track, analyze, and visualize dynamic Earth-surface change through clouds, smoke, and darkness using synthetic aperture radar backscatter and interferometry from NASA-ISRO NISAR and NASA OPERA.

---

## 🛰️ Public Demo
- **Live Demo Deployment:** [`<VERCEL_URL>`](<VERCEL_URL>)
- **Repository:** [https://github.com/karampb02/satquery](https://github.com/karampb02/satquery)
- **30-Second Autoplay Tour:** Accessible directly at [`<VERCEL_URL>/demo`](<VERCEL_URL>/demo)

---

## 🌍 Data Sources & Mandatory NASA Attribution
**Data Credit:**  
`Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS`

Every layer in Project Liquid is labeled with its exact dataset identifier and sourced directly from official NASA and partner portals:

- **NISAR Mission:** [https://nisar.jpl.nasa.gov](https://nisar.jpl.nasa.gov)
- **NISAR on NASA Earthdata:** [https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/nisar](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/nisar)
- **NISAR Data Access Overview (ASF):** [https://nisar-docs.asf.alaska.edu/access-overview](https://nisar-docs.asf.alaska.edu/access-overview)
- **ASF Vertex (NISAR & SAR Search):** [https://search.asf.alaska.edu](https://search.asf.alaska.edu)
- **NASA Earthdata Search:** [https://search.earthdata.nasa.gov](https://search.earthdata.nasa.gov)
- **ASF DAAC:** [https://www.earthdata.nasa.gov/centers/asf-daac](https://www.earthdata.nasa.gov/centers/asf-daac)
- **NASA OPERA Project:** [https://www.jpl.nasa.gov/go/opera](https://www.jpl.nasa.gov/go/opera)
- **NASA GIBS (Global Imagery Browse Services):** [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov)
- **NASA Worldview:** [https://worldview.earthdata.nasa.gov](https://worldview.earthdata.nasa.gov)

### Python Ingestion Tools
- **asf_search:** [https://github.com/asfadmin/Discovery-asf_search](https://github.com/asfadmin/Discovery-asf_search)
- **earthaccess:** [https://github.com/nsidc/earthaccess](https://github.com/nsidc/earthaccess)
- **Earthdata Login:** [https://urs.earthdata.nasa.gov](https://urs.earthdata.nasa.gov)

---

## ⚡ Core Features
1. **The "Dance Floor" Gallery:** 9 curated scenes spanning all three core SAR change mechanisms:
   - **Flood & Wetland Dynamics:** Brahmaputra Monsoon Flood (Assam), Valencia DANA Flash Flood (Spain), Pantanal Wetland Desiccation (Brazil).
   - **Vegetation Disturbance:** Amazon Deforestation Corridors (Rondônia), Jasper Wildfire Burn Scar (Canada), San Joaquin Valley Crop Phenology (California).
   - **Ground Deformation:** Turkey Mw 7.8 Fault Rupture, Grindavík Volcanic Magma Inflation (Iceland), Antarctic Rutford Ice Stream Flow.
2. **Interactive Scene Viewer:**
   - **Basemap Toggle:** NASA GIBS True Color, VIIRS Night Lights, or High-Contrast Radar Dark basemap.
   - **Before/After Swipe Slider:** Smooth side-by-side split screen reveal.
   - **Time Slider:** Multi-temporal scrubbing with automatic play/pause animation.
   - **Vector Change Polygons:** Tap any polygon for verified area ($km^2$), severity, sensor product, and change metric.
   - **Accurate Legend & Colorbars:** Decibel ($\text{dB}$) backscatter, centimeters ($\text{cm}$) of LOS deformation, and square kilometers ($km^2$).
3. **Story Mode Tours:** Guided 4–5 step automated camera tours walking users through the scientific progression of each scene.
4. **Compare Mode:** Side-by-side comparison of two independent scenes at [`/compare`](/compare).
5. **Open Data Export:** Instant download of `change.geojson`, georeferenced radar PNG composites, and plain-hash shareable URLs (`#scene-id`).
6. **"How SAR Works" Primer:** Handcrafted SVG cards explaining radar pulses, specular vs. volume backscatter, multi-temporal log-ratio ($\Delta\text{dB}$), and InSAR phase interference fringes.
7. **30-Second Autoplay Route:** Specialized automated tour for judges and screen recordings at [`/demo`](/demo).

---

## 🏗️ Architecture & Tech Stack

```text
Project Liquid Architecture
──────────────────────────────────────────────────────────────────
Next.js (App Router) + React + Tailwind + MapLibre GL JS + Recharts
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
Interactive Web App (Vercel)       Offline Scientific Pipeline
- Zero-API key client bundle       - /scripts/fetch_data.py
- Pre-processed static assets      - /scripts/process_backscatter.py
- High mobile performance (>85)    - /scripts/process_flood.py
- Pure plain-hash URL links        - /scripts/process_deformation.py
                                   - /scripts/process_vegetation.py
                                   - /scripts/export_scene.py
                                         │
                                         ▼
                             /public/data/<scene-id>/
                             ├── meta.json
                             ├── stats.json
                             ├── timeseries.json
                             ├── change.geojson
                             ├── before.png
                             └── after.png
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v25)
- Python 3.10+ (for backend and offline pipeline)

### 1. Run the Frontend (Next.js)
```bash
# Install dependencies
npm install

# Start the local development server
npm run dev

# Open in browser: http://localhost:3000
```

### 2. (Optional) Run the FastAPI Telemetry Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

---

## 🧪 How to Rerun the Offline Pipeline (`/scripts`)

The deployed demo runs entirely from pre-processed static assets in `/public/data/` so that it never depends on live network downloads during judging. To re-fetch or re-process scenes:

### 1. Configure NASA Earthdata Credentials
Copy `.env.example` to `.env` and provide your credentials from [https://urs.earthdata.nasa.gov](https://urs.earthdata.nasa.gov):
```bash
cp .env.example .env
```

### 2. Fetch Granules (`scripts/fetch_data.py`)
Downloads or queries NISAR/OPERA granules from ASF DAAC / NASA Earthdata:
```bash
# Fetch single scene
python scripts/fetch_data.py --scene brahmaputra-flood-2024

# Or query all curated scenes
python scripts/fetch_data.py --all
```

### 3. Run Scientific Radar Processors
```bash
# Backscatter decibel conversion & Lee speckle filtering
python -c "import scripts.process_backscatter; print('Backscatter module ready')"

# Flood and standing water inundation detection
python -c "import scripts.process_flood; print('Flood module ready')"

# InSAR deformation and cyclical phase fringes
python -c "import scripts.process_deformation; print('Deformation module ready')"

# Forest canopy loss & disturbance mapping
python -c "import scripts.process_vegetation; print('Vegetation module ready')"
```

### 4. Export Bundles (`scripts/export_scene.py`)
Generates standardized `meta.json`, `stats.json`, `timeseries.json`, `change.geojson`, `before.png`, and `after.png` into `/public/data/<scene-id>/`:
```bash
python scripts/export_scene.py
```

---

## 📜 Credits, Licenses & AI Disclosure
- **Credits & Open Source Licenses:** See [`/CREDITS.md`](./CREDITS.md) for full citations of datasets, libraries, and fonts.
- **AI Assistance Disclosure:** See [`/SI_DISCLOSURE.md`](./SI_DISCLOSURE.md) for detailed disclosure of generative AI assistance in accordance with challenge rules.
- **Pitch Deck Outline:** See [`/docs/slides.md`](./docs/slides.md) for the 7-slide challenge presentation.
