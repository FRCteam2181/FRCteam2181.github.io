namespace("2181robotics.beach-bash.Bounce", {
  "2181robotics.beach-bash.Constants":"Constants"
}, ({ Constants }) => {
  const gravity = 32.174;
  const frameRate = Constants.frameRate();
  const degToRad = function(degrees) {
    return degrees * Math.PI / 180;
  }
  const formula2d = function(launchAngleDegrees, launchVelocityFtPerSec, initHeightFt) {
    const launchAngle = degToRad(launchAngleDegrees);
    // x = t * M
    // y = A * t ^ 2 + B * t + C
    const m = launchVelocityFtPerSec * Math.cos(launchAngle);
    const a = gravity / -2;
    const b = launchVelocityFtPerSec * Math.sin(launchAngle);
    // c = initHeightFt
    return function(timeInSec) {
      return {
        t: timeInSec,
        x: m * timeInSec,
        y: a * timeInSec * timeInSec + b * timeInSec + initHeightFt,
      }
    }
  }
  const formula3d = function(headingDegrees, launchAngleDegrees, launchVelocityFtPerSec, initHeightFt) {
    const heading = degToRad(headingDegrees);
    const launchAngle = degToRad(launchAngleDegrees);
    // z = A * t ^ 2 + B * t + C
    // d = t * M
    // x ^ 2 + y ^ 2 = d ^ 2
    const a = gravity / -2;
    const b = launchVelocityFtPerSec * Math.sin(launchAngle);
    // c = initHeightFt
    const m = launchVelocityFtPerSec * Math.cos(launchAngle);
    const mx = m * Math.cos(heading);
    const my = m * Math.sin(heading);
    return function(timeInSec) {
      return {
        t: timeInSec,
        x: mx * timeInSec,
        y: my * timeInSec,
        z: a * timeInSec * timeInSec + b * timeInSec + initHeightFt
      }
    }
  }
  const calcPath = function(formula, terminatingProperty) {
    const calc = ((f) => Object.assign({f},formula(f/frameRate)));
    let frames = [calc(0), calc(1)];
    const lastFrame = () => frames[frames.length - 1];
    while(lastFrame()[terminatingProperty] > 0) {
      frames.push(calc(frames.length));
    }
    return frames;
  }
  const calcPath2d = function(launchAngle, launchVelocity, initHeight) {
    const formula = formula2d(launchAngle, launchVelocity, initHeight);
    return calcPath(formula, "y");
  }
  const calcPath3d = function(heading, launchAngle, launchVelocity, initHeight) {
    const formula = formula3d(heading - 90, launchAngle, launchVelocity, initHeight);
    return calcPath(formula, "z");
  }
  return { calcPath2d, calcPath3d };
});