import React from 'react';
import { LayoutDashboard, FileText, CheckSquare, Layers, ChevronLeft, ChevronRight, Edit, ClipboardList } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Daftar Reviu', icon: ClipboardList },
    { id: 'approval', label: 'Persetujuan Internal', icon: CheckSquare },
    { id: 'projects', label: 'Daftar Proyek / BAST', icon: FileText },
    { id: 'input', label: 'Input Hasil Reviu', icon: Edit },
  ];

  return (
    <aside className={`bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header / Logo */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="bg-brand-teal text-white p-2 rounded-lg shadow-sm flex-shrink-0">
            <Layers className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in whitespace-nowrap">
              <h1 className="font-extrabold text-slate-800 text-base leading-tight tracking-tight">
                REVIU ASSET
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider">
                BPKP DASHBOARD
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0"
          title={isCollapsed ? "Tampilkan Menu" : "Sembunyikan Menu"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
              } ${
                isActive
                  ? 'bg-brand-pale text-brand-teal shadow-xs border-l-4 border-brand-teal'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-brand-teal' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="animate-fade-in whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="h-10 w-10 rounded-full bg-brand-peach flex items-center justify-center text-brand-teal font-bold border border-brand-terracotta/20 flex-shrink-0">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in whitespace-nowrap">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin Deputi</p>
              <p className="text-xs text-slate-500 truncate">deputi-perekonomian@bpkp.go.id</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
