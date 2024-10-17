namespace("2181robotics.crescendo.Crescendo", {
  "2181robotics.crescendo.CrescendoConstants": "Constants",
  "2181robotics.crescendo.CrescendoInputs": "Inputs"
}, ({ Constants, Inputs }) => {
  const frameRate = 24;
  const frameDelay = 1000 / frameRate;
  const config = {
    moveSpeed: 1,
    rotationSpeed: 6,
  }
  const ring = function([x,y]) {
    return `<use href="#ring" x="${x}" y="${y}"/>`;
  }
  const robot = function({id,color,x,y,r,intakeState}) {
    return `<g transform="translate(${x},${y}) rotate(${r})">
      <rect x="-4" y="-4" width="8" height="8" fill="${color}"/>
      <polygon fill="${Constants.getIntakeStateColor(intakeState)}" points="0 -3 -3 3 3 3"/>
      <title>${id}</title>
    </g>`;
  }
  const keyboardValueMapping = {
    ArrowUp: -1,
    ArrowLeft: -1,
    ShiftLeft: -1,
    Space: true
  }
  const buttonMapping = {
    ArrowUp: "posYDelta",
    ArrowDown: "posYDelta",
    ArrowLeft: "posXDelta",
    ArrowRight: "posXDelta",
    ShiftLeft: "rotationDelta",
    ControlLeft: "rotationDelta",
    Space: "intakeEngaged",

    Lx: "posXDelta",
    Ly: "posYDelta",
    Rx: "rotationDelta",
    Rs: "intakeEngaged"
  };
  const initInputStates = {
    posXDelta: 0,
    posYDelta: 0,
    rotationDelta: 0,
    intakeEngaged: false,
  };
  const Crescendo = function(layerId) {
    const collideXY = function(x, deltaX, y, deltaY) {
      // TODO - detect (and interrupt) collisions
      return { 
        x: x + deltaX, 
        y: y + deltaY 
      };
    };
    this.run = function() {
      const sprites = {
        rings: Constants.getInitRings(),
        robots: Constants.getInitRobots()
      };
      const inputStates = Object.assign({}, initInputStates);
      window.addEventListener("crescendoInputEngaged", ({ detail }) => {
        detail.engageInput(inputStates);
      });
      window.addEventListener("crescendoInputDisengaged", ({ detail }) => {
        detail.disengageInput(inputStates);
      });
      Inputs.init(initInputStates, buttonMapping, keyboardValueMapping, 1);
      const redraw = function() {
        document.getElementById(layerId).innerHTML = sprites.rings.map(ring).concat(sprites.robots.map(robot)).join("");
      }
      redraw();
      setInterval(() => {
        const robot = sprites.robots[0];
        const { x, y } = collideXY(robot.x, config.moveSpeed * inputStates.posXDelta, robot.y, config.moveSpeed * inputStates.posYDelta)
        robot.x = x;
        robot.y = y;
        robot.r += config.rotationSpeed * inputStates.rotationDelta;
        robot.intakeState = inputStates.intakeEngaged?"loading":"empty";
        redraw();
      }, frameDelay)
    }
  };
  return Crescendo;
});