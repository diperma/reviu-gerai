import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Save, Check, ShieldAlert, Info } from 'lucide-react';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function InputForm({ projects, onSubmitSuccess }) {
  // Select project state
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Review outcomes states
  const [stNumber, setStNumber] = useState('');
  const [laporanNumber, setLaporanNumber] = useState('');
  const [nilaiReviu, setNilaiReviu] = useState('');
  const [reviuStatus, setReviuStatus] = useState('ST Terbit');

  // Status states
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter projects to only show those that need review updates (not fully approved, or reviu status is not Laporan Terbit yet)
  const uncompletedProjects = useMemo(() => {
    return projects.filter(p => p.reviuStatus !== 'Laporan Terbit' || p.nilaiReviu === 0);
  }, [projects]);

  // Find currently selected project details
  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  // Load existing values if project is selected
  useEffect(() => {
    if (selectedProject) {
      setStNumber(selectedProject.stNumber || '');
      setLaporanNumber(selectedProject.laporanNumber || '');
      setNilaiReviu(selectedProject.nilaiReviu > 0 ? selectedProject.nilaiReviu.toString() : '');
      setReviuStatus(selectedProject.reviuStatus === 'Permintaan Verval' ? 'ST Terbit' : selectedProject.reviuStatus);
    } else {
      setStNumber('');
      setLaporanNumber('');
      setNilaiReviu('');
      setReviuStatus('ST Terbit');
    }
  }, [selectedProject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedProjectId) return setErrorMsg('Silakan pilih proyek BAST terlebih dahulu');
    if (!stNumber.trim()) return setErrorMsg('Nomor Surat Tugas (ST) wajib diisi');
    
    if (reviuStatus === 'Laporan Terbit') {
      if (!laporanNumber.trim()) return setErrorMsg('Nomor Laporan Hasil Reviu wajib diisi jika status Laporan Terbit');
      if (!nilaiReviu || isNaN(nilaiReviu) || Number(nilaiReviu) <= 0) {
        return setErrorMsg('Nilai Hasil Reviu BPKP wajib diisi dengan angka positif jika Laporan Terbit');
      }
      if (Number(nilaiReviu) > selectedProject.nilaiBast) {
        return setErrorMsg('Nilai hasil reviu BPKP tidak boleh melebihi nilai BAST awal diajukan');
      }
    }

    const updatedProject = {
      ...selectedProject,
      stNumber,
      laporanNumber: reviuStatus === 'Laporan Terbit' ? laporanNumber : '',
      nilaiReviu: reviuStatus === 'Laporan Terbit' ? Number(nilaiReviu) : 0,
      reviuStatus,
      // If Laporan is published, we send it to approval process
      statusApproval: reviuStatus === 'Laporan Terbit' ? 'Pending Approval' : selectedProject.statusApproval
    };

    onSubmitSuccess(updatedProject);
    setShowSuccess(true);
    setSelectedProjectId('');

    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative">
      {/* Toast Notification */}
      {showSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-teal text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in z-50">
          <Check className="h-5 w-5" />
          <span className="text-sm font-semibold">Hasil reviu berhasil disimpan dan memperbarui dasbor!</span>
        </div>
      )}

      <div className="flex items-center space-x-2.5 pb-4 mb-6 border-b border-slate-100">
        <Edit className="h-6 w-6 text-brand-teal" />
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg">Form Input Hasil Reviu KDKMP</h3>
          <p className="text-xs text-slate-400">Pilih proyek BAST yang sudah diajukan untuk mengisi data Surat Tugas (ST) dan Laporan Hasil Reviu BPKP</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-brand-peach/30 border border-brand-peach text-brand-terracotta rounded-lg text-xs font-semibold flex items-center space-x-2">
          <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection Dropdown */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Pilih Proyek BAST Yang Diajukan</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="">-- Silakan Pilih Proyek KDKMP --</option>
            {uncompletedProjects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.id}] {p.title} - Desa {p.desa} (Rp {formatRupiah(p.nilaiBast)})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Project Overview Card */}
        {selectedProject && (
          <div className="bg-brand-pale/40 border border-brand-sage/20 rounded-xl p-4 grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2 flex items-center space-x-1 text-brand-teal font-bold mb-1">
              <Info className="h-4 w-4" />
              <span>Detail Ringkas Permintaan Verval:</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Wilayah Kelurahan/Desa</span>
              <span className="font-bold text-slate-700">
                Desa {selectedProject.desa}, Kec. {selectedProject.kecamatan}, {selectedProject.kabKota} ({selectedProject.provinsi})
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Jenis Aset & Qty</span>
              <span className="font-bold text-slate-700">
                {selectedProject.assetClass} ({selectedProject.qtyBangunan || selectedProject.qtySarana || selectedProject.qtyKendaraan} Unit)
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Nilai BAST Diajukan</span>
              <span className="font-bold text-slate-700">{formatRupiah(selectedProject.nilaiBast)}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Tanggal Dokumen BAST</span>
              <span className="font-bold text-slate-700">{formatDate(selectedProject.tanggalBast)}</span>
            </div>
          </div>
        )}

        {/* Input Hasil Reviu Form Fields */}
        {selectedProject && (
          <div className="space-y-5 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status Realisasi Reviu */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Status Tahap Reviu</label>
                <select
                  value={reviuStatus}
                  onChange={(e) => setReviuStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                >
                  <option value="ST Terbit">Surat Tugas (ST) Terbit</option>
                  <option value="Laporan Terbit">Laporan Hasil Reviu Terbit</option>
                </select>
              </div>

              {/* ST Number */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Nomor Surat Tugas (ST)</label>
                <input
                  type="text"
                  value={stNumber}
                  onChange={(e) => setStNumber(e.target.value)}
                  placeholder="Contoh: ST-045/PW.01/2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                />
              </div>
            </div>

            {/* Laporan & Nilai Reviu fields only active if status is Laporan Terbit */}
            {reviuStatus === 'Laporan Terbit' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-brand-peach/10 border border-brand-peach/40 rounded-xl animate-fade-in">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Nomor Laporan Hasil Reviu (LHP)</label>
                  <input
                    type="text"
                    value={laporanNumber}
                    onChange={(e) => setLaporanNumber(e.target.value)}
                    placeholder="Contoh: LHP-022/PW.01/2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Nilai Hasil Reviu Akhir (Rp)</label>
                  <input
                    type="number"
                    value={nilaiReviu}
                    onChange={(e) => setNilaiReviu(e.target.value)}
                    placeholder="Contoh: 4100000000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white font-bold rounded-lg text-sm shadow-sm transition-all duration-200 cursor-pointer flex items-center space-x-1.5"
              >
                <Save className="h-4.5 w-4.5" />
                <span>Simpan Hasil Reviu</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
