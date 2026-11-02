/**
 * BERKASIH SMART - Inventory Management Module (Inventori Sampah)
 * Implements Section 15 (Stock Levels, Thresholds, Sales Recording) & Section 64 (Inventory Consistency)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderInventori(container) {
  const inventory = db.getInventory();
  const sales = db.getSales();
  const partners = db.getPartners();

  const totalStockKg = inventory.reduce((sum, i) => sum + (i.current_stock || 0), 0);
  const totalCapacityKg = inventory.reduce((sum, i) => sum + (i.max_capacity || 0), 0);
  const utilizationPercent = Math.round((totalStockKg / Math.max(1, totalCapacityKg)) * 100);

  const highStockCount = inventory.filter(i => i.status === 'High Stock' || i.status === 'Critical').length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Inventori Sampah Gudang</span>
        </h1>
        <p class="page-subtitle">Monitoring stok material terpilah, ambang batas kapasitas, dan penyaluran ke mitra daur ulang.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-open-sale-modal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Catat Penjualan ke Mitra (Outflow)
        </button>
      </div>
    </div>

    <!-- Inventory KPIs -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
      <div class="kpi-card">
        <span class="kpi-label">Total Stok Fisik Gudang</span>
        <div class="kpi-value">${totalStockKg.toFixed(1)} <span class="kpi-unit">kg</span></div>
        <span style="font-size: 0.72rem; color: #16A34A;">Kapasitas Maksimal: ${totalCapacityKg} kg</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Tingkat Okupansi Ruang</span>
        <div class="kpi-value" style="color: ${utilizationPercent > 75 ? '#D97706' : '#15803D'};">
          ${utilizationPercent}%
        </div>
        <span style="font-size: 0.72rem; color: #6B7280;">Batas aman maksimum 85%</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Peringatan Kapasitas</span>
        <div class="kpi-value" style="color: ${highStockCount > 0 ? '#DC2626' : '#16A34A'};">
          ${highStockCount} Material
        </div>
        <span style="font-size: 0.72rem; color: #6B7280;">Status High Stock / Critical</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Total Penjualan ke Mitra</span>
        <div class="kpi-value">${sales.reduce((sum, s) => sum + (s.total_weight || 0), 0).toFixed(1)} <span class="kpi-unit">kg</span></div>
        <span style="font-size: 0.72rem; color: #2563EB;">Tersalurkan ke rantai daur ulang</span>
      </div>
    </div>

    <!-- Inventory Stock Table -->
    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <div class="card-title">Status Stok Fisik per Jenis Sampah</div>
        <span style="font-size: 0.75rem; color: #6B7280;">Opening Stock + Incoming - Outgoing = Current Stock</span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Jenis Material</th>
              <th>Stok Tersedia</th>
              <th>Akumulasi Masuk</th>
              <th>Tersalurkan (Keluar)</th>
              <th>Ambang Batas Gudang</th>
              <th>Status Gudang</th>
              <th style="text-align: right;">Kapasitas</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => {
              let badge = 'badge-healthy';
              if (item.status === 'Attention') badge = 'badge-attention';
              else if (item.status === 'High Stock') badge = 'badge-declining';
              else if (item.status === 'Critical') badge = 'badge-risk';

              const fillPercent = Math.min(100, Math.round((item.current_stock / item.max_capacity) * 100));

              return `
                <tr>
                  <td>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.7rem; color: #6B7280;">Kode: ${item.waste_type_id}</div>
                  </td>
                  <td><strong style="font-size: 0.95rem; color: #17201A;">${item.current_stock} kg</strong></td>
                  <td style="color: #16A34A;">+${item.incoming_total} kg</td>
                  <td style="color: #475569;">-${item.outgoing_total} kg</td>
                  <td style="font-size: 0.75rem; color: #6B7280;">Min: ${item.min_threshold} kg | Max: ${item.max_capacity} kg</td>
                  <td><span class="badge ${badge}">${item.status}</span></td>
                  <td style="text-align: right; width: 140px;">
                    <div style="font-size: 0.72rem; font-weight: 600; margin-bottom: 2px;">${fillPercent}%</div>
                    <div style="width: 100%; height: 6px; background-color: #E2E8F0; border-radius: 999px; overflow: hidden;">
                      <div style="width: ${fillPercent}%; height: 100%; background-color: ${fillPercent > 80 ? '#DC2626' : fillPercent > 65 ? '#D97706' : '#16A34A'};"></div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Sales to Recyclers -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Riwayat Penjualan Material ke Mitra Offtaker (Downstream)</div>
        <span style="font-size: 0.75rem; color: #6B7280;">Jejak Sirkularitas Terverifikasi</span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>No. Invoice Penjualan</th>
              <th>Tanggal</th>
              <th>Mitra Pembeli</th>
              <th>Total Berat</th>
              <th>Nilai Penjualan</th>
              <th>Status Bayar</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(s => `
              <tr>
                <td><code>${s.reference_invoice || s.id}</code></td>
                <td>${s.sale_date}</td>
                <td><strong>${s.partner_name}</strong></td>
                <td><strong>${s.total_weight} kg</strong></td>
                <td><strong style="color: #15803D;">Rp${s.total_value.toLocaleString('id-ID')}</strong></td>
                <td><span class="badge badge-completed">${s.payment_status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Sale Modal Listener
  const saleBtn = container.querySelector('#btn-open-sale-modal');
  if (saleBtn) {
    saleBtn.addEventListener('click', () => {
      openRecordSaleModal(() => renderInventori(container));
    });
  }
}

/**
 * Record Sale to Recycler Partner Modal
 */
function openRecordSaleModal(onSuccess) {
  const inventory = db.getInventory().filter(i => i.current_stock > 0);
  const partners = db.getPartners();

  if (inventory.length === 0) {
    alert('Tidak ada stok barang yang tersedia untuk dijual.');
    return;
  }

  const modalHtml = `
    <form id="sale-form">
      <div class="form-group">
        <label class="form-label">Pilih Mitra Pembeli (Offtaker)</label>
        <select id="sale-partner-id" class="form-select">
          ${partners.map(p => `
            <option value="${p.id}">${p.name} (${p.category})</option>
          `).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Material yang Dijual</label>
        <select id="sale-waste-type" class="form-select">
          ${inventory.map(i => `
            <option value="${i.waste_type_id}">
              ${i.name} (Tersedia: ${i.current_stock} kg)
            </option>
          `).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Kuantitas Dijual (kg) *</label>
          <input type="number" id="sale-quantity" class="form-input" min="1" step="0.5" placeholder="Contoh: 200" required />
        </div>

        <div class="form-group">
          <label class="form-label">Harga Kesepakatan per kg (Rp) *</label>
          <input type="number" id="sale-price" class="form-input" min="100" placeholder="Contoh: 4200" required />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nomor Invoice / Bukti Timbang Pabrik</label>
        <input type="text" id="sale-invoice" class="form-input" placeholder="INV-2026-XXXX" />
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" id="sale-cancel-btn">Batal</button>
    <button class="btn btn-primary" id="sale-submit-btn">Simpan & Kurangi Stok</button>
  `;

  const modal = Modal.open({
    title: 'Catat Penjualan Material ke Mitra Offtaker',
    content: modalHtml,
    footer: footerHtml,
    size: 'md'
  });

  modal.element.querySelector('#sale-cancel-btn').addEventListener('click', () => modal.close());

  modal.element.querySelector('#sale-submit-btn').addEventListener('click', () => {
    const partnerId = modal.element.querySelector('#sale-partner-id').value;
    const wasteTypeId = modal.element.querySelector('#sale-waste-type').value;
    const qty = parseFloat(modal.element.querySelector('#sale-quantity').value);
    const price = parseFloat(modal.element.querySelector('#sale-price').value);
    const invoice = modal.element.querySelector('#sale-invoice').value;

    try {
      db.recordSaleToPartner({
        partner_id: partnerId,
        reference_invoice: invoice,
        items: [
          { waste_type_id: wasteTypeId, quantity: qty, price: price }
        ]
      }, auth.getCurrentUser());

      modal.close();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(`Gagal mencatat penjualan: ${err.message}`);
    }
  });
}
