import { loadPreferences } from './preferences.js';

const CACHE_KEY = 'ra_user_games_cache';
const MOCK_URL = 'data/mock_ra.json';

export async function fetchUserGames() {
  const prefs = loadPreferences();
  const cacheKey = `${CACHE_KEY}_${prefs.raDataSource}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);
  try {
    let data;
    if (prefs.raDataSource === 'mock') {
      const res = await fetch(MOCK_URL);
      data = await res.json();
    } else if (prefs.raDataSource === 'local') {
      const res = await fetch(prefs.localDataPath);
      data = await res.json();
    } else {
      const url = `https://retroachievements.org/API/API_GetUserCompletionProgress.php?u=${prefs.username}&p=${prefs.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('RA API error');
      data = await res.json();
    }
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error('RetroAchievements fetch failed', e);
    return [];
  }
}

export function clearRaCache() {
  ['api', 'mock', 'local'].forEach(mode => localStorage.removeItem(`${CACHE_KEY}_${mode}`));
}
