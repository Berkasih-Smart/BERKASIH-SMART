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
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load session:', e);
    }

    // Default to Super Admin (Hendra Gunawan) for rich evaluation experience
    const defaultUser = db.getUsers().find(u => u.role === 'SUPER_ADMIN') || {
      id: 'usr-01',
      name: 'Hendra Gunawan, S.T.',
      email: 'hendra@berkasih.id',
      role: 'SUPER_ADMIN'
    };
    this.saveSession(defaultUser);
    return defaultUser;
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getRole() {
    return this.currentUser?.role || 'SUPER_ADMIN';
  }

  hasPermission(route) {
    const role = this.getRole();
    const permissions = ROLE_PERMISSIONS[role]?.allowedRoutes || [];
    return permissions.includes(route);
  }

  switchRole(roleName) {
    const user = db.getUsers().find(u => u.role === roleName);
    if (user) {
      this.saveSession(user);
    } else {
      // Fallback object
      this.saveSession({
        id: `usr-demo-${roleName.toLowerCase()}`,
        name: `Pengguna Demo (${ROLE_PERMISSIONS[roleName]?.name || roleName})`,
        email: `demo.${roleName.toLowerCase()}@berkasih.id`,
        role: roleName
      });
    }

    db.logAudit(
      this.currentUser,
      'SWITCH_ROLE_DEMO',
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

  login(email, password, remember = false) {
    const user = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Alamat email atau akun tidak terdaftar di sistem BERKASIH SMART.');
    }
    // Demo accepts any password > 3 chars
    if (!password || password.length < 4) {
      throw new Error('Kata sandi harus minimal 4 karakter.');
    }

    this.saveSession(user);
    db.logAudit(user, 'USER_LOGIN', 'SESSION', user.id, 'Logged out', 'Logged in via form');
    return user;
  }

  logout() {
    db.logAudit(this.currentUser, 'USER_LOGOUT', 'SESSION', this.currentUser?.id, 'Active', 'Logged out');
    // Re-default to super admin or redirect to login
    this.switchRole('SUPER_ADMIN');
  }
}

export const auth = new AuthService();
