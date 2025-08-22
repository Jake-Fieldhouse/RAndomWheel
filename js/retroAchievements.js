// RetroAchievements API integration with basic caching and error handling
const CACHE_KEY = 'ra_user_games_cache';

export async function fetchUserGames(username, apiKey) {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return JSON.parse(cached);
  try {
    const url = `https://retroachievements.org/API/API_GetUserCompletionProgress.php?u=${username}&p=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('RA API error');
    const data = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error('RetroAchievements API failed', e);
    return [];
  }
}
