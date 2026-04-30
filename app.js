// ===== app.js - Core functionality =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initScrollAnimations();
});

// Dark Mode
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile Nav
function initNav() {
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (ham && links) {
    ham.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }
}

// Scroll Animations
function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-in').forEach(el => obs.observe(el));
}

// Tab System
function openTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}

// Accordion
function toggleAccordion(header) {
  const body = header.nextElementSibling;
  const isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
  if (!isOpen) { body.classList.add('open'); header.classList.add('active'); }
}

// Daily Reminder
function initReminders() {
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        const now = new Date();
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);
        if (now > target) target.setDate(target.getDate() + 1);
        const delay = target - now;
        setTimeout(() => {
          new Notification('माझा हेल्थ गायडर 🌿', { body: 'सुप्रभात! आजचा व्यायाम आणि आहार ट्रॅक करा! 💪' });
          setInterval(() => {
            new Notification('माझा हेल्थ गायडर 🌿', { body: 'सुप्रभात! आजचा व्यायाम आणि आहार ट्रॅक करा! 💪' });
          }, 86400000);
        }, delay);
      }
    });
  }
}

// Navbar helper
function getNavHTML(activePage) {
  const pages = [
    { href: 'index.html', icon: '🏠', label: 'मुख्यपृष्ठ', id: 'home' },
    { href: 'diet.html', icon: '🥗', label: 'जेवण-खाणं', id: 'diet' },
    { href: 'mental.html', icon: '🧠', label: 'मानसिक आरोग्य', id: 'mental' },
    { href: 'bmi.html', icon: '⚖️', label: 'BMI', id: 'bmi' },
    { href: 'diet-planner.html', icon: '📋', label: 'डाएट प्लॅन', id: 'planner' },
    { href: 'yoga.html', icon: '🧘', label: 'योगा', id: 'yoga' },
    { href: 'workout.html', icon: '💪', label: 'व्यायाम', id: 'workout' },
  ];
  const links = pages.map(p => `<li><a href="${p.href}" class="${p.id === activePage ? 'active' : ''}">${p.icon} ${p.label}</a></li>`).join('');
  return `<nav class="navbar">
    <a href="index.html" class="nav-brand">🌿 माझा हेल्थ गायडर</a>
    <ul class="nav-links">${links}</ul>
    <div class="nav-right">
      <button class="theme-toggle" onclick="toggleTheme()">🌙</button>
      <button class="hamburger" onclick="this.nextElementSibling ? null : null; document.querySelector('.nav-links').classList.toggle('open')">☰</button>
    </div>
  </nav>`;
}
