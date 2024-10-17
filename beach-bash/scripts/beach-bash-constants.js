namespace("2181robotics.beach-bash.Constants", () => {
  const constants = {
    frameRate: 24,
    beachBallRadius: 6,
    robotHeight: 12
  };
  return Object.entries(constants).reduce((outVal, [k, v]) => {
    outVal[k] = () => v;
    return outVal;
  }, {});
});