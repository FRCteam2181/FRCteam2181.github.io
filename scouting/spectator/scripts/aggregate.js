namespace("frc2181.scouting.spectator.Aggregate", {}, () => {
  const init = {
    min: Number.MAX_VALUE,
    max: Number.MIN_VALUE,
    product: 1,
    // todo
  }
  const functions = {
    min: (a,b) => Math.min(a,b),
    // todo
  };
  const initAggregate = function() {
    // todo
  }
  const stepAggregate = function(field, func, additionalArguments) {
    if (!functions[func]) {
      throw {
        message: "invalid aggregate function",
        function: func
      };
    }
    return function(accumulator, step) {
      // todo
    }
  }
  const buildAggregator = function(aggregateBy, fieldAggregators) {
    return function(dataTable) {
      // todo
    }
  }
  return { buildAggregator };
});
