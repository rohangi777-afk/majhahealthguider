// ===== TRACKERS.JS =====

// Water Tracker
function initWaterTracker() {
  const container = document.getElementById('water-tracker');
  if (!container) return;
  const today = new Date().toDateString();
  let data = JSON.parse(localStorage.getItem('water_data') || '{}');
  if (data.date !== today) { data = { date: today, count: 0 }; localStorage.setItem('water_data', JSON.stringify(data)); }

  let html = '<div class="water-tracker">';
  for (let i = 1; i <= 8; i++) {
    html += `<div class="water-glass ${i <= data.count ? 'filled' : ''}" onclick="fillWater(${i})" title="ग्लास ${i}"></div>`;
  }
  html += `</div><div class="water-count">💧 ${data.count}/8 ग्लास पाणी प्यायलं</div>`;
  container.innerHTML = html;
}

function fillWater(n) {
  const data = { date: new Date().toDateString(), count: n };
  localStorage.setItem('water_data', JSON.stringify(data));
  initWaterTracker();
  if (n >= 8 && typeof completeTask === 'function') completeTask('water');
}

// Mood Tracker
function initMoodTracker() {
  const container = document.getElementById('mood-tracker');
  if (!container) return;
  const moods = [
    { emoji: '😄', label: 'खूप आनंदी', value: 5 },
    { emoji: '🙂', label: 'आनंदी', value: 4 },
    { emoji: '😐', label: 'ठीक', value: 3 },
    { emoji: '😔', label: 'उदास', value: 2 },
    { emoji: '😢', label: 'खूप उदास', value: 1 }
  ];
  const today = new Date().toDateString();
  const history = JSON.parse(localStorage.getItem('mood_history') || '[]');
  const todayMood = history.find(h => h.date === today);

  let html = '<div class="mood-options">';
  moods.forEach(m => {
    const sel = todayMood && todayMood.value === m.value ? 'selected' : '';
    html += `<button class="mood-btn ${sel}" onclick="setMood(${m.value})" title="${m.label}">${m.emoji}</button>`;
  });
  html += '</div>';
  if (todayMood) html += `<p style="text-align:center;color:var(--primary);font-weight:600;margin-top:0.5rem;">आजचा मूड: ${moods.find(m=>m.value===todayMood.value).label}</p>`;
  html += '<canvas id="mood-chart" class="mood-chart"></canvas>';
  container.innerHTML = html;
  renderMoodChart();
}

function setMood(value) {
  const today = new Date().toDateString();
  let history = JSON.parse(localStorage.getItem('mood_history') || '[]');
  history = history.filter(h => h.date !== today);
  history.push({ date: today, value });
  if (history.length > 7) history = history.slice(-7);
  localStorage.setItem('mood_history', JSON.stringify(history));
  initMoodTracker();
  if (typeof completeTask === 'function') completeTask('mood');
}

function renderMoodChart() {
  const canvas = document.getElementById('mood-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const history = JSON.parse(localStorage.getItem('mood_history') || '[]').slice(-7);
  if (history.length === 0) return;

  canvas.width = canvas.offsetWidth * 2;
  canvas.height = 300;
  ctx.scale(2, 2);
  const w = canvas.offsetWidth, h = 150, pad = 30;
  const stepX = (w - pad * 2) / Math.max(history.length - 1, 1);

  // Grid
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-light') || '#b2bec3';
  ctx.lineWidth = 0.5;
  for (let i = 1; i <= 5; i++) {
    const y = h - pad - ((i - 1) / 4) * (h - pad * 2);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
  }

  // Line
  ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 2.5; ctx.beginPath();
  history.forEach((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((d.value - 1) / 4) * (h - pad * 2);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots
  history.forEach((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((d.value - 1) / 4) * (h - pad * 2);
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2ecc71'; ctx.fill();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#2d3436';
    ctx.font = '10px Inter'; ctx.textAlign = 'center';
    const dayName = new Date(d.date).toLocaleDateString('mr-IN', { weekday: 'short' });
    ctx.fillText(dayName, x, h - 8);
  });
}

// Breathing Exercise
function startBreathing() {
  const circle = document.getElementById('breathing-circle');
  const statusEl = document.getElementById('breathing-status');
  if (!circle) return;
  let phase = 'inhale', count = 0, maxCycles = 5;

  function doCycle() {
    if (count >= maxCycles) { circle.className = 'breathing-circle'; statusEl.textContent = 'पूर्ण! 🎉'; if (typeof completeTask === 'function') completeTask('breathing'); return; }
    if (phase === 'inhale') {
      circle.className = 'breathing-circle inhale'; circle.textContent = 'श्वास घ्या...';
      statusEl.textContent = `चक्र ${count + 1}/${maxCycles}`;
      phase = 'exhale'; setTimeout(doCycle, 4000);
    } else {
      circle.className = 'breathing-circle exhale'; circle.textContent = 'श्वास सोडा...';
      phase = 'inhale'; count++; setTimeout(doCycle, 4000);
    }
  }
  doCycle();
}

// Affirmation Carousel
function initAffirmations() {
  const affirmations = [
    'मी दररोज अधिक मजबूत होत आहे! 💪', 'माझे आरोग्य माझ्या हातात आहे! 🌟',
    'मी शांत, स्थिर आणि आत्मविश्वासू आहे! 🧘', 'आज माझा सर्वोत्तम दिवस आहे! ☀️',
    'मी माझ्या शरीराची काळजी घेतो! ❤️', 'प्रत्येक दिवस एक नवीन संधी आहे! 🌈',
    'मी निरोगी आणि आनंदी आहे! 😊', 'मला माझ्या प्रगतीचा अभिमान आहे! 🏆',
    'मी सकारात्मक विचारांनी भरलेलो आहे! ✨', 'माझे मन आणि शरीर संतुलित आहे! ⚖️'
  ];
  const box = document.getElementById('affirmation-text');
  if (!box) return;
  let idx = 0;
  function show() { box.style.opacity = 0; setTimeout(() => { box.textContent = affirmations[idx]; box.style.opacity = 1; idx = (idx + 1) % affirmations.length; }, 300); }
  show();
  setInterval(show, 5000);
}
