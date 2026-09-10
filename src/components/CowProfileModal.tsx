'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { Cow } from '@/types';
import { 
  X, 
  Heart, 
  Baby, 
  Sparkles, 
  Stethoscope, 
  Syringe, 
  Milk, 
  Wheat, 
  FileText, 
  GitCommit, 
  QrCode, 
  Edit, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Plus
} from 'lucide-react';

interface CowProfileModalProps {
  cowId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEditCow: (cow: Cow) => void;
  onShowQR: (cow: Cow) => void;
}

const displayDate = (value?: string) => {
  if (!value) return '-';
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split('-');
  return year && month && day ? `${day}-${month}-${year}` : value;
};

export const CowProfileModal: React.FC<CowProfileModalProps> = ({
  cowId,
  isOpen,
  onClose,
  onEditCow,
  onShowQR
}) => {
  const { t } = useLanguage();
  const { 
    cows, 
    getFamilyTree, 
    pregnancies, 
    deliveries, 
    healthRecords, 
    vaccinations, 
    milkRecords, 
    feedRecords,
    calculateAge,
    addPregnancyRecord,
    addDeliveryRecord
  } = useGaushala();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'family' | 'pregnancy' | 'deliveries' | 'health' | 'vaccinations' | 'milk' | 'feed' | 'documents'
  >('overview');
  const [inseminationDate, setInseminationDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [breedingType, setBreedingType] = useState<'Artificial Insemination' | 'Natural'>('Artificial Insemination');
  const [bullTagOrSemenCode, setBullTagOrSemenCode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [deliveryType, setDeliveryType] = useState<'normal' | 'assisted' | 'caesarean' | 'stillbirth'>('normal');
  const [calfId, setCalfId] = useState('');
  const [calfGender, setCalfGender] = useState<'female' | 'male'>('female');
  const [workflowMessage, setWorkflowMessage] = useState('');

  if (!isOpen || !cowId) return null;

  const cow = cows.find(c => c.id === cowId);
  if (!cow) return null;

  const family = getFamilyTree(cow.id);
  const ageYears = calculateAge(cow.dateOfBirth);
  const cowPregnancies = pregnancies.filter(p => p.cowId === cow.id);
  const cowDeliveries = deliveries.filter(d => d.motherId === cow.id);
  const cowHealth = healthRecords.filter(h => h.cowId === cow.id);
  const cowVaccines = vaccinations.filter(v => v.cowId === cow.id);
  const cowMilk = milkRecords.filter(m => m.cowId === cow.id);
  const cowFeed = feedRecords.filter(f => f.cowId === cow.id);

  // Computed Vihani count
  const vihaniCount = cowDeliveries.length;
  const handlePregnancySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorkflowMessage('');
    try {
      await addPregnancyRecord({
        cowId: cow.id,
        cowTagNumber: cow.tagNumber,
        inseminationDate,
        breedingType,
        bullTagOrSemenCode,
        expectedDeliveryDate,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        notes: ''
      });
      setWorkflowMessage('Pregnancy saved. The cow is now marked pregnant.');
    } catch (error) {
      setWorkflowMessage(error instanceof Error ? error.message : 'Unable to save pregnancy.');
    }
  };

  const handleDeliverySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorkflowMessage('');
    try {
      await addDeliveryRecord({
        motherId: cow.id,
        motherTag: cow.tagNumber,
        motherName: cow.name,
        pregnancyId: cowPregnancies.find(p => p.status === 'confirmed')?.id,
        calfId: calfId || undefined,
        calfGender,
        deliveryDate,
        deliveryType,
        notes: ''
      });
      setWorkflowMessage(`Delivery saved. Total Deliveries (Vihani): ${vihaniCount + 1}`);
    } catch (error) {
      setWorkflowMessage(error instanceof Error ? error.message : 'Unable to save delivery.');
    }
  };

  const tabs = [
    { id: 'overview', label: t('tabOverview'), icon: Sparkles },
    { id: 'family', label: t('tabFamily'), icon: GitCommit },
    { id: 'pregnancy', label: t('tabPregnancy'), icon: Heart },
    { id: 'deliveries', label: `${t('tabDeliveries')} (${vihaniCount})`, icon: Baby },
    { id: 'health', label: t('tabHealth'), icon: Stethoscope },
    { id: 'vaccinations', label: t('tabVaccinations'), icon: Syringe },
    { id: 'milk', label: t('tabMilk'), icon: Milk },
    { id: 'feed', label: t('tabFeed'), icon: Wheat },
    { id: 'documents', label: t('tabDocuments'), icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Profile Section */}
        <div className="bg-slate-950 p-6 border-b border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              {cow.photoUrl ? (
                <img
                  src={cow.photoUrl}
                  alt={cow.name || cow.tagNumber}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border-2 border-indigo-500/50 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-indigo-500/50 flex items-center justify-center font-bold text-indigo-400 text-lg">
                  {cow.tagNumber}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                    {cow.tagNumber} — {cow.name || 'Gir Cow'}
                  </h1>
                  <span className="bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs px-3 py-1 rounded-full border border-indigo-500/20">
                    Vihani: {vihaniCount}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-medium text-slate-400">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                    {t(cow.status as any) || cow.status}
                  </span>
                  <span>•</span>
                  <span>{cow.gender === 'female' ? 'Female' : 'Male'}</span>
                  <span>•</span>
                  <span>{cow.breed}</span>
                  <span>•</span>
                  <span className="text-indigo-400 font-semibold">{ageYears < 1 ? '< 1 Year (Calf)' : `${ageYears} Years Old`}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => onShowQR(cow)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold transition"
              >
                <QrCode className="w-4 h-4" /> QR Code
              </button>

              <button
                onClick={() => onEditCow(cow)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-md"
              >
                <Edit className="w-4 h-4" /> {t('edit')}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto mt-6 pt-3 border-t border-slate-800 pb-1 scrollbar-none">
            {tabs.map((tItem) => {
              const IconComp = tItem.icon;
              const isActive = activeTab === tItem.id;
              return (
                <button
                  key={tItem.id}
                  onClick={() => setActiveTab(tItem.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Tag & Registration</span>
                  <p className="text-xl font-bold text-indigo-400 font-mono mt-1">{cow.tagNumber}</p>
                  <p className="text-xs text-slate-300 mt-1">Source: {cow.source || 'Gaushala Born'}</p>
                  <p className="text-xs text-slate-400">Entry Date: {displayDate(cow.entryDate)}</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pregnancy & Lactation Status</span>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold text-purple-400">
                      Pregnant: {cow.isPregnant ? 'YES' : 'NO'}
                    </p>
                    <p className="text-xs font-semibold text-sky-400">
                      Lactating: {cow.isLactating ? 'YES' : 'NO'}
                    </p>
                    <p className="text-xs font-semibold text-indigo-400">
                      Total Deliveries (Vihani): {vihaniCount}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Lineage Summary</span>
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <p>Mother: <span className="text-indigo-400 font-medium">{cow.motherName || 'Unknown / External'}</span></p>
                    <p>Father: <span className="text-indigo-400 font-medium">{cow.fatherName || 'Unknown / External'}</span></p>
                    <p>Calves Count: <span className="text-indigo-400 font-medium">{family?.calves.length || 0} Calves</span></p>
                  </div>
                </div>
              </div>

              {cow.notes && (
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-200 mb-1">Special Notes & Characteristics</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{cow.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* 2. FAMILY TREE TAB */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-4">
                  <GitCommit className="w-4 h-4 text-indigo-400" />
                  Visual Lineage Tree (Mother → {cow.name || cow.tagNumber} → Calves)
                </h3>

                {/* Tree Visual */}
                <div className="space-y-6">
                  
                  {/* Mother Level */}
                  <div className="flex justify-center">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center min-w-[200px] shadow-sm">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block">Mother Cow</span>
                      <p className="text-xs font-bold text-indigo-400 mt-1">
                        {family?.mother ? `${family.mother.tagNumber} (${family.mother.name || 'Gir'})` : cow.motherName || 'External Mother'}
                      </p>
                    </div>
                  </div>

                  <div className="w-0.5 h-6 bg-indigo-500/40 mx-auto" />

                  {/* Current Cow Level */}
                  <div className="flex justify-center">
                    <div className="bg-slate-900 border-2 border-indigo-500/60 p-4 rounded-2xl text-center min-w-[240px] shadow-lg">
                      <span className="text-[10px] uppercase text-indigo-400 font-bold block">Active Profile</span>
                      <p className="text-base font-bold text-slate-100 mt-1">
                        {cow.tagNumber} — {cow.name || 'Gir Cow'}
                      </p>
                      <p className="text-xs text-slate-400">{cow.breed} • {cow.gender}</p>
                    </div>
                  </div>

                  <div className="w-0.5 h-6 bg-indigo-500/40 mx-auto" />

                  {/* Calves Level */}
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block text-center mb-3">
                      Offspring / Calves ({family?.calves.length || 0})
                    </span>
                    {family?.calves.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center italic">No registered calves in system yet</p>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-3">
                        {family?.calves.map(calf => (
                          <div key={calf.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center min-w-[160px]">
                            <span className="text-[10px] text-emerald-400 font-semibold block">{calf.gender === 'female' ? 'Female Calf' : 'Male Calf'}</span>
                            <p className="text-xs font-bold text-indigo-400 mt-0.5">{calf.tagNumber}</p>
                            <p className="text-[11px] text-slate-300">{calf.name || 'Unnamed'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 3. PREGNANCY TAB */}
          {activeTab === 'pregnancy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-400" />
                  Breeding & Pregnancy History Records
                </h3>
              </div>

              <form onSubmit={handlePregnancySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
                <label className="text-[10px] text-slate-400">Insemination Date
                  <input required type="date" value={inseminationDate} onChange={event => setInseminationDate(event.target.value)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                </label>
                <label className="text-[10px] text-slate-400">Expected Delivery Date
                  <input required type="date" value={expectedDeliveryDate} onChange={event => setExpectedDeliveryDate(event.target.value)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                </label>
                <label className="text-[10px] text-slate-400">Breeding Type
                  <select value={breedingType} onChange={event => setBreedingType(event.target.value as typeof breedingType)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
                    <option>Artificial Insemination</option>
                    <option>Natural</option>
                  </select>
                </label>
                <label className="text-[10px] text-slate-400">Bull / Semen Code
                  <input value={bullTagOrSemenCode} onChange={event => setBullTagOrSemenCode(event.target.value)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                </label>
                <button type="submit" className="sm:col-span-2 justify-self-start bg-orange-500 hover:bg-orange-400 text-white rounded-lg px-3 py-2 text-xs font-semibold">Save Pregnancy</button>
              </form>
              {workflowMessage && <p className="text-xs text-orange-300">{workflowMessage}</p>}

              {cowPregnancies.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No pregnancy records logged for this cow.</p>
              ) : (
                <div className="space-y-3">
                  {cowPregnancies.map(p => (
                    <div key={p.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                          Status: {p.status}
                        </span>
                        <span className="text-xs text-slate-400">Insemination: {p.inseminationDate}</span>
                      </div>
                      <div className="grid grid-cols-2 text-xs text-slate-300 gap-2 pt-1">
                        <p>Breeding: {p.breedingType}</p>
                        <p>Bull / Semen: <span className="text-indigo-400 font-medium">{p.bullTagOrSemenCode}</span></p>
                        <p>Expected Due: <span className="text-indigo-400 font-medium">{p.expectedDeliveryDate}</span></p>
                        <p>Attending Vet: {p.vetName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. DELIVERIES TAB */}
          {activeTab === 'deliveries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-emerald-400" />
                  Deliveries History & Automatic "Vihani" Count
                </h3>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Vihani Count: {vihaniCount}
                </span>
              </div>

              <form onSubmit={handleDeliverySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
                <label className="text-[10px] text-slate-400">Delivery Date
                  <input required type="date" value={deliveryDate} onChange={event => setDeliveryDate(event.target.value)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                </label>
                <label className="text-[10px] text-slate-400">Calf Gender
                  <select value={calfGender} onChange={event => setCalfGender(event.target.value as typeof calfGender)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </label>
                <label className="text-[10px] text-slate-400">Delivery Type
                  <select value={deliveryType} onChange={event => setDeliveryType(event.target.value as typeof deliveryType)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
                    <option value="normal">Normal</option>
                    <option value="assisted">Assisted</option>
                    <option value="caesarean">Caesarean</option>
                    <option value="stillbirth">Stillbirth</option>
                  </select>
                </label>
                <label className="text-[10px] text-slate-400">Existing Calf (optional)
                  <select value={calfId} onChange={event => setCalfId(event.target.value)} className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
                    <option value="">Add calf later</option>
                    {cows.filter(otherCow => otherCow.id !== cow.id).map(otherCow => <option key={otherCow.id} value={otherCow.id}>{otherCow.tagNumber} - {otherCow.name || 'Unnamed'}</option>)}
                  </select>
                </label>
                <button type="submit" className="sm:col-span-2 justify-self-start bg-orange-500 hover:bg-orange-400 text-white rounded-lg px-3 py-2 text-xs font-semibold">Save Delivery / Vihani</button>
              </form>
              {workflowMessage && <p className="text-xs text-orange-300">{workflowMessage}</p>}

              {cowDeliveries.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No detailed delivery logs recorded.</p>
              ) : (
                <div className="space-y-3">
                  {cowDeliveries.map((d, index) => (
                    <div key={d.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-400">
                          Vihani #{cowDeliveries.length - index}
                        </span>
                        <span className="text-xs text-slate-400">Date: {d.deliveryDate}</span>
                      </div>
                      <div className="grid grid-cols-2 text-xs text-slate-300 gap-2">
                        <p>Delivery Type: <span className="capitalize text-slate-200">{d.deliveryType}</span></p>
                        <p>Calf Gender: <span className="font-semibold text-emerald-400 capitalize">{d.calfGender}</span></p>
                        <p>Birth Weight: {d.birthWeightKg || '27'} kg</p>
                        <p>Vet: {d.vetName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. HEALTH TAB */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                Medical Events & Diagnosis History
              </h3>

              {cowHealth.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No medical illness records for this cow.</p>
              ) : (
                <div className="space-y-3">
                  {cowHealth.map(h => (
                    <div key={h.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-rose-400">{h.diagnosis}</span>
                        <span className="text-xs text-slate-400">{h.recordDate}</span>
                      </div>
                      <p className="text-xs text-slate-300">Treatment: {h.treatment}</p>
                      <p className="text-[11px] text-slate-400">Prescribed: {h.prescribedMedicines}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. VACCINATIONS TAB */}
          {activeTab === 'vaccinations' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-indigo-400" />
                Vaccination & Deworming Schedule
              </h3>

              {cowVaccines.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No vaccinations scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {cowVaccines.map(v => (
                    <div key={v.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-xs text-slate-200">{v.vaccineName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Scheduled: {v.scheduledDate}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border capitalize ${
                        v.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. MILK TAB */}
          {activeTab === 'milk' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Milk className="w-4 h-4 text-sky-400" />
                Milk Yield Production Logs
              </h3>

              {cowMilk.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No milk yield recorded for this cow yet.</p>
              ) : (
                <div className="space-y-3">
                  {cowMilk.map(m => (
                    <div key={m.id} className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-slate-200">{m.session} Yield</span>
                        <p className="text-xs text-slate-400">{m.recordDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-sky-400">{m.quantityLiters} L</span>
                        {m.fatPercentage && (
                          <span className="text-[10px] text-slate-400 block">FAT: {m.fatPercentage}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 8. FEED TAB */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Wheat className="w-4 h-4 text-amber-400" />
                Feed & Nutrition Logs
              </h3>
              <p className="text-xs text-slate-400">Standard daily diet: 25kg Green Lucerne Fodder + 4kg Concentrate Dan.</p>
            </div>
          )}

          {/* 9. DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="space-y-4 text-center py-6">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">Gaushala Tag Certificate & Registration Document available.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
