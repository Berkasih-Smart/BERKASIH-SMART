/**
 * BERKASIH SMART - Admin Dashboard Module
 * Implements Section 7, 8, 9 (BERKASIH PULSE), 10 (This Month at BERKASIH)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';

export function renderDashboard(container) {
  const user = auth.getCurrentUser() || { name: 'Pengurus', role: 'SUPER_ADMIN' };
  const customers = db.getCustomers();
  const deposits = db.getDeposits();
  const inventory = db.getInventory();
  const sales = db.getSales();
  const impact = db.getEnvironmentalImpact();
  const pulseIndicators = db.getBerkasihPulse();

  // Metrics calculations
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'ACTIVE').length;
  const totalWeight = deposits.reduce((sum, d) => sum + (d.total_weight || 0), 0);
  const totalSavings = customers.reduce((sum, c) => sum + (c.savings_balance || 0), 0);
  const totalSoldWeight = sales.reduce((sum, s) => sum + (s.total_weight || 0), 0);
  const totalSalesRevenue = sales.reduce((sum, s) => sum + (s.total_value || 0), 0);

  // Waste Composition distribution
  const composition = {};
  for (const dep of deposits) {
    if (dep.details) {
      for (const item of dep.details) {
        const wt = db.getWasteTypeById(item.waste_type_id);
        const cat = wt ? wt.category : 'Lainnya';
        composition[cat] = (composition[cat] || 0) + (item.weight || 0);
      }
    }
  }

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Selamat Pagi, ${user.name || 'Pengurus'}</span>
          <span class="badge badge-demo">DEMO DATA</span>
        </h1>
        <p class="page-subtitle">Kondisi terkini Bank Sampah BERKASIH, Kelurahan Karyamulya, Kota Cirebon.</p>
      </div>

      <div class="page-actions">
        <!-- Date Filter Buttons -->
        <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 3px; display: flex; gap: 2px;">
          <button class="btn btn-sm btn-ghost active-date-filter" style="font-weight: 600; background-color: #F0FDF4; color: #14532D;" data-filter="month">Bulan Ini</button>
          <button class="btn btn-sm btn-ghost" data-filter="week">Minggu Ini</button>
          <button class="btn btn-sm btn-ghost" data-filter="year">Tahun Ini</button>
        </div>

        <button class="btn btn-primary" id="dash-quick-deposit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Input Setoran Baru
        </button>
      </div>
    </div>

    <!-- 1. SIGNATURE FEATURE: BERKASIH PULSE -->
    <section class="pulse-container">
      <div class="pulse-header">
        <div class="pulse-title-wrap">
          <div class="pulse-badge">
            <div class="pulse-dot"></div>
            BERKASIH PULSE
          </div>
          <span style="font-size: 0.85rem; font-weight: 600; color: #17201A;">Executive Health Overview</span>
          <span style="font-size: 0.75rem; color: #6B7280;">• Pembaruan real-time dari data terstruktur</span>
        </div>
        <div style="font-size: 0.72rem; color: #15803D; font-weight: 600; background: #DCFCE7; padding: 3px 8px; border-radius: 4px;">
          Sistem Operasional: PRIMA
        </div>
      </div>

      <div class="pulse-grid">
        ${pulseIndicators.map(p => `
          <div class="pulse-item">
            <div class="pulse-item-top">
              <span class="pulse-item-name">${p.name}</span>
              <span class="pulse-item-status ${p.status === 'Healthy' ? 'badge-healthy' : 'badge-attention'}">${p.status}</span>
            </div>
            <div class="pulse-item-metric">${p.metric}</div>
            <div class="pulse-item-trend" style="color: ${p.trendDirection === 'up' ? '#16A34A' : p.trendDirection === 'down' ? '#DC2626' : '#6B7280'};">
              ${p.trendDirection === 'up' ? '↑' : p.trendDirection === 'down' ? '↓' : '•'} ${p.trend}
            </div>
            <div class="pulse-item-desc">${p.desc}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 2. PRIMARY KPI CARDS -->
    <div class="grid grid-cols-6" style="margin-bottom: var(--space-6);">
      <!-- Total Nasabah -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Total Nasabah</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${totalCustomers}</span>
          <span class="kpi-unit">orang</span>
        </div>
        <div class="kpi-footer">
          <span class="trend-badge trend-up">↑ +2 baru</span>
          <span>Bulan September 2026</span>
        </div>
      </div>

      <!-- Nasabah Aktif -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Nasabah Aktif</span>
          <div class="kpi-icon-wrap" style="background-color: #ECFDF5; color: #059669;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${activeCustomers}</span>
          <span class="kpi-unit">orang (${Math.round((activeCustomers/totalCustomers)*100)}%)</span>
        </div>
        <div class="kpi-footer">
          <span class="trend-badge trend-up">↑ +8.4%</span>
          <span>Aktif setor ≤ 30 hari</span>
        </div>
      </div>

      <!-- Total Sampah Terkumpul -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Sampah Terkumpul</span>
          <div class="kpi-icon-wrap" style="background-color: #F0FDF4; color: #166534;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${totalWeight.toFixed(1)}</span>
          <span class="kpi-unit">kg</span>
        </div>
        <div class="kpi-footer">
          <span class="trend-badge trend-up">↑ +14.2%</span>
          <span>${deposits.length} transaksi tercatat</span>
        </div>
      </div>

      <!-- Total Nilai Tabungan -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Nilai Tabungan</span>
          <div class="kpi-icon-wrap" style="background-color: #EFF6FF; color: #2563EB;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size: 1.55rem;">Rp${(totalSavings / 1000).toLocaleString('id-ID')}</span>
          <span class="kpi-unit">rb</span>
        </div>
        <div class="kpi-footer">
          <span class="trend-badge trend-up">↑ +9.1%</span>
          <span>Liabilitas tabungan aman</span>
        </div>
      </div>

      <!-- Material Terjual -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Material Terjual</span>
          <div class="kpi-icon-wrap" style="background-color: #FEF3C7; color: #D97706;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${totalSoldWeight.toFixed(1)}</span>
          <span class="kpi-unit">kg</span>
        </div>
        <div class="kpi-footer">
          <span class="trend-badge trend-up">Rp${(totalSalesRevenue/1000000).toFixed(1)} jt</span>
          <span>Nilai penjualan ke offtaker</span>
        </div>
      </div>

      <!-- Environmental Impact -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Dampak Lingkungan</span>
          <div class="kpi-icon-wrap" style="background-color: #F0FDF4; color: #15803D;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${(impact.co2eSavedKg).toFixed(0)}</span>
          <span class="kpi-unit">kg CO2e</span>
        </div>
        <div class="kpi-footer">
          <span class="trend-badge trend-up">≈ ${impact.treesEquivalent} Pohon</span>
          <span>Serapan karbon terverifikasi</span>
        </div>
      </div>
    </div>

    <!-- 3. INTERACTIVE DASHBOARD CHARTS -->
    <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
      <!-- Chart 1: Waste Collection Trend -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <div class="card-title">Tren Pengumpulan Sampah (Bulan Berjalan)</div>
            <div style="font-size: 0.72rem; color: #6B7280;">Dinamika volume setoran harian di Kelurahan Karyamulya</div>
          </div>
          <span class="badge badge-healthy" style="font-size: 0.7rem;">+14.2% vs Bulan Lalu</span>
        </div>
        <div class="card-body">
          <!-- Interactive SVG Line/Area Chart -->
          <div style="height: 220px; width: 100%; position: relative;">
            <svg width="100%" height="220" viewBox="0 0 600 220" preserveAspectRatio="none" style="overflow: visible;">
              <!-- Horizontal Grid Lines -->
              <line x1="40" y1="30" x2="580" y2="30" stroke="#F1F5F9" stroke-width="1"/>
              <text x="30" y="34" font-size="10" fill="#94A3B8" text-anchor="end">40kg</text>

              <line x1="40" y1="80" x2="580" y2="80" stroke="#F1F5F9" stroke-width="1"/>
              <text x="30" y="84" font-size="10" fill="#94A3B8" text-anchor="end">30kg</text>

              <line x1="40" y1="130" x2="580" y2="130" stroke="#F1F5F9" stroke-width="1"/>
              <text x="30" y="134" font-size="10" fill="#94A3B8" text-anchor="end">20kg</text>

              <line x1="40" y1="180" x2="580" y2="180" stroke="#E2E8F0" stroke-width="1"/>
              <text x="30" y="184" font-size="10" fill="#94A3B8" text-anchor="end">0kg</text>

              <!-- Gradient Fill -->
              <defs>
                <linearGradient id="wasteAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#22C55E" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#22C55E" stop-opacity="0.0"/>
                </linearGradient>
              </defs>

              <!-- Area Path -->
              <path d="M 60 150 L 140 120 L 220 135 L 300 90 L 380 110 L 460 65 L 540 50 L 540 180 L 60 180 Z" fill="url(#wasteAreaGrad)" />

              <!-- Line Path -->
              <path d="M 60 150 L 140 120 L 220 135 L 300 90 L 380 110 L 460 65 L 540 50" fill="none" stroke="#15803D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

              <!-- Data Points with Tooltips -->
              <circle cx="60" cy="150" r="4" fill="#FFFFFF" stroke="#15803D" stroke-width="2"><title>Minggu 1: 12.5 kg</title></circle>
              <circle cx="140" cy="120" r="4" fill="#FFFFFF" stroke="#15803D" stroke-width="2"><title>Minggu 2: 18.0 kg</title></circle>
              <circle cx="220" cy="135" r="4" fill="#FFFFFF" stroke="#15803D" stroke-width="2"><title>Minggu 3: 15.2 kg</title></circle>
              <circle cx="300" cy="90" r="4" fill="#FFFFFF" stroke="#15803D" stroke-width="2"><title>Minggu 4: 24.5 kg</title></circle>
              <circle cx="380" cy="110" r="4" fill="#FFFFFF" stroke="#15803D" stroke-width="2"><title>Minggu 5: 20.8 kg</title></circle>
              <circle cx="460" cy="65" r="5" fill="#22C55E" stroke="#14532D" stroke-width="2"><title>Minggu 6: 32.0 kg</title></circle>
              <circle cx="540" cy="50" r="6" fill="#14532D" stroke="#FFFFFF" stroke-width="2"><title>Terkini: 38.5 kg</title></circle>

              <!-- X-Axis Labels -->
              <text x="60" y="202" font-size="10" fill="#64748B" text-anchor="middle">Mgg 1</text>
              <text x="140" y="202" font-size="10" fill="#64748B" text-anchor="middle">Mgg 2</text>
              <text x="220" y="202" font-size="10" fill="#64748B" text-anchor="middle">Mgg 3</text>
              <text x="300" y="202" font-size="10" fill="#64748B" text-anchor="middle">Mgg 4</text>
              <text x="380" y="202" font-size="10" fill="#64748B" text-anchor="middle">Mgg 5</text>
              <text x="460" y="202" font-size="10" fill="#64748B" text-anchor="middle">Mgg 6</text>
              <text x="540" y="202" font-size="10" fill="#15803D" font-weight="700" text-anchor="middle">Hari Ini</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Chart 2: Waste Composition (Donut) -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Komposisi Sampah</div>
          <span style="font-size: 0.72rem; color: #6B7280;">Berdasarkan Jenis</span>
        </div>
        <div class="card-body flex flex-col items-center">
          <!-- Donut SVG -->
          <svg width="150" height="150" viewBox="0 0 42 42" style="transform: rotate(-90deg); margin-bottom: 12px;">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" stroke-width="5"></circle>
            <!-- Plastik (38%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#15803D" stroke-width="5" stroke-dasharray="38 62" stroke-dashoffset="0"></circle>
            <!-- Kardus/Kertas (32%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22C55E" stroke-width="5" stroke-dasharray="32 68" stroke-dashoffset="-38"></circle>
            <!-- Minyak Jelantah (14%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#D97706" stroke-width="5" stroke-dasharray="14 86" stroke-dashoffset="-70"></circle>
            <!-- Logam & Kaca (16%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#475569" stroke-width="5" stroke-dasharray="16 84" stroke-dashoffset="-84"></circle>
          </svg>

          <!-- Legend list -->
          <div style="width: 100%; display: flex; flex-direction: column; gap: 6px; font-size: 0.75rem;">
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2"><span style="width: 10px; height: 10px; border-radius: 2px; background: #15803D;"></span> Plastik Terpilah</span>
              <strong>38% (18.5 kg)</strong>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2"><span style="width: 10px; height: 10px; border-radius: 2px; background: #22C55E;"></span> Kardus & Kertas</span>
              <strong>32% (15.6 kg)</strong>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2"><span style="width: 10px; height: 10px; border-radius: 2px; background: #D97706;"></span> Jelantah (Energi)</span>
              <strong>14% (6.8 L)</strong>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2"><span style="width: 10px; height: 10px; border-radius: 2px; background: #475569;"></span> Logam & Kaca</span>
              <strong>16% (7.8 kg)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. THIS MONTH AT BERKASIH (Section 10) -->
    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div style="width: 28px; height: 28px; border-radius: 6px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: 700;">
            📅
          </div>
          <div>
            <div class="card-title">This Month at BERKASIH — September 2026</div>
            <div style="font-size: 0.72rem; color: #6B7280;">Ringkasan eksekutif perkembangan operasional dan pencapaian komunitas</div>
          </div>
        </div>
        <span class="badge" style="background-color: #FEF3C7; color: #92400E; font-size: 0.68rem; border: 1px solid #FDE68A;">
          AI-generated draft — requires human verification
        </span>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-2" style="gap: var(--space-6);">
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 600; color: #14532D; margin-bottom: 8px;">Narasi Perkembangan</h4>
            <p style="font-size: 0.82rem; line-height: 1.6; color: #374151; margin-bottom: 12px;">
              Pada periode September 2026, Bank Sampah BERKASIH mencatat total pengumpulan <strong>${totalWeight.toFixed(1)} kg</strong> sampah daur ulang dari <strong>${deposits.length} transaksi</strong> warga. Sebanyak <strong>${activeCustomers} nasabah (80%)</strong> mempertahankan status aktif setor rutin, dengan RW 04 Situgangga dan RW 01 Majasem menjadi kontributor volume tertinggi.
            </p>
            <p style="font-size: 0.82rem; line-height: 1.6; color: #374151;">
              Aliran sirkularitas berhasil menyalurkan <strong>1.409,5 kg material</strong> ke mitra industri daur ulang (PT Cirebon Daur Mulya dan CV Berkah Kertas), menghasilkan nilai ekonomi sebesar <strong>Rp4,91 juta</strong> yang memperkuat stabilitas cadangan kas dan likuiditas saldo tabungan nasabah.
            </p>
          </div>

          <div style="background-color: #F8FAF8; border-radius: 8px; padding: 16px; border: 1px solid #E2E8F0;">
            <h4 style="font-size: 0.8rem; font-weight: 600; color: #17201A; margin-bottom: 10px;">Sorotan Kunci & Catatan Perhatian</h4>
            <ul style="font-size: 0.78rem; color: #4B5563; line-height: 1.6; padding-left: 18px; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>Program Berjalan:</strong> "Tantangan RW Bebas Sampah Liar" telah mencapai 62.4% dari target 5.000 kg.</li>
              <li><strong>Perhatian Gudang:</strong> Stok kardus mencapai 780 kg (78% kapasitas). Penjualan batch berikutnya direkomendasikan dalam 5 hari kerja.</li>
              <li><strong>Prioritas Wilayah:</strong> RW 06 Kayuwalang dan RW 12 Bukit Kayuwalang memiliki penetrasi rendah dan memerlukan penjemputan armada roda tiga.</li>
              <li><strong>Dampak Emisi:</strong> Menghindarkan akumulasi 74,4 kg gas rumah kaca (CO2e) setara serapan 3 pohon tahunan.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  const quickDepositBtn = container.querySelector('#dash-quick-deposit');
  if (quickDepositBtn) {
    quickDepositBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('app:open-deposit-modal'));
    });
  }

  // Date filters
  container.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      container.querySelectorAll('[data-filter]').forEach(b => {
        b.style.backgroundColor = 'transparent';
        b.style.color = 'var(--color-text-secondary)';
      });
      e.target.style.backgroundColor = '#F0FDF4';
      e.target.style.color = '#14532D';
      e.target.style.fontWeight = '600';
    });
  });
}
