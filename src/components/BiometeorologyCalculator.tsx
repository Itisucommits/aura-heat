/**
 * AURA-Heat: Biometeorology Thermal Stress Calculator
 * Professional Polish Design Theme
 */

import React, { useState } from 'react';
import {
  Calculator,
  Sliders,
  Sparkles,
  Info,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  BookOpen
} from 'lucide-react';
import { calculateAllIndices } from '../utils/thermalCalculations';

export const BiometeorologyCalculator: React.FC = () => {
  const [ta, setTa] = useState<number>(43.5);
  const [rh, setRh] = useState<number>(38.0);
  const [ws, setWs] = useState<number>(2.2);
  const [rad, setRad] = useState<number>(850);
  const [clothing, setClothing] = useState<'summer' | 'workwear' | 'protective'>('summer');

  const cloValue = clothing === 'summer' ? 0.5 : clothing === 'workwear' ? 1.0 : 1.5;
  const indices = calculateAllIndices(ta, rh, ws, rad, cloValue);

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Biometeorological Physiological Stress Inspector
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live scientific calculation engine: Fiala UTCI regression, ISO 7243:2017 WBGT & NOAA Rothfusz Heat Index
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold self-start md:self-auto">
          Fiala 187-Node Model Parity
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Inputs Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Input Meteorological Variables
            </h3>
          </div>

          {/* Dry Bulb Temperature */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Thermometer className="w-3.5 h-3.5 text-red-500" />
                Dry Bulb Air Temp (Ta)
              </span>
              <span className="font-bold text-slate-900">{ta.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min={25}
              max={52}
              step={0.5}
              value={ta}
              onChange={(e) => setTa(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* Relative Humidity */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                Relative Humidity (RH)
              </span>
              <span className="font-bold text-slate-900">{rh.toFixed(0)} %</span>
            </div>
            <input
              type="range"
              min={5}
              max={95}
              step={1}
              value={rh}
              onChange={(e) => setRh(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          {/* Wind Speed */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                Wind Velocity at 10m (v10)
              </span>
              <span className="font-bold text-slate-900">{ws.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={15}
              step={0.2}
              value={ws}
              onChange={(e) => setWs(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
          </div>

          {/* Solar Radiation */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Solar Radiation Flux (G)
              </span>
              <span className="font-bold text-slate-900">{rad} W/m²</span>
            </div>
            <input
              type="range"
              min={0}
              max={1200}
              step={25}
              value={rad}
              onChange={(e) => setRad(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Clothing Insulation */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Clothing Ensemble Insulation (clo)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'summer', label: 'Summer (0.5 clo)' },
                { id: 'workwear', label: 'Workwear (1.0 clo)' },
                { id: 'protective', label: 'PPE (1.5 clo)' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClothing(c.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors border ${
                    clothing === c.id
                      ? 'bg-[#0f172a] text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Computed Indices */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Index Cards in Professional Polish grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* UTCI */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UTCI Stress</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                  {indices.utci_category}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-2">
                {indices.utci.toFixed(1)}°C
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Universal Thermal Climate Index</p>
            </div>

            {/* WBGT */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ISO 7243 WBGT</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">
                  {indices.wbgt_category}
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mt-2">
                {indices.wbgt.toFixed(1)}°C
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Outdoor Wet Bulb Globe Temp</p>
            </div>

            {/* NOAA Heat Index */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NOAA Heat Index</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  {indices.heat_index_category}
                </span>
              </div>
              <div className="text-3xl font-bold text-amber-600 mt-2">
                {indices.heat_index.toFixed(1)}°C
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Rothfusz Polynomial Model</p>
            </div>
          </div>

          {/* Derived Physical Quantities */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Derived Radiative & Psychrometric Variables
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Mean Radiant (Tmrt)</span>
                <span className="text-base font-bold text-slate-900">{indices.mrt.toFixed(1)}°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Natural Wet-Bulb (Tnw)</span>
                <span className="text-base font-bold text-slate-900">{indices.tnw.toFixed(1)}°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Black Globe (Tg)</span>
                <span className="text-base font-bold text-slate-900">{indices.tg.toFixed(1)}°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Dew Point (Tdp)</span>
                <span className="text-base font-bold text-slate-900">{indices.dew_point.toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          {/* Scientific Reference Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>Scientific Formulations Implemented</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
              <li><b>UTCI:</b> Operational 6th-order polynomial regression based on Fiala 187-node human thermoregulation model.</li>
              <li><b>ISO 7243:2017:</b> <code className="text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">WBGT = 0.7*Tnw + 0.2*Tg + 0.1*Td</code>. Natural wet bulb calculated via Roland Stull formula.</li>
              <li><b>NOAA Heat Index:</b> Rothfusz regression with low RH (&lt;13%) and high RH (&gt;85%) adjustment factors.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
