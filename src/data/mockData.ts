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
  AlertNotification 
} from '@/types';

// Mock Cows Database
export const initialCows: Cow[] = [
  {
    id: 'cow-001',
    tagNumber: 'GSH-0001',
    name: 'Gauri (ગૌરી)',
    photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&q=80&w=800',
    gender: 'female',
    breed: 'Gir',
    color: 'Reddish Brown',
    dateOfBirth: '2019-03-15',
    entryDate: '2019-03-15',
    source: 'Born in Gaushala',
    motherId: null,
    fatherId: null,
    motherName: 'Nandi Bai (Grand Mother)',
    fatherName: 'Gir Royal Bull B-01',
    isPregnant: true,
    isLactating: true,
    status: 'active',
    medicalAttentionRequired: false,
    notes: 'High milk yielding pure Gir cow. Very gentle temperament.',
    createdAt: '2019-03-15T08:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
    deliveryCount: 4 // Vihani: 4
  },
  {
    id: 'cow-002',
    tagNumber: 'GSH-0002',
    name: 'Kamdhenu (કામધેનુ)',
    photoUrl: 'https://images.unsplash.com/photo-1570042707227-aa87ad41dfbd?auto=format&fit=crop&q=80&w=800',
    gender: 'female',
    breed: 'Gir',
    color: 'White & Brown Spot',
    dateOfBirth: '2020-06-10',
    entryDate: '2020-06-10',
    source: 'Born in Gaushala',
    motherId: 'cow-001',
    motherName: 'Gauri (GSH-0001)',
    fatherId: null,
    fatherName: 'Somnath Bull S-09',
    isPregnant: false,
    isLactating: true,
    status: 'active',
    medicalAttentionRequired: false,
    notes: 'First calf daughter of Gauri. Excellent FAT % in milk.',
    createdAt: '2020-06-10T09:30:00Z',
    updatedAt: '2026-08-19T14:20:00Z',
    deliveryCount: 2
  },
  {
    id: 'cow-003',
    tagNumber: 'GSH-0003',
    name: 'Nandi (નંદી - ખૂંટ)',
    photoUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&q=80&w=800',
    gender: 'male',
    breed: 'Gir',
    color: 'Dark Reddish Spec',
    dateOfBirth: '2021-01-20',
    entryDate: '2021-01-20',
    source: 'Born in Gaushala',
    motherId: 'cow-001',
    motherName: 'Gauri (GSH-0001)',
    fatherId: null,
    fatherName: 'Mahadev Bull M-02',
    isPregnant: false,
    isLactating: false,
    status: 'active',
    medicalAttentionRequired: false,
    notes: 'Stud breeding bull for gaushala.',
    createdAt: '2021-01-20T11:15:00Z',
    updatedAt: '2026-08-15T08:00:00Z',
    deliveryCount: 0
  },
  {
    id: 'cow-004',
    tagNumber: 'GSH-0004',
    name: 'Radha (રાધા)',
    photoUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
    gender: 'female',
    breed: 'Kankrej',
    color: 'Silver Grey',
    dateOfBirth: '2018-11-05',
    entryDate: '2019-01-10',
    source: 'Donated by Farmer',
    motherId: null,
    fatherId: null,
    isPregnant: false,
    isLactating: false,
    status: 'sick',
    medicalAttentionRequired: true,
    notes: 'Under vet observation for mild fever and digestive issue.',
    createdAt: '2019-01-10T10:00:00Z',
    updatedAt: '2026-08-21T07:30:00Z',
    deliveryCount: 3
  },
  {
    id: 'cow-005',
    tagNumber: 'GSH-0005',
    name: 'Ganga (ગંગા - વાછરડી)',
    photoUrl: 'https://images.unsplash.com/photo-1545468843-279d2bf31ef8?auto=format&fit=crop&q=80&w=800',
    gender: 'female',
    breed: 'Gir',
    color: 'Light Brown',
    dateOfBirth: '2026-02-14',
    entryDate: '2026-02-14',
    source: 'Born in Gaushala',
    motherId: 'cow-002',
    motherName: 'Kamdhenu (GSH-0002)',
    fatherId: 'cow-003',
    fatherName: 'Nandi (GSH-0003)',
    isPregnant: false,
    isLactating: false,
    status: 'active',
    medicalAttentionRequired: false,
    notes: 'Healthy female calf born on Vasant Panchami.',
    createdAt: '2026-02-14T06:00:00Z',
    updatedAt: '2026-08-20T09:00:00Z',
    deliveryCount: 0
  },
  {
    id: 'cow-006',
    tagNumber: 'GSH-0006',
    name: 'Kaveri (કાવેરી)',
    photoUrl: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800',
    gender: 'female',
    breed: 'Sahiwal',
    color: 'Reddish Gold',
    dateOfBirth: '2021-08-22',
    entryDate: '2022-03-01',
    source: 'Purchased from Punjab Dairy',
    motherId: null,
    fatherId: null,
    isPregnant: true,
    isLactating: true,
    status: 'pregnant',
    medicalAttentionRequired: false,
    notes: 'High performance Sahiwal cow. Due in 45 days.',
    createdAt: '2022-03-01T12:00:00Z',
    updatedAt: '2026-08-20T16:00:00Z',
    deliveryCount: 1
  },
  {
    id: 'cow-007',
    tagNumber: 'GSH-0007',
    name: 'Bholenath (ભોલેનાથ - વાછરડો)',
    photoUrl: 'https://images.unsplash.com/photo-1570042707227-aa87ad41dfbd?auto=format&fit=crop&q=80&w=800',
    gender: 'male',
    breed: 'Gir',
    color: 'Speckled White-Red',
    dateOfBirth: '2026-07-04',
    entryDate: '2026-07-04',
    source: 'Born in Gaushala',
    motherId: 'cow-001',
    motherName: 'Gauri (GSH-0001)',
    fatherId: null,
    fatherName: 'Mahadev Bull M-02',
    isPregnant: false,
    isLactating: false,
    status: 'active',
    medicalAttentionRequired: false,
    notes: 'Newborn male calf of Gauri.',
    createdAt: '2026-07-04T05:30:00Z',
    updatedAt: '2026-08-21T08:00:00Z',
    deliveryCount: 0
  }
];

export const initialPregnancies: PregnancyRecord[] = [
  {
    id: 'preg-101',
    cowId: 'cow-001',
    cowTagNumber: 'GSH-0001',
    inseminationDate: '2025-11-10',
    breedingType: 'Artificial Insemination',
    bullTagOrSemenCode: 'GIR-SEMEN-ROYAL-99',
    expectedDeliveryDate: '2026-08-25',
    status: 'confirmed',
    vetName: 'Dr. Ramesh Patel (M.V.Sc)',
    notes: '9th month pregnancy progressing smoothly.',
    createdAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'preg-102',
    cowId: 'cow-006',
    cowTagNumber: 'GSH-0006',
    inseminationDate: '2026-01-05',
    breedingType: 'Natural',
    bullTagOrSemenCode: 'GSH-0003 (Nandi)',
    expectedDeliveryDate: '2026-10-15',
    status: 'confirmed',
    vetName: 'Dr. Hiren Joshi',
    notes: 'Checkup complete, fetus active.',
    createdAt: '2026-01-05T11:00:00Z'
  }
];

export const initialDeliveries: DeliveryRecord[] = [
  {
    id: 'del-201',
    pregnancyId: 'preg-099',
    motherId: 'cow-001',
    motherTag: 'GSH-0001',
    motherName: 'Gauri',
    calfId: 'cow-007',
    calfTag: 'GSH-0007',
    deliveryDate: '2026-07-04',
    deliveryType: 'normal',
    calfGender: 'male',
    birthWeightKg: 28.5,
    complications: 'None',
    vetName: 'Dr. Ramesh Patel',
    notes: 'Healthy male calf (Bholenath) delivered naturally.'
  },
  {
    id: 'del-202',
    motherId: 'cow-002',
    motherTag: 'GSH-0002',
    motherName: 'Kamdhenu',
    calfId: 'cow-005',
    calfTag: 'GSH-0005',
    deliveryDate: '2026-02-14',
    deliveryType: 'normal',
    calfGender: 'female',
    birthWeightKg: 26.0,
    complications: 'None',
    vetName: 'Dr. Ramesh Patel',
    notes: 'Healthy female calf (Ganga) delivered.'
  }
];

export const initialHealthRecords: HealthRecord[] = [
  {
    id: 'hlth-301',
    cowId: 'cow-004',
    cowTag: 'GSH-0004',
    diagnosis: 'Indigestion & Mild Fever (અપચો અને તાવ)',
    symptoms: 'Loss of appetite, mild temperature 103°F',
    treatment: 'Probiotics, liver tonic & antipyretic injection given.',
    prescribedMedicines: 'Neblon powder, Melonex 15ml',
    severity: 'medium',
    vetName: 'Dr. Ramesh Patel',
    recordDate: '2026-08-20',
    followupDate: '2026-08-22',
    resolved: false,
    notes: 'Keep isolated in shed B and feed green tender grass.'
  }
];

export const initialVaccinations: VaccinationRecord[] = [
  {
    id: 'vac-401',
    cowId: 'cow-001',
    cowTag: 'GSH-0001',
    cowName: 'Gauri',
    vaccineName: 'FMD (મોવાસા/ખરી-મોંસા)',
    batchNumber: 'FMD-2026-AUG',
    scheduledDate: '2026-08-22',
    status: 'scheduled',
    administeredBy: 'Dr. Ramesh Patel',
    nextDueDate: '2027-02-22'
  },
  {
    id: 'vac-402',
    cowId: 'cow-002',
    cowTag: 'GSH-0002',
    cowName: 'Kamdhenu',
    vaccineName: 'HS & BQ (ગાંઠીયા તાવ)',
    batchNumber: 'HS-98712',
    scheduledDate: '2026-08-24',
    status: 'scheduled',
    administeredBy: 'Dr. Hiren Joshi',
    nextDueDate: '2027-08-24'
  },
  {
    id: 'vac-403',
    cowId: 'cow-006',
    cowTag: 'GSH-0006',
    cowName: 'Kaveri',
    vaccineName: 'Brucellosis',
    batchNumber: 'BR-4412',
    scheduledDate: '2026-08-10',
    givenDate: '2026-08-10',
    status: 'completed',
    administeredBy: 'Dr. Ramesh Patel',
    nextDueDate: '2027-08-10'
  }
];

export const initialMilkRecords: MilkRecord[] = [
  {
    id: 'milk-501',
    cowId: 'cow-001',
    cowTag: 'GSH-0001',
    cowName: 'Gauri',
    recordDate: '2026-08-21',
    session: 'Morning',
    quantityLiters: 9.5,
    fatPercentage: 4.8,
    snfPercentage: 8.9,
    recordedBy: 'Magambhai Staff',
    notes: 'Morning yield excellent.'
  },
  {
    id: 'milk-502',
    cowId: 'cow-002',
    cowTag: 'GSH-0002',
    cowName: 'Kamdhenu',
    recordDate: '2026-08-21',
    session: 'Morning',
    quantityLiters: 7.2,
    fatPercentage: 5.1,
    snfPercentage: 9.0,
    recordedBy: 'Magambhai Staff'
  },
  {
    id: 'milk-503',
    cowId: 'cow-006',
    cowTag: 'GSH-0006',
    cowName: 'Kaveri',
    recordDate: '2026-08-21',
    session: 'Morning',
    quantityLiters: 8.0,
    fatPercentage: 4.6,
    snfPercentage: 8.7,
    recordedBy: 'Magambhai Staff'
  }
];

export const initialFeedRecords: FeedRecord[] = [
  {
    id: 'feed-601',
    cowId: 'cow-001',
    cowTag: 'GSH-0001',
    feedType: 'Green Fodder (લીલો ચારો - રજકો)',
    quantityKg: 25,
    feedDate: '2026-08-21',
    costRupees: 125,
    notes: 'Fresh Lucerne grass'
  },
  {
    id: 'feed-602',
    cowId: null,
    cowTag: 'All Cows (સમગ્ર ગૌશાળા)',
    feedType: 'Concentrate Feed (દાણ + ખળ)',
    quantityKg: 150,
    feedDate: '2026-08-21',
    costRupees: 3600,
    notes: 'Amul Dan Cattle Feed mix'
  }
];

export const initialExpenseRecords: ExpenseRecord[] = [
  {
    id: 'exp-701',
    category: 'feed',
    title: 'Dry Fodder (જુવાર કડબ) Purchase',
    amount: 18500,
    expenseDate: '2026-08-18',
    vendorOrPayee: 'Patel Agro Services',
    recordedBy: 'Shree Vallabh (Manager)'
  },
  {
    id: 'exp-702',
    category: 'medical',
    title: 'Monthly Vet Medicines & Vaccines',
    amount: 4200,
    expenseDate: '2026-08-15',
    vendorOrPayee: 'Gujarat Vet Pharmacy',
    recordedBy: 'Dr. Ramesh Patel'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-801',
    userId: 'usr-admin-01',
    userName: 'Shree Vallabh',
    userRole: 'admin',
    action: 'VACCINATED',
    tableName: 'vaccinations',
    recordId: 'vac-403',
    details: 'Staff A changed Gauri & Kaveri vaccination record status to completed on 10 Aug 2026.',
    timestamp: '2026-08-10T14:30:00Z'
  },
  {
    id: 'audit-802',
    userId: 'usr-vet-02',
    userName: 'Dr. Ramesh Patel',
    userRole: 'vet',
    action: 'MEDICAL_ALERT',
    tableName: 'medical_records',
    recordId: 'hlth-301',
    details: 'Registered health diagnosis for Radha (GSH-0004) - Indigestion.',
    timestamp: '2026-08-20T08:15:00Z'
  }
];

export const initialAlerts: AlertNotification[] = [
  {
    id: 'alt-901',
    title: 'Pregnancy Delivery Nearing (વિયાણ નજીક)',
    message: 'Gauri (GSH-0001) estimated delivery date is in 4 days (25 Aug 2026). Keep maternity shed ready.',
    alertType: 'warning',
    cowId: 'cow-001',
    cowTag: 'GSH-0001',
    isRead: false,
    timestamp: '2026-08-21T07:00:00Z'
  },
  {
    id: 'alt-902',
    title: 'Medical Attention Required (ડોક્ટર તપાસ જરૂર)',
    message: 'Radha (GSH-0004) is under medical care for indigestion & fever.',
    alertType: 'danger',
    cowId: 'cow-004',
    cowTag: 'GSH-0004',
    isRead: false,
    timestamp: '2026-08-20T09:30:00Z'
  },
  {
    id: 'alt-903',
    title: 'Vaccination Due Tomorrow (રસીકરણ બાકી)',
    message: 'FMD vaccination scheduled for Gauri (GSH-0001) tomorrow.',
    alertType: 'info',
    cowId: 'cow-001',
    cowTag: 'GSH-0001',
    isRead: false,
    timestamp: '2026-08-21T08:00:00Z'
  }
];
