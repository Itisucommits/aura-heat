"""
AURA-Heat: Pydantic v2 Schemas for FastAPI REST API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import date, datetime
from uuid import UUID


class WardBase(BaseModel):
    ward_number: int
    ward_name: str
    zone_name: str
    population_total: int
    elderly_population: int
    slum_density: float
    outdoor_worker_density: float
    baseline_ndvi: float
    wvi_score: float


class WardOut(WardBase):
    id: UUID

    class Config:
        from_attributes = True


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    id: str
    geometry: Dict[str, Any]
    properties: Dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]


class HourlyForecastItem(BaseModel):
    hour: int
    dry_bulb_temp_c: float
    relative_humidity_pct: float
    wind_speed_ms: float
    solar_radiation_w_m2: float
    utci: float
    wbgt: float
    heat_index: float
    tier: str


class DailyForecastSummary(BaseModel):
    day: str
    date: str
    horizon_day: int
    max_dry_bulb_c: float
    avg_utci: float
    max_wbgt: float
    mortality_risk_score: float
    projected_hospitalization_surge_pct: float
    alert_tier: str
    advisory: str


class WardForecastResponse(BaseModel):
    ward_id: str
    ward_name: str
    zone_name: str
    wvi_score: float
    population_total: int
    elderly_ratio: float
    slum_density: float
    outdoor_worker_ratio: float
    ndvi: float
    five_day_summary: List[DailyForecastSummary]
    hourly_breakdown_today: List[HourlyForecastItem]


class HospitalCapacityWard(BaseModel):
    ward_id: str
    ward_name: str
    hospital_name: str
    total_beds: int
    occupied_beds: int
    occupancy_rate_pct: float
    dedicated_heatstroke_cooling_beds: int
    projected_triage_demand_48h: int
    triage_alert_status: str  # NORMAL, STRAINED, CRITICAL
    ors_packets_stock: int
    iv_fluid_saline_bags: int
    ice_pack_units: int


class HospitalCapacityResponse(BaseModel):
    city: str
    timestamp: str
    total_beds_citywide: int
    total_occupied_citywide: int
    city_occupancy_pct: float
    projected_total_heatstroke_triage_24h: int
    wards: List[HospitalCapacityWard]


class AlertDispatchRequest(BaseModel):
    ward_id: Optional[str] = None
    target_tier: Optional[str] = Field(default="RED", description="RED or ORANGE or ALL")
    channels: List[str] = Field(default=["WHATSAPP", "SMS", "MUNICIPAL_WEBHOOK"])
    custom_note: Optional[str] = None


class AlertDispatchResponse(BaseModel):
    status: str
    task_id: str
    dispatched_wards_count: int
    channels_triggered: List[str]
    sample_payload_regional: Dict[str, str]
    timestamp: str


class CityAnalyticsSummary(BaseModel):
    city_name: str
    current_time: str
    population_at_extreme_risk: int
    active_red_wards_count: int
    active_orange_wards_count: int
    active_yellow_wards_count: int
    active_green_wards_count: int
    total_cooling_shelters_open: int
    total_water_tankers_deployed: int
    projected_emergency_admissions_48h: int
    peak_forecast_utci: float
    peak_forecast_wbgt: float
