/* eslint-env browser */
/* eslint no-console: "warn", no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Sticky header shadow on scroll
  const header = $('.site-header');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const nav = $('#nav');
  const navToggle = $('.nav-toggle');
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close nav on link click (mobile)
  nav?.addEventListener('click', (e) => {
    if (e.target.matches('a') && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Intersection animations
  const inview = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  $$('[data-inview]').forEach((el) => inview.observe(el));

  // Carousel: snap on wheel (horizontal)
  const carousel = $('[data-carousel]');
  if (carousel) {
    carousel.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        carousel.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Configurator modal
  const config = $('#config');
  const priceOut = $('#cfg-price');
  const openers = $$('[data-open-config]');
  openers.forEach((btn) => btn.addEventListener('click', () => config.showModal()));
  config?.addEventListener('click', (e) => {
    // Click outside panel closes the dialog
    if (e.target === config) config.close();
  });

  // Toy pricing logic — replace with real data later
  const base = { S: 84900, Sportback: 78900, RS: 98900 };
  const power = { Dual: 0, Tri: 12000 };
  const pack = { Performance: 6500, 'Grand Touring': 4500, 'Urban Tech': 3800 };

  const fmt = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const inputs = ['cfg-model', 'cfg-power', 'cfg-pack'].map((id) => $(`#${id}`));
  const recalc = () => {
    const m = $('#cfg-model').value;
    const p = $('#cfg-power').value;
    const pk = $('#cfg-pack').value;
    const sum = (base[m] ?? 0) + (power[p] ?? 0) + (pack[pk] ?? 0);
    priceOut.textContent = fmt(sum);
  };
  inputs.forEach((el) => el.addEventListener('change', recalc));
  recalc();

  // Year in footer
  $('#year').textContent = String(new Date().getFullYear());

  // Accessibility nicety: close dialog on Escape even inside nested elements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && config?.open) config.close();
  });

  // Debug hint (because future you will forget)
  console.debug('[Quattroverse] Ready. Replace image URLs with your assets when integrating CMS.');
})();
