export type UserRole = 'admin' | 'manager' | 'staff' | 'vet';

export type CowGender = 'female' | 'male';

export type CowStatus = 
  | 'active' 
  | 'sick' 
  | 'pregnant' 
  | 'lactating' 
  | 'dry' 
  | 'quarantined' 
  | 'sold' 
  | 'deceased' 
  | 'archived';

export interface Cow {
  id: string;
  tagNumber: string; // e.g. GSH-0001
  name?: string; // e.g. Gauri
  photoUrl?: string;
  gender: CowGender;
  breed: string; // Gir, Kankrej, Sahiwal, Jafrabadi, HF, Jersey, etc.
  color?: string;
  dateOfBirth: string; // YYYY-MM-DD
  entryDate: string;
  source?: string;
  motherId?: string | null;
  fatherId?: string | null;
  motherName?: string;
  fatherName?: string;
  isPregnant: boolean;
  isLactating: boolean;
  status: CowStatus;
  medicalAttentionRequired: boolean;
  qrCodeUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Computed / aggregated attributes
  ageInYears?: number;
  deliveryCount?: number; // "Vihani" count
}

export interface FamilyTree {
  cow: Cow;
  mother?: Cow | null;
  father?: Cow | null;
  grandMother?: Cow | null;
  grandFather?: Cow | null;
  calves: Cow[];
}

export interface PregnancyRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  inseminationDate: string;
  breedingType: 'Artificial Insemination' | 'Natural';
  bullTagOrSemenCode: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'suspected' | 'confirmed' | 'completed' | 'aborted' | 'failed';
  vetName?: string;
  notes?: string;
  createdAt: string;
}

export interface DeliveryRecord {
  id: string;
  pregnancyId?: string;
  motherId: string;
  motherTag: string;
  motherName?: string;
  calfId?: string;
  calfTag?: string;
  deliveryDate: string;
  deliveryType: 'normal' | 'assisted' | 'caesarean' | 'stillbirth';
  calfGender: CowGender;
  birthWeightKg?: number;
  complications?: string;
  vetName?: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  cowId: string;
  cowTag: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescribedMedicines?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  vetName: string;
  recordDate: string;
  followupDate?: string;
  resolved: boolean;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  cowId: string;
  cowTag: string;
  cowName?: string;
  vaccineName: string; // e.g. FMD, HS, BQ, Brucellosis, Rabies
  batchNumber?: string;
  scheduledDate: string;
  givenDate?: string;
  status: 'scheduled' | 'completed' | 'overdue' | 'cancelled';
  administeredBy?: string;
  nextDueDate?: string;
  notes?: string;
}

export interface DewormingRecord {
  id: string;
  cowId: string;
  cowTag: string;
  medicineName: string;
  dosage: string;
  givenDate: string;
  nextDueDate?: string;
  givenBy: string;
}

export interface MilkRecord {
  id: string;
  cowId: string;
  cowTag: string;
  cowName?: string;
  recordDate: string;
  session: 'Morning' | 'Evening' | 'Afternoon';
  quantityLiters: number;
  fatPercentage?: number;
  snfPercentage?: number;
  recordedBy: string;
  notes?: string;
}

export interface FeedRecord {
  id: string;
  cowId?: string | null;
  cowTag?: string;
  feedType: string; // Green Fodder, Dry Fodder, Concentrates, Mineral Mixture
  quantityKg: number;
  feedDate: string;
  costRupees: number;
  notes?: string;
}

export interface ExpenseRecord {
  id: string;
  category: 'feed' | 'medical' | 'veterinary' | 'labor' | 'equipment' | 'utility' | 'other';
  title: string;
  amount: number;
  expenseDate: string;
  vendorOrPayee?: string;
  recordedBy: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'VACCINATED' | 'MEDICAL_ALERT';
  tableName: string;
  recordId?: string;
  details: string;
  timestamp: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  alertType: 'warning' | 'danger' | 'info' | 'success';
  cowId?: string;
  cowTag?: string;
  isRead: boolean;
  timestamp: string;
}

export type Language = 'en' | 'gu';
