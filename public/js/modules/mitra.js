/**
 * BERKASIH SMART - Partner Management Module (Mitra)
 * Implements Section 16 (Recyclers, Offtakers, Government, Circularity Relations)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderMitra(container) {
  const partners = db.getPartners();
  const sales = db.getSales();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Manajemen Mitra & Ekosistem Offtaker</span>
        </h1>
        <p class="page-subtitle">Jejaring industri daur ulang, pengepul, lembaga pemerintah, dan offtaker sirkularitas di Cirebon.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-add-partner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah Mitra Baru
        </button>
      </div>
    </div>

    <!-- Partner Directory Cards -->
    <div class="grid grid-cols-2" style="margin-bottom: var(--space-6);">
      ${partners.map(p => {
        const partnerSales = sales.filter(s => s.partner_id === p.id);
        const totalSalesRevenue = partnerSales.reduce((sum, s) => sum + (s.total_value || 0), 0);

        return `
          <div class="card card-hover">
            <div class="card-header">
              <div>
                <div class="card-title">${p.name}</div>
                <div style="font-size: 0.72rem; color: #6B7280;">${p.category} • ${p.location}</div>
              </div>
              <span class="badge badge-active">${p.status}</span>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 12px; font-size: 0.8rem; line-height: 1.5;">
                <div style="color: #64748B; font-size: 0.72rem;">Kontak Person & Telepon:</div>
                <strong>${p.contact_person}</strong> (${p.phone}) • ${p.email}
              </div>

              <div style="margin-bottom: 12px;">
                <div style="color: #64748B; font-size: 0.72rem; margin-bottom: 4px;">Material Yang Diterima:</div>
                <div class="flex gap-1 flex-wrap">
                  ${p.accepted_materials.map(mat => `
                    <span class="badge" style="background: #F1F5F9; color: #334155; font-size: 0.7rem;">${mat}</span>
                  `).join('')}
                </div>
              </div>

              <!-- Circularity Relationship Link (Section 16 & 27) -->
              <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px; font-size: 0.75rem; margin-bottom: 12px;">
                <div style="font-weight: 700; color: #166534; margin-bottom: 2px;">Jalur Hilirisasi Sirkular:</div>
                <div style="color: #15803D;">${p.circularity_destination}</div>
              </div>

              <div class="flex justify-between items-center" style="font-size: 0.78rem; border-top: 1px solid var(--color-border-subtle); padding-top: 10px;">
                <span>Total Material Terserap: <strong>${p.total_purchased_kg || 0} kg</strong></span>
                <span style="color: #15803D; font-weight: 700;">Nilai: Rp${totalSalesRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach Add Partner
  const addBtn = container.querySelector('#btn-add-partner');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openAddPartnerModal(() => renderMitra(container));
    });
  }
}

function openAddPartnerModal(onSuccess) {
  const modalHtml = `
    <form id="add-partner-form">
      <div class="form-group">
        <label class="form-label">Nama Lembaga / Perusahaan Mitra *</label>
        <input type="text" id="partner-name" class="form-input" required placeholder="Contoh: PT Daur Plastik Nusantara" />
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Kategori Kemitraan *</label>
          <select id="partner-category" class="form-select">
            <option value="Industri Daur Ulang">Industri Daur Ulang (Recycler)</option>
            <option value="Pengepul / Offtaker">Pengepul / Offtaker</option>
            <option value="Industri Energi Terbarukan">Industri Energi Terbarukan (Bio-Diesel)</option>
            <option value="Pemerintah / DLH">Pemerintah / DLH</option>
            <option value="Mitra Pendidikan / Kampus">Mitra Pendidikan / Kampus</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Penanggung Jawab (PIC)</label>
          <input type="text" id="partner-pic" class="form-input" placeholder="Nama PIC" />
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Nomor Telepon / WhatsApp *</label>
          <input type="tel" id="partner-phone" class="form-input" required placeholder="08123456789" />
        </div>

        <div class="form-group">
          <label class="form-label">Alamat / Lokasi Pabrik</label>
          <input type="text" id="partner-location" class="form-input" placeholder="Kawasan Industri Cirebon" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Hilirisasi Sirkularitas (Hasil Akhir Olahan)</label>
        <input type="text" id="partner-circ" class="form-input" placeholder="Contoh: Flakes PET untuk bahan baku dakron & benang polyester" />
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" onclick="document.getElementById('active-modal-backdrop').remove()">Batal</button>
    <button class="btn btn-primary" id="save-partner-btn">Simpan Mitra</button>
  `;

  const modal = Modal.open({
    title: 'Registrasi Mitra Baru Ekosistem BERKASIH',
    content: modalHtml,
    footer: footerHtml,
    size: 'md'
  });

  modal.element.querySelector('#save-partner-btn').addEventListener('click', () => {
    const name = modal.element.querySelector('#partner-name').value;
    const cat = modal.element.querySelector('#partner-category').value;
    const pic = modal.element.querySelector('#partner-pic').value;
    const phone = modal.element.querySelector('#partner-phone').value;
    const loc = modal.element.querySelector('#partner-location').value;
    const circ = modal.element.querySelector('#partner-circ').value;

    if (!name || !phone) {
      alert('Nama mitra dan nomor telepon wajib diisi.');
      return;
    }

    const newPartner = {
      id: `PTR-${String(db.getPartners().length + 1).padStart(3, '0')}`,
      name,
      category: cat,
      contact_person: pic || 'Penanggung Jawab',
      phone,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@cirebon.id`,
      location: loc || 'Kota Cirebon',
      accepted_materials: ['Plastik Terpilah', 'Kardus'],
      status: 'ACTIVE',
      total_purchased_kg: 0,
      circularity_destination: circ || 'Daur Ulang Material Industri',
      isDemo: false
    };

    db.getPartners().push(newPartner);
    db.logAudit(auth.getCurrentUser(), 'CREATE_PARTNER', 'PARTNERS', newPartner.id, 'N/A', `Added partner ${name}`);
    modal.close();
    if (onSuccess) onSuccess();
  });
}
