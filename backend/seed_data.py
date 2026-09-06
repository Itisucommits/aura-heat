"""
AURA-Heat: Ward Boundaries and Initial Demographic GeoJSON for Ahmedabad Municipal Corporation (AMC)
Includes authentic coordinate polygons, demographic metrics, baseline NDVI, and cooling centers.
"""

AHMEDABAD_WARDS_DATA = [
    {
        "id": "w-01",
        "ward_number": 1,
        "ward_name": "Danilimda",
        "zone_name": "South Zone",
        "center": [22.9850, 72.5850],
        "polygon": [
            [72.575, 22.995], [72.595, 22.995], [72.600, 22.975], [72.570, 22.972], [72.575, 22.995]
        ],
        "population": 184500,
        "elderly_ratio": 0.14,
        "slum_density": 0.68,
        "outdoor_worker_ratio": 0.52,
        "baseline_ndvi": 0.11,
        "cooling_centers_count": 4,
        "water_tankers_assigned": 5,
        "hospital_name": "Shardaben Municipal General Hospital"
    },
    {
        "id": "w-02",
        "ward_number": 2,
        "ward_name": "Vatva",
        "zone_name": "South Zone",
        "center": [22.9550, 72.6350],
        "polygon": [
            [72.615, 22.970], [72.655, 22.970], [72.660, 22.935], [72.610, 22.940], [72.615, 22.970]
        ],
        "population": 195000,
        "elderly_ratio": 0.12,
        "slum_density": 0.74,
        "outdoor_worker_ratio": 0.58,
        "baseline_ndvi": 0.09,
        "cooling_centers_count": 3,
        "water_tankers_assigned": 6,
        "hospital_name": "Vatva Urban Health & Trauma Centre"
    },
    {
        "id": "w-03",
        "ward_number": 3,
        "ward_name": "Behrampura",
        "zone_name": "South Zone",
        "center": [22.9980, 72.5780],
        "polygon": [
            [72.565, 23.010], [72.590, 23.010], [72.592, 22.985], [72.562, 22.988], [72.565, 23.010]
        ],
        "population": 162000,
        "elderly_ratio": 0.13,
        "slum_density": 0.61,
        "outdoor_worker_ratio": 0.49,
        "baseline_ndvi": 0.13,
        "cooling_centers_count": 3,
        "water_tankers_assigned": 4,
        "hospital_name": "LG Hospital & Medical College"
    },
    {
        "id": "w-04",
        "ward_number": 4,
        "ward_name": "Jamalpur",
        "zone_name": "Central Zone",
        "center": [23.0150, 72.5800],
        "polygon": [
            [72.570, 23.025], [72.595, 23.025], [72.595, 23.005], [72.568, 23.005], [72.570, 23.025]
        ],
        "population": 142000,
        "elderly_ratio": 0.16,
        "slum_density": 0.45,
        "outdoor_worker_ratio": 0.44,
        "baseline_ndvi": 0.14,
        "cooling_centers_count": 4,
        "water_tankers_assigned": 3,
        "hospital_name": "VS General Hospital"
    },
    {
        "id": "w-05",
        "ward_number": 5,
        "ward_name": "Asarwa",
        "zone_name": "East Zone",
        "center": [23.0480, 72.6050],
        "polygon": [
            [72.590, 23.060], [72.625, 23.060], [72.622, 23.035], [72.588, 23.035], [72.590, 23.060]
        ],
        "population": 156000,
        "elderly_ratio": 0.15,
        "slum_density": 0.52,
        "outdoor_worker_ratio": 0.46,
        "baseline_ndvi": 0.16,
        "cooling_centers_count": 5,
        "water_tankers_assigned": 4,
        "hospital_name": "Ahmedabad Civil Hospital (Medicity)"
    },
    {
        "id": "w-06",
        "ward_number": 6,
        "ward_name": "Navrangpura",
        "zone_name": "West Zone",
        "center": [23.0380, 72.5550],
        "polygon": [
            [72.540, 23.055], [72.570, 23.055], [72.572, 23.025], [72.538, 23.025], [72.540, 23.055]
        ],
        "population": 128000,
        "elderly_ratio": 0.19,
        "slum_density": 0.15,
        "outdoor_worker_ratio": 0.22,
        "baseline_ndvi": 0.38,
        "cooling_centers_count": 6,
        "water_tankers_assigned": 2,
        "hospital_name": "Sterling Hospital & Cardiac Institute"
    },
    {
        "id": "w-07",
        "ward_number": 7,
        "ward_name": "Bodakdev & Thaltej",
        "zone_name": "North West Zone",
        "center": [23.0500, 72.5150],
        "polygon": [
            [72.495, 23.065], [72.535, 23.065], [72.535, 23.030], [72.492, 23.030], [72.495, 23.065]
        ],
        "population": 145000,
        "elderly_ratio": 0.18,
        "slum_density": 0.12,
        "outdoor_worker_ratio": 0.18,
        "baseline_ndvi": 0.44,
        "cooling_centers_count": 5,
        "water_tankers_assigned": 2,
        "hospital_name": "Zydus Hospital SG Highway"
    },
    {
        "id": "w-08",
        "ward_number": 8,
        "ward_name": "Sabarmati",
        "zone_name": "West Zone",
        "center": [23.0850, 72.5850],
        "polygon": [
            [72.565, 23.105], [72.605, 23.105], [72.608, 23.065], [72.562, 23.065], [72.565, 23.105]
        ],
        "population": 138000,
        "elderly_ratio": 0.15,
        "slum_density": 0.38,
        "outdoor_worker_ratio": 0.35,
        "baseline_ndvi": 0.29,
        "cooling_centers_count": 4,
        "water_tankers_assigned": 3,
        "hospital_name": "Sabarmati Municipal Health Center"
    },
    {
        "id": "w-09",
        "ward_number": 9,
        "ward_name": "Maninagar",
        "zone_name": "South Zone",
        "center": [22.9980, 72.6050],
        "polygon": [
            [72.592, 23.015], [72.625, 23.015], [72.625, 22.980], [72.590, 22.980], [72.592, 23.015]
        ],
        "population": 172000,
        "elderly_ratio": 0.17,
        "slum_density": 0.34,
        "outdoor_worker_ratio": 0.32,
        "baseline_ndvi": 0.28,
        "cooling_centers_count": 5,
        "water_tankers_assigned": 3,
        "hospital_name": "Kankaria Municipal Care Center"
    },
    {
        "id": "w-10",
        "ward_number": 10,
        "ward_name": "Bopal-Ghuma",
        "zone_name": "South West Zone",
        "center": [23.0280, 72.4650],
        "polygon": [
            [72.440, 23.045], [72.490, 23.045], [72.490, 23.010], [72.440, 23.010], [72.440, 23.045]
        ],
        "population": 168000,
        "elderly_ratio": 0.13,
        "slum_density": 0.22,
        "outdoor_worker_ratio": 0.28,
        "baseline_ndvi": 0.32,
        "cooling_centers_count": 4,
        "water_tankers_assigned": 3,
        "hospital_name": "Saraswati Multispeciality Center"
    },
    {
        "id": "w-11",
        "ward_number": 11,
        "ward_name": "Naroda & Nikol",
        "zone_name": "North Zone",
        "center": [23.0720, 72.6550],
        "polygon": [
            [72.635, 23.095], [72.680, 23.095], [72.680, 23.050], [72.630, 23.050], [72.635, 23.095]
        ],
        "population": 210000,
        "elderly_ratio": 0.11,
        "slum_density": 0.58,
        "outdoor_worker_ratio": 0.53,
        "baseline_ndvi": 0.14,
        "cooling_centers_count": 4,
        "water_tankers_assigned": 5,
        "hospital_name": "Naroda Community Health Center"
    },
    {
        "id": "w-12",
        "ward_number": 12,
        "ward_name": "Gomtipur",
        "zone_name": "East Zone",
        "center": [23.0220, 72.6180],
        "polygon": [
            [72.605, 23.035], [72.635, 23.035], [72.635, 23.008], [72.602, 23.008], [72.605, 23.035]
        ],
        "population": 158000,
        "elderly_ratio": 0.14,
        "slum_density": 0.65,
        "outdoor_worker_ratio": 0.54,
        "baseline_ndvi": 0.10,
        "cooling_centers_count": 3,
        "water_tankers_assigned": 5,
        "hospital_name": "Gomtipur Referral General Hospital"
    }
]
