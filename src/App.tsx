/**
 * AURA-Heat: Adaptive Urban Risk and Automated Heatwave Advisory System
 * Ahmedabad Municipal Corporation (AMC) Geospatial Decision Support Engine
 * Professional Polish Design Theme
 */

import React, { useState, useMemo } from 'react';
import {
  Map,
  HeartPulse,
  Users,
  Calculator,
  ShieldAlert,
  Server,
  Flame,
  Layers,
  Activity,
  AlertCircle,
  Truck,
  Building2,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';
import { MapGISView } from './components/MapGISView';
import { TimeSlider } from './components/TimeSlider';
import { WardDetailDrawer } from './components/WardDetailDrawer';
import { HospitalPortal } from './components/HospitalPortal';
import { CitizenPortal } from './components/CitizenPortal';
import { BiometeorologyCalculator } from './components/BiometeorologyCalculator';
import { AlertDispatchLogs } from './components/AlertDispatchLogs';
import { HostingGuideModal } from './components/HostingGuideModal';
import { RAW_WARDS, generateWardProperties } from './data/wardsGeoData';
import { AlertLogItem } from './types';

type ActiveView = 'GIS_MAP' | 'HOSPITAL' | 'CITIZEN' | 'CALCULATOR' | 'DISPATCH_LOGS';
type ActiveLayer = 'TIER' | 'UTCI' | 'WBGT' | 'WVI' | 'SLUMS' | 'ELDERLY';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('GIS_MAP');
  const [horizonDay, setHorizonDay] = useState<number>(0);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('TIER');
  const [showCoolingCenters, setShowCoolingCenters] = useState<boolean>(true);
  const [showWaterTankers, setShowWaterTankers] = useState<boolean>(true);
  const [isHostingModalOpen, setIsHostingModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic municipal audit logs state
  const [alertLogs, setAlertLogs] = useState<AlertLogItem[]>([
    {
      task_id: 'celery-task-9f2b841a0e',
      target_tier: 'RED',
      channels: ['WHATSAPP', 'SMS', 'WATER_WEBHOOK', 'POWER_WEBHOOK'],
      dispatched_wards_count: 3,
      status: 'DELIVERED',
      timestamp: '11:30:00 AM',
      sample_ward: 'Danilimda (Ward #1)',
      message_preview: '⚠️ AMC હીટ એક્શન પ્લાન - રેડ એલર્ટ: Danilimda માં બપોરે 12 થી 4 વાગ્યા દરમિયાન બહાર શ્રમ કાર્ય કરવાની મનાઈ છે.'
    },
    {
      task_id: 'celery-task-3a8c179d4f',
      target_tier: 'RED',
      channels: ['WHATSAPP', 'WATER_WEBHOOK'],
      dispatched_wards_count: 2,
      status: 'DELIVERED',
      timestamp: '10:45:12 AM',
      sample_ward: 'Vatva (Ward #2)',
      message_preview: '⚠️ AMC Red Alert: Vatva industrial sector - outdoor physical labor suspended between 12-4 PM.'
    }
  ]);

  // Generate ward dataset dynamically based on current horizon day (t+0 to t+5)
  const currentWards = useMemo(() => {
    return RAW_WARDS.map((w) => generateWardProperties(w, horizonDay));
  }, [horizonDay]);

  // Aggregate statistics across AMC
  const cityStats = useMemo(() => {
    const redCount = currentWards.filter((w) => w.alert_tier === 'RED').length;
    const orangeCount = currentWards.filter((w) => w.alert_tier === 'ORANGE').length;
    const yellowCount = currentWards.filter((w) => w.alert_tier === 'YELLOW').length;
    const greenCount = currentWards.filter((w) => w.alert_tier === 'GREEN').length;

    const maxTemp = Math.max(...currentWards.map((w) => w.dry_bulb_temp));
    const maxUtci = Math.max(...currentWards.map((w) => w.utci));
    const maxAmrs = Math.max(...currentWards.map((w) => w.mortality_risk_score));
    const totalTankers = currentWards.reduce((acc, w) => acc + w.water_tankers_assigned, 0);
    const totalShelters = currentWards.reduce((acc, w) => acc + w.cooling_centers_count, 0);

    const highestRiskWard = currentWards.reduce((prev, curr) =>
      curr.mortality_risk_score > prev.mortality_risk_score ? curr : prev
    );

    return {
      redCount,
      orangeCount,
      yellowCount,
      greenCount,
      maxTemp,
      maxUtci,
      maxAmrs,
      totalTankers,
      totalShelters,
      highestRiskWard
    };
  }, [currentWards]);

  // Dispatch alert handler
  const handleDispatchAlert = (wardId: string, wardName: string, channel: string) => {
    const targetWard = currentWards.find((w) => w.ward_id === wardId);
    const tier = targetWard?.alert_tier || 'RED';

    const newLog: AlertLogItem = {
      task_id: `celery-task-${Math.random().toString(36).substring(2, 11)}`,
      target_tier: tier,
      channels: [channel],
      dispatched_wards_count: 1,
      status: 'DELIVERED',
      timestamp: new Date().toLocaleTimeString(),
      sample_ward: `${wardName} (Ward #${targetWard?.ward_number || 1})`,
      message_preview: `⚠️ AMC Heat Action Plan - ${tier} Alert: Triggered ${channel} broadcast for ${wardName}. Mandatory 12-4 PM rest breaks enforced.`
    };

    setAlertLogs((prev) => [newLog, ...prev]);
    setToastMessage(`Dispatched ${channel} protocol for ${wardName}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCitywideBroadcast = () => {
    const redWards = currentWards.filter((w) => w.alert_tier === 'RED' || w.alert_tier === 'ORANGE');
    const newLog: AlertLogItem = {
      task_id: `celery-citywide-${Math.random().toString(36).substring(2, 10)}`,
      target_tier: 'RED',
      channels: ['WHATSAPP', 'SMS', 'WATER_WEBHOOK', 'POWER_WEBHOOK'],
      dispatched_wards_count: redWards.length,
      status: 'DELIVERED',
      timestamp: new Date().toLocaleTimeString(),
      sample_ward: `Citywide Emergency (${redWards.length} High-Risk Wards)`,
      message_preview: `⚠️ AMC EMERGENCY HEAT ACTION: Extreme heatwave conditions across ${redWards.length} wards. Outdoor labor ban active 12-4 PM. Tankers routed.`
    };

    setAlertLogs((prev) => [newLog, ...prev]);
    setToastMessage(`Citywide broadcast successfully dispatched to ${redWards.length} high-risk wards!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans">
      {/* Top Operations Header (Professional Polish dark navy bar) */}
      <header className="h-16 bg-[#0f172a] text-white px-6 flex items-center justify-between border-b border-slate-800 shrink-0 z-[1500] sticky top-0 shadow-md">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-lg text-white shadow-sm">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none uppercase tracking-wider text-white">
              AURA-Heat
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
              Adaptive Urban Risk & Automated Advisory
            </p>
          </div>
        </div>

        {/* Center Primary Views Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('GIS_MAP')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'GIS_MAP'
                ? 'bg-orange-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>GIS Command Map</span>
          </button>

          <button
            onClick={() => setActiveView('HOSPITAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'HOSPITAL'
                ? 'bg-orange-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Hospital Preparedness</span>
          </button>

          <button
            onClick={() => setActiveView('CITIZEN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'CITIZEN'
                ? 'bg-orange-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </button>

          <button
            onClick={() => setActiveView('CALCULATOR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'CALCULATOR'
                ? 'bg-orange-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Biometeorology</span>
          </button>

          <button
            onClick={() => setActiveView('DISPATCH_LOGS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'DISPATCH_LOGS'
                ? 'bg-orange-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
            {alertLogs.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                {alertLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Status Indicators & Location */}
        <div className="flex gap-4 sm:gap-6 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            <span className="text-xs font-semibold text-red-100 uppercase tracking-tight hidden sm:inline">
              Active Emergency: {cityStats.redCount > 0 ? `Red Level ${cityStats.redCount}` : 'Orange Level 4'}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-700 hidden sm:block" />

          <div className="text-right hidden md:block">
            <p className="text-xs font-bold leading-none text-slate-100">Ahmedabad, GJ</p>
            <p className="text-[10px] text-slate-400 mt-1">AMC Operations Center</p>
          </div>

          <button
            onClick={() => setIsHostingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Host / Share</span>
          </button>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs shrink-0">
        <button
          onClick={() => setActiveView('GIS_MAP')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeView === 'GIS_MAP' ? 'bg-orange-500 text-white font-bold' : 'text-slate-300'
          }`}
        >
          GIS Command Map
        </button>
        <button
          onClick={() => setActiveView('HOSPITAL')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeView === 'HOSPITAL' ? 'bg-orange-500 text-white font-bold' : 'text-slate-300'
          }`}
        >
          Hospital Preparedness
        </button>
        <button
          onClick={() => setActiveView('CITIZEN')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeView === 'CITIZEN' ? 'bg-orange-500 text-white font-bold' : 'text-slate-300'
          }`}
        >
          Citizen Portal
        </button>
        <button
          onClick={() => setActiveView('CALCULATOR')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeView === 'CALCULATOR' ? 'bg-orange-500 text-white font-bold' : 'text-slate-300'
          }`}
        >
          Biometeorology
        </button>
        <button
          onClick={() => setActiveView('DISPATCH_LOGS')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeView === 'DISPATCH_LOGS' ? 'bg-orange-500 text-white font-bold' : 'text-slate-300'
          }`}
        >
          Audit Logs ({alertLogs.length})
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[2500] bg-slate-900 text-white border border-orange-500/40 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        {activeView === 'GIS_MAP' && (
          <>
            {/* Citywide Indicators Overview (Professional Polish cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Peak Air Temp
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{cityStats.maxTemp}°C</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (cityStats.maxTemp / 50) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Felt Stress (UTCI)
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">{cityStats.maxUtci}°C</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (cityStats.maxUtci / 50) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Red Alert Wards
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{cityStats.redCount} / 12</p>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                  {cityStats.orangeCount} Orange • {cityStats.yellowCount} Yellow
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Mortality Risk (AMRS)
                </p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{cityStats.maxAmrs} / 100</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full"
                    style={{ width: `${cityStats.maxAmrs}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Active Shelters
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{cityStats.totalShelters} Hubs</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-1.5">Free AC & ORS</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Water Tankers
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{cityStats.totalTankers} Fleet</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1.5">Slum routes active</p>
              </div>
            </div>

            {/* GIS Map Command Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Center Map & Scrubber Area */}
              <div className="lg:col-span-8 space-y-4 flex flex-col">
                {/* Risk Layer Controls Bar */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      Risk Layers:
                    </span>
                    <button
                      onClick={() => setActiveLayer('TIER')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeLayer === 'TIER'
                          ? 'bg-[#0f172a] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Alert Tier (Choropleth)
                    </button>
                    <button
                      onClick={() => setActiveLayer('UTCI')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeLayer === 'UTCI'
                          ? 'bg-[#0f172a] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Stress (UTCI)
                    </button>
                    <button
                      onClick={() => setActiveLayer('WBGT')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeLayer === 'WBGT'
                          ? 'bg-[#0f172a] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      WBGT Stress
                    </button>
                    <button
                      onClick={() => setActiveLayer('WVI')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeLayer === 'WVI'
                          ? 'bg-[#0f172a] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Vulnerability (WVI)
                    </button>
                    <button
                      onClick={() => setActiveLayer('SLUMS')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeLayer === 'SLUMS'
                          ? 'bg-[#0f172a] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Slum Density
                    </button>
                  </div>

                  {/* POI Overlay Checkboxes */}
                  <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={showCoolingCenters}
                        onChange={(e) => setShowCoolingCenters(e.target.checked)}
                        className="rounded border-slate-300 text-orange-500 focus:ring-0"
                      />
                      <span>Cooling (❄)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={showWaterTankers}
                        onChange={(e) => setShowWaterTankers(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span>Tankers (💧)</span>
                    </label>
                  </div>
                </div>

                {/* Map Frame */}
                <div className="h-[520px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white relative">
                  <MapGISView
                    wardData={currentWards}
                    selectedWardId={selectedWardId}
                    onSelectWard={(id) => setSelectedWardId(id)}
                    activeLayer={activeLayer}
                    showCoolingCenters={showCoolingCenters}
                    showWaterTankers={showWaterTankers}
                  />
                </div>

                {/* 5-Day Horizon Time Scrubber */}
                <TimeSlider
                  horizonDay={horizonDay}
                  onHorizonChange={(d) => setHorizonDay(d)}
                  peakDay={3}
                />
              </div>

              {/* Right Column: High Risk Alert & Ward Inspector */}
              <div className="lg:col-span-4 space-y-4">
                {/* Active Emergency Hotspot Box */}
                <div className="p-4 bg-slate-900 rounded-xl text-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Active Emergency Ward
                    </p>
                    <span className="px-2 py-0.5 bg-red-500 text-[9px] font-bold rounded text-white">
                      {cityStats.highestRiskWard.alert_tier} ALERT
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {cityStats.highestRiskWard.ward_name} (Ward #{cityStats.highestRiskWard.ward_number})
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      UTCI: <b className="text-orange-400">{cityStats.highestRiskWard.utci}°C</b> • Hospital Surge: <b className="text-red-400">+{cityStats.highestRiskWard.projected_hospitalizations_surge_pct}%</b>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedWardId(cityStats.highestRiskWard.ward_id)}
                      className="py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow transition-colors text-center"
                    >
                      Inspect Details
                    </button>
                    <button
                      onClick={handleCitywideBroadcast}
                      className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg transition-colors text-center"
                    >
                      Citywide Trigger
                    </button>
                  </div>
                </div>

                {/* AMC Ward Priority List */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col max-h-[500px] overflow-hidden">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Ward Risk Registry ({currentWards.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Select to inspect</span>
                  </div>

                  <div className="overflow-y-auto divide-y divide-slate-100 p-1">
                    {currentWards.map((w) => {
                      const isSelected = w.ward_id === selectedWardId;
                      return (
                        <div
                          key={w.ward_id}
                          onClick={() => setSelectedWardId(w.ward_id)}
                          className={`p-3 rounded-lg transition-all cursor-pointer flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-orange-50/80 border border-orange-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  w.alert_tier === 'RED'
                                    ? 'bg-red-500'
                                    : w.alert_tier === 'ORANGE'
                                    ? 'bg-orange-500'
                                    : w.alert_tier === 'YELLOW'
                                    ? 'bg-yellow-400'
                                    : 'bg-green-500'
                                }`}
                              />
                              <span className="font-bold text-slate-900">{w.ward_name}</span>
                              <span className="text-[10px] text-slate-400">({w.zone_name})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                              <span>UTCI: <b className="text-slate-800">{w.utci}°C</b></span>
                              <span>WBGT: <b className="text-slate-800">{w.max_wbgt}°C</b></span>
                              <span>WVI: <b className="text-purple-700">{w.wvi_score}</b></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-right">
                            <div>
                              <span className="text-xs font-bold text-red-600">
                                +{w.projected_hospitalizations_surge_pct}%
                              </span>
                              <p className="text-[9px] text-slate-400">Surge</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Ward Detail Slide-Over Drawer */}
            <WardDetailDrawer
              wardId={selectedWardId}
              onClose={() => setSelectedWardId(null)}
              onDispatchAlert={handleDispatchAlert}
            />
          </>
        )}

        {/* View 2: Hospital & Public Health Portal */}
        {activeView === 'HOSPITAL' && <HospitalPortal />}

        {/* View 3: Citizen Portal (EN/HI/GU) */}
        {activeView === 'CITIZEN' && <CitizenPortal />}

        {/* View 4: Biometeorology Stress Calculator */}
        {activeView === 'CALCULATOR' && <BiometeorologyCalculator />}

        {/* View 5: Municipal Dispatch Audit Logs */}
        {activeView === 'DISPATCH_LOGS' && (
          <AlertDispatchLogs
            logs={alertLogs}
            onTriggerManualBroadcast={handleCitywideBroadcast}
          />
        )}
      </main>

      {/* Hosting & Deployment Modal */}
      <HostingGuideModal
        isOpen={isHostingModalOpen}
        onClose={() => setIsHostingModalOpen(false)}
      />

      {/* Operations Footer (Professional Polish styling) */}
      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 text-[10px] text-slate-500">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-bold uppercase tracking-wider text-slate-600">
              API Connection: Optimized
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-bold uppercase tracking-wider text-slate-600">
              ML Pipeline: Sync Complete
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>AURA-Heat © 2024 | Principal Full-Stack Geospatial Engine | v1.2.0-STABLE</span>
          <button
            onClick={() => setIsHostingModalOpen(true)}
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Deployment Guide
          </button>
        </div>
      </footer>
    </div>
  );
}
