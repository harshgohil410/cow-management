'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, Lock, Mail, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLang, t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@gaushala.org');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
              ગૌ
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t('loginTitle')}</h2>
              <p className="text-xs text-slate-400">Enterprise Cattle Management System</p>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === 'gu' ? 'en' : 'gu')}
            className="flex items-center gap-1.5 bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 hover:bg-slate-700 transition"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'gu' ? 'EN' : 'ગુજરાતી'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {t('selectRolePrompt')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['admin', 'manager', 'staff', 'vet'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold capitalize flex items-center justify-between transition ${
                    selectedRole === r
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{t(r as any) || r}</span>
                  {selectedRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Email / Phone */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {t('emailOrPhone')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="text-right">
            <a href="#" className="text-[11px] text-indigo-400 hover:underline">
              {t('forgotPassword')}
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {t('login')}
          </button>

        </form>

      </div>
    </div>
  );
};
