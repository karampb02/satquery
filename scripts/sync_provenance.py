import json
from pathlib import Path

data_dir = Path(__file__).resolve().parent.parent / "public" / "data"
catalog_items = []

REAL_SCENES = {"valencia-flood-2024"}

for scene_dir in data_dir.iterdir():
    if not scene_dir.is_dir():
        continue
    meta_path = scene_dir / "meta.json"
    stats_path = scene_dir / "stats.json"
    if not meta_path.exists():
        continue
    
    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)
    
    if meta["id"] in REAL_SCENES:
        meta["flag"] = "real"
    else:
        meta["flag"] = "illustrative"
        new_prods = []
        for p in meta.get("source_products", []):
            new_p = p.replace("DSWx-HLS", "DSWx-S1").replace("DIST-ALERT-HLS", "DIST-ALERT-S1")
            new_prods.append(new_p)
        meta["source_products"] = new_prods
    
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    
    stats = {}
    if stats_path.exists():
        with open(stats_path, "r", encoding="utf-8") as f:
            stats = json.load(f)
            
    catalog_items.append({
        "id": meta["id"],
        "title": meta["title"],
        "change_type": meta["change_type"],
        "change_type_label": meta["change_type_label"],
        "location": meta["location"],
        "country": meta["country"],
        "flag": meta["flag"],
        "dates": meta["dates"],
        "bbox": meta["bbox"],
        "center": meta["center"],
        "zoom": meta["zoom"],
        "source_products": meta["source_products"],
        "headline": meta["headline"],
        "peak_metric": stats.get("peak_metric", ""),
        "area_changed_km2": stats.get("area_changed_km2", 0)
    })

catalog_items.sort(key=lambda x: (0 if x["flag"] == "real" else 1, x["title"]))
with open(data_dir / "catalog.json", "w", encoding="utf-8") as f:
    json.dump(catalog_items, f, indent=2)

print("Updated all scenes and catalog.json successfully!")
for c in catalog_items:
    print(f"  {c['id']}: flag={c['flag']}")
