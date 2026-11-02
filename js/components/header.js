/**
 * BERKASIH SMART - Application Header Component
 */

import { auth, ROLE_PERMISSIONS } from '../auth/auth.js';
import { db } from '../db/schema.js';

export function renderHeader(container) {
  const user = auth.getCurrentUser();
  const currentRole = auth.getRole();
  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.SUPER_ADMIN;
  const notifications = db.getNotifications();
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

      <!-- Role Switcher Dropdown (Allows instant perspective testing) -->
      <div style="position: relative;">
        <div class="flex items-center gap-2" style="background-color: #F0FDF4; border: 1px solid #BBF7D0; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem;">
          <span style="color: #14532D; font-weight: 600;">Peran:</span>
          <select id="role-switcher-select" style="border: none; background: transparent; font-weight: 700; color: #15803D; cursor: pointer; outline: none; font-size: 0.75rem;">
            <option value="SUPER_ADMIN" ${currentRole === 'SUPER_ADMIN' ? 'selected' : ''}>Super Admin (Pak Hendra)</option>
            <option value="MANAGER" ${currentRole === 'MANAGER' ? 'selected' : ''}>Manager (Ibu Nurul)</option>
            <option value="OPERATOR" ${currentRole === 'OPERATOR' ? 'selected' : ''}>Operator (Mas Rian)</option>
            <option value="CUSTOMER" ${currentRole === 'CUSTOMER' ? 'selected' : ''}>Nasabah (Siti Aminah)</option>
            <option value="PARTNER" ${currentRole === 'PARTNER' ? 'selected' : ''}>Mitra (PT Cirebon Daur)</option>
          </select>
        </div>
      </div>

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

      <!-- User Profile Badge -->
      <div class="flex items-center gap-3" style="border-left: 1px solid var(--color-border); padding-left: 12px;">
        <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #14532D, #22C55E); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
          ${user.name ? user.name.slice(0, 2).toUpperCase() : 'BK'}
        </div>
        <div class="hidden-mobile flex flex-col" style="line-height: 1.2;">
          <span style="font-weight: 600; font-size: 0.82rem; color: var(--color-text-primary);">${user.name || 'Pengguna'}</span>
          <span style="font-size: 0.7rem; color: var(--color-text-muted);">${roleConfig.name}</span>
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  const roleSelect = container.querySelector('#role-switcher-select');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      auth.switchRole(e.target.value);
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
      window.dispatchEvent(new CustomEvent('berkasih:open-deposit-modal'));
    });
  }

  const sidebarToggle = container.querySelector('#sidebar-toggle-btn');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.app-sidebar');
      if (sidebar) sidebar.classList.toggle('is-open');
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
