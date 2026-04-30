// ===== BMI.JS =====
function calculateBMI() {
  const h = parseFloat(document.getElementById('height').value);
  const w = parseFloat(document.getElementById('weight').value);
  const resultDiv = document.getElementById('bmi-result');

  if (!h || !w || h <= 0 || w <= 0) {
    alert('कृपया योग्य उंची आणि वजन टाका.');
    return;
  }

  const bmi = (w / ((h / 100) ** 2)).toFixed(1);
  let category, color, suggestions;

  if (bmi < 18.5) {
    category = 'कमी वजन (Underweight)';
    color = '#74b9ff';
    suggestions = [
      '🍚 जास्त कॅलरीयुक्त आहार घ्या',
      '🥜 ड्रायफ्रूट्स, दूध, तूप, केळी खा',
      '💪 वजन वाढवण्यासाठी स्ट्रेंथ ट्रेनिंग करा',
      '🕐 दर 3 तासांनी काहीतरी खा',
      '👨‍⚕️ डॉक्टरांचा सल्ला घ्या'
    ];
  } else if (bmi < 25) {
    category = 'सामान्य वजन (Normal)';
    color = '#2ecc71';
    suggestions = [
      '✅ तुमचं वजन योग्य आहे!',
      '🥗 संतुलित आहार चालू ठेवा',
      '🏃 नियमित व्यायाम करा',
      '💧 भरपूर पाणी प्या',
      '😴 ७-८ तास झोप घ्या'
    ];
  } else if (bmi < 30) {
    category = 'जास्त वजन (Overweight)';
    color = '#ffa502';
    suggestions = [
      '🥬 जास्त भाज्या व फळे खा',
      '🚫 तेलकट, तळलेले पदार्थ टाळा',
      '🏃 दररोज ३० मिनिटे व्यायाम करा',
      '💧 जेवणापूर्वी पाणी प्या',
      '🍚 रात्रीचे जेवण हलके ठेवा'
    ];
  } else {
    category = 'लठ्ठपणा (Obese)';
    color = '#e17055';
    suggestions = [
      '⚠️ तातडीने जीवनशैली बदला',
      '👨‍⚕️ डॉक्टरांचा सल्ला अवश्य घ्या',
      '🚶 हळूहळू चालणे सुरू करा',
      '🍎 प्रोसेस्ड फूड पूर्णपणे टाळा',
      '📝 आहार डायरी ठेवा'
    ];
  }

  // Save to history
  const history = JSON.parse(localStorage.getItem('bmi_history') || '[]');
  history.push({ date: new Date().toLocaleDateString('mr-IN'), bmi, category });
  if (history.length > 10) history.shift();
  localStorage.setItem('bmi_history', JSON.stringify(history));

  // Gauge marker position (BMI 10-40 range)
  const gaugePos = Math.min(Math.max(((bmi - 10) / 30) * 100, 2), 98);

  resultDiv.innerHTML = `
    <div class="bmi-value" style="color:${color}">${bmi}</div>
    <div class="bmi-category" style="color:${color}">${category}</div>
    <div class="bmi-gauge"><div class="bmi-gauge-marker" style="left:${gaugePos}%"></div></div>
    <div style="text-align:left;margin-top:1.5rem;">
      <h4 style="margin-bottom:0.8rem;font-weight:700;">💡 आरोग्य सूचना:</h4>
      ${suggestions.map(s => `<p style="margin:0.4rem 0;font-size:0.95rem;">${s}</p>`).join('')}
    </div>
  `;
  resultDiv.classList.add('show');
  resultDiv.style.background = `${color}15`;
  resultDiv.style.border = `2px solid ${color}30`;

  // Award points
  if (typeof completeTask === 'function') completeTask('bmi');
  renderBMIHistory();
}

function renderBMIHistory() {
  const container = document.getElementById('bmi-history');
  if (!container) return;
  const history = JSON.parse(localStorage.getItem('bmi_history') || '[]');
  if (history.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">अजून कोणतीही नोंद नाही</p>'; return; }
  container.innerHTML = `<h3 style="margin-bottom:1rem;font-weight:700;">📊 मागील नोंदी</h3>
    <table class="diet-table"><thead><tr><th>तारीख</th><th>BMI</th><th>श्रेणी</th></tr></thead><tbody>
    ${history.reverse().map(h => `<tr><td>${h.date}</td><td>${h.bmi}</td><td>${h.category}</td></tr>`).join('')}
    </tbody></table>`;
}
