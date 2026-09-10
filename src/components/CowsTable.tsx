'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { Cow, CowGender, CowStatus } from '@/types';
import { 
  Eye, 
  Edit, 
  QrCode, 
  Archive, 
  Filter, 
  RotateCcw, 
  Search, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  HeartPulse,
  Plus
} from 'lucide-react';

interface CowsTableProps {
  onViewProfile: (cowId: string) => void;
  onEditCow: (cow: Cow) => void;
  onShowQR: (cow: Cow) => void;
  onOpenAddCow: () => void;
  searchTermExternal?: string;
  initialFilterType?: string;
  initialFilterVal?: any;
}

export const CowsTable: React.FC<CowsTableProps> = ({
  onViewProfile,
  onEditCow,
  onShowQR,
  onOpenAddCow,
  searchTermExternal = '',
  initialFilterType,
  initialFilterVal
}) => {
  const { t } = useLanguage();
  const { cows, archiveCow, calculateAge } = useGaushala();

  // Local Search & Filter States
  const [searchTerm, setSearchTerm] = useState(searchTermExternal);
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPregnancy, setSelectedPregnancy] = useState<string>('all');
  const [selectedLactation, setSelectedLactation] = useState<string>('all');
  const [medicalOnly, setMedicalOnly] = useState<boolean>(initialFilterType === 'medical' ? true : false);

  // Sync external search term if changed
  React.useEffect(() => {
    if (searchTermExternal !== undefined) {
      setSearchTerm(searchTermExternal);
    }
  }, [searchTermExternal]);

  // Extract unique breeds from dataset
  const breedsList = useMemo(() => {
    const set = new Set(cows.map(c => c.breed));
    return Array.from(set);
  }, [cows]);

  // Filtered dataset logic
  const filteredCows = useMemo(() => {
    return cows.filter(cow => {
      // Exclude archived unless requested
      if (selectedStatus !== 'archived' && cow.status === 'archived') return false;

      // Text search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTag = cow.tagNumber.toLowerCase().includes(query);
        const matchName = (cow.name || '').toLowerCase().includes(query);
        const matchBreed = cow.breed.toLowerCase().includes(query);
        if (!matchTag && !matchName && !matchBreed) return false;
      }

      // Breed Filter
      if (selectedBreed !== 'all' && cow.breed !== selectedBreed) return false;

      // Gender Filter
      if (selectedGender !== 'all' && cow.gender !== selectedGender) return false;

      // Status Filter
      if (selectedStatus !== 'all' && cow.status !== selectedStatus) return false;

      // Pregnancy Filter
      if (selectedPregnancy === 'pregnant' && !cow.isPregnant) return false;
      if (selectedPregnancy === 'not_pregnant' && cow.isPregnant) return false;

      // Lactation Filter
      if (selectedLactation === 'lactating' && !cow.isLactating) return false;
      if (selectedLactation === 'dry' && cow.isLactating) return false;

      // Medical Attention Filter
      if (medicalOnly && !(cow.medicalAttentionRequired || cow.status === 'sick')) return false;

      return true;
    });
  }, [
    cows, 
    searchTerm, 
    selectedBreed, 
    selectedGender, 
    selectedStatus, 
    selectedPregnancy, 
    selectedLactation, 
    medicalOnly
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBreed('all');
    setSelectedGender('all');
    setSelectedStatus('all');
    setSelectedPregnancy('all');
    setSelectedLactation('all');
    setMedicalOnly(false);
  };

  return (
    <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md my-6">
      
      {/* Header & Quick Add */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              {t('navCows')}
            </h2>
            <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-700">
              {filteredCows.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete herd directory, breeding history, and health status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('resetFilters')}
          </button>

          <button
            onClick={onOpenAddCow}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t('addCowButton')}
          </button>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 mb-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t('filter')} Panel</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Breed Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">{t('filterBreed')}</label>
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">{t('all')} Breeds</option>
              {breedsList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">{t('filterGender')}</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">{t('all')}</option>
              <option value="female">Female (માદા)</option>
              <option value="male">Male (નર)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">{t('filterStatus')}</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">{t('all')}</option>
              <option value="active">{t('active')}</option>
              <option value="sick">{t('sick')}</option>
              <option value="pregnant">{t('pregnantCows')}</option>
              <option value="archived">{t('archived')}</option>
            </select>
          </div>

          {/* Pregnancy Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">{t('filterPregnancy')}</label>
            <select
              value={selectedPregnancy}
              onChange={(e) => setSelectedPregnancy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">{t('all')}</option>
              <option value="pregnant">Pregnant Only</option>
              <option value="not_pregnant">Non-pregnant</option>
            </select>
          </div>

          {/* Lactation Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">{t('filterLactation')}</label>
            <select
              value={selectedLactation}
              onChange={(e) => setSelectedLactation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">{t('all')}</option>
              <option value="lactating">Lactating Only</option>
              <option value="dry">Dry</option>
            </select>
          </div>

          {/* Medical Checkbox */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2 rounded-xl border border-slate-800 w-full">
              <input
                type="checkbox"
                checked={medicalOnly}
                onChange={(e) => setMedicalOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400 bg-slate-950 border-slate-700"
              />
              <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Medical
              </span>
            </label>
          </div>

        </div>
      </div>

      {/* COWS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-300 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <th className="p-3.5">{t('tagId')}</th>
              <th className="p-3.5">{t('name')}</th>
              <th className="p-3.5">{t('photo')}</th>
              <th className="p-3.5">{t('gender')}</th>
              <th className="p-3.5">{t('breed')}</th>
              <th className="p-3.5">{t('age')}</th>
              <th className="p-3.5 text-center">{t('pregnant')}</th>
              <th className="p-3.5 text-center">{t('lactating')}</th>
              <th className="p-3.5">{t('status')}</th>
              <th className="p-3.5 text-right">{t('actions')}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredCows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-slate-500 font-medium">
                  No cattle records match the selected search & filter criteria.
                </td>
              </tr>
            ) : (
              filteredCows.map((cow) => {
                const ageYears = calculateAge(cow.dateOfBirth);
                return (
                  <tr 
                    key={cow.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    {/* Tag ID */}
                    <td className="p-3.5 font-mono font-bold text-indigo-400 text-sm">
                      <button 
                        onClick={() => onViewProfile(cow.id)}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        {cow.tagNumber}
                        <span title="Requires Vet Attention">
                          <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        </span>
                      </button>
                    </td>

                    {/* Cow Name */}
                    <td className="p-3.5 font-semibold text-slate-100">
                      {cow.name || <span className="text-slate-500 italic">Unnamed</span>}
                    </td>

                    {/* Photo thumbnail */}
                    <td className="p-3.5">
                      {cow.photoUrl ? (
                        <img 
                          src={cow.photoUrl} 
                          alt={cow.name || cow.tagNumber}
                          className="w-10 h-10 object-cover rounded-xl border border-slate-800 shadow-sm group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-medium">
                          NO IMG
                        </div>
                      )}
                    </td>

                    {/* Gender */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        cow.gender === 'female' 
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {cow.gender === 'female' ? 'Female' : 'Male'}
                      </span>
                    </td>

                    {/* Breed */}
                    <td className="p-3.5 font-medium text-slate-300">
                      {cow.breed}
                    </td>

                    {/* Age */}
                    <td className="p-3.5 font-medium text-slate-300">
                      {ageYears < 1 ? '< 1 Year (Calf)' : `${ageYears} Years`}
                    </td>

                    {/* Pregnant */}
                    <td className="p-3.5 text-center">
                      {cow.isPregnant ? (
                        <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-500/20">
                          <CheckCircle2 className="w-3 h-3 text-purple-400" /> {t('yes')}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Lactating */}
                    <td className="p-3.5 text-center">
                      {cow.isLactating ? (
                        <span className="inline-flex items-center gap-1 bg-sky-500/10 text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-500/20">
                          <CheckCircle2 className="w-3 h-3 text-sky-400" /> {t('yes')}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border capitalize ${
                        cow.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : cow.status === 'sick'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : cow.status === 'pregnant'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {t(cow.status as any) || cow.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Profile */}
                        <button
                          onClick={() => onViewProfile(cow.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title={t('view')}
                        >
                          <Eye className="w-4 h-4 text-indigo-400" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEditCow(cow)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title={t('edit')}
                        >
                          <Edit className="w-4 h-4 text-amber-400" />
                        </button>

                        {/* QR Code */}
                        <button
                          onClick={() => onShowQR(cow)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title={t('qrCode')}
                        >
                          <QrCode className="w-4 h-4 text-sky-400" />
                        </button>

                        {/* Archive */}
                        <button
                          onClick={() => archiveCow(cow.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition"
                          title={t('archive')}
                        >
                          <Archive className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
