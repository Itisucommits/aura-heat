"""
AURA-Heat: GIS Data Seeder
Loads municipal GeoJSON ward boundaries into PostgreSQL / PostGIS database.
"""

import json
import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv(
    "DATABASE_URL_SYNC",
    "postgresql://aura_user:aura_secret_password@localhost:5432/aura_heat_db"
)


def seed_wards_geojson():
    geojson_path = os.path.join(os.path.dirname(__file__), "ahmedabad_wards.geojson")
    with open(geojson_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Loaded {len(data['features'])} wards from GeoJSON. Connecting to database...")
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            for feature in data["features"]:
                props = feature["properties"]
                geom_str = json.dumps(feature["geometry"])
                query = text("""
                    INSERT INTO wards (
                        ward_number, ward_name, zone_name, geom,
                        population_total, elderly_population, slum_density,
                        outdoor_worker_density, baseline_ndvi, wvi_score
                    ) VALUES (
                        :num, :name, :zone, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326),
                        :pop, :elderly, :slum, :outdoor, :ndvi, :wvi
                    ) ON CONFLICT (ward_number) DO UPDATE SET
                        ward_name = EXCLUDED.ward_name,
                        population_total = EXCLUDED.population_total;
                """)
                conn.execute(query, {
                    "num": props["ward_number"],
                    "name": props["ward_name"],
                    "zone": props["zone_name"],
                    "geom": geom_str,
                    "pop": props["population"],
                    "elderly": int(props["population"] * props["elderly_ratio"]),
                    "slum": props["slum_density"],
                    "outdoor": props["outdoor_worker_ratio"],
                    "ndvi": props["baseline_ndvi"],
                    "wvi": 0.5
                })
            conn.commit()
        print("GIS seed completed successfully!")
    except Exception as e:
        print(f"Direct PostGIS connection bypassed or database not yet spun up: {e}")
        print("Static GeoJSON remains available for zero-dependency operation.")


if __name__ == "__main__":
    seed_wards_geojson()
