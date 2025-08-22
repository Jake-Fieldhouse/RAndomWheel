import { loadGames, saveGames, loadSettings, saveSettings } from './gameManager.js';

const canvas = document.getElementById('wheel');
const spinBtn = document.getElementById('spin');
const resultDiv = document.getElementById('result');

if (canvas && spinBtn) {
  const ctx = canvas.getContext('2d');
  let games = [];
  let settings;
  let angle = 0;

  function drawWheel(items) {
    const arc = Math.PI * 2 / items.length;
    items.forEach((item, i) => {
      ctx.beginPath();
      ctx.fillStyle = i % 2 ? '#38bdf8' : '#a78bfa';
      ctx.moveTo(250, 250);
      ctx.arc(250, 250, 250, i * arc, (i + 1) * arc);
      ctx.fill();
      ctx.save();
      ctx.translate(250, 250);
      ctx.rotate(i * arc + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText(item.title, 230, 5);
      ctx.restore();
    });
  }

  async function spinWheel() {
    const selected = games[Math.floor(Math.random() * games.length)];
    resultDiv.textContent = `${selected.title} (${selected.console})`;
    selected.status = 'In Progress';
    settings.current_game_id = selected.id;
    await Promise.all([saveGames(games), saveSettings(settings)]);
  }

  (async () => {
    const [loadedGames, loadedSettings] = await Promise.all([loadGames(), loadSettings()]);
    games = loadedGames.filter(g => g.status !== 'Completed');
    settings = loadedSettings;
    drawWheel(games);
    spinBtn.addEventListener('click', spinWheel);
  })();
}
