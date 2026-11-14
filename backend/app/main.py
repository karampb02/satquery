"""
Project Liquid — FastAPI Geospatial Backend
Provides metadata and scientific telemetry endpoints for NASA NISAR and OPERA radar scenes.
"""

import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Project Liquid API",
    description="Telemetry and scene metadata service for NASA NISAR & OPERA radar data.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "public" / "data"

@app.get("/")
@app.get("/api/health")
async def health_check():
    return {
        "status": "Project Liquid SAR Telemetry Service Online",
        "mission": "NASA-ISRO NISAR / NASA OPERA",
        "challenge": "NASA Space Apps Challenge 2026 — Dancing with the SARs",
        "credit": "Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS"
    }

@app.get("/api/scenes")
async def list_scenes():
    catalog_path = DATA_DIR / "catalog.json"
    if not catalog_path.exists():
        raise HTTPException(status_code=404, detail="Scene catalog not found.")
    with open(catalog_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/scenes/{scene_id}")
async def get_scene_meta(scene_id: str):
    meta_path = DATA_DIR / scene_id / "meta.json"
    if not meta_path.exists():
        raise HTTPException(status_code=404, detail=f"Scene '{scene_id}' not found.")
    with open(meta_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/scenes/{scene_id}/stats")
async def get_scene_stats(scene_id: str):
    stats_path = DATA_DIR / scene_id / "stats.json"
    if not stats_path.exists():
        raise HTTPException(status_code=404, detail=f"Stats for scene '{scene_id}' not found.")
    with open(stats_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/sar-explainer")
async def get_sar_explainer():
    return {
        "radar_physics": "Synthetic Aperture Radar (SAR) transmits microwave pulses (L-band / C-band) and measures return backscatter intensity and wave phase.",
        "cloud_penetration": "Unlike optical sensors that depend on reflected sunlight and are blocked by clouds, microwave radar frequencies pass freely through clouds, fog, smoke, and darkness.",
        "change_mechanisms": {
            "flood": "Smooth standing water causes specular reflection away from the radar antenna, creating a distinct backscatter drop below -18 dB.",
            "vegetation": "Intact multi-layered forest canopy creates heavy depolarizing volume scattering; clear-cutting or wildfire destroys the canopy, attenuating HV backscatter.",
            "deformation": "Interferometric SAR (InSAR) measures phase shifts down to millimeters between successive satellite passes, mapping earthquake ruptures and volcanic inflation."
        }
    }
