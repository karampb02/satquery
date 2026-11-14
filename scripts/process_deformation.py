"""
Project Liquid — Ground Deformation & InSAR Processing Module
Computes Line-of-Sight (LOS) displacement (cm) and cyclical interferometric fringes
from NASA OPERA DISP-S1 and NISAR GUNW interferograms.
"""

import numpy as np
from typing import Dict, Any, Tuple

def phase_to_los_displacement_cm(phase_rad: np.ndarray, wavelength_cm: float = 24.0) -> np.ndarray:
    """
    Converts unwrapped InSAR interferometric phase to Line-of-Sight (LOS) displacement in centimeters.
    For NISAR L-band, wavelength is ~24.0 cm.
    For Sentinel-1 C-band, wavelength is ~5.55 cm.
    Formula: displacement = - (wavelength / (4 * pi)) * phase
    """
    disp_cm = - (wavelength_cm / (4.0 * np.pi)) * phase_rad
    return disp_cm

def generate_interferometric_fringes(disp_cm: np.ndarray, fringe_cycle_cm: float = 2.8) -> np.ndarray:
    """
    Generates wrapped interferometric fringes from LOS displacement.
    Each complete color cycle represents half a radar wavelength of displacement.
    Returns normalized phase [0, 1] representing wrapped 0 to 2*pi fringes.
    """
    wrapped = np.mod(disp_cm, fringe_cycle_cm) / fringe_cycle_cm
    return wrapped

def analyze_deformation_field(disp_cm: np.ndarray, pixel_area_km2: float = 0.0009) -> Dict[str, Any]:
    """
    Extracts key geodetic deformation metrics:
    - Peak Line-of-Sight uplift (cm)
    - Peak Line-of-Sight subsidence / ground drop (cm)
    - Total deformed area (> 2 cm threshold)
    """
    max_uplift = float(np.nanmax(disp_cm))
    max_subsidence = float(np.nanmin(disp_cm))
    
    deformed_mask = np.abs(disp_cm) >= 2.0
    deformed_area_km2 = float(np.sum(deformed_mask) * pixel_area_km2)

    return {
        "max_uplift_cm": round(max_uplift, 1),
        "max_subsidence_cm": round(max_subsidence, 1),
        "peak_displacement_cm": round(max(abs(max_uplift), abs(max_subsidence)), 1),
        "deformed_area_km2": round(deformed_area_km2, 2)
    }
