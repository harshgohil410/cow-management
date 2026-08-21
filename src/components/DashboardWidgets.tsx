'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { 
  Bell, 
  Milk, 
  Baby, 
  Syringe, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  HeartPulse,
  Plus,
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface DashboardWidgetsProps {
  onSelectCow: (cowId: string) => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ onSelectCow }) => {
  const { t } = useLanguage();
  const { 
    alerts, 
    milkRecords, 
    deliveries, 
    vaccinations, 
    expenses, 
    cows, 
    addMilkRecord,
    markAlertAsRead 
  } = useGaushala();

  // Quick milk record state
  const [quickCowId, setQuickCowId] = useState(cows[0]?.id || '');
  const [quickLiters, setQuickLiters] = useState('');
  const [quickSession, setQuickSession] = useState<'Morning' | 'Evening'>('Morning');
  const [showMilkSuccess, setShowMilkSuccess] = useState(false);

  // Today's total milk calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysMilkTotal = milkRecords
    .filter(m => m.recordDate === todayStr)
    .reduce((sum, r) => sum + r.quantityLiters, 0);

  const handleQuickMilkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCowId || !quickLiters) return;

    const cow = cows.find(c => c.id === quickCowId);
    if (!cow) return;

    addMilkRecord({
      cowId: cow.id,
      cowTag: cow.tagNumber,
      cowName: cow.name || cow.tagNumber,
      recordDate: todayStr,
      session: quickSession,
      quantityLiters: parseFloat(quickLiters),
      recordedBy: 'Gaushala Staff'
    });

    setQuickLiters('');
    setShowMilkSuccess(true);
    setTimeout(() => setShowMilkSuccess(false), 3000);
  };

  // Chart dataset
  const chartData = [
    { month: 'Mar', Milk: 1850, Expense: 22000 },
    { month: 'Apr', Milk: 2100, Expense: 19500 },
    { month: 'May', Milk: 2450, Expense: 24000 },
    { month: 'Jun', Milk: 2300, Expense: 21000 },
    { month: 'Jul', Milk: 2600, Expense: 23500 },
    { month: 'Aug', Milk: 2850, Expense: 22700 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      
      {/* LEFT COLUMN: Alerts & Milk Yield Quick Widget */}
      <div className="space-y-6">
        
        {/* 🔔 Today's Alerts Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              {t('todaysAlerts')}
            </h2>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-semibold">
              {alerts.filter(a => !a.isRead).length} Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active alerts today</p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    markAlertAsRead(a.id);
                    if (a.cowId) onSelectCow(a.cowId);
                  }}
                  className={`p-3 rounded-2xl border transition cursor-pointer hover:border-slate-700 ${
                    a.alertType === 'danger'
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                      : a.alertType === 'warning'
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {a.alertType === 'danger' ? (
                      <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-200">{a.title}</h4>
                        {a.cowTag && (
                          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-indigo-400 font-mono">
                            {a.cowTag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{a.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🥛 Today's Milk Production Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Milk className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">{t('todaysMilk')}</h2>
                <p className="text-[11px] text-slate-400">Live Gaushala Collection</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-400">{todaysMilkTotal.toFixed(1)}</span>
              <span className="text-xs text-sky-400/80 ml-1 font-semibold">{t('liters')}</span>
            </div>
          </div>

          {/* Quick Add Milk Form */}
          <form onSubmit={handleQuickMilkSubmit} className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-400" /> Quick Milk Record Entry
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Select Cow</label>
                <select
                  value={quickCowId}
                  onChange={(e) => setQuickCowId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
                >
                  {cows.filter(c => c.gender === 'female').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.tagNumber} - {c.name || 'Gir Cow'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Session</label>
                <select
                  value={quickSession}
                  onChange={(e) => setQuickSession(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Morning">{t('morning')}</option>
                  <option value="Evening">{t('evening')}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                step="0.1"
                placeholder="Quantity in Liters"
                value={quickLiters}
                onChange={(e) => setQuickLiters(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm shrink-0"
              >
                {t('save')}
              </button>
            </div>

            {showMilkSuccess && (
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5" /> Milk record saved!
              </p>
            )}
          </form>
        </div>

      </div>

      {/* CENTER & RIGHT COLUMN: Monthly Analytics Chart & Upcoming Vaccinations & Births */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 📊 Monthly Milk vs Expense Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                {t('milkVsExpense')}
              </h2>
              <p className="text-[11px] text-slate-400">Monthly Production (Liters) vs Feed & Health Cost (₹)</p>
            </div>
            <span className="text-[11px] text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full font-medium border border-slate-700">
              2026 Analytics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fill: '#38bdf8', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#818cf8" tick={{ fill: '#818cf8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="Milk" name="Milk Production (Liters)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="Expense" name="Expenses (₹)" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 4, fill: '#818cf8' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM ROW: Recent Births 🍼 & Upcoming Vaccinations 💉 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🍼 Recent Births */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Baby className="w-4 h-4 text-emerald-400" />
                {t('recentBirths')}
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                {deliveries.length} Records
              </span>
            </div>

            <div className="space-y-2">
              {deliveries.slice(0, 3).map((d) => (
                <div 
                  key={d.id}
                  onClick={() => d.calfId && onSelectCow(d.calfId)}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200">Mother: {d.motherTag} ({d.motherName})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                        {d.calfGender === 'female' ? 'Female Calf' : 'Male Calf'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Delivered on: {d.deliveryDate} ({d.deliveryType})
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* 💉 Upcoming Vaccinations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-indigo-400" />
                {t('upcomingVaccinations')}
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                {vaccinations.filter(v => v.status === 'scheduled').length} Scheduled
              </span>
            </div>

            <div className="space-y-2">
              {vaccinations.filter(v => v.status === 'scheduled').slice(0, 3).map((v) => (
                <div 
                  key={v.id}
                  onClick={() => onSelectCow(v.cowId)}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200">{v.cowTag} ({v.cowName || 'Cow'})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                        {v.vaccineName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Due Date: {v.scheduledDate}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
