"""
AURA-Heat: Celery Configuration
Celery task queue with Redis / RabbitMQ broker and Celery Beat 6-hour cron ingestion.
"""

import os
from celery import Celery
from celery.schedules import crontab

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "aura_heat",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["backend.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_routes={
        "backend.tasks.ingest_nwp_forecast_pipeline": {"queue": "weather_ingest"},
        "backend.tasks.dispatch_municipal_alerts_task": {"queue": "alerts"},
        "backend.tasks.check_prolonged_heatwave_conditions": {"queue": "analytics"}
    },
    beat_schedule={
        # Scheduled 6-hour cron weather ingestion pipeline (00, 06, 12, 18 UTC)
        "ingest-noaa-gfs-forecast-every-6-hours": {
            "task": "backend.tasks.ingest_nwp_forecast_pipeline",
            "schedule": crontab(minute=0, hour="0,6,12,18"),
            "args": ("NOAA_GFS_0.25",)
        },
        # Check every 30 minutes for prolonged 48h Orange/Red transitions
        "monitor-hap-threshold-triggers": {
            "task": "backend.tasks.check_prolonged_heatwave_conditions",
            "schedule": crontab(minute="*/30")
        }
    }
)
