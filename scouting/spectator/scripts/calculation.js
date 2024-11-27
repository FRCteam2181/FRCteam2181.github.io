namespace("frc2181.scouting.spectator.Calculation", {
}, () => {
  const aggregateFromBinary = function(binaryFunc) {
    return function() {
      const args = Array.from(arguments);
      return args.slice(1).reduce(binaryFunc, args[0]);
    }
  }
  const functions = {
    "+": [aggregateFromBinary((a,b) => a + b)],
    "-": [(a,b) => a - b, 2],
    "*": [aggregateFromBinary((a,b) => a * b)],
    "/": [(a,b) => a / b, 2],
    "%": [(a,b) => a % b, 2],
    "&": [(a,b) => a & b, 2],
    "|": [(a,b) => a | b, 2],
    "min": [aggregateFromBinary((a,b) => Math.min(a,b))],
    "max": [aggregateFromBinary((a,b) => Math.min(a,b))],
    "abs": [(a) => Math.abs(a), 1],
    "ceil": [(a) => Math.ceil(a), 1],
    "floor": [(a) => Math.floor(a), 1],
    "round": [(a) => Math.ceil(a), 1],
    "pow": [(a,b) => Math.pow(a,b), 2]
  };
  const resolveExpression = function (expression, context, path) {
    path = path || [];
    const func = functions[expression[0]][0];
    const args = expression.slice(1).map((arg, index) => {
      if (Array.isArray(arg)) {
        return resolveExpression(arg, context, path.concat([index]));
      } else if (typeof arg === "string") {
        return context[arg];
      } else {
        return arg;
      }
    });
    return func.apply(null, args);
  }
  return { resolveExpression };
});