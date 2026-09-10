'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { Cow, CowGender, CowStatus } from '@/types';
import { X, Check, QrCode, Sparkles } from 'lucide-react';

interface AddCowModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCow?: Cow | null;
}

const dateInputValue = (value?: string | Date | null) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

export const AddCowModal: React.FC<AddCowModalProps> = ({ isOpen, onClose, editCow }) => {
  const { t } = useLanguage();
  const { cows, addCow, updateCow, calculateAge } = useGaushala();

  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [gender, setGender] = useState<CowGender>('female');
  const [breed, setBreed] = useState('Gir');
  const [color, setColor] = useState('Reddish Brown');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('Born in Gaushala');
  const [motherId, setMotherId] = useState<string>('');
  const [fatherId, setFatherId] = useState<string>('');
  const [fatherName, setFatherName] = useState<string>('');
  const [status, setStatus] = useState<CowStatus>('active');
  const [isPregnant, setIsPregnant] = useState(false);
  const [isLactating, setIsLactating] = useState(false);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-calculated age state
  const ageYears = calculateAge(dateOfBirth);

  useEffect(() => {
    if (editCow) {
      setTagNumber(editCow.tagNumber);
      setName(editCow.name || '');
      setPhotoUrl(editCow.photoUrl || '');
      setGender(editCow.gender);
      setBreed(editCow.breed);
      setColor(editCow.color || '');
      setDateOfBirth(dateInputValue(editCow.dateOfBirth));
      setEntryDate(dateInputValue(editCow.entryDate));
      setSource(editCow.source || 'Born in Gaushala');
      setMotherId(editCow.motherId || '');
      setFatherId(editCow.fatherId || '');
      setFatherName(editCow.fatherName || '');
      setStatus(editCow.status);
      setIsPregnant(editCow.isPregnant);
      setIsLactating(editCow.isLactating);
      setNotes(editCow.notes || '');
    } else {
      const nextNum = (cows.length + 1).toString().padStart(4, '0');
      setTagNumber(`GSH-${nextNum}`);
      setName('');
      setPhotoUrl('https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&q=80&w=800');
      setGender('female');
      setBreed('Gir');
      setColor('Reddish Brown');
      setDateOfBirth('2022-01-01');
      setEntryDate(new Date().toISOString().split('T')[0]);
      setSource('Born in Gaushala');
      setMotherId('');
      setFatherId('');
      setFatherName('');
      setStatus('active');
      setIsPregnant(false);
      setIsLactating(false);
      setNotes('');
    }
    setErrorMsg('');
  }, [editCow, isOpen, cows]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!tagNumber.trim()) {
      setErrorMsg('Tag Number is required.');
      return;
    }
    if (!dateOfBirth) {
      setErrorMsg('Date of Birth is required.');
      return;
    }

    if (!editCow && cows.some(c => c.tagNumber.toLowerCase() === tagNumber.trim().toLowerCase())) {
      setErrorMsg(`Tag Number "${tagNumber}" already exists in the system! Tag number must be unique.`);
      return;
    }

    const selectedMother = cows.find(c => c.id === motherId);

    try {
      if (editCow) {
        await updateCow(editCow.id, {
          tagNumber: tagNumber.trim(),
          name: name.trim() || undefined,
          photoUrl: photoUrl.trim() || undefined,
          gender,
          breed,
          color,
          dateOfBirth,
          entryDate,
          source,
          motherId: motherId || null,
          fatherId: fatherId || null,
          motherName: selectedMother?.name || selectedMother?.tagNumber,
          fatherName: fatherName || undefined,
          status,
          isPregnant,
          isLactating,
          notes
        });
      } else {
        await addCow({
          tagNumber: tagNumber.trim(),
          name: name.trim() || undefined,
          photoUrl: photoUrl.trim() || undefined,
          gender,
          breed,
          color,
          dateOfBirth,
          entryDate,
          source,
          motherId: motherId || null,
          fatherId: fatherId || null,
          motherName: selectedMother?.name || selectedMother?.tagNumber,
          fatherName: fatherName || undefined,
          status,
          isPregnant,
          isLactating,
          medicalAttentionRequired: false,
          notes,
          deliveryCount: 0
        });
      }

      onClose();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to save cow.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {editCow ? t('edit') : t('addCowTitle')}
            </h2>
            <p className="text-xs text-slate-400">
              Auto age calculation & instant QR code generation enabled
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Required Minimum Info */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              1. Minimum Required Details (આવશ્યક વિગતો)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('tagNumberReq')} *
                </label>
                <input
                  type="text"
                  required
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  placeholder="e.g. GSH-0008"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('gender')} *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as CowGender)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="female">Female (માદા ગાય / વાછરડી)</option>
                  <option value="male">Male (નર ખૂંટ / વાછરડો)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('status')} *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CowStatus)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">{t('active')}</option>
                  <option value="sick">{t('sick')}</option>
                  <option value="pregnant">{t('pregnantCows')}</option>
                  <option value="dry">{t('dry')}</option>
                  <option value="quarantined">{t('quarantined')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('dobReq')} * (Auto calculates age)
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                {dateOfBirth && (
                  <span className="text-[11px] text-indigo-400 font-medium mt-1 block">
                    Calculated Age: {ageYears < 1 ? '< 1 Year (Calf)' : `${ageYears} Years Old`}
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('entryDateReq')} *
                </label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lineage & Secondary Info */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              2. Optional Lineage & Profile Info (વંશાવલી અને વધારાની માહિતી)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('name')} (ગાયનું નામ)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gauri / ગૌરી"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('breed')} (ઓલાદ)
                </label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Gir">Gir (ગીર)</option>
                  <option value="Kankrej">Kankrej (કાંકરેજ)</option>
                  <option value="Sahiwal">Sahiwal (સાહીવાલ)</option>
                  <option value="Jafrabadi">Jafrabadi (જાફરાબાદી)</option>
                  <option value="HF Cross">HF Cross</option>
                  <option value="Jersey">Jersey</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('color')} (રંગ)
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Reddish Brown"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mother / Father Family relations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('mother')} (માતાની ટેગ/ઓળખ)
                </label>
                <select
                  value={motherId}
                  onChange={(e) => setMotherId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- No Mother Linked --</option>
                  {cows.filter(c => c.gender === 'female' && c.id !== editCow?.id).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.tagNumber} - {c.name || 'Gir Cow'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('father')} (પિતા / સીમન કોડ)
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g. GSH-0003 (Nandi) / Semen-99"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Photo & Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('source')} (પ્રાપ્તિ સ્ત્રોત)
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Born in Gaushala">Born in Gaushala</option>
                  <option value="Purchased">Purchased</option>
                  <option value="Donated">Donated</option>
                </select>
              </div>
            </div>

            {/* Pregnancy & Lactation flags */}
            {gender === 'female' && (
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-purple-400">
                  <input
                    type="checkbox"
                    checked={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-500 bg-slate-900 border-slate-700"
                  />
                  <span>Currently Pregnant</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-sky-400">
                  <input
                    type="checkbox"
                    checked={isLactating}
                    onChange={(e) => setIsLactating(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-slate-700"
                  />
                  <span>Currently Lactating</span>
                </label>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                {t('notes')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Health history or special characteristics..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {t('cancel')}
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition transform active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t('save')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
