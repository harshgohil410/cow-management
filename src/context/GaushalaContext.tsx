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
import { mysqlApi } from '@/lib/mysql-client';

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
  addCow: (cow: Omit<Cow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCow: (id: string, cow: Partial<Cow>) => Promise<void>;
  archiveCow: (id: string) => Promise<void>;
  getFamilyTree: (cowId: string) => FamilyTree | null;
  addMilkRecord: (record: Omit<MilkRecord, 'id'>) => Promise<void>;
  addVaccinationRecord: (record: Omit<VaccinationRecord, 'id'>) => Promise<void>;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => Promise<void>;
  addPregnancyRecord: (record: Omit<PregnancyRecord, 'id'>) => Promise<void>;
  addDeliveryRecord: (record: Omit<DeliveryRecord, 'id'>) => Promise<void>;
  markAlertAsRead: (alertId: string) => Promise<void>;
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

  useEffect(() => {
    const loadFromMySql = async () => {
      const results = await Promise.all([
        mysqlApi.from('cows').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('pregnancies').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('deliveries').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('medical_records').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('vaccinations').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('milk_records').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('feed_records').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('expenses').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('audit_logs').select('*').order('created_at', { ascending: false }),
        mysqlApi.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      const [cowsResult, pregnanciesResult, deliveriesResult, healthResult, vaccinationsResult, milkResult, feedResult, expensesResult, auditResult, alertsResult] = results;
      results.forEach(result => {
        if (result.error) console.error('Unable to load MySQL data:', result.error);
      });

      const cowRows = cowsResult.data || [];
      const cowNames = new Map(cowRows.map(row => [row.id, { tag: row.tag_number, name: row.name }]));
      const deliveryCounts = new Map<string, number>();
      (deliveriesResult.data || []).forEach(row => {
        const motherId = String(row.mother_id);
        deliveryCounts.set(motherId, (deliveryCounts.get(motherId) || 0) + 1);
      });

      if (!cowsResult.error) setCows(cowRows.map(row => ({
        id: String(row.id),
        tagNumber: row.tag_number,
        name: row.name || undefined,
        photoUrl: row.photo_url || undefined,
        gender: row.gender,
        breed: row.breed,
        color: row.color || undefined,
        dateOfBirth: row.date_of_birth,
        entryDate: row.entry_date,
        source: row.source || undefined,
        motherId: row.mother_id == null ? null : String(row.mother_id),
        fatherId: row.father_id == null ? null : String(row.father_id),
        isPregnant: row.is_pregnant,
        isLactating: row.is_lactating,
        status: row.status,
        medicalAttentionRequired: row.medical_attention_required,
        qrCodeUrl: row.qr_code_url || undefined,
        notes: row.notes || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        deliveryCount: deliveryCounts.get(String(row.id)) || 0
      })));
      if (!pregnanciesResult.error) setPregnancies((pregnanciesResult.data || []).map(row => ({
        id: String(row.id),
        cowId: String(row.cow_id),
        cowTagNumber: cowNames.get(row.cow_id)?.tag || '',
        inseminationDate: row.insemination_date,
        breedingType: row.breeding_type,
        bullTagOrSemenCode: row.bull_tag_or_semen_code || '',
        expectedDeliveryDate: row.expected_delivery_date,
        actualDeliveryDate: row.actual_delivery_date || undefined,
        status: row.status,
        vetName: undefined,
        notes: row.notes || undefined,
        createdAt: row.created_at
      })));
      if (!deliveriesResult.error) setDeliveries((deliveriesResult.data || []).map(row => ({
        id: String(row.id),
        pregnancyId: row.pregnancy_id || undefined,
        motherId: String(row.mother_id),
        motherTag: cowNames.get(row.mother_id)?.tag || '',
        motherName: cowNames.get(row.mother_id)?.name || undefined,
        calfId: row.calf_id == null ? undefined : String(row.calf_id),
        calfTag: row.calf_id ? cowNames.get(row.calf_id)?.tag : undefined,
        deliveryDate: row.delivery_date,
        deliveryType: row.delivery_type,
        calfGender: row.calf_gender,
        birthWeightKg: row.birth_weight_kg || undefined,
        complications: row.complications || undefined,
        notes: row.notes || undefined
      })));
      if (!healthResult.error) setHealthRecords((healthResult.data || []).map(row => ({
        id: String(row.id),
        cowId: String(row.cow_id),
        cowTag: cowNames.get(row.cow_id)?.tag || '',
        diagnosis: row.diagnosis,
        symptoms: row.symptoms || '',
        treatment: row.treatment,
        prescribedMedicines: row.prescribed_medicines || undefined,
        severity: row.severity,
        vetName: row.attended_by || '',
        recordDate: row.record_date,
        followupDate: row.followup_date || undefined,
        resolved: row.resolved,
        notes: row.notes || undefined
      })));
      if (!vaccinationsResult.error) setVaccinations((vaccinationsResult.data || []).map(row => ({
        id: String(row.id),
        cowId: String(row.cow_id),
        cowTag: cowNames.get(row.cow_id)?.tag || '',
        cowName: cowNames.get(row.cow_id)?.name || undefined,
        vaccineName: row.vaccine_name,
        batchNumber: row.batch_number || undefined,
        scheduledDate: row.scheduled_date,
        givenDate: row.given_date || undefined,
        status: row.status,
        administeredBy: row.administered_by || undefined,
        nextDueDate: row.next_due_date || undefined,
        notes: row.notes || undefined
      })));
      if (!milkResult.error) setMilkRecords((milkResult.data || []).map(row => ({
        id: String(row.id),
        cowId: String(row.cow_id),
        cowTag: cowNames.get(row.cow_id)?.tag || '',
        cowName: cowNames.get(row.cow_id)?.name || undefined,
        recordDate: row.record_date,
        session: row.session,
        quantityLiters: Number(row.quantity_liters),
        fatPercentage: row.fat_percentage || undefined,
        snfPercentage: row.snf_percentage || undefined,
        recordedBy: row.recorded_by || '',
        notes: row.notes || undefined
      })));
      if (!feedResult.error) setFeedRecords((feedResult.data || []).map(row => ({
        id: String(row.id),
        cowId: row.cow_id == null ? null : String(row.cow_id),
        cowTag: row.cow_id ? cowNames.get(row.cow_id)?.tag : 'All Cows',
        feedType: row.feed_type,
        quantityKg: Number(row.quantity_kg),
        feedDate: row.feed_date,
        costRupees: Number(row.cost_rupees || 0),
        notes: row.notes || undefined
      })));
      if (!expensesResult.error) setExpenses((expensesResult.data || []).map(row => ({
        id: row.id,
        category: row.category,
        title: row.title,
        amount: Number(row.amount),
        expenseDate: row.expense_date,
        vendorOrPayee: row.vendor_or_payee || undefined,
        recordedBy: row.recorded_by || ''
      })));
      if (!auditResult.error) setAuditLogs((auditResult.data || []).map(row => ({
        id: row.id,
        userId: row.user_id || '',
        userName: row.user_email || '',
        userRole: 'staff',
        action: row.action,
        tableName: row.table_name,
        recordId: row.record_id || undefined,
        details: row.details,
        timestamp: row.created_at
      })));
      if (!alertsResult.error) setAlerts((alertsResult.data || []).map(row => ({
        id: row.id,
        title: row.title,
        message: row.message,
        alertType: row.alert_type,
        cowId: row.cow_id || undefined,
        cowTag: row.cow_id ? cowNames.get(row.cow_id)?.tag : undefined,
        isRead: row.is_read,
        timestamp: row.created_at
      })));
    };

    void loadFromMySql();
  }, []);

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

  const logAudit = async (action: AuditLog['action'], tableName: string, recordId: string, details: string) => {
    const normalizedRecordId = String(recordId);
    const newLog: AuditLog = {
      id: 'audit-' + Date.now(),
      userId: user?.id || 'usr-system',
      userName: user?.name || 'Gaushala Staff',
      userRole: role,
      action,
      tableName,
      recordId: normalizedRecordId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await mysqlApi.from('audit_logs').insert({
      user_id: user?.id && user.id.match(/^[0-9a-f-]{36}$/i) ? user.id : null,
      user_email: user?.email || null,
      action,
      table_name: tableName,
      record_id: normalizedRecordId.match(/^[0-9a-f-]{36}$/i) ? normalizedRecordId : null,
      details
    });
  };

  // Add Cow with auto age, unique check, QR generation
  const addCow = async (cowData: Omit<Cow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(cowData.tagNumber)}`;
    const { data, error } = await mysqlApi
      .from('cows')
      .insert({
        tag_number: cowData.tagNumber,
        name: cowData.name || null,
        photo_url: cowData.photoUrl || null,
        gender: cowData.gender,
        breed: cowData.breed,
        color: cowData.color || null,
        date_of_birth: cowData.dateOfBirth,
        entry_date: cowData.entryDate,
        source: cowData.source || null,
        mother_id: cowData.motherId || null,
        father_id: cowData.fatherId || null,
        is_pregnant: cowData.isPregnant,
        is_lactating: cowData.isLactating,
        status: cowData.status,
        medical_attention_required: cowData.medicalAttentionRequired,
        qr_code_url: qrCodeUrl,
        notes: cowData.notes || null
      })
      .select()
      .single();

    if (error) throw new Error(`Unable to save cow to MySQL: ${error.message}`);

    const newCow: Cow = {
      ...cowData,
      id: data.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deliveryCount: cowData.deliveryCount ?? 0,
      qrCodeUrl
    };

    setCows(prev => [newCow, ...prev]);
    void logAudit('CREATE', 'cows', data.id, `Added new cow: ${newCow.tagNumber} (${newCow.name || 'Unnamed'})`);
  };

  const updateCow = async (id: string, updatedFields: Partial<Cow>) => {
    const databaseFields = {
      ...(updatedFields.tagNumber !== undefined && { tag_number: updatedFields.tagNumber }),
      ...(updatedFields.name !== undefined && { name: updatedFields.name }),
      ...(updatedFields.photoUrl !== undefined && { photo_url: updatedFields.photoUrl }),
      ...(updatedFields.gender !== undefined && { gender: updatedFields.gender }),
      ...(updatedFields.breed !== undefined && { breed: updatedFields.breed }),
      ...(updatedFields.color !== undefined && { color: updatedFields.color }),
      ...(updatedFields.dateOfBirth !== undefined && { date_of_birth: updatedFields.dateOfBirth }),
      ...(updatedFields.entryDate !== undefined && { entry_date: updatedFields.entryDate }),
      ...(updatedFields.source !== undefined && { source: updatedFields.source }),
      ...(updatedFields.motherId !== undefined && { mother_id: updatedFields.motherId }),
      ...(updatedFields.fatherId !== undefined && { father_id: updatedFields.fatherId }),
      ...(updatedFields.isPregnant !== undefined && { is_pregnant: updatedFields.isPregnant }),
      ...(updatedFields.isLactating !== undefined && { is_lactating: updatedFields.isLactating }),
      ...(updatedFields.status !== undefined && { status: updatedFields.status }),
      ...(updatedFields.medicalAttentionRequired !== undefined && { medical_attention_required: updatedFields.medicalAttentionRequired }),
      ...(updatedFields.qrCodeUrl !== undefined && { qr_code_url: updatedFields.qrCodeUrl }),
      ...(updatedFields.notes !== undefined && { notes: updatedFields.notes })
    };
    const { error } = await mysqlApi.from('cows').update(databaseFields).eq('id', id);
    if (error) throw new Error(`Unable to update cow in MySQL: ${error.message}`);

    const updatedAt = new Date().toISOString();
    setCows(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields, updatedAt } : c));
    void logAudit('UPDATE', 'cows', id, `Updated cow details for ID ${id}`);
  };

  const archiveCow = async (id: string) => {
    const { error } = await mysqlApi.from('cows').update({ status: 'archived' }).eq('id', id);
    if (error) throw new Error(`Unable to archive cow in MySQL: ${error.message}`);

    setCows(prev => prev.map(c => c.id === id ? { ...c, status: 'archived', updatedAt: new Date().toISOString() } : c));
    void logAudit('DELETE', 'cows', id, `Archived cow ID ${id}`);
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

  const addMilkRecord = async (record: Omit<MilkRecord, 'id'>) => {
    const { data, error } = await mysqlApi.from('milk_records').insert({
      cow_id: record.cowId,
      record_date: record.recordDate,
      session: record.session,
      quantity_liters: record.quantityLiters,
      fat_percentage: record.fatPercentage || null,
      snf_percentage: record.snfPercentage || null,
      recorded_by: record.recordedBy.match(/^[0-9a-f-]{36}$/i) ? record.recordedBy : null,
      notes: record.notes || null
    }).select().single();
    if (error) throw new Error(`Unable to save milk record: ${error.message}`);
    const newRecord: MilkRecord = { ...record, id: data.id };
    setMilkRecords(prev => [newRecord, ...prev]);
    void logAudit('CREATE', 'milk_records', newRecord.id, `Recorded milk ${record.quantityLiters}L for cow ${record.cowTag}`);
  };

  const addVaccinationRecord = async (record: Omit<VaccinationRecord, 'id'>) => {
    const { data, error } = await mysqlApi.from('vaccinations').insert({
      cow_id: record.cowId,
      vaccine_name: record.vaccineName,
      batch_number: record.batchNumber || null,
      scheduled_date: record.scheduledDate,
      given_date: record.givenDate || null,
      status: record.status,
      administered_by: record.administeredBy || null,
      next_due_date: record.nextDueDate || null,
      notes: record.notes || null
    }).select().single();
    if (error) throw new Error(`Unable to save vaccination: ${error.message}`);
    const newRecord: VaccinationRecord = { ...record, id: data.id };
    setVaccinations(prev => [newRecord, ...prev]);
    void logAudit('VACCINATED', 'vaccinations', newRecord.id, `Scheduled/Administered vaccine ${record.vaccineName} for ${record.cowTag}`);
  };

  const addHealthRecord = async (record: Omit<HealthRecord, 'id'>) => {
    const { data, error } = await mysqlApi.from('medical_records').insert({
      cow_id: record.cowId,
      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      treatment: record.treatment,
      prescribed_medicines: record.prescribedMedicines || null,
      severity: record.severity,
      attended_by: record.vetName,
      record_date: record.recordDate,
      followup_date: record.followupDate || null,
      resolved: record.resolved,
      notes: record.notes || null
    }).select().single();
    if (error) throw new Error(`Unable to save medical record: ${error.message}`);
    const newRecord: HealthRecord = { ...record, id: data.id };
    setHealthRecords(prev => [newRecord, ...prev]);
    
    // Auto flag medical attention required on cow if critical or high
    if (record.severity === 'high' || record.severity === 'critical') {
      await updateCow(record.cowId, { medicalAttentionRequired: true, status: 'sick' });
    }
    void logAudit('MEDICAL_ALERT', 'medical_records', newRecord.id, `Medical diagnosis recorded for ${record.cowTag}: ${record.diagnosis}`);
  };

  const addPregnancyRecord = async (record: Omit<PregnancyRecord, 'id'>) => {
    const { data, error } = await mysqlApi.from('pregnancies').insert({
      cow_id: record.cowId,
      insemination_date: record.inseminationDate,
      breeding_type: record.breedingType,
      bull_tag_or_semen_code: record.bullTagOrSemenCode,
      expected_delivery_date: record.expectedDeliveryDate,
      actual_delivery_date: record.actualDeliveryDate || null,
      status: record.status,
      notes: record.notes || null
    }).select().single();
    if (error) throw new Error(`Unable to save pregnancy record: ${error.message}`);
    const newRecord: PregnancyRecord = { ...record, id: data.id };
    setPregnancies(prev => [newRecord, ...prev]);
    await updateCow(record.cowId, { isPregnant: true, status: 'pregnant' });
    void logAudit('CREATE', 'pregnancies', newRecord.id, `Added pregnancy record for ${record.cowTagNumber}`);
  };

  const addDeliveryRecord = async (record: Omit<DeliveryRecord, 'id'>) => {
    const { data, error } = await mysqlApi.from('deliveries').insert({
      pregnancy_id: record.pregnancyId || null,
      mother_id: record.motherId,
      calf_id: record.calfId || null,
      delivery_date: record.deliveryDate,
      delivery_type: record.deliveryType,
      calf_gender: record.calfGender,
      birth_weight_kg: record.birthWeightKg || null,
      complications: record.complications || null,
      notes: record.notes || null
    }).select().single();
    if (error) throw new Error(`Unable to save delivery record: ${error.message}`);
    const newRecord: DeliveryRecord = { ...record, id: data.id };
    setDeliveries(prev => [newRecord, ...prev]);

    // Increment delivery count (Vihani) for mother
    const mother = cows.find(c => c.id === record.motherId);
    if (mother) {
      await updateCow(mother.id, {
        isPregnant: false,
        isLactating: true,
        deliveryCount: (mother.deliveryCount || 0) + 1
      });
    }
    void logAudit('CREATE', 'deliveries', newRecord.id, `Recorded birth for mother ${record.motherTag}, Calf Gender: ${record.calfGender}`);
  };

  const markAlertAsRead = async (alertId: string) => {
    const { error } = await mysqlApi.from('notifications').update({ is_read: true }).eq('id', alertId);
    if (error) throw new Error(`Unable to update notification: ${error.message}`);
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
