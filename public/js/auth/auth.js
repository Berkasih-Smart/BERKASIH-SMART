/**
 * BERKASIH SMART - Authentication & Role-Based Access Control (RBAC)
 * Roles: SUPER_ADMIN, MANAGER, OPERATOR, CUSTOMER, PARTNER
 */

import { db } from '../db/schema.js';

const AUTH_KEY = 'berkasih_auth_session';

// Role Capabilities Matrix
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    badgeClass: 'badge-danger',
    description: 'Akses penuh seluruh modul, konfigurasi sistem, dan audit trail.',
    allowedRoutes: [
      'dashboard', 'nasabah', 'setoran', 'tabungan', 'penarikan',
      'inventori', 'penjemputan', 'mitra', 'analytics', 'smartmap',
      'areapotential', 'ai-chat', 'insights', 'forecast', 'impact',
      'circularity', 'programs', 'reports', 'export', 'users',
      'master-data', 'settings', 'audit-log'
    ]
  },
  MANAGER: {
    name: 'Manager / Pengurus',
    badgeClass: 'badge-active',
    description: 'Manajemen operasional, persetujuan penarikan, analitik, GIS, dan pelaporan.',
    allowedRoutes: [
      'dashboard', 'nasabah', 'setoran', 'tabungan', 'penarikan',
      'inventori', 'penjemputan', 'mitra', 'analytics', 'smartmap',
      'areapotential', 'ai-chat', 'insights', 'forecast', 'impact',
      'circularity', 'programs', 'reports', 'export'
    ]
  },
  OPERATOR: {
    name: 'Operator Loket & Lapangan',
    badgeClass: 'badge-attention',
    description: 'Operasi cepat loket penimbangan, setoran sampah, cek saldo, dan penjemputan.',
    allowedRoutes: [
      'dashboard', 'setoran', 'nasabah', 'tabungan', 'inventori', 'penjemputan'
    ]
  },
  CUSTOMER: {
    name: 'Nasabah Warga',
    badgeClass: 'badge-healthy',
    description: 'Portal mandiri nasabah: cek saldo tabungan, riwayat setor, jejak dampak, dan permintaan jemput.',
    allowedRoutes: [
      'customer-portal', 'impact', 'programs'
    ]
  },
  PARTNER: {
    name: 'Mitra Daur Ulang / Offtaker',
    badgeClass: 'badge-info',
    description: 'Portal mitra: verifikasi pengiriman material, sertifikat sirkularitas, dan katalog sampah.',
    allowedRoutes: [
      'mitra-portal', 'circularity', 'reports'
    ]
  }
};

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      const token = localStorage.getItem('smart_waste_token');
      if (stored && token) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load session:', e);
    }
    return null;
  }

  isAuthenticated() {
    return Boolean(this.currentUser && localStorage.getItem('smart_waste_token'));
  }

  saveSession(user, token) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
      if (token) {
        localStorage.setItem('smart_waste_token', token);
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getRole() {
    return this.currentUser?.role || null;
  }

  hasPermission(route) {
    if (!this.isAuthenticated()) return false;
    const role = this.getRole();
    const permissions = ROLE_PERMISSIONS[role]?.allowedRoutes || [];
    return permissions.includes(route);
  }

  isImpersonating() {
    return Boolean(localStorage.getItem('smart_waste_impersonator'));
  }

  isSuperAdmin() {
    if (this.currentUser?.role === 'SUPER_ADMIN') return true;
    const original = this.getOriginalUser();
    return original?.role === 'SUPER_ADMIN';
  }

  getOriginalUser() {
    try {
      const stored = localStorage.getItem('smart_waste_impersonator');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  impersonate(roleName) {
    if (!this.isSuperAdmin()) return;

    if (!this.isImpersonating()) {
      localStorage.setItem('smart_waste_impersonator', JSON.stringify(this.currentUser));
    }

    const targetUser = db.getUsers().find(u => u.role === roleName) || {
      id: `usr-${roleName.toLowerCase()}`,
      name: `Pengguna (${ROLE_PERMISSIONS[roleName]?.name || roleName})`,
      email: `pengguna.${roleName.toLowerCase()}@berkasih.id`,
      role: roleName
    };

    this.currentUser = targetUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify(targetUser));

    db.logAudit(
      this.currentUser,
      'IMPERSONATE_ROLE',
      'SESSION',
      targetUser.id,
      'Super Admin simulation',
      `Simulating Role: ${roleName}`
    );

    const event = new CustomEvent('app:auth-changed', {
      detail: { user: targetUser, role: roleName }
    });
    window.dispatchEvent(event);
  }

  stopImpersonating() {
    const original = this.getOriginalUser();
    if (!original) return;

    localStorage.removeItem('smart_waste_impersonator');
    this.currentUser = original;
    localStorage.setItem(AUTH_KEY, JSON.stringify(original));

    db.logAudit(
      original,
      'STOP_IMPERSONATE',
      'SESSION',
      original.id,
      'Returned to Super Admin',
      'Active Role: SUPER_ADMIN'
    );

    const event = new CustomEvent('app:auth-changed', {
      detail: { user: original, role: 'SUPER_ADMIN' }
    });
    window.dispatchEvent(event);
  }

  switchRole(roleName) {
    if (this.isSuperAdmin()) {
      this.impersonate(roleName);
      return;
    }

    const user = db.getUsers().find(u => u.role === roleName);
    if (user) {
      this.saveSession(user, 'dummy-auth-token');
    } else {
      // Fallback object
      this.saveSession({
        id: `usr-${roleName.toLowerCase()}`,
        name: `Pengguna (${ROLE_PERMISSIONS[roleName]?.name || roleName})`,
        email: `pengguna.${roleName.toLowerCase()}@berkasih.id`,
        role: roleName
      }, 'dummy-auth-token');
    }

    db.logAudit(
      this.currentUser,
      'SWITCH_ROLE',
      'SESSION',
      this.currentUser.id,
      'Switched active perspective',
      `Active Role: ${roleName}`
    );

    const event = new CustomEvent('app:auth-changed', {
      detail: { user: this.currentUser, role: roleName }
    });
    window.dispatchEvent(event);
  }

  getToken() {
    return localStorage.getItem('smart_waste_token') || '';
  }

  async login(email, password, remember = false) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Alamat email atau kata sandi tidak valid.');
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('smart_waste_token', data.token);
      }
      this.saveSession(data.user);

      const event = new CustomEvent('app:auth-changed', {
        detail: { user: data.user, role: data.user.role }
      });
      window.dispatchEvent(event);

      return data.user;
    } catch (e) {
      // If offline or network error, fallback to demo local check
      const user = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error(e.message || 'Alamat email atau akun tidak terdaftar di sistem BERKASIH SMART.');
      }
      this.saveSession(user);
      const event = new CustomEvent('app:auth-changed', {
        detail: { user, role: user.role }
      });
      window.dispatchEvent(event);
      return user;
    }
  }

  logout() {
    const prev = this.currentUser;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('smart_waste_token');
    localStorage.removeItem('smart_waste_impersonator');
    this.currentUser = null;
    if (prev) {
      db.logAudit(prev, 'USER_LOGOUT', 'SESSION', prev?.id, 'Active', 'Logged out');
    }
    const event = new CustomEvent('app:auth-changed', {
      detail: { user: null, role: null }
    });
    window.dispatchEvent(event);
  }
}

export const auth = new AuthService();
