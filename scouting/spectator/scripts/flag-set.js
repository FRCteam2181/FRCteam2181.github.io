namespace("frc2181.scouting.spectator.FlagSet", {}, () => {
  const encode = function(options, allSelected) {
    return parseInt(allSelected.reduce((outval, selected) => {
      outval[options.indexOf(selected)] = "1";
      return outval;
    }, Array(options.length).fill("0")).reverse().join(""), 2);
  }
  const decode = function(options, value) {
    return value.toString(2).split("").reverse().map((v,i) => [v,i]).filter(([v]) => v === "1").map(([_,i]) => options[i]);
  }
  return { encode, decode };
});
