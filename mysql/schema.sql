CREATE DATABASE IF NOT EXISTS gaushala CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gaushala;

CREATE TABLE IF NOT EXISTS cows (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tag_number VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100), photo_url TEXT, gender ENUM('female','male') NOT NULL DEFAULT 'female',
  breed VARCHAR(100) NOT NULL DEFAULT 'Gir', color VARCHAR(50), date_of_birth DATE NOT NULL,
  entry_date DATE NOT NULL, source VARCHAR(100), mother_id BIGINT UNSIGNED NULL, father_id BIGINT UNSIGNED NULL,
  is_pregnant BOOLEAN NOT NULL DEFAULT FALSE, is_lactating BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('active','sick','pregnant','lactating','dry','quarantined','sold','deceased','archived') NOT NULL DEFAULT 'active',
  medical_attention_required BOOLEAN NOT NULL DEFAULT FALSE, qr_code_url TEXT, notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cows_status (status), INDEX idx_cows_mother (mother_id),
  CONSTRAINT fk_cows_mother FOREIGN KEY (mother_id) REFERENCES cows(id) ON DELETE SET NULL,
  CONSTRAINT fk_cows_father FOREIGN KEY (father_id) REFERENCES cows(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pregnancies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, cow_id BIGINT UNSIGNED NOT NULL,
  insemination_date DATE NOT NULL, breeding_type VARCHAR(50) NOT NULL DEFAULT 'Artificial Insemination',
  bull_tag_or_semen_code VARCHAR(100), expected_delivery_date DATE NOT NULL, actual_delivery_date DATE,
  status ENUM('suspected','confirmed','completed','aborted','failed') NOT NULL DEFAULT 'confirmed', notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deliveries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, pregnancy_id BIGINT UNSIGNED NULL, mother_id BIGINT UNSIGNED NOT NULL,
  calf_id BIGINT UNSIGNED NULL, delivery_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivery_type ENUM('normal','assisted','caesarean','stillbirth') NOT NULL DEFAULT 'normal', calf_gender ENUM('female','male') NOT NULL,
  birth_weight_kg DECIMAL(5,2), complications TEXT, notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pregnancy_id) REFERENCES pregnancies(id) ON DELETE SET NULL,
  FOREIGN KEY (mother_id) REFERENCES cows(id) ON DELETE CASCADE, FOREIGN KEY (calf_id) REFERENCES cows(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS medical_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, cow_id BIGINT UNSIGNED NOT NULL, diagnosis TEXT NOT NULL,
  symptoms TEXT, treatment TEXT NOT NULL, prescribed_medicines TEXT,
  severity ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium', attended_by VARCHAR(100),
  record_date DATE NOT NULL, followup_date DATE, resolved BOOLEAN NOT NULL DEFAULT FALSE, notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, cow_id BIGINT UNSIGNED NOT NULL, vaccine_name VARCHAR(100) NOT NULL,
  batch_number VARCHAR(100), scheduled_date DATE NOT NULL, given_date DATE,
  status ENUM('scheduled','completed','overdue','cancelled') NOT NULL DEFAULT 'scheduled', administered_by TEXT,
  next_due_date DATE, notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS milk_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, cow_id BIGINT UNSIGNED NOT NULL, record_date DATE NOT NULL,
  session ENUM('Morning','Evening','Afternoon') NOT NULL, quantity_liters DECIMAL(6,2) NOT NULL,
  fat_percentage DECIMAL(4,2), snf_percentage DECIMAL(4,2), recorded_by VARCHAR(150), notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feed_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, cow_id BIGINT UNSIGNED NULL, feed_type VARCHAR(100) NOT NULL,
  quantity_kg DECIMAL(6,2) NOT NULL, feed_date DATE NOT NULL, cost_rupees DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, category ENUM('feed','medical','veterinary','labor','equipment','utility','other') NOT NULL,
  title VARCHAR(150) NOT NULL, amount DECIMAL(10,2) NOT NULL, expense_date DATE NOT NULL,
  vendor_or_payee VARCHAR(100), recorded_by VARCHAR(150), notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(100), user_email VARCHAR(150), action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL, record_id BIGINT UNSIGNED NULL, details TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL, message TEXT NOT NULL,
  alert_type ENUM('warning','danger','info','success') NOT NULL DEFAULT 'warning', cow_id BIGINT UNSIGNED NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);
