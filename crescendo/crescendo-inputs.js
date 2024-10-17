namespace("2181robotics.crescendo.CrescendoInputs", () => {
  const buttonLabels = {
    "Logitech Gamepad F310 (STANDARD GAMEPAD Vendor: 046d Product: c21d)":{
      axes: "Lx,Ly,Rx,Ry".split(","),
      buttons: "A,B,X,Y,Ls,Rs,Lt,Rt,Select,Start,L3,R3,DPadUp,DPadDown,DPadLeft,DPadRight,Menu".split(",")
    },
    "Xbox 360 Controller (XInput STANDARD GAMEPAD)": {
      axes: "Lx,Ly,Rx,Ry".split(","),
      buttons: "A,B,X,Y,Ls,Rs,Lt,Rt,Select,Start,L3,R3,DPadUp,DPadDown,DPadLeft,DPadRight,Menu".split(",")
    },
    "Generic   USB  Joystick   (Vendor: 0079 Product: 0006)": {
      axes: ["joystickX", "joystickY"],
      buttons: "red1,yellow1,green1,blue1,red2,yellow2,green2,blue2,coin,player1".split(",")
    }
  };
  const eventTypes = "triggered,changed".split(",");
  const actionTypes = "axis,button".split(",");
  const events = eventTypes.reduce((outVal, eventType) => {
    return outVal.concat(actionTypes.map(actionType => `gamepad${actionType}${eventType}`));
  }, []);
  const init = function(initStates, actionMapping, keyboardValueMapping, defaultKeyboardValue) {
    initGamepad(buttonLabels);
    events.forEach((eventName) => {
      window.addEventListener(eventName, ({ detail }) => {
        var { newValue, label } = detail;
        window.dispatchEvent(new CustomEvent("crescendoInputEngaged", { 
          detail: {  
            engageInput: function(states) {
              const action = actionMapping[label];
              if (action) {
                states[action] = newValue;
              }
            }
          } 
        }));
      });
    });
    document.addEventListener("keyhold",({ detail }) => {
      window.dispatchEvent(new CustomEvent("crescendoInputEngaged", { 
        detail: {  
          engageInput: function(states) {
            const action = actionMapping[detail.code];
            if (action) {
              detail.preventDefault();
              states[action] = keyboardValueMapping[detail.code] || defaultKeyboardValue;
            }
          }
        } 
      }))
    })
    actionTypes.forEach((actionType) => {
      const eventName = `gamepad${actionType}released`;
      window.addEventListener(eventName, ({ detail }) => {
        var { label } = detail;
        window.dispatchEvent(new CustomEvent("crescendoInputDisengaged", { 
          detail: {
            disengageInput: function(states) {
              const action = actionMapping[label];
              if (action) {
                states[action] = initStates[action];
              }
            }
          }
        }))
      });
    });
    document.addEventListener("keyrelease",({ detail }) => {
      window.dispatchEvent(new CustomEvent("crescendoInputDisengaged", { 
        detail: {  
          disengageInput: function(states) {
            const action = actionMapping[detail.code];
            if (action) {
              detail.preventDefault();
              states[action] = initStates[action];
            }
          }
        } 
      }));
    });
  }
  return { init };
});