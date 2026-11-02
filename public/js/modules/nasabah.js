/**
 * BERKASIH SMART - Customer CRM Management Module (Nasabah)
 * Implements Section 11 (CRM Table & Filters) & Section 12 (Customer Profile & Milestones)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderNasabah(container) {
  const customers = db.getCustomers();
  const rwList = db.getRWList();

  let filteredCustomers = [...customers];
  let searchFilter = '';
  let rwFilter = 'ALL';
  let statusFilter = 'ALL';

  const applyFilters = () => {
    filteredCustomers = customers.filter(c => {
      const matchSearch = !searchFilter || 
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.customer_code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.phone.includes(searchFilter);

      const matchRW = rwFilter === 'ALL' || c.rw_id === rwFilter;
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;

      return matchSearch && matchRW && matchStatus;
    });
  };

  const renderTableRows = () => {
    if (filteredCustomers.length === 0) {
      return `
        <tr>
          <td colspan="9" style="text-align: center; padding: 32px; color: #6B7280;">
            Tidak ada nasabah yang sesuai dengan kriteria filter.
          </td>
        </tr>
      `;
    }

    return filteredCustomers.map(c => {
      let statusBadge = 'badge-active';
      if (c.status === 'DECLINING') statusBadge = 'badge-declining';
      else if (c.status === 'AT RISK') statusBadge = 'badge-risk';
      else if (c.status === 'INACTIVE') statusBadge = 'badge-inactive';

      return `
        <tr>
          <td>
            <strong>${c.customer_code}</strong>
          </td>
          <td>
            <div style="font-weight: 600; color: #17201A;">${c.name}</div>
            <div style="font-size: 0.72rem; color: #6B7280;">${c.address}</div>
          </td>
          <td>${c.phone}</td>
          <td><span class="badge" style="background: #F1F5F9; color: #334155;">${c.rw_id} • ${c.rt_id}</span></td>
          <td><span class="badge ${statusBadge}">${c.status}</span></td>
          <td><strong>${c.total_weight} kg</strong></td>
          <td><strong style="color: #15803D;">Rp${c.savings_balance.toLocaleString('id-ID')}</strong></td>
          <td style="font-size: 0.75rem; color: #6B7280;">${c.last_deposit_date || 'Belum Ada'}</td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-outline btn-view-profile" data-id="${c.id}" title="Lihat Profil & Jejak Dampak">
              Profil
            </button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const updateTable = () => {
    applyFilters();
    const tbody = container.querySelector('#customers-table-body');
    const countEl = container.querySelector('#nasabah-count-badge');
    if (tbody) tbody.innerHTML = renderTableRows();
    if (countEl) countEl.textContent = `Menampilkan ${filteredCustomers.length} dari ${customers.length} nasabah`;
    attachRowActions();
  };

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Manajemen Nasabah</span>
        </h1>
        <p class="page-subtitle">Sistem CRM komunitas nasabah Bank Sampah BERKASIH di 15 RW Kelurahan Karyamulya.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-add-customer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Daftar Nasabah Baru
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="card" style="margin-bottom: var(--space-5); padding: 14px 20px;">
      <div class="flex items-center gap-4 flex-wrap">
        <!-- Search Input -->
        <div style="flex: 2; min-width: 220px;">
          <input 
            type="text" 
            id="nasabah-search-input" 
            class="form-input" 
            placeholder="Cari nama, ID kode nasabah, nomor HP..." 
          />
        </div>

        <!-- Filter RW -->
        <div style="flex: 1; min-width: 160px;">
          <select id="nasabah-rw-filter" class="form-select">
            <option value="ALL">Semua RW (15 RW Karyamulya)</option>
            ${rwList.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
          </select>
        </div>

        <!-- Filter Status -->
        <div style="flex: 1; min-width: 140px;">
          <select id="nasabah-status-filter" class="form-select">
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">ACTIVE (Aktif)</option>
            <option value="DECLINING">DECLINING (Menurun)</option>
            <option value="AT RISK">AT RISK (Beresiko)</option>
            <option value="INACTIVE">INACTIVE (Tidak Aktif)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Daftar Nasabah Terdaftar</div>
        <span id="nasabah-count-badge" style="font-size: 0.75rem; color: #6B7280;">
          Menampilkan ${filteredCustomers.length} dari ${customers.length} nasabah
        </span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Kode Nasabah</th>
              <th>Nama Lengkap & Alamat</th>
              <th>No. Telepon</th>
              <th>RW / RT</th>
              <th>Status Aktivitas</th>
              <th>Total Sampah</th>
              <th>Saldo Tabungan</th>
              <th>Setor Terakhir</th>
              <th style="text-align: right;">Aksi</th>
            </tr>
          </thead>
          <tbody id="customers-table-body">
            ${renderTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Filter Listeners
  const searchInput = container.querySelector('#nasabah-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchFilter = e.target.value;
      updateTable();
    });
  }

  const rwSelect = container.querySelector('#nasabah-rw-filter');
  if (rwSelect) {
    rwSelect.addEventListener('change', (e) => {
      rwFilter = e.target.value;
      updateTable();
    });
  }

  const statusSelect = container.querySelector('#nasabah-status-filter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      statusFilter = e.target.value;
      updateTable();
    });
  }

  const addCustBtn = container.querySelector('#btn-add-customer');
  if (addCustBtn) {
    addCustBtn.addEventListener('click', () => openAddCustomerModal(() => updateTable()));
  }

  const attachRowActions = () => {
    container.querySelectorAll('.btn-view-profile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const custId = e.currentTarget.dataset.id;
        const customer = db.getCustomerById(custId);
        if (customer) openCustomerProfileModal(customer);
      });
    });
  };

  attachRowActions();
}

/**
 * Add New Customer Modal
 */
function openAddCustomerModal(onSuccess) {
  const rwList = db.getRWList();

  const modalHtml = `
    <form id="add-customer-form">
      <div class="form-group">
        <label class="form-label">Nama Lengkap Nasabah *</label>
        <input type="text" id="cust-name" class="form-input" required placeholder="Contoh: Ibu Rina Wati" />
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Nomor WhatsApp / HP *</label>
          <input type="tel" id="cust-phone" class="form-input" required placeholder="081234567890" />
        </div>

        <div class="form-group">
          <label class="form-label">Wilayah RW *</label>
          <select id="cust-rw" class="form-select" required>
            ${rwList.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">RT *</label>
          <input type="text" id="cust-rt" class="form-input" required value="RT 01" placeholder="RT 01" />
        </div>

        <div class="form-group">
          <label class="form-label">NIK (Opsional & Terenkripsi)</label>
          <input type="text" id="cust-nik" class="form-input" placeholder="Terproteksi privasi (tidak wajib)" />
          <span class="form-hint">Sesuai Prinsip #7: NIK tidak terekspos publik.</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Alamat Lengkap Rumah</label>
        <textarea id="cust-address" class="form-textarea" rows="2" placeholder="Contoh: Jl. Situgangga V No. 18"></textarea>
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" id="cust-cancel-btn">Batal</button>
    <button class="btn btn-primary" id="cust-save-btn">Daftarkan Nasabah</button>
  `;

  const modal = Modal.open({
    title: 'Pendaftaran Nasabah Baru — Bank Sampah BERKASIH',
    content: modalHtml,
    footer: footerHtml,
    size: 'md'
  });

  modal.element.querySelector('#cust-cancel-btn').addEventListener('click', () => modal.close());

  modal.element.querySelector('#cust-save-btn').addEventListener('click', () => {
    const name = modal.element.querySelector('#cust-name').value;
    const phone = modal.element.querySelector('#cust-phone').value;
    const rw_id = modal.element.querySelector('#cust-rw').value;
    const rt_id = modal.element.querySelector('#cust-rt').value;
    const address = modal.element.querySelector('#cust-address').value;

    try {
      db.addCustomer({ name, phone, rw_id, rt_id, address }, auth.getCurrentUser());
      modal.close();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(`Gagal mendaftar: ${err.message}`);
    }
  });
}

/**
 * Customer Profile Modal (Section 12: Customer Performance & Milestones)
 */
export function openCustomerProfileModal(customer) {
  const deposits = db.getDeposits().filter(d => d.customer_id === customer.id);
  const savingsTx = db.getSavingsTransactions().filter(t => t.customer_id === customer.id);

  // Sustainability Milestones (Section 26)
  // 0 kg (Reg) -> 1st dep -> 10 kg -> 25 kg -> 50 kg -> 100 kg
  const weight = customer.total_weight || 0;
  const milestones = [
    { label: 'Pendaftaran', completed: true },
    { label: 'Setoran Perdana', completed: customer.deposit_count > 0 },
    { label: '10 kg', completed: weight >= 10 },
    { label: '25 kg', completed: weight >= 25 },
    { label: '50 kg', completed: weight >= 50 },
    { label: '100 kg', completed: weight >= 100 }
  ];

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <!-- Customer Card Banner -->
      <div style="display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, #14532D, #15803D); color: #FFFFFF; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #FFFFFF; color: #14532D; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800;">
            ${customer.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 style="font-size: 1.2rem; color: #FFFFFF; font-weight: 700; margin-bottom: 2px;">${customer.name}</h2>
            <div style="font-size: 0.78rem; opacity: 0.9;">
              ${customer.customer_code} • ${customer.rw_id} • Bergabung: ${new Date(customer.join_date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </div>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.72rem; opacity: 0.85;">Saldo Tabungan</div>
          <div style="font-size: 1.5rem; font-weight: 800;">Rp${customer.savings_balance.toLocaleString('id-ID')}</div>
          <span class="badge ${customer.status === 'ACTIVE' ? 'badge-healthy' : 'badge-attention'}" style="margin-top: 4px;">
            ${customer.status}
          </span>
        </div>
      </div>

      <!-- Performance Metrics (Section 12) -->
      <div class="grid grid-cols-4" style="gap: 12px; margin-bottom: 20px;">
        <div class="kpi-card" style="padding: 12px;">
          <span class="kpi-label" style="font-size: 0.72rem;">Total Setoran</span>
          <div class="kpi-value" style="font-size: 1.3rem;">${customer.total_weight} <span class="kpi-unit">kg</span></div>
          <span style="font-size: 0.7rem; color: #6B7280;">Diverted from landfill</span>
        </div>
        <div class="kpi-card" style="padding: 12px;">
          <span class="kpi-label" style="font-size: 0.72rem;">Frekuensi Setor</span>
          <div class="kpi-value" style="font-size: 1.3rem;">${customer.deposit_count || deposits.length} <span class="kpi-unit">kali</span></div>
          <span style="font-size: 0.7rem; color: #16A34A;">Rutin tiap bulan</span>
        </div>
        <div class="kpi-card" style="padding: 12px;">
          <span class="kpi-label" style="font-size: 0.72rem;">Rata-rata/Setor</span>
          <div class="kpi-value" style="font-size: 1.3rem;">
            ${customer.deposit_count > 0 ? (customer.total_weight / customer.deposit_count).toFixed(1) : 0} <span class="kpi-unit">kg</span>
          </div>
          <span style="font-size: 0.7rem; color: #6B7280;">Volume rata-rata</span>
        </div>
        <div class="kpi-card" style="padding: 12px;">
          <span class="kpi-label" style="font-size: 0.72rem;">Material Dominan</span>
          <div style="font-weight: 700; font-size: 0.85rem; color: #14532D; margin-top: 6px;">
            ${customer.dominant_waste.split('(')[0]}
          </div>
          <span style="font-size: 0.7rem; color: #6B7280;">Kategori terbanyak</span>
        </div>
      </div>

      <!-- Sustainability Journey Milestones (Section 26) -->
      <div style="background-color: #F8FAF8; border: 1px solid var(--color-border); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 0.8rem; font-weight: 700; color: #14532D; margin-bottom: 12px;">
          🌱 Jejak Keberlanjutan Nasabah (Sustainability Milestones)
        </div>
        <div class="milestone-stepper">
          ${milestones.map((m, idx) => `
            <div class="milestone-node ${m.completed ? 'completed' : ''}">
              <div class="milestone-circle">${m.completed ? '✓' : idx + 1}</div>
              <span class="milestone-label">${m.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recent Deposit History Table -->
      <div>
        <h4 style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">Riwayat Transaksi Setoran Terakhir</h4>
        ${deposits.length > 0 ? `
          <div class="table-container">
            <table class="table" style="font-size: 0.78rem;">
              <thead>
                <tr>
                  <th>No. Struk</th>
                  <th>Waktu</th>
                  <th>Berat</th>
                  <th>Nilai Tabungan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${deposits.map(d => `
                  <tr>
                    <td><strong>${d.id}</strong></td>
                    <td>${new Date(d.transaction_date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</td>
                    <td>${d.total_weight} kg</td>
                    <td><strong style="color: #15803D;">Rp${d.total_value.toLocaleString('id-ID')}</strong></td>
                    <td><span class="badge badge-completed">${d.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div style="text-align: center; padding: 18px; color: #9CA3AF; font-size: 0.8rem;">Belum ada catatan setoran tersimpan.</div>
        `}
      </div>
    </div>
  `;

  Modal.open({
    title: `Profil Nasabah — ${customer.name}`,
    content: contentHtml,
    footer: `<button class="btn btn-primary" onclick="document.getElementById('active-modal-backdrop').remove()">Tutup</button>`,
    size: 'lg'
  });
}
