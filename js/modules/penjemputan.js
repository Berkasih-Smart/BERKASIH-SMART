/**
 * BERKASIH SMART - Waste Pickup Operations Module (Penjemputan)
 * Implements Section 30 (Customer Pickup Requests, Routing & Operator Dispatch)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderPenjemputan(container) {
  const pickups = db.getPickups();
  const scheduledCount = pickups.filter(p => p.status === 'Scheduled').length;
  const assignedCount = pickups.filter(p => p.status === 'Assigned').length;
  const requestedCount = pickups.filter(p => p.status === 'Requested').length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Manajemen Penjemputan Sampah</span>
          <span class="badge badge-demo">DEMO DATA</span>
        </h1>
        <p class="page-subtitle">Penjadwalan armada motor roda tiga untuk jemput sampah terpilah langsung dari rumah warga.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-request-pickup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Jadwalkan Jemput Baru
        </button>
      </div>
    </div>

    <!-- Status Summary -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
      <div class="kpi-card">
        <span class="kpi-label">Menunggu Verifikasi</span>
        <div class="kpi-value" style="color: ${requestedCount > 0 ? '#D97706' : '#16A34A'};">${requestedCount}</div>
        <span style="font-size: 0.72rem; color: #6B7280;">Permintaan baru dari warga</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Terjadwal Pekan Ini</span>
        <div class="kpi-value">${scheduledCount}</div>
        <span style="font-size: 0.72rem; color: #2563EB;">Sudah ditetapkan tanggal</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Armada Ditugaskan</span>
        <div class="kpi-value">${assignedCount}</div>
        <span style="font-size: 0.72rem; color: #16A34A;">Motor Roda Tiga Viar siap jalan</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Estimasi Timbulan</span>
        <div class="kpi-value">
          ${pickups.reduce((sum, p) => sum + (p.estimated_weight || 0), 0)} <span class="kpi-unit">kg</span>
        </div>
        <span style="font-size: 0.72rem; color: #6B7280;">Beban angkut terencana</span>
      </div>
    </div>

    <!-- Pickup Task Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Daftar Antrean & Rute Penjemputan</div>
        <span style="font-size: 0.75rem; color: #6B7280;">Alur: Requested → Scheduled → Assigned → Picked Up → Completed</span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Jemput</th>
              <th>Nasabah & Kontak</th>
              <th>Lokasi Alamat</th>
              <th>Perkiraan Sampah</th>
              <th>Jadwal Penjemputan</th>
              <th>Petugas Armada</th>
              <th>Status</th>
              <th style="text-align: right;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${pickups.map(p => {
              let badge = 'badge-active';
              if (p.status === 'Requested') badge = 'badge-declining';
              else if (p.status === 'Scheduled') badge = 'badge-attention';
              else if (p.status === 'Assigned') badge = 'badge-info';

              return `
                <tr>
                  <td><strong>${p.id}</strong></td>
                  <td>
                    <strong>${p.customer_name}</strong>
                    <div style="font-size: 0.7rem; color: #6B7280;">${p.phone}</div>
                  </td>
                  <td>
                    <div style="font-size: 0.8rem;">${p.address}</div>
                    <span class="badge" style="font-size: 0.65rem; background: #F1F5F9; color: #334155;">${p.rw}</span>
                  </td>
                  <td>
                    <strong>${p.estimated_weight} kg</strong>
                    <div style="font-size: 0.7rem; color: #6B7280;">${p.waste_types.join(', ')}</div>
                  </td>
                  <td>
                    ${p.scheduled_date ? new Date(p.scheduled_date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '<span style="color: #9CA3AF;">Belum dijadwalkan</span>'}
                  </td>
                  <td>
                    ${p.assigned_operator ? `<strong>${p.assigned_operator}</strong><div style="font-size: 0.68rem; color: #6B7280;">${p.vehicle || ''}</div>` : '<span style="color: #9CA3AF;">Belum ditugaskan</span>'}
                  </td>
                  <td><span class="badge ${badge}">${p.status}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-sm btn-outline btn-update-pickup" data-id="${p.id}">
                      Ubah Status
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

  // Attach Listeners
  const reqBtn = container.querySelector('#btn-request-pickup');
  if (reqBtn) {
    reqBtn.addEventListener('click', () => {
      openNewPickupModal(() => renderPenjemputan(container));
    });
  }

  container.querySelectorAll('.btn-update-pickup').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pId = e.currentTarget.dataset.id;
      const pickup = pickups.find(p => p.id === pId);
      if (pickup) openUpdatePickupStatusModal(pickup, () => renderPenjemputan(container));
    });
  });
}

function openNewPickupModal(onSuccess) {
  const customers = db.getCustomers();

  const modalHtml = `
    <form id="new-pickup-form">
      <div class="form-group">
        <label class="form-label">Pilih Nasabah *</label>
        <select id="pkp-cust-id" class="form-select">
          ${customers.map(c => `
            <option value="${c.id}">${c.name} (${c.customer_code}) • ${c.rw_id}</option>
          `).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Estimasi Berat Sampah (kg) *</label>
          <input type="number" id="pkp-weight" class="form-input" min="2" step="1" value="10" required />
        </div>

        <div class="form-group">
          <label class="form-label">Tanggal Jemput Yang Diharapkan *</label>
          <input type="date" id="pkp-date" class="form-input" required value="${new Date().toISOString().slice(0, 10)}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Jenis Sampah Utama</label>
        <input type="text" id="pkp-types" class="form-input" value="Kardus, Botol Plastik" placeholder="Contoh: Kardus, Minyak Jelantah" />
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Tambahan (Patokan Rumah / Lokasi Sampah)</label>
        <textarea id="pkp-notes" class="form-textarea" rows="2" placeholder="Contoh: Karung sudah di depan pagar, dekat pos satpam."></textarea>
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" id="pkp-cancel-btn">Batal</button>
    <button class="btn btn-primary" id="pkp-submit-btn">Kirim Permintaan Jemput</button>
  `;

  const modal = Modal.open({
    title: 'Jadwalkan Penjemputan Sampah ke Rumah',
    content: modalHtml,
    footer: footerHtml,
    size: 'md'
  });

  modal.element.querySelector('#pkp-cancel-btn').addEventListener('click', () => modal.close());

  modal.element.querySelector('#pkp-submit-btn').addEventListener('click', () => {
    const custId = modal.element.querySelector('#pkp-cust-id').value;
    const cust = db.getCustomerById(custId);
    const weight = parseFloat(modal.element.querySelector('#pkp-weight').value) || 5;
    const date = modal.element.querySelector('#pkp-date').value;
    const types = modal.element.querySelector('#pkp-types').value.split(',').map(s => s.trim());
    const notes = modal.element.querySelector('#pkp-notes').value;

    const newPickup = {
      id: `PKP-${String(db.getPickups().length + 1).padStart(3, '0')}`,
      customer_id: cust.id,
      customer_name: cust.name,
      phone: cust.phone,
      address: cust.address,
      rw: cust.rw_id,
      lat: cust.lat,
      lng: cust.lng,
      estimated_weight: weight,
      waste_types: types,
      requested_date: new Date().toISOString(),
      scheduled_date: `${date}T09:00:00Z`,
      assigned_operator: 'Rian Prasetyo',
      vehicle: 'Motor Roda Tiga Viar No. 2',
      status: 'Scheduled',
      notes: notes,
      isDemo: false
    };

    db.getPickups().unshift(newPickup);
    db.logAudit(auth.getCurrentUser(), 'CREATE_PICKUP', 'PICKUPS', newPickup.id, 'N/A', `Scheduled for ${cust.name}`);
    modal.close();
    if (onSuccess) onSuccess();
  });
}

function openUpdatePickupStatusModal(pickup, onSuccess) {
  const modalHtml = `
    <div style="font-size: 0.85rem; line-height: 1.6; margin-bottom: 16px;">
      <div>Nasabah: <strong>${pickup.customer_name}</strong> (${pickup.rw})</div>
      <div>Estimasi: <strong>${pickup.estimated_weight} kg</strong> (${pickup.waste_types.join(', ')})</div>
      <div style="margin-top: 12px;">
        <label class="form-label">Pilih Status Baru:</label>
        <select id="pickup-new-status" class="form-select">
          <option value="Requested" ${pickup.status === 'Requested' ? 'selected' : ''}>Requested (Baru)</option>
          <option value="Scheduled" ${pickup.status === 'Scheduled' ? 'selected' : ''}>Scheduled (Terjadwal)</option>
          <option value="Assigned" ${pickup.status === 'Assigned' ? 'selected' : ''}>Assigned (Armada Meluncur)</option>
          <option value="Picked Up" ${pickup.status === 'Picked Up' ? 'selected' : ''}>Picked Up (Sampah Diangkut)</option>
          <option value="Completed" ${pickup.status === 'Completed' ? 'selected' : ''}>Completed (Timbang & Selesai)</option>
        </select>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-outline" onclick="document.getElementById('active-modal-backdrop').remove()">Batal</button>
    <button class="btn btn-primary" id="save-pickup-status">Simpan Status</button>
  `;

  const modal = Modal.open({
    title: `Perbarui Status Penjemputan — ${pickup.id}`,
    content: modalHtml,
    footer: footerHtml,
    size: 'sm'
  });

  modal.element.querySelector('#save-pickup-status').addEventListener('click', () => {
    const newStatus = modal.element.querySelector('#pickup-new-status').value;
    const oldStatus = pickup.status;
    pickup.status = newStatus;
    db.logAudit(auth.getCurrentUser(), 'UPDATE_PICKUP_STATUS', 'PICKUPS', pickup.id, oldStatus, newStatus);
    modal.close();
    if (onSuccess) onSuccess();
  });
}
