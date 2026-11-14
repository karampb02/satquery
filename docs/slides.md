# Project Liquid — Pitch & Presentation Outline
### NASA Space Apps Challenge 2026 — "Dancing with the SARs"
**Repository:** [https://github.com/karampb02/satquery](https://github.com/karampb02/satquery)  
**Live Demo:** `<VERCEL_URL>`  
**Data Attribution:** Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS

---

## Slide 1: Title & Vision
- **Header:** Project Liquid: Interactive Earth-Surface Change Visualizer
- **Subheader:** Decoding Planetary Dynamics with NASA-ISRO NISAR Radar
- **Tagline:** *"Earth never stops dancing."*
- **Theme:** NASA Space Apps Challenge 2026 — "Dancing with the SARs"
- **Mission:** Empowering decision-makers, researchers, and the general public to understand dynamic planetary change in under 30 seconds, directly on mobile phones or desktops, using active microwave radar.

---

## Slide 2: The Problem: Optical Satellites Are Blind When It Matters Most
- **The Blind Spot:** Earth's most catastrophic natural emergencies—monsoon flash floods, volcanic eruptions, hurricane landfalls, and winter earthquakes—are accompanied by torrential storm clouds, thick wildfire smoke, or darkness.
- **The Failure of Optical Imagery:** Traditional optical satellites rely on visible sunlight. When disaster strikes, optical images are 100% cloud-obscured and completely unusable for first responders.
- **The SAR Advantage:** Synthetic Aperture Radar (SAR) emits its own microwave pulses (L-band and C-band). It pierces through cloud decks, torrential rain, thick pyrocumulonimbus smoke, and polar night 24/7.
- **The Challenge:** SAR data is historically complex, locked behind specialist software (SNAP, ISCE), and difficult for non-geodesists to interpret quickly.

---

## Slide 3: NASA Radar Data & Products
- **Primary Data Platform: NASA-ISRO NISAR**
  - Dual-frequency L-band (24 cm) and S-band (9 cm) with an expansive 12-meter deployable mesh radar antenna.
  - Systematic 12-day repeat global land and ice coverage.
  - Products: GCOV (Geocoded Calibrated Backscatter), GUNW (Geocoded Unwrapped Interferograms), GSLC.
- **Complementary Operational Platform: NASA/JPL OPERA**
  - **OPERA DSWx-S1:** Dynamic Surface Water extent derived from Sentinel-1 SAR.
  - **OPERA DIST-ALERT-S1:** Surface vegetation and canopy disturbance alerts.
  - **OPERA DISP-S1:** Surface displacement and crustal deformation time series.
- **Distribution Centers & Ingestion:**
  - ASF DAAC (Alaska Satellite Facility) and NASA Earthdata Search via `asf_search` and `earthaccess`.
  - Contextual basemaps powered by NASA GIBS (Global Imagery Browse Services).

---

## Slide 4: The Solution: "Project Liquid" Architecture
- **Instant Understanding in 30 Seconds:**
  - Mobile-first, responsive, dark "radar" UI theme.
  - Zero-barrier: No login, no registration, no API key exposure.
- **The "Dance Floor" Gallery:**
  - 9 curated global hotspot scenes spanning all three core SAR change mechanisms:
    1. **Flood & Wetland Dynamics:** Brahmaputra Monsoon Flood, Valencia Flash Inundation, Pantanal Wetland Desiccation.
    2. **Vegetation Disturbance:** Amazon Fishbone Deforestation, Jasper Wildfire Burn Scar, San Joaquin Agricultural Phenology.
    3. **Ground Deformation:** Turkey Mw 7.8 Fault Rupture, Iceland Magma Dike Intrusion, Antarctic Rutford Ice Stream Flow.
- **Scientific Dual-Mode Viewer:**
  - Interactive Before/After swipe slider + continuous opacity fader.
  - Multi-temporal time slider with auto-play animation.
  - Clickable vector change polygons with exact area ($km^2$), severity, and radar decibel/centimeter metrics.
  - Plain-language *"What am I looking at?"* scientific breakdown and cloud-penetration explainer.

---

## Slide 5: Interactive Visualizations & Feature Highlights
- **1. Guided Story Mode Tours:**
  - Step-by-step camera flight paths guiding users through the scientific progression of each environmental event.
- **2. Side-by-Side Dual Comparison Mode:**
  - Contrast different physical radar mechanisms side by side (e.g., specular water backscatter vs. InSAR crustal deformation).
- **3. Radar Remote Sensing Primer ("How SAR Works"):**
  - Handcrafted SVG illustrations explaining active microwave pulse transmission, surface backscatter reflection physics, log-ratio change detection ($\Delta\text{dB}$), and InSAR phase interference fringes ($\Delta\phi$).
- **4. Instant Open Data Export:**
  - One-click downloads for raw vector `change.geojson` and georeferenced PNG composites, with clean plain-hash shareable URLs (`#scene-id`).

---

## Slide 6: Real-World Impact & Accessibility
- **Disaster Response & Humanitarian Aid:**
  - Emergency flood mapping within hours of cresting, providing civilian responders with flood extents through heavy cloud cover.
- **Forest & Carbon Conservation:**
  - Real-time logging corridor alerts in the Amazon and wildfire burn perimeter tracking in boreal forests.
- **Geohazard Monitoring & Infrastructure Safety:**
  - Sub-centimeter displacement tracking of volcanic inflation domes and tectonic seismic faults, protecting critical utilities and towns.
- **Mobile-First & High Performance:**
  - Pre-processed static asset bundles (< 2 MB per scene) enabling rapid load times on low-bandwidth mobile connections (Lighthouse mobile performance > 90).

---

## Slide 7: Open Source Stack & Attribution
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, MapLibre GL JS, Recharts.
- **Scientific Pipeline:** Python 3, Rasterio, NumPy, SciPy, GeoPandas, Shapely, asf_search, earthaccess, FastAPI.
- **AI Assistance Disclosure:** Generative AI assisted in code scaffolding and technical documentation (disclosed in `/SI_DISCLOSURE.md`). No AI images used.
- **Data Attribution:**
  > *"Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS"*
- **Repository:** `https://github.com/karampb02/satquery`
- **Demo URL:** `<VERCEL_URL>`
