import { loadGames, loadSettings } from './gameManager.js';

let start;

async function updateOverlay() {
  const [games, settings] = await Promise.all([loadGames(), loadSettings()]);
  const current = games.find(g => g.id === settings.current_game_id);
  if (!current) return;
  document.getElementById('boxart').src = current.image_url;
  document.getElementById('gameTitle').textContent = current.title;
  document.getElementById('gameConsole').textContent = current.console;
  document.getElementById('goal').textContent = settings.goal || '';
  document.getElementById('counter').textContent = `Game #${settings.completed_count + 1} / ${settings.total_games}`;
  start = new Date(settings.challenge_start_date);
  updateTimer();
}

function updateTimer() {
  if (!start) return;
  const diff = Date.now() - start.getTime();
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  document.getElementById('timer').textContent = `${hours}h ${mins}m`;
}

updateOverlay();
setInterval(updateOverlay, 10000);
setInterval(updateTimer, 60000);
