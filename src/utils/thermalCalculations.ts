/**
 * AURA-Heat: Biometeorological & Epidemiological Calculations (TypeScript Engine)
 * Strictly matching Python thermal_engine.py and vulnerability_model.py
 */

import { AlertTier } from '../types';

export function calculateVaporPressure(dryBulbC: number, rh: number): number {
  const es = 0.61078 * Math.exp((17.27 * dryBulbC) / (dryBulbC + 237.3));
  return (rh / 100.0) * es;
}

export function calculateDewPoint(dryBulbC: number, rh: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * dryBulbC) / (b + dryBulbC)) + Math.log(Math.max(rh, 0.01) / 100.0);
  return (b * alpha) / (a - alpha);
}

export function downscaleWindSpeed(v10: number, z0 = 0.01, zPedestrian = 1.1): number {
  if (v10 <= 0.1) return 0.5;
  const v1_1 = v10 * (Math.log(zPedestrian / z0) / Math.log(10.0 / z0));
  return Math.max(0.5, Math.min(v1_1, 30.3));
}

export function calculateMeanRadiantTemperature(
  dryBulbC: number,
  solarRad: number,
  windSpeed: number,
  skyView = 0.7
): number {
  const taK = dryBulbC + 273.15;
  const fp = 0.28;
  const alphaK = 0.7;
  const sigma = 5.670374e-8;

  const absorbedFlux = alphaK * fp * solarRad * skyView;
  const tmrtK4 = Math.pow(taK, 4) + (absorbedFlux / sigma);
  const tmrtC = Math.pow(tmrtK4, 0.25) - 273.15;
  return Math.max(dryBulbC, Math.min(tmrtC, dryBulbC + 35.0));
}

export function calculateNaturalWetBulbStull(dryBulbC: number, rh: number): number {
  const t = dryBulbC;
  const h = Math.max(1.0, Math.min(100.0, rh));

  return (
    t * Math.atan(0.151977 * Math.sqrt(h + 8.313659)) +
    Math.atan(t + h) -
    Math.atan(h - 1.676331) +
    0.00391838 * Math.pow(h, 1.5) * Math.atan(0.023101 * h) -
    4.686035
  );
}

export function calculateBlackGlobeTemp(
  dryBulbC: number,
  solarRad: number,
  windSpeed: number,
  globeD = 0.15
): number {
  const v = Math.max(0.1, windSpeed);
  const convectionCoef = 1.4 * Math.pow(v, 0.6) / Math.pow(globeD, 0.4);
  const deltaT = (0.7 * solarRad) / (convectionCoef * 4.0 + 10.0);
  return Math.max(dryBulbC, Math.min(dryBulbC + deltaT, dryBulbC + 25.0));
}

export function calculateWBGTOutdoor(
  dryBulbC: number,
  rh: number,
  windSpeed: number,
  solarRad: number
): { wbgt: number; tnw: number; tg: number; td: number } {
  const tnw = calculateNaturalWetBulbStull(dryBulbC, rh);
  const tg = calculateBlackGlobeTemp(dryBulbC, solarRad, windSpeed);
  const td = calculateDewPoint(dryBulbC, rh);
  const wbgt = 0.7 * tnw + 0.2 * tg + 0.1 * dryBulbC;
  return {
    wbgt: Number(wbgt.toFixed(2)),
    tnw: Number(tnw.toFixed(2)),
    tg: Number(tg.toFixed(2)),
    td: Number(td.toFixed(2))
  };
}

export function calculateHeatIndexRothfusz(dryBulbC: number, rh: number): number {
  const tf = (dryBulbC * 9.0) / 5.0 + 32.0;
  const h = Math.max(1.0, Math.min(100.0, rh));

  const hiSimple = 0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + h * 0.094);
  let hiF = hiSimple;

  if (hiSimple >= 80.0) {
    const c1 = -42.379;
    const c2 = 2.04901523;
    const c3 = 10.14333127;
    const c4 = -0.22475541;
    const c5 = -0.00683783;
    const c6 = -0.05481717;
    const c7 = 0.00122874;
    const c8 = 0.00085282;
    const c9 = -0.00000199;

    hiF =
      c1 +
      c2 * tf +
      c3 * h +
      c4 * tf * h +
      c5 * Math.pow(tf, 2) +
      c6 * Math.pow(h, 2) +
      c7 * Math.pow(tf, 2) * h +
      c8 * tf * Math.pow(h, 2) +
      c9 * Math.pow(tf, 2) * Math.pow(h, 2);

    if (h < 13.0 && tf >= 80.0 && tf <= 112.0) {
      const adj = ((13.0 - h) / 4.0) * Math.sqrt((17.0 - Math.abs(tf - 95.0)) / 17.0);
      hiF -= adj;
    } else if (h > 85.0 && tf >= 80.0 && tf <= 87.0) {
      const adj = ((h - 85.0) / 10.0) * ((87.0 - tf) / 5.0);
      hiF += adj;
    }
  }

  const hiC = ((hiF - 32.0) * 5.0) / 9.0;
  return Number(hiC.toFixed(2));
}

export function calculateUTCI(
  dryBulbC: number,
  tmrtC: number,
  windSpeed10m: number,
  rh: number
): number {
  const ta = dryBulbC;
  const deltaTmrt = tmrtC - ta;
  const v = downscaleWindSpeed(windSpeed10m);
  const eaKpa = calculateVaporPressure(ta, rh);
  const ehpa = eaKpa * 10.0;

  const deltaUtci =
    -0.051 +
    0.607 * ta -
    0.013 * Math.pow(ta, 2) +
    0.0003 * Math.pow(ta, 3) +
    0.44 * deltaTmrt -
    0.003 * Math.pow(deltaTmrt, 2) -
    0.002 * ta * deltaTmrt -
    2.8 * (v - 0.5) +
    0.3 * Math.pow(v, 2) +
    0.04 * ta * (v - 0.5) +
    0.15 * ehpa -
    0.001 * Math.pow(ehpa, 2) +
    0.005 * ta * ehpa -
    0.003 * deltaTmrt * (v - 0.5);

  const baselinePoly = 0.607 * ta - 0.013 * Math.pow(ta, 2) + 0.0003 * Math.pow(ta, 3);
  let utci = ta + (deltaUtci - baselinePoly);
  utci = Math.max(-10.0, Math.min(utci, 65.0));
  return Number(utci.toFixed(2));
}

export function getAlertTier(utci: number, wbgt: number): { tier: AlertTier; advisory: string; color: string } {
  if (utci > 46.0 || wbgt > 32.0) {
    return {
      tier: 'RED',
      advisory: 'Emergency: Extreme physiological hazard. Mandatory 12-4 PM work ban, open cooling shelters.',
      color: '#ef4444'
    };
  } else if (utci >= 38.0 || wbgt >= 30.0) {
    return {
      tier: 'ORANGE',
      advisory: 'Warning: Severe heat strain. Mobile water tankers mobilized, ORS distribution at bus hubs.',
      color: '#f97316'
    };
  } else if (utci >= 32.0 || wbgt >= 28.0) {
    return {
      tier: 'YELLOW',
      advisory: 'Advisory: Moderate heat stress. Vulnerable elderly check-in, hydration advisories active.',
      color: '#eab308'
    };
  } else {
    return {
      tier: 'GREEN',
      advisory: 'Normal: Baseline conditions. Standard monitoring and surveillance.',
      color: '#22c55e'
    };
  }
}

export function calculateWVI(
  elderlyRatio: number,
  slumDensity: number,
  outdoorWorkerRatio: number,
  ndvi: number
): number {
  const wElderly = 0.25;
  const wSlum = 0.35;
  const wWorker = 0.25;
  const wNdvi = 0.15;
  const vegDeficit = Math.max(0.0, 1.0 - ndvi);

  const wvi =
    wElderly * elderlyRatio +
    wSlum * slumDensity +
    wWorker * outdoorWorkerRatio +
    wNdvi * vegDeficit;

  return Number(wvi.toFixed(3));
}

export function calculateAMRS(
  utciLags: number[],
  wvi: number
): { amrs: number; surgePct: number } {
  // DLNM lag weights [lag0, lag1, lag2, lag3, lag4, lag5]
  const weights = [0.22, 0.30, 0.24, 0.14, 0.07, 0.03];
  let cumulative = 0;
  for (let i = 0; i < Math.min(6, utciLags.length); i++) {
    const excess = Math.max(0, utciLags[i] - 34.0);
    cumulative += Math.pow(excess, 1.35) * weights[i];
  }
  const rawAmrs = cumulative * wvi * 3.8;
  const amrs = Number(Math.min(100.0, Math.max(0, rawAmrs)).toFixed(1));
  const surgePct = Number(Math.min(350.0, amrs * 2.8 + wvi * 30.0).toFixed(1));
  return { amrs, surgePct };
}

export function calculateAllIndices(
  ta: number,
  rh: number,
  ws: number,
  rad: number,
  clo: number = 0.5
) {
  const mrt = calculateMeanRadiantTemperature(ta, rad, ws);
  const wbgtData = calculateWBGTOutdoor(ta, rh, ws, rad);
  const utci = calculateUTCI(ta, mrt, ws, rh);
  const heat_index = calculateHeatIndexRothfusz(ta, rh);
  const dew_point = calculateDewPoint(ta, rh);

  let utci_category = 'No Thermal Stress';
  if (utci >= 46) utci_category = 'Extreme Heat Stress';
  else if (utci >= 38) utci_category = 'Very Strong Heat Stress';
  else if (utci >= 32) utci_category = 'Strong Heat Stress';
  else if (utci >= 26) utci_category = 'Moderate Heat Stress';

  let wbgt_category = 'ISO Cat 1 (Low)';
  if (wbgtData.wbgt >= 32) wbgt_category = 'ISO Cat 4 (Extreme)';
  else if (wbgtData.wbgt >= 30) wbgt_category = 'ISO Cat 3 (High)';
  else if (wbgtData.wbgt >= 28) wbgt_category = 'ISO Cat 2 (Moderate)';

  let heat_index_category = 'Caution';
  if (heat_index >= 54) heat_index_category = 'Extreme Danger';
  else if (heat_index >= 41) heat_index_category = 'Danger';
  else if (heat_index >= 32) heat_index_category = 'Extreme Caution';

  return {
    utci,
    utci_category,
    wbgt: wbgtData.wbgt,
    wbgt_category,
    heat_index,
    heat_index_category,
    mrt,
    tnw: wbgtData.tnw,
    tg: wbgtData.tg,
    dew_point
  };
}
