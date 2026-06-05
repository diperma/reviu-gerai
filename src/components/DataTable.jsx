import React from 'react';
import { Eye, Award, FileText } from 'lucide-react';
import { formatRupiahShort, formatDate } from '../utils/formatters';

export default function DataTable({ projects, onSelectProject }) {
  const getAssetBadgeColor = (assetClass) => {
    switch (assetClass) {
      case 'Bangunan':
        return 'bg-brand-pale text-brand-teal border-brand-sage/30';
      case 'Sarana':
        return 'bg-brand-peach/30 text-brand-terracotta border-brand-peach/70';
      case 'Kendaraan':
        return 'bg-brand-sage/10 text-brand-teal border-brand-sage/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getReviuStatusBadge = (status) => {
    switch (status) {
      case 'Laporan Terbit':
        return (
          <span className="inline-flex items-center space-x-1 text-brand-teal bg-brand-pale border border-brand-sage/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            <Award className="h-3 w-3" />
            <span>Laporan Terbit</span>
          </span>
        );
      case 'ST Terbit':
        return (
          <span className="inline-flex items-center space-x-1 text-brand-terracotta bg-brand-peach/20 border border-brand-peach px-2 py-0.5 rounded text-[11px] font-semibold">
            <FileText className="h-3 w-3" />
            <span>ST Terbit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <span>Permintaan Verval</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Daftar Rincian Permintaan & Realisasi Reviu</h3>
          <p className="text-xs text-slate-400">Total data yang terfilter: {projects.length} proyek</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-5">ID / Nama Proyek</th>
              <th className="py-3 px-5">Lokasi Desa / Kota</th>
              <th className="py-3 px-5">Kategori Aset</th>
              <th className="py-3 px-5 text-right">Nilai BAST</th>
              <th className="py-3 px-5 text-right">Nilai Reviu</th>
              <th className="py-3 px-5 text-center">Status Output</th>
              <th className="py-3 px-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-400 font-medium">
                  Tidak ada proyek yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-800">{project.title}</div>
                    <div className="text-xs text-brand-teal font-mono mt-0.5">{project.id} • BAST: {formatDate(project.tanggalBast)}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-medium">
                    <div>Desa {project.desa}</div>
                    <div className="text-xs text-slate-400 font-semibold">{project.kabKota}, {project.provinsi}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2 py-1 border text-[11px] font-bold rounded-md ${getAssetBadgeColor(project.assetClass)}`}>
                      {project.assetClass}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-slate-800">
                    {formatRupiahShort(project.nilaiBast)}
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-slate-800">
                    {project.nilaiReviu > 0 ? formatRupiahShort(project.nilaiReviu) : "-"}
                  </td>
                  <td className="py-4 px-5 text-center">
                    {getReviuStatusBadge(project.reviuStatus)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center space-x-1 text-brand-teal hover:text-brand-teal/80 bg-brand-pale hover:bg-brand-sage/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Rincian</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
