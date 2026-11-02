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

  // Compute live aggregates from database
  const totalKg = deposits.reduce((sum, d) => sum + (Number(d.total_weight_kg) || 0), 0);
  const totalTons = (totalKg / 1000).toFixed(1);
  const totalCO2 = deposits.reduce((sum, d) => sum + (Number(d.total_co2_kg) || 0), 0).toFixed(0);
  const totalSavings = customers.reduce((sum, c) => sum + (Number(c.savings_balance) || 0), 0);
  const isAuthenticated = auth.isAuthenticated();
  const currentUser = auth.getCurrentUser();

  container.innerHTML = `
    <div style="background-color: #F8FAF8; color: #0F172A; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

      <!-- 1. PUBLIC TOP BAR -->
      <nav style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E8F0; padding: 14px 24px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px;">

          <!-- Logo & Brand -->
          <a href="#landing" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: linear-gradient(135deg, #14532D, #16A34A); display: flex; align-items: center; justify-content: center; color: #FFFFFF; flex-shrink: 0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                <path d="M11 19h8.2a1.8 1.8 0 0 0 1.565-.89 1.78 1.78 0 0 0 .005-1.78L16.82 9.5"></path>
                <path d="m11 5 1.5-3 1.5 3"></path>
                <path d="M2.5 13 4 10l1.5 3"></path>
                <path d="M21.5 13 20 10l-1.5 3"></path>
              </svg>
            </div>
            <div>
              <span style="font-size: 1.15rem; font-weight: 800; color: #14532D; line-height: 1.1; display: block; letter-spacing: -0.01em;">BERKASIH SMART</span>
              <span style="font-size: 0.72rem; color: #64748B; display: block;">Bank Sampah Karyamulya Cirebon</span>
            </div>
          </a>

          <!-- Navigation Links -->
          <div class="hidden-mobile" style="display: flex; align-items: center; gap: 28px; font-size: 0.88rem; font-weight: 600;">
            <a href="#katalog-harga" style="color: #334155; text-decoration: none;">Harga Sampah</a>
            <a href="#kalkulator" style="color: #334155; text-decoration: none;">Simulasi Saldo</a>
            <a href="#cara-kerja" style="color: #334155; text-decoration: none;">Alur Setor</a>
            <a href="#jadwal" style="color: #334155; text-decoration: none;">Jadwal & Lokasi</a>
          </div>

          <!-- Auth Actions -->
          <div style="display: flex; align-items: center; gap: 10px;">
            ${isAuthenticated ? `
              <a href="${currentUser?.role === 'CUSTOMER' ? '#customer-portal' : '#dashboard'}" class="btn btn-primary" style="min-height: 44px; padding: 10px 20px; font-size: 0.88rem; font-weight: 700; text-decoration: none; border-radius: 8px;">
                Buka Dashboard
              </a>
            ` : `
              <a href="#login" class="btn btn-primary" style="min-height: 44px; padding: 10px 20px; font-size: 0.88rem; font-weight: 700; text-decoration: none; border-radius: 8px;">
                Masuk Sistem
              </a>
            `}
          </div>
        </div>
      </nav>

      <!-- 2. HERO SECTION (Asymmetrical Civic Layout) -->
      <section style="padding: 48px 20px 40px; max-width: 1200px; margin: 0 auto; box-sizing: border-box;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 32px; align-items: center;">

          <!-- Left Column: Civic Editorial -->
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: #DCFCE7; border: 1px solid #BBF7D0; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; color: #15803D; margin-bottom: 20px;">
              <span>Wilayah Binaan RW 01 sampai RW 15 Kelurahan Karyamulya</span>
            </div>

            <h1 style="font-size: 2.4rem; font-weight: 900; color: #14532D; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.02em;">
              Tabung Sampah Terpilah, Panen Berkah dan Saldo Tunai
            </h1>

            <p style="font-size: 1rem; color: #334155; line-height: 1.65; margin: 0 0 28px; max-width: 540px;">
              Warga Karyamulya memilah dari rumah, timbang di loket RW atau minta jemput armada roda tiga. Saldo tabungan dapat dicairkan tunai, ditukar sembako, atau dialokasikan untuk qurban warga.
            </p>

            <div style="display: flex; gap: 14px; flex-wrap: wrap;">
              <a href="#katalog-harga" class="btn btn-primary" style="min-height: 44px; padding: 12px 24px; font-size: 0.92rem; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
                Cek Harga Beli Hari Ini
              </a>
              <a href="#kalkulator" class="btn btn-secondary" style="min-height: 44px; padding: 12px 24px; font-size: 0.92rem; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
                Hitung Potensi Saldo
              </a>
            </div>
          </div>

          <!-- Right Column: Live Grounded Metrics Board -->
          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 18px; padding: 28px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 14px; margin-bottom: 20px;">
              <div>
                <strong style="font-size: 0.92rem; color: #14532D; display: block;">Papan Catatan Warga Karyamulya</strong>
                <span style="font-size: 0.75rem; color: #64748B;">Data operasional terlacak langsung</span>
              </div>
              <span class="badge badge-healthy" style="font-size: 0.72rem;">Aktif Terverifikasi</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="padding: 14px; background: #F8FAF8; border-radius: 12px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.75rem; color: #64748B; font-weight: 600; margin-bottom: 4px;">Sampah Teralihkan</div>
                <div style="font-size: 1.6rem; font-weight: 900; color: #14532D;">${totalTons} <span style="font-size: 0.9rem; font-weight: 600;">Ton</span></div>
                <div style="font-size: 0.72rem; color: #15803D; margin-top: 2px;">Cegah timbunan TPA Kopiluhur</div>
              </div>

              <div style="padding: 14px; background: #F8FAF8; border-radius: 12px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.75rem; color: #64748B; font-weight: 600; margin-bottom: 4px;">Reduksi Karbon</div>
                <div style="font-size: 1.6rem; font-weight: 900; color: #0284C7;">${Number(totalCO2).toLocaleString('id-ID')} <span style="font-size: 0.85rem; font-weight: 600;">kg CO₂</span></div>
                <div style="font-size: 0.72rem; color: #0369A1; margin-top: 2px;">Serapan daur ulang terukur</div>
              </div>

              <div style="padding: 14px; background: #F8FAF8; border-radius: 12px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.75rem; color: #64748B; font-weight: 600; margin-bottom: 4px;">Keluarga Nasabah</div>
                <div style="font-size: 1.6rem; font-weight: 900; color: #15803D;">${customers.length} <span style="font-size: 0.9rem; font-weight: 600;">KK</span></div>
                <div style="font-size: 0.72rem; color: #64748B; margin-top: 2px;">Terdaftar di 15 RW</div>
              </div>

              <div style="padding: 14px; background: #F8FAF8; border-radius: 12px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.75rem; color: #64748B; font-weight: 600; margin-bottom: 4px;">Kas Tabungan Warga</div>
                <div style="font-size: 1.6rem; font-weight: 900; color: #B45309;">Rp${(totalSavings / 1000).toFixed(0)}rb</div>
                <div style="font-size: 0.72rem; color: #92400E; margin-top: 2px;">Hak nasabah siap cair</div>
              </div>
            </div>

            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; color: #64748B;">
              <span>Loket Induk: Jl. Majalengka No. 12</span>
              <a href="#jadwal" style="color: #15803D; font-weight: 700; text-decoration: none;">Jadwal Buka</a>
            </div>
          </div>

        </div>
      </section>

      <!-- 3. LIVE PRICING CATALOG -->
      <section id="katalog-harga" style="padding: 60px 24px; background: #FFFFFF; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 32px;">
            <div>
              <span style="font-size: 0.78rem; font-weight: 700; color: #15803D; text-transform: uppercase; letter-spacing: 0.04em;">Transparansi Nilai</span>
              <h2 style="font-size: 1.8rem; font-weight: 800; color: #14532D; margin: 4px 0 0; letter-spacing: -0.01em;">Daftar Harga Beli Sampah Terpilah</h2>
            </div>
            <p style="font-size: 0.86rem; color: #64748B; margin: 0; max-width: 480px;">
              Harga resmi loket Bank Sampah BERKASIH Karyamulya per kilogram. Ditimbang menggunakan timbangan digital terkalibrasi.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;">
            ${wasteTypes.map(item => `
              <div style="background: #F8FAF8; border: 1px solid #CBD5E1; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background-color: #DCFCE7; color: #15803D;">
                      ${item.category}
                    </span>
                    <span style="font-size: 0.74rem; color: #64748B;">Per ${item.unit}</span>
                  </div>
                  <h3 style="font-size: 1.05rem; font-weight: 700; color: #0F172A; margin: 0 0 6px;">${item.name}</h3>
                  <p style="font-size: 0.78rem; color: #475569; line-height: 1.45; margin: 0 0 16px;">${item.description || 'Material terpilah bersih dan kering.'}</p>
                </div>

                <div style="border-top: 1px dashed #CBD5E1; padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
                  <span style="font-size: 0.76rem; color: #64748B; font-weight: 600;">Nilai Pembelian:</span>
                  <span style="font-size: 1.25rem; font-weight: 900; color: #15803D;">Rp${item.current_price_per_kg.toLocaleString('id-ID')}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 4. REALTIME INTERACTIVE REVENUE CALCULATOR -->
      <section id="kalkulator" style="padding: 60px 24px; background: #F1F5F9;">
        <div style="max-width: 840px; margin: 0 auto; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 18px; padding: 32px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 0.78rem; font-weight: 700; color: #15803D; text-transform: uppercase;">Kalkulator Simulasi Warga</span>
            <h2 style="font-size: 1.6rem; font-weight: 800; color: #14532D; margin: 4px 0 8px;">Hitung Nilai Rupiah dari Sampah Anda</h2>
            <p style="font-size: 0.85rem; color: #64748B; margin: 0;">Pilih jenis sampah dan perkirakan berat yang Anda kumpulkan dari rumah tangga atau unit RT.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div>
              <label for="calc-waste-select" style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Pilih Jenis Sampah</label>
              <select id="calc-waste-select" class="form-input" style="height: 44px; font-size: 0.88rem; width: 100%;">
                ${wasteTypes.map(w => `
                  <option value="${w.id}" data-price="${w.current_price_per_kg}">${w.name} (Rp${w.current_price_per_kg.toLocaleString('id-ID')}/${w.unit})</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label for="calc-weight-input" style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Perkiraan Berat (kg)</label>
              <input type="number" id="calc-weight-input" class="form-input" min="1" max="1000" value="5" style="height: 44px; font-size: 0.88rem; width: 100%;" />
            </div>
          </div>

          <div style="background: #DCFCE7; border: 1px solid #BBF7D0; border-radius: 12px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-size: 0.78rem; color: #166534; font-weight: 600; display: block;">Estimasi Saldo Masuk Tabungan:</span>
              <strong id="calc-result-display" style="font-size: 1.8rem; font-weight: 900; color: #14532D;">Rp0</strong>
            </div>
            <a href="#login" class="btn btn-primary" style="min-height: 44px; padding: 10px 20px; font-size: 0.85rem; font-weight: 700; text-decoration: none; border-radius: 8px;">
              Buka Rekening Tabungan
            </a>
          </div>
        </div>
      </section>

      <!-- 5. ALUR SETOR 4 LANGKAH NYATA -->
      <section id="cara-kerja" style="padding: 60px 24px; max-width: 1200px; margin: 0 auto;">
        <div style="margin-bottom: 40px; text-align: center;">
          <span style="font-size: 0.78rem; font-weight: 700; color: #15803D; text-transform: uppercase;">Tata Cara Sederhana</span>
          <h2 style="font-size: 1.8rem; font-weight: 800; color: #14532D; margin: 4px 0 0;">Empat Langkah Setor Sampah di Karyamulya</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 14px; padding: 24px;">
            <div style="font-size: 1rem; font-weight: 900; color: #15803D; margin-bottom: 8px;">Langkah 1</div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin: 0 0 8px;">Pilah di Rumah</h3>
            <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0;">
              Pisahkan sampah anorganik kering (botol plastik, kardus, kaleng, jelantah) dari sampah organik sisa makanan.
            </p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 14px; padding: 24px;">
            <div style="font-size: 1rem; font-weight: 900; color: #15803D; margin-bottom: 8px;">Langkah 2</div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin: 0 0 8px;">Loket atau Armada Jemput</h3>
            <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0;">
              Bawa langsung ke Loket Induk Jl. Majalengka No. 12 atau tunggu jadwal ritase armada roda tiga di RT/RW Anda.
            </p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 14px; padding: 24px;">
            <div style="font-size: 1rem; font-weight: 900; color: #15803D; margin-bottom: 8px;">Langkah 3</div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin: 0 0 8px;">Timbang Digital</h3>
            <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0;">
              Petugas menimbang secara terbuka dengan timbangan digital dan mencatat nota setoran langsung ke sistem.
            </p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 14px; padding: 24px;">
            <div style="font-size: 1rem; font-weight: 900; color: #15803D; margin-bottom: 8px;">Langkah 4</div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin: 0 0 8px;">Saldo Bertambah</h3>
            <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0;">
              Saldo otomatis masuk buku tabungan nasabah. Dapat ditarik tunai sewaktu-waktu atau disimpan untuk qurban.
            </p>
          </div>
        </div>
      </section>

      <!-- 6. JADWAL, LOKASI & CAKUPAN 15 RW -->
      <section id="jadwal" style="padding: 60px 24px; background: #FFFFFF; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 36px;">
          <div>
            <span style="font-size: 0.78rem; font-weight: 700; color: #15803D; text-transform: uppercase;">Pusat Layanan Warga</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: #14532D; margin: 4px 0 16px;">Lokasi dan Jam Buka Loket Induk</h2>

            <div style="margin-bottom: 16px;">
              <strong style="font-size: 0.92rem; color: #0F172A; display: block;">Alamat Loket:</strong>
              <span style="font-size: 0.84rem; color: #475569; line-height: 1.5;">
                Jl. Majalengka No. 12, Kelurahan Karyamulya, Kecamatan Kesambi, Kota Cirebon, Jawa Barat 45131
              </span>
            </div>

            <div style="margin-bottom: 20px;">
              <strong style="font-size: 0.92rem; color: #0F172A; display: block;">Waktu Pelayanan:</strong>
              <span style="font-size: 0.84rem; color: #475569;">
                Senin sampai Sabtu, pukul 08.00 s/d 15.00 WIB (Minggu dan Hari Libur Nasional tutup).
              </span>
            </div>

            <a href="https://wa.me/6281234567890?text=Halo%20Pengurus%20Bank%20Sampah%20BERKASIH%20Karyamulya" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="min-height: 44px; padding: 10px 18px; font-size: 0.85rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
              Hubungi Pengurus via WhatsApp
            </a>
          </div>

          <!-- RW Coverage Grid -->
          <div style="background: #F8FAF8; border: 1px solid #CBD5E1; border-radius: 14px; padding: 24px;">
            <strong style="font-size: 0.92rem; color: #14532D; display: block; margin-bottom: 12px;">Daftar 15 Rukun Warga (RW) Wilayah Layanan:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
              ${rwList.slice(0, 15).map(rw => `
                <span style="display: inline-block; padding: 5px 10px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.76rem; font-weight: 600; color: #334155;">
                  ${rw.name || rw.id}
                </span>
              `).join('')}
            </div>
            <p style="font-size: 0.78rem; color: #64748B; margin: 0; line-height: 1.45;">
              Warga di seluruh RW di atas dapat mendaftar menjadi nasabah perorangan atau membentuk bank sampah unit RT/komunitas.
            </p>
          </div>
        </div>
      </section>

      <!-- 7. FOOTER -->
      <footer style="padding: 40px 24px; background: #14532D; color: #FFFFFF;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.01em;">BERKASIH SMART</div>
            <div style="font-size: 0.78rem; opacity: 0.85; margin-top: 4px;">Bank Sampah Bersama Karyamulya Bersih, Kota Cirebon</div>
            <div style="font-size: 0.72rem; opacity: 0.65; margin-top: 2px;">Inisiatif Lingkungan Kelurahan Karyamulya, Kecamatan Kesambi</div>
          </div>

          <div style="display: flex; gap: 20px; font-size: 0.85rem;">
            <a href="#katalog-harga" style="color: #FFFFFF; opacity: 0.85; text-decoration: none;">Harga Sampah</a>
            <a href="#kalkulator" style="color: #FFFFFF; opacity: 0.85; text-decoration: none;">Simulasi</a>
            <a href="#cara-kerja" style="color: #FFFFFF; opacity: 0.85; text-decoration: none;">Alur Setor</a>
            <a href="#login" style="color: #FFFFFF; opacity: 0.85; text-decoration: none;">Portal Warga</a>
          </div>
        </div>

        <div style="max-width: 1200px; margin: 24px auto 0; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.72rem; opacity: 0.65; text-align: center;">
          &copy; ${new Date().getFullYear()} BERKASIH SMART. Kelurahan Karyamulya, Kota Cirebon.
        </div>
      </footer>

    </div>
  `;

  // Attach Interactive Calculator Logic (Functional Pattern C-2)
  const wasteSelect = container.querySelector('#calc-waste-select');
  const weightInput = container.querySelector('#calc-weight-input');
  const resultDisplay = container.querySelector('#calc-result-display');

  function updateCalculation() {
    if (!wasteSelect || !weightInput || !resultDisplay) return;
    const selectedOption = wasteSelect.options[wasteSelect.selectedIndex];
    const price = Number(selectedOption?.dataset?.price) || 0;
    const weight = Math.max(0, Number(weightInput.value) || 0);
    const total = Math.round(price * weight);
    resultDisplay.textContent = `Rp${total.toLocaleString('id-ID')}`;
  }

  wasteSelect?.addEventListener('change', updateCalculation);
  weightInput?.addEventListener('input', updateCalculation);
  updateCalculation();
}
