namespace("2181robotics.beach-bash.Robot", {
  "2181robotics.beach-bash.Constants": "Constants",
  "2181robotics.beach-bash.GridMath": "GridMath"
}, ({ Constants, GridMath }) => {
  const wheelBaseDegreesPerFeet = 360 / (Math.sqrt(2 * 16 * 16) * 2 * Math.PI);
  const numbers = { "1": "One", "2": "Two" };
  const intakeStates = {
    empty: "white",
    intakeOn: "yellow",
    loading: "url(#loading)",
    ready: "green",
    resetting: "black"
  };
  const draw = function(color, number, { x, y, r, intakeState }) {
    return `<g transform="translate(${x},${y}) rotate(${r})">
      <rect x="-18" y="-18" width="36" height="36" fill="${color}" stroke="black"/>
      <polygon points="0 -14 14 14 -14 14" fill="${intakeStates[intakeState]}"/>
      <use href="#mark${numbers[number]}" stroke="${color}"/>
    </g>`;
  };
  const Robot = function(color, number, x, y, initConfig, bounds, obstacles) {
    const id = color + numbers[number];
    const state = { x, y, r:0, intakeState: "empty" };
    const delta = { x: 0, y: 0, r: 0 };
    const config = Object.assign({}, initConfig);
    const getPoly = (() => "ABCD".split("").reduce((acc,c,i) => {
      const radians = (state.r + 45 + i * 90) * Math.PI / 180;
      acc[c] = [ Math.cos(radians), Math.sin(radians) ];
      return acc;
    }, {}));
    this.getId = (() => id);
    this.draw = function() {
      document.getElementById(id).innerHTML = draw(color, number, state);
    };
    this.applyDelta = function(k,v) {
      if (k in delta) {
        delta[k] = v;
      }
    };
    const buildRobotMoveDetail = () => Object.assign({
      id,
      launchHeight: config.initHeight,
      delta: Object.assign({}, delta),
      poly: getPoly(),
      isLoadable: ({ x, y, z }) => {
        if (state.intakeState !== "intakeOn") {
          return false;
        }
        if (z !== 6) {
          return false;
        }
        return GridMath.distance(state.x, state.y, x, y) < 6;
      },
      isLoaded: (ballId) => {
        if(!state.loadedBall) {
          return false;
        }
        return state.loadedBall.getId() === ballId;
      },
      loadBall: (ball) => {
        state.loadedBall = ball;
        state.intakeState = "loading";
        setTimeout(() => {
          state.intakeState = "ready";
        }, config.intakeDelay);
      }
    }, state);
    this.move = function() {
      state.x += delta.x * config.moveSpeed * 12 / Constants.frameRate();
      state.y += delta.y * config.moveSpeed * 12 / Constants.frameRate();
      state.r += delta.r * config.moveSpeed * 12 * wheelBaseDegreesPerFeet / Constants.frameRate();
      window.dispatchEvent(new CustomEvent("robotMove", {
        detail: buildRobotMoveDetail()
      }));
    };
    this.reconfigure = function(newConfig) {
      Object.assign(config, newConfig);
    };
    this.setIntakeState = function(newIntakeState) {
      if (!(newIntakeState in intakeStates)) {
        throw `Invalid intake state: ${newIntakeState}`;
      }
      state.intakeState = newIntakeState;
    };
    this.launch = function() {
      if (state.intakeState === "ready" && state.loadedBall) {
        state.loadedBall.launch(state.r, config.launchAngle, config.launchVelocity, 18/12);
        delete state.loadedBall;
        state.intakeState = "resetting";
        setTimeout(() => {
          state.intakeState = "empty";
        }, config.timeToReset);
      }
    }
    window.addEventListener("ballMove", ({ detail }) => {
      if (!state.loadedBall || state.loadedBall.id !== detail.id) {
        detail.interactWithRobot(buildRobotMoveDetail());
      }
    });
  };
  Robot.getIntakeStates = () => Object.keys(intakeStates);
  return Robot;
});
