'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useGaushala } from '@/context/GaushalaContext';
import { UserRole } from '@/types';
import { 
  Globe, 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  QrCode, 
  PlusCircle, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';

interface NavbarProps {
  onSearch: (term: string) => void;
  onOpenAddCow: () => void;
  onOpenQrScanner: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  onOpenAddCow, 
  onOpenQrScanner,
  activeTab,
  setActiveTab
}) => {
  const { lang, setLang, t } = useLanguage();
  const { user, role, setRole, logout } = useAuth();
  const { alerts, markAlertAsRead } = useGaushala();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isRead);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-950">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-black text-emerald-400">ગૌ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-100">
                  {t('appTitle')}
                </h1>
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                {t('subTitle')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Quick Actions & Switchers */}
          <div className="flex items-center gap-2">
            
            {/* Scan QR Button */}
            <button
              onClick={onOpenQrScanner}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition"
              title="Scan Tag QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('navQrScanner')}</span>
            </button>

            {/* Add Cow Button */}
            <button
              onClick={onOpenAddCow}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">{t('addCowButton')}</span>
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'gu' ? 'en' : 'gu')}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'gu' ? 'EN' : 'ગુજરાતી'}</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="capitalize text-indigo-300 hidden lg:inline">{t(role as any) || role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                    {t('selectRolePrompt')}
                  </div>
                  {(['admin', 'manager', 'staff', 'vet'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-slate-800/60 ${role === r ? 'text-indigo-400 font-bold bg-slate-800/30' : 'text-slate-300'}`}
                    >
                      <span className="capitalize">{t(r as any) || r}</span>
                      {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-400" /> {t('todaysAlerts')}
                    </h3>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                      {unreadAlerts.length} new
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {alerts.length === 0 ? (
                      <p className="text-slate-400 text-center py-4">No active alerts</p>
                    ) : (
                      alerts.map(a => (
                        <div
                          key={a.id}
                          onClick={() => markAlertAsRead(a.id)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer ${
                            a.isRead 
                              ? 'bg-slate-950/40 border-slate-800 text-slate-400' 
                              : a.alertType === 'danger'
                              ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                              : a.alertType === 'warning'
                              ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                              : 'bg-indigo-950/30 border-indigo-800/50 text-indigo-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {a.alertType === 'danger' ? (
                              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="font-bold text-xs">{a.title}</p>
                              <p className="text-[11px] mt-0.5 opacity-90">{a.message}</p>
                              <span className="text-[9px] opacity-60 mt-1 block">
                                {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
