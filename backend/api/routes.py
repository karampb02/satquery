"""
Project Liquid — API Router
Exposes REST endpoints for NASA NISAR and OPERA radar telemetry and scenes.
"""

from fastapi import APIRouter, HTTPException
import json
from pathlib import Path

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "public" / "data"

@router.get("/scenes")
async def list_scenes():
    catalog_path = DATA_DIR / "catalog.json"
    if not catalog_path.exists():
        raise HTTPException(status_code=404, detail="Scene catalog not found.")
    with open(catalog_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/scenes/{scene_id}")
async def get_scene_meta(scene_id: str):
    meta_path = DATA_DIR / scene_id / "meta.json"
    if not meta_path.exists():
        raise HTTPException(status_code=404, detail=f"Scene '{scene_id}' not found.")
    with open(meta_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/scenes/{scene_id}/stats")
async def get_scene_stats(scene_id: str):
    stats_path = DATA_DIR / scene_id / "stats.json"
    if not stats_path.exists():
        raise HTTPException(status_code=404, detail=f"Stats for scene '{scene_id}' not found.")
    with open(stats_path, "r", encoding="utf-8") as f:
        return json.load(f)
