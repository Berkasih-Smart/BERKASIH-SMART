/**
 * BERKASIH SMART - Circularity Module (BERKASIH CIRCULARITY)
 * Implements Section 27 (Digital Traceability of Material Movement from Household to Industry)
 */

import { db } from '../db/schema.js';

export function renderCircularity(container) {
  const sales = db.getSales();
  const inventory = db.getInventory();
  const partners = db.getPartners();

  const totalDivertedKg = sales.reduce((sum, s) => sum + (s.total_weight || 0), 0) + inventory.reduce((sum, i) => sum + (i.current_stock || 0), 0);
  const totalEconomicValue = sales.reduce((sum, s) => sum + (s.total_value || 0), 0);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>BERKASIH CIRCULARITY</span>
          <span class="badge badge-demo">MATERIAL TRACEABILITY</span>
        </h1>
        <p class="page-subtitle">Jejak digital aliran material dari rumah tangga nasabah hingga industri pemulihan sekunder.</p>
      </div>

      <div class="page-actions">
        <span class="badge badge-healthy" style="font-size: 0.75rem;">
          Jejak Rantai Pasok Terverifikasi
        </span>
      </div>
    </div>

    <!-- 1. SIGNATURE VISUAL PIPELINE FLOW (Section 27) -->
    <div class="circularity-pipeline">
      <!-- Step 1: Household -->
      <div class="flow-step">
        <div class="flow-icon">🏠</div>
        <div class="flow-title">1. RUMAH TANGGA</div>
        <div class="flow-sub">Warga 15 RW Karyamulya memilah sampah harian</div>
      </div>

      <div class="flow-connector">➔</div>

      <!-- Step 2: Bank Sampah -->
      <div class="flow-step">
        <div class="flow-icon">♻️</div>
        <div class="flow-title">2. BANK SAMPAH</div>
        <div class="flow-sub">Penimbangan di Pos Pusat & Jemput Viar</div>
      </div>

      <div class="flow-connector">➔</div>

      <!-- Step 3: Sorting -->
      <div class="flow-step">
        <div class="flow-icon">⚖️</div>
        <div class="flow-title">3. SORTING</div>
        <div class="flow-sub">Pemisahan 10 kategori (PET, PP, Kardus, Jelantah)</div>
      </div>

      <div class="flow-connector">➔</div>

      <!-- Step 4: Processing -->
      <div class="flow-step">
        <div class="flow-icon">📦</div>
        <div class="flow-title">4. PROCESSING</div>
        <div class="flow-sub">Pengepresan bal kardus & filtrasi jelantah</div>
      </div>

      <div class="flow-connector">➔</div>

      <!-- Step 5: Partner / Recycler -->
      <div class="flow-step">
        <div class="flow-icon">🏭</div>
        <div class="flow-title">5. PARTNER / OFFTAKER</div>
        <div class="flow-sub">Pabrik Daur Ulang Lemahwungkuk & Pelabuhan</div>
      </div>

      <div class="flow-connector">➔</div>

      <!-- Step 6: Recovered Material -->
      <div class="flow-step">
        <div class="flow-icon">✨</div>
        <div class="flow-title">6. MATERIAL PULIH</div>
        <div class="flow-sub">Flakes PET, Biji Plastik, Pulp, Biodiesel B35</div>
      </div>

      <div class="flow-connector">➔</div>

      <!-- Step 7: Economic Value -->
      <div class="flow-step">
        <div class="flow-icon" style="border-color: #D97706; color: #D97706;">💰</div>
        <div class="flow-title">7. NILAI EKONOMI</div>
        <div class="flow-sub">Tabungan nasabah & kas operasional berkelanjutan</div>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
      <div class="kpi-card">
        <span class="kpi-label">Total Material Masuk Siklus</span>
        <div class="kpi-value">${totalDivertedKg.toFixed(1)} <span class="kpi-unit">kg</span></div>
        <span style="font-size: 0.72rem; color: #16A34A;">Terselamatkan dari TPA Kopiluhur</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Mitra Industri Terhubung</span>
        <div class="kpi-value">${partners.length} <span class="kpi-unit">offtaker</span></div>
        <span style="font-size: 0.72rem; color: #2563EB;">Kontrak penyerapan aktif</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Nilai Sirkularitas Ekonomi</span>
        <div class="kpi-value" style="color: #15803D;">Rp${totalEconomicValue.toLocaleString('id-ID')}</div>
        <span style="font-size: 0.72rem; color: #6B7280;">Realisasi penjualan material daur ulang</span>
      </div>
    </div>

    <!-- Traceability Table: Downstream Destination -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Tabel Rantai Pasok Hilirisasi Material (Downstream Traceability)</div>
        <span style="font-size: 0.75rem; color: #6B7280;">Buku Jejak Digital Material Terjual</span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Batch Penjualan</th>
              <th>Material & Kuantitas</th>
              <th>Mitra Penerima (Offtaker)</th>
              <th>Hasil Hilirisasi Produk</th>
              <th>Nilai Penyerapan</th>
              <th>Status Pemulihan</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(s => {
              const partner = partners.find(p => p.id === s.partner_id);

              return `
                <tr>
                  <td>
                    <strong>${s.reference_invoice || s.id}</strong>
                    <div style="font-size: 0.7rem; color: #6B7280;">${s.sale_date}</div>
                  </td>
                  <td>
                    <strong>${s.total_weight} kg</strong>
                    <div style="font-size: 0.7rem; color: #4B5563;">
                      ${s.items ? s.items.map(it => `${db.getWasteTypeById(it.waste_type_id)?.name || 'Material'}`).join(', ') : 'Material Terpilah'}
                    </div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${s.partner_name}</div>
                    <div style="font-size: 0.7rem; color: #6B7280;">${partner?.category || 'Offtaker'} • ${partner?.location || ''}</div>
                  </td>
                  <td>
                    <span class="badge" style="background: #F0FDF4; color: #166534; font-size: 0.75rem; border: 1px solid #BBF7D0;">
                      ${partner?.circularity_destination || 'Biji Plastik / Flakes Daur Ulang'}
                    </span>
                  </td>
                  <td><strong style="color: #15803D;">Rp${s.total_value.toLocaleString('id-ID')}</strong></td>
                  <td><span class="badge badge-completed">100% RECOVERED</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
