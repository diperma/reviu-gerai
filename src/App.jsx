import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import StatCard from './components/StatCard';
import ChartsSection from './components/ChartsSection';
import DataTable from './components/DataTable';
import DetailDrawer from './components/DetailDrawer';
import ApprovalPanel from './components/ApprovalPanel';
import InputForm from './components/InputForm';
import RequestList from './components/RequestList';
import {
  mockProjects,
  mockMonthlyTrends
} from './data/mockData';
import {
  ClipboardList,
  FileCheck,
  FileText,
  FileSpreadsheet,
  Award,
  BookOpen
} from 'lucide-react';
import { formatRupiahShort } from './utils/formatters';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Regional Filter States
  const [selectedProvinsi, setSelectedProvinsi] = useState('All');
  const [selectedKabKota, setSelectedKabKota] = useState('All');
  const [selectedKecamatan, setSelectedKecamatan] = useState('All');
  const [selectedDesa, setSelectedDesa] = useState('All');
  
  // Basic Filter States
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Projects State
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  // Reset Filters
  const resetFilters = () => {
    setSelectedProvinsi('All');
    setSelectedKabKota('All');
    setSelectedKecamatan('All');
    setSelectedDesa('All');
    setSelectedYear('All');
    setSelectedType('All');
    setSearchTerm('');
  };

  // Approval action handler
  const handleApprovalAction = (projectId, action) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, statusApproval: action } : p))
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => ({ ...prev, statusApproval: action }));
    }
  };

  // Save review outcome handler
  const handleSaveReview = (updatedProject) => {
    setProjects(prev =>
      prev.map(p => (p.id === updatedProject.id ? updatedProject : p))
    );
    setActiveTab('dashboard');
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchProvinsi = selectedProvinsi === 'All' || project.provinsi === selectedProvinsi;
      const matchKabKota = selectedKabKota === 'All' || project.kabKota === selectedKabKota;
      const matchKecamatan = selectedKecamatan === 'All' || project.kecamatan === selectedKecamatan;
      const matchDesa = selectedDesa === 'All' || project.desa === selectedDesa;
      
      const yearOfProject = new Date(project.tanggalBast).getFullYear().toString();
      const matchYear = selectedYear === 'All' || yearOfProject === selectedYear;

      const matchType = selectedType === 'All' || project.type === selectedType;

      const matchSearch =
        searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.desa.toLowerCase().includes(searchTerm.toLowerCase());

      return matchProvinsi && matchKabKota && matchKecamatan && matchDesa && matchYear && matchType && matchSearch;
    });
  }, [projects, selectedProvinsi, selectedKabKota, selectedKecamatan, selectedDesa, selectedYear, selectedType, searchTerm]);

  // Recalculate stats dynamically based on filtered projects
  const dynamicStats = useMemo(() => {
    let stTerbitCount = 0;
    let laporanTerbitCount = 0;
    let bastCount = 0;

    const uniqueDocs = new Set();
    const uniqueDesas = new Set();

    const nilaiDiajukan = {
      bangunan: { nilai: 0, qty: 0 },
      sarana: { nilai: 0, qty: 0 },
      kendaraan: { nilai: 0, qty: 0 }
    };

    const nilaiReviu = {
      bangunan: { nilai: 0, qty: 0 },
      sarana: { nilai: 0, qty: 0 },
      kendaraan: { nilai: 0, qty: 0 }
    };

    filteredProjects.forEach((proj) => {
      if (proj.vervalStatus === 'BAST Terbit') {
        bastCount++;
      }
      if (proj.reviuStatus === 'ST Terbit') {
        stTerbitCount++;
      } else if (proj.reviuStatus === 'Laporan Terbit') {
        stTerbitCount++;
        laporanTerbitCount++;
      }

      if (proj.docPermintaan) uniqueDocs.add(proj.docPermintaan);
      if (proj.desa) uniqueDesas.add(proj.desa);

      // Financial and Quantity breakdown
      const assetKey = proj.assetClass.toLowerCase(); // 'bangunan' | 'sarana' | 'kendaraan'
      if (nilaiDiajukan[assetKey] !== undefined) {
        nilaiDiajukan[assetKey].nilai += proj.nilaiBast;
        nilaiDiajukan[assetKey].qty += (proj.qtyBangunan + proj.qtySarana + proj.qtyKendaraan);
      }
      if (nilaiReviu[assetKey] !== undefined) {
        nilaiReviu[assetKey].nilai += proj.nilaiReviu;
        nilaiReviu[assetKey].qty += (proj.qtyBangunan + proj.qtySarana + proj.qtyKendaraan);
      }
    });

    const totalDiajukan =
      nilaiDiajukan.bangunan.nilai + nilaiDiajukan.sarana.nilai + nilaiDiajukan.kendaraan.nilai;
    const totalReviu =
      nilaiReviu.bangunan.nilai + nilaiReviu.sarana.nilai + nilaiReviu.kendaraan.nilai;

    // Formatting for Chart compatibility
    const chartSummaryStats = {
      nilaiDiajukan: {
        bangunan: nilaiDiajukan.bangunan.nilai,
        sarana: nilaiDiajukan.sarana.nilai,
        kendaraan: nilaiDiajukan.kendaraan.nilai
      },
      nilaiReviu: {
        bangunan: nilaiReviu.bangunan.nilai,
        sarana: nilaiReviu.sarana.nilai,
        kendaraan: nilaiReviu.kendaraan.nilai
      }
    };

    return {
      permintaanVerval: filteredProjects.length,
      docCount: uniqueDocs.size,
      desaCount: uniqueDesas.size,
      bastTerbit: bastCount,
      stTerbit: stTerbitCount,
      laporanTerbit: laporanTerbitCount,
      nilaiDiajukan,
      nilaiReviu,
      totalDiajukan,
      totalReviu,
      chartSummaryStats
    };
  }, [filteredProjects]);

  // Activity breakdown by Province for Chart
  const provincialChartData = useMemo(() => {
    const provinceDataMap = {};
    filteredProjects.forEach(proj => {
      const prov = proj.provinsi;
      if (!provinceDataMap[prov]) {
        provinceDataMap[prov] = { name: prov, permintaanVerval: 0, stTerbit: 0, laporanTerbit: 0 };
      }
      provinceDataMap[prov].permintaanVerval++;
      if (proj.reviuStatus === 'ST Terbit') {
        provinceDataMap[prov].stTerbit++;
      } else if (proj.reviuStatus === 'Laporan Terbit') {
        provinceDataMap[prov].stTerbit++;
        provinceDataMap[prov].laporanTerbit++;
      }
    });
    return Object.values(provinceDataMap);
  }, [filteredProjects]);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Dashboard Reviu Pembangunan KDKMP (Koperasi Desa/Kelurahan Merah Putih)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sistem Pengawasan Serah Terima Aset Gerai, Gudang & Perlengkapan KDKMP - BPKP
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse"></span>
            <span>Live Sync Wilayah</span>
          </div>
        </header>

        {/* Global Filter Bar */}
        <FilterBar
          selectedProvinsi={selectedProvinsi}
          setSelectedProvinsi={setSelectedProvinsi}
          selectedKabKota={selectedKabKota}
          setSelectedKabKota={setSelectedKabKota}
          selectedKecamatan={selectedKecamatan}
          setSelectedKecamatan={setSelectedKecamatan}
          selectedDesa={selectedDesa}
          setSelectedDesa={setSelectedDesa}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resetFilters={resetFilters}
        />

        {/* Tab Components */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 1: Permintaan Verval */}
              <StatCard
                title="Permintaan Verval"
                value={dynamicStats.permintaanVerval}
                subtitle="Total Permintaan Masuk"
                icon={ClipboardList}
                color="indigo"
                trend="12% vs bln lalu"
              />

              {/* Card 2: BAST Terbit */}
              <StatCard
                title="BAST Terbit"
                value={dynamicStats.bastTerbit}
                subtitle="Dokumen BAST Terbit"
                icon={FileText}
                color="amber"
                trend={`${Math.round((dynamicStats.bastTerbit / (dynamicStats.permintaanVerval || 1)) * 100)}% Rasio`}
                breakdown={dynamicStats.nilaiDiajukan}
              />

              {/* Card 3: Permintaan Reviu */}
              <StatCard
                title="Permintaan Reviu"
                value={`${dynamicStats.docCount} Dokumen`}
                subtitle="Total Dokumen Permintaan"
                icon={BookOpen}
                color="indigo"
              />

              {/* Card 4: Realisasi Reviu */}
              <StatCard
                title="Realisasi Reviu (Output)"
                value={`${dynamicStats.laporanTerbit} / ${dynamicStats.stTerbit}`}
                subtitle="Laporan / Surat Tugas Terbit"
                icon={Award}
                color="emerald"
                trend={`${Math.round((dynamicStats.laporanTerbit / (dynamicStats.permintaanVerval || 1)) * 100)}% Selesai`}
              />

              {/* Card 5: Nilai Hasil Reviu BPKP */}
              <StatCard
                title="Nilai Hasil Reviu BPKP"
                value={dynamicStats.totalReviu}
                subtitle={`Efisiensi: ${formatRupiahShort(dynamicStats.totalDiajukan - dynamicStats.totalReviu)}`}
                icon={FileCheck}
                color="rose"
                breakdown={dynamicStats.nilaiReviu}
              />
            </div>

            {/* Charts Section */}
            <ChartsSection
              kdkmpData={provincialChartData.length > 0 ? provincialChartData : [{ name: 'Tidak ada data', 'Permintaan Verval': 0, 'ST Terbit': 0, 'Laporan Terbit': 0 }]}
              monthlyTrends={mockMonthlyTrends}
              summaryStats={dynamicStats.chartSummaryStats}
            />

            {/* Recent Table Summary */}
            <DataTable
              projects={filteredProjects}
              onSelectProject={setSelectedProject}
            />
          </div>
        )}

        {activeTab === 'approval' && (
          <ApprovalPanel
            projects={projects}
            onSelectProject={setSelectedProject}
            onApprovalAction={handleApprovalAction}
          />
        )}

        {activeTab === 'projects' && (
          <DataTable
            projects={filteredProjects}
            onSelectProject={setSelectedProject}
          />
        )}

        {activeTab === 'requests' && (
          <RequestList
            projects={filteredProjects}
            onSelectProject={setSelectedProject}
          />
        )}

        {activeTab === 'input' && (
          <InputForm projects={projects} onSubmitSuccess={handleSaveReview} />
        )}
      </main>

      {/* Detail Slide-out Drawer */}
      <DetailDrawer
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        onApprovalAction={handleApprovalAction}
      />
    </div>
  );
}
