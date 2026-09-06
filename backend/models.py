"""
AURA-Heat: SQLAlchemy 2.0 & GeoAlchemy2 Database Models
Spatial models for PostgreSQL 16 + PostGIS
"""

import uuid
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Enum, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

try:
    from geoalchemy2 import Geometry
except ImportError:
    # Fallback to Text representation if geoalchemy2 not yet compiled in environment
    Geometry = lambda *args, **kwargs: Text()


class AlertTierEnum(str, Enum):
    GREEN = "GREEN"
    YELLOW = "YELLOW"
    ORANGE = "ORANGE"
    RED = "RED"


class Ward(Base):
    __tablename__ = "wards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_number = Column(Integer, unique=True, index=True, nullable=False)
    ward_name = Column(String(120), nullable=False)
    zone_name = Column(String(80), nullable=False)
    geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=True)
    population_total = Column(Integer, default=0)
    elderly_population = Column(Integer, default=0)
    slum_density = Column(Float, default=0.0)
    outdoor_worker_density = Column(Float, default=0.0)
    baseline_ndvi = Column(Float, default=0.25)
    wvi_score = Column(Float, default=0.5)

    # Relationships
    predictions = relationship("WardDailyPrediction", back_populates="ward", cascade="all, delete-orphan")
    alert_logs = relationship("AlertLog", back_populates="ward", cascade="all, delete-orphan")
    cooling_centers = relationship("CoolingCenter", back_populates="ward", cascade="all, delete-orphan")


class WeatherForecast(Base):
    __tablename__ = "weather_forecasts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    forecast_timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    horizon_hours = Column(Integer, default=0)
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    dry_bulb_temp = Column(Float, nullable=False)
    relative_humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    solar_radiation = Column(Float, nullable=False)
    calculated_utci = Column(Float, nullable=True)
    calculated_wbgt = Column(Float, nullable=True)
    calculated_hi = Column(Float, nullable=True)


class WardDailyPrediction(Base):
    __tablename__ = "ward_daily_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id", ondelete="CASCADE"), nullable=False, index=True)
    target_date = Column(Date, nullable=False, index=True)
    avg_utci = Column(Float, nullable=False)
    max_wbgt = Column(Float, nullable=False)
    mortality_risk_score = Column(Float, default=0.0)
    projected_hospitalizations_surge_pct = Column(Float, default=0.0)
    alert_tier = Column(String(20), default="GREEN")
    created_at = Column(DateTime, default=datetime.utcnow)

    ward = relationship("Ward", back_populates="predictions")


class AlertLog(Base):
    __tablename__ = "alert_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id", ondelete="CASCADE"), nullable=False, index=True)
    trigger_tier = Column(String(20), nullable=False)
    action_taken = Column(Text, nullable=False)
    recipient_group = Column(String(100), nullable=False)
    status = Column(String(40), default="DISPATCHED")
    dispatched_at = Column(DateTime, default=datetime.utcnow)

    ward = relationship("Ward", back_populates="alert_logs")


class CoolingCenter(Base):
    __tablename__ = "cooling_centers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(160), nullable=False)
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id", ondelete="CASCADE"), nullable=False, index=True)
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    capacity = Column(Integer, default=50)
    is_active = Column(Boolean, default=True)
    contact_number = Column(String(50), default="+91-79-2550-1234")

    ward = relationship("Ward", back_populates="cooling_centers")
