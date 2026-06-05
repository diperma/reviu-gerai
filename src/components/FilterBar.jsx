import React, { useMemo } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { mockRegions } from '../data/mockData';

export default function FilterBar({
  selectedProvinsi,
  setSelectedProvinsi,
  selectedKabKota,
  setSelectedKabKota,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedDesa,
  setSelectedDesa,
  selectedYear,
  setSelectedYear,
  selectedType,
  setSelectedType,
  searchTerm,
  setSearchTerm,
  resetFilters
}) {
  // Province Options
  const provinsiOptions = useMemo(() => Object.keys(mockRegions), []);

  // Kab/Kota Options based on selected Provinsi
  const kabKotaOptions = useMemo(() => {
    if (selectedProvinsi === 'All' || !mockRegions[selectedProvinsi]) return [];
    return Object.keys(mockRegions[selectedProvinsi]);
  }, [selectedProvinsi]);

  // Kecamatan Options based on selected Kab/Kota
  const kecamatanOptions = useMemo(() => {
    if (
      selectedProvinsi === 'All' ||
      selectedKabKota === 'All' ||
      !mockRegions[selectedProvinsi]?.[selectedKabKota]
    ) {
      return [];
    }
    return Object.keys(mockRegions[selectedProvinsi][selectedKabKota]);
  }, [selectedProvinsi, selectedKabKota]);

  // Desa Options based on selected Kecamatan
  const desaOptions = useMemo(() => {
    if (
      selectedProvinsi === 'All' ||
      selectedKabKota === 'All' ||
      selectedKecamatan === 'All' ||
      !mockRegions[selectedProvinsi]?.[selectedKabKota]?.[selectedKecamatan]
    ) {
      return [];
    }
    return mockRegions[selectedProvinsi][selectedKabKota][selectedKecamatan];
  }, [selectedProvinsi, selectedKabKota, selectedKecamatan]);

  // Handle Province change
  const handleProvinsiChange = (e) => {
    setSelectedProvinsi(e.target.value);
    setSelectedKabKota('All');
    setSelectedKecamatan('All');
    setSelectedDesa('All');
  };

  // Handle Kab/Kota change
  const handleKabKotaChange = (e) => {
    setSelectedKabKota(e.target.value);
    setSelectedKecamatan('All');
    setSelectedDesa('All');
  };

  // Handle Kecamatan change
  const handleKecamatanChange = (e) => {
    setSelectedKecamatan(e.target.value);
    setSelectedDesa('All');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-slate-800">
          <Filter className="h-5 w-5 text-brand-teal" />
          <h3 className="font-semibold text-sm">Filter Berjenjang Wilayah & KDKMP</h3>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 rounded-lg text-xs font-bold bg-white transition-all shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Provinsi */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Provinsi</label>
          <select
            value={selectedProvinsi}
            onChange={handleProvinsiChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">Semua Provinsi</option>
            {provinsiOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Kabupaten / Kota */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Kabupaten / Kota</label>
          <select
            value={selectedKabKota}
            onChange={handleKabKotaChange}
            disabled={selectedProvinsi === 'All'}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">Semua Kab/Kota</option>
            {kabKotaOptions.map((kk) => (
              <option key={kk} value={kk}>{kk}</option>
            ))}
          </select>
        </div>

        {/* Kecamatan */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Kecamatan</label>
          <select
            value={selectedKecamatan}
            onChange={handleKecamatanChange}
            disabled={selectedKabKota === 'All'}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">Semua Kecamatan</option>
            {kecamatanOptions.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Kelurahan / Desa */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Kelurahan / Desa</label>
          <select
            value={selectedDesa}
            onChange={(e) => setSelectedDesa(e.target.value)}
            disabled={selectedKecamatan === 'All'}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">Semua Desa/Kelurahan</option>
            {desaOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
        {/* Search */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Pencarian Proyek</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama gerai, gudang, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
            />
          </div>
        </div>

        {/* Project Type */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Jenis Pembangunan</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">Semua Jenis</option>
            <option value="Gerai">Gerai</option>
            <option value="Gudang">Gudang</option>
            <option value="Perlengkapan">Perlengkapan</option>
          </select>
        </div>

        {/* Tahun */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Tahun Anggaran</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">Semua Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
    </div>
  );
}
