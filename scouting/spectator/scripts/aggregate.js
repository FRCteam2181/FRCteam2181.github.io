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
    median: (dataArray) => dataArray[Math.round(dataArray.length/2)],
    mode: (dataArray) => {
      const counts = dataArray.reduce((acc,elem) => {
        acc[elem] = (acc[elem] || 1) + 1;
        return acc;
      }, {});
      const maxCount = max(Object.values(counts));
      return max(Object.entries(counts).filter(([_,v]) => v === maxCount).map(([k,_]) => k));
    },
    countTrue: (dataArray) => dataArray.filter(i => i).length,
    countFalse: (dataArray) => dataArray.filter(i => !i).length,
    countIf: (dataArray, compareValue) => dataArray.filter(i => i === compareValue).length,
    countIfNot: (dataArray, compareValue) => dataArray.filter(i => i !== compareValue).length,
    union,
    intersection,
    minCount: (dataArray) => min(dataArray.map(elem => FlagSet.decodeIndicies(elem).length)),
    maxCount: (dataArray) => max(dataArray.map(elem => FlagSet.decodeIndicies(elem).length)),
    unionCount: (dataArray) => FlagSet.decodeIndicies(union(dataArray)).length,
    intersectionCount: (dataArray) => FlagSet.decodeIndicies(intersection(dataArray)).length
  };
  const buildAggregator = function(aggregateBy, fieldAggregators) {
    console.log({aggregateBy, fieldAggregators})
    return function(dataTable) {
      const groups = Object.groupBy(dataTable, row => row[aggregateBy]);
      return Object.entries(groups).map(([grouper, rows]) => {
        return fieldAggregators.reduce((acc, agg) => {
          console.log(agg);
          const { fieldCode, code, aggFunction, additionalArguments } = agg;
          return Object.assign(acc, Object.fromEntries([[code, functions[aggFunction].apply(null, [rows.map(row => row[fieldCode])].concat(additionalArguments || []))]]));
        }, Object.fromEntries([[aggregateBy, grouper]]));
      });
    }
  }
  return { buildAggregator };
});
