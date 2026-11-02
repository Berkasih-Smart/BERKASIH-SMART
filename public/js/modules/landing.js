/**
 * BERKASIH SMART - Public Landing Page Module
 * Bank Sampah BERKASIH (Bersama Karyamulya Bersih)
 * Kelurahan Karyamulya, Kota Cirebon
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';

export function renderLandingPage(container) {
  const wasteTypes = db.getWasteTypes ? db.getWasteTypes().filter(w => w.is_active !== false) : [];
  const customers = db.getCustomers ? db.getCustomers() : [];
  const deposits = db.getDeposits ? db.getDeposits() : [];
  const rwList = db.getRWList ? db.getRWList() : [];
  const programs = db.getPrograms ? db.getPrograms() : [];

  // Compute live aggregates
  const totalKg = deposits.reduce((sum, d) => sum + (Number(d.total_weight_kg) || 0), 0);
  const totalTons = (totalKg / 1000).toFixed(1);
  const totalCO2 = deposits.reduce((sum, d) => sum + (Number(d.total_co2_kg) || 0), 0).toFixed(0);
  const totalSavings = customers.reduce((sum, c) => sum + (Number(c.savings_balance) || 0), 0);
  const isAuthenticated = auth.isAuthenticated();
  const currentUser = auth.getCurrentUser();

  container.innerHTML = `
    <div style="background-color: #F8FAF8; color: #17201A; font-family: inherit; min-height: 100vh;">

      <!-- 1. PUBLIC TOP NAVIGATION -->
      <nav style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--color-border); padding: 12px 24px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px;">

          <!-- Logo & Brand -->
          <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" onclick="window.location.hash='#landing'">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #14532D, #22C55E); display: flex; align-items: center; justify-content: center; color: #FFFFFF; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.25);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                <path d="M11 19h8.2a1.8 1.8 0 0 0 1.565-.89 1.78 1.78 0 0 0 .005-1.78L16.82 9.5"></path>
                <path d="m11 5 1.5-3 1.5 3"></path>
                <path d="M2.5 13 4 10l1.5 3"></path>
                <path d="M21.5 13 20 10l-1.5 3"></path>
              </svg>
            </div>
            <div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #14532D; line-height: 1.1;">BERKASIH SMART</div>
              <div style="font-size: 0.7rem; color: var(--color-text-muted);">Bank Sampah Karyamulya Cirebon</div>
            </div>
          </div>

          <!-- Nav Links (Desktop) -->
          <div class="hidden-mobile" style="display: flex; align-items: center; gap: 24px; font-size: 0.85rem; font-weight: 600;">
            <a href="#katalog-harga" style="color: var(--color-text-secondary); text-decoration: none;">Katalog Harga</a>
            <a href="#cara-kerja" style="color: var(--color-text-secondary); text-decoration: none;">Alur Setor</a>
            <a href="#dampak" style="color: var(--color-text-secondary); text-decoration: none;">Dampak Lingkungan</a>
            <a href="#jadwal" style="color: var(--color-text-secondary); text-decoration: none;">Jadwal & Lokasi</a>
          </div>

          <!-- Right Action: Login / Dashboard -->
          <div>
            ${isAuthenticated ? `
              <a href="${currentUser?.role === 'CUSTOMER' ? '#customer-portal' : '#dashboard'}" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.85rem; font-weight: 700; text-decoration: none;">
                Buka Dashboard
              </a>
            ` : `
              <a href="#login" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.85rem; font-weight: 700; text-decoration: none;">
                Masuk Sistem
              </a>
            `}
          </div>
        </div>
      </nav>

      <!-- 2. HERO SECTION -->
      <section style="padding: 64px 24px 48px; max-width: 1200px; margin: 0 auto; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #DCFCE7; border: 1px solid #BBF7D0; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; color: #15803D; margin-bottom: 20px;">
          <span>🌱</span>
          <span>Inisiatif Digital Lingkungan & Ekonomi Sirkular Kelurahan Karyamulya</span>
        </div>

        <h1 style="font-size: 2.5rem; font-weight: 900; color: #14532D; line-height: 1.2; margin: 0 auto 16px; max-width: 820px; letter-spacing: -0.02em;">
          Ubah Sampah Terpilah Jadi Berkah & Saldo Nyata di Karyamulya
        </h1>

        <p style="font-size: 1.05rem; color: #4B5563; max-width: 680px; margin: 0 auto 32px; line-height: 1.6;">
          Platform digital Bank Sampah BERKASIH. Timbang sampah anorganik Anda secara transparan, kumpulkan saldo tabungan digital, dan bersama wujudkan Kota Cirebon yang asri serta minim residu.
        </p>

        <!-- CTA Buttons -->
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 56px;">
          <a href="#katalog-harga" class="btn btn-primary" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 700; text-decoration: none; box-shadow: 0 4px 14px rgba(20, 83, 45, 0.25);">
            Cek Harga Sampah Hari Ini
          </a>
          <a href="#login" class="btn btn-secondary" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 700; text-decoration: none;">
            ${isAuthenticated ? 'Masuk ke Portal Saya' : 'Masuk Akun Petugas / Warga'}
          </a>
        </div>

        <!-- 3. LIVE HIGHLIGHT METRICS STATS -->
        <div id="dampak" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; text-align: left;">
          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 6px;">Total Sampah Teralihkan</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #14532D;">${totalTons} <span style="font-size: 1rem; font-weight: 600;">Ton</span></div>
            <div style="font-size: 0.72rem; color: #15803D; font-weight: 600; margin-top: 4px;">Dari TPA Kopiluhur Cirebon</div>
          </div>

          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 6px;">Reduksi Emisi Karbon</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0284C7;">${Number(totalCO2).toLocaleString('id-ID')} <span style="font-size: 1rem; font-weight: 600;">kg CO₂</span></div>
            <div style="font-size: 0.72rem; color: #0369A1; font-weight: 600; margin-top: 4px;">Jejak keberlanjutan terverifikasi</div>
          </div>

          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 6px;">Nasabah Warga Aktif</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #15803D;">${customers.length} <span style="font-size: 1rem; font-weight: 600;">Keluarga</span></div>
            <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 4px;">Tersebar di 15 RW Karyamulya</div>
          </div>

          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 6px;">Total Saldo Warga Beredar</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #D97706;">Rp${(totalSavings / 1000).toFixed(0)}k</div>
            <div style="font-size: 0.72rem; color: #B45309; font-weight: 600; margin-top: 4px;">Tersimpan aman & likuid</div>
          </div>
        </div>
      </section>

      <!-- 4. LIVE PRICING CATALOG -->
      <section id="katalog-harga" style="padding: 64px 24px; background: #FFFFFF; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 40px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #15803D; text-transform: uppercase; letter-spacing: 0.05em;">Katalog Transparan</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: #14532D; margin: 6px 0 10px;">Daftar Harga Beli Sampah Terpilah Hari Ini</h2>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); max-width: 600px; margin: 0 auto;">
              Harga resmi loket Bank Sampah BERKASIH Karyamulya per kilogram. Dipelihara langsung sesuai harga pasar sirkularitas terverifikasi.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px;">
            ${wasteTypes.map(item => `
              <div style="background: #F9FAFB; border: 1px solid var(--color-border); border-radius: 14px; padding: 20px; transition: transform 0.2s ease, box-shadow 0.2s ease; display: flex; flex-col; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background-color: #DCFCE7; color: #15803D;">
                      ${item.category}
                    </span>
                    <span style="font-size: 0.72rem; color: var(--color-text-muted);">Per ${item.unit}</span>
                  </div>
                  <h3 style="font-size: 1.05rem; font-weight: 700; color: #17201A; margin: 0 0 6px;">${item.name}</h3>
                  <p style="font-size: 0.78rem; color: var(--color-text-secondary); line-height: 1.4; margin: 0 0 16px;">${item.description || 'Material daur ulang bersih, kering, dan terpilah.'}</p>
                </div>

                <div style="border-top: 1px dashed var(--color-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
                  <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600;">Nilai Tukar:</span>
                  <span style="font-size: 1.25rem; font-weight: 900; color: #15803D;">Rp${item.current_price_per_kg.toLocaleString('id-ID')}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 5. ALUR KERJA 4 LANGKAH -->
      <section id="cara-kerja" style="padding: 64px 24px; max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 48px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: #15803D; text-transform: uppercase; letter-spacing: 0.05em;">Proses Mudah & Bersih</span>
          <h2 style="font-size: 1.8rem; font-weight: 800; color: #14532D; margin: 6px 0 10px;">4 Langkah Menabung Sampah di BERKASIH SMART</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 26px; position: relative;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; margin-bottom: 16px;">
              1
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #17201A; margin: 0 0 8px;">Pilah di Rumah</h3>
            <p style="font-size: 0.82rem; color: #4B5563; line-height: 1.5; margin: 0;">
              Pisahkan sampah anorganik (botol plastik, kardus, kaleng, jelantah) dalam kondisi bersih dan kering dari rumah tangga Anda.
            </p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 26px; position: relative;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; margin-bottom: 16px;">
              2
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #17201A; margin: 0 0 8px;">Loket atau Jemput</h3>
            <p style="font-size: 0.82rem; color: #4B5563; line-height: 1.5; margin: 0;">
              Antar langsung ke Loket Induk Karyamulya atau hubungi tim armada ritase lingkungan kami untuk penjemputan di RW Anda.
            </p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 26px; position: relative;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; margin-bottom: 16px;">
              3
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #17201A; margin: 0 0 8px;">Timbang Digital</h3>
            <p style="font-size: 0.82rem; color: #4B5563; line-height: 1.5; margin: 0;">
              Petugas melakukan penimbangan digital presisi dengan nota setoran otomatis yang tercatat real-time di sistem buku tabungan.
            </p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; padding: 26px; position: relative;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; margin-bottom: 16px;">
              4
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #17201A; margin: 0 0 8px;">Saldo Likuid</h3>
            <p style="font-size: 0.82rem; color: #4B5563; line-height: 1.5; margin: 0;">
              Saldo tabungan bertambah seketika. Dapat ditarik tunai, transfer, ditukar sembako, atau dialokasikan untuk program qurban.
            </p>
          </div>
        </div>
      </section>

      <!-- 6. JADWAL & LOKASI -->
      <section id="jadwal" style="padding: 64px 24px; background: #FFFFFF; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; align-items: center;">
          <div>
            <span style="font-size: 0.8rem; font-weight: 700; color: #15803D; text-transform: uppercase; letter-spacing: 0.05em;">Operasional & Layanan</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: #14532D; margin: 6px 0 14px;">Siap Melayani 15 Rukun Warga di Kelurahan Karyamulya</h2>
            <p style="font-size: 0.88rem; color: #4B5563; line-height: 1.6; margin-bottom: 24px;">
              Loket induk beroperasi terpusat dengan fasilitas timbangan tersertifikasi dan armada roda tiga yang melayani penjemputan terjadwal per wilayah RT/RW.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">📍</div>
                <div>
                  <strong style="font-size: 0.88rem; color: #17201A; display: block;">Loket Induk Bank Sampah BERKASIH</strong>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted);">Jl. Majalengka No. 12, Kelurahan Karyamulya, Kec. Kesambi, Kota Cirebon, Jawa Barat 45131</span>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #DCFCE7; color: #14532D; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">⏰</div>
                <div>
                  <strong style="font-size: 0.88rem; color: #17201A; display: block;">Jam Operasional Loket</strong>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted);">Senin – Sabtu: Pukul 08.00 – 15.00 WIB (Minggu & Libur Nasional Tutup)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RW Coverage Pills Card -->
          <div style="background: #F8FAF8; border: 1px solid var(--color-border); border-radius: 16px; padding: 28px;">
            <div style="font-size: 0.95rem; font-weight: 700; color: #14532D; margin-bottom: 12px;">Cakupan Wilayah Layanan RW:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
              ${rwList.slice(0, 15).map(rw => `
                <span style="display: inline-block; padding: 4px 10px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #374151;">
                  ${rw.name || rw.id}
                </span>
              `).join('')}
            </div>
            <div style="padding: 12px 14px; background: #DCFCE7; border-radius: 8px; font-size: 0.78rem; color: #14532D; line-height: 1.4;">
              💡 <strong>Ingin mendaftarkan unit RT/RW Anda?</strong> Hubungi pengurus kami saat jam operasional loket atau ajukan melalui formulir pendaftaran warga.
            </div>
          </div>
        </div>
      </section>

      <!-- 7. FOOTER -->
      <footer style="padding: 40px 24px; background: #14532D; color: #FFFFFF;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 20px;">
          <div>
            <div style="font-size: 1.1rem; font-weight: 800; letter-spacing: -0.01em;">BERKASIH SMART</div>
            <div style="font-size: 0.78rem; opacity: 0.8; margin-top: 4px;">Bank Sampah Bersama Karyamulya Bersih • Kota Cirebon</div>
            <div style="font-size: 0.72rem; opacity: 0.6; margin-top: 2px;">Didukung oleh Kelurahan Karyamulya, Kecamatan Kesambi</div>
          </div>

          <div style="display: flex; gap: 16px; font-size: 0.82rem;">
            <a href="#katalog-harga" style="color: #FFFFFF; opacity: 0.85; text-decoration: none;">Harga Sampah</a>
            <a href="#login" style="color: #FFFFFF; opacity: 0.85; text-decoration: none;">Portal Petugas & Warga</a>
          </div>
        </div>

        <div style="max-width: 1200px; margin: 24px auto 0; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.72rem; opacity: 0.65; text-align: center;">
          &copy; ${new Date().getFullYear()} BERKASIH SMART. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>

    </div>
  `;
}
