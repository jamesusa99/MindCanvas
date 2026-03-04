/**
 * MindCanvas 研究页 — 多语言与导航
 */

(function () {
  if (typeof researchTranslations === 'undefined') return;

  let lang = localStorage.getItem('mindcanvas-lang') === 'zh' ? 'zh' : 'en';

  function apply() {
    const t = researchTranslations[lang] || researchTranslations.en;
    const nav = typeof navTranslations !== 'undefined' ? navTranslations[lang] : null;

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    document.title = lang === 'zh' ? '心幕 — 研究' : 'MindCanvas — Research';

    document.querySelectorAll('[data-research]').forEach((el) => {
      const key = el.getAttribute('data-research');
      if (!key || key.endsWith('Points')) return;
      if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-research-list]').forEach((el) => {
      const key = el.getAttribute('data-research-list');
      const arr = t[key];
      if (!Array.isArray(arr)) return;
      el.innerHTML = arr.map((item) => `<li>${item}</li>`).join('');
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
