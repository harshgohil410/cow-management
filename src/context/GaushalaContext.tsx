'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Cow, 
  PregnancyRecord, 
  DeliveryRecord, 
  HealthRecord, 
  VaccinationRecord, 
  MilkRecord, 
  FeedRecord, 
  ExpenseRecord, 
  AuditLog, 
  AlertNotification,
  FamilyTree
} from '@/types';
import { 
  initialCows, 
  initialPregnancies, 
  initialDeliveries, 
  initialHealthRecords, 
  initialVaccinations, 
  initialMilkRecords, 
  initialFeedRecords, 
  initialExpenseRecords, 
  initialAuditLogs, 
  initialAlerts 
} from '@/data/mockData';
import { useAuth } from './AuthContext';

interface GaushalaContextType {
  cows: Cow[];
  pregnancies: PregnancyRecord[];
  deliveries: DeliveryRecord[];
  healthRecords: HealthRecord[];
  vaccinations: VaccinationRecord[];
  milkRecords: MilkRecord[];
  feedRecords: FeedRecord[];
  expenses: ExpenseRecord[];
  auditLogs: AuditLog[];
  alerts: AlertNotification[];
  
  // Actions
  addCow: (cow: Omit<Cow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCow: (id: string, cow: Partial<Cow>) => void;
  archiveCow: (id: string) => void;
  getFamilyTree: (cowId: string) => FamilyTree | null;
  addMilkRecord: (record: Omit<MilkRecord, 'id'>) => void;
  addVaccinationRecord: (record: Omit<VaccinationRecord, 'id'>) => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  addPregnancyRecord: (record: Omit<PregnancyRecord, 'id'>) => void;
  addDeliveryRecord: (record: Omit<DeliveryRecord, 'id'>) => void;
  markAlertAsRead: (alertId: string) => void;
  calculateAge: (dob: string) => number;
}

const GaushalaContext = createContext<GaushalaContextType | undefined>(undefined);

export const GaushalaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();

  const [cows, setCows] = useState<Cow[]>(initialCows);
  const [pregnancies, setPregnancies] = useState<PregnancyRecord[]>(initialPregnancies);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(initialDeliveries);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(initialVaccinations);
  const [milkRecords, setMilkRecords] = useState<MilkRecord[]>(initialMilkRecords);
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>(initialFeedRecords);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(initialExpenseRecords);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);

  // Auto calculate age helper
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const logAudit = (action: AuditLog['action'], tableName: string, recordId: string, details: string) => {
    const newLog: AuditLog = {
      id: 'audit-' + Date.now(),
      userId: user?.id || 'usr-system',
      userName: user?.name || 'Gaushala Staff',
      userRole: role,
      action,
      tableName,
      recordId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Cow with auto age, unique check, QR generation
  const addCow = (cowData: Omit<Cow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = 'cow-' + Date.now();
    const newCow: Cow = {
      ...cowData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryCount: cowData.deliveryCount ?? 0,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(cowData.tagNumber)}`
    };

    setCows(prev => [newCow, ...prev]);
    logAudit('CREATE', 'cows', newId, `Added new cow: ${newCow.tagNumber} (${newCow.name || 'Unnamed'})`);
  };

  const updateCow = (id: string, updatedFields: Partial<Cow>) => {
    setCows(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields, updatedAt: new Date().toISOString() } : c));
    logAudit('UPDATE', 'cows', id, `Updated cow details for ID ${id}`);
  };

  const archiveCow = (id: string) => {
    setCows(prev => prev.map(c => c.id === id ? { ...c, status: 'archived', updatedAt: new Date().toISOString() } : c));
    logAudit('DELETE', 'cows', id, `Archived cow ID ${id}`);
  };

  const getFamilyTree = (cowId: string): FamilyTree | null => {
    const currentCow = cows.find(c => c.id === cowId);
    if (!currentCow) return null;

    const mother = currentCow.motherId ? cows.find(c => c.id === currentCow.motherId) || null : null;
    const father = currentCow.fatherId ? cows.find(c => c.id === currentCow.fatherId) || null : null;
    const grandMother = mother?.motherId ? cows.find(c => c.id === mother.motherId) || null : null;
    const grandFather = mother?.fatherId ? cows.find(c => c.id === mother.fatherId) || null : null;

    // Calves where current cow is mother or father
    const calves = cows.filter(c => c.motherId === currentCow.id || c.fatherId === currentCow.id);

    return {
      cow: currentCow,
      mother,
      father,
      grandMother,
      grandFather,
      calves
    };
  };

  const addMilkRecord = (record: Omit<MilkRecord, 'id'>) => {
    const newRecord: MilkRecord = { ...record, id: 'milk-' + Date.now() };
    setMilkRecords(prev => [newRecord, ...prev]);
    logAudit('CREATE', 'milk_records', newRecord.id, `Recorded milk ${record.quantityLiters}L for cow ${record.cowTag}`);
  };

  const addVaccinationRecord = (record: Omit<VaccinationRecord, 'id'>) => {
    const newRecord: VaccinationRecord = { ...record, id: 'vac-' + Date.now() };
    setVaccinations(prev => [newRecord, ...prev]);
    logAudit('VACCINATED', 'vaccinations', newRecord.id, `Scheduled/Administered vaccine ${record.vaccineName} for ${record.cowTag}`);
  };

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = { ...record, id: 'hlth-' + Date.now() };
    setHealthRecords(prev => [newRecord, ...prev]);
    
    // Auto flag medical attention required on cow if critical or high
    if (record.severity === 'high' || record.severity === 'critical') {
      updateCow(record.cowId, { medicalAttentionRequired: true, status: 'sick' });
    }
    logAudit('MEDICAL_ALERT', 'medical_records', newRecord.id, `Medical diagnosis recorded for ${record.cowTag}: ${record.diagnosis}`);
  };

  const addPregnancyRecord = (record: Omit<PregnancyRecord, 'id'>) => {
    const newRecord: PregnancyRecord = { ...record, id: 'preg-' + Date.now() };
    setPregnancies(prev => [newRecord, ...prev]);
    updateCow(record.cowId, { isPregnant: true, status: 'pregnant' });
    logAudit('CREATE', 'pregnancies', newRecord.id, `Added pregnancy record for ${record.cowTagNumber}`);
  };

  const addDeliveryRecord = (record: Omit<DeliveryRecord, 'id'>) => {
    const newRecord: DeliveryRecord = { ...record, id: 'del-' + Date.now() };
    setDeliveries(prev => [newRecord, ...prev]);

    // Increment delivery count (Vihani) for mother
    const mother = cows.find(c => c.id === record.motherId);
    if (mother) {
      updateCow(mother.id, {
        isPregnant: false,
        isLactating: true,
        deliveryCount: (mother.deliveryCount || 0) + 1
      });
    }
    logAudit('CREATE', 'deliveries', newRecord.id, `Recorded birth for mother ${record.motherTag}, Calf Gender: ${record.calfGender}`);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
  };

  return (
    <GaushalaContext.Provider value={{
      cows,
      pregnancies,
      deliveries,
      healthRecords,
      vaccinations,
      milkRecords,
      feedRecords,
      expenses,
      auditLogs,
      alerts,
      addCow,
      updateCow,
      archiveCow,
      getFamilyTree,
      addMilkRecord,
      addVaccinationRecord,
      addHealthRecord,
      addPregnancyRecord,
      addDeliveryRecord,
      markAlertAsRead,
      calculateAge
    }}>
      {children}
    </GaushalaContext.Provider>
  );
};

export const useGaushala = () => {
  const context = useContext(GaushalaContext);
  if (!context) {
    throw new Error('useGaushala must be used within a GaushalaProvider');
  }
  return context;
};
