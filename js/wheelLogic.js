import { loadGames, saveGames, loadSettings, saveSettings } from './gameManager.js';

const canvas = document.getElementById('wheel');
const spinBtn = document.getElementById('spin');
const resultDiv = document.getElementById('result');

if (canvas && spinBtn) {
  const ctx = canvas.getContext('2d');
  let games = [];
  let settings;
  let angle = 0;
  let spinning = false;
  let selectedGame = null;

  function drawWheel(items) {
    const arc = Math.PI * 2 / items.length;
    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle);
    items.forEach((item, i) => {
      ctx.beginPath();
      ctx.fillStyle = i % 2 ? '#38bdf8' : '#a78bfa';
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 250, i * arc, (i + 1) * arc);
      ctx.fill();
      ctx.save();
      ctx.rotate(i * arc + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText(item.title, 230, 5);
      ctx.restore();
    });
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(250, 0);
    ctx.lineTo(240, 20);
    ctx.lineTo(260, 20);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  function finalizeSpin(totalAngle) {
    const arc = Math.PI * 2 / games.length;
    const index = Math.floor(((Math.PI * 2 - (totalAngle % (Math.PI * 2))) / arc)) % games.length;
    selectedGame = games[index];
    resultDiv.innerHTML = `<p>${selectedGame.title} (${selectedGame.console})</p>` +
      `<button id="accept">Accept</button> <button id="again">Spin Again</button>`;
    document.getElementById('accept').addEventListener('click', acceptSelection);
    document.getElementById('again').addEventListener('click', () => { resultDiv.textContent = ''; });
  }

  function spinWheel() {
    if (spinning) return;
    resultDiv.textContent = '';
    spinning = true;
    const spinTime = 4000 + Math.random() * 1000;
    const spinAngle = Math.PI * 10 + Math.random() * Math.PI * 4;
    const start = performance.now();
    function animate(now) {
      const elapsed = now - start;
      if (elapsed < spinTime) {
        const progress = elapsed / spinTime;
        const eased = 1 - Math.pow(1 - progress, 3);
        angle = spinAngle * eased;
        drawWheel(games);
        requestAnimationFrame(animate);
      } else {
        angle = spinAngle;
        drawWheel(games);
        spinning = false;
        finalizeSpin(angle);
      }
    }
    requestAnimationFrame(animate);
  }

  async function acceptSelection() {
    if (!selectedGame) return;
    selectedGame.status = 'In Progress';
    settings.current_game_id = selectedGame.id;
    await Promise.all([saveGames(games), saveSettings(settings)]);
    resultDiv.textContent = `${selectedGame.title} (${selectedGame.console})`;
    games = games.filter(g => g.id !== selectedGame.id);
    drawWheel(games);
  }

  (async () => {
    const [loadedGames, loadedSettings] = await Promise.all([loadGames(), loadSettings()]);
    games = loadedGames.filter(g => g.status !== 'Completed');
    settings = loadedSettings;
    drawWheel(games);
    spinBtn.addEventListener('click', spinWheel);
  })();
}
