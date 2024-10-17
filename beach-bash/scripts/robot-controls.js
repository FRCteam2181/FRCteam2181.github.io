namespace("2181robotics.beach-bash.RobotControls",{

}, () => {
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
  const applyAction = function(action, detail, robots) {
    // get robot for controller
    // get property for button/axis
    // triggered: set to received or default value
    // released: set to neutral value
  }
  const trigger = function(detail, robots) {
    applyAction("trigger", detail, robots);
  }
  const release = function(detail, robots) {
    applyAction("release", detail, robots);
  }
  return { trigger, release, buttonLabels: () => buttonLabels };
});