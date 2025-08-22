# RetroAchievements Completion Tracker

A lightweight HTML/CSS/JS application for tracking RetroAchievements game completions and selecting the next game to play on stream.

## Features
- Tracks game status, rating and notes in local JSON storage
- Animated spinning wheel to choose a random unfinished game
- Management page with search, filtering and detailed editing
- OBS overlay displaying current game information, PSFest branding and challenge progress
- Configurable data source for RetroAchievements (API, mock data or local file) with persistent preferences

## Structure
```
index.html       - navigation
wheel.html       - random game wheel
games.html       - game management interface
obs.html         - streaming overlay
settings.html    - preferences for data source and credentials
js/retroAchievements.js - RetroAchievements API helper
js/preferences.js       - preferences store
js/gameManager.js       - load/save game data
js/wheelLogic.js        - wheel spinning logic
js/obs.js               - overlay updates
css/styles.css          - basic styling
data/games.json         - sample game database
data/settings.json      - challenge settings
data/mock_ra.json       - mock RetroAchievements response
```

Open `index.html` in a browser to get started.
