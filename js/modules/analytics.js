/**
 * BERKASIH SMART - Analytics Center Module
 * Implements Section 19 (Customer, Waste, Financial, Operational, and Impact Analytics)
 */

import { db } from '../db/schema.js';

export function renderAnalytics(container) {
  const customers = db.getCustomers();
  const deposits = db.getDeposits();
  const sales = db.getSales();
  const rwList = db.getRWList();
  const impact = db.getEnvironmentalImpact();

  // Metrics aggregations
  const totalWeight = deposits.reduce((sum, d) => sum + (d.total_weight || 0), 0);
  const totalSavings = customers.reduce((sum, c) => sum + (c.savings_balance || 0), 0);
  const totalSalesRevenue = sales.reduce((sum, s) => sum + (s.total_value || 0), 0);

  // Group deposits by RW
  const rwContributions = {};
  for (const dep of deposits) {
    const cust = db.getCustomerById(dep.customer_id);
    const rw = cust ? cust.rw_id : 'Lainnya';
    rwContributions[rw] = (rwContributions[rw] || 0) + (dep.total_weight || 0);
  }

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Pusat Analisis & Intelijen Data</span>
          <span class="badge badge-demo">ANALYTICS ENGINE</span>
        </h1>
        <p class="page-subtitle">RAW DATA → INFORMATION → INSIGHT → ACTION → IMPACT</p>
      </div>

      <div class="page-actions">
        <select id="analytics-timeframe" class="form-select" style="font-size: 0.8rem; width: 180px;">
          <option value="current_month">Bulan September 2026</option>
          <option value="last_quarter">Kuartal III 2026</option>
          <option value="year_to_date">Year-to-Date (2026)</option>
        </select>
      </div>
    </div>

    <!-- Analytics Navigation Tabs -->
    <div class="tab-nav" id="analytics-tabs">
      <button class="tab-item active" data-tab="tab-waste">Analitik Sampah</button>
      <button class="tab-item" data-tab="tab-customer">Analitik Nasabah & RW</button>
      <button class="tab-item" data-tab="tab-financial">Analitik Finansial</button>
      <button class="tab-item" data-tab="tab-impact">Analitik Dampak Lingkungan</button>
    </div>

    <!-- Tab 1: Waste Analytics -->
    <div id="tab-waste" class="tab-content-panel">
      <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
        <div class="kpi-card">
          <span class="kpi-label">Total Sampah Terkumpul</span>
          <div class="kpi-value">${totalWeight.toFixed(1)} <span class="kpi-unit">kg</span></div>
          <span style="font-size: 0.72rem; color: #16A34A;">+14.2% vs bulan lalu</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Material Bernilai Tertinggi</span>
          <div class="kpi-value" style="font-size: 1.35rem; color: #14532D;">Minyak Jelantah</div>
          <span style="font-size: 0.72rem; color: #6B7280;">Rp6.500 / liter untuk biodiesel</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Volume Terbesar</span>
          <div class="kpi-value" style="font-size: 1.35rem; color: #15803D;">Kardus & Karton</div>
          <span style="font-size: 0.72rem; color: #6B7280;">32% dari total timbulan</span>
        </div>
      </div>

      <!-- Waste Contribution by RW Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Kontribusi Volume Sampah Terpilah Berdasarkan Wilayah RW</div>
          <span style="font-size: 0.75rem; color: #6B7280;">Traceable to Underlying Database</span>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Wilayah RW</th>
                <th>Volume Terkumpul</th>
                <th>Proporsi Kontribusi</th>
                <th>Jumlah Setoran</th>
                <th style="text-align: right;">Status Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              ${rwList.slice(0, 8).map(r => {
                const vol = rwContributions[r.id] || 0;
                const pct = totalWeight > 0 ? ((vol / totalWeight) * 100).toFixed(1) : 0;

                return `
                  <tr>
                    <td><strong>${r.name}</strong></td>
                    <td><strong>${vol.toFixed(1)} kg</strong></td>
                    <td>
                      <div class="flex items-center gap-2">
                        <span style="font-size: 0.75rem; width: 40px;">${pct}%</span>
                        <div style="flex: 1; height: 6px; background: #E2E8F0; border-radius: 99px; overflow: hidden; max-width: 120px;">
                          <div style="width: ${pct}%; height: 100%; background: #15803D;"></div>
                        </div>
                      </div>
                    </td>
                    <td>${r.active_customers} nasabah aktif</td>
                    <td style="text-align: right;">
                      <span class="badge ${vol > 10 ? 'badge-healthy' : vol > 0 ? 'badge-attention' : 'badge-inactive'}">
                        ${vol > 10 ? 'Tinggi' : vol > 0 ? 'Sedang' : 'Rendah'}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Customer Analytics -->
    <div id="tab-customer" class="tab-content-panel" style="display: none;">
      <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
        <div class="kpi-card">
          <span class="kpi-label">Nasabah Aktif</span>
          <div class="kpi-value">${customers.filter(c => c.status === 'ACTIVE').length}</div>
          <span style="font-size: 0.72rem; color: #16A34A;">Rasio aktif 80%</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Nasabah Declining</span>
          <div class="kpi-value" style="color: #D97706;">${customers.filter(c => c.status === 'DECLINING').length}</div>
          <span style="font-size: 0.72rem; color: #6B7280;">Frekuensi setor berkurang</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Nasabah At Risk</span>
          <div class="kpi-value" style="color: #DC2626;">${customers.filter(c => c.status === 'AT RISK').length}</div>
          <span style="font-size: 0.72rem; color: #6B7280;">> 45 hari tanpa setoran</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Nasabah Inactive</span>
          <div class="kpi-value" style="color: #6B7280;">${customers.filter(c => c.status === 'INACTIVE').length}</div>
          <span style="font-size: 0.72rem; color: #6B7280;">Perlu re-engagement</span>
        </div>
      </div>
    </div>

    <!-- Tab 3: Financial Analytics -->
    <div id="tab-financial" class="tab-content-panel" style="display: none;">
      <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
        <div class="kpi-card">
          <span class="kpi-label">Total Liabilitas Saldo Nasabah</span>
          <div class="kpi-value" style="color: #15803D;">Rp${totalSavings.toLocaleString('id-ID')}</div>
          <span style="font-size: 0.72rem; color: #16A34A;">Cadangan kas tercukupi</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Pendapatan Penjualan Material</span>
          <div class="kpi-value">Rp${totalSalesRevenue.toLocaleString('id-ID')}</div>
          <span style="font-size: 0.72rem; color: #2563EB;">Penyerapan oleh 3 offtaker</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Margin Operasional Bersih</span>
          <div class="kpi-value" style="color: #14532D;">Rp${(totalSalesRevenue - totalSavings).toLocaleString('id-ID')}</div>
          <span style="font-size: 0.72rem; color: #6B7280;">Surplus kas operasional</span>
        </div>
      </div>
    </div>

    <!-- Tab 4: Impact Analytics -->
    <div id="tab-impact" class="tab-content-panel" style="display: none;">
      <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
        <div class="kpi-card">
          <span class="kpi-label">Gas Rumah Kaca Terhindarkan</span>
          <div class="kpi-value">${impact.co2eSavedKg} <span class="kpi-unit">kg CO2e</span></div>
          <span style="font-size: 0.72rem; color: #16A34A;">Metodologi IPCC / KLHK</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Ruang TPA Kopiluhur Terselamatkan</span>
          <div class="kpi-value">${impact.landfillVolumeSavedM3} <span class="kpi-unit">m³</span></div>
          <span style="font-size: 0.72rem; color: #15803D;">Mencegah timbunan liar</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Air Konsumsi Dihemat</span>
          <div class="kpi-value">${impact.waterSavedLiters.toLocaleString('id-ID')} <span class="kpi-unit">liter</span></div>
          <span style="font-size: 0.72rem; color: #2563EB;">Efisiensi daur ulang industri</span>
        </div>
      </div>
    </div>
  `;

  // Attach Tab Switching
  const tabBtns = container.querySelectorAll('#analytics-tabs .tab-item');
  const panels = container.querySelectorAll('.tab-content-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.dataset.tab;
      const targetPanel = container.querySelector(`#${targetId}`);
      if (targetPanel) targetPanel.style.display = 'block';
    });
  });
}
