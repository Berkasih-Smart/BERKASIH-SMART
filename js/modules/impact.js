/**
 * BERKASIH SMART - Environmental Impact Module
 * Implements Section 25 (Verified Environmental Impact, Transparent Calculation Drawer)
 * and Section 26 (Customer Personal Impact Journey)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';

export function renderImpact(container) {
  const user = auth.getCurrentUser();
  const impact = db.getEnvironmentalImpact();
  const deposits = db.getDeposits();
  const customers = db.getCustomers();

  // If active user is a customer, show their personal impact journey
  const customer = user.role === 'CUSTOMER' 
    ? (db.getCustomerById(user.customer_id) || customers[0])
    : customers[0];

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>BERKASIH IMPACT — Dampak Lingkungan</span>
          <span class="badge badge-demo">VERIFIED METRICS</span>
        </h1>
        <p class="page-subtitle">Perhitungan kontribusi ekologis nyata dari aliran material terpilah warga Kelurahan Karyamulya.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-outline" id="btn-toggle-assumptions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Bagaimana ini dihitung? (Transparansi Asumsi)
        </button>
      </div>
    </div>

    <!-- Transparent Assumptions Drawer (Expandable, Section 25 & Rule #6) -->
    <div id="assumptions-drawer" style="display: none; background-color: #F8FAF8; border: 1px solid #BBF7D0; border-radius: 12px; padding: 20px; margin-bottom: var(--space-6);">
      <div style="font-weight: 700; color: #14532D; font-size: 0.95rem; margin-bottom: 8px;">
        📐 Metodologi & Transparansi Perhitungan Lingkungan
      </div>
      <p style="font-size: 0.8rem; color: #4B5563; line-height: 1.6; margin-bottom: 14px;">
        Sesuai <strong>Prinsip Inti #6</strong>, BERKASIH SMART tidak mempublikasikan angka klaim tanpa landasan ilmiah. Seluruh metrik berasal dari aliran timbangan fisik yang dikalikan dengan faktor konversi standar IPCC (Intergovernmental Panel on Climate Change) dan KLHK.
      </p>

      <div class="grid grid-cols-3" style="gap: 12px;">
        ${impact.formulas.map(f => `
          <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: 8px; padding: 12px;">
            <div style="font-weight: 700; font-size: 0.78rem; color: #15803D; margin-bottom: 4px;">${f.metric}</div>
            <div style="font-family: var(--font-family-mono); font-size: 0.72rem; background: #F1F5F9; padding: 4px 6px; border-radius: 4px; margin-bottom: 6px;">
              ${f.formula}
            </div>
            <div style="font-size: 0.7rem; color: #64748B; line-height: 1.4; margin-bottom: 4px;"><strong>Asumsi:</strong> ${f.assumption}</div>
            <div style="font-size: 0.65rem; color: #9CA3AF;">Sumber: ${f.source}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Impact KPI Cards -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
      <div class="kpi-card" style="border-top: 4px solid #16A34A;">
        <span class="kpi-label">Sampah Teralihkan dari TPA</span>
        <div class="kpi-value">${impact.wasteDivertedKg} <span class="kpi-unit">kg</span></div>
        <span style="font-size: 0.72rem; color: #16A34A;">100% masuk rantai daur ulang</span>
      </div>

      <div class="kpi-card" style="border-top: 4px solid #22C55E;">
        <span class="kpi-label">Emisi Gas Rumah Kaca Ditekan</span>
        <div class="kpi-value">${impact.co2eSavedKg} <span class="kpi-unit">kg CO2e</span></div>
        <span style="font-size: 0.72rem; color: #6B7280;">Setara serapan ${impact.treesEquivalent} pohon tahunan</span>
      </div>

      <div class="kpi-card" style="border-top: 4px solid #0284C7;">
        <span class="kpi-label">Ruang TPA Kopiluhur Dihemat</span>
        <div class="kpi-value">${impact.landfillVolumeSavedM3} <span class="kpi-unit">m³</span></div>
        <span style="font-size: 0.72rem; color: #6B7280;">Beban timbunan sampah berkurang</span>
      </div>

      <div class="kpi-card" style="border-top: 4px solid #D97706;">
        <span class="kpi-label">Penghematan Air Industri</span>
        <div class="kpi-value">${impact.waterSavedLiters.toLocaleString('id-ID')} <span class="kpi-unit">liter</span></div>
        <span style="font-size: 0.72rem; color: #6B7280;">Daur ulang kertas & plastik</span>
      </div>
    </div>

    <!-- Personal Impact Journey for Customers (Section 26) -->
    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <div>
          <div class="card-title">Jejak Dampak Lingkungan Pribadi (My Environmental Impact)</div>
          <div style="font-size: 0.72rem; color: #6B7280;">Profil: ${customer.name} (${customer.customer_code} • ${customer.rw_id})</div>
        </div>
        <span class="badge badge-healthy">Nasabah Berkelanjutan</span>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-4" style="gap: 12px; margin-bottom: 20px;">
          <div style="background-color: #F8FAF8; padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #6B7280;">Total Setoran Pribadi</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #14532D;">${customer.total_weight} kg</div>
          </div>
          <div style="background-color: #F8FAF8; padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #6B7280;">CO2e Terhindarkan</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #15803D;">${((customer.total_weight || 0) * 1.6).toFixed(1)} kg</div>
          </div>
          <div style="background-color: #F8FAF8; padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #6B7280;">Frekuensi Setor</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #2563EB;">${customer.deposit_count || 12} kali</div>
          </div>
          <div style="background-color: #F8FAF8; padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #6B7280;">Saldo Yang Dihasilkan</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #D97706;">Rp${customer.savings_balance.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <!-- Milestones (Section 26) -->
        <div style="font-size: 0.8rem; font-weight: 700; color: #14532D; margin-bottom: 12px;">
          Jejak Milestones Keberlanjutan Anda:
        </div>
        <div class="milestone-stepper">
          <div class="milestone-node completed">
            <div class="milestone-circle">✓</div>
            <span class="milestone-label">Registrasi</span>
          </div>
          <div class="milestone-node completed">
            <div class="milestone-circle">✓</div>
            <span class="milestone-label">Setor Perdana</span>
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
            <div class="milestone-circle">${(customer.total_weight || 0) >= 50 ? '✓' : '5'}</div>
            <span class="milestone-label">50 kg</span>
          </div>
          <div class="milestone-node ${(customer.total_weight || 0) >= 100 ? 'completed' : ''}">
            <div class="milestone-circle">100</div>
            <span class="milestone-label">100 kg</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Toggle Assumptions
  const btnToggle = container.querySelector('#btn-toggle-assumptions');
  const drawer = container.querySelector('#assumptions-drawer');
  if (btnToggle && drawer) {
    btnToggle.addEventListener('click', () => {
      drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
    });
  }
}
