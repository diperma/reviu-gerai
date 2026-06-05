import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatRupiahShort } from '../utils/formatters';

export default function ChartsSection({ kdkmpData, monthlyTrends, summaryStats }) {
  // Brand color hex values:
  // Teal: #006d77, Sage: #83c5be, Pale: #edf6f9, Peach: #ffddd2, Terracotta: #e29578
  const colors = {
    teal: '#006d77',
    sage: '#83c5be',
    pale: '#edf6f9',
    peach: '#ffddd2',
    terracotta: '#e29578',
  };

  // Format KDKMP Data for charting
  const barChartData = kdkmpData.map((d) => ({
    name: d.name.replace("KDKMP ", ""),
    "Permintaan Verval": d.permintaanVerval,
    "ST Terbit": d.stTerbit,
    "Laporan Terbit": d.laporanTerbit
  }));

  // Pie chart data for asset class breakdown (Nilai Diajukan vs Nilai Reviu)
  const pieDataDiajukan = [
    { name: 'Bangunan', value: summaryStats.nilaiDiajukan.bangunan, color: colors.teal },
    { name: 'Sarana', value: summaryStats.nilaiDiajukan.sarana, color: colors.sage },
    { name: 'Kendaraan', value: summaryStats.nilaiDiajukan.kendaraan, color: colors.terracotta }
  ];

  const pieDataReviu = [
    { name: 'Bangunan', value: summaryStats.nilaiReviu.bangunan, color: colors.teal },
    { name: 'Sarana', value: summaryStats.nilaiReviu.sarana, color: colors.sage },
    { name: 'Kendaraan', value: summaryStats.nilaiReviu.kendaraan, color: colors.terracotta }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="text-xs font-bold text-slate-800 mb-1">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-xs font-semibold" style={{ color: item.color || item.fill }}>
              {item.name}: {typeof item.value === 'number' && item.value > 1000 ? formatRupiahShort(item.value) : item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Chart 1: Provincial Activity */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Aktivitas Reviu per Provinsi</h3>
          <p className="text-xs text-slate-400">Distribusi Reviu, ST, dan Laporan Terbit</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
              <Bar dataKey="Permintaan Verval" fill={colors.teal} radius={[4, 4, 0, 0]} />
              <Bar dataKey="ST Terbit" fill={colors.terracotta} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Laporan Terbit" fill={colors.sage} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Monthly Trends */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Tren Realisasi Reviu & Output Dokumen</h3>
          <p className="text-xs text-slate-400">Akumulasi dokumen terbit dan masuk bulanan</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPermintaan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.teal} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colors.teal} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLaporan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.sage} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colors.sage} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
              <Area type="monotone" dataKey="permintaan" name="Permintaan Reviu" stroke={colors.teal} fillOpacity={1} fill="url(#colorPermintaan)" strokeWidth={2} />
              <Area type="monotone" dataKey="laporan" name="Laporan Terbit" stroke={colors.sage} fillOpacity={1} fill="url(#colorLaporan)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Nilai Diajukan vs Nilai Hasil Reviu */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px] lg:col-span-2">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Perbandingan Proporsi Nilai Aset</h3>
          <p className="text-xs text-slate-400">Distribusi alokasi dana sebelum vs sesudah Reviu BPKP</p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          {/* Pie 1: Diajukan */}
          <div className="flex flex-col items-center justify-center relative">
            <h4 className="text-xs font-bold text-slate-500 absolute top-0">NILAI DIAJUKAN REVIU</h4>
            <div className="w-full h-[180px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataDiajukan}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieDataDiajukan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-4 text-xs font-semibold text-slate-600 mt-2">
              {pieDataDiajukan.map((d) => (
                <div key={d.name} className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie 2: Hasil Reviu */}
          <div className="flex flex-col items-center justify-center relative">
            <h4 className="text-xs font-bold text-slate-500 absolute top-0">NILAI HASIL REVIU</h4>
            <div className="w-full h-[180px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataReviu}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieDataReviu.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-4 text-xs font-semibold text-slate-600 mt-2">
              {pieDataReviu.map((d) => (
                <div key={d.name} className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
