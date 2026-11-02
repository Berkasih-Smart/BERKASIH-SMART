/**
 * BERKASIH SMART - Customer Portal & Mobile Experience Module
 * Implements Section 41 (Mobile Navigation) & Section 42 (Fintech-style Customer Dashboard)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { ReceiptGenerator } from '../components/receipt.js';

export function renderCustomerPortal(container) {
  const user = auth.getCurrentUser();
  const customers = db.getCustomers();
  const customer = user.role === 'CUSTOMER' 
    ? (db.getCustomerById(user.customer_id) || customers[0])
    : customers[0];

  const deposits = db.getDeposits().filter(d => d.customer_id === customer.id);
  const latestDeposit = deposits[0];

  container.innerHTML = `
    <!-- Mobile Friendly Wrapper -->
    <div style="max-width: 680px; margin: 0 auto; padding-bottom: 70px;">
      <!-- Welcome Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <div style="font-size: 0.75rem; color: #64748B;">Selamat Datang Kembali,</div>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: #14532D;">${customer.name}</h2>
          <span style="font-size: 0.72rem; color: #15803D; font-weight: 600;">${customer.customer_code} • ${customer.rw_id} Situgangga</span>
        </div>
        <div style="width: 44px; height: 44px; border-radius: 50%; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: 700;">
          ${customer.name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <!-- 1. FINTECH HERO CARD (Section 42) -->
      <div class="customer-hero-card">
        <div class="flex justify-between items-center" style="font-size: 0.8rem; opacity: 0.9;">
          <span>Saldo Tabungan Sampah Anda</span>
          <span class="badge" style="background: rgba(255,255,255,0.25); color: #FFFFFF; font-size: 0.68rem; border: none;">
            Aktif & Terlindungi
          </span>
        </div>

        <div class="customer-balance-val">
          Rp${customer.savings_balance.toLocaleString('id-ID')}
        </div>

        <div class="grid grid-cols-3" style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; margin-top: 12px;">
          <div>
            <div style="font-size: 0.68rem; opacity: 0.85;">Total Kontribusi</div>
            <strong style="font-size: 1rem;">${customer.total_weight} kg</strong>
          </div>
          <div>
            <div style="font-size: 0.68rem; opacity: 0.85;">Frekuensi Setor</div>
            <strong style="font-size: 1rem;">${customer.deposit_count || deposits.length} kali</strong>
          </div>
          <div>
            <div style="font-size: 0.68rem; opacity: 0.85;">Dampak TPA</div>
            <strong style="font-size: 1rem;">${customer.total_weight} kg diverted</strong>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-3" style="gap: 10px; margin-bottom: 20px;">
        <button class="btn btn-outline" id="cust-btn-req-pickup" style="padding: 12px 8px; flex-direction: column; gap: 4px; font-size: 0.75rem;">
          <span style="font-size: 1.25rem;">🛵</span>
          <span>Minta Jemput</span>
        </button>
        <button class="btn btn-outline" id="cust-btn-schedule" style="padding: 12px 8px; flex-direction: column; gap: 4px; font-size: 0.75rem;">
          <span style="font-size: 1.25rem;">📅</span>
          <span>Jadwal Pos</span>
        </button>
        <button class="btn btn-outline" id="cust-btn-catalog" style="padding: 12px 8px; flex-direction: column; gap: 4px; font-size: 0.75rem;">
          <span style="font-size: 1.25rem;">🏷️</span>
          <span>Daftar Harga</span>
        </button>
      </div>

      <!-- Sustainability Journey Stepper (Section 26) -->
      <div class="card" style="padding: 16px; margin-bottom: 20px;">
        <div class="flex justify-between items-center" style="margin-bottom: 12px;">
          <strong style="font-size: 0.82rem; color: #14532D;">🌱 Jejak Kontribusi Anda (Milestones)</strong>
          <span style="font-size: 0.7rem; color: #15803D; font-weight: 600;">Target: 50 kg</span>
        </div>
        <div class="milestone-stepper" style="margin: 10px 0;">
          <div class="milestone-node completed">
            <div class="milestone-circle">✓</div>
            <span class="milestone-label">Daftar</span>
          </div>
          <div class="milestone-node completed">
            <div class="milestone-circle">✓</div>
            <span class="milestone-label">Setor 1</span>
          </div>
          <div class="milestone-node completed">
            <div class="milestone-circle">✓</div>
            <span class="milestone-label">10 kg</span>
          </div>
          <div class="milestone-node completed">
            <div class="milestone-circle">✓</div>
            <span class="milestone-label">25 kg</span>
          </div>
          <div class="milestone-node ${(customer.total_weight || 0) >= 50 ? 'completed' : 'active'}">
            <div class="milestone-circle">${(customer.total_weight || 0) >= 50 ? '✓' : '50'}</div>
            <span class="milestone-label">50 kg</span>
          </div>
        </div>
      </div>

      <!-- Latest Transaction Breakdown (Section 42) -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <div class="card-title" style="font-size: 0.85rem;">Setoran Terakhir Anda</div>
          ${latestDeposit ? `<span class="badge badge-completed">${latestDeposit.status}</span>` : ''}
        </div>
        <div class="card-body">
          ${latestDeposit ? `
            <div class="flex justify-between items-center" style="margin-bottom: 8px;">
              <div>
                <strong style="font-size: 0.88rem; color: #17201A;">
                  ${latestDeposit.details && latestDeposit.details[0] ? latestDeposit.details[0].waste_name.split('(')[0] : 'Setoran Sampah'}
                </strong>
                <div style="font-size: 0.72rem; color: #6B7280;">
                  ${new Date(latestDeposit.transaction_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; font-size: 1rem; color: #15803D;">+Rp${latestDeposit.total_value.toLocaleString('id-ID')}</div>
                <div style="font-size: 0.72rem; color: #6B7280;">${latestDeposit.total_weight} kg</div>
              </div>
            </div>

            <button class="btn btn-sm btn-outline" id="cust-btn-view-receipt" style="width: 100%; margin-top: 10px;">
              Lihat Struk Digital Resmi
            </button>
          ` : `
            <div style="text-align: center; padding: 16px; color: #9CA3AF; font-size: 0.8rem;">
              Belum ada riwayat setoran tersimpan.
            </div>
          `}
        </div>
      </div>

      <!-- Announcements & Jadwal Operasional -->
      <div class="card" style="padding: 16px;">
        <div class="card-title" style="font-size: 0.85rem; margin-bottom: 8px;">
          📢 Pengumuman & Jadwal Pos RW 04 Situgangga
        </div>
        <ul style="font-size: 0.75rem; color: #4B5563; line-height: 1.6; padding-left: 16px; display: flex; flex-direction: column; gap: 6px;">
          <li><strong>Hari Buka Penimbangan:</strong> Setiap Sabtu & Minggu, Pukul 08.00 - 12.00 WIB di Balai RW 04.</li>
          <li><strong>Pemberitahuan:</strong> Minyak jelantah dihargai Rp6.500/liter, mohon gunakan jerigen atau botol bersih tertutup rapat.</li>
          <li><strong>Program Berjalan:</strong> Sedekah Sampah untuk Dana Sosial Warga dan Sembako Ramah Lingkungan.</li>
        </ul>
      </div>
    </div>

    <!-- Mobile Bottom Navigation (Section 41) -->
    <nav class="customer-mobile-nav">
      <a href="#customer-portal" class="mobile-nav-item active">
        <span style="font-size: 1.1rem;">🏠</span>
        <span>Home</span>
      </a>
      <a href="#setoran" class="mobile-nav-item">
        <span style="font-size: 1.1rem;">♻️</span>
        <span>Setor</span>
      </a>
      <a href="#tabungan" class="mobile-nav-item">
        <span style="font-size: 1.1rem;">📜</span>
        <span>Riwayat</span>
      </a>
      <a href="#impact" class="mobile-nav-item">
        <span style="font-size: 1.1rem;">🌱</span>
        <span>Impact</span>
      </a>
      <a href="#nasabah" class="mobile-nav-item">
        <span style="font-size: 1.1rem;">👤</span>
        <span>Profil</span>
      </a>
    </nav>
  `;

  // Attach Listeners
  const receiptBtn = container.querySelector('#cust-btn-view-receipt');
  if (receiptBtn && latestDeposit) {
    receiptBtn.addEventListener('click', () => {
      ReceiptGenerator.showReceipt(latestDeposit);
    });
  }

  const pickupBtn = container.querySelector('#cust-btn-req-pickup');
  if (pickupBtn) {
    pickupBtn.addEventListener('click', () => {
      window.location.hash = '#penjemputan';
    });
  }

  const catalogBtn = container.querySelector('#cust-btn-catalog');
  if (catalogBtn) {
    catalogBtn.addEventListener('click', () => {
      window.location.hash = '#master-data';
    });
  }
}
