/**
 * AURA-Heat: TypeScript Types and Data Contracts
 */

export type AlertTier = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface WardProperties {
  ward_id: string;
  ward_number: number;
  ward_name: string;
  zone_name: string;
  population_total: number;
  elderly_ratio: number;
  slum_density: number;
  outdoor_worker_ratio: number;
  baseline_ndvi: number;
  wvi_score: number;
  dry_bulb_temp: number;
  relative_humidity: number;
  wind_speed: number;
  solar_radiation: number;
  utci: number;
  max_wbgt: number;
  heat_index: number;
  alert_tier: AlertTier;
  tier_advisory: string;
  mortality_risk_score: number;
  projected_hospitalizations_surge_pct: number;
  cooling_centers_count: number;
  water_tankers_assigned: number;
  hospital_name: string;
}

export interface WardGeoJSONFeature {
  type: 'Feature';
  id: string;
  properties: WardProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface WardGeoJSONCollection {
  type: 'FeatureCollection';
  features: WardGeoJSONFeature[];
}

export interface DailyForecast {
  day: string;
  date: string;
  horizon_day: number;
  max_dry_bulb_c: number;
  avg_utci: number;
  max_wbgt: number;
  mortality_risk_score: number;
  projected_hospitalization_surge_pct: number;
  alert_tier: AlertTier;
  advisory: string;
}

export interface HourlyForecastItem {
  hour: number;
  dry_bulb_temp_c: number;
  relative_humidity_pct: number;
  wind_speed_ms: number;
  solar_radiation_w_m2: number;
  utci: number;
  wbgt: number;
  heat_index: number;
  tier: AlertTier;
}

export interface WardForecastDetails {
  ward_id: string;
  ward_name: string;
  zone_name: string;
  wvi_score: number;
  population_total: number;
  elderly_ratio: number;
  slum_density: number;
  outdoor_worker_ratio: number;
  ndvi: number;
  five_day_summary: DailyForecast[];
  hourly_breakdown_today: HourlyForecastItem[];
}

export interface HospitalWardCapacity {
  ward_id: string;
  ward_name: string;
  hospital_name: string;
  total_beds: number;
  occupied_beds: number;
  occupancy_rate_pct: number;
  dedicated_heatstroke_cooling_beds: number;
  projected_triage_demand_48h: number;
  triage_alert_status: 'NORMAL' | 'STRAINED' | 'CRITICAL';
  ors_packets_stock: number;
  iv_fluid_saline_bags: number;
  ice_pack_units: number;
}

export interface CityAnalyticsSummary {
  city_name: string;
  current_time: string;
  population_at_extreme_risk: number;
  active_red_wards_count: number;
  active_orange_wards_count: number;
  active_yellow_wards_count: number;
  active_green_wards_count: number;
  total_cooling_shelters_open: number;
  total_water_tankers_deployed: number;
  projected_emergency_admissions_48h: number;
  peak_forecast_utci: number;
  peak_forecast_wbgt: number;
}

export interface AlertLogItem {
  task_id: string;
  target_tier: string;
  channels: string[];
  dispatched_wards_count: number;
  status: string;
  timestamp: string;
  sample_ward: string;
  message_preview?: string;
}
