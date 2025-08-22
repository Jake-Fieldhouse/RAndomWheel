import { loadGames, loadSettings } from './gameManager.js';

(async () => {
  const [games, settings] = await Promise.all([loadGames(), loadSettings()]);
  const current = games.find(g => g.id === settings.current_game_id);
  if (!current) return;
  document.getElementById('boxart').src = current.image_url;
  document.getElementById('gameTitle').textContent = current.title;
  document.getElementById('gameConsole').textContent = current.console;
  document.getElementById('goal').textContent = settings.goal || '';
  document.getElementById('counter').textContent = `Game #${settings.completed_count} / ${settings.total_games}`;
  const start = new Date(settings.challenge_start_date);
  function updateTimer() {
    const diff = Date.now() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    document.getElementById('timer').textContent = `${hours}h ${mins}m`;
  }
  updateTimer();
  setInterval(updateTimer, 60000);
})();
