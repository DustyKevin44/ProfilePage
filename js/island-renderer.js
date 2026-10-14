/**
 * =====================================================================
 * ISLAND RENDERER (HTML5 Canvas Cartographic Engine)
 * =====================================================================
 * Renders the procedural archipelago, oceanic depth contours,
 * bathymetric elevation lines, nautical transit channels,
 * district landmarks, glowing beacons, and ambient marine particles.
 * =====================================================================
 */

// Polyfill for CanvasRenderingContext2D.roundRect for full backward compatibility
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    const r = typeof radii === "number" ? radii : (radii[0] || 0);
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}

class IslandRenderer {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.camera = camera;

    // Time tracking for continuous 60fps animations
    this.time = 0;
    this.hoveredZoneId = null;

    // Ambient floating ocean particles (bioluminescent marine drift)
    this.particles = [];
    this.initParticles(64);

    // Precomputed organic island geometries
    this.initGeometries();

    // Mouse tracking for hover detection
    this.mouseScreenX = -9999;
    this.mouseScreenY = -9999;
    this.initPointerInteractions();
  }

  /**
   * Initialize floating ambient particles
   */
  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 1800,
        radius: 1.0 + Math.random() * 2.2,
        alpha: 0.15 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.18,
        speedY: (Math.random() - 0.5) * 0.18,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.4 ? 195 : 160 // Cyan & emerald tints
      });
    }
  }

  /**
   * Precomputed polygon geometries for the 5 archipelago districts:
   * 1. The Academy District (-400, -220)
   * 2. The Workshop / Forge (0, 0)
   * 3. The Corporate Skyline (420, -220)
   * 4. The Studio (-360, 280)
   * 5. The Game Den (380, 280)
   */
  initGeometries() {
    const createOrganicPolygon = (cx, cy, baseRadius, varianceArray) => {
      const points = [];
      const count = varianceArray.length;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const r = baseRadius * varianceArray[i];
        points.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r
        });
      }
      return points;
    };

    this.islands = {
      // District 1: The Academy District (North-West)
      academy: {
        center: { x: -400, y: -220 },
        shelf: createOrganicPolygon(-400, -220, 160, [1.15, 1.25, 1.1, 1.18, 1.22, 1.08, 1.2, 1.14, 1.25, 1.1]),
        coast: createOrganicPolygon(-400, -220, 132, [1.08, 1.15, 1.02, 1.1, 1.14, 1.02, 1.12, 1.06, 1.18, 1.04]),
        contour1: createOrganicPolygon(-400, -220, 92, [1.05, 1.1, 1.0, 1.06, 1.08, 1.0, 1.06, 1.02, 1.1, 1.02]),
        contour2: createOrganicPolygon(-400, -220, 52, [1.02, 1.05, 0.98, 1.04, 1.05, 0.98, 1.04, 1.0, 1.05, 1.0])
      },

      // District 2: The Workshop / Forge (Center)
      workshop: {
        center: { x: 0, y: 0 },
        shelf: createOrganicPolygon(0, 0, 195, [1.1, 1.25, 1.05, 1.15, 1.3, 1.1, 1.2, 1.05, 1.25, 1.15, 1.1, 1.2]),
        coast: createOrganicPolygon(0, 0, 162, [1.05, 1.18, 0.98, 1.1, 1.22, 1.04, 1.12, 0.96, 1.18, 1.08, 1.02, 1.12]),
        contour1: createOrganicPolygon(0, 0, 115, [1.0, 1.1, 0.95, 1.05, 1.15, 1.0, 1.08, 0.95, 1.12, 1.02, 1.0, 1.05]),
        contour2: createOrganicPolygon(0, 0, 70, [1.0, 1.05, 0.98, 1.02, 1.1, 0.96, 1.04, 0.98, 1.06, 1.0, 0.98, 1.02])
      },

      // District 3: The Corporate Skyline (North-East)
      skyline: {
        center: { x: 420, y: -220 },
        shelf: createOrganicPolygon(420, -220, 160, [1.12, 1.2, 1.08, 1.28, 1.1, 1.22, 1.14, 1.05, 1.2, 1.15]),
        coast: createOrganicPolygon(420, -220, 132, [1.05, 1.12, 1.0, 1.18, 1.04, 1.15, 1.08, 0.98, 1.12, 1.06]),
        contour1: createOrganicPolygon(420, -220, 92, [1.02, 1.08, 0.98, 1.1, 1.02, 1.08, 1.04, 0.96, 1.05, 1.02]),
        contour2: createOrganicPolygon(420, -220, 52, [1.0, 1.04, 0.98, 1.05, 1.0, 1.04, 1.02, 0.98, 1.02, 1.0])
      },

      // District 4: The Studio (South-West)
      studio: {
        center: { x: -360, y: 280 },
        shelf: createOrganicPolygon(-360, 280, 155, [1.2, 1.1, 1.25, 1.12, 1.08, 1.22, 1.15, 1.28, 1.1, 1.18]),
        coast: createOrganicPolygon(-360, 280, 128, [1.12, 1.02, 1.18, 1.05, 1.02, 1.14, 1.08, 1.2, 1.04, 1.1]),
        contour1: createOrganicPolygon(-360, 280, 88, [1.08, 1.0, 1.1, 1.02, 1.0, 1.08, 1.04, 1.12, 1.02, 1.05]),
        contour2: createOrganicPolygon(-360, 280, 50, [1.04, 0.98, 1.05, 1.0, 0.98, 1.04, 1.02, 1.06, 1.0, 1.02])
      },

      // District 5: The Game Den (South-East)
      gameden: {
        center: { x: 380, y: 280 },
        shelf: createOrganicPolygon(380, 280, 160, [1.22, 1.12, 1.2, 1.1, 1.25, 1.14, 1.18, 1.1, 1.24, 1.15]),
        coast: createOrganicPolygon(380, 280, 134, [1.12, 1.05, 1.14, 1.02, 1.16, 1.08, 1.1, 1.04, 1.15, 1.06]),
        contour1: createOrganicPolygon(380, 280, 92, [1.06, 1.02, 1.08, 1.0, 1.1, 1.04, 1.06, 1.02, 1.08, 1.02]),
        contour2: createOrganicPolygon(380, 280, 54, [1.02, 1.0, 1.04, 0.98, 1.05, 1.0, 1.02, 1.0, 1.04, 1.0])
      }
    };
  }

  /**
   * Pointer interaction tracking for hover and waypoint clicks
   */
  initPointerInteractions() {
    this.canvas.addEventListener("pointermove", (e) => {
      this.mouseScreenX = e.clientX;
      this.mouseScreenY = e.clientY;
      this.checkZoneHover();
    });

    this.canvas.addEventListener("pointerleave", () => {
      this.mouseScreenX = -9999;
      this.mouseScreenY = -9999;
      this.hoveredZoneId = null;
      this.canvas.style.cursor = "default";
    });

    this.canvas.addEventListener("click", (e) => {
      if (this.camera.hasDragged) return;

      const world = this.camera.screenToWorld(e.clientX, e.clientY);
      const clickedZone = this.getZoneAtWorld(world.x, world.y);

      if (clickedZone) {
        this.camera.flyToZone(clickedZone, true);
      } else {
        if (window.UIController?.closeDrawer) {
          window.UIController.closeDrawer();
        }
      }
    });
  }

  /**
   * Check which zone waypoint the mouse is hovering over
   */
  checkZoneHover() {
    const world = this.camera.screenToWorld(this.mouseScreenX, this.mouseScreenY);
    const zone = this.getZoneAtWorld(world.x, world.y);

    if (zone) {
      if (this.hoveredZoneId !== zone.id) {
        this.hoveredZoneId = zone.id;
        this.canvas.style.cursor = "pointer";
      }
    } else {
      if (this.hoveredZoneId !== null) {
        this.hoveredZoneId = null;
        this.canvas.style.cursor = "default";
      }
    }
  }

  getZoneAtWorld(wx, wy) {
    const zones = window.PORTFOLIO_DATA?.zones || [];
    for (const zone of zones) {
      const dist = Math.hypot(wx - zone.coordinates.x, wy - zone.coordinates.y);
      const hitRadius = 88;
      if (dist <= hitRadius) {
        return zone;
      }
    }
    return null;
  }

  /**
   * Resize canvas buffer to match physical display pixels
   */
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    }
  }

  /**
   * Main Render Loop step
   */
  render(deltaTime = 16.67) {
    this.time += deltaTime * 0.001;

    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw Deep Oceanic Background
    this.drawOceanBackground(width, height);

    // 2. Setup Camera Transform Matrix for World Space
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 3. Draw World Grid & Nautical Coordinates
    this.drawCartographicGrid();

    // 4. Draw Ambient Bioluminescent Plankton
    this.drawOceanParticles(deltaTime);

    // 5. Draw Nautical Transit Channels connecting Center to Districts
    this.drawTransitChannels();

    // 6. Draw Island Landmasses & Bathymetric Contours
    this.drawIslands();

    // 7. Draw District Landmarks & Architectural Monoliths
    this.drawDistrictLandmarks();

    // 8. Draw District Beacons, Pins, and Floating Pill Labels
    this.drawDistrictWaypoints();

    ctx.restore(); // Restore World Space

    // 9. Draw Screen Atmosphere Vignette
    this.drawScreenAtmosphere(width, height);

    ctx.restore(); // Restore DPR scaling
  }

  /**
   * 1. Ocean Background Gradient
   */
  drawOceanBackground(w, h) {
    const ctx = this.ctx;
    const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h) * 0.8);
    grad.addColorStop(0, "#0b1120"); // Deep navy blue
    grad.addColorStop(0.5, "#070b14"); // Dark abyss
    grad.addColorStop(1, "#03060a"); // Void edge
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  /**
   * 3. Cartographic Grid with Crosshairs and Coordinates
   */
  drawCartographicGrid() {
    const ctx = this.ctx;
    const gridSize = 140;
    const startX = Math.floor((this.camera.x - 1200) / gridSize) * gridSize;
    const endX = Math.ceil((this.camera.x + 1200) / gridSize) * gridSize;
    const startY = Math.floor((this.camera.y - 1000) / gridSize) * gridSize;
    const endY = Math.ceil((this.camera.y + 1000) / gridSize) * gridSize;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
    ctx.fillStyle = "rgba(148, 163, 184, 0.22)";
    ctx.font = "9px 'JetBrains Mono', Consolas, monospace";

    for (let x = startX; x <= endX; x += gridSize) {
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.stroke();

        if (x % (gridSize * 3) === 0 && y % (gridSize * 3) === 0) {
          const coordText = `${x > 0 ? "+" : ""}${x},${y > 0 ? "+" : ""}${y}`;
          ctx.fillText(coordText, x + 8, y + 12);
        }
      }
    }

    // Outer boundary circle
    ctx.beginPath();
    ctx.arc(0, 0, 1100, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * 4. Ambient Floating Bioluminescent Plankton
   */
  drawOceanParticles(deltaTime) {
    const ctx = this.ctx;

    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x > 1100) p.x = -1100;
      if (p.x < -1100) p.x = 1100;
      if (p.y > 900) p.y = -900;
      if (p.y < -900) p.y = 900;

      const pulse = Math.sin(this.time * 2 + p.pulseOffset) * 0.3 + 0.7;
      const alpha = p.alpha * pulse;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
      ctx.fill();
    }
  }

  /**
   * 5. Connecting Transit Channels radiating from Center (The Workshop) to Districts
   */
  drawTransitChannels() {
    const ctx = this.ctx;
    const zones = window.PORTFOLIO_DATA?.zones || [];
    const centerZone = zones.find(z => z.id === "workshop") || { coordinates: { x: 0, y: 0 } };

    const dashOffset = -this.time * 25; // Animated pulsing flow

    for (const zone of zones) {
      if (zone.id === "workshop") continue;

      const isActive = this.camera.activeZoneId === zone.id;
      const isHovered = this.hoveredZoneId === zone.id;

      ctx.beginPath();
      ctx.moveTo(centerZone.coordinates.x, centerZone.coordinates.y);
      const midX = (centerZone.coordinates.x + zone.coordinates.x) * 0.5 + (zone.coordinates.y * 0.1);
      const midY = (centerZone.coordinates.y + zone.coordinates.y) * 0.5 - (zone.coordinates.x * 0.1);
      ctx.quadraticCurveTo(midX, midY, zone.coordinates.x, zone.coordinates.y);

      ctx.lineWidth = isActive || isHovered ? 2.5 : 1.5;
      ctx.strokeStyle = isActive || isHovered ? (zone.color || "#38bdf8") : "rgba(148, 163, 184, 0.16)";
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = dashOffset;
      ctx.stroke();

      if (isActive || isHovered) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = `${zone.color || "#38bdf8"}33`;
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }
  }

  /**
   * Helper to draw a smooth polygon
   */
  drawSmoothPolygon(points, fillStyle, strokeStyle, lineWidth = 1) {
    const ctx = this.ctx;
    if (!points || points.length < 3) return;

    ctx.beginPath();
    const len = points.length;

    const startX = (points[len - 1].x + points[0].x) / 2;
    const startY = (points[len - 1].y + points[0].y) / 2;
    ctx.moveTo(startX, startY);

    for (let i = 0; i < len; i++) {
      const next = points[(i + 1) % len];
      const midX = (points[i].x + next.x) / 2;
      const midY = (points[i].y + next.y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  }

  /**
   * 6. Draw Islands (Landmass, Reef Shelf & Elevation Rings)
   */
  drawIslands() {
    const ctx = this.ctx;
    const wavePulse = (Math.sin(this.time * 2.5) + 1) * 0.5;

    for (const [zoneId, geo] of Object.entries(this.islands)) {
      const zone = window.PORTFOLIO_DATA?.zones.find(z => z.id === zoneId);
      const accentColor = zone ? zone.color : "#38bdf8";
      const isActive = this.camera.activeZoneId === zoneId;
      const isHovered = this.hoveredZoneId === zoneId;

      // Layer 1: Shallow Water / Reef Shelf
      const shelfAlpha = isActive ? 0.12 : (isHovered ? 0.09 : 0.05);
      this.drawSmoothPolygon(
        geo.shelf,
        `${accentColor}${Math.floor(shelfAlpha * 255).toString(16).padStart(2, "0")}`,
        `${accentColor}25`,
        1.5
      );

      // Layer 1b: Pulsing shoreline foam wave
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < geo.coast.length; i++) {
        const pt = geo.coast[i];
        const angle = Math.atan2(pt.y - geo.center.y, pt.x - geo.center.x);
        const waveDist = 8 + wavePulse * 14;
        const wx = pt.x + Math.cos(angle) * waveDist;
        const wy = pt.y + Math.sin(angle) * waveDist;
        if (i === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.strokeStyle = `${accentColor}${Math.floor((1 - wavePulse) * 0.28 * 255).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Layer 2: Shoreline & Main Landmass Plate
      const landGrad = ctx.createRadialGradient(
        geo.center.x, geo.center.y, 10,
        geo.center.x, geo.center.y, 150
      );
      landGrad.addColorStop(0, "#162238");
      landGrad.addColorStop(0.7, "#0f172a");
      landGrad.addColorStop(1, "#09101d");

      this.drawSmoothPolygon(
        geo.coast,
        landGrad,
        isActive ? accentColor : (isHovered ? `${accentColor}bb` : "#1e293b"),
        isActive || isHovered ? 2.0 : 1.2
      );

      // Layer 3: Topographic Elevation Contours
      this.drawSmoothPolygon(
        geo.contour1,
        "rgba(30, 41, 59, 0.4)",
        "rgba(148, 163, 184, 0.12)",
        1
      );

      this.drawSmoothPolygon(
        geo.contour2,
        "rgba(51, 65, 85, 0.35)",
        isActive ? `${accentColor}44` : "rgba(148, 163, 184, 0.18)",
        1
      );
    }
  }

  /**
   * 7. District Landmarks (Thematic Cartographic Monuments)
   */
  drawDistrictLandmarks() {
    const ctx = this.ctx;

    // --- District 1: The Academy District (-400, -220) ---
    // Uppsala celestial observatory & academic spire
    ctx.save();
    ctx.translate(-400, -220);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#78350f";
    ctx.fill();
    ctx.stroke();

    // Central armillary cross
    ctx.beginPath();
    ctx.moveTo(-14, 0); ctx.lineTo(14, 0);
    ctx.moveTo(0, -14); ctx.lineTo(0, 14);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fef3c7";
    ctx.fill();
    ctx.restore();

    // --- District 2: The Workshop / Forge (0, 0) ---
    // Central hexagonal reactor & rotating orbital particles
    ctx.save();
    ctx.translate(0, 0);
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
    ctx.setLineDash([]);
    ctx.stroke();

    // Rotating anvil/diamond core
    const rot = this.time * 0.6;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + rot;
      const x = Math.cos(a) * 18;
      const y = Math.sin(a) * 18;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "#064e3b";
    ctx.fill();
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Orbital spark
    const orbX = Math.cos(-rot * 2) * 32;
    const orbY = Math.sin(-rot * 2) * 20;
    ctx.beginPath();
    ctx.arc(orbX, orbY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#a7f3d0";
    ctx.fill();
    ctx.restore();

    // --- District 3: The Corporate Skyline (420, -220) ---
    // Stepped modern skyscraper tower silhouettes
    ctx.save();
    ctx.translate(420, -220);
    ctx.fillStyle = "#312e81";
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.rect(-24, -24, 48, 48);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(-16, -16, 32, 32);
    ctx.fillStyle = "#4338ca";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(-8, -8, 16, 16);
    ctx.fillStyle = "#818cf8";
    ctx.fill();
    ctx.restore();

    // --- District 4: The Studio (-360, 280) ---
    // Acoustic sound waves & creative flow resonance
    ctx.save();
    ctx.translate(-360, 280);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fillStyle = "#0c4a6e";
    ctx.fill();
    ctx.stroke();

    // Harmonic waveform rings
    for (let i = 0; i < 3; i++) {
      const ringR = 10 + i * 5;
      const pulseA = Math.sin(this.time * 2 + i * 1.2) * 0.4 + 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(125, 211, 252, ${pulseA})`;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // --- District 5: The Game Den (380, 280) ---
    // Hexagonal tabletop strategy grid (Mage Knight & Dune: Imperium)
    ctx.save();
    ctx.translate(380, 280);
    ctx.strokeStyle = "#f43f5e";
    ctx.fillStyle = "#881337";
    ctx.lineWidth = 1.5;

    // Hexagonal tabletop strategy tile
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = Math.cos(a) * 24;
      const y = Math.sin(a) * 24;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Strategic card / board grid
    ctx.beginPath();
    ctx.rect(-9, -9, 18, 18);
    ctx.strokeStyle = "#fda4af";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }

  /**
   * 8. Waypoint Beacons & Floating Badges
   */
  drawDistrictWaypoints() {
    const ctx = this.ctx;
    const zones = window.PORTFOLIO_DATA?.zones || [];

    for (const zone of zones) {
      const { x, y } = zone.coordinates;
      const isActive = this.camera.activeZoneId === zone.id;
      const isHovered = this.hoveredZoneId === zone.id;
      const color = zone.color || "#38bdf8";

      ctx.save();
      ctx.translate(x, y);

      // Radar ping wave
      const pingProgress = (this.time * 0.75 + zone.number * 0.2) % 1.0;
      const pingRadius = 35 + pingProgress * 45;
      const pingAlpha = (1 - pingProgress) * (isActive ? 0.7 : 0.35);

      ctx.beginPath();
      ctx.arc(0, 0, pingRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${this.getHueFromHex(color)}, 90%, 65%, ${pingAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Waypoint Badge Center Pin
      const pinScale = isActive ? 1.22 : (isHovered ? 1.12 : 1.0);
      ctx.scale(pinScale, pinScale);

      const labelY = 48;
      const labelText = zone.name.toUpperCase();

      ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      const textWidth = ctx.measureText(labelText).width;
      const badgeWidth = textWidth + 46;
      const badgeHeight = 26;

      ctx.beginPath();
      ctx.roundRect(-badgeWidth / 2, labelY - badgeHeight / 2, badgeWidth, badgeHeight, 13);
      ctx.fillStyle = isActive ? "rgba(15, 23, 42, 0.95)" : "rgba(15, 23, 42, 0.85)";
      ctx.fill();
      ctx.strokeStyle = isActive ? color : (isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.15)");
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      // Number box inside badge
      ctx.beginPath();
      ctx.roundRect(-badgeWidth / 2 + 3, labelY - 9, 20, 18, 4);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = "#090d16";
      ctx.font = "bold 10px 'JetBrains Mono', Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(zone.number, -badgeWidth / 2 + 13, labelY);

      // District Name
      ctx.fillStyle = isActive ? "#ffffff" : (isHovered ? "#ffffff" : "#cbd5e1");
      ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(labelText, -badgeWidth / 2 + 28, labelY);

      // Category Subtitle
      ctx.font = "9px 'JetBrains Mono', Consolas, monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(zone.category.toUpperCase(), 0, labelY + 18);

      ctx.restore();
    }
  }

  /**
   * 9. Screen Atmosphere Vignette
   */
  drawScreenAtmosphere(w, h) {
    const ctx = this.ctx;
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.85);
    vigGrad.addColorStop(0, "transparent");
    vigGrad.addColorStop(1, "rgba(3, 7, 18, 0.55)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);
  }

  getHueFromHex(hex) {
    if (!hex) return 200;
    if (hex.includes("#38bdf8")) return 199; // Cyan
    if (hex.includes("#818cf8")) return 235; // Indigo
    if (hex.includes("#34d399")) return 158; // Emerald
    if (hex.includes("#fbbf24")) return 45;  // Amber
    if (hex.includes("#f43f5e")) return 348; // Rose
    return 200;
  }
}

if (typeof window !== "undefined") {
  window.IslandRenderer = IslandRenderer;
}
