"""
Project Liquid — Flood & Wetland Change Detection Module
Detects standing water expansion and wetland hydrological change using SAR backscatter drop
and NASA OPERA DSWx-S1 surface water classification.
"""

import numpy as np
from typing import Dict, Any, Tuple, List

def detect_water_extent_sar(sigma0_db: np.ndarray, threshold_db: float = -16.5) -> np.ndarray:
    """
    Identifies open water based on low radar backscatter.
    Smooth open water acts as a specular reflector, scattering microwave energy away from the sensor.
    """
    return (sigma0_db < threshold_db).astype(np.uint8)

def compute_flood_inundation(
    before_db: np.ndarray,
    after_db: np.ndarray,
    pixel_area_km2: float = 0.0009  # ~30m resolution pixel = 0.0009 km2
) -> Dict[str, Any]:
    """
    Computes flood progression:
    - baseline water
    - post flood water
    - new inundation (flood extent)
    - receded water
    """
    water_before = detect_water_extent_sar(before_db)
    water_after = detect_water_extent_sar(after_db)
    
    new_inundation = np.logical_and(water_after == 1, water_before == 0).astype(np.uint8)
    receded_water = np.logical_and(water_after == 0, water_before == 1).astype(np.uint8)
    stable_water = np.logical_and(water_after == 1, water_before == 1).astype(np.uint8)

    base_km2 = float(np.sum(water_before) * pixel_area_km2)
    post_km2 = float(np.sum(water_after) * pixel_area_km2)
    new_km2 = float(np.sum(new_inundation) * pixel_area_km2)
    receded_km2 = float(np.sum(receded_water) * pixel_area_km2)
    net_km2 = float(post_km2 - base_km2)
    pct_change = float((net_km2 / base_km2 * 100.0) if base_km2 > 0 else 100.0)

    return {
        "water_before_mask": water_before,
        "water_after_mask": water_after,
        "new_inundation_mask": new_inundation,
        "base_km2": round(base_km2, 2),
        "post_km2": round(post_km2, 2),
        "new_inundation_km2": round(new_km2, 2),
        "receded_km2": round(receded_km2, 2),
        "net_km2": round(net_km2, 2),
        "pct_change": round(pct_change, 2)
    }
