/**
 * AURA-Heat: Municipal Alert & Dispatch Audit Log Component
 * Professional Polish Design Theme
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  CheckCircle2,
  Clock,
  Filter,
  MessageSquare,
  Droplets,
  Zap,
  Radio,
  ExternalLink
} from 'lucide-react';
import { AlertLogItem } from '../types';

interface AlertDispatchLogsProps {
  logs: AlertLogItem[];
  onTriggerManualBroadcast: () => void;
}

export const AlertDispatchLogs: React.FC<AlertDispatchLogsProps> = ({
  logs,
  onTriggerManualBroadcast
}) => {
  const [filterChannel, setFilterChannel] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    if (filterChannel === 'ALL') return true;
    return l.channels.includes(filterChannel);
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Automated Municipal Dispatch Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Celery task telemetry, WhatsApp Cloud API logs, SMS cell broadcasts and municipal utility webhooks
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerManualBroadcast}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shadow-sm self-start md:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Trigger Citywide Emergency Test</span>
        </button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-600">Channel Filter:</span>
          {['ALL', 'WHATSAPP', 'SMS', 'WATER_WEBHOOK', 'POWER_WEBHOOK'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterChannel === ch
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {ch.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-slate-500 font-medium">
          Total Dispatched Events: <b className="text-slate-900">{logs.length}</b>
        </div>
      </div>

      {/* Log Feed in clean Professional Polish cards */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.task_id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-2.5 hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.target_tier === 'RED'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : log.target_tier === 'ORANGE'
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}
                >
                  {log.target_tier} TIER
                </span>

                <span className="font-bold text-slate-900 text-sm">{log.sample_ward}</span>

                <span className="text-[11px] text-slate-400 font-mono">ID: {log.task_id}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {log.timestamp}
                </span>

                <span className="flex items-center gap-1 text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  {log.status}
                </span>
              </div>
            </div>

            {/* Channels Activated */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Dispatched Channels:
              </span>
              {log.channels.map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] flex items-center gap-1 border border-slate-200"
                >
                  {c === 'WHATSAPP' && <MessageSquare className="w-3 h-3 text-emerald-600" />}
                  {c === 'SMS' && <Radio className="w-3 h-3 text-blue-600" />}
                  {c === 'WATER_WEBHOOK' && <Droplets className="w-3 h-3 text-cyan-600" />}
                  {c === 'POWER_WEBHOOK' && <Zap className="w-3 h-3 text-amber-500" />}
                  <span>{c}</span>
                </span>
              ))}
            </div>

            {/* Message Payload Preview */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px] leading-relaxed font-sans">
              <div className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1">
                Broadcast Payload
              </div>
              "{log.message_preview}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
