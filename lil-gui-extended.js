import GUI, { Controller } from 'lil-gui';

// ============================================================================
// 0. STYLES (Uses lil-gui native CSS variables for seamless theming)
// ============================================================================
const style = document.createElement('style');
style.innerHTML = `
  /* Separator */
  .lil-gui .lil-separator {
    border: none;
    border-top: 1px solid var(--folder-indent-color, #333);
    margin: 4px 0;
  }

  /* Note / Info Block */
  .lil-gui .controller.lil-note {
    height: auto;
    min-height: var(--row-height);
    padding: 6px var(--padding);
    color: var(--text-color);
    opacity: 0.75;
    font-size: 11px;
    line-height: 1.4;
    border-left: 2px solid var(--focus-color);
    background: rgba(255, 255, 255, 0.03);
    margin: 2px 0;
    display: block;
  }

  /* Inline Button Row */
  .lil-gui .controller.lil-button-row .widget {
    display: flex;
    gap: 4px;
    width: 100%;
  }
  .lil-gui .controller.lil-button-row button {
    flex: 1;
    height: var(--widget-height);
    background: var(--widget-color);
    color: var(--text-color);
    border: none;
    border-radius: var(--widget-border-radius);
    font-family: var(--font-family);
    font-size: var(--font-size);
    cursor: pointer;
    padding: 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lil-gui .controller.lil-button-row button:hover {
    background: var(--hover-widget-color);
  }
  .lil-gui .controller.lil-button-row button:active {
    background: var(--focus-color);
  }

  /* Hotkey Badge & Reset Icon & Sync Icon in .name */
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
    opacity: 0.7;
    font-family: var(--font-family-mono, monospace);
    margin-left: auto;
  }
  .lil-gui .lil-reset-btn,
  .lil-gui .lil-sync-btn {
    cursor: pointer;
    opacity: 0.35;
    font-size: 11px;
    user-select: none;
    transition: opacity 0.15s;
  }
  .lil-gui .lil-reset-btn:hover,
  .lil-gui .lil-sync-btn:hover,
  .lil-gui .lil-sync-btn.locked {
    opacity: 1;
    color: var(--number-color);
  }

  /* Unit Suffix */
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

  /* Min/Max Range Slider */
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
    pointer-events: none;
  }
  .lil-gui .lil-range-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-family-mono, monospace);
    font-size: var(--input-font-size, 11px);
    color: var(--text-color);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    pointer-events: none;
  }
`;
document.head.appendChild(style);

// ============================================================================
// INTERNAL HOOK: Allow multiple internal change listeners without overwriting
// the user's .onChange() callback.
// ============================================================================
const origCallOnChange = Controller.prototype._callOnChange;
Controller.prototype._callOnChange = function () {
  origCallOnChange.call(this);
  if (this._internalListeners) {
    const val = this.getValue();
    this._internalListeners.forEach((fn) => fn(val, this));
  }
  // Trigger any .showIf() conditions attached to the root GUI
  const root = this.parent?.root || this.parent;
  if (root && root._evaluateShowIfs) {
    root._evaluateShowIfs();
  }
};

Controller.prototype._addInternalListener = function (fn) {
  if (!this._internalListeners) this._internalListeners = [];
  this._internalListeners.push(fn);
};

// ============================================================================
// 1. DOUBLE-CLICK TO RESET (.resettable())
// ============================================================================
Controller.prototype.resettable = function () {
  this.$name.style.cursor = 'pointer';
  this.$name.title = 'Double-click to reset';

  const resetIcon = document.createElement('span');
  resetIcon.className = 'lil-reset-btn';
  resetIcon.textContent = '↺';
  resetIcon.title = 'Reset to initial value';
  this.$name.appendChild(resetIcon);

  const doReset = (e) => {
    e.stopPropagation();
    this.reset();
  };

  this.$name.addEventListener('dblclick', doReset);
  resetIcon.addEventListener('click', doReset);
  return this;
};

// ============================================================================
// 2. KEYBOARD SHORTCUTS (.hotkey('r'))
// ============================================================================
const hotkeyRegistry = new Map();
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  const ctrl = hotkeyRegistry.get(e.key.toLowerCase());
  if (!ctrl || ctrl._hidden || ctrl._disabled) return;

  const val = ctrl.getValue();
  if (typeof val === 'boolean') {
    ctrl.setValue(!val);
  } else if (typeof val === 'function') {
    val.call(ctrl.object);
  }
});

Controller.prototype.hotkey = function (key) {
  const k = key.toLowerCase();
  hotkeyRegistry.set(k, this);

  const badge = document.createElement('kbd');
  badge.className = 'lil-badge';
  badge.textContent = key.toUpperCase();
  this.$name.appendChild(badge);
  return this;
};

// ============================================================================
// 3. UNIT SUFFIXES (.unit('px'))
// ============================================================================
Controller.prototype.unit = function (unitStr) {
  if (!this.$input) return this;

  const wrapper = document.createElement('div');
  wrapper.className = 'lil-unit-wrapper';

  const label = document.createElement('span');
  label.className = 'lil-unit-label';
  label.textContent = unitStr;

  this.$input.parentNode.insertBefore(wrapper, this.$input);
  wrapper.appendChild(this.$input);
  wrapper.appendChild(label);

  // Add right padding so text doesn't collide with unit label
  const pad = unitStr.length * 7 + 8;
  this.$input.style.paddingRight = `${pad}px`;
  return this;
};

// ============================================================================
// 4. DEBOUNCED ONCHANGE (.onDebounceChange(fn, delay))
// ============================================================================
Controller.prototype.onDebounceChange = function (fn, delay = 300) {
  let timer = null;
  this._addInternalListener((val) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.call(this, val), delay);
  });
  return this;
};

// ============================================================================
// 5. CONDITIONAL VISIBILITY (.showIf(predicateFn))
// ============================================================================
function attachShowIf(target, predicateFn) {
  const root = target.parent?.root || target.parent || target.root;
  if (!root._showIfTargets) {
    root._showIfTargets = [];
    root._evaluateShowIfs = () => {
      root._showIfTargets.forEach(({ item, fn }) => {
        fn() ? item.show() : item.hide();
      });
    };
  }
  root._showIfTargets.push({ item: target, fn: predicateFn });
  // Evaluate initial state
  predicateFn() ? target.show() : target.hide();
  return target;
}

Controller.prototype.showIf = function (predicateFn) {
  return attachShowIf(this, predicateFn);
};

GUI.prototype.showIf = function (predicateFn) {
  return attachShowIf(this, predicateFn);
};

// ============================================================================
// 6. CONTROLLER LOCKING / SYNCING (.syncWith([ctrl2, ctrl3], locked = true))
// ============================================================================
Controller.prototype.syncWith = function (others, lockedByDefault = true) {
  const group = [this, ...(Array.isArray(others) ? others : [others])];
  let isLocked = lockedByDefault;
  let isSyncing = false;

  const icons = [];
  const lastValues = new Map();

  const updateIcons = () => {
    icons.forEach((icon) => {
      icon.classList.toggle('locked', isLocked);
      icon.textContent = isLocked ? '🔗' : '🔓';
      icon.title = isLocked ? 'Synced (Click to unlock)' : 'Unlocked (Click to sync)';
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
      const delta = newVal - oldVal;
      lastValues.set(ctrl, newVal);

      group.forEach((other) => {
        if (other === ctrl) return;
        let nextVal = other.getValue() + delta;
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
GUI.prototype.addSeparator = function () {
  const hr = document.createElement('hr');
  hr.className = 'lil-separator';
  this.$children.appendChild(hr);
  return this;
};

// ============================================================================
// 8. INFO / NOTE BLOCKS (gui.addNote('text'))
// ============================================================================
class NoteController extends Controller {
  constructor(parent, text) {
    super(parent, { note: text }, 'note', 'lil-note');
    this.domElement.textContent = text;
  }
  setText(text) {
    this.domElement.textContent = text;
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
    super(parent, {}, '', 'lil-button-row');
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
      btn.addEventListener('click', () => fn());
      this.$widget.appendChild(btn);
    });
  }
}

GUI.prototype.addButtonRow = function (buttons, label = '') {
  return new ButtonRowController(this, buttons, label);
};

// ============================================================================
// 10. MIN/MAX RANGE SLIDER (gui.addRange(obj, 'minProp', 'maxProp', min, max, step))
// ============================================================================
class RangeController extends Controller {
  constructor(parent, object, minProp, maxProp, min = 0, max = 100, step = 1) {
    super(parent, object, minProp, 'lil-range');
    this.minProp = minProp;
    this.maxProp = maxProp;
    this._min = min;
    this._max = max;
    this._step = step;

    this.initialMin = object[minProp];
    this.initialMax = object[maxProp];

    this.name(`${minProp} / ${maxProp}`);

    // Build DOM
    this.$track = document.createElement('div');
    this.$track.className = 'lil-range-track';

    this.$fill = document.createElement('div');
    this.$fill.className = 'lil-range-fill';

    this.$label = document.createElement('div');
    this.$label.className = 'lil-range-label';

    this.$track.appendChild(this.$fill);
    this.$track.appendChild(this.$label);
    this.$widget.appendChild(this.$track);

    this._setupDrag();
    this.updateDisplay();
  }

  _roundToStep(val) {
    const stepped = Math.round((val - this._min) / this._step) * this._step + this._min;
    const decimals = (this._step.toString().split('.')[1] || '').length;
    return Number(Math.min(this._max, Math.max(this._min, stepped)).toFixed(decimals));
  }

  _setupDrag() {
    let activeHandle = null; // 'min' or 'max'

    const getValueFromPointer = (clientX) => {
      const rect = this.$track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return this._roundToStep(this._min + pct * (this._max - this._min));
    };

    const onPointerMove = (e) => {
      if (!activeHandle) return;
      const val = getValueFromPointer(e.clientX);
      if (activeHandle === 'min') {
        this.object[this.minProp] = Math.min(val, this.object[this.maxProp]);
      } else {
        this.object[this.maxProp] = Math.max(val, this.object[this.minProp]);
      }
      this.updateDisplay();
      this._callOnChange();
    };

    const onPointerUp = () => {
      activeHandle = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      this._callOnFinishChange();
    };

    this.$track.addEventListener('pointerdown', (e) => {
      const clickVal = getValueFromPointer(e.clientX);
      const distMin = Math.abs(clickVal - this.object[this.minProp]);
      const distMax = Math.abs(clickVal - this.object[this.maxProp]);
      activeHandle = distMin <= distMax ? 'min' : 'max';

      onPointerMove(e);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });
  }

  getValue() {
    return [this.object[this.minProp], this.object[this.maxProp]];
  }

  setValue([minVal, maxVal]) {
    this.object[this.minProp] = this._roundToStep(minVal);
    this.object[this.maxProp] = this._roundToStep(maxVal);
    this.updateDisplay();
    this._callOnChange();
    return this;
  }

  reset() {
    return this.setValue([this.initialMin, this.initialMax]);
  }

  updateDisplay() {
    const minVal = this.object[this.minProp];
    const maxVal = this.object[this.maxProp];
    const range = this._max - this._min || 1;
    const leftPct = ((minVal - this._min) / range) * 100;
    const rightPct = ((maxVal - this._min) / range) * 100;

    this.$fill.style.left = `${leftPct}%`;
    this.$fill.style.width = `${Math.max(0, rightPct - leftPct)}%`;
    this.$label.textContent = `${minVal} – ${maxVal}`;
    return this;
  }
}

GUI.prototype.addRange = function (object, minProp, maxProp, min = 0, max = 100, step = 1) {
  return new RangeController(this, object, minProp, maxProp, min, max, step);
};

export { GUI, Controller };
export default GUI;