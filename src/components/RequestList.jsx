import React, { useState, useMemo } from 'react';
import { Eye, Search, Award, FileText, ClipboardList, AlertCircle } from 'lucide-react';
import { formatRupiahShort, formatDate } from '../utils/formatters';

export default function RequestList({ projects, onSelectProject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReviuStatus, setSelectedReviuStatus] = useState('All');
  const [selectedVervalStatus, setSelectedVervalStatus] = useState('All');

  // Aggregate projects by docPermintaan
  const aggregatedRequests = useMemo(() => {
    const groups = {};

    projects.forEach((proj) => {
      const docId = proj.docPermintaan || 'Tanpa Dokumen';
      if (!groups[docId]) {
        groups[docId] = {
          docPermintaan: docId,
          projects: [],
          totalNilaiBast: 0,
          totalNilaiReviu: 0,
          provinsi: new Set(),
          kabKota: new Set(),
          pics: new Set(),
          tanggalBast: proj.tanggalBast,
        };
      }

      groups[docId].projects.push(proj);
      groups[docId].totalNilaiBast += proj.nilaiBast || 0;
      groups[docId].totalNilaiReviu += proj.nilaiReviu || 0;
      if (proj.provinsi) groups[docId].provinsi.add(proj.provinsi);
      if (proj.kabKota) groups[docId].kabKota.add(proj.kabKota);
      if (proj.pic) groups[docId].pics.add(proj.pic);
      // Keep earliest date
      if (new Date(proj.tanggalBast) < new Date(groups[docId].tanggalBast)) {
        groups[docId].tanggalBast = proj.tanggalBast;
      }
    });

    return Object.values(groups).map((group) => {
      // Determine aggregate Verval BAST status
      const vervalStatuses = group.projects.map((p) => p.vervalStatus);
      let aggVervalStatus = 'Belum Terbit';
      if (vervalStatuses.every((status) => status === 'BAST Terbit')) {
        aggVervalStatus = 'BAST Terbit';
      } else if (vervalStatuses.some((status) => status === 'BAST Terbit')) {
        aggVervalStatus = 'Sebagian Terbit';
      }

      // Determine aggregate Reviu status
      const reviuStatuses = group.projects.map((p) => p.reviuStatus);
      let aggReviuStatus = 'Belum Reviu';
      if (reviuStatuses.every((status) => status === 'Laporan Terbit')) {
        aggReviuStatus = 'Laporan Terbit';
      } else if (reviuStatuses.some((status) => status === 'Laporan Terbit' || status === 'ST Terbit')) {
        aggReviuStatus = 'ST Terbit';
      }

      return {
        ...group,
        provinsiList: Array.from(group.provinsi).join(', '),
        kabKotaList: Array.from(group.kabKota).join(', '),
        picsList: Array.from(group.pics).join(', '),
        vervalStatus: aggVervalStatus,
        reviuStatus: aggReviuStatus,
      };
    });
  }, [projects]);

  // Filtered aggregated requests
  const filteredRequests = useMemo(() => {
    return aggregatedRequests.filter((req) => {
      const matchSearch =
        searchTerm === '' ||
        req.docPermintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.projects.some((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        req.picsList.toLowerCase().includes(searchTerm.toLowerCase());

      const matchReviu = selectedReviuStatus === 'All' || req.reviuStatus === selectedReviuStatus;
      const matchVerval = selectedVervalStatus === 'All' || req.vervalStatus === selectedVervalStatus;

      return matchSearch && matchReviu && matchVerval;
    });
  }, [aggregatedRequests, searchTerm, selectedReviuStatus, selectedVervalStatus]);

  // Style helper for Verval BAST badge
  const getVervalBadge = (status) => {
    switch (status) {
      case 'BAST Terbit':
        return (
          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <span>BAST Terbit</span>
          </span>
        );
      case 'Sebagian Terbit':
        return (
          <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <span>Sebagian Terbit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <span>Belum Terbit</span>
          </span>
        );
    }
  };

  // Style helper for Reviu badge
  const getReviuBadge = (status) => {
    switch (status) {
      case 'Laporan Terbit':
        return (
          <span className="inline-flex items-center space-x-1 text-brand-teal bg-brand-pale border border-brand-sage/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            <Award className="h-3 w-3" />
            <span>Laporan Terbit (Selesai)</span>
          </span>
        );
      case 'ST Terbit':
        return (
          <span className="inline-flex items-center space-x-1 text-brand-terracotta bg-brand-peach/20 border border-brand-peach px-2 py-0.5 rounded text-[11px] font-semibold">
            <FileText className="h-3 w-3" />
            <span>ST Terbit (Proses)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <AlertCircle className="h-3 w-3" />
            <span>Belum Reviu</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Daftar Reviu (Agregasi Dokumen Permintaan)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Menyajikan progres pengawasan dan reviu aset yang dikelompokkan per Nomor Dokumen Permintaan.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Total Dokumen: {aggregatedRequests.length}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Dokumen, Proyek, atau PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-slate-50/50"
            />
          </div>

          {/* Filter Status Verval */}
          <div>
            <select
              value={selectedVervalStatus}
              onChange={(e) => setSelectedVervalStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-white cursor-pointer"
            >
              <option value="All">Semua Status Verval BAST</option>
              <option value="BAST Terbit">BAST Terbit</option>
              <option value="Sebagian Terbit">Sebagian Terbit</option>
              <option value="Belum Terbit">Belum Terbit</option>
            </select>
          </div>

          {/* Filter Status Reviu */}
          <div>
            <select
              value={selectedReviuStatus}
              onChange={(e) => setSelectedReviuStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-white cursor-pointer"
            >
              <option value="All">Semua Status Reviu</option>
              <option value="Laporan Terbit">Laporan Terbit (Selesai)</option>
              <option value="ST Terbit">ST Terbit (Proses)</option>
              <option value="Belum Reviu">Belum Reviu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-5">No. Dokumen Permintaan</th>
                <th className="py-3 px-5">Aset / Proyek Terkait</th>
                <th className="py-3 px-5">Wilayah</th>
                <th className="py-3 px-5 text-right">Total Nilai BAST</th>
                <th className="py-3 px-5 text-center">Status Verval BAST</th>
                <th className="py-3 px-5 text-center">Status Reviu</th>
                <th className="py-3 px-5">PIC Pengusul</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400 font-medium">
                    Tidak ada dokumen permintaan reviu yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.docPermintaan} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-4 px-5 font-mono font-bold text-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <ClipboardList className="h-4 w-4 text-brand-teal" />
                        <span>{req.docPermintaan}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans font-medium mt-0.5">
                        Tgl Awal BAST: {formatDate(req.tanggalBast)}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1 max-w-xs">
                        {req.projects.map((proj) => (
                          <div key={proj.id} className="text-xs font-semibold text-slate-700 truncate" title={proj.title}>
                            • {proj.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-700">{req.kabKotaList}</div>
                      <div className="text-xs text-slate-400 font-bold">{req.provinsiList}</div>
                    </td>
                    <td className="py-4 px-5 text-right font-extrabold text-slate-800">
                      {formatRupiahShort(req.totalNilaiBast)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {getVervalBadge(req.vervalStatus)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {getReviuBadge(req.reviuStatus)}
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {req.picsList}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => onSelectProject(req.projects[0])}
                        className="inline-flex items-center space-x-1 text-brand-teal hover:text-brand-teal/80 bg-brand-pale hover:bg-brand-sage/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
