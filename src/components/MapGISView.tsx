/**
 * AURA-Heat: Interactive Leaflet Geospatial GIS Choropleth Component
 * Professional Polish Design Theme
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { WardProperties } from '../types';
import { RAW_WARDS } from '../data/wardsGeoData';

interface MapGISViewProps {
  wardData: WardProperties[];
  selectedWardId: string | null;
  onSelectWard: (wardId: string) => void;
  activeLayer: 'TIER' | 'UTCI' | 'WBGT' | 'WVI' | 'SLUMS' | 'ELDERLY';
  showCoolingCenters: boolean;
  showWaterTankers: boolean;
}

export const MapGISView: React.FC<MapGISViewProps> = ({
  wardData,
  selectedWardId,
  onSelectWard,
  activeLayer,
  showCoolingCenters,
  showWaterTankers
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  // Helper to get choropleth polygon color matching the Professional Polish palette
  const getFeatureColor = (props: WardProperties) => {
    if (activeLayer === 'TIER') {
      switch (props.alert_tier) {
        case 'RED': return '#ef4444';     // Extreme (Red)
        case 'ORANGE': return '#f97316';  // Danger (Orange)
        case 'YELLOW': return '#facc15';  // Advisory (Yellow)
        case 'GREEN': return '#4ade80';   // Safe (Green)
        default: return '#94a3b8';
      }
    } else if (activeLayer === 'UTCI') {
      if (props.utci >= 48) return '#b91c1c';
      if (props.utci >= 44) return '#ef4444';
      if (props.utci >= 40) return '#f97316';
      if (props.utci >= 36) return '#facc15';
      return '#84cc16';
    } else if (activeLayer === 'WBGT') {
      if (props.max_wbgt >= 33) return '#b91c1c';
      if (props.max_wbgt >= 31) return '#ef4444';
      if (props.max_wbgt >= 29) return '#f97316';
      if (props.max_wbgt >= 27) return '#facc15';
      return '#22c55e';
    } else if (activeLayer === 'WVI') {
      if (props.wvi_score >= 0.65) return '#9333ea';
      if (props.wvi_score >= 0.50) return '#c084fc';
      if (props.wvi_score >= 0.35) return '#60a5fa';
      return '#38bdf8';
    } else if (activeLayer === 'SLUMS') {
      if (props.slum_density >= 0.60) return '#dc2626';
      if (props.slum_density >= 0.40) return '#ea580c';
      return '#facc15';
    } else {
      // ELDERLY
      if (props.elderly_ratio >= 0.17) return '#4f46e5';
      if (props.elderly_ratio >= 0.14) return '#818cf8';
      return '#a5b4fc';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Ahmedabad Municipal Corporation [23.0225, 72.5714]
    const map = L.map(mapContainerRef.current, {
      center: [23.0225, 72.5714],
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Clean light basemap tiles for crisp professional polish aesthetic (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update GeoJSON Polygons and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }
    if (markerLayerRef.current) {
      markerLayerRef.current.clearLayers();
    }

    const geojsonData: any = {
      type: 'FeatureCollection',
      features: RAW_WARDS.map((raw) => {
        const props = wardData.find((w) => w.ward_id === raw.id) || {
          ward_id: raw.id,
          ward_name: raw.ward_name,
          zone_name: raw.zone_name,
          alert_tier: 'YELLOW',
          utci: 37,
          max_wbgt: 29,
          dry_bulb_temp: 40,
          wvi_score: 0.5,
          mortality_risk_score: 25,
          slum_density: raw.slum_density,
          elderly_ratio: raw.elderly_ratio
        };

        return {
          type: 'Feature',
          id: raw.id,
          geometry: {
            type: 'Polygon',
            coordinates: [raw.polygon]
          },
          properties: props
        };
      })
    };

    // Render Choropleth Layer
    const layer = L.geoJSON(geojsonData, {
      style: (feature) => {
        const isSelected = feature?.id === selectedWardId;
        const color = getFeatureColor(feature?.properties);
        return {
          fillColor: color,
          weight: isSelected ? 3 : 1.5,
          opacity: 1,
          color: isSelected ? '#0f172a' : '#475569',
          dashArray: isSelected ? '' : '1',
          fillOpacity: isSelected ? 0.85 : 0.6
        };
      },
      onEachFeature: (feature, layerItem) => {
        const p = feature.properties as WardProperties;

        // Clean Professional Tooltip
        layerItem.bindTooltip(
          `
          <div class="p-2 font-sans text-xs text-slate-800">
            <div class="font-bold text-sm text-slate-900">${p.ward_name} (${p.zone_name})</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                p.alert_tier === 'RED' ? 'bg-red-100 text-red-700 border border-red-200' :
                p.alert_tier === 'ORANGE' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                p.alert_tier === 'YELLOW' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                'bg-green-100 text-green-700 border border-green-200'
              }">${p.alert_tier} ALERT</span>
              <span class="text-slate-600">AMRS: <b class="text-slate-900">${p.mortality_risk_score}</b>/100</span>
            </div>
            <div class="mt-2 text-slate-600 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pt-1 border-t border-slate-100">
              <span>Dry-Bulb: <b class="text-slate-900">${p.dry_bulb_temp}°C</b></span>
              <span>UTCI: <b class="text-red-600">${p.utci}°C</b></span>
              <span>WBGT: <b class="text-orange-600">${p.max_wbgt}°C</b></span>
              <span>WVI: <b class="text-purple-600">${p.wvi_score}</b></span>
            </div>
          </div>
          `,
          { className: 'leaflet-custom-tooltip bg-white border border-slate-200 text-slate-800 rounded-lg shadow-xl', sticky: true }
        );

        layerItem.on({
          click: () => {
            onSelectWard(p.ward_id);
          },
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              fillOpacity: 0.95,
              weight: 2.5,
              color: '#0f172a'
            });
          },
          mouseout: (e) => {
            if (feature.id !== selectedWardId) {
              layer.resetStyle(e.target);
            }
          }
        });
      }
    }).addTo(map);

    geojsonLayerRef.current = layer;

    // POI Markers
    if (markerLayerRef.current) {
      RAW_WARDS.forEach((w) => {
        const props = wardData.find((item) => item.ward_id === w.id);

        if (showCoolingCenters && w.cooling_center_names) {
          const shelterIcon = L.divIcon({
            className: 'custom-poi-marker',
            html: `
              <div class="w-6 h-6 rounded-full bg-cyan-600 border-2 border-white flex items-center justify-center text-white text-[11px] shadow-md cursor-pointer hover:scale-125 transition-transform" title="Cooling Shelter: ${w.cooling_center_names[0]}">
                ❄
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const shelterMarker = L.marker([w.center[0] + 0.004, w.center[1] - 0.003], { icon: shelterIcon });
          shelterMarker.bindPopup(`
            <div class="p-2 font-sans text-xs text-slate-800">
              <div class="font-bold text-cyan-700 text-[10px] uppercase">Active Cooling Shelter</div>
              <div class="font-bold text-sm text-slate-900 mt-0.5">${w.cooling_center_names[0]}</div>
              <div class="text-slate-500 mt-1">Ward: ${w.ward_name}</div>
              <div class="text-emerald-700 font-semibold mt-1">75 Cots • Free ORS & Chilled Water</div>
            </div>
          `);
          markerLayerRef.current?.addLayer(shelterMarker);
        }

        if (showWaterTankers && props && props.water_tankers_assigned > 0) {
          const tankerIcon = L.divIcon({
            className: 'custom-tanker-marker',
            html: `
              <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] shadow-md cursor-pointer hover:scale-125 transition-transform" title="Water Tankers: ${props.water_tankers_assigned}">
                💧
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const tankerMarker = L.marker([w.center[0] - 0.004, w.center[1] + 0.004], { icon: tankerIcon });
          tankerMarker.bindPopup(`
            <div class="p-2 font-sans text-xs text-slate-800">
              <div class="font-bold text-blue-700 text-[10px] uppercase">Water Tanker Fleet</div>
              <div class="font-bold text-sm text-slate-900 mt-0.5">${w.ward_name} Relief Route</div>
              <div class="text-slate-600 mt-1">Assigned: <b>${props.water_tankers_assigned} tankers</b></div>
            </div>
          `);
          markerLayerRef.current?.addLayer(tankerMarker);
        }
      });
    }
  }, [wardData, selectedWardId, activeLayer, showCoolingCenters, showWaterTankers]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay matching Professional Polish design: bg-white p-3 rounded shadow-lg border border-slate-200 */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-md text-xs max-w-[220px]">
        <h4 className="text-[10px] font-bold uppercase mb-2 text-slate-400 tracking-wider">
          Legend ({activeLayer})
        </h4>

        {activeLayer === 'TIER' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-[10px] font-medium text-slate-700">Extreme (Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded" />
              <span className="text-[10px] font-medium text-slate-700">Danger (Orange)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded" />
              <span className="text-[10px] font-medium text-slate-700">Advisory (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded" />
              <span className="text-[10px] font-medium text-slate-700">Safe (Green)</span>
            </div>
          </div>
        )}

        {activeLayer === 'UTCI' && (
          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-medium">UTCI Stress (°C)</div>
            <div className="h-2 rounded-full w-full bg-gradient-to-r from-lime-500 via-yellow-400 via-orange-500 to-red-600 mb-1" />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>32°C</span>
              <span>40°C</span>
              <span>48°C+</span>
            </div>
          </div>
        )}

        {activeLayer === 'WBGT' && (
          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-medium">ISO 7243 WBGT (°C)</div>
            <div className="h-2 rounded-full w-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-red-600 mb-1" />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>&lt;28°C</span>
              <span>30°C</span>
              <span>&gt;32°C</span>
            </div>
          </div>
        )}

        {activeLayer === 'WVI' && (
          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-medium">Wulnerability (WVI)</div>
            <div className="h-2 rounded-full w-full bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 mb-1" />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>0.2</span>
              <span>0.5</span>
              <span>0.8+</span>
            </div>
          </div>
        )}

        {/* POI indicators */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block" />
            <span>Shelters</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Tankers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
