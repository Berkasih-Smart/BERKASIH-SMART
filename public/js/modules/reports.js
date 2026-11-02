/**
 * BERKASIH SMART - Reporting & Data Export Center Module
 * Implements Section 32 (10 Standard Reports & AI Draft Verification) and Section 33 (Data Export)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';

export function renderReports(container) {
  const user = auth.getCurrentUser();
  const deposits = db.getDeposits();
  const customers = db.getCustomers();
  const inventory = db.getInventory();
  const sales = db.getSales();
  const impact = db.getEnvironmentalImpact();

  const standardReports = [
    { id: 'rep-01', title: '1. Laporan Bulanan Bank Sampah', desc: 'Rekapitulasi komprehensif seluruh transaksi, nasabah, dan kas bulan berjalan.' },
    { id: 'rep-02', title: '2. Laporan Pengumpulan Sampah', desc: 'Rincian volume penimbangan menurut 10 jenis kategori material terpilah.' },
    { id: 'rep-03', title: '3. Laporan Aktivitas Nasabah', desc: 'Segmentasi status nasabah aktif, declining, at risk, dan sebaran 15 RW.' },
    { id: 'rep-04', title: '4. Laporan Simpanan Tabungan', desc: 'Buku besar liabilitas tabungan dan mutasi saldo nasabah terverifikasi.' },
    { id: 'rep-05', title: '5. Laporan Pencairan Dana (Withdrawals)', desc: 'Daftar penarikan saldo tunai dan riwayat otorisasi manajerial.' },
    { id: 'rep-06', title: '6. Laporan Stok Gudang (Inventory)', desc: 'Kondisi fisik material tersimpan, kapasitas gudang, dan status alert.' },
    { id: 'rep-07', title: '7. Laporan Penjualan ke Offtaker', desc: 'Rekapitulasi penjualan ke industri daur ulang dan nilai pendapatan kas.' },
    { id: 'rep-08', title: '8. Laporan Dampak Lingkungan (Impact)', desc: 'Pengurangan emisi CO2e, ruang TPA Kopiluhur, dan sertifikasi keberlanjutan.' },
    { id: 'rep-09', title: '9. Laporan Program & Kampanye', desc: 'Hasil evaluasi capaian Tantangan Komunitas RW dan workshop warga.' },
    { id: 'rep-10', title: '10. Ringkasan Eksekutif Pengurus (Executive Summary)', desc: 'Ringkasan tingkat tinggi siap presentasi untuk Kelurahan, DLH, dan mitra CSR.' }
  ];

  let selectedReportId = 'rep-01';

  const renderReportPreview = (reportId) => {
    const rep = standardReports.find(r => r.id === reportId) || standardReports[0];

    return `
      <div class="card" id="report-view-container">
        <div class="card-header" style="background-color: #F8FAF8;">
          <div>
            <div class="card-title">${rep.title}</div>
            <div style="font-size: 0.72rem; color: #6B7280;">${rep.desc}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-outline" id="btn-export-csv">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Ekspor CSV
            </button>
            <button class="btn btn-sm btn-outline" id="btn-export-json">
              JSON
            </button>
            <button class="btn btn-sm btn-primary" id="btn-print-report">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Cetak / PDF
            </button>
          </div>
        </div>

        <div class="card-body" id="printable-report-body" style="font-size: 0.82rem; line-height: 1.6;">
          <!-- Official Report Header Metadata (Section 33) -->
          <div style="border-bottom: 2px solid #14532D; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #14532D;">BANK SAMPAH BERKASIH (Bersama Karyamulya Bersih)</div>
              <div style="font-size: 0.75rem; color: #4B5563;">Kelurahan Karyamulya, Kecamatan Kesambi, Kota Cirebon, Jawa Barat</div>
              <div style="font-size: 0.72rem; color: #6B7280;">Sistem Informasi BERKASIH SMART • Kode Instansi: BS-CRB-KM-01</div>
            </div>
            <div style="text-align: right; font-size: 0.72rem; color: #64748B;">
              <div>Waktu Dibuat: <strong>${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</strong></div>
              <div>Oleh: <strong>${user.name || 'Pengurus'} (${auth.getRole()})</strong></div>
              <div>Status Data: <span class="badge badge-demo" style="font-size: 0.6rem;">DEMO DATA</span></div>
            </div>
          </div>

          <!-- Section 32 AI-Generated Draft Notice -->
          <div class="alert-banner alert-warning" style="margin-bottom: 16px; padding: 10px 14px;">
            <div style="font-size: 0.75rem;">
              <strong>Pemberitahuan Kepatuhan:</strong> <span class="badge" style="background:#FEF3C7; color:#92400E; font-size: 0.68rem; font-weight: 700;">AI-generated draft — requires human verification</span><br/>
              Draf narasi dan ringkasan eksekutif ini disusun secara otomatis oleh BERKASIH AI berdasarkan basis data operasional terverifikasi dan memerlukan tanda tangan pengurus sebelum dipublikasikan.
            </div>
          </div>

          <!-- Executive Summary Content -->
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #14532D; margin-bottom: 8px;">
              I. Ringkasan Eksekutif Operasional
            </h3>
            <p style="color: #374151; margin-bottom: 12px;">
              Sepanjang periode berjalan, Bank Sampah BERKASIH mencatat total pengumpulan <strong>${deposits.reduce((sum, d) => sum + (d.total_weight || 0), 0).toFixed(1)} kg</strong> sampah anorganik dan organik bernilai dari <strong>${customers.length} nasabah</strong> di 15 RW Kelurahan Karyamulya. Total tabungan yang disalurkan kembali kepada masyarakat mencapai <strong>Rp${customers.reduce((sum, c) => sum + (c.savings_balance || 0), 0).toLocaleString('id-ID')}</strong>.
            </p>

            <div class="grid grid-cols-4" style="gap: 12px; margin-bottom: 20px;">
              <div style="background: #F8FAF8; padding: 10px; border-radius: 6px; border: 1px solid var(--color-border);">
                <div style="font-size: 0.7rem; color: #64748B;">Total Setoran</div>
                <strong style="font-size: 1.1rem; color: #14532D;">${deposits.length} Transaksi</strong>
              </div>
              <div style="background: #F8FAF8; padding: 10px; border-radius: 6px; border: 1px solid var(--color-border);">
                <div style="font-size: 0.7rem; color: #64748B;">Total Berat</div>
                <strong style="font-size: 1.1rem; color: #15803D;">${deposits.reduce((sum, d) => sum + (d.total_weight || 0), 0).toFixed(1)} kg</strong>
              </div>
              <div style="background: #F8FAF8; padding: 10px; border-radius: 6px; border: 1px solid var(--color-border);">
                <div style="font-size: 0.7rem; color: #64748B;">Penjualan Offtaker</div>
                <strong style="font-size: 1.1rem; color: #2563EB;">Rp${sales.reduce((sum, s) => sum + (s.total_value || 0), 0).toLocaleString('id-ID')}</strong>
              </div>
              <div style="background: #F8FAF8; padding: 10px; border-radius: 6px; border: 1px solid var(--color-border);">
                <div style="font-size: 0.7rem; color: #64748B;">Emisi Ditekan</div>
                <strong style="font-size: 1.1rem; color: #16A34A;">${impact.co2eSavedKg} kg CO2e</strong>
              </div>
            </div>
          </div>

          <!-- Section II: Table Data -->
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #14532D; margin-bottom: 8px;">
              II. Rincian Data Transaksi Terkait
            </h3>
            <table class="table" style="font-size: 0.78rem;">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Entitas / Nasabah</th>
                  <th>Kuantitas / Nilai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${deposits.slice(0, 5).map(d => `
                  <tr>
                    <td><code>${d.id}</code></td>
                    <td>${new Date(d.transaction_date).toLocaleDateString('id-ID')}</td>
                    <td>${d.customer_name || 'Nasabah Warga'}</td>
                    <td><strong>${d.total_weight} kg</strong> (Rp${d.total_value.toLocaleString('id-ID')})</td>
                    <td><span class="badge badge-completed">${d.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Official Signatures Footer -->
          <div style="margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 0.78rem;">
            <div style="width: 200px;">
              <div>Mengetahui,</div>
              <div style="font-weight: 700; margin-bottom: 50px;">Lurah Karyamulya</div>
              <div style="border-top: 1px solid #334155; padding-top: 4px; font-weight: 700;">( .................................... )</div>
              <div style="font-size: 0.7rem; color: #64748B;">NIP. 19780512 200501 1 004</div>
            </div>

            <div style="width: 200px;">
              <div>Cirebon, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
              <div style="font-weight: 700; margin-bottom: 50px;">Ketua Bank Sampah BERKASIH</div>
              <div style="border-top: 1px solid #334155; padding-top: 4px; font-weight: 700;">Hendra Gunawan, S.T.</div>
              <div style="font-size: 0.7rem; color: #64748B;">Direktur Operasional</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>BERKASIH REPORT CENTER</span>
          <span class="badge badge-demo">LAPORAN & EKSPOR</span>
        </h1>
        <p class="page-subtitle">Pusat dokumentasi 10 format laporan standar, audit trail ekspor, dan pencetakan resmi.</p>
      </div>

      <div class="page-actions">
        <span class="badge badge-healthy" style="font-size: 0.75rem;">
          Format: CSV, JSON, Cetak PDF Resmi
        </span>
      </div>
    </div>

    <!-- Layout: Left Report Selector + Right Preview -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: var(--space-5);">
      <!-- Left: 10 Standard Reports Menu -->
      <div class="card" style="padding: 12px;">
        <div style="font-size: 0.72rem; font-weight: 700; color: #9CA3AF; letter-spacing: 0.05em; padding: 6px 12px;">
          10 FORMAT LAPORAN RESMI
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;" id="reports-nav-list">
          ${standardReports.map(r => `
            <button 
              class="btn-ghost report-menu-item ${r.id === selectedReportId ? 'active' : ''}" 
              data-id="${r.id}"
              style="
                text-align: left;
                padding: 10px 12px;
                border-radius: 8px;
                font-size: 0.78rem;
                display: flex;
                flex-direction: column;
                gap: 2px;
                ${r.id === selectedReportId ? 'background-color: #DCFCE7; color: #14532D; font-weight: 600;' : 'color: #374151;'}
              "
            >
              <span style="font-weight: 600;">${r.title}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Right: Report View Slot -->
      <div id="report-active-slot">
        ${renderReportPreview(selectedReportId)}
      </div>
    </div>
  `;

  const attachExportHandlers = () => {
    const csvBtn = container.querySelector('#btn-export-csv');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        downloadCSV(deposits, `BERKASIH_Laporan_${selectedReportId}_${new Date().toISOString().slice(0, 10)}.csv`);
      });
    }

    const jsonBtn = container.querySelector('#btn-export-json');
    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => {
        downloadJSON({ deposits, customers, inventory, sales, impact, metadata: { generated_by: user.name, date: new Date().toISOString() } }, `BERKASIH_Data_${new Date().toISOString().slice(0, 10)}.json`);
      });
    }

    const printBtn = container.querySelector('#btn-print-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  };

  attachExportHandlers();

  // Menu Selection Listener
  container.querySelectorAll('.report-menu-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedReportId = e.currentTarget.dataset.id;
      container.querySelectorAll('.report-menu-item').forEach(b => {
        b.style.backgroundColor = 'transparent';
        b.style.color = '#374151';
        b.style.fontWeight = '500';
      });
      e.currentTarget.style.backgroundColor = '#DCFCE7';
      e.currentTarget.style.color = '#14532D';
      e.currentTarget.style.fontWeight = '600';

      const slot = container.querySelector('#report-active-slot');
      if (slot) {
        slot.innerHTML = renderReportPreview(selectedReportId);
        attachExportHandlers();
      }
    });
  });
}

function downloadCSV(dataArray, filename) {
  if (!dataArray || dataArray.length === 0) return;
  const headers = Object.keys(dataArray[0]).filter(k => typeof dataArray[0][k] !== 'object');
  const rows = dataArray.map(obj => headers.map(h => `"${String(obj[h] || '').replace(/"/g, '""')}"`).join(','));
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadJSON(dataObject, filename) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObject, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
