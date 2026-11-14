# Project Liquid — Backend Services

This directory houses the FastAPI telemetry server and geospatial utilities for Project Liquid.

## Architecture

- `app/main.py`: Core FastAPI service serving scene metadata, statistics, and SAR remote sensing explanations.
- `api/routes.py`: Modular API routing for scene discovery.
- `requirements.txt`: Python package dependencies (FastAPI, Uvicorn, Rasterio, Shapely, etc.).

## Running the Backend Locally

```bash
# Create virtual environment if needed
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn app.main:app --port 8000 --reload
```

## Endpoints

- `GET /api/health`: Health status and NASA data attribution.
- `GET /api/scenes`: List of all curated scenes from `/public/data/catalog.json`.
- `GET /api/scenes/{scene_id}`: Scene metadata and story steps.
- `GET /api/scenes/{scene_id}/stats`: Scene statistics and change delta.
- `GET /api/sar-explainer`: Radar physics and remote sensing reference.
