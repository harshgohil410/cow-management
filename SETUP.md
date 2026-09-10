# 🛠️ Gaushala Management System - Setup & Deployment Guide

This guide provides step-by-step instructions to set up, configure, and deploy the Gaushala Cattle Management System.

---

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Git**
- **MySQL** 8.0 or higher, local or hosted

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
Create or update `.env.local` in the project root:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=gaushala
```

These variables are server-only. Do not prefix MySQL credentials with `NEXT_PUBLIC_`.

### 4. Running Dev Server
```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## 🗄️ Database Setup (MySQL)

1. Create a MySQL database user with permission to create and modify the `gaushala` database.
2. Run the schema from the repository:

   ```bash
   mysql -u your_mysql_user -p < mysql/schema.sql
   ```

3. Confirm the database name matches `MYSQL_DATABASE` in `.env.local`.

### Included Schema Features:
- Normalized relational tables (`cows`, `pregnancies`, `deliveries`, `medical_records`, `vaccinations`, `milk_records`, `feed_records`, `expenses`, `notifications`, and `audit_logs`).
- Foreign Key Constraints for automatic **Family Tree & Lineage** traversal.
- Automatic timestamps on records that support updates.
- Server-side parameterized queries through the `/api/gaushala` route.

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
4. Add the MySQL environment variables (`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE`) to the deployment environment.
   The deployment must be able to reach the hosted MySQL server; `localhost` will not refer to your development machine in Vercel.
5. Click **Deploy**.

---

## 📱 PWA Mobile Installation

Once deployed to HTTPS (or localhost), mobile users can:
1. Open the website on Safari (iOS) or Chrome (Android).
2. Tap **Share / Options** → **Add to Home Screen**.
3. The app will install as a standalone native-like PWA.
