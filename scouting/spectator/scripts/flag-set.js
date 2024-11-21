namespace("frc2181.scouting.spectator.FlagSet", {}, () => {
  const encodeIndicies = function(indicies){
    const maxIndex = indicies.reduce((max,index) => Math.max(max, index), 0);
    return parseInt(indicies.reduce((outval, index) => {
      outval[index] = "1";
      return outval;
    }, Array(maxIndex + 1).fill("0")).reverse().join(""), 2);
  }
  const decodeIndicies = function(value) {
    return value.toString(2).split("").reverse().map((v,i) => [v,i]).filter(([v]) => v === "1").map(([_,i]) => i);
  }
  const encode = function(options, allSelected) {
    return encodeIndicies(allSelected.map(selected => options.indexOf(selected)));
  }
  const decode = function(options, value) {
    return decodeIndicies(value).map(i => options[i]);
  }
  return { encode, decode, encodeIndicies, decodeIndicies };
});
