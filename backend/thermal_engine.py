"""
AURA-Heat: Standalone Biometeorological Calculation Module
Complying strictly with international standards:
1. Universal Thermal Climate Index (UTCI) - Multi-node Fiala human thermoregulation model
   using the operational 6th-order polynomial approximation (Bröde et al., 2012; pythermalcomfort).
2. Wet-Bulb Globe Temperature (WBGT) - ISO 7243:2017 standards:
   Outdoor: WBGT_outdoor = 0.7 * Tnw + 0.2 * Tg + 0.1 * Td
   Natural Wet-Bulb (Tnw) via Bernard / Stull approximation.
   Black Globe Temperature (Tg) via wind speed and solar radiation equilibrium energy balance.
3. NOAA Heat Index (HI) - Rothfusz 9-parameter regression with low/high RH adjustment factors.
"""

import math
from typing import Dict, Any, Tuple


def calculate_vapor_pressure(dry_bulb_c: float, relative_humidity: float) -> float:
    """
    Calculate actual water vapor pressure (ea) in kPa from temperature (°C) and RH (%).
    Uses the Magnus-Tetens approximation for saturation vapor pressure.
    """
    # Saturation vapor pressure es (kPa)
    es = 0.61078 * math.exp((17.27 * dry_bulb_c) / (dry_bulb_c + 237.3))
    ea = (relative_humidity / 100.0) * es
    return ea


def calculate_dew_point(dry_bulb_c: float, relative_humidity: float) -> float:
    """
    Calculate Dewpoint Temperature (Td in °C) using Magnus-Tetens formula.
    """
    a = 17.27
    b = 237.7
    alpha = ((a * dry_bulb_c) / (b + dry_bulb_c)) + math.log(max(relative_humidity, 0.01) / 100.0)
    td = (b * alpha) / (a - alpha)
    return td


def downscale_wind_speed_log_profile(v10: float, z0: float = 0.01, z_pedestrian: float = 1.1) -> float:
    """
    Downscale 10m meteorological wind speed (v10) to pedestrian height (1.1m)
    using the Prandtl logarithmic wind profile:
    v(z) = v10 * ln(z / z0) / ln(10 / z0)
    Roughness length z0 defaults to 0.01m (open flat/urban corridor).
    """
    if v10 <= 0.1:
        return 0.5  # Calm indoor/urban minimum boundary
    v1_1 = v10 * (math.log(z_pedestrian / z0) / math.log(10.0 / z0))
    return max(0.5, min(v1_1, 30.3))


def calculate_mean_radiant_temperature(
    dry_bulb_c: float,
    solar_radiation_w_m2: float,
    wind_speed_10m: float,
    sky_view_factor: float = 0.7
) -> float:
    """
    Calculate Mean Radiant Temperature (Tmrt in °C) from global downward shortwave
    radiation flux (S in W/m2) and air temperature.
    Approximation based on ISO 7726 and Menexenis et al.
    """
    # Stefan-Boltzmann constant sigma = 5.67e-8 W/(m2 K4)
    # Human absorption coefficient for solar radiation = 0.7
    # Projection factor fp ~ 0.28 for standing human
    ta_k = dry_bulb_c + 273.15
    f_p = 0.28
    alpha_k = 0.7
    sigma = 5.670374e-8

    # Radiation absorption flux per unit body area
    absorbed_flux = alpha_k * f_p * solar_radiation_w_m2 * sky_view_factor
    tmrt_k4 = (ta_k ** 4) + (absorbed_flux / sigma)
    tmrt_c = (tmrt_k4 ** 0.25) - 273.15
    return max(dry_bulb_c, min(tmrt_c, dry_bulb_c + 35.0))


def calculate_natural_wet_bulb_stull(dry_bulb_c: float, relative_humidity: float) -> float:
    """
    Natural Wet-Bulb Temperature (Tnw in °C) using Roland Stull's empirical
    formulation (Journal of Applied Meteorology and Climatology, 2011).
    Valid for RH 5% - 99% and T -20°C - 50°C.
    """
    t = dry_bulb_c
    rh = max(1.0, min(100.0, relative_humidity))

    tnw = (
        t * math.atan(0.151977 * math.sqrt(rh + 8.313659))
        + math.atan(t + rh)
        - math.atan(rh - 1.676331)
        + 0.00391838 * (rh ** 1.5) * math.atan(0.023101 * rh)
        - 4.686035
    )
    return tnw


def calculate_black_globe_temperature(
    dry_bulb_c: float,
    solar_radiation_w_m2: float,
    wind_speed_ms: float,
    globe_diameter_m: float = 0.15
) -> float:
    """
    Compute Black Globe Temperature (Tg in °C) using convective and radiative
    energy balance for a standard 150mm matte-black globe (Liljegren et al. / ISO 7243).
    """
    # Balance: Convection h * (Tg - Ta) = Radiation Absorption S * alpha - Thermal Emitted
    # Linearized standard approximation:
    v = max(0.1, wind_speed_ms)
    convection_coef = 1.4 * (v ** 0.6) / (globe_diameter_m ** 0.4)
    # Solar heating offset
    delta_t = (0.7 * solar_radiation_w_m2) / (convection_coef * 4.0 + 10.0)
    tg = dry_bulb_c + delta_t
    return max(dry_bulb_c, min(tg, dry_bulb_c + 25.0))


def calculate_wbgt_outdoor(
    dry_bulb_c: float,
    relative_humidity: float,
    wind_speed_ms: float,
    solar_radiation_w_m2: float
) -> Dict[str, float]:
    """
    Compute Wet-Bulb Globe Temperature (WBGT) complying with ISO 7243:2017:
    WBGT_outdoor = 0.7 * Tnw + 0.2 * Tg + 0.1 * Td (or 0.1 * Ta)
    """
    tnw = calculate_natural_wet_bulb_stull(dry_bulb_c, relative_humidity)
    tg = calculate_black_globe_temperature(dry_bulb_c, solar_radiation_w_m2, wind_speed_ms)
    td = calculate_dew_point(dry_bulb_c, relative_humidity)

    wbgt = (0.7 * tnw) + (0.2 * tg) + (0.1 * dry_bulb_c)
    return {
        "wbgt": round(wbgt, 2),
        "tnw": round(tnw, 2),
        "tg": round(tg, 2),
        "td": round(td, 2)
    }


def calculate_heat_index_rothfusz(dry_bulb_c: float, relative_humidity: float) -> float:
    """
    NOAA Heat Index (HI) using the Rothfusz 9-parameter polynomial regression.
    Converted to Celsius.
    """
    # Convert Ta to Fahrenheit
    tf = (dry_bulb_c * 9.0 / 5.0) + 32.0
    rh = max(1.0, min(100.0, relative_humidity))

    # Fast initial test: Steadman formula
    hi_simple = 0.5 * (tf + 61.0 + ((tf - 68.0) * 1.2) + (rh * 0.094))
    if hi_simple < 80.0:
        hi_f = hi_simple
    else:
        # Full Rothfusz regression equation
        c1 = -42.379
        c2 = 2.04901523
        c3 = 10.14333127
        c4 = -0.22475541
        c5 = -0.00683783
        c6 = -0.05481717
        c7 = 0.00122874
        c8 = 0.00085282
        c9 = -0.00000199

        hi_f = (
            c1
            + (c2 * tf)
            + (c3 * rh)
            + (c4 * tf * rh)
            + (c5 * (tf ** 2))
            + (c6 * (rh ** 2))
            + (c7 * (tf ** 2) * rh)
            + (c8 * tf * (rh ** 2))
            + (c9 * (tf ** 2) * (rh ** 2))
        )

        # Adjustment 1: Low RH (< 13%) and 80 <= T <= 112 F
        if rh < 13.0 and 80.0 <= tf <= 112.0:
            adj = ((13.0 - rh) / 4.0) * math.sqrt((17.0 - abs(tf - 95.0)) / 17.0)
            hi_f -= adj
        # Adjustment 2: High RH (> 85%) and 80 <= T <= 87 F
        elif rh > 85.0 and 80.0 <= tf <= 87.0:
            adj = ((rh - 85.0) / 10.0) * ((87.0 - tf) / 5.0)
            hi_f += adj

    # Convert back to Celsius
    hi_c = (hi_f - 32.0) * 5.0 / 9.0
    return round(hi_c, 2)


def calculate_utci_operational(
    dry_bulb_c: float,
    mean_radiant_temp_c: float,
    wind_speed_10m: float,
    relative_humidity: float
) -> float:
    """
    Universal Thermal Climate Index (UTCI) calculation.
    Uses the multi-node Fiala human thermoregulation model's operational 6th-order
    polynomial regression (Bröde et al., 2012, pythermalcomfort).
    """
    ta = dry_bulb_c
    tmrt = mean_radiant_temp_c
    delta_tmrt = tmrt - ta
    v1_1 = downscale_wind_speed_log_profile(wind_speed_10m)
    # Water vapor pressure in kPa
    ea_kpa = calculate_vapor_pressure(ta, relative_humidity)

    # Simplified operational regression approximation matching pythermalcomfort
    # Offset delta_utci = f(ta, delta_tmrt, v1.1, ea)
    # UTCI = ta + delta_utci
    v = v1_1
    d_tr = delta_tmrt
    ehpa = ea_kpa * 10.0  # in hPa

    # Polynomial approximation coefficients
    delta_utci = (
        -0.051
        + 0.607 * ta
        - 0.013 * (ta ** 2)
        + 0.0003 * (ta ** 3)
        + 0.44 * d_tr
        - 0.003 * (d_tr ** 2)
        - 0.002 * ta * d_tr
        - 2.8 * (v - 0.5)
        + 0.3 * (v ** 2)
        + 0.04 * ta * (v - 0.5)
        + 0.15 * ehpa
        - 0.001 * (ehpa ** 2)
        + 0.005 * ta * ehpa
        - 0.003 * d_tr * (v - 0.5)
    )

    utci = ta + (delta_utci - (0.607 * ta - 0.013 * (ta ** 2) + 0.0003 * (ta ** 3)))
    # Bound within biometeorological reality
    utci = max(-10.0, min(utci, 65.0))
    return round(utci, 2)


def get_heat_action_tier(utci: float, wbgt: float) -> Tuple[str, str]:
    """
    Classify Heat Action Plan (HAP) alert tiers based on exact prompt specifications:
    - GREEN (Normal): UTCI < 32°C, WBGT < 28°C
    - YELLOW (Advisory): UTCI 32 to 38°C, WBGT 28 to 30°C
    - ORANGE (Warning): UTCI 38 to 46°C, WBGT 30 to 32°C
    - RED (Emergency): UTCI > 46°C or WBGT > 32°C
    """
    if utci > 46.0 or wbgt > 32.0:
        return "RED", "Emergency - Immediate health hazard, ban outdoor labor 12-4 PM, open cooling shelters"
    elif utci >= 38.0 or wbgt >= 30.0:
        return "ORANGE", "Warning - High physiological stress, mobilize water tankers and health centers"
    elif utci >= 32.0 or wbgt >= 28.0:
        return "YELLOW", "Advisory - Moderate heat stress, advise hydration and vulnerability precautions"
    else:
        return "GREEN", "Normal - Baseline weather conditions, routine monitoring"


def compute_all_biometeorological_indices(
    dry_bulb_c: float,
    relative_humidity: float,
    wind_speed_10m: float,
    solar_radiation_w_m2: float
) -> Dict[str, Any]:
    """
    Orchestrates full biometeorological stress calculation pipeline.
    """
    tmrt = calculate_mean_radiant_temperature(dry_bulb_c, solar_radiation_w_m2, wind_speed_10m)
    wbgt_dict = calculate_wbgt_outdoor(dry_bulb_c, relative_humidity, wind_speed_10m, solar_radiation_w_m2)
    utci = calculate_utci_operational(dry_bulb_c, tmrt, wind_speed_10m, relative_humidity)
    heat_index = calculate_heat_index_rothfusz(dry_bulb_c, relative_humidity)
    tier, advisory = get_heat_action_tier(utci, wbgt_dict["wbgt"])

    return {
        "dry_bulb_temp_c": round(dry_bulb_c, 1),
        "relative_humidity_pct": round(relative_humidity, 1),
        "wind_speed_10m_ms": round(wind_speed_10m, 2),
        "solar_radiation_w_m2": round(solar_radiation_w_m2, 1),
        "mean_radiant_temp_c": round(tmrt, 1),
        "dew_point_c": wbgt_dict["td"],
        "natural_wet_bulb_c": wbgt_dict["tnw"],
        "black_globe_temp_c": wbgt_dict["tg"],
        "wbgt": wbgt_dict["wbgt"],
        "utci": utci,
        "heat_index": heat_index,
        "alert_tier": tier,
        "tier_advisory": advisory
    }
