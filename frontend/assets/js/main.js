(() => {
  'use strict';

  function initTheme() {
    const toggleBtn = document.getElementById('themeBtn');
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');

    function updateBtnState(theme) {
      if (!toggleBtn) return;
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    document.documentElement.dataset.theme = initial;
    updateBtnState(initial);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme;
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
        updateBtnState(next);
      });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const next = e.matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        updateBtnState(next);
      }
    });
  }

  function initMobileNav() {
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');

    if (!nav || !menuBtn) return;

    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
        menuBtn.focus();
      }
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          if (history.pushState) {
            history.pushState(null, '', targetId);
          }
        }
      });
    });
  }

  function initReveal() {
    const targets = document.querySelectorAll('.section, .project-card');
    if ('IntersectionObserver' in window && targets.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      targets.forEach((el) => observer.observe(el));
    } else {
      targets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function initZipDownload() {
    const downloadBtns = document.querySelectorAll('a[download*="karan-portfolio.zip"]');
    downloadBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const origText = btn.textContent;
        btn.textContent = 'Preparing Download...';
        btn.style.pointerEvents = 'none';

        try {
          const response = await fetch('/karan-portfolio.zip?v=' + Date.now(), {
            cache: 'no-store'
          });
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const blob = await response.blob();
          const zipBlob = new Blob([blob], { type: 'application/zip' });
          const blobUrl = URL.createObjectURL(zipBlob);
          const tempLink = document.createElement('a');
          tempLink.href = blobUrl;
          tempLink.download = 'karan-portfolio.zip';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
          btn.textContent = 'Downloaded!';
          setTimeout(() => {
            btn.textContent = origText;
            btn.style.pointerEvents = '';
          }, 3000);
        } catch (err) {
          console.warn('Direct blob download fallback:', err);
          window.location.href = '/karan-portfolio.zip?v=' + Date.now();
          setTimeout(() => {
            btn.textContent = origText;
            btn.style.pointerEvents = '';
          }, 2000);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initSmoothScroll();
    initReveal();
    initYear();
    initZipDownload();
  });
})();
