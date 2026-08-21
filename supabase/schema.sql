-- ==============================================================================
-- GAUSHALA CATTLE MANAGEMENT SYSTEM - FULL SUPABASE RELATIONAL SCHEMA & RLS
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'vet');
CREATE TYPE cow_gender AS ENUM ('female', 'male');
CREATE TYPE cow_status AS ENUM ('active', 'sick', 'pregnant', 'lactating', 'dry', 'quarantined', 'sold', 'deceased', 'archived');
CREATE TYPE pregnancy_status AS ENUM ('suspected', 'confirmed', 'completed', 'aborted', 'failed');
CREATE TYPE delivery_type AS ENUM ('normal', 'assisted', 'caesarean', 'stillbirth');
CREATE TYPE health_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE vaccination_status AS ENUM ('scheduled', 'completed', 'overdue', 'cancelled');
CREATE TYPE expense_category AS ENUM ('feed', 'medical', 'veterinary', 'labor', 'equipment', 'utility', 'other');

-- 2. USERS & ROLES TABLE (Extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'staff',
    avatar_url TEXT,
    preferred_language VARCHAR(5) DEFAULT 'gu',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. VETS & STAFF AUXILIARY TABLE
CREATE TABLE public.vets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    license_number TEXT,
    phone TEXT NOT NULL,
    clinic_name TEXT,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    role_description TEXT,
    shift_schedule TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COWS MASTER TABLE
CREATE TABLE public.cows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_number VARCHAR(50) UNIQUE NOT NULL, -- GSH-0001
    name VARCHAR(100),
    photo_url TEXT,
    gender cow_gender NOT NULL DEFAULT 'female',
    breed VARCHAR(100) NOT NULL DEFAULT 'Gir',
    color VARCHAR(50),
    date_of_birth DATE NOT NULL,
    entry_date DATE DEFAULT CURRENT_DATE,
    source VARCHAR(100) DEFAULT 'Born in Gaushala', -- Born inside, Purchased, Donated
    mother_id UUID REFERENCES public.cows(id) ON DELETE SET NULL,
    father_id UUID REFERENCES public.cows(id) ON DELETE SET NULL,
    is_pregnant BOOLEAN DEFAULT FALSE,
    is_lactating BOOLEAN DEFAULT FALSE,
    status cow_status NOT NULL DEFAULT 'active',
    medical_attention_required BOOLEAN DEFAULT FALSE,
    qr_code_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for searching tag and name fast
CREATE INDEX idx_cows_tag ON public.cows(tag_number);
CREATE INDEX idx_cows_status ON public.cows(status);
CREATE INDEX idx_cows_mother ON public.cows(mother_id);

-- 5. COW PHOTOS GALLERY
CREATE TABLE public.cow_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PREGNANCIES & BREEDING RECORDS
CREATE TABLE public.pregnancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    insemination_date DATE NOT NULL,
    breeding_type VARCHAR(50) DEFAULT 'Artificial Insemination', -- AI or Natural
    bull_tag_or_semen_code VARCHAR(100),
    expected_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    status pregnancy_status NOT NULL DEFAULT 'confirmed',
    vet_id UUID REFERENCES public.vets(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DELIVERIES & BIRTHS (Link mother cow & newborn calf)
CREATE TABLE public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID REFERENCES public.pregnancies(id) ON DELETE SET NULL,
    mother_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    calf_id UUID REFERENCES public.cows(id) ON DELETE SET NULL,
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    delivery_type delivery_type DEFAULT 'normal',
    calf_gender cow_gender NOT NULL,
    birth_weight_kg NUMERIC(5,2),
    complications TEXT,
    vet_id UUID REFERENCES public.vets(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MEDICAL & HEALTH RECORDS
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    symptoms TEXT,
    treatment TEXT NOT NULL,
    prescribed_medicines TEXT,
    severity health_severity DEFAULT 'medium',
    vet_id UUID REFERENCES public.vets(id),
    attended_by VARCHAR(100),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    followup_date DATE,
    resolved BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. VACCINATIONS & DEWORMING RECORDS
CREATE TABLE public.vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(100) NOT NULL, -- FMD, HS, BQ, Brucellosis
    batch_number VARCHAR(100),
    scheduled_date DATE NOT NULL,
    given_date DATE,
    status vaccination_status NOT NULL DEFAULT 'scheduled',
    administered_by TEXT,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.deworming_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    given_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE,
    given_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. MILK PRODUCTION RECORDS
CREATE TABLE public.milk_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    session VARCHAR(20) CHECK (session IN ('Morning', 'Evening', 'Afternoon')),
    quantity_liters NUMERIC(6,2) NOT NULL,
    fat_percentage NUMERIC(4,2),
    snf_percentage NUMERIC(4,2),
    recorded_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. FEED & NUTRITION RECORDS
CREATE TABLE public.feed_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID REFERENCES public.cows(id) ON DELETE SET NULL, -- Null if recorded for whole gaushala batch
    feed_type VARCHAR(100) NOT NULL, -- Green Fodder, Dry Fodder, Concentrates, Mineral Mix
    quantity_kg NUMERIC(6,2) NOT NULL,
    feed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    cost_rupees NUMERIC(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. EXPENSES & FINANCIALS
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category expense_category NOT NULL,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vendor_or_payee VARCHAR(100),
    receipt_url TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. DOCUMENTS & CERTIFICATES
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID REFERENCES public.cows(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. SYSTEM NOTIFICATIONS & ALERTS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) DEFAULT 'warning', -- info, warning, danger, success
    cow_id UUID REFERENCES public.cows(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. AUDIT LOGS (Accountability)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email VARCHAR(150),
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can do everything
CREATE POLICY "Admin full access" ON public.cows FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: Manager can view/insert/update
CREATE POLICY "Manager write access" ON public.cows FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Manager edit access" ON public.cows FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policy: Authenticated users can view cows
CREATE POLICY "Authenticated users view cows" ON public.cows FOR SELECT TO authenticated USING (true);

-- Policy: Audit logs read-only for Admin
CREATE POLICY "Admin audit log access" ON public.audit_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
