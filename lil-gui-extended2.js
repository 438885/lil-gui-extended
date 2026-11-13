// lil-gui-extended

import GUI from "https://esm.sh/lil-gui@0.21.0";

//#region 1: Styles & CSS Injection

const STYLE_ID = "lil-gui-extended-styles";
const injectedRoots = new WeakSet();

const EXTENDED_CSS = /* css */ `
/* Theme variables strictly scoped to lil-gui */
.lil-gui {
    --font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; 
    --font-size: 11px;
    --input-font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
    --input-font-size: 11px;
    --widget-border-radius: 2px; 
    --background-color: rgba(12, 12, 14, 0.92); 
    --text-color: #d1d5db;
    --title-background-color: #18181b; 
    --widget-color: #27272a; 
    --hover-color: #3f3f46;
    --focus-color: #52525b; 
    --number-color: #60a5fa; 
    --string-color: #34d399;
}

/* Scrollbars and Root Panels */
.lil-gui.root { 
    position: fixed;
    top: 6px; 
    z-index: 10; 
    max-height: calc(100vh - 12px); 
    overflow-y: auto; 
    border: 1px solid rgba(255, 255, 255, 0.12); 
    box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.85); 
    backdrop-filter: blur(8px);
}

.lil-gui.root::-webkit-scrollbar {
    width: 4px;
}
.lil-gui.root::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
}
.lil-gui.root::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 2px;
}

.gui-right { 
    right: 6px !important; 
    left: auto !important; 
}

.gui-left { 
    left: 6px !important; 
    right: auto !important; 
}

/* Floating Tooltip */
.gui-tooltip {
    position: fixed;
    z-index: 20;
    width: 250px;
    padding: 8px 10px;
    background: rgba(12, 12, 14, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-left: 2px solid #60a5fa;
    border-radius: 3px;
    box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(8px);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 11px;
    line-height: 1.45;
    color: #d1d5db;
    pointer-events: none;
    opacity: 0;
    transform: translateX(4px);
    transition: opacity 0.12s ease, transform 0.12s ease;
}

.gui-tooltip.visible {
    opacity: 1;
    transform: translateX(0);
}

.gui-tooltip-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.gui-tooltip-title {
    font-weight: 600;
    color: #f3f4f6;
}

.gui-tooltip-prop {
    font-size: 10px;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.12);
    padding: 1px 4px;
    border-radius: 2px;
}

.gui-tooltip-desc {
    color: #9ca3af;
}

.gui-tooltip-meta {
    margin-top: 5px;
    padding-top: 4px;
    border-top: 1px dashed rgba(255, 255, 255, 0.08);
    font-size: 10px;
    color: #34d399;
    white-space: pre-line;
}

/* Dirty-State & Quick Reset Indicators */
.lil-gui .controller > .name {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 4px;
    user-select: none;
}

.lil-gui .controller.is-modified > .name {
    color: #93c5fd;
    font-weight: 600;
}

.lil-gui .controller.is-modified > .name::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-right: 5px;
    border-radius: 50%;
    background: #60a5fa;
    box-shadow: 0 0 6px #60a5fa;
    flex-shrink: 0;
}

.gui-reset-btn,
.gui-folder-reset-btn {
    all: unset;
    cursor: pointer;
    opacity: 0;
    color: #9ca3af;
    font-size: 11px;
    line-height: 1;
    padding: 1px 3px;
    border-radius: 2px;
    transition: opacity 0.12s ease, color 0.12s ease, background 0.12s ease;
}

.lil-gui .controller.is-modified:hover .gui-reset-btn,
.lil-gui .controller.is-modified:focus-within .gui-reset-btn,
.lil-gui.has-modified > .title:hover .gui-folder-reset-btn,
.lil-gui.has-modified > .title:focus-visible .gui-folder-reset-btn {
    opacity: 0.85;
}

.gui-reset-btn:hover,
.gui-folder-reset-btn:hover {
    opacity: 1 !important;
    color: #f3f4f6;
    background: rgba(255, 255, 255, 0.12);
}

.lil-gui > .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.lil-gui.is-folder-disabled > .children {
    opacity: 0.45;
    pointer-events: none;
}

/* Optional Top Search & Utility Bar */
.gui-top-bar {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 5px 6px;
    background: rgba(18, 18, 21, 0.96);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
}

.gui-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.gui-search-input {
    width: 100%;
    height: 20px;
    padding: 0 18px 0 6px;
    background: var(--widget-color);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--widget-border-radius);
    font-family: var(--font-family);
    font-size: 10px;
    outline: none;
    transition: border-color 0.12s ease, background 0.12s ease;
}

.gui-search-input::placeholder {
    color: #6b7280;
}

.gui-search-input:focus {
    border-color: #60a5fa;
    background: rgba(39, 39, 42, 0.9);
}

.gui-search-clear {
    all: unset;
    position: absolute;
    right: 4px;
    cursor: pointer;
    color: #9ca3af;
    font-size: 10px;
    line-height: 1;
    padding: 2px;
}

.gui-search-clear:hover {
    color: #fff;
}

.gui-top-bar-btn {
    height: 20px;
    min-width: 20px;
    padding: 0 5px;
    background: var(--widget-color);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--widget-border-radius);
    font-family: var(--font-family);
    font-size: 10px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.1s ease, color 0.1s ease;
}

.gui-top-bar-btn:hover {
    background: var(--hover-color);
    color: #fff;
}

.gui-search-empty {
    padding: 8px 10px;
    color: #6b7280;
    font-size: 10px;
    text-align: center;
    font-style: italic;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.is-search-hidden {
    display: none !important;
}

/* Preset Manager Bar */
.gui-preset-bar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 5px 6px;
    background: rgba(24, 24, 27, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.gui-preset-row {
    display: flex;
    align-items: center;
    gap: 3px;
    width: 100%;
}

.gui-preset-select,
.gui-preset-input {
    flex: 1;
    min-width: 0;
    height: 20px;
    padding: 0 5px;
    background: var(--widget-color);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--widget-border-radius);
    font-family: var(--font-family);
    font-size: 10px;
    outline: none;
}

.gui-preset-select:focus,
.gui-preset-input:focus {
    border-color: #60a5fa;
}

.gui-preset-btn {
    height: 20px;
    padding: 0 6px;
    background: var(--widget-color);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--widget-border-radius);
    font-family: var(--font-family);
    font-size: 10px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.1s ease, color 0.1s ease;
}

.gui-preset-btn:hover:not(:disabled) {
    background: var(--hover-color);
    color: #fff;
}

.gui-preset-btn:disabled {
    opacity: 0.35;
    cursor: default;
}

.gui-preset-status {
    font-size: 10px;
    color: #34d399;
    text-align: right;
    padding: 1px 2px;
    display: none;
}

.gui-preset-status.visible {
    display: block;
}

/* Compact Button Row & Segmented Pills */
.lil-gui .controller.gui-button-row-ctrl.full-width > .name {
    display: none;
}

.lil-gui .controller.gui-button-row-ctrl.full-width > .widget {
    width: 100%;
}

.gui-button-row,
.gui-segmented {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 3px;
    width: 100%;
}

.gui-inline-btn,
.gui-segmented-btn {
    height: var(--widget-height, 20px);
    padding: 0 4px;
    background: var(--widget-color);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: var(--widget-border-radius);
    font-family: var(--font-family);
    font-size: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background 0.1s ease, color 0.1s ease, border-color 0.1s ease;
}

.gui-inline-btn:hover,
.gui-segmented-btn:hover {
    background: var(--hover-color);
    color: #fff;
}

.gui-segmented-btn.active {
    background: rgba(96, 165, 250, 0.22);
    color: #93c5fd;
    border-color: rgba(96, 165, 250, 0.65);
    font-weight: 600;
}

/* Dual-Thumb Range Slider */
.gui-range-widget {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    height: var(--widget-height, 20px);
}

.gui-range-input {
    width: 38px;
    height: 100%;
    padding: 0 3px;
    background: var(--widget-color);
    color: var(--number-color);
    border: none;
    border-radius: var(--widget-border-radius);
    font-family: var(--input-font-family);
    font-size: 10px;
    text-align: center;
    outline: none;
    flex-shrink: 0;
}

.gui-range-input:focus {
    background: var(--focus-color);
    color: #fff;
}

.gui-range-track {
    position: relative;
    flex: 1;
    height: 100%;
    background: var(--widget-color);
    border-radius: var(--widget-border-radius);
    cursor: pointer;
    touch-action: none;
    user-select: none;
}

.gui-range-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    background: rgba(96, 165, 250, 0.35);
    border-top: 1px solid rgba(96, 165, 250, 0.7);
    border-bottom: 1px solid rgba(96, 165, 250, 0.7);
    cursor: grab;
}

.gui-range-fill:active {
    cursor: grabbing;
    background: rgba(96, 165, 250, 0.5);
}

.gui-range-thumb {
    position: absolute;
    top: 1px;
    bottom: 1px;
    width: 7px;
    transform: translateX(-50%);
    background: #60a5fa;
    border: 1px solid #eff6ff;
    border-radius: 1.5px;
    cursor: ew-resize;
    z-index: 2;
    outline: none;
}

.gui-range-thumb:hover,
.gui-range-thumb:focus-visible {
    background: #93c5fd;
    box-shadow: 0 0 6px rgba(96, 165, 250, 0.9);
}
`;

/**
 * Injects the theme and widget CSS into the target root once, appending customCSS if provided.
 */
export function injectGUIStyles(customCSS = "", targetRoot = typeof document !== "undefined" ? document.head : null) {
  if (!targetRoot) return;
  let style =
    targetRoot === document.head
      ? document.getElementById(STYLE_ID)
      : targetRoot.querySelector(`#${STYLE_ID}`);

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = EXTENDED_CSS;
    targetRoot.appendChild(style);
    injectedRoots.add(targetRoot);
  }

  if (customCSS && !style.textContent.includes(customCSS)) {
    style.textContent += "\n" + customCSS;
  }
}

//#endregion

//#region 2: Tooltip & Accessibility Manager (1.1, 6.3)

let tooltipUidCounter = 0;

/**
 * Creates a viewport-aware, WeakMap-backed delegated tooltip manager with keyboard & touch support.
 */
export function createTooltipManager(gui, options = {}) {
  const rootGui = gui.root || gui;
  if (rootGui._tooltipManager) {
    rootGui._tooltipManager.setDictionaries({
      controls: options.controlTooltips,
      folders: options.folderTooltips,
      defaults: options.initialValues
    });
    return rootGui._tooltipManager;
  }

  const {
    controlTooltips = {},
    folderTooltips = {},
    initialValues = {}
  } = options;

  const targetConfigMap = new WeakMap();
  const tooltipId = `gui-tooltip-${++tooltipUidCounter}`;

  const tooltipEl = document.createElement("div");
  tooltipEl.id = tooltipId;
  tooltipEl.className = "gui-tooltip";
  tooltipEl.setAttribute("role", "tooltip");
  tooltipEl.setAttribute("aria-hidden", "true");
  tooltipEl.innerHTML = `
    <div class="gui-tooltip-header">
      <span class="gui-tooltip-title"></span>
      <span class="gui-tooltip-prop"></span>
    </div>
    <div class="gui-tooltip-desc"></div>
    <div class="gui-tooltip-meta" style="display: none;"></div>
  `;
  document.body.appendChild(tooltipEl);

  const titleEl = tooltipEl.querySelector(".gui-tooltip-title");
  const propEl = tooltipEl.querySelector(".gui-tooltip-prop");
  const descEl = tooltipEl.querySelector(".gui-tooltip-desc");
  const metaEl = tooltipEl.querySelector(".gui-tooltip-meta");

  let activeTarget = null;

  const formatMetaVal = (val) => {
    if (Array.isArray(val)) return `[${val.join(", ")}]`;
    if (val && typeof val === "object") return JSON.stringify(val);
    if (typeof val === "number") return Number(val.toFixed(4));
    return String(val);
  };

  const inferControllerMeta = (ctrl, explicitParams = []) => {
    const prop = ctrl.property;
    const obj = ctrl.object;
    const parts = [];

    const min = typeof explicitParams[0] === "number" ? explicitParams[0] : ctrl._min;
    const max = typeof explicitParams[1] === "number" ? explicitParams[1] : ctrl._max;
    const step = explicitParams[2] !== undefined ? explicitParams[2] : ctrl._step;

    if (typeof min === "number" && typeof max === "number") {
      const stepInfo = step !== undefined ? ` · step ${step}` : "";
      parts.push(`Range: [${min}, ${max}]${stepInfo}`);
    } else if (obj && typeof obj[prop] === "function") {
      parts.push("Action trigger");
    }

    const defVal =
      initialValues && prop in initialValues
        ? initialValues[prop]
        : ctrl._defaultValue !== undefined
          ? ctrl._defaultValue
          : ctrl.initialValue;

    if (defVal !== undefined && !(obj && typeof obj[prop] === "function")) {
      if (ctrl._isModified && typeof ctrl.getValue === "function") {
        parts.push(`Current: ${formatMetaVal(ctrl.getValue())} · Default: ${formatMetaVal(defVal)}`);
      } else {
        parts.push(`Default: ${formatMetaVal(defVal)}`);
      }
    }

    return parts.length > 0 ? parts.join("\n") : null;
  };

  const updatePosition = (targetEl) => {
    if (!targetEl || !targetEl.isConnected || targetEl.offsetParent === null) {
      hide();
      return;
    }
    const guiRect = rootGui.domElement.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const ttRect = tooltipEl.getBoundingClientRect();

    let left = guiRect.left - ttRect.width - 8;
    if (left < 8) {
      left = Math.min(window.innerWidth - ttRect.width - 8, guiRect.right + 8);
    }

    let top = targetRect.top + (targetRect.height - ttRect.height) * 0.5;
    top = Math.max(6, Math.min(window.innerHeight - ttRect.height - 6, top));

    tooltipEl.style.left = `${Math.round(left)}px`;
    tooltipEl.style.top = `${Math.round(top)}px`;
  };

  const resolvePayload = (entry) => {
    if (!entry) return null;
    const { type, item, config } = entry;

    if (type === "controller") {
      const prop = item.property;
      const description = config.description || controlTooltips[prop];
      if (!description) return null;

      const title = config.label || item._name || prop;
      const badge = config.badge !== undefined ? config.badge : prop;
      const meta =
        config.meta !== undefined
          ? config.meta
          : inferControllerMeta(item, config.params || []);

      return { title, badge, description, meta };
    }

    if (type === "folder") {
      const folderName = config.title || item._title;
      const description = config.description || folderTooltips[folderName];
      if (!description) return null;

      const badge = config.badge !== undefined ? config.badge : "SECTION";
      const meta =
        config.meta !== undefined
          ? config.meta
          : "Click to expand / collapse";

      return { title: item._title || folderName, badge, description, meta };
    }

    return null;
  };

  const showForElement = (targetEl) => {
    const entry = targetConfigMap.get(targetEl);
    const payload = resolvePayload(entry);
    if (!payload) return;

    if (activeTarget && activeTarget !== targetEl) {
      activeTarget.removeAttribute("aria-describedby");
    }

    activeTarget = targetEl;
    targetEl.setAttribute("aria-describedby", tooltipId);

    titleEl.textContent = payload.title;
    propEl.textContent = payload.badge || "";
    propEl.style.display = payload.badge ? "inline-block" : "none";
    descEl.textContent = payload.description;

    if (payload.meta) {
      metaEl.textContent = payload.meta;
      metaEl.style.display = "block";
    } else {
      metaEl.style.display = "none";
    }

    tooltipEl.classList.add("visible");
    tooltipEl.setAttribute("aria-hidden", "false");
    updatePosition(targetEl);
  };

  const hide = (targetEl = null) => {
    if (!targetEl || activeTarget === targetEl) {
      if (activeTarget) {
        activeTarget.removeAttribute("aria-describedby");
      }
      activeTarget = null;
      tooltipEl.classList.remove("visible");
      tooltipEl.setAttribute("aria-hidden", "true");
    }
  };

  const findConfiguredTarget = (node) => {
    let curr = node instanceof Element ? node : null;
    while (curr && curr !== rootGui.domElement) {
      if (targetConfigMap.has(curr)) return curr;
      curr = curr.parentElement;
    }
    return null;
  };

  const onPointerOver = (e) => {
    const target = findConfiguredTarget(e.target);
    if (target) showForElement(target);
  };

  const onPointerOut = (e) => {
    if (!activeTarget) return;
    const nextTarget = findConfiguredTarget(e.relatedTarget);
    if (nextTarget !== activeTarget) {
      hide(activeTarget);
    }
  };

  const onFocusIn = (e) => {
    const target = findConfiguredTarget(e.target);
    if (target) showForElement(target);
  };

  const onFocusOut = (e) => {
    if (!activeTarget) return;
    const nextTarget = findConfiguredTarget(e.relatedTarget);
    if (nextTarget !== activeTarget) {
      hide(activeTarget);
    }
  };

  const onDocumentPointerDown = (e) => {
    if (activeTarget && !rootGui.domElement.contains(e.target)) {
      hide();
    }
  };

  const onScrollOrResize = () => {
    if (activeTarget) updatePosition(activeTarget);
  };

  rootGui.domElement.addEventListener("pointerover", onPointerOver);
  rootGui.domElement.addEventListener("pointerout", onPointerOut);
  rootGui.domElement.addEventListener("focusin", onFocusIn);
  rootGui.domElement.addEventListener("focusout", onFocusOut);
  rootGui.domElement.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  document.addEventListener("pointerdown", onDocumentPointerDown, { passive: true });

  const manager = {
    controlTooltips,
    folderTooltips,
    initialValues,

    setDictionaries({ controls, folders, defaults } = {}) {
      if (controls) Object.assign(controlTooltips, controls);
      if (folders) Object.assign(folderTooltips, folders);
      if (defaults) Object.assign(initialValues, defaults);
    },

    attachController(ctrl, customOptions = {}) {
      if (!ctrl || !ctrl.domElement) return ctrl;
      const el = ctrl.domElement;
      const normalized =
        typeof customOptions === "string"
          ? { description: customOptions }
          : { ...customOptions };

      const existing = targetConfigMap.get(el);
      const mergedConfig = existing ? { ...existing.config, ...normalized } : normalized;
      targetConfigMap.set(el, { type: "controller", item: ctrl, config: mergedConfig });
      return ctrl;
    },

    attachFolder(folder, customOptions = {}) {
      if (!folder || !folder.$title) return folder;
      const el = folder.$title;
      const normalized =
        typeof customOptions === "string"
          ? { description: customOptions }
          : { ...customOptions };

      const existing = targetConfigMap.get(el);
      const mergedConfig = existing ? { ...existing.config, ...normalized } : normalized;
      targetConfigMap.set(el, { type: "folder", item: folder, config: mergedConfig });
      return folder;
    },

    refreshActive() {
      if (activeTarget) showForElement(activeTarget);
    },

    hide,

    destroy() {
      rootGui.domElement.removeEventListener("pointerover", onPointerOver);
      rootGui.domElement.removeEventListener("pointerout", onPointerOut);
      rootGui.domElement.removeEventListener("focusin", onFocusIn);
      rootGui.domElement.removeEventListener("focusout", onFocusOut);
      rootGui.domElement.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("pointerdown", onDocumentPointerDown);
      tooltipEl.remove();
      delete rootGui._tooltipManager;
    }
  };

  rootGui._tooltipManager = manager;
  return manager;
}

//#endregion

//#region 3: Telemetry & Throttled Metrics Engine (1.2)

/**
 * Formats a metric value according to precision, unit, or custom formatter without mutating source data.
 */
function formatMetricValue(raw, { precision, unit = "", format } = {}) {
  if (typeof format === "function") {
    return String(format(raw));
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    const numStr = precision !== undefined ? raw.toFixed(precision) : String(raw);
    return unit ? `${numStr} ${unit}` : numStr;
  }
  if (raw === undefined || raw === null) return "";
  return unit ? `${raw} ${unit}` : String(raw);
}

/**
 * Registers a controller on the root GUI's shared throttled requestAnimationFrame loop.
 */
function registerMetricTicker(rootGui, ctrl, options = {}) {
  const hz = options.hz ?? 15;
  const intervalMs = hz > 0 ? 1000 / hz : 0;

  if (!rootGui._metricRegistry) {
    const entries = new Map();
    let rafId = null;

    const tick = (now) => {
      for (const [c, item] of entries.entries()) {
        if (!c.domElement || !c.domElement.isConnected) {
          entries.delete(c);
          continue;
        }
        if (now - item.lastTime >= item.intervalMs) {
          item.lastTime = now;
          item.update();
        }
      }
      if (entries.size > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    rootGui._metricRegistry = {
      add(c, entry) {
        entries.set(c, entry);
        if (rafId === null) {
          rafId = requestAnimationFrame(tick);
        }
      },
      remove(c) {
        entries.delete(c);
      },
      destroy() {
        if (rafId !== null) cancelAnimationFrame(rafId);
        entries.clear();
        rafId = null;
      }
    };
  }

  const sourceObj = ctrl._metricSourceObject || ctrl.object;
  const sourceProp = ctrl._metricSourceProperty || ctrl.property;

  const renderMetric = () => {
    const raw = sourceObj[sourceProp];
    const formatted = formatMetricValue(raw, options);
    if (ctrl.$input) {
      ctrl.$input.value = formatted;
    } else if (ctrl._isProxyMetric) {
      ctrl.object[ctrl.property] = formatted;
      ctrl._origUpdateDisplay?.();
    } else {
      ctrl._origUpdateDisplay?.();
    }
  };

  if (!ctrl._origUpdateDisplay) {
    ctrl._origUpdateDisplay = ctrl.updateDisplay.bind(ctrl);
  }
  ctrl.updateDisplay = function () {
    renderMetric();
    return this;
  };

  ctrl.disable();
  renderMetric();

  rootGui._metricRegistry.add(ctrl, {
    intervalMs,
    lastTime: 0,
    update: renderMetric
  });

  return ctrl;
}

//#endregion

//#region 4: Reactivity, Dirty State & Quick Reset (2.1, 4.2)

function cloneValue(val) {
  if (Array.isArray(val)) return [...val];
  if (val && typeof val === "object") return { ...val };
  return val;
}

function isValueEqual(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) <= 1e-6;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => isValueEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((k) => isValueEqual(a[k], b[k]));
  }
  return a === b;
}

/**
 * Evaluates a conditional predicate function or key-value map against a target state object.
 */
function evaluatePredicate(predicate, targetObj, rootGui) {
  if (typeof predicate === "function") {
    return Boolean(predicate(targetObj, rootGui));
  }
  if (predicate && typeof predicate === "object" && targetObj) {
    return Object.entries(predicate).every(([key, expected]) => {
      const actual = targetObj[key];
      if (Array.isArray(expected)) {
        return expected.some((item) => isValueEqual(actual, item));
      }
      if (typeof expected === "function") {
        return Boolean(expected(actual, targetObj));
      }
      return isValueEqual(actual, expected);
    });
  }
  return true;
}

function registerReactiveRule(rootGui, ruleFn) {
  if (!rootGui._reactiveRules) {
    rootGui._reactiveRules = [];
  }
  rootGui._reactiveRules.push(ruleFn);
  ruleFn();
}

function evaluateAllReactiveRules(rootGui) {
  if (!rootGui || !rootGui._reactiveRules) return;
  for (const rule of rootGui._reactiveRules) {
    rule();
  }
}

function updateControllerDirtyState(ctrl, rootGui) {
  if (!ctrl || ctrl._isMetric || typeof ctrl.getValue !== "function") return false;
  if (ctrl.object && typeof ctrl.object[ctrl.property] === "function") return false;

  const dictDefaults = rootGui?._tooltipManager?.initialValues;
  const defVal =
    dictDefaults && ctrl.property in dictDefaults
      ? dictDefaults[ctrl.property]
      : ctrl._defaultValue;

  if (defVal === undefined) return false;

  const modified = !isValueEqual(ctrl.getValue(), defVal);
  ctrl._isModified = modified;
  if (ctrl.domElement) {
    ctrl.domElement.classList.toggle("is-modified", modified);
  }
  return modified;
}

function updateFolderDirtyStates(rootGui) {
  if (!rootGui) return;
  const allControllers = rootGui.controllersRecursive ? rootGui.controllersRecursive() : [];
  for (const c of allControllers) {
    updateControllerDirtyState(c, rootGui);
  }

  const folders = rootGui.foldersRecursive ? rootGui.foldersRecursive() : [];
  for (let i = folders.length - 1; i >= 0; i--) {
    const folder = folders[i];
    const hasMod = folder.controllersRecursive().some((c) => c._isModified);
    folder.domElement.classList.toggle("has-modified", hasMod);
  }

  rootGui._tooltipManager?.refreshActive();
}

/**
 * Enhances a controller instance with tooltips, metrics, dirty-state reset, and conditional rules.
 */
function enhanceController(ctrl, rootGui) {
  if (!ctrl || ctrl._isExtended) return ctrl;
  Object.defineProperty(ctrl, "_isExtended", { value: true });

  const isAction = ctrl.object && typeof ctrl.object[ctrl.property] === "function";
  if (!isAction && typeof ctrl.getValue === "function") {
    ctrl._defaultValue = cloneValue(ctrl.initialValue !== undefined ? ctrl.initialValue : ctrl.getValue());
  }

  // Inject quick-reset button and bind Alt+Click / Double-Click on label
  if (!isAction && ctrl.$name && !ctrl.$name.querySelector(".gui-reset-btn")) {
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "gui-reset-btn";
    resetBtn.textContent = "↺";
    resetBtn.title = "Reset to default (Alt+Click or Double-Click label)";
    resetBtn.setAttribute("aria-label", "Reset parameter to default");
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      ctrl.resetToDefault();
    });
    ctrl.$name.appendChild(resetBtn);

    ctrl.$name.addEventListener("click", (e) => {
      if (e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        ctrl.resetToDefault();
      }
    });

    ctrl.$name.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.stopPropagation();
      ctrl.resetToDefault();
    });
  }

  // Hide active tooltip if controller is hidden dynamically
  if (typeof ctrl.hide === "function") {
    const origHide = ctrl.hide.bind(ctrl);
    ctrl.hide = function () {
      rootGui._tooltipManager?.hide(this.domElement);
      return origHide();
    };
  }

  ctrl.resetToDefault = function () {
    if (this._isMetric) return this;
    const dictDefaults = rootGui._tooltipManager?.initialValues;
    const defVal =
      dictDefaults && this.property in dictDefaults
        ? dictDefaults[this.property]
        : this._defaultValue;

    if (defVal !== undefined && typeof this.setValue === "function") {
      this.setValue(cloneValue(defVal));
      if (typeof this._callOnFinishChange === "function") {
        this._callOnFinishChange();
      }
      updateFolderDirtyStates(rootGui);
      evaluateAllReactiveRules(rootGui);
    }
    return this;
  };

  ctrl.tooltip = function (descriptionOrOptions, metaOverride) {
    const manager = createTooltipManager(rootGui);
    const opts =
      typeof descriptionOrOptions === "string"
        ? { description: descriptionOrOptions, ...(metaOverride !== undefined ? { meta: metaOverride } : {}) }
        : descriptionOrOptions;
    manager.attachController(this, opts);
    return this;
  };

  ctrl.asMetric = function (options = {}) {
    this._isMetric = true;
    this.domElement?.classList.remove("is-modified");
    return registerMetricTicker(rootGui, this, options);
  };

  ctrl.showWhen = function (predicate, targetOverride = null) {
    registerReactiveRule(rootGui, () => {
      const target = targetOverride || this.object || rootGui._defaultTarget;
      const visible = evaluatePredicate(predicate, target, rootGui);
      this.show(visible);
    });
    return this;
  };

  ctrl.enableWhen = function (predicate, targetOverride = null) {
    registerReactiveRule(rootGui, () => {
      const target = targetOverride || this.object || rootGui._defaultTarget;
      const enabled = evaluatePredicate(predicate, target, rootGui);
      this.enable(enabled);
    });
    return this;
  };

  updateControllerDirtyState(ctrl, rootGui);
  return ctrl;
}

/**
 * Enhances a folder instance with a header quick-reset button and lifecycle hooks.
 */
function enhanceFolder(folder, rootGui) {
  if (!folder || folder._isFolderExtended) return folder;
  Object.defineProperty(folder, "_isFolderExtended", { value: true });

  if (folder.$title && !folder.$title.querySelector(".gui-folder-reset-btn")) {
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "gui-folder-reset-btn";
    resetBtn.textContent = "↺";
    resetBtn.title = "Reset section to defaults";
    resetBtn.setAttribute("aria-label", "Reset section to defaults");
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      folder.resetToDefault();
    });
    folder.$title.appendChild(resetBtn);
  }

  const origHide = folder.hide.bind(folder);
  folder.hide = function () {
    rootGui._tooltipManager?.hide(this.$title);
    return origHide();
  };

  return folder;
}

//#endregion

//#region 5: State Persistence, Presets & Undo/Redo History (2.2, 2.3, 2.4)

/**
 * Captures only modified controller values for compact URL hash synchronization.
 */
function getModifiedDiffSnapshot(rootGui) {
  const diff = {};
  for (const ctrl of rootGui.controllersRecursive()) {
    if (ctrl._isMetric || !(typeof ctrl.save === "function")) continue;
    if (ctrl.object && typeof ctrl.object[ctrl.property] === "function") continue;
    if (ctrl._isModified) {
      diff[ctrl._name] = ctrl.save();
    }
  }
  return diff;
}

/**
 * Enables automatic state persistence to localStorage/sessionStorage and optional URL hash state sync.
 */
function setupPersistence(gui, storageKey, options = {}) {
  const rootGui = gui.root || gui;
  const {
    storage = "local",
    syncURL = false,
    urlParam = "gui",
    debounce = 150,
    version = 1
  } = options;

  const backend =
    typeof window !== "undefined"
      ? storage === "session"
        ? window.sessionStorage
        : window.localStorage
      : null;

  const readFromURL = () => {
    if (!syncURL || typeof window === "undefined") return null;
    try {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
      const params = new URLSearchParams(hash);
      const encoded = params.get(urlParam);
      if (!encoded) return null;
      return JSON.parse(decodeURIComponent(encoded));
    } catch {
      return null;
    }
  };

  const writeToURL = () => {
    if (!syncURL || typeof window === "undefined") return;
    try {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
      const params = new URLSearchParams(hash);
      const diff = getModifiedDiffSnapshot(rootGui);
      if (Object.keys(diff).length > 0) {
        params.set(urlParam, encodeURIComponent(JSON.stringify(diff)));
      } else {
        params.delete(urlParam);
      }
      const nextHash = params.toString();
      const nextUrl = window.location.pathname + window.location.search + (nextHash ? `#${nextHash}` : "");
      window.history.replaceState(null, "", nextUrl);
    } catch {
      // Ignore history security errors in sandboxed iframes
    }
  };

  // Restore saved state on initialization
  const urlState = readFromURL();
  if (urlState && typeof urlState === "object") {
    rootGui.load(urlState);
  } else if (backend && storageKey) {
    try {
      const raw = backend.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.__version === version && parsed.state) {
          rootGui.load(parsed.state);
        }
      }
    } catch {
      // Ignore malformed storage entries
    }
  }

  let timer = null;
  const saveNow = () => {
    if (backend && storageKey) {
      try {
        const payload = { __version: version, state: rootGui.save() };
        backend.setItem(storageKey, JSON.stringify(payload));
      } catch {
        // Ignore storage quota errors
      }
    }
    if (syncURL) {
      writeToURL();
    }
  };

  const scheduleSave = () => {
    if (debounce <= 0) {
      saveNow();
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(saveNow, debounce);
  };

  rootGui._persistenceConfig = {
    storageKey,
    backend,
    saveNow,
    scheduleSave,
    clear() {
      clearTimeout(timer);
      if (backend && storageKey) {
        try {
          backend.removeItem(storageKey);
        } catch {}
      }
      if (syncURL && typeof window !== "undefined") {
        try {
          const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
          const params = new URLSearchParams(hash);
          params.delete(urlParam);
          const nextHash = params.toString();
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search + (nextHash ? `#${nextHash}` : "")
          );
        } catch {}
      }
    }
  };

  rootGui.sync();
  return rootGui;
}

/**
 * Sets up an Undo / Redo snapshot history stack bound to onFinishChange and Ctrl+Z / Ctrl+Y.
 */
function setupHistory(gui, options = {}) {
  const rootGui = gui.root || gui;
  if (rootGui._historyManager) return rootGui._historyManager;

  const { maxHistory = 50, shortcuts = true } = options;
  const stack = [JSON.stringify(rootGui.save())];
  let index = 0;
  let isRestoring = false;

  const notifyBar = () => {
    rootGui._presetBar?.updateHistoryButtons?.();
  };

  const recordSnapshot = () => {
    if (isRestoring) return;
    const currentStr = JSON.stringify(rootGui.save());
    if (currentStr === stack[index]) return;

    stack.splice(index + 1);
    stack.push(currentStr);
    if (stack.length > maxHistory) {
      stack.shift();
    } else {
      index++;
    }
    notifyBar();
  };

  const applyAtIndex = (targetIdx) => {
    if (targetIdx < 0 || targetIdx >= stack.length) return false;
    isRestoring = true;
    try {
      index = targetIdx;
      const state = JSON.parse(stack[index]);
      rootGui.load(state);
      rootGui.sync();
      rootGui._persistenceConfig?.scheduleSave?.();
      notifyBar();
    } finally {
      isRestoring = false;
    }
    return true;
  };

  const onKeyDown = (e) => {
    if (!shortcuts) return;
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable) &&
      !rootGui.domElement.contains(active)
    ) {
      return;
    }

    const isMod = e.metaKey || e.ctrlKey;
    if (!isMod) return;

    const key = e.key.toLowerCase();
    if (key === "z" && !e.shiftKey) {
      if (index > 0) {
        e.preventDefault();
        applyAtIndex(index - 1);
      }
    } else if ((key === "z" && e.shiftKey) || key === "y") {
      if (index < stack.length - 1) {
        e.preventDefault();
        applyAtIndex(index + 1);
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onKeyDown);
  }

  const manager = {
    recordSnapshot,
    resetBaseline() {
      stack.length = 0;
      stack.push(JSON.stringify(rootGui.save()));
      index = 0;
      notifyBar();
    },
    undo() {
      return index > 0 ? applyAtIndex(index - 1) : false;
    },
    redo() {
      return index < stack.length - 1 ? applyAtIndex(index + 1) : false;
    },
    canUndo() {
      return index > 0;
    },
    canRedo() {
      return index < stack.length - 1;
    },
    destroy() {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", onKeyDown);
      }
      delete rootGui._historyManager;
    }
  };

  rootGui._historyManager = manager;
  return manager;
}

/**
 * Injects a Preset Manager toolbar into the root GUI for switching, saving, copying, and importing presets.
 */
function setupPresetBar(gui, options = {}) {
  const rootGui = gui.root || gui;
  if (rootGui._presetBar) return rootGui._presetBar;

  const {
    presets = {},
    storageKey = rootGui._persistenceConfig?.storageKey
      ? `${rootGui._persistenceConfig.storageKey}:presets`
      : "lil-gui-extended:presets"
  } = options;

  const savedPresets = {};
  if (typeof window !== "undefined" && storageKey) {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) Object.assign(savedPresets, JSON.parse(raw));
    } catch {}
  }

  const allPresets = {
    Default: rootGui.save(),
    ...presets,
    ...savedPresets
  };

  const barEl = document.createElement("div");
  barEl.className = "gui-preset-bar";
  barEl.innerHTML = `
    <div class="gui-preset-row gui-preset-main-row">
      <select class="gui-preset-select" aria-label="Select preset"></select>
      <button type="button" class="gui-preset-btn btn-save" title="Save current state as preset">+</button>
      <button type="button" class="gui-preset-btn btn-copy" title="Copy state JSON to clipboard">Copy</button>
      <button type="button" class="gui-preset-btn btn-paste" title="Paste / Import JSON state">Paste</button>
      <button type="button" class="gui-preset-btn btn-undo" title="Undo (Ctrl+Z)" disabled>↶</button>
      <button type="button" class="gui-preset-btn btn-redo" title="Redo (Ctrl+Y)" disabled>↷</button>
    </div>
    <div class="gui-preset-row gui-preset-input-row" style="display: none;">
      <input type="text" class="gui-preset-input" placeholder="Preset name or JSON..." />
      <button type="button" class="gui-preset-btn btn-confirm">OK</button>
      <button type="button" class="gui-preset-btn btn-cancel">✕</button>
    </div>
    <div class="gui-preset-status"></div>
  `;

  if (rootGui.$title && rootGui.$title.nextSibling) {
    rootGui.domElement.insertBefore(barEl, rootGui.$title.nextSibling);
  } else {
    rootGui.domElement.prepend(barEl);
  }

  const selectEl = barEl.querySelector(".gui-preset-select");
  const saveBtn = barEl.querySelector(".btn-save");
  const copyBtn = barEl.querySelector(".btn-copy");
  const pasteBtn = barEl.querySelector(".btn-paste");
  const undoBtn = barEl.querySelector(".btn-undo");
  const redoBtn = barEl.querySelector(".btn-redo");

  const inputRow = barEl.querySelector(".gui-preset-input-row");
  const inputEl = barEl.querySelector(".gui-preset-input");
  const confirmBtn = barEl.querySelector(".btn-confirm");
  const cancelBtn = barEl.querySelector(".btn-cancel");
  const statusEl = barEl.querySelector(".gui-preset-status");

  let inputMode = null; // "save" | "paste"
  let statusTimer = null;

  const flashStatus = (msg) => {
    statusEl.textContent = msg;
    statusEl.classList.add("visible");
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      statusEl.classList.remove("visible");
    }, 1800);
  };

  const rebuildOptions = (selectedName = selectEl.value || "Default") => {
    selectEl.innerHTML = "";
    for (const name of Object.keys(allPresets)) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (name === selectedName) opt.selected = true;
      selectEl.appendChild(opt);
    }
  };

  const openInputRow = (mode, placeholder) => {
    inputMode = mode;
    inputEl.value = "";
    inputEl.placeholder = placeholder;
    inputRow.style.display = "flex";
    inputEl.focus();
  };

  const closeInputRow = () => {
    inputMode = null;
    inputRow.style.display = "none";
    inputEl.value = "";
  };

  const commitInputRow = () => {
    const val = inputEl.value.trim();
    if (!val) {
      closeInputRow();
      return;
    }

    if (inputMode === "save") {
      const snap = rootGui.save();
      allPresets[val] = snap;
      savedPresets[val] = snap;
      if (typeof window !== "undefined" && storageKey) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(savedPresets));
        } catch {}
      }
      rebuildOptions(val);
      flashStatus(`Saved "${val}"`);
    } else if (inputMode === "paste") {
      try {
        const parsed = JSON.parse(val);
        rootGui.load(parsed);
        rootGui.sync();
        rootGui._historyManager?.recordSnapshot?.();
        flashStatus("Imported JSON state");
      } catch {
        flashStatus("Invalid JSON");
      }
    }
    closeInputRow();
  };

  selectEl.addEventListener("change", () => {
    const chosen = allPresets[selectEl.value];
    if (chosen) {
      if (selectEl.value === "Default") {
        rootGui.reset();
      } else {
        rootGui.load(chosen);
      }
      rootGui.sync();
      rootGui._historyManager?.recordSnapshot?.();
      flashStatus(`Loaded "${selectEl.value}"`);
    }
  });

  saveBtn.addEventListener("click", () => {
    openInputRow("save", "New preset name...");
  });

  copyBtn.addEventListener("click", async () => {
    const json = JSON.stringify(rootGui.save(), null, 2);
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(json);
        flashStatus("Copied JSON to clipboard");
        return;
      } catch {}
    }
    openInputRow("paste", "Copy JSON from here:");
    inputEl.value = json;
    inputEl.select();
  });

  pasteBtn.addEventListener("click", async () => {
    if (navigator.clipboard?.readText) {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const parsed = JSON.parse(text);
          rootGui.load(parsed);
          rootGui.sync();
          rootGui._historyManager?.recordSnapshot?.();
          flashStatus("Loaded JSON from clipboard");
          return;
        }
      } catch {}
    }
    openInputRow("paste", "Paste preset JSON here...");
  });

  confirmBtn.addEventListener("click", commitInputRow);
  cancelBtn.addEventListener("click", closeInputRow);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInputRow();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeInputRow();
    }
  });

  undoBtn.addEventListener("click", () => {
    rootGui.undo();
  });

  redoBtn.addEventListener("click", () => {
    rootGui.redo();
  });

  const updateHistoryButtons = () => {
    const hm = rootGui._historyManager;
    undoBtn.disabled = !hm || !hm.canUndo();
    redoBtn.disabled = !hm || !hm.canRedo();
  };

  rebuildOptions("Default");
  updateHistoryButtons();

  const barManager = {
    barEl,
    allPresets,
    updateHistoryButtons,
    setDefaultSnapshot(snap) {
      allPresets.Default = snap;
    },
    destroy() {
      clearTimeout(statusTimer);
      barEl.remove();
      delete rootGui._presetBar;
    }
  };

  rootGui._presetBar = barManager;
  return barManager;
}

//#endregion

//#region 5B: Top Search & Utility Bar (3.1)

/**
 * Injects an optional sticky Top Bar with instant search/filtering (`/` or `Ctrl+K`),
 * expand/collapse all folders toggle, and reset-all action.
 */
function setupTopBar(gui, options = {}) {
  const rootGui = gui.root || gui;
  if (rootGui._topBar) return rootGui._topBar;

  const {
    placeholder = "Filter controls... (/)",
    shortcut = true,
    searchTooltips = true,
    showFolderToggle = true,
    showResetAll = true
  } = typeof options === "object" ? options : {};

  const barEl = document.createElement("div");
  barEl.className = "gui-top-bar";
  barEl.innerHTML = `
    <div class="gui-search-wrap">
      <input type="text" class="gui-search-input" placeholder="${placeholder}" aria-label="Filter controls" />
      <button type="button" class="gui-search-clear" title="Clear filter (Esc)" style="display: none;">✕</button>
    </div>
    ${showFolderToggle ? `<button type="button" class="gui-top-bar-btn btn-toggle-folders" title="Collapse / Expand all sections">↕</button>` : ""}
    ${showResetAll ? `<button type="button" class="gui-top-bar-btn btn-reset-all" title="Reset all modified parameters">↺</button>` : ""}
  `;

  const emptyEl = document.createElement("div");
  emptyEl.className = "gui-search-empty";
  emptyEl.textContent = "No matching controls";
  emptyEl.style.display = "none";

  // Mount right below $title (and above .gui-preset-bar if present)
  if (rootGui.$title && rootGui.$title.nextSibling) {
    rootGui.domElement.insertBefore(barEl, rootGui.$title.nextSibling);
  } else {
    rootGui.domElement.prepend(barEl);
  }
  rootGui.domElement.insertBefore(emptyEl, rootGui.$children);

  const searchInput = barEl.querySelector(".gui-search-input");
  const clearBtn = barEl.querySelector(".gui-search-clear");
  const toggleFoldersBtn = barEl.querySelector(".btn-toggle-folders");
  const resetAllBtn = barEl.querySelector(".btn-reset-all");

  let savedFolderStates = null;

  const getAllLeafNodes = (folder) => {
    return (folder.children || []).filter((child) => !child.children);
  };

  const matchesQuery = (ctrl, tokens) => {
    const label = (ctrl._name || "").toLowerCase();
    const prop = (ctrl.property || "").toLowerCase();
    const tooltipDesc =
      searchTooltips && rootGui._tooltipManager
        ? (rootGui._tooltipManager.controlTooltips?.[ctrl.property] || "").toLowerCase()
        : "";
    const textContent = (ctrl.domElement?.textContent || "").toLowerCase();
    const haystack = `${label} ${prop} ${tooltipDesc} ${textContent}`;
    return tokens.every((t) => haystack.includes(t));
  };

  const applyFilter = (rawQuery = "") => {
    const query = rawQuery.trim().toLowerCase();
    const tokens = query ? query.split(/\s+/) : [];
    clearBtn.style.display = query ? "block" : "none";

    const allFolders = rootGui.foldersRecursive ? rootGui.foldersRecursive() : [];

    // Restore original state when filter is cleared
    if (tokens.length === 0) {
      for (const ctrl of getAllLeafNodes(rootGui)) {
        ctrl.domElement?.classList.remove("is-search-hidden");
      }
      for (const folder of allFolders) {
        folder.domElement?.classList.remove("is-search-hidden");
        for (const ctrl of getAllLeafNodes(folder)) {
          ctrl.domElement?.classList.remove("is-search-hidden");
        }
        if (savedFolderStates && savedFolderStates.has(folder)) {
          const wasClosed = savedFolderStates.get(folder);
          if (wasClosed) folder.close();
          else folder.open();
        }
      }
      savedFolderStates = null;
      emptyEl.style.display = "none";
      return;
    }

    // Snapshot folder open/closed states on initial filter keystroke
    if (!savedFolderStates) {
      savedFolderStates = new WeakMap();
      for (const folder of allFolders) {
        savedFolderStates.set(folder, Boolean(folder._closed));
      }
    }

    let totalVisible = 0;

    // 1. Filter root-level controls
    for (const ctrl of getAllLeafNodes(rootGui)) {
      const matched = matchesQuery(ctrl, tokens);
      ctrl.domElement?.classList.toggle("is-search-hidden", !matched);
      if (matched && !ctrl._hidden) totalVisible++;
    }

    // 2. Filter folders bottom-up (deepest nested folders first)
    for (let i = allFolders.length - 1; i >= 0; i--) {
      const folder = allFolders[i];
      const folderTitle = (folder._title || "").toLowerCase();
      const folderTooltip =
        searchTooltips && rootGui._tooltipManager
          ? (rootGui._tooltipManager.folderTooltips?.[folder._title] || "").toLowerCase()
          : "";
      const folderHeaderMatched = tokens.every((t) =>
        `${folderTitle} ${folderTooltip}`.includes(t)
      );

      let folderHasMatch = false;

      for (const ctrl of getAllLeafNodes(folder)) {
        const matched = folderHeaderMatched || matchesQuery(ctrl, tokens);
        ctrl.domElement?.classList.toggle("is-search-hidden", !matched);
        if (matched && !ctrl._hidden) {
          folderHasMatch = true;
          totalVisible++;
        }
      }

      // Check direct child subfolders
      for (const child of folder.children || []) {
        if (child.children && !child.domElement?.classList.contains("is-search-hidden") && !child._hidden) {
          folderHasMatch = true;
        }
      }

      folder.domElement?.classList.toggle("is-search-hidden", !folderHasMatch);
      if (folderHasMatch) {
        folder.open();
      }
    }

    emptyEl.style.display = totalVisible === 0 ? "block" : "none";
  };

  searchInput.addEventListener("input", () => {
    applyFilter(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (searchInput.value) {
        searchInput.value = "";
        applyFilter("");
      } else {
        searchInput.blur();
      }
    }
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    applyFilter("");
    searchInput.focus();
  });

  if (toggleFoldersBtn) {
    toggleFoldersBtn.addEventListener("click", () => {
      const folders = rootGui.foldersRecursive ? rootGui.foldersRecursive() : [];
      const anyOpen = folders.some((f) => !f._closed);
      for (const f of folders) {
        if (anyOpen) f.close();
        else f.open();
      }
    });
  }

  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", () => {
      rootGui.resetToDefault();
    });
  }

  const onGlobalKeyDown = (e) => {
    if (!shortcut) return;
    const active = document.activeElement;
    const isInputFocused =
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);

    if (
      (e.key === "/" && !isInputFocused && !e.metaKey && !e.ctrlKey) ||
      ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
    ) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onGlobalKeyDown);
  }

  const topBarManager = {
    barEl,
    searchInput,
    filter(query = "") {
      searchInput.value = query;
      applyFilter(query);
    },
    clearFilter() {
      searchInput.value = "";
      applyFilter("");
    },
    focus() {
      searchInput.focus();
    },
    destroy() {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", onGlobalKeyDown);
      }
      barEl.remove();
      emptyEl.remove();
      delete rootGui._topBar;
    }
  };

  rootGui._topBar = topBarManager;
  return topBarManager;
}

//#endregion

//#region 6: Custom Widgets — Button Row, Segmented Pills & Dual Range Slider (5.3, 5.4)

/**
 * Base controller implementation compatible with lil-gui's lifecycle, hierarchy, save/load, and event bubbling.
 */
class CustomController {
  constructor(parent, object, property, className, { stateful = true } = {}) {
    this.parent = parent;
    this.object = object;
    this.property = property;
    this._name = property;
    this._disabled = false;
    this._hidden = false;
    this._changed = false;

    this.domElement = document.createElement("div");
    this.domElement.className = `controller ${className}`;

    this.$name = document.createElement("div");
    this.$name.className = "name";
    this.$name.textContent = property;

    this.$widget = document.createElement("div");
    this.$widget.className = "widget";
    this.$disable = this.$widget;

    this.domElement.appendChild(this.$name);
    this.domElement.appendChild(this.$widget);

    this.parent.children.push(this);
    if (stateful) {
      this.parent.controllers.push(this);
    }
    this.parent.$children.appendChild(this.domElement);

    if (stateful && object && property in object) {
      this.initialValue = cloneValue(this.getValue());
    }
  }

  name(name) {
    this._name = name;
    const resetBtn = this.$name.querySelector(".gui-reset-btn");
    this.$name.textContent = name;
    if (resetBtn) this.$name.appendChild(resetBtn);
    return this;
  }

  onChange(callback) {
    this._onChange = callback;
    return this;
  }

  onFinishChange(callback) {
    this._onFinishChange = callback;
    return this;
  }

  _callOnChange() {
    this.parent._callOnChange?.(this);
    if (this._onChange !== undefined) {
      this._onChange.call(this, this.getValue());
    }
    this._changed = true;
  }

  _callOnFinishChange() {
    if (this._changed) {
      this.parent._callOnFinishChange?.(this);
      if (this._onFinishChange !== undefined) {
        this._onFinishChange.call(this, this.getValue());
      }
    }
    this._changed = false;
  }

  enable(enabled = true) {
    if (enabled === !this._disabled) return this;
    this._disabled = !enabled;
    this.domElement.classList.toggle("disabled", !enabled);
    return this;
  }

  disable() {
    return this.enable(false);
  }

  show(show = true) {
    this._hidden = !show;
    this.domElement.style.display = show ? "" : "none";
    return this;
  }

  hide() {
    return this.show(false);
  }

  getValue() {
    return this.object ? this.object[this.property] : undefined;
  }

  setValue(value) {
    if (!this.object) return this;
    if (!isValueEqual(this.object[this.property], value)) {
      this.object[this.property] = value;
      this._callOnChange();
      this.updateDisplay();
    }
    return this;
  }

  updateDisplay() {
    return this;
  }

  reset() {
    if (this.initialValue !== undefined) {
      this.setValue(cloneValue(this.initialValue));
      this._callOnFinishChange();
    }
    return this;
  }

  save() {
    return cloneValue(this.getValue());
  }

  load(value) {
    this.setValue(cloneValue(value));
    this._callOnFinishChange();
    return this;
  }

  destroy() {
    const childIdx = this.parent.children.indexOf(this);
    if (childIdx !== -1) this.parent.children.splice(childIdx, 1);

    const ctrlIdx = this.parent.controllers.indexOf(this);
    if (ctrlIdx !== -1) this.parent.controllers.splice(ctrlIdx, 1);

    if (this.parent.$children.contains(this.domElement)) {
      this.parent.$children.removeChild(this.domElement);
    }
  }
}

/**
 * Creates a compact row of inline action buttons inside a single controller row.
 */
function createButtonRowController(gui, buttons, label = "") {
  const entries = Array.isArray(buttons)
    ? buttons.map((b) => [b.label || b.name, b.onClick || b.action || b.fn])
    : Object.entries(buttons || {});

  const ctrl = new CustomController(gui, null, label || "Actions", "gui-button-row-ctrl", {
    stateful: false
  });

  if (!label) {
    ctrl.domElement.classList.add("full-width");
  } else {
    ctrl.name(label);
  }

  const rowEl = document.createElement("div");
  rowEl.className = "gui-button-row";

  for (const [btnLabel, fn] of entries) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gui-inline-btn";
    btn.textContent = btnLabel;
    btn.addEventListener("click", (e) => {
      if (ctrl._disabled) return;
      if (typeof fn === "function") fn(e);
    });
    rowEl.appendChild(btn);
  }

  ctrl.$widget.appendChild(rowEl);
  enhanceController(ctrl, gui.root);
  return ctrl;
}

/**
 * Creates a horizontal segmented pill selector controller.
 */
function createSegmentedController(gui, object, property, options, label) {
  const ctrl = new CustomController(gui, object, property, "gui-segmented-ctrl", {
    stateful: true
  });
  if (label) ctrl.name(label);

  const entries = Array.isArray(options)
    ? options.map((v) => [String(v), v])
    : Object.entries(options || {});

  const container = document.createElement("div");
  container.className = "gui-segmented";
  const btnMap = new Map();

  for (const [text, val] of entries) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gui-segmented-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      if (ctrl._disabled) return;
      ctrl.setValue(val);
      ctrl._callOnFinishChange();
    });
    btnMap.set(val, btn);
    container.appendChild(btn);
  }

  ctrl.$widget.appendChild(container);

  ctrl.updateDisplay = function () {
    const current = this.getValue();
    for (const [val, btn] of btnMap.entries()) {
      const active = isValueEqual(val, current);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    }
    updateControllerDirtyState(this, gui.root);
    return this;
  };

  enhanceController(ctrl, gui.root);
  ctrl.updateDisplay();
  return ctrl;
}

/**
 * Creates a dual-thumb interval range slider supporting [low, high] arrays or { min, max } objects.
 */
function createRangeController(gui, object, property, min = 0, max = 100, step = 1, label) {
  const isObjectValue =
    object[property] && !Array.isArray(object[property]) && typeof object[property] === "object";

  const ctrl = new CustomController(gui, object, property, "gui-range-ctrl", {
    stateful: true
  });
  ctrl._min = min;
  ctrl._max = max;
  ctrl._step = step;
  if (label) ctrl.name(label);

  const decimals = (() => {
    const s = String(step);
    const dot = s.indexOf(".");
    return dot === -1 ? 0 : s.length - dot - 1;
  })();

  const snapAndClamp = (val, lo = min, hi = max) => {
    const stepped = step > 0 ? Math.round((val - min) / step) * step + min : val;
    const fixed = Number(stepped.toFixed(decimals));
    return Math.max(lo, Math.min(hi, fixed));
  };

  const readPair = () => {
    const raw = object[property];
    if (isObjectValue) {
      return [Number(raw.min ?? min), Number(raw.max ?? max)];
    }
    return [Number(raw?.[0] ?? min), Number(raw?.[1] ?? max)];
  };

  const writePair = (lo, hi) => {
    if (isObjectValue) {
      object[property].min = lo;
      object[property].max = hi;
    } else if (Array.isArray(object[property])) {
      object[property][0] = lo;
      object[property][1] = hi;
    } else {
      object[property] = [lo, hi];
    }
  };

  ctrl.getValue = function () {
    const [lo, hi] = readPair();
    return isObjectValue ? { min: lo, max: hi } : [lo, hi];
  };

  ctrl.setValue = function (val) {
    const nextLo = isObjectValue ? Number(val.min) : Number(val[0]);
    const nextHi = isObjectValue ? Number(val.max) : Number(val[1]);
    const clampedLo = snapAndClamp(nextLo, min, max);
    const clampedHi = snapAndClamp(Math.max(clampedLo, nextHi), clampedLo, max);
    const [currLo, currHi] = readPair();

    if (!isValueEqual(currLo, clampedLo) || !isValueEqual(currHi, clampedHi)) {
      writePair(clampedLo, clampedHi);
      this._callOnChange();
      this.updateDisplay();
    } else {
      this.updateDisplay();
    }
    return this;
  };

  const wrapper = document.createElement("div");
  wrapper.className = "gui-range-widget";
  wrapper.innerHTML = `
    <input type="text" class="gui-range-input min-input" aria-label="Minimum value" />
    <div class="gui-range-track">
      <div class="gui-range-fill"></div>
      <div class="gui-range-thumb thumb-low" tabindex="0" role="slider" aria-label="Range minimum"></div>
      <div class="gui-range-thumb thumb-high" tabindex="0" role="slider" aria-label="Range maximum"></div>
    </div>
    <input type="text" class="gui-range-input max-input" aria-label="Maximum value" />
  `;

  const minInput = wrapper.querySelector(".min-input");
  const maxInput = wrapper.querySelector(".max-input");
  const trackEl = wrapper.querySelector(".gui-range-track");
  const fillEl = wrapper.querySelector(".gui-range-fill");
  const thumbLow = wrapper.querySelector(".thumb-low");
  const thumbHigh = wrapper.querySelector(".thumb-high");

  ctrl.$widget.appendChild(wrapper);

  const clientXToValue = (clientX) => {
    const rect = trackEl.getBoundingClientRect();
    const ratio = rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
    return min + ratio * (max - min);
  };

  const bindDrag = (startMode) => (downEvent) => {
    if (ctrl._disabled) return;
    downEvent.preventDefault();
    downEvent.stopPropagation();

    let mode = startMode;
    const startX = downEvent.clientX;
    const [initLo, initHi] = readPair();
    const span = initHi - initLo;

    if (mode === "track") {
      const clickedVal = clientXToValue(startX);
      const distLo = Math.abs(clickedVal - initLo);
      const distHi = Math.abs(clickedVal - initHi);
      if (initLo === initHi) {
        mode = clickedVal < initLo ? "low" : "high";
      } else {
        mode = distLo <= distHi ? "low" : "high";
      }
      if (mode === "low") {
        ctrl.setValue(isObjectValue ? { min: clickedVal, max: initHi } : [clickedVal, initHi]);
      } else {
        ctrl.setValue(isObjectValue ? { min: initLo, max: clickedVal } : [initLo, clickedVal]);
      }
    }

    const onMove = (moveEvent) => {
      const [currLo, currHi] = readPair();
      if (mode === "fill") {
        const rect = trackEl.getBoundingClientRect();
        const deltaVal = rect.width > 0 ? ((moveEvent.clientX - startX) / rect.width) * (max - min) : 0;
        let nextLo = snapAndClamp(initLo + deltaVal, min, max - span);
        let nextHi = snapAndClamp(nextLo + span, nextLo, max);
        ctrl.setValue(isObjectValue ? { min: nextLo, max: nextHi } : [nextLo, nextHi]);
      } else if (mode === "low") {
        const val = snapAndClamp(clientXToValue(moveEvent.clientX), min, currHi);
        ctrl.setValue(isObjectValue ? { min: val, max: currHi } : [val, currHi]);
      } else if (mode === "high") {
        const val = snapAndClamp(clientXToValue(moveEvent.clientX), currLo, max);
        ctrl.setValue(isObjectValue ? { min: currLo, max: val } : [currLo, val]);
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      ctrl._callOnFinishChange();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  thumbLow.addEventListener("pointerdown", bindDrag("low"));
  thumbHigh.addEventListener("pointerdown", bindDrag("high"));
  fillEl.addEventListener("pointerdown", bindDrag("fill"));
  trackEl.addEventListener("pointerdown", bindDrag("track"));

  const bindThumbKeys = (which) => (e) => {
    if (ctrl._disabled) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : -1;
    const [lo, hi] = readPair();
    if (which === "low") {
      const nextLo = snapAndClamp(lo + dir * step, min, hi);
      ctrl.setValue(isObjectValue ? { min: nextLo, max: hi } : [nextLo, hi]);
    } else {
      const nextHi = snapAndClamp(hi + dir * step, lo, max);
      ctrl.setValue(isObjectValue ? { min: lo, max: nextHi } : [lo, nextHi]);
    }
    ctrl._callOnFinishChange();
  };

  thumbLow.addEventListener("keydown", bindThumbKeys("low"));
  thumbHigh.addEventListener("keydown", bindThumbKeys("high"));

  const commitInput = (which) => {
    const [lo, hi] = readPair();
    if (which === "low") {
      const parsed = parseFloat(minInput.value);
      if (!Number.isNaN(parsed)) {
        const nextLo = snapAndClamp(parsed, min, hi);
        ctrl.setValue(isObjectValue ? { min: nextLo, max: hi } : [nextLo, hi]);
        ctrl._callOnFinishChange();
      } else {
        ctrl.updateDisplay();
      }
    } else {
      const parsed = parseFloat(maxInput.value);
      if (!Number.isNaN(parsed)) {
        const nextHi = snapAndClamp(parsed, lo, max);
        ctrl.setValue(isObjectValue ? { min: lo, max: nextHi } : [lo, nextHi]);
        ctrl._callOnFinishChange();
      } else {
        ctrl.updateDisplay();
      }
    }
  };

  minInput.addEventListener("change", () => commitInput("low"));
  maxInput.addEventListener("change", () => commitInput("high"));

  ctrl.updateDisplay = function () {
    const [lo, hi] = readPair();
    const rangeSpan = max - min || 1;
    const lowPct = Math.max(0, Math.min(100, ((lo - min) / rangeSpan) * 100));
    const highPct = Math.max(0, Math.min(100, ((hi - min) / rangeSpan) * 100));

    minInput.value = lo.toFixed(decimals);
    maxInput.value = hi.toFixed(decimals);

    thumbLow.style.left = `${lowPct}%`;
    thumbHigh.style.left = `${highPct}%`;
    thumbLow.style.zIndex = lowPct > 90 && lo === hi ? "3" : "2";

    fillEl.style.left = `${lowPct}%`;
    fillEl.style.width = `${Math.max(0, highPct - lowPct)}%`;

    thumbLow.setAttribute("aria-valuemin", String(min));
    thumbLow.setAttribute("aria-valuemax", String(hi));
    thumbLow.setAttribute("aria-valuenow", String(lo));

    thumbHigh.setAttribute("aria-valuemin", String(lo));
    thumbHigh.setAttribute("aria-valuemax", String(max));
    thumbHigh.setAttribute("aria-valuenow", String(hi));

    updateControllerDirtyState(this, gui.root);
    return this;
  };

  enhanceController(ctrl, gui.root);
  ctrl.updateDisplay();
  return ctrl;
}

//#endregion

//#region 7: Declarative Schema Builder v2 (4.1)

const TUPLE_MODIFIER_KEYS = new Set([
  "tooltip",
  "meta",
  "badge",
  "unit",
  "precision",
  "format",
  "hz",
  "metric",
  "asMetric",
  "showWhen",
  "enableWhen",
  "onChange",
  "onFinishChange",
  "segmented",
  "range",
  "buttons",
  "min",
  "max",
  "step",
  "options",
  "disabled",
  "listen",
  "default"
]);

function isModifierObject(candidate, paramIndex) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
  const keys = Object.keys(candidate);
  if (keys.length === 0) return false;
  if (paramIndex >= 1) {
    return keys.some((k) => TUPLE_MODIFIER_KEYS.has(k));
  }
  return keys.every((k) => TUPLE_MODIFIER_KEYS.has(k));
}

function buildSchemaEntries(containerGui, entries, defaultTarget, isMetrics) {
  for (const item of entries) {
    if (!item) continue;

    // Support nested subfolder config objects inside an items array
    if (!Array.isArray(item) && typeof item === "object") {
      if (item.folder || item.title) {
        const subFolder = containerGui.addFolder(item.folder || item.title);
        if (item.closed) subFolder.close();
        if (item.tooltip) subFolder.tooltip(item.tooltip, item.meta);
        if (item.showWhen) subFolder.showWhen(item.showWhen, item.target || defaultTarget);
        if (item.enableWhen) subFolder.enableWhen(item.enableWhen, item.target || defaultTarget);
        const subEntries = item.items || item.children || [];
        buildSchemaEntries(subFolder, subEntries, item.target || defaultTarget, item.isMetrics ?? isMetrics);
      } else if (item.buttons) {
        const btnCtrl = containerGui.addButtonRow(item.buttons, item.label || "");
        if (item.tooltip) btnCtrl.tooltip(item.tooltip, item.meta);
        if (item.showWhen) btnCtrl.showWhen(item.showWhen, item.target || defaultTarget);
        if (item.enableWhen) btnCtrl.enableWhen(item.enableWhen, item.target || defaultTarget);
      }
      continue;
    }

    const [prop, label, ...rawParams] = item;
    let modifiers = {};
    const params = [...rawParams];

    if (params.length > 0 && isModifierObject(params[params.length - 1], params.length - 1)) {
      modifiers = params.pop();
    }

    const obj = modifiers.target || defaultTarget;

    if (prop === "$buttons" || modifiers.buttons) {
      const btnCtrl = containerGui.addButtonRow(modifiers.buttons || label, typeof label === "string" && modifiers.buttons ? label : "");
      if (modifiers.tooltip) btnCtrl.tooltip(modifiers.tooltip, modifiers.meta);
      if (modifiers.showWhen) btnCtrl.showWhen(modifiers.showWhen, obj);
      if (modifiers.enableWhen) btnCtrl.enableWhen(modifiers.enableWhen, obj);
      continue;
    }

    if (!obj) continue;

    if (modifiers.default !== undefined && containerGui.root._tooltipManager) {
      containerGui.root._tooltipManager.initialValues[prop] = modifiers.default;
    }

    if (isMetrics || modifiers.metric || modifiers.asMetric) {
      const metricOpts = {
        label,
        unit: modifiers.unit,
        precision: modifiers.precision,
        format: modifiers.format,
        hz: modifiers.hz,
        ...(typeof modifiers.metric === "object" ? modifiers.metric : {}),
        ...(typeof modifiers.asMetric === "object" ? modifiers.asMetric : {})
      };
      const ctrl = containerGui.addMetric(obj, prop, metricOpts);
      if (modifiers.tooltip) ctrl.tooltip(modifiers.tooltip, modifiers.meta);
      if (modifiers.showWhen) ctrl.showWhen(modifiers.showWhen, obj);
      continue;
    }

    // Extract explicit range/options from modifiers if not passed positionally
    if (params.length === 0) {
      if (modifiers.options !== undefined) {
        params.push(modifiers.options);
      } else if (typeof modifiers.min === "number" && typeof modifiers.max === "number") {
        params.push(modifiers.min, modifiers.max);
        if (modifiers.step !== undefined) params.push(modifiers.step);
      }
    }

    let ctrl;
    if (modifiers.segmented && params[0] !== undefined) {
      ctrl = containerGui.addSegmented(obj, prop, params[0], label);
    } else if (modifiers.range) {
      ctrl = containerGui.addRange(obj, prop, params[0], params[1], params[2], label);
    } else {
      ctrl = containerGui.addAuto(obj, prop, ...params);
      if (label !== undefined) ctrl.name(label);
    }

    if (modifiers.listen && typeof ctrl.listen === "function") ctrl.listen();
    if (modifiers.disabled) ctrl.disable();
    if (typeof modifiers.onChange === "function") ctrl.onChange(modifiers.onChange);
    if (typeof modifiers.onFinishChange === "function") ctrl.onFinishChange(modifiers.onFinishChange);
    if (modifiers.showWhen) ctrl.showWhen(modifiers.showWhen, obj);
    if (modifiers.enableWhen) ctrl.enableWhen(modifiers.enableWhen, obj);

    if (containerGui.root._tooltipManager || modifiers.tooltip) {
      const manager = createTooltipManager(containerGui.root);
      manager.attachController(ctrl, {
        label,
        params,
        ...(typeof modifiers.tooltip === "string"
          ? { description: modifiers.tooltip }
          : modifiers.tooltip || {}),
        ...(modifiers.meta !== undefined ? { meta: modifiers.meta } : {}),
        ...(modifiers.badge !== undefined ? { badge: modifiers.badge } : {})
      });
    }
  }
}

//#endregion

//#region 8: Prototype Extension & ExtendedGUI Subclass

/**
 * Extends lil-gui's prototype with tooltips, formatted metrics, dirty state, persistence, presets, history, top bar, widgets, and schemas.
 */
export function extendLilGUI(GUIClass = GUI) {
  if (GUIClass._isExtended) return GUIClass;
  Object.defineProperty(GUIClass, "_isExtended", { value: true });

  const origAdd = GUIClass.prototype.add;
  const origAddColor = GUIClass.prototype.addColor;
  const origAddFolder = GUIClass.prototype.addFolder;
  const origReset = GUIClass.prototype.reset;
  const origLoad = GUIClass.prototype.load;
  const origDestroy = GUIClass.prototype.destroy;

  const ensureRootHooks = (rootGui) => {
    if (rootGui._hasRootHooks) return;
    Object.defineProperty(rootGui, "_hasRootHooks", { value: true });

    rootGui.onChange(() => {
      updateFolderDirtyStates(rootGui);
      evaluateAllReactiveRules(rootGui);
      rootGui._persistenceConfig?.scheduleSave?.();
    });

    rootGui.onFinishChange(() => {
      updateFolderDirtyStates(rootGui);
      evaluateAllReactiveRules(rootGui);
      rootGui._historyManager?.recordSnapshot?.();
      rootGui._persistenceConfig?.scheduleSave?.();
    });
  };

  GUIClass.prototype.add = function (object, property, ...params) {
    ensureRootHooks(this.root);
    const ctrl = origAdd.call(this, object, property, ...params);
    enhanceController(ctrl, this.root);
    if (this.root._tooltipManager) {
      this.root._tooltipManager.attachController(ctrl, { params });
    }
    return ctrl;
  };

  GUIClass.prototype.addColor = function (object, property, ...params) {
    ensureRootHooks(this.root);
    const ctrl = origAddColor.call(this, object, property, ...params);
    enhanceController(ctrl, this.root);
    if (this.root._tooltipManager) {
      this.root._tooltipManager.attachController(ctrl, { params });
    }
    return ctrl;
  };

  GUIClass.prototype.addFolder = function (title) {
    ensureRootHooks(this.root);
    const folder = origAddFolder.call(this, title);
    enhanceFolder(folder, this.root);
    if (this.root._tooltipManager) {
      this.root._tooltipManager.attachFolder(folder, { title });
    }
    return folder;
  };

  /**
   * Automatically picks `addColor` for hex strings (`#...`), `addRange` for [low, high] pairs, or `add` for everything else.
   */
  GUIClass.prototype.addAuto = function (object, property, ...params) {
    const val = object?.[property];
    if (typeof val === "string" && val.startsWith("#") && params.length === 0) {
      return this.addColor(object, property);
    }
    if (
      Array.isArray(val) &&
      val.length === 2 &&
      typeof val[0] === "number" &&
      typeof val[1] === "number" &&
      typeof params[0] === "number" &&
      typeof params[1] === "number"
    ) {
      return this.addRange(object, property, params[0], params[1], params[2]);
    }
    return this.add(object, property, ...params);
  };

  /**
   * Adds a throttled, unit/precision-formatted read-only metric controller without mutating source state.
   */
  GUIClass.prototype.addMetric = function (object, property, labelOrOptions = {}) {
    ensureRootHooks(this.root);
    const opts =
      typeof labelOrOptions === "string" ? { label: labelOrOptions } : { ...labelOrOptions };

    const proxyObj = { [property]: formatMetricValue(object?.[property], opts) };
    const ctrl = origAdd.call(this, proxyObj, property);
    ctrl._isMetric = true;
    ctrl._isProxyMetric = true;
    ctrl._metricSourceObject = object;
    ctrl._metricSourceProperty = property;

    if (opts.label) ctrl.name(opts.label);
    enhanceController(ctrl, this.root);
    registerMetricTicker(this.root, ctrl, opts);

    if (this.root._tooltipManager) {
      this.root._tooltipManager.attachController(ctrl, { label: opts.label });
    }
    return ctrl;
  };

  /**
   * Adds a compact inline button bar controller.
   */
  GUIClass.prototype.addButtonRow = function (buttons, label = "") {
    ensureRootHooks(this.root);
    return createButtonRowController(this, buttons, label);
  };

  /**
   * Adds a horizontal segmented pill toggle controller.
   */
  GUIClass.prototype.addSegmented = function (object, property, options, label) {
    ensureRootHooks(this.root);
    const ctrl = createSegmentedController(this, object, property, options, label);
    if (this.root._tooltipManager) {
      this.root._tooltipManager.attachController(ctrl, { label });
    }
    return ctrl;
  };

  /**
   * Adds a dual-thumb range interval slider for [low, high] arrays or { min, max } objects.
   */
  GUIClass.prototype.addRange = function (object, property, min = 0, max = 100, step = 1, label) {
    ensureRootHooks(this.root);
    const ctrl = createRangeController(this, object, property, min, max, step, label);
    if (this.root._tooltipManager) {
      this.root._tooltipManager.attachController(ctrl, {
        label,
        params: [min, max, step]
      });
    }
    return ctrl;
  };

  /**
   * Attaches a tooltip to a folder (or initializes tooltip dictionaries on the root GUI).
   */
  GUIClass.prototype.tooltip = function (descriptionOrConfig, metaOverride) {
    const manager = createTooltipManager(this.root);
    if (this.parent) {
      const opts =
        typeof descriptionOrConfig === "string"
          ? { description: descriptionOrConfig, ...(metaOverride !== undefined ? { meta: metaOverride } : {}) }
          : descriptionOrConfig;
      manager.attachFolder(this, opts);
    } else if (typeof descriptionOrConfig === "object") {
      manager.setDictionaries(descriptionOrConfig);
    }
    return this;
  };

  /**
   * Conditionally shows or hides this folder based on a predicate or key-value map.
   */
  GUIClass.prototype.showWhen = function (predicate, targetOverride = null) {
    ensureRootHooks(this.root);
    registerReactiveRule(this.root, () => {
      const target = targetOverride || this._defaultTarget || this.root._defaultTarget;
      const visible = evaluatePredicate(predicate, target, this.root);
      this.show(visible);
    });
    return this;
  };

  /**
   * Conditionally enables or disables this folder and its child controls based on a predicate or key-value map.
   */
  GUIClass.prototype.enableWhen = function (predicate, targetOverride = null) {
    ensureRootHooks(this.root);
    registerReactiveRule(this.root, () => {
      const target = targetOverride || this._defaultTarget || this.root._defaultTarget;
      const enabled = evaluatePredicate(predicate, target, this.root);
      this.domElement.classList.toggle("is-folder-disabled", !enabled);
    });
    return this;
  };

  /**
   * Resets all controllers inside this GUI or folder back to their default values.
   */
  GUIClass.prototype.resetToDefault = function () {
    for (const ctrl of this.controllersRecursive()) {
      ctrl.resetToDefault?.();
    }
    updateFolderDirtyStates(this.root);
    evaluateAllReactiveRules(this.root);
    this.root._historyManager?.recordSnapshot?.();
    this.root._persistenceConfig?.scheduleSave?.();
    return this;
  };

  GUIClass.prototype.reset = function (recursive = true) {
    origReset.call(this, recursive);
    updateFolderDirtyStates(this.root);
    evaluateAllReactiveRules(this.root);
    return this;
  };

  GUIClass.prototype.load = function (obj, recursive = true) {
    origLoad.call(this, obj, recursive);
    updateFolderDirtyStates(this.root);
    evaluateAllReactiveRules(this.root);
    return this;
  };

  /**
   * Positions the root GUI panel on the 'left' or 'right' side of the viewport.
   */
  GUIClass.prototype.setPosition = function (pos = "right") {
    const el = this.root.domElement;
    el.classList.remove("gui-left", "gui-right");
    if (pos === "left" || pos === "gui-left") {
      el.classList.add("gui-left");
    } else if (pos === "right" || pos === "gui-right") {
      el.classList.add("gui-right");
    } else if (pos) {
      el.classList.add(pos);
    }
    return this;
  };

  /**
   * Synchronizes all controller displays, dirty indicators, and conditional rules with their underlying data objects.
   */
  GUIClass.prototype.sync = function () {
    this.controllersRecursive().forEach((c) => c.updateDisplay());
    updateFolderDirtyStates(this.root);
    evaluateAllReactiveRules(this.root);
    return this;
  };

  /**
   * Enables automatic state persistence to localStorage/sessionStorage and optional URL hash state sync.
   */
  GUIClass.prototype.persist = function (storageKey = "lil-gui-extended-state", options = {}) {
    ensureRootHooks(this.root);
    setupPersistence(this.root, storageKey, options);
    return this;
  };

  /**
   * Clears any persisted state in storage/URL and resets all parameters to defaults.
   */
  GUIClass.prototype.clearPersisted = function () {
    this.root._persistenceConfig?.clear?.();
    this.root.resetToDefault();
    return this;
  };

  /**
   * Enables the Undo / Redo snapshot history stack on the root GUI.
   */
  GUIClass.prototype.enableHistory = function (options = {}) {
    ensureRootHooks(this.root);
    setupHistory(this.root, options);
    return this;
  };

  GUIClass.prototype.undo = function () {
    this.root._historyManager?.undo?.();
    return this;
  };

  GUIClass.prototype.redo = function () {
    this.root._historyManager?.redo?.();
    return this;
  };

  GUIClass.prototype.canUndo = function () {
    return Boolean(this.root._historyManager?.canUndo?.());
  };

  GUIClass.prototype.canRedo = function () {
    return Boolean(this.root._historyManager?.canRedo?.());
  };

  /**
   * Injects the optional Top Search & Utility Bar at the top of the root GUI.
   */
  GUIClass.prototype.addTopBar = function (options = {}) {
    ensureRootHooks(this.root);
    setupTopBar(this.root, options);
    return this;
  };

  /**
   * Programmatically filters controls via the Top Search Bar (initializing it if not already present).
   */
  GUIClass.prototype.filter = function (query = "") {
    if (!this.root._topBar) {
      setupTopBar(this.root);
    }
    this.root._topBar.filter(query);
    return this;
  };

  /**
   * Injects the Preset Manager toolbar at the top of the root GUI.
   */
  GUIClass.prototype.addPresetBar = function (options = {}) {
    ensureRootHooks(this.root);
    if (!this.root._historyManager && options.history !== false) {
      setupHistory(this.root, typeof options.history === "object" ? options.history : {});
    }
    setupPresetBar(this.root, options);
    return this;
  };

  /**
   * Populates folders and controllers declaratively from a v1 or v2 tuple/object schema.
   */
  GUIClass.prototype.fromSchema = function (schema, options = {}) {
    ensureRootHooks(this.root);

    const {
      target = null,
      isMetrics = false,
      metricsTarget = null,
      tooltips = null,
      folderTooltips = null,
      initialValues = null,
      onChange = null,
      onFinishChange = null
    } = options;

    const defaultTarget = target || metricsTarget || this._defaultTarget || this.root._defaultTarget || null;
    if (defaultTarget && !this.root._defaultTarget) {
      this.root._defaultTarget = defaultTarget;
    }

    if (tooltips || folderTooltips || initialValues) {
      const manager = createTooltipManager(this.root);
      manager.setDictionaries({
        controls: tooltips,
        folders: folderTooltips,
        defaults: initialValues
      });
    }

    if (typeof onChange === "function") {
      this.onChange((e) => {
        if (e.object && typeof e.object[e.property] === "function") return;
        onChange(e);
      });
    }

    if (typeof onFinishChange === "function") {
      this.onFinishChange((e) => {
        if (e.object && typeof e.object[e.property] === "function") return;
        onFinishChange(e);
      });
    }

    // Top-level array schema adds directly to current GUI/folder
    if (Array.isArray(schema)) {
      buildSchemaEntries(this, schema, defaultTarget, isMetrics);
    } else if (schema && typeof schema === "object") {
      for (const [folderName, rawFolderDef] of Object.entries(schema)) {
        if (!rawFolderDef) continue;

        // Root-level controls key
        if (folderName === "$root" || folderName === "") {
          const rootItems = Array.isArray(rawFolderDef)
            ? rawFolderDef
            : rawFolderDef.items || rawFolderDef.children || [];
          const rootTarget = (!Array.isArray(rawFolderDef) && rawFolderDef.target) || defaultTarget;
          buildSchemaEntries(this, rootItems, rootTarget, isMetrics);
          continue;
        }

        const folder = this.addFolder(folderName);

        // v2 folder configuration object: { target, closed, tooltip, showWhen, enableWhen, items }
        if (!Array.isArray(rawFolderDef) && typeof rawFolderDef === "object") {
          const folderTarget = rawFolderDef.target || defaultTarget;
          folder._defaultTarget = folderTarget;
          if (rawFolderDef.closed) folder.close();
          if (rawFolderDef.tooltip) folder.tooltip(rawFolderDef.tooltip, rawFolderDef.meta);
          if (rawFolderDef.showWhen) folder.showWhen(rawFolderDef.showWhen, folderTarget);
          if (rawFolderDef.enableWhen) folder.enableWhen(rawFolderDef.enableWhen, folderTarget);

          const items = rawFolderDef.items || rawFolderDef.children || [];
          buildSchemaEntries(folder, items, folderTarget, rawFolderDef.isMetrics ?? isMetrics);
          continue;
        }

        // v1 & v2 array folder definition: [optionalTargetObj, ...tuples]
        const [firstItem, ...restItems] = rawFolderDef;
        const hasInlineTarget =
          firstItem &&
          !Array.isArray(firstItem) &&
          typeof firstItem === "object" &&
          !firstItem.folder &&
          !firstItem.buttons;

        const folderTarget = isMetrics
          ? metricsTarget || (hasInlineTarget ? firstItem : defaultTarget)
          : hasInlineTarget
            ? firstItem
            : defaultTarget;

        folder._defaultTarget = folderTarget;
        const entries = hasInlineTarget ? restItems : [firstItem, ...restItems];
        buildSchemaEntries(folder, entries, folderTarget, isMetrics);
      }
    }

    updateFolderDirtyStates(this.root);
    evaluateAllReactiveRules(this.root);
    this.root._historyManager?.resetBaseline?.();
    this.root._presetBar?.setDefaultSnapshot?.(this.root.save());

    return this;
  };

  GUIClass.prototype.destroy = function () {
    if (this._tooltipManager) {
      this._tooltipManager.destroy();
    }
    if (this._metricRegistry) {
      this._metricRegistry.destroy();
    }
    if (this._historyManager) {
      this._historyManager.destroy();
    }
    if (this._topBar) {
      this._topBar.destroy();
    }
    if (this._presetBar) {
      this._presetBar.destroy();
    }
    return origDestroy.call(this);
  };

  return GUIClass;
}

// Apply prototype extensions to the default GUI class and inject styles
injectGUIStyles();
extendLilGUI(GUI);

/**
 * Standalone ExtendedGUI subclass for one-step instantiation.
 */
export class ExtendedGUI extends GUI {
  constructor(options = {}) {
    const {
      position = "right",
      schema = null,
      target = null,
      isMetrics = false,
      metricsTarget = null,
      tooltips = null,
      folderTooltips = null,
      initialValues = null,
      onChange = null,
      onFinishChange = null,
      persist = null,
      topBar = false,
      searchable = false,
      presets = null,
      presetBar = false,
      history = true,
      injectStyles = true,
      customCSS = "",
      ...lilGuiOptions
    } = options;

    if (injectStyles) injectGUIStyles(customCSS);
    super(lilGuiOptions);

    if (target || metricsTarget) {
      this._defaultTarget = target || metricsTarget;
    }

    if (position) {
      this.setPosition(position);
    }

    if (tooltips || folderTooltips || initialValues) {
      createTooltipManager(this, {
        controlTooltips: tooltips || {},
        folderTooltips: folderTooltips || {},
        initialValues: initialValues || {}
      });
    }

    if (schema) {
      this.fromSchema(schema, {
        target,
        isMetrics,
        metricsTarget,
        onChange,
        onFinishChange
      });
    } else {
      if (typeof onChange === "function") {
        this.onChange((e) => {
          if (e.object && typeof e.object[e.property] === "function") return;
          onChange(e);
        });
      }
      if (typeof onFinishChange === "function") {
        this.onFinishChange((e) => {
          if (e.object && typeof e.object[e.property] === "function") return;
          onFinishChange(e);
        });
      }
    }

    if (history) {
      this.enableHistory(typeof history === "object" ? history : {});
    }

    if (presetBar || presets) {
      this.addPresetBar({
        presets: presets || {},
        ...(typeof presetBar === "object" ? presetBar : {})
      });
    }

    if (topBar || searchable) {
      this.addTopBar(typeof topBar === "object" ? topBar : {});
    }

    if (persist) {
      if (typeof persist === "string") {
        this.persist(persist);
      } else if (typeof persist === "object") {
        this.persist(persist.key || "lil-gui-extended-state", persist);
      }
    }
  }
}

export default ExtendedGUI;

//#endregion