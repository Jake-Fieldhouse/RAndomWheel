# RetroAchievements Game Picker

A tiny, dependency-free HTML app that loads your RetroAchievements (RA) game history and spins a 🎡 wheel to pick what to play next. Designed to run locally or on GitHub Pages, and to be edited with Codex CLI.

## Features
- Pulls your **User Completion Progress** data from RA (username + Web API key)  
- **Filters**: unfinished only, hardcore-focused, exclude hacks/homebrew, exclude recently played (14d), console filter, free-text search  
- **Weighted spins**: uniform, favor older (not played recently), favor unfinished  
- **Nice UX**: game icons, quick RA links, copy link, confetti, shuffle  
- **Persistence**: settings and key saved to `localStorage` (optional)  
- **Offline testing**: built-in mock JSON and “paste JSON” mode

## Quick Start
1. Clone this repo.
2. Open `index.html` directly in a browser (no build step required).  
   - Or serve locally for nicer file URLs:
     ```bash
     npx http-server -p 8080
     # then open http://localhost:8080
     ```
3. In the app sidebar, choose a data source:
   - **Inline mock** – best for immediate testing
   - **Paste JSON** – drop a raw response from the RA API
   - **Live API** – enter your **RA username** and **Web API key** and click **Load**

> Tip: If browser CORS blocks the RA request, set a **CORS proxy** (see below).

## Live Data (RA API)
This app targets **User Completion Progress** to build your personal pool.

**Query shape** (paged):
