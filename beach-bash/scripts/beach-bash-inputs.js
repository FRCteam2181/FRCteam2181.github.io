namespace("2181robotics.beach-bash.BeachBashInputs", () => {
  const eventTypes = "triggered,changed".split(",");
  const actionTypes = "axis,button".split(",");
  const events = eventTypes.reduce((outVal, eventType) => {
    return outVal.concat(actionTypes.map(actionType => `gamepad${actionType}${eventType}`));
  }, []);
  const init = function(buttonLabels) {
    initGamepad(buttonLabels);
    events.forEach((eventName) => {
      window.addEventListener(eventName, ({ detail }) => {
        var { gamepadIndex, gamepadType, newValue, label, index } = detail;
        window.dispatchEvent(new CustomEvent("beachBashInputEngaged", { 
          detail: {  
            source: `gamepad${gamepadIndex}`,
            sourceType: gamepadType,
            action: label || index,
            value: newValue
          } 
        }));
      });
    });
    document.addEventListener("keyhold",({ detail }) => {
      window.dispatchEvent(new CustomEvent("beachBashInputEngaged", { 
        detail: { 
          source: "keyboard",
          sourceType: "keyboard",
          action: detail.code
        } 
      }))
    })
    actionTypes.forEach((actionType) => {
      const eventName = `gamepad${actionType}released`;
      window.addEventListener(eventName, ({ detail }) => {
        var { gamepadIndex, gamepadType, label, index } = detail;
        window.dispatchEvent(new CustomEvent("beachBashInputDisengaged", { 
          detail: {
            source: `gamepad${gamepadIndex}`,
            sourceType: gamepadType,
            action: label || index,
          }
        }))
      });
    });
    document.addEventListener("keyrelease",({ detail }) => {
      window.dispatchEvent(new CustomEvent("beachBashInputDisengaged", { 
        detail: {  
          source: "keyboard",
          sourceType: "keyboard",
          action: detail.code
        } 
      }));
    });
  }
  return { init };
});