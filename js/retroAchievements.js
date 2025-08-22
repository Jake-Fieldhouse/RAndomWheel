// RetroAchievements API integration (minimal placeholder)
export async function fetchUserGames(username, apiKey) {
  const url = `https://retroachievements.org/API/API_GetUserCompletionProgress.php?u=${username}&p=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('RA API error');
  return await res.json();
}
