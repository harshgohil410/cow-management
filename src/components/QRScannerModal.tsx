'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { X, Search, Camera, QrCode } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCow: (cowId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectCow
}) => {
  const { t } = useLanguage();
  const { cows } = useGaushala();
  const [manualQuery, setManualQuery] = useState('');

  if (!isOpen) return null;

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    const matched = cows.find(
      c => c.tagNumber.toLowerCase() === manualQuery.trim().toLowerCase() ||
           (c.name && c.name.toLowerCase().includes(manualQuery.trim().toLowerCase()))
    );

    if (matched) {
      onSelectCow(matched.id);
      onClose();
    } else {
      alert(`No cow found matching tag or name: "${manualQuery}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 text-center">
        
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-indigo-400" />
            Field QR Tag Reader
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Scanner Mock Box */}
        <div className="relative bg-slate-950 border-2 border-dashed border-indigo-500/40 rounded-2xl p-8 my-4 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
            <Camera className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-slate-200">Point Camera at Ear Tag QR Code</p>
          <p className="text-[11px] text-slate-400 mt-1">Scanning automatically in field mode...</p>
        </div>

        {/* Manual Tag Entry Fallback */}
        <form onSubmit={handleManualSearch} className="mt-5 space-y-2">
          <label className="text-[11px] font-medium text-slate-400 block text-left">
            Or enter Tag ID manually:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. GSH-0001"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
            >
              Open Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
