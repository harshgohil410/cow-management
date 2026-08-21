'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useGaushala } from '@/context/GaushalaContext';
import { Cow } from '@/types';

// Components
import { Navbar } from '@/components/Navbar';
import { StatCards } from '@/components/StatCards';
import { DashboardWidgets } from '@/components/DashboardWidgets';
import { CowsTable } from '@/components/CowsTable';
import { AddCowModal } from '@/components/AddCowModal';
import { CowProfileModal } from '@/components/CowProfileModal';
import { QRModal } from '@/components/QRModal';
import { QRScannerModal } from '@/components/QRScannerModal';
import { AuditLogsView } from '@/components/AuditLogsView';
import { LoginModal } from '@/components/LoginModal';

import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  ShieldCheck, 
  QrCode, 
  Milk, 
  Stethoscope, 
  Heart, 
  Wheat, 
  FileSpreadsheet,
  Download,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { role, user } = useAuth();
  const { cows } = useGaushala();

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Search & Filters state
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [activeFilterType, setActiveFilterType] = useState<string | undefined>();
  const [activeFilterVal, setActiveFilterVal] = useState<any>();

  // Modals state
  const [isAddCowOpen, setIsAddCowOpen] = useState(false);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);

  const [selectedCowProfileId, setSelectedCowProfileId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [qrCow, setQrCow] = useState<Cow | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Handlers
  const handleSearch = (term: string) => {
    setGlobalSearchTerm(term);
    if (term.trim() && activeTab !== 'cows') {
      setActiveTab('cows');
    }
  };

  const handleStatCardFilter = (filterType: string, filterVal: any) => {
    setActiveFilterType(filterType);
    setActiveFilterVal(filterVal);
    setActiveTab('cows');
  };

  const handleViewProfile = (cowId: string) => {
    setSelectedCowProfileId(cowId);
    setIsProfileOpen(true);
  };

  const handleEditCow = (cow: Cow) => {
    setEditingCow(cow);
    setIsAddCowOpen(true);
  };

  const handleShowQR = (cow: Cow) => {
    setQrCow(cow);
    setIsQrOpen(true);
  };

  const handleOpenAddCow = () => {
    setEditingCow(null);
    setIsAddCowOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ["Tag Number", "Name", "Gender", "Breed", "Date of Birth", "Pregnant", "Lactating", "Status"];
    const rows = cows.map(c => [
      c.tagNumber,
      c.name || "",
      c.gender,
      c.breed,
      c.dateOfBirth,
      c.isPregnant ? "Yes" : "No",
      c.isLactating ? "Yes" : "No",
      c.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gaushala_Cows_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        onSearch={handleSearch}
        onOpenAddCow={handleOpenAddCow}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* SUB-NAVIGATION & HERO BAR */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 py-3 px-4 sm:px-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('navDashboard')}</span>
            </button>

            <button
              onClick={() => setActiveTab('cows')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                activeTab === 'cows'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t('navCows')} ({cows.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                activeTab === 'audit'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('navAuditLogs')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
              title="Export Cows Data to CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export CSV</span>
            </button>

            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold text-indigo-400">
              {user ? `${user.name} (${role})` : 'Guest'}
            </div>
          </div>

        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TOP STAT CARDS (Visible on Dashboard & Directory) */}
        <StatCards onFilterSelect={handleStatCardFilter} />

        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <DashboardWidgets onSelectCow={handleViewProfile} />
            <CowsTable
              onViewProfile={handleViewProfile}
              onEditCow={handleEditCow}
              onShowQR={handleShowQR}
              onOpenAddCow={handleOpenAddCow}
              searchTermExternal={globalSearchTerm}
            />
          </div>
        )}

        {/* VIEW 2: COWS DIRECTORY */}
        {activeTab === 'cows' && (
          <CowsTable
            onViewProfile={handleViewProfile}
            onEditCow={handleEditCow}
            onShowQR={handleShowQR}
            onOpenAddCow={handleOpenAddCow}
            searchTermExternal={globalSearchTerm}
            initialFilterType={activeFilterType}
            initialFilterVal={activeFilterVal}
          />
        )}

        {/* VIEW 3: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <AuditLogsView />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-6 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="font-semibold text-slate-300">ગૌશાળા કેટેલ મૅનેજમૅન્ટ સિસ્ટમ</span>
            <span>• Enterprise Edition</span>
          </div>

          <div className="text-slate-500">
            <p>Relational Supabase Architecture • Gujarati & English Dual Support</p>
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      <AddCowModal
        isOpen={isAddCowOpen}
        onClose={() => {
          setIsAddCowOpen(false);
          setEditingCow(null);
        }}
        editCow={editingCow}
      />

      <CowProfileModal
        cowId={selectedCowProfileId}
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedCowProfileId(null);
        }}
        onEditCow={handleEditCow}
        onShowQR={handleShowQR}
      />

      <QRModal
        cow={qrCow}
        isOpen={isQrOpen}
        onClose={() => {
          setIsQrOpen(false);
          setQrCow(null);
        }}
      />

      <QRScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onSelectCow={handleViewProfile}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

    </div>
  );
}
