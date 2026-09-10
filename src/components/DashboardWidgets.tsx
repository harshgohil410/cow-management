'use client';

import React, { useEffect, useState } from 'react';
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

interface DashboardWidgetsProps {
  onSelectCow: (cowId: string) => void;
}

type ChartRange = 'daily' | 'weekly' | 'monthly';

const dateKey = (value: string | Date) => {
  const valueString = value instanceof Date ? value.toISOString() : String(value);
  return valueString.slice(0, 10);
};

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
  const [milkError, setMilkError] = useState('');
  const [chartRange, setChartRange] = useState<ChartRange>('monthly');

  useEffect(() => {
    const firstFemaleCow = cows.find(cow => cow.gender === 'female');
    if (firstFemaleCow && !cows.some(cow => String(cow.id) === quickCowId)) {
      setQuickCowId(String(firstFemaleCow.id));
    }
  }, [cows, quickCowId]);

  // Today's total milk calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysMilkTotal = milkRecords
    .filter(m => dateKey(m.recordDate) === todayStr)
    .reduce((sum, r) => sum + r.quantityLiters, 0);

  const handleQuickMilkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMilkError('');
    setShowMilkSuccess(false);
    const quantityLiters = Number(quickLiters);
    if (!quickCowId || !Number.isFinite(quantityLiters) || quantityLiters <= 0) {
      setMilkError('Select a cow and enter a valid milk quantity.');
      return;
    }

    const cow = cows.find(c => String(c.id) === quickCowId);
    if (!cow) {
      setMilkError('No cow is available for this milk record.');
      return;
    }

    try {
      await addMilkRecord({
        cowId: cow.id,
        cowTag: cow.tagNumber,
        cowName: cow.name || cow.tagNumber,
        recordDate: todayStr,
        session: quickSession,
        quantityLiters,
        recordedBy: 'Gaushala Staff'
      });

      setQuickLiters('');
      setShowMilkSuccess(true);
      setTimeout(() => setShowMilkSuccess(false), 3000);
    } catch (error) {
      setMilkError(error instanceof Error ? error.message : 'Unable to save milk record.');
    }
  };

  const formatDateKey = (date: Date) => (
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  );

  const chartData = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chartRange === 'daily') {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - index));
        const currentDateKey = formatDateKey(date);
        const totalMilk = milkRecords
          .filter(record => dateKey(record.recordDate) === currentDateKey)
          .reduce((total, record) => total + Number(record.quantityLiters), 0);
        return {
          period: date.toLocaleDateString(undefined, { weekday: 'short' }),
          Milk: Number(totalMilk.toFixed(1))
        };
      });
    }

    if (chartRange === 'weekly') {
      const mondayOffset = (today.getDay() + 6) % 7;
      const currentMonday = new Date(today);
      currentMonday.setDate(today.getDate() - mondayOffset);
      return Array.from({ length: 6 }, (_, index) => {
        const start = new Date(currentMonday);
        start.setDate(currentMonday.getDate() - (5 - index) * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const startKey = formatDateKey(start);
        const endKey = formatDateKey(end);
        const totalMilk = milkRecords
          .filter(record => dateKey(record.recordDate) >= startKey && dateKey(record.recordDate) <= endKey)
          .reduce((total, record) => total + Number(record.quantityLiters), 0);
        return {
          period: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          Milk: Number(totalMilk.toFixed(1))
        };
      });
    }

    return Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(today);
      monthDate.setDate(1);
      monthDate.setMonth(monthDate.getMonth() - (5 - index));
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      const totalMilk = milkRecords
        .filter(record => dateKey(record.recordDate).startsWith(monthKey))
        .reduce((total, record) => total + Number(record.quantityLiters), 0);
      return {
        period: monthDate.toLocaleDateString(undefined, { month: 'short' }),
        Milk: Number(totalMilk.toFixed(1))
      };
    });
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      
      {/* LEFT COLUMN: Alerts & Milk Yield Quick Widget */}
      <div className="space-y-6">
        
        {/* 🔔 Today's Alerts Widget */}
        <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
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
        <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
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
            {milkError && (
              <p className="text-[11px] text-rose-400 font-medium mt-1">{milkError}</p>
            )}
          </form>
        </div>

      </div>

      {/* CENTER & RIGHT COLUMN: Monthly Analytics Chart & Upcoming Vaccinations & Births */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 📊 Monthly Milk Production Chart */}
        <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                {t('milkProductionChart')}
              </h2>
              <p className="text-[11px] text-slate-400">Actual milk records from the last six months (liters)</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              {(['daily', 'weekly', 'monthly'] as ChartRange[]).map(range => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setChartRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                    chartRange === range
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {t(`chart${range[0].toUpperCase()}${range.slice(1)}` as 'chartDaily' | 'chartWeekly' | 'chartMonthly')}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="period" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#5F9B57" tick={{ fill: '#5F9B57', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="Milk" name="Milk Production (Liters)" fill="#5F9B57" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM ROW: Recent Births 🍼 & Upcoming Vaccinations 💉 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🍼 Recent Births */}
          <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md">
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
              {deliveries.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No birth records in MySQL yet.</p>
              ) : deliveries.slice(0, 3).map((d) => (
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
                <Syringe className="w-4 h-4 text-blue-400" />
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
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20">
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
