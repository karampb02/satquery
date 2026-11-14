# Project Liquid — System Architecture

### NASA Space Apps Challenge 2026: "Dancing with the SARs"

Project Liquid is an interactive, mobile-first web application designed to track and visualize dynamic Earth-surface change using NASA-ISRO NISAR and NASA OPERA Synthetic Aperture Radar (SAR) products.

---

## High-Level Architecture Overview

```mermaid
flowchart TD
    subgraph Data Sources
        NISAR[NASA-ISRO NISAR<br/>L-band GCOV / GUNW / GSLC]
        OPERA[NASA/JPL OPERA<br/>DSWx-S1 / DIST-ALERT / DISP-S1]
        GIBS[NASA GIBS<br/>True Color & Night Lights WMTS]
        ASF[ASF DAAC / NASA Earthdata]
    end

    subgraph Scientific Processing Pipeline
        Fetch[scripts/fetch_data.py<br/>asf_search & earthaccess]
        Backscatter[scripts/process_backscatter.py<br/>Radiometric Calibration & Lee Filter]
        Flood[scripts/process_flood.py<br/>Specular Reflection & DSWx-S1]
        Deformation[scripts/process_deformation.py<br/>InSAR Phase to LOS cm & Fringes]
        Vegetation[scripts/process_vegetation.py<br/>HV Backscatter Drop & DIST-ALERT]
        Export[scripts/export_scene.py<br/>Static Asset Bundler]
    end

    subgraph Static Data Bundles
        Bundles["/public/data/&lt;scene-id&gt;/<br/>meta.json • stats.json • timeseries.json<br/>change.geojson • before.png • after.png"]
    end

    subgraph Frontend Web App
        Next[Next.js App Router]
        MapLibre[MapLibre GL JS Engine]
        UI[Swipe Slider • Time Slider • Layer Toggles]
        Stats[Recharts Temporal Analytics]
        Tour[Story Mode Guided Tours]
    end

    ASF --> Fetch
    NISAR --> Fetch
    OPERA --> Fetch
    Fetch --> Backscatter
    Fetch --> Flood
    Fetch --> Deformation
    Fetch --> Vegetation
    Backscatter --> Export
    Flood --> Export
    Deformation --> Export
    Vegetation --> Export
    Export --> Bundles
    Bundles --> Next
    GIBS --> MapLibre
    Next --> MapLibre
    Next --> UI
    Next --> Stats
    Next --> Tour
```

---

## 1. Offline Scientific Radar Processing (`/scripts`)

The offline processing pipeline guarantees zero dependency on live data downloads or external API credentials during public demonstrations:

1. **`fetch_data.py`:**
   - Interfaces with ASF DAAC and NASA Earthdata using `asf_search` and `earthaccess`.
   - Authenticates via Earthdata Login credentials (`NASA_EARTHDATA_USER`, `NASA_EARTHDATA_PASS`).
   - Falls back gracefully to curated local sample assets if network or credentials are unavailable.

2. **`process_backscatter.py`:**
   - Calibrates raw SAR digital numbers (DN) to decibels:
     $$\sigma^0_{\text{dB}} = 10 \cdot \log_{10}(\text{amplitude}^2 + \epsilon) - K$$
   - Executes enhanced Lee speckle filtering to remove noise while preserving structural edges.
   - Computes multi-temporal log-ratio change masks ($\Delta\text{dB} = \sigma^0_{\text{after}} - \sigma^0_{\text{before}}$).

3. **`process_flood.py`:**
   - Detects specular reflection attenuation on open standing water ($\sigma^0 < -16.5\text{ dB}$).
   - Derives flooded area delta and exports vectorized polygons with $km^2$ extent metrics.

4. **`process_deformation.py`:**
   - Converts unwrapped InSAR interferogram phase ($\Delta\phi$) into Line-of-Sight (LOS) displacement in centimeters:
     $$d_{\text{LOS}} = -\frac{\lambda}{4\pi} \Delta\phi$$
     *(where $\lambda = 24\text{ cm}$ for NISAR L-band)*.
   - Produces continuous deformation color gradients and cyclical $2\pi$ wrapped fringe modes.

5. **`process_vegetation.py`:**
   - Identifies canopy loss from cross-polarized HV backscatter collapse (depolarizing volume scattering reduction).
   - Ingests OPERA DIST-ALERT disturbance alerts.

6. **`export_scene.py`:**
   - Packages normalized static scene directories into `/public/data/<scene-id>/` containing `meta.json`, `stats.json`, `timeseries.json`, `change.geojson`, `before.png`, and `after.png`.

---

## 2. Frontend Web Application

- **Next.js 14 App Router:** Server-side rendered shell with client-side WebGL canvas hydration.
- **MapLibre GL JS:** High-performance hardware-accelerated mapping engine supporting image raster sources and GeoJSON vector layers.
- **NASA GIBS Tile Integration:** Seamless WMTS raster tile switching between NASA GIBS MODIS/VIIRS True Color, NASA Black Marble Night Lights, and Dark Radar basemaps.
- **Dual Visual Inspection Modes:**
  - Dynamic Before/After swipe slider divider.
  - Multi-temporal time slider with auto-play animation.
- **Guided Story Mode:** Programmatic camera flights (`map.flyTo`) coupled to narrative caption cards.
- **Export & Share:** Instant GeoJSON download and shareable plain-hash URLs (`#scene-id`).
- **Accessible & Mobile-First:** Responsive layout down to 360px viewport width, high-contrast dark theme, and prefers-reduced-motion support.

---

## 3. Data Integrity & Verification
Every scene in Project Liquid reflects verified NASA specifications:
- Exact geographic bounding boxes and coordinate centers.
- Actual NASA OPERA and NISAR product identifiers.
- Clear data flags (`"real"` or `"sample"`).
- Plain attribution credit: *"Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS"*.
