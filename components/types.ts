export type ChangeType = "flood" | "vegetation" | "deformation";

export interface SceneMeta {
  id: string;
  title: string;
  change_type: ChangeType;
  change_type_label: string;
  location: string;
  country: string;
  flag: "real" | "illustrative" | "sample";
  dates: {
    before: string;
    after: string;
  };
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
  center: [number, number]; // [lon, lat]
  zoom: number;
  source_products: string[];
  daac: string;
  headline: string;
  story: string;
  why_sar: string;
  story_steps: StoryStep[];
}

export interface StoryStep {
  step: number;
  title: string;
  description: string;
  center: [number, number];
  zoom: number;
  layer: "before" | "after" | "change";
}

export interface SceneStats {
  baseline_km2: number;
  post_km2: number;
  area_changed_km2: number;
  pct_change: number;
  unit: string;
  peak_metric: string;
  headline: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  change_type: ChangeType;
  change_type_label: string;
  location: string;
  country: string;
  flag: "real" | "illustrative" | "sample";
  dates: {
    before: string;
    after: string;
  };
  bbox: [number, number, number, number];
  center: [number, number];
  zoom: number;
  source_products: string[];
  headline: string;
  peak_metric: string;
  area_changed_km2: number;
}
