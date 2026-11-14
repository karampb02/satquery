"""
Project Liquid — Radar Backscatter Processing Module
Implements SAR radiometric calibration to dB, Lee speckle filtering,
and multi-temporal log-ratio change detection.
"""

import numpy as np
from typing import Tuple, Optional

def amplitude_to_db(amplitude: np.ndarray, calibration_factor: float = 83.0) -> np.ndarray:
    """
    Converts raw digital numbers (DN) / linear amplitude to sigma naught (dB).
    Formula: sigma_0_dB = 10 * log10(DN^2 + eps) - calibration_factor
    """
    power = np.square(amplitude.astype(np.float32))
    eps = 1e-7
    db = 10.0 * np.log10(power + eps) - calibration_factor
    # Clip realistic terrestrial radar backscatter range: [-35 dB (calm water) to +5 dB (urban/trihedral)]
    return np.clip(db, -35.0, 5.0)

def lee_speckle_filter(img: np.ndarray, size: int = 5, damping: float = 1.0) -> np.ndarray:
    """
    Enhanced Lee speckle filter for SAR imagery.
    Reduces speckle noise while preserving sharp boundaries and linear features.
    """
    from scipy.ndimage import uniform_filter
    
    mean = uniform_filter(img, (size, size))
    sq_mean = uniform_filter(img ** 2, (size, size))
    variance = np.maximum(sq_mean - mean ** 2, 0.0)
    
    overall_variance = np.var(img)
    weights = variance / (variance + overall_variance / damping + 1e-6)
    filtered = mean + weights * (img - mean)
    return filtered

def compute_log_ratio_change(before_db: np.ndarray, after_db: np.ndarray, threshold_db: float = 3.0) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Calculates change mask based on difference of decibel backscatter (which is log-ratio in linear domain).
    Returns:
      diff_db: change magnitude (dB)
      increase_mask: areas with backscatter increase (e.g. soil moisture, rough surface, regrowth)
      decrease_mask: areas with backscatter drop (e.g. inundation, deforestation, building collapse)
    """
    diff_db = after_db - before_db
    increase_mask = diff_db > threshold_db
    decrease_mask = diff_db < -threshold_db
    return diff_db, increase_mask, decrease_mask
