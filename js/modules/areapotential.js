/**
 * BERKASIH SMART - Area Potential Engine Module
 * Implements Section 18 (Transparent Area Expansion Scoring & Decision Support)
 */

import { db } from '../db/schema.js';

export function renderAreaPotential(container) {
  const rwList = db.getRWList();

  // Calculate potential score for each unserved/partially served RW
  const areaAnalysis = rwList.map(rw => {
    const penetrationRate = (rw.active_customers / rw.households) * 100;
    
    // Scoring criteria (0-100)
    const popScore = Math.min(100, Math.round((rw.population / 2100) * 100));
    const unservedScore = Math.max(0, Math.round((100 - penetrationRate * 5)));
    const accessScore = rw.id === 'RW-06' ? 85 : rw.id === 'RW-12' ? 70 : rw.id === 'RW-14' ? 65 : 80;

    const overallPriority = Math.round((popScore * 0.4) + (unservedScore * 0.4) + (accessScore * 0.2));

    let priorityLevel = 'Rendah';
    let badgeClass = 'badge-inactive';
    if (overallPriority >= 75) {
      priorityLevel = 'Prioritas Tinggi';
      badgeClass = 'badge-declining';
    } else if (overallPriority >= 60) {
      priorityLevel = 'Prioritas Sedang';
      badgeClass = 'badge-attention';
    }

    return {
      ...rw,
      penetrationRate: penetrationRate.toFixed(1),
      popScore,
      unservedScore,
      accessScore,
      overallPriority,
      priorityLevel,
      badgeClass
    };
  }).sort((a, b) => b.overallPriority - a.overallPriority);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>BERKASIH AREA POTENTIAL</span>
          <span class="badge badge-demo">DECISION SUPPORT</span>
        </h1>
        <p class="page-subtitle">Mesin analisis identifikasi wilayah berpotensi untuk ekspansi titik jemput dan sosialisasi nasabah baru.</p>
      </div>

      <div class="page-actions">
        <span class="badge badge-healthy" style="font-size: 0.75rem;">
          Human-in-the-Loop: Rekomendasi Pengambilan Keputusan
        </span>
      </div>
    </div>

    <!-- Explanatory Banner (Rule #18) -->
    <div class="alert-banner alert-info" style="margin-bottom: var(--space-5);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <div>
        <strong>Prinsip Integritas Analitik:</strong> Mesin ini tidak menetapkan "lokasi mutlak terbaik", melainkan menyajikan 
        <em>Indikator Prioritas Wilayah (Area Priority Indicator)</em> dengan pembobotan multi-kriteria transparan guna mendukung keputusan musyawarah pengurus.
      </div>
    </div>

    <!-- Top Identified Priority Areas -->
    <div class="grid grid-cols-2" style="margin-bottom: var(--space-6);">
      <!-- Area 1: RW 06 Kayuwalang Baru -->
      <div class="card" style="border-left: 4px solid #D97706;">
        <div class="card-header">
          <div>
            <div class="card-title">RW 06 Kayuwalang Baru</div>
            <div style="font-size: 0.72rem; color: #6B7280;">Skor Indikator Prioritas: 84 / 100</div>
          </div>
          <span class="badge badge-declining">Prioritas Tinggi</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom: 12px;">
            <strong style="font-size: 0.8rem; color: #14532D;">Mengapa wilayah ini diidentifikasi?</strong>
            <div style="font-size: 0.78rem; line-height: 1.6; color: #374151; margin-top: 4px;">
              • <strong>Populasi:</strong> Sangat Tinggi (2.100 jiwa / 580 KK) — populasi terbesar di Karyamulya.<br/>
              • <strong>Penetrasi Saat Ini:</strong> Rendah (hanya 3.1% KK yang terdaftar).<br/>
              • <strong>Aktivitas Terkini:</strong> Mengalami penurunan frekuensi setor -38.5% dalam 30 hari terakhir.<br/>
              • <strong>Aksesibilitas Armada:</strong> Tinggi (jalan utama dapat dilalui armada roda tiga).
            </div>
          </div>

          <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px; font-size: 0.75rem;">
            <div style="font-weight: 700; color: #166534; margin-bottom: 2px;">Rekomendasi Pertimbangan (Actionable Consideration):</div>
            <div style="color: #15803D;">
              Pertimbangkan pembukaan pos setor berkala setiap Sabtu pekan ke-2 & 4 di Balai Warga RW 06 atau kemitraan dengan kader PKK setempat.
            </div>
          </div>
        </div>
      </div>

      <!-- Area 2: RW 12 Bukit Kayuwalang -->
      <div class="card" style="border-left: 4px solid #DC2626;">
        <div class="card-header">
          <div>
            <div class="card-title">RW 12 Bukit Kayuwalang</div>
            <div style="font-size: 0.72rem; color: #6B7280;">Skor Indikator Prioritas: 79 / 100</div>
          </div>
          <span class="badge badge-risk">Prioritas Tinggi (Unserved)</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom: 12px;">
            <strong style="font-size: 0.8rem; color: #14532D;">Mengapa wilayah ini diidentifikasi?</strong>
            <div style="font-size: 0.78rem; line-height: 1.6; color: #374151; margin-top: 4px;">
              • <strong>Populasi:</strong> Tinggi (1.540 jiwa / 410 KK).<br/>
              • <strong>Penetrasi Saat Ini:</strong> Sangat Rendah (0.9% KK / 4 nasabah).<br/>
              • <strong>Status Layanan:</strong> Belum terlayani (UNSERVED) — jarak ke Pos Pusat 1.8 km.<br/>
              • <strong>Aksesibilitas:</strong> Sedang (perbukitan dengan akses jalan aspal mulus).
            </div>
          </div>

          <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px; font-size: 0.75rem;">
            <div style="font-weight: 700; color: #166534; margin-bottom: 2px;">Rekomendasi Pertimbangan (Actionable Consideration):</div>
            <div style="color: #15803D;">
              Jadwalkan sosialisasi perdana bersama Ketua RT/RW 12 dan uji coba rute penjemputan keliling 2 minggu sekali.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Evaluation Table for All 15 RWs -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Tabel Matriks Analisis Potensi 15 RW Kelurahan Karyamulya</div>
        <span style="font-size: 0.75rem; color: #6B7280;">Berdasarkan Data Kependudukan & Riwayat Setoran</span>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Wilayah RW</th>
              <th>Populasi</th>
              <th>Kepala Keluarga</th>
              <th>Nasabah Terdaftar</th>
              <th>Tingkat Penetrasi</th>
              <th>Status Layanan</th>
              <th>Skor Prioritas</th>
              <th style="text-align: right;">Kategori Prioritas</th>
            </tr>
          </thead>
          <tbody>
            ${areaAnalysis.map(a => `
              <tr>
                <td><strong>${a.name}</strong></td>
                <td>${a.population.toLocaleString('id-ID')} jiwa</td>
                <td>${a.households} KK</td>
                <td><strong>${a.active_customers}</strong></td>
                <td>${a.penetrationRate}%</td>
                <td><span class="badge ${a.coverage_status === 'SERVED' ? 'badge-healthy' : a.coverage_status === 'PARTIAL' ? 'badge-attention' : 'badge-risk'}">${a.coverage_status}</span></td>
                <td>
                  <div class="flex items-center gap-2">
                    <strong style="color: #14532D;">${a.overallPriority}</strong>
                    <div style="width: 60px; height: 6px; background: #E2E8F0; border-radius: 99px; overflow: hidden;">
                      <div style="width: ${a.overallPriority}%; height: 100%; background: ${a.overallPriority > 75 ? '#D97706' : '#22C55E'};"></div>
                    </div>
                  </div>
                </td>
                <td style="text-align: right;">
                  <span class="badge ${a.badgeClass}">${a.priorityLevel}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
