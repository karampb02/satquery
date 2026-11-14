"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import { SceneMeta, StoryStep } from "./types";

interface RadarMapProps {
  scene: SceneMeta;
  activeLayer: "before" | "after" | "change" | "swipe";
  activeBasemap: "gibs_true_color" | "gibs_night" | "blank";
  opacity: number; // 0 to 1
  swipePosition: number; // 0 to 100 percentage
  currentTimeIndex: number; // for time slider
  onPolygonClick?: (properties: any) => void;
  storyStep?: StoryStep | null;
  onMapLoaded?: () => void;
}

export default function RadarMap({
  scene,
  activeLayer,
  activeBasemap,
  opacity,
  swipePosition,
  currentTimeIndex,
  onPolygonClick,
  storyStep,
  onMapLoaded,
}: RadarMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const activePopupRef = useRef<maplibregl.Popup | null>(null);

  // Unified multi-basemap style (Zero API key required, zero watermarks)
  const getUnifiedStyle = useCallback(() => {
    return {
      version: 8 as const,
      sources: {
        "esri-dark": {
          type: "raster" as const,
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "Esri, HERE, Garmin, © OpenStreetMap",
        },
        "gibs-color": {
          type: "raster" as const,
          tiles: [
            "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-07-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
          ],
          tileSize: 256,
          attribution: "NASA GIBS / Worldview",
        },
        "gibs-night": {
          type: "raster" as const,
          tiles: [
            "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png",
          ],
          tileSize: 256,
          attribution: "NASA Earth Observatory / NOAA / GIBS",
        },
      },
      layers: [
        {
          id: "background-dark",
          type: "background" as const,
          paint: {
            "background-color": "#06090e",
          },
        },
        {
          id: "layer-esri-dark",
          type: "raster" as const,
          source: "esri-dark",
          minzoom: 0,
          maxzoom: 16,
          paint: {
            "raster-opacity": 0.85,
          },
          layout: {
            visibility: "visible" as const,
          },
        },
        {
          id: "layer-gibs-color",
          type: "raster" as const,
          source: "gibs-color",
          minzoom: 0,
          maxzoom: 9,
          layout: {
            visibility: "none" as const,
          },
        },
        {
          id: "layer-gibs-night",
          type: "raster" as const,
          source: "gibs-night",
          minzoom: 0,
          maxzoom: 8,
          layout: {
            visibility: "none" as const,
          },
        },
      ],
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: getUnifiedStyle(),
      center: scene.center,
      zoom: scene.zoom,
      maxZoom: 18,
      minZoom: 2,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left"
    );
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-right"
    );

    map.on("load", () => {
      setIsLoaded(true);
      mapRef.current = map;
      if (onMapLoaded) onMapLoaded();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
  }, [scene.id, getUnifiedStyle]);

  // Toggle Basemap Visibilities instantly without destroying radar layers
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const map = mapRef.current;

    const esriLayer = map.getLayer("layer-esri-dark");
    const colorLayer = map.getLayer("layer-gibs-color");
    const nightLayer = map.getLayer("layer-gibs-night");

    if (!esriLayer || !colorLayer || !nightLayer) return;

    if (activeBasemap === "blank") {
      map.setLayoutProperty("layer-esri-dark", "visibility", "visible");
      map.setLayoutProperty("layer-gibs-color", "visibility", "none");
      map.setLayoutProperty("layer-gibs-night", "visibility", "none");
    } else if (activeBasemap === "gibs_true_color") {
      map.setLayoutProperty("layer-esri-dark", "visibility", "none");
      map.setLayoutProperty("layer-gibs-color", "visibility", "visible");
      map.setLayoutProperty("layer-gibs-night", "visibility", "none");
    } else if (activeBasemap === "gibs_night") {
      map.setLayoutProperty("layer-esri-dark", "visibility", "none");
      map.setLayoutProperty("layer-gibs-color", "visibility", "none");
      map.setLayoutProperty("layer-gibs-night", "visibility", "visible");
    }
  }, [activeBasemap, isLoaded]);

  // Load Scene Layers (before image, after image, geojson change)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const map = mapRef.current;

    const bbox = scene.bbox; // [min_lon, min_lat, max_lon, max_lat]
    const imageCoordinates: [
      [number, number],
      [number, number],
      [number, number],
      [number, number]
    ] = [
      [bbox[0], bbox[3]], // Top-Left
      [bbox[2], bbox[3]], // Top-Right
      [bbox[2], bbox[1]], // Bottom-Right
      [bbox[0], bbox[1]], // Bottom-Left
    ];

    // Helper to safely remove layer and source
    const safeRemove = (id: string) => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
    };

    safeRemove("radar-after-layer");
    safeRemove("radar-before-layer");
    safeRemove("radar-after-src");
    safeRemove("radar-before-src");
    safeRemove("change-fill-layer");
    safeRemove("change-line-layer");
    safeRemove("change-geojson-src");

    // Add Before Radar Image Source
    map.addSource("radar-before-src", {
      type: "image",
      url: `/data/${scene.id}/before.png`,
      coordinates: imageCoordinates,
    });

    // Add After Radar Image Source
    map.addSource("radar-after-src", {
      type: "image",
      url: `/data/${scene.id}/after.png`,
      coordinates: imageCoordinates,
    });

    // Add Layers
    map.addLayer({
      id: "radar-before-layer",
      type: "raster",
      source: "radar-before-src",
      paint: {
        "raster-opacity": 1.0,
        "raster-fade-duration": 0,
      },
    });

    map.addLayer({
      id: "radar-after-layer",
      type: "raster",
      source: "radar-after-src",
      paint: {
        "raster-opacity": 1.0,
        "raster-fade-duration": 0,
      },
    });

    // Add GeoJSON change polygons
    map.addSource("change-geojson-src", {
      type: "geojson",
      data: `/data/${scene.id}/change.geojson`,
    });

    // Color based on change type
    const fillColor =
      scene.change_type === "flood"
        ? "#06b6d4" // Cyan for flood
        : scene.change_type === "vegetation"
        ? "#f59e0b" // Amber for vegetation loss
        : "#ec4899"; // Rose/magenta for deformation

    map.addLayer({
      id: "change-fill-layer",
      type: "fill",
      source: "change-geojson-src",
      paint: {
        "fill-color": fillColor,
        "fill-opacity": 0.45,
      },
    });

    map.addLayer({
      id: "change-line-layer",
      type: "line",
      source: "change-geojson-src",
      paint: {
        "line-color": fillColor,
        "line-width": 2,
        "line-opacity": 0.9,
      },
    });

    // Polygon Click Interaction
    const handlePolygonClick = (e: any) => {
      if (!e.features || e.features.length === 0) return;
      const feat = e.features[0];
      const props = feat.properties;

      if (activePopupRef.current) {
        activePopupRef.current.remove();
      }

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <div style="font-weight: 700; color: ${fillColor}; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">
            ${props.class || "Radar Change Zone"}
          </div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px;">
            ${props.metric || `${props.area_km2} km²`}
          </div>
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 2px;">
            <strong>Severity:</strong> ${props.severity || "Detected"}
          </div>
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 2px;">
            <strong>Area:</strong> ${props.area_km2} km²
          </div>
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 2px;">
            <strong>Dates:</strong> ${props.date_range || "Event window"}
          </div>
          <div style="color: #64748b; font-size: 11px; font-family: monospace; margin-top: 6px;">
            Sensor: ${props.sensor_platform || scene.source_products[0]}
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(popupHtml)
        .addTo(map);

      activePopupRef.current = popup;

      if (onPolygonClick) {
        onPolygonClick(props);
      }
    };

    map.on("click", "change-fill-layer", handlePolygonClick);
    map.on("mouseenter", "change-fill-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "change-fill-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      map.off("click", "change-fill-layer", handlePolygonClick);
    };
  }, [scene, isLoaded, onPolygonClick]);

  // Handle Layer Visibilities & Opacity / Swipe
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const map = mapRef.current;

    const beforeLayer = map.getLayer("radar-before-layer");
    const afterLayer = map.getLayer("radar-after-layer");
    const changeFill = map.getLayer("change-fill-layer");
    const changeLine = map.getLayer("change-line-layer");

    if (!beforeLayer || !afterLayer || !changeFill || !changeLine) return;

    if (activeLayer === "before") {
      map.setLayoutProperty("radar-before-layer", "visibility", "visible");
      map.setLayoutProperty("radar-after-layer", "visibility", "none");
      map.setLayoutProperty("change-fill-layer", "visibility", "none");
      map.setLayoutProperty("change-line-layer", "visibility", "none");
      map.setPaintProperty("radar-before-layer", "raster-opacity", opacity);
    } else if (activeLayer === "after") {
      map.setLayoutProperty("radar-before-layer", "visibility", "none");
      map.setLayoutProperty("radar-after-layer", "visibility", "visible");
      map.setLayoutProperty("change-fill-layer", "visibility", "none");
      map.setLayoutProperty("change-line-layer", "visibility", "none");
      map.setPaintProperty("radar-after-layer", "raster-opacity", opacity);
    } else if (activeLayer === "change") {
      map.setLayoutProperty("radar-before-layer", "visibility", "visible");
      map.setLayoutProperty("radar-after-layer", "visibility", "visible");
      map.setLayoutProperty("change-fill-layer", "visibility", "visible");
      map.setLayoutProperty("change-line-layer", "visibility", "visible");
      map.setPaintProperty("radar-before-layer", "raster-opacity", 0.6);
      map.setPaintProperty("radar-after-layer", "raster-opacity", opacity * 0.85);
      map.setPaintProperty("change-fill-layer", "fill-opacity", opacity * 0.55);
    } else if (activeLayer === "swipe") {
      // Split swipe mode: both visible, opacity applied
      map.setLayoutProperty("radar-before-layer", "visibility", "visible");
      map.setLayoutProperty("radar-after-layer", "visibility", "visible");
      map.setLayoutProperty("change-fill-layer", "visibility", "none");
      map.setLayoutProperty("change-line-layer", "visibility", "none");
      map.setPaintProperty("radar-before-layer", "raster-opacity", 1.0);
      map.setPaintProperty("radar-after-layer", "raster-opacity", opacity);
    }
  }, [activeLayer, opacity, isLoaded]);

  // Handle Story Mode step camera motion
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !storyStep) return;
    mapRef.current.flyTo({
      center: storyStep.center,
      zoom: storyStep.zoom,
      speed: 0.9,
      curve: 1.2,
      essential: true,
    });
  }, [storyStep, isLoaded]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Swipe Overlay Divider if in swipe mode */}
      {activeLayer === "swipe" && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20 flex flex-col items-center"
          style={{ left: `${swipePosition}%` }}
        >
          <div className="w-0.5 h-full bg-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.9)]" />
          <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-teal-400 shadow-lg flex items-center justify-center text-teal-300 text-xs font-bold pointer-events-auto cursor-ew-resize">
            ⇄
          </div>
        </div>
      )}

      {/* Floating Swipe Labels */}
      {activeLayer === "swipe" && (
        <>
          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded border border-slate-700/60 text-xs font-mono text-teal-300">
            BEFORE: {scene.dates.before}
          </div>
          <div className="absolute top-4 right-14 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded border border-slate-700/60 text-xs font-mono text-amber-300">
            AFTER: {scene.dates.after}
          </div>
        </>
      )}

      {/* SAR Calibration / Sensor Overlay Badge */}
      <div className="absolute bottom-6 left-4 z-10 pointer-events-none hidden sm:block">
        <div className="bg-[#0a0f18]/90 backdrop-blur-md border border-slate-800/80 rounded-md p-2.5 text-xxs font-mono text-slate-400 max-w-sm space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            {scene.flag === "real" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">VERIFIED NASA SAR OBSERVATION</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-400">ILLUSTRATIVE SAR SIMULATION (PROCEDURAL MODEL)</span>
              </>
            )}
          </div>
          <div className="truncate text-slate-300">Product: {scene.source_products[0]}</div>
          <div className="text-slate-400">DAAC: {scene.daac}</div>
        </div>
      </div>
    </div>
  );
}
