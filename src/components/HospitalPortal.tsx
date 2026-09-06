/**
 * AURA-Heat: Public Health and Hospital Preparedness Portal
 * Professional Polish Design Theme
 */

import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Package,
  AlertCircle,
  TrendingUp,
  Search,
  Droplet,
  Building
} from 'lucide-react';
import { HospitalWardCapacity } from '../types';
import { RAW_WARDS, generateWardProperties } from '../data/wardsGeoData';

export const HospitalPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CRITICAL' | 'STRAINED' | 'NORMAL'>('ALL');

  // Build hospital capacity dataset
  const hospitals: HospitalWardCapacity[] = RAW_WARDS.map((w) => {
    const props = generateWardProperties(w, 1);
    const totalBeds = 140 + w.ward_number * 16;
    const surgeMultiplier = 1.0 + props.projected_hospitalizations_surge_pct / 100.0;
    const occupiedBeds = Math.min(totalBeds, Math.round(totalBeds * 0.72 * surgeMultiplier));
    const coolingBeds = 14 + w.cooling_centers_count * 4;
    const triageDemand = Math.round(props.mortality_risk_score * 1.7 + 9);

    let status: 'NORMAL' | 'STRAINED' | 'CRITICAL' = 'NORMAL';
    if (occupiedBeds / totalBeds > 0.90 || triageDemand > coolingBeds) {
      status = 'CRITICAL';
    } else if (occupiedBeds / totalBeds > 0.78) {
      status = 'STRAINED';
    }

    return {
      ward_id: w.id,
      ward_name: w.ward_name,
      hospital_name: w.hospital_name,
      total_beds: totalBeds,
      occupied_beds: occupiedBeds,
      occupancy_rate_pct: Number(((occupiedBeds / totalBeds) * 100).toFixed(1)),
      dedicated_heatstroke_cooling_beds: coolingBeds,
      projected_triage_demand_48h: triageDemand,
      triage_alert_status: status,
      ors_packets_stock: 3200 + Math.round(w.population / 35),
      iv_fluid_saline_bags: 1100 + Math.round(w.population / 80),
      ice_pack_units: 520 + Math.round(w.population / 140)
    };
  });

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.ward_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.hospital_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || h.triage_alert_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBedsCity = hospitals.reduce((acc, h) => acc + h.total_beds, 0);
  const totalOccupiedCity = hospitals.reduce((acc, h) => acc + h.occupied_beds, 0);
  const totalCoolingBeds = hospitals.reduce((acc, h) => acc + h.dedicated_heatstroke_cooling_beds, 0);
  const totalTriageDemand = hospitals.reduce((acc, h) => acc + h.projected_triage_demand_48h, 0);
  const criticalCount = hospitals.filter((h) => h.triage_alert_status === 'CRITICAL').length;

  return (
    <div className="space-y-5">
      {/* Top Banner with Professional Polish clean card styling */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Hospital & Public Health Preparedness Portal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Heat-stroke triage surge modeling, cooling bed availability & medical stock monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Citywide Triage Buffer</p>
            <p className="text-xs font-bold text-red-600">
              {totalTriageDemand > totalCoolingBeds ? `-${totalTriageDemand - totalCoolingBeds} Beds Deficit` : '+Adequate Capacity'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Total Bed Occupancy
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {((totalOccupiedCity / totalBedsCity) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {totalOccupiedCity.toLocaleString()} of {totalBedsCity.toLocaleString()} occupied
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full"
              style={{ width: `${(totalOccupiedCity / totalBedsCity) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Hosp. Capacity Surge (48h)
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            +{totalTriageDemand} Patients
          </p>
          <p className="text-xs text-slate-400 mt-1 italic">
            Against {totalCoolingBeds} dedicated cooling beds
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5">
            <div
              className="bg-red-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (totalTriageDemand / totalCoolingBeds) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Critical Triage Facilities
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">{criticalCount} Wards</p>
          <p className="text-xs text-slate-500 mt-1">Occupancy &gt;90% or cooling beds exceeded</p>
          <p className="text-[10px] text-red-600 font-bold mt-2">Immediate emergency triage routing enabled</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            ORS Buffer Stock
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {hospitals.reduce((acc, h) => acc + h.ors_packets_stock, 0).toLocaleString()} Packets
          </p>
          <p className="text-xs text-slate-500 mt-1">Civic distribution inventory</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-2">Buffer stock valid for ~14 days</p>
        </div>
      </div>

      {/* Hospital Preparedness Table in clean white card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ward or hospital facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'CRITICAL', 'STRAINED', 'NORMAL'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterStatus === st
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3.5 pl-5">Ward & Hospital Facility</th>
                <th className="p-3.5">Bed Occupancy</th>
                <th className="p-3.5">Dedicated Cooling Beds</th>
                <th className="p-3.5">Projected Demand (48h)</th>
                <th className="p-3.5">ORS Packets</th>
                <th className="p-3.5">IV Saline Bags</th>
                <th className="p-3.5 pr-5">Triage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHospitals.map((h) => (
                <tr key={h.ward_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-slate-900">{h.hospital_name}</div>
                    <div className="text-[11px] text-slate-500">{h.ward_name}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {h.occupied_beds} / {h.total_beds}
                      </span>
                      <span className="text-[11px] text-slate-500">({h.occupancy_rate_pct}%)</span>
                    </div>
                    <div className="w-24 bg-slate-100 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${
                          h.occupancy_rate_pct > 90
                            ? 'bg-red-500'
                            : h.occupancy_rate_pct > 75
                            ? 'bg-orange-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, h.occupancy_rate_pct)}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                      {h.dedicated_heatstroke_cooling_beds} Beds
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-red-600">+{h.projected_triage_demand_48h} Patients</span>
                    <p className="text-[10px] text-slate-400">DLNM Model</p>
                  </td>

                  <td className="p-3.5">
                    <span className="text-slate-800 font-mono font-medium">
                      {h.ors_packets_stock.toLocaleString()}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-slate-800 font-mono font-medium">
                      {h.iv_fluid_saline_bags.toLocaleString()}
                    </span>
                  </td>

                  <td className="p-3.5 pr-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                        h.triage_alert_status === 'CRITICAL'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : h.triage_alert_status === 'STRAINED'
                          ? 'bg-orange-100 text-orange-700 border-orange-200'
                          : 'bg-green-100 text-green-700 border-green-200'
                      }`}
                    >
                      {h.triage_alert_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
