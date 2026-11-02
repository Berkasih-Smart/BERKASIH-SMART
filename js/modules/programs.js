/**
 * BERKASIH SMART - Programs, Campaigns & Community Challenge Module
 * Implements Section 28 (Campaign Management) & Section 29 (Community Challenge toward Shared Targets)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderPrograms(container) {
  const programs = db.getPrograms();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Program & Kampanye Komunitas</span>
          <span class="badge badge-demo">COMMUNITY CHALLENGE</span>
        </h1>
        <p class="page-subtitle">Pemberdayaan gotong royong warga 15 RW untuk pencapaian target kelestarian lingkungan bersama.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-create-program">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Inisiasi Program Baru
        </button>
      </div>
    </div>

    <!-- 1. SIGNATURE COMMUNITY CHALLENGE CARD (Section 29) -->
    <div class="card" style="margin-bottom: var(--space-6); background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%); border: 1px solid #BBF7D0; padding: 24px;">
      <div class="flex justify-between items-start flex-wrap gap-4" style="margin-bottom: 16px;">
        <div>
          <span class="badge badge-healthy" style="font-weight: 700; margin-bottom: 6px;">
            🌱 TANTANGAN KOMUNITAS RW KARYAMULYA 2026
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: #14532D;">
            "Gotong Royong Pilah 5.000 kg Sampah Terdaur Ulang"
          </h2>
          <p style="font-size: 0.82rem; color: #4B5563; max-width: 600px; margin-top: 4px;">
            Fokus pada kolaborasi antar-warga dan kebersamaan RW, bukan kompetisi individu yang tidak sehat. Bersama menjaga Karyamulya bersih dan berdaya.
          </p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.72rem; color: #64748B;">Capaian Kolektif Saat Ini</div>
          <div style="font-size: 2rem; font-weight: 800; color: #15803D;">
            3.120 <span style="font-size: 1rem; font-weight: 600;">/ 5.000 kg</span>
          </div>
          <span class="badge badge-completed">62.4% Tercapai</span>
        </div>
      </div>

      <!-- Shared Progress Bar -->
      <div style="width: 100%; height: 16px; background-color: #E2E8F0; border-radius: 999px; overflow: hidden; margin-bottom: 14px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
        <div style="width: 62.4%; height: 100%; background: linear-gradient(90deg, #15803D, #22C55E); border-radius: 999px;"></div>
      </div>

      <div class="flex justify-between items-center flex-wrap gap-2" style="font-size: 0.78rem; color: #4B5563;">
        <span>Terlibat: <strong>348 Kepala Keluarga</strong> di 15 RW</span>
        <span>Sisa Waktu: <strong>63 Hari Lagi</strong> (s.d 30 November 2026)</span>
        <span style="color: #166534; font-weight: 700;">Emisi Terhindar: 5,77 Ton CO2e</span>
      </div>
    </div>

    <!-- 2. PROGRAMS DIRECTORY -->
    <h3 style="font-size: 1.05rem; font-weight: 700; color: #14532D; margin-bottom: 14px;">
      Daftar Program Kerja & Sosialisasi Aktif
    </h3>

    <div class="grid grid-cols-3" style="gap: var(--space-5);">
      ${programs.map(prg => `
        <div class="card card-hover" style="display: flex; flex-direction: column;">
          <div class="card-header">
            <div>
              <div class="card-title" style="font-size: 0.95rem;">${prg.name}</div>
              <div style="font-size: 0.72rem; color: #6B7280;">${prg.date}</div>
            </div>
            <span class="badge ${prg.status === 'ONGOING' ? 'badge-healthy' : 'badge-completed'}">
              ${prg.status}
            </span>
          </div>

          <div class="card-body" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <p style="font-size: 0.8rem; line-height: 1.5; color: #374151; margin-bottom: 14px;">
              ${prg.objective}
            </p>

            <div style="background-color: #F8FAF8; border-radius: 8px; padding: 10px; font-size: 0.75rem; margin-bottom: 12px;">
              <div class="flex justify-between items-center" style="margin-bottom: 4px;">
                <span style="color: #64748B;">Lokasi:</span>
                <strong>${prg.location}</strong>
              </div>
              <div class="flex justify-between items-center" style="margin-bottom: 4px;">
                <span style="color: #64748B;">Partisipan:</span>
                <strong>${prg.actual_participants} / ${prg.target_participants} Orang</strong>
              </div>
              <div class="flex justify-between items-center">
                <span style="color: #64748B;">Dampak Timbulan:</span>
                <strong style="color: #15803D;">${prg.impact_kg} kg</strong>
              </div>
            </div>

            <button class="btn btn-sm btn-outline" style="width: 100%;">
              Lihat Dokumentasi & Laporan Program
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach Create Program
  const createBtn = container.querySelector('#btn-create-program');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      openCreateProgramModal(() => renderPrograms(container));
    });
  }
}

function openCreateProgramModal(onSuccess) {
  const modalHtml = `
    <form id="create-prog-form">
      <div class="form-group">
        <label class="form-label">Nama Program / Kampanye *</label>
        <input type="text" id="prog-name" class="form-input" required placeholder="Contoh: Edukasi Pemilahan Sampah Sekolah RW 07" />
      </div>

      <div class="form-group">
        <label class="form-label">Tujuan Program *</label>
        <textarea id="prog-obj" class="form-textarea" rows="2" placeholder="Jelaskan tujuan dan output program..."></textarea>
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Tanggal Pelaksanaan *</label>
          <input type="text" id="prog-date" class="form-input" placeholder="Oktober 2026" />
        </div>

        <div class="form-group">
          <label class="form-label">Lokasi Kegiatan *</label>
          <input type="text" id="prog-loc" class="form-input" placeholder="Balai Warga RW 07" />
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="form-group">
          <label class="form-label">Target Partisipan (Warga)</label>
          <input type="number" id="prog-target" class="form-input" value="150" />
        </div>

        <div class="form-group">
          <label class="form-label">Target Pengumpulan (kg)</label>
          <input type="number" id="prog-kg" class="form-input" value="500" />
        </div>
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" onclick="document.getElementById('active-modal-backdrop').remove()">Batal</button>
    <button class="btn btn-primary" id="save-prog-btn">Simpan Program</button>
  `;

  const modal = Modal.open({
    title: 'Inisiasi Program & Kampanye Lingkungan',
    content: modalHtml,
    footer: footerHtml,
    size: 'md'
  });

  modal.element.querySelector('#save-prog-btn').addEventListener('click', () => {
    const name = modal.element.querySelector('#prog-name').value;
    const obj = modal.element.querySelector('#prog-obj').value;
    const date = modal.element.querySelector('#prog-date').value;
    const loc = modal.element.querySelector('#prog-loc').value;
    const target = parseInt(modal.element.querySelector('#prog-target').value, 10) || 100;
    const kg = parseFloat(modal.element.querySelector('#prog-kg').value) || 200;

    if (!name) {
      alert('Nama program wajib diisi.');
      return;
    }

    const newProg = {
      id: `PRG-${String(db.getPrograms().length + 1).padStart(2, '0')}`,
      name,
      objective: obj,
      date: date || 'Oktober 2026',
      location: loc || 'Kelurahan Karyamulya',
      target_participants: target,
      actual_participants: 0,
      status: 'ONGOING',
      impact_kg: 0,
      isDemo: false
    };

    db.getPrograms().push(newProg);
    db.logAudit(auth.getCurrentUser(), 'CREATE_PROGRAM', 'PROGRAMS', newProg.id, 'N/A', `Initiated ${name}`);
    modal.close();
    if (onSuccess) onSuccess();
  });
}
