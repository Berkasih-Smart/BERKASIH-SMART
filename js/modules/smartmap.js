/**
 * BERKASIH SMART MAP - GIS & Geospatial Intelligence Module
 * Centered on Kelurahan Karyamulya, Cirebon, Indonesia (Lat -6.7460, Lng 108.5370)
 * Implements Section 17 (GIS Layers, Privacy Protection) & Section 47 (Satellite Readiness)
 */

import { db } from '../db/schema.js';

export function renderSmartMap(container) {
  const rwList = db.getRWList();
  const servicePoints = db.getServicePoints();
  const customers = db.getCustomers();
  const partners = db.getPartners();
  const pickups = db.getPickups();

  // Selected layers state
  const activeLayers = {
    rwBounds: true,
    servicePoints: true,
    customerClusters: true,
    wasteHeat: false,
    pickupRoutes: true,
    partners: true
  };

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>BERKASIH SMART MAP</span>
          <span class="badge badge-demo">GIS KARYAMULYA</span>
        </h1>
        <p class="page-subtitle">Visualisasi spasial sebaran nasabah teragregasi, titik loket setor, dan cakupan layanan 15 RW.</p>
      </div>

      <div class="page-actions">
        <!-- Honest Satellite Status Badge (Rule #47) -->
        <span class="badge" style="background-color: #F1F5F9; color: #475569; font-size: 0.72rem; border: 1px solid #CBD5E1;">
          📡 External geospatial API: Belum Terkoneksi (Peta Vektor Lokal Aktif)
        </span>
      </div>
    </div>

    <!-- GIS Layout: Map Canvas + Sidebar Panel -->
    <div style="display: grid; grid-template-columns: 1fr 340px; gap: var(--space-5);">
      <!-- Map Area -->
      <div class="gis-wrapper" id="gis-main-wrapper">
        <!-- Map Canvas (Vector SVG GIS Engine) -->
        <div class="gis-map-canvas" id="gis-interactive-canvas">
          <svg id="gis-svg" width="100%" height="100%" viewBox="0 0 800 600" style="width: 100%; height: 100%; cursor: grab;">
            <!-- Background Geo Base -->
            <rect width="800" height="600" fill="#E8F1E5" />

            <!-- Main Roads (Jl. Perjuangan, Jl. Majasem, Jl. Brigjen Dharsono) -->
            <path d="M 50 100 Q 300 250 750 480" stroke="#CBD5E1" stroke-width="12" fill="none" opacity="0.7"/>
            <path d="M 50 100 Q 300 250 750 480" stroke="#FFFFFF" stroke-width="8" fill="none"/>
            <text x="560" y="380" font-size="9" fill="#64748B" font-weight="600" transform="rotate(22 560 380)">Jl. Perjuangan</text>

            <path d="M 120 550 L 350 50" stroke="#CBD5E1" stroke-width="10" fill="none" opacity="0.7"/>
            <path d="M 120 550 L 350 50" stroke="#FFFFFF" stroke-width="6" fill="none"/>
            <text x="210" y="300" font-size="9" fill="#64748B" font-weight="600" transform="rotate(-65 210 300)">Jl. Majasem Indah</text>

            <!-- 15 RW Boundary Polygons (Kelurahan Karyamulya) -->
            <g id="layer-rw-polygons">
              <!-- RW 01 Majasem Indah -->
              <polygon points="120,80 240,60 270,160 160,200 90,140" class="rw-poly" data-rw="RW-01" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="165" y="130" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 01</text>

              <!-- RW 02 Karyabakti -->
              <polygon points="240,60 360,50 390,140 270,160" class="rw-poly" data-rw="RW-02" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="310" y="105" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 02</text>

              <!-- RW 03 Griya Karyamulya -->
              <polygon points="270,160 390,140 430,240 310,270" class="rw-poly" data-rw="RW-03" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="350" y="200" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 03</text>

              <!-- RW 04 Situgangga (Central Core) -->
              <polygon points="310,270 430,240 480,350 360,390" class="rw-poly" data-rw="RW-04" fill="#BBF7D0" stroke="#14532D" stroke-width="2.5" opacity="0.9"/>
              <text x="395" y="315" font-size="11" font-weight="800" fill="#0A2614" text-anchor="middle">RW 04</text>

              <!-- RW 05 Kanggraksan Utara -->
              <polygon points="360,50 490,40 520,130 390,140" class="rw-poly" data-rw="RW-05" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="440" y="95" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 05</text>

              <!-- RW 06 Kayuwalang Baru (Partial) -->
              <polygon points="160,200 270,160 310,270 210,320" class="rw-poly" data-rw="RW-06" fill="#FEF3C7" stroke="#D97706" stroke-width="2" opacity="0.85"/>
              <text x="235" y="240" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">RW 06</text>

              <!-- RW 07 Perjuangan Asri -->
              <polygon points="390,140 520,130 560,230 430,240" class="rw-poly" data-rw="RW-07" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="475" y="185" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 07</text>

              <!-- RW 08 Citra Permai -->
              <polygon points="430,240 560,230 600,340 480,350" class="rw-poly" data-rw="RW-08" fill="#FEF3C7" stroke="#D97706" stroke-width="2" opacity="0.85"/>
              <text x="515" y="290" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">RW 08</text>

              <!-- RW 09 Karyamulya Timur -->
              <polygon points="520,130 660,110 700,210 560,230" class="rw-poly" data-rw="RW-09" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="610" y="170" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 09</text>

              <!-- RW 10 Swasembada -->
              <polygon points="490,40 620,30 660,110 520,130" class="rw-poly" data-rw="RW-10" fill="#FEF3C7" stroke="#D97706" stroke-width="2" opacity="0.85"/>
              <text x="570" y="85" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">RW 10</text>

              <!-- RW 11 Taman Cirebon Indah -->
              <polygon points="90,240 210,320 180,440 60,370" class="rw-poly" data-rw="RW-11" fill="#DCFCE7" stroke="#15803D" stroke-width="2" opacity="0.85"/>
              <text x="135" y="340" font-size="11" font-weight="700" fill="#14532D" text-anchor="middle">RW 11</text>

              <!-- RW 12 Bukit Kayuwalang (Unserved) -->
              <polygon points="210,320 360,390 320,520 180,440" class="rw-poly" data-rw="RW-12" fill="#FEE2E2" stroke="#DC2626" stroke-width="2" opacity="0.85"/>
              <text x="270" y="420" font-size="11" font-weight="700" fill="#B91C1C" text-anchor="middle">RW 12</text>

              <!-- RW 13 Perum Karyamulya Regency -->
              <polygon points="480,350 600,340 640,460 520,480" class="rw-poly" data-rw="RW-13" fill="#FEF3C7" stroke="#D97706" stroke-width="2" opacity="0.85"/>
              <text x="560" y="410" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">RW 13</text>

              <!-- RW 14 Mulya Asri (Unserved) -->
              <polygon points="30,130 90,80 120,200 60,240" class="rw-poly" data-rw="RW-14" fill="#FEE2E2" stroke="#DC2626" stroke-width="2" opacity="0.85"/>
              <text x="75" y="165" font-size="11" font-weight="700" fill="#B91C1C" text-anchor="middle">RW 14</text>

              <!-- RW 15 Karyamulya Selatan (Unserved) -->
              <polygon points="320,520 460,500 430,580 290,580" class="rw-poly" data-rw="RW-15" fill="#FEE2E2" stroke="#DC2626" stroke-width="2" opacity="0.85"/>
              <text x="375" y="550" font-size="11" font-weight="700" fill="#B91C1C" text-anchor="middle">RW 15</text>
            </g>

            <!-- Layer: Privacy-Preserving Customer Density Clusters (Rule #7 & #8) -->
            <g id="layer-customers">
              <!-- RW 04 Cluster (Situgangga) -->
              <circle cx="380" cy="300" r="28" fill="#15803D" opacity="0.3" />
              <circle cx="380" cy="300" r="14" fill="#14532D" />
              <text x="380" y="304" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">64</text>

              <!-- RW 01 Cluster (Majasem) -->
              <circle cx="170" cy="140" r="24" fill="#15803D" opacity="0.3" />
              <circle cx="170" cy="140" r="12" fill="#14532D" />
              <text x="170" y="144" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">42</text>

              <!-- RW 03 Cluster (Griya) -->
              <circle cx="350" cy="210" r="26" fill="#15803D" opacity="0.3" />
              <circle cx="350" cy="210" r="13" fill="#14532D" />
              <text x="350" y="214" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">58</text>

              <!-- RW 11 Cluster (Taman Cirebon) -->
              <circle cx="140" cy="350" r="22" fill="#15803D" opacity="0.3" />
              <circle cx="140" cy="350" r="12" fill="#14532D" />
              <text x="140" y="354" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">38</text>
            </g>

            <!-- Layer: Service Points (Pos Bank Sampah Unit) -->
            <g id="layer-service-points">
              <!-- Pos Pusat BERKASIH (RW 04) -->
              <g transform="translate(390, 275)" style="cursor: pointer;">
                <circle cx="0" cy="0" r="12" fill="#22C55E" stroke="#FFFFFF" stroke-width="2"/>
                <text x="0" y="4" font-size="10" font-weight="800" fill="#14532D" text-anchor="middle">★</text>
                <text x="16" y="4" font-size="11" font-weight="700" fill="#0F172A">Pos Pusat BERKASIH</text>
              </g>

              <!-- Pos Setor RW 01 -->
              <g transform="translate(190, 120)">
                <circle cx="0" cy="0" r="7" fill="#15803D" stroke="#FFFFFF" stroke-width="1.5"/>
                <text x="10" y="3" font-size="9" font-weight="600" fill="#1E293B">Unit RW 01</text>
              </g>

              <!-- Pos Setor RW 11 -->
              <g transform="translate(120, 320)">
                <circle cx="0" cy="0" r="7" fill="#15803D" stroke="#FFFFFF" stroke-width="1.5"/>
                <text x="10" y="3" font-size="9" font-weight="600" fill="#1E293B">Unit RW 11</text>
              </g>
            </g>

            <!-- Layer: Pickup Route (Armada Motor Roda Tiga Viar) -->
            <g id="layer-pickup-routes">
              <path d="M 390 275 Q 260 210 170 140 T 140 350" stroke="#0284C7" stroke-width="3" stroke-dasharray="6,4" fill="none"/>
              <circle cx="170" cy="140" r="5" fill="#0284C7"><title>Jemputan Terjadwal RW 01</title></circle>
              <circle cx="140" cy="350" r="5" fill="#0284C7"><title>Jemputan Terjadwal RW 11</title></circle>
            </g>
          </svg>
        </div>

        <!-- Floating Legend on Map -->
        <div class="gis-legend">
          <strong style="font-size: 0.75rem; margin-bottom: 2px;">Legenda Peta Karyamulya</strong>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #DCFCE7; border-color: #15803D;"></span>
            <span>RW Terlayani (Served)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #FEF3C7; border-color: #D97706;"></span>
            <span>Sebagian / Parsial</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #FEE2E2; border-color: #DC2626;"></span>
            <span>Belum Terlayani (Unserved)</span>
          </div>
          <div class="legend-item">
            <span style="color: #22C55E; font-size: 1rem; line-height: 1;">★</span>
            <span>Pos Pusat Bank Sampah</span>
          </div>
          <div class="legend-item">
            <span style="width: 14px; height: 3px; background-color: #0284C7; display: inline-block;"></span>
            <span>Rute Jemput Armada Viar</span>
          </div>
        </div>

        <!-- Privacy Assurance Badge (Rule #7 & #8) -->
        <div class="gis-privacy-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Privasi Terlindungi: Titik rumah tangga tidak diekspos secara presisi (Klaster Teragregasi RW).
        </div>
      </div>

      <!-- Right Info & Filter Drawer -->
      <div class="flex flex-col gap-4">
        <!-- Layer Controls -->
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-size: 0.85rem;">Kontrol Lapisan (Layers)</div>
          </div>
          <div class="card-body" style="padding: 12px 16px; font-size: 0.78rem;">
            <label class="flex items-center gap-2" style="margin-bottom: 8px; cursor: pointer;">
              <input type="checkbox" id="chk-layer-rw" checked />
              <span>Batas Wilayah 15 RW</span>
            </label>
            <label class="flex items-center gap-2" style="margin-bottom: 8px; cursor: pointer;">
              <input type="checkbox" id="chk-layer-sp" checked />
              <span>Titik Loket Setor (Pos Unit)</span>
            </label>
            <label class="flex items-center gap-2" style="margin-bottom: 8px; cursor: pointer;">
              <input type="checkbox" id="chk-layer-clusters" checked />
              <span>Kepadatan Nasabah (Klaster)</span>
            </label>
            <label class="flex items-center gap-2" style="cursor: pointer;">
              <input type="checkbox" id="chk-layer-routes" checked />
              <span>Rute Armada Jemput Viar</span>
            </label>
          </div>
        </div>

        <!-- Selected RW Detail Inspector -->
        <div class="card" id="rw-detail-card">
          <div class="card-header">
            <div class="card-title" style="font-size: 0.85rem;" id="rw-inspector-title">RW 04 Situgangga</div>
            <span class="badge badge-healthy" id="rw-inspector-badge">SERVED</span>
          </div>
          <div class="card-body" style="padding: 14px 16px; font-size: 0.78rem; line-height: 1.6;">
            <div class="flex justify-between items-center" style="margin-bottom: 6px;">
              <span style="color: #6B7280;">Populasi / Kepala Keluarga:</span>
              <strong id="rw-inspector-pop">1.890 jiwa / 510 KK</strong>
            </div>
            <div class="flex justify-between items-center" style="margin-bottom: 6px;">
              <span style="color: #6B7280;">Nasabah Terdaftar:</span>
              <strong id="rw-inspector-cust">64 Nasabah (12.5% KK)</strong>
            </div>
            <div class="flex justify-between items-center" style="margin-bottom: 6px;">
              <span style="color: #6B7280;">Fasilitas Setor:</span>
              <strong id="rw-inspector-sp">Pos Pusat BERKASIH</strong>
            </div>
            <div class="flex justify-between items-center">
              <span style="color: #6B7280;">Tingkat Aktivitas:</span>
              <span class="badge badge-healthy" id="rw-inspector-act">Sangat Aktif</span>
            </div>
            <div style="margin-top: 12px; font-size: 0.72rem; color: #4B5563; background: #F8FAF8; padding: 8px; border-radius: 6px;">
              * Klik pada salah satu bidang polygon RW pada peta untuk melihat data detail inspeksi wilayah.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Interactive Layer Toggles
  const chkRw = container.querySelector('#chk-layer-rw');
  const chkSp = container.querySelector('#chk-layer-sp');
  const chkClusters = container.querySelector('#chk-layer-clusters');
  const chkRoutes = container.querySelector('#chk-layer-routes');

  const layerRw = container.querySelector('#layer-rw-polygons');
  const layerSp = container.querySelector('#layer-service-points');
  const layerCl = container.querySelector('#layer-customers');
  const layerRt = container.querySelector('#layer-pickup-routes');

  if (chkRw && layerRw) chkRw.addEventListener('change', (e) => layerRw.style.display = e.target.checked ? 'block' : 'none');
  if (chkSp && layerSp) chkSp.addEventListener('change', (e) => layerSp.style.display = e.target.checked ? 'block' : 'none');
  if (chkClusters && layerCl) chkClusters.addEventListener('change', (e) => layerCl.style.display = e.target.checked ? 'block' : 'none');
  if (chkRoutes && layerRt) chkRoutes.addEventListener('change', (e) => layerRt.style.display = e.target.checked ? 'block' : 'none');

  // RW Polygon Click Inspector
  container.querySelectorAll('.rw-poly').forEach(poly => {
    poly.addEventListener('click', (e) => {
      const rwId = e.currentTarget.dataset.rw;
      const rwData = rwList.find(r => r.id === rwId);
      if (rwData) {
        container.querySelector('#rw-inspector-title').textContent = rwData.name;
        container.querySelector('#rw-inspector-badge').textContent = rwData.coverage_status;
        container.querySelector('#rw-inspector-badge').className = `badge ${rwData.coverage_status === 'SERVED' ? 'badge-healthy' : rwData.coverage_status === 'PARTIAL' ? 'badge-attention' : 'badge-risk'}`;
        container.querySelector('#rw-inspector-pop').textContent = `${rwData.population.toLocaleString('id-ID')} jiwa / ${rwData.households} KK`;
        container.querySelector('#rw-inspector-cust').textContent = `${rwData.active_customers} Nasabah (${((rwData.active_customers / rwData.households)*100).toFixed(1)}% KK)`;
      }
    });
  });
}
