/**
 * BERKASIH SMART - Initial Database Seed
 * Kelurahan Karyamulya, Kecamatan Kesambi, Kota Cirebon, Jawa Barat
 * Coordinates Center: Lat -6.7460, Lng 108.5370
 * 
 * All initial records are marked `isDemo: true` per Product Principle #10
 */

export const INITIAL_DATA = {
  // Users & Staff
  users: [
    {
      id: "usr-01",
      name: "Hendra Gunawan, S.T.",
      email: "hendra@berkasih.id",
      phone: "081222334455",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      created_at: "2025-01-10T08:00:00Z"
    },
    {
      id: "usr-02",
      name: "Nurul Hidayati, S.Sos.",
      email: "nurul@berkasih.id",
      phone: "081333445566",
      role: "MANAGER",
      status: "ACTIVE",
      created_at: "2025-01-12T09:00:00Z"
    },
    {
      id: "usr-03",
      name: "Rian Prasetyo",
      email: "rian.ops@berkasih.id",
      phone: "081777889900",
      role: "OPERATOR",
      status: "ACTIVE",
      created_at: "2025-02-01T08:30:00Z"
    },
    {
      id: "usr-04",
      name: "Siti Aminah",
      email: "siti.aminah@gmail.com",
      phone: "082111223344",
      role: "CUSTOMER",
      customer_id: "NSB-001",
      status: "ACTIVE",
      created_at: "2025-02-05T10:00:00Z"
    },
    {
      id: "usr-05",
      name: "PT Cirebon Daur Mulya",
      email: "logistik@cirebondaur.co.id",
      phone: "0231-488921",
      role: "PARTNER",
      partner_id: "PTR-001",
      status: "ACTIVE",
      created_at: "2025-01-15T11:00:00Z"
    }
  ],

  // RW Data for Kelurahan Karyamulya (15 RWs)
  rw: [
    { id: "RW-01", name: "RW 01 Majasem Indah", code: "01", population: 1420, households: 380, lat: -6.7432, lng: 108.5320, coverage_status: "SERVED", active_customers: 42 },
    { id: "RW-02", name: "RW 02 Karyabakti", code: "02", population: 1180, households: 310, lat: -6.7445, lng: 108.5348, coverage_status: "SERVED", active_customers: 35 },
    { id: "RW-03", name: "RW 03 Griya Karyamulya", code: "03", population: 1650, households: 440, lat: -6.7460, lng: 108.5365, coverage_status: "SERVED", active_customers: 58 },
    { id: "RW-04", name: "RW 04 Situgangga", code: "04", population: 1890, households: 510, lat: -6.7485, lng: 108.5385, coverage_status: "SERVED", active_customers: 64 },
    { id: "RW-05", name: "RW 05 Kanggraksan Utara", code: "05", population: 1350, households: 360, lat: -6.7420, lng: 108.5390, coverage_status: "SERVED", active_customers: 28 },
    { id: "RW-06", name: "RW 06 Kayuwalang Baru", code: "06", population: 2100, households: 580, lat: -6.7510, lng: 108.5340, coverage_status: "PARTIAL", active_customers: 18 },
    { id: "RW-07", name: "RW 07 Perjuangan Asri", code: "07", population: 1250, households: 330, lat: -6.7450, lng: 108.5410, coverage_status: "SERVED", active_customers: 31 },
    { id: "RW-08", name: "RW 08 Citra Permai", code: "08", population: 980, households: 260, lat: -6.7490, lng: 108.5425, coverage_status: "PARTIAL", active_customers: 14 },
    { id: "RW-09", name: "RW 09 Karyamulya Timur", code: "09", population: 1450, households: 390, lat: -6.7435, lng: 108.5440, coverage_status: "SERVED", active_customers: 26 },
    { id: "RW-10", name: "RW 10 Swasembada", code: "10", population: 1120, households: 295, lat: -6.7410, lng: 108.5350, coverage_status: "PARTIAL", active_customers: 12 },
    { id: "RW-11", name: "RW 11 Taman Cirebon Indah", code: "11", population: 1720, households: 460, lat: -6.7470, lng: 108.5310, coverage_status: "SERVED", active_customers: 38 },
    { id: "RW-12", name: "RW 12 Bukit Kayuwalang", code: "12", population: 1540, households: 410, lat: -6.7535, lng: 108.5380, coverage_status: "UNSERVED", active_customers: 4 },
    { id: "RW-13", name: "RW 13 Perum Karyamulya Regency", code: "13", population: 1380, households: 370, lat: -6.7505, lng: 108.5450, coverage_status: "PARTIAL", active_customers: 16 },
    { id: "RW-14", name: "RW 14 Mulya Asri", code: "14", population: 1050, households: 280, lat: -6.7440, lng: 108.5280, coverage_status: "UNSERVED", active_customers: 2 },
    { id: "RW-15", name: "RW 15 Karyamulya Selatan", code: "15", population: 1290, households: 345, lat: -6.7540, lng: 108.5315, coverage_status: "UNSERVED", active_customers: 3 }
  ],

  // Service Points (Pos Bank Sampah Unit)
  service_points: [
    { id: "SP-01", name: "Pos Pusat Bank Sampah BERKASIH", address: "Jl. Perjuangan No. 42 (Dekat Balai Kelurahan Karyamulya)", lat: -6.7460, lng: 108.5368, status: "ACTIVE", type: "CENTRAL_HUB", capacity_kg: 5000 },
    { id: "SP-02", name: "Unit Setor RW 04 Situgangga", address: "Balai Warga RW 04 Situgangga", lat: -6.7485, lng: 108.5385, status: "ACTIVE", type: "COLLECTION_POINT", capacity_kg: 1500 },
    { id: "SP-03", name: "Unit Setor RW 01 Majasem", address: "Poskamling RW 01 Majasem Indah", lat: -6.7432, lng: 108.5320, status: "ACTIVE", type: "COLLECTION_POINT", capacity_kg: 1200 },
    { id: "SP-04", name: "Unit Setor RW 11 Taman Cirebon", address: "Gedung Serbaguna RW 11", lat: -6.7470, lng: 108.5310, status: "ACTIVE", type: "COLLECTION_POINT", capacity_kg: 1000 }
  ],

  // Master Waste Types & Categories
  waste_types: [
    {
      id: "WST-001",
      category: "Plastik",
      name: "Plastik Botol Bersih (PET Bening)",
      unit: "kg",
      current_price_per_kg: 3500,
      co2_factor: 1.85, // kg CO2e saved per kg recycled
      water_factor: 2.50, // liters saved per kg recycled
      description: "Botol air mineral bersih tanpa tutup/label",
      is_active: true
    },
    {
      id: "WST-002",
      category: "Plastik",
      name: "Plastik Gelas (PP Bening/Cup)",
      unit: "kg",
      current_price_per_kg: 2800,
      co2_factor: 1.70,
      water_factor: 2.10,
      description: "Gelas plastik minuman kemasan",
      is_active: true
    },
    {
      id: "WST-003",
      category: "Plastik",
      name: "Plastik Tutup Botol / Campur (HDPE)",
      unit: "kg",
      current_price_per_kg: 2400,
      co2_factor: 1.60,
      water_factor: 1.90,
      description: "Jerigen, botol sampo, tutup botol",
      is_active: true
    },
    {
      id: "WST-004",
      category: "Kertas/Karton",
      name: "Kardus / Karton Coklat",
      unit: "kg",
      current_price_per_kg: 1800,
      co2_factor: 1.25,
      water_factor: 3.20,
      description: "Kardus kemasan kering dan terlipat",
      is_active: true
    },
    {
      id: "WST-005",
      category: "Kertas/Karton",
      name: "Kertas HVS / Arsip Putih",
      unit: "kg",
      current_price_per_kg: 2200,
      co2_factor: 1.40,
      water_factor: 4.50,
      description: "Kertas buku tulis, kertas kantor, HVS kering",
      is_active: true
    },
    {
      id: "WST-006",
      category: "Logam",
      name: "Kaleng Minuman / Seng",
      unit: "kg",
      current_price_per_kg: 3000,
      co2_factor: 4.80,
      water_factor: 6.00,
      description: "Kaleng biskuit, kaleng susu, seng",
      is_active: true
    },
    {
      id: "WST-007",
      category: "Logam",
      name: "Besi Campur / Rongsok",
      unit: "kg",
      current_price_per_kg: 4200,
      co2_factor: 5.20,
      water_factor: 7.50,
      description: "Potongan besi padat kering",
      is_active: true
    },
    {
      id: "WST-008",
      category: "Kaca",
      name: "Botol Kaca / Beling Utuh",
      unit: "kg",
      current_price_per_kg: 800,
      co2_factor: 0.70,
      water_factor: 1.20,
      description: "Botol kecap, sirup, atau beling tidak pecah",
      is_active: true
    },
    {
      id: "WST-009",
      category: "Minyak Jelantah",
      name: "Minyak Goreng Bekas (Jelantah)",
      unit: "liter",
      current_price_per_kg: 6500,
      co2_factor: 2.80,
      water_factor: 10.00,
      description: "Jelantah tersaring dalam botol tertutup",
      is_active: true
    },
    {
      id: "WST-010",
      category: "Organik",
      name: "Sampah Organik Terpilah / Kompos",
      unit: "kg",
      current_price_per_kg: 500,
      co2_factor: 0.50, // Prevents methane generation
      water_factor: 0.80,
      description: "Sisa sayur, buah terpilah untuk maggot/kompos",
      is_active: true
    }
  ],

  // Waste Prices History (Audit log for price updates)
  waste_prices: [
    { id: "WP-001", waste_type_id: "WST-001", price_per_kg: 3200, effective_date: "2025-01-01", end_date: "2025-06-30", changed_by: "Hendra Gunawan" },
    { id: "WP-002", waste_type_id: "WST-001", price_per_kg: 3500, effective_date: "2025-07-01", end_date: null, changed_by: "Hendra Gunawan" },
    { id: "WP-003", waste_type_id: "WST-004", price_per_kg: 1600, effective_date: "2025-01-01", end_date: "2025-06-30", changed_by: "Hendra Gunawan" },
    { id: "WP-004", waste_type_id: "WST-004", price_per_kg: 1800, effective_date: "2025-07-01", end_date: null, changed_by: "Hendra Gunawan" }
  ],

  // Customers (Nasabah) across RW 01 - RW 15
  customers: [
    {
      id: "NSB-001",
      customer_code: "BRK-2501",
      name: "Siti Aminah",
      phone: "082111223344",
      address: "Jl. Situgangga IV No. 12",
      rw_id: "RW-04",
      rt_id: "RT 03",
      join_date: "2025-01-15",
      status: "ACTIVE", // ACTIVE, DECLINING, AT RISK, INACTIVE
      total_weight: 48.5,
      savings_balance: 142000,
      last_deposit_date: "2026-09-20",
      deposit_count: 14,
      dominant_waste: "Plastik Botol Bersih (PET Bening)",
      privacy_level: "AGGREGATED", // Rule #7 & #8
      lat: -6.7482,
      lng: 108.5381,
      isDemo: true
    },
    {
      id: "NSB-002",
      customer_code: "BRK-2502",
      name: "Bambang Sudibyo",
      phone: "081299887766",
      address: "Komplek Majasem Indah Blok B2",
      rw_id: "RW-01",
      rt_id: "RT 01",
      join_date: "2025-01-20",
      status: "ACTIVE",
      total_weight: 92.0,
      savings_balance: 265500,
      last_deposit_date: "2026-09-24",
      deposit_count: 22,
      dominant_waste: "Kardus / Karton Coklat",
      privacy_level: "AGGREGATED",
      lat: -6.7430,
      lng: 108.5325,
      isDemo: true
    },
    {
      id: "NSB-003",
      customer_code: "BRK-2503",
      name: "Dewi Kartika",
      phone: "085677881122",
      address: "Jl. Griya Karyamulya No. 8",
      rw_id: "RW-03",
      rt_id: "RT 04",
      join_date: "2025-02-01",
      status: "ACTIVE",
      total_weight: 36.2,
      savings_balance: 98000,
      last_deposit_date: "2026-09-18",
      deposit_count: 9,
      dominant_waste: "Minyak Goreng Bekas (Jelantah)",
      privacy_level: "AGGREGATED",
      lat: -6.7458,
      lng: 108.5360,
      isDemo: true
    },
    {
      id: "NSB-004",
      customer_code: "BRK-2504",
      name: "Ahmad Fauzi",
      phone: "087811224455",
      address: "Gg. Karyabakti III RT 02",
      rw_id: "RW-02",
      rt_id: "RT 02",
      join_date: "2025-02-14",
      status: "DECLINING", // Declining frequency
      total_weight: 29.0,
      savings_balance: 62000,
      last_deposit_date: "2026-08-10",
      deposit_count: 7,
      dominant_waste: "Kertas HVS / Arsip Putih",
      privacy_level: "AGGREGATED",
      lat: -6.7442,
      lng: 108.5345,
      isDemo: true
    },
    {
      id: "NSB-005",
      customer_code: "BRK-2505",
      name: "Sri Mulyani",
      phone: "081344556677",
      address: "Jl. Taman Cirebon Indah Blok C",
      rw_id: "RW-11",
      rt_id: "RT 02",
      join_date: "2025-03-05",
      status: "ACTIVE",
      total_weight: 64.8,
      savings_balance: 185000,
      last_deposit_date: "2026-09-22",
      deposit_count: 16,
      dominant_waste: "Plastik Tutup Botol / Campur (HDPE)",
      privacy_level: "AGGREGATED",
      lat: -6.7468,
      lng: 108.5312,
      isDemo: true
    },
    {
      id: "NSB-006",
      customer_code: "BRK-2506",
      name: "Joko Susilo",
      phone: "089855667788",
      address: "Jl. Kayuwalang Baru No. 19",
      rw_id: "RW-06",
      rt_id: "RT 05",
      join_date: "2025-03-20",
      status: "AT RISK", // No deposit for > 45 days
      total_weight: 18.5,
      savings_balance: 41000,
      last_deposit_date: "2026-07-28",
      deposit_count: 4,
      dominant_waste: "Kaleng Minuman / Seng",
      privacy_level: "AGGREGATED",
      lat: -6.7512,
      lng: 108.5338,
      isDemo: true
    },
    {
      id: "NSB-007",
      customer_code: "BRK-2507",
      name: "Ratna Sari Dewi",
      phone: "082344559900",
      address: "Perum Perjuangan Asri Blok D",
      rw_id: "RW-07",
      rt_id: "RT 01",
      join_date: "2025-04-10",
      status: "ACTIVE",
      total_weight: 42.0,
      savings_balance: 112000,
      last_deposit_date: "2026-09-25",
      deposit_count: 11,
      dominant_waste: "Plastik Gelas (PP Bening/Cup)",
      privacy_level: "AGGREGATED",
      lat: -6.7452,
      lng: 108.5415,
      isDemo: true
    },
    {
      id: "NSB-008",
      customer_code: "BRK-2508",
      name: "Eko Prasetyo",
      phone: "081977665544",
      address: "Citra Permai Blok A3",
      rw_id: "RW-08",
      rt_id: "RT 03",
      join_date: "2025-05-02",
      status: "INACTIVE", // No deposit > 90 days
      total_weight: 12.0,
      savings_balance: 28000,
      last_deposit_date: "2026-05-15",
      deposit_count: 2,
      dominant_waste: "Botol Kaca / Beling Utuh",
      privacy_level: "AGGREGATED",
      lat: -6.7492,
      lng: 108.5422,
      isDemo: true
    },
    {
      id: "NSB-009",
      customer_code: "BRK-2509",
      name: "Endang Supriyati",
      phone: "085233441122",
      address: "Jl. Situgangga Utama No. 34",
      rw_id: "RW-04",
      rt_id: "RT 01",
      join_date: "2025-05-20",
      status: "ACTIVE",
      total_weight: 55.4,
      savings_balance: 167000,
      last_deposit_date: "2026-09-26",
      deposit_count: 13,
      dominant_waste: "Kardus / Karton Coklat",
      privacy_level: "AGGREGATED",
      lat: -6.7488,
      lng: 108.5389,
      isDemo: true
    },
    {
      id: "NSB-010",
      customer_code: "BRK-2510",
      name: "Budi Santoso",
      phone: "081122338899",
      address: "Jl. Kanggraksan Utara RT 04",
      rw_id: "RW-05",
      rt_id: "RT 04",
      join_date: "2025-06-01",
      status: "ACTIVE",
      total_weight: 38.6,
      savings_balance: 104500,
      last_deposit_date: "2026-09-15",
      deposit_count: 8,
      dominant_waste: "Besi Campur / Rongsok",
      privacy_level: "AGGREGATED",
      lat: -6.7422,
      lng: 108.5393,
      isDemo: true
    }
  ],

  // Recent Waste Deposits (Transactions)
  deposits: [
    {
      id: "DEP-2026-001",
      customer_id: "NSB-001",
      operator_id: "usr-03",
      service_point_id: "SP-01",
      transaction_date: "2026-09-20T09:15:00Z",
      total_weight: 4.5,
      total_value: 15750,
      status: "COMPLETED",
      notes: "Setoran rutin mingguan",
      isDemo: true,
      details: [
        { waste_type_id: "WST-001", waste_name: "Plastik Botol Bersih (PET Bening)", weight: 3.5, price_per_kg: 3500, subtotal: 12250 },
        { waste_type_id: "WST-004", waste_name: "Kardus / Karton Coklat", weight: 1.0, price_per_kg: 1800, subtotal: 1800 },
        { waste_type_id: "WST-010", waste_name: "Sampah Organik Terpilah / Kompos", weight: 3.4, price_per_kg: 500, subtotal: 1700 }
      ]
    },
    {
      id: "DEP-2026-002",
      customer_id: "NSB-002",
      operator_id: "usr-03",
      service_point_id: "SP-03",
      transaction_date: "2026-09-24T10:30:00Z",
      total_weight: 12.0,
      total_value: 23600,
      status: "COMPLETED",
      notes: "Kardus kemasan elektronik",
      isDemo: true,
      details: [
        { waste_type_id: "WST-004", waste_name: "Kardus / Karton Coklat", weight: 8.0, price_per_kg: 1800, subtotal: 14400 },
        { waste_type_id: "WST-005", waste_name: "Kertas HVS / Arsip Putih", weight: 4.0, price_per_kg: 2300, subtotal: 9200 }
      ]
    },
    {
      id: "DEP-2026-003",
      customer_id: "NSB-003",
      operator_id: "usr-03",
      service_point_id: "SP-01",
      transaction_date: "2026-09-18T14:10:00Z",
      total_weight: 5.0,
      total_value: 32500,
      status: "COMPLETED",
      notes: "Jelantah rumah tangga 5 liter",
      isDemo: true,
      details: [
        { waste_type_id: "WST-009", waste_name: "Minyak Goreng Bekas (Jelantah)", weight: 5.0, price_per_kg: 6500, subtotal: 32500 }
      ]
    },
    {
      id: "DEP-2026-004",
      customer_id: "NSB-007",
      operator_id: "usr-03",
      service_point_id: "SP-01",
      transaction_date: "2026-09-25T11:00:00Z",
      total_weight: 6.2,
      total_value: 19160,
      status: "COMPLETED",
      notes: "Cup plastik warung",
      isDemo: true,
      details: [
        { waste_type_id: "WST-002", waste_name: "Plastik Gelas (PP Bening/Cup)", weight: 4.2, price_per_kg: 2800, subtotal: 11760 },
        { waste_type_id: "WST-006", waste_name: "Kaleng Minuman / Seng", weight: 2.0, price_per_kg: 3700, subtotal: 7400 }
      ]
    },
    {
      id: "DEP-2026-005",
      customer_id: "NSB-009",
      operator_id: "usr-03",
      service_point_id: "SP-02",
      transaction_date: "2026-09-26T08:45:00Z",
      total_weight: 9.5,
      total_value: 25250,
      status: "COMPLETED",
      notes: "Setoran gabungan RT 01",
      isDemo: true,
      details: [
        { waste_type_id: "WST-001", waste_name: "Plastik Botol Bersih (PET Bening)", weight: 3.5, price_per_kg: 3500, subtotal: 12250 },
        { waste_type_id: "WST-004", waste_name: "Kardus / Karton Coklat", weight: 5.0, price_per_kg: 1800, subtotal: 9000 },
        { waste_type_id: "WST-008", waste_name: "Botol Kaca / Beling Utuh", weight: 5.0, price_per_kg: 800, subtotal: 4000 }
      ]
    }
  ],

  // Savings Transactions Ledger (Financial Consistency: Opening + Deposit - Withdrawal = Closing)
  savings_transactions: [
    {
      id: "TX-SAV-001",
      customer_id: "NSB-001",
      transaction_type: "DEPOSIT",
      amount: 15750,
      reference_id: "DEP-2026-001",
      transaction_date: "2026-09-20T09:15:00Z",
      balance_before: 126250,
      balance_after: 142000,
      description: "Hasil setoran sampah DEP-2026-001 (4.5 kg)",
      isDemo: true
    },
    {
      id: "TX-SAV-002",
      customer_id: "NSB-002",
      transaction_type: "DEPOSIT",
      amount: 23600,
      reference_id: "DEP-2026-002",
      transaction_date: "2026-09-24T10:30:00Z",
      balance_before: 241900,
      balance_after: 265500,
      description: "Hasil setoran sampah DEP-2026-002 (12 kg)",
      isDemo: true
    },
    {
      id: "TX-SAV-003",
      customer_id: "NSB-003",
      transaction_type: "DEPOSIT",
      amount: 32500,
      reference_id: "DEP-2026-003",
      transaction_date: "2026-09-18T14:10:00Z",
      balance_before: 65500,
      balance_after: 98000,
      description: "Hasil setoran sampah DEP-2026-003 (5 L Jelantah)",
      isDemo: true
    },
    {
      id: "TX-SAV-004",
      customer_id: "NSB-005",
      transaction_type: "WITHDRAWAL",
      amount: 50000,
      reference_id: "WDR-2026-001",
      transaction_date: "2026-09-19T11:20:00Z",
      balance_before: 235000,
      balance_after: 185000,
      description: "Penarikan tabungan tunai (Disetujui Manager)",
      isDemo: true
    }
  ],

  // Withdrawals Requests & Pipeline
  withdrawals: [
    {
      id: "WDR-2026-001",
      customer_id: "NSB-005",
      customer_name: "Sri Mulyani",
      amount: 50000,
      status: "COMPLETED", // REQUESTED, APPROVED, COMPLETED
      requested_at: "2026-09-18T10:00:00Z",
      approved_at: "2026-09-19T09:30:00Z",
      completed_at: "2026-09-19T11:20:00Z",
      approved_by: "Nurul Hidayati",
      payout_method: "TUNAI",
      isDemo: true
    },
    {
      id: "WDR-2026-002",
      customer_id: "NSB-001",
      customer_name: "Siti Aminah",
      amount: 50000,
      status: "REQUESTED",
      requested_at: "2026-09-27T14:00:00Z",
      approved_at: null,
      completed_at: null,
      approved_by: null,
      payout_method: "TRANSFER_BCA",
      isDemo: true
    }
  ],

  // Warehouse Inventory (Reconciled with deposits & partner sales)
  inventory: [
    { waste_type_id: "WST-001", name: "Plastik Botol Bersih (PET)", current_stock: 420.5, incoming_total: 850.0, outgoing_total: 429.5, min_threshold: 100, max_capacity: 800, status: "Healthy" },
    { waste_type_id: "WST-002", name: "Plastik Gelas (PP)", current_stock: 280.0, incoming_total: 510.0, outgoing_total: 230.0, min_threshold: 80, max_capacity: 600, status: "Healthy" },
    { waste_type_id: "WST-003", name: "Plastik HDPE / Tutup", current_stock: 195.0, incoming_total: 340.0, outgoing_total: 145.0, min_threshold: 50, max_capacity: 500, status: "Healthy" },
    { waste_type_id: "WST-004", name: "Kardus / Karton Coklat", current_stock: 780.0, incoming_total: 1600.0, outgoing_total: 820.0, min_threshold: 200, max_capacity: 1000, status: "High Stock" },
    { waste_type_id: "WST-005", name: "Kertas HVS / Putih", current_stock: 310.0, incoming_total: 620.0, outgoing_total: 310.0, min_threshold: 100, max_capacity: 700, status: "Healthy" },
    { waste_type_id: "WST-006", name: "Kaleng Minuman / Seng", current_stock: 95.0, incoming_total: 240.0, outgoing_total: 145.0, min_threshold: 50, max_capacity: 400, status: "Attention" },
    { waste_type_id: "WST-007", name: "Besi Campur", current_stock: 140.0, incoming_total: 380.0, outgoing_total: 240.0, min_threshold: 50, max_capacity: 500, status: "Healthy" },
    { waste_type_id: "WST-008", name: "Botol Kaca Utuh", current_stock: 450.0, incoming_total: 750.0, outgoing_total: 300.0, min_threshold: 150, max_capacity: 800, status: "Healthy" },
    { waste_type_id: "WST-009", name: "Minyak Jelantah", current_stock: 120.0, incoming_total: 280.0, outgoing_total: 160.0, min_threshold: 40, max_capacity: 300, status: "Healthy" },
    { waste_type_id: "WST-010", name: "Kompos / Organik Terolah", current_stock: 650.0, incoming_total: 1200.0, outgoing_total: 550.0, min_threshold: 100, max_capacity: 1200, status: "Healthy" }
  ],

  // Partners (Recyclers, Offtakers, Government, Schools)
  partners: [
    {
      id: "PTR-001",
      name: "PT Cirebon Daur Mulya",
      category: "Industri Daur Ulang",
      contact_person: "Bapak Agus Salim",
      phone: "0231-488921",
      email: "logistik@cirebondaur.co.id",
      location: "Kawasan Industri Lemahwungkuk, Cirebon",
      accepted_materials: ["Plastik Botol Bersih (PET Bening)", "Plastik Gelas (PP Bening/Cup)", "Plastik Tutup Botol / Campur (HDPE)"],
      status: "ACTIVE",
      total_purchased_kg: 2450.0,
      circularity_destination: "Flakes PET & Biji Plastik Daur Ulang Tekstil",
      isDemo: true
    },
    {
      id: "PTR-002",
      name: "CV Berkah Kertas Karyamulya",
      category: "Pengepul / Offtaker",
      contact_person: "Ibu Hajah Suryati",
      phone: "081233449911",
      email: "berkahkertas@cirebon.com",
      location: "Jl. Kanggraksan, Cirebon",
      accepted_materials: ["Kardus / Karton Coklat", "Kertas HVS / Arsip Putih"],
      status: "ACTIVE",
      total_purchased_kg: 3200.0,
      circularity_destination: "Pabrik Kertas Pulp & Karton Daur Ulang (Majalengka)",
      isDemo: true
    },
    {
      id: "PTR-003",
      name: "Bio-Diesel Cirebon Pratama",
      category: "Industri Energi Terbarukan",
      contact_person: "Ir. Dedi S.",
      phone: "081822334411",
      email: "biodiesel@cirebonpratama.id",
      location: "Pelabuhan Cirebon",
      accepted_materials: ["Minyak Goreng Bekas (Jelantah)"],
      status: "ACTIVE",
      total_purchased_kg: 480.0,
      circularity_destination: "Biodiesel B35 & Ekspor Bahan Baku SAF",
      isDemo: true
    },
    {
      id: "PTR-004",
      name: "Dinas Lingkungan Hidup (DLH) Kota Cirebon",
      category: "Pemerintah / DLH",
      contact_person: "Bidang Pengelolaan Sampah & LB3",
      phone: "0231-206771",
      email: "dlh@cirebonkota.go.id",
      location: "Jl. Dr. Wahidin Sudirohusodo No. 45, Cirebon",
      accepted_materials: ["Semua Kategori (Fasilitasi & Sertifikasi TPS3R)"],
      status: "ACTIVE",
      total_purchased_kg: 0,
      circularity_destination: "Monitoring & Penurunan Beban TPA Kopiluhur",
      isDemo: true
    }
  ],

  // Material Sales to Partners (Circular Outflow)
  sales: [
    {
      id: "SAL-2026-001",
      partner_id: "PTR-001",
      partner_name: "PT Cirebon Daur Mulya",
      sale_date: "2026-09-12",
      total_weight: 429.5,
      total_value: 1825375,
      status: "COMPLETED",
      payment_status: "PAID",
      reference_invoice: "INV-CDM-2609-08",
      items: [
        { waste_type_id: "WST-001", quantity: 429.5, price: 4250, subtotal: 1825375 }
      ],
      isDemo: true
    },
    {
      id: "SAL-2026-002",
      partner_id: "PTR-002",
      partner_name: "CV Berkah Kertas Karyamulya",
      sale_date: "2026-09-15",
      total_weight: 820.0,
      total_value: 1886000,
      status: "COMPLETED",
      payment_status: "PAID",
      reference_invoice: "INV-BKK-2609-12",
      items: [
        { waste_type_id: "WST-004", quantity: 820.0, price: 2300, subtotal: 1886000 }
      ],
      isDemo: true
    },
    {
      id: "SAL-2026-003",
      partner_id: "PTR-003",
      partner_name: "Bio-Diesel Cirebon Pratama",
      sale_date: "2026-09-22",
      total_weight: 160.0,
      total_value: 1200000,
      status: "COMPLETED",
      payment_status: "PAID",
      reference_invoice: "INV-BCP-2609-01",
      items: [
        { waste_type_id: "WST-009", quantity: 160.0, price: 7500, subtotal: 1200000 }
      ],
      isDemo: true
    }
  ],

  // Pickups Management
  pickups: [
    {
      id: "PKP-001",
      customer_id: "NSB-002",
      customer_name: "Bambang Sudibyo",
      phone: "081299887766",
      address: "Komplek Majasem Indah Blok B2",
      rw: "RW-01",
      lat: -6.7430,
      lng: 108.5325,
      estimated_weight: 15.0,
      waste_types: ["Kardus", "Kertas HVS"],
      requested_date: "2026-09-27T08:00:00Z",
      scheduled_date: "2026-09-29T09:00:00Z",
      assigned_operator: "Rian Prasetyo",
      vehicle: "Motor Roda Tiga Viar No. 2",
      status: "Scheduled", // Requested -> Scheduled -> Assigned -> Picked Up -> Weighed -> Completed
      notes: "Kardus bekas TV & AC siap di garasi",
      isDemo: true
    },
    {
      id: "PKP-002",
      customer_id: "NSB-005",
      customer_name: "Sri Mulyani",
      phone: "081344556677",
      address: "Jl. Taman Cirebon Indah Blok C",
      rw: "RW-11",
      lat: -6.7468,
      lng: 108.5312,
      estimated_weight: 8.0,
      waste_types: ["Plastik Botol", "Kaleng"],
      requested_date: "2026-09-28T07:30:00Z",
      scheduled_date: "2026-09-29T10:30:00Z",
      assigned_operator: "Rian Prasetyo",
      vehicle: "Motor Roda Tiga Viar No. 2",
      status: "Assigned",
      notes: "Sudah dipilah dalam 3 karung",
      isDemo: true
    },
    {
      id: "PKP-003",
      customer_id: "NSB-004",
      customer_name: "Ahmad Fauzi",
      phone: "087811224455",
      address: "Gg. Karyabakti III RT 02",
      rw: "RW-02",
      lat: -6.7442,
      lng: 108.5345,
      estimated_weight: 12.0,
      waste_types: ["Kertas HVS", "Buku Bekas"],
      requested_date: "2026-09-28T09:00:00Z",
      scheduled_date: null,
      assigned_operator: null,
      vehicle: null,
      status: "Requested",
      notes: "Buku sekolah dan arsip kantor",
      isDemo: true
    }
  ],

  // Community Programs & Campaigns
  programs: [
    {
      id: "PRG-01",
      name: "Gerakan Karyamulya Pilah Sampah dari Rumah",
      objective: "Meningkatkan edukasi pemilahan sampah organik & anorganik di 15 RW",
      date: "2026-08-15 s.d 2026-10-30",
      location: "Seluruh RW Kelurahan Karyamulya",
      target_participants: 600,
      actual_participants: 412,
      status: "ONGOING",
      impact_kg: 2150.0,
      isDemo: true
    },
    {
      id: "PRG-02",
      name: "Tantangan Komunitas RW Bebas Sampah Liar 2026",
      objective: "Kompetisi gotong royong antar-RW untuk mengumpulkan dan memilah 5.000 kg sampah terdaur ulang",
      date: "2026-09-01 s.d 2026-11-30",
      location: "RW 01, RW 03, RW 04, RW 06, RW 11",
      target_participants: 500,
      actual_participants: 348,
      status: "ONGOING",
      target_kg: 5000,
      current_kg: 3120,
      impact_kg: 3120.0,
      isDemo: true
    },
    {
      id: "PRG-03",
      name: "Workshop Sedekah Jelantah & Penukaran Sembako",
      objective: "Konversi minyak jelantah rumah tangga menjadi saldo tabungan atau sembako",
      date: "2026-09-05",
      location: "Balai RW 04 Situgangga",
      target_participants: 100,
      actual_participants: 94,
      status: "COMPLETED",
      impact_kg: 280.0,
      isDemo: true
    }
  ],

  // AI Insights Cards (Insight, Evidence, Interpretation, Recommended Action, Confidence)
  ai_insights: [
    {
      id: "INS-001",
      title: "Penurunan Frekuensi Setoran pada Nasabah RW 06 Kayuwalang",
      evidence: "Frekuensi transaksi pada RW 06 turun sebesar 38.5% dalam 30 hari terakhir dibanding bulan sebelumnya (dari 26 setoran menjadi 16 setoran).",
      interpretation: "Terdapat indikasi kendala aksesibilitas jarak menuju Pos Pusat BERKASIH atau berkurangnya jadwal jemput keliling di area Kayuwalang.",
      recommendation: "Jadwalkan penjemputan berkala (motor roda tiga) pada hari Sabtu pagi khusus RW 06 atau koordinasikan kader PKK setempat.",
      confidence: "High",
      category: "Customer Activity",
      created_at: "2026-09-28T08:00:00Z",
      status: "UNREVIEWED"
    },
    {
      id: "INS-002",
      title: "Akumulasi Stok Kardus Mendekati Batas Kapasitas Gudang",
      evidence: "Stok kardus saat ini mencapai 780.0 kg (78% dari kapasitas maksimal 1.000 kg). Laju masuk rata-rata 35 kg/hari.",
      interpretation: "Jika tidak dilakukan pelepasan material dalam 6 hari ke depan, kapasitas penyimpanan gudang utama akan mengalami bottleneck.",
      recommendation: "Buka purchase order pengiriman material ke mitra CV Berkah Kertas Karyamulya untuk kuota minimal 500 kg.",
      confidence: "High",
      category: "Inventory",
      created_at: "2026-09-28T09:30:00Z",
      status: "UNREVIEWED"
    },
    {
      id: "INS-003",
      title: "Potensi Ekspansi Layanan Tinggi di RW 12 Bukit Kayuwalang",
      evidence: "Populasi 1.540 jiwa (410 KK) namun penetrasi nasabah saat ini baru 0.9% (4 nasabah) dengan coverage status UNSERVED.",
      interpretation: "Area memiliki kepadatan penduduk memadai namun belum terjangkau titik setor resmi maupun sosialisasi intensif.",
      recommendation: "Lakukan sosialisasi perdana bersama Pengurus RT/RW 12 dan tetapkan 1 titik jemput mingguan di balai warga.",
      confidence: "Medium",
      category: "Area Potential",
      created_at: "2026-09-27T16:00:00Z",
      status: "REVIEWED"
    }
  ],

  // AI Action Center Alerts (Critical, Important, Attention, Informational)
  ai_alerts: [
    {
      id: "ALT-001",
      severity: "critical", // critical, important, attention, informational
      title: "Permintaan Penarikan Tabungan Menunggu Verifikasi",
      message: "Terdapat 1 permintaan penarikan saldo nasabah (Siti Aminah, Rp50.000) yang belum diproses.",
      metric_value: "1 Permintaan",
      action_label: "Buka Verifikasi Penarikan",
      target_module: "tabungan"
    },
    {
      id: "ALT-002",
      severity: "important",
      title: "Kapasitas Gudang Kardus Mencapai 78%",
      message: "Gudang kardus menyimpan 780 kg dari kapasitas aman 1.000 kg. Segera koordinasi penjualan ke mitra.",
      metric_value: "780 kg / 1.000 kg",
      action_label: "Jual ke Mitra Offtaker",
      target_module: "inventori"
    },
    {
      id: "ALT-003",
      severity: "attention",
      title: "3 Permintaan Jemput Sampah Perlu Dijadwalkan",
      message: "Terdapat antrean jemput sampah di RW 01, RW 02, dan RW 11 untuk armada hari ini & besok.",
      metric_value: "3 Antrean",
      action_label: "Kelola Rute Penjemputan",
      target_module: "penjemputan"
    },
    {
      id: "ALT-004",
      severity: "informational",
      title: "Capaian Tantangan RW Bersih Mencapai 62.4%",
      message: "Sebanyak 3.120 kg dari target 5.000 kg telah berhasil dikumpulkan komunitas RW Karyamulya.",
      metric_value: "3.120 kg / 5.000 kg",
      action_label: "Lihat Progress Program",
      target_module: "programs"
    }
  ],

  // Notifications Log
  notifications: [
    {
      id: "NOTIF-001",
      title: "Setoran Sampah Berhasil Dicatat",
      message: "Setoran nasabah Endang Supriyati (9.5 kg) senilai Rp25.250 telah tercatat di Pos RW 04.",
      date: "2026-09-26T08:45:00Z",
      read: false,
      role: "ALL",
      severity: "info"
    },
    {
      id: "NOTIF-002",
      title: "Pengingat Penjualan Material",
      message: "Pengiriman 160 liter minyak jelantah ke Bio-Diesel Cirebon Pratama telah diverifikasi lunas.",
      date: "2026-09-22T15:00:00Z",
      read: true,
      role: "MANAGER",
      severity: "success"
    },
    {
      id: "NOTIF-003",
      title: "Peringatan Stok Gudang",
      message: "Stok kardus telah melebihi batas aman 750 kg.",
      date: "2026-09-25T17:00:00Z",
      read: false,
      role: "OPERATOR",
      severity: "warning"
    }
  ],

  // Audit Logs (Immutable event log: Who, What, When, Old Value, New Value)
  audit_logs: [
    {
      id: "AUD-001",
      user: "Hendra Gunawan (Super Admin)",
      role: "SUPER_ADMIN",
      action: "UPDATE_MASTER_PRICE",
      entity: "WASTE_PRICES",
      entity_id: "WST-001",
      old_value: "Rp3.200 / kg",
      new_value: "Rp3.500 / kg",
      timestamp: "2025-07-01T08:30:00Z",
      ip_address: "192.168.1.10"
    },
    {
      id: "AUD-002",
      user: "Nurul Hidayati (Manager)",
      role: "MANAGER",
      action: "APPROVE_WITHDRAWAL",
      entity: "WITHDRAWALS",
      entity_id: "WDR-2026-001",
      old_value: "STATUS: REQUESTED",
      new_value: "STATUS: COMPLETED (Rp50.000)",
      timestamp: "2026-09-19T11:20:00Z",
      ip_address: "192.168.1.12"
    },
    {
      id: "AUD-003",
      user: "Rian Prasetyo (Operator)",
      role: "OPERATOR",
      action: "CREATE_DEPOSIT",
      entity: "DEPOSITS",
      entity_id: "DEP-2026-005",
      old_value: "N/A",
      new_value: "Customer: NSB-009, Weight: 9.5 kg, Total: Rp25.250",
      timestamp: "2026-09-26T08:45:00Z",
      ip_address: "192.168.1.15"
    }
  ]
};
