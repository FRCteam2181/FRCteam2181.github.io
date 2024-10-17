namespace("2181robotics.beach-bash.BeachBash", {
  "2181robotics.beach-bash.BeachBall": "BeachBall",
  "2181robotics.beach-bash.BeachBashInputs": "BeachBashInputs",
  "2181robotics.beach-bash.Constants": "Constants",
  "2181robotics.beach-bash.DigitalDisplay": "DigitalDisplay",
  "2181robotics.beach-bash.Robot": "Robot",
  "2181robotics.beach-bash.RobotControls": "RobotControls",
  "2181robotics.beach-bash.Utilities": "Utilities",
}, ({ BeachBall, BeachBashInputs, Constants, DigitalDisplay, Robot, RobotControls, Utilities }) => {
  const border = [ 0.5, 30, 359, 324 ];
  const obstacles = [
    [154.5, 30, 51, 31.5],
    [154.5, 322.5, 51, 31.5],
    [168, 174, 24, 36]
  ];
  const digitalDisplays = {
    timer: { initValue: 150, digitCount: 3 },
    red1score: { initValue: 0, digitCount: 2 },
    red2score: { initValue: 0, digitCount: 2 },
    blue1score: { initValue: 0, digitCount: 2 },
    blue2score: { initValue: 0, digitCount: 2 }
  };
  const ballInit = {
    red: [[36.5, 40], [236.5, 40], [162, 100], [198, 247]],
    blue: [[123.5, 40], [323.5, 40], [198, 137], [162, 284]]
  }
  const robotInitLoc = {
    "red-1": [49, 111],
    "red-2": [312, 273],
    "blue-1": [312, 111],
    "blue-2": [49, 273]
  }
  const initConfig = {
    launchAngle: 60,
    launchVelocity: 80,
    initHeight: 18,
    moveSpeed: 10.5,
    intakeDelay: 500,
    timeToReset: 500,
  }
  return function() {
    const state = {};
    this.init = function() {
      BeachBashInputs.init(RobotControls.buttonLabels());
      window.addEventListener("beachBashInputEngaged",({ detail }) => {
        console.log(detail);
      });
      window.addEventListener("beachBashInputDisengaged",({ detail }) => {
        console.log(detail);
      });
      Object.entries(initConfig).forEach(([id, value]) => {
        const elem = document.getElementById(id);
        if (elem) {
          elem.value = value;
        }
      });
      state.digitalDisplays = Object.entries(digitalDisplays).reduce((acc,[id, { initValue, digitCount }]) => {
        acc[id] = new DigitalDisplay(id, digitCount);
        acc[id].update(initValue);
        return acc;
      }, {});
      state.balls = Object.entries(ballInit).reduce((acc, [color, points]) => {
        return acc.concat(points.map(([x,y],i) => {
          return new BeachBall(color, i, x, y, border, obstacles);
        }));
      }, []);
      state.robots = Object.entries(robotInitLoc).reduce((acc, [key, [x, y]]) => {
        const [color, number] = key.split("-");
        const robot = new Robot(color, number, x, y, initConfig, border, obstacles);
        acc[robot.getId()] = robot;
        return acc;
      }, {});
      state.robotIndex = Object.keys(state.robots);
      state.sharkBalls = [];
      window.addEventListener("beachBashInputEngaged",({ detail }) => {
        RobotControls.trigger(detail, state.robots);
      });
      window.addEventListener("beachBashInputDisengaged",({ detail }) => {
        RobotControls.releasel(detail, state.robots);
      });
      setInterval(() => {
        Object.values(state.robots).forEach(robot => robot.draw());
        state.balls.forEach(ball => ball.draw());
        Object.values(state.robots).forEach(robot => robot.move());
        state.balls.forEach(ball => ball.move());
      }, 1000 / Constants.frameRate());
    }
    this.config = function(e) {
      const newConfig = {};
      newConfig[e.target.id] = parseFloat(e.target.value);
      Object.values(state.robots).forEach(robot => robot.reconfigure(newConfig));
    }
  }
});