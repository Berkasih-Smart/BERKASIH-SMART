/**
 * BERKASIH SMART - Forecasting Module (BERKASIH FORECAST)
 * Implements Section 20 (Target Predictions, Uncertainty Intervals, Data Sufficiency Safeguard)
 */

import { db } from '../db/schema.js';

export function renderForecast(container) {
  let selectedMetric = 'waste';
  let selectedPeriod = 'next_month';
  let simulateInsufficientData = false;

  const renderContent = () => {
    // Check sufficiency
    const forecastResult = simulateInsufficientData
      ? { sufficient_data: false, message: 'Additional historical data is required to produce a reliable forecast.' }
      : db.getForecast(selectedMetric, selectedPeriod);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">
            <span>BERKASIH FORECAST</span>
            <span class="badge badge-demo">PREDICTIVE INTELLIGENCE</span>
          </h1>
          <p class="page-subtitle">Proyeksi timbulan sampah dan kebutuhan logistik berdasarkan pemodelan deret waktu historis.</p>
        </div>

        <div class="page-actions">
          <!-- Toggle to demonstrate Rule #20 Data Sufficiency Safeguard -->
          <button class="btn btn-sm ${simulateInsufficientData ? 'btn-danger' : 'btn-outline'}" id="btn-toggle-sufficiency">
            ${simulateInsufficientData ? 'Simulasi: Data Kurang (Aktif)' : 'Simulasi Kondisi Data Minim'}
          </button>
        </div>
      </div>

      <!-- Forecast Controls Bar -->
      <div class="card" style="padding: 14px 20px; margin-bottom: var(--space-6);">
        <div class="flex items-center gap-4 flex-wrap">
          <div style="flex: 1; min-width: 180px;">
            <label class="form-hint" style="font-weight: 600; margin-bottom: 3px; display: block;">Target Metrik Proyeksi</label>
            <select id="forecast-metric-select" class="form-select">
              <option value="waste" ${selectedMetric === 'waste' ? 'selected' : ''}>Volume Timbulan Sampah (kg)</option>
              <option value="savings" ${selectedMetric === 'savings' ? 'selected' : ''}>Akumulasi Tabungan Baru (Rp)</option>
              <option value="deposits" ${selectedMetric === 'deposits' ? 'selected' : ''}>Frekuensi Transaksi Setoran</option>
            </select>
          </div>

          <div style="flex: 1; min-width: 180px;">
            <label class="form-hint" style="font-weight: 600; margin-bottom: 3px; display: block;">Periode Prediksi</label>
            <select id="forecast-period-select" class="form-select">
              <option value="next_week" ${selectedPeriod === 'next_week' ? 'selected' : ''}>Minggu Depan</option>
              <option value="next_month" ${selectedPeriod === 'next_month' ? 'selected' : ''}>Bulan Depan (Oktober 2026)</option>
              <option value="next_3_months" ${selectedPeriod === 'next_3_months' ? 'selected' : ''}>3 Bulan ke Depan (Kuartal IV)</option>
            </select>
          </div>
        </div>
      </div>

      ${!forecastResult.sufficient_data ? `
        <!-- Section 20 Safeguard: Forecast Unavailable Notice -->
        <div class="card" style="border: 2px dashed #DC2626; background-color: #FEF2F2; padding: 40px; text-align: center;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background-color: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #991B1B; margin-bottom: 8px;">Forecast Unavailable</h2>
          <p style="font-size: 0.88rem; color: #B91C1C; max-width: 500px; margin: 0 auto 16px auto; line-height: 1.5;">
            ${forecastResult.message}
          </p>
          <div style="font-size: 0.75rem; color: #7F1D1D; background: #FFFFFF; display: inline-block; padding: 8px 16px; border-radius: 6px; border: 1px solid #FECACA;">
            Prinsip Integritas #5: BERKASIH SMART tidak membuat proyeksi palsu bila dataset historis belum memenuhi ambang batas statistik minimum.
          </div>
        </div>
      ` : `
        <!-- Main Forecast Visualization Card -->
        <div class="grid grid-cols-3" style="gap: var(--space-5); margin-bottom: var(--space-6);">
          <!-- Value Display Card -->
          <div class="kpi-card" style="border-top: 4px solid #15803D;">
            <span class="kpi-label">Nilai Proyeksi Utama (Expected)</span>
            <div class="kpi-value" style="color: #14532D; font-size: 2.2rem; margin: 8px 0;">
              ${forecastResult.forecast_value} <span class="kpi-unit">kg</span>
            </div>
            <div class="flex justify-between items-center" style="font-size: 0.75rem; color: #4B5563; border-top: 1px solid var(--color-border-subtle); padding-top: 8px;">
              <span>Tingkat Keyakinan:</span>
              <strong style="color: #15803D;">${forecastResult.confidence}</strong>
            </div>
          </div>

          <!-- Lower Bound -->
          <div class="kpi-card" style="border-top: 4px solid #D97706;">
            <span class="kpi-label">Batas Bawah Ketidakpastian (Lower Bound)</span>
            <div class="kpi-value" style="color: #92400E; font-size: 1.8rem; margin: 8px 0;">
              ${forecastResult.lower_bound} <span class="kpi-unit">kg</span>
            </div>
            <span style="font-size: 0.72rem; color: #6B7280;">Skenario konservatif minimum (-12%)</span>
          </div>

          <!-- Upper Bound -->
          <div class="kpi-card" style="border-top: 4px solid #0284C7;">
            <span class="kpi-label">Batas Atas Ketidakpastian (Upper Bound)</span>
            <div class="kpi-value" style="color: #0369A1; font-size: 1.8rem; margin: 8px 0;">
              ${forecastResult.upper_bound} <span class="kpi-unit">kg</span>
            </div>
            <span style="font-size: 0.72rem; color: #6B7280;">Skenario lonjakan partisipasi (+12%)</span>
          </div>
        </div>

        <!-- Predictive Trend Chart with Confidence Band -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <div class="card-header">
            <div>
              <div class="card-title">Kurva Historis & Pita Ketidakpastian Proyeksi (Uncertainty Range)</div>
              <div style="font-size: 0.72rem; color: #6B7280;">Metode: ${forecastResult.model_type}</div>
            </div>
            <span class="badge badge-ai">Model v1.4</span>
          </div>
          <div class="card-body">
            <!-- SVG Forecast Chart -->
            <div style="height: 240px; width: 100%;">
              <svg width="100%" height="240" viewBox="0 0 700 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0284C7" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#0284C7" stop-opacity="0.05"/>
                  </linearGradient>
                </defs>

                <!-- Grid Lines -->
                <line x1="50" y1="40" x2="680" y2="40" stroke="#F1F5F9" stroke-width="1"/>
                <line x1="50" y1="100" x2="680" y2="100" stroke="#F1F5F9" stroke-width="1"/>
                <line x1="50" y1="160" x2="680" y2="160" stroke="#F1F5F9" stroke-width="1"/>
                <line x1="50" y1="200" x2="680" y2="200" stroke="#E2E8F0" stroke-width="1"/>

                <!-- Vertical Partition (Historical vs Forecast) -->
                <line x1="420" y1="20" x2="420" y2="200" stroke="#94A3B8" stroke-dasharray="4,4" stroke-width="1.5"/>
                <text x="410" y="32" font-size="10" fill="#64748B" text-anchor="end" font-weight="600">HISTORIS REAL</text>
                <text x="430" y="32" font-size="10" fill="#0284C7" text-anchor="start" font-weight="700">PROYEKSI FORECAST →</text>

                <!-- Historical Data Path -->
                <path d="M 80 170 L 160 145 L 240 155 L 320 115 L 400 95" fill="none" stroke="#15803D" stroke-width="3"/>
                <circle cx="80" cy="170" r="4" fill="#15803D"/>
                <circle cx="160" cy="145" r="4" fill="#15803D"/>
                <circle cx="240" cy="155" r="4" fill="#15803D"/>
                <circle cx="320" cy="115" r="4" fill="#15803D"/>
                <circle cx="400" cy="95" r="5" fill="#14532D" stroke="#FFFFFF" stroke-width="2"/>

                <!-- Forecast Uncertainty Band (Polygon) -->
                <polygon points="400,95 520,60 640,40 640,110 520,115 400,95" fill="url(#bandGrad)"/>

                <!-- Forecast Central Line -->
                <path d="M 400 95 L 520 85 L 640 70" fill="none" stroke="#0284C7" stroke-width="3" stroke-dasharray="6,4"/>
                <circle cx="520" cy="85" r="5" fill="#0284C7"/>
                <circle cx="640" cy="70" r="6" fill="#0369A1" stroke="#FFFFFF" stroke-width="2"/>

                <!-- X Axis Labels -->
                <text x="80" y="218" font-size="10" fill="#64748B" text-anchor="middle">Juli</text>
                <text x="160" y="218" font-size="10" fill="#64748B" text-anchor="middle">Agt 1</text>
                <text x="240" y="218" font-size="10" fill="#64748B" text-anchor="middle">Agt 2</text>
                <text x="320" y="218" font-size="10" fill="#64748B" text-anchor="middle">Sept 1</text>
                <text x="400" y="218" font-size="10" fill="#15803D" font-weight="700" text-anchor="middle">Saat Ini</text>
                <text x="520" y="218" font-size="10" fill="#0284C7" font-weight="700" text-anchor="middle">Okt 2026</text>
                <text x="640" y="218" font-size="10" fill="#0284C7" font-weight="700" text-anchor="middle">Nov 2026</text>
              </svg>
            </div>

            <div style="background-color: #F8FAF8; border-radius: 8px; padding: 12px; font-size: 0.75rem; color: #4B5563; margin-top: 12px;">
              <strong>Transparansi Asumsi Model:</strong> ${forecastResult.assumptions}
            </div>
          </div>
        </div>
      `}
    `;

    // Attach listeners
    const metricSelect = container.querySelector('#forecast-metric-select');
    if (metricSelect) {
      metricSelect.addEventListener('change', (e) => {
        selectedMetric = e.target.value;
        renderContent();
      });
    }

    const periodSelect = container.querySelector('#forecast-period-select');
    if (periodSelect) {
      periodSelect.addEventListener('change', (e) => {
        selectedPeriod = e.target.value;
        renderContent();
      });
    }

    const toggleBtn = container.querySelector('#btn-toggle-sufficiency');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        simulateInsufficientData = !simulateInsufficientData;
        renderContent();
      });
    }
  };

  renderContent();
}
