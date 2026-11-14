"""
Project Liquid — Vegetation Disturbance Processing Module
Detects canopy loss, wildfire burn scars, and deforestation using L-band HV cross-polarized
backscatter attenuation and NASA OPERA DIST-ALERT / DIST-S1 disturbance data.
"""

import numpy as np
from typing import Dict, Any, Tuple

def detect_canopy_loss_hv(before_hv_db: np.ndarray, after_hv_db: np.ndarray, drop_threshold_db: float = -3.5) -> np.ndarray:
    """
    Forest canopies cause heavy volumetric depolarizing scattering, producing strong HV backscatter (-12 to -14 dB).
    When canopy trees are cleared or burned, HV backscatter drops sharply (-18 to -24 dB).
    """
    hv_diff = after_hv_db - before_hv_db
    canopy_loss_mask = hv_diff <= drop_threshold_db
    return canopy_loss_mask.astype(np.uint8)

def analyze_vegetation_disturbance(
    before_hv_db: np.ndarray,
    after_hv_db: np.ndarray,
    disturbance_type: str = "deforestation",
    pixel_area_km2: float = 0.0009
) -> Dict[str, Any]:
    """
    Analyzes forest disturbance and calculates affected land surface area.
    """
    loss_mask = detect_canopy_loss_hv(before_hv_db, after_hv_db)
    
    total_forest_baseline = np.sum(before_hv_db > -15.0)
    disturbed_pixels = np.sum(loss_mask)

    disturbed_area_km2 = float(disturbed_pixels * pixel_area_km2)
    baseline_forest_km2 = float(total_forest_baseline * pixel_area_km2)
    pct_disturbed = float((disturbed_area_km2 / baseline_forest_km2 * 100.0) if baseline_forest_km2 > 0 else 0.0)

    return {
        "disturbance_mask": loss_mask,
        "disturbed_area_km2": round(disturbed_area_km2, 2),
        "baseline_forest_km2": round(baseline_forest_km2, 2),
        "pct_loss": round(pct_disturbed, 2),
        "disturbance_type": disturbance_type
    }
