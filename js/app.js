/**
 * =====================================================================
 * APPLICATION BOOTSTRAPPER & ENGINE LOOP
 * =====================================================================
 * Initializes the camera, renderer, UI manager, binds event streams,
 * and maintains the 60+ FPS requestAnimationFrame game loop.
 * =====================================================================
 */

(function () {
  let canvas, camera, renderer, ui;
  let lastTime = performance.now();

  function init() {
    canvas = document.getElementById("island-canvas");
    if (!canvas) {
      console.error("Island canvas not found");
      return;
    }

    // 1. Initialize Camera
    camera = new Camera(canvas);

    // 2. Initialize Island Renderer
    renderer = new IslandRenderer(canvas, camera);
    renderer.resize();

    // 3. Initialize UI Controller
    ui = new UIController(camera);
    window.UIController = ui;

    // 4. Connect Camera Callbacks
    camera.onZoneChange = (zone) => {
      ui.openZoneDrawer(zone);
    };

    camera.onCameraMove = (x, y, zoom) => {
      ui.updateCoordinates(x, y, zoom);
    };

    // 5. Handle Window Resize with DPR
    window.addEventListener("resize", () => {
      renderer.resize();
    });

    window.CameraInstance = camera;

    // 6. Initial Camera View
    // Start slightly zoomed out, then fly smoothly to District 1 (The Academy District)
    camera.x = 0;
    camera.y = 80;
    camera.zoom = 0.7;
    camera.targetX = 0;
    camera.targetY = 0;
    camera.targetZoom = 0.95;

    setTimeout(() => {
      const initialZone = window.PORTFOLIO_DATA?.zones[0];
      if (initialZone) {
        camera.flyToZone(initialZone, true);
      }
    }, 400);

    // 7. Start High-Performance RAF Loop
    requestAnimationFrame(renderLoop);
  }

  function renderLoop(currentTime) {
    // Delta time calculation in milliseconds (capped to 50ms to prevent jumps on tab focus change)
    const deltaTime = Math.min(currentTime - lastTime, 50);
    lastTime = currentTime;

    // Update camera physics & lerp
    camera.update(deltaTime);

    // Render Island Scene to Canvas
    renderer.render(deltaTime);

    // Render Minimap Radar HUD
    ui.renderMinimap();

    // Loop continuously at screen refresh rate (60Hz / 120Hz / 144Hz)
    requestAnimationFrame(renderLoop);
  }

  // Boot when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
