namespace("2181robotics.crescendo.GamepadTest", () => {
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
  const standardButtons = "A,B,X,Y,Ls,Rs,Select,Start,L3,R3,DPadUp,DPadDown,DPadLeft,DPadRight,Menu,red1,yellow1,green1,blue1,red2,yellow2,green2,blue2,coin,player1".split(",");
  const joystickDirections = {
    "X": ["W","","E"],
    "Y": ["N","","S"],
  }
  const allJoystickDirections = joystickDirections.Y.reduce((outval, x) => {
    return outval.concat(joystickDirections.X.map(y => x + y));
  }, []).filter(d => d.length > 0);
  const buttonColors = {
    red1: "red",
    yellow1: "yellow",
    green1: "green",
    blue1: "blue",
    red2: "red",
    yellow2: "yellow",
    green2: "green",
    blue2: "blue",
    B: "red",
    Y: "yellow",
    A: "green",
    X: "blue",    
  }
  const eventTypes = "triggered,changed".split(",");
  const actionTypes = "axis,button".split(",");
  const events = eventTypes.reduce((outVal, eventType) => {
    return outVal.concat(actionTypes.map(actionType => `gamepad${actionType}${eventType}`));
  }, []);
  const dPad = {
    "joystickX": true,
    "joystickY": true,
  };
  const init = function() {
    initGamepad(buttonLabels);
    console.log("init");
    console.log({ events });
    const states = {
    };
    events.forEach((eventName) => {
      window.addEventListener(eventName, ({ detail }) => {
        console.log(Object.assign({ eventName }, detail ));
        var { newValue, label } = detail;
        states[label] = newValue;
      });
    });
    actionTypes.forEach((actionType) => {
      const eventName = `gamepad${actionType}released`;
      window.addEventListener(eventName, ({ detail }) => {
        console.log(Object.assign({ eventName }, detail ));
        var { label } = detail;
        states[label] = 0;
      });
    });
    const getAllAttributes = function(frameElem) {
      return function(retVal, attr) {
        retVal[attr] = parseFloat(frameElem.getAttribute(attr));
        return retVal;
      };
    }
    const updateStick = function(frameId, stickId, xAxis, yAxis) {
      const frame = document.getElementById(frameId);
      const stick = document.getElementById(stickId);
      const frameArgs = ["cx","cy","r"].reduce(getAllAttributes(frame), {});
      const stickRadius = getAllAttributes(stick)({}, "r").r;
      const mapping = {
        "cx": xAxis,
        "cy": yAxis
      };
      const inputs = Object.entries(mapping).reduce((outVal, [arg, axis]) => {
        outVal[arg] = (states[axis] || 0);
        return outVal;
      }, {});
      const range = frameArgs.r - stickRadius;
      Object.entries(inputs).forEach(([arg, value]) => {
        stick.setAttribute(arg, frameArgs[arg] + (range * value));
      });
    };
    const updateTrigger = function(frameId, barId, triggerKey) {
      document.getElementById(barId).setAttribute("width", document.getElementById(frameId).getAttribute("width") * (states[triggerKey] || 0));
    }
    setInterval(() => {
      standardButtons.forEach((button) => {
        const element = document.getElementById(button)
        if (element) {
          element.setAttribute("fill",((states[button] || 0)?(buttonColors[button]||"white"):"none"))
        } else {
          console.log({ msg: "button not found", button });
        }
      });
      const currentJoystickDirection = allJoystickDirections.filter((dir) => {
        const id = `joystick${dir}`;
        const element = document.getElementById(id);
        if (element) {
          return element.getAttribute("fill") != "none";
        } else {
          console.log({ msg: "joystick not found", id });
          return false;
        }
      })[0];
      const joystickDirection = ["Y","X"].map(d => {
        return joystickDirections[d][(states[`joystick${d}`] || 0) + 1];
      }).join("");
      if (joystickDirection.length > 0) {
        const element = document.getElementById("joystick" + joystickDirection);
        if (element) {
          element.setAttribute("fill","white");
        } else {
          console.log({ msg: "joystick not found", joystickDirection });
        }
      }
      if (currentJoystickDirection != undefined && currentJoystickDirection != joystickDirection) {
        const element = document.getElementById("joystick" + currentJoystickDirection);
        if (element) {
          element.setAttribute("fill","none");
        } else {
          console.log({ msg: "joystick not found", currentJoystickDirection });
        }
      }
      updateStick("frameL", "stickL", "Lx", "Ly");
      updateStick("frameR", "stickR", "Rx", "Ry");
      updateTrigger("LtFrame", "LtBar", "Lt");
      updateTrigger("RtFrame", "RtBar", "Rt");
    }, 42);
  }
  return { init };
});