/**
 * MindCanvas 产品页 — 多语言与导航
 */

(function () {
  const product = document.body.dataset.product;
  if (!product || !productTranslations[product]) return;

  let lang = localStorage.getItem('mindcanvas-lang') === 'zh' ? 'zh' : 'en';

  function apply() {
    const t = productTranslations[product][lang];
    const nav = typeof navTranslations !== 'undefined' ? navTranslations[lang] : null;

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-pi18n]').forEach((el) => {
      const key = el.getAttribute('data-pi18n');
      if (t && t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-pi18n-html]').forEach((el) => {
      const key = el.getAttribute('data-pi18n-html');
      if (t && t[key]) el.innerHTML = t[key];
    });

    if (nav) {
      document.querySelectorAll('[data-nav]').forEach((el) => {
        const key = el.getAttribute('data-nav');
        if (nav[key] !== undefined) el.textContent = nav[key];
      });
      const logoSub = document.querySelector('.logo-sub');
      const footerCopy = document.querySelector('.footer-copy');
      if (logoSub && nav.logoSub !== undefined) logoSub.textContent = nav.logoSub;
      if (footerCopy && nav.footerCopy !== undefined) footerCopy.textContent = nav.footerCopy;
    }

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      lang = btn.dataset.lang;
      localStorage.setItem('mindcanvas-lang', lang);
      apply();
    });
  });

  document.addEventListener('DOMContentLoaded', apply);

  document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('active');
    document.querySelector('.nav-toggle')?.classList.toggle('active');
  });
})();
