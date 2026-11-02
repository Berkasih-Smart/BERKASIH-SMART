/**
 * BERKASIH SMART - Sidebar Navigation Component
 * Adheres strictly to Section 4 Main Admin Navigation
 */

import { auth } from '../auth/auth.js';
import { db } from '../db/schema.js';

export function renderSidebar(container, activeRoute = 'dashboard', onNavigate = () => {}) {
  const currentRole = auth.getRole();

  // Navigation Items Definition with Icons
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`
        }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'nasabah',
          label: 'Nasabah',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
        },
        {
          id: 'setoran',
          label: 'Setoran Sampah',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
        },
        {
          id: 'tabungan',
          label: 'Tabungan & Penarikan',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
        },
        {
          id: 'inventori',
          label: 'Inventori Sampah',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>`
        },
        {
          id: 'penjemputan',
          label: 'Penjemputan',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`
        },
        {
          id: 'mitra',
          label: 'Mitra',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`
        }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`
        },
        {
          id: 'smartmap',
          label: 'Smart Map (GIS)',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`
        },
        {
          id: 'areapotential',
          label: 'Area Potential',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`
        },
        {
          id: 'insights',
          label: 'AI Insights & Alerts',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
        },
        {
          id: 'ai-chat',
          label: 'BERKASIH AI',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
        },
        {
          id: 'forecast',
          label: 'Forecast',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
        }
      ]
    },
    {
      title: 'IMPACT',
      items: [
        {
          id: 'impact',
          label: 'Environmental Impact',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>`
        },
        {
          id: 'circularity',
          label: 'Circularity',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>`
        },
        {
          id: 'programs',
          label: 'Programs & Campaigns',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`
        }
      ]
    },
    {
      title: 'REPORTING',
      items: [
        {
          id: 'reports',
          label: 'Reports',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
        },
        {
          id: 'export',
          label: 'Export Data',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`
        }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'users',
          label: 'Users & Roles',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
        },
        {
          id: 'master-data',
          label: 'Master Data',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`
        },
        {
          id: 'settings',
          label: 'Settings & Data Health',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
        },
        {
          id: 'audit-log',
          label: 'Audit Log',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`
        }
      ]
    }
  ];

  let navSectionsHtml = '';

  for (const section of navSections) {
    // Filter items based on user role permissions
    const accessibleItems = section.items.filter(item => auth.hasPermission(item.id));
    if (accessibleItems.length === 0) continue;

    navSectionsHtml += `
      <div style="margin-bottom: 18px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #9CA3AF; letter-spacing: 0.08em; padding: 0 16px 6px 16px;">
          ${section.title}
        </div>
        <nav style="display: flex; flex-direction: column; gap: 2px;">
          ${accessibleItems.map(item => `
            <a 
              href="#${item.id}" 
              class="nav-link-item ${activeRoute === item.id ? 'active' : ''}"
              data-route="${item.id}"
              style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 16px;
                border-radius: 8px;
                margin: 0 8px;
                font-size: 0.84rem;
                font-weight: ${activeRoute === item.id ? '600' : '500'};
                color: ${activeRoute === item.id ? '#14532D' : '#4B5563'};
                background-color: ${activeRoute === item.id ? '#DCFCE7' : 'transparent'};
                transition: all 150ms ease;
              "
            >
              <span style="color: ${activeRoute === item.id ? '#15803D' : '#6B7280'};">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Sidebar Header / Brand -->
    <div style="padding: 20px 20px 16px 20px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; gap: 12px;">
      <img src="assets/logo.svg" alt="BERKASIH SMART Logo" style="width: 38px; height: 38px;" />
      <div style="line-height: 1.2;">
        <div style="font-weight: 800; font-size: 1.05rem; color: #14532D; letter-spacing: -0.02em;">BERKASIH SMART</div>
        <div style="font-size: 0.7rem; font-weight: 600; color: #15803D;">Bank Sampah Karyamulya</div>
        <div style="font-size: 0.65rem; color: #6B7280;">Cirebon, Indonesia</div>
      </div>
    </div>

    <!-- Navigation List (Scrollable) -->
    <div style="flex: 1; overflow-y: auto; padding: 14px 0;">
      ${navSectionsHtml}
    </div>

    <!-- Sidebar Footer / Data Status -->
    <div style="padding: 12px 16px; border-top: 1px solid var(--color-border); background-color: #F9FAFB; font-size: 0.72rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span class="badge badge-live" title="Data operasional terverifikasi Bank Sampah Karyamulya">TERVERIFIKASI</span>
      </div>
      <div style="color: #6B7280; font-size: 0.66rem; line-height: 1.3;">
        "Dari Sampah Menjadi Data, Dari Data Menjadi Aksi."
      </div>
      <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--color-border);">
        <a href="#landing" style="font-size: 0.72rem; color: #15803D; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Halaman Publik (Landing)
        </a>
      </div>
    </div>
  `;

  // Attach Navigation Listeners
  container.querySelectorAll('.nav-link-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      onNavigate(route);

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.app-sidebar');
      if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('is-open');
      }
    });
  });
}
