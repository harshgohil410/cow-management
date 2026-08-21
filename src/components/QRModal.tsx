'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Cow } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Sparkles } from 'lucide-react';

interface QRModalProps {
  cow: Cow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ cow, isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen || !cow) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
        
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Gaushala Official Tag QR
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tag & Name Header */}
        <div className="my-3">
          <span className="bg-indigo-500/10 text-indigo-400 font-mono font-bold text-base px-3 py-1 rounded-xl border border-indigo-500/20 inline-block">
            {cow.tagNumber}
          </span>
          <h2 className="text-lg font-bold text-slate-100 mt-2">
            {cow.name || 'Gir Cattle'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {cow.breed} • {cow.gender === 'female' ? 'Female' : 'Male'} • {cow.color || 'Standard'}
          </p>
        </div>

        {/* SVG QR Code Generator */}
        <div className="my-6 bg-white p-5 rounded-2xl inline-block shadow-lg border-2 border-indigo-500/30">
          <QRCodeSVG 
            value={`GAUSHALA:${cow.tagNumber}:${cow.id}`}
            size={160}
            level="H"
            includeMargin={true}
          />
        </div>

        <p className="text-[11px] text-slate-400 mb-6">
          Scan with mobile camera or field reader to open instant medical & milk records profile.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md"
          >
            <Printer className="w-4 h-4" /> Print Tag Sticker
          </button>
        </div>

      </div>
    </div>
  );
};
