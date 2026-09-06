/**
 * AURA-Heat: 5-Day Numerical Weather Prediction Horizon Time Slider
 * Professional Polish Design Theme
 */

import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Calendar, Flame } from 'lucide-react';

interface TimeSliderProps {
  horizonDay: number;
  onHorizonChange: (day: number) => void;
  peakDay?: number;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  horizonDay,
  onHorizonChange,
  peakDay = 3
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onHorizonChange((prev) => (prev >= 5 ? 0 : prev + 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onHorizonChange]);

  const dates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayIndex: i,
      label: i === 0 ? 'T+0' : `T+${i}`,
      fullLabel: i === 0 ? 'Today (T+0)' : i === 1 ? 'Tomorrow (T+1)' : `T+${i} Days`,
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  return (
    <div className="w-full bg-white/95 backdrop-blur rounded-2xl shadow-md border border-slate-200/90 p-4 flex flex-col transition-all">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Forecast Horizon: T+0 to T+5
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
            {dates[horizonDay]?.weekday}, {dates[horizonDay]?.dateStr} {horizonDay === peakDay ? '(Peak Risk)' : ''}
          </span>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onHorizonChange(0);
            }}
            className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
            title="Reset to Today (T+0)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrubber track */}
      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={horizonDay}
          onChange={(e) => onHorizonChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />

        {/* Milestone ticks */}
        <div className="flex justify-between mt-2 px-1">
          {dates.map((d) => {
            const isCurrent = d.dayIndex === horizonDay;
            const isPeak = d.dayIndex === peakDay;
            return (
              <button
                key={d.dayIndex}
                onClick={() => onHorizonChange(d.dayIndex)}
                className={`flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? 'scale-110 font-bold text-slate-900'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className={`text-[11px] font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                    {d.label}
                  </span>
                  {isPeak && (
                    <span className="flex items-center text-[9px] px-1 py-0.2 rounded bg-red-100 text-red-600 font-bold">
                      <Flame className="w-2.5 h-2.5 mr-0.5" /> Peak
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                  {d.weekday}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
