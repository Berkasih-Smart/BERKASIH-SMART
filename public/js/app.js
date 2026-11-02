/**
 * BERKASIH SMART - Main Application Controller & Router
 * Bank Sampah BERKASIH (Bersama Karyamulya Bersih)
 */

import { auth } from './auth/auth.js';
import { db } from './db/schema.js';
import { renderHeader } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { openDepositWizard } from './modules/setoran.js';

// Module Renderers
import { renderDashboard } from './modules/dashboard.js';
import { renderNasabah } from './modules/nasabah.js';
import { renderSetoran } from './modules/setoran.js';
import { renderTabungan } from './modules/tabungan.js';
import { renderInventori } from './modules/inventori.js';
import { renderPenjemputan } from './modules/penjemputan.js';
import { renderMitra } from './modules/mitra.js';
import { renderAnalytics } from './modules/analytics.js';
import { renderSmartMap } from './modules/smartmap.js';
import { renderAreaPotential } from './modules/areapotential.js';
import { renderAIChat } from './modules/ai.js';
import { renderInsights } from './modules/insights.js';
import { renderForecast } from './modules/forecast.js';
import { renderImpact } from './modules/impact.js';
import { renderCircularity } from './modules/circularity.js';
import { renderPrograms } from './modules/programs.js';
import { renderReports } from './modules/reports.js';
import { renderSystem } from './modules/system.js';
import { renderCustomerPortal } from './modules/customerportal.js';
import { renderLoginPage } from './modules/login.js';
import { renderLandingPage } from './modules/landing.js';

class AppController {
  constructor() {
    this.currentRoute = 'dashboard';
    this.init();
  }

  async init() {
    this.setupListeners();
    if (db && db.isReady) {
      await db.isReady;
    }
    this.handleRoute();
  }

  setupListeners() {
    // URL Hash Routing
    window.addEventListener('hashchange', () => this.handleRoute());

    // Reactive State Changed Listener (When deposits, inventory, savings or price changes)
    window.addEventListener('app:state-changed', (e) => {
      console.log('Database state changed:', e.detail);
      this.refreshCurrentView();
    });

    // Role Switcher / Auth Changed Listener
    window.addEventListener('app:auth-changed', (e) => {
      console.log('Role/auth changed to:', e.detail?.role);
      if (!e.detail?.user) {
        window.location.hash = '#login';
      } else if (e.detail.role === 'CUSTOMER') {
        window.location.hash = '#customer-portal';
      } else {
        window.location.hash = '#dashboard';
      }
      this.handleRoute();
    });

    // Quick Deposit Shortcut
    window.addEventListener('app:open-deposit-modal', () => {
      openDepositWizard();
    });
  }

  handleRoute() {
    let rawHash = window.location.hash.replace('#', '').trim();
    const landingAnchors = ['katalog-harga', 'dampak', 'cara-kerja', 'jadwal'];
    if (landingAnchors.includes(rawHash)) {
      if (this.currentRoute === 'landing') {
        const el = document.getElementById(rawHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      rawHash = 'landing';
    }

    let route = rawHash || (auth.isAuthenticated() ? 'dashboard' : 'landing');

    // Route permissions & auth check
    if (!auth.isAuthenticated()) {
      if (route !== 'landing' && route !== 'login') {
        route = 'login';
        if (window.location.hash !== '#login') {
          window.location.hash = '#login';
          return;
        }
      }
    } else if (route === 'login') {
      route = auth.getRole() === 'CUSTOMER' ? 'customer-portal' : 'dashboard';
      window.location.hash = `#${route}`;
      return;
    }

    const currentRole = auth.getRole();
    if (currentRole === 'CUSTOMER' && route === 'dashboard') {
      route = 'customer-portal';
    }

    if (route !== 'login' && route !== 'landing' && !auth.hasPermission(route) && route !== 'customer-portal') {
      console.warn(`Role ${currentRole} does not have access to route: ${route}`);
      // Fallback to first allowed route
      route = currentRole === 'CUSTOMER' ? 'customer-portal' : 'dashboard';
      window.location.hash = `#${route}`;
      return;
    }

    this.currentRoute = route;
    this.renderShell(route);
    this.renderModule(route);
  }

  renderShell(activeRoute) {
    const headerContainer = document.getElementById('app-header-slot');
    const sidebarContainer = document.getElementById('app-sidebar-slot');

    if (activeRoute === 'login' || activeRoute === 'landing') {
      if (headerContainer) headerContainer.style.display = 'none';
      if (sidebarContainer) sidebarContainer.style.display = 'none';
      return;
    }

    if (headerContainer) {
      headerContainer.style.display = '';
      renderHeader(headerContainer);
    }

    if (sidebarContainer) {
      sidebarContainer.style.display = '';
      renderSidebar(sidebarContainer, activeRoute, (targetRoute) => {
        window.location.hash = `#${targetRoute}`;
      });
    }
  }

  renderModule(route) {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    switch (route) {
      case 'landing':
        renderLandingPage(mainContainer);
        break;
      case 'login':
        renderLoginPage(mainContainer);
        break;
      case 'dashboard':
        renderDashboard(mainContainer);
        break;
      case 'nasabah':
        renderNasabah(mainContainer);
        break;
      case 'setoran':
        renderSetoran(mainContainer);
        break;
      case 'tabungan':
      case 'penarikan':
        renderTabungan(mainContainer);
        break;
      case 'inventori':
        renderInventori(mainContainer);
        break;
      case 'penjemputan':
        renderPenjemputan(mainContainer);
        break;
      case 'mitra':
      case 'mitra-portal':
        renderMitra(mainContainer);
        break;
      case 'analytics':
        renderAnalytics(mainContainer);
        break;
      case 'smartmap':
        renderSmartMap(mainContainer);
        break;
      case 'areapotential':
        renderAreaPotential(mainContainer);
        break;
      case 'ai-chat':
        renderAIChat(mainContainer);
        break;
      case 'insights':
        renderInsights(mainContainer);
        break;
      case 'forecast':
        renderForecast(mainContainer);
        break;
      case 'impact':
        renderImpact(mainContainer);
        break;
      case 'circularity':
        renderCircularity(mainContainer);
        break;
      case 'programs':
        renderPrograms(mainContainer);
        break;
      case 'reports':
      case 'export':
        renderReports(mainContainer);
        break;
      case 'users':
      case 'master-data':
      case 'settings':
      case 'audit-log':
        renderSystem(mainContainer);
        break;
      case 'customer-portal':
        renderCustomerPortal(mainContainer);
        break;
      default:
        renderDashboard(mainContainer);
    }

    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }

  refreshCurrentView() {
    this.renderShell(this.currentRoute);
    this.renderModule(this.currentRoute);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
