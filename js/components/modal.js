/**
 * BERKASIH SMART - Accessible Modal System
 */

export class Modal {
  static open(options = {}) {
    const {
      title = 'Informasi',
      content = '',
      footer = '',
      size = 'md', // sm, md, lg, xl
      onClose = null
    } = options;

    // Remove existing modal if any
    const existing = document.getElementById('active-modal-backdrop');
    if (existing) existing.remove();

    const sizeClass = size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';

    const backdrop = document.createElement('div');
    backdrop.id = 'active-modal-backdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-container ${sizeClass}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">${title}</h3>
          <button class="btn-icon" id="modal-close-btn" aria-label="Tutup Dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body" id="modal-content-slot">
          ${typeof content === 'string' ? content : ''}
        </div>
        ${footer ? `<div class="modal-footer" id="modal-footer-slot">${footer}</div>` : ''}
      </div>
    `;

    document.body.appendChild(backdrop);

    if (typeof content !== 'string' && content instanceof HTMLElement) {
      backdrop.querySelector('#modal-content-slot').appendChild(content);
    }

    // Trigger animation
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
    });

    const closeModal = () => {
      backdrop.classList.remove('is-open');
      setTimeout(() => {
        backdrop.remove();
        if (onClose) onClose();
      }, 200);
      document.removeEventListener('keydown', handleKey);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handleKey);
    backdrop.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    return {
      close: closeModal,
      element: backdrop
    };
  }

  static close() {
    const existing = document.getElementById('active-modal-backdrop');
    if (existing) {
      existing.classList.remove('is-open');
      setTimeout(() => existing.remove(), 200);
    }
  }
}
