namespace("2181robotics.crescendo.KeyLogger", () => {
  return function() {
    const keyLogger = {};
    document.addEventListener("keyhold",({detail}) => {
      keyLogger[detail.code] = true;
    });
    document.addEventListener("keyrelease",({detail}) => {
      delete keyLogger[detail.code];
    });
    return function() {
      return Object.keys(keyLogger);
    }
  }
})