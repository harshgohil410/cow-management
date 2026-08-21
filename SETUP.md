# 🛠️ Gaushala Management System - Setup & Deployment Guide

This guide provides step-by-step instructions to set up, configure, and deploy the Gaushala Cattle Management System.

---

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Git**
- A **Supabase** account (Free tier works perfectly)

---

## 💻 Local Development Setup

### 1. Repository Setup
```bash
git clone git@github.com:harshgohil410/cow-management.git
cd cow-management
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env.local` file in the project root directory:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Running Dev Server
```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Log in to [Supabase Console](https://supabase.com/dashboard) and create a project named `Gaushala DB`.
2. Go to **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Open the `supabase/schema.sql` file from this repository, paste its entire contents into the SQL Editor, and click **Run**.

### Included Schema Features:
- 18+ normalized relational tables (`cows`, `pregnancies`, `deliveries`, `medical_records`, `vaccinations`, `milk_records`, `feed_records`, `audit_logs`, etc.).
- Foreign Key Constraints for automatic **Family Tree & Lineage** traversal.
- Row-Level Security (RLS) policies isolating access for `admin`, `manager`, `staff`, and `vet` roles.
- Triggers for automatic `updated_at` timestamps and audit logging.

---

## 🏗️ Production Build & Verification

To verify there are no TypeScript or compilation issues before pushing:

```bash
npm run build
```

---

## 🌐 Production Deployment (Vercel)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete gaushala management system"
   git push origin main
   ```

2. Log in to [Vercel](https://vercel.com).
3. Import the `cow-management` repository.
4. Add Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Click **Deploy**.

---

## 📱 PWA Mobile Installation

Once deployed to HTTPS (or localhost), mobile users can:
1. Open the website on Safari (iOS) or Chrome (Android).
2. Tap **Share / Options** → **Add to Home Screen**.
3. The app will install as a standalone native-like PWA.
