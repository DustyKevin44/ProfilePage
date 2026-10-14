/**
 * =====================================================================
 * CAMERA ENGINE (Smooth Pan, Zoom & Lerp Navigation)
 * =====================================================================
 * High-performance 2D camera with sub-pixel interpolation (lerp),
 * inertial keyboard panning (WASD / Arrows), mouse drag, scroll zoom,
 * and targeted district flight paths.
 * =====================================================================
 */

class Camera {
  constructor(canvas) {
    this.canvas = canvas;

    // Current camera position and zoom (what is rendered)
    this.x = 0;
    this.y = 0;
    this.zoom = 1.0;

    // Target position and zoom (where the camera is heading)
    this.targetX = 0;
    this.targetY = 0;
    this.targetZoom = 1.0;

    // Pan inertia & velocity
    this.velocityX = 0;
    this.velocityY = 0;
    this.panSpeed = 16;
    this.friction = 0.88;

    // Limits
    this.minZoom = 0.55;
    this.maxZoom = 2.4;
    this.maxDistance = 1400; // Constrain camera so user doesn't drift away

    // Active zone state
    this.activeZoneId = null;
    this.isUserInteracting = false;

    // Drag tracking
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragOriginX = 0;
    this.dragOriginY = 0;

    // Keyboard state
    this.keysDown = new Set();

    // Callbacks
    this.onZoneChange = null;
    this.onCameraMove = null;

    this.initKeyboard();
    this.initMouseAndTouch();
  }

  /**
   * Screen coordinate to World coordinate conversion
   */
  screenToWorld(screenX, screenY) {
    const halfW = this.canvas.width / (2 * (window.devicePixelRatio || 1));
    const halfH = this.canvas.height / (2 * (window.devicePixelRatio || 1));
    return {
      x: (screenX - halfW) / this.zoom + this.x,
      y: (screenY - halfH) / this.zoom + this.y
    };
  }

  /**
   * World coordinate to Screen coordinate conversion
   */
  worldToScreen(worldX, worldY) {
    const halfW = this.canvas.width / (2 * (window.devicePixelRatio || 1));
    const halfH = this.canvas.height / (2 * (window.devicePixelRatio || 1));
    return {
      x: (worldX - this.x) * this.zoom + halfW,
      y: (worldY - this.y) * this.zoom + halfH
    };
  }

  /**
   * Fly smoothly to a specific district zone
   */
  flyToZone(zone, offsetForDrawer = true) {
    if (!zone) return;

    this.activeZoneId = zone.id;

    // When the detail drawer opens on the right side, offset camera target
    // slightly so the island landmark remains visually centered in the remaining viewport
    let offsetX = 0;
    let offsetY = 0;

    const isDesktop = window.innerWidth >= 1024;
    this.targetZoom = zone.coordinates.zoom || 1.25;

    if (offsetForDrawer && isDesktop && zone.id !== "overview") {
      offsetX = (zone.cameraOffset ? zone.cameraOffset.x : 200) / this.targetZoom;
      offsetY = (zone.cameraOffset ? zone.cameraOffset.y : 0) / this.targetZoom;
    }

    this.targetX = zone.coordinates.x + offsetX;
    this.targetY = zone.coordinates.y + offsetY;

    // Reset velocity
    this.velocityX = 0;
    this.velocityY = 0;

    if (this.onZoneChange) {
      this.onZoneChange(zone);
    }
  }

  /**
   * Reset camera to broad archipelago overview
   */
  resetToOverview() {
    this.activeZoneId = "overview";
    const overviewZone = window.PORTFOLIO_DATA?.zones.find(z => z.id === "overview");
    if (overviewZone) {
      this.flyToZone(overviewZone, false);
    } else {
      this.targetX = 0;
      this.targetY = 0;
      this.targetZoom = 0.95;
    }
  }

  /**
   * Adjust camera target by delta
   */
  panBy(dx, dy) {
    this.targetX += dx / this.zoom;
    this.targetY += dy / this.zoom;
    this.clampTargetPosition();
  }

  /**
   * Zoom by delta around a specific focal point
   */
  zoomBy(delta, focalScreenX, focalScreenY) {
    const dpr = window.devicePixelRatio || 1;
    const focusX = focalScreenX ?? (this.canvas.width / (2 * dpr));
    const focusY = focalScreenY ?? (this.canvas.height / (2 * dpr));

    const worldBefore = this.screenToWorld(focusX, focusY);
    const newTargetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.targetZoom * (1 + delta)));

    this.targetZoom = newTargetZoom;

    // Adjust targetX and targetY to zoom toward pointer
    const halfW = this.canvas.width / (2 * dpr);
    const halfH = this.canvas.height / (2 * dpr);

    this.targetX = worldBefore.x - (focusX - halfW) / newTargetZoom;
    this.targetY = worldBefore.y - (focusY - halfH) / newTargetZoom;

    this.clampTargetPosition();
  }

  clampTargetPosition() {
    const dist = Math.hypot(this.targetX, this.targetY);
    if (dist > this.maxDistance) {
      const angle = Math.atan2(this.targetY, this.targetX);
      this.targetX = Math.cos(angle) * this.maxDistance;
      this.targetY = Math.sin(angle) * this.maxDistance;
    }
  }

  /**
   * Initialize mouse and touch panning/zooming
   */
  initMouseAndTouch() {
    const canvas = this.canvas;

    canvas.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return; // Left click only
      this.isDragging = true;
      this.hasDragged = false;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dragOriginX = this.targetX;
      this.dragOriginY = this.targetY;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;
      if (Math.hypot(e.clientX - this.dragStartX, e.clientY - this.dragStartY) > 5) {
        this.hasDragged = true;
      }
      const dx = (e.clientX - this.dragStartX) / this.zoom;
      const dy = (e.clientY - this.dragStartY) / this.zoom;

      this.targetX = this.dragOriginX - dx;
      this.targetY = this.dragOriginY - dy;
      this.clampTargetPosition();
    });

    const endDrag = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    // Mouse wheel zoom
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = -e.deltaY * 0.0015;
      this.zoomBy(zoomFactor, e.clientX, e.clientY);
    }, { passive: false });

    // Touch pinch-to-zoom
    let initialPinchDist = null;
    let initialPinchZoom = 1;

    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchZoom = this.targetZoom;
      }
    }, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && initialPinchDist) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = currentDist / initialPinchDist;
        this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, initialPinchZoom * ratio));
      }
    }, { passive: true });

    canvas.addEventListener("touchend", () => {
      initialPinchDist = null;
    }, { passive: true });
  }

  /**
   * Keyboard listeners for continuous WASD / Arrow panning and direct navigation
   */
  initKeyboard() {
    window.addEventListener("keydown", (e) => {
      // Don't intercept if user is typing in an input or textarea
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      this.keysDown.add(key);

      // Flash visual key indicator in HUD
      if (window.UIController?.highlightKey) {
        window.UIController.highlightKey(e.key);
      }

      // Direct district jump keys (1 - 5)
      if (["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        const zone = window.PORTFOLIO_DATA?.zones.find(z => z.key === e.key);
        if (zone) {
          this.flyToZone(zone, true);
        }
        return;
      }

      // Reset view to overview on Space or '0' or 'r'
      if (e.key === " " || e.key === "0" || key === "r") {
        e.preventDefault();
        this.resetToOverview();
        return;
      }

      // Zoom keys: '+' / '=' / 'e' (zoom in) or '-' / '_' / 'q' (zoom out)
      if (e.key === "+" || e.key === "=" || key === "e") {
        e.preventDefault();
        this.zoomBy(0.2);
        return;
      }
      if (e.key === "-" || e.key === "_" || key === "q") {
        e.preventDefault();
        this.zoomBy(-0.2);
        return;
      }

      // Close drawer on Escape
      if (e.key === "Escape") {
        if (window.UIController?.closeDrawer) {
          window.UIController.closeDrawer();
        }
      }

      // Tab navigation between districts
      if (e.key === "Tab") {
        e.preventDefault();
        this.cycleDistrict(e.shiftKey ? -1 : 1);
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keysDown.delete(e.key.toLowerCase());
      if (window.UIController?.unhighlightKey) {
        window.UIController.unhighlightKey(e.key);
      }
    });
  }

  /**
   * Cycle to next / previous district
   */
  cycleDistrict(direction = 1) {
    const zones = window.PORTFOLIO_DATA?.zones || [];
    if (!zones.length) return;

    let currentIndex = zones.findIndex(z => z.id === this.activeZoneId);
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = (currentIndex + direction + zones.length) % zones.length;
    this.flyToZone(zones[nextIndex], true);
  }

  /**
   * Process active keys and accelerate velocity
   */
  processKeyboardInput(deltaTimeFactor = 1.0) {
    let inputX = 0;
    let inputY = 0;

    if (this.keysDown.has("a") || this.keysDown.has("arrowleft")) inputX -= 1;
    if (this.keysDown.has("d") || this.keysDown.has("arrowright")) inputX += 1;
    if (this.keysDown.has("w") || this.keysDown.has("arrowup")) inputY -= 1;
    if (this.keysDown.has("s") || this.keysDown.has("arrowdown")) inputY += 1;

    if (inputX !== 0 || inputY !== 0) {
      // Normalize diagonal speed
      const length = Math.hypot(inputX, inputY);
      const normX = inputX / length;
      const normY = inputY / length;

      // Apply acceleration to velocity
      const accel = (this.panSpeed / this.zoom) * deltaTimeFactor;
      this.velocityX += normX * accel;
      this.velocityY += normY * accel;

      // Any continuous manual pan disconnects strict lock on current zone
      this.activeZoneId = null;
    }
  }

  /**
   * Smooth physics update step (called on every requestAnimationFrame)
   */
  update(deltaTime = 16.67) {
    const dtFactor = Math.min(deltaTime / 16.67, 2.0); // Normalize around 60fps

    // Process continuous keyboard movement
    this.processKeyboardInput(dtFactor);

    // Apply pan velocity to target
    this.targetX += this.velocityX;
    this.targetY += this.velocityY;

    // Apply friction to velocity
    this.velocityX *= Math.pow(this.friction, dtFactor);
    this.velocityY *= Math.pow(this.friction, dtFactor);

    // Stop near-zero drift
    if (Math.abs(this.velocityX) < 0.005) this.velocityX = 0;
    if (Math.abs(this.velocityY) < 0.005) this.velocityY = 0;

    this.clampTargetPosition();

    // Smooth Lerp Camera to Target
    // Using exponential lerp for guaranteed frame-rate independent smoothness: lerpFactor = 1 - Math.exp(-lambda * dt)
    const lerpSpeed = 0.09 * dtFactor;
    const prevX = this.x;
    const prevY = this.y;
    const prevZoom = this.zoom;

    this.x += (this.targetX - this.x) * lerpSpeed;
    this.y += (this.targetY - this.y) * lerpSpeed;
    this.zoom += (this.targetZoom - this.zoom) * lerpSpeed;

    // Trigger camera move listener if moved
    if (this.onCameraMove && (Math.abs(prevX - this.x) > 0.05 || Math.abs(prevY - this.y) > 0.05 || Math.abs(prevZoom - this.zoom) > 0.001)) {
      this.onCameraMove(this.x, this.y, this.zoom);
    }
  }
}

if (typeof window !== "undefined") {
  window.Camera = Camera;
}
