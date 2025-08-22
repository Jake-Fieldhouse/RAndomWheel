// Handles loading and saving of game data
const GAMES_KEY = 'ra_games';
const SETTINGS_KEY = 'ra_settings';

export async function loadGames() {
  let games = JSON.parse(localStorage.getItem(GAMES_KEY) || 'null');
  if (!games) {
    const res = await fetch('data/games.json');
    games = await res.json();
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  }
  return games;
}

export async function saveGames(games) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export async function loadSettings() {
  let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
  if (!settings) {
    const res = await fetch('data/settings.json');
    settings = await res.json();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
  return settings;
}

export async function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Populate game table
if (document.getElementById('gamesTable')) {
  (async () => {
    const games = await loadGames();
    const tbody = document.querySelector('#gamesTable tbody');
    const search = document.getElementById('search');

    function render(filter='') {
      tbody.innerHTML = '';
      games.filter(g => g.title.toLowerCase().includes(filter.toLowerCase())).forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${g.title}</td><td>${g.console}</td><td>${g.status}</td>` +
          `<td><button data-id="${g.id}" class="mark">Toggle Status</button></td>`;
        tbody.appendChild(tr);
      });
    }
    render();

    search.addEventListener('input', e => render(e.target.value));
    tbody.addEventListener('click', async e => {
      if (e.target.matches('.mark')) {
        const id = parseInt(e.target.dataset.id, 10);
        const game = games.find(g => g.id === id);
        game.status = game.status === 'Completed' ? 'Not Started' : 'Completed';
        await saveGames(games);
        render(search.value);
      }
    });
  })();
}
