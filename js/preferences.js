const PREF_KEY = 'app_preferences';

const defaults = {
  raDataSource: 'mock', // 'api', 'mock', 'local'
  localDataPath: 'data/mock_ra.json',
  username: '',
  apiKey: ''
};

export function loadPreferences() {
  try {
    const stored = JSON.parse(localStorage.getItem(PREF_KEY));
    return stored ? { ...defaults, ...stored } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

export function savePreferences(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}
