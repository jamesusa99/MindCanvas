/**
 * MindCanvas 心幕 — 官网交互脚本
 * i18n: 默认英文，可切换中文
 */

let currentLang = 'en';
let countersAnimated = false;

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initHeader();
  initScenarioCarousel();
  initCounters();
  initSolutionCards();
  initNavToggle();
});

// ========== i18n ==========
function initI18n() {
  const stored = localStorage.getItem('mindcanvas-lang');
  currentLang = stored === 'zh' ? 'zh' : 'en';

  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  updateDocMeta(currentLang);
  applyTranslations(currentLang, { updateStats: false });
  updateLangButtons(currentLang);
  initLangSwitcher();
}

function updateDocMeta(lang) {
  const titles = {
    en: 'MindCanvas — Full-Scenario Digital Mental Health Ecosystem',
    zh: 'MindCanvas 心幕 — 全场景数字化心理健康生态系统'
  };
  const desc = {
    en: 'Weaving the canvas of mind with AI, guarding clear skies for every soul. World-class engineering, a decade in education, millions of students.',
    zh: '用 AI 编织心智的画布，守护每一颗心灵的晴空。立足顶尖工程科技，深耕教育十年，服务千万学子。'
  };
  document.title = titles[lang];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = desc[lang];
}

function applyTranslations(lang, opts = {}) {
  if (typeof translations === 'undefined') return;
  const t = translations[lang] || translations.en;

  // data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!(key in t)) return;
    const val = t[key];
    if (key.startsWith('about3') || key === 'visionText' || (key.startsWith('scene') && key.endsWith('Value'))) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // data-i18n-unit (stat units)
  document.querySelectorAll('[data-i18n-unit]').forEach(el => {
    const key = el.getAttribute('data-i18n-unit');
    const val = t[key];
    if (val) el.textContent = val;
  });

  // Stat numbers (only when switching lang, not on initial load)
  if (opts.updateStats !== false) {
    updateStatNumbers(lang);
  }
}

function getStatTarget(el, lang) {
  const key = `data-target-${lang}`;
  const raw = el.getAttribute(key);
  if (!raw) return 0;
  const n = parseFloat(raw);
  return isNaN(n) ? 0 : n;
}

function formatStatValue(val, el) {
  if (el.classList.contains('stat-percent')) return Math.round(val);
  return val % 1 === 0 ? Math.round(val) : val.toFixed(1);
}

function updateStatNumbers(lang) {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = getStatTarget(el, lang);
    el.textContent = formatStatValue(target, el);
  });
}

function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;

      currentLang = lang;
      localStorage.setItem('mindcanvas-lang', lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

      updateDocMeta(lang);
      applyTranslations(lang, { updateStats: true });
      updateLangButtons(lang);

      // Close mobile nav after switch
      document.querySelector('.nav-toggle')?.classList.remove('active');
      document.querySelector('.nav-links')?.classList.remove('active');
    });
  });
}

function updateLangButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// ========== Header ==========
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const threshold = 50;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.pageYOffset > threshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ========== Scenario Carousel ==========
function initScenarioCarousel() {
  const slides = document.querySelectorAll('.scenario-slide');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  if (!slides.length || !indicators.length) return;

  let current = 0;
  const total = slides.length;
  const intervalMs = 5500;
  let timer = null;

  function goTo(index) {
    current = ((index % total) + total) % total;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === current));
  }

  function next() {
    goTo(current + 1);
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, intervalMs);
  }

  function resetTimer() {
    startTimer();
  }

  indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      goTo(i);
      resetTimer();
    });
  });

  startTimer();
}

// ========== Counters ==========
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = getStatTarget(el, currentLang);
        animateCounter(el, 0, target, 1800);
        observer.unobserve(el);
      });
      countersAnimated = true;
    },
    { threshold: 0.3 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}

function animateCounter(element, start, end, duration) {
  const isDecimal = end % 1 !== 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = start + (end - start) * eased;

    element.textContent = isDecimal ? value.toFixed(1) : Math.round(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = isDecimal ? end.toFixed(1) : Math.round(end);
    }
  }

  requestAnimationFrame(update);
}

// ========== Solution Cards ==========
function initSolutionCards() {
  const cards = document.querySelectorAll('.solution-card');
  if (!cards.length) return;

  document.querySelectorAll('.card-link').forEach((link) => {
    link.addEventListener('click', (e) => e.stopPropagation());
  });

  if ('ontouchstart' in window) {
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => (c !== card ? c.classList.remove('flipped') : null));
        card.classList.toggle('flipped');
      });
    });
  }
}

// ========== Mobile Nav ==========
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}
