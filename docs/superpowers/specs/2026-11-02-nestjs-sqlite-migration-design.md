# Spesifikasi Desain: Migrasi Arsitektur ke NestJS & SQLite

## 1. Ringkasan Eksekutif
Dokumen ini mendefinisikan rancangan migrasi platform pengelolaan bank sampah (*Smart Waste Platform*) dari arsitektur frontend statis murni berbasis *in-browser localStorage* menjadi aplikasi fullstack dengan backend **NestJS** dan basis data lokal **SQLite** (`database.sqlite`).

Pendekatan yang dipilih adalah **Minimal Effort Architecture**:
- Mempertahankan antarmuka pengguna (19 modul vanilla JS, peta GIS Leaflet, grafik, dan CSS) tanpa *rewrite* ke framework baru.
- Menyajikan seluruh aset statis frontend langsung dari NestJS via `@nestjs/serve-static` dari direktori `public/`.
- Memusatkan persistensi dan integritas transaksi ke basis data file tunggal SQLite (`database.sqlite`).
- Mengganti persistensi *localStorage* di sisi klien dengan sinkronisasi REST API.
- Mengganti seluruh penamaan atau identitas spesifik menjadi istilah umum (*general terms*).

---

## 2. Sasaran & Batasan Sistem

### 2.1 Sasaran
1. **Persistensi Riil**: Data transaksi, mutasi saldo, dan stok tersimpan di server (`database.sqlite`), bukan di browser pengguna.
2. **Zero-Configuration DB**: Menggunakan SQLite file tunggal tanpa ketergantungan pada *service daemon* terpisah (seperti MySQL/PostgreSQL).
3. **Kompatibilitas Penuh**: 100% fungsionalitas modul (dasbor, setoran, nasabah, tabungan, inventori, peta spasial, AI decision support) tetap berjalan normal.
4. **Generalisasi Istilah**: Seluruh penamaan event bus, skema, dan modul menggunakan penamaan umum (*Smart Waste / Waste Bank*).

### 2.2 Batasan (Constraints)
- Tidak melakukan penulisan ulang (*rewrite*) antarmuka ke React/Vue/Angular untuk meminimalkan risiko regresi dan waktu pengerjaan.
- Tidak menggunakan template engine SSR berbasis file terpisah (seperti HBS/EJS) untuk menghindari pemecahan puluhan modul DOM yang sudah berfungsi dengan baik.

---

## 3. Arsitektur Solusi

### 3.1 Diagram Alur Komponen
```text
+--------------------------------------------------------------+
|                    Browser Klien (public/)                   |
|  - index.html, css/, js/ (19 Modul Operasional & Analitik)   |
|  - js/db/schema.js (In-memory cache & HTTP Synchronizer)     |
+------------------------------+-------------------------------+
                               |
                   HTTP GET    | HTTP POST/PUT
               (Aset & Boot)   | (Transaksi & Mutasi)
                               v
+--------------------------------------------------------------+
|                     NestJS Backend Server                    |
|  - ServeStaticModule (Melayani isi folder public/)           |
|  - REST API Controllers (/api/*)                             |
|  - Transaction Services & Business Rules                     |
|  - TypeORM / Better-SQLite3 Driver                           |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|               File Basis Data: database.sqlite               |
+--------------------------------------------------------------+
```

### 3.2 Struktur Direktori Proyek Baru
```text
smart-waste-platform/
├── database.sqlite                       # Basis data SQLite lokal
├── package.json                          # Manifest dependensi backend
├── tsconfig.json                         # Konfigurasi TypeScript NestJS
├── nest-cli.json                         # Konfigurasi NestJS CLI
├── public/                               # Direktori aset statis klien
│   ├── index.html
│   ├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── modules.css
│   │   └── variables.css
│   └── js/
│       ├── app.js
│       ├── auth/
│       ├── components/
│       ├── db/
│       │   ├── initial_data.js          # Seed cadangan sisi klien
│       │   └── schema.js                # Sinkronizer API
│       └── modules/                     # 19 modul aplikasi
└── src/
    ├── main.ts                           # Bootstrap aplikasi NestJS
    ├── app.module.ts                     # Root module & konfigurasi modul
    ├── database/
    │   ├── database.module.ts            # Modul koneksi TypeORM SQLite
    │   ├── seed.service.ts               # Seeder otomatis saat DB kosong
    │   └── entities/                     # Entitas TypeORM
    │       ├── user.entity.ts
    │       ├── customer.entity.ts
    │       ├── waste-type.entity.ts
    │       ├── waste-price.entity.ts
    │       ├── deposit.entity.ts
    │       ├── deposit-item.entity.ts
    │       ├── savings-transaction.entity.ts
    │       ├── withdrawal.entity.ts
    │       ├── inventory.entity.ts
    │       ├── partner.entity.ts
    │       ├── sale.entity.ts
    │       ├── pickup.entity.ts
    │       ├── program.entity.ts
    │       ├── ai-insight.entity.ts
    │       ├── notification.entity.ts
    │       └── audit-log.entity.ts
    └── modules/
        ├── bootstrap/                    # Endpoint inisialisasi state klien
        │   ├── bootstrap.controller.ts
        │   └── bootstrap.service.ts
        ├── deposits/                     # Layanan transaksi setoran sampah
        ├── customers/                    # Manajemen nasabah
        ├── withdrawals/                  # Penarikan saldo
        ├── inventory/                    # Stok barang & penjualan
        ├── pickups/                      # Penjemputan sampah
        └── system/                       # Utilitas sistem & reset demo
```

---

## 4. Rincian Skema Data & Basis Data

Nama file basis data: `database.sqlite` di *root* proyek.

### 4.1 Tabel Utama & Relasi
1. **users**: Pengguna sistem dengan peran (*SUPER_ADMIN, MANAGER, OPERATOR, CUSTOMER, PARTNER*).
2. **rw**: Data wilayah rukun warga dan target operasional.
3. **service_points**: Titik pos layanan penimbangan dan armada.
4. **waste_types & waste_prices**: Master jenis sampah dan fluktuasi harga acuan.
5. **customers**: Data nasabah, saldo aktif, status keaktifan, total timbulan disetor.
6. **deposits & deposit_items**: Header dan item transaksi penimbangan sampah.
7. **savings_transactions**: Mutasi pembukuan saldo nasabah (kredit/debit).
8. **withdrawals**: Riwayat pengajuan dan pencairan saldo tabungan.
9. **inventory**: Stok gudang aktif per jenis sampah.
10. **partners & sales**: Mitra pengolah dan transaksi hilirisasi material.
11. **pickups**: Jadwal dan status armada penjemputan sampah.
12. **programs, ai_insights, ai_alerts, notifications, audit_logs**: Tabel operasional pendukung.

### 4.2 Strategi Auto-Seeding
Saat NestJS dijalankan:
- Jika file `database.sqlite` belum memiliki data (jumlah user = 0), `SeedService` otomatis mengisi data awal dari file data benih default.
- Seluruh data awal diberi atribut penanda `[DEMO DATA]`.

---

## 5. Rute REST API

### 5.1 Endpoint Bootstrap (Sinkronisasi Klien)
* `GET /api/bootstrap`
  * Mengembalikan seluruh koleksi entitas aktif dalam satu respons JSON.
  * Digunakan oleh `public/js/db/schema.js` saat inisialisasi awal aplikasi di browser untuk mengisi cache memori.

### 5.2 Endpoint Transaksi & Operasional
* `POST /api/deposits`: Membuat transaksi setoran baru.
  * Validasi berat dan harga.
  * Mutasi otomatis ke stok `inventory`.
  * Penambahan saldo ke `customers` dan pencatatan di `savings_transactions`.
  * Pencatatan `audit_logs`.
* `POST /api/withdrawals/request`: Pengajuan penarikan saldo nasabah.
* `POST /api/withdrawals/:id/complete`: Persetujuan/penyelesaian penarikan saldo.
* `POST /api/sales`: Penjualan inventori material ke mitra industri daur ulang.
* `POST /api/customers`: Penambahan atau pembaruan data nasabah.
* `POST /api/pickups`: Pengajuan atau pembaruan status jemput sampah.
* `POST /api/system/reset-demo`: Reset basis data ke kondisi awal demo data.

---

## 6. Sinkronisasi Sisi Klien (Frontend)

File yang disesuaikan pada sisi klien:
1. `public/js/db/schema.js`:
   * Mengganti pembacaan *localStorage* dengan panggilan `fetch('/api/bootstrap')` saat inisialisasi.
   * Fungsi getter (`getCustomers()`, `getDeposits()`, dsb) tetap berjalan sinkronus membaca memori lokal.
   * Metode transaksi (`createDeposit`, `requestWithdrawal`, `recordSale`, dsb) mengirim request HTTP secara asinkronus ke endpoint NestJS, lalu memperbarui memori lokal dan memicu event `app:state-changed`.
2. Generalisasi Event Bus:
   * Event `berkasih:state-changed` diganti menjadi `app:state-changed`.
   * Event `berkasih:auth-changed` diganti menjadi `app:auth-changed`.
   * Storage key lokal diubah menjadi `smart_waste_local_cache`.

---

## 7. Rencana Pengujian & Validasi

1. **Pengujian Basis Data & Seeder**:
   * Menjalankan server NestJS, memastikan file `database.sqlite` dibuat dan terisi data benih secara otomatis.
2. **Pengujian Penyajian Statis**:
   * Akses `http://localhost:3000/` memastikan halaman utama, modul GIS Leaflet, chart, dan modal termuat sempurna.
3. **Pengujian Siklus Transaksi**:
   * Buat setoran sampah baru dari wizard loket penimbangan.
   * Pastikan saldo nasabah bertambah, stok gudang bertambah, dan transaksi tercatat di `database.sqlite`.
   * Restart server NestJS, verifikasi data transaksi baru tidak hilang.
4. **Pengujian Generalisasi Istilah**:
   * Memastikan tidak ada keterikatan kode dengan istilah-istilah non-generik.
