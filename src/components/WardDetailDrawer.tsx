/**
 * AURA-Heat: Ward Detail Slide-Over Drawer
 * Professional Polish Design Theme
 */

import React, { useState } from 'react';
import {
  X,
  Thermometer,
  Flame,
  AlertTriangle,
  Send,
  Truck,
  Building2,
  Activity,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { WardProperties } from '../types';
import { getWardForecastDetails } from '../data/wardsGeoData';

interface WardDetailDrawerProps {
  wardId: string | null;
  onClose: () => void;
  onDispatchAlert: (wardId: string, wardName: string, channel: string) => void;
}

export const WardDetailDrawer: React.FC<WardDetailDrawerProps> = ({
  wardId,
  onClose,
  onDispatchAlert
}) => {
  if (!wardId) return null;

  const { details, daily } = getWardForecastDetails(wardId);
  const [activeTab, setActiveTab] = useState<'METRICS' | 'LAGGED_CURVE' | 'DISPATCH'>('METRICS');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAction = (type: string, name: string) => {
    onDispatchAlert(wardId, details.ward_name, type);
    setActionFeedback(`${name} triggered successfully for ${details.ward_name}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'RED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'ORANGE':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'YELLOW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[2000] w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-800 overflow-hidden">
      {/* Header matching Professional Polish layout */}
      <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">Ward Detail</h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${getTierBadge(details.alert_tier)}`}>
              {details.alert_tier} Alert
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {details.ward_name} (Ward #{details.ward_number}) • {details.zone_name}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="mx-5 mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{actionFeedback}</span>
        </div>
      )}

      {/* Clean Tabs */}
      <div className="flex border-b border-slate-200 px-5 bg-slate-50/50 text-xs font-semibold shrink-0">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`py-3 px-3 border-b-2 transition-colors ${
            activeTab === 'METRICS'
              ? 'border-orange-500 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Thermal & Risk
        </button>
        <button
          onClick={() => setActiveTab('LAGGED_CURVE')}
          className={`py-3 px-3 border-b-2 transition-colors ${
            activeTab === 'LAGGED_CURVE'
              ? 'border-orange-500 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          5-Day DLNM Lag
        </button>
        <button
          onClick={() => setActiveTab('DISPATCH')}
          className={`py-3 px-3 border-b-2 transition-colors ${
            activeTab === 'DISPATCH'
              ? 'border-orange-500 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Municipal Actions
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {activeTab === 'METRICS' && (
          <>
            {/* Primary Stress Indicators in Professional Polish card grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UTCI Index</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{details.utci}°C</p>
                <span className="text-[9px] text-red-600 font-bold uppercase">
                  {details.utci >= 46 ? 'Extreme Stress' : 'Very Strong Stress'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WBGT</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{details.max_wbgt}°C</p>
                <span className="text-[9px] text-orange-600 font-bold uppercase">
                  {details.max_wbgt >= 32 ? 'Rest Schedule 75%' : 'Rest Schedule 50%'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NOAA Heat Index</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{details.heat_index}°C</p>
                <span className="text-[9px] text-amber-600 font-bold uppercase">Danger Category</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dry-Bulb Temp</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{details.dry_bulb_temp}°C</p>
                <span className="text-[9px] text-slate-500 font-medium">Ambient + UHI</span>
              </div>
            </div>

            {/* Epidemiological Forecast Section */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Epidemiological Forecast
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-600">Mortality Risk (AMRS)</span>
                    <span className="text-red-600 font-bold">{(details.mortality_risk_score / 100).toFixed(2)} / 1.0</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${details.mortality_risk_score}%` }}
                    />
                  </div>
                </div>

                {/* Vulnerability Metrics Box matching Design HTML */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Vulnerability Metrics (WVI: {details.wvi_score})
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <p className="text-[9px] text-slate-500">Elderly (&gt;65y)</p>
                      <p className="font-bold text-slate-900">{Math.round(details.elderly_ratio * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500">Outdoor Workers</p>
                      <p className="font-bold text-slate-900">{Math.round(details.outdoor_worker_ratio * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500">Slum Density</p>
                      <p className="font-bold text-red-600">
                        {details.slum_density > 0.5 ? 'High' : 'Moderate'} ({Math.round(details.slum_density * 100)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500">NDVI Green Canopy</p>
                      <p className="font-bold text-slate-900">{details.baseline_ndvi} (Low)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Parameters */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Micro-Meteorological Parameters
              </p>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600 mx-auto mb-1" />
                  <div className="text-[9px] text-slate-400">Humidity</div>
                  <div className="font-bold text-slate-800">{details.relative_humidity}%</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Wind className="w-3.5 h-3.5 text-slate-600 mx-auto mb-1" />
                  <div className="text-[9px] text-slate-400">Wind v10</div>
                  <div className="font-bold text-slate-800">{details.wind_speed} m/s</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Sun className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                  <div className="text-[9px] text-slate-400">Solar Rad</div>
                  <div className="font-bold text-slate-800">{details.solar_radiation} W/m²</div>
                </div>
              </div>
            </div>

            {/* Municipal Action Directive */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs">
              <div className="font-bold text-orange-900 flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-orange-600" />
                Municipal Heat Action Directive
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">{details.tier_advisory}</p>
            </div>
          </>
        )}

        {activeTab === 'LAGGED_CURVE' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                <Activity className="w-4 h-4 text-red-600" />
                DLNM Distributed Lag Epidemiological Forecast
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Gasparrini non-linear model capturing delayed heat-induced mortality and hospital surge across 5 exposure lag days.
              </p>
            </div>

            {/* Daily Forecast List */}
            <div className="space-y-2">
              {daily.map((d, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{d.day}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({d.date})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                      <span>Max Temp: <b className="text-slate-800">{d.max_dry_bulb_c}°C</b></span>
                      <span>UTCI: <b className="text-orange-600">{d.avg_utci}°C</b></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-red-600">
                      +{d.projected_hospitalization_surge_pct}% Surge
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      AMRS: <b>{d.mortality_risk_score}</b>/100
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual surge bars */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Projected 5-Day Hospital Surge Trajectory
              </p>
              <div className="flex items-end justify-between h-24 gap-2 pt-2 border-b border-slate-200">
                {daily.map((d, i) => {
                  const height = Math.min(100, Math.max(15, (d.projected_hospitalization_surge_pct / 200) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] text-red-600 font-bold">{d.projected_hospitalization_surge_pct}%</span>
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-orange-500 to-red-600"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[9px] text-slate-500 mt-1">T+{i}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DISPATCH' && (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Municipal Action Triggers
              </h4>
              <p className="text-slate-500 text-[11px] mb-3">
                Immediate event-driven triggers routed through Celery and municipal APIs.
              </p>
            </div>

            {/* WhatsApp Trigger matching Design HTML: w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-200 uppercase tracking-wide */}
            <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-slate-900">Multi-Channel WhatsApp & SMS Broadcast</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Dispatches regional language alerts to labor contractors and gig platforms for {details.ward_name}.
              </p>
              <button
                onClick={() => handleAction('WHATSAPP', 'WhatsApp Broadcast')}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm uppercase tracking-wide transition-colors"
              >
                Dispatch Ward WhatsApp
              </button>
            </div>

            {/* Secondary Action Buttons matching Design HTML: grid grid-cols-2 gap-2 */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAction('WATER_TANKER', 'Water Tanker Mobilization')}
                className="py-2.5 px-3 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold rounded-lg uppercase hover:bg-slate-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
              >
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Route Water (+2 Units)</span>
              </button>

              <button
                onClick={() => handleAction('COOLING_SHELTER', 'Cooling Shelter Activation')}
                className="py-2.5 px-3 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold rounded-lg uppercase hover:bg-slate-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
              >
                <Building2 className="w-4 h-4 text-cyan-600" />
                <span>Open Shelter (24/7)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <span>Population: <b>{details.population_total.toLocaleString()}</b></span>
        <span>Referral: <b>{details.hospital_name.slice(0, 22)}...</b></span>
      </div>
    </div>
  );
};
