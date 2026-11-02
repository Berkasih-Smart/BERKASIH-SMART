/**
 * BERKASIH SMART - Waste Deposit Module (Setoran Sampah)
 * Implements Section 13 (Fast 7-step deposit workflow)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';
import { ReceiptGenerator } from '../components/receipt.js';

export function renderSetoran(container) {
  const deposits = db.getDeposits();
  const customers = db.getCustomers();
  const wasteTypes = db.getWasteTypes();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Setoran Sampah</span>
          <span class="badge badge-demo">DEMO DATA</span>
        </h1>
        <p class="page-subtitle">Pencatatan penimbangan, kalkulasi otomatis nilai tabungan, dan penerbitan struk.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-open-deposit-wizard">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Catat Setoran Baru (Cepat)
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
      <div class="kpi-card" style="padding: 16px;">
        <span class="kpi-label">Total Transaksi</span>
        <div class="kpi-value">${deposits.length}</div>
        <span style="font-size: 0.72rem; color: #6B7280;">Semua setoran tercatat</span>
      </div>
      <div class="kpi-card" style="padding: 16px;">
        <span class="kpi-label">Total Berat Terkumpul</span>
        <div class="kpi-value">${deposits.reduce((sum, d) => sum + (d.total_weight || 0), 0).toFixed(1)} <span class="kpi-unit">kg</span></div>
        <span style="font-size: 0.72rem; color: #16A34A;">Tervalidasi timbangan</span>
      </div>
      <div class="kpi-card" style="padding: 16px;">
        <span class="kpi-label">Nilai Tabungan Dihasilkan</span>
        <div class="kpi-value" style="font-size: 1.5rem;">Rp${deposits.reduce((sum, d) => sum + (d.total_value || 0), 0).toLocaleString('id-ID')}</div>
        <span style="font-size: 0.72rem; color: #2563EB;">Masuk saldo nasabah</span>
      </div>
      <div class="kpi-card" style="padding: 16px;">
        <span class="kpi-label">Rata-rata Setoran</span>
        <div class="kpi-value">
          ${deposits.length > 0 ? (deposits.reduce((sum, d) => sum + (d.total_weight || 0), 0) / deposits.length).toFixed(1) : 0} 
          <span class="kpi-unit">kg / tx</span>
        </div>
        <span style="font-size: 0.72rem; color: #6B7280;">Efisiensi logistik tinggi</span>
      </div>
    </div>

    <!-- Deposit Transaction Table -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <input 
            type="text" 
            id="deposit-search-input" 
            class="form-input" 
            placeholder="Cari ID transaksi, nama nasabah..." 
            style="width: 280px; padding: 6px 12px; font-size: 0.8rem;"
          />
        </div>
        <span style="font-size: 0.75rem; color: #6B7280;">Menampilkan ${deposits.length} transaksi</span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Setoran</th>
              <th>Waktu</th>
              <th>Nasabah</th>
              <th>Rincian Material</th>
              <th>Total Berat</th>
              <th>Nilai Tabungan</th>
              <th>Status</th>
              <th style="text-align: right;">Aksi</th>
            </tr>
          </thead>
          <tbody id="deposits-table-body">
            ${deposits.map(d => {
              const customer = db.getCustomerById(d.customer_id);
              const itemsSummary = d.details && Array.isArray(d.details)
                ? d.details.map(item => `${item.waste_name.split('(')[0].trim()} (${item.weight} kg)`).join(', ')
                : 'Material terpilah';

              return `
                <tr>
                  <td>
                    <strong>${d.id}</strong>
                    ${d.isDemo ? '<span class="badge badge-demo" style="margin-left: 4px; font-size: 0.6rem;">DEMO</span>' : '<span class="badge badge-live" style="margin-left: 4px; font-size: 0.6rem;">LIVE</span>'}
                  </td>
                  <td>${new Date(d.transaction_date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>
                    <div style="font-weight: 600;">${d.customer_name || customer?.name || 'Nasabah'}</div>
                    <div style="font-size: 0.7rem; color: #6B7280;">${customer ? `${customer.rw_id} • ${customer.phone}` : ''}</div>
                  </td>
                  <td style="max-width: 220px; font-size: 0.76rem; color: #4B5563;">${itemsSummary}</td>
                  <td><strong>${d.total_weight} kg</strong></td>
                  <td><strong style="color: #15803D;">Rp${d.total_value.toLocaleString('id-ID')}</strong></td>
                  <td><span class="badge badge-completed">${d.status}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-sm btn-outline btn-print-receipt" data-id="${d.id}" title="Cetak Struk Digital">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                      </svg>
                      Struk
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Open Wizard Listener
  const openWizardBtn = container.querySelector('#btn-open-deposit-wizard');
  if (openWizardBtn) {
    openWizardBtn.addEventListener('click', () => openDepositWizard());
  }

  // Print Receipt Button Listeners
  container.querySelectorAll('.btn-print-receipt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const depId = e.currentTarget.dataset.id;
      const dep = deposits.find(d => d.id === depId);
      if (dep) ReceiptGenerator.showReceipt(dep);
    });
  });

  // Listen to Global Open Deposit Modal Event (triggered from Header or Dashboard)
  window.addEventListener('berkasih:open-deposit-modal', () => {
    openDepositWizard();
  });
}

/**
 * 7-Step High-Speed Waste Deposit Wizard Modal
 */
export function openDepositWizard() {
  const customers = db.getCustomers();
  const wasteTypes = db.getWasteTypes();
  const servicePoints = db.getServicePoints();

  let selectedCustomerId = customers[0]?.id || '';
  let items = [
    { waste_type_id: wasteTypes[0]?.id || 'WST-001', weight: 1.0, price_per_kg: wasteTypes[0]?.current_price_per_kg || 3500 }
  ];

  const renderItemsRows = () => {
    return items.map((item, idx) => {
      const wt = wasteTypes.find(w => w.id === item.waste_type_id) || wasteTypes[0];
      const subtotal = Math.round((parseFloat(item.weight) || 0) * (parseFloat(item.price_per_kg) || 0));

      return `
        <div class="deposit-item-row" data-idx="${idx}" style="display: flex; gap: 8px; align-items: flex-end; margin-bottom: 10px; background: #F9FAFB; padding: 10px; border-radius: 8px; border: 1px solid var(--color-border);">
          <div style="flex: 2;">
            <label class="form-hint" style="font-weight: 600; margin-bottom: 3px; display: block;">Jenis Sampah</label>
            <select class="form-select item-waste-type" data-idx="${idx}" style="font-size: 0.8rem; padding: 6px 8px;">
              ${wasteTypes.map(w => `
                <option value="${w.id}" ${w.id === item.waste_type_id ? 'selected' : ''}>
                  ${w.category}: ${w.name.split('(')[0]} (Rp${w.current_price_per_kg}/kg)
                </option>
              `).join('')}
            </select>
          </div>

          <div style="flex: 1;">
            <label class="form-hint" style="font-weight: 600; margin-bottom: 3px; display: block;">Berat (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              min="0.1" 
              class="form-input item-weight" 
              data-idx="${idx}" 
              value="${item.weight}" 
              style="font-size: 0.8rem; padding: 6px 8px;"
            />
          </div>

          <div style="flex: 1;">
            <label class="form-hint" style="font-weight: 600; margin-bottom: 3px; display: block;">Harga/kg</label>
            <input 
              type="number" 
              class="form-input item-price" 
              data-idx="${idx}" 
              value="${item.price_per_kg}" 
              style="font-size: 0.8rem; padding: 6px 8px;"
            />
          </div>

          <div style="width: 100px; text-align: right; padding-bottom: 8px;">
            <div class="form-hint" style="font-size: 0.68rem;">Subtotal</div>
            <strong style="color: #15803D; font-size: 0.82rem;">Rp${subtotal.toLocaleString('id-ID')}</strong>
          </div>

          ${items.length > 1 ? `
            <button type="button" class="btn-icon btn-remove-item" data-idx="${idx}" title="Hapus Baris" style="color: #DC2626; padding: 6px;">
              ✕
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  };

  const calculateGrandTotal = () => {
    let totalWeight = 0;
    let totalValue = 0;
    items.forEach(it => {
      const w = parseFloat(it.weight) || 0;
      const p = parseFloat(it.price_per_kg) || 0;
      totalWeight += w;
      totalValue += Math.round(w * p);
    });
    return { totalWeight: totalWeight.toFixed(2), totalValue };
  };

  const modalHtml = `
    <form id="deposit-wizard-form">
      <!-- Step 1: Customer Lookup -->
      <div class="form-group">
        <label class="form-label">
          <span>1. Pilih Nasabah (Pencarian Nama / Nomor HP / RW)</span>
          <span style="font-size: 0.72rem; color: #15803D; font-weight: 600;">Simulasi Scan QR Aktif</span>
        </label>
        <select id="wizard-customer-id" class="form-select" style="font-weight: 600; color: #14532D;">
          ${customers.map(c => `
            <option value="${c.id}" ${c.id === selectedCustomerId ? 'selected' : ''}>
              ${c.name} (${c.customer_code}) • ${c.rw_id} • Saldo: Rp${c.savings_balance.toLocaleString('id-ID')}
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Service Point Selection -->
      <div class="form-group">
        <label class="form-label">Titik Loket Setoran</label>
        <select id="wizard-service-point-id" class="form-select" style="font-size: 0.8rem;">
          ${servicePoints.map(sp => `
            <option value="${sp.id}">${sp.name} (${sp.address})</option>
          `).join('')}
        </select>
      </div>

      <!-- Step 2-5: Items List -->
      <div style="margin-bottom: 12px;">
        <div class="flex justify-between items-center" style="margin-bottom: 8px;">
          <label class="form-label" style="margin-bottom: 0;">2. Jenis & Penimbangan Sampah</label>
          <button type="button" class="btn btn-sm btn-outline" id="btn-add-waste-item">
            + Tambah Jenis Sampah
          </button>
        </div>
        <div id="items-container">
          ${renderItemsRows()}
        </div>
      </div>

      <!-- Verification & Totals Summary (Step 6) -->
      <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
        <div class="flex justify-between items-center" style="margin-bottom: 4px;">
          <span style="font-size: 0.8rem; color: #166534; font-weight: 600;">Total Berat Terverifikasi:</span>
          <strong id="summary-total-weight" style="font-size: 0.95rem; color: #14532D;">${calculateGrandTotal().totalWeight} kg</strong>
        </div>
        <div class="flex justify-between items-center">
          <span style="font-size: 0.85rem; color: #166534; font-weight: 700;">TOTAL NILAI TABUNGAN:</span>
          <strong id="summary-total-value" style="font-size: 1.25rem; color: #15803D;">Rp${calculateGrandTotal().totalValue.toLocaleString('id-ID')}</strong>
        </div>
        <div style="font-size: 0.7rem; color: #4B5563; margin-top: 6px; line-height: 1.4;">
          * Saldo nasabah akan langsung bertambah dan stok gudang otomatis diperbarui secara atomik.
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Operasional (Opsional)</label>
        <input type="text" id="wizard-notes" class="form-input" placeholder="Contoh: Wadah bersih terpilah, titipan RT 02" />
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="wizard-cancel-btn">Batal</button>
    <button type="button" class="btn btn-primary" id="wizard-submit-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Konfirmasi & Cetak Struk (Langkah 7)
    </button>
  `;

  const modal = Modal.open({
    title: 'Input Setoran Sampah (Operasi Cepat Loket)',
    content: modalHtml,
    footer: footerHtml,
    size: 'lg'
  });

  const updateUI = () => {
    const containerEl = modal.element.querySelector('#items-container');
    if (containerEl) {
      containerEl.innerHTML = renderItemsRows();
      attachRowListeners();
    }
    const { totalWeight, totalValue } = calculateGrandTotal();
    const twEl = modal.element.querySelector('#summary-total-weight');
    const tvEl = modal.element.querySelector('#summary-total-value');
    if (twEl) twEl.textContent = `${totalWeight} kg`;
    if (tvEl) tvEl.textContent = `Rp${totalValue.toLocaleString('id-ID')}`;
  };

  const attachRowListeners = () => {
    modal.element.querySelectorAll('.item-waste-type').forEach(select => {
      select.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        const wt = wasteTypes.find(w => w.id === e.target.value);
        if (wt && items[idx]) {
          items[idx].waste_type_id = wt.id;
          items[idx].price_per_kg = wt.current_price_per_kg;
          updateUI();
        }
      });
    });

    modal.element.querySelectorAll('.item-weight').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        if (items[idx]) {
          items[idx].weight = parseFloat(e.target.value) || 0;
          const { totalWeight, totalValue } = calculateGrandTotal();
          const twEl = modal.element.querySelector('#summary-total-weight');
          const tvEl = modal.element.querySelector('#summary-total-value');
          if (twEl) twEl.textContent = `${totalWeight} kg`;
          if (tvEl) tvEl.textContent = `Rp${totalValue.toLocaleString('id-ID')}`;
        }
      });
    });

    modal.element.querySelectorAll('.item-price').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        if (items[idx]) {
          items[idx].price_per_kg = parseFloat(e.target.value) || 0;
          const { totalWeight, totalValue } = calculateGrandTotal();
          const tvEl = modal.element.querySelector('#summary-total-value');
          if (tvEl) tvEl.textContent = `Rp${totalValue.toLocaleString('id-ID')}`;
        }
      });
    });

    modal.element.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        if (items.length > 1) {
          items.splice(idx, 1);
          updateUI();
        }
      });
    });
  };

  attachRowListeners();

  const addBtn = modal.element.querySelector('#btn-add-waste-item');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      items.push({
        waste_type_id: wasteTypes[0].id,
        weight: 1.0,
        price_per_kg: wasteTypes[0].current_price_per_kg
      });
      updateUI();
    });
  }

  const cancelBtn = modal.element.querySelector('#wizard-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => modal.close());
  }

  const submitBtn = modal.element.querySelector('#wizard-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      try {
        const custSelect = modal.element.querySelector('#wizard-customer-id');
        const spSelect = modal.element.querySelector('#wizard-service-point-id');
        const notesInput = modal.element.querySelector('#wizard-notes');

        const payload = {
          customer_id: custSelect.value,
          service_point_id: spSelect.value,
          notes: notesInput.value,
          items: items
        };

        const newDeposit = db.createDeposit(payload, auth.getCurrentUser());
        modal.close();

        // Immediately Show Thermal Printable Receipt!
        setTimeout(() => {
          ReceiptGenerator.showReceipt(newDeposit);
        }, 250);
      } catch (err) {
        alert(`Gagal menyimpan setoran: ${err.message}`);
      }
    });
  }
}
