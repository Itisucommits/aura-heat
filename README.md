<div align="center">

# 🌡️ AURA-Heat

**Adaptive Urban Risk & Automated Heatwave Advisory Decision Support System**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostGIS](https://img.shields.io/badge/Spatial_DB-PostgreSQL%2016%20%2B%20PostGIS%203.4-336791.svg?logo=postgresql&logoColor=white)](https://postgis.net)
[![Celery](https://img.shields.io/badge/Tasks-Celery%205%20%7C%20Redis%207-37814A.svg?logo=celery&logoColor=white)](https://docs.celeryq.dev)
[![Docker](https://img.shields.io/badge/Containers-Docker%20Compose-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com)

A specialized municipal climate resilience platform that translates coarse numerical weather predictions into localized biometeorological human thermal stress, evaluates socio-spatial ward vulnerabilities, and triggers automated Heat Action Plan (HAP) emergency protocols.

[About the Project](#-about-the-project) • [What Is Used](#-what-is-used-in-the-project) • [Key Capabilities](#-key-capabilities) • [Project Structure](#-project-structure) • [API Endpoints](#-core-api-endpoints)

</div>

---

## 📖 About the Project

Traditional heatwave early-warning systems typically rely on single ambient dry-bulb temperature ($T_{air}$) forecasts from coarse synoptic models. In reality, human heat stress depends heavily on humidity, solar radiation flux, and wind stagnation, while urban morphology creates intense **Urban Heat Islands (UHI)** in dense, unshaded wards. Furthermore, public health impacts—such as heat-stroke admissions and cardiovascular fatalities—peak across a **2 to 5 day lag** following exposure.

**AURA-Heat** is a decision support system built for municipal administrators and disaster management authorities (tailored for the **Ahmedabad Municipal Corporation HAP**). It:

1. **Downscales Weather Data**: Enriches 0.25° weather grids with Sentinel-2 vegetation (NDVI) and impervious surface data to reflect microclimate variations.
2. **Computes Real Human Heat Stress**: Calculates international standard physiological indices (**UTCI**, **WBGT ISO 7243:2017**, and **NOAA Heat Index**).
3. **Quantifies Ward Vulnerability**: Combines socio-demographic indicators (elderly population ratio, informal settlement density, outdoor labor ratio, and tree canopy deficit).
4. **Forecasts Health Surges**: Employs Distributed Lag Non-linear Models (DLNM) with gradient boosted regression to project 5-day lagged hospital triage loads.
5. **Automates Municipal Action**: Issues automated alert triggers across WhatsApp Cloud API, SMS, water tanker routing webhooks, and power utility grids according to color-coded HAP tiers (Green, Yellow, Orange, Red).

---

## 🛠️ What Is Used in the Project

### Frontend
- **React 19 & TypeScript**: Core component-driven UI architecture with strict static typing.
- **Tailwind CSS v4**: High-performance modern utility-first responsive styling.
- **Leaflet & React-Leaflet**: Geospatial vector layer rendering, GeoJSON polygon overlays, and interactive chloropleths.
- **Lucide React**: Clean, modern iconography across all dashboards.
- **Vite 6**: Fast next-generation bundler and local development server.

### Backend & Asynchronous Services
- **Python 3.11+ & FastAPI**: Asynchronous REST API service with auto-generated OpenAPI / Swagger docs.
- **SQLAlchemy 2.0 (Async) & GeoAlchemy2**: Modern ORM layer managing spatial PostGIS tables and queries.
- **Pydantic v2**: High-speed request validation and serialization schemas.
- **Celery 5 & Celery Beat**: Asynchronous distributed task execution and scheduled 6-hour weather ingestion pipelines.
- **Redis 7**: High-throughput message broker and distributed cache.

### Spatial, GIS & Data Science
- **PostgreSQL 16 with PostGIS 3.4**: Spatial relational database storing municipal ward boundaries and geographic features.
- **GeoPandas & Shapely**: Geospatial geometry manipulation and spatial joins.
- **pythermalcomfort**: Standardized biometeorological algorithms for the Universal Thermal Climate Index (UTCI).
- **MetPy, NumPy & SciPy**: Atmospheric thermodynamics and meteorological formula calculations.
- **Scikit-learn & XGBoost**: Distributed Lag Non-linear Modeling (DLNM) and epidemiological risk regression.

### Infrastructure & Containerization
- **Docker & Docker Compose**: Multi-container stack orchestrating database, caching, workers, API, and web client.
- **Nginx**: Production reverse proxy for serving optimized static assets.

---

## 🌟 Key Capabilities

| Module | What It Does |
| :--- | :--- |
| 🗺️ **Interactive GIS Decision Map** | Ward-level choropleth visualization with dynamic layer switching (Alert Tiers, UTCI, WBGT, Vulnerability Index, Slum Density, Elderly Ratio). |
| ⏱️ **5-Day Horizon Forecaster** | Interactive slider scrubbing from $t+0$ to $t+5$ days to simulate heatwave front movement and evaluate ward escalation risks. |
| 🏥 **Hospital Triage Monitor** | Real-time ward hospital bed occupancy, heat-stroke emergency triage demand, and critical ORS/IV fluid supply reserves. |
| 💧 **Citizen Hydration & Shelter Portal** | Public-facing locator for municipal cooling centers, drinking water distribution points, and shaded civic shelters. |
| 🧮 **Biometeorology Workbench** | Standalone scientific calculator determining UTCI human thermal stress category, ISO 7243 outdoor WBGT flag, and NOAA Heat Index. |
| 🚨 **Automated Municipal Dispatch Logs** | Celery-backed dispatch history tracking alerts delivered across WhatsApp, SMS, and water tanker deployment webhooks. |

---

## 📁 Project Structure

```
aura-heat/
├── backend/                  # FastAPI service, database models & Celery tasks
│   ├── main.py               # REST API endpoints & route handlers
│   ├── thermal_engine.py     # Standalone UTCI, WBGT (ISO 7243) & Heat Index algorithms
│   ├── tasks.py              # Celery background workers (ingestion & alerts)
│   ├── models.py             # SQLAlchemy 2.0 & GeoAlchemy2 spatial tables
│   ├── schemas.py            # Pydantic v2 request/response schemas
│   └── database.py           # Async database connection session
├── docker/                   # Docker Compose & container configurations
│   ├── docker-compose.yml    # Orchestration: PostGIS, Redis, FastAPI, Celery, Web
│   ├── Dockerfile.backend    # FastAPI image definition
│   ├── Dockerfile.celery     # Worker image definition
│   └── Dockerfile.frontend   # Nginx static production build
├── gis_data/                 # Municipal spatial boundaries & seed data
│   ├── ahmedabad_wards.geojson # Ward polygon vector data
│   └── seed_gis.py           # PostGIS seeding utility
├── ml_pipeline/              # Machine learning models
│   ├── vulnerability_model.py # Microclimate downscaler & Ward Vulnerability Index (WVI)
│   └── train_dlnm.py         # Distributed Lag Non-linear Model (DLNM) + XGBoost
├── src/                      # React 19 + TypeScript frontend application
│   ├── components/           # UI modules (GIS Map, Hospital Portal, Calculator, etc.)
│   ├── data/                 # Ward spatial datasets & client-side simulation fallbacks
│   ├── utils/                # In-browser thermal & biometeorological calculation engine
│   └── App.tsx               # Main dashboard controller
└── start.sh                  # One-command auto-detect runner
```

---

## 🔌 Core API Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/v1/wards/geojson` | Streams ward polygon geometries bundled with live biometeorological and vulnerability metrics. |
| `GET` | `/api/v1/forecast/{ward_id}` | Retrieves 5-day hourly and daily physiological stress and lagged epidemiological projections. |
| `GET` | `/api/v1/hospitals/capacity` | Fetches hospital bed capacities, heat-stroke triage demand, and ORS/IV fluid supply levels. |
| `POST` | `/api/v1/alerts/dispatch` | Dispatches municipal alerts across WhatsApp Cloud API, SMS, and water/power webhooks. |
| `POST` | `/api/v1/calculate/indices` | Standalone endpoint for calculating UTCI, WBGT, and NOAA Heat Index. |
| `GET` | `/api/v1/analytics/summary` | City-wide KPI summary (ward alert counts, max temperature, tankers mobilized). |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).


