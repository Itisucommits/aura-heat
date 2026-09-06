/**
 * AURA-Heat: Effortless Hosting and Public Link Sharing Guide Modal
 * Professional Polish Design Theme
 */

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Server,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Share2,
  Globe,
  Database,
  Cpu
} from 'lucide-react';

interface HostingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingGuideModal: React.FC<HostingGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      title: 'Option 1: Instant Local One-Script Boot (FastAPI + Vite)',
      desc: 'Runs the automated pre-flight checks, seeds the PostGIS spatial database, launches Celery workers, and starts the frontend.',
      command: 'chmod +x start.sh && ./start.sh'
    },
    {
      title: 'Option 2: Multi-Container Production Stack (Docker Compose)',
      desc: 'Orchestrates PostgreSQL 16 PostGIS, Redis 7, Celery Worker, FastAPI backend, and Nginx reverse proxy on port 3000.',
      command: 'docker compose -f docker/docker-compose.yml up --build -d'
    },
    {
      title: 'Option 3: Create a Free Public Tunnel URL (Share with Stakeholders)',
      desc: 'Expose your running local port 3000 to a secured HTTPS public URL so external reviewers or municipal officials can inspect live.',
      command: 'npx localtunnel --port 3000 --subdomain aura-heat-amc'
    },
    {
      title: 'Option 4: Cloud Run / Fly.io / Render 1-Click Deployment',
      desc: 'Deploy the Docker container to any managed cloud container service.',
      command: 'gcloud run deploy aura-heat --source . --port 3000 --allow-unauthenticated'
    }
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header matching Professional Polish theme */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Effortless Hosting & Public Link Sharing Guide
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                One-command local setup, production containers, or instant public sharing URL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick status callout */}
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 leading-relaxed text-[11px]">
              <b>Zero-Config Guarantee:</b> The codebase includes autonomous fallback mechanisms. Even without PostgreSQL or Redis running locally, the platform operates seamlessly using embedded biometeorological calculations and local GIS fixtures.
            </p>
          </div>

          {/* Commands list */}
          <div className="space-y-3.5">
            {steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{step.title}</span>
                  <span className="text-[10px] text-slate-400">Step {idx + 1}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{step.desc}</p>

                <div className="flex items-center justify-between bg-[#0f172a] text-slate-200 p-2.5 rounded-lg font-mono text-[11px] border border-slate-800">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-orange-400 font-bold">$</span>
                    <span className="text-slate-100">{step.command}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(step.command, idx)}
                    className="ml-2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Environmental parameters & ports */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <Globe className="w-4 h-4 text-orange-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-500 uppercase font-bold">App & API Port</div>
              <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">3000</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <Database className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-500 uppercase font-bold">PostGIS Database</div>
              <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">5432</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <Cpu className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-500 uppercase font-bold">Redis Broker</div>
              <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">6379</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 text-[11px]">Ready for municipal deployment & production demonstration</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
