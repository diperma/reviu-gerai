import React from 'react';
import { X, Calendar, ShieldAlert, Award, FileSpreadsheet, User } from 'lucide-react';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function DetailDrawer({ isOpen, onClose, project, onApprovalAction }) {
  if (!isOpen || !project) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-brand-pale text-brand-teal border border-brand-sage/30';
      case 'Pending Approval':
        return 'bg-brand-peach/30 text-brand-terracotta border border-brand-peach/60';
      case 'Returned':
        return 'bg-brand-peach/50 text-brand-terracotta border border-brand-peach';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold text-brand-teal bg-brand-pale px-2 py-1 rounded border border-brand-sage/20">
              {project.id}
            </span>
            <h3 className="font-bold text-slate-800 text-lg mt-2 truncate w-72 md:w-96">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Status Persetujuan</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(project.statusApproval)}`}>
              {project.statusApproval}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Desa / Kelurahan</span>
              <span className="text-xs font-bold text-slate-700">Desa {project.desa}</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Kecamatan & Kota</span>
              <span className="text-xs font-bold text-slate-700">{project.kecamatan}, {project.kabKota}</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Provinsi</span>
              <span className="text-xs font-bold text-slate-700">{project.provinsi}</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Jenis Proyek</span>
              <span className="text-xs font-bold text-slate-700">{project.type}</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Kategori Aset</span>
              <span className="text-xs font-bold text-slate-700">{project.assetClass}</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex items-center space-x-2">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">PIC Verifikator</span>
                <span className="text-xs font-bold text-slate-700">{project.pic}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nilai Keuangan & Koreksi</h4>
            
            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Nilai diajukan (BAST):</span>
                <span className="font-bold text-slate-800">{formatRupiah(project.nilaiBast)}</span>
              </div>

              {project.reviuStatus === 'Laporan Terbit' ? (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-teal font-medium">Nilai Reviu BPKP:</span>
                    <span className="font-bold text-brand-teal">{formatRupiah(project.nilaiReviu)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-dashed border-slate-200">
                    <span className="text-brand-terracotta font-medium flex items-center">
                      <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                      Koreksi / Efisiensi:
                    </span>
                    <span className="font-bold text-brand-terracotta">
                      {formatRupiah(project.nilaiBast - project.nilaiReviu)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-xs font-medium text-brand-terracotta bg-brand-peach/20 p-2.5 rounded-lg border border-brand-peach flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  Proses Reviu belum selesai (Menunggu Laporan Terbit)
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dokumen Pendukung</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">Tanggal BAST Terbit:</span>
                </div>
                <span className="font-semibold text-slate-700">{formatDate(project.tanggalBast)}</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">Nomor Surat Tugas (ST):</span>
                </div>
                <span className="font-semibold text-slate-700">{project.stNumber || "Belum Terbit"}</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">Nomor Laporan Hasil Reviu:</span>
                </div>
                <span className="font-semibold text-slate-700">{project.laporanNumber || "Belum Terbit"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Approval Workflow) */}
        {project.statusApproval === 'Pending Approval' && onApprovalAction && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-4">
            <button
              onClick={() => onApprovalAction(project.id, 'Returned')}
              className="px-4 py-2.5 border border-brand-terracotta/40 text-brand-terracotta hover:bg-brand-peach/10 font-bold rounded-lg text-sm transition-all duration-200 cursor-pointer text-center"
            >
              Kembalikan (Reject)
            </button>
            <button
              onClick={() => onApprovalAction(project.id, 'Approved')}
              className="px-4 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white font-bold rounded-lg text-sm shadow-sm transition-all duration-200 cursor-pointer text-center"
            >
              Setujui (Approve)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
