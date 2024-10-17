namespace("2181robotics.crescendo.MyGamepads", () => {
  const buttonLabels = {
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
  const eventTypes = "triggered,changed".split(",");
  const actionTypes = "axis,button".split(",");
  const events = eventTypes.reduce((outVal, eventType) => {
    return outVal.concat(actionTypes.map(actionType => `gamepad${actionType}${eventType}`));
  }, []);
  const MyGamepads = function() {
    const states = {};
    events.forEach((eventName) => {
      window.addEventListener(eventName, ({ detail }) => {
        var { newValue, label } = detail;
        states[label] = newValue;
      });
    });
    actionTypes.forEach((actionType) => {
      const eventName = `gamepad${actionType}released`;
      window.addEventListener(eventName, ({ detail }) => {
        var { label } = detail;
        states[label] = 0;
      });
    });
    const get = function(key) {
      return states[key] || 0;
    }
    this.get = get;
    this.getSome = function(keys) {
      return keys.reduce((outval, key) => {
        outval[key] = get(key);
        return outval;
      }, {});
    }
  }
  MyGamepads.getStandardButtons = () => Array.from(standardButtons);
  return MyGamepads;
});