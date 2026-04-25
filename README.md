# Mythimon Legends 2D+

A browser-based monster-taming RPG inspired by classic creature battlers, now with a **2D+ style** (2D sprites over a pseudo-3D battle background).

## Included content

- **300 custom species sprites** generated with deterministic pixel-style rendering (**40 original + 260 new**).
- **4-star evolution system** for every species (★ to ★★★★).
- **10 legendary characters** with special rarity, glow styling, and low capture rate.
- **10 main world bosses** across unique regions.
- Capture, battle, team management, manual evolution, and legendary encounter mechanics.

## Run locally

Because this is plain HTML/CSS/JS, any static server works.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy on Vercel

This project is now configured for Vercel static hosting via `vercel.json` (SPA rewrite to `index.html` + cache headers for JS/CSS).

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Framework preset: **Other** (no build command needed).
4. Deploy.

Vercel will serve `index.html` for app routes and cache assets efficiently.

## Gameplay loop

1. Select a region on the world panel.
2. Fight wild monsters, bosses, or rare legendary encounters.
3. Capture creatures and build your team.
4. Spend XP to evolve your active creature through 4 evolution stars.
5. Defeat all 10 main bosses to complete the world arc.
