import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatRupiahShort } from '../utils/formatters';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  breakdown = null, // e.g. { bangunan: { nilai: 100M, qty: 5 }, sarana: { nilai: 50M, qty: 100 }, ... }
  trend = null,
  listMetrics = null // e.g. [{ label: 'Dokumen', value: 25 }, { label: 'Desa', value: 18 }]
}) {
  const colorMap = {
    indigo: {
      bg: 'bg-brand-pale border-brand-sage/40',
      text: 'text-brand-teal',
    },
    amber: {
      bg: 'bg-brand-peach/20 border-brand-peach',
      text: 'text-brand-terracotta',
    },
    emerald: {
      bg: 'bg-brand-teal/5 border-brand-sage/50',
      text: 'text-brand-teal',
    },
    rose: {
      bg: 'bg-brand-peach/40 border-brand-peach/80',
      text: 'text-brand-terracotta',
    },
    slate: {
      bg: 'bg-slate-50 border-slate-100',
      text: 'text-slate-600',
    }
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className={`p-2 rounded-lg border ${selectedColor.bg} ${selectedColor.text} group-hover:scale-105 transition-transform duration-300`}>
            {Icon && <Icon className="h-4.5 w-4.5" />}
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            {typeof value === 'number' && value >= 1000000 ? formatRupiahShort(value) : value}
          </span>
          {trend && (
            <span className="flex items-center text-[10px] font-bold text-brand-teal bg-brand-pale px-1.5 py-0.5 rounded border border-brand-sage/20">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              {trend}
            </span>
          )}
        </div>

        {subtitle && <p className="text-[11px] font-medium text-slate-400 mt-1">{subtitle}</p>}
        
        {/* List Metrics */}
        {listMetrics && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            {listMetrics.map((item, idx) => (
              <div key={idx} className="bg-brand-pale/50 border border-brand-sage/20 rounded-lg p-2 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{item.label}</span>
                <span className="text-xs font-bold text-brand-teal mt-0.5 block">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {breakdown && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
          {Object.entries(breakdown).map(([key, data]) => {
            const isDetailed = data && typeof data === 'object' && 'nilai' in data;
            const nilai = isDetailed ? data.nilai : data;
            const qty = isDetailed ? data.qty : 0;
            const labelMap = { bangunan: 'Bangunan', sarana: 'Sarana', kendaraan: 'Kendaraan' };

            return (
              <div key={key}>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  {labelMap[key] || key}
                </span>
                <p className="text-xs font-bold text-slate-700 truncate">{formatRupiahShort(nilai)}</p>
                {isDetailed && qty > 0 && (
                  <span className="text-[10px] text-brand-teal font-bold bg-brand-pale px-1 rounded mt-0.5 inline-block">
                    {qty} Unit
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
