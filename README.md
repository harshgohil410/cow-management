# 🐄 Gaushala Cattle Management System (ગૌશાળા કેટેલ મૅનેજમૅન્ટ સિસ્ટમ)

A modern, production-ready, mobile-friendly PWA Cattle Management System for real-time tracking of herd lineage, milk yield, health status, pregnancy, vaccinations, feed expenses, and audit logging with bilingual support (**Gujarati & English**).

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)
![Database](https://img.shields.io/badge/MySQL-8+-4479A1.svg)

---

## ✨ Features

- **🌐 Bilingual UI**: Instant toggle between **Gujarati (ગુજરાતી)** and **English**.
- **🛡️ Role-Based Security (RBAC)**: Segregated access for **Admin**, **Gaushala Manager**, **Staff**, and **Veterinarian (Vet)**.
- **📊 Real-time Dashboard**:
  - 8 Top Stat Cards (Total Cows, Male, Female, Pregnant, Lactating, Calves <1yr, Medical Attention, Vaccinations Due).
  - 🔔 Today's Alerts (Nearing deliveries, sick cows, urgent treatments).
  - 🥛 Today's Milk Collection Widget with quick logging.
  - 🍼 Recent Births & Mother linkages.
  - 💉 Upcoming Vaccinations (FMD, HS, BQ).
  - 📊 Monthly Milk Yield vs Fodder & Medical Expenses Chart.
- **🐄 Comprehensive Cattle Directory**:
  - Multi-filter panel (Breed, Gender, Pregnancy, Lactation, Medical Attention, Status).
  - Auto-calculated age from Date of Birth.
  - Unique Tag validation & automated QR code generation.
- **🌳 9-Tab Cow Profile & Visual Family Tree**:
  - **Overview**: Tag & status cards.
  - **Family Tree**: Visual lineage (`Mother → Cow → Offspring/Calves & Father`).
  - **Pregnancy History**: Breeding date, bull tag/semen code, expected delivery date.
  - **Deliveries (Vihani)**: Historical birth logs with automatic **"Vihani"** delivery count.
  - **Health History**: Medical diagnosis, treatment, and vet notes.
  - **Vaccinations**: Scheduled & completed FMD/HS vaccine logs.
  - **Milk Production**: Morning/Evening yield & fat percentage logs.
  - **Feed & Nutrition**: Daily diet tracking.
  - **Documents**: Registration certificates & attachments.
- **📱 Field QR Code Scanner**: Scan cattle ear tags in the gaushala shed using device camera or manual reader.
- **📜 Audit Logging**: Security log tracking staff modifications (e.g. *"Staff A updated Gauri's vaccination date"*).
- **🗃️ Relational MySQL Database**: Normalized tables (`cows`, `pregnancies`, `deliveries`, `medical_records`, `vaccinations`, `milk_records`, `feed_records`, `audit_logs`, etc.) accessed through a server-side Next.js API.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MySQL 8.0 or higher

### Installation

```bash
# Clone the repository
git clone git@github.com:harshgohil410/cow-management.git
cd cow-management

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema Setup (MySQL)

1. Start a local or hosted MySQL 8+ server.
2. Create the database and tables from `mysql/schema.sql`:

```bash
mysql -u your_mysql_user -p < mysql/schema.sql
```

3. Configure the server-only MySQL credentials in `.env.local`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=gaushala
```

The browser communicates with MySQL through the `/api/gaushala` Next.js route. MySQL credentials must never use the `NEXT_PUBLIC_` prefix.

For detailed deployment instructions, see [SETUP.md](./SETUP.md).

---

## 🛠️ Built With

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **QR Code**: `qrcode.react`
- **Database**: [MySQL](https://www.mysql.com/) through `mysql2`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
