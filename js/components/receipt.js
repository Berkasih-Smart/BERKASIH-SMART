/**
 * BERKASIH SMART - Thermal Receipt Generator
 * Produces realistic, printable receipt for waste deposits with QR verification
 */

import { Modal } from './modal.js';

export class ReceiptGenerator {
  static showReceipt(deposit) {
    const dateFormatted = new Date(deposit.transaction_date).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const itemsHtml = deposit.details.map(item => `
      <div class="receipt-row">
        <span>${item.waste_name.split('(')[0].trim()}</span>
        <span>${item.weight} kg × ${item.price_per_kg.toLocaleString('id-ID')}</span>
      </div>
      <div class="receipt-row" style="color: #64748B; font-size: 0.72rem; padding-left: 8px;">
        <span>Subtotal</span>
        <span>Rp${item.subtotal.toLocaleString('id-ID')}</span>
      </div>
    `).join('');

    const htmlContent = `
      <div class="receipt-paper" id="printable-receipt-area">
        <div class="receipt-header">
          <div style="font-size: 1.25rem; margin-bottom: 2px;">♻</div>
          <div class="receipt-title">BANK SAMPAH BERKASIH</div>
          <div class="receipt-sub">Bersama Karyamulya Bersih</div>
          <div class="receipt-sub">Kel. Karyamulya, Kec. Kesambi, Kota Cirebon</div>
          <div class="receipt-sub">Telp: 0812-2233-4455 | pos.karyamulya.id</div>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-row">
          <span>No. Struk:</span>
          <strong>${deposit.id}</strong>
        </div>
        <div class="receipt-row">
          <span>Waktu:</span>
          <span>${dateFormatted}</span>
        </div>
        <div class="receipt-row">
          <span>Nasabah:</span>
          <strong>${deposit.customer_name || 'Nasabah Warga'}</strong>
        </div>
        <div class="receipt-row">
          <span>Status:</span>
          <span style="color: #16A34A; font-weight: 700;">${deposit.status}</span>
        </div>

        <div class="receipt-divider"></div>

        <div style="font-weight: 700; margin-bottom: 6px; font-size: 0.72rem; color: #475569;">
          RINCIAN SETORAN SAMPAH
        </div>
        ${itemsHtml}

        <div class="receipt-divider"></div>

        <div class="receipt-row">
          <span>Total Berat:</span>
          <strong>${deposit.total_weight} kg</strong>
        </div>
        <div class="receipt-total-row">
          <span>TOTAL TABUNGAN:</span>
          <span style="color: #15803D;">Rp${deposit.total_value.toLocaleString('id-ID')}</span>
        </div>

        <div class="receipt-divider"></div>

        <div style="text-align: center; margin-top: 12px;">
          <!-- SVG QR Code Simulation -->
          <svg width="84" height="84" viewBox="0 0 100 100" style="margin: 0 auto; display: block;" fill="#1E293B">
            <rect x="0" y="0" width="100" height="100" fill="#FFFFFF"/>
            <!-- Top Left Finder Pattern -->
            <rect x="5" y="5" width="30" height="30" fill="#14532D"/>
            <rect x="10" y="10" width="20" height="20" fill="#FFFFFF"/>
            <rect x="15" y="15" width="10" height="10" fill="#14532D"/>
            <!-- Top Right Finder Pattern -->
            <rect x="65" y="5" width="30" height="30" fill="#14532D"/>
            <rect x="70" y="10" width="20" height="20" fill="#FFFFFF"/>
            <rect x="75" y="15" width="10" height="10" fill="#14532D"/>
            <!-- Bottom Left Finder Pattern -->
            <rect x="5" y="65" width="30" height="30" fill="#14532D"/>
            <rect x="10" y="70" width="20" height="20" fill="#FFFFFF"/>
            <rect x="15" y="75" width="10" height="10" fill="#14532D"/>
            <!-- Data Dots -->
            <rect x="42" y="10" width="8" height="8" fill="#14532D"/>
            <rect x="42" y="24" width="8" height="8" fill="#14532D"/>
            <rect x="52" y="18" width="8" height="8" fill="#14532D"/>
            <rect x="10" y="45" width="8" height="8" fill="#14532D"/>
            <rect x="22" y="52" width="8" height="8" fill="#14532D"/>
            <rect x="45" y="45" width="12" height="12" fill="#22C55E"/>
            <rect x="65" y="45" width="8" height="8" fill="#14532D"/>
            <rect x="78" y="55" width="8" height="8" fill="#14532D"/>
            <rect x="45" y="70" width="8" height="8" fill="#14532D"/>
            <rect x="60" y="75" width="8" height="8" fill="#14532D"/>
            <rect x="75" y="70" width="8" height="8" fill="#14532D"/>
            <rect x="85" y="82" width="8" height="8" fill="#14532D"/>
          </svg>
          <div style="font-size: 0.65rem; color: #64748B; margin-top: 4px;">
            Verifikasi Digital: berkasih.id/verify/${deposit.id}
          </div>
          <div style="font-size: 0.68rem; color: #14532D; font-weight: 600; margin-top: 6px;">
            "Kelola Sampah. Simpan Nilai. Jaga Karyamulya."
          </div>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-outline" id="receipt-print-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Cetak Struk Digital
      </button>
      <button class="btn btn-primary" id="receipt-done-btn">Selesai</button>
    `;

    const modalInstance = Modal.open({
      title: 'Struk Bukti Setoran Sampah',
      content: htmlContent,
      footer: footerHtml,
      size: 'md'
    });

    const printBtn = modalInstance.element.querySelector('#receipt-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const doneBtn = modalInstance.element.querySelector('#receipt-done-btn');
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        modalInstance.close();
      });
    }
  }
}
