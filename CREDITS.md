# Credits & Open Source Licenses

**Project Name:** Project Liquid — Interactive NISAR Change Visualization App  
**Challenge:** NASA Space Apps Challenge 2026 — "Dancing with the SARs"  
**Repository:** [https://github.com/karampb02/satquery](https://github.com/karampb02/satquery)  
**Plain Attribution Credit:** *"Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS"*

---

## 1. NASA Data Sources & Portals
Project Liquid is made possible by open data policies from NASA and its international partner ISRO. All radar data, imagery, and basemaps are retrieved from:

| Resource / Product | Description & Portal URL |
| :--- | :--- |
| **NASA-ISRO NISAR Mission** | [https://nisar.jpl.nasa.gov](https://nisar.jpl.nasa.gov) — Global radar mission overview |
| **NISAR on NASA Earthdata** | [https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/nisar](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/nisar) — Platform specifications |
| **NISAR Data Access Overview (ASF)** | [https://nisar-docs.asf.alaska.edu/access-overview](https://nisar-docs.asf.alaska.edu/access-overview) — User guide for GCOV, GUNW, and GSLC |
| **ASF Vertex Search Portal** | [https://search.asf.alaska.edu](https://search.asf.alaska.edu) — Geographic search for radar granules |
| **NASA Earthdata Search** | [https://search.earthdata.nasa.gov](https://search.earthdata.nasa.gov) — Unified catalog for NASA EOSDIS |
| **ASF DAAC** | [https://www.earthdata.nasa.gov/centers/asf-daac](https://www.earthdata.nasa.gov/centers/asf-daac) — NASA Distributed Active Archive Center for SAR |
| **NASA/JPL OPERA Project** | [https://www.jpl.nasa.gov/go/opera](https://www.jpl.nasa.gov/go/opera) — Operational Products for End-Users from Remote Sensing Analysis |
| **NASA GIBS Tile Services** | [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov) — Global Imagery Browse Services basemaps |
| **NASA Worldview** | [https://worldview.earthdata.nasa.gov](https://worldview.earthdata.nasa.gov) — Interactive full-resolution satellite imagery browse |

---

## 2. Python Access & Processing Libraries
The offline data ingestion and scientific radar processing pipelines in `/scripts` rely on these open-source packages:

| Library | License | URL | Purpose |
| :--- | :--- | :--- | :--- |
| **asf_search** | BSD-3-Clause | [https://github.com/asfadmin/Discovery-asf_search](https://github.com/asfadmin/Discovery-asf_search) | Python client for ASF DAAC Vertex API |
| **earthaccess** | MIT | [https://github.com/nsidc/earthaccess](https://github.com/nsidc/earthaccess) | NASA Earthdata Search & cloud data streaming |
| **Rasterio** | BSD-3-Clause | [https://github.com/rasterio/rasterio](https://github.com/rasterio/rasterio) | Geospatial raster I/O via GDAL |
| **GeoPandas** | BSD-3-Clause | [https://github.com/geopandas/geopandas](https://github.com/geopandas/geopandas) | Vector spatial operations and tabular analytics |
| **Shapely** | BSD-3-Clause | [https://github.com/shapely/shapely](https://github.com/shapely/shapely) | Manipulation and analysis of geometric objects |
| **NumPy** | BSD-3-Clause | [https://numpy.org](https://numpy.org) | High-performance multi-dimensional array mathematics |
| **SciPy** | BSD-3-Clause | [https://scipy.org](https://scipy.org) | Multidimensional image processing & Lee speckle filter |
| **FastAPI** | MIT | [https://github.com/fastapi/fastapi](https://github.com/fastapi/fastapi) | Python ASGI web framework for REST telemetry |
| **Uvicorn** | BSD-3-Clause | [https://www.uvicorn.org](https://www.uvicorn.org) | Lightning-fast ASGI server implementation |
| **Earthdata Login** | N/A (Service) | [https://urs.earthdata.nasa.gov](https://urs.earthdata.nasa.gov) | NASA EOSDIS authentication gateway |

---

## 3. Frontend & Visualization Libraries

| Library | License | URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Next.js** | MIT | [https://nextjs.org](https://nextjs.org) | React Production Framework (App Router) |
| **React** | MIT | [https://react.dev](https://react.dev) | UI Component Architecture |
| **MapLibre GL JS** | BSD-3-Clause | [https://maplibre.org](https://maplibre.org) | WebGL-powered interactive mapping engine |
| **Recharts** | MIT | [https://github.com/recharts/recharts](https://github.com/recharts/recharts) | Composable SVG time series charting library |
| **Tailwind CSS** | MIT | [https://tailwindcss.com](https://tailwindcss.com) | Utility-first CSS design system |
| **Lucide Icons** | ISC | [https://lucide.dev](https://lucide.dev) | Modern geometric UI icons |

---

## 4. Typography & System Fonts
Project Liquid employs native system UI font stacks (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `ui-monospace`, `Menlo`, `Consolas`) to maximize rendering speed, eliminate external network font dependencies, and achieve zero layout shifts on mobile devices.
