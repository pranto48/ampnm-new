
Goal
- Make “device icon change” work after a fresh Docker reinstall by ensuring the database schema always contains `devices.subchoice`, and make the app fail gracefully (with a clear, actionable message) if the column is missing.
- Separately: unblock Lovable preview/build by fixing invalid root `package.json` JSON (manual user action).

What’s happening (step-by-step diagnosis)
1) Your current PHP code (create/edit device + API update_device) now writes `subchoice`:
   - `create-device.php` inserts `subchoice`
   - `edit-device.php` updates `subchoice`
   - `api/handlers/device_handler.php` allows updating `subchoice`
2) After your reinstall you removed the DB volume (fresh DB) and ran `database_setup.php`.
3) `portal.itsupport.com.bd/docker-ampnm/database_setup.php` creates the `devices` table WITHOUT a `subchoice` column, and it also does NOT have a migration step that adds `subchoice`.
4) Therefore any insert/update that includes `subchoice` fails with:
   - `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'subchoice' in 'field list'`

High-confidence fix (code changes we will implement)
A) Fix the installer/setup so new installs never miss `subchoice`
1) Update `portal.itsupport.com.bd/docker-ampnm/database_setup.php`
   - In the `CREATE TABLE IF NOT EXISTS devices (...)` statement, add:
     - `subchoice TINYINT UNSIGNED NOT NULL DEFAULT 0` (placed right after `type` to match your SQL script)
   - In the “Schema migration” section (Step 4), add:
     - If column `subchoice` does not exist, run:
       - `ALTER TABLE devices ADD COLUMN subchoice TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER type;`
   Result: fresh installs and upgrades both get the column automatically.

2) Also update `portal.itsupport.com.bd/script-ampnm/database_setup_core.php`
   - It contains another `CREATE TABLE devices (...)` without `subchoice` (used by the “script” installer flow).
   - Add the same `subchoice` field to the CREATE TABLE definition.
   - Add the same “if missing then ALTER TABLE … add subchoice” migration.
   Result: all installation paths become consistent.

B) Make the app resilient if the DB is still missing `subchoice` (prevents hard errors)
Even with the setup fixed, some users may still have an old database or incomplete migration. We should avoid breaking the UI and instead show a clear “schema missing” message.

3) Harden `portal.itsupport.com.bd/docker-ampnm/edit-device.php`
   - Before executing the UPDATE query, detect whether `devices.subchoice` exists (via INFORMATION_SCHEMA).
   - If it does not exist:
     - Run an UPDATE statement that omits `subchoice`
     - Display a visible warning card explaining:
       - “Your database is missing the required `devices.subchoice` column.”
       - Provide the exact SQL fix (same as your Option A) and mention `FIX_SUBCHOICE_COMPLETE.sql`.

4) Harden `portal.itsupport.com.bd/docker-ampnm/create-device.php`
   - Same approach:
     - If column exists: insert including `subchoice`
     - If missing: insert without `subchoice`, show warning (so users can still create devices without the app crashing)

5) Harden `portal.itsupport.com.bd/docker-ampnm/api/handlers/device_handler.php` (update_device)
   - Currently, `allowed_fields` includes `subchoice`, which will generate `subchoice = ?` in SQL.
   - Add a lightweight “schema capability” check:
     - If `subchoice` column does not exist, remove `subchoice` from `allowed_fields` at runtime.
   - If the request tries to update `subchoice` while missing:
     - Return a 400 JSON response that clearly states the schema is missing and provides the SQL fix.
   Result: map edits / device edits via API won’t throw SQL exceptions that bubble up as generic failures.

C) “One-click” schema health hint (optional but recommended)
6) Add a small admin-only warning banner somewhere obvious (for example on `devices.php` or `edit-device.php`):
   - If `subchoice` column missing, show:
     - Red badge: “Database needs a small upgrade”
     - A copyable SQL snippet
   This reduces repeated support requests.

What you still need to do right now (because the live DB is already missing the column)
- Even after we fix the code, the CURRENT database still needs the column added once.
- Use either:
  - Option A:
    ```sql
    ALTER TABLE devices
    ADD COLUMN subchoice TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER type;
    ```
  - Option B: Run `portal.itsupport.com.bd/docker-ampnm/FIX_SUBCHOICE_COMPLETE.sql`
- Then restart the container (if needed) and hard refresh.

Separate critical issue: Lovable preview/build is blocked by invalid package.json (manual fix required)
- Your root `package.json` is not valid JSON right now (it has `"build:dev"` placed inside `"dependencies"` and there’s a missing comma).
- You must edit it to this structure (example):
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "build:dev": "vite build --mode development",
      "preview": "vite preview"
    },
    "dependencies": {
      "@supabase/supabase-js": "^2.91.1",
      "react": "^19.2.3",
      "react-dom": "^19.2.3"
    },
    "devDependencies": {
      "@types/react": "^19.2.9",
      "@types/react-dom": "^19.2.3",
      "@vitejs/plugin-react": "^5.1.2",
      "typescript": "^5.9.3",
      "vite": "^7.3.1",
      "lovable-tagger": "^1.1.13"
    }
  }
  ```
- Until that is fixed, the build errors you pasted (missing react/jsx-runtime, JSX.IntrinsicElements, etc.) will continue because dependencies cannot install.

Implementation order (what I will do once you approve)
1) Update `docker-ampnm/database_setup.php` (CREATE TABLE devices + migration adds subchoice)
2) Update `script-ampnm/database_setup_core.php` (same)
3) Add graceful fallback logic in:
   - `create-device.php`
   - `edit-device.php`
   - `api/handlers/device_handler.php` (update_device)
4) (Optional) Add a small admin banner warning if schema is missing
5) Provide a quick verification checklist

Verification checklist
- Fresh install test:
  1) Remove DB volume
  2) Run `database_setup.php`
  3) Confirm `devices` has column `subchoice`
  4) Create device, edit icon variant, save: no SQL error
- Upgrade test:
  1) Existing DB without `subchoice`
  2) Run `database_setup.php`
  3) Confirm it adds `subchoice`
  4) Edit icon variant: works
- Resilience test:
  1) Temporarily skip migration
  2) Attempt edit:
     - App does not crash; shows a clear “missing column” message with SQL to run

Notes / constraints
- This issue cannot be fully solved by code alone without ever running a DB change, because `subchoice` is persisted state and must exist in the database to store the icon variant. The code improvements ensure (a) installs create it automatically and (b) the UI/API produces clear guidance instead of a hard SQL exception.
