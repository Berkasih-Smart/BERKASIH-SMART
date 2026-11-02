/**
 * BERKASIH SMART - Digital Savings & Withdrawal Module (Tabungan)
 * Implements Section 14 (Fintech-style Savings & Approval Workflow) & Section 63 (Financial Consistency)
 */

import { db } from '../db/schema.js';
import { auth } from '../auth/auth.js';
import { Modal } from '../components/modal.js';

export function renderTabungan(container) {
  const customers = db.getCustomers();
  const savingsTransactions = db.getSavingsTransactions();
  const withdrawals = db.getWithdrawals();

  const totalPooledSavings = customers.reduce((sum, c) => sum + (c.savings_balance || 0), 0);
  const totalDepositsValue = savingsTransactions.filter(t => t.transaction_type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawnValue = savingsTransactions.filter(t => t.transaction_type === 'WITHDRAWAL').reduce((sum, t) => sum + t.amount, 0);

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'REQUESTED');

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">
          <span>Tabungan Digital & Penarikan</span>
          <span class="badge badge-demo">DEMO DATA</span>
        </h1>
        <p class="page-subtitle">Sistem saldo simpanan nasabah berbasis buku besar (ledger) dengan konsistensi finansial mutlak.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" id="btn-request-withdrawal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 10 20 15 15 20"></polyline>
            <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
          </svg>
          Ajukan Penarikan Tabungan
        </button>
      </div>
    </div>

    <!-- Financial Consistency Overview (Section 63) -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
      <div class="kpi-card">
        <span class="kpi-label">Total Saldo Terhimpun</span>
        <div class="kpi-value" style="color: #15803D;">Rp${totalPooledSavings.toLocaleString('id-ID')}</div>
        <span style="font-size: 0.72rem; color: #16A34A;">Liabilitas aman terjamin</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Akumulasi Hasil Setoran</span>
        <div class="kpi-value">Rp${totalDepositsValue.toLocaleString('id-ID')}</div>
        <span style="font-size: 0.72rem; color: #2563EB;">Uang masuk dari sampah</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Total Dana Dicairkan</span>
        <div class="kpi-value">Rp${totalWithdrawnValue.toLocaleString('id-ID')}</div>
        <span style="font-size: 0.72rem; color: #6B7280;">Diterima tunai oleh nasabah</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Permintaan Menunggu</span>
        <div class="kpi-value" style="color: ${pendingWithdrawals.length > 0 ? '#D97706' : '#16A34A'};">
          ${pendingWithdrawals.length}
        </div>
        <span style="font-size: 0.72rem; color: #6B7280;">Memerlukan persetujuan pengurus</span>
      </div>
    </div>

    <!-- Section: Withdrawal Approval Queue (If any pending) -->
    ${pendingWithdrawals.length > 0 ? `
      <div class="card" style="margin-bottom: var(--space-6); border-left: 4px solid #D97706;">
        <div class="card-header" style="background-color: #FFFBEB;">
          <div class="card-title" style="color: #92400E; font-size: 0.95rem;">
            ⚠️ Antrean Persetujuan Penarikan Tabungan (${pendingWithdrawals.length})
          </div>
          <span class="badge badge-attention">Otorisasi Pengurus</span>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID Permintaan</th>
                <th>Nasabah</th>
                <th>Jumlah Penarikan</th>
                <th>Metode Penyaluran</th>
                <th>Waktu Pengajuan</th>
                <th style="text-align: right;">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${pendingWithdrawals.map(w => `
                <tr>
                  <td><strong>${w.id}</strong></td>
                  <td><strong>${w.customer_name}</strong> (${w.customer_id})</td>
                  <td><strong style="color: #DC2626;">Rp${w.amount.toLocaleString('id-ID')}</strong></td>
                  <td><span class="badge" style="background: #F1F5F9; color: #1E293B;">${w.payout_method}</span></td>
                  <td>${new Date(w.requested_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-sm btn-primary btn-approve-withdrawal" data-id="${w.id}">
                      Setujui & Cairkan
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- Savings Ledger Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Buku Besar Tabungan (Savings Audit Ledger)</div>
        <span style="font-size: 0.75rem; color: #6B7280;">Audit Trail Tidak Dapat Dihapus</span>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Waktu</th>
              <th>Nasabah</th>
              <th>Tipe</th>
              <th>Nominal</th>
              <th>Saldo Sebelum</th>
              <th>Saldo Sesudah</th>
              <th>Keterangan / Referensi</th>
            </tr>
          </thead>
          <tbody>
            ${savingsTransactions.map(tx => {
              const cust = db.getCustomerById(tx.customer_id);
              const isDeposit = tx.transaction_type === 'DEPOSIT';

              return `
                <tr>
                  <td><code>${tx.id}</code></td>
                  <td>${new Date(tx.transaction_date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>
                    <strong>${cust?.name || tx.customer_id}</strong>
                    <div style="font-size: 0.7rem; color: #6B7280;">${cust?.rw_id || ''}</div>
                  </td>
                  <td>
                    <span class="badge ${isDeposit ? 'badge-completed' : 'badge-declining'}">
                      ${tx.transaction_type}
                    </span>
                  </td>
                  <td>
                    <strong style="color: ${isDeposit ? '#15803D' : '#DC2626'};">
                      ${isDeposit ? '+' : '-'}Rp${tx.amount.toLocaleString('id-ID')}
                    </strong>
                  </td>
                  <td>Rp${tx.balance_before.toLocaleString('id-ID')}</td>
                  <td><strong style="color: #14532D;">Rp${tx.balance_after.toLocaleString('id-ID')}</strong></td>
                  <td style="font-size: 0.75rem; color: #4B5563;">${tx.description}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Approval Listeners
  container.querySelectorAll('.btn-approve-withdrawal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wId = e.currentTarget.dataset.id;
      if (confirm(`Setujui penarikan tabungan ${wId} dan serahkan dana kepada nasabah?`)) {
        try {
          db.completeWithdrawal(wId, auth.getCurrentUser());
          renderTabungan(container);
        } catch (err) {
          alert(`Gagal menyetujui: ${err.message}`);
        }
      }
    });
  });

  // Attach Withdrawal Request Form
  const reqBtn = container.querySelector('#btn-request-withdrawal');
  if (reqBtn) {
    reqBtn.addEventListener('click', () => {
      openWithdrawalRequestModal(() => renderTabungan(container));
    });
  }
}

/**
 * Withdrawal Request Modal
 */
function openWithdrawalRequestModal(onSuccess) {
  const customers = db.getCustomers().filter(c => c.savings_balance > 0);

  if (customers.length === 0) {
    alert('Belum ada nasabah yang memiliki saldo tabungan untuk ditarik.');
    return;
  }

  const modalHtml = `
    <form id="wdr-request-form">
      <div class="form-group">
        <label class="form-label">Pilih Nasabah</label>
        <select id="wdr-customer-id" class="form-select">
          ${customers.map(c => `
            <option value="${c.id}">
              ${c.name} (${c.rw_id}) — Saldo Tersedia: Rp${c.savings_balance.toLocaleString('id-ID')}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Nominal Penarikan (Rp) *</label>
        <input type="number" id="wdr-amount" class="form-input" min="5000" step="5000" placeholder="Contoh: 50000" required />
        <span class="form-hint">Penarikan minimal Rp5.000 dan tidak boleh melebihi saldo tabungan.</span>
      </div>

      <div class="form-group">
        <label class="form-label">Metode Penyaluran Dana</label>
        <select id="wdr-method" class="form-select">
          <option value="TUNAI">Tunai di Pos Loket</option>
          <option value="TRANSFER_BCA">Transfer Bank BCA</option>
          <option value="TRANSFER_BRI">Transfer Bank BRI</option>
          <option value="GOPAY_OVO">E-Wallet (GoPay/OVO/Dana)</option>
        </select>
      </div>
    </form>
  `;

  const footerHtml = `
    <button class="btn btn-outline" id="wdr-cancel-btn">Batal</button>
    <button class="btn btn-primary" id="wdr-submit-btn">Kirim Permintaan Penarikan</button>
  `;

  const modal = Modal.open({
    title: 'Pengajuan Penarikan Saldo Tabungan',
    content: modalHtml,
    footer: footerHtml,
    size: 'md'
  });

  modal.element.querySelector('#wdr-cancel-btn').addEventListener('click', () => modal.close());

  modal.element.querySelector('#wdr-submit-btn').addEventListener('click', () => {
    const custId = modal.element.querySelector('#wdr-customer-id').value;
    const amount = modal.element.querySelector('#wdr-amount').value;
    const method = modal.element.querySelector('#wdr-method').value;

    try {
      db.requestWithdrawal(custId, amount, method, auth.getCurrentUser());
      modal.close();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(`Gagal mengajukan: ${err.message}`);
    }
  });
}
