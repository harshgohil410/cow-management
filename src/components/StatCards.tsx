'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGaushala } from '@/context/GaushalaContext';
import { 
  Users, 
  Activity, 
  Heart, 
  Sparkles, 
  Stethoscope, 
  Syringe, 
  Milk, 
  Baby
} from 'lucide-react';

interface StatCardsProps {
  onFilterSelect?: (filterType: string, value: any) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ onFilterSelect }) => {
  const { t } = useLanguage();
  const { cows, vaccinations, calculateAge } = useGaushala();

  const totalCowsCount = cows.filter(c => c.status !== 'archived' && c.status !== 'deceased').length;
  const maleCount = cows.filter(c => c.gender === 'male' && c.status !== 'archived').length;
  const femaleCount = cows.filter(c => c.gender === 'female' && c.status !== 'archived').length;
  const pregnantCount = cows.filter(c => c.isPregnant && c.status !== 'archived').length;
  const lactatingCount = cows.filter(c => c.isLactating && c.status !== 'archived').length;
  
  // Calves under 1 year
  const calvesCount = cows.filter(c => {
    const age = calculateAge(c.dateOfBirth);
    return age < 1 && c.status !== 'archived';
  }).length;

  const medicalAttentionCount = cows.filter(c => c.medicalAttentionRequired || c.status === 'sick').length;
  const vaccinationsDueCount = vaccinations.filter(v => v.status === 'scheduled' || v.status === 'overdue').length;

  const cardList = [
    {
      id: 'total',
      title: t('totalCows'),
      value: totalCowsCount,
      icon: Users,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      badgeColor: 'bg-indigo-500/10 text-indigo-400',
      filterType: 'all'
    },
    {
      id: 'female',
      title: t('femaleCows'),
      value: femaleCount,
      icon: Heart,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badgeColor: 'bg-emerald-500/10 text-emerald-400',
      filterType: 'gender',
      filterVal: 'female'
    },
    {
      id: 'male',
      title: t('maleCows'),
      value: maleCount,
      icon: Activity,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badgeColor: 'bg-blue-500/10 text-blue-400',
      filterType: 'gender',
      filterVal: 'male'
    },
    {
      id: 'pregnant',
      title: t('pregnantCows'),
      value: pregnantCount,
      icon: Sparkles,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      badgeColor: 'bg-purple-500/10 text-purple-400',
      filterType: 'pregnant',
      filterVal: true
    },
    {
      id: 'lactating',
      title: t('lactatingCows'),
      value: lactatingCount,
      icon: Milk,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      badgeColor: 'bg-sky-500/10 text-sky-400',
      filterType: 'lactating',
      filterVal: true
    },
    {
      id: 'calves',
      title: t('calvesCount'),
      value: calvesCount,
      icon: Baby,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badgeColor: 'bg-amber-500/10 text-amber-400',
      filterType: 'age',
      filterVal: 'calf'
    },
    {
      id: 'medical',
      title: t('medicalAttention'),
      value: medicalAttentionCount,
      icon: Stethoscope,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      badgeColor: 'bg-rose-500/10 text-rose-400',
      filterType: 'medical',
      filterVal: true
    },
    {
      id: 'vaccinations',
      title: t('vaccinationsDue'),
      value: vaccinationsDueCount,
      icon: Syringe,
      color: 'border-slate-800 hover:border-slate-700 text-slate-100',
      iconColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      badgeColor: 'bg-yellow-500/10 text-yellow-400',
      filterType: 'vaccine',
      filterVal: true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 my-6">
      {cardList.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterSelect && onFilterSelect(card.filterType, card.filterVal)}
            className={`relative bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border ${card.color} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl border ${card.iconColor}`}>
                <IconComponent className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                Live
              </span>
            </div>

            <div className="mt-1">
              <p className="text-2xl font-black tracking-tight text-slate-100 group-hover:text-indigo-400 transition">
                {card.value}
              </p>
              <h3 className="text-xs font-medium text-slate-400 leading-tight mt-0.5 line-clamp-2">
                {card.title}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
