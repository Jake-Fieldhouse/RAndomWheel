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
    let games = await loadGames();
    const settings = await loadSettings();
    const tbody = document.querySelector('#gamesTable tbody');
    const search = document.getElementById('search');
    const consoleFilter = document.getElementById('consoleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dialog = document.getElementById('editDialog');
    const editStatus = document.getElementById('editStatus');
    const editCompletion = document.getElementById('editCompletion');
    const editStart = document.getElementById('editStart');
    const editFinish = document.getElementById('editFinish');
    const editRating = document.getElementById('editRating');
    const editNotes = document.getElementById('editNotes');
    let editing = null;

    const consoles = [...new Set(games.map(g => g.console))];
    consoles.forEach(c => consoleFilter.innerHTML += `<option value="${c}">${c}</option>`);
    ['Not Started','In Progress','Completed'].forEach(s => statusFilter.innerHTML += `<option value="${s}">${s}</option>`);

    function render() {
      const term = search.value.toLowerCase();
      const consoleVal = consoleFilter.value;
      const statusVal = statusFilter.value;
      tbody.innerHTML = '';
      games.filter(g => g.title.toLowerCase().includes(term))
        .filter(g => !consoleVal || g.console === consoleVal)
        .filter(g => !statusVal || g.status === statusVal)
        .forEach(g => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${g.title}</td><td>${g.console}</td><td>${g.status}</td>` +
            `<td>${g.rating || ''}</td><td>${g.notes || ''}</td>` +
            `<td><button data-id="${g.id}" class="edit">Edit</button> ` +
            (g.status !== 'Completed' ? `<button data-id="${g.id}" class="complete">Mark Completed</button>` : '') + `</td>`;
          tbody.appendChild(tr);
        });
    }
    render();

    function updateCompletedCount() {
      settings.completed_count = games.filter(g => g.status === 'Completed').length;
      saveSettings(settings);
    }

    search.addEventListener('input', render);
    consoleFilter.addEventListener('change', render);
    statusFilter.addEventListener('change', render);

    tbody.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id, 10);
      const game = games.find(g => g.id === id);
      if (e.target.classList.contains('edit')) {
        editing = game;
        editStatus.value = game.status;
        editCompletion.value = game.completion_time;
        editStart.value = game.date_started;
        editFinish.value = game.date_finished;
        editRating.value = game.rating || '';
        editNotes.value = game.notes || '';
        dialog.showModal();
      } else if (e.target.classList.contains('complete')) {
        game.status = 'Completed';
        game.date_finished = new Date().toISOString().split('T')[0];
        saveGames(games);
        updateCompletedCount();
        render();
      }
    });

    document.getElementById('saveEdit').addEventListener('click', () => {
      if (!editing) return;
      editing.status = editStatus.value;
      editing.completion_time = editCompletion.value;
      editing.date_started = editStart.value;
      editing.date_finished = editFinish.value;
      editing.rating = parseInt(editRating.value, 10) || 0;
      editing.notes = editNotes.value;
      saveGames(games);
      updateCompletedCount();
      render();
    });
  })();
}
