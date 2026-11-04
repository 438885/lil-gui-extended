import GUI, { Controller } from 'lil-gui';

// ============================================================================
// 0. SSR-SAFE LAZY STYLE INJECTION
// ============================================================================
let stylesInjected = false;

function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'lil-gui-extended-styles';
  style.innerHTML = `
    /* Screen Positioning / Left & Corner Menus */
    .lil-gui.autoPlace.lil-pos-left {
      right: auto;
      left: var(--gui-offset-x, 15px);
      top: var(--gui-offset-y, 0px);
      bottom: auto;
    }
    .lil-gui.autoPlace.lil-pos-right {
      left: auto;
      right: var(--gui-offset-x, 15px);
      top: var(--gui-offset-y, 0px);
      bottom: auto;
    }
    .lil-gui.autoPlace.lil-pos-bottom-left {
      right: auto;
      top: auto;
      left: var(--gui-offset-x, 15px);
      bottom: var(--gui-offset-y, 0px);
    }
    .lil-gui.autoPlace.lil-pos-bottom-right {
      left: auto;
      top: auto;
      right: var(--gui-offset-x, 15px);
      bottom: var(--gui-offset-y, 0px);
    }

    /* Search Filter Hidden State (4.1A) - Preserves .showIf() state */
    .lil-gui .lil-search-hidden {
      display: none !important;
    }

    /* Draggable & Resizable Root GUI (4.5A) */
    .lil-gui.lil-draggable > .title {
      cursor: grab;
      user-select: none;
    }
    .lil-gui.lil-draggable.lil-dragging > .title {
      cursor: grabbing;
    }
    .lil-gui .lil-resize-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: ew-resize;
      z-index: 10;
    }
    .lil-gui .lil-resize-handle.left { left: -3px; }
    .lil-gui .lil-resize-handle.right { right: -3px; }
    .lil-gui .lil-resize-handle:hover {
      background: var(--focus-color);
      opacity: 0.4;
    }

    /* Top Toolbar: Search, Presets & History (4.1, 4.2, 4.3) */
    .lil-gui .lil-toolbar {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px var(--padding);
      background: var(--title-background-color);
      border-bottom: 1px solid var(--folder-indent-color, #333);
    }
    .lil-gui .lil-toolbar-row {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
    }
    .lil-gui .lil-search-input,
    .lil-gui .lil-preset-input {
      flex: 1;
      height: var(--widget-height);
      background: var(--widget-color);
      color: var(--text-color);
      border: 1px solid transparent;
      border-radius: var(--widget-border-radius);
      padding: 0 6px;
      font-family: var(--font-family);
      font-size: var(--input-font-size, 11px);
      outline: none;
      min-width: 0;
    }
    .lil-gui .lil-search-input:focus,
    .lil-gui .lil-preset-input:focus {
      border-color: var(--focus-color);
    }
    .lil-gui .lil-preset-select {
      flex: 1;
      height: var(--widget-height);
      background: var(--widget-color);
      color: var(--text-color);
      border: none;
      border-radius: var(--widget-border-radius);
      padding: 0 4px;
      font-family: var(--font-family);
      font-size: var(--font-size);
      min-width: 0;
      cursor: pointer;
    }
    .lil-gui .lil-icon-btn {
      height: var(--widget-height);
      min-width: var(--widget-height);
      padding: 0 5px;
      background: var(--widget-color);
      color: var(--text-color);
      border: none;
      border-radius: var(--widget-border-radius);
      cursor: pointer;
      font-size: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    .lil-gui .lil-icon-btn:hover:not(:disabled) {
      background: var(--hover-widget-color);
    }
    .lil-gui .lil-icon-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    /* Modal Search Spotlight (4.1B) */
    .lil-gui .lil-search-modal {
      position: sticky;
      top: 0;
      z-index: 20;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    }

    /* Separator (7) */
    .lil-gui .controller.lil-separator-ctrl {
      height: auto;
      min-height: 0;
      padding: 2px 0;
    }
    .lil-gui .lil-separator {
      border: none;
      border-top: 1px solid var(--folder-indent-color, #333);
      margin: 2px 0;
      width: 100%;
    }

    /* Note / Info Block (8) */
    .lil-gui .controller.lil-note {
      height: auto;
      min-height: var(--row-height);
      padding: 6px var(--padding);
      color: var(--text-color);
      opacity: 0.8;
      font-size: 11px;
      line-height: 1.4;
      border-left: 2px solid var(--focus-color);
      background: rgba(255, 255, 255, 0.03);
      margin: 2px 0;
      display: block;
    }

    /* Inline Button Row & Segmented & MultiSelect (9, 2.3A, 2.3B) */
    .lil-gui .controller.lil-button-row .widget,
    .lil-gui .controller.lil-segmented .widget,
    .lil-gui .controller.lil-multiselect .widget {
      display: flex;
      gap: 3px;
      width: 100%;
      flex-wrap: wrap;
    }
    .lil-gui .controller.lil-button-row button,
    .lil-gui .controller.lil-segmented button,
    .lil-gui .controller.lil-multiselect button {
      flex: 1;
      min-width: 28px;
      height: var(--widget-height);
      background: var(--widget-color);
      color: var(--text-color);
      border: 1px solid transparent;
      border-radius: var(--widget-border-radius);
      font-family: var(--font-family);
      font-size: var(--font-size);
      cursor: pointer;
      padding: 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 0.1s, color 0.1s, border-color 0.1s;
    }
    .lil-gui .controller.lil-button-row button:hover,
    .lil-gui .controller.lil-segmented button:hover,
    .lil-gui .controller.lil-multiselect button:hover {
      background: var(--hover-widget-color);
    }
    .lil-gui .controller.lil-segmented button.active,
    .lil-gui .controller.lil-multiselect button.active {
      background: var(--number-color);
      color: var(--background-color);
      font-weight: 600;
    }

    /* Name Badges & Action Icons (1, 2, 6, 3.5) */
    .lil-gui .controller .name {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .lil-gui .lil-badge {
      font-size: 9px;
      padding: 1px 3px;
      border-radius: 2px;
      background: var(--widget-color);
      color: var(--text-color);
      opacity: 0.75;
      font-family: var(--font-family-mono, monospace);
      margin-left: auto;
      line-height: 1.1;
    }
    .lil-gui .lil-reset-btn,
    .lil-gui .lil-sync-btn,
    .lil-gui .lil-lock-btn {
      cursor: pointer;
      opacity: 0.35;
      font-size: 11px;
      user-select: none;
      transition: opacity 0.15s;
    }
    .lil-gui .lil-reset-btn:hover,
    .lil-gui .lil-sync-btn:hover,
    .lil-gui .lil-lock-btn:hover,
    .lil-gui .lil-sync-btn.locked,
    .lil-gui .lil-lock-btn.locked {
      opacity: 1;
      color: var(--number-color);
    }
    .lil-gui .controller.lil-hotkey-active {
      outline: 1px dashed var(--number-color);
      outline-offset: -1px;
    }

    /* Unit Suffix (3) */
    .lil-gui .lil-unit-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
    }
    .lil-gui .lil-unit-label {
      position: absolute;
      right: 4px;
      font-size: 10px;
      color: var(--text-color);
      opacity: 0.5;
      pointer-events: none;
      font-family: var(--font-family);
    }

    /* Upgraded Min/Max Range Slider (10, 1.2A, 1.2C) */
    .lil-gui .controller.lil-range .widget {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .lil-gui .lil-range-track {
      position: relative;
      flex: 1;
      height: var(--widget-height);
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
      cursor: ew-resize;
      overflow: hidden;
      user-select: none;
    }
    .lil-gui .lil-range-fill {
      position: absolute;
      top: 0;
      bottom: 0;
      background: var(--number-color);
      opacity: 0.85;
      cursor: grab;
    }
    .lil-gui .lil-range-fill:active {
      cursor: grabbing;
    }
    .lil-gui .lil-range-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: ew-resize;
      background: rgba(255, 255, 255, 0.35);
      opacity: 0;
      transition: opacity 0.12s;
    }
    .lil-gui .lil-range-track:hover .lil-range-handle,
    .lil-gui .lil-range-handle.active {
      opacity: 1;
    }
    .lil-gui .lil-range-handle.min { left: 0; }
    .lil-gui .lil-range-handle.max { right: 0; }
    .lil-gui .lil-range-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-family-mono, monospace);
      font-size: var(--input-font-size, 11px);
      color: var(--text-color);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
      pointer-events: none;
    }
    .lil-gui .lil-range-edit {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: var(--widget-color);
      color: var(--number-color);
      border: 1px solid var(--focus-color);
      text-align: center;
      font-family: var(--font-family-mono, monospace);
      font-size: var(--input-font-size, 11px);
      outline: none;
      z-index: 2;
    }

    /* Vector / Multi-Component Scrubbers (2.1A) */
    .lil-gui .controller.lil-vector .widget {
      display: flex;
      gap: 3px;
      width: 100%;
    }
    .lil-gui .lil-vec-cell {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
      height: var(--widget-height);
      overflow: hidden;
      border: 1px solid transparent;
    }
    .lil-gui .lil-vec-cell:focus-within {
      border-color: var(--focus-color);
    }
    .lil-gui .lil-vec-axis {
      font-size: 9px;
      font-weight: 700;
      padding: 0 4px;
      cursor: ew-resize;
      user-select: none;
      opacity: 0.75;
      height: 100%;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.15);
    }
    .lil-gui .lil-vec-axis.axis-0 { color: #ff6b6b; }
    .lil-gui .lil-vec-axis.axis-1 { color: #51cf66; }
    .lil-gui .lil-vec-axis.axis-2 { color: #339af0; }
    .lil-gui .lil-vec-axis.axis-3 { color: #fcc419; }
    .lil-gui .lil-vec-input {
      flex: 1;
      min-width: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      color: var(--number-color);
      font-family: var(--font-family-mono, monospace);
      font-size: var(--input-font-size, 11px);
      padding: 0 3px;
      text-align: right;
      outline: none;
    }

    /* Sparkline Monitor & FPS (2.2A) */
    .lil-gui .controller.lil-monitor .widget {
      position: relative;
      height: calc(var(--widget-height) * 1.4);
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
      overflow: hidden;
    }
    .lil-gui .lil-monitor-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    .lil-gui .lil-monitor-overlay {
      position: absolute;
      inset: 2px 4px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-family: var(--font-family-mono, monospace);
      font-size: 10px;
      color: var(--text-color);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
      pointer-events: none;
    }

    /* File / Image Loader (2.5B) */
    .lil-gui .controller.lil-file .widget {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .lil-gui .lil-file-drop {
      flex: 1;
      height: var(--widget-height);
      background: var(--widget-color);
      border: 1px dashed var(--folder-indent-color, #555);
      border-radius: var(--widget-border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      cursor: pointer;
      font-size: 10px;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      user-select: none;
    }
    .lil-gui .lil-file-drop.dragover,
    .lil-gui .lil-file-drop:hover {
      border-color: var(--focus-color);
      background: var(--hover-widget-color);
    }
    .lil-gui .lil-file-thumb {
      width: var(--widget-height);
      height: var(--widget-height);
      border-radius: var(--widget-border-radius);
      object-fit: cover;
      display: none;
      flex-shrink: 0;
      border: 1px solid var(--folder-indent-color, #444);
    }

    /* Color Gradient Picker (2.6A, 2.6B) */
    .lil-gui .controller.lil-gradient .widget {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }
    .lil-gui .lil-gradient-track {
      position: relative;
      flex: 1;
      height: var(--widget-height);
      border-radius: var(--widget-border-radius);
      cursor: crosshair;
      border: 1px solid rgba(255, 255, 255, 0.15);
      user-select: none;
    }
    .lil-gui .lil-gradient-stop {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 8px;
      transform: translateX(-50%);
      border: 2px solid #fff;
      border-radius: 3px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
      cursor: ew-resize;
      z-index: 2;
    }
    .lil-gui .lil-gradient-stop.active {
      border-color: var(--number-color);
      transform: translateX(-50%) scale(1.15);
    }
    .lil-gui .lil-gradient-preset {
      width: 20px;
      height: var(--widget-height);
      background: var(--widget-color);
      color: var(--text-color);
      border: none;
      border-radius: var(--widget-border-radius);
      cursor: pointer;
      padding: 0;
      font-size: 10px;
    }

    /* Rotary Angle Controller (2.7A) */
    .lil-gui .controller.lil-angle .widget {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .lil-gui .lil-angle-dial {
      width: var(--widget-height);
      height: var(--widget-height);
      border-radius: 50%;
      background: var(--widget-color);
      border: 1px solid rgba(255, 255, 255, 0.15);
      position: relative;
      cursor: grab;
      flex-shrink: 0;
      touch-action: none;
    }
    .lil-gui .lil-angle-dial:active {
      cursor: grabbing;
    }
    .lil-gui .lil-angle-needle {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 50%;
      height: 2px;
      background: var(--number-color);
      transform-origin: 0% 50%;
      pointer-events: none;
    }

    /* Tabbed Folders (4.4A) */
    .lil-gui .lil-tabs-container {
      border-top: 1px solid var(--folder-indent-color, #333);
      margin-top: 2px;
    }
    .lil-gui .lil-tabs-header {
      display: flex;
      background: var(--title-background-color);
      border-bottom: 1px solid var(--folder-indent-color, #333);
      overflow-x: auto;
    }
    .lil-gui .lil-tab-btn {
      flex: 1;
      height: var(--row-height);
      background: transparent;
      color: var(--text-color);
      opacity: 0.6;
      border: none;
      border-bottom: 2px solid transparent;
      font-family: var(--font-family);
      font-size: var(--font-size);
      cursor: pointer;
      padding: 0 8px;
      white-space: nowrap;
    }
    .lil-gui .lil-tab-btn:hover {
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.03);
    }
    .lil-gui .lil-tab-btn.active {
      opacity: 1;
      border-bottom-color: var(--number-color);
      font-weight: 600;
    }
    .lil-gui .lil-tab-panel > .title {
      display: none !important;
    }
    .lil-gui .lil-tab-panel {
      border: none !important;
    }

    /* Floating Tooltip Popover (3.2A) */
    .lil-ext-tooltip {
      position: fixed;
      z-index: 999999;
      background: #1a1a1a;
      color: #f0f0f0;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 5px 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.35;
      max-width: 240px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.12s ease;
    }
    .lil-ext-tooltip.visible {
      opacity: 1;
    }
    .lil-ext-tooltip-meta {
      margin-top: 3px;
      padding-top: 3px;
      border-top: 1px solid #333;
      font-size: 9.5px;
      color: #aaa;
      font-family: monospace;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// INTERNAL HOOKS & DECORATIVE CONTROLLER REGISTRATION
// ============================================================================
function markDecorative(ctrl) {
  ctrl._isDecorative = true;
  const idx = ctrl.parent?.controllers?.indexOf(ctrl);
  if (idx !== undefined && idx !== -1) {
    ctrl.parent.controllers.splice(idx, 1);
  }
}

function getAllControllers(gui, list = []) {
  gui.children.forEach((child) => {
    if (child instanceof GUI) {
      getAllControllers(child, list);
    } else if (child instanceof Controller) {
      list.push(child);
    }
  });
  return list;
}

const origCallOnChange = Controller.prototype._callOnChange;
Controller.prototype._callOnChange = function () {
  origCallOnChange.call(this);
  if (this._internalListeners) {
    const val = this.getValue();
    this._internalListeners.forEach((fn) => fn(val, this));
  }
  const root = this.parent?.root || this.parent;
  if (root && root._evaluateConditions) {
    root._evaluateConditions();
  }
  if (root && root._onAnyChange) {
    root._onAnyChange(this);
  }
};

const origCallOnFinishChange = Controller.prototype._callOnFinishChange;
Controller.prototype._callOnFinishChange = function () {
  origCallOnFinishChange.call(this);
  if (this._internalFinishListeners) {
    const val = this.getValue();
    this._internalFinishListeners.forEach((fn) => fn(val, this));
  }
  const root = this.parent?.root || this.parent;
  if (root && root._onAnyFinishChange) {
    root._onAnyFinishChange(this);
  }
};

// Hook updateDisplay so .listen() triggers .showIf() / .enableIf() and .format()
const origUpdateDisplay = Controller.prototype.updateDisplay;
Controller.prototype.updateDisplay = function () {
  const res = origUpdateDisplay.call(this);

  if (this._formatter && this.$input && !this._inputFocused) {
    this.$input.value = this._formatter(this.getValue());
  }

  const root = this.parent?.root || this.parent;
  if (root && root._evaluateConditions) {
    const curVal = this.object ? this.object[this.property] : undefined;
    if (curVal !== this._lastObservedVal) {
      this._lastObservedVal = curVal;
      root._evaluateConditions();
    }
  }
  return res;
};

// Hook destroy for cleanup
const origDestroy = Controller.prototype.destroy;
Controller.prototype.destroy = function () {
  if (this._cleanupFns) {
    this._cleanupFns.forEach((fn) => fn());
    this._cleanupFns = [];
  }
  return origDestroy.call(this);
};

Controller.prototype._addInternalListener = function (fn) {
  if (!this._internalListeners) this._internalListeners = [];
  this._internalListeners.push(fn);
};

Controller.prototype._addCleanup = function (fn) {
  if (!this._cleanupFns) this._cleanupFns = [];
  this._cleanupFns.push(fn);
};

// Patch GUI.prototype.save / load for RangeController & multi-prop safety
const origGuiSave = GUI.prototype.save;
GUI.prototype.save = function (recursive = true) {
  const res = origGuiSave.call(this, recursive);
  this.controllers.forEach((c) => {
    if (c instanceof RangeController) {
      res.controllers[c.minProp] = c.object[c.minProp];
      res.controllers[c.maxProp] = c.object[c.maxProp];
    }
  });
  return res;
};

const origGuiLoad = GUI.prototype.load;
GUI.prototype.load = function (obj, recursive = true) {
  const res = origGuiLoad.call(this, obj, recursive);
  if (obj && obj.controllers) {
    this.controllers.forEach((c) => {
      if (c instanceof RangeController) {
        const rawMin = obj.controllers[c.minProp];
        const rawMax = obj.controllers[c.maxProp];
        if (Array.isArray(rawMin)) {
          c.setValue(rawMin);
        } else if (rawMin !== undefined && rawMax !== undefined) {
          c.setValue([rawMin, rawMax]);
        }
      }
    });
  }
  return res;
};

// ============================================================================
// 1. DOUBLE-CLICK TO RESET (.resettable())
// ============================================================================
Controller.prototype.resettable = function () {
  ensureStyles();
  if (this._isResettable) return this;
  this._isResettable = true;
  this.$name.style.cursor = 'pointer';

  const resetIcon = document.createElement('span');
  resetIcon.className = 'lil-reset-btn';
  resetIcon.textContent = '↺';
  resetIcon.title = 'Reset to initial value';
  this.$name.appendChild(resetIcon);

  const doReset = (e) => {
    e.stopPropagation();
    this.reset();
    this._callOnFinishChange();
  };

  this.$name.addEventListener('dblclick', doReset);
  resetIcon.addEventListener('click', doReset);
  this._syncTooltipMeta?.();
  return this;
};

// ============================================================================
// 2. UPGRADED KEYBOARD SHORTCUTS & ARROW SCRUBBING (.hotkey('shift+r'))
// ============================================================================
const hotkeyRegistry = new Map();
let activeHotkeyController = null;

function normalizeKeyCombo(str) {
  const parts = str
    .toLowerCase()
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);
  const mods = [];
  let key = '';
  parts.forEach((p) => {
    if (p === 'ctrl' || p === 'control' || p === 'cmd' || p === 'meta') mods.push('ctrl');
    else if (p === 'alt' || p === 'option') mods.push('alt');
    else if (p === 'shift') mods.push('shift');
    else key = p;
  });
  return [...new Set(mods)].sort().concat(key).join('+');
}

function eventToKeyCombo(e) {
  const mods = [];
  if (e.ctrlKey || e.metaKey) mods.push('ctrl');
  if (e.altKey) mods.push('alt');
  if (e.shiftKey) mods.push('shift');
  const k = e.key.toLowerCase();
  if (['control', 'meta', 'alt', 'shift'].includes(k)) return '';
  return mods.sort().concat(k).join('+');
}

function setActiveHotkeyController(ctrl) {
  if (activeHotkeyController && activeHotkeyController !== ctrl) {
    activeHotkeyController.domElement.classList.remove('lil-hotkey-active');
  }
  activeHotkeyController = ctrl;
  if (ctrl) {
    ctrl.domElement.classList.add('lil-hotkey-active');
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    // Scoped Arrow-Key Scrubbing for active hotkey controller
    if (activeHotkeyController && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const c = activeHotkeyController;
      if (!c._hidden && !c._disabled) {
        const dir = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : -1;
        const mult = e.shiftKey ? 10 : 1;
        const step = (c._step || 1) * dir * mult;

        if (typeof c.getValue() === 'number') {
          e.preventDefault();
          let next = c.getValue() + step;
          if (c._min !== undefined) next = Math.max(c._min, next);
          if (c._max !== undefined) next = Math.min(c._max, next);
          c.setValue(next);
          c._callOnFinishChange();
          return;
        } else if (c instanceof RangeController) {
          e.preventDefault();
          const [minV, maxV] = c.getValue();
          c.setValue([minV + step, maxV + step]);
          c._callOnFinishChange();
          return;
        }
      }
    }

    if (e.key === 'Escape' && activeHotkeyController) {
      setActiveHotkeyController(null);
      return;
    }

    const combo = eventToKeyCombo(e);
    if (!combo) return;

    const controllers = hotkeyRegistry.get(combo);
    if (!controllers || controllers.size === 0) return;

    controllers.forEach((ctrl) => {
      if (ctrl._hidden || ctrl._disabled) return;
      e.preventDefault();
      const val = ctrl.getValue();
      if (typeof val === 'boolean') {
        ctrl.setValue(!val);
        ctrl._callOnFinishChange();
      } else if (typeof val === 'function') {
        val.call(ctrl.object);
        ctrl._callOnFinishChange();
      } else {
        setActiveHotkeyController(activeHotkeyController === ctrl ? null : ctrl);
      }
    });
  });
}

Controller.prototype.hotkey = function (comboStr) {
  ensureStyles();
  const combo = normalizeKeyCombo(comboStr);
  if (!hotkeyRegistry.has(combo)) {
    hotkeyRegistry.set(combo, new Set());
  }
  hotkeyRegistry.get(combo).add(this);
  this._hotkeyCombo = comboStr.toUpperCase();

  const badge = document.createElement('kbd');
  badge.className = 'lil-badge';
  badge.textContent = this._hotkeyCombo;
  this.$name.appendChild(badge);

  this._addCleanup(() => {
    hotkeyRegistry.get(combo)?.delete(this);
    if (activeHotkeyController === this) setActiveHotkeyController(null);
  });

  this._syncTooltipMeta?.();
  return this;
};

// ============================================================================
// 3. UNIT SUFFIXES (.unit('px'))
// ============================================================================
Controller.prototype.unit = function (unitStr) {
  ensureStyles();
  if (!this.$input) return this;

  const wrapper = document.createElement('div');
  wrapper.className = 'lil-unit-wrapper';

  const label = document.createElement('span');
  label.className = 'lil-unit-label';
  label.textContent = unitStr;

  this.$input.parentNode.insertBefore(wrapper, this.$input);
  wrapper.appendChild(this.$input);
  wrapper.appendChild(label);

  const pad = unitStr.length * 7 + 8;
  this.$input.style.paddingRight = `${pad}px`;
  return this;
};

// ============================================================================
// 4. DEBOUNCED & THROTTLED ONCHANGE
// ============================================================================
Controller.prototype.onDebounceChange = function (fn, delay = 300) {
  let timer = null;
  this._addInternalListener((val) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.call(this, val), delay);
  });
  this._addCleanup(() => clearTimeout(timer));
  return this;
};

Controller.prototype.onThrottleChange = function (fn, interval = 100) {
  let lastTime = 0;
  let timer = null;
  let latestVal;

  this._addInternalListener((val) => {
    latestVal = val;
    const now = Date.now();
    const remaining = interval - (now - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.call(this, latestVal);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.call(this, latestVal);
      }, remaining);
    }
  });

  this._addCleanup(() => clearTimeout(timer));
  return this;
};

// ============================================================================
// 5. CONDITIONAL VISIBILITY & ENABLEMENT (.showIf(fn) & .enableIf(fn))
// ============================================================================
function ensureConditionEngine(target) {
  const root = target.parent?.root || target.parent || target.root || target;
  if (!root._conditionTargets) {
    root._conditionTargets = [];
    root._evaluateConditions = () => {
      root._conditionTargets.forEach(({ item, type, fn }) => {
        const result = Boolean(fn());
        if (type === 'show') {
          result ? item.show() : item.hide();
        } else if (type === 'enable') {
          if (typeof item.enable === 'function') {
            item.enable(result);
          } else if (item.controllersRecursive) {
            item.controllersRecursive().forEach((c) => c.enable(result));
          }
        }
      });
    };
  }
  return root;
}

Controller.prototype.showIf = function (predicateFn) {
  const root = ensureConditionEngine(this);
  root._conditionTargets.push({ item: this, type: 'show', fn: predicateFn });
  predicateFn() ? this.show() : this.hide();
  return this;
};

GUI.prototype.showIf = function (predicateFn) {
  const root = ensureConditionEngine(this);
  root._conditionTargets.push({ item: this, type: 'show', fn: predicateFn });
  predicateFn() ? this.show() : this.hide();
  return this;
};

Controller.prototype.enableIf = function (predicateFn) {
  const root = ensureConditionEngine(this);
  root._conditionTargets.push({ item: this, type: 'enable', fn: predicateFn });
  this.enable(Boolean(predicateFn()));
  return this;
};

GUI.prototype.enableIf = function (predicateFn) {
  const root = ensureConditionEngine(this);
  root._conditionTargets.push({ item: this, type: 'enable', fn: predicateFn });
  const res = Boolean(predicateFn());
  this.controllersRecursive().forEach((c) => c.enable(res));
  return this;
};

// ============================================================================
// 6. UPGRADED CONTROLLER LOCKING / SYNCING (.syncWith())
// ============================================================================
Controller.prototype.syncWith = function (others, options = {}) {
  ensureStyles();
  const group = [this, ...(Array.isArray(others) ? others : [others])];

  let mode = 'delta';
  let isLocked = true;
  let customFn = null;

  if (typeof options === 'boolean') {
    isLocked = options;
  } else if (typeof options === 'function') {
    mode = 'custom';
    customFn = options;
  } else if (options && typeof options === 'object') {
    if (options.mode) mode = options.mode;
    if (options.locked !== undefined) isLocked = options.locked;
    if (typeof options.transform === 'function') {
      mode = 'custom';
      customFn = options.transform;
    }
  }

  let isSyncing = false;
  const icons = [];
  const lastValues = new Map();

  const updateIcons = () => {
    icons.forEach((icon) => {
      icon.classList.toggle('locked', isLocked);
      icon.textContent = isLocked ? '🔗' : '🔓';
      icon.title = isLocked
        ? `Synced [${mode}] (Click to unlock)`
        : 'Unlocked (Click to sync)';
    });
  };

  group.forEach((ctrl) => {
    lastValues.set(ctrl, ctrl.getValue());

    const icon = document.createElement('span');
    icon.className = 'lil-sync-btn';
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      isLocked = !isLocked;
      group.forEach((c) => lastValues.set(c, c.getValue()));
      updateIcons();
    });
    ctrl.$name.appendChild(icon);
    icons.push(icon);

    ctrl._addInternalListener((newVal) => {
      if (!isLocked || isSyncing) {
        lastValues.set(ctrl, newVal);
        return;
      }
      isSyncing = true;
      const oldVal = lastValues.get(ctrl);
      lastValues.set(ctrl, newVal);

      group.forEach((other) => {
        if (other === ctrl) return;
        const otherVal = other.getValue();
        let nextVal = otherVal;

        if (mode === 'custom' && customFn) {
          nextVal = customFn(newVal, oldVal, otherVal, other);
        } else if (mode === 'mirror') {
          nextVal = newVal;
        } else if (mode === 'ratio') {
          nextVal = oldVal !== 0 ? otherVal * (newVal / oldVal) : newVal;
        } else {
          // 'delta'
          nextVal = otherVal + (newVal - oldVal);
        }

        if (other._min !== undefined) nextVal = Math.max(other._min, nextVal);
        if (other._max !== undefined) nextVal = Math.min(other._max, nextVal);
        other.setValue(nextVal);
        lastValues.set(other, other.getValue());
      });
      isSyncing = false;
    });
  });

  updateIcons();
  return this;
};

// ============================================================================
// 7. VISUAL SEPARATORS (gui.addSeparator())
// ============================================================================
class SeparatorController extends Controller {
  constructor(parent) {
    ensureStyles();
    super(parent, {}, '', 'lil-separator-ctrl');
    markDecorative(this);
    this.$name.style.display = 'none';
    this.$widget.style.display = 'none';
    const hr = document.createElement('hr');
    hr.className = 'lil-separator';
    this.domElement.appendChild(hr);
  }
}

GUI.prototype.addSeparator = function () {
  return new SeparatorController(this);
};

// ============================================================================
// 8. INFO / NOTE BLOCKS (gui.addNote('text'))
// ============================================================================
class NoteController extends Controller {
  constructor(parent, text) {
    ensureStyles();
    super(parent, {}, '', 'lil-note');
    markDecorative(this);
    this.$name.style.display = 'none';
    this.$widget.style.display = 'none';
    this.$text = document.createElement('div');
    this.$text.textContent = text;
    this.domElement.appendChild(this.$text);
  }
  setText(text) {
    this.$text.textContent = text;
    return this;
  }
}

GUI.prototype.addNote = function (text) {
  return new NoteController(this, text);
};

// ============================================================================
// 9. INLINE BUTTON ROW (gui.addButtonRow({ Label: fn, ... }))
// ============================================================================
class ButtonRowController extends Controller {
  constructor(parent, buttons, label = '') {
    ensureStyles();
    super(parent, {}, '', 'lil-button-row');
    markDecorative(this);
    if (label) {
      this.name(label);
    } else {
      this.$name.style.display = 'none';
    }

    const entries = Array.isArray(buttons)
      ? buttons.map((b) => [b.name, b.onClick])
      : Object.entries(buttons);

    entries.forEach(([btnName, fn]) => {
      const btn = document.createElement('button');
      btn.textContent = btnName;
      btn.addEventListener('click', () => {
        fn();
        this._callOnFinishChange();
      });
      this.$widget.appendChild(btn);
    });
  }
}

GUI.prototype.addButtonRow = function (buttons, label = '') {
  return new ButtonRowController(this, buttons, label);
};

// ============================================================================
// 10. UPGRADED MIN/MAX RANGE SLIDER
// ============================================================================
class RangeController extends Controller {
  constructor(parent, object, minProp, maxProp, min = 0, max = 100, step = 1) {
    ensureStyles();
    super(parent, object, minProp, 'lil-range');
    this.minProp = minProp;
    this.maxProp = maxProp;
    this._min = min;
    this._max = max;
    this._step = step;

    this.initialMin = object[minProp];
    this.initialMax = object[maxProp];

    this.name(`${minProp} / ${maxProp}`);

    this.$track = document.createElement('div');
    this.$track.className = 'lil-range-track';

    this.$fill = document.createElement('div');
    this.$fill.className = 'lil-range-fill';

    this.$handleMin = document.createElement('div');
    this.$handleMin.className = 'lil-range-handle min';
    this.$handleMax = document.createElement('div');
    this.$handleMax.className = 'lil-range-handle max';
    this.$fill.appendChild(this.$handleMin);
    this.$fill.appendChild(this.$handleMax);

    this.$label = document.createElement('div');
    this.$label.className = 'lil-range-label';

    this.$track.appendChild(this.$fill);
    this.$track.appendChild(this.$label);
    this.$widget.appendChild(this.$track);

    this._setupInteractions();
    this.updateDisplay();
  }

  _roundToStep(val) {
    const stepped = Math.round((val - this._min) / this._step) * this._step + this._min;
    const decimals = (this._step.toString().split('.')[1] || '').length;
    return Number(Math.min(this._max, Math.max(this._min, stepped)).toFixed(decimals));
  }

  _pctToVal(pct) {
    const p = Math.max(0, Math.min(1, pct));
    if (this._isLog && this._min > 0) {
      return this._roundToStep(this._min * Math.pow(this._max / this._min, p));
    }
    const mapped = this._curveExp ? Math.pow(p, this._curveExp) : p;
    return this._roundToStep(this._min + mapped * (this._max - this._min));
  }

  _valToPct(val) {
    const clamped = Math.max(this._min, Math.min(this._max, val));
    if (this._isLog && this._min > 0) {
      return Math.log(clamped / this._min) / Math.log(this._max / this._min);
    }
    const lin = (clamped - this._min) / (this._max - this._min || 1);
    return this._curveExp ? Math.pow(Math.max(0, lin), 1 / this._curveExp) : lin;
  }

  _setupInteractions() {
    let dragMode = null; // 'min' | 'max' | 'pan'
    let startX = 0;
    let startMin = 0;
    let startMax = 0;

    const getPctFromPointer = (clientX) => {
      const rect = this.$track.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / (rect.width || 1)));
    };

    const onPointerMove = (e) => {
      if (!dragMode) return;
      const pct = getPctFromPointer(e.clientX);
      const val = this._pctToVal(pct);

      if (dragMode === 'min') {
        this.object[this.minProp] = Math.min(val, this.object[this.maxProp]);
      } else if (dragMode === 'max') {
        this.object[this.maxProp] = Math.max(val, this.object[this.minProp]);
      } else if (dragMode === 'pan') {
        const rect = this.$track.getBoundingClientRect();
        const deltaPct = (e.clientX - startX) / (rect.width || 1);
        const deltaVal = deltaPct * (this._max - this._min);
        const span = startMax - startMin;
        let nextMin = startMin + deltaVal;
        let nextMax = startMax + deltaVal;
        if (nextMin < this._min) {
          nextMin = this._min;
          nextMax = nextMin + span;
        }
        if (nextMax > this._max) {
          nextMax = this._max;
          nextMin = nextMax - span;
        }
        this.object[this.minProp] = this._roundToStep(nextMin);
        this.object[this.maxProp] = this._roundToStep(nextMax);
      }
      this.updateDisplay();
      this._callOnChange();
    };

    const onPointerUp = () => {
      dragMode = null;
      this.$handleMin.classList.remove('active');
      this.$handleMax.classList.remove('active');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      this._callOnFinishChange();
    };

    this.$track.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      startX = e.clientX;
      startMin = this.object[this.minProp];
      startMax = this.object[this.maxProp];

      const pct = getPctFromPointer(e.clientX);
      const minPct = this._valToPct(startMin);
      const maxPct = this._valToPct(startMax);
      const edgeTolerance = 0.06;

      if (e.target === this.$handleMin) {
        dragMode = 'min';
      } else if (e.target === this.$handleMax) {
        dragMode = 'max';
      } else if (pct > minPct + edgeTolerance && pct < maxPct - edgeTolerance) {
        dragMode = 'pan';
      } else {
        const clickVal = this._pctToVal(pct);
        const distMin = Math.abs(clickVal - startMin);
        const distMax = Math.abs(clickVal - startMax);
        dragMode = distMin <= distMax ? 'min' : 'max';
        onPointerMove(e);
      }

      if (dragMode === 'min') this.$handleMin.classList.add('active');
      if (dragMode === 'max') this.$handleMax.classList.add('active');

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });

    // Double-click inline edit
    this.$track.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'lil-range-edit';
      input.value = `${this.object[this.minProp]} - ${this.object[this.maxProp]}`;
      this.$track.appendChild(input);
      input.focus();
      input.select();

      const commit = () => {
        if (!input.parentNode) return;
        const nums = input.value
          .split(/[\s,–-]+/)
          .map((s) => parseFloat(s))
          .filter((n) => !Number.isNaN(n));
        if (nums.length >= 2) {
          const a = Math.min(nums[0], nums[1]);
          const b = Math.max(nums[0], nums[1]);
          this.setValue([a, b]);
          this._callOnFinishChange();
        } else if (nums.length === 1) {
          this.setValue([nums[0], nums[0]]);
          this._callOnFinishChange();
        }
        input.remove();
      };

      input.addEventListener('keydown', (ke) => {
        if (ke.key === 'Enter') commit();
        else if (ke.key === 'Escape') input.remove();
      });
      input.addEventListener('blur', commit);
    });
  }

  getValue() {
    return [this.object[this.minProp], this.object[this.maxProp]];
  }

  setValue([minVal, maxVal]) {
    const a = this._roundToStep(Math.min(minVal, maxVal));
    const b = this._roundToStep(Math.max(minVal, maxVal));
    this.object[this.minProp] = a;
    this.object[this.maxProp] = b;
    this.updateDisplay();
    this._callOnChange();
    return this;
  }

  save() {
    return this.getValue();
  }

  load(val) {
    if (Array.isArray(val) && val.length >= 2) {
      this.setValue(val);
    }
    return this;
  }

  reset() {
    return this.setValue([this.initialMin, this.initialMax]);
  }

  updateDisplay() {
    const minVal = this.object[this.minProp];
    const maxVal = this.object[this.maxProp];
    const leftPct = this._valToPct(minVal) * 100;
    const rightPct = this._valToPct(maxVal) * 100;

    this.$fill.style.left = `${leftPct}%`;
    this.$fill.style.width = `${Math.max(0, rightPct - leftPct)}%`;
    this.$label.textContent = this._formatter
      ? this._formatter([minVal, maxVal])
      : `${minVal} – ${maxVal}`;
    return this;
  }
}

GUI.prototype.addRange = function (object, minProp, maxProp, min = 0, max = 100, step = 1) {
  return new RangeController(this, object, minProp, maxProp, min, max, step);
};

// ============================================================================
// 11. MULTI-COMPONENT VECTOR / POINT CONTROLLER
// ============================================================================
class VectorController extends Controller {
  constructor(parent, object, property, options = {}) {
    ensureStyles();
    super(parent, object, property, 'lil-vector');

    const target = object[property];
    this.isArray = Array.isArray(target);
    const defaultKeys = ['x', 'y', 'z', 'w'];

    if (this.isArray) {
      const dims = options.dims || target.length || 3;
      this.keys = Array.from({ length: dims }, (_, i) => i);
      this.labels = options.labels || defaultKeys.slice(0, dims).map((k) => k.toUpperCase());
    } else {
      const detected = defaultKeys.filter((k) => k in target);
      this.keys = options.keys || (detected.length ? detected : ['x', 'y']);
      this.labels = options.labels || this.keys.map((k) => String(k).toUpperCase());
    }

    this._min = options.min ?? -Infinity;
    this._max = options.max ?? Infinity;
    this._step = options.step ?? 0.1;
    this.initialValue = this.save();

    this.inputs = [];
    this.keys.forEach((key, idx) => {
      const cell = document.createElement('div');
      cell.className = 'lil-vec-cell';

      const axis = document.createElement('span');
      axis.className = `lil-vec-axis axis-${idx % 4}`;
      axis.textContent = this.labels[idx] || key;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'lil-vec-input';

      this._setupAxisScrub(axis, key);
      this._setupInput(input, key);

      cell.appendChild(axis);
      cell.appendChild(input);
      this.$widget.appendChild(cell);
      this.inputs.push({ key, input });
    });

    this.updateDisplay();
  }

  _clampAndRound(val) {
    const clamped = Math.max(this._min, Math.min(this._max, val));
    const decimals = (this._step.toString().split('.')[1] || '').length;
    const stepped = Math.round(clamped / this._step) * this._step;
    return Number(stepped.toFixed(decimals));
  }

  _setupAxisScrub(axisEl, key) {
    let startX = 0;
    let startVal = 0;

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const next = this._clampAndRound(startVal + dx * this._step * mult);
      this.object[this.property][key] = next;
      this.updateDisplay();
      this._callOnChange();
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      this._callOnFinishChange();
    };

    axisEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startX = e.clientX;
      startVal = Number(this.object[this.property][key]) || 0;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  _setupInput(input, key) {
    input.addEventListener('focus', () => {
      input.select();
    });
    input.addEventListener('change', () => {
      const parsed = parseFloat(input.value);
      if (!Number.isNaN(parsed)) {
        this.object[this.property][key] = this._clampAndRound(parsed);
        this._callOnChange();
        this._callOnFinishChange();
      }
      this.updateDisplay();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const dir = e.key === 'ArrowUp' ? 1 : -1;
        const mult = e.shiftKey ? 10 : 1;
        const cur = Number(this.object[this.property][key]) || 0;
        this.object[this.property][key] = this._clampAndRound(cur + dir * this._step * mult);
        this.updateDisplay();
        this._callOnChange();
        this._callOnFinishChange();
      }
    });
  }

  getValue() {
    return this.object[this.property];
  }

  setValue(val) {
    const target = this.object[this.property];
    this.keys.forEach((k, i) => {
      const v = Array.isArray(val) ? val[i] : val?.[k];
      if (v !== undefined) target[k] = this._clampAndRound(v);
    });
    this.updateDisplay();
    this._callOnChange();
    return this;
  }

  save() {
    const target = this.object[this.property];
    return this.keys.map((k) => target[k]);
  }

  load(val) {
    if (val) this.setValue(val);
    return this;
  }

  reset() {
    this.setValue(this.initialValue);
    return this;
  }

  updateDisplay() {
    const target = this.object[this.property];
    if (!target) return this;
    this.inputs.forEach(({ key, input }) => {
      if (document.activeElement !== input) {
        input.value = target[key];
      }
    });
    return this;
  }
}

GUI.prototype.addVector = function (object, property, options = {}) {
  return new VectorController(this, object, property, options);
};
GUI.prototype.addVector2 = function (object, property, options = {}) {
  return new VectorController(this, object, property, { dims: 2, keys: ['x', 'y'], ...options });
};
GUI.prototype.addVector3 = function (object, property, options = {}) {
  return new VectorController(this, object, property, { dims: 3, keys: ['x', 'y', 'z'], ...options });
};
GUI.prototype.addVector4 = function (object, property, options = {}) {
  return new VectorController(this, object, property, { dims: 4, keys: ['x', 'y', 'z', 'w'], ...options });
};

// ============================================================================
// 12. REAL-TIME SPARKLINE MONITOR & FPS WIDGET
// ============================================================================
class MonitorController extends Controller {
  constructor(parent, object, property, options = {}) {
    ensureStyles();
    super(parent, object, property, 'lil-monitor');
    markDecorative(this);

    this.bufferSize = options.bufferSize || 60;
    this.interval = options.interval ?? 100;
    this.fixedMin = options.min;
    this.fixedMax = options.max;
    this._formatter = options.format || null;
    this.buffer = [];

    this.$canvas = document.createElement('canvas');
    this.$canvas.className = 'lil-monitor-canvas';

    this.$overlay = document.createElement('div');
    this.$overlay.className = 'lil-monitor-overlay';
    this.$rangeText = document.createElement('span');
    this.$rangeText.style.opacity = '0.55';
    this.$valueText = document.createElement('span');

    this.$overlay.appendChild(this.$rangeText);
    this.$overlay.appendChild(this.$valueText);
    this.$widget.appendChild(this.$canvas);
    this.$widget.appendChild(this.$overlay);

    const timer = setInterval(() => this.sample(), this.interval);
    this._addCleanup(() => clearInterval(timer));
    this.sample();
  }

  sample() {
    if (this._hidden) return;
    const val = Number(this.object[this.property]);
    if (Number.isNaN(val)) return;

    this.buffer.push(val);
    if (this.buffer.length > this.bufferSize) this.buffer.shift();
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.buffer.length) return this;
    const cur = this.buffer[this.buffer.length - 1];
    const min = this.fixedMin !== undefined ? this.fixedMin : Math.min(...this.buffer);
    const max = this.fixedMax !== undefined ? this.fixedMax : Math.max(...this.buffer);
    const span = max - min || 1;

    this.$valueText.textContent = this._formatter ? this._formatter(cur) : cur.toFixed(1);
    this.$rangeText.textContent = `[${min.toFixed(0)}..${max.toFixed(0)}]`;

    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    const rect = this.$canvas.getBoundingClientRect();
    const w = (rect.width || 120) * dpr;
    const h = (rect.height || 28) * dpr;
    if (this.$canvas.width !== w || this.$canvas.height !== h) {
      this.$canvas.width = w;
      this.$canvas.height = h;
    }

    const ctx = this.$canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    const style = getComputedStyle(this.domElement);
    const strokeColor = style.getPropertyValue('--number-color').trim() || '#2cc9ff';

    ctx.beginPath();
    this.buffer.forEach((v, i) => {
      const x = (i / Math.max(1, this.bufferSize - 1)) * w;
      const norm = Math.max(0, Math.min(1, (v - min) / span));
      const y = h - norm * (h - 6 * dpr) - 3 * dpr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();

    return this;
  }
}

GUI.prototype.addMonitor = function (object, property, options = {}) {
  return new MonitorController(this, object, property, options);
};

GUI.prototype.addFPS = function (options = {}) {
  const tracker = { fps: 60 };
  let frames = 0;
  let lastTime = performance.now();
  let rafId = null;

  const loop = (now) => {
    frames++;
    if (now - lastTime >= 250) {
      tracker.fps = Math.round((frames * 1000) / (now - lastTime));
      frames = 0;
      lastTime = now;
    }
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  const ctrl = new MonitorController(this, tracker, 'fps', {
    min: 0,
    max: 120,
    interval: 250,
    format: (v) => `${Math.round(v)} FPS`,
    ...options,
  }).name(options.name || 'FPS');

  ctrl._addCleanup(() => cancelAnimationFrame(rafId));
  return ctrl;
};

// ============================================================================
// 13. SEGMENTED PILL & MULTI-SELECT CONTROLLERS
// ============================================================================
class SegmentedController extends Controller {
  constructor(parent, object, property, options) {
    ensureStyles();
    super(parent, object, property, 'lil-segmented');
    this.initialValue = object[property];

    this.entries = Array.isArray(options)
      ? options.map((v) => [String(v), v])
      : Object.entries(options);

    this.buttons = [];
    this.entries.forEach(([label, val]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        this.setValue(val);
        this._callOnFinishChange();
      });
      this.$widget.appendChild(btn);
      this.buttons.push({ btn, val });
    });

    this.updateDisplay();
  }

  updateDisplay() {
    const cur = this.getValue();
    this.buttons.forEach(({ btn, val }) => {
      btn.classList.toggle('active', val === cur);
    });
    return this;
  }
}

GUI.prototype.addSegmented = function (object, property, options) {
  return new SegmentedController(this, object, property, options);
};

class MultiSelectController extends Controller {
  constructor(parent, object, property, options, config = {}) {
    ensureStyles();
    super(parent, object, property, 'lil-multiselect');

    this.isBitmask = Boolean(config.bitmask || typeof object[property] === 'number');
    this.initialValue = this.isBitmask ? object[property] : [...(object[property] || [])];

    this.entries = Array.isArray(options)
      ? options.map((v, i) => [String(v), this.isBitmask ? 1 << i : v])
      : Object.entries(options);

    this.buttons = [];
    this.entries.forEach(([label, val]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        this._toggleValue(val);
        this._callOnFinishChange();
      });
      this.$widget.appendChild(btn);
      this.buttons.push({ btn, val });
    });

    this.updateDisplay();
  }

  _toggleValue(val) {
    if (this.isBitmask) {
      this.object[this.property] ^= val;
    } else {
      const arr = Array.isArray(this.object[this.property]) ? [...this.object[this.property]] : [];
      const idx = arr.indexOf(val);
      if (idx === -1) arr.push(val);
      else arr.splice(idx, 1);
      this.object[this.property] = arr;
    }
    this.updateDisplay();
    this._callOnChange();
  }

  save() {
    return this.isBitmask ? this.object[this.property] : [...this.object[this.property]];
  }

  load(val) {
    this.setValue(this.isBitmask ? val : [...(val || [])]);
    return this;
  }

  reset() {
    this.setValue(this.isBitmask ? this.initialValue : [...this.initialValue]);
    return this;
  }

  updateDisplay() {
    const cur = this.object[this.property];
    this.buttons.forEach(({ btn, val }) => {
      const active = this.isBitmask
        ? Boolean(cur & val)
        : Array.isArray(cur) && cur.includes(val);
      btn.classList.toggle('active', active);
    });
    return this;
  }
}

GUI.prototype.addMultiSelect = function (object, property, options, config = {}) {
  return new MultiSelectController(this, object, property, options, config);
};

// ============================================================================
// 14. GENERIC FILE & IMAGE DROP CONTROLLER
// ============================================================================
class FileController extends Controller {
  constructor(parent, objectOrFn, propertyOrOptions, options = {}) {
    ensureStyles();
    const isCallbackMode = typeof objectOrFn === 'function';
    const targetObj = isCallbackMode ? { file: null } : objectOrFn;
    const targetProp = isCallbackMode ? 'file' : propertyOrOptions;
    const cfg = isCallbackMode ? propertyOrOptions || {} : options;

    super(parent, targetObj, targetProp, 'lil-file');
    markDecorative(this);

    this.readAs = cfg.as || 'url'; // 'url' | 'dataURL' | 'text' | 'json' | 'arrayBuffer' | 'image'
    this.callback = isCallbackMode ? objectOrFn : cfg.onLoad;

    this.$thumb = document.createElement('img');
    this.$thumb.className = 'lil-file-thumb';

    this.$drop = document.createElement('div');
    this.$drop.className = 'lil-file-drop';
    this.$drop.textContent = cfg.placeholder || 'Drop or Browse File...';

    this.$fileInput = document.createElement('input');
    this.$fileInput.type = 'file';
    if (cfg.accept) this.$fileInput.accept = cfg.accept;
    this.$fileInput.style.display = 'none';

    this.$widget.appendChild(this.$thumb);
    this.$widget.appendChild(this.$drop);
    this.$widget.appendChild(this.$fileInput);

    this._setupEvents();
  }

  _setupEvents() {
    this.$drop.addEventListener('click', () => this.$fileInput.click());
    this.$fileInput.addEventListener('change', (e) => {
      if (e.target.files?.[0]) this._handleFile(e.target.files[0]);
    });

    this.$drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.$drop.classList.add('dragover');
    });
    this.$drop.addEventListener('dragleave', () => {
      this.$drop.classList.remove('dragover');
    });
    this.$drop.addEventListener('drop', (e) => {
      e.preventDefault();
      this.$drop.classList.remove('dragover');
      if (e.dataTransfer?.files?.[0]) this._handleFile(e.dataTransfer.files[0]);
    });
  }

  _handleFile(file) {
    this.$drop.textContent = file.name;

    if (file.type.startsWith('image/')) {
      const thumbUrl = URL.createObjectURL(file);
      this.$thumb.src = thumbUrl;
      this.$thumb.style.display = 'block';
    }

    const finalize = (result) => {
      this.object[this.property] = result;
      if (this.callback) this.callback(result, file);
      this._callOnChange();
      this._callOnFinishChange();
    };

    if (this.readAs === 'url') {
      finalize(URL.createObjectURL(file));
    } else if (this.readAs === 'image') {
      const img = new Image();
      img.onload = () => finalize(img);
      img.src = URL.createObjectURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.readAs === 'json') {
          try {
            finalize(JSON.parse(reader.result));
          } catch (err) {
            console.error('Failed to parse JSON file:', err);
          }
        } else {
          finalize(reader.result);
        }
      };
      if (this.readAs === 'arrayBuffer') reader.readAsArrayBuffer(file);
      else if (this.readAs === 'dataURL') reader.readAsDataURL(file);
      else reader.readAsText(file);
    }
  }
}

GUI.prototype.addFile = function (objectOrFn, propertyOrOptions, options = {}) {
  return new FileController(this, objectOrFn, propertyOrOptions, options);
};

GUI.prototype.addImage = function (objectOrFn, propertyOrOptions, options = {}) {
  const isFn = typeof objectOrFn === 'function';
  const merged = { accept: 'image/*', as: 'url', ...(isFn ? propertyOrOptions : options) };
  return new FileController(this, objectOrFn, isFn ? merged : propertyOrOptions, merged);
};

// ============================================================================
// 15. MULTI-STOP GRADIENT BAR & PRESET PALETTE SELECTOR
// ============================================================================
const GRADIENT_PRESETS = {
  Viridis: [
    { pos: 0, color: '#440154' },
    { pos: 0.5, color: '#21918c' },
    { pos: 1, color: '#fde725' },
  ],
  Magma: [
    { pos: 0, color: '#000004' },
    { pos: 0.5, color: '#b73779' },
    { pos: 1, color: '#fcfdbf' },
  ],
  Turbo: [
    { pos: 0, color: '#30123b' },
    { pos: 0.35, color: '#28bbec' },
    { pos: 0.7, color: '#fb8022' },
    { pos: 1, color: '#7a0403' },
  ],
  Sunset: [
    { pos: 0, color: '#2b1055' },
    { pos: 0.5, color: '#d94e73' },
    { pos: 1, color: '#ffbe76' },
  ],
  Grayscale: [
    { pos: 0, color: '#000000' },
    { pos: 1, color: '#ffffff' },
  ],
};

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0'))
      .join('')
  );
}

class GradientController extends Controller {
  constructor(parent, object, property, options = {}) {
    ensureStyles();
    super(parent, object, property, 'lil-gradient');

    if (!Array.isArray(object[property]) || object[property].length < 2) {
      object[property] = [
        { pos: 0, color: '#000000' },
        { pos: 1, color: '#ffffff' },
      ];
    }
    this.initialValue = this.save();
    this.presets = { ...GRADIENT_PRESETS, ...(options.presets || {}) };
    this.activeStopIndex = 0;

    this.$track = document.createElement('div');
    this.$track.className = 'lil-gradient-track';

    this.$colorInput = document.createElement('input');
    this.$colorInput.type = 'color';
    this.$colorInput.style.display = 'none';

    this.$presetSelect = document.createElement('select');
    this.$presetSelect.className = 'lil-gradient-preset';
    this.$presetSelect.title = 'Gradient Presets';
    const defOpt = document.createElement('option');
    defOpt.textContent = '▾';
    defOpt.value = '';
    this.$presetSelect.appendChild(defOpt);
    Object.keys(this.presets).forEach((name) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      this.$presetSelect.appendChild(opt);
    });

    this.$widget.appendChild(this.$track);
    this.$widget.appendChild(this.$presetSelect);
    this.$widget.appendChild(this.$colorInput);

    this._setupEvents();
    this.updateDisplay();
  }

  _getStops() {
    return this.object[this.property].sort((a, b) => a.pos - b.pos);
  }

  sample(t, format = 'hex') {
    const stops = this._getStops();
    const clamped = Math.max(0, Math.min(1, t));
    let left = stops[0];
    let right = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (clamped >= stops[i].pos && clamped <= stops[i + 1].pos) {
        left = stops[i];
        right = stops[i + 1];
        break;
      }
    }

    const span = right.pos - left.pos || 1;
    const localT = (clamped - left.pos) / span;
    const c1 = hexToRgb(left.color);
    const c2 = hexToRgb(right.color);
    const rgb = [
      c1[0] + (c2[0] - c1[0]) * localT,
      c1[1] + (c2[1] - c1[1]) * localT,
      c1[2] + (c2[2] - c1[2]) * localT,
    ];
    return format === 'rgb' || format === 'array' ? rgb : rgbToHex(rgb);
  }

  _setupEvents() {
    this.$presetSelect.addEventListener('change', () => {
      const preset = this.presets[this.$presetSelect.value];
      if (preset) {
        this.setValue(preset.map((s) => ({ ...s })));
        this._callOnFinishChange();
      }
      this.$presetSelect.value = '';
    });

    this.$colorInput.addEventListener('input', () => {
      const stops = this.object[this.property];
      if (stops[this.activeStopIndex]) {
        stops[this.activeStopIndex].color = this.$colorInput.value;
        this.updateDisplay();
        this._callOnChange();
      }
    });
    this.$colorInput.addEventListener('change', () => this._callOnFinishChange());

    // Click empty track to add stop
    this.$track.addEventListener('pointerdown', (e) => {
      if (e.target !== this.$track) return;
      const rect = this.$track.getBoundingClientRect();
      const pos = Number(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)).toFixed(3));
      const color = this.sample(pos, 'hex');
      this.object[this.property].push({ pos, color });
      this.activeStopIndex = this.object[this.property].length - 1;
      this.updateDisplay();
      this._callOnChange();
      this._callOnFinishChange();
    });
  }

  save() {
    return this.object[this.property].map((s) => ({ ...s }));
  }

  load(val) {
    if (Array.isArray(val)) this.setValue(val.map((s) => ({ ...s })));
    return this;
  }

  reset() {
    this.setValue(this.initialValue.map((s) => ({ ...s })));
    return this;
  }

  updateDisplay() {
    const stops = this._getStops();
    const cssStops = stops.map((s) => `${s.color} ${(s.pos * 100).toFixed(1)}%`).join(', ');
    this.$track.style.background = `linear-gradient(90deg, ${cssStops})`;
    this.$track.innerHTML = '';

    stops.forEach((stop, idx) => {
      const handle = document.createElement('div');
      handle.className = `lil-gradient-stop ${idx === this.activeStopIndex ? 'active' : ''}`;
      handle.style.left = `${stop.pos * 100}%`;
      handle.style.background = stop.color;
      handle.title = `${Math.round(stop.pos * 100)}% (${stop.color}) — Double-click to color, Alt+Click to delete`;

      handle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (e.altKey && stops.length > 2) {
          stops.splice(idx, 1);
          this.activeStopIndex = 0;
          this.updateDisplay();
          this._callOnChange();
          this._callOnFinishChange();
          return;
        }

        this.activeStopIndex = idx;
        const onMove = (me) => {
          const rect = this.$track.getBoundingClientRect();
          stop.pos = Number(
            Math.max(0, Math.min(1, (me.clientX - rect.left) / (rect.width || 1))).toFixed(3)
          );
          this.updateDisplay();
          this._callOnChange();
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          this._callOnFinishChange();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });

      handle.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.activeStopIndex = idx;
        this.$colorInput.value = stop.color;
        this.$colorInput.click();
      });

      this.$track.appendChild(handle);
    });

    return this;
  }
}

GUI.prototype.addGradient = function (object, property, options = {}) {
  return new GradientController(this, object, property, options);
};

// ============================================================================
// 16. ROTARY ANGLE / DIAL CONTROLLER
// ============================================================================
class AngleController extends Controller {
  constructor(parent, object, property, options = {}) {
    ensureStyles();
    super(parent, object, property, 'lil-angle');

    this.unitMode = options.unit || 'deg'; // 'deg' | 'rad'
    this._step = options.step ?? (this.unitMode === 'rad' ? 0.01 : 1);
    this.initialValue = object[property];

    this.$dial = document.createElement('div');
    this.$dial.className = 'lil-angle-dial';
    this.$needle = document.createElement('div');
    this.$needle.className = 'lil-angle-needle';
    this.$dial.appendChild(this.$needle);

    this.$input = document.createElement('input');
    this.$input.type = 'text';
    this.$input.className = 'lil-vec-input';
    this.$input.style.background = 'var(--widget-color)';
    this.$input.style.borderRadius = 'var(--widget-border-radius)';
    this.$input.style.height = 'var(--widget-height)';

    this.$widget.appendChild(this.$dial);
    this.$widget.appendChild(this.$input);
    this.unit(this.unitMode === 'rad' ? 'rad' : '°');

    this._setupDial();
    this.updateDisplay();
  }

  _setupDial() {
    const updateFromPointer = (e) => {
      const rect = this.$dial.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let rad = Math.atan2(e.clientY - cy, e.clientX - cx);
      if (rad < 0) rad += Math.PI * 2;

      if (e.shiftKey) {
        const snap = Math.PI / 12; // 15 deg
        rad = Math.round(rad / snap) * snap;
      }

      const val = this.unitMode === 'rad' ? rad : (rad * 180) / Math.PI;
      const decimals = (this._step.toString().split('.')[1] || '').length;
      this.setValue(Number(val.toFixed(decimals)));
    };

    const onMove = (e) => updateFromPointer(e);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      this._callOnFinishChange();
    };

    this.$dial.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      updateFromPointer(e);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    this.$input.addEventListener('change', () => {
      const parsed = parseFloat(this.$input.value);
      if (!Number.isNaN(parsed)) {
        this.setValue(parsed);
        this._callOnFinishChange();
      }
      this.updateDisplay();
    });
  }

  updateDisplay() {
    const val = Number(this.getValue()) || 0;
    const rad = this.unitMode === 'rad' ? val : (val * Math.PI) / 180;
    this.$needle.style.transform = `rotate(${rad}rad)`;
    if (document.activeElement !== this.$input) {
      this.$input.value = this._formatter ? this._formatter(val) : val;
    }
    return this;
  }
}

GUI.prototype.addAngle = function (object, property, options = {}) {
  return new AngleController(this, object, property, options);
};

// ============================================================================
// 17. NON-LINEAR SLIDER SCALING (.curve(k) & .logScale())
// ============================================================================
function attachNonLinearSlider(ctrl) {
  if (!ctrl.$slider || ctrl._nonLinearAttached) return;
  ctrl._nonLinearAttached = true;

  const pctToVal = (pct) => {
    const p = Math.max(0, Math.min(1, pct));
    let raw;
    if (ctrl._isLog && ctrl._min > 0) {
      raw = ctrl._min * Math.pow(ctrl._max / ctrl._min, p);
    } else {
      const mapped = ctrl._curveExp ? Math.pow(p, ctrl._curveExp) : p;
      raw = ctrl._min + mapped * (ctrl._max - ctrl._min);
    }
    if (ctrl._step) {
      raw = Math.round((raw - ctrl._min) / ctrl._step) * ctrl._step + ctrl._min;
      const dec = (ctrl._step.toString().split('.')[1] || '').length;
      raw = Number(raw.toFixed(dec));
    }
    return Math.max(ctrl._min, Math.min(ctrl._max, raw));
  };

  const valToPct = (val) => {
    const clamped = Math.max(ctrl._min, Math.min(ctrl._max, val));
    if (ctrl._isLog && ctrl._min > 0) {
      return Math.log(clamped / ctrl._min) / Math.log(ctrl._max / ctrl._min);
    }
    const lin = (clamped - ctrl._min) / (ctrl._max - ctrl._min || 1);
    return ctrl._curveExp ? Math.pow(Math.max(0, lin), 1 / ctrl._curveExp) : lin;
  };

  const interceptDrag = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    const updateFromClientX = (clientX) => {
      const rect = ctrl.$slider.getBoundingClientRect();
      const pct = (clientX - rect.left) / (rect.width || 1);
      ctrl.setValue(pctToVal(pct));
    };

    updateFromClientX(e.touches ? e.touches[0].clientX : e.clientX);

    const onMove = (me) => {
      updateFromClientX(me.touches ? me.touches[0].clientX : me.clientX);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      ctrl._callOnFinishChange();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  ctrl.$slider.addEventListener('mousedown', interceptDrag, true);
  ctrl.$slider.addEventListener('touchstart', interceptDrag, true);

  const origCtrlUpdate = ctrl.updateDisplay.bind(ctrl);
  ctrl.updateDisplay = function () {
    origCtrlUpdate();
    if (this.$fill) {
      const pct = valToPct(this.getValue());
      this.$fill.style.width = `${Math.max(0, Math.min(1, pct)) * 100}%`;
    }
    return this;
  };
  ctrl.updateDisplay();
}

Controller.prototype.curve = function (exponent = 2) {
  this._curveExp = exponent;
  this._isLog = false;
  if (this instanceof RangeController) {
    this.updateDisplay();
  } else {
    attachNonLinearSlider(this);
  }
  return this;
};

Controller.prototype.logScale = function () {
  if (this._min !== undefined && this._min <= 0) {
    console.warn('lil-gui .logScale() requires min > 0; falling back to .curve(3).');
    return this.curve(3);
  }
  this._isLog = true;
  if (this instanceof RangeController) {
    this.updateDisplay();
  } else {
    attachNonLinearSlider(this);
  }
  return this;
};

// ============================================================================
// 18. FLOATING TOOLTIPS (.tooltip('text'))
// ============================================================================
let sharedTooltipEl = null;

function getSharedTooltip() {
  if (!sharedTooltipEl && typeof document !== 'undefined') {
    ensureStyles();
    sharedTooltipEl = document.createElement('div');
    sharedTooltipEl.className = 'lil-ext-tooltip';
    document.body.appendChild(sharedTooltipEl);
  }
  return sharedTooltipEl;
}

Controller.prototype._syncTooltipMeta = function () {
  if (!this._tooltipSetup) return;
  const meta = [];
  if (this._isResettable) meta.push('Double-click to reset');
  if (this._hotkeyCombo) meta.push(`Hotkey: ${this._hotkeyCombo}`);
  this._tooltipMetaText = meta.join(' • ');
};

Controller.prototype.tooltip = function (text) {
  ensureStyles();
  this._tooltipText = text;
  if (this._tooltipSetup) {
    this._syncTooltipMeta();
    return this;
  }
  this._tooltipSetup = true;
  this._syncTooltipMeta();

  let hoverTimer = null;

  const showTip = () => {
    const tip = getSharedTooltip();
    if (!tip) return;
    tip.innerHTML = '';
    const main = document.createElement('div');
    main.textContent = this._tooltipText;
    tip.appendChild(main);

    if (this._tooltipMetaText) {
      const meta = document.createElement('div');
      meta.className = 'lil-ext-tooltip-meta';
      meta.textContent = this._tooltipMetaText;
      tip.appendChild(meta);
    }

    const rect = this.domElement.getBoundingClientRect();
    tip.classList.add('visible');
    const tipRect = tip.getBoundingClientRect();

    // Place to the left of the GUI by default; if docked on the left side, place to the right
    let left = rect.left - tipRect.width - 8;
    if (left < 8) {
      left = Math.min(window.innerWidth - tipRect.width - 8, rect.right + 8);
    }
    const top = Math.max(8, Math.min(window.innerHeight - tipRect.height - 8, rect.top));

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  };

  const hideTip = () => {
    clearTimeout(hoverTimer);
    getSharedTooltip()?.classList.remove('visible');
  };

  this.domElement.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(showTip, 180);
  });
  this.domElement.addEventListener('mouseleave', hideTip);
  this._addCleanup(hideTip);

  return this;
};

// ============================================================================
// 19. READOUT FORMATTER (.format(fn))
// ============================================================================
Controller.prototype.format = function (formatterFn) {
  this._formatter = formatterFn;
  if (this.$input) {
    this.$input.addEventListener('focus', () => {
      this._inputFocused = true;
      this.$input.value = this.getValue();
      this.$input.select();
    });
    this.$input.addEventListener('blur', () => {
      this._inputFocused = false;
      this.updateDisplay();
    });
  }
  this.updateDisplay();
  return this;
};

// ============================================================================
// 20. RANDOMIZATION & CONTROLLER LOCKING (.lock(), .randomizable(), gui.randomize())
// ============================================================================
Controller.prototype.lock = function (locked = true) {
  ensureStyles();
  this._isLockedForRandom = locked;
  if (!this.$lockBtn) {
    this.$lockBtn = document.createElement('span');
    this.$lockBtn.className = 'lil-lock-btn';
    this.$lockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._isLockedForRandom = !this._isLockedForRandom;
      this._updateLockIcon();
    });
    this.$name.appendChild(this.$lockBtn);
  }
  this._updateLockIcon = () => {
    this.$lockBtn.classList.toggle('locked', this._isLockedForRandom);
    this.$lockBtn.textContent = this._isLockedForRandom ? '🔒' : '🔓';
    this.$lockBtn.title = this._isLockedForRandom
      ? 'Locked (Excluded from randomize)'
      : 'Unlocked (Included in randomize)';
  };
  this._updateLockIcon();
  return this;
};

Controller.prototype.randomizable = function (enabled = true, customGenerator = null) {
  this._isLockedForRandom = !enabled;
  if (typeof customGenerator === 'function') {
    this._customRandomizer = customGenerator;
  }
  return this;
};

GUI.prototype.randomize = function ({ includeSubfolders = true } = {}) {
  const list = includeSubfolders ? this.controllersRecursive() : this.controllers;

  list.forEach((c) => {
    if (c._isDecorative || c._isLockedForRandom || c._disabled || c._hidden) return;

    if (c._customRandomizer) {
      c.setValue(c._customRandomizer(c));
      return;
    }

    if (c instanceof RangeController) {
      const r1 = c._min + Math.random() * (c._max - c._min);
      const r2 = c._min + Math.random() * (c._max - c._min);
      c.setValue([Math.min(r1, r2), Math.max(r1, r2)]);
    } else if (c instanceof VectorController) {
      const min = Number.isFinite(c._min) ? c._min : -10;
      const max = Number.isFinite(c._max) ? c._max : 10;
      c.setValue(c.keys.map(() => min + Math.random() * (max - min)));
    } else if (c instanceof SegmentedController && c.entries.length) {
      const pick = c.entries[Math.floor(Math.random() * c.entries.length)][1];
      c.setValue(pick);
    } else if (c instanceof MultiSelectController) {
      if (c.isBitmask) {
        let mask = 0;
        c.entries.forEach(([, v]) => {
          if (Math.random() > 0.5) mask |= v;
        });
        c.setValue(mask);
      } else {
        c.setValue(c.entries.filter(() => Math.random() > 0.5).map(([, v]) => v));
      }
    } else if (c instanceof AngleController) {
      const max = c.unitMode === 'rad' ? Math.PI * 2 : 360;
      c.setValue(Math.random() * max);
    } else if (c instanceof GradientController) {
      const randHex = () =>
        '#' +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0');
      c.setValue([
        { pos: 0, color: randHex() },
        { pos: 0.5, color: randHex() },
        { pos: 1, color: randHex() },
      ]);
    } else if (c.$Option || c.$select) {
      const values = c._values;
      if (Array.isArray(values) && values.length) {
        c.setValue(values[Math.floor(Math.random() * values.length)]);
      }
    } else if (typeof c.getValue() === 'boolean') {
      c.setValue(Math.random() >= 0.5);
    } else if (typeof c.getValue() === 'number') {
      const min = c._min ?? 0;
      const max = c._max ?? 100;
      let val = min + Math.random() * (max - min);
      if (c._step) {
        val = Math.round((val - min) / c._step) * c._step + min;
        const dec = (c._step.toString().split('.')[1] || '').length;
        val = Number(val.toFixed(dec));
      }
      c.setValue(val);
    } else if (typeof c.getValue() === 'string' && /^#[0-9a-f]{6}$/i.test(c.getValue())) {
      const hex =
        '#' +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0');
      c.setValue(hex);
    }
  });

  const root = this.root || this;
  root._recordHistorySnapshot?.();
  return this;
};

// ============================================================================
// 21. TOP TOOLBAR HELPER + SEARCH FILTER (INLINE & MODAL)
// ============================================================================
GUI.prototype._ensureToolbar = function () {
  ensureStyles();
  if (!this.$toolbar) {
    this.$toolbar = document.createElement('div');
    this.$toolbar.className = 'lil-toolbar';
    this.domElement.insertBefore(this.$toolbar, this.$children);
  }
  return this.$toolbar;
};

GUI.prototype.enableSearch = function (options = {}) {
  const mode = options.mode || 'inline'; // 'inline' | 'modal'
  const hotkey = options.hotkey ?? '/';
  const toolbar = this._ensureToolbar();

  const row = document.createElement('div');
  row.className = 'lil-toolbar-row';
  if (mode === 'modal') {
    row.classList.add('lil-search-modal');
    row.style.display = 'none';
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'lil-search-input';
  input.placeholder = options.placeholder || `Search controls (${hotkey})...`;

  const clearBtn = document.createElement('button');
  clearBtn.className = 'lil-icon-btn';
  clearBtn.textContent = '×';
  clearBtn.title = 'Clear search';
  clearBtn.style.display = 'none';

  row.appendChild(input);
  row.appendChild(clearBtn);
  toolbar.appendChild(row);

  const savedFolderStates = new WeakMap();

  const runFilter = () => {
    const q = input.value.trim().toLowerCase();
    clearBtn.style.display = q ? 'inline-flex' : 'none';

    const allCtrls = getAllControllers(this);
    const allFolders = this.foldersRecursive();

    if (!q) {
      allCtrls.forEach((c) => c.domElement.classList.remove('lil-search-hidden'));
      allFolders.forEach((f) => {
        f.domElement.classList.remove('lil-search-hidden');
        if (savedFolderStates.has(f)) {
          savedFolderStates.get(f) ? f.close() : f.open();
          savedFolderStates.delete(f);
        }
      });
      return;
    }

    allFolders.forEach((f) => {
      if (!savedFolderStates.has(f)) {
        savedFolderStates.set(f, f._closed);
      }
      f.domElement.classList.add('lil-search-hidden');
    });

    allCtrls.forEach((c) => {
      const label = (c._name || c.property || c.$text?.textContent || '').toLowerCase();
      const match = label.includes(q);
      c.domElement.classList.toggle('lil-search-hidden', !match);

      if (match) {
        let p = c.parent;
        while (p && p !== this) {
          p.domElement.classList.remove('lil-search-hidden');
          p.open();
          p = p.parent;
        }
      }
    });
  };

  input.addEventListener('input', runFilter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      runFilter();
      input.blur();
      if (mode === 'modal') row.style.display = 'none';
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    runFilter();
    if (mode === 'modal') row.style.display = 'none';
  });

  if (typeof window !== 'undefined' && hotkey) {
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.key === hotkey || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        if (mode === 'modal') {
          const isHidden = row.style.display === 'none';
          row.style.display = isHidden ? 'flex' : 'none';
          if (isHidden) input.focus();
        } else {
          input.focus();
          input.select();
        }
      }
    });
  }

  return this;
};

// ============================================================================
// 22. HEADLESS PERSISTENCE & PRESET MANAGER BAR
// ============================================================================
GUI.prototype.persist = function (storageKey = 'lil-gui-state') {
  if (typeof localStorage === 'undefined') return this;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) this.load(JSON.parse(raw));
  } catch (err) {
    console.warn('lil-gui .persist() load failed:', err);
  }

  const prevHook = this._onAnyChange;
  this._onAnyChange = (ctrl) => {
    if (prevHook) prevHook(ctrl);
    try {
      localStorage.setItem(storageKey, JSON.stringify(this.save()));
    } catch (err) {
      // Ignore quota errors
    }
  };
  return this;
};

GUI.prototype.enablePresets = function (storageKey = 'lil-gui-presets', defaultPresets = {}) {
  const toolbar = this._ensureToolbar();
  const initialSnapshot = this.save();

  const loadStoredPresets = () => {
    if (typeof localStorage === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  };

  const saveStoredPresets = (map) => {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch {
      // Ignore quota errors
    }
  };

  let userPresets = loadStoredPresets();

  const row = document.createElement('div');
  row.className = 'lil-toolbar-row';

  const select = document.createElement('select');
  select.className = 'lil-preset-select';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'lil-icon-btn';
  saveBtn.textContent = '+';
  saveBtn.title = 'Save new preset';

  const delBtn = document.createElement('button');
  delBtn.className = 'lil-icon-btn';
  delBtn.textContent = '🗑';
  delBtn.title = 'Delete selected user preset';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'lil-icon-btn';
  resetBtn.textContent = '↺';
  resetBtn.title = 'Reset GUI to defaults';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'lil-icon-btn';
  copyBtn.textContent = '📋';
  copyBtn.title = 'Copy current JSON state to clipboard';

  // Inline new-preset name row (avoids blocked window.prompt)
  const nameRow = document.createElement('div');
  nameRow.className = 'lil-toolbar-row';
  nameRow.style.display = 'none';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'lil-preset-input';
  nameInput.placeholder = 'Preset name...';

  const confirmSaveBtn = document.createElement('button');
  confirmSaveBtn.className = 'lil-icon-btn';
  confirmSaveBtn.textContent = '✓';

  const cancelSaveBtn = document.createElement('button');
  cancelSaveBtn.className = 'lil-icon-btn';
  cancelSaveBtn.textContent = '×';

  nameRow.appendChild(nameInput);
  nameRow.appendChild(confirmSaveBtn);
  nameRow.appendChild(cancelSaveBtn);

  const rebuildOptions = (selectedName = 'Default') => {
    select.innerHTML = '';
    const addOpt = (label, val) => {
      const o = document.createElement('option');
      o.value = val;
      o.textContent = label;
      select.appendChild(o);
    };

    addOpt('Preset: Default', '__default__');
    Object.keys(defaultPresets).forEach((k) => addOpt(`★ ${k}`, `builtin:${k}`));
    Object.keys(userPresets).forEach((k) => addOpt(`● ${k}`, `user:${k}`));

    select.value = selectedName;
    delBtn.disabled = !select.value.startsWith('user:');
  };

  rebuildOptions('__default__');

  select.addEventListener('change', () => {
    const val = select.value;
    delBtn.disabled = !val.startsWith('user:');
    if (val === '__default__') {
      this.load(initialSnapshot);
    } else if (val.startsWith('builtin:')) {
      const key = val.slice(8);
      if (defaultPresets[key]) this.load(defaultPresets[key]);
    } else if (val.startsWith('user:')) {
      const key = val.slice(5);
      if (userPresets[key]) this.load(userPresets[key]);
    }
    this._recordHistorySnapshot?.();
  });

  saveBtn.addEventListener('click', () => {
    nameRow.style.display = 'flex';
    nameInput.value = select.value.startsWith('user:') ? select.value.slice(5) : '';
    nameInput.focus();
  });

  const commitPresetSave = () => {
    const name = nameInput.value.trim();
    if (!name) return;
    userPresets[name] = this.save();
    saveStoredPresets(userPresets);
    nameRow.style.display = 'none';
    rebuildOptions(`user:${name}`);
  };

  confirmSaveBtn.addEventListener('click', commitPresetSave);
  cancelSaveBtn.addEventListener('click', () => {
    nameRow.style.display = 'none';
  });
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commitPresetSave();
    else if (e.key === 'Escape') nameRow.style.display = 'none';
  });

  delBtn.addEventListener('click', () => {
    if (!select.value.startsWith('user:')) return;
    const key = select.value.slice(5);
    delete userPresets[key];
    saveStoredPresets(userPresets);
    rebuildOptions('__default__');
  });

  resetBtn.addEventListener('click', () => {
    this.reset();
    select.value = '__default__';
    this._recordHistorySnapshot?.();
  });

  copyBtn.addEventListener('click', () => {
    const json = JSON.stringify(this.save(), null, 2);
    navigator.clipboard?.writeText(json);
    copyBtn.textContent = '✓';
    setTimeout(() => {
      copyBtn.textContent = '📋';
    }, 1000);
  });

  row.appendChild(select);
  row.appendChild(saveBtn);
  row.appendChild(delBtn);
  row.appendChild(resetBtn);
  row.appendChild(copyBtn);
  toolbar.appendChild(row);
  toolbar.appendChild(nameRow);

  this.$presetRow = row;
  return this;
};

// ============================================================================
// 23. UNDO / REDO HISTORY STACK (gui.enableHistory(maxSteps))
// ============================================================================
GUI.prototype.enableHistory = function (maxSteps = 50) {
  const toolbar = this._ensureToolbar();
  const stack = [JSON.stringify(this.save())];
  let cursor = 0;
  let isRestoring = false;

  const undoBtn = document.createElement('button');
  undoBtn.className = 'lil-icon-btn';
  undoBtn.textContent = '↶';
  undoBtn.title = 'Undo (Ctrl+Z)';
  undoBtn.disabled = true;

  const redoBtn = document.createElement('button');
  redoBtn.className = 'lil-icon-btn';
  redoBtn.textContent = '↷';
  redoBtn.title = 'Redo (Ctrl+Y / Ctrl+Shift+Z)';
  redoBtn.disabled = true;

  if (this.$presetRow) {
    this.$presetRow.appendChild(undoBtn);
    this.$presetRow.appendChild(redoBtn);
  } else {
    const row = document.createElement('div');
    row.className = 'lil-toolbar-row';
    const randBtn = document.createElement('button');
    randBtn.className = 'lil-icon-btn';
    randBtn.style.flex = '1';
    randBtn.textContent = '🎲 Randomize';
    randBtn.addEventListener('click', () => this.randomize());
    row.appendChild(undoBtn);
    row.appendChild(redoBtn);
    row.appendChild(randBtn);
    toolbar.appendChild(row);
  }

  const updateButtons = () => {
    undoBtn.disabled = cursor <= 0;
    redoBtn.disabled = cursor >= stack.length - 1;
  };

  this._recordHistorySnapshot = () => {
    if (isRestoring) return;
    const snap = JSON.stringify(this.save());
    if (snap === stack[cursor]) return;
    stack.splice(cursor + 1);
    stack.push(snap);
    if (stack.length > maxSteps) stack.shift();
    cursor = stack.length - 1;
    updateButtons();
  };

  const prevFinish = this._onAnyFinishChange;
  this._onAnyFinishChange = (ctrl) => {
    if (prevFinish) prevFinish(ctrl);
    this._recordHistorySnapshot();
  };

  this.undo = () => {
    if (cursor <= 0) return this;
    isRestoring = true;
    cursor--;
    this.load(JSON.parse(stack[cursor]));
    isRestoring = false;
    updateButtons();
    return this;
  };

  this.redo = () => {
    if (cursor >= stack.length - 1) return this;
    isRestoring = true;
    cursor++;
    this.load(JSON.parse(stack[cursor]));
    isRestoring = false;
    updateButtons();
    return this;
  };

  undoBtn.addEventListener('click', () => this.undo());
  redoBtn.addEventListener('click', () => this.redo());

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          e.shiftKey ? this.redo() : this.undo();
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          this.redo();
        }
      }
    });
  }

  return this;
};

// ============================================================================
// 24. TABBED FOLDER LAYOUT (gui.addTabs(['Scene', 'Post']))
// ============================================================================
GUI.prototype.addTabs = function (tabNames = []) {
  ensureStyles();
  const container = document.createElement('div');
  container.className = 'lil-tabs-container';

  const header = document.createElement('div');
  header.className = 'lil-tabs-header';
  container.appendChild(header);

  this.$children.appendChild(container);

  const tabs = [];
  const buttons = [];

  const selectTab = (indexOrName) => {
    const idx =
      typeof indexOrName === 'number'
        ? indexOrName
        : tabNames.indexOf(String(indexOrName));
    if (idx < 0 || idx >= tabs.length) return;
    tabs.forEach((folder, i) => {
      buttons[i].classList.toggle('active', i === idx);
      folder.domElement.style.display = i === idx ? '' : 'none';
    });
  };

  tabNames.forEach((name, idx) => {
    const btn = document.createElement('button');
    btn.className = 'lil-tab-btn';
    btn.textContent = name;
    btn.addEventListener('click', () => selectTab(idx));
    header.appendChild(btn);
    buttons.push(btn);

    const folder = this.addFolder(name);
    folder.domElement.classList.add('lil-tab-panel');
    container.appendChild(folder.domElement);
    tabs.push(folder);
  });

  selectTab(0);
  tabs.select = selectTab;
  return tabs;
};

// ============================================================================
// 25. SCREEN POSITIONING (LEFT MENU), DRAGGABLE & RESIZABLE ROOT WINDOW
// ============================================================================
const DOCK_CLASSES = [
  'lil-pos-left',
  'lil-pos-right',
  'lil-pos-bottom-left',
  'lil-pos-bottom-right',
];

GUI.prototype.position = function (dock = 'left', { x = 15, y = 0 } = {}) {
  ensureStyles();
  const root = this.root || this;
  root.domElement.classList.remove(...DOCK_CLASSES);

  // Clear any inline fixed coordinates set by prior dragging
  root.domElement.style.left = '';
  root.domElement.style.right = '';
  root.domElement.style.top = '';
  root.domElement.style.bottom = '';

  const normalized = dock.toLowerCase();
  if (normalized === 'left' || normalized === 'top-left') {
    root.domElement.classList.add('lil-pos-left');
    root._dockSide = 'left';
  } else if (normalized === 'bottom-left') {
    root.domElement.classList.add('lil-pos-bottom-left');
    root._dockSide = 'left';
  } else if (normalized === 'bottom-right') {
    root.domElement.classList.add('lil-pos-bottom-right');
    root._dockSide = 'right';
  } else {
    root.domElement.classList.add('lil-pos-right');
    root._dockSide = 'right';
  }

  root.domElement.style.setProperty('--gui-offset-x', typeof x === 'number' ? `${x}px` : x);
  root.domElement.style.setProperty('--gui-offset-y', typeof y === 'number' ? `${y}px` : y);
  return this;
};

GUI.prototype.left = function (offsetX = 15, offsetY = 0) {
  return this.position('left', { x: offsetX, y: offsetY });
};

GUI.prototype.right = function (offsetX = 15, offsetY = 0) {
  return this.position('right', { x: offsetX, y: offsetY });
};

GUI.createLeft = function (options = {}) {
  const { offsetX = 15, offsetY = 0, ...guiOptions } = options;
  const instance = new GUI(guiOptions);
  return instance.left(offsetX, offsetY);
};

GUI.prototype.draggable = function () {
  ensureStyles();
  if (!this.$title || this._isDraggable) return this;
  this._isDraggable = true;
  this.domElement.classList.add('lil-draggable');

  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let moved = false;

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    if (!moved) return;

    const rect = this.domElement.getBoundingClientRect();
    const nextLeft = Math.max(0, Math.min(window.innerWidth - rect.width, initialLeft + dx));
    const nextTop = Math.max(0, Math.min(window.innerHeight - 28, initialTop + dy));

    this.domElement.style.position = 'fixed';
    this.domElement.style.right = 'auto';
    this.domElement.style.bottom = 'auto';
    this.domElement.style.left = `${nextLeft}px`;
    this.domElement.style.top = `${nextTop}px`;
  };

  const onUp = () => {
    this.domElement.classList.remove('lil-dragging');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  this.$title.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const rect = this.domElement.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
    moved = false;
    this.domElement.classList.add('lil-dragging');

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });

  // Prevent collapsing the root GUI if the pointer interaction was a drag
  this.$title.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.stopImmediatePropagation();
        e.preventDefault();
        moved = false;
      }
    },
    true
  );

  return this;
};

GUI.prototype.resizable = function ({ minWidth = 200, maxWidth = 650 } = {}) {
  ensureStyles();
  if (this._isResizable) return this;
  this._isResizable = true;

  ['left', 'right'].forEach((side) => {
    const handle = document.createElement('div');
    handle.className = `lil-resize-handle ${side}`;
    this.domElement.appendChild(handle);

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startRect = this.domElement.getBoundingClientRect();
      const isLeftDocked =
        this._dockSide === 'left' || this.domElement.classList.contains('lil-pos-left');

      const onMove = (me) => {
        const dx = me.clientX - startX;
        const delta = side === 'left' ? -dx : dx;
        const nextWidth = Math.max(minWidth, Math.min(maxWidth, startRect.width + delta));
        this.domElement.style.setProperty('--width', `${nextWidth}px`);
        this.domElement.style.width = `${nextWidth}px`;

        if (side === 'left' && (this.domElement.style.left || isLeftDocked)) {
          this.domElement.style.right = 'auto';
          this.domElement.style.left = `${startRect.right - nextWidth}px`;
        } else if (side === 'right' && !this.domElement.style.left && !isLeftDocked) {
          this.domElement.style.right = `${window.innerWidth - (startRect.left + nextWidth)}px`;
        }
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  });

  return this;
};

// ============================================================================
// 26. PROCEDURAL CONFIG GENERATOR (gui.fromConfig() & GUI.fromConfig())
// ============================================================================
const DESCRIPTOR_META_KEYS = new Set([
  'value',
  'type',
  'min',
  'max',
  'step',
  'options',
  'label',
  'name',
  'tooltip',
  'unit',
  'hotkey',
  'resettable',
  'curve',
  'logScale',
  'format',
  'lock',
  'randomizable',
  'listen',
  'disabled',
  'hidden',
  'showIf',
  'enableIf',
  'syncWith',
  'onChange',
  'onFinishChange',
  'onDebounceChange',
  'onThrottleChange',
  'minProp',
  'maxProp',
  'dims',
  'keys',
  'labels',
  'bitmask',
  'presets',
  'accept',
  'as',
  'placeholder',
  'bufferSize',
  'interval',
  'buttons',
  'text',
  'closed',
  'children',
  'tabs',
]);

function humanizeKey(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function isHexColorString(val) {
  return typeof val === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val.trim());
}

function isVectorObject(val) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
  const keys = Object.keys(val);
  if (keys.length < 2 || keys.length > 4) return false;
  const vecKeys = ['x', 'y', 'z', 'w'];
  return keys.every((k) => vecKeys.includes(k) && typeof val[k] === 'number');
}

function isGradientArray(val) {
  return (
    Array.isArray(val) &&
    val.length >= 2 &&
    val.every((item) => item && typeof item === 'object' && 'pos' in item && 'color' in item)
  );
}

function isDescriptorObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  if (isVectorObject(obj)) return false;
  const keys = Object.keys(obj);
  if (!keys.length) return false;
  const hasValueOrType = 'value' in obj || 'type' in obj;
  return hasValueOrType && keys.every((k) => DESCRIPTOR_META_KEYS.has(k));
}

function inferNumberBounds(val) {
  if (val === 0) return { min: 0, max: 100, step: 1 };
  const abs = Math.abs(val);
  if (val >= 0 && val <= 1) return { min: 0, max: 1, step: 0.01 };
  const max = Math.pow(10, Math.ceil(Math.log10(abs * 2)));
  const min = val < 0 ? -max : 0;
  const step = Number.isInteger(val) ? 1 : Number((max / 200).toPrecision(1));
  return { min, max, step };
}

GUI.prototype.fromConfig = function (targetConfig, schemaOrOptions = null, maybeOptions = {}) {
  ensureStyles();
  if (!targetConfig || typeof targetConfig !== 'object') return this;

  // Distinguish between (target, schema, options) vs (target, options)
  const hasSeparateSchema =
    schemaOrOptions &&
    typeof schemaOrOptions === 'object' &&
    !('autoLabel' in schemaOrOptions || 'resettableByDefault' in schemaOrOptions || 'inferBounds' in schemaOrOptions);

  const schema = hasSeparateSchema ? schemaOrOptions : null;
  const globalOpts = hasSeparateSchema ? maybeOptions : schemaOrOptions || {};
  const autoLabel = globalOpts.autoLabel !== false;
  const inferBounds = globalOpts.inferBounds !== false;
  const resettableByDefault = Boolean(globalOpts.resettableByDefault);

  const root = this.root || this;
  if (!root.controllerMap) root.controllerMap = new Map();
  const pendingSyncs = [];

  const registerController = (key, path, ctrl) => {
    if (!ctrl) return;
    root.controllerMap.set(path, ctrl);
    if (!root.controllerMap.has(key)) {
      root.controllerMap.set(key, ctrl);
    }
  };

  const applyModifiers = (ctrl, spec, key, path, stateContainer) => {
    if (!ctrl) return;

    const displayLabel = spec.label ?? spec.name ?? (autoLabel ? humanizeKey(key) : null);
    if (displayLabel && !(ctrl instanceof NoteController) && !(ctrl instanceof SeparatorController)) {
      ctrl.name(displayLabel);
    }

    if (spec.unit) ctrl.unit(spec.unit);
    if (spec.curve !== undefined) ctrl.curve(spec.curve);
    if (spec.logScale) ctrl.logScale();
    if (spec.format) ctrl.format(spec.format);
    if (spec.resettable ?? resettableByDefault) ctrl.resettable?.();
    if (spec.hotkey) ctrl.hotkey(spec.hotkey);
    if (spec.tooltip) ctrl.tooltip(spec.tooltip);
    if (spec.lock !== undefined) ctrl.lock(spec.lock);
    if (spec.randomizable !== undefined) {
      if (typeof spec.randomizable === 'function') ctrl.randomizable(true, spec.randomizable);
      else ctrl.randomizable(Boolean(spec.randomizable));
    }
    if (spec.listen) ctrl.listen?.();
    if (spec.disabled) ctrl.disable?.();
    if (spec.hidden) ctrl.hide?.();

    if (typeof spec.showIf === 'function') {
      ctrl.showIf(() => spec.showIf(targetConfig, stateContainer));
    }
    if (typeof spec.enableIf === 'function') {
      ctrl.enableIf(() => spec.enableIf(targetConfig, stateContainer));
    }

    if (spec.syncWith) {
      pendingSyncs.push({ ctrl, syncSpec: spec.syncWith });
    }

    if (typeof spec.onChange === 'function') {
      ctrl._addInternalListener((v) => spec.onChange(v, ctrl, targetConfig));
    }
    if (typeof spec.onFinishChange === 'function') {
      if (!ctrl._internalFinishListeners) ctrl._internalFinishListeners = [];
      ctrl._internalFinishListeners.push((v) => spec.onFinishChange(v, ctrl, targetConfig));
    }
    if (spec.onDebounceChange) {
      const fn = typeof spec.onDebounceChange === 'function' ? spec.onDebounceChange : spec.onDebounceChange.fn;
      const delay = spec.onDebounceChange.delay ?? 300;
      if (fn) ctrl.onDebounceChange((v) => fn(v, ctrl, targetConfig), delay);
    }
    if (spec.onThrottleChange) {
      const fn = typeof spec.onThrottleChange === 'function' ? spec.onThrottleChange : spec.onThrottleChange.fn;
      const interval = spec.onThrottleChange.interval ?? 100;
      if (fn) ctrl.onThrottleChange((v) => fn(v, ctrl, targetConfig), interval);
    }
    if (typeof globalOpts.onChange === 'function') {
      ctrl._addInternalListener((v) => globalOpts.onChange(path, v, ctrl, targetConfig));
    }
  };

  const buildNode = (guiInstance, stateObj, schemaObj, prefix = '') => {
    const keys = schemaObj
      ? Object.keys(schemaObj)
      : Object.keys(stateObj);

    keys.forEach((key) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const rawStateVal = stateObj ? stateObj[key] : undefined;
      const rawSchemaVal = schemaObj ? schemaObj[key] : undefined;

      // Determine descriptor spec and bound target object/property
      let spec = {};
      let boundObj = stateObj;
      let boundProp = key;

      if (schemaObj && rawSchemaVal && typeof rawSchemaVal === 'object' && !Array.isArray(rawSchemaVal)) {
        spec = { ...rawSchemaVal };
        if (boundObj && !(key in boundObj) && 'value' in spec) {
          boundObj[key] = spec.value;
        }
      } else if (!schemaObj && isDescriptorObject(rawStateVal)) {
        spec = { ...rawStateVal };
        if (globalOpts.unwrapValues && 'value' in rawStateVal) {
          boundObj[key] = rawStateVal.value;
        } else {
          boundObj = rawStateVal;
          boundProp = 'value';
        }
      }

      const val = boundObj ? boundObj[boundProp] : spec.value;
      const type = (spec.type || '').toLowerCase();

      // 1. Decorative & Structural Types (Separator, Note, ButtonRow, Tabs, Folder)
      if (type === 'separator' || key.startsWith('---') || key.startsWith('_sep')) {
        const sep = guiInstance.addSeparator();
        applyModifiers(sep, spec, key, path, boundObj);
        return;
      }

      if (type === 'note') {
        const note = guiInstance.addNote(spec.text ?? val ?? '');
        applyModifiers(note, spec, key, path, boundObj);
        return;
      }

      if (type === 'buttonrow' && spec.buttons) {
        const row = guiInstance.addButtonRow(spec.buttons, spec.label ?? (autoLabel ? humanizeKey(key) : ''));
        applyModifiers(row, spec, key, path, boundObj);
        return;
      }

      if (type === 'fps') {
        const fpsCtrl = guiInstance.addFPS(spec);
        applyModifiers(fpsCtrl, spec, key, path, boundObj);
        registerController(key, path, fpsCtrl);
        return;
      }

      if (type === 'tabs' && spec.tabs && typeof spec.tabs === 'object') {
        const tabNames = Object.keys(spec.tabs);
        const tabFolders = guiInstance.addTabs(tabNames);
        tabNames.forEach((tName, idx) => {
          const subSchema = spec.tabs[tName];
          const subState = (boundObj && typeof boundObj[tName] === 'object' ? boundObj[tName] : boundObj) || {};
          buildNode(tabFolders[idx], subState, subSchema, `${path}.${tName}`);
        });
        return;
      }

      const isFolder =
        type === 'folder' ||
        (!type &&
          val &&
          typeof val === 'object' &&
          !Array.isArray(val) &&
          !isVectorObject(val) &&
          !isDescriptorObject(val));

      if (isFolder) {
        const folderTitle = spec.title ?? spec.label ?? spec.name ?? (autoLabel ? humanizeKey(key) : key);
        const folder = guiInstance.addFolder(folderTitle);
        if (spec.closed) folder.close();
        if (typeof spec.showIf === 'function') folder.showIf(() => spec.showIf(targetConfig, boundObj));
        if (typeof spec.enableIf === 'function') folder.enableIf(() => spec.enableIf(targetConfig, boundObj));

        const childState = val && typeof val === 'object' ? val : boundObj;
        const childSchema = spec.children || (schemaObj && !isDescriptorObject(rawSchemaVal) ? rawSchemaVal : null);
        buildNode(folder, childState, childSchema, path);
        return;
      }

      // 2. Data & Action Controllers
      let ctrl = null;

      if (type === 'range' || (spec.minProp && spec.maxProp)) {
        if (spec.minProp && spec.maxProp) {
          ctrl = guiInstance.addRange(
            boundObj,
            spec.minProp,
            spec.maxProp,
            spec.min ?? 0,
            spec.max ?? 100,
            spec.step ?? 1
          );
        } else if (Array.isArray(val) && val.length >= 2) {
          ctrl = guiInstance.addRange(boundObj[boundProp], 0, 1, spec.min ?? 0, spec.max ?? 100, spec.step ?? 1);
        }
      } else if (
        type === 'vector' ||
        type === 'vector2' ||
        type === 'vector3' ||
        type === 'vector4' ||
        (!type && isVectorObject(val))
      ) {
        const dims = type.endsWith('2') ? 2 : type.endsWith('3') ? 3 : type.endsWith('4') ? 4 : spec.dims;
        ctrl = guiInstance.addVector(boundObj, boundProp, { ...spec, dims });
      } else if (type === 'segmented' && spec.options) {
        ctrl = guiInstance.addSegmented(boundObj, boundProp, spec.options);
      } else if (type === 'multiselect' && spec.options) {
        ctrl = guiInstance.addMultiSelect(boundObj, boundProp, spec.options, { bitmask: spec.bitmask });
      } else if (type === 'angle') {
        ctrl = guiInstance.addAngle(boundObj, boundProp, spec);
      } else if (type === 'gradient' || (!type && isGradientArray(val))) {
        ctrl = guiInstance.addGradient(boundObj, boundProp, spec);
      } else if (type === 'monitor') {
        ctrl = guiInstance.addMonitor(boundObj, boundProp, spec);
      } else if (type === 'file') {
        ctrl = guiInstance.addFile(boundObj, boundProp, spec);
      } else if (type === 'image') {
        ctrl = guiInstance.addImage(boundObj, boundProp, spec);
      } else if (type === 'color' || (!type && isHexColorString(val))) {
        ctrl = guiInstance.addColor(boundObj, boundProp);
      } else if (spec.options && !type) {
        ctrl = guiInstance.add(boundObj, boundProp, spec.options);
      } else if (typeof val === 'number') {
        let { min, max, step } = spec;
        if (min === undefined && max === undefined && inferBounds) {
          const inferred = inferNumberBounds(val);
          min = inferred.min;
          max = inferred.max;
          step = step ?? inferred.step;
        }
        ctrl = guiInstance.add(boundObj, boundProp, min, max, step);
      } else if (typeof val === 'boolean' || typeof val === 'string' || typeof val === 'function') {
        ctrl = guiInstance.add(boundObj, boundProp);
      }

      if (ctrl) {
        applyModifiers(ctrl, spec, key, path, boundObj);
        registerController(key, path, ctrl);
      }
    });
  };

  buildNode(this, targetConfig, schema, '');

  // Resolve cross-controller .syncWith() references by key or path
  pendingSyncs.forEach(({ ctrl, syncSpec }) => {
    const isStringOrArr = typeof syncSpec === 'string' || Array.isArray(syncSpec);
    const targetNames = isStringOrArr
      ? Array.isArray(syncSpec)
        ? syncSpec
        : [syncSpec]
      : Array.isArray(syncSpec.targets || syncSpec.target)
      ? syncSpec.targets || syncSpec.target
      : [syncSpec.targets || syncSpec.target];

    const resolvedTargets = targetNames
      .map((t) => (t instanceof Controller ? t : root.controllerMap.get(t)))
      .filter(Boolean);

    if (resolvedTargets.length) {
      const syncOpts = isStringOrArr ? {} : syncSpec;
      ctrl.syncWith(resolvedTargets, syncOpts);
    }
  });

  return this;
};

GUI.prototype.getController = function (keyOrPath) {
  const root = this.root || this;
  return root.controllerMap?.get(keyOrPath) || null;
};

GUI.fromConfig = function (targetConfig, schemaOrOptions = null, guiOptions = {}) {
  const {
    left,
    position,
    offsetX = 15,
    offsetY = 0,
    draggable,
    resizable,
    search,
    presets,
    defaultPresets,
    history,
    persist,
    ...nativeGuiOpts
  } = guiOptions;

  const gui = new GUI(nativeGuiOpts);

  if (left) gui.left(offsetX, offsetY);
  else if (position) gui.position(position, { x: offsetX, y: offsetY });

  if (draggable) gui.draggable();
  if (resizable) gui.resizable(typeof resizable === 'object' ? resizable : {});
  if (search) gui.enableSearch(typeof search === 'object' ? search : {});

  gui.fromConfig(targetConfig, schemaOrOptions, guiOptions);

  if (presets) {
    gui.enablePresets(typeof presets === 'string' ? presets : 'lil-gui-presets', defaultPresets || {});
  }
  if (history) {
    gui.enableHistory(typeof history === 'number' ? history : 50);
  }
  if (persist) {
    gui.persist(typeof persist === 'string' ? persist : 'lil-gui-state');
  }

  return gui;
};

export {
  GUI,
  Controller,
  RangeController,
  VectorController,
  MonitorController,
  SegmentedController,
  MultiSelectController,
  FileController,
  GradientController,
  AngleController,
  NoteController,
  ButtonRowController,
  SeparatorController,
};
export default GUI;