namespace("2181robotics.beach-bash.BeachBall", {
  "2181robotics.beach-bash.Bounce": "Bounce",
  "2181robotics.beach-bash.Constants": "Constants"
}, ({ Bounce, Constants, GridMath }) => {
  const draw = function(x,y,z,color) {
    return `<circle cx="${x}" cy="${y}" r="${5.5 + z / 12}" fill="url(#${color}BallGrad)" stroke="black"/>`;
  }
  const BeachBall = function(color, index, x, y, bounds, obstacles) {
    const me = this;
    const id = `${color}Ball${index}`
    const state = {
      x, y, z: 6
    };
    const trajectory = [];
    me.getId = () => id;
    me.draw = function() {
      document.getElementById(id).innerHTML = draw(state.x, state.y, state.z, color);
    };
    me.getXYZ = (() => [ state.x, state.y, state.z ]);
    me.getColor = (() => color);
    me.launch = function(headingDegrees, launchAngleDegrees, launchVelocityFtPerSec, initHeightFt) {
      trajectory.splice(0, trajectory.length);
      Bounce.calcPath3d(headingDegrees, launchAngleDegrees, launchVelocityFtPerSec, initHeightFt).forEach(({ f, t, x, y, z }) => {
        trajectory.push({ f, t, 
          z: z * 12, 
          x: x * 12 + state.x, 
          y: y * 12 + state.y
        });
      });
    };
    me.land = () => {
      trajectory.splice(0, trajectory.length);
    };
    me.move = () => {
      const previous = Object.assign({}, state);
      const { x, y, z } = trajectory.shift();
      Object.assign(state, { x, y, z });
      window.dispatchEvent(new CustomEvent("ballMove", {
        detail: {
          id,
          previous,
          current: Object.assign({}, state),
          interactWithRobot,
        }
      }));
    };
    me.isMoving = () => trajectory.length > 0;
    window.addEventListener("ballMove",({ detail }) => {
      if (detail.id !== id) {
        const other = detail.current;
        const distance = Math.sqrt(["x","y","z"].reduce((sum,dim) => sum + Math.pow(Math.abs(state[dim]-other[dim]),2)));
        if (distance <= 2 * Constants.beachBallRadius) {
          // interact
        }
      }
    });
    const interactWithRobot = (robotDetail) => {
      if (GridMath.isBallWithinBoundsOfRobot(robotDetail.poly,Object.assign({}, state))) {
        // is robot moving? -> how does it affect ball trajectory?
        if (me.isMoving()) {
          // ball also in motion -> update trajectory
        } else {
          // ball not in motion
          // is robot moving towards ball?
        }
      }
    }
    window.addEventListener("robotMove",({ detail }) => {
      if (detail.isLoaded(id)) {
        state.x = detail.x;
        state.y = detail.y;
        state.z = detail.launchHeight;
      } else if (detail.isLoadable(Object.assign({}, state))) {
        detail.loadBall(me);
      } else {
        interactWithRobot(detail);
      }
    });
  };
  return BeachBall;
});