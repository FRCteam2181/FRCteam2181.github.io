(function(){
  const DEFAULT_AXIS_THRESHOLD = 0.03;
  const gamepads = {};
  const significantDigit = 2;
  const round = function(a) {
    const sigUpDown = Math.pow(10, significantDigit);
    return Math.round(a*sigUpDown)/sigUpDown;
  }
  const dispatcher = function(buttonLabels, state, gamepadType, gamepadIndex, inputType, getter) {
    return function(item, index) {
      const newValue = getter(item, index);
      const oldValue = state[index];
      const label = buttonLabels[index] || `${inputType}-${index}`;
      if (oldValue != newValue) {
        if (!newValue) {
          window.dispatchEvent(new CustomEvent(`gamepadreleased`,{ detail: { gamepadIndex, gamepadType, inputType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${inputType}released`,{ detail: { gamepadIndex, gamepadType, inputType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}released`, { detail: { gamepadType, inputType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}${label}released`, { detail: { gamepadType, inputType }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}${index}released`, { detail: { gamepadType, inputType }}));
        } else if (!oldValue) {
          window.dispatchEvent(new CustomEvent(`gamepadtriggered`,{ detail: { gamepadIndex, gamepadType, inputType, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${inputType}triggered`,{ detail: { gamepadIndex, gamepadType, inputType, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}triggered`, { detail: { gamepadType, inputType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}${label}triggered`,{ detail: { gamepadType, inputType, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}${index}triggered`,{ detail: { gamepadType, inputType, newValue }}));
        } else {
          window.dispatchEvent(new CustomEvent(`gamepadchanged`,{ detail: { gamepadIndex, gamepadType, inputType, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${inputType}changed`,{ detail: { gamepadIndex, gamepadType, inputType, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}changed`, { detail: { gamepadType, inputType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}${label}changed`,{ detail: { gamepadType, inputType, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${inputType}${index}changed`,{ detail: { gamepadType, inputType, newValue }}));
        }
        state[index] = newValue;
      }
    };
  }
  const pollGamepad = function(buttonLabels, state, { id, axes, buttons, timestamp }, gamepadIndex, axisThreshold) {
    if (timestamp > state.timestamp) {
      state.timestamp = timestamp;
      buttonLabels = buttonLabels || { axes: [], buttons: [] };
      axes.forEach(dispatcher(buttonLabels.axes, state.axes, id, gamepadIndex, "axis", (a,i) => {
        const newValue = round(a);
        return (Math.abs(newValue - state.axesNeutral[i]) > axisThreshold)?newValue:undefined;
      }));
      buttons.forEach(dispatcher(buttonLabels.buttons, state.buttons, id, gamepadIndex, "button", (b) => (b.pressed || b.touched)?b.value:undefined));
    }
  }
  const clearGamepad = function(index) {
    clearInterval(gamepads[index]);
    delete gamepads[index];
  }
  window.initGamepad = function(buttonLabels, opts) {
    let { axisThreshold, throwWhenGamepadNotFound } = opts || {};
    axisThreshold = isNaN(axisThreshold)?DEFAULT_AXIS_THRESHOLD:axisThreshold;
    buttonLabels = buttonLabels || {};
    window.addEventListener("gamepaddisconnected", (e) => {
      clearGamepad(e.gamepad.index);
    });
    window.addEventListener("gamepadconnected", (e) => {
      console.log({ event: "gampepadconnected", e})
      const state = { axes: [], buttons: [], axesNeutral: e.gamepad.axes.map(round), timestamp: e.gamepad.timestamp };
      gamepads[e.gamepad.index] = {
        state,
        interval: setInterval(() => {
          const gamepad = navigator.getGamepads()[e.gamepad.index];
          if (gamepad) {
            const labels = buttonLabels[gamepad.id];
            if (labels || !throwWhenGamepadNotFound) {
              pollGamepad(labels, state, gamepad, e.gamepad.index, axisThreshold);
            } else {
              throw {
                errorMessage: "Not configured for gamepad",
                type: gamepad.id,
                axesCount: gamepad.axes.length,
                buttonCount: gamepad.buttons.length
              };
            }
          } else {
            clearGamepad(e.gamepad.index);
          }
        },10)
      };
      window.dispatchEvent(new CustomEvent("initGamepad", { detail: { gamepad: navigator.getGamepads()[e.gamepad.index] }}));
    });
  }
})()