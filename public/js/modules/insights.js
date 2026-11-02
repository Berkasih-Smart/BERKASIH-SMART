/**
 * BERKASIH SMART - AI Insights & Action Center Module
 * Implements Section 23 (Insight Cards with Evidence & Confidence) & Section 24 (AI Action Center Alerts)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';

export function renderInsights(container) {
  const insights = db.getAIInsights();
  const alerts = db.getAIAlerts();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>BERKASIH INTELLIGENCE & ACTION CENTER</span>
          <span class="badge badge-ai">INSIGHTS ENGINE</span>
        </h1>
        <p class="page-subtitle">Peringatan proaktif dan analisis komparatif pola operasional untuk pengambilan keputusan pengurus.</p>
      </div>

      <div class="page-actions">
        <span class="badge badge-healthy" style="font-size: 0.72rem;">
          Human-in-the-Loop: Rekomendasi Terbuka untuk Telaah Pengurus
        </span>
      </div>
    </div>

    <!-- 1. AI ACTION CENTER (Section 24: Prioritized Alerts) -->
    <div style="margin-bottom: var(--space-6);">
      <h2 style="font-size: 1.05rem; font-weight: 700; color: #14532D; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span>🔔 AI Action Center — Tindakan Prioritas</span>
        <span class="badge badge-demo" style="font-size: 0.65rem;">Sistem Otomasi Deteksi</span>
      </h2>

      <div class="grid grid-cols-2" style="gap: var(--space-4);">
        ${alerts.map(alt => {
          let borderCol = '#E2E8F0';
          let badgeClass = 'badge-active';
          let icon = 'ℹ️';

          if (alt.severity === 'critical') {
            borderCol = '#DC2626';
            badgeClass = 'badge-risk';
            icon = '🚨';
          } else if (alt.severity === 'important') {
            borderCol = '#D97706';
            badgeClass = 'badge-declining';
            icon = '⚠️';
          } else if (alt.severity === 'attention') {
            borderCol = '#0284C7';
            badgeClass = 'badge-attention';
            icon = '📋';
          }

          return `
            <div class="card" style="border-left: 4px solid ${borderCol}; padding: 16px;">
              <div class="flex justify-between items-center" style="margin-bottom: 8px;">
                <div class="flex items-center gap-2">
                  <span style="font-size: 1.1rem;">${icon}</span>
                  <span class="badge ${badgeClass}" style="text-transform: uppercase; font-size: 0.65rem; font-weight: 700;">
                    ${alt.severity}
                  </span>
                </div>
                <strong style="font-size: 0.75rem; color: #64748B;">${alt.metric_value}</strong>
              </div>

              <h4 style="font-size: 0.88rem; font-weight: 700; color: #17201A; margin-bottom: 4px;">
                ${alt.title}
              </h4>
              <p style="font-size: 0.78rem; line-height: 1.5; color: #4B5563; margin-bottom: 12px;">
                ${alt.message}
              </p>

              <div class="flex justify-end">
                <button class="btn btn-sm btn-outline btn-alert-action" data-module="${alt.target_module}">
                  ${alt.action_label} →
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 2. AI INSIGHT CARDS (Section 23: Insight, Evidence, Interpretation, Recommended Action, Confidence) -->
    <div>
      <h2 style="font-size: 1.05rem; font-weight: 700; color: #14532D; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span>💡 Kartu Analisis Pola & Bukti (Explainable Insights)</span>
      </h2>

      <div class="flex flex-col gap-4">
        ${insights.map(ins => `
          <div class="card" style="border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden;">
            <div class="card-header" style="background-color: #F8FAF8;">
              <div class="flex items-center gap-3">
                <span class="badge badge-ai" style="font-size: 0.7rem;">${ins.category}</span>
                <div class="card-title" style="font-size: 0.95rem;">${ins.title}</div>
              </div>
              <div class="flex items-center gap-2">
                <span style="font-size: 0.72rem; color: #64748B;">Keyakinan Model:</span>
                <span class="badge ${ins.confidence === 'High' ? 'badge-healthy' : 'badge-attention'}" style="font-size: 0.7rem;">
                  ${ins.confidence}
                </span>
                <span class="badge ${ins.status === 'REVIEWED' ? 'badge-completed' : 'badge-declining'}" style="font-size: 0.68rem;">
                  ${ins.status === 'REVIEWED' ? '✓ Telah Ditinjau' : 'Belum Ditinjau'}
                </span>
              </div>
            </div>

            <div class="card-body" style="font-size: 0.82rem; line-height: 1.6; display: flex; flex-direction: column; gap: 10px;">
              <!-- Evidence -->
              <div style="background-color: #F1F5F9; border-left: 3px solid #64748B; padding: 10px 14px; border-radius: 4px;">
                <strong style="color: #334155; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">Bukti Data (Evidence):</strong>
                <div style="color: #1E293B; margin-top: 2px;">${ins.evidence}</div>
              </div>

              <!-- Interpretation -->
              <div style="background-color: #FFFBEB; border-left: 3px solid #D97706; padding: 10px 14px; border-radius: 4px;">
                <strong style="color: #92400E; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">Interpretasi Pola (Interpretation):</strong>
                <div style="color: #78350F; margin-top: 2px;">${ins.interpretation}</div>
              </div>

              <!-- Recommended Action -->
              <div style="background-color: #F0FDF4; border-left: 3px solid #16A34A; padding: 10px 14px; border-radius: 4px;">
                <strong style="color: #166534; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">Rekomendasi Tindakan (Action):</strong>
                <div style="color: #15803D; font-weight: 600; margin-top: 2px;">${ins.recommendation}</div>
              </div>

              <!-- Review Action Bar -->
              <div class="flex justify-between items-center" style="margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--color-border-subtle); font-size: 0.72rem; color: #9CA3AF;">
                <span>Terdeteksi: ${new Date(ins.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                <div class="flex gap-2">
                  ${ins.status !== 'REVIEWED' ? `
                    <button class="btn btn-sm btn-outline btn-mark-reviewed" data-id="${ins.id}">
                      ✓ Tandai Ditinjau
                    </button>
                  ` : `
                    <span style="color: #15803D; font-weight: 600;">Diverifikasi oleh Pengurus</span>
                  `}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Alert Navigation
  container.querySelectorAll('.btn-alert-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetModule = e.currentTarget.dataset.module;
      window.location.hash = `#${targetModule}`;
    });
  });

  // Attach Review Button
  container.querySelectorAll('.btn-mark-reviewed').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const insId = e.currentTarget.dataset.id;
      const target = insights.find(i => i.id === insId);
      if (target) {
        target.status = 'REVIEWED';
        db.logAudit(auth.getCurrentUser(), 'REVIEW_AI_INSIGHT', 'AI_INSIGHTS', insId, 'UNREVIEWED', 'REVIEWED');
        renderInsights(container);
      }
    });
  });
}
