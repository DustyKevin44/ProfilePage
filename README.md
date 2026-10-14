# 🏝️ Kevin Ferm // Interactive Archipelago Portfolio

An exploratory, high-performance developer portfolio website shaped like an interactive cartographic archipelago divided into 5 distinct zones:

1. **The Academy District** (Education // Uppsala University & Alströmergymnasiet)
2. **The Workshop / Forge** (Projects & Tech Stack // Nationsmaten.se & GenAI Prototypes)
3. **The Corporate Skyline** (Work Experience // Camp Entrepreneur & Max Burgers)
4. **The Studio** (Creative Hobbies & Lifestyle // Photography, Music, Reading & Interrail)
5. **The Game Den** (Tabletop & Board Games // Mage Knight, Dune: Imperium & D&D)

Built with **100% Vanilla JavaScript, HTML5 Canvas, and modern CSS3**. Zero external UI frameworks, guaranteeing 0-lag and fluid **60+ FPS** performance.

---

## ⚡ Key Highlights & Features

- **5 Thematic Districts**:
  - `[1]` **The Academy District**: Bachelor of Science in Information Systems (*Systemvetenskap*) at Uppsala University (2025–2028), plus Alströmergymnasiet (*Summa Cum Laude*, Nils Trolle-Lindgren Stipend, and Teknikcollege certified).
  - `[2]` **The Workshop / Forge**: Nationsmaten.se (Founder & Full-Stack Developer serving 500+ monthly users aggregating menus from all 13 Uppsala student nations), Esatto GenAI hackathon functional prototypes, and complete Core Technical Stack.
  - `[3]` **The Corporate Skyline**: Camp Entrepreneur (Summer Entrepreneur, business development and venture execution in Alingsås) and Max Burgers (high-pressure customer service, food safety, and workflow optimization).
  - `[4]` **The Studio**: High-detail DSLR photography using a Nikon D7100 with telephoto lenses, piano, guitar, literature, 50L–55L backpacking, European Interrail travel, and hosting events like a 3-course *cykelsittning*.
  - `[5]` **The Game Den**: Deep strategic tabletop gaming with custom 3D-printed component inserts via a Bambu Lab A1 Mini. Favorite games spotlight: **Mage Knight** and **Dune: Imperium**, plus active Dungeons & Dragons (D&D) campaigns.
- **Physical Camera with Lerp**:
  - Sub-pixel linear interpolation (`lerp`) and inertial dampening for buttery-smooth camera pans and zooms.
  - Automatic desktop viewport offsetting so detail cards never occlude island landmarks.
- **Full Keyboard Navigation & Visual HUD**:
  - `[1 - 5]`: Direct leap to specific districts.
  - `[W A S D]` or `[↑ ↓ ← →]`: Smooth camera panning with momentum.
  - `[+ / -]` or `[Q / E]` or Mouse Wheel: Smooth focal zoom.
  - `[Space]` or `[0]` or `[R]`: Reset camera to overview.
  - `[Tab]` / `[Shift + Tab]`: Cycle through districts sequentially.
  - `[Esc]`: Dismiss detail card and return to free exploration.
  - **Tactile Key Feedback**: Physical keypresses illuminate on-screen mechanical keycaps in real time.
- **Minimap Radar System**:
  - Real-time radar HUD displaying archipelago silhouettes, district dots, and live camera viewport frustum.
  - Click anywhere on the radar to fly directly to that location.
- **Clean Data-Driven Architecture**:
  - All content, titles, metrics, project links, credentials, and coordinates live in a single maintainable configuration file (`data.js`).

---

## 🚀 Quick Start (Zero Build Step)

No Node.js dependencies, npm installs, or bundling required!

### Option 1: Open Directly
Simply double-click [`index.html`](file:///c:/Users/Dusty/gitrepos/ProfilePage/index.html) or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run Local Dev Server
```powershell
# Using Python
python -m http.server 8000

# Or using Node.js (npx)
npx serve .
```
Then navigate to `http://localhost:8000`.

---

## 📁 Project Architecture

```
ProfilePage/
├── index.html            # Semantic HTML skeleton, HUD overlays, Radar & Drawer
├── styles.css            # Glassmorphism design system, keycaps, and responsive layout
├── data.js               # Central configuration file for all portfolio content
├── assets/
│   └── avatar.svg        # Vector profile avatar with KF monogram
├── js/
│   ├── camera.js         # Camera physics, lerp interpolation & keyboard navigation
│   ├── island-renderer.js# Canvas rendering: islands, bathymetry, beacons, paths
│   ├── ui.js             # UI Controller: drawer templates, radar, audio & HUD
│   └── app.js            # Engine loop orchestrator (requestAnimationFrame)
└── README.md             # Documentation & customization guide
```
