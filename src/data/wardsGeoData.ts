/**
 * AURA-Heat: AMC Ward Geographic & Socio-Demographic Dataset
 */

import { WardGeoJSONCollection, WardProperties, DailyForecast, HourlyForecastItem } from '../types';
import {
  calculateMeanRadiantTemperature,
  calculateWBGTOutdoor,
  calculateUTCI,
  calculateHeatIndexRothfusz,
  getAlertTier,
  calculateWVI,
  calculateAMRS
} from '../utils/thermalCalculations';

export const RAW_WARDS = [
  {
    id: 'w-01',
    ward_number: 1,
    ward_name: 'Danilimda',
    zone_name: 'South Zone',
    center: [22.9850, 72.5850] as [number, number],
    polygon: [
      [72.575, 22.995], [72.595, 22.995], [72.600, 22.975], [72.570, 22.972], [72.575, 22.995]
    ],
    population: 184500,
    elderly_ratio: 0.14,
    slum_density: 0.68,
    outdoor_worker_ratio: 0.52,
    baseline_ndvi: 0.11,
    cooling_centers_count: 4,
    water_tankers_assigned: 5,
    hospital_name: 'Shardaben Municipal General Hospital',
    cooling_center_names: ['Danilimda Urban Health Post', 'Al-Aqsa Community Hall', 'Siddheshwar Seva Sadan', 'Chisti Chaman Relief Camp']
  },
  {
    id: 'w-02',
    ward_number: 2,
    ward_name: 'Vatva',
    zone_name: 'South Zone',
    center: [22.9550, 72.6350] as [number, number],
    polygon: [
      [72.615, 22.970], [72.655, 22.970], [72.660, 22.935], [72.610, 22.940], [72.615, 22.970]
    ],
    population: 195000,
    elderly_ratio: 0.12,
    slum_density: 0.74,
    outdoor_worker_ratio: 0.58,
    baseline_ndvi: 0.09,
    cooling_centers_count: 3,
    water_tankers_assigned: 6,
    hospital_name: 'Vatva Urban Health & Trauma Centre',
    cooling_center_names: ['GIDC Worker Welfare Shelter', 'Bibitalav Community Bhavan', 'Vatva Primary Health Centre']
  },
  {
    id: 'w-03',
    ward_number: 3,
    ward_name: 'Behrampura',
    zone_name: 'South Zone',
    center: [22.9980, 72.5780] as [number, number],
    polygon: [
      [72.565, 23.010], [72.590, 23.010], [72.592, 22.985], [72.562, 22.988], [72.565, 23.010]
    ],
    population: 162000,
    elderly_ratio: 0.13,
    slum_density: 0.61,
    outdoor_worker_ratio: 0.49,
    baseline_ndvi: 0.13,
    cooling_centers_count: 3,
    water_tankers_assigned: 4,
    hospital_name: 'LG Hospital & Medical College',
    cooling_center_names: ['Calico Mills Memorial Hall', 'Behrampura Civic Dispensary', 'Dr. Ambedkar Hall']
  },
  {
    id: 'w-04',
    ward_number: 4,
    ward_name: 'Jamalpur',
    zone_name: 'Central Zone',
    center: [23.0150, 72.5800] as [number, number],
    polygon: [
      [72.570, 23.025], [72.595, 23.025], [72.595, 23.005], [72.568, 23.005], [72.570, 23.025]
    ],
    population: 142000,
    elderly_ratio: 0.16,
    slum_density: 0.45,
    outdoor_worker_ratio: 0.44,
    baseline_ndvi: 0.14,
    cooling_centers_count: 4,
    water_tankers_assigned: 3,
    hospital_name: 'VS General Hospital',
    cooling_center_names: ['Jamalpur Municipal Gymnasium', 'Flower Market Hydration Kiosk', 'Khamasa Civic Centre', 'Gita Mandir Shaded Hub']
  },
  {
    id: 'w-05',
    ward_number: 5,
    ward_name: 'Asarwa',
    zone_name: 'East Zone',
    center: [23.0480, 72.6050] as [number, number],
    polygon: [
      [72.590, 23.060], [72.625, 23.060], [72.622, 23.035], [72.588, 23.035], [72.590, 23.060]
    ],
    population: 156000,
    elderly_ratio: 0.15,
    slum_density: 0.52,
    outdoor_worker_ratio: 0.46,
    baseline_ndvi: 0.16,
    cooling_centers_count: 5,
    water_tankers_assigned: 4,
    hospital_name: 'Ahmedabad Civil Hospital (Medicity)',
    cooling_center_names: ['Medicity Trauma Relief Center', 'Chamunda Bridge Underpass Shelter', 'Asarwa Railway Colony Hall', 'Civil Hospital Waiting Hall', 'Bapunagar Relief Post']
  },
  {
    id: 'w-06',
    ward_number: 6,
    ward_name: 'Navrangpura',
    zone_name: 'West Zone',
    center: [23.0380, 72.5550] as [number, number],
    polygon: [
      [72.540, 23.055], [72.570, 23.055], [72.572, 23.025], [72.538, 23.025], [72.540, 23.055]
    ],
    population: 128000,
    elderly_ratio: 0.19,
    slum_density: 0.15,
    outdoor_worker_ratio: 0.22,
    baseline_ndvi: 0.38,
    cooling_centers_count: 6,
    water_tankers_assigned: 2,
    hospital_name: 'Sterling Hospital & Cardiac Institute',
    cooling_center_names: ['Gujarat University Convention Hall', 'LD Arts Shaded Pavillion', 'Mithakhali Civic Centre', 'Law Garden AC Community Hall', 'Stadium Hydration Post', 'Gulbai Tekra Health Kiosk']
  },
  {
    id: 'w-07',
    ward_number: 7,
    ward_name: 'Bodakdev & Thaltej',
    zone_name: 'North West Zone',
    center: [23.0500, 72.5150] as [number, number],
    polygon: [
      [72.495, 23.065], [72.535, 23.065], [72.535, 23.030], [72.492, 23.030], [72.495, 23.065]
    ],
    population: 145000,
    elderly_ratio: 0.18,
    slum_density: 0.12,
    outdoor_worker_ratio: 0.18,
    baseline_ndvi: 0.44,
    cooling_centers_count: 5,
    water_tankers_assigned: 2,
    hospital_name: 'Zydus Hospital SG Highway',
    cooling_center_names: ['SG Highway Transit Shaded Stop', 'Bodakdev AMC Ward Office', 'Thaltej Lake Amphitheatre', 'Pakwan Crossroads Hydration Station', 'Science City AC Hall']
  },
  {
    id: 'w-08',
    ward_number: 8,
    ward_name: 'Sabarmati',
    zone_name: 'West Zone',
    center: [23.0850, 72.5850] as [number, number],
    polygon: [
      [72.565, 23.105], [72.605, 23.105], [72.608, 23.065], [72.562, 23.065], [72.565, 23.105]
    ],
    population: 138000,
    elderly_ratio: 0.15,
    slum_density: 0.38,
    outdoor_worker_ratio: 0.35,
    baseline_ndvi: 0.29,
    cooling_centers_count: 4,
    water_tankers_assigned: 3,
    hospital_name: 'Sabarmati Municipal Health Center',
    cooling_center_names: ['Sabarmati Tollnaka Civic Kiosk', 'Railway Junction Shaded Waiting Area', 'Motera Stadium Road Shelter', 'Ramnagar Community Post']
  },
  {
    id: 'w-09',
    ward_number: 9,
    ward_name: 'Maninagar',
    zone_name: 'South Zone',
    center: [22.9980, 72.6050] as [number, number],
    polygon: [
      [72.592, 23.015], [72.625, 23.015], [72.625, 22.980], [72.590, 22.980], [72.592, 23.015]
    ],
    population: 172000,
    elderly_ratio: 0.17,
    slum_density: 0.34,
    outdoor_worker_ratio: 0.32,
    baseline_ndvi: 0.28,
    cooling_centers_count: 5,
    water_tankers_assigned: 3,
    hospital_name: 'Kankaria Municipal Care Center',
    cooling_center_names: ['Kankaria Lake Gate 1 Cooling Post', 'Maninagar Railway West Bhavan', 'Balvatika Civic Hall', 'Dakshini Society Centre', 'Uttamnagar Health Post']
  },
  {
    id: 'w-10',
    ward_number: 10,
    ward_name: 'Bopal-Ghuma',
    zone_name: 'South West Zone',
    center: [23.0280, 72.4650] as [number, number],
    polygon: [
      [72.440, 23.045], [72.490, 23.045], [72.490, 23.010], [72.440, 23.010], [72.440, 23.045]
    ],
    population: 168000,
    elderly_ratio: 0.13,
    slum_density: 0.22,
    outdoor_worker_ratio: 0.28,
    baseline_ndvi: 0.32,
    cooling_centers_count: 4,
    water_tankers_assigned: 3,
    hospital_name: 'Saraswati Multispeciality Center',
    cooling_center_names: ['Bopal Cross Roads BRTS Shelter', 'Ghuma Village Civic Bhavan', 'SP Ring Road Hydration Unit', 'TRP Mall AC Public Concourse']
  },
  {
    id: 'w-11',
    ward_number: 11,
    ward_name: 'Naroda & Nikol',
    zone_name: 'North Zone',
    center: [23.0720, 72.6550] as [number, number],
    polygon: [
      [72.635, 23.095], [72.680, 23.095], [72.680, 23.050], [72.630, 23.050], [72.635, 23.095]
    ],
    population: 210000,
    elderly_ratio: 0.11,
    slum_density: 0.58,
    outdoor_worker_ratio: 0.53,
    baseline_ndvi: 0.14,
    cooling_centers_count: 4,
    water_tankers_assigned: 5,
    hospital_name: 'Naroda Community Health Center',
    cooling_center_names: ['Naroda GIDC Shaded Hub', 'Nikol Raspan Arcade Relief Camp', 'Bethak Hydration Post', 'Krishnanagar Dispensary']
  },
  {
    id: 'w-12',
    ward_number: 12,
    ward_name: 'Gomtipur',
    zone_name: 'East Zone',
    center: [23.0220, 72.6180] as [number, number],
    polygon: [
      [72.605, 23.035], [72.635, 23.035], [72.635, 23.008], [72.602, 23.008], [72.605, 23.035]
    ],
    population: 158000,
    elderly_ratio: 0.14,
    slum_density: 0.65,
    outdoor_worker_ratio: 0.54,
    baseline_ndvi: 0.10,
    cooling_centers_count: 3,
    water_tankers_assigned: 5,
    hospital_name: 'Gomtipur Referral General Hospital',
    cooling_center_names: ['Mill Kamdar Relief Kendra', 'Gomtipur Darwaja Water Post', 'Sarangpur Bridge Pavilion']
  }
];

export function generateWardProperties(raw: typeof RAW_WARDS[0], horizonDay = 0): WardProperties {
  const wvi = calculateWVI(raw.elderly_ratio, raw.slum_density, raw.outdoor_worker_ratio, raw.baseline_ndvi);

  // Synoptic heatwave progression curve (simulating 5-day NWP evolution)
  const baseT2m = 39.2 + horizonDay * 1.5;
  // UHI offset from vegetation deficit and slum imperviousness
  const uhiOffset = 3.2 * (0.6 * (1 - raw.baseline_ndvi) + 0.4 * raw.slum_density) - 0.7;
  const wardT2m = Number((baseT2m + uhiOffset).toFixed(1));
  const rh = Number(Math.max(22.0, 46.0 - horizonDay * 3.8).toFixed(1));
  const wind = Number((2.8 + horizonDay * 0.25).toFixed(2));
  const solarRad = Number((810.0 + horizonDay * 28.0).toFixed(1));

  const tmrt = calculateMeanRadiantTemperature(wardT2m, solarRad, wind);
  const wbgtData = calculateWBGTOutdoor(wardT2m, rh, wind, solarRad);
  const utci = calculateUTCI(wardT2m, tmrt, wind, rh);
  const heatIndex = calculateHeatIndexRothfusz(wardT2m, rh);
  const { tier, advisory } = getAlertTier(utci, wbgtData.wbgt);

  // DLNM 5-day lag impact series
  const utciLags = [
    utci,
    utci - 1.1,
    utci - 2.2,
    utci - 3.4,
    36.5,
    34.8
  ];
  const { amrs, surgePct } = calculateAMRS(utciLags, wvi);

  return {
    ward_id: raw.id,
    ward_number: raw.ward_number,
    ward_name: raw.ward_name,
    zone_name: raw.zone_name,
    population_total: raw.population,
    elderly_ratio: raw.elderly_ratio,
    slum_density: raw.slum_density,
    outdoor_worker_ratio: raw.outdoor_worker_ratio,
    baseline_ndvi: raw.baseline_ndvi,
    wvi_score: wvi,
    dry_bulb_temp: wardT2m,
    relative_humidity: rh,
    wind_speed: wind,
    solar_radiation: solarRad,
    utci,
    max_wbgt: wbgtData.wbgt,
    heat_index: heatIndex,
    alert_tier: tier,
    tier_advisory: advisory,
    mortality_risk_score: amrs,
    projected_hospitalizations_surge_pct: surgePct,
    cooling_centers_count: raw.cooling_centers_count,
    water_tankers_assigned: raw.water_tankers_assigned,
    hospital_name: raw.hospital_name
  };
}

export function getWardsGeoJSON(horizonDay = 0): WardGeoJSONCollection {
  return {
    type: 'FeatureCollection',
    features: RAW_WARDS.map((w) => ({
      type: 'Feature',
      id: w.id,
      properties: generateWardProperties(w, horizonDay),
      geometry: {
        type: 'Polygon',
        coordinates: [w.polygon]
      }
    }))
  };
}

export function getWardForecastDetails(wardId: string): { details: WardProperties; daily: DailyForecast[]; hourly: HourlyForecastItem[] } {
  const raw = RAW_WARDS.find((w) => w.id === wardId) || RAW_WARDS[0];
  const currentProps = generateWardProperties(raw, 0);

  const dayNames = ['Today (t+0)', 'Tomorrow (t+1)', 't+2 Days', 't+3 Days', 't+4 Days', 't+5 Days'];
  const today = new Date();

  const daily: DailyForecast[] = Array.from({ length: 6 }).map((_, h) => {
    const d = new Date(today);
    d.setDate(d.getDate() + h);
    const dateStr = d.toISOString().split('T')[0];
    const p = generateWardProperties(raw, h);
    return {
      day: dayNames[h],
      date: dateStr,
      horizon_day: h,
      max_dry_bulb_c: p.dry_bulb_temp,
      avg_utci: p.utci,
      max_wbgt: p.max_wbgt,
      mortality_risk_score: p.mortality_risk_score,
      projected_hospitalization_surge_pct: p.projected_hospitalizations_surge_pct,
      alert_tier: p.alert_tier,
      advisory: p.tier_advisory
    };
  });

  const hourly: HourlyForecastItem[] = [];
  for (let hr = 6; hr <= 20; hr++) {
    const solarFactor = Math.max(0, 1 - Math.pow(Math.abs(hr - 14) / 8, 1.6));
    const t = Number((31.5 + raw.elderly_ratio * 3 + solarFactor * 12.0).toFixed(1));
    const rh = Number((58.0 - solarFactor * 30.0).toFixed(1));
    const wind = Number((2.5 + (hr > 12 ? 1.0 : 0.2)).toFixed(1));
    const s = Number((960.0 * solarFactor).toFixed(1));

    const tmrt = calculateMeanRadiantTemperature(t, s, wind);
    const wbgt = calculateWBGTOutdoor(t, rh, wind, s).wbgt;
    const utci = calculateUTCI(t, tmrt, wind, rh);
    const hi = calculateHeatIndexRothfusz(t, rh);
    const tier = getAlertTier(utci, wbgt).tier;

    hourly.push({
      hour: hr,
      dry_bulb_temp_c: t,
      relative_humidity_pct: rh,
      wind_speed_ms: wind,
      solar_radiation_w_m2: s,
      utci,
      wbgt,
      heat_index: hi,
      tier
    });
  }

  return { details: currentProps, daily, hourly };
}
