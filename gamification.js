// ===== GAMIFICATION.JS =====
const GAME_KEY = 'mhg_game';

function getGameData() {
  const def = { streak: 0, points: 0, lastVisit: null, tasks: {}, badges: [] };
  try { return JSON.parse(localStorage.getItem(GAME_KEY)) || def; } catch { return def; }
}
function saveGameData(d) { localStorage.setItem(GAME_KEY, JSON.stringify(d)); }

function updateStreak() {
  const d = getGameData();
  const today = new Date().toDateString();
  if (d.lastVisit === today) return d;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (d.lastVisit === yesterday) { d.streak++; } else if (d.lastVisit !== today) { d.streak = 1; }
  d.lastVisit = today;
  d.points += 10; // daily visit points
  saveGameData(d);
  return d;
}

function completeTask(taskName) {
  const d = getGameData();
  const today = new Date().toDateString();
  if (!d.tasks[today]) d.tasks[today] = [];
  if (!d.tasks[today].includes(taskName)) {
    d.tasks[today].push(taskName);
    d.points += 20;
    checkBadges(d);
    saveGameData(d);
    showPointsPopup('+20 गुण! 🎉');
  }
  return d;
}

function checkBadges(d) {
  if (d.points >= 50 && !d.badges.includes('beginner')) d.badges.push('beginner');
  if (d.points >= 200 && !d.badges.includes('active')) d.badges.push('active');
  if (d.points >= 500 && !d.badges.includes('pro')) d.badges.push('pro');
}

function showPointsPopup(msg) {
  const popup = document.createElement('div');
  popup.textContent = msg;
  popup.style.cssText = 'position:fixed;top:80px;right:20px;background:linear-gradient(135deg,#2ecc71,#0984e3);color:#fff;padding:12px 24px;border-radius:12px;font-weight:700;z-index:9999;animation:fadeIn 0.3s ease;font-family:inherit;box-shadow:0 4px 15px rgba(0,0,0,0.2);';
  document.body.appendChild(popup);
  setTimeout(() => { popup.style.opacity = '0'; popup.style.transition = 'opacity 0.5s'; setTimeout(() => popup.remove(), 500); }, 2000);
}

function renderGamification() {
  const d = updateStreak();
  const container = document.getElementById('gamification');
  if (!container) return;

  const todayTasks = d.tasks[new Date().toDateString()] || [];
  const goalCount = 5;
  const progress = Math.min((todayTasks.length / goalCount) * 100, 100);

  container.innerHTML = `
    <div class="gamification animate-in">
      <div class="card stat-card"><div class="stat-icon">🔥</div><div class="stat-value">${d.streak}</div><div class="stat-label">दिवस स्ट्रीक</div></div>
      <div class="card stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${d.points}</div><div class="stat-label">एकूण गुण</div></div>
      <div class="card stat-card"><div class="stat-icon">✅</div><div class="stat-value">${todayTasks.length}/${goalCount}</div><div class="stat-label">आजची कामे</div></div>
      <div class="card stat-card">
        <div class="stat-icon">🏅</div>
        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px;">
          <span class="badge ${d.badges.includes('beginner') ? 'badge-beginner' : 'badge-locked'}">🌱 नवशिक्या</span>
          <span class="badge ${d.badges.includes('active') ? 'badge-active' : 'badge-locked'}">⚡ सक्रिय</span>
          <span class="badge ${d.badges.includes('pro') ? 'badge-pro' : 'badge-locked'}">🏆 प्रो</span>
        </div>
        <div class="stat-label" style="margin-top:8px">बॅजेस</div>
      </div>
    </div>
    <div class="progress-container animate-in" style="margin-top:1.5rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;font-weight:600;">
        <span>आजची प्रगती</span><span>${Math.round(progress)}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    </div>
  `;
  initScrollAnimations();
}
