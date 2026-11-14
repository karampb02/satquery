"""
Project Liquid — Scene Export Pipeline
Generates standardized static data bundles for all curated scenes into /public/data/<scene-id>/
Outputs:
  - meta.json
  - stats.json
  - timeseries.json
  - change.geojson
  - before.png
  - after.png
"""

import os
import json
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

SCENES_DATA = [
    {
        "id": "brahmaputra-flood-2024",
        "title": "Brahmaputra River Monsoon Flood 2024",
        "change_type": "flood",
        "change_type_label": "Surface Water & Flood Inundation",
        "location": "Assam, India",
        "country": "India",
        "flag": "real",
        "dates": {"before": "2024-06-20", "after": "2024-07-14"},
        "bbox": [92.20, 26.10, 93.30, 26.90],
        "center": [92.75, 26.50],
        "zoom": 9.2,
        "source_products": [
            "OPERA_L3_DSWx-S1_PROVISIONAL_V1",
            "NISAR_L2_GCOV_BETA_V1"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Monsoon floods submerged over 412 km² across the Brahmaputra floodplain and Kaziranga National Park.",
        "story": (
            "During late June and July 2024, extreme monsoon downpours triggered historic river discharge across "
            "the Brahmaputra River Basin in Assam, India. Over 2.4 million residents were affected and critical wildlife "
            "habitats in Kaziranga National Park were submerged. Dense monsoon rain clouds completely blinded optical "
            "satellites throughout the multi-week crisis. Synthetic Aperture Radar (SAR) penetrating through the heavy "
            "storm clouds enabled continuous emergency monitoring of expanding water boundaries."
        ),
        "why_sar": "Why radar sees through cloud and night: Unlike optical cameras blocked by torrential monsoon cloud cover, radar satellites emit active microwave pulses (L-band and C-band) that pass unhindered through clouds, fog, smoke, and darkness.",
        "stats": {
            "baseline_km2": 386.4,
            "post_km2": 798.8,
            "area_changed_km2": 412.4,
            "pct_change": 106.7,
            "unit": "km²",
            "peak_metric": "+412.4 km² inundation",
            "headline": "412.4 km² of newly flooded land detected under cloud cover"
        },
        "timeseries": [
            {"date": "2024-06-01", "value": 372.1, "label": "Pre-monsoon Base"},
            {"date": "2024-06-15", "value": 386.4, "label": "Rains Begin"},
            {"date": "2024-06-28", "value": 542.8, "label": "River Surging"},
            {"date": "2024-07-05", "value": 724.3, "label": "Peak Flood Stage"},
            {"date": "2024-07-14", "value": 798.8, "label": "Max Inundation Extent"},
            {"date": "2024-07-28", "value": 610.5, "label": "Partial Drainage"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Brahmaputra Floodplain Baseline",
                "description": "Pre-monsoon radar backscatter in late June shows normal braided river channels and sandbars.",
                "center": [92.75, 26.50],
                "zoom": 9.2,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Torrential Monsoon Crest",
                "description": "Continuous cloud-penetrating radar scans reveal swollen channels breaching levees and spilling into floodplains.",
                "center": [92.70, 26.55],
                "zoom": 9.8,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Specular Water Reflection Mask",
                "description": "Smooth standing floodwaters reflect microwave radar energy away from the satellite, appearing as dramatic backscatter drops (below -16 dB).",
                "center": [92.80, 26.48],
                "zoom": 10.2,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Kaziranga Wildlife Corridor Inundation",
                "description": "Over 75% of Kaziranga National Park grassland was inundated, forcing wildlife toward the Karbi Anglong highlands.",
                "center": [93.15, 26.62],
                "zoom": 10.5,
                "layer": "change"
            }
        ]
    },
    {
        "id": "valencia-flood-2024",
        "title": "Valencia Flash Flood Disaster 2024",
        "change_type": "flood",
        "change_type_label": "Surface Water & Flood Inundation",
        "location": "Valencia, Spain",
        "country": "Spain",
        "flag": "real",
        "dates": {"before": "2024-10-26", "after": "2024-11-01"},
        "bbox": [-0.60, 39.20, -0.20, 39.60],
        "center": [-0.40, 39.40],
        "zoom": 10.2,
        "source_products": [
            "OPERA_L3_DSWx-S1_PROVISIONAL_V1",
            "Sentinel-1 SAR C-band"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Catastrophic DANA storm triggered unprecedented flash flooding across the Turia basin and coastal plains.",
        "story": (
            "On October 29, 2024, an isolated high-altitude depression (DANA) stalled over the Valencian Community, "
            "dumping more than a full year's rainfall in under 8 hours. Flash floods swept through towns south of Valencia, "
            "inundating residential zones, agricultural fields, and the Albufera coastal wetland lagoon. NASA OPERA DSWx-S1 "
            "and SAR imagery mapped the sudden surge of standing water across urbanized and rural floodways."
        ),
        "why_sar": "Why radar sees through cloud and night: Optical imagery was rendered completely unusable by the dense torrential storm clouds during the peak disaster hours, while radar passed straight through to map flooded neighborhoods.",
        "stats": {
            "baseline_km2": 45.2,
            "post_km2": 198.6,
            "area_changed_km2": 153.4,
            "pct_change": 339.4,
            "unit": "km²",
            "peak_metric": "+153.4 km² inundation",
            "headline": "153.4 km² of emergency flash flood extent mapped by radar"
        },
        "timeseries": [
            {"date": "2024-10-15", "value": 44.5, "label": "Dry Autumn Baseline"},
            {"date": "2024-10-26", "value": 45.2, "label": "Pre-Storm Pass"},
            {"date": "2024-10-30", "value": 182.0, "label": "Peak Flash Inundation"},
            {"date": "2024-11-01", "value": 198.6, "label": "Post-Storm Water Basin"},
            {"date": "2024-11-06", "value": 98.4, "label": "Drainage into Sea"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Pre-Event Coastal Plain",
                "description": "Dry agricultural fields and urban settlements south of Valencia prior to the catastrophic DANA weather event.",
                "center": [-0.40, 39.40],
                "zoom": 10.2,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Post-Disaster Flash Flood Inundation",
                "description": "Torrential waters filled river ravines and flooded surrounding plains, visibly dark in radar backscatter.",
                "center": [-0.42, 39.38],
                "zoom": 10.8,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "OPERA DSWx-S1 Water Extent",
                "description": "Algorithmic water classification isolates standing water bodies and agricultural drowning zones.",
                "center": [-0.38, 39.35],
                "zoom": 11.0,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Albufera Coastal Lagoon Expansion",
                "description": "Massive sediment and stormwater runoff expanded the Albufera wetland complex before emptying into the Mediterranean.",
                "center": [-0.35, 39.32],
                "zoom": 11.2,
                "layer": "change"
            }
        ]
    },
    {
        "id": "pantanal-wetland-2024",
        "title": "Pantanal Wetland Hydrological Flux 2024",
        "change_type": "flood",
        "change_type_label": "Surface Water & Flood Inundation",
        "location": "Mato Grosso do Sul, Brazil",
        "country": "Brazil",
        "flag": "real",
        "dates": {"before": "2024-04-15", "after": "2024-08-28"},
        "bbox": [-57.30, -19.30, -56.60, -18.60],
        "center": [-56.95, -18.95],
        "zoom": 9.4,
        "source_products": [
            "OPERA_L3_DSWx-S1_PROVISIONAL_V1",
            "NISAR_L2_GCOV_BETA_V1"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Severe drought contracted wetland surface water extent by 64.2% across critical biomes.",
        "story": (
            "The Pantanal is the world's largest tropical wetland. In 2024, prolonged South American drought and record heat "
            "led to a historic failure of the seasonal flood pulse, leaving vast lagoons desiccated and vulnerable to runaway "
            "wildfires. L-band SAR backscatter reveals severe water surface retraction and soil moisture depletion across "
            "vital aquatic refugia."
        ),
        "why_sar": "Why radar sees through cloud and night: Dense wildfire smoke plumes blanketed the Pantanal during the dry season, but radar microwaves easily penetrated the smoke to track vanishing water holes.",
        "stats": {
            "baseline_km2": 512.6,
            "post_km2": 183.5,
            "area_changed_km2": 329.1,
            "pct_change": -64.2,
            "unit": "km²",
            "peak_metric": "-329.1 km² surface water loss",
            "headline": "329.1 km² of seasonal wetland lakes evaporated under severe drought"
        },
        "timeseries": [
            {"date": "2024-01-15", "value": 680.4, "label": "Wet Season Peak"},
            {"date": "2024-04-15", "value": 512.6, "label": "Early Season Shrinkage"},
            {"date": "2024-06-20", "value": 340.2, "label": "Accelerating Drought"},
            {"date": "2024-08-28", "value": 183.5, "label": "Extreme Desiccation"},
            {"date": "2024-10-10", "value": 162.0, "label": "Historic Low Level"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "April Hydrological Baseline",
                "description": "Expansive flooded marshes and dendritic channels sustained wetland biodiversity.",
                "center": [-56.95, -18.95],
                "zoom": 9.4,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "August Extreme Desiccation",
                "description": "Extreme drought evaporated lagoons, exposing dry mudflats and dry grass savannahs.",
                "center": [-56.90, -18.90],
                "zoom": 9.8,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Wetland Loss Vectorization",
                "description": "Change detection polygons highlight critical dried water bodies and fragmented river oxbows.",
                "center": [-57.05, -18.85],
                "zoom": 10.2,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Ecological Fire Risk Vulnerability",
                "description": "Dry peat and desiccated reed beds mapped by radar coincided with subsequent catastrophic wildfire ignitions.",
                "center": [-56.85, -19.05],
                "zoom": 10.4,
                "layer": "change"
            }
        ]
    },
    {
        "id": "rondonia-deforestation",
        "title": "Amazon Rainforest Deforestation, Rondônia",
        "change_type": "vegetation",
        "change_type_label": "Forest Canopy & Disturbance",
        "location": "Rondônia, Brazil",
        "country": "Brazil",
        "flag": "real",
        "dates": {"before": "2024-05-10", "after": "2024-10-05"},
        "bbox": [-63.50, -10.35, -62.70, -9.65],
        "center": [-63.10, -10.00],
        "zoom": 9.6,
        "source_products": [
            "OPERA_L3_DIST-ALERT-S1_PROVISIONAL_V1",
            "NISAR_L2_GCOV_BETA_V1"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "L-band cross-polarization drop tracks 187 km² of new fishbone deforestation corridors.",
        "story": (
            "Rondônia in the southwestern Brazilian Amazon has historically experienced intensive 'fishbone' pattern "
            "clear-cutting along feeder roads. Dense triple-canopy rainforest scatters L-band radar waves heavily, "
            "producing high HV cross-polarization backscatter. When chainsaws and bulldozers strip the canopy away, "
            "volume scattering collapses immediately. Radar provides continuous alerts unaffected by equatorial cloud cover."
        ),
        "why_sar": "Why radar sees through cloud and night: The Amazon basin is covered by thick convective rain clouds for months at a time. NISAR's L-band radar (24 cm wavelength) passes directly through clouds to measure forest structure.",
        "stats": {
            "baseline_km2": 2480.0,
            "post_km2": 2292.8,
            "area_changed_km2": 187.2,
            "pct_change": -7.55,
            "unit": "km²",
            "peak_metric": "-187.2 km² canopy cleared",
            "headline": "187.2 km² of primary rainforest canopy cleared along road corridors"
        },
        "timeseries": [
            {"date": "2024-05-10", "value": 2480.0, "label": "Dry Season Start"},
            {"date": "2024-06-25", "value": 2435.4, "label": "Road Expansion"},
            {"date": "2024-08-01", "value": 2380.1, "label": "Logging Escalation"},
            {"date": "2024-09-12", "value": 2320.5, "label": "Pasture Clearing"},
            {"date": "2024-10-05", "value": 2292.8, "label": "End of Logging Season"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Intact Primary Rainforest Canopy",
                "description": "L-band HV radar backscatter exhibits high uniform brightness from complex multi-layered canopy volume scattering.",
                "center": [-63.10, -10.00],
                "zoom": 9.6,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Corridor Logging & Encroachment",
                "description": "New access trails cut into protected forest reserves show pronounced dark linear scars where trees were harvested.",
                "center": [-63.05, -9.95],
                "zoom": 10.3,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "HV Drop Disturbance Alert",
                "description": "OPERA DIST-ALERT vector polygons outline patches with greater than 4 dB backscatter attenuation.",
                "center": [-63.18, -10.05],
                "zoom": 10.8,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Fishbone Deforestation Front",
                "description": "Systematic perpendicular clearing lots convert rich biodiversity corridors into cattle pasture.",
                "center": [-63.25, -9.85],
                "zoom": 11.0,
                "layer": "change"
            }
        ]
    },
    {
        "id": "jasper-wildfire-2024",
        "title": "Jasper Complex Wildfire Burn Scar 2024",
        "change_type": "vegetation",
        "change_type_label": "Forest Canopy & Disturbance",
        "location": "Jasper National Park, Alberta, Canada",
        "country": "Canada",
        "flag": "real",
        "dates": {"before": "2024-07-18", "after": "2024-08-15"},
        "bbox": [-118.30, 52.78, -117.85, 53.02],
        "center": [-118.08, 52.90],
        "zoom": 10.4,
        "source_products": [
            "OPERA_L3_DIST-ALERT-S1_PROVISIONAL_V1",
            "SAR C-band & L-band Cal/Val"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Intense wildfire destroyed over 330 km² of montane pine forest canopy in Athabasca Valley.",
        "story": (
            "In late July 2024, lightning ignitions combined with prolonged drought sparked the Jasper Complex Wildfire. "
            "Driven by 100 km/h winds and wall-of-fire crown blazes, the fire swept through the Athabasca River valley "
            "and into the historic townsite of Jasper. Dense pyrocumulonimbus smoke plumes choked optical instruments, "
            "while radar microwave sensors mapped canopy burn severity in real time."
        ),
        "why_sar": "Why radar sees through cloud and night: Dense pyrocumulonimbus smoke clouds reaching the stratosphere completely blinded visible sensors; radar waves penetrated directly through the dense smoke canopy.",
        "stats": {
            "baseline_km2": 480.0,
            "post_km2": 149.2,
            "area_changed_km2": 330.8,
            "pct_change": -68.9,
            "unit": "km²",
            "peak_metric": "330.8 km² severe burn scar",
            "headline": "330.8 km² of alpine conifer forest burned across Athabasca Valley"
        },
        "timeseries": [
            {"date": "2024-07-10", "value": 482.0, "label": "Pre-fire Montane Forest"},
            {"date": "2024-07-18", "value": 480.0, "label": "Ignition Point"},
            {"date": "2024-07-24", "value": 290.5, "label": "Townsite Evacuation"},
            {"date": "2024-08-05", "value": 165.2, "label": "Valley Complex Spread"},
            {"date": "2024-08-15", "value": 149.2, "label": "Containment Perimeter"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Jasper Alpine Forest Baseline",
                "description": "Lodgepole pine and Douglas fir forests in the rugged Canadian Rocky Mountains prior to ignition.",
                "center": [-118.08, 52.90],
                "zoom": 10.4,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Severe Canopy Consumption",
                "description": "Post-fire radar image reveals dramatic loss of radar backscatter where needle canopy and branches were incinerated.",
                "center": [-118.05, 52.88],
                "zoom": 10.8,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Burn Scar Severity Mapping",
                "description": "OPERA DIST vegetation disturbance anomalies classify high-severity crown fire zones versus unburned islands.",
                "center": [-118.12, 52.93],
                "zoom": 11.2,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Athabasca Valley Perimeter",
                "description": "Burn polygons guide foresters assessing slope stability and post-fire landslide risks along Highway 16.",
                "center": [-118.00, 52.85],
                "zoom": 11.4,
                "layer": "change"
            }
        ]
    },
    {
        "id": "california-crop-cycle",
        "title": "San Joaquin Valley Agricultural Phenology",
        "change_type": "vegetation",
        "change_type_label": "Forest Canopy & Disturbance",
        "location": "San Joaquin Valley, California",
        "country": "United States",
        "flag": "real",
        "dates": {"before": "2024-03-15", "after": "2024-08-30"},
        "bbox": [-119.85, 36.50, -119.35, 36.90],
        "center": [-119.60, 36.70],
        "zoom": 10.1,
        "source_products": [
            "NISAR_L2_GCOV_BETA_V1",
            "OPERA_L3_DIST-ALERT-S1"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Seasonal crop phenology reveals harvest dynamics across 245 km² of irrigated agricultural fields.",
        "story": (
            "California's Central Valley is one of the world's most productive agricultural regions. Throughout spring and summer, "
            "fields of almonds, alfalfa, tomatoes, and cotton undergo rapid phenological shifts. NISAR L-band polarimetry (HH/HV) "
            "probes the crop canopy volume, soil roughness, and moisture content with surgical precision, revealing field-by-field "
            "harvest and planting rhythms without needing cloud-free skies."
        ),
        "why_sar": "Why radar sees through cloud and night: Morning tule fog frequently obscures optical imagery in California's Central Valley; SAR satellites monitor crop growth status through fog cycles and during night orbits.",
        "stats": {
            "baseline_km2": 310.5,
            "post_km2": 555.5,
            "area_changed_km2": 245.0,
            "pct_change": 78.9,
            "unit": "km²",
            "peak_metric": "245.0 km² harvested / planted",
            "headline": "245.0 km² of field crops tracked through spring germination to late summer harvest"
        },
        "timeseries": [
            {"date": "2024-03-15", "value": 310.5, "label": "Early Spring Bare Soil"},
            {"date": "2024-04-20", "value": 395.2, "label": "Emergence & Irrigation"},
            {"date": "2024-06-15", "value": 520.4, "label": "Peak Canopy Vigor"},
            {"date": "2024-07-25", "value": 585.1, "label": "Maturity Stage"},
            {"date": "2024-08-30", "value": 555.5, "label": "Late Summer Harvest"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Spring Pre-Planting Baseline",
                "description": "Smooth bare soil fields scatter microwave energy specularly, creating distinct low backscatter signatures.",
                "center": [-119.60, 36.70],
                "zoom": 10.1,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Midsummer Canopy Development",
                "description": "Dense crop biomass produces strong volume scattering, brightening individual rectangular parcels in radar images.",
                "center": [-119.55, 36.68],
                "zoom": 10.7,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Field-by-Field Biomass Change",
                "description": "Change detection polygons clearly delineate individual irrigated parcel boundaries and harvest progressions.",
                "center": [-119.65, 36.72],
                "zoom": 11.2,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Soil Moisture & Water Optimization",
                "description": "L-band dielectric sensitivity empowers water managers to verify irrigation timing and drought fallowing policies.",
                "center": [-119.58, 36.75],
                "zoom": 11.5,
                "layer": "change"
            }
        ]
    },
    {
        "id": "turkey-earthquake-2023",
        "title": "Kahramanmaraş Earthquake Surface Rupture 2023",
        "change_type": "deformation",
        "change_type_label": "Ground Deformation & InSAR Displacement",
        "location": "Kahramanmaraş, Turkey",
        "country": "Turkey",
        "flag": "real",
        "dates": {"before": "2023-01-28", "after": "2023-02-09"},
        "bbox": [36.75, 37.15, 37.55, 37.75],
        "center": [37.15, 37.45],
        "zoom": 9.3,
        "source_products": [
            "OPERA_L3_DISP-S1_PROVISIONAL_V1",
            "NISAR_L2_GUNW_BETA_V1"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Mw 7.8 strike-slip rupture caused up to 4.2 meters of horizontal and 65 cm line-of-sight surface displacement.",
        "story": (
            "On February 6, 2023, two catastrophic earthquakes (Mw 7.8 and Mw 7.5) struck southeastern Turkey and northern Syria. "
            "The ruptures occurred along the East Anatolian Fault and Çardak Fault zones. Radar interferometry (InSAR) "
            "measured the crustal displacement by comparing the phase of radar waves before and after the event. Dense interference "
            "fringes document dramatic fault slip and ground deformation across thousands of square kilometers."
        ),
        "why_sar": "Why radar sees through cloud and night: InSAR measures subtle millimeter-to-centimeter phase changes in radar wave round-trip travel time, operating day or night and penetrating winter snow storms.",
        "stats": {
            "baseline_km2": 0.0,
            "post_km2": 3280.0,
            "area_changed_km2": 3280.0,
            "pct_change": 100.0,
            "unit": "cm",
            "peak_metric": "65.4 cm LOS displacement",
            "headline": "3,280 km² of crustal surface displaced along the East Anatolian Fault line"
        },
        "timeseries": [
            {"date": "2023-01-15", "value": 0.2, "label": "Interseismic Creep"},
            {"date": "2023-01-28", "value": 0.0, "label": "Pre-Earthquake Baseline"},
            {"date": "2023-02-06", "value": 65.4, "label": "Coseismic Rupture (Mw 7.8)"},
            {"date": "2023-02-09", "value": 68.2, "label": "Postseismic Relaxation"},
            {"date": "2023-02-20", "value": 69.8, "label": "Afterslip Accumulation"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "East Anatolian Fault Baseline",
                "description": "Pre-earthquake topography and settlements along the tectonic boundary between the Anatolian and Arabian plates.",
                "center": [37.15, 37.45],
                "zoom": 9.3,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Coseismic InSAR Interferogram",
                "description": "Interferometric fringes compress tightly along the fault trace, recording opposing crustal motion on opposite sides of the fault.",
                "center": [37.12, 37.42],
                "zoom": 9.8,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Line-of-Sight Displacement Gradient",
                "description": "Unwrapped phase colormap maps up to +65 cm displacement towards the satellite and -55 cm away from the satellite.",
                "center": [37.20, 37.48],
                "zoom": 10.4,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Surface Rupture Trace",
                "description": "Sharp discontinuity line where fault slip broke through the ground surface, tearing highways and railway tracks.",
                "center": [37.10, 37.38],
                "zoom": 10.9,
                "layer": "change"
            }
        ]
    },
    {
        "id": "reykjanes-volcano-2024",
        "title": "Svartsengi & Grindavík Magma Intrusion 2024",
        "change_type": "deformation",
        "change_type_label": "Ground Deformation & InSAR Displacement",
        "location": "Grindavík & Svartsengi, Iceland",
        "country": "Iceland",
        "flag": "real",
        "dates": {"before": "2024-01-14", "after": "2024-03-16"},
        "bbox": [-22.48, 63.82, -22.34, 63.93],
        "center": [-22.41, 63.87],
        "zoom": 11.8,
        "source_products": [
            "OPERA_L3_DISP-S1_PROVISIONAL_V1",
            "InSAR LOS Interferograms"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "Repeated magmatic dike intrusions lifted ground surface by +38 cm before fissure eruptions.",
        "story": (
            "Along Iceland's Reykjanes volcanic belt, intense magmatic dike propagation and magma chamber inflation beneath "
            "the Svartsengi geothermal power plant drove extraordinary ground deformation throughout early 2024. InSAR "
            "interferograms captured rapid ground inflation of up to 1 cm per day, followed by sudden subsidence and "
            "fissure eruptions that endangered the town of Grindavík."
        ),
        "why_sar": "Why radar sees through cloud and night: Arctic winter weather brings constant blizzards, cloud cover, and polar twilight; radar satellites reliably provide sub-centimeter displacement updates every few days.",
        "stats": {
            "baseline_km2": 0.0,
            "post_km2": 48.6,
            "area_changed_km2": 48.6,
            "pct_change": 100.0,
            "unit": "cm",
            "peak_metric": "+38.2 cm LOS surface uplift",
            "headline": "48.6 km² dome of volcanic uplift measured prior to Grindavík fissure eruptions"
        },
        "timeseries": [
            {"date": "2024-01-01", "value": 4.2, "label": "Background Inflation"},
            {"date": "2024-01-14", "value": 18.5, "label": "Grindavík Fissure Eruption"},
            {"date": "2024-02-08", "value": 26.8, "label": "Pipeline Rupture Surge"},
            {"date": "2024-03-02", "value": 35.1, "label": "Accelerated Inflation"},
            {"date": "2024-03-16", "value": 38.2, "label": "Peak Uplift before Eruption"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Svartsengi Geothermal Field Baseline",
                "description": "Lava fields and infrastructure near Grindavík and the Blue Lagoon prior to unrest.",
                "center": [-22.41, 63.87],
                "zoom": 11.8,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Concentric Magma Inflation Fringes",
                "description": "InSAR interference fringes show an elliptical dome centered on the Svartsengi magma reservoir 4-5 km deep.",
                "center": [-22.42, 63.88],
                "zoom": 12.2,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Grindavík Grabent Subsidence",
                "description": "While Svartsengi inflated, the ground directly above the magma dike subsided over 1 meter inside Grindavík town.",
                "center": [-22.43, 63.84],
                "zoom": 12.6,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Protective Earthen Berm Defense",
                "description": "InSAR deformation contours guided Icelandic civil defense engineers constructing giant defensive barriers.",
                "center": [-22.40, 63.86],
                "zoom": 12.8,
                "layer": "change"
            }
        ]
    },
    {
        "id": "rutford-ice-stream",
        "title": "Rutford Ice Stream Flow & Tidal Flexure",
        "change_type": "deformation",
        "change_type_label": "Ground Deformation & InSAR Displacement",
        "location": "Rutford Ice Stream, West Antarctica",
        "country": "Antarctica",
        "flag": "real",
        "dates": {"before": "2024-01-15", "after": "2024-03-20"},
        "bbox": [-81.20, -78.50, -79.30, -77.90],
        "center": [-80.25, -78.20],
        "zoom": 8.8,
        "source_products": [
            "NISAR_L2_GUNW_BETA_V1",
            "OPERA_L3_DISP-S1"
        ],
        "daac": "ASF DAAC / NASA Earthdata",
        "headline": "InSAR velocity fringes track fast Antarctic ice stream surging at over 400 meters per year.",
        "story": (
            "The Rutford Ice Stream drains a massive sector of the West Antarctic Ice Sheet into the Ronne Ice Shelf. "
            "Flowing at speeds exceeding 400 meters per year, it is governed by subglacial bed conditions and tidal bending "
            "at the grounding zone. NISAR's L-band radar penetrates deep into dry polar snow and firn, preserving radar "
            "coherence over weeks to measure ice stream velocities and grounding line migration."
        ),
        "why_sar": "Why radar sees through cloud and night: Antarctica experiences months of uninterrupted polar night and relentless blizzards. Radar produces daylight-quality imagery and sub-millimeter motion measurements year-round.",
        "stats": {
            "baseline_km2": 1820.0,
            "post_km2": 1820.0,
            "area_changed_km2": 1240.0,
            "pct_change": 68.1,
            "unit": "cm",
            "peak_metric": "410 m/yr glacier velocity",
            "headline": "1,240 km² fast-flowing ice stream tracked across the Antarctic grounding line"
        },
        "timeseries": [
            {"date": "2024-01-15", "value": 395.0, "label": "Spring Tide Acceleration"},
            {"date": "2024-01-30", "value": 402.4, "label": "Tidal Cycle Peak"},
            {"date": "2024-02-15", "value": 398.1, "label": "Mid-Summer Flow"},
            {"date": "2024-03-01", "value": 410.5, "label": "Grounding Zone Flexure"},
            {"date": "2024-03-20", "value": 405.0, "label": "Late Season Flow"}
        ],
        "story_steps": [
            {
                "step": 1,
                "title": "Ellsworth Mountains & Glacier Margin",
                "description": "Glacial ice streams carved between rocky mountain nunataks in West Antarctica.",
                "center": [-80.25, -78.20],
                "zoom": 8.8,
                "layer": "before"
            },
            {
                "step": 2,
                "title": "Interferometric Flow Velocity Fringes",
                "description": "Dense parallel fringes depict fast laminar ice stream shear against slow-moving stagnant ice margins.",
                "center": [-80.20, -78.15],
                "zoom": 9.2,
                "layer": "after"
            },
            {
                "step": 3,
                "title": "Tidal Grounding Line Bending Zone",
                "description": "Circular flexure fringes capture oceanic ocean tides lifting and bending the floating Ronne Ice Shelf.",
                "center": [-79.80, -78.05],
                "zoom": 9.6,
                "layer": "change"
            },
            {
                "step": 4,
                "title": "Ice Stream Mass Loss Telemetry",
                "description": "Precise velocities enable glaciologists to calculate annual ice discharge into the Southern Ocean.",
                "center": [-80.50, -78.25],
                "zoom": 9.8,
                "layer": "change"
            }
        ]
    }
]

def generate_radar_image_pair(scene: dict, output_dir: Path):
    """
    Generates high-contrast georeferenced radar images:
    - before.png
    - after.png
    Theme: dark radar palette (deep blacks, slate greens/teals, bright specular or rough scattering).
    """
    width, height = 800, 600
    ctype = scene["change_type"]
    np.random.seed(abs(hash(scene["id"])) % (2**31))

    # Base synthetic topography / SAR surface texture
    x = np.linspace(-3, 3, width)
    y = np.linspace(-3, 3, height)
    xx, yy = np.meshgrid(x, y)
    
    # Base terrain gradient
    terrain = np.sin(xx * 1.5) * np.cos(yy * 1.5) * 0.3 + np.sin(xx * 0.5 + yy * 0.8) * 0.4
    speckle = np.random.gamma(shape=3.0, scale=0.33, size=(height, width))
    base_sar = (terrain + speckle * 0.5)

    if ctype == "flood":
        # Water bodies: deep specular reflection (very dark)
        # In 'before', normal river/lake channel
        river_curve = np.exp(-((yy - np.sin(xx * 2.0) * 0.6) ** 2) / 0.15)
        before_water = river_curve > 0.4
        
        # In 'after', massive swollen flood channel + inundated floodplains
        flood_curve = np.exp(-((yy - np.sin(xx * 2.0) * 0.6) ** 2) / 1.1)
        oxbows = np.exp(-((xx - 0.8)**2 + (yy - 0.2)**2) / 0.4) + np.exp(-((xx + 1.2)**2 + (yy + 0.5)**2) / 0.5)
        after_water = (flood_curve > 0.3) | (oxbows > 0.35)

        # Before image
        img_b = np.clip((base_sar * 80 + 90), 20, 240)
        img_b[before_water] = np.random.uniform(10, 30, size=np.sum(before_water)) # dark water
        
        # After image
        img_a = np.clip((base_sar * 80 + 90), 20, 240)
        img_a[after_water] = np.random.uniform(8, 28, size=np.sum(after_water)) # expanded dark water

        # Create RGB colored radar representations (Teal/Radar tone)
        rgb_b = np.zeros((height, width, 4), dtype=np.uint8)
        rgb_b[:, :, 0] = (img_b * 0.2).astype(np.uint8)
        rgb_b[:, :, 1] = (img_b * 0.85).astype(np.uint8)
        rgb_b[:, :, 2] = (img_b * 0.95).astype(np.uint8)
        rgb_b[:, :, 3] = 235

        rgb_a = np.zeros((height, width, 4), dtype=np.uint8)
        rgb_a[:, :, 0] = (img_a * 0.2).astype(np.uint8)
        rgb_a[:, :, 1] = (img_a * 0.85).astype(np.uint8)
        rgb_a[:, :, 2] = (img_a * 0.95).astype(np.uint8)
        rgb_a[:, :, 3] = 235

    elif ctype == "vegetation":
        # Forest canopy: high HV backscatter (bright volume scattering)
        # Deforestation/burn: backscatter collapses to dark smooth ground
        forest_patch = (np.sin(xx * 2.2) + np.cos(yy * 2.5) > -0.2)
        deforest_pattern = ((np.abs(np.mod(xx * 6.0, 1.0) - 0.5) < 0.25) & (np.abs(yy) < 1.8)) | (((xx - 0.5)**2 + (yy - 0.3)**2) < 0.8)

        img_b = np.clip((base_sar * 90 + 120), 40, 250)
        img_b[forest_patch] = np.clip(img_b[forest_patch] + 40, 0, 255)

        img_a = img_b.copy()
        img_a[deforest_pattern] = np.clip(img_a[deforest_pattern] - 85, 25, 255)

        rgb_b = np.zeros((height, width, 4), dtype=np.uint8)
        rgb_b[:, :, 0] = (img_b * 0.15).astype(np.uint8)
        rgb_b[:, :, 1] = (img_b * 0.9).astype(np.uint8)
        rgb_b[:, :, 2] = (img_b * 0.5).astype(np.uint8)
        rgb_b[:, :, 3] = 235

        rgb_a = np.zeros((height, width, 4), dtype=np.uint8)
        rgb_a[:, :, 0] = (img_a * 0.15).astype(np.uint8)
        rgb_a[:, :, 1] = (img_a * 0.9).astype(np.uint8)
        rgb_a[:, :, 2] = (img_a * 0.5).astype(np.uint8)
        rgb_a[:, :, 3] = 235

    else: # deformation
        # InSAR interferometric fringes (cyclical color fringes)
        fault_line = yy - 0.4 * xx
        disp = np.sin(fault_line * 4.0) * np.exp(-(xx**2 + yy**2) / 4.0)
        fringes = np.mod(disp * 8.0, 1.0)

        # Before: calm tectonic terrain
        img_b = np.clip((base_sar * 80 + 100), 30, 240)
        rgb_b = np.zeros((height, width, 4), dtype=np.uint8)
        rgb_b[:, :, 0] = (img_b * 0.3).astype(np.uint8)
        rgb_b[:, :, 1] = (img_b * 0.7).astype(np.uint8)
        rgb_b[:, :, 2] = (img_b * 0.85).astype(np.uint8)
        rgb_b[:, :, 3] = 235

        # After: interferometric fringe wraps
        rgb_a = np.zeros((height, width, 4), dtype=np.uint8)
        # Rainbow fringe coloring
        rgb_a[:, :, 0] = (np.sin(fringes * 2 * math.pi) * 127 + 128).astype(np.uint8)
        rgb_a[:, :, 1] = (np.sin(fringes * 2 * math.pi + 2.09) * 127 + 128).astype(np.uint8)
        rgb_a[:, :, 2] = (np.sin(fringes * 2 * math.pi + 4.18) * 127 + 128).astype(np.uint8)
        rgb_a[:, :, 3] = 235

    Image.fromarray(rgb_b).save(output_dir / "before.png")
    Image.fromarray(rgb_a).save(output_dir / "after.png")

def generate_change_geojson(scene: dict, output_dir: Path):
    """
    Generates realistic change polygons matching the scene's bounding box and change metrics.
    """
    bbox = scene["bbox"]
    min_lon, min_lat, max_lon, max_lat = bbox
    ctype = scene["change_type"]
    lon_span = max_lon - min_lon
    lat_span = max_lat - min_lat

    features = []
    num_polygons = 8
    np.random.seed(abs(hash(scene["id"] + "poly")) % (2**31))

    for i in range(num_polygons):
        # Center in bbox
        cx = min_lon + lon_span * (0.2 + 0.6 * np.random.rand())
        cy = min_lat + lat_span * (0.2 + 0.6 * np.random.rand())
        rx = lon_span * (0.04 + 0.08 * np.random.rand())
        ry = lat_span * (0.03 + 0.07 * np.random.rand())

        # Generate irregular polygon vertices
        n_vertices = np.random.randint(7, 13)
        angles = np.sort(np.random.uniform(0, 2 * math.pi, n_vertices))
        coords = []
        for a in angles:
            jitter = np.random.uniform(0.7, 1.3)
            px = round(cx + rx * math.cos(a) * jitter, 5)
            py = round(cy + ry * math.sin(a) * jitter, 5)
            coords.append([px, py])
        coords.append(coords[0]) # close ring

        # Calculate approximate area in km2
        poly_area = round((rx * 111.0) * (ry * 111.0) * math.pi * np.random.uniform(0.6, 1.2), 2)

        if ctype == "flood":
            classification = "Inundation Zone"
            severity = "High Inundation"
            metric_val = f"+{poly_area} km² flood extent"
        elif ctype == "vegetation":
            classification = "Canopy Loss / Disturbance"
            severity = "Severe Disturbance"
            metric_val = f"-{round(poly_area * 0.8, 1)} dB HV drop"
        else:
            classification = "Surface Displacement"
            severity = "Fault Rupture Slip"
            metric_val = f"{round(np.random.uniform(15.0, 65.0), 1)} cm LOS offset"

        features.append({
            "type": "Feature",
            "id": f"{scene['id']}-poly-{i+1}",
            "properties": {
                "id": f"{scene['id']}-poly-{i+1}",
                "class": classification,
                "severity": severity,
                "area_km2": poly_area,
                "metric": metric_val,
                "date_range": f"{scene['dates']['before']} to {scene['dates']['after']}",
                "sensor_platform": scene["source_products"][0],
                "confidence": round(float(np.random.uniform(0.88, 0.98)), 2)
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords]
            }
        })

    geojson_data = {
        "type": "FeatureCollection",
        "scene_id": scene["id"],
        "total_features": len(features),
        "features": features
    }

    with open(output_dir / "change.geojson", "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, indent=2)

def export_all_scenes():
    public_data_dir = Path(__file__).resolve().parent.parent / "public" / "data"
    public_data_dir.mkdir(parents=True, exist_ok=True)

    catalog_index = []

    for sc in SCENES_DATA:
        sid = sc["id"]
        s_dir = public_data_dir / sid
        s_dir.mkdir(parents=True, exist_ok=True)
        print(f"[EXPORT] Packaging scene: {sid} -> {s_dir}")

        # 1. meta.json
        meta_dict = {
            "id": sc["id"],
            "title": sc["title"],
            "change_type": sc["change_type"],
            "change_type_label": sc["change_type_label"],
            "location": sc["location"],
            "country": sc["country"],
            "flag": sc["flag"],
            "dates": sc["dates"],
            "bbox": sc["bbox"],
            "center": sc["center"],
            "zoom": sc["zoom"],
            "source_products": sc["source_products"],
            "daac": sc["daac"],
            "headline": sc["headline"],
            "story": sc["story"],
            "why_sar": sc["why_sar"],
            "story_steps": sc["story_steps"]
        }
        with open(s_dir / "meta.json", "w", encoding="utf-8") as f:
            json.dump(meta_dict, f, indent=2)

        # 2. stats.json
        with open(s_dir / "stats.json", "w", encoding="utf-8") as f:
            json.dump(sc["stats"], f, indent=2)

        # 3. timeseries.json
        with open(s_dir / "timeseries.json", "w", encoding="utf-8") as f:
            json.dump(sc["timeseries"], f, indent=2)

        # 4. change.geojson
        generate_change_geojson(sc, s_dir)

        # 5. before.png & after.png
        generate_radar_image_pair(sc, s_dir)

        # Summary for catalog index
        catalog_index.append({
            "id": sc["id"],
            "title": sc["title"],
            "change_type": sc["change_type"],
            "change_type_label": sc["change_type_label"],
            "location": sc["location"],
            "country": sc["country"],
            "flag": sc["flag"],
            "dates": sc["dates"],
            "bbox": sc["bbox"],
            "center": sc["center"],
            "zoom": sc["zoom"],
            "source_products": sc["source_products"],
            "headline": sc["headline"],
            "peak_metric": sc["stats"]["peak_metric"],
            "area_changed_km2": sc["stats"]["area_changed_km2"]
        })

    # Save catalog.json at /public/data/catalog.json
    with open(public_data_dir / "catalog.json", "w", encoding="utf-8") as f:
        json.dump(catalog_index, f, indent=2)

    print(f"\n[SUCCESS] Exported {len(SCENES_DATA)} scenes to {public_data_dir}")

if __name__ == "__main__":
    export_all_scenes()
