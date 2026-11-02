/**
 * BERKASIH SMART - Application Header Component
 */

import { auth, ROLE_PERMISSIONS } from '../auth/auth.js';
import { db } from '../db/schema.js';
import { Modal } from './modal.js';

export function renderHeader(container) {
  const user = auth.getCurrentUser() || { name: 'Tamu', role: 'GUEST' };
  const currentRole = auth.getRole() || 'GUEST';
  const roleConfig = ROLE_PERMISSIONS[currentRole] || { name: 'Tamu / Belum Masuk', badgeClass: 'badge-inactive' };
  const notifications = db.getNotifications ? db.getNotifications() : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  container.innerHTML = `
    <div class="flex items-center gap-4">
      <button class="btn-icon" id="sidebar-toggle-btn" aria-label="Toggle Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <!-- Global Quick Search -->
      <div style="position: relative; width: 280px;" class="hidden-mobile">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="position: absolute; left: 12px; top: 10px;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          id="global-search-input" 
          class="form-input" 
          placeholder="Cari nasabah, setoran, RW... (/)"
          style="padding-left: 36px; height: 36px; font-size: 0.8rem; background-color: #F9FAFB;"
        />
      </div>
    </div>

    <!-- Right Header Controls -->
    <div class="flex items-center gap-3">
      <!-- Quick Action: Setor Sampah (If Operator/Manager/Admin) -->
      ${auth.hasPermission('setoran') ? `
        <button class="btn btn-primary btn-sm" id="btn-quick-deposit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Setor Sampah
        </button>
      ` : ''}

      <!-- Role Switcher / Impersonation (Super Admin Only) -->
      ${auth.isImpersonating() ? `
        <div class="flex items-center gap-2" style="background-color: #FEF3C7; border: 1px solid #FCD34D; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem;">
          <span style="color: #92400E; font-weight: 700;">Simulasi: ${roleConfig.name}</span>
          <button id="btn-stop-impersonate" class="btn btn-xs" style="background-color: #D97706; color: #FFFFFF; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: none; cursor: pointer;">
            Kembali ke Super Admin
          </button>
        </div>
      ` : auth.isSuperAdmin() ? `
        <div style="position: relative;">
          <div class="flex items-center gap-2" style="background-color: #F0FDF4; border: 1px solid #BBF7D0; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem;">
            <span style="color: #14532D; font-weight: 600;">Simulasi Peran:</span>
            <select id="role-switcher-select" style="border: none; background: transparent; font-weight: 700; color: #15803D; cursor: pointer; outline: none; font-size: 0.75rem;">
              <option value="SUPER_ADMIN" ${currentRole === 'SUPER_ADMIN' ? 'selected' : ''}>Super Admin (Pak Hendra)</option>
              <option value="MANAGER" ${currentRole === 'MANAGER' ? 'selected' : ''}>Manager (Ibu Nurul)</option>
              <option value="OPERATOR" ${currentRole === 'OPERATOR' ? 'selected' : ''}>Operator (Mas Rian)</option>
              <option value="CUSTOMER" ${currentRole === 'CUSTOMER' ? 'selected' : ''}>Nasabah (Siti Aminah)</option>
              <option value="PARTNER" ${currentRole === 'PARTNER' ? 'selected' : ''}>Mitra (PT Cirebon Daur)</option>
            </select>
          </div>
        </div>
      ` : ''}

      <!-- Notification Bell -->
      <div style="position: relative;">
        <button class="btn-icon" id="notif-bell-btn" aria-label="Notifikasi" style="position: relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          ${unreadCount > 0 ? `
            <span style="position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background-color: #DC2626; border-radius: 50%; border: 2px solid #FFFFFF;"></span>
          ` : ''}
        </button>

        <!-- Notification Panel (Dropdown) -->
        <div id="notif-dropdown-panel" style="display: none; position: absolute; right: 0; top: 46px; width: 340px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 100; overflow: hidden;">
          <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; background-color: #F9FAFB;">
            <strong style="font-size: 0.85rem;">Notifikasi Sistem</strong>
            <span class="badge ${unreadCount > 0 ? 'badge-attention' : 'badge-healthy'}" style="font-size: 0.7rem;">${unreadCount} Baru</span>
          </div>
          <div style="max-height: 320px; overflow-y: auto;">
            ${notifications.slice(0, 5).map(n => `
              <div style="padding: 10px 16px; border-bottom: 1px solid #F3F4F6; font-size: 0.78rem; ${n.read ? 'opacity: 0.75;' : 'background-color: #F0FDF4;'}">
                <div style="font-weight: 600; color: #14532D; margin-bottom: 2px;">${n.title}</div>
                <div style="color: #4B5563; line-height: 1.4;">${n.message}</div>
                <div style="color: #9CA3AF; font-size: 0.68rem; margin-top: 4px;">${new Date(n.date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- User Profile Badge & Login/Logout Trigger -->
      <div class="flex items-center gap-2" style="border-left: 1px solid var(--color-border); padding-left: 12px;">
        <button id="btn-logout-header" class="btn btn-secondary btn-sm" title="Keluar Akun" style="display: flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 0.75rem; color: #DC2626;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span class="hidden-mobile">Keluar</span>
        </button>
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #14532D, #22C55E); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem;">
          ${user.name ? user.name.slice(0, 2).toUpperCase() : 'BK'}
        </div>
        <div class="hidden-mobile flex flex-col" style="line-height: 1.2;">
          <span style="font-weight: 600; font-size: 0.8rem; color: var(--color-text-primary);">${user.name || 'Pengguna'}</span>
          <span style="font-size: 0.68rem; color: var(--color-text-muted);">${roleConfig.name}</span>
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  const stopImpersonateBtn = container.querySelector('#btn-stop-impersonate');
  if (stopImpersonateBtn) {
    stopImpersonateBtn.addEventListener('click', () => {
      auth.stopImpersonating();
    });
  }

  const roleSelect = container.querySelector('#role-switcher-select');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      auth.impersonate(e.target.value);
    });
  }

  const notifBtn = container.querySelector('#notif-bell-btn');
  const notifPanel = container.querySelector('#notif-dropdown-panel');
  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.style.display = notifPanel.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => {
      notifPanel.style.display = 'none';
    });
  }

  const quickDepositBtn = container.querySelector('#btn-quick-deposit');
  if (quickDepositBtn) {
    quickDepositBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('app:open-deposit-modal'));
    });
  }

  const sidebarToggle = container.querySelector('#sidebar-toggle-btn');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.app-sidebar');
      if (sidebar) sidebar.classList.toggle('is-open');
    });
  }

  const logoutBtn = container.querySelector('#btn-logout-header');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
    });
  }

  const openLoginBtn = container.querySelector('#btn-open-login');
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      openLoginModal();
    });
  }

  // Keyboard shortcut for search
  const searchInput = container.querySelector('#global-search-input');
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

export function openLoginModal() {
  const content = document.createElement('div');
  content.innerHTML = `
    <form id="auth-login-form" class="flex flex-col gap-3">
      <div id="login-error-alert" class="alert alert-danger" style="display: none; font-size: 0.8rem; padding: 8px 12px; border-radius: 6px; background-color: #FEF2F2; color: #991B1B; border: 1px solid #F87171;"></div>

      <div class="form-group">
        <label class="form-label" style="font-size: 0.8rem; font-weight: 600;">Email Akun</label>
        <input type="email" id="login-email-input" class="form-input" placeholder="nama@email.com" required style="font-size: 0.85rem;" />
      </div>

      <div class="form-group">
        <label class="form-label" style="font-size: 0.8rem; font-weight: 600;">Kata Sandi</label>
        <input type="password" id="login-password-input" class="form-input" placeholder="Masukkan kata sandi" required style="font-size: 0.85rem;" />
      </div>
    </form>
  `;

  const footer = `
    <button type="button" class="btn btn-secondary" id="login-cancel-btn">Batal</button>
    <button type="submit" form="auth-login-form" class="btn btn-primary" id="login-submit-btn">Masuk Akun</button>
  `;

  Modal.open({
    title: 'Masuk ke Sistem BERKASIH SMART',
    content,
    footer,
    size: 'sm'
  });

  const form = document.getElementById('auth-login-form');
  const errorAlert = document.getElementById('login-error-alert');
  const emailInput = document.getElementById('login-email-input');
  const passwordInput = document.getElementById('login-password-input');
  const submitBtn = document.getElementById('login-submit-btn');

  document.getElementById('login-cancel-btn')?.addEventListener('click', () => Modal.close());

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memverifikasi...';
    errorAlert.style.display = 'none';

    try {
      await auth.login(emailInput.value.trim(), passwordInput.value);
      Modal.close();
    } catch (err) {
      errorAlert.textContent = err.message || 'Gagal masuk akun. Periksa kembali email dan password.';
      errorAlert.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Masuk Akun';
    }
  });
}

