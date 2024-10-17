namespace("2181robotics.beach-bash.Utilities", () => {
  const identity = ((n) => n);
  const feetPerSecToInchesPerFrame = function(frameRate, feetPerSecond) {
    return feetPerSecond * 12 / frameRate;
  }
  const feetPerSecSqToInchesPerFrameSq = function(frameRate, feetPerSecond) {
    return feetPerSecond * 12 / Math.pow(frameRate,2);
  }
  return { identity, feetPerSecToInchesPerFrame };
});