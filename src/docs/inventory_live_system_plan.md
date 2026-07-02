# Inventory Live System Plan (Import / Export Based)

## 1. Overview
This document describes the architecture and operational plan for a live inventory system based on separate Import (IN) and Export (OUT) tables. The system supports real-time balance calculation and monthly closing without modifying historical transactional data.

---

## 2. Current System Structure

### 2.1 Tables
- **import_table** → Incoming stock (purchases / received materials)
- **export_table** → Outgoing stock (consumption / usage / sales)
- **materials** → Master data of materials

### 2.2 Current Flow
- Every IN operation is inserted into import_table
- Every OUT operation is inserted into export_table
- No deletion or update of historical records

---

## 3. Core Principle (Live System)

### ❗ Golden Rule
> Never modify historical data. Only append new records.

- No resets
- No transferring rows
- No overwriting previous months

---

## 4. Stock Balance Logic

### 4.1 Global Balance
```
Balance = Total Import - Total Export
```

### 4.2 SQL Example
```sql
SELECT
  (SELECT IFNULL(SUM(quantity),0) FROM import_table)
-
  (SELECT IFNULL(SUM(quantity),0) FROM export_table)
AS balance;
```

### 4.3 Material-based Balance
```sql
SELECT
  (SELECT IFNULL(SUM(quantity),0) FROM import_table WHERE material_id = ?)
-
  (SELECT IFNULL(SUM(quantity),0) FROM export_table WHERE material_id = ?)
AS balance;
```

---

## 5. Monthly Closing System

### 5.1 Purpose
- Snapshot inventory at end of month
- Used for reporting only
- Does NOT affect live data

### 5.2 Table Structure
```sql
CREATE TABLE monthly_closing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT,
  month INT,
  year INT,
  closing_balance DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. Closing Process

### 6.1 Steps
1. Calculate balance per material
2. Store snapshot in monthly_closing
3. Do NOT modify import/export tables

### 6.2 Example Query
```sql
INSERT INTO monthly_closing (material_id, month, year, closing_balance)
SELECT
  m.id,
  3,
  2026,
  (
    (SELECT IFNULL(SUM(quantity),0) FROM import_table WHERE material_id = m.id)
    -
    (SELECT IFNULL(SUM(quantity),0) FROM export_table WHERE material_id = m.id)
  )
FROM materials m;
```

---

## 7. Next Month Behavior

### 7.1 Opening Balance
```
Opening Balance = Previous Month Closing Balance
```

### 7.2 Important Rule
- Opening balance is NOT stored as a new import record
- It is calculated or referenced from monthly_closing

---

## 8. Fuel (Critical Case)

### Problem
Fuel may not fully consume in a month

### Solution
- Always treated as continuous stock
- Never reset to zero
- Always calculated using cumulative logic

---

## 9. Recommended Enhancements

### 9.1 Indexing
- material_id indexes on both tables
- date indexes for performance

### 9.2 Performance Optimization
- Use cached monthly summaries if data is large

### 9.3 Future Upgrade Path
- Convert to unified transactions table:
  - type: IN / OUT
  - single source of truth

---

## 10. Do NOT Do

- ❌ Do not reset stock monthly
- ❌ Do not duplicate rows for next month
- ❌ Do not modify historical import/export data

---

## 11. System Summary

This system is:
- Live-safe ✔
- Audit-friendly ✔
- ERP-compatible ✔
- Scalable ✔

Core idea:
> Data is never changed — only new data is added, and balance is always calculated.

