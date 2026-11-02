/**
 * BERKASIH SMART - Dedicated Login Page Module
 */

import { auth } from '../auth/auth.js';

export function renderLoginPage(container) {
  container.innerHTML = `
    <div style="min-height: calc(100vh - 40px); display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="width: 100%; max-width: 440px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); padding: 36px 32px;">

        <!-- Logo & Brand Header -->
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="width: 56px; height: 56px; margin: 0 auto 14px; background: linear-gradient(135deg, #14532D, #22C55E); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.565-.89 1.78 1.78 0 0 0 .005-1.78L16.82 9.5"></path>
              <path d="m11 5 1.5-3 1.5 3"></path>
              <path d="M2.5 13 4 10l1.5 3"></path>
              <path d="M21.5 13 20 10l-1.5 3"></path>
            </svg>
          </div>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #14532D; margin: 0 0 4px;">BERKASIH SMART</h2>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0;">Bank Sampah Karyamulya, Kota Cirebon</p>
          <div style="display: inline-block; margin-top: 8px; padding: 2px 10px; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 9999px; font-size: 0.72rem; color: #15803D; font-weight: 600;">
            Silakan Masuk untuk Mengakses Dashboard
          </div>
        </div>

        <!-- Alert Error Message -->
        <div id="login-page-error" class="alert alert-danger" style="display: none; font-size: 0.82rem; padding: 10px 14px; border-radius: 8px; background-color: #FEF2F2; color: #991B1B; border: 1px solid #F87171; margin-bottom: 18px;"></div>

        <!-- Login Form -->
        <form id="login-page-form" class="flex flex-col gap-4">
          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 600; color: var(--color-text-primary);">Alamat Email</label>
            <input
              type="email"
              id="page-email-input"
              class="form-input"
              placeholder="nama@email.com"
              required
              style="font-size: 0.88rem; height: 42px;"
            />
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 600; color: var(--color-text-primary);">Kata Sandi</label>
            <input
              type="password"
              id="page-password-input"
              class="form-input"
              placeholder="Masukkan kata sandi akun"
              required
              style="font-size: 0.88rem; height: 42px;"
            />
          </div>

          <button
            type="submit"
            id="page-login-btn"
            class="btn btn-primary"
            style="height: 42px; font-size: 0.9rem; font-weight: 700; width: 100%; justify-content: center; margin-top: 6px;"
          >
            Masuk ke Sistem
          </button>
        </form>

      </div>
    </div>
  `;

  const form = container.querySelector('#login-page-form');
  const errorAlert = container.querySelector('#login-page-error');
  const emailInput = container.querySelector('#page-email-input');
  const passwordInput = container.querySelector('#page-password-input');
  const submitBtn = container.querySelector('#page-login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memverifikasi...';
    errorAlert.style.display = 'none';

    try {
      const user = await auth.login(emailInput.value.trim(), passwordInput.value);
      if (user.role === 'CUSTOMER') {
        window.location.hash = '#customer-portal';
      } else {
        window.location.hash = '#dashboard';
      }
    } catch (err) {
      errorAlert.textContent = err.message || 'Gagal masuk akun. Periksa kembali email dan password.';
      errorAlert.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Masuk ke Sistem';
    }
  });
}
