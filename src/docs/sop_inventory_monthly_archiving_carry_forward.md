# SOP – Inventory Monthly Archiving & Carry Forward System

## 1. Purpose
This SOP defines the standard process for handling inventory transactions, monthly closing, archiving, and carry-forward of remaining stock in a live inventory system.

The system ensures:
- No data loss
- No resetting of stock
- Accurate monthly reporting
- Continuous stock tracking

---

## 2. Scope
Applies to:
- Import (IN) transactions
- Export (OUT) transactions
- Monthly closing process
- Archiving and reporting
- All materials including consumables (e.g., fuel)

---

## 3. System Principles (Golden Rules)

1. ❌ Never delete historical data
2. ❌ Never reset stock manually
3. ❌ Never duplicate records for next month
4. ✔ All calculations are based on transactions
5. ✔ Monthly closing is a snapshot only
6. ✔ Carry forward applies automatically if stock remains

---

## 4. Data Structure

### 4.1 Transaction Tables
- import_table (IN)
- export_table (OUT)

Each record contains:
- material_id
- quantity
- date
- period_month
- isMonthly (true/false)

---

### 4.2 Monthly Closing Table
```sql
monthly_closing
- id
- material_id
- period (YYYY-MM)
- opening_balance
- total_in
- total_out
- closing_balance
- carry_forward (boolean)
- status (active / completed)
```

---

## 5. Operational Workflow

## 5.1 Daily Operations
### Import (IN)
- Insert into import_table

### Export (OUT)
- Insert into export_table

No updates or deletions allowed.

---

## 5.2 Monthly Closing Process

### Step 1: Calculate Totals
For each material:
- Total IN for month
- Total OUT for month

### Step 2: Calculate Closing Balance
```
closing = opening + total_in - total_out
```

### Step 3: Store Snapshot
Insert into monthly_closing table

### Step 4: Determine Carry Forward
- If closing > 0 → carry_forward = true
- If closing = 0 → carry_forward = false

---

## 6. Carry Forward Logic

### Rule:
If stock remains at end of month:
```
next_month_opening = closing_balance
```

### If no stock remains:
```
next_month_opening = 0
```

---

## 7. Example Scenario

### Month 1
- Opening: 0
- IN: 200
- OUT: 100
- Closing: 100
→ Carry forward = YES

### Month 2
- Opening: 100
- IN: 0
- OUT: 50
- Closing: 50
→ Carry forward = YES

### Month 3
- Opening: 50
- OUT: 50
- Closing: 0
→ Carry forward = NO

---

## 8. Archiving Rules

### Archiving Definition
Archiving = Marking data by period, not moving or deleting it.

### Rules:
- Archive is based on period_month
- Data remains in system
- Archive is for filtering only

---

## 9. Status Management

Each material/month may have:
- active → still in progress
- completed → fully consumed
- carried_forward → moved to next month

---

## 10. Reporting

### Available Reports:
- Monthly stock report
- Carry forward report
- Consumed vs remaining
- Material history timeline

---

## 11. Non-Allowed Actions

- ❌ Reset inventory
- ❌ Duplicate monthly records as new imports
- ❌ Modify historical transactions

---

## 12. System Summary

This system is designed as a:
- Transaction-based inventory system
- Monthly snapshot archiving model
- Continuous carry-forward stock system

Core concept:
> Stock is never reset. It is always calculated and carried forward.
