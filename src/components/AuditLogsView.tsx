'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { ShieldCheck, User } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { t } = useLanguage();
  const { auditLogs } = useGaushala();

  return (
    <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md my-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            {t('auditLogTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Security & Accountability log for staff record changes
          </p>
        </div>
        <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20">
          {auditLogs.length} Events Logged
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-300 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <th className="p-3.5">{t('timestamp')}</th>
              <th className="p-3.5">{t('user')}</th>
              <th className="p-3.5">{t('role')}</th>
              <th className="p-3.5">{t('action')}</th>
              <th className="p-3.5">{t('details')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-3.5 font-semibold text-slate-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  {log.userName}
                </td>
                <td className="p-3.5">
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-slate-700 capitalize">
                    {log.userRole}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                    log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    log.action === 'VACCINATED' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    log.action === 'MEDICAL_ALERT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300 text-xs">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
