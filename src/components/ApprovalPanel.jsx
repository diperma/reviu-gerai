import React from 'react';
import { CheckCircle2, XCircle, Clock, CheckSquare, Eye } from 'lucide-react';
import { formatRupiahShort } from '../utils/formatters';

export default function ApprovalPanel({ projects, onSelectProject, onApprovalAction }) {
  // Filter projects by approval statuses
  const pendingProjects = projects.filter((p) => p.statusApproval === 'Pending Approval');
  const approvedProjects = projects.filter((p) => p.statusApproval === 'Approved');
  const returnedProjects = projects.filter((p) => p.statusApproval === 'Returned');

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Menunggu Approval</span>
            <span className="text-3xl font-extrabold text-brand-terracotta mt-1 block">{pendingProjects.length}</span>
          </div>
          <div className="bg-brand-peach/25 border border-brand-peach p-3 rounded-lg text-brand-terracotta">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Telah Disetujui</span>
            <span className="text-3xl font-extrabold text-brand-teal mt-1 block">{approvedProjects.length}</span>
          </div>
          <div className="bg-brand-pale border border-brand-sage/40 p-3 rounded-lg text-brand-teal">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Dikembalikan</span>
            <span className="text-3xl font-extrabold text-brand-terracotta mt-1 block">{returnedProjects.length}</span>
          </div>
          <div className="bg-brand-peach/40 border border-brand-peach/80 p-3 rounded-lg text-brand-terracotta">
            <XCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-2">
          <CheckSquare className="h-5 w-5 text-brand-teal" />
          <h3 className="font-bold text-slate-800 text-sm">Antrean Approval Laporan Internal</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingProjects.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium flex flex-col items-center justify-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-brand-teal" />
              <span>Semua laporan selesai diverifikasi. Tidak ada antrean pending.</span>
            </div>
          ) : (
            pendingProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors duration-150 gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-brand-teal bg-brand-pale px-2 py-0.5 rounded border border-brand-sage/20">
                      {project.id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">• BAST: {project.tanggalBast}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mt-1.5">{project.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-medium text-slate-500">Lokasi: <b className="text-slate-700">Desa {project.desa}, {project.kabKota} ({project.provinsi})</b></span>
                    <span className="text-xs text-slate-300">|</span>
                    <span className="text-xs font-medium text-slate-500">Aset: <b className="text-slate-700">{project.assetClass}</b></span>
                    <span className="text-xs text-slate-300">|</span>
                    <span className="text-xs font-medium text-slate-500">PIC: <b className="text-slate-700">{project.pic}</b></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right hidden md:block">
                    <div className="text-xs text-slate-400 font-medium">Nilai BAST</div>
                    <div className="font-bold text-slate-800 text-sm">{formatRupiahShort(project.nilaiBast)}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold bg-white transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => onApprovalAction(project.id, 'Returned')}
                      className="px-3 py-2 border border-brand-terracotta/40 text-brand-terracotta hover:bg-brand-peach/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Kembalikan
                    </button>
                    <button
                      onClick={() => onApprovalAction(project.id, 'Approved')}
                      className="px-3 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Setujui
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
