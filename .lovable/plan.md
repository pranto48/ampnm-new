
Goal: Fix “device icon change” on the Docker app map so that when you change a device’s icon (especially variant/subchoice) in `edit-device.php`, the map shows the updated icon reliably.

What I found (root causes likely)
1) The icon picker UI (`assets/icon-picker.js`) lets you click different variants, but it never writes the chosen variant index (“subchoice”) into the form. It only changes the `<select id="type">` value.
2) `edit-device.php` updates `type` and other fields, but it does not store `subchoice` at all.
3) The map renderer (`assets/js/map/mapManager.js` + `assets/js/map/utils.js`) depends on `device.type` + `device.subchoice` to decide which Font Awesome icon to draw. If `subchoice` never changes in the database, the map will keep drawing the old icon (or always variant 0).
4) Even if you do save correctly, navigating back to the map can sometimes show stale UI due to browser back/forward cache (bfcache). That can make it look like the change “didn’t work” until a hard refresh.

Step-by-step plan to resolve
A) Make “subchoice” a first-class form field (create + edit)
1) In `portal.itsupport.com.bd/docker-ampnm/create-device.php`:
   - Add a hidden input, e.g. `<input type="hidden" id="subchoice" name="subchoice" value="0">`.
   - When inserting into `devices`, include the `subchoice` column and bind the posted value.
2) In `portal.itsupport.com.bd/docker-ampnm/edit-device.php`:
   - Add the same hidden input, but initialize it from the existing device row:
     - `value="<?= htmlspecialchars($form_data['subchoice'] ?? 0) ?>"`
   - Update the SQL UPDATE statement to set `subchoice = ?` and bind the posted subchoice.

B) Teach the icon picker to actually set the selected variant
1) Update `portal.itsupport.com.bd/docker-ampnm/assets/icon-picker.js`:
   - When a user clicks an icon button, set:
     - `#type` (already done)
     - AND `#subchoice` hidden input to the clicked `data-icon-subchoice`.
   - When rendering, highlight the current selection using BOTH:
     - current type (`#type.value`)
     - current subchoice (`#subchoice.value`)
   - On first load, call `highlightCurrentSelection(currentType, currentSubchoice)` instead of always defaulting to subchoice 0.

Why this matters: without persisting `subchoice`, the map can only ever display the default variant for each type.

C) Ensure the API path also supports subchoice (for future map-side updates)
Even though the current map flow redirects to `edit-device.php`, the backend API handler should support `subchoice` too so any future “inline edit” or programmatic updates work.
1) In `portal.itsupport.com.bd/docker-ampnm/api/handlers/device_handler.php`:
   - Add `subchoice` to `$allowed_fields` for `update_device`.
2) Verify that `get_devices` already returns `subchoice` (it appears to, based on `api.php` selecting `d.subchoice`).

D) Make the map refresh correctly after returning from edit-device (bfcache fix)
To prevent stale map state after pressing the browser Back button:
1) In `portal.itsupport.com.bd/docker-ampnm/map.php` (or a shared map JS file loaded by it):
   - Add a small script:
     - `window.addEventListener('pageshow', (e) => { if (e.persisted) window.location.reload(); });`
This forces a reload when the page is restored from the browser cache, ensuring the new icon is fetched and rendered.

E) Verification checklist (how we’ll confirm it’s fixed)
1) Open map, click a device (admin), it goes to `edit-device.php?...&return=map`.
2) Pick a different icon variant (not just type), save.
3) Go back to the map:
   - If using back button: it should reload automatically (pageshow fix).
   - The device should now show the new icon variant.
4) Confirm persistence:
   - Re-open `edit-device.php` and confirm the selected variant remains highlighted (subchoice loaded).
   - Refresh map in a new tab: icon remains correct.

F) Separate but important: your Lovable build is currently failing due to missing npm scripts
Your latest build errors show:
- Missing script: "build:dev"
- Missing script: "build"
To fix this, edit the ROOT `package.json` and ensure these scripts exist:
- "dev": "vite"
- "build": "vite build"
- "build:dev": "vite build --mode development"
- "preview": "vite preview"
This doesn’t affect the Docker/PHP app itself, but it’s required for the Lovable web preview/build system to work reliably.

Implementation order (fastest path)
1) Add hidden `subchoice` inputs + SQL updates in `create-device.php` and `edit-device.php`
2) Update `assets/icon-picker.js` to write/read subchoice
3) Add `subchoice` to device API allowed fields
4) Add bfcache reload handler on map page
5) Manual test flow end-to-end

Notes / assumptions
- This plan assumes the `devices` table already has a `subchoice` column (it’s referenced in selects). If it doesn’t exist in your current DB, we’ll need to add it (schema change), but given the code references and the presence of `FIX_SUBCHOICE_COMPLETE.sql`, it’s very likely already present.
