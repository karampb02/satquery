from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SceneMetaModel(BaseModel):
    id: str
    title: str
    change_type: str
    change_type_label: str
    location: str
    country: str
    flag: str
    dates: Dict[str, str]
    bbox: List[float]
    center: List[float]
    zoom: float
    source_products: List[str]
    daac: str
    headline: str
    story: str
    why_sar: str

class SceneStatsModel(BaseModel):
    baseline_km2: float
    post_km2: float
    area_changed_km2: float
    pct_change: float
    unit: str
    peak_metric: str
    headline: str
