/**
 * =====================================================================
 * UI CONTROLLER (Detail Drawer, Minimap Radar, Keyboard HUD & State)
 * =====================================================================
 * Manages the slide-in zone detail card, data-driven template rendering,
 * minimap radar canvas, keyboard visualizer, and coordinate readouts.
 * =====================================================================
 */

class UIController {
  constructor(camera) {
    this.camera = camera;
    this.data = window.PORTFOLIO_DATA;

    // DOM Elements
    this.drawer = document.getElementById("zone-drawer");
    this.drawerContent = document.getElementById("drawer-content");
    this.drawerTitle = document.getElementById("drawer-title");
    this.drawerCategory = document.getElementById("drawer-category");
    this.drawerTagline = document.getElementById("drawer-tagline");
    this.drawerBadge = document.getElementById("drawer-badge");
    this.drawerCoords = document.getElementById("drawer-coords");
    this.drawerCloseBtn = document.getElementById("drawer-close-btn");

    this.prevDistrictBtn = document.getElementById("drawer-prev-btn");
    this.nextDistrictBtn = document.getElementById("drawer-next-btn");

    this.coordDisplay = document.getElementById("hud-coords");
    this.sectorDisplay = document.getElementById("hud-sector");
    this.quickPillsContainer = document.getElementById("quick-district-pills");

    this.minimapCanvas = document.getElementById("minimap-canvas");
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext("2d") : null;

    // Audio effects generator (Web Audio API synth for subtle mechanical clicks)
    this.soundEnabled = true;
    this.audioCtx = null;

    this.initEventListeners();
    this.initQuickPills();
    this.initMinimapInteractions();
  }

  /**
   * Play subtle minimalist synthesized UI click
   */
  playBloop(freq = 440, duration = 0.04) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (_) {}
  }

  initEventListeners() {
    // Close drawer button
    if (this.drawerCloseBtn) {
      this.drawerCloseBtn.addEventListener("click", () => {
        this.closeDrawer();
      });
    }

    // Previous / Next District buttons in drawer footer
    if (this.prevDistrictBtn) {
      this.prevDistrictBtn.addEventListener("click", () => {
        this.playBloop(380);
        this.camera.cycleDistrict(-1);
      });
    }

    if (this.nextDistrictBtn) {
      this.nextDistrictBtn.addEventListener("click", () => {
        this.playBloop(520);
        this.camera.cycleDistrict(1);
      });
    }

    // Sound toggle button in header
    const soundToggle = document.getElementById("sound-toggle-btn");
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        this.soundEnabled = !this.soundEnabled;
        soundToggle.classList.toggle("muted", !this.soundEnabled);
        soundToggle.title = this.soundEnabled ? "Mute audio cues" : "Unmute audio cues";
        if (this.soundEnabled) this.playBloop(600);
      });
    }

    // Reset camera button in header
    const resetBtn = document.getElementById("reset-cam-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.playBloop(400);
        this.camera.resetToOverview();
      });
    }

    // Click Brand or Profile button to view Profile Overview Card
    const brand = document.querySelector(".hud-brand");
    if (brand) {
      brand.style.cursor = "pointer";
      brand.addEventListener("click", () => {
        this.openProfileOverview();
      });
    }

    const profileToggleBtn = document.getElementById("profile-toggle-btn");
    if (profileToggleBtn) {
      profileToggleBtn.addEventListener("click", () => {
        this.openProfileOverview();
      });
    }
  }

  /**
   * Render Top Quick-Select District Pills
   */
  initQuickPills() {
    if (!this.quickPillsContainer) return;
    this.quickPillsContainer.innerHTML = "";

    const zones = this.data.zones || [];
    zones.forEach(zone => {
      const pill = document.createElement("button");
      pill.className = "district-quick-pill";
      pill.dataset.zoneId = zone.id;
      pill.innerHTML = `
        <span class="pill-key">${zone.number}</span>
        <span class="pill-label">${zone.category}</span>
      `;
      pill.addEventListener("click", () => {
        this.playBloop(480 + zone.number * 40);
        this.camera.flyToZone(zone, true);
      });
      this.quickPillsContainer.appendChild(pill);
    });
  }

  /**
   * Update top HUD coordinate & active sector readout
   */
  updateCoordinates(x, y, zoom) {
    if (this.coordDisplay) {
      const signX = x >= 0 ? "+" : "";
      const signY = y >= 0 ? "+" : "";
      this.coordDisplay.textContent = `[${signX}${Math.round(x)}, ${signY}${Math.round(y)}] ${(zoom * 100).toFixed(0)}%`;
    }

    if (this.quickPillsContainer) {
      const pills = this.quickPillsContainer.querySelectorAll(".district-quick-pill");
      pills.forEach(p => {
        p.classList.toggle("active", p.dataset.zoneId === this.camera.activeZoneId);
      });
    }
  }

  /**
   * Open and render the detail drawer for a selected district
   */
  openZoneDrawer(zone) {
    if (!this.drawer) return;

    this.playBloop(580);

    if (this.drawerBadge) {
      this.drawerBadge.textContent = `DISTRICT 0${zone.number}`;
      this.drawerBadge.style.backgroundColor = `${zone.color}20`;
      this.drawerBadge.style.color = zone.color;
      this.drawerBadge.style.borderColor = `${zone.color}60`;
    }

    if (this.drawerCategory) {
      this.drawerCategory.textContent = zone.category.toUpperCase();
      this.drawerCategory.style.color = zone.color;
    }

    if (this.drawerTitle) {
      this.drawerTitle.textContent = zone.name;
    }

    if (this.drawerTagline) {
      this.drawerTagline.textContent = zone.tagline || "";
    }

    if (this.drawerCoords) {
      this.drawerCoords.textContent = `LOC: [${zone.coordinates.x}, ${zone.coordinates.y}]`;
    }

    if (this.sectorDisplay) {
      this.sectorDisplay.textContent = `${zone.name.toUpperCase()} (${zone.category.toUpperCase()})`;
      this.sectorDisplay.style.color = zone.color;
    }

    this.renderDrawerBody(zone);

    this.drawer.classList.add("active");
    this.drawer.setAttribute("aria-hidden", "false");
  }

  /**
   * Open dedicated Profile Overview Drawer
   */
  openProfileOverview() {
    if (!this.drawer) return;
    this.playBloop(540);

    const p = this.data.profile;

    if (this.drawerBadge) {
      this.drawerBadge.textContent = "DEVELOPER PROFILE";
      this.drawerBadge.style.backgroundColor = "rgba(56, 189, 248, 0.2)";
      this.drawerBadge.style.color = "#38bdf8";
      this.drawerBadge.style.borderColor = "rgba(56, 189, 248, 0.6)";
    }

    if (this.drawerCategory) {
      this.drawerCategory.textContent = "OVERVIEW // ETHOS";
      this.drawerCategory.style.color = "#38bdf8";
    }

    if (this.drawerTitle) {
      this.drawerTitle.textContent = p.name;
    }

    if (this.drawerTagline) {
      this.drawerTagline.textContent = p.title;
    }

    if (this.drawerCoords) {
      this.drawerCoords.textContent = "LOC: ARCHIPELAGO ORIGIN";
    }

    let html = `
      <div class="drawer-section">
        <div class="profile-hero-card">
          <div class="avatar-container">
            ${p.avatar ? `
              <img src="${p.avatar}" alt="${p.name}" class="avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="avatar-fallback" style="display: none; background: linear-gradient(135deg, #38bdf8, #0284c7);">
                ${p.initials || "KF"}
              </div>
            ` : `
              <div class="avatar-fallback" style="background: linear-gradient(135deg, #38bdf8, #0284c7);">
                ${p.initials || "KF"}
              </div>
            `}
            <div class="status-indicator" title="Status: ${p.status}">
              <span class="status-dot"></span>
            </div>
          </div>
          <div class="profile-meta">
            <h3 class="profile-name">${p.name}</h3>
            <p class="profile-role">${p.title}</p>
            <p class="profile-location">📍 ${p.location}</p>
            <div class="profile-status-pill">${p.status}</div>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="section-heading">ETHOS & BACKGROUND</h4>
        <div class="bio-text">
          ${p.bio.map(b => `<p>${b}</p>`).join("")}
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="section-heading">SNAPSHOT METRICS</h4>
        <div class="stats-grid">
          ${p.stats.map(s => `
            <div class="stat-card">
              <span class="stat-value" style="color: #38bdf8">${s.value}</span>
              <span class="stat-label">${s.label}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="section-heading">EXPLORE ARCHIPELAGO DISTRICTS</h4>
        <div class="district-links-list">
          ${this.data.zones.map(z => `
            <button class="action-btn" style="width: 100%; justify-content: flex-start; margin-bottom: 6px;" onclick="window.CameraInstance.flyToZone(window.PORTFOLIO_DATA.zones.find(x => x.id === '${z.id}'), true)">
              <span style="font-family: var(--font-mono); color: ${z.color};">[${z.number}]</span>
              <strong style="margin: 0 6px;">${z.name}</strong>
              <span style="color: var(--text-dim); font-size: 10px;">— ${z.category}</span>
            </button>
          `).join("")}
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="section-heading">CONNECT & LINKS</h4>
        <div class="links-row">
          ${p.socials.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="action-btn primary" style="background: rgba(56, 189, 248, 0.2); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">
              <span>${s.name}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
            </a>
          `).join("")}
        </div>
      </div>
    `;

    this.drawerContent.innerHTML = html;
    this.drawerContent.scrollTop = 0;

    this.drawer.classList.add("active");
    this.drawer.setAttribute("aria-hidden", "false");
  }

  /**
   * Close the detail drawer
   */
  closeDrawer() {
    if (!this.drawer) return;
    this.playBloop(320);
    this.drawer.classList.remove("active");
    this.drawer.setAttribute("aria-hidden", "true");
    this.camera.activeZoneId = null;
    if (this.sectorDisplay) {
      this.sectorDisplay.textContent = "ARCHIPELAGO EXPLORER";
      this.sectorDisplay.style.color = "#94a3b8";
    }
  }

  /**
   * Render custom content template for each of the 5 user districts
   */
  renderDrawerBody(zone) {
    if (!this.drawerContent) return;

    let html = "";

    // =========================================================================
    // 1. District 1: The Academy District (Education)
    // =========================================================================
    if (zone.id === "academy") {
      html = `
        <div class="drawer-section intro-card" style="border-left-color: ${zone.color}">
          <p>${zone.summary}</p>
        </div>

        <div class="drawer-section">
          <div class="education-stack">
            ${zone.items.map(edu => `
              <div class="edu-card card-box">
                <div class="edu-header">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <h4 class="item-title">${edu.degree}</h4>
                    ${edu.status ? `<span class="project-badge" style="background: ${zone.color}22; color: ${zone.color}; border: 1px solid ${zone.color}44;">${edu.status}</span>` : ""}
                  </div>
                  <p class="item-company" style="color: ${zone.color}">${edu.institution} • <span class="edu-period">${edu.period}</span></p>
                  <p class="edu-period">📍 ${edu.location} ${edu.gpa ? `• <strong style="color: #fbbf24">${edu.gpa}</strong>` : ""}</p>
                </div>

                ${edu.highlights ? `
                  <ul class="achievements-list">
                    ${edu.highlights.map(h => `<li>${h}</li>`).join("")}
                  </ul>
                ` : ""}

                ${edu.coursework ? `
                  <div class="coursework-box">
                    <span class="sub-label">Focus Areas & Modules:</span>
                    <div class="tags-container">
                      ${edu.coursework.map(c => `<span class="tag-badge">${c}</span>`).join("")}
                    </div>
                  </div>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // 2. District 2: The Workshop / Forge (Projects & Tech Stack)
    // =========================================================================
    else if (zone.id === "workshop") {
      html = `
        <div class="drawer-section intro-card" style="border-left-color: ${zone.color}">
          <p>${zone.summary}</p>
        </div>

        <!-- Featured Projects -->
        <div class="drawer-section">
          <h4 class="section-heading">FEATURED PROJECTS & PROTOTYPES</h4>
          <div class="projects-grid">
            ${zone.items.map(proj => `
              <div class="project-card card-box">
                <div class="project-header">
                  <div>
                    <span class="project-category" style="color: ${zone.color}">${proj.category}</span>
                    <h4 class="project-title">${proj.title}</h4>
                    ${proj.role ? `<p style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); margin-top: 2px;">${proj.role} • ${proj.period}</p>` : ""}
                  </div>
                  ${proj.badge ? `<span class="project-badge" style="background: ${zone.color}22; color: ${zone.color}; border: 1px solid ${zone.color}44;">${proj.badge}</span>` : ""}
                </div>
                <p class="item-desc">${proj.description}</p>
                ${proj.metrics ? `<div class="project-metrics" style="color: ${zone.color}">⚡ ${proj.metrics}</div>` : ""}
                <div class="tags-container">
                  ${proj.tags.map(t => `<span class="tag-badge">${t}</span>`).join("")}
                </div>
                <div class="project-actions">
                  ${proj.demoUrl ? `
                    <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="action-btn primary" style="background: ${zone.color}; color: #080d16;">
                      Visit Platform
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
                    </a>
                  ` : ""}
                  ${proj.githubUrl ? `
                    <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="action-btn">
                      GitHub
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </a>
                  ` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Core Technical Stack -->
        <div class="drawer-section">
          <h4 class="section-heading">CORE TECHNICAL STACK</h4>
          <div class="skills-cluster">
            <div class="skill-group card-box">
              <h5 class="skill-group-title" style="color: ${zone.color}">Languages & Frameworks</h5>
              <div class="tags-container">
                ${zone.techStack.languages.map(l => `<span class="tag-badge" style="border-color: rgba(52, 211, 153, 0.25);">${l}</span>`).join("")}
              </div>
            </div>
            <div class="skill-group card-box">
              <h5 class="skill-group-title" style="color: ${zone.color}">Tools, Platforms & 3D Workflows</h5>
              <div class="tags-container">
                ${zone.techStack.tools.map(t => `<span class="tag-badge" style="border-color: rgba(52, 211, 153, 0.25);">${t}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // 3. District 3: The Corporate Skyline (Work Experience)
    // =========================================================================
    else if (zone.id === "skyline") {
      html = `
        <div class="drawer-section intro-card" style="border-left-color: ${zone.color}">
          <p>${zone.summary}</p>
        </div>

        <div class="drawer-section">
          <div class="timeline">
            ${zone.items.map(item => `
              <div class="timeline-item">
                <div class="timeline-marker" style="border-color: ${zone.color}"></div>
                <div class="timeline-content card-box">
                  <div class="timeline-header">
                    <div>
                      <h4 class="item-title">${item.role}</h4>
                      <p class="item-company" style="color: ${zone.color}">${item.company} • <span class="item-period">${item.period}</span></p>
                      <p class="item-period" style="margin-top: 2px;">📍 ${item.location}</p>
                    </div>
                  </div>
                  <p class="item-desc">${item.description}</p>
                  <ul class="achievements-list">
                    ${item.achievements.map(a => `<li>${a}</li>`).join("")}
                  </ul>
                  <div class="tags-container">
                    ${item.technologies.map(t => `<span class="tag-badge">${t}</span>`).join("")}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // 4. District 4: The Studio (Creative Hobbies & Lifestyle)
    // =========================================================================
    else if (zone.id === "studio") {
      html = `
        <div class="drawer-section intro-card" style="border-left-color: ${zone.color}">
          <p>${zone.summary}</p>
        </div>

        <div class="drawer-section">
          <div class="hobbies-grid">
            ${zone.items.map(hobby => `
              <div class="hobby-card card-box">
                <div class="hobby-title-row" style="justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="hobby-dot" style="background: ${zone.color}"></span>
                    <h4 class="item-title">${hobby.title}</h4>
                  </div>
                  ${hobby.badge ? `<span class="project-badge" style="background: ${zone.color}22; color: ${zone.color}; border: 1px solid ${zone.color}44;">${hobby.badge}</span>` : ""}
                </div>
                <p class="item-desc" style="margin-top: 8px;">${hobby.description}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // 5. District 5: The Game Den (Tabletop & Board Games)
    // =========================================================================
    else if (zone.id === "gameden") {
      html = `
        <div class="drawer-section intro-card" style="border-left-color: ${zone.color}">
          <p>${zone.summary}</p>
        </div>

        <div class="drawer-section">
          <div class="hobbies-grid">
            ${zone.items.map(item => `
              <div class="hobby-card card-box">
                <div class="hobby-title-row" style="justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="hobby-dot" style="background: ${zone.color}"></span>
                    <h4 class="item-title">${item.title}</h4>
                  </div>
                  ${item.badge ? `<span class="project-badge" style="background: ${zone.color}22; color: ${zone.color}; border: 1px solid ${zone.color}44;">${item.badge}</span>` : ""}
                </div>
                
                <p class="item-desc" style="margin-top: 8px;">${item.description}</p>

                ${item.favoriteGames ? `
                  <div style="margin-top: 14px; padding: 12px; background: rgba(244, 63, 94, 0.08); border-radius: 8px; border: 1px solid rgba(244, 63, 94, 0.25);">
                    <span class="sub-label" style="color: ${zone.color}; font-weight: 700;">★ FAVORITE BOARD GAMES:</span>
                    <div style="display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap;">
                      ${item.favoriteGames.map(g => `
                        <div style="display: flex; align-items: center; gap: 6px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.45); color: #fff; padding: 5px 12px; border-radius: 6px; font-weight: 600; font-size: 12px;">
                          <span>🎲</span>
                          <span>${g}</span>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                ` : ""}

                ${item.customWork ? `
                  <div style="margin-top: 10px; font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">
                    🛠️ ${item.customWork}
                  </div>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    this.drawerContent.innerHTML = html;
    this.drawerContent.scrollTop = 0;
  }

  /**
   * Keyboard HUD Glow Effect
   */
  highlightKey(keyName) {
    let selectorKey = keyName.toLowerCase();
    if (selectorKey === "=") selectorKey = "+";
    if (selectorKey === "_") selectorKey = "-";
    const keycaps = document.querySelectorAll(`[data-key="${selectorKey}"]`);
    keycaps.forEach(k => k.classList.add("pressed"));
  }

  unhighlightKey(keyName) {
    let selectorKey = keyName.toLowerCase();
    if (selectorKey === "=") selectorKey = "+";
    if (selectorKey === "_") selectorKey = "-";
    const keycaps = document.querySelectorAll(`[data-key="${selectorKey}"]`);
    keycaps.forEach(k => k.classList.remove("pressed"));
  }

  /**
   * Minimap Radar Interactions & Dynamic Viewport Frustum Rendering
   */
  initMinimapInteractions() {
    if (!this.minimapCanvas) return;

    this.minimapCanvas.addEventListener("click", (e) => {
      const rect = this.minimapCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const minimapW = rect.width;
      const minimapH = rect.height;
      const worldScale = 1400 / (minimapW / 2);

      const targetWorldX = (clickX - minimapW / 2) * worldScale;
      const targetWorldY = (clickY - minimapH / 2) * worldScale;

      const zones = this.data.zones || [];
      let closestZone = null;
      let minDistance = 240;

      for (const zone of zones) {
        const d = Math.hypot(zone.coordinates.x - targetWorldX, zone.coordinates.y - targetWorldY);
        if (d < minDistance) {
          minDistance = d;
          closestZone = zone;
        }
      }

      if (closestZone) {
        this.camera.flyToZone(closestZone, true);
      } else {
        this.camera.targetX = targetWorldX;
        this.camera.targetY = targetWorldY;
      }
    });
  }

  /**
   * Render Minimap Radar (called every frame)
   */
  renderMinimap() {
    if (!this.minimapCtx || !this.minimapCanvas) return;

    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = (w * 0.45) / 750;

    // 1. Radar background grid & sweep
    ctx.fillStyle = "rgba(7, 11, 20, 0.9)";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 4); ctx.lineTo(cx, h - 4);
    ctx.moveTo(4, cy); ctx.lineTo(w - 4, cy);
    ctx.stroke();

    // 2. Draw District dots
    const zones = this.data.zones || [];
    for (const zone of zones) {
      const mx = cx + zone.coordinates.x * scale;
      const my = cy + zone.coordinates.y * scale;
      const isActive = this.camera.activeZoneId === zone.id;

      ctx.beginPath();
      ctx.arc(mx, my, isActive ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = zone.color || "#38bdf8";
      ctx.fill();

      if (isActive) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // 3. Draw Camera Viewport Frustum Rectangle
    const viewW = (window.innerWidth / this.camera.zoom) * scale;
    const viewH = (window.innerHeight / this.camera.zoom) * scale;
    const camMx = cx + this.camera.x * scale;
    const camMy = cy + this.camera.y * scale;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(camMx - viewW / 2, camMy - viewH / 2, viewW, viewH);
  }
}

if (typeof window !== "undefined") {
  window.UIController = UIController;
}
