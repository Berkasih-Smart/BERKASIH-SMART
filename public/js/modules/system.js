/**
 * BERKASIH SMART - System, Master Data, Data Health & Audit Log Module
 * Implements Section 34 (Master Data Pricing History), Section 38 (Audit Logging),
 * and Section 66 (Data Health Monitor Dashboard)
 */

import { db } from '../db/schema.js';
import { auth, ROLE_PERMISSIONS } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderSystem(container) {
  const wasteTypes = db.getWasteTypes();
  const auditLogs = db.getAuditLogs();
  const dataHealth = db.getDataHealth();
  const users = db.getUsers();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Pengaturan Sistem & Master Data</span>
          <span class="badge badge-demo">SYSTEM ENGINE</span>
        </h1>
        <p class="page-subtitle">Pusat konfigurasi master data harga, kesehatan integritas database, dan audit trail.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-outline" id="btn-run-health-check">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Uji Integritas Data (Health Check)
        </button>
      </div>
    </div>

    <!-- System Navigation Tabs -->
    <div class="tab-nav" id="system-tabs">
      <button class="tab-item active" data-tab="tab-master-prices">Master Data & Harga Sampah</button>
      <button class="tab-item" data-tab="tab-data-health">Data Health Monitor (Integritas)</button>
      <button class="tab-item" data-tab="tab-users-roles">Pengguna & Peran (RBAC)</button>
      <button class="tab-item" data-tab="tab-audit-logs">Audit Log (Rekam Jejak)</button>
      ${auth.isSuperAdmin() ? '<button class="tab-item" data-tab="tab-system-deploy">Pembaruan & Deployment</button>' : ''}
    </div>

    <!-- 1. Master Data & Prices Tab (Section 34) -->
    <div id="tab-master-prices" class="tab-content-panel">
      <div class="card" style="margin-bottom: var(--space-6);">
        <div class="card-header">
          <div>
            <div class="card-title">Katalog Jenis Sampah & Harga Acuan Beli</div>
            <div style="font-size: 0.72rem; color: #6B7280;">Perubahan harga dicatat dalam log historis tanpa mengubah transaksi masa lalu secara retroaktif.</div>
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Kategori</th>
                <th>Nama Jenis Sampah</th>
                <th>Satuan</th>
                <th>Harga Beli Saat Ini</th>
                <th>Faktor Emisi (CO2e)</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${wasteTypes.map(w => `
                <tr>
                  <td><code>${w.id}</code></td>
                  <td><span class="badge" style="background: #F1F5F9; color: #334155;">${w.category}</span></td>
                  <td><strong>${w.name}</strong></td>
                  <td>${w.unit}</td>
                  <td><strong style="color: #15803D; font-size: 0.95rem;">Rp${w.current_price_per_kg.toLocaleString('id-ID')}</strong></td>
                  <td>${w.co2_factor} kg CO2e / kg</td>
                  <td style="text-align: right;">
                    <button class="btn btn-sm btn-outline btn-edit-price" data-id="${w.id}">
                      Ubah Harga
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 2. Data Health Monitor (Section 66) -->
    <div id="tab-data-health" class="tab-content-panel" style="display: none;">
      <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
        <div class="kpi-card" style="border-top: 4px solid ${dataHealth.status === 'Healthy' ? '#16A34A' : '#DC2626'};">
          <span class="kpi-label">Status Kesehatan Basis Data</span>
          <div class="kpi-value" style="color: ${dataHealth.status === 'Healthy' ? '#15803D' : '#DC2626'};">
            ${dataHealth.status}
          </div>
          <span style="font-size: 0.72rem; color: #6B7280;">Diperiksa: ${new Date(dataHealth.lastChecked).toLocaleTimeString('id-ID')}</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Skor Kelengkapan Data</span>
          <div class="kpi-value" style="color: #14532D;">${dataHealth.completenessScore}%</div>
          <span style="font-size: 0.72rem; color: #16A34A;">Integritas relasional terjamin</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Catatan Inkonsistensi Ditemukan</span>
          <div class="kpi-value" style="color: ${dataHealth.issuesCount > 0 ? '#D97706' : '#16A34A'};">
            ${dataHealth.issuesCount} Masalah
          </div>
          <span style="font-size: 0.72rem; color: #6B7280;">Deteksi nomor ganda & relasi yatim</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Daftar Hasil Pemeriksaan Integritas Data</div>
          <span class="badge ${dataHealth.status === 'Healthy' ? 'badge-healthy' : 'badge-attention'}">
            ${dataHealth.status}
          </span>
        </div>
        <div class="card-body">
          ${dataHealth.issues.length > 0 ? `
            <div class="flex flex-col gap-3">
              ${dataHealth.issues.map(iss => `
                <div class="alert-banner ${iss.level === 'Critical' ? 'alert-danger' : 'alert-warning'}" style="margin-bottom: 0;">
                  <strong>[${iss.level}]</strong> ${iss.message}
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="text-align: center; padding: 24px; color: #15803D;">
              <div style="font-size: 1.5rem; margin-bottom: 4px;">✓</div>
              <strong>Semua relasi database konsisten dan sehat!</strong>
              <div style="font-size: 0.75rem; color: #6B7280; margin-top: 4px;">
                Tidak ada setoran yatim, tidak ada saldo minus, dan tidak ada stok inventori negatif.
              </div>
            </div>
          `}
        </div>
      </div>
    </div>

    <!-- 3. Users & Roles (RBAC) -->
    <div id="tab-users-roles" class="tab-content-panel" style="display: none;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Daftar Pengguna Sistem & Hak Akses (RBAC)</div>
          <span style="font-size: 0.75rem; color: #6B7280;">5 Tingkat Peran Terkonfigurasi</span>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pengguna</th>
                <th>Email Akun</th>
                <th>Peran Sistem (Role)</th>
                <th>Hak Akses Modul</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                const roleConfig = ROLE_PERMISSIONS[u.role] || ROLE_PERMISSIONS.CUSTOMER;
                return `
                  <tr>
                    <td><code>${u.id}</code></td>
                    <td><strong>${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="badge ${roleConfig.badgeClass}">${roleConfig.name}</span></td>
                    <td style="font-size: 0.75rem; color: #4B5563;">${roleConfig.description}</td>
                    <td><span class="badge badge-healthy">${u.status}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 4. Audit Log (Section 38) -->
    <div id="tab-audit-logs" class="tab-content-panel" style="display: none;">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Audit Trail Transaksi & Perubahan Sistem</div>
            <div style="font-size: 0.72rem; color: #6B7280;">Who, What, When, Old Value, New Value (Immutable Event Log)</div>
          </div>
          <span class="badge badge-demo">Audit Trail Terenkripsi</span>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID Audit</th>
                <th>Waktu Kejadian</th>
                <th>Pengguna & Peran</th>
                <th>Tindakan (Action)</th>
                <th>Entitas Target</th>
                <th>Nilai Sebelum</th>
                <th>Nilai Sesudah</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(log => `
                <tr>
                  <td><code>${log.id}</code></td>
                  <td>${new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>
                    <strong>${log.user}</strong>
                    <div style="font-size: 0.7rem; color: #6B7280;">${log.role}</div>
                  </td>
                  <td><span class="badge badge-active">${log.action}</span></td>
                  <td><code>${log.entity}</code> (${log.entity_id})</td>
                  <td style="font-size: 0.75rem; color: #64748B; max-width: 140px;">${log.old_value}</td>
                  <td style="font-size: 0.75rem; color: #15803D; font-weight: 600; max-width: 160px;">${log.new_value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 5. Deployment / Update Tab (Super Admin Only) -->
    ${auth.isSuperAdmin() ? `
      <div id="tab-system-deploy" class="tab-content-panel" style="display: none;">
        <div class="card" style="margin-bottom: var(--space-6);">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="card-title">Pembaruan Sistem Otomatis (aaPanel Webhook)</div>
              <div style="font-size: 0.75rem; color: #6B7280;">
                Memicu deployment versi terbaru langsung dari branch <code>main</code> di GitHub ke server produksi aaPanel.
              </div>
            </div>
            <span class="badge badge-healthy">Akses Khusus Super Admin</span>
          </div>

          <div class="card-body">
            <div style="background-color: #F8FAF8; border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h4 style="font-size: 0.88rem; font-weight: 700; color: #14532D; margin-bottom: 8px;">Tahapan yang Akan Dijalankan Server:</h4>
              <ol style="margin: 0; padding-left: 20px; font-size: 0.8rem; color: #374151; line-height: 1.6;">
                <li><strong>Git Pull</strong>: Mengambil commit terbaru dari branch <code>main</code> di GitHub.</li>
                <li><strong>Dependencies</strong>: Memeriksa dan memperbarui paket npm jika ada dependensi baru.</li>
                <li><strong>Build TypeScript</strong>: Mengompilasi kode NestJS ke direktori <code>dist/</code>.</li>
                <li><strong>Restart Node Process</strong>: Me-reload aplikasi secara otomatis di aaPanel.</li>
              </ol>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px;">
              <div style="font-size: 0.75rem; color: #6B7280;">
                <div>Keamanan: Endpoint dilindungi JWT & dicatat permanen dalam audit log.</div>
                <div>Perkiraan waktu proses: <strong>15 - 30 detik</strong>.</div>
              </div>
              <button class="btn btn-primary" id="btn-trigger-deploy" style="display: flex; align-items: center; gap: 8px; font-weight: 700;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                Perbarui Aplikasi Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    ` : ''}
  `;

  // Attach System Tabs
  const tabBtns = container.querySelectorAll('#system-tabs .tab-item');
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

  // Deploy Button Listener
  const deployBtn = container.querySelector('#btn-trigger-deploy');
  if (deployBtn) {
    deployBtn.addEventListener('click', () => {
      openDeployProgressModal();
    });
  }

  // Edit Price Modal
  container.querySelectorAll('.btn-edit-price').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wtId = e.currentTarget.dataset.id;
      const wt = wasteTypes.find(w => w.id === wtId);
      if (wt) openEditPriceModal(wt, () => renderSystem(container));
    });
  });

  const checkBtn = container.querySelector('#btn-run-health-check');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      renderSystem(container);
      // Switch directly to health tab
      const healthTab = container.querySelector('[data-tab="tab-data-health"]');
      if (healthTab) healthTab.click();
    });
  }
}

function openEditPriceModal(wasteType, onSuccess) {
  const modalHtml = `
    <form id="edit-price-form">
      <div style="margin-bottom: 12px;">
        <div>Jenis Sampah: <strong>${wasteType.name}</strong></div>
        <div>Kategori: <strong>${wasteType.category}</strong></div>
        <div>Harga Saat Ini: <strong style="color: #15803D;">Rp${wasteType.current_price_per_kg.toLocaleString('id-ID')} / ${wasteType.unit}</strong></div>
      </div>

      <div class="form-group">
        <label class="form-label">Harga Beli Baru per ${wasteType.unit} (Rp) *</label>
        <input type="number" id="new-master-price" class="form-input" min="100" step="50" value="${wasteType.current_price_per_kg}" required />
        <span class="form-hint">Sesuai Prinsip #34: Transaksi masa lalu tidak akan diubah retroaktif.</span>
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" onclick="document.getElementById('active-modal-backdrop').remove()">Batal</button>
    <button class="btn btn-primary" id="save-master-price">Simpan & Audit Log</button>
  `;

  const modal = Modal.open({
    title: `Perbarui Harga Acuan — ${wasteType.name}`,
    content: modalHtml,
    footer: footerHtml,
    size: 'sm'
  });

  modal.element.querySelector('#save-master-price').addEventListener('click', () => {
    const newPrice = modal.element.querySelector('#new-master-price').value;
    try {
      db.updateMasterPrice(wasteType.id, newPrice, auth.getCurrentUser());
      modal.close();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(`Gagal mengubah harga: ${err.message}`);
    }
  });
}

function openDeployProgressModal() {
  if (!confirm('Apakah Anda yakin ingin memperbarui aplikasi ke versi terbaru dari GitHub?\n\nServer akan melakukan git pull, build TypeScript, dan reload aplikasi (perkiraan 15 - 30 detik).')) {
    return;
  }

  const modalHtml = `
    <div style="text-align: center; padding: 24px 16px;">
      <div id="deploy-anim-icon" style="margin-bottom: 16px;">
        <div style="display: inline-block; width: 44px; height: 44px; border: 4px solid #E5E7EB; border-top-color: #15803D; border-radius: 50%; animation: deploySpin 0.9s linear infinite;"></div>
      </div>
      <h3 id="deploy-status-title" style="font-size: 1.1rem; font-weight: 800; color: #14532D; margin-bottom: 6px;">
        Mengirim Sinyal Pembaruan...
      </h3>
      <p id="deploy-status-desc" style="font-size: 0.82rem; color: #4B5563; max-width: 400px; margin: 0 auto 18px; line-height: 1.5;">
        Menghubungi webhook aaPanel untuk memulai proses deploy di server.
      </p>

      <!-- Progress Bar -->
      <div style="background: #E5E7EB; border-radius: 999px; height: 10px; overflow: hidden; margin-bottom: 10px;">
        <div id="deploy-progress-bar" style="background: linear-gradient(90deg, #15803D, #22C55E); height: 100%; width: 15%; transition: width 0.5s ease;"></div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #6B7280; font-weight: 600;">
        <span id="deploy-phase-text">Fase 1/3: Inisialisasi webhook</span>
        <span id="deploy-percent-text">15%</span>
      </div>

      <div id="deploy-error-area" style="display: none; margin-top: 18px;">
        <div class="alert-banner alert-danger" id="deploy-error-msg" style="margin-bottom: 14px; text-align: left; font-size: 0.78rem;"></div>
        <button class="btn btn-outline btn-sm" id="btn-deploy-close">Tutup Dialog</button>
      </div>
    </div>
    <style>
      @keyframes deploySpin { 100% { transform: rotate(360deg); } }
    </style>
  `;

  const modal = Modal.open({
    title: 'Deployment Server aaPanel',
    content: modalHtml,
    size: 'sm'
  });

  const titleEl = modal.element.querySelector('#deploy-status-title');
  const descEl = modal.element.querySelector('#deploy-status-desc');
  const barEl = modal.element.querySelector('#deploy-progress-bar');
  const phaseEl = modal.element.querySelector('#deploy-phase-text');
  const percentEl = modal.element.querySelector('#deploy-percent-text');
  const errorArea = modal.element.querySelector('#deploy-error-area');
  const errorMsg = modal.element.querySelector('#deploy-error-msg');
  const animIcon = modal.element.querySelector('#deploy-anim-icon');
  const closeBtn = modal.element.querySelector('#btn-deploy-close');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  const token = auth.getToken();

  fetch('/api/system/trigger-deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Gagal memicu webhook deployment aaPanel.');
    }
    return res.json();
  })
  .then(() => {
    // Phase 2: aaPanel running git pull & build
    titleEl.textContent = 'Server Sedang Membangun Kode...';
    descEl.textContent = 'aaPanel sedang menjalankan git pull, npm install, & build TypeScript. Mohon tunggu, jangan tutup halaman.';
    barEl.style.width = '55%';
    phaseEl.textContent = 'Fase 2/3: Git Pull & Build';
    percentEl.textContent = '55%';

    let attempts = 0;
    const maxAttempts = 35; // ~70 seconds max
    let progress = 55;

    const interval = setInterval(async () => {
      attempts++;
      if (progress < 90) {
        progress += 3;
        barEl.style.width = `${progress}%`;
        percentEl.textContent = `${progress}%`;
      }

      if (attempts >= 4) {
        phaseEl.textContent = 'Fase 3/3: Me-reload Server';
        descEl.textContent = 'Server sedang me-restart proses Node. Menghubungkan kembali...';
      }

      try {
        const ping = await fetch('/api/bootstrap?t=' + Date.now(), { cache: 'no-store' });
        if (ping.ok && attempts >= 4) {
          clearInterval(interval);
          barEl.style.width = '100%';
          barEl.style.background = '#15803D';
          percentEl.textContent = '100%';
          phaseEl.textContent = 'Selesai';
          titleEl.textContent = 'Pembaruan Berhasil! 🎉';
          descEl.textContent = 'Aplikasi telah berhasil diperbarui ke versi terbaru. Memuat ulang antarmuka...';
          animIcon.innerHTML = `
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #DCFCE7; color: #15803D; border-radius: 50%;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          `;

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch {
        // Expected while server restarts
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        titleEl.textContent = 'Pembaruan Sedang Berlangsung di Server';
        descEl.textContent = 'Proses membutuhkan waktu lebih lama. Silakan muat ulang halaman setelah beberapa saat.';
        errorArea.style.display = 'block';
        errorMsg.textContent = 'Info: Sinyal deployment telah berhasil dikirim ke aaPanel. Server sedang menyelesaikan restart.';
      }
    }, 2000);
  })
  .catch((err) => {
    titleEl.textContent = 'Gagal Memperbarui';
    descEl.textContent = 'Terjadi kesalahan saat menghubungi webhook aaPanel.';
    animIcon.innerHTML = `
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #FEE2E2; color: #B91C1C; border-radius: 50%;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    `;
    errorArea.style.display = 'block';
    errorMsg.textContent = err.message || 'Koneksi gagal.';
  });
}
