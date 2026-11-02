# NestJS & SQLite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Smart Waste Platform from in-browser localStorage persistence to a fullstack NestJS server serving existing static frontend assets and persisting all state into a local SQLite database (`database.sqlite`).

**Architecture:** NestJS serves the unmodified vanilla JS frontend from `public/` using `@nestjs/serve-static`. A unified `GET /api/bootstrap` endpoint hydrates the client-side in-memory cache on page load, while transactional mutations (`POST /api/deposits`, `/api/withdrawals`, etc.) persist directly to `database.sqlite` via TypeORM and trigger frontend UI updates.

**Tech Stack:** NestJS, TypeScript, TypeORM, SQLite (`sqlite3` / `better-sqlite3`), `@nestjs/serve-static`, Vanilla JavaScript (ES modules).

**Spec:** `docs/superpowers/specs/2026-11-02-nestjs-sqlite-migration-design.md`

## Global Constraints

- Database file must be named exactly `database.sqlite` in the project root directory.
- All brand-specific naming must be generalized (e.g. `berkasih:*` events become `app:*`).
- The 19 client JavaScript modules in `public/js/modules/` must not be rewritten into React/Angular/Vue; their existing DOM rendering logic must be preserved.
- When `database.sqlite` is empty on startup, it must automatically populate initial demo records tagged `[DEMO DATA]`.
- No attribution lines or AI tags in commit messages or code.

## Review Focus

- Server restart persistence: new deposit transaction in browser must still exist in `database.sqlite` after restarting NestJS.
- Offline/Startup hydration: `public/js/db/schema.js` must handle initial API fetch cleanly without breaking synchronous getters.
- Data integrity invariant: `Opening Balance + Deposits - Withdrawals = Closing Balance` must hold in SQLite entities.
- Inventory invariant: `Opening Stock + Deposits - Sales = Current Stock` must hold upon deposit and sales operations.
- Static asset serving: Deep routes or hash routes (`#customer-portal`, `#setoran`) must resolve correctly through `public/index.html`.

---

### Task 1: Initialize NestJS Scaffolding & Dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `nest-cli.json`
- Create: `src/main.ts`
- Create: `src/app.module.ts`
- Test: `test/app.e2e-spec.ts`

**Interfaces:**
- Consumes: Node.js runtime, npm
- Produces: Runnable NestJS application on port 3000

- [ ] **Step 1: Create `package.json` with NestJS, TypeORM, SQLite, and Serve-Static dependencies**

Include `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/serve-static`, `@nestjs/typeorm`, `typeorm`, `sqlite3`, `reflect-metadata`, `rxjs`, and TypeScript devDependencies.

- [ ] **Step 2: Create `tsconfig.json` and `nest-cli.json`**

Ensure `experimentalDecorators: true`, `emitDecoratorMetadata: true`, `target: "ES2022"`, `moduleResolution: "node"`, and `outDir: "./dist"`.

- [ ] **Step 3: Run `npm install`**

Run: `npm install`
Expected: `node_modules` installed with exit code 0.

- [ ] **Step 4: Create minimal `src/main.ts` and `src/app.module.ts`**

`src/main.ts` bootstraps `AppModule` and listens on `process.env.PORT || 3000`.
`src/app.module.ts` registers a basic health route or status controller.

- [ ] **Step 5: Write and run smoke test for NestJS boot**

Run: `npm run build` or `npx ts-node src/main.ts` briefly / test endpoint to verify clean startup.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json nest-cli.json src/
git commit -m "chore: scaffold nestjs application with sqlite and static dependencies"
```

---

### Task 2: Relocate Client Assets & Generalize Terminology

**Files:**
- Create: `public/` directory (move `index.html`, `css/`, `js/`, `assets/` into `public/`)
- Modify: `public/js/app.js` (update event names from `berkasih:*` to `app:*`)
- Modify: `public/js/auth/auth.js` (update auth event names to `app:auth-changed`)
- Modify: `public/js/components/header.js` (update event listeners)
- Modify: `public/js/db/schema.js` (update event dispatch and storage key to `smart_waste_local_cache`)
- Modify: `src/app.module.ts` (configure `ServeStaticModule` pointing to `public`)

**Interfaces:**
- Consumes: `public/index.html` static assets
- Produces: NestJS serving frontend at `http://localhost:3000/`

- [ ] **Step 1: Move client directories (`css`, `js`, `assets`, `index.html`) to `public/`**

Preserve relative file references inside `public/`.

- [ ] **Step 2: Search and replace specific brand identifiers in event names across `public/js/`**

Replace `berkasih:state-changed` with `app:state-changed`.
Replace `berkasih:auth-changed` with `app:auth-changed`.
Replace `berkasih_smart_database_v1` with `smart_waste_local_cache`.

- [ ] **Step 3: Configure `ServeStaticModule` in `src/app.module.ts`**

Add `ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public'), exclude: ['/api*'] })`.

- [ ] **Step 4: Verify static serving**

Start server: `npm run start` (or test runner) and verify `GET http://localhost:3000/` returns `public/index.html`.

- [ ] **Step 5: Commit**

```bash
git add public/ src/app.module.ts
git commit -m "refactor: relocate frontend to public directory and generalize event bus names"
```

---

### Task 3: Setup SQLite Database & TypeORM Entities

**Files:**
- Create: `src/database/database.module.ts`
- Create: `src/database/entities/user.entity.ts`
- Create: `src/database/entities/customer.entity.ts`
- Create: `src/database/entities/waste-type.entity.ts`
- Create: `src/database/entities/waste-price.entity.ts`
- Create: `src/database/entities/deposit.entity.ts`
- Create: `src/database/entities/deposit-item.entity.ts`
- Create: `src/database/entities/savings-transaction.entity.ts`
- Create: `src/database/entities/withdrawal.entity.ts`
- Create: `src/database/entities/inventory.entity.ts`
- Create: `src/database/entities/partner.entity.ts`
- Create: `src/database/entities/sale.entity.ts`
- Create: `src/database/entities/pickup.entity.ts`
- Create: `src/database/entities/program.entity.ts`
- Create: `src/database/entities/ai-insight.entity.ts`
- Create: `src/database/entities/notification.entity.ts`
- Create: `src/database/entities/audit-log.entity.ts`
- Create: `src/database/seed.service.ts`
- Test: `src/database/database.service.spec.ts`

**Interfaces:**
- Consumes: `database.sqlite` file, initial seed data
- Produces: TypeORM repositories for all entities, auto-seeding on empty database

- [ ] **Step 1: Write failing test verifying database connection and seeder invocation**

Check that upon initialization, `SeedService.seedIfNeeded()` creates default users, waste types, and customers in `database.sqlite`.

- [ ] **Step 2: Implement entities in `src/database/entities/`**

Define columns matching `public/js/db/initial_data.js` properties (`id`, `name`, `code`, `balance`, `timestamps`, etc.).

- [ ] **Step 3: Implement `SeedService` in `src/database/seed.service.ts`**

Check `userRepository.count() === 0`. If true, read initial seed data and insert into SQLite with `isDemo: true`.

- [ ] **Step 4: Configure `TypeOrmModule.forRoot()` in `src/database/database.module.ts`**

Target `database: 'database.sqlite'`, `synchronize: true`, `autoLoadEntities: true`.

- [ ] **Step 5: Run tests and verify database.sqlite is created and seeded**

Verify `database.sqlite` is populated with seeded demo rows.

- [ ] **Step 6: Commit**

```bash
git add src/database/
git commit -m "feat: setup typeorm sqlite database entities and automated seeder"
```

---

### Task 4: Implement Bootstrap & System Reset REST Endpoints

**Files:**
- Create: `src/modules/bootstrap/bootstrap.controller.ts`
- Create: `src/modules/bootstrap/bootstrap.service.ts`
- Create: `src/modules/bootstrap/bootstrap.module.ts`
- Create: `src/modules/system/system.controller.ts`
- Create: `src/modules/system/system.service.ts`
- Create: `src/modules/system/system.module.ts`
- Test: `test/bootstrap.e2e-spec.ts`

**Interfaces:**
- Consumes: TypeORM repositories
- Produces: `GET /api/bootstrap`, `POST /api/system/reset-demo`

- [ ] **Step 1: Write test for `GET /api/bootstrap`**

Test expects HTTP 200 with JSON payload containing `{ users, customers, waste_types, deposits, inventory, ... }`.

- [ ] **Step 2: Implement `BootstrapService` and `BootstrapController`**

Query all entities from SQLite and return a single snapshot structure matching the client's memory format.

- [ ] **Step 3: Implement `POST /api/system/reset-demo`**

Clears existing records and re-executes `SeedService.runSeed()`.

- [ ] **Step 4: Run test and verify JSON payload matches initial data schema**

Verify all array keys expected by `schema.js` exist in the response.

- [ ] **Step 5: Commit**

```bash
git add src/modules/bootstrap/ src/modules/system/ test/
git commit -m "feat: implement bootstrap snapshot and system reset endpoints"
```

---

### Task 5: Implement Transactional REST Endpoints

**Files:**
- Create: `src/modules/deposits/deposits.controller.ts`
- Create: `src/modules/deposits/deposits.service.ts`
- Create: `src/modules/deposits/deposits.module.ts`
- Create: `src/modules/withdrawals/withdrawals.controller.ts`
- Create: `src/modules/withdrawals/withdrawals.service.ts`
- Create: `src/modules/withdrawals/withdrawals.module.ts`
- Create: `src/modules/sales/sales.controller.ts`
- Create: `src/modules/sales/sales.service.ts`
- Create: `src/modules/sales/sales.module.ts`
- Test: `test/transactions.e2e-spec.ts`

**Interfaces:**
- Consumes: Deposit payloads (`customer_id`, `items: [{ waste_type_id, weight }]`)
- Produces:
  - `POST /api/deposits` (creates deposit, updates customer savings_balance, updates inventory stock, writes audit log)
  - `POST /api/withdrawals/request` and `POST /api/withdrawals/:id/complete`
  - `POST /api/sales` (reduces inventory stock, records sales revenue)

- [ ] **Step 1: Write failing e2e test for `POST /api/deposits`**

Test sending a deposit for a customer: verifies customer balance increases, inventory stock increases, and savings transaction is created.

- [ ] **Step 2: Implement `DepositsService.createDeposit()` with SQLite transaction**

Use TypeORM DataSource queryRunner or transaction manager to ensure atomicity across deposits, customer balance, inventory, and audit logs.

- [ ] **Step 3: Implement `WithdrawalsService` and `SalesService`**

Handle balance withdrawal validation (prevent negative balance) and stock reduction.

- [ ] **Step 4: Run transaction e2e tests**

Verify tests pass and database invariants hold.

- [ ] **Step 5: Commit**

```bash
git add src/modules/deposits/ src/modules/withdrawals/ src/modules/sales/ test/
git commit -m "feat: implement transactional endpoints for deposits, withdrawals, and sales"
```

---

### Task 6: Connect Client Frontend (`schema.js`) to NestJS API

**Files:**
- Modify: `public/js/db/schema.js`
- Modify: `public/js/app.js`

**Interfaces:**
- Consumes: `GET /api/bootstrap`, `POST /api/deposits`, `POST /api/withdrawals/*`, `POST /api/sales`
- Produces: Transparent API sync with zero changes to the 19 UI modules

- [ ] **Step 1: Update `DatabaseEngine.prototype.init()` in `public/js/db/schema.js`**

Fetch `/api/bootstrap`. On success, populate `this.data = responseData` and dispatch `app:state-changed`.
Keep local fallback for resilience if offline.

- [ ] **Step 2: Update mutator methods in `public/js/db/schema.js` to call REST API**

- `createDeposit(payload, user)`: Send `POST /api/deposits`. Update local cache and fire `app:state-changed`.
- `requestWithdrawal(custId, amount, method, user)`: Send `POST /api/withdrawals/request`.
- `completeWithdrawal(wId, user)`: Send `POST /api/withdrawals/:id/complete`.
- `recordSale(salePayload, user)`: Send `POST /api/sales`.
- `resetToDemo()`: Send `POST /api/system/reset-demo` and reload state.

- [ ] **Step 3: Update `public/js/app.js` to wait for database boot before initial route render**

Ensure `db.isReady` promise resolves before first `handleRoute()` call so UI renders real SQLite data immediately.

- [ ] **Step 4: Commit**

```bash
git add public/js/db/schema.js public/js/app.js
git commit -m "feat: synchronize client schema engine with nestjs rest backend"
```

---

### Task 7: End-to-End Verification & Health Check

**Files:**
- Test: `test/e2e-workflow.spec.ts`
- Modify: `README.md` (update documentation with NestJS & SQLite setup instructions)

**Interfaces:**
- Consumes: Running application at `http://localhost:3000/`
- Produces: Verified complete persistence lifecycle

- [ ] **Step 1: Write and run end-to-end integration check**

Start NestJS server.
Simulate a full flow:
1. Fetch bootstrap state.
2. Submit a deposit of 10 kg PET Plastic for customer `NSB-001`.
3. Check updated balance in `database.sqlite`.
4. Restart the NestJS server.
5. Re-fetch bootstrap state and verify the new deposit and balance persist across restart.

- [ ] **Step 2: Update `README.md`**

Replace PowerShell static server commands with `npm install` and `npm run start`.
Document `database.sqlite` file and general terms.

- [ ] **Step 3: Remove obsolete `serve.ps1`**

```bash
git rm serve.ps1
```

- [ ] **Step 4: Final commit**

```bash
git add README.md test/
git commit -m "docs: update readme with nestjs and sqlite running instructions"
```
