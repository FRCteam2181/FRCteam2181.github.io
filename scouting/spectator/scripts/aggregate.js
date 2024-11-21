namespace("frc2181.scouting.spectator.Aggregate", {
  "frc2181.scouting.spectator.FlagSet": "FlagSet"
}, ({ FlagSet }) => {
  const binaryReducer = (opFunc) => (dataArray) => dataArray.slice(1).reduce((acc, elem) => opFunc(acc, elem), dataArray[0]);
  const sum = binaryReducer((a,b) => a + b);
  const min = binaryReducer(Math.min);
  const max = binaryReducer(Math.max);
  const union = binaryReducer((a,b) => a | b);
  const intersection = binaryReducer((a,b) => a & b);
  const functions = {
    min,
    max,
    sum,
    product: binaryReducer((a,b) => a * b),
    mean: (dataArray) => Math.round(sum(dataArray)/dataArray.length),
    median: (dataArray) => dataArray[Math.round(dataArray/2)],
    mode: (dataArray) => {
      const counts = dataArray.reduce((acc,elem) => {
        acc[elem] = (acc[elem] || 1) + 1;
        return acc;
      }, {});
      const maxCount = max(Object.values(counts));
      return max(Object.entries(counts).filter(([_,v]) => v === maxCount).map(([k,_]) => k));
    },
    countTrue: (dataArray) => dataArray.filter(i => i),
    countFalse: (dataArray) => dataArray.filter(i => !i),
    countIf: (dataArray, compareValue) => dataArray.filter(i => i === compareValue),
    countIfNot: (dataArray, compareValue) => dataArray.filter(i => i !== compareValue),
    union,
    intersection,
    minCount: (dataArray) => min(dataArray.map(elem => FlagSet.decodeIndicies(elem).length)),
    maxCount: (dataArray) => max(dataArray.map(elem => FlagSet.decodeIndicies(elem).length)),
    unionCount: (dataArray) => FlagSet.decodeIndicies(union(dataArray)),
    intersectionCount: (dataArray) => FlagSet.decodeIndicies(intersection(dataArray))
  };
  const buildAggregator = function(aggregateBy, fieldAggregators) {
    return function(dataTable) {
      const groups = Object.groupBy(dataTable, row => row[aggregateBy]);
      return Object.entries(groups).map(([grouper, rows]) => {
        return fieldAggregators.reduce((acc, { fieldCode, code, aggFunction, additionalArguments }) => {
          return Object.defineProperty(acc, code, aggFunction.apply(null, [rows.map(row => row[fieldCode])].concat(additionalArguments || [])));
        }, Object.defineProperty({}, aggregateBy, grouper));
      });
    }
  }
  return { buildAggregator };
});
